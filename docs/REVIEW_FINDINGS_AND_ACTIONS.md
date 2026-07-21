# Critical review (5-agent panel) & actions — v1.6

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
