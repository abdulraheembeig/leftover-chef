# DOC-03 · Five-Test Checklist

Run these by hand before demoing. Each was run on 13 November 2026 in Chromium by an automated script (tests/e2e.py) and passed, on both index.html and the single-file build.

| # | Type | Steps | Expected |
|---|---|---|---|
| 1 | Invalid input | Turn on the Three-ingredient lock. Click Clear all and tick only 2 ingredients. Then type "zzz" in search and press Enter. | "Pick exactly 3 ingredients (2 of 3 picked)" and no recipes. Search says no ingredient matches "zzz". |
| 2 | Happy path | Load the page with the default picks. Open the first recipe and start Cook Mode. | Ranked recipes with match badges. Detail shows ingredients, steps, prep time and score breakdown. Cook Mode opens at Step 1. |
| 3 | Twist check | Lock on. Pick Cooked rice, Eggs and Onion. Then swap Onion for Ripe banana. | First: only recipes using all three, tagged "Uses all 3". Then: no-match message with the closest recipes and swap buttons. |
| 4 | Reset / refresh | Tick some extra items and add a shopping-list item. Click "Reset demo data". Then refresh the page. | Picks go back to the 4 defaults, the shopping list is empty, and the cookie banner shows again. After refresh, the same defaults load. |
| 5 | Boundary case | With the lock on, try to tick a 4th ingredient. Then turn the lock off and set Vegetarian + 10 min + Dessert. | The 4th chip is disabled. With strict filters: "Your filters hide every match" and a Clear filters button that restores results. |
