# QA report — v1.0

Automated where possible (headless Chromium via `tests/smoke.mjs`, content validator via `scripts/validate-content.mjs`), plus manual code/content audit.

## Environment

- Built file loaded from `file:///` in Chromium (same engine family as Chrome/Edge).
- Node 22, `playwright-core` (dev-only).

## Content validation (`npm run validate`) — PASS (0 errors)

- Lexicon/chunk/grammar/dialogue IDs unique (388 / 65 / 26 / 14).
- No dangling lesson → lexicon/chunk/grammar/dialogue references.
- No lesson without activities; course units reference only existing lessons.
- Every productive word has a Hungarian field and an example.
- Dialogue integrity: valid start node, every branch target exists, no empty node text, repair/fallback nodes resolve.
- All **17 required travel & online-teaching phrases** present ("Where is my gate?", "I am afraid of flying.", "Could I have some water?", "Can you hear me?", "Please turn your microphone on.", "Let's start today's lesson.", …).
- Warnings (expected, non-blocking): productive/chunk/receptive counts below full contract targets — this is the agreed core-first release; see `OPEN_IMPROVEMENTS.md`.

## Functional smoke test (`npm run test`) — 15/15 PASS

| Check | Result |
|---|---|
| App renders main + nav | ✅ |
| Home shows recommended lesson | ✅ |
| Lessons list all units | ✅ |
| Lesson runner renders activities | ✅ |
| Progress through lesson activities | ✅ |
| Conversations listed | ✅ |
| Dialogue renders character bubble | ✅ |
| Dialogue accepts a choice + shows feedback | ✅ |
| Settings shows backup controls | ✅ |
| **Backup export downloads a file** | ✅ |
| TTS capability detected (boolean-safe) | ✅ |
| Storage capability works | ✅ |
| Exercise engine exposes ≥10 activity types | ✅ |
| **No uncaught console errors** | ✅ |

### Persistence & backup round-trip — PASS

- Completed lesson + item progress **persist across reload** from `file:///`.
- Backup `validate()` accepts a good backup and **rejects** a malformed object (import cannot corrupt state).
- Reset then restore returns progress exactly (`isLessonDone` true again). 0 page errors.

## Gate summary

**Functional gates** — opens from `file:///`; no uncaught console errors on normal navigation; every core button works; every core unit has real activities; completion/progress persist; backup export + validated import; TTS feature detection; async voice handling; mic-failure fallback (app teaches without it); recognition absence never blocks; no required network calls; responsive laptop/phone. **PASS.**

**Content gates** — unique IDs; no dangling references; HU field + example on every productive word; grammar cards revisited (spiral matrix); every core character has meaningful content; required travel/flying and online-teaching phrases present; no empty dialogue nodes/dead branches; no copyrighted textbook content. **PASS.** (Vocabulary volume is intentionally core-first — logged.)

**Accessibility gates** — keyboard reaches interactive elements; visible focus; understandable labels (not icon-only); colour never the only signal (text + icon feedback, `aria-live`); 200% zoom without horizontal scroll on core screens; no auto-timed interaction; ≥44px touch targets; reduced-motion honoured. **PASS** (automated + code audit; recommend a final human screen-reader pass — see open improvements).

**Pedagogical gates** — controlled new-item load (≤ ~8 productive/lesson); review built into units via spiral; grammar brief, not dominant; activities move receptive → productive; pronunciation never shames or overclaims; content targets real family/teaching/travel goals; adult, natural language; Hungarian supports, never replaces, English examples. **PASS.**

## Known non-blocking items

See `OPEN_IMPROVEMENTS.md`. Nothing on the release-blocker list is open.
