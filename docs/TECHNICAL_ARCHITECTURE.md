# Technical architecture

## Overview

Vanilla HTML/CSS/JS single-page app. A modular `src/` tree compiles to one self-contained `dist/Marta_English.html` with all CSS, data (JSON), SVG and JS inlined. No modules, no `fetch`, no service worker, no external resources — so it opens from `file:///` in Chrome/Edge with zero setup.

## Runtime module map (global `M` namespace)

Concatenation order equals dependency order (see `scripts/build-single-html.mjs`):

| File | Responsibility |
|---|---|
| `assets/icons.js` | inline SVG icon set (always paired with text labels) |
| `app/dom.js` | DOM helpers, data accessors (`M.get.*`), text matching (`M.match.*`), toast |
| `app/store.js` | settings, progress, item skill-dimensions, storage + migration, `martaEnglish.*` namespace |
| `app/i18n.js` | `t()` (EN), `hu()` (HU help), `label()` (bilingual menu labels) |
| `app/capabilities.js` | feature detection → friendly messages |
| `engines/review.js` | transparent spaced review, gentle status labels |
| `engines/audio.js` | British TTS (async `voiceschanged`), MediaRecorder record/replay, optional recognition |
| `app/backup.js` | JSON export/import with validation |
| `app/diagnostic.js` | friendly, score-free diagnostic |
| `engines/exercise.js` | 12+ data-driven activity renderers + calm feedback |
| `engines/conversation.js` | dialogue graph engine, 3 support styles, repair branches |
| `app/ui.js` | screen renderers (home, lessons, lesson runner, conversations, practice, settings, help) |
| `app/router.js` | hash router + accessible appbar/nav |
| `app/main.js` | bootstrap: index data, apply settings, init audio, start router |

## Data model

Data is emitted by `scripts/generators/*` and bundled at build time into `window.MARTA_DATA` and `window.MARTA_I18N`.

- **Lesson** — `id`, `unitId`, `order`, `title{en,hu}`, `canDo{en,hu}`, `newProductiveItems[]`, `reviewItems[]`, `chunks[]`, `grammarCards[]`, `pronunciationFocus[]`, `conversationId`, `activities[]`, `completionRule`.
- **Lexicon** — `id`, `headword`, `hu`, `partOfSpeech`, `status`, `level`, `themes[]`, `firstLesson`, `reviewLessons[]`, `examples[]`, `tts`, `pronunciationGroup`, `spellingFamily`, `acceptedForms[]`, `distractors[]`, `notes`.
- **Chunk** — `id`, `intention`, `en`, `hu`, `register`, `firstLesson`, `variants[]`, `slots[]`, `acceptedForms[]`.
- **Grammar** — `id`, `unitId`, `title{en,hu}`, `purpose`, `explanation{en,hu}`, `examples[]`, `useWhen`, `check{question,answer}`.
- **Dialogue** — `id`, `characterId`, `scene{en,hu}`, `supportLevels[]`, `startNode`, `memorySchema`, `nodes{}` where each node has `speaker`, `text{en,hu}`, `tts`, and a `response` of mode `choose|build|type|end` with choices/blocks/accepted/keywords/hints/modelAnswer/next/fallbackNode.
- **Progress** — appVersion, schemaVersion, completedLessons, activityAttempts, per-item skill dimensions (meaning/listening/written/spoken/contexts/seen/next), conversations, diagnostic, monthly.

Validation gates live in `scripts/validate-content.mjs` (unique IDs, no dangling references, required phrases, dialogue reachability, field completeness).

## Audio

- **TTS:** `speechSynthesis` + `SpeechSynthesisUtterance`; loads voices on `voiceschanged` with retries; prefers `en-GB`; normal + slow rate; cancels queued speech before each example; safe fallback message if no suitable voice.
- **Recording:** `getUserMedia` + `MediaRecorder`; permission requested only on a record press; clear recording state; tracks released on stop; in-memory `blob:` URL revoked on clear; never uploaded.
- **Recognition:** `SpeechRecognition`/`webkitSpeechRecognition` feature-detected, optional, never blocking.

## Storage & backup

Keys: `martaEnglish.appSettings`, `martaEnglish.progress`, `martaEnglish.reviewQueue`, `martaEnglish.monthlyContent`. Schema version + `M.migrate()` hook. All writes wrapped in try/catch so a `file:///` storage failure degrades gracefully. Export produces a human-readable JSON backup (app version, schema version, export date, settings, progress); import validates `_type` and structure before an atomic replace.

## Accessibility

Semantic HTML, keyboard-operable nav, visible focus ring, `aria-live` for short feedback, 20px base text (scalable to A++), ≥44–48px touch targets, no colour-only signals, no auto-advance/timers, reduced-motion support, 200% zoom without horizontal scroll on core screens.

## Performance

Single file ~384 KB. Lesson content mounts per-activity (not all at once); conversation data is looked up lazily on entry; audio streams and speech events are cleaned up to avoid leaks; TTS is used instead of shipping base64 audio.

## Build & reproducibility

`npm run build` → generate data/i18n/docs → validate → inline into `dist/`. `npm run package` → learner + source ZIPs. Deterministic: same source in, same file out.
