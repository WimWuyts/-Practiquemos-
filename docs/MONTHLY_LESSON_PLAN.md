# Monthly gift-lesson plan (12 lessons)

A one-lesson-per-month "gift" for Marta, following the year and her real life — the family abroad (Denmark, Prague, Belgium, Switzerland), online teaching, travel, and the recurring family events from the brief. Each lesson spirals earlier language and adds a small, useful step. Author them one at a time with `docs/MONTHLY_LESSON_AUTHORING_GUIDE.md`; after each build the in-app **Word list** and `docs/VOCABULARY_AND_GRAMMAR_ADDENDUM.md` update automatically.

| # | Month | Real-life trigger | Characters | Can-do focus | Grammar spiral |
|---|---|---|---|---|---|
| **month-01** | March | A spring visit to Kira in Denmark *(built — live example)* | Kira | Plan a visit, talk on a video call | `going to` |
| **month-02** | April | Spring at home; inviting the family over | Margó, Endre | Describe the home, invite people, offer food | `there is/are`, imperatives |
| **month-03** | May | Mother's Day video calls with the nieces | Kira, Esztella, Mirella | Say thank you, express feelings warmly | present simple, `like/love + -ing` |
| **month-04** | June | Planning the Lake Balaton summer party | whole family | Make arrangements, quantities, shopping for food | `some/any`, `much/many` |
| **month-05** | July | The Lake Balaton party day | Endika, Marlene, Margó | Small talk, meet partners, talk about the weather | `be`/questions review, adjectives |
| **month-06** | August | Agárd summer *szalonnasütő* barbecue | Ákos, Endika | Offer food, tell what happened, enjoy the evening | past simple (`was/were`, regulars) |
| **month-07** | September | Back to online teaching, new school year | students, parents | Classroom English, fix tech problems, praise | imperatives, `can/could` requests |
| **month-08** | October | Mirella's autumn work trip stories | Mirella | Ask about past experiences, hotels & travel | past simple questions, irregulars |
| **month-09** | November | Booking a flight to visit Kira | airport/airline staff | Book & manage a flight, handle flying nerves | `need to`/`have to`, polite requests |
| **month-10** | December | Christmas dinner at Aunt Eva's | Eva, Marlene | Greetings, gifts, toasts, describe the food | present continuous, `would like` |
| **month-11** | January | New Year, winter, staying well | family | Talk about plans and health, winter weather | `going to`, prepositions of time |
| **month-12** | February | Peter & Esztella visit; family news | Peter, Esztella, Emma | Get to know someone, give opinions, compare | comparatives, opinion frames |

## Notes
- Each lesson reuses existing characters, dialogues and vocabulary where possible; only genuinely new words go into `scripts/generators/lexicon-extra*.mjs` so the addendum stays complete.
- Keep the tone warm and adult; tie every lesson to a real moment in Marta's year.
- Suggested cadence: release one on the first weekend of each month as the "gift".
- Workflow per lesson: author JSON → `npm run build` (regenerates addendum + grammar overview) → `npm run test` → `npm run package` → give Marta the new HTML (remind her to back up first).
