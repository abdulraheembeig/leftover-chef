/* =========================================================================
 * Leftover Chef — ENGINE
 * Pure logic: matching, match %, zero-waste score, quick filters, modes and
 * the twist pipeline. No DOM code, so it runs in Node (tests/engine.test.js).
 * ========================================================================= */
var LC = (window.LC = window.LC || {});

(function () {
  var Data = LC.Data;
  var ING = {};
  Data.INGREDIENTS.forEach(function (i) { ING[i.id] = i; });

  var CONFIG = {
    maxMissing: 3,      // a recipe can ask you to buy at most this many things
    rescuePoints: 70,   // share of score for using up YOUR leftovers
    completePoints: 30, // share of score for needing nothing extra
  };

  var DEFAULT_FILTERS = { diet: "any", maxTime: 0, meal: "all", equipment: { stove: true, blender: true } };

  function name(id) { return ING[id] ? ING[id].name : id; }
  function shelf(id) { return ING[id] ? ING[id].shelf : 1; }
  function listNames(ids) {
    var n = ids.map(name);
    if (n.length <= 1) return n.join("");
    return n.slice(0, -1).join(", ") + " and " + n[n.length - 1];
  }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  /* ---- Score + match -----------------------------------------------------
   * Zero-waste score (0-100):
   *   Rescue   (70): share of your ticked leftovers this recipe uses,
   *                  weighted by how fast each spoils (3x / 2x / 1x).
   *   Complete (30): share of the recipe's main items you already have.
   * Match %: main items you have / main items in the recipe.
   * -------------------------------------------------------------------- */
  function evaluate(recipe, selected) {
    var sel = new Set(selected);
    var mainIds = recipe.uses.map(function (u) { return u[0]; });
    var optIds = recipe.optional.map(function (u) { return u[0]; });
    var all = new Set(mainIds.concat(optIds));

    var used = selected.filter(function (id) { return all.has(id); });
    var unused = selected.filter(function (id) { return !all.has(id); });
    var missing = mainIds.filter(function (id) { return !sel.has(id); });

    var totalW = selected.reduce(function (s, id) { return s + shelf(id); }, 0);
    var usedW = used.reduce(function (s, id) { return s + shelf(id); }, 0);
    var have = mainIds.length - missing.length;

    var rescuePts = Math.round(CONFIG.rescuePoints * (totalW ? usedW / totalW : 0));
    var completePts = Math.round(CONFIG.completePoints * (have / mainIds.length));

    return {
      recipe: recipe,
      used: used,
      unused: unused,
      missing: missing,
      perishablesUsed: used.filter(function (id) { return shelf(id) === 3; }),
      matchPct: Math.round((have / mainIds.length) * 100),
      score: rescuePts + completePts,
      breakdown: {
        rescuePts: rescuePts, completePts: completePts,
        usedCount: used.length, selectedCount: selected.length,
        have: have, needed: mainIds.length,
      },
      badges: [],
    };
  }

  function tier(score) {
    if (score >= 80) return { id: "hero", label: "Zero-waste hero" };
    if (score >= 50) return { id: "good", label: "Good save" };
    return { id: "partial", label: "Partial save" };
  }

  function matchLabel(e) {
    var n = e.missing.length;
    return e.matchPct + "% match" + (n ? " · " + n + (n === 1 ? " item" : " items") + " missing" : "");
  }

  /* ---- Quick filters ---------------------------------------------------- */
  function passesFilters(recipe, f) {
    if (f.diet === "veg" && !recipe.veg) return false;
    if (f.diet === "nonveg" && recipe.veg) return false;
    if (f.maxTime && recipe.time > f.maxTime) return false;
    if (f.meal !== "all" && recipe.meals.indexOf(f.meal) === -1) return false;
    for (var i = 0; i < recipe.equipment.length; i++) {
      if (!f.equipment[recipe.equipment[i]]) return false;
    }
    return true;
  }
  function describeFilters(f) {
    var out = [];
    if (f.diet === "veg") out.push("Vegetarian");
    if (f.diet === "nonveg") out.push("Non-veg");
    if (f.maxTime) out.push(f.maxTime + " min or less");
    if (f.meal !== "all") out.push(cap(f.meal));
    Object.keys(Data.EQUIPMENT).forEach(function (k) {
      if (!f.equipment[k]) out.push("no " + Data.EQUIPMENT[k].toLowerCase());
    });
    return out;
  }

  /* Which single ingredient, if added, would unlock the most recipes? */
  function suggestAdditions(ctx, limit) {
    var counts = [];
    Data.INGREDIENTS.forEach(function (ing) {
      if (ctx.selectedSet.has(ing.id)) return;
      var trial = ctx.selected.concat(ing.id);
      var n = Data.RECIPES.filter(function (r) {
        var e = evaluate(r, trial);
        return e.used.length > 0 && e.missing.length <= CONFIG.maxMissing &&
          e.used.length > evaluate(r, ctx.selected).used.length;
      }).length;
      if (n) counts.push({ id: ing.id, n: n });
    });
    counts.sort(function (a, b) { return b.n - a.n; });
    return counts.slice(0, limit || 2).map(function (c) {
      return { label: "Add " + name(c.id), add: [c.id], remove: [] };
    });
  }

  function defaultNoMatch(ctx) {
    return {
      title: "No recipe fits these leftovers yet",
      body: "None of our " + Data.RECIPES.length + " recipes use " + listNames(ctx.selected) +
        " without needing more than " + CONFIG.maxMissing + " extra items. Add one more common ingredient and try again.",
      suggestions: suggestAdditions(ctx, 2),
    };
  }

  /* ---- Pipeline ---------------------------------------------------------
   * 1. every active twist may BLOCK (validate)
   * 2. score all recipes, keep those using >=1 leftover (base rule)
   * 3. quick filters (diet, time, meal, equipment)
   * 4. each active twist FILTERs, then ADJUSTs scores, then adds BADGEs
   * 5. sort by mode; if nothing is left, explain which step emptied it
   *
   * opts = { mode: "home" | "restaurant", filters: {...} }
   * -------------------------------------------------------------------- */
  function run(selected, activeTwists, params, opts) {
    opts = opts || {};
    var mode = opts.mode === "restaurant" ? "restaurant" : "home";
    var filters = opts.filters || DEFAULT_FILTERS;
    var ctx = {
      selected: selected.slice(),
      selectedSet: new Set(selected),
      params: params || {},
      twists: activeTwists,
      mode: mode,
      filters: filters,
      config: CONFIG,
      helpers: { name: name, listNames: listNames, evaluate: evaluate, suggestAdditions: suggestAdditions },
    };

    for (var i = 0; i < activeTwists.length; i++) {
      var t = activeTwists[i];
      if (t.validate) {
        var msg = t.validate(ctx);
        if (msg) return { status: "blocked", twist: t, message: msg, ctx: ctx };
      }
    }
    if (!selected.length) return { status: "empty", ctx: ctx };

    var results = Data.RECIPES.map(function (r) { return evaluate(r, ctx.selected); })
      .filter(function (e) { return e.used.length > 0 && e.missing.length <= CONFIG.maxMissing; });
    var trace = [{ step: "base", count: results.length }];
    var emptiedBy = null;

    var beforeFilters = results.length;
    results = results.filter(function (e) { return passesFilters(e.recipe, filters); });
    trace.push({ step: "filters", before: beforeFilters, count: results.length });
    var filtersEmptied = beforeFilters > 0 && results.length === 0;

    activeTwists.forEach(function (t) {
      if (!t.filter) return;
      var before = results.length;
      results = results.filter(function (e) { return t.filter(e, ctx); });
      trace.push({ step: t.id, before: before, count: results.length });
      if (before > 0 && results.length === 0 && !emptiedBy) emptiedBy = t;
    });

    results.forEach(function (e) {
      activeTwists.forEach(function (t) {
        if (t.adjustScore) e.score = Math.max(0, Math.min(100, Math.round(t.adjustScore(e, ctx))));
        if (t.badge) { var b = t.badge(e, ctx); if (b) e.badges.push(b); }
      });
      e.tier = tier(e.score);
      e.matchLabel = matchLabel(e);
    });

    // Home: rescue the most food first. Restaurant: best flavour pairing first.
    results.sort(mode === "restaurant"
      ? function (a, b) { return b.recipe.flair - a.recipe.flair || b.used.length - a.used.length || b.score - a.score; }
      : function (a, b) { return b.score - a.score || b.perishablesUsed.length - a.perishablesUsed.length || a.recipe.time - b.recipe.time; });

    if (!results.length) {
      var explanation;
      if (filtersEmptied) {
        explanation = {
          title: "Your filters hide every match",
          body: beforeFilters + (beforeFilters === 1 ? " recipe uses" : " recipes use") + " your leftovers, but none fit: " +
            describeFilters(filters).join(", ") + ". Loosen a filter to see them.",
          suggestions: [{ label: "Clear filters", action: "clearFilters", add: [], remove: [] }],
        };
      } else if (emptiedBy && emptiedBy.noMatch) {
        explanation = emptiedBy.noMatch(ctx);
      } else if (emptiedBy) {
        explanation = {
          title: "The " + emptiedBy.label + " rule ruled out every match",
          body: "Your leftovers match some recipes, but none of them pass " + emptiedBy.label + ". Turn it off or change your picks.",
          suggestions: [],
        };
      } else {
        var explainer = activeTwists.filter(function (t) { return t.noMatch && t.explainsBase; })[0];
        explanation = explainer ? explainer.noMatch(ctx) : defaultNoMatch(ctx);
      }
      return { status: "nomatch", explanation: explanation, trace: trace, ctx: ctx };
    }
    return { status: "ok", results: results, trace: trace, ctx: ctx };
  }

  /* Restaurant Mode "mystery basket": 3 random ingredients that share a recipe. */
  function randomBasket(rand) {
    rand = rand || Math.random;
    var r = Data.RECIPES[Math.floor(rand() * Data.RECIPES.length)];
    var pool = r.uses.concat(r.optional).map(function (u) { return u[0]; });
    while (pool.length < 3) {
      var extra = Data.INGREDIENTS[Math.floor(rand() * Data.INGREDIENTS.length)].id;
      if (pool.indexOf(extra) === -1) pool.push(extra);
    }
    for (var i = pool.length - 1; i > 0; i--) {
      var j = Math.floor(rand() * (i + 1)); var tmp = pool[i]; pool[i] = pool[j]; pool[j] = tmp;
    }
    return pool.slice(0, 3);
  }

  /* Autocomplete: names that start with the query first, then contain it. */
  function searchIngredients(query, limit) {
    var q = String(query || "").trim().toLowerCase();
    if (!q) return [];
    var starts = [], contains = [];
    Data.INGREDIENTS.forEach(function (i) {
      var n = i.name.toLowerCase();
      if (n.indexOf(q) === 0 || n.split(/[\s/]+/).some(function (w) { return w.indexOf(q) === 0; })) starts.push(i);
      else if (n.indexOf(q) !== -1) contains.push(i);
    });
    return starts.concat(contains).slice(0, limit || 6);
  }

  LC.Engine = {
    CONFIG: CONFIG, DEFAULT_FILTERS: DEFAULT_FILTERS,
    run: run, evaluate: evaluate, tier: tier, matchLabel: matchLabel,
    passesFilters: passesFilters, describeFilters: describeFilters,
    randomBasket: randomBasket, searchIngredients: searchIngredients,
    name: name, listNames: listNames, suggestAdditions: suggestAdditions, ING: ING,
  };
})();
