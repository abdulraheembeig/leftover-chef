# Leftover Chef: Verification Report

Run on 13 November 2026 against the submitted folder. Every result below comes from a command run on these files.

## Results

| Check | Command | Result |
|---|---|---|
| Engine logic (11 tests) | `node tests/engine.test.js` | 11/11 passed |
| Browser suite (16 checks) | `python3 tests/e2e.py` (Chromium) | 16/16 passed |
| Single-file build in sync | `python3 scripts/build-single.py`, then compare to `dist/` | Matches sources |
| Network and secrets | e2e: "No requests to other websites" | Passed; no API keys or `.env` |

## The five tests (DOC-03)

| # | Type | Outcome |
|---|---|---|
| 1 | Invalid input | Lock asks for exactly 3 picks; unknown search term is explained |
| 2 | Happy path | Ranked cards, detail with steps and score breakdown, Cook Mode opens at Step 1 |
| 3 | Twist (Three-ingredient lock) | Only all-three recipes shown; swapping to Ripe banana gives a no-match message with closest recipes |
| 4 | Reset / refresh | Back to 4 default picks, empty shopping list, cookie banner returns; same after refresh |
| 5 | Boundary | 4th chip disabled under the lock; strict filters explain "hide every match" and Clear filters restores results |

## Features confirmed in code

- 24 ingredients, 26 recipes (sample data in `js/data.js`).
- Zero-waste score with a visible breakdown (`evaluate()` in `js/engine.js`).
- Cook Mode shows one step at a time with "From your pantry" and "Still needed".
- Recipe detail has a challenge timer that counts down the recipe's total time. Cook Mode itself has no timer.
- Restaurant Mode: plated dish names, flavour notes, plating tips, "Surprise me" random basket.
- Consent-first local storage; Privacy, Terms, Refund and Cookies pages.
- Fonts: Alfa Slab One and Instrument Sans, bundled (no external requests).

## Not in the app

- No nutritional information. The Terms page states recipes are not nutrition advice.
- No accounts, sync, real shop connection or real recipe database (see DOC-06).

## Changes made during this review

- Removed unused IBM Plex fonts and their licence file (nothing referenced them).
- Re-ran the suite, which regenerated `proof/1`, `2`, `3`, `4`, `5`, `6` from the current build, and rebuilt `dist/leftover-chef.html`.

## Known gaps

- `proof/leftover-chef-demo.mp4` and `.webm` predate the final code edits and were not re-recorded. Re-record before submitting, or drop them.
- Not tested: real devices, screen readers, browsers other than Chromium.
- Sample data only. This is a demo build, not a production launch.
