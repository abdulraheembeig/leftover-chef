/* =========================================================================
 * Leftover Chef — UI
 * Reads state, calls LC.Engine.run(), draws the result. Twist toggles are
 * generated from LC.Twists.all(), so new twists need no UI code.
 * ========================================================================= */
(function () {
  var Data = LC.Data, Engine = LC.Engine, Twists = LC.Twists, Store = LC.Store, Config = LC.Config;
  var ING = Engine.ING;
  var SHOW_FIRST = 8;

  function defaults() {
    return {
      selected: Config.defaultPicks.slice(),
      active: new Set(Twists.all().filter(function (t) { return t.defaultOn; }).map(function (t) { return t.id; })),
      params: {},
      mode: "home",
      filters: JSON.parse(JSON.stringify(Engine.DEFAULT_FILTERS)),
      shopping: [],
      showAll: false,
    };
  }
  var state = defaults();
  Twists.all().forEach(function (t) { if (t.param) state.params[t.id] = t.param.value; });
  var saved = Store.loadState();
  if (saved) {
    var known = function (id) { return !!ING[id]; };
    if (Array.isArray(saved.selected)) state.selected = saved.selected.filter(known);
    if (Array.isArray(saved.shopping)) state.shopping = saved.shopping.filter(known);
    if (saved.mode === "restaurant") state.mode = "restaurant";
    if (saved.filters) state.filters = Object.assign(state.filters, saved.filters);
  }
  function save() { Store.saveState(state); }

  var $ = function (id) { return document.getElementById(id); };
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function names(ids) { return ids.map(function (id) { return ING[id].name; }).join(", "); }
  function activeTwists() { return Twists.all().filter(function (t) { return state.active.has(t.id); }); }
  function maxSelect() {
    return activeTwists().reduce(function (m, t) { return t.maxSelect ? Math.min(m, t.maxSelect) : m; }, Infinity);
  }
  var toastTimer = null;
  function toast(msg) {
    var t = $("toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2600);
  }

  /* ---- Selecting ingredients (shared by board, search, suggestions) --- */
  function addIngredient(id) {
    if (state.selected.indexOf(id) !== -1) return ING[id].name + " is already ticked.";
    if (state.selected.length >= maxSelect()) return "The three-ingredient lock allows only 3. Untick one first.";
    state.selected.push(id);
    return null;
  }
  function changed() { save(); renderPantry(); renderResults(); }

  /* ---- Mode ------------------------------------------------------------ */
  function renderMode() {
    document.body.setAttribute("data-mode", state.mode);
    $("mode-home").checked = state.mode === "home";
    $("mode-restaurant").checked = state.mode === "restaurant";
    $("mode-note").innerHTML = state.mode === "home"
      ? "<p><b>Home Mode:</b> recipes that use up the most food first, especially items that spoil fast.</p>"
      : '<p><b>Restaurant Mode:</b> chef-style flavour pairings and plating ideas, ranked by flair. Try a random basket.</p>' +
        '<button type="button" class="btn" id="surprise">Surprise me: 3 random ingredients</button>';
  }

  /* ---- Pantry tag board ------------------------------------------------ */
  function renderPantry() {
    var max = maxSelect();
    var full = state.selected.length >= max;
    $("pantry").innerHTML = Data.GROUPS.map(function (g) {
      var items = Data.INGREDIENTS.filter(function (i) { return i.group === g.id; });
      return '<fieldset class="group"><legend>' + esc(g.label) + '</legend><div class="chips">' +
        items.map(function (i) {
          var on = state.selected.indexOf(i.id) !== -1;
          var dis = !on && full;
          return '<label class="chip' + (on ? " on" : "") + (dis ? " dis" : "") + '" for="ing-' + i.id + '">' +
            '<input type="checkbox" id="ing-' + i.id + '" value="' + i.id + '"' + (on ? " checked" : "") + (dis ? " disabled" : "") + ">" +
            "<span>" + esc(i.name) + "</span>" +
            (i.shelf === 3 ? '<span class="spoil" aria-hidden="true"></span><span class="sr">(spoils fast)</span>' : "") +
            "</label>";
        }).join("") + "</div></fieldset>";
    }).join("");
    var n = state.selected.length;
    $("count").textContent = isFinite(max) ? n + " of " + max + " picked" : n + " picked";
    $("count").className = "count" + (isFinite(max) && n === max ? " full" : "");
  }

  /* ---- Search with autocomplete (ARIA combobox) ------------------------ */
  var sugg = [], activeIdx = -1;
  function renderSuggest() {
    var box = $("suggest"), input = $("search");
    if (!sugg.length) { box.hidden = true; input.setAttribute("aria-expanded", "false"); input.removeAttribute("aria-activedescendant"); return; }
    box.innerHTML = sugg.map(function (i, k) {
      var on = state.selected.indexOf(i.id) !== -1;
      return '<li role="option" id="opt-' + k + '" data-id="' + i.id + '" aria-selected="' + (k === activeIdx) + '"' + (k === activeIdx ? ' class="active"' : "") + ">" +
        esc(i.name) + (on ? ' <small>already ticked</small>' : "") + "</li>";
    }).join("");
    box.hidden = false; input.setAttribute("aria-expanded", "true");
    if (activeIdx >= 0) input.setAttribute("aria-activedescendant", "opt-" + activeIdx); else input.removeAttribute("aria-activedescendant");
  }
  function chooseSuggestion(id) {
    var err = addIngredient(id);
    $("search-msg").textContent = err || "Added " + ING[id].name + ".";
    if (!err) { $("search").value = ""; sugg = []; activeIdx = -1; renderSuggest(); changed(); }
  }
  $("search").addEventListener("input", function () {
    sugg = Engine.searchIngredients(this.value, 6); activeIdx = sugg.length ? 0 : -1;
    $("search-msg").textContent = this.value.trim() && !sugg.length ? 'No ingredient matches "' + this.value.trim() + '". Check the spelling or try another word.' : "";
    renderSuggest();
  });
  $("search").addEventListener("keydown", function (ev) {
    if (ev.key === "ArrowDown" && sugg.length) { activeIdx = (activeIdx + 1) % sugg.length; renderSuggest(); ev.preventDefault(); }
    else if (ev.key === "ArrowUp" && sugg.length) { activeIdx = (activeIdx - 1 + sugg.length) % sugg.length; renderSuggest(); ev.preventDefault(); }
    else if (ev.key === "Enter") {
      ev.preventDefault();
      if (sugg.length) chooseSuggestion(sugg[Math.max(activeIdx, 0)].id);
      else if (this.value.trim()) $("search-msg").textContent = 'No ingredient matches "' + this.value.trim() + '". Check the spelling or try another word.';
    } else if (ev.key === "Escape") { sugg = []; activeIdx = -1; renderSuggest(); }
  });
  $("search").addEventListener("blur", function () { setTimeout(function () { sugg = []; renderSuggest(); }, 150); });
  $("suggest").addEventListener("mousedown", function (ev) {
    var li = ev.target.closest("li"); if (!li) return;
    ev.preventDefault(); chooseSuggestion(li.getAttribute("data-id"));
  });

  /* ---- Quick filters --------------------------------------------------- */
  function renderFilters() {
    var f = state.filters;
    $("f-diet").value = f.diet;
    $("f-time").value = String(f.maxTime);
    document.querySelectorAll('input[name="meal"]').forEach(function (r) {
      r.checked = r.value === f.meal; r.parentElement.classList.toggle("on", r.checked);
    });
    Object.keys(Data.EQUIPMENT).forEach(function (k) {
      var el = $("eq-" + k); el.checked = !!f.equipment[k]; el.parentElement.classList.toggle("on", el.checked);
    });
    var active = Engine.describeFilters(f);
    $("clear-filters").hidden = !active.length;
  }
  $("filters").addEventListener("change", function (ev) {
    var t = ev.target, f = state.filters;
    if (t.id === "f-diet") f.diet = t.value;
    else if (t.id === "f-time") f.maxTime = Number(t.value);
    else if (t.name === "meal") f.meal = t.value;
    else if (t.id && t.id.indexOf("eq-") === 0) f.equipment[t.id.slice(3)] = t.checked;
    save(); renderFilters(); renderResults();
  });
  $("filters").addEventListener("submit", function (ev) { ev.preventDefault(); });
  function clearFilters() {
    state.filters = JSON.parse(JSON.stringify(Engine.DEFAULT_FILTERS));
    save(); renderFilters(); renderResults(); toast("Filters cleared.");
  }
  $("clear-filters").addEventListener("click", clearFilters);

  /* ---- Twist toggles (auto-generated) ---------------------------------- */
  function renderTwists() {
    $("twists").innerHTML = Twists.all().map(function (t) {
      var on = state.active.has(t.id);
      var slider = "";
      if (t.param && on) {
        var p = t.param, v = state.params[t.id];
        slider = '<div class="param"><label for="param-' + t.id + '">' + esc(p.label) +
          ': <output id="out-' + t.id + '">' + v + " " + esc(p.unit || "") + "</output></label>" +
          '<input type="range" id="param-' + t.id + '" data-param="' + t.id + '" min="' + p.min + '" max="' + p.max +
          '" step="' + p.step + '" value="' + v + '"></div>';
      }
      return '<div class="twist' + (on ? " on" : "") + '">' +
        '<label class="switch" for="tw-' + t.id + '">' +
        '<input type="checkbox" role="switch" id="tw-' + t.id + '" data-twist="' + t.id + '"' + (on ? " checked" : "") + ">" +
        '<span class="track" aria-hidden="true"><span class="thumb"></span></span>' +
        '<span class="twist-text"><strong>' + esc(t.label) + (t.tag ? ' <span class="twist-tag">' + esc(t.tag) + "</span>" : "") + "</strong>" +
        "<span>" + esc(t.description) + "</span></span>" +
        "</label>" + slider + "</div>";
    }).join("");
  }

  /* ---- Shopping list --------------------------------------------------- */
  function addToShopping(ids) {
    var added = ids.filter(function (id) { return state.shopping.indexOf(id) === -1; });
    state.shopping = state.shopping.concat(added);
    save(); renderShopping();
    return added.length;
  }
  function renderShopping() {
    var n = state.shopping.length;
    $("shop-count").textContent = n ? "(" + n + ")" : "";
    $("shopping").innerHTML = n
      ? '<ul class="shop-list">' + state.shopping.map(function (id) {
          return '<li><span>' + esc(ING[id].name) + '</span><button type="button" class="link-btn" data-unshop="' + id + '" aria-label="Remove ' + esc(ING[id].name) + ' from shopping list">Remove</button></li>';
        }).join("") + '</ul><div class="shop-actions"><button type="button" class="btn ghost" id="copy-list">Copy list</button><button type="button" class="link-btn" id="clear-list">Clear list</button></div>'
      : '<p class="muted">Nothing yet. Add missing items from any recipe card.</p>';
  }
  $("shopping").addEventListener("click", function (ev) {
    var id = ev.target.getAttribute("data-unshop");
    if (id) { state.shopping = state.shopping.filter(function (x) { return x !== id; }); save(); renderShopping(); renderResults(); toast(ING[id].name + " removed from your list."); return; }
    if (ev.target.id === "clear-list") { state.shopping = []; save(); renderShopping(); renderResults(); toast("Shopping list cleared."); return; }
    if (ev.target.id === "copy-list") {
      var text = "Shopping list\n" + state.shopping.map(function (x) { return "- " + ING[x].name; }).join("\n");
      try {
        navigator.clipboard.writeText(text).then(function () { toast("List copied. Paste it anywhere."); }, function () { toast("Copy was blocked by the browser. Select the list and copy it by hand."); });
      } catch (e) { toast("Copy was blocked by the browser. Select the list and copy it by hand."); }
    }
  });

  /* ---- Results --------------------------------------------------------- */
  var lastResults = [];
  function ring(score, tierId, size) {
    return '<div class="ring ' + (size || "") + '" data-tier="' + tierId + '" style="--v:' + score + '" role="img" aria-label="Zero-waste score ' + score + ' out of 100">' +
      '<span aria-hidden="true">' + score + "</span></div>";
  }
  function missingNotOnList(e) { return e.missing.filter(function (id) { return state.shopping.indexOf(id) === -1; }); }

  function renderResults() {
    var out = Engine.run(state.selected, activeTwists(), state.params, { mode: state.mode, filters: state.filters });
    var box = $("results"), summary = $("summary");
    lastResults = out.results || [];

    if (out.status === "empty") {
      summary.textContent = "";
      box.innerHTML = '<div class="notice"><strong>Your fridge list is empty</strong><p>Tick a few leftovers, or type one in the search bar, to see recipes.</p></div>';
      return;
    }
    if (out.status === "blocked") {
      summary.textContent = out.twist.label + " is on";
      box.innerHTML = '<div class="notice warn" role="alert"><strong>' + esc(out.message) + "</strong><p>" + esc(out.twist.description) + "</p></div>";
      return;
    }
    if (out.status === "nomatch") {
      var ex = out.explanation;
      summary.textContent = "0 recipes match";
      box._suggestions = ex.suggestions || [];
      box.innerHTML = '<div class="notice bad"><strong>' + esc(ex.title) + "</strong><p>" + esc(ex.body) + "</p>" +
        (box._suggestions.length ? '<div class="sugs">' + box._suggestions.map(function (s, i) {
          return '<button type="button" class="sug" data-sug="' + i + '">' + esc(s.label) + "</button>";
        }).join("") + "</div>" : "") + "</div>";
      return;
    }

    var best = lastResults[0];
    summary.textContent = lastResults.length + (lastResults.length === 1 ? " recipe matches" : " recipes match") +
      (state.mode === "home" ? " · best score " + best.score : " · ranked by flavour pairing");
    var shown = state.showAll ? lastResults : lastResults.slice(0, SHOW_FIRST);
    box.innerHTML = '<ol class="cards">' + shown.map(function (e, i) {
      var r = e.recipe, rest = state.mode === "restaurant";
      var toBuy = missingNotOnList(e);
      return '<li><article class="card" aria-labelledby="t-' + r.id + '">' +
        ring(e.score, e.tier.id) +
        '<div class="card-body">' +
        '<h3 class="card-title" id="t-' + r.id + '">' + esc(rest ? r.chef.title : r.name) + "</h3>" +
        (rest ? '<p class="meta">' + esc(r.name) + "</p>" : "") +
        '<p class="meta">' + r.time + " min · " + r.difficulty + " · " + (r.veg ? "Veg" : "Non-veg") + " · " + r.meals.map(cap).join(", ") + "</p>" +
        '<p class="match ' + (e.missing.length ? "part" : "full") + '">' + esc(e.matchLabel) + "</p>" +
        '<p class="line"><b>Uses</b> ' + esc(names(e.used)) + "</p>" +
        (e.missing.length ? '<p class="line alert" role="note"><b>Missing</b> ' + esc(names(e.missing)) + "</p>" : "") +
        (!rest && e.perishablesUsed.length ? '<p class="line"><b>Saves</b> ' + e.perishablesUsed.length + " fast-spoiling item" + (e.perishablesUsed.length > 1 ? "s" : "") + "</p>" : "") +
        (rest ? '<p class="line"><b>Why</b> ' + esc(r.chef.pairing) + "</p>" : "") +
        (e.badges.length ? '<p class="badges">' + e.badges.map(function (b) { return '<span class="badge">' + esc(b) + "</span>"; }).join("") + "</p>" : "") +
        '<div class="card-actions"><button type="button" class="btn" data-open="' + i + '">View recipe<span class="sr">: ' + esc(r.name) + "</span></button>" +
        (e.missing.length
          ? (toBuy.length
              ? '<button type="button" class="btn ghost" data-shop="' + i + '">Add ' + toBuy.length + " missing to shopping list</button>"
              : '<span class="muted small">Missing items are on your list</span>')
          : "") +
        "</div></div>" +
        '<span class="tier" data-tier="' + e.tier.id + '">' + e.tier.label + "</span>" +
        "</article></li>";
    }).join("") + "</ol>" +
      (lastResults.length > SHOW_FIRST
        ? '<button type="button" class="more" id="toggle-more">' + (state.showAll ? "Show top " + SHOW_FIRST + " only" : "Show " + (lastResults.length - SHOW_FIRST) + " more matches") + "</button>"
        : "");
  }

  $("results").addEventListener("click", function (ev) {
    var t = ev.target.closest("button"); if (!t) return;
    if (t.id === "toggle-more") { state.showAll = !state.showAll; renderResults(); return; }
    if (t.hasAttribute("data-open")) { openDetail(lastResults[Number(t.getAttribute("data-open"))]); return; }
    if (t.hasAttribute("data-shop")) {
      var e = lastResults[Number(t.getAttribute("data-shop"))];
      var n = addToShopping(e.missing); renderResults();
      toast(n + (n === 1 ? " item" : " items") + " added to your shopping list.");
      return;
    }
    if (t.hasAttribute("data-sug")) {
      var s = $("results")._suggestions[Number(t.getAttribute("data-sug"))];
      if (s.action === "clearFilters") { clearFilters(); return; }
      state.selected = state.selected.filter(function (x) { return s.remove.indexOf(x) === -1; });
      s.add.forEach(function (x) { if (state.selected.indexOf(x) === -1) state.selected.push(x); });
      changed();
    }
  });

  /* ---- Recipe detail + challenge timer --------------------------------- */
  var timer = null;
  function stopTimer() {
    if (timer) { clearInterval(timer); timer = null; }
    var clk = $("clock"); if (clk) clk.classList.remove("ticking");
  }
  function fmt(s) { var m = Math.floor(s / 60), x = s % 60; return m + ":" + (x < 10 ? "0" : "") + x; }
  var current = null;

  function openDetail(e) {
    current = e;
    var r = e.recipe, b = e.breakdown, sel = new Set(state.selected), rest = state.mode === "restaurant";
    var row = function (pair, kind) {
      var id = pair[0], have = sel.has(id);
      var status = have ? "have" : kind === "main" ? "buy" : "opt";
      var tag = have ? "You have it" : kind === "main" ? "Need to buy" : "Optional";
      return '<li class="ing ' + status + '"><span>' + esc(ING[id].name) + " <small>" + esc(pair[1]) + "</small></span>" +
        '<span class="pill">' + tag + "</span></li>";
    };
    var toBuy = missingNotOnList(e);
    var d = $("detail");
    d.innerHTML =
      '<div class="sheet">' +
      '<div class="sheet-head">' + ring(e.score, e.tier.id, "big") +
      '<div><h2 id="detail-title">' + esc(rest ? r.chef.title : r.name) + "</h2>" +
      '<p class="meta">' + (rest ? esc(r.name) + " · " : "") + r.time + " min prep · " + r.difficulty + " · " + (r.veg ? "Veg" : "Non-veg") + " · " + r.meals.map(cap).join(", ") + "</p>" +
      '<p class="match ' + (e.missing.length ? "part" : "full") + '">' + esc(e.matchLabel) + "</p></div>" +
      '<button type="button" class="close" id="close-detail" aria-label="Close recipe">×</button></div>' +

      '<div class="detail-actions"><button type="button" class="btn" id="start-cook">Start Cook Mode</button>' +
      (e.missing.length ? (toBuy.length ? '<button type="button" class="btn ghost" id="detail-shop">Add missing to shopping list</button>' : '<span class="muted small">Missing items are on your list</span>') : "") +
      "</div>" +

      (rest ? '<div class="chef"><p><b>Why it works:</b> ' + esc(r.chef.pairing) + "</p><p><b>Plating:</b> " + esc(r.chef.plating) + "</p></div>" : "") +

      '<div class="challenge"><p><b>Your challenge:</b> plate this in ' + r.time + " minutes and rescue " +
      b.usedCount + " of your " + b.selectedCount + " leftovers.</p>" +
      '<div class="timer"><span id="clock" class="clock" aria-live="off">' + fmt(r.time * 60) + "</span>" +
      '<button type="button" id="start-timer" class="btn">Start challenge timer</button></div></div>' +

      "<h3>Zero-waste score</h3><ul class=\"score-lines\">" +
      "<li><span>Leftovers rescued: " + b.usedCount + " of " + b.selectedCount + " <small>(fast-spoiling items count more)</small></span><b>" + b.rescuePts + " / " + Engine.CONFIG.rescuePoints + "</b></li>" +
      "<li><span>Main items you already have: " + b.have + " of " + b.needed + "</span><b>" + b.completePts + " / " + Engine.CONFIG.completePoints + "</b></li>" +
      (e.score !== b.rescuePts + b.completePts ? "<li><span>Twist adjustment</span><b>" + (e.score - b.rescuePts - b.completePts > 0 ? "+" : "") + (e.score - b.rescuePts - b.completePts) + "</b></li>" : "") +
      '<li class="total"><span>Total</span><b>' + e.score + " / 100</b></li></ul>" +
      (e.unused.length ? '<p class="hint">Not used here: ' + esc(names(e.unused)) + ". Pick a second recipe to rescue these.</p>" : "") +

      '<h3>Ingredients</h3><ul class="ings">' +
      r.uses.map(function (p) { return row(p, "main"); }).join("") +
      r.optional.map(function (p) { return row(p, "opt"); }).join("") + "</ul>" +
      '<p class="staples-line">From your shelf: ' + esc(r.staples.join(", ")) + "</p>" +
      '<h3>Steps</h3><ol class="steps">' + r.steps.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ol>" +
      "</div>";
    d.setAttribute("aria-labelledby", "detail-title");

    var secs = r.time * 60;
    $("start-timer").addEventListener("click", function () {
      if (timer) { stopTimer(); this.textContent = "Resume timer"; return; }
      this.textContent = "Pause timer";
      var clk = $("clock"); if (clk) clk.classList.add("ticking");
      var btn = this;
      timer = setInterval(function () {
        secs -= 1;
        $("clock").textContent = fmt(Math.max(secs, 0));
        if (secs <= 0) { stopTimer(); $("clock").textContent = "Time!"; btn.textContent = "Done"; btn.disabled = true; }
      }, 1000);
    });
    $("close-detail").addEventListener("click", function () { d.close(); });
    $("start-cook").addEventListener("click", function () { d.close(); openCook(e); });
    var ds = $("detail-shop");
    if (ds) ds.addEventListener("click", function () {
      var n = addToShopping(e.missing); renderResults(); toast(n + (n === 1 ? " item" : " items") + " added to your shopping list.");
      openDetail(e);
    });
    if (!d.open) { if (d.showModal) d.showModal(); else d.setAttribute("open", ""); }
  }

  /* ---- Cook Mode: one step at a time, pantry vs needed ------------------- */
  var cook = { e: null, step: 0, steps: [] };
  function openCook(e) {
    var r = e.recipe;
    cook.e = e; cook.step = 0;
    cook.steps = r.steps.slice();
    if (state.mode === "restaurant") cook.steps.push("Plate it: " + r.chef.plating);
    renderCook();
    var c = $("cook");
    if (c.showModal) c.showModal(); else c.setAttribute("open", "");
    $("cook-next").focus();
  }
  function renderCook() {
    var e = cook.e, r = e.recipe, sel = new Set(state.selected), n = cook.steps.length, i = cook.step, done = i >= n;
    var pantry = r.uses.concat(r.optional).map(function (p) { return p[0]; }).filter(function (id) { return sel.has(id); });
    $("cook").innerHTML =
      '<div class="cook-wrap">' +
      '<div class="cook-head"><div><p class="eyebrow">Cook Mode</p><h2 id="cook-title">' + esc(state.mode === "restaurant" ? r.chef.title : r.name) + "</h2></div>" +
      '<button type="button" class="btn ghost" id="cook-exit">Exit Cook Mode</button></div>' +
      '<div class="cook-split">' +
      '<section aria-labelledby="pantry-col"><h3 id="pantry-col">From your pantry</h3><ul>' +
      pantry.map(function (id) { return "<li>" + esc(ING[id].name) + "</li>"; }).join("") +
      "<li class=\"muted\">Staples: " + esc(r.staples.join(", ")) + "</li></ul></section>" +
      '<section aria-labelledby="needed-col"><h3 id="needed-col">Still needed</h3>' +
      (e.missing.length ? "<ul>" + e.missing.map(function (id) { return "<li>" + esc(ING[id].name) + (state.shopping.indexOf(id) !== -1 ? " <small>(on your list)</small>" : "") + "</li>"; }).join("") + "</ul>"
        : '<p class="muted">Nothing. You have everything.</p>') +
      "</section></div>" +
      '<div class="cook-step" aria-live="polite">' +
      (done ? '<p class="eyebrow">Finished</p><p class="step-text">Done. Enjoy your meal.</p>'
        : '<p class="eyebrow">Step ' + (i + 1) + " of " + n + '</p><p class="step-text">' + esc(cook.steps[i]) + "</p>") +
      '<div class="progress" role="progressbar" aria-label="Cooking progress" aria-valuemin="0" aria-valuemax="' + n + '" aria-valuenow="' + Math.min(i + (done ? 0 : 1), n) + '"><span style="width:' + (Math.min(i + 1, n) / n * 100) + '%"></span></div>' +
      "</div>" +
      '<div class="cook-nav"><button type="button" class="btn ghost" id="cook-prev"' + (i === 0 ? " disabled" : "") + ">Previous step</button>" +
      (done ? '<button type="button" class="btn" id="cook-finish">Close Cook Mode</button>'
        : '<button type="button" class="btn" id="cook-next">' + (i === n - 1 ? "Finish" : "Next step") + "</button>") +
      "</div><p class=\"muted small\">Tip: use the left and right arrow keys to move between steps.</p></div>";
    $("cook").setAttribute("aria-labelledby", "cook-title");
  }
  $("cook").addEventListener("click", function (ev) {
    var id = ev.target.id;
    if (id === "cook-exit" || id === "cook-finish") { $("cook").close(); return; }
    if (id === "cook-next") { cook.step++; renderCook(); var nx = $("cook-next") || $("cook-finish"); if (nx) nx.focus(); }
    if (id === "cook-prev") { cook.step = Math.max(0, cook.step - 1); renderCook(); var pv = $("cook-prev"); if (pv && !pv.disabled) pv.focus(); else $("cook-next").focus(); }
  });
  $("cook").addEventListener("keydown", function (ev) {
    if (ev.key === "ArrowRight" && cook.step < cook.steps.length) { cook.step++; renderCook(); }
    if (ev.key === "ArrowLeft" && cook.step > 0) { cook.step--; renderCook(); }
  });

  /* ---- Cookie banner (minimal, opt-in) -------------------------------- */
  var bannerAnswered = false;
  function showBanner(force) {
    var c = Store.consent();
    if (!force && (c || bannerAnswered)) { $("cookie").hidden = true; return; }
    $("ck-remember").checked = !!(c && c.remember);
    $("cookie").hidden = false;
  }
  $("ck-save").addEventListener("click", function () {
    Store.setConsent($("ck-remember").checked); bannerAnswered = true; save(); $("cookie").hidden = true;
    toast($("ck-remember").checked ? "Saved. Your picks will be remembered on this device." : "Saved. Nothing except this choice is stored.");
  });
  $("ck-essential").addEventListener("click", function () {
    Store.setConsent(false); bannerAnswered = true; $("cookie").hidden = true; toast("Saved. Nothing except this choice is stored.");
  });
  $("cookie-settings").addEventListener("click", function () { showBanner(true); $("ck-remember").focus(); });

  $("reset-demo").addEventListener("click", function () {
    Store.resetAll();
    var p = state.params; state = defaults(); state.params = p;
    bannerAnswered = false; $("search").value = ""; $("search-msg").textContent = "";
    renderAll(); showBanner(); location.hash = "";
    toast("Demo data reset. Back to the starting picks.");
  });

  /* ---- Pages (hash routes) -------------------------------------------- */
  function route() {
    var key = location.hash.replace("#", "");
    var isDocs = key === "docs", page = LC.Pages[key];
    if (!page && !isDocs) {
      $("view-app").hidden = false; $("view-page").hidden = true;
      document.title = Config.appName;
      return;
    }
    var html = '<a href="#" class="back">Back to Leftover Chef</a>';
    if (isDocs) {
      html += "<h1>Documentation</h1><p class=\"muted\">Six cards, DOC-01 to DOC-06. The same text is in the docs folder as Markdown.</p>" +
        '<nav class="doc-nav" aria-label="Documentation cards">' + LC.Docs.map(function (d) {
          return '<button type="button" class="chip" data-doc="' + d.id + '">' + d.id + " · " + esc(d.title) + "</button>";
        }).join("") + "</nav>" +
        LC.Docs.map(function (d) {
          return '<article class="doc-card" id="' + d.id + '" tabindex="-1"><p class="eyebrow">' + d.id + "</p><h2>" + esc(d.title) + "</h2>" + LC.renderBlocksHTML(d.blocks) + "</article>";
        }).join("");
      document.title = "Documentation · " + Config.appName;
    } else {
      html += "<h1>" + esc(page.title) + "</h1>" + LC.renderBlocksHTML(page.blocks);
      document.title = page.title + " · " + Config.appName;
    }
    $("view-page").innerHTML = '<div class="page-inner">' + html + "</div>";
    $("view-app").hidden = true; $("view-page").hidden = false;
    window.scrollTo(0, 0);
    var h = $("view-page").querySelector("h1"); if (h) { h.setAttribute("tabindex", "-1"); h.focus(); }
  }
  $("view-page").addEventListener("click", function (ev) {
    var id = ev.target.getAttribute && ev.target.getAttribute("data-doc");
    if (id) { var el = document.getElementById(id); el.scrollIntoView({ behavior: "smooth", block: "start" }); el.focus({ preventScroll: true }); }
  });
  window.addEventListener("hashchange", route);

  /* ---- Remaining events ---------------------------------------------- */
  function renderAll() { renderMode(); renderPantry(); renderFilters(); renderTwists(); renderShopping(); renderResults(); }

  $("pantry").addEventListener("change", function (ev) {
    var id = ev.target.value;
    if (ev.target.checked) { if (state.selected.indexOf(id) === -1) state.selected.push(id); }
    else state.selected = state.selected.filter(function (x) { return x !== id; });
    changed();
  });
  $("twists").addEventListener("change", function (ev) {
    var id = ev.target.getAttribute("data-twist");
    if (!id) return;
    if (ev.target.checked) state.active.add(id); else state.active.delete(id);
    renderAll();
    var el = $("tw-" + id); if (el) el.focus();
  });
  $("twists").addEventListener("input", function (ev) {
    var id = ev.target.getAttribute("data-param");
    if (!id) return;
    state.params[id] = Number(ev.target.value);
    $("out-" + id).textContent = ev.target.value + " " + (Twists.get(id).param.unit || "");
    renderResults();
  });
  $("mode-switch").addEventListener("change", function (ev) {
    state.mode = ev.target.value === "restaurant" ? "restaurant" : "home";
    save(); renderMode(); renderResults();
  });
  $("mode-note").addEventListener("click", function (ev) {
    if (ev.target.id !== "surprise") return;
    state.selected = Engine.randomBasket();
    changed(); toast("Mystery basket: " + names(state.selected) + ".");
  });
  $("clear").addEventListener("click", function () { state.selected = []; changed(); });

  var dlg = $("detail");
  dlg.addEventListener("close", stopTimer);
  dlg.addEventListener("click", function (ev) { if (ev.target === dlg) dlg.close(); });

  $("staples").innerHTML = '<span class="key"><span class="spoil" aria-hidden="true"></span>Dot = spoils fast, counts more in the score</span><br>Assumed in every kitchen: ' + esc(Data.STAPLES.join(", ")) + ".";

  var contact = [Config.team, Config.event, Config.venue];
  if (Config.email) contact.push('<a href="mailto:' + esc(Config.email) + '">' + esc(Config.email) + "</a>");
  if (Config.phone) contact.push(esc(Config.phone));
  $("contact").innerHTML = contact.map(function (c, i) { return i < 3 ? esc(c) : c; }).join("<br>");

  renderAll();
  showBanner();
  route();
})();
