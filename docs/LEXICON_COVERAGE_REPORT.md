# Lexicon coverage report

Generated from source data. Hungarian is machine-drafted and flagged in `HUNGARIAN_REVIEW_QUEUE.csv`.

## A1 coverage — anchoring

Vocabulary is anchored to the **English Vocabulary Profile (EVP)** A1 core, prioritised by general frequency, and cross-checked against Marta's real-life themes. Grammar is anchored to the **English Grammar Profile (EGP)** A1 inventory. Together these form the internal coverage matrix that guarantees the app covers A1, with a small, deliberate layer of A2 "beginnings" where real life needs it (travel, past, plans, polite requests). A2 items are flagged internally and never labelled to Marta.

## Counts (v1.1)

| Category | Count | Note |
|---|---|---|
| Productive individual words | 699 | A1: 623 · A2: 76 |
| Productive chunks / frames | 137 | fully wired |
| Additional receptive items | 76 | listening/reading support |

Every item appears in real lessons, exercises and/or conversations. The vocabulary target (~700) is met; chunks and receptive items grow via the same generator pipeline (see `OPEN_IMPROVEMENTS.md`).

## EVP × EGP internal matrix (summary)

Each A1 grammar point (EGP) is paired with the vocabulary domains (EVP) that exercise it. This matrix is the internal reference used to confirm A1 coverage; it is acted upon, not shipped as a learner file.

| A1 grammar (EGP) | Exercised by vocabulary domains (EVP) |
|---|---|
| be / pronouns / questions | identity, family, countries |
| a/an, plurals, this/that | family, home, food |
| possessives, have/has | family, home |
| present simple, do/does, frequency | daily-life, home |
| there is/are, prepositions of place | home, town |
| some/any, much/many | food, shopping |
| can/can't, imperatives | town, transport, teaching |
| would like, could you/I | food, services, hotel, flying |
| present continuous, going to | plans, travel, phone |
| like/love + -ing, comparatives | hobbies, opinions |
| was/were, past simple | past, travel, family |
| need to / have to | travel, airport |

## Coverage rules

- Each productive word appears in first lesson + spiral review lessons + generated activities.
- Productive items with fewer than 3 encounters: **18** (target: 0; addressed as the corpus grows).
- Every productive word has a Hungarian field and at least one example.

## By theme

| Theme | Productive | Receptive |
|---|---|---|
| airport | 9 | 9 |
| body | 13 | 0 |
| clothes | 9 | 0 |
| colours | 10 | 0 |
| conversation | 52 | 1 |
| countries | 16 | 0 |
| daily-life | 36 | 1 |
| family | 50 | 5 |
| feelings | 17 | 4 |
| flying | 5 | 11 |
| food | 57 | 2 |
| greetings | 19 | 0 |
| health | 10 | 0 |
| hobbies | 27 | 5 |
| home | 26 | 3 |
| hotel | 2 | 7 |
| identity | 32 | 0 |
| numbers | 33 | 0 |
| opinions | 40 | 1 |
| past | 8 | 0 |
| phone | 7 | 2 |
| plans | 7 | 0 |
| services | 12 | 5 |
| shopping | 14 | 1 |
| teaching | 19 | 0 |
| technology | 14 | 6 |
| time | 40 | 1 |
| town | 54 | 6 |
| transport | 13 | 3 |
| travel | 19 | 3 |
| weather | 29 | 0 |

## Distractor / spelling metadata

- All productive items carry 2–3 distractors for recognition tasks.
- Spelling-family metadata assigned where a word belongs to a taught family (11 families).
