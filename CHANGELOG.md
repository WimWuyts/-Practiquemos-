# Changelog

All notable changes to *English with Marta* (Mirella tante).

## [1.7.0] — 2026-07 — De-clunk & flow: 11-agent "feel" review acted on

The content was good, but the app felt *houterig* (clunky/stiff) and the layout a bit boring. An 11-agent review focused entirely on **feel, flow, motion and visual craft** (see `docs/REVIEW_TEAM_v2.md` and `docs/REVIEW_FINDINGS_AND_ACTIONS.md`) drove this release.

### Flow (the headline)
- **Auto-advance on correct recognition.** The six recognition activities (listen-choose, match, icon-choice, minimal-pair, gap-fill, odd-one-out) now move on ~0.9 s after a right answer, with a manual "Continue" escape — this removes about half the dead taps in every lesson and turns the stop-start *click-Continue-blank-new-screen* rhythm into a continuous flow. Wrong answers still wait for a deliberate tap. (Auto-advance is disabled under reduced-motion.)
- **One persistent lesson surface.** The lesson runner now draws its header once and **cross-fades each activity into the same stage** instead of wiping and rebuilding the whole screen — no more title flashing between steps.

### Feel & motion
- **A tasteful, reduced-motion-respecting motion system**: cards/stages fade-and-rise in, answer marks pop, wrong options nudge, the progress spine and progress ring ease, chat bubbles float in. Every animation is double-gated behind `prefers-reduced-motion` and the app's `data-motion="reduce"` setting.
- **Conversations feel alive.** Each partner line is now preceded by a short **"typing…" beat**, avatars are larger, and the jarring "Your turn" banner is gone in favour of a quiet "listen again" affordance.

### Visual craft (the "boring layout")
- **Warmer, layered visual identity**: a warm paper ground with soft radial light, elevated white cards with a hairline highlight, a serif display face (system fonts only) for headings, and a darkened clay accent that meets AA.
- **Illustrated scene bands.** New offline SVG header illustrations per theme (welcome, greeting/home, family table, travel, outdoors, online/teaching, airport sky) give each lesson a sense of *place* rather than a form.
- **Warmer lesson completion** with an animated check badge.

### Fixes
- The focused `<main>` no longer paints a stray full-width outline on navigation (focus kept for screen readers).

## [1.6.0] — 2026-07 — Speaking-first: 5-agent review acted on

A 5-agent critical review (pedagogy, exercises, speaking, UX, relevance) drove this release — see `docs/REVIEW_FINDINGS_AND_ACTIONS.md`.

### Speaking & production (the headline)
- **Marta now speaks on every turn.** New reusable speak widget (Hear it → Record me → Hear me → optional check). New **`say-it`** activity in all 103 lessons; **`expand`** ends by saying the full answer aloud; **every conversation turn** gets a "🎤 Say it" record step. Production rose from <11% to ~45% of activities; sentence-level speaking from <2% to present everywhere.

### Realistic exercises
- **Distractors are now same-theme + same part-of-speech** (no more "time" vs "rabbit"); wrong answers reveal the correct word; `odd-one-out` constrained to one part of speech.
- **Picture tasks only use words whose icon truly depicts them** (49-word "clearly depicts" set); borrowed icons (rabbit→cat…) are decoration only. Removed redundant recognition steps; lessons are shorter and end in production.

### One guided journey (UX)
- **Home is now one next step** ("Your next step" + optional "Warm up: N words"); the unit grid moved behind "Browse all lessons". Lesson completion deep-links to **Practise these words** / **Try a conversation**. Diagnostic routes into the first lesson. Unit pills show real progress (3/7). "Open conversations" string moved to i18n.

### Content & tone
- Removed childish praise aimed at Marta ("Ügyes vagy" → "Pontosan!"/"Szép munka"); praise she gives to child students kept.
- Added 2 more online-teaching sims (connection delay; a full lesson) → 4 total, and an **Endre laptop-help** scene. Dialogues 21 → 24; new avatars (Endre).

## [1.5.0] — 2026-07 — Practice hub: separate vocabulary, grammar & all sounds

### Added
- **Practice is now a proper hub** with dedicated, lesson-based sections:
  - **Practice vocabulary** — pick any unit/topic and drill its words (picture → word, listen & choose, match, type). Rosetta-flavored: picture & sound first, Hungarian optional.
  - **Practice grammar** — pick any of the 27 grammar points and do its guided card + check on demand.
  - **Practice sounds** — **all 16 sound sets are now here** (previously only the 11 spelling families showed), grouped as *The sounds*, *Stress & melody*, and *Spelling & sound*. Each sound also has a listen-and-choose minimal-pair drill where relevant.
