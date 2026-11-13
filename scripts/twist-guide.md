## Adding a twist (about 5 minutes)

Open `js/twists.js`, copy the TEMPLATE at the bottom and fill in only the hooks you need. The toggle appears in the UI by itself.

```js
LC.Twists.register({
  id: "budget",
  label: "Student budget",
  description: "Only recipes where you buy at most one thing.",
  filter: function (result) { return result.missing.length <= 1; },
});
```

| Hook | Use it to… |
|---|---|
| `maxSelect: n` | limit how many ingredients can be ticked |
| `tag: "text"` | show a small highlight label next to the twist |
| `param: {label,min,max,step,value,unit}` | add a slider (read `ctx.params[id]`) |
| `validate(ctx)` | return a message to block results until a rule is met |
| `filter(result, ctx)` | keep or drop a recipe |
| `adjustScore(result, ctx)` | change the score |
| `badge(result, ctx)` | put a small tag on the card |
| `noMatch(ctx)` | explain why nothing matched and offer `suggestions` |

## Run the tests

- Logic: `node tests/engine.test.js`
- Browser (five-test checklist, screenshots, demo video): `python3 tests/e2e.py` (needs `pip install playwright && playwright install chromium`)

## Single-file version

`dist/leftover-chef.html` is the whole app in one file (styles, code, fonts and screenshots inlined). Double-click it; no other files or internet needed. Rebuild it after any change with `python3 scripts/build-single.py` (needs `pip install pillow`), and test it with `LC_FILE=dist/leftover-chef.html python3 tests/e2e.py`.
