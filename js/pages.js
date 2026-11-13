/* =========================================================================
 * Leftover Chef — POLICY PAGES + DOCUMENTATION CARDS (DOC-01 to DOC-06)
 * One source of truth: the app shows these as pages, and
 * `node scripts/build-docs.js` writes the same text to docs/*.md.
 *
 * Block types: ["h", text] ["p", text] ["ul", [..]] ["ol", [..]]
 *              ["table", [headers], [[row], ..]] ["img", src, alt] ["code", text]
 * ========================================================================= */
var LC = (window.LC = window.LC || {});

(function () {
  var C = LC.Config;
  var nRecipes = LC.Data.RECIPES.length, nIng = LC.Data.INGREDIENTS.length;
  function contactLines() {
    var out = [C.team + ", " + C.event, C.venue];
    if (C.email) out.push("Email: " + C.email);
    if (C.phone) out.push("Phone: " + C.phone);
    return out;
  }

  /* ---------------- Policy pages ---------------- */
  LC.Pages = {
    privacy: {
      title: "Privacy Policy",
      blocks: [
        ["p", "Last updated: " + C.policiesUpdated + ". This policy covers the Leftover Chef prototype."],
        ["h", "What we collect"],
        ["p", "Nothing is sent to us or to anyone else. The app has no accounts, no sign-up forms, no analytics, no ads and no tracking. It does not call any external service, and its fonts are stored with the app."],
        ["h", "What stays in your browser"],
        ["ul", [
          "Your cookie-banner choice (always, so we don't ask again).",
          "Your ticked ingredients, shopping list, mode and filters, only if you tick \"Remember my picks\" in the cookie banner.",
        ]],
        ["p", "This data lives in your browser's local storage on your device. We cannot see it."],
        ["h", "How to delete it"],
        ["p", "Use \"Reset demo data\" in the footer, change your choice in \"Cookie settings\", or clear your browser's site data."],
        ["h", "Children"],
        ["p", "The app collects no personal data from anyone, including children."],
        ["h", "Contact"],
        ["ul", contactLines()],
      ],
    },
    terms: {
      title: "Terms & Conditions",
      blocks: [
        ["p", "Last updated: " + C.policiesUpdated + "."],
        ["h", "What this is"],
        ["p", "Leftover Chef is a free prototype built during a 90-minute hackathon. It suggests recipes from a fixed list written by our team."],
        ["h", "Using the recipes"],
        ["ul", [
          "Recipes are general home-cooking ideas, not professional, medical or nutrition advice.",
          "Check every ingredient for allergies and dietary needs before cooking. The app only marks dishes as veg or non-veg.",
          "Use your own judgement on food safety: smell and check leftovers, and reheat cooked rice and chicken until steaming hot.",
          "Prep times and the zero-waste score are estimates.",
        ]],
        ["h", "No warranty"],
        ["p", "The app is provided as is, without any guarantee that it is error-free or always available."],
        ["h", "Changes"],
        ["p", "We may update these terms. The date at the top shows the latest version."],
        ["h", "Contact"],
        ["ul", contactLines()],
      ],
    },
    refunds: {
      title: "Refund Policy",
      blocks: [
        ["p", "Last updated: " + C.policiesUpdated + "."],
        ["p", "Leftover Chef is free. There are no payments, subscriptions or in-app purchases, so there is nothing to refund."],
        ["p", "The shopping list is a note for you. It does not buy anything or connect to any shop."],
        ["p", "If paid features are ever added, this page will be updated before any payment is taken."],
        ["h", "Contact"],
        ["ul", contactLines()],
      ],
    },
    cookies: {
      title: "Cookies Policy",
      blocks: [
        ["p", "Last updated: " + C.policiesUpdated + "."],
        ["p", "Leftover Chef sets no cookies and loads nothing from other websites. It uses your browser's local storage, which works like a cookie but never leaves your device."],
        ["table", ["Key", "Type", "What it holds", "When"], [
          ["lc-consent", "Essential", "Your banner choice and the date", "After you choose in the banner"],
          ["lc-state", "Optional", "Ticked ingredient IDs, shopping list IDs, mode, filters", "Only if you tick \"Remember my picks\""],
        ]],
        ["h", "Changing your choice"],
        ["p", "Click \"Cookie settings\" in the footer at any time. Turning off \"Remember my picks\" deletes lc-state straight away. \"Reset demo data\" deletes both keys."],
      ],
    },
  };

  /* ---------------- Documentation cards ---------------- */
  var shots = [
    ["proof/1-pick-ingredients.png", "Leftover Chef home screen with Cooked rice, Eggs, Onion and Tomato ticked and a ranked list of recipe cards showing match badges and zero-waste scores."],
    ["proof/2-recipe-detail-and-score.png", "Recipe detail for Egg Fried Rice showing the challenge timer, the zero-waste score breakdown and an ingredient list marked have, need to buy or optional."],
    ["proof/3-cook-mode.png", "Cook Mode showing one large step at a time, with From your pantry and Still needed lists side by side."],
    ["proof/4-three-ingredient-lock-match.png", "Three-ingredient lock turned on with exactly Cooked rice, Eggs and Onion picked, showing only recipes that use all three."],
    ["proof/5-three-ingredient-lock-no-match.png", "Three-ingredient lock with Cooked rice, Eggs and Ripe banana picked, showing a no-match explanation with the closest recipes and swap buttons."],
    ["proof/6-restaurant-mode.png", "Restaurant Mode with plated dish names, why-it-works flavour notes and plating tips on each recipe card."],
  ];

  LC.Docs = [
    {
      id: "DOC-01", slug: "readme-quickstart", title: "README & Quickstart",
      blocks: [
        ["h", "Purpose"],
        ["p", "Leftover Chef helps a household use up leftovers before they spoil. Tick what is left, and the app matches it to " + nRecipes + " practical recipes, shows what is missing, and gives each recipe a zero-waste score. Built for OWASP NIE VibeSprint 1.0, problem card PS-03."],
        ["h", "Features"],
        ["ul", [
          "Ingredient tag board (" + nIng + " ingredients) plus a search bar with autocomplete (arrow keys + Enter).",
          "Quick filters: diet, cooking time, meal type (Breakfast, Lunch, Dinner, Snacks, Dessert) and equipment (stove, blender).",
          "Match badges such as \"67% match · 1 item missing\", missing-item alerts and a shopping list.",
          "Zero-waste score (0-100) with a visible breakdown.",
          "Cook Mode: one step at a time, with \"From your pantry\" and \"Still needed\" side by side.",
          "Home Mode (use up food that spoils fast) and Restaurant Mode (flavour pairings, plated names, plating tips, \"Surprise me\" random basket).",
          "Twist: Three-ingredient lock. Pick exactly three; see recipes that use all three or a clear reason why none do.",
          "Privacy, Terms, Refund and Cookies pages, and a cookie banner with an opt-in checkbox.",
        ]],
        ["h", "Setup (no secrets)"],
        ["ol", [
          "Download or clone this folder.",
          "Open index.html in any modern browser, or double-click dist/leftover-chef.html (the whole app in one file). Nothing to install; no API keys, no .env file, no internet needed.",
          "Optional: run node tests/engine.test.js to check the logic.",
        ]],
        ["h", "Demo data"],
        ["p", "All data is sample data written by the team in js/data.js: " + nIng + " ingredients, " + nRecipes + " recipes and a list of kitchen staples. The app starts with Cooked rice, Eggs, Onion and Tomato ticked so there is something to see straight away."],
        ["h", "Zero-waste score"],
        ["ul", [
          "Up to 70 points for how many of your ticked leftovers the recipe uses. Items that spoil fast count 3x, medium 2x, long-lasting 1x.",
          "Up to 30 points for how many of the recipe's main items you already have. Staples (salt, oil, spices) are assumed.",
          "80+ Zero-waste hero, 50-79 Good save, under 50 Partial save.",
        ]],
        ["h", "Screenshots"],
      ].concat(shots.map(function (s) { return ["img", s[0], s[1]]; })).concat([
        ["h", "Known limitations"],
        ["ul", [
          "Fixed list of " + nRecipes + " recipes; quantities do not scale with servings.",
          "Only veg / non-veg is tracked, not allergens.",
          "Restaurant Mode ranks by a flair rating (1-5) set by the team, not by reviews.",
          "The shopping list stays on this device; it does not order anything.",
        ]],
        ["h", "30-second judge click-path"],
        ["ol", [
          "See the starting list: Egg Fried Rice is near the top with a match badge and score.",
          "Open it, then Start Cook Mode, press Next, then Exit.",
          "Turn on the Three-ingredient lock: you are asked to pick exactly 3.",
          "Untick Tomato: only recipes using Cooked rice, Eggs and Onion appear.",
          "Untick Onion, type \"ban\" in search and press Enter: a clear no-match message with swap buttons.",
        ]],
      ]),
    },
    {
      id: "DOC-02", slug: "judge-runbook", title: "Judge Runbook (60 seconds)",
      blocks: [
        ["table", ["#", "Time", "Action", "Expected output"], [
          ["1", "0:00", "Starting state: page loads. Home Mode, no filters, Cooked rice, Eggs, Onion and Tomato ticked.", "Ranked recipe cards, each with a match badge and a zero-waste score sticker."],
          ["2", "0:06", "Type \"pan\" in the search bar and press Enter.", "Paneer is ticked. Paneer Bhurji appears in the list."],
          ["3", "0:12", "Set Meal type to Breakfast.", "Only breakfast recipes stay. Set it back to All."],
          ["4", "0:18", "Open the top recipe. Click \"Add missing to shopping list\" if shown, then \"Start Cook Mode\". Press Next twice, then Exit.", "Cook Mode shows one big step at a time, with From your pantry and Still needed side by side."],
          ["5", "0:30", "Switch to Restaurant Mode.", "Cards show plated names and \"Why it works\"; ranking changes to flavour pairing first."],
          ["6", "0:36", "Click \"Surprise me: 3 random ingredients\".", "Three random ingredients are ticked and matching recipes appear."],
          ["7", "0:42", "Twist: switch back to Home Mode, click Clear all, turn on the Three-ingredient lock. Pick Cooked rice, Eggs and Onion.", "With fewer than 3 picked the app says how many are left to pick. With 3, only recipes using all three show, tagged \"Uses all 3\"."],
          ["8", "0:52", "Untick Onion and tick Ripe banana.", "\"No recipe uses all three\" with the closest recipes and one-tap swap buttons. Tap a swap and recipes come back."],
        ]],
        ["h", "Simulated features"],
        ["ul", [
          "Shopping list: a note on this device only. \"Copy list\" copies plain text.",
          "Restaurant Mode flair ratings are set by the team.",
          "The cookie banner stores your choice in local storage; no cookies are set.",
          "All recipes and ingredients are sample data.",
        ]],
      ],
    },
    {
      id: "DOC-03", slug: "five-test-checklist", title: "Five-Test Checklist",
      blocks: [
        ["p", "Run these by hand before demoing. Each was run on 13 November 2026 in Chromium by an automated script (tests/e2e.py) and passed, on both index.html and the single-file build."],
        ["table", ["#", "Type", "Steps", "Expected"], [
          ["1", "Invalid input", "Turn on the Three-ingredient lock. Click Clear all and tick only 2 ingredients. Then type \"zzz\" in search and press Enter.", "\"Pick exactly 3 ingredients (2 of 3 picked)\" and no recipes. Search says no ingredient matches \"zzz\"."],
          ["2", "Happy path", "Load the page with the default picks. Open the first recipe and start Cook Mode.", "Ranked recipes with match badges. Detail shows ingredients, steps, prep time and score breakdown. Cook Mode opens at Step 1."],
          ["3", "Twist check", "Lock on. Pick Cooked rice, Eggs and Onion. Then swap Onion for Ripe banana.", "First: only recipes using all three, tagged \"Uses all 3\". Then: no-match message with the closest recipes and swap buttons."],
          ["4", "Reset / refresh", "Tick some extra items and add a shopping-list item. Click \"Reset demo data\". Then refresh the page.", "Picks go back to the 4 defaults, the shopping list is empty, and the cookie banner shows again. After refresh, the same defaults load."],
          ["5", "Boundary case", "With the lock on, try to tick a 4th ingredient. Then turn the lock off and set Vegetarian + 10 min + Dessert.", "The 4th chip is disabled. With strict filters: \"Your filters hide every match\" and a Clear filters button that restores results."],
        ]],
      ],
    },
    {
      id: "DOC-04", slug: "user-quickstart", title: "User Quickstart",
      blocks: [
        ["ol", [
          "Tell us what's left. Tick ingredients on the board, or type in the search bar and press Enter. Ingredients with a dot spoil fast.",
          "Narrow it down (optional). Pick a diet, time limit, meal type or the equipment you have. Choose Home Mode to use up food first, or Restaurant Mode for chef-style ideas.",
          "Pick a recipe. Each card shows how well it matches (\"100% match\" or \"1 item missing\") and its zero-waste score. Open a card to see steps, add missing items to your shopping list, or start Cook Mode.",
          "If something goes wrong: if there are no recipes, read the message and tap a suggestion or \"Clear filters\". If it says \"pick exactly 3\", the Three-ingredient lock is on. If search finds nothing, check the spelling. To start over, click \"Reset demo data\" in the footer.",
        ]],
      ],
    },
    {
      id: "DOC-05", slug: "data-privacy-note", title: "Data & Privacy Note",
      blocks: [
        ["h", "Fields the app stores"],
        ["table", ["Field", "Where", "When"], [
          ["Banner choice (remember on/off, date)", "localStorage key lc-consent", "After you answer the cookie banner"],
          ["Ticked ingredient IDs", "localStorage key lc-state", "Only if you opt in"],
          ["Shopping list ingredient IDs", "lc-state", "Only if you opt in"],
          ["Mode (home / restaurant) and filters", "lc-state", "Only if you opt in"],
        ]],
        ["p", "No names, emails, phone numbers, locations or any other personal data are asked for or stored."],
        ["h", "Demo and mocked data"],
        ["p", "Every ingredient and recipe is sample data written by the team in js/data.js. The shopping list, flair ratings and \"Copy list\" are local-only features with no connection to any shop or service."],
        ["h", "Secrets"],
        ["p", "The app has no API keys, tokens, passwords or .env file, and makes no network requests. Fonts (Alfa Slab One and Instrument Sans, SIL Open Font License) are bundled with the app, so nothing is loaded from other websites."],
      ],
    },
    {
      id: "DOC-06", slug: "handoff-limitations", title: "Handoff & Limitations",
      blocks: [
        ["h", "Core files"],
        ["table", ["File", "What it does"], [
          ["index.html", "Page structure: header, board, filters, results, dialogs, footer"],
          ["js/config.js", "Team contact details and default picks"],
          ["js/data.js", "Ingredients, staples, recipes, meal types, equipment, Restaurant Mode notes"],
          ["js/engine.js", "Matching, match %, zero-waste score, filters, modes, search, random basket"],
          ["js/twists.js", "Twist plug-ins (Three-ingredient lock, Nothing to buy) and a template"],
          ["js/storage.js", "Consent-first local storage"],
          ["js/pages.js", "Policy pages and DOC-01 to DOC-06 (also exported to docs/*.md)"],
          ["js/app.js", "UI: rendering, search, Cook Mode, shopping list, cookie banner, routing"],
          ["dist/leftover-chef.html", "The whole app in one file (built by scripts/build-single.py); runs with a double-click"],
          ["scripts/", "build-docs.js (writes README.md and docs/*.md) and build-single.py"],
          ["fonts/", "Alfa Slab One and Instrument Sans (SIL Open Font License)"],
          ["tests/", "engine.test.js (logic, Node) and e2e.py (the five tests in a browser)"],
        ]],
        ["h", "Where the logic lives"],
        ["ul", [
          "Score: evaluate() in js/engine.js.",
          "Filters, modes and the no-match explanations: run() in js/engine.js.",
          "Three-ingredient lock: js/twists.js. Add a new twist by copying the template at the bottom.",
        ]],
        ["h", "Resetting demo data"],
        ["p", "Click \"Reset demo data\" in the footer. It clears both storage keys and restores the default picks from js/config.js."],
        ["h", "Mocked elements"],
        ["ul", [
          "Recipe and ingredient data (sample, not from a database).",
          "Flair ratings used by Restaurant Mode.",
          "Shopping list (not connected to a store).",
          "Footer contact shows the team, event and venue only. Email and phone are left blank on purpose (build rules 02 and 04: no personal data or real contact details in the submission).",
        ]],
        ["h", "Top three improvements for a real launch"],
        ["ol", [
          "A larger, reviewed recipe database with allergen tags, serving sizes and food-safety notes.",
          "Optional accounts with sync across devices, built and reviewed against OWASP ASVS.",
          "Usability and screen-reader testing with real households, plus Kannada and Hindi translations.",
        ]],
      ],
    },
  ];

  /* ---------------- Renderers ---------------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  LC.renderBlocksHTML = function (blocks) {
    return blocks.map(function (b) {
      switch (b[0]) {
        case "h": return "<h3>" + esc(b[1]) + "</h3>";
        case "p": return "<p>" + esc(b[1]) + "</p>";
        case "ul": return "<ul>" + b[1].map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>";
        case "ol": return "<ol>" + b[1].map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ol>";
        case "code": return "<pre><code>" + esc(b[1]) + "</code></pre>";
        case "img": return '<figure><img src="' + esc(b[1]) + '" alt="' + esc(b[2]) + '" loading="lazy"><figcaption>' + esc(b[2]) + "</figcaption></figure>";
        case "table": return '<div class="table-wrap"><table><thead><tr>' + b[1].map(function (h) { return '<th scope="col">' + esc(h) + "</th>"; }).join("") +
          "</tr></thead><tbody>" + b[2].map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + esc(c) + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table></div>";
      }
      return "";
    }).join("");
  };
  LC.renderBlocksMD = function (blocks) {
    var cell = function (c) { return String(c).replace(/\|/g, "\\|"); };
    return blocks.map(function (b) {
      switch (b[0]) {
        case "h": return "## " + b[1];
        case "p": return b[1];
        case "ul": return b[1].map(function (x) { return "- " + x; }).join("\n");
        case "ol": return b[1].map(function (x, i) { return (i + 1) + ". " + x; }).join("\n");
        case "code": return "```\n" + b[1] + "\n```";
        case "img": return "![" + b[2] + "](" + b[1] + ")";
        case "table": return "| " + b[1].map(cell).join(" | ") + " |\n|" + b[1].map(function () { return "---"; }).join("|") + "|\n" +
          b[2].map(function (r) { return "| " + r.map(cell).join(" | ") + " |"; }).join("\n");
      }
      return "";
    }).join("\n\n");
  };
})();
