# English with Marta · Angol Martával

**Internal project name:** *Mirella tante*
**Version:** 1.0.0 (core-first stable release)

A personal, calm, **Duolingo-style English course built for one learner — Marta**, a Hungarian woman in her seventies. The course is organised around her real family, her online Hungarian teaching, and travel — so every lesson feels like *"learning English to connect with the people I love."*

- **Private & local-first.** Runs from a single HTML file. No server, no account, no external AI, no CDN, no tracking.
- **Offline.** Works from `file:///` after download. No required network request.
- **Bilingual EN–HU.** English is the learning language; Hungarian help is always one tap away.
- **Designed for an older adult.** Large text, high contrast, visible focus, no timers, no punitive hearts/streaks.
- **British English** text-to-speech (browser), optional microphone record/replay, optional experimental speech recognition.

## For Marta (the learner)

Open **`dist/Marta_English.html`** (or the file inside `MARTA_ENGLISH_APP_LEARNER_v1.0.zip`) by double-clicking it in **Chrome or Edge**. That's it. See `docs/USER_GUIDE_FOR_MARTA_EN_HU.md`.

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
| Learner app | `dist/Marta_English.html` (single file, ~384 KB) |
| Learner ZIP | `releases/MARTA_ENGLISH_APP_LEARNER_v1.0.zip` (HTML + start guide) |
| Source ZIP | `releases/MARTA_ENGLISH_APP_SOURCE_v1.0.zip` (reproducible) |
| Curriculum | 17 units (Unit 0 diagnostic + 16 topic units), 32 micro-lessons |
| Vocabulary | 325 productive words, 65 chunks, 63 receptive items (fully wired) |
| Grammar | 26 functional spiral grammar cards |
| Conversations | 14 branching guided dialogues with repair paths |
| Pronunciation | 7 spelling-sound families + 6 sound-focus sets (no IPA shown) |
| Docs | see `docs/` |

> **Scope note:** v1.0 is a deliberate **core-first release** (see the decision log). The engine, data schema and authoring pipeline are complete and support scaling to the full contract vocabulary targets by extending the curated source lists and rebuilding. See `docs/OPEN_IMPROVEMENTS.md`.

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
