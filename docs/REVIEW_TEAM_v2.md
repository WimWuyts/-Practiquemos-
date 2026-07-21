# Review team v2 — "de-clunk & flow" panel (12 agents)

Purpose: the content is good, but the app feels **houterig (clunky/stiff)**, lacks **natural flow** (the reason Rosetta Stone feels good), and the **layout is a bit boring**. This larger panel is aimed at *feel, flow, motion and visual craft* — not content coverage (already reviewed in v1.6, see `REVIEW_FINDINGS_AND_ACTIONS.md`).

How to run tomorrow: launch all 12 as background `general-purpose` subagents (one message, multiple tool uses), each with the prompt below. They are read-only reviewers (no edits). Collect their prioritized findings, then agent #12 (or the orchestrator) synthesizes into one ranked "de-clunk & flow" plan; implement in a single coherent pass and ship as v1.7.

**Shared context to prepend to every prompt:**
> Read-only review (do NOT edit files). App: "English with Marta" — offline, single-file, bilingual EN–HU English course for Marta (Hungarian woman, 70s, retired teacher, teaches Hungarian online; wants speaking confidence to talk with family abroad, teach online, travel, beat fear of flying). Built with vanilla HTML/CSS/JS; source in /home/user/-Practiquemos-/src (styles/, app/, engines/, assets/), built file dist/Marta_English.html, contract at /tmp/claude-0/-home-user--Practiquemos-/66cb70dd-d7a0-50a0-ab2c-b0a8dcf4f926/scratchpad/handoff/MARTA_CLAUDE_CODE_HANDOFF_v1.0/CLAUDE_CODE_MASTER_BUILD_PROMPT_v1.0.md. OWNER FEEDBACK DRIVING THIS REVIEW: the app feels "houterig" (clunky/stiff), lacks the *natural flow* that makes Rosetta Stone feel good, and the layout is "a bit boring". Constraints that must survive: offline single file, no external fonts/CDNs, 70+ accessibility (large text, high contrast, visible focus, reduced-motion support, no timers), bilingual with Hungarian help on demand. OUTPUT: a concise prioritized markdown list — [P0/P1/P2] title — evidence (file/line/area) — concrete recommendation — and end with your single highest-impact change. Keep under ~500 words. Your final message is data for the orchestrator, not shown to the user.

---

## Cluster A — Flow & feel (the core of "houterig")

**A1 · Interaction-flow & pacing.** Focus: how one activity flows into the next; the stop-start rhythm (click Continue → blank → new screen) vs. seamless progression. Read src/app/ui.js (lessonRunner, runActivities), src/engines/exercise.js (how each renderer ends and hands off), src/app/router.js. Key question: where does the rhythm stall, and how do we make activity→activity feel continuous (auto-advance where safe, inline reveal instead of full clears, a persistent progress spine)?

