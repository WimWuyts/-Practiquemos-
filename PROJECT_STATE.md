# Project state

**Project:** Mirella tante — English with Marta
**Version:** 1.3.0
**Status:** ✅ Stable core-first release. All release-blocking gates pass.
**Date:** 2026-07

## What is done

- [x] Inputs read (source brief, avatar reference, web source register, master prompt).
- [x] Decisions locked (`docs/ASSUMPTIONS_AND_DECISIONS.md`).
- [x] Curriculum: 17 units, 103 micro-lessons + 1 monthly lesson, spiral review (`docs/CURRICULUM_MATRIX.csv`).
- [x] Lexicon 751 productive + 331 receptive, chunks 246, all with HU + examples + distractors (`docs/LEXICON_COVERAGE_REPORT.md`).
- [x] Grammar: 27 functional bilingual spiral cards (EGP A1) (`docs/GRAMMAR_SPIRAL_MATRIX.csv`).
- [x] Pronunciation: 2-step path — 11 spelling-sound families + 16 sound/stress sets, no IPA shown; word-builder engine.
- [x] Conversations: 21 branching guided dialogues, 3 support levels, repair paths, opener variation.
- [x] Exercise engine: 18 reusable data-driven activity types (incl. reorder, gap-fill, minimal-pair, icon-choice, odd-one-out, answer-expansion) + calm feedback.
- [x] Adaptive (deterministic) conversation engine with memory schema + variation support.
- [x] Bilingual EN–HU UI, central i18n, `Magyar segítség` control, help modes.
- [x] TTS (British, async voice handling), record/replay, optional experimental recognition.
- [x] Progress, spaced review, backup export/import (validated), reset with confirm, migration hook.
- [x] Responsive + accessible styling (older-adult focused, WCAG 2.2 AA-oriented).
- [x] Single-file build `dist/Marta_English.html` (~384 KB, offline, file://).
- [x] Content validator (0 errors) + headless browser smoke test (15/15).
- [x] All required docs + two release ZIPs.

## Deliverables checklist (contract §22)

1. [x] `dist/Marta_English.html`
2. [x] `MARTA_ENGLISH_APP_SOURCE_v1.0.zip` (releases/)
3. [x] `MARTA_ENGLISH_APP_LEARNER_v1.0.zip` (releases/, HTML + start guide)
4. [x] `README.md`
5. [x] `PROJECT_STATE.md`
6. [x] `CHANGELOG.md`
7. [x] `docs/ASSUMPTIONS_AND_DECISIONS.md`
8. [x] `docs/CURRICULUM_MATRIX.csv`
9. [x] `docs/LEXICON_COVERAGE_REPORT.md`
10. [x] `docs/GRAMMAR_SPIRAL_MATRIX.csv`
11. [x] `docs/HUNGARIAN_REVIEW_QUEUE.csv`
12. [x] `docs/MONTHLY_LESSON_AUTHORING_GUIDE.md`
13. [x] `docs/TECHNICAL_ARCHITECTURE.md`
14. [x] `docs/USER_GUIDE_FOR_MARTA_EN_HU.md`
15. [x] `docs/HELPER_UPDATE_AND_BACKUP_GUIDE.md`
16. [x] `docs/QA_REPORT.md`
17. [x] `docs/OPEN_IMPROVEMENTS.md`
18. [x] source data, scripts and tests to rebuild.

## Scope note

v1.0 is a **core-first** release: full engine + architecture + a fully-wired core corpus. Vocabulary volume is below the full contract targets by design (agreed with helper) and grows via the generator pipeline — see `docs/OPEN_IMPROVEMENTS.md`. No engine work remains to reach full breadth.

## Rebuild

`npm install && npm run all` → build, test, package.
