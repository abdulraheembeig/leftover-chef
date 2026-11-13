# DOC-01 · README & Quickstart

## Purpose

Leftover Chef helps a household use up leftovers before they spoil. Tick what is left, and the app matches it to 26 practical recipes, shows what is missing, and gives each recipe a zero-waste score. Built for OWASP NIE VibeSprint 1.0, problem card PS-03.

## Features

- Ingredient tag board (24 ingredients) plus a search bar with autocomplete (arrow keys + Enter).
- Quick filters: diet, cooking time, meal type (Breakfast, Lunch, Dinner, Snacks, Dessert) and equipment (stove, blender).
- Match badges such as "67% match · 1 item missing", missing-item alerts and a shopping list.
- Zero-waste score (0-100) with a visible breakdown.
- Cook Mode: one step at a time, with "From your pantry" and "Still needed" side by side.
- Home Mode (use up food that spoils fast) and Restaurant Mode (flavour pairings, plated names, plating tips, "Surprise me" random basket).
- Twist: Three-ingredient lock. Pick exactly three; see recipes that use all three or a clear reason why none do.
- Privacy, Terms, Refund and Cookies pages, and a cookie banner with an opt-in checkbox.

## Setup (no secrets)

1. Download or clone this folder.
2. Open index.html in any modern browser, or double-click dist/leftover-chef.html (the whole app in one file). Nothing to install; no API keys, no .env file, no internet needed.
3. Optional: run node tests/engine.test.js to check the logic.

## Demo data

All data is sample data written by the team in js/data.js: 24 ingredients, 26 recipes and a list of kitchen staples. The app starts with Cooked rice, Eggs, Onion and Tomato ticked so there is something to see straight away.

## Zero-waste score

- Up to 70 points for how many of your ticked leftovers the recipe uses. Items that spoil fast count 3x, medium 2x, long-lasting 1x.
- Up to 30 points for how many of the recipe's main items you already have. Staples (salt, oil, spices) are assumed.
- 80+ Zero-waste hero, 50-79 Good save, under 50 Partial save.

## Screenshots

![Leftover Chef home screen with Cooked rice, Eggs, Onion and Tomato ticked and a ranked list of recipe cards showing match badges and zero-waste scores.](../proof/1-pick-ingredients.png)

![Recipe detail for Egg Fried Rice showing the challenge timer, the zero-waste score breakdown and an ingredient list marked have, need to buy or optional.](../proof/2-recipe-detail-and-score.png)

![Cook Mode showing one large step at a time, with From your pantry and Still needed lists side by side.](../proof/3-cook-mode.png)

![Three-ingredient lock turned on with exactly Cooked rice, Eggs and Onion picked, showing only recipes that use all three.](../proof/4-three-ingredient-lock-match.png)

![Three-ingredient lock with Cooked rice, Eggs and Ripe banana picked, showing a no-match explanation with the closest recipes and swap buttons.](../proof/5-three-ingredient-lock-no-match.png)

![Restaurant Mode with plated dish names, why-it-works flavour notes and plating tips on each recipe card.](../proof/6-restaurant-mode.png)

## Known limitations

- Fixed list of 26 recipes; quantities do not scale with servings.
- Only veg / non-veg is tracked, not allergens.
- Restaurant Mode ranks by a flair rating (1-5) set by the team, not by reviews.
- The shopping list stays on this device; it does not order anything.

## 30-second judge click-path

1. See the starting list: Egg Fried Rice is near the top with a match badge and score.
2. Open it, then Start Cook Mode, press Next, then Exit.
3. Turn on the Three-ingredient lock: you are asked to pick exactly 3.
4. Untick Tomato: only recipes using Cooked rice, Eggs and Onion appear.
5. Untick Onion, type "ban" in search and press Enter: a clear no-match message with swap buttons.
