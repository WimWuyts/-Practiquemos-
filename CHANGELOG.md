# Changelog

All notable changes to *English with Marta* (Mirella tante).

## [1.1.0] — 2026-07 — Visual redesign + vocabulary to ~700 (Phase 2)

### Changed — visual identity ("Rustig & modern", direction C)
- New calm-modern look: off-white ground, one deep teal accent, soft shadows, larger rounded cards.
- Redesigned Home: hero with progress **ring**, gradient "recommended" card, and a **theme-tile grid** — each unit with its own icon well, colour and progress ring.
- **Family faces:** original vector avatars for every character (Endika, Marlene, Kira, Esztella, Mirella, Peter, Emma, Martin, David, Panna, Margó + roles). Conversations now show the character's face beside each bubble; conversation list shows who you'll talk to.

### Added — content & pedagogy
- **Vocabulary expanded to ~700 productive words** (699: 623 A1 + 76 A2), EVP-anchored and frequency-prioritised, across all A1 topic domains (body, health, clothes, home, food, town, nature, animals, jobs, verbs, adjectives, function words, numbers, months…). A2 "beginnings" are flagged internally, never shown to Marta.
- **Vocabulary icons:** every word carries an icon (concrete word → own icon, otherwise theme icon), shown on word cards.
- **Pronunciation reworked into a two-step path** (after *English Pronunciation in Use*): **Step 1 — the sounds** (keyword-anchored, no IPA; short/long vowels, th, w/v, h, sh/ch/j, ng, r, final consonants, -s/-ed endings), **Step 2 — spelling ↔ sound** (magic-e, ee/ea, igh, oo, ph, wh, -tion, ar/or, with honest "not always" cautions), plus a stress & melody strand. Each activity shows its step.
- **Grammar:** added the A1 comparatives card (closing the last EGP A1 gap → 27 cards), and every grammar activity now leads with a compact **grammar box** (pattern + example + "use this when") above the fuller card.
- Internal **EVP × EGP coverage matrix** now documented in the lexicon coverage report as the reference that the app covers A1 (with A2 beginnings).

## [1.0.0] — 2026-07 — First stable release (core-first)

### Added
- Single-file offline learner app `dist/Marta_English.html` (Chrome/Edge, `file:///`, no install, no network).
- Modular `src/` source tree with a deterministic data/i18n/docs generation pipeline and a single-file build script.
- **Curriculum:** 17 units (Unit 0 friendly diagnostic + 16 topic units), 32 micro-lessons, spiral review.
- **Vocabulary:** 325 productive words, 65 chunks/frames, 63 receptive items — each with Hungarian, examples, distractors, spelling-family and review metadata.
- **Grammar:** 26 brief, bilingual, functional spiral cards with a tiny check each.
- **Pronunciation:** 7 spelling-sound families (word-builder engine) + 6 gentle sound-focus sets. No IPA in the learner view.
- **Conversations:** 14 branching guided dialogues (family, airport, plane, restaurant, hotel, online teaching) with three support levels (Choose / Build / Say-or-type) and human-like repair branches.
- **Exercise engine:** 12+ reusable data-driven activity types with calm, non-punitive feedback (text + icon, never colour alone).
- **Audio:** British TTS with async voice loading and safe fallback; microphone record/replay (in-memory, never uploaded); optional experimental speech recognition.
- **Bilingual EN–HU** interface with central localisation, `Magyar segítség` control, and three help-density modes.
- **Progress & storage:** namespaced local storage with schema version + migration hook; transparent spaced review with gentle status labels; validated backup export/import; reset with confirmation.
- **Accessibility:** older-adult UX — large scalable text, high contrast, visible focus, ≥44–48px targets, keyboard operation, `aria-live` feedback, reduced-motion, 200% zoom safe, no timers/streaks/hearts.
- **Avatar:** original non-photorealistic vector avatar of Marta (source photos never embedded).
- **Docs:** architecture, learner guide (EN+HU), helper update/backup guide, monthly-lesson authoring guide, curriculum matrix, lexicon coverage report, grammar spiral matrix, Hungarian review queue (617 rows), QA report, open improvements, decision log.
- **QA:** content validator (0 errors) and headless-Chromium smoke test (15/15), persistence and backup round-trip verified.
- **Releases:** learner ZIP (HTML + bilingual start guide) and reproducible source ZIP.

### Notes
- Conversation engine is honest **deterministic guided/adaptive practice**, not generative AI.
- v1.0 is a deliberate core-first scope; vocabulary breadth grows via the generator pipeline (see `docs/OPEN_IMPROVEMENTS.md`).
