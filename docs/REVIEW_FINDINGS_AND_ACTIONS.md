# Critical review panels & actions

---

## v1.7 — "De-clunk & flow" panel (11 agents)

Brief: the content was good, but the app felt **houterig** (clunky/stiff), lacked the *natural flow* that makes Rosetta Stone feel good, and the **layout was a bit boring**. Eleven read-only reviewers examined feel, flow, motion and visual craft (see `docs/REVIEW_TEAM_v2.md` for the full briefings). Their findings converged; the highest-impact, non-conflicting recommendations were implemented in one coherent pass and shipped as **v1.7**.

### Converged findings → actions

1. **Stop-start rhythm (P0, cluster A + C).** Every recognition step ended with a manual *Continue → blank → new screen* beat, doubling the taps and killing momentum.
   - **Done:** `advance(mount, ok, goNext)` helper auto-advances ~0.9 s after a correct recognition answer (manual "Continue" escape kept; wrong answers still wait). Wired into all six recognition renderers. Disabled under reduced-motion.

2. **Whole-screen wipes between activities (P0, cluster A4).** The lesson runner cleared and rebuilt the header + stage on every step, so the title flashed and the surface never felt continuous.
   - **Done:** Header drawn once; each activity **cross-fades into a single persistent stage**; the progress spine and ring ease rather than jump.

3. **No motion / static & abrupt (P0, cluster A2).**
   - **Done:** A reduced-motion-respecting motion system — stage/card fade-and-rise, answer-mark pop, wrong-option nudge, bubble-in for chat, eased progress ring (`@property --p`). Double-gated behind `prefers-reduced-motion` **and** `data-motion="reduce"`.

4. **Dialogues felt like a quiz, not a conversation (P1, cluster C2).**
   - **Done:** A short **"typing…" beat** before each partner line, **larger avatars**, and the jarring "Your turn" banner replaced with a quiet "listen again" affordance.

5. **Boring, flat layout (P1, cluster B).**
   - **Done:** Warm layered paper ground with soft radial light; elevated cards with a hairline highlight; a **serif display face** for headings (system fonts only); AA-safe clay accent; **illustrated per-theme SVG scene bands** (welcome, greeting, family, travel, outdoors, online, sky) so a lesson reads as a *place*; animated completion badge.

6. **Focus/scroll jank (P2, cluster A4).**
   - **Done:** The focused `<main>` no longer paints a stray full-width outline on navigation (focus kept for screen readers via `#main:focus{outline:none}`).

All fixes preserve the hard constraints: offline single file, no external fonts/CDN, reduced-motion support, 70+ contrast & target sizes, bilingual Hungarian help.

---

## v1.6 — Speaking-first panel (5 agents)

A panel of five independent reviewers examined the whole app against the founding premise (speaking confidence for Marta to connect with her family, teach online, travel, and beat fear of flying). Below: what they found, and what was changed.

## Panel

1. Pedagogy & trajectory · 2. Exercise & distractor quality · 3. Speaking & conversations · 4. UX flow & integration · 5. Content relevance.

## Findings → actions

### 1. Too receptive; speaking almost absent (P0, all reviewers)
- **Found:** ~68% of activities were tap-to-choose; genuine production <11%; sentence-level speaking <2%. The `type-speak` conversation level was a dead label — nowhere did Marta actually speak. `expand` (the "speaking expansion") only displayed sentences.
- **Done:** New reusable **speak widget** (Hear it → Record me → Hear me → optional check). New **`say-it`** activity on **every lesson**. **`expand`** now ends by saying the full answer aloud. **Every conversation turn** now has a "🎤 Say it" step (hear the model, record yourself, compare, continue). Production is now ~45% of activities and speaking appears in all 103 lessons + all 24 dialogues.

### 2. Unrealistic distractors — "time" next to "rabbit" (P0)
- **Found:** `listen-choose`/`icon-choice` drew distractors from the whole 1082-word lexicon by part-of-speech only, ignoring theme; the pre-computed same-theme `distractors` field was dead code for these types.
- **Done:** New `M.get.distractorWords()` uses each item's same-theme+POS distractors first. Wrong-answer feedback now reveals the correct word. `odd-one-out` constrained to one part of speech.

### 3. Misleading pictures (P1)
- **Found:** picture tasks flagged words like rabbit→cat, cow→dog, tea→cup, horse→star as "specific," so the picture didn't match the word.
- **Done:** `iconSpecific` now derives from an explicit "clearly depicts" set (49 words); only those appear as picture-choice targets. Others keep the icon for decoration only.

### 4. "Loose stones" — no single daily loop (P0, UX)
- **Found:** Home was a dashboard of five co-equal blocks; review was invisible; areas were siloed; the diagnostic dead-ended into the busy Home; the unit pill showed a meaningless index.
- **Done:** Home is now **one next step** ("Your next step" + optional "Warm up: N words" review), with the full unit grid moved behind a "Browse all lessons" link. Lesson completion now deep-links to **Practise these words** and **Try a conversation**. The diagnostic routes straight into the first lesson. Unit pills show real progress (e.g. 3/7). Hardcoded "Open conversations" string moved to i18n with a Settings button.

### 5. Content: tone & teaching gap (P0/P1, relevance)
- **Found:** App feedback praised Marta with "Ügyes vagy" — childish, and she's a *teacher*. Online-teaching sims (her daily reality, contract wants ≥4) numbered only 2; Endre (tech help) had no scene.
- **Done:** Adult praise to Marta ("Pontosan!", "Szép munka") — child-directed praise she gives *to students* kept. Added **2 more student sims** (connection delay; a full lesson start-to-finish) → 4 total, and an **Endre laptop-help** scene. Dialogues now 24.

## Deferred (noted, not blocking)
- Deeper conversation **memory callbacks** and more `withAlts` variation across all 24 dialogues.
- **Resume-in-progress** lesson pointer (Continue currently reopens the last finished lesson).
- Optionally merge the Reference tab into Practice to reduce nav to 6 items.
- Trim EVP filler vocabulary in favour of more of Marta's-life words.
