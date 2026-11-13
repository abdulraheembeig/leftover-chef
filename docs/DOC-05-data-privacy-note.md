# DOC-05 · Data & Privacy Note

## Fields the app stores

| Field | Where | When |
|---|---|---|
| Banner choice (remember on/off, date) | localStorage key lc-consent | After you answer the cookie banner |
| Ticked ingredient IDs | localStorage key lc-state | Only if you opt in |
| Shopping list ingredient IDs | lc-state | Only if you opt in |
| Mode (home / restaurant) and filters | lc-state | Only if you opt in |

No names, emails, phone numbers, locations or any other personal data are asked for or stored.

## Demo and mocked data

Every ingredient and recipe is sample data written by the team in js/data.js. The shopping list, flair ratings and "Copy list" are local-only features with no connection to any shop or service.

## Secrets

The app has no API keys, tokens, passwords or .env file, and makes no network requests. Fonts (Alfa Slab One and Instrument Sans, SIL Open Font License) are bundled with the app, so nothing is loaded from other websites.
