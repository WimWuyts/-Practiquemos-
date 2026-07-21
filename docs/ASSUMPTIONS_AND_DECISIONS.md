# Assumptions & decisions log

Decisions made autonomously per the build contract, plus the one scoping choice confirmed with the helper.

## Confirmed with the helper (Wim)

- **D-01 · Release scope = core-first (recommended).** Because the release was needed quickly, v1.0 delivers the **complete engine, architecture, accessibility, backup and the full extensible data model**, with the first units and all core conversations fully authored and a **fully-wired core corpus** (325 productive words, 65 chunks, 63 receptive). The full contract counts (≈750/250/350) are supported by the pipeline and scheduled as content growth, not engine work. See `OPEN_IMPROVEMENTS.md`.
- **D-02 · Docs language.** Marta's start guide is **Hungarian + English**; helper/technical docs are **English**.

## Product & pedagogy

- **D-03 · British English** is the TTS model; app never depends on a named OS voice — it prefers any `en-GB` voice and falls back gracefully.
- **D-04 · No IPA** anywhere in the learner view. Pronunciation is taught via *hear → see → build → repeat → record → replay → use*, spelling-sound families, and gentle "listen and notice" sound-focus sets.
- **D-05 · No score.** Diagnostic and progress use warm labels (New, Practising, Becoming familiar, Ready to use, Review soon). No CEFR labels shown; A1 used only as an internal can-do frame.
- **D-06 · No punitive mechanics** — no hearts, streaks, countdowns, buzzers, or big red crosses. Feedback is calm and uses text + icon, never colour alone.
- **D-07 · One learner, private.** Real first names are used (the app is private to Marta). Source reference photos are **not** embedded; an original vector avatar was created instead (`src/assets/marta-avatar.svg`).
- **D-08 · `have/has`** chosen as the single consistent possession model (over `have got`) for A1 clarity.
- **D-09 · Present-simple vs continuous** taught as a light functional contrast only.
- **D-10 · Open conversation area** is visible but gently gated ("best after a few weeks"); a Settings toggle unlocks it early.

## Technical

- **D-11 · Vanilla HTML/CSS/JS**, no framework, no build-time dependency required to *run*. The single file has no ES modules, no `fetch`, no service worker, no external font/CDN. `playwright-core` is a **dev-only** dependency used purely for the smoke test.
- **D-12 · Data is generated** from curated bilingual source lists by deterministic Node scripts, then inlined into the single file. This keeps Hungarian centralised and reviewable and guarantees schema-consistent metadata (distractors, spelling families, review lessons).
- **D-13 · Storage namespace** `martaEnglish.*` with schema version + migration hook. Because `file:///` storage is not guaranteed, visible export/import backup is provided and encouraged.
- **D-14 · Recordings** are kept in memory only, tracks are released after each recording, and are cleared when leaving the activity. Never uploaded.
- **D-15 · Speech recognition** is feature-detected, optional and experimental; it can never block a lesson and never marks a pronunciation "wrong".

## Content integrity

- **D-16 · No textbook content copied.** All explanations, examples, exercises and prompts are original, informed only by general A1 pedagogy.
- **D-17 · Family relationships** follow the source brief exactly (Endika–Kira, Marlene–David, nieces Kira/Esztella/Mirella, Peter–Esztella, Martin/David in Switzerland, Panna/Emma, Margó/Endre, Ákos, Aunt Eva). No invented family conflict.
- **D-18 · Hungarian is machine-drafted** and explicitly flagged for human review in `HUNGARIAN_REVIEW_QUEUE.csv` (617 rows). It is coherent enough to release but should be proofread.
