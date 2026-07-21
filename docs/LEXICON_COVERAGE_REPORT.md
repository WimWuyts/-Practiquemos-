# Lexicon coverage report

Generated from source data. Hungarian is machine-drafted and flagged in `HUNGARIAN_REVIEW_QUEUE.csv`.

## Counts (v1.0, core-first release)

| Category | Count | Contract target | Status |
|---|---|---|---|
| Productive individual words | 325 | 730–770 | core subset, fully wired |
| Productive chunks / frames | 65 | 240–260 | core subset, fully wired |
| Additional receptive items | 63 | 320–380 | core subset |

The v1.0 release delivers a **fully-wired core corpus** (every item appears in real lessons, exercises and/or conversations) rather than the full contract count. The engine, schema and authoring pipeline support scaling to the full targets by extending the source lists in `scripts/generators/lexicon-source.mjs` and `chunks-source.mjs` and re-running the build. See `OPEN_IMPROVEMENTS.md`.

## Coverage rules

- Each productive word appears in first lesson + spiral review lessons + generated activities.
- Productive items with fewer than 3 encounters: **1** (target: 0; addressed as the corpus grows).
- Every productive word has a Hungarian field and at least one example.

## By theme

| Theme | Productive | Receptive |
|---|---|---|
| airport | 9 | 6 |
| colours | 5 | 0 |
| conversation | 18 | 0 |
| countries | 16 | 0 |
| daily-life | 18 | 1 |
| family | 36 | 6 |
| feelings | 9 | 4 |
| flying | 4 | 7 |
| food | 26 | 4 |
| greetings | 18 | 0 |
| hobbies | 12 | 5 |
| home | 11 | 3 |
| hotel | 5 | 5 |
| identity | 24 | 0 |
| numbers | 15 | 0 |
| opinions | 9 | 1 |
| past | 8 | 0 |
| phone | 4 | 2 |
| plans | 6 | 0 |
| services | 8 | 3 |
| shopping | 4 | 2 |
| teaching | 5 | 0 |
| technology | 8 | 6 |
| time | 16 | 0 |
| town | 9 | 4 |
| transport | 7 | 1 |
| travel | 9 | 3 |
| weather | 6 | 0 |

## Distractor / spelling metadata

- All productive items carry 2–3 distractors for recognition tasks.
- Spelling-family metadata assigned where a word belongs to a taught family (7 families).
