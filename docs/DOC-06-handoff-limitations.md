# DOC-06 · Handoff & Limitations

## Core files

| File | What it does |
|---|---|
| index.html | Page structure: header, board, filters, results, dialogs, footer |
| js/config.js | Team contact details and default picks |
| js/data.js | Ingredients, staples, recipes, meal types, equipment, Restaurant Mode notes |
| js/engine.js | Matching, match %, zero-waste score, filters, modes, search, random basket |
| js/twists.js | Twist plug-ins (Three-ingredient lock, Nothing to buy) and a template |
| js/storage.js | Consent-first local storage |
| js/pages.js | Policy pages and DOC-01 to DOC-06 (also exported to docs/*.md) |
| js/app.js | UI: rendering, search, Cook Mode, shopping list, cookie banner, routing |
| dist/leftover-chef.html | The whole app in one file (built by scripts/build-single.py); runs with a double-click |
| scripts/ | build-docs.js (writes README.md and docs/*.md) and build-single.py |
| fonts/ | Alfa Slab One and Instrument Sans (SIL Open Font License) |
| tests/ | engine.test.js (logic, Node) and e2e.py (the five tests in a browser) |

## Where the logic lives

- Score: evaluate() in js/engine.js.
- Filters, modes and the no-match explanations: run() in js/engine.js.
- Three-ingredient lock: js/twists.js. Add a new twist by copying the template at the bottom.

## Resetting demo data

Click "Reset demo data" in the footer. It clears both storage keys and restores the default picks from js/config.js.

## Mocked elements

- Recipe and ingredient data (sample, not from a database).
- Flair ratings used by Restaurant Mode.
- Shopping list (not connected to a store).
- Footer contact shows the team, event and venue only. Email and phone are left blank on purpose (build rules 02 and 04: no personal data or real contact details in the submission).

## Top three improvements for a real launch

1. A larger, reviewed recipe database with allergen tags, serving sizes and food-safety notes.
2. Optional accounts with sync across devices, built and reviewed against OWASP ASVS.
3. Usability and screen-reader testing with real households, plus Kannada and Hindi translations.
