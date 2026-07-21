# English with Marta · Angol Martával

**Internal project name:** *Mirella tante*
**Version:** 1.9.1

A personal, calm, **Duolingo-style English course built for one learner — Marta**, a Hungarian woman in her seventies. The course is organised around her real family, her online Hungarian teaching, and travel — so every lesson feels like *"learning English to connect with the people I love."*

- **Private & local-first.** Runs from a single HTML file. No server, no account, no external AI, no CDN, no tracking.
- **Offline.** Works from `file:///` after download. No required network request.
- **Bilingual EN–HU.** English is the learning language; Hungarian help is always one tap away.
- **Designed for an older adult.** Large text, high contrast, visible focus, no timers, no punitive hearts/streaks.
- **British English** text-to-speech (browser), optional microphone record/replay, optional experimental speech recognition.

## For Marta (the learner)

Open **`dist/Marta_English.html`** (or the file inside `MARTA_ENGLISH_APP_LEARNER_v1.9.zip`) by double-clicking it in **Chrome or Edge**. That's it. See `docs/USER_GUIDE_FOR_MARTA_EN_HU.md`.

## For the helper (Wim)

```bash
npm install          # installs playwright-core (only used for the browser test)
npm run build        # generate data + validate + build dist/Marta_English.html
npm run test         # headless Chromium smoke test from file://
npm run package      # create the learner + source ZIPs in releases/
npm run all          # build + test + package
```

The **single-file learner build is the primary delivery**. The `src/` tree is the maintainable source that compiles to it.

### Reviewer / demo build

Reviewer mode adds a fixed **`Skip ▸`** button (bottom-right) that advances the current step, so you can page through the whole course (diagnostic, lessons, drills, dialogues) without answering. A "REVIEWER MODE" badge marks it; the button hides on plain navigation screens. Three ways to turn it on:

- **Settings → Reviewer mode** (a toggle; persists in this browser) — works in the normal `Marta_English.html`.
- Add `#review` to the URL of the normal file.
- Open **`dist/Marta_English_REVIEW.html`** — the same app with the mode baked in (also emitted by `npm run build`).

The learner never sees it unless the toggle is switched on (it defaults off).

## What's in the box

| Area | Delivery |
|---|---|
| Learner app | `dist/Marta_English.html` (single file, ~1.1 MB) |
| Learner ZIP | `releases/MARTA_ENGLISH_APP_LEARNER_v1.9.zip` (HTML + start guide) |
| Source ZIP | `releases/MARTA_ENGLISH_APP_SOURCE_v1.9.zip` (reproducible) |
| Curriculum | 17 units, 103 micro-lessons + 1 monthly lesson |
| Vocabulary | 751 productive words, 246 chunks, 331 receptive (EVP-anchored) |
| Productive practice | Typed **word-fill** (type the word in a real sentence, forgiving matching, type-or-tap scaffolds) — in lessons, the vocab drill, and **Quick practice** |
| Grammar | 27 functional spiral grammar cards (EGP A1) + **108 practice items** (choose-form, type-form, spot-the-error, build, say-it) |
| Conversations | 24 dialogues, spoken role-play (records every turn) |
| Pronunciation | 2-step path: 11 spelling-sound families + 16 sound/stress sets (no IPA); exercises span hear → discriminate → **say it yourself** |
| Reference | In-app **Word list & grammar** screen (live) + `docs/VOCABULARY_AND_GRAMMAR_ADDENDUM.md` (auto-generated) |
| Monthly gifts | `docs/MONTHLY_LESSON_PLAN.md` (12 ideas); `month-01` live |
| Docs | see `docs/` |

> **Scope note:** v1.1 meets the ~700 productive-word target (EVP A1-anchored). Chunks and receptive items still grow via the generator pipeline — see `docs/OPEN_IMPROVEMENTS.md`.

## Project layout

```
src/            modular source (styles, app, engines, data, i18n, assets)
scripts/        generators (data/i18n/docs), single-file build, validator, packager
tests/          headless browser smoke test
docs/           architecture, guides, matrices, review queues, QA
dist/           built single-file learner app
releases/       versioned ZIP snapshots
```

Honesty note: the conversation engine is **deterministic guided/adaptive conversation practice**, not generative AI.