- New routes `drill/<unit>`, `gram/<id>`, `snd/<id>`, `spell/<id>`.

### Fixed
- **Picture exercises now only use words with a clear, specific icon** (96 words), so "which word is this?" is never ambiguous; added ~20 new icons (animals, home, body, clothes, nature). Words without a distinct picture no longer appear in image-based tasks.

### Note
- A full "Rosetta Stone" (translation-free immersion) rebuild was deliberately **not** done: it would remove the Hungarian scaffolding an older beginner benefits from and that the brief requires. The best of that approach (picture + sound first, translation on demand) is offered as the vocabulary practice mode instead.

## [1.4.0] — 2026-07 — Reference addendum, monthly gift system, Hungarian polish

### Added
- **In-app "Word list & grammar" screen** (new nav entry): every word grouped by theme (English–Hungarian, with a listen button), all grammar cards, and all useful phrases — always current because it reads live from the data.
- **Auto-generated addendum** `docs/VOCABULARY_AND_GRAMMAR_ADDENDUM.md` — the full vocabulary + grammar + phrases, **regenerated on every build** (so it updates whenever a new monthly lesson is added).
- **Monthly gift system:** `docs/MONTHLY_LESSON_PLAN.md` with 12 lesson ideas tied to Marta's year (family events, seasons, travel, teaching); the Home screen surfaces available monthly lessons, and `month-01` is live as a worked example.

### Changed
- **Hungarian polish** pass on the most visible UI strings (native sign-off still recommended; all Hungarian remains centralised in `HUNGARIAN_REVIEW_QUEUE.csv`).

## [1.3.0] — 2026-07 — "Everything green": full contract coverage

Delivered in three waves; validator passes with **0 errors and 0 warnings**.

### Wave A — coverage to contract targets
- Productive words **699 → 751** (target 730–770), receptive **76 → 331** (320–380), chunks **137 → 246** (240–260).
- New exercise type: **listening comprehension** (family voice messages, airport/cabin announcements, teaching) with slow replay + one question.

### Wave B — lesson structure
- Micro-lessons **32 → 103**: the generator redistributes each unit's vocabulary into lessons of **≤8 new words** (contract: ≤10), keeping hand-authored anchor lessons and auto-generating practice lessons.

### Wave C — experience & completeness
- Guided conversations **14 → 21** (added Kira video call, Esztella visit, Martin, David, Panna, Christmas dinner at Aunt Eva's, Agárd summer party) with new family avatars (Eva, Ákos).
- **Conversation variation:** alternate opener lines so repeat sessions aren't identical.
- **Natural examples:** curated function/abstract words; safe grammatical fallback elsewhere.
- **First monthly lesson authored** (`month-01`, "A spring visit to Kira") — runnable from Home, demonstrating the extension workflow.

### Still requires a human
- **Hungarian native proofread** (`HUNGARIAN_REVIEW_QUEUE.csv`) — by definition a person's sign-off; all Hungarian is drafted and centralised for review.

## [1.2.0] — 2026-07 — Natural examples, full pronunciation coverage, more exercises

### Added — exercise variety (6 new types, 18 total)
- **Reorder** — put the words in the right order to build a useful sentence.
- **Gap-fill** — choose the missing word in a real sentence (built from each word's example).
- **Minimal pair** — hear one of a similar-sounding pair (west/vest, ship/sheep) and pick which; tied to the sounds step.
- **Icon → word** — see the picture, choose the English word.
- **Odd-one-out** — pick the word that doesn't belong (theme reinforcement).
- **Grow-your-answer** — expand a reply from one clause to three (from the source brief).

### Changed — content quality
- **Natural example sentences:** ~180 hand-written examples tied to Marta's world, plus a grammar-safe fallback (handles uncountables, aux/modal verbs). 588/699 words now have a natural or safe example; the remaining 111 are flagged in the review queue.
- **Full pronunciation coverage guaranteed:** a build-time completeness pass + validator gate ensure **all 16 sound-focus sets and all 11 spelling-sound families** appear in at least one lesson. Each activity shows its step (Step 1 sounds / Step 2 spelling / Step 3 stress).
- **Chunks expanded 65 → 137** — more survival, question, opinion, plan, travel, teaching and family frames.

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
