# English with Marta · Angol Martával

**Internal project name:** *Mirella tante*
**Version:** 1.5.0

A personal, calm, **Duolingo-style English course built for one learner — Marta**, a Hungarian woman in her seventies. The course is organised around her real family, her online Hungarian teaching, and travel — so every lesson feels like *"learning English to connect with the people I love."*

- **Private & local-first.** Runs from a single HTML file. No server, no account, no external AI, no CDN, no tracking.
- **Offline.** Works from `file:///` after download. No required network request.
- **Bilingual EN–HU.** English is the learning language; Hungarian help is always one tap away.
- **Designed for an older adult.** Large text, high contrast, visible focus, no timers, no punitive hearts/streaks.
- **British English** text-to-speech (browser), optional microphone record/replay, optional experimental speech recognition.

## For Marta (the learner)

Open **`dist/Marta_English.html`** (or the file inside `MARTA_ENGLISH_APP_LEARNER_v1.5.zip`) by double-clicking it in **Chrome or Edge**. That's it. See `docs/USER_GUIDE_FOR_MARTA_EN_HU.md`.

## For the helper (Wim)

```bash
npm install          # installs playwright-core (only used for the browser test)
npm run build        # generate data + validate + build dist/Marta_English.html
npm run test         # headless Chromium smoke test from file://
npm run package      # create the learner + source ZIPs in releases/
npm run all          # build + test + package
```

The **single-file learner build is the primary delivery**. The `src/` tree is the maintainable source that compiles to it.

## What's in the box

| Area | Delivery |
|---|---|
| Learner app | `dist/Marta_English.html` (single file, ~600 KB) |
| Learner ZIP | `releases/MARTA_ENGLISH_APP_LEARNER_v1.5.zip` (HTML + start guide) |
| Source ZIP | `releases/MARTA_ENGLISH_APP_SOURCE_v1.5.zip` (reproducible) |
| Curriculum | 17 units, 103 micro-lessons + 1 monthly lesson |
| Vocabulary | 751 productive words, 246 chunks, 331 receptive (EVP-anchored) |
| Grammar | 27 functional spiral grammar cards (EGP A1) |
| Conversations | 21 branching guided dialogues (with variation & repair) |
| Pronunciation | 2-step path: 11 spelling-sound families + 16 sound/stress sets (no IPA) |
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
