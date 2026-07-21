# Open improvements (post-v1.0)

> **v1.3 status:** the count and structure gates are all **green** — 751 productive words, 246 chunks, 331 receptive, 103 micro-lessons, 21 conversations, full pronunciation coverage, 0 validator errors/warnings. The only item that cannot be auto-completed is the **Hungarian native proofread** (human sign-off). The points below are further polish.



None of these are release blockers. They are the planned path from the core-first v1.0 to the full contract breadth.

## Content growth (highest value)

1. **Vocabulary to full contract targets.** Grow productive words 325 → ~750, chunks 65 → ~250, receptive 63 → ~350 by extending `scripts/generators/lexicon-source.mjs` and `chunks-source.mjs`, then `npm run build`. Metadata (distractors, spelling families, review lessons, activities) is generated automatically.
2. **Micro-lessons 32 → ~80.** Split the existing units into more 15–20 min micro-lessons and add depth to Units 9, 10, 12, 13, 16 (currently 2 lessons each). The lesson generator already scales.
3. **More conversations & variation.** Add the remaining minimum-set dialogues (Kira video call, Esztella visit, Martin hobbies, David tech, Panna horses, extra online-student/parent sims, Christmas dinner, Agárd summer party) and add variation sets so repeat sessions differ. Engine supports it today.
4. **Ensure every productive item reaches ≥3 encounters and ≥2 exercise types** as the corpus grows (validator already reports the under-3 count).

## Language quality

5. **Hungarian human review.** `docs/HUNGARIAN_REVIEW_QUEUE.csv` is machine-drafted. A native proofread of UI strings, translations, and grammar explanations before wide use.
6. **Example sentences:** ~180 are now hand-written and tied to Marta's world; the remaining **111** productive words still use a grammar-safe template (flagged in the validator). Curate natural examples for those during the HU review pass.
7. **Chunks:** now 137 (was 65). Grow toward the ~250 target and add dialogue placements. Receptive items (76) can also grow toward ~350.

## Accessibility & UX polish

7. **Human screen-reader pass** (NVDA/VoiceOver) and a keyboard-only walkthrough of every activity type on real Chrome + Edge.
8. **Voice quality:** optionally let the helper pin a specific preferred `en-GB` voice per machine.

## Engine niceties

9. **Conversation memory** variables (`memorySchema`) are wired in the schema but lightly used; add prewritten callbacks that reuse a remembered fact ("You said you like cooking…").
10. **Monthly lessons:** author `month-01` as a worked example and extend the validator to cover `src/data/monthly-lessons/`.
11. **Optional accent exposure** in listening (clearly marked) after a phrase is known — deferred from v1 per contract.

## How to pick this up

Everything above is content or polish on a finished engine. Edit the generator source lists or add JSON, run `npm run build && npm run test && npm run package`. No architectural work required.