**A2 · Motion & micro-interactions.** Focus: the app has almost no transitions/animation; it feels static and abrupt. Read src/styles/*.css (transitions), exercise.js/conversation.js (DOM swaps). Recommend a *tasteful, reduced-motion-respecting* motion system: enter/exit transitions for cards, answer-feedback animation, button press states, bubble-in for chat, progress-ring easing. Say exactly which elements and which CSS.

**A3 · Rosetta-Stone benchmark.** Focus: explicitly compare against Rosetta's model — image+audio immersion, no jarring context switches, progressive reveal, minimal chrome, "one continuous surface". Read exercise.js (icon-choice, say-it), conversation.js. Map which Rosetta principles fit Marta (bilingual, 70+) and which don't, and the 3 concrete borrowings that would most reduce "clunkiness" without dropping Hungarian scaffolding.

**A4 · Front-end "de-clunk" (technical stiffness).** Focus: where clunkiness is a code smell. Read src/app/dom.js (clear/render), ui.js (dom.clear(main) on every route), router.js (full re-render + window.scrollTo(0,0) + main.focus() each navigation). Identify: whole-screen wipes, focus jumps, scroll resets, layout thrash, input latency, 1 MB parse. Recommend targeted fixes (diff-render or fade, preserve scroll, avoid refocus flted jumps).

## Cluster B — Visual craft (the "boring layout")

**B1 · Visual design / aesthetics.** Focus: the "saaie layout". Read src/styles/base.css + components.css. Assess palette depth, typographic scale/personality (system fonts only — no CDN), contrast, warmth, whitespace, card style. Recommend a richer-but-calm visual identity for 70+: a more characterful type hierarchy, layered surfaces, a warmer accent story, texture/illustration accents — concrete tokens.

**B2 · Illustration & imagery.** Focus: Rosetta leans on beautiful imagery. Read src/assets/avatars.js, icons.js, marta-avatar.svg. Assess whether avatars/icons/scenes carry enough warmth and place-feeling. Recommend original SVG scene headers per theme (kitchen, airport, family table, Denmark/Prague…), richer avatars, and where imagery would lift the "experience" over "form".

**B3 · Layout & composition.** Focus: screen composition and hierarchy — does it read as a *form* or an *experience*? Read ui.js (home, lessonRunner, practice, reference), components.css. Assess density, alignment, focal point per screen, the one-main-action rule, and how to compose screens that feel designed rather than stacked.

## Cluster C — Learning experience & momentum

**C1 · Lesson-runner experience.** Focus: the moment-to-moment of doing a lesson — transitions between the ~10 activities, the Continue-button friction, progress feeling, fatigue at 8–13 steps. Read ui.js lessonRunner + exercise.js. Recommend how to make a lesson feel like a smooth flow with visible momentum and fewer dead taps.

**C2 · Conversation experience.** Focus: does a dialogue feel like a real conversation or a quiz? Read conversation.js. Assess bubble pacing, the lack of a "typing…" beat, the speak-step insertion, repair flow, and how to make role-play feel alive and human (timing, avatars reacting, natural turn rhythm).

**C3 · Onboarding → habit.** Focus: the first 5 minutes (diagnostic → first lesson) and the daily "open → do → done → return" loop. Read diagnostic.js, main.js (boot), ui.js home. Recommend how to make the opening feel welcoming and the loop habit-forming for an older adult, without streak pressure.

## Cluster D — Craft & synthesis

**C4/D1 · Audio/TTS/recording experience.** Focus: the speaking loop's smoothness — voice loading (voiceschanged), speak latency/cancel, record start/stop feel, replay, the say-it/pron-record/conversation speak widgets. Read src/engines/audio.js + M.speakRecord in exercise.js. Recommend how to make hearing/recording feel instant and reassuring (states, affordances, no dead air).

**D2 · Coherence, consistency & synthesis lead.** Focus: cross-cutting consistency (components, terminology, EN–HU, back-button behaviour, empty states) AND synthesize ALL panel findings into one prioritized "de-clunk & flow" plan grouped by theme, with a recommended v1.7 implementation order. Read the whole src/ tree at a high level plus the other 11 agents' outputs (provided by the orchestrator).

---

### Notes for the orchestrator
- All fixes must preserve: offline single-file build, no external fonts/CDN, reduced-motion support (every animation gated behind `prefers-reduced-motion` / the app's `data-motion="reduce"`), 70+ contrast & target sizes, bilingual Hungarian help.
- Likely high-value themes to expect: a motion/transition system, fewer full-screen wipes (fade/slide + preserved scroll), a richer type & surface system, SVG scene headers, a "typing…" beat and reacting avatars in chat, smoother lesson-to-lesson momentum, and an auto-advance option for recognition steps.
- Ship the result as **v1.7** after the usual `npm run build && npm run test && npm run package`, and update `CHANGELOG.md` + `REVIEW_FINDINGS_AND_ACTIONS.md`.
