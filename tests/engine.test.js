// Run: node tests/engine.test.js   (no installs needed)
// Walks the judges' 3-step path and checks every recipe is well-formed.
const fs = require("fs"), path = require("path"), vm = require("vm"), assert = require("assert");

const sandbox = { console };
sandbox.window = sandbox;
vm.createContext(sandbox);
["config.js", "data.js", "engine.js", "twists.js"].forEach((f) =>
  vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "js", f), "utf8"), sandbox, { filename: f })
);
const { Data, Engine, Twists } = sandbox.LC;
const twists = (...ids) => ids.map((id) => Twists.get(id));
const params = { quick: 15 };
let passed = 0;
const test = (name, fn) => { fn(); passed++; console.log("  ok  " + name); };

test("every recipe uses known ingredients and has steps", () => {
  const ids = new Set(Data.INGREDIENTS.map((i) => i.id));
  Data.RECIPES.forEach((r) => {
    r.uses.concat(r.optional).forEach(([id]) => assert(ids.has(id), r.id + " uses unknown " + id));
    assert(r.steps.length && r.time > 0, r.id + " needs steps and time");
  });
});

test("STEP 01: choose ingredients -> matching recipes, sorted by score", () => {
  const out = Engine.run(["rice", "egg", "onion", "tomato"], [], params);
  assert.strictEqual(out.status, "ok");
  assert(out.results.length > 3);
  for (let i = 1; i < out.results.length; i++) assert(out.results[i - 1].score >= out.results[i].score);
  out.results.forEach((e) => assert(e.score >= 0 && e.score <= 100));
});

test("STEP 02: 3-ingredient mode blocks until exactly three are picked", () => {
  assert.strictEqual(Engine.run(["rice", "egg"], twists("three"), params).status, "blocked");
  assert.strictEqual(Engine.run(["rice", "egg", "onion", "tomato"], twists("three"), params).status, "blocked");
  assert.strictEqual(Twists.get("three").maxSelect, 3);
});

test("STEP 03a: three that work together -> every result uses all three", () => {
  [["rice", "egg", "onion"], ["bread", "egg", "onion"], ["potato", "bread", "onion"]].forEach((pick) => {
    const out = Engine.run(pick, twists("three"), params);
    assert.strictEqual(out.status, "ok", pick.join("+"));
    out.results.forEach((e) => pick.forEach((id) => assert(e.used.includes(id))));
  });
});

test("STEP 03b: three that never meet -> clear no-match explanation", () => {
  const out = Engine.run(["banana", "spinach", "chicken"], twists("three"), params);
  assert.strictEqual(out.status, "nomatch");
  assert(out.explanation.title && out.explanation.body.includes("Ripe banana"));
  const out2 = Engine.run(["rice", "egg", "banana"], twists("three"), params);
  assert.strictEqual(out2.status, "nomatch");
  assert(out2.explanation.suggestions.length > 0, "should offer a swap");
  console.log("       -> " + out2.explanation.body);
});

test("filters that hide every match explain themselves and offer Clear filters", () => {
  const f = { diet: "veg", maxTime: 10, meal: "dessert", equipment: { stove: true, blender: true } };
  const out = Engine.run(["rice", "egg", "onion"], [], params, { filters: f });
  assert.strictEqual(out.status, "nomatch");
  assert(/filters/.test(out.explanation.title));
  assert.strictEqual(out.explanation.suggestions[0].action, "clearFilters");
});

test("match % and label", () => {
  const e = Engine.evaluate(Data.RECIPES.find((r) => r.id === "chicken-fried-rice"), ["rice", "egg", "onion"]);
  assert.strictEqual(e.matchPct, 75);
  assert.strictEqual(Engine.matchLabel(e), "75% match · 1 item missing");
});

test("meal, time and equipment filters", () => {
  const f = { diet: "any", maxTime: 0, meal: "breakfast", equipment: { stove: true, blender: true } };
  const out = Engine.run(["egg", "onion", "tomato"], [], params, { filters: f });
  out.results.forEach((e) => assert(e.recipe.meals.includes("breakfast")));
  const noStove = { diet: "any", maxTime: 0, meal: "all", equipment: { stove: false, blender: true } };
  const out2 = Engine.run(["banana", "milk", "curd", "onion", "tomato"], [], params, { filters: noStove });
  out2.results.forEach((e) => assert(!e.recipe.equipment.includes("stove")));
  assert(out2.results.length >= 2);
});

test("Restaurant Mode ranks by flair; random basket gives 3 that share a recipe", () => {
  const out = Engine.run(["rice", "egg", "onion", "tomato"], [], params, { mode: "restaurant" });
  for (let i = 1; i < out.results.length; i++) assert(out.results[i - 1].recipe.flair >= out.results[i].recipe.flair);
  for (let k = 0; k < 30; k++) {
    const b = Engine.randomBasket();
    assert.strictEqual(new Set(b).size, 3);
    assert(Engine.run(b, [], params).status === "ok", "basket " + b + " should match something");
  }
});

test("autocomplete search", () => {
  assert.strictEqual(Engine.searchIngredients("pan")[0].id, "paneer");
  assert.strictEqual(Engine.searchIngredients("zzz").length, 0);
  assert(Engine.searchIngredients("rice").some((i) => i.id === "rice"));
});

test("a new twist plugs in with one register() call", () => {
  Twists.register({ id: "tmp", label: "Under 4 steps", description: "", filter: (e) => e.recipe.steps.length < 4 });
  const out = Engine.run(["banana", "milk"], twists("tmp"), params);
  out.results.forEach((e) => assert(e.recipe.steps.length < 4));
});

console.log(`\n${passed} tests passed`);
