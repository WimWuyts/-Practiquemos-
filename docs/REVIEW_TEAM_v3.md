# Design team v3 — "Rosetta for Marta: the productive turn" (8 agents)

Purpose: the app holds a lot of content, but **does too little with it**. Owner feedback: *"Lots of words, but so little is done with them — Marta only points and speaks; nowhere is a word typed in. Grammar is offered very sparsely per category with barely any exercises. Pronunciation: the framework is there but little variation in exercises."* Vision: *"make a kind of Rosetta Stone, but specifically for Marta's situation."*

Unlike the v1.6/v1.7 panels (review-only), this was a **design-and-build** team: read-only agents producing buildable specs + renderer sketches, synthesized by the orchestrator into the v1.8 implementation and shipped.

## The eight

- **A1 · Rosetta-method analyst** — what makes Rosetta feel good, and the borrowings that fit a bilingual 70+ learner (the per-item see→tap→type→say→reuse ladder).
- **A2 · Productive-vocabulary & typing architect** — the `word-fill` typed-gap, deriving from each word's example; the production ladder; forgiving matching.
- **A3 · Grammar-exercise designer** — a per-point practice bank (choose-form / type-form / transform / build / error-fix / say) and the `gr-type`/`gr-fix` renderers.
- **A4 · Pronunciation-variety designer** — say-the-pair, shadowing, sound-sort; a redesigned soundDrill that adapts to available data.
- **A5 · Practice-hub & drill-flow redesigner** — drills as smooth multi-step sessions; Quick practice; progressive disclosure; growth without streaks.
- **A6 · Older-adult productive-skills specialist** — how much typing at 70+, the scaffold ladder, matching tolerance rules, session length, non-punitive tone.
- **A7 · Data & engine feasibility** — per-type implementation cost, the silent-skip and generated-i18n risks, the build/validate/test sequence and new gates.
- **A8 · Marta-relevance content lead** — the character & setting bible and a seed sentence set so every new item is about her real family/travel/teaching life.

## Converged plan (as shipped in v1.8)

1. **Guardrails first** — validator `KNOWN_TYPES` whitelist (unknown types used to render nothing), i18n keys in the generator (the JSON is regenerated), and a forgiving-match fix with a separate strict `exact` for grammar forms.
2. **`word-fill`** typed-gap + scaffold ladder (type-or-tap, hint, always-succeeds), derived from every word's example.
3. **Grammar practice bank** (108 items / 27 points) + `gr-type`/`gr-fix`; `grammarDrill` and lessons spend it.
4. **Pronunciation variety** — `shadow`, `minimal-pair-say`, `sound-sort`; soundDrill runs hear→discriminate→produce.
5. **Item-picker + drill re-sequencing + Quick practice + growth caption** so all 751 words cycle through production.

All constraints preserved: offline single file, no external fonts/CDN/AI, 70+ accessibility, reduced-motion, bilingual Hungarian help.
