# DOC-02 · Judge Runbook (60 seconds)

| # | Time | Action | Expected output |
|---|---|---|---|
| 1 | 0:00 | Starting state: page loads. Home Mode, no filters, Cooked rice, Eggs, Onion and Tomato ticked. | Ranked recipe cards, each with a match badge and a zero-waste score sticker. |
| 2 | 0:06 | Type "pan" in the search bar and press Enter. | Paneer is ticked. Paneer Bhurji appears in the list. |
| 3 | 0:12 | Set Meal type to Breakfast. | Only breakfast recipes stay. Set it back to All. |
| 4 | 0:18 | Open the top recipe. Click "Add missing to shopping list" if shown, then "Start Cook Mode". Press Next twice, then Exit. | Cook Mode shows one big step at a time, with From your pantry and Still needed side by side. |
| 5 | 0:30 | Switch to Restaurant Mode. | Cards show plated names and "Why it works"; ranking changes to flavour pairing first. |
| 6 | 0:36 | Click "Surprise me: 3 random ingredients". | Three random ingredients are ticked and matching recipes appear. |
| 7 | 0:42 | Twist: switch back to Home Mode, click Clear all, turn on the Three-ingredient lock. Pick Cooked rice, Eggs and Onion. | With fewer than 3 picked the app says how many are left to pick. With 3, only recipes using all three show, tagged "Uses all 3". |
| 8 | 0:52 | Untick Onion and tick Ripe banana. | "No recipe uses all three" with the closest recipes and one-tap swap buttons. Tap a swap and recipes come back. |

## Simulated features

- Shopping list: a note on this device only. "Copy list" copies plain text.
- Restaurant Mode flair ratings are set by the team.
- The cookie banner stores your choice in local storage; no cookies are set.
- All recipes and ingredients are sample data.
