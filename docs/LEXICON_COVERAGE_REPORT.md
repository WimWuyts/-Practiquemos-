# Lexicon coverage report

Generated from source data. Hungarian is machine-drafted and flagged in `HUNGARIAN_REVIEW_QUEUE.csv`.

## A1 coverage — anchoring

Vocabulary is anchored to the **English Vocabulary Profile (EVP)** A1 core, prioritised by general frequency, and cross-checked against Marta's real-life themes. Grammar is anchored to the **English Grammar Profile (EGP)** A1 inventory. Together these form the internal coverage matrix that guarantees the app covers A1, with a small, deliberate layer of A2 "beginnings" where real life needs it (travel, past, plans, polite requests). A2 items are flagged internally and never labelled to Marta.

## Counts (v1.1)

| Category | Count | Note |
|---|---|---|
| Productive individual words | 751 | A1: 646 · A2: 105 |
| Productive chunks / frames | 246 | fully wired |
| Additional receptive items | 331 | listening/reading support |

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
- Productive items with fewer than 3 encounters: **22** (target: 0; addressed as the corpus grows).
- Every productive word has a Hungarian field and at least one example.

## By theme

| Theme | Productive | Receptive |
|---|---|---|
| airport | 9 | 26 |
| body | 13 | 8 |
| clothes | 9 | 11 |
| colours | 10 | 0 |
| conversation | 55 | 9 |
| countries | 16 | 0 |
| daily-life | 40 | 1 |
| family | 50 | 18 |
| feelings | 20 | 8 |
| flying | 5 | 24 |
| food | 66 | 20 |
| greetings | 19 | 0 |
| health | 10 | 17 |
| hobbies | 33 | 11 |
| home | 32 | 26 |
| hotel | 2 | 25 |
| identity | 32 | 0 |
| numbers | 33 | 0 |
| opinions | 42 | 1 |
| past | 8 | 0 |
| phone | 8 | 2 |
| plans | 7 | 0 |
| services | 12 | 16 |
| shopping | 17 | 7 |
| teaching | 19 | 10 |
| technology | 15 | 18 |
| time | 40 | 7 |
| town | 60 | 26 |
| transport | 16 | 16 |
| travel | 21 | 12 |
| weather | 32 | 12 |

## Distractor / spelling metadata

- All productive items carry 2–3 distractors for recognition tasks.
- Spelling-family metadata assigned where a word belongs to a taught family (11 families).
