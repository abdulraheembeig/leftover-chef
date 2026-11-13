/* =========================================================================
 * Leftover Chef — TWISTS (plug-ins)
 *
 * A twist is ONE object passed to LC.Twists.register(). Its toggle (and
 * slider, if it has a `param`) appears in the UI automatically. Every hook
 * is optional; use only what you need.
 *
 *   id, label, description       required text
 *   tag: "text"                  small highlight pill next to the label
 *   defaultOn: bool              start switched on
 *   maxSelect: n                 limit how many ingredients can be ticked
 *   param: {label,min,max,step,value,unit}   adds a slider; read it with
 *                                ctx.params[<id>]
 *   validate(ctx) -> string|null return a message to BLOCK results
 *   filter(result, ctx) -> bool  keep or drop a recipe
 *   adjustScore(result, ctx) -> number   change the 0-100 score
 *   badge(result, ctx) -> string|null    small tag on the recipe card
 *   noMatch(ctx) -> {title, body, suggestions:[{label, add:[], remove:[]}]}
 *                                explanation when this twist leaves 0 recipes
 *   explainsBase: bool           also use noMatch when nothing matched at all
 *
 * `result` = { recipe, used, unused, missing, score, breakdown, badges }
 * `ctx`    = { selected, selectedSet, params, mode, filters, config, helpers }
 *
 * Diet, time, meal type and equipment are quick FILTERS (js/engine.js), not
 * twists, so they are always available above the results.
 *
 * NEW TWIST ANNOUNCED? Copy the TEMPLATE at the bottom, fill it in, done.
 * ========================================================================= */
var LC = (window.LC = window.LC || {});

LC.Twists = (function () {
  var list = [];
  return {
    register: function (t) {
      if (!t || !t.id || !t.label) throw new Error("Twist needs an id and a label");
      list = list.filter(function (x) { return x.id !== t.id; });
      list.push(t);
      return t;
    },
    all: function () { return list.slice(); },
    get: function (id) { return list.filter(function (t) { return t.id === id; })[0]; },
  };
})();

/* ---- 1. Three-ingredient mode (judge step 02 & 03) --------------------- */
LC.Twists.register({
  id: "three",
  label: "Three-ingredient lock",
  description: "Pick exactly three available ingredients. See recipes that use all three, or a clear reason why none do.",
  maxSelect: 3,
  explainsBase: true,

  validate: function (ctx) {
    var n = ctx.selected.length;
    if (n === 3) return null;
    if (n < 3) return "Pick exactly 3 ingredients (" + n + " of 3 picked).";
    return "The three-ingredient lock needs exactly 3. You have " + n + " picked, so untick " + (n - 3) + ".";
  },

  filter: function (result, ctx) {
    return ctx.selected.every(function (id) { return result.used.indexOf(id) !== -1; });
  },

  badge: function () { return "Uses all 3"; },

  noMatch: function (ctx) {
    var h = ctx.helpers;
    // Find the recipes that come closest: the most of the three in one dish.
    var best = LC.Data.RECIPES.map(function (r) { return h.evaluate(r, ctx.selected); })
      .sort(function (a, b) { return b.used.length - a.used.length || a.missing.length - b.missing.length; });
    var top = best[0] ? best[0].used.length : 0;
    var close = best.filter(function (e) { return e.used.length === top && top >= 2; }).slice(0, 3);

    var body, suggestions = [];
    if (close.length) {
      body = "No recipe uses " + h.listNames(ctx.selected) + " together. Closest: " +
        close.map(function (e) {
          return e.recipe.name + " uses " + h.listNames(e.used) + " but not " + h.listNames(e.unused);
        }).join("; ") + ".";
      // Offer swaps: replace the odd one out with something that recipe uses.
      close.forEach(function (e) {
        var odd = e.unused[0];
        var swapIn = e.recipe.uses.map(function (u) { return u[0]; })
          .concat(e.recipe.optional.map(function (u) { return u[0]; }))
          .filter(function (id) { return !ctx.selectedSet.has(id); })[0];
        if (odd && swapIn && !suggestions.some(function (s) { return s.add[0] === swapIn && s.remove[0] === odd; })) {
          suggestions.push({ label: "Swap " + h.name(odd) + " for " + h.name(swapIn), add: [swapIn], remove: [odd] });
        }
      });
    } else {
      body = "No recipe uses " + h.listNames(ctx.selected) + " together, and no two of them appear in the same recipe either. Try swapping one for a common base like onion, rice or bread.";
    }
    return { title: "No recipe uses all three", body: body, suggestions: suggestions.slice(0, 3) };
  },
});

/* ---- 2. Nothing to buy ------------------------------------------------- */
LC.Twists.register({
  id: "nobuy",
  label: "Nothing to buy",
  description: "Only recipes you can cook with what you ticked plus basic staples.",
  filter: function (result) { return result.missing.length === 0; },
  noMatch: function (ctx) {
    return {
      title: "Every match needs a shop run",
      body: "Each recipe that uses your leftovers needs at least one item you did not tick. Turn this off to see what you would need.",
      suggestions: ctx.helpers.suggestAdditions(ctx, 2),
    };
  },
});

/* ---- TEMPLATE: copy, rename, fill in -----------------------------------
LC.Twists.register({
  id: "my-twist",
  label: "My twist",
  description: "One line the judges will read.",
  // maxSelect: 5,
  // param: { label: "Budget", min: 0, max: 200, step: 10, value: 50, unit: "₹" },
  // validate: function (ctx) { return null; },
  filter: function (result, ctx) { return true; },
  // adjustScore: function (result, ctx) { return result.score; },
  // badge: function (result, ctx) { return null; },
  // noMatch: function (ctx) { return { title: "", body: "", suggestions: [] }; },
});
------------------------------------------------------------------------- */
