# English with Marta — Design System v2

## "Warm Editorial Storybook" — locked, implementation-ready

**Status:** LOCKED for build. This is the single source of truth. It supersedes the scattered
tokens and rules in `src/styles/*` and the four feature specs (typography, motion, illustration,
components) folded together here. Where the source specs disagreed, this document has already
resolved the conflict — see **Locked Decisions**. The content of the course is finished and
untouched; this is a pure look-and-feel makeover. Every hard constraint (offline single file,
system fonts + inline SVG only, AA ≥ 4.5:1 text contrast, tap targets ≥ 48px, reduced-motion
double-gated, bilingual EN·HU on demand, no timers/hearts/streaks) holds and is called out where
it is enforced.

---

## 1. Vision

English with Marta v2 reimagines the finished course as a **hand-bound book made for one reader.**
The screen is warm rag paper — never clinical white — set in a Palatino-family serif for headings
and a humanist sans for reading, with a generous 1.6 line-height and one 20 / 23 / 26 px size knob
so every word scales for seventy-year-old eyes. The palette is calm: **pine teal** carries every
action, **honey** carries warmth and a gentle "not quite," **moss** means "yes" — and there is no
red alarm, no timer, no heart, no streak anywhere. Illustration is a single-weight ink line: soft-
square portraits of Marta's real family (Kira's red scarf, David's camera, Panna's horse Luna at
the frame's edge) and wide 16:6 scene-bands that turn each lesson into a *place*, from the kitchen
table to the airport gate that answers her fear of flying. Motion is paper that settles, never
bounces — pages lift, a right answer gives one quiet spring, and every flourish is double-gated off
for reduced motion. Every meaningful state is legible three ways at once — **position, glyph, and
tint** — so nothing depends on colour, motion, or sharp eyes. It should feel less like an app and
more like a warm, patient teacher who made this, by hand, just for her.

---

## 2. Locked Decisions (conflict resolutions)

The feature specs conflicted on several points. These are resolved, final, and reflected throughout:

1. **Base type size = 20 px (not 18).** The typography lead owns type, the existing wiring is
   already 20/23/26, and the hard constraint names those three modes. Driven by one multiplier:
   `--type-scale` = **1 / 1.15 / 1.30** (→ 20 / 23 / 26 px exactly). The components spec's 18 px /
   1.18 / 1.36 is rejected.
2. **Palette = the components §0 block** (pine teal + honey on greige), which typography and
   illustration already reference. Final hexes in §3.
3. **Warm-as-text fails AA — split the token.** `--warm #b46a1c` is only 3.9:1 on paper, so it is
   **rules / borders / fills only** (≥ 3:1, OK). All warm **text** (links, ghost button, eyebrows,
   grammar labels, the "not quite" mark) uses new **`--warm-700 #945311` = 5.5:1**. This is the one
   real accessibility fix over the source palette.
4. **Focus ring must be visible for 70+.** `--accent-300 #6fb3a9` is 2.2:1 on paper (fails even the
   3:1 non-text floor), so it is **decor/hover-hint only, never a focus ring**. Focus uses
   **`--focus #0f6b60` = 5.9:1**, always a solid 3px outline at 2px offset. This overrides every
   `outline:...var(--accent-300)` in the component spec.
5. **Scene headline = solid caption plate, not a scrim.** The specs disagreed (white-on-dark-scrim
   vs dark-on-light-scrim); both are fragile over a variable, light, honey-bottomed illustration.
   Resolved by dropping the scrim entirely: the title sits on a small **`--surface` caption plate**
   (ink serif, 16:1) anchored bottom-left, like a tipped-in plate caption. Scene SVGs no longer bake
   a text scrim, so the drawn people stay crisp.
6. **Reduced motion = safe blanket + enumerated gentle fades (hybrid).** Neither the motion spec's
   granular-only gates (which leak button transitions) nor the components spec's kill-everything
   blanket alone is ideal. Final: a blanket `*{animation:none;transition:none}` under **both** gates
   (bulletproof — every state snaps to its visible end value), with a higher-specificity allowlist
   re-enabling **opacity-only ≤120ms** fades on the big container reveals. Double-gated via
   `body[data-motion="reduce"]` **and** `@media (prefers-reduced-motion:reduce)`.
7. **Correct/wrong keyframes unified** to `settlePop` (one 1.02 settle) + `nudgeOnce` (one 4px
   nudge) + `checkPop` (glyph spring). The duplicate `settle`/`nudge`/`popCheck` names are retired.
8. **Wrong-answer glyph stays `again` (the circular "try again" arrow), not an ✗.** There is no
   `close` icon in the set and a red-coded cross breaks the gentle tone; `again` is already injected
   by the engine and reads as an invitation to retry. `--warm-700` colours it (4.9:1 on honey).
9. **Avatars become soft-cornered squares** (rx 22 on the 120-portrait; CSS clip on the 40-chat
   variant), replacing circles — the "tipped-in plate" framing. `marta-avatar.svg` is reissued.
10. **Legacy `--accent-2` clay is retired** → aliased to `--accent-700` (teal) so `.recstate`,
    `.rec-dot`, `.reviewbadge` stay cohesive without touching JS. `heart` icon is retired (hard
    constraint) and unit `u16`'s tile icon is reassigned to `family`.
11. **Tap-target floor enforced:** `--tap:56px`; every legacy 44px control (navbtn, `select`,
    support-tabs, `.btn.small`) is raised to **≥ 48px**.

---

## 3. `:root` token block — paste into `src/styles/base.css`

Replaces the current `:root{…}` (base.css lines 2–36) **and** the `body[data-textsize]` overrides
(lines 49–50). System fonts only — no webfont, CDN, or `@font-face`. All ramps are literal hex so
the file stays offline and self-contained; structural values are exposed as tokens so a future dark
theme can flip them without touching identity colours in the art.

```css
:root{
  /* ============ GROUNDS & SURFACES ============ */
  --bg:#ece7db;                 /* warm greige canvas                       */
  --bg-sunk:#e3ddce;            /* recessed ground                          */
  --surface:#faf6ec;            /* warm rag paper (was clinical #ffffff)    */
  --surface-2:#f3ecdd;          /* quiet alternate surface                  */
  --surface-raised:#fffdf6;     /* the card face that lifts                 */
  --surface-sunk:#e3ddce;       /* wells / tracks                           */

  /* ============ INK ============ */
  --ink:#2a2420;                /* body ink — 16.1:1 on --surface           */
  --ink-soft:#5c5147;           /* HU help / meta / sub — 6.8:1 on --surface */

  /* ============ ACCENT — pine teal (every action) ============ */
  --accent:#0f6b60;             /* 6.4:1 white text                         */
  --accent-700:#0a544b;         /* 8.8:1 white text — PRIMARY button        */
  --accent-500:#0f6b60;
  --accent-300:#6fb3a9;         /* DECOR / hover-hint ONLY — never text, never focus */
  --accent-ink:#ffffff;
  --accent-soft:#dfeeeb;        /* teal tint — icon wells, step badges      */
  --accent-2:var(--accent-700); /* legacy clay retired → teal (compat alias) */

  /* ============ WARM — honey (story warmth, gentle "not quite", grammar) ============ */
  --warm:#b46a1c;               /* 3.9:1 — RULES / BORDERS / FILLS ONLY (≥3:1) */
  --warm-700:#945311;           /* 5.5:1 — WARM TEXT (links, eyebrows, labels) */
  --warm-tint:#f6e6cf;          /* honey wash — recommend card, wrong tint, glow */
  --warm-soft:var(--warm-tint); /* legacy alias                             */

  /* ============ STATES ============ */
  --good:#3f7d3a;               /* moss — correct rule/glyph (4.63:1 text · ≥3:1 glyph) */
  --good-bg:#e4eddb;            /* moss tint                                */
  --gentle:var(--warm);         /* "wrong, gentle" == honey                 */
  --gentle-bg:var(--warm-tint);

  /* ============ STRUCTURE / LINES ============ */
  --line:#d8cdb8;               /* warm hairline                            */
  --line-strong:#c4b697;        /* plate edge / strong border (≥3:1 vs surface) */
  --warm-line:var(--line-strong);
  --focus:#0f6b60;              /* AA focus ring — 5.9:1 vs surface, always visible */
  --blush:#e7b6a0;              /* decorative only                          */

  /* ============ RADII ============ */
  --r-sm:8px; --r:14px; --r-md:16px; --r-lg:22px; --r-pill:999px;
  --radius:var(--r-lg);         /* legacy alias                             */

  /* ============ SPACING (calm editorial rhythm) ============ */
  --sp-1:.4rem; --sp-2:.7rem; --sp-3:1rem; --sp-4:1.4rem; --sp-5:2rem; --sp-6:3rem;
  --space:var(--sp-4);          /* legacy alias                             */
  --gutter:clamp(16px,5vw,40px);
  --measure:38rem;              /* ~60–68 char reading column               */

  /* ============ ELEVATION (warm, low-spread, never grey) ============ */
  --e1:0 1px 2px rgba(60,42,20,.08);
  --e2:0 4px 14px rgba(60,42,20,.10);
  --e3:0 12px 30px rgba(60,42,20,.13);
  --elev-1:var(--e1); --elev-2:var(--e2);            /* legacy aliases      */
  --shadow:var(--e2); --shadow-soft:var(--e1);       /* legacy aliases      */
  --hairline:inset 0 1px 0 rgba(255,255,255,.72);    /* Boutique top-light  */

  /* ============ TAP TARGET ============ */
  --tap:56px;                   /* floor+ ; hard minimum is 48px            */

  /* ============ TYPE — stacks (system only) ============ */
  --font-display:"Iowan Old Style","Palatino Linotype",Palatino,"Book Antiqua","URW Palladio L",Georgia,ui-serif,serif;
  --font:"Seravek","Gill Sans Nova","Gill Sans",Avenir,"Avenir Next",-apple-system,"Segoe UI",Roboto,system-ui,sans-serif;
  --font-mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;

  /* ============ TYPE — one-multiplier size modes ============ */
  --type-scale:1;                       /* the single knob                  */
  --fs:calc(20px * var(--type-scale));  /* 1rem = 20 / 23 / 26 px           */

  /* ============ TYPE — modular scale (ratio 1.25, floored ≥16px) ============ */
  --step--2:0.80rem;   /* caption / HU help    16.0 / 18.4 / 20.8 px        */
  --step--1:0.90rem;   /* small                18.0 / 20.7 / 23.4 px        */
  --step-0 :1.00rem;   /* body                 20.0 / 23.0 / 26.0 px        */
  --step-1 :1.25rem;   /* h3 / word term       25.0 / 28.8 / 32.5 px        */
  --step-2 :1.55rem;   /* h2                   31.0 / 35.7 / 40.3 px        */
  --step-3 :1.95rem;   /* h1                   39.0 / 44.9 / 50.7 px        */
  --step-4 :2.50rem;   /* hero greeting        50.0 / 57.5 / 65.0 px        */

  /* ============ TYPE — line-height / weight / tracking ============ */
  --lh-tight:1.14; --lh-head:1.20; --lh-body:1.60; --lh-ui:1.45;
  --wt-body:400; --wt-med:500; --wt-semi:600; --wt-bold:700;
  --tr-display:-0.01em; --tr-body:0; --tr-caps:0.06em;

  /* ============ MOTION — easings ============ */
  --ease-page:cubic-bezier(.22,.61,.36,1);   /* the "settle" — enters, rings, spine  */
  --ease-in-out:cubic-bezier(.45,0,.25,1);   /* symmetric — fills, toggles, hovers    */
  --ease-spring:cubic-bezier(.34,1.4,.5,1);  /* one gentle overshoot — check-pop      */
  --spring:var(--ease-spring);               /* alias                                 */
  --ease:var(--ease-page);                   /* legacy alias (keep — many rules use it) */

  /* ============ MOTION — durations ============ */
  --dur-1:140ms;   /* micro: press, hover lift, switch knob, caption        */
  --dur-2:220ms;   /* standard: cross-fade, bubble-in, feedback, check-pop  */
  --dur-3:360ms;   /* expressive: page-lift, progress spine + ring          */
  --stagger:60ms;  /* between successive chat bubbles / spine nodes         */
}
body[data-textsize="large"] { --type-scale:1.15; }   /* → 23px */
body[data-textsize="xlarge"]{ --type-scale:1.30; }   /* → 26px */
```

### 3a. Base element rules (keep in `base.css`, just after `:root`)

```css
*{box-sizing:border-box}
html{font-size:var(--fs)}
body{
  margin:0; color:var(--ink); font-family:var(--font);
  font-size:1rem; line-height:var(--lh-body); -webkit-text-size-adjust:100%;
  /* layered warm ground so the surface reads as a calm place, not blank paper */
  background:
    radial-gradient(1100px 560px at 100% -8%, rgba(180,106,28,.06), transparent 60%),
    radial-gradient(900px 520px at -10% 108%, rgba(15,107,96,.05), transparent 60%),
    var(--bg);
  background-attachment:fixed;
}

/* ---- headings: editorial serif, balanced, tight ---- */
h1,h2,h3,.u-hero,.wordcard .en,.scene .label{
  font-family:var(--font-display); letter-spacing:var(--tr-display); color:var(--ink);
  text-wrap:balance; text-rendering:optimizeLegibility;
}
.u-hero{font-size:var(--step-4); font-weight:var(--wt-bold); line-height:var(--lh-tight); margin:0}
h1{font-size:var(--step-3); font-weight:var(--wt-bold); line-height:var(--lh-tight); margin:0 0 .5rem}
h2{font-size:var(--step-2); font-weight:var(--wt-bold); line-height:var(--lh-head); margin:0 0 .5rem}
h3{font-size:var(--step-1); font-weight:var(--wt-semi); line-height:var(--lh-head); margin:0 0 .4rem}

p{margin:0 0 .9rem; max-width:var(--measure)}        /* editorial measure */
strong,b{font-weight:var(--wt-semi)}                 /* 600, softer emphasis */
a,.u-link{color:var(--warm-700); text-underline-offset:2px; text-decoration-thickness:from-font}

/* ---- type utilities ---- */
.u-small,.wordcard .hu{font-size:var(--step--1); line-height:var(--lh-ui); font-weight:var(--wt-med)}
.u-caption,.u-meta,.muted{font-size:var(--step--2); line-height:var(--lh-ui); color:var(--ink-soft)}
.u-eyebrow{font-size:var(--step--1); font-weight:var(--wt-semi); text-transform:uppercase;
  letter-spacing:var(--tr-caps); color:var(--ink-soft)}

/* ---- structure ---- */
button{font-family:inherit}
:focus-visible{outline:3px solid var(--focus); outline-offset:2px; border-radius:6px}
#main:focus,#main:focus-visible{outline:none}     /* programmatic focus target only */
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}
.hidden{display:none !important}
.container{max-width:920px;margin:0 auto;padding:clamp(20px,5vw,56px) var(--gutter) 5rem}
.measure{max-width:var(--measure);margin-inline:auto}

/* @property is required for the animated ring; keep it in base.css */
@property --p{syntax:'<number>';inherits:true;initial-value:0}
```

**Note on `.muted`:** the codebase uses `.muted` heavily for HU help and sub-text; it is unified
here with `--ink-soft` at caption size, so every existing `.muted` node inherits the calm treatment
with no JS change.

**Rendering:** do **not** globally force `-webkit-font-smoothing:antialiased` — on warm paper it
thins strokes and lowers effective contrast for older eyes. Leave default weight; only headings get
`text-rendering:optimizeLegibility`.

---

## 4. Component CSS — paste into `src/styles/components.css`

This is the full component layer. It replaces the existing `components.css` rules for every selector
below and adds the new `.spine`, `.card.stitched`, `.tnum`, and caption-plate `.scene` rules. The
`.btn` and `.card` blocks currently live in `base.css` (lines 80–105) — move them here (or replace
them in place). `@keyframes` referenced here are defined once in **§6 (Motion)**; every animation is
neutralised by the reduced-motion gates in §6.

```css
/* ============================================================
   BUTTONS  (replaces base.css .btn block, lines 80–95)
   ============================================================ */
.btn{
  display:inline-flex;align-items:center;justify-content:center;gap:.5rem;
  min-height:var(--tap);padding:.85rem 1.5rem;border-radius:var(--r-pill);
  border:1px solid var(--accent-700);background:var(--accent-700);color:#fff;
  font-family:var(--font);font-size:1.02rem;font-weight:var(--wt-semi);letter-spacing:.005em;
  cursor:pointer;text-decoration:none;box-shadow:var(--e1),var(--hairline);
  transition:transform var(--dur-1) var(--ease-in-out),box-shadow var(--dur-2) var(--ease-in-out),
             filter var(--dur-1) ease,background var(--dur-1) ease,border-color var(--dur-1) ease;
}
.btn:hover{box-shadow:var(--e2),var(--hairline);transform:translateY(-1px)}
.btn:active{transform:translateY(0)}
.btn.secondary{background:var(--surface-raised);color:var(--accent-700);
  border:1px solid var(--line-strong);box-shadow:var(--e1),var(--hairline)}
.btn.secondary:hover{border-color:var(--accent);box-shadow:var(--e2),var(--hairline)}
.btn.ghost{background:transparent;border-color:transparent;color:var(--warm-700);box-shadow:none;
  text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:2px;
  text-decoration-color:var(--warm-700)}
.btn.ghost:hover{background:var(--warm-tint);box-shadow:none;transform:none}
.btn.wide{width:100%}
.btn.small{min-height:48px;padding:.6rem 1.1rem;font-size:.95rem}   /* floor, not 44 */
.btn:disabled{opacity:.5;cursor:not-allowed;transform:none;box-shadow:none}
.btn:focus-visible{outline:3px solid var(--focus);outline-offset:2px}
.btn-row{display:flex;flex-wrap:wrap;gap:.7rem;margin:1rem 0}

/* ============================================================
   CARDS  (replaces base.css .card block, lines 98–102)
   ============================================================ */
.card{background:var(--surface-raised);border:1px solid var(--line);border-radius:var(--r-lg);
  box-shadow:var(--e1),var(--hairline);padding:1.6rem 1.7rem;margin:0 0 1.2rem;position:relative}
.card.raised{box-shadow:var(--e2),var(--hairline)}
.card.warm{background:var(--warm-tint);border-color:var(--line-strong)}
.card h2{margin-top:0}
.card.acc{padding:0}
.card.acc > div:not(.hidden){padding:0 1.3rem 1.3rem}
/* stitched-corner motif — a hand-bound "thread" inset; use sparingly (hub tiles, completion) */
.card.stitched::before{content:"";position:absolute;inset:7px;border-radius:calc(var(--r-lg) - 5px);
  border:1px dashed var(--line-strong);opacity:.5;pointer-events:none}

/* ============================================================
   APPBAR / NAV  (chrome — enforce 48px tap floor)
   ============================================================ */
.appbar{position:sticky;top:0;z-index:20;background:var(--surface);border-bottom:1px solid var(--line);
  display:flex;align-items:center;flex-wrap:wrap;gap:.4rem .8rem;padding:.6rem var(--gutter);
  box-shadow:var(--e1)}
.appbar .brand{display:flex;align-items:center;gap:.6rem;font-family:var(--font-display);
  font-weight:var(--wt-bold);flex:0 0 auto}
.appbar .brand svg{width:40px;height:40px;flex:0 0 auto}
.appbar nav{display:flex;gap:.3rem;flex-wrap:nowrap;overflow-x:auto;flex:1 1 360px;min-width:0;
  justify-content:flex-end;scrollbar-width:thin;-webkit-overflow-scrolling:touch}
.navbtn{min-height:48px;padding:.5rem .9rem;border-radius:var(--r);border:1px solid transparent;
  white-space:nowrap;display:inline-flex;align-items:center;gap:.3rem;flex:0 0 auto;
  background:transparent;color:var(--ink);font-size:.95rem;font-weight:var(--wt-semi);cursor:pointer;
  transition:background var(--dur-1) var(--ease-in-out),border-color var(--dur-1) var(--ease-in-out)}
.navbtn:hover{background:var(--surface-2)}
.navbtn[aria-current="page"]{background:var(--accent-soft);border-color:var(--accent);color:var(--accent-700)}
@media (max-width:720px){.appbar nav{justify-content:flex-start}}

/* ============================================================
   AVATARS  (circle → soft square "tipped-in plate")
   ============================================================ */
.avatar{width:96px;height:96px;border-radius:var(--r-lg);background:var(--surface-2);
  border:1.5px solid var(--line-strong);flex:0 0 auto;overflow:hidden;box-shadow:var(--e1),var(--hairline)}
.avatar.small{width:52px;height:52px;border-radius:var(--r)}
.avatar svg{width:100%;height:100%;display:block}
.avatar-row{display:flex;align-items:center;gap:1rem;margin-bottom:1rem}

/* ============================================================
   HERO + RECOMMEND ("today") CARD
   ============================================================ */
.hero{display:flex;align-items:center;gap:1.3rem;margin:.4rem 0 2rem;flex-wrap:wrap}
.hero > div:first-of-type{flex:1 1 60%;min-width:0}   /* greeting block, source-order first */
.hero .avatar{width:88px;height:88px;order:2;box-shadow:var(--e2),var(--hairline)}
.hero .ring{order:3}
.hero h1{font-size:var(--step-3);margin:0}
.hero .sub{color:var(--ink-soft);margin:.35rem 0 0;font-size:1.05rem;max-width:var(--measure)}
.recommend{background:var(--warm-tint);border:1px solid var(--line-strong);border-radius:var(--r-lg);
  padding:1.6rem 1.7rem;box-shadow:var(--e2),var(--hairline);margin-bottom:2rem;position:relative}
.recommend .k{font-family:var(--font);font-size:.72rem;font-weight:var(--wt-bold);letter-spacing:.12em;
  text-transform:uppercase;color:var(--warm-700)}
.recommend h2{font-family:var(--font-display);margin:.3rem 0;font-size:1.4rem;color:var(--ink)}

/* ============================================================
   HUB TILES (book-spine) + ICON WELL
   ============================================================ */
.tilegrid{display:grid;grid-template-columns:1fr;gap:.9rem;position:relative}
@media(min-width:560px){.tilegrid{grid-template-columns:1fr 1fr}}
.themetile{display:flex;align-items:center;gap:1rem;background:var(--surface-raised);
  border:1px solid var(--line);border-left:5px solid var(--accent-300);border-radius:var(--r);
  padding:1.05rem 1.2rem;cursor:pointer;text-align:left;color:var(--ink);width:100%;min-height:var(--tap);
  box-shadow:var(--e1),var(--hairline);
  transition:box-shadow var(--dur-2) var(--ease-in-out),transform var(--dur-1) var(--ease-in-out),
             border-color var(--dur-1) var(--ease-in-out)}
.themetile:hover{transform:translateY(-2px);box-shadow:var(--e2),var(--hairline);border-left-color:var(--accent)}
.themetile:active{transform:translateY(1px)}
.themetile .txt{flex:1;min-width:0}
.themetile .txt b{display:block;font-family:var(--font-display);font-size:1.1rem;font-weight:var(--wt-bold)}
.themetile .txt span{font-size:.85rem;color:var(--ink-soft)}
.iconwell{width:48px;height:48px;border-radius:var(--r);display:grid;place-items:center;flex:0 0 auto;
  background:var(--tint,var(--accent-soft));color:var(--tintink,var(--accent-700));box-shadow:var(--hairline)}
.iconwell svg{width:24px;height:24px}

/* ============================================================
   ACCORDIONS / UNIT + LESSON ROWS
   ============================================================ */
.unit-list{list-style:none;padding:0;margin:0}
.unit{border:1px solid var(--line);border-radius:var(--r-lg);background:var(--surface-raised);
  margin-bottom:1rem;overflow:hidden;box-shadow:var(--e1),var(--hairline)}
.unit > button{width:100%;text-align:left;background:transparent;border:0;padding:1.15rem 1.3rem;
  min-height:var(--tap);cursor:pointer;display:flex;align-items:center;gap:.9rem;
  font-family:var(--font-display);font-size:1.1rem;font-weight:var(--wt-bold);color:var(--ink);
  transition:background var(--dur-1) var(--ease-in-out)}
.unit > button:hover{background:var(--surface-2)}
.unit .lessons{padding:.3rem 1rem 1rem}
.acc-head{display:flex;align-items:center;gap:.8rem;width:100%;min-height:var(--tap);
  padding:1.15rem 1.3rem;background:transparent;border:0;font-family:inherit;color:var(--ink);
  cursor:pointer;text-align:left}
.acc-head:hover{background:var(--surface-2)}
.acc-head .acc-chev{transition:transform var(--dur-1) var(--ease-in-out);color:var(--ink-soft)}
.acc-head.open .acc-chev{transform:rotate(90deg)}
.lessonbtn{display:flex;align-items:center;gap:.8rem;width:100%;min-height:var(--tap);text-align:left;
  background:var(--surface);border:1px solid var(--line);border-radius:var(--r);
  padding:.85rem 1rem;margin:.4rem 0;cursor:pointer;font-size:1rem;color:var(--ink);box-shadow:var(--hairline);
  transition:background var(--dur-1) var(--ease-in-out),border-color var(--dur-1) var(--ease-in-out),
             transform var(--dur-1) var(--ease-in-out)}
.lessonbtn:hover{background:var(--good-bg);border-color:var(--accent-300)}
.lessonbtn:active{transform:translateY(1px)}
.lessonbtn .done{color:var(--good);font-weight:var(--wt-bold)}
.pill{display:inline-block;padding:.25rem .75rem;border-radius:var(--r-pill);background:var(--surface-2);
  font-size:.82rem;color:var(--ink-soft);border:1px solid var(--line);font-variant-numeric:tabular-nums}
.badge-status{font-size:.78rem;padding:.2rem .6rem;border-radius:var(--r-pill);border:1px solid var(--line);
  background:var(--warm-tint);color:var(--warm-700);font-variant-numeric:tabular-nums}

/* ============================================================
   PROGRESS: ring · spine · bar
   ============================================================ */
.ring{--p:0;--rs:64px;width:var(--rs);height:var(--rs);border-radius:50%;flex:0 0 auto;
  background:conic-gradient(var(--accent) calc(var(--p)*1%),var(--surface-2) 0);
  display:grid;place-items:center;box-shadow:var(--hairline);transition:--p var(--dur-3) var(--ease-page)}
.ring > b{width:calc(var(--rs) - 12px);height:calc(var(--rs) - 12px);border-radius:50%;
  background:var(--surface-raised);display:grid;place-items:center;
  font-family:var(--font-display);font-weight:var(--wt-bold);font-size:1rem;color:var(--ink);
  font-variant-numeric:tabular-nums lining-nums;box-shadow:var(--hairline)}
.ring.sm{--rs:48px}.ring.sm > b{font-size:.8rem}

/* honey spine down the lesson left margin, ink nodes marking steps (NEW) */
.spine{position:relative;padding-left:26px}
.spine::before{content:"";position:absolute;left:9px;top:6px;bottom:6px;width:2px;
  background:var(--warm);opacity:.5;border-radius:2px}
.spine .node{position:relative}
.spine .node::before{content:"";position:absolute;left:-26px;top:.35em;width:14px;height:14px;
  border-radius:50%;background:var(--surface);border:2px solid var(--line-strong);box-shadow:var(--hairline);
  transition:background var(--dur-2) var(--ease-in-out),border-color var(--dur-2) var(--ease-in-out)}
.spine .node.done::before{background:var(--ink);border-color:var(--ink)}
.spine .node.current::before{background:var(--warm);border-color:var(--warm)}
/* optional richer markup: an explicit filling rail + popping nodes */
.spine-fill{transition:height var(--dur-3) var(--ease-page)}
body:not([data-motion="reduce"]) .spine .node.done::before{animation:nodeFill var(--dur-2) var(--ease-spring) both}

/* unit-meter bar (lessons list) */
.progress{height:12px;background:var(--surface-sunk);border-radius:var(--r-pill);overflow:hidden;
  border:1px solid var(--line);box-shadow:var(--hairline)}
.progress > span{display:block;height:100%;background:var(--warm);width:0;
  transition:width var(--dur-3) var(--ease-page)}

/* ============================================================
   STAGE + WORD CARD + GRAMMAR + STEP BADGE
   ============================================================ */
.stage{min-height:280px;padding:2rem 1.6rem}
.prompt{font-size:1.2rem;font-weight:var(--wt-semi);margin-bottom:1rem}
.wordcard{text-align:center;padding:1.8rem 1.6rem;background:var(--surface-raised);
  border:1px solid var(--line);border-radius:var(--r-lg);box-shadow:var(--e2),var(--hairline)}
.wordcard .wordicon{width:72px;height:72px;margin:0 auto .9rem;border-radius:var(--r-lg);
  display:grid;place-items:center;background:var(--accent-soft);color:var(--accent-700);box-shadow:var(--hairline)}
.wordcard .wordicon svg{width:38px;height:38px}
.wordcard .en{font-size:var(--step-3);font-weight:var(--wt-bold);line-height:1.12}
.wordcard .hu{color:var(--ink-soft);margin-top:.4rem}          /* retired --accent-2 → ink-soft */
.wordcard .ex{margin-top:1rem;color:var(--ink-soft);font-size:1rem}
.stepbadge{display:inline-flex;align-items:center;gap:.4rem;font-size:.72rem;font-weight:var(--wt-bold);
  letter-spacing:.08em;text-transform:uppercase;color:var(--accent-700);background:var(--accent-soft);
  border:1px solid var(--line);padding:.3rem .7rem;border-radius:var(--r-pill);margin-bottom:.7rem}
.grammarbox{background:var(--surface-2);border:1px solid var(--line);border-left:4px solid var(--warm);
  border-radius:var(--r);padding:1rem 1.1rem;margin:1.2rem 0}
.grammarbox .lbl{font-size:.72rem;font-weight:var(--wt-bold);letter-spacing:.1em;text-transform:uppercase;
  color:var(--warm-700);margin-bottom:.3rem}
.grammarbox .eg{font-family:var(--font-display);font-weight:var(--wt-semi);font-size:1.1rem}

/* ============================================================
   OPTIONS / ANSWERS  — position + glyph + tint, never colour alone
   Fill wipes L→R; left border is the persistent positional signal.
   ============================================================ */
.options{display:grid;gap:.7rem;grid-template-columns:1fr}
.option{position:relative;overflow:hidden;display:flex;align-items:center;gap:.75rem;
  min-height:var(--tap);padding:.9rem 1.1rem;border-radius:var(--r);
  border:1px solid var(--line-strong);border-left:4px solid transparent;color:var(--ink);
  background-color:var(--surface-raised);
  background-image:linear-gradient(90deg,var(--opt-fill,transparent) 0 100%);
  background-repeat:no-repeat;background-size:0% 100%;
  box-shadow:var(--e1),var(--hairline);cursor:pointer;font-size:1.05rem;text-align:left;
  transition:border-color var(--dur-1) var(--ease-in-out),box-shadow var(--dur-1) var(--ease-in-out),
             transform var(--dur-1) var(--ease-in-out),background-size 180ms var(--ease-in-out)}
.option:hover{box-shadow:var(--e2),var(--hairline);border-left-color:var(--accent-300)}
.option:active{transform:translateY(1px)}
.option:focus-visible{outline:3px solid var(--focus);outline-offset:2px}
.option[disabled],.option.locked{opacity:.85;cursor:default;box-shadow:none}
.option .mark{margin-left:auto;display:inline-flex;font-weight:800}
/* CORRECT: moss tint fill + moss left-rule + one settle + spring glyph */
.option.correct{--opt-fill:var(--good-bg);background-size:100% 100%;
  border-color:var(--good);border-left-color:var(--good)}
.option.correct .mark{color:var(--good)}
body:not([data-motion="reduce"]) .option.correct{animation:settlePop var(--dur-2) var(--ease-spring) both}
/* WRONG: honey tint fill + honey left-rule + one 4px nudge — never red, never a shake loop */
.option.wrong{--opt-fill:var(--warm-tint);background-size:100% 100%;
  border-color:var(--warm);border-left-color:var(--warm)}
.option.wrong .mark{color:var(--warm-700)}
body:not([data-motion="reduce"]) .option.wrong{animation:nudgeOnce var(--dur-2) var(--ease-in-out) both}
body:not([data-motion="reduce"]) .option .mark{animation:checkPop var(--dur-2) var(--ease-spring) both}

/* ============================================================
   BUILDER / BLOCKS  (sentence-building, reorder, spelling)
   ============================================================ */
.blocks,.builder{display:flex;flex-wrap:wrap;gap:.5rem;margin:.6rem 0}
.builder{min-height:64px;border:2px dashed var(--line-strong);border-radius:var(--r-lg);
  padding:.7rem;background:var(--surface-2);align-items:center}
.builder:empty::before{content:attr(data-empty);color:var(--ink-soft)}
.block{min-height:52px;padding:.65rem 1.1rem;border-radius:var(--r);border:1px solid var(--accent-700);
  background:var(--surface-raised);color:var(--ink);font-size:1.05rem;cursor:pointer;box-shadow:var(--e1),var(--hairline);
  transition:background var(--dur-1) var(--ease-in-out),border-color var(--dur-1) var(--ease-in-out),
             transform var(--dur-1) var(--ease-in-out)}
.block:active{transform:translateY(1px)}
.block.hintme{border-color:var(--warm);box-shadow:0 0 0 3px var(--warm-tint)}
body:not([data-motion="reduce"]) .block.hintme{animation:pulse 1.4s var(--ease-in-out) infinite}

/* ============================================================
   TEXT INPUT + SELECT  (underlined paper)
   ============================================================ */
.textin{width:100%;min-height:var(--tap);font-size:1.1rem;font-family:var(--font);
  padding:.7rem .2rem;border:0;border-bottom:2px solid var(--line-strong);border-radius:0;
  background:transparent;color:var(--ink);font-variant-numeric:tabular-nums lining-nums;
  transition:border-color var(--dur-1) var(--ease-in-out)}
.textin:focus{outline:none;border-bottom-color:var(--accent-700)}
.textin:focus-visible{outline:3px solid var(--focus);outline-offset:4px;border-radius:6px}
select,.setrow select{min-height:var(--tap);font-size:1rem;padding:.5rem .7rem;border-radius:var(--r);
  border:1px solid var(--line-strong);background:var(--surface-raised);color:var(--ink);box-shadow:var(--hairline)}
select:focus-visible{outline:3px solid var(--focus);outline-offset:2px}

/* ============================================================
   FEEDBACK + HELP PANEL  — icon + text + tint, left-rule positional
   ============================================================ */
.feedback{display:flex;align-items:flex-start;gap:.7rem;padding:1rem 1.1rem;border-radius:var(--r);
  margin:1.2rem 0;font-size:1.05rem;border-left:4px solid transparent;box-shadow:var(--e1),var(--hairline);color:var(--ink)}
.feedback.good{background:var(--good-bg);border:1px solid var(--good);border-left:4px solid var(--good)}
.feedback.gentle{background:var(--warm-tint);border:1px solid var(--warm);border-left:4px solid var(--warm)}
.feedback svg{flex:0 0 auto;margin-top:2px}
.feedback.good svg{color:var(--good)} .feedback.gentle svg{color:var(--warm-700)}
body:not([data-motion="reduce"]) .feedback{animation:fbIn var(--dur-2) var(--ease-page) both}
body:not([data-motion="reduce"]) .feedback.good{animation:settlePop var(--dur-2) var(--ease-spring) both}
.helppanel{background:var(--surface-2);border:1px solid var(--line);border-left:4px solid var(--accent-300);
  border-radius:var(--r);padding:1rem 1.1rem;margin:1.2rem 0}
.helppanel h3{color:var(--accent-700);font-family:var(--font-display);font-size:1.05rem;margin-bottom:.35rem}

/* ============================================================
   CHAT  — soft-square window-lit avatars, HU as a quiet under-line
   ============================================================ */
.chat{display:flex;flex-direction:column;gap:.9rem;margin:1.2rem 0}
.turn{display:flex;gap:.6rem;align-items:flex-end;max-width:88%}
.turn.them{align-self:flex-start}
.turn.me{align-self:flex-end;flex-direction:row-reverse}
.turn .face{width:44px;height:44px;border-radius:var(--r);overflow:hidden;flex:0 0 auto;position:relative;
  border:1px solid var(--line-strong);background:var(--surface-2);box-shadow:var(--e1),var(--hairline)}
.turn .face::before{content:"";position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(60% 55% at 30% 25%,rgba(255,247,230,.55),transparent 70%)}
.turn .face svg{width:100%;height:100%;display:block;position:relative}
.turn.them .face{transition:transform var(--dur-2) var(--ease-in-out)}
.turn.them:hover .face{transform:translateY(-2px)}
.bubble{padding:.8rem 1.05rem;border-radius:18px;font-size:1.06rem;line-height:1.5;box-shadow:var(--e1),var(--hairline)}
.turn.them .bubble{background:var(--surface-2);border:1px solid var(--line);border-bottom-left-radius:6px;color:var(--ink)}
.turn.me   .bubble{background:var(--accent-700);color:#fff;border:1px solid var(--accent-700);border-bottom-right-radius:6px}
.bubble .who{font-size:.76rem;font-weight:var(--wt-bold);opacity:.8;margin-bottom:.15rem}
.turn.me .bubble .who{color:#dff0ec}
.bubble .hu{display:block;margin-top:.35rem;font-size:.9rem;color:var(--ink-soft)}   /* under-line, not inside */
.turn.me .bubble .hu{color:#cfe6e0}
body:not([data-motion="reduce"]) .turn{animation:bubbleIn var(--dur-2) var(--ease-page) both}
body:not([data-motion="reduce"]) .turn:nth-child(2){animation-delay:calc(var(--stagger)*1)}
body:not([data-motion="reduce"]) .turn:nth-child(3){animation-delay:calc(var(--stagger)*2)}
body:not([data-motion="reduce"]) .turn:nth-child(4){animation-delay:calc(var(--stagger)*3)}
/* typing "…" */
.typing{display:inline-flex;gap:5px;align-items:center;padding:.5rem .2rem}
.typing i{width:8px;height:8px;border-radius:50%;background:var(--ink-soft);display:block;animation-fill-mode:both}
body:not([data-motion="reduce"]) .typing i{animation:typingDot 1.1s var(--ease-in-out) infinite}
.typing i:nth-child(2){animation-delay:.15s}
.typing i:nth-child(3){animation-delay:.30s}
/* support tabs (translate / hint) as a pill segment control */
.support-tabs{display:flex;gap:.4rem;margin:.6rem 0}
.support-tabs button{flex:1;min-height:var(--tap);border-radius:var(--r-pill);border:1px solid var(--line-strong);
  background:var(--surface-raised);color:var(--ink);font-weight:var(--wt-semi);cursor:pointer;box-shadow:var(--hairline)}
.support-tabs button[aria-pressed="true"]{background:var(--accent-700);color:#fff;border-color:var(--accent-700)}

/* ============================================================
   SETTINGS ROWS + SWITCH  — label + position + ✓ glyph, never colour alone
   ============================================================ */
.setrow{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:1rem 0;
  border-bottom:1px solid var(--line);flex-wrap:wrap;min-height:var(--tap)}
.setrow:last-child{border-bottom:0}
.switch{display:inline-flex;align-items:center;gap:.7rem;min-height:var(--tap);padding:.3rem .5rem;cursor:pointer;
  background:transparent;border:0;font-family:inherit;font-size:1rem;font-weight:var(--wt-bold);color:var(--ink-soft)}
.switch-track{position:relative;width:56px;height:32px;border-radius:var(--r-pill);
  background:var(--surface-sunk);border:1px solid var(--line-strong);box-shadow:inset var(--hairline);
  transition:background var(--dur-1) var(--ease-in-out),border-color var(--dur-1) var(--ease-in-out)}
.switch-thumb{position:absolute;top:3px;left:3px;width:26px;height:26px;border-radius:50%;
  background:var(--surface-raised);box-shadow:var(--e1);display:grid;place-items:center;
  transition:transform var(--dur-1) var(--ease-in-out)}
.switch-check{display:inline-flex;opacity:0;color:var(--accent-700);transition:opacity var(--dur-1) var(--ease-in-out)}
.switch-check svg{width:14px;height:14px}
.switch.on{color:var(--accent-700)}
.switch.on .switch-track{background:var(--accent-700);border-color:var(--accent-700)}
.switch.on .switch-thumb{transform:translateX(24px)}
.switch.on .switch-check{opacity:1}
.switch:focus-visible{outline:3px solid var(--focus);outline-offset:3px;border-radius:12px}

/* recording / live states */
.recstate{display:inline-flex;align-items:center;gap:.5rem;font-weight:var(--wt-bold);color:var(--accent-700);min-height:1.6rem;margin:.3rem 0}
.rec-ok{display:inline-grid;place-items:center;width:20px;height:20px;border-radius:50%;background:var(--good);color:#fff;font-size:.8rem}
.rec-dot{width:14px;height:14px;border-radius:50%;background:var(--accent-700)}
.spk-live{display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--accent-700);margin-right:.4rem;vertical-align:middle}
body:not([data-motion="reduce"]) .rec-dot.on,
body:not([data-motion="reduce"]) .btn.speaking .spk-live{animation:pulse 1.4s var(--ease-in-out) infinite}
.btn.pending{opacity:.7;pointer-events:none}

/* ============================================================
   SCENE BAND  — 16:6 horizon, title on a solid caption plate (AA-guaranteed)
   ============================================================ */
.scene{position:relative;aspect-ratio:16/6;min-height:110px;border-radius:var(--r-lg);overflow:hidden;
  margin:0 0 1.4rem;border:1px solid var(--line-strong);box-shadow:var(--e2),var(--hairline)}
.scene svg{width:100%;height:100%;display:block;object-fit:cover}
.scene::after{content:"";position:absolute;inset:0;pointer-events:none;border-radius:inherit;
  box-shadow:inset 0 0 0 1px rgba(42,36,32,.04),inset 0 -30px 44px -34px rgba(42,36,32,.16)}
.scene .label{position:absolute;left:16px;bottom:14px;z-index:1;max-width:calc(100% - 32px);
  background:var(--surface);color:var(--ink);padding:.5rem .85rem;border-radius:var(--r);
  border:1px solid var(--line-strong);box-shadow:var(--e2),var(--hairline);
  font-size:1.2rem;font-weight:var(--wt-bold);letter-spacing:-.01em;line-height:1.15}
.scene .label .sub{display:block;font-family:var(--font);font-weight:var(--wt-med);font-size:.85rem;
  color:var(--ink-soft);letter-spacing:0;margin-top:.1rem}
.scene.small{aspect-ratio:16/5;min-height:84px}
.scene.small .label{font-size:1rem}

/* ============================================================
   COMPLETION BADGE  + TOAST + REVIEWER CHROME
   ============================================================ */
.done-badge{width:72px;height:72px;border-radius:50%;background:var(--good-bg);display:grid;place-items:center;
  color:var(--good);margin:0 auto .5rem;box-shadow:var(--hairline)}
.done-badge .glyph{display:inline-flex}
body:not([data-motion="reduce"]) .done-badge{animation:settlePop var(--dur-3) var(--ease-spring) both}
body:not([data-motion="reduce"]) .done-badge .glyph{animation:checkPop var(--dur-2) var(--ease-spring) both;animation-delay:120ms}
.toast{position:fixed;left:50%;bottom:1.2rem;transform:translateX(-50%);background:var(--ink);color:var(--surface);
  padding:.8rem 1.2rem;border-radius:var(--r);max-width:90%;z-index:50;box-shadow:var(--e3)}
.reviewbadge{position:fixed;right:14px;bottom:14px;z-index:60;background:var(--accent-700);color:#fff;
  font-size:.72rem;font-weight:var(--wt-bold);letter-spacing:.04em;padding:.3rem .6rem;border-radius:var(--r-pill);
  box-shadow:var(--e1);pointer-events:none;opacity:.9}
.reviewskip{position:fixed;right:14px;bottom:44px;z-index:61;cursor:pointer;display:inline-flex;align-items:center;gap:.4rem;
  min-height:var(--tap);padding:.6rem 1.3rem;border-radius:var(--r-pill);border:1px solid var(--accent-700);
  background:var(--accent-700);color:#fff;font-family:inherit;font-size:1rem;font-weight:var(--wt-bold);box-shadow:var(--e2)}
.reviewskip:active{transform:translateY(1px)}

/* ============================================================
   NUMERALS  — force lining + tabular where digits carry meaning
   (running prose keeps old-style serif figures — do nothing there)
   ============================================================ */
.tnum,.ring > b,.pill,.badge-status,input,.progress,.chat time{
  font-variant-numeric:tabular-nums lining-nums;font-feature-settings:"tnum" 1,"lnum" 1;
}
```

---

## 5. Illustration & Asset System

**House rule (every asset):** single-weight **ink contour** (~2 px at the 120 avatar scale, ~1.6 at
the 400 scene scale), **flat warm fills, one honey wash for light, no gradients on people.**
Structural colours are theme tokens with literal fallbacks — `var(--ink,#2a2420)`,
`var(--line-strong,#c4b697)` — so they flip in a future dark theme; **identity colours** (skin, hair,
garment, per-cast key) stay literal so faces read the same either way. Everything decorative is
`aria-hidden`; portraits carry a real `aria-label`. All markup below is validated well-formed and
renders identically inline-in-DOM (theme-aware) or as a standalone `.svg` (fallback colours).

### 5a. Avatar system

- **Frame:** rounded head-and-shoulders inside a **soft-cornered square** (`rx 22` on the 120
  viewBox for the portrait; the CSS `.avatar` / `.turn .face` clip supplies the corner on the 40
  chat build). A `--line-strong` inner frame is the "tipped-in plate" edge; the CSS adds the ivory
  `--hairline` top-light on top.
- **Light:** the CSS `.turn .face::before` window-light radial supplies the glow on chat avatars
  (no per-SVG gradient needed → no duplicate-id risk); the 120 portrait bakes its own top radial.
- **Shared skeleton** so the cast stays one family: garment shoulders → hair-back → neck → face
  ellipse (`cx 60 cy ≈ 55`) → cheeks → hair-front → eyes → brows → nose → warm smile. Solids get the
  ink contour; brows/nose/smile are contour-coloured strokes.
- **Colour-keying + one prop** is the "made-for-one-person" tell. Extend the `P` table in
  `avatars.js` with `key` (portrait tint) and `prop` (one drawn object):

| Cast | Key tint | Garment | Prop (their tell) |
|---|---|---|---|
| Marta | `#e6ede4` sage | sage `#7d9b86` | glasses |
| Kira (Denmark) | `#dbe4ec` cool blue | blue `#5f86a6` | red knit scarf `#b8503f` |
| Endika (Spanish) | `#f0e3d8` terracotta | `#4d6b7a` | beard `#a85436` |
| Esztella (Prague) | `#e0ecec` | teal `#4f9a97` | small book |
| David | `#e4e9e2` | `#5a8a6a` | camera on strap |
| Emma | `#f1ead8` | `#8aa06a` | honey bob |
| Panna | `#f0e6ec` | `#b57a95` | Luna's chestnut mane at frame edge |
| Margo (sister) | `#ece4d6` | `#a8895f` | grey hair, echoes Marta |
| Aunt Eva | `#efe7dc` | `#9a7a5f` | glasses + grey |
| Ákos | `#dde5e8` | `#5a6a72` | grey short |
| Endre | `#e3e8df` | `#6a7250` | glasses |
| Rita | `#efe6f0` | `#9a6f8f` | friendly bob |

#### Exemplar 1 — `marta-avatar.svg` (north star; reissue this whole file, 120 viewBox, square + contour + glow)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-label="Marta, a warm woman in her seventies">
  <defs>
    <clipPath id="mk-clip"><rect x="2" y="2" width="116" height="116" rx="22"/></clipPath>
    <radialGradient id="mk-glow" cx="0.5" cy="0.12" r="0.9">
      <stop offset="0" stop-color="#f6e6cf" stop-opacity=".9"/>
      <stop offset="1" stop-color="#f6e6cf" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <g clip-path="url(#mk-clip)">
    <rect x="2" y="2" width="116" height="116" fill="#e6ede4"/>
    <rect x="2" y="2" width="116" height="116" fill="url(#mk-glow)"/>
    <path d="M14 120 C18 92 38 82 60 82 C82 82 102 92 106 120 Z" fill="#7d9b86" stroke="var(--ink,#2a2420)" stroke-width="2" stroke-linejoin="round"/>
    <path d="M52 84 L60 96 L68 84" fill="none" stroke="var(--ink,#2a2420)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M53 74 h14 v10 a7 7 0 0 1 -14 0 Z" fill="#f0cdb4" stroke="var(--ink,#2a2420)" stroke-width="2" stroke-linejoin="round"/>
    <path d="M30 58 C28 34 43 20 60 20 C77 20 92 34 90 58 C90 66 87 72 84 74 C86 56 79 42 60 42 C41 42 34 56 36 74 C33 72 30 66 30 58 Z" fill="#c4bdb0" stroke="var(--ink,#2a2420)" stroke-width="2" stroke-linejoin="round"/>
    <ellipse cx="60" cy="56" rx="24" ry="27" fill="#f3d3ba" stroke="var(--ink,#2a2420)" stroke-width="2"/>
    <circle cx="46" cy="63" r="4.5" fill="#eab89b" opacity=".55"/>
    <circle cx="74" cy="63" r="4.5" fill="#eab89b" opacity=".55"/>
    <path d="M36 52 C35 34 47 26 60 26 C73 26 85 34 84 52 C79 44 71 41 60 41 C49 41 41 44 36 52 Z" fill="#bcb4a4" stroke="var(--ink,#2a2420)" stroke-width="2" stroke-linejoin="round"/>
    <g fill="none" stroke="var(--ink,#2a2420)" stroke-width="1.8">
      <circle cx="49" cy="55" r="8"/><circle cx="71" cy="55" r="8"/>
      <path d="M57 55 h6" stroke-linecap="round"/><path d="M41 53 l-6 -2" stroke-linecap="round"/><path d="M79 53 l6 -2" stroke-linecap="round"/>
    </g>
    <circle cx="49" cy="55" r="2.4" fill="#3f7bb0"/><circle cx="71" cy="55" r="2.4" fill="#3f7bb0"/>
    <circle cx="49" cy="55" r="1" fill="#2a2420"/><circle cx="71" cy="55" r="1" fill="#2a2420"/>
    <path d="M43 46 q6 -3 12 0" fill="none" stroke="#9a917f" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M65 46 q6 -3 12 0" fill="none" stroke="#9a917f" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M60 57 q-2 6 -3 8 q3 2 6 0" fill="none" stroke="#d9a789" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M50 70 q10 8 20 0" fill="none" stroke="#b5654a" stroke-width="2.2" stroke-linecap="round"/>
  </g>
  <rect x="2" y="2" width="116" height="116" rx="22" fill="none" stroke="var(--line-strong,#c4b697)" stroke-width="2.5"/>
</svg>
```

#### Exemplar 2 — Kira (style reference for the keyed cast; cool-blue key + red scarf prop)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-label="Kira, Marta's niece in Denmark, wearing her knitted scarf">
  <defs>
    <clipPath id="kr-clip"><rect x="2" y="2" width="116" height="116" rx="22"/></clipPath>
    <radialGradient id="kr-glow" cx="0.5" cy="0.12" r="0.9">
      <stop offset="0" stop-color="#f6e6cf" stop-opacity=".85"/><stop offset="1" stop-color="#f6e6cf" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <g clip-path="url(#kr-clip)">
    <rect x="2" y="2" width="116" height="116" fill="#dbe4ec"/>
    <rect x="2" y="2" width="116" height="116" fill="url(#kr-glow)"/>
    <path d="M14 120 C18 94 38 84 60 84 C82 84 102 94 106 120 Z" fill="#5f86a6" stroke="var(--ink,#2a2420)" stroke-width="2" stroke-linejoin="round"/>
    <path d="M30 60 C28 33 44 20 60 20 C76 20 92 33 90 60 C90 74 86 84 84 92 C82 78 82 60 82 52 C82 40 72 34 60 34 C48 34 38 40 38 52 C38 60 38 78 36 92 C34 84 30 74 30 60 Z" fill="#6b4a2f" stroke="var(--ink,#2a2420)" stroke-width="2" stroke-linejoin="round"/>
    <path d="M54 72 h12 v10 a6 6 0 0 1 -12 0 Z" fill="#f0cdb4" stroke="var(--ink,#2a2420)" stroke-width="2" stroke-linejoin="round"/>
    <ellipse cx="60" cy="54" rx="22" ry="25" fill="#f0cdb4" stroke="var(--ink,#2a2420)" stroke-width="2"/>
    <circle cx="47" cy="60" r="4.5" fill="#eaa78f" opacity=".5"/><circle cx="73" cy="60" r="4.5" fill="#eaa78f" opacity=".5"/>
    <path d="M40 88 C46 80 54 78 60 78 C66 78 74 80 80 88 C74 96 66 98 60 98 C54 98 46 96 40 88 Z" fill="#b8503f" stroke="var(--ink,#2a2420)" stroke-width="2" stroke-linejoin="round"/>
    <path d="M44 86 q16 8 32 0" fill="none" stroke="#8f3b2e" stroke-width="1.4" stroke-linecap="round"/>
    <path d="M38 50 C38 34 48 27 60 27 C72 27 82 34 82 50 C77 42 70 39 60 39 C53 39 46 41 42 47 L40 55 C39 53 38 51 38 50 Z" fill="#6b4a2f" stroke="var(--ink,#2a2420)" stroke-width="2" stroke-linejoin="round"/>
    <circle cx="51" cy="53" r="2.3" fill="#4a3526"/><circle cx="69" cy="53" r="2.3" fill="#4a3526"/>
    <path d="M45 46 q6 -2.5 11 0" fill="none" stroke="#4a3526" stroke-width="1.7" stroke-linecap="round"/>
    <path d="M64 46 q6 -2.5 11 0" fill="none" stroke="#4a3526" stroke-width="1.7" stroke-linecap="round"/>
    <path d="M60 55 q-1.5 5 -2.5 7 q2.5 1.5 5 0" fill="none" stroke="#dba98a" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M51 67 q9 6 18 0" fill="none" stroke="#b5654a" stroke-width="2.1" stroke-linecap="round"/>
  </g>
  <rect x="2" y="2" width="116" height="116" rx="22" fill="none" stroke="var(--line-strong,#c4b697)" stroke-width="2.5"/>
</svg>
```

#### 40×40 chat variant — paste-ready `src/assets/avatars.js`

The chat/list build keeps the same skeleton at lower detail: **add the ink contour, use `key||bg`,
render one `prop`**; the soft-square corner and window-light glow come from the CSS. Extend `P` with
`key` + `prop` per the table (only Marta/Kira/Endika/David/Panna/Esztella shown; fill the rest from
the table). Replace the file with:

```js
// Original, non-photorealistic vector avatars — single-weight ink line, keyed per person.
window.M = window.M || {};
(function (M) {
  var INK = "var(--ink,#2a2420)";
  // params: bg/key, skin, hair, style(short|bob|grey|bald), beard, eye, collar, glasses, prop
  var P = {
    marta:   { key:"#e6ede4", skin:"#f3d3ba", hair:"#c4bdb0", style:"grey", eye:"#3f7bb0", collar:"#7d9b86", glasses:true },
    endika:  { key:"#f0e3d8", skin:"#e6b48c", hair:"#2b241c", style:"short", beard:true, eye:"#3a2a1e", collar:"#4d6b7a" },
    kira:    { key:"#dbe4ec", skin:"#f0cdb4", hair:"#6b4a2f", style:"bob", eye:"#4a3526", collar:"#5f86a6", prop:"scarf" },
    esztella:{ key:"#e0ecec", skin:"#efc7a6", hair:"#8a5a30", style:"bob", eye:"#5a3a22", collar:"#4f9a97", prop:"book" },
    emma:    { key:"#f1ead8", skin:"#f2d2b6", hair:"#caa24e", style:"bob", eye:"#5a4a2a", collar:"#8aa06a" },
    david:   { key:"#e4e9e2", skin:"#e6b48c", hair:"#3a2c1e", style:"short", eye:"#3a2a1e", collar:"#5a8a6a", prop:"camera" },
    panna:   { key:"#f0e6ec", skin:"#f2d2b6", hair:"#5a3a22", style:"bob", eye:"#4a3526", collar:"#b57a95", prop:"mane" },
    margo:   { key:"#ece4d6", skin:"#f0cdb4", hair:"#c0bbb0", style:"grey", eye:"#5a6a4a", collar:"#a8895f" },
    eva:     { key:"#efe7dc", skin:"#f0cdb4", hair:"#c9c2b6", style:"grey", eye:"#5a6a4a", collar:"#9a7a5f", glasses:true },
    akos:    { key:"#dde5e8", skin:"#e6b48c", hair:"#8a8078", style:"grey", eye:"#4a4a3a", collar:"#5a6a72" },
    endre:   { key:"#e3e8df", skin:"#e6b48c", hair:"#5a5048", style:"short", eye:"#4a3a2a", collar:"#6a7250", glasses:true },
    mirella: { key:"#efe6f0", skin:"#f0cdb4", hair:"#c9a24a", style:"bob", eye:"#5a7d4a", collar:"#9a6f8f" },
    // secondary cast / roles — same skeleton, neutral keys
    marlene:{ key:"#efe6f0", skin:"#f0cdb4", hair:"#c9a24a", style:"bob", eye:"#5a7d4a", collar:"#9a6f8f" },
    peter:  { key:"#e2e6ef", skin:"#e8b892", hair:"#4a3a2a", style:"short", eye:"#3a2a1e", collar:"#42618a" },
    martin: { key:"#dfe9ef", skin:"#e9b892", hair:"#7a5a38", style:"short", eye:"#4a3a2a", collar:"#3e7ca8" },
    student:{ key:"#eef1dc", skin:"#f2d2b6", hair:"#3a2c1e", style:"short", eye:"#3a2a1e", collar:"#c7a23a" },
    parent: { key:"#e8e6f0", skin:"#e8b892", hair:"#4a3a2a", style:"short", eye:"#3a2a1e", collar:"#6a6a9a" },
    agent:  { key:"#e2ecef", skin:"#e6b48c", hair:"#2b2b2b", style:"short", eye:"#2b2b2b", collar:"#2e5e8c" },
    attendant:{ key:"#eae2ef", skin:"#f0cdb4", hair:"#3a2c22", style:"bob", eye:"#3a2a1e", collar:"#7a3a6a" },
    waiter: { key:"#e8e8e2", skin:"#e8b892", hair:"#2b241c", style:"short", eye:"#2b2b2b", collar:"#3a3a3a" },
    receptionist:{ key:"#e2ecec", skin:"#efc7a6", hair:"#6b4a2f", style:"bob", eye:"#4a3526", collar:"#2f8a86" },
  };
  var LABEL = { marta:"Marta", kira:"Kira", endika:"Endika", esztella:"Esztella", david:"David",
    panna:"Panna", margo:"Margó", eva:"Aunt Eva", akos:"Ákos", endre:"Endre", emma:"Emma", mirella:"Rita" };

  function hairPath(style, hair) {
    var s = ' fill="' + hair + '" stroke="' + INK + '" stroke-width="1.2" stroke-linejoin="round"/>';
    if (style === "bald") return "";
    if (style === "grey") return '<path d="M11 17c-1-8 4-12 9-12s10 4 9 12c-2-4-5-6-9-6s-7 2-9 6z"' + s;
    if (style === "bob")  return '<path d="M9.5 21c-1.5-10 4-14 10.5-14s12 4 10.5 14c-.5-2-1-4-2-5.5V25a2 2 0 0 1-2 2h-.5c1-3 1-8 1-10-2-2-4-3-7-3s-5 1-7 3c0 2 0 7 1 10H13a2 2 0 0 1-2-2v-4.5c-1 1.5-1.5 3.5-1.5 5.5z"' + s;
    return '<path d="M11 16c-1-8 4-11 9-11s10 3 9 11c-2-4-5-6-9-6s-7 2-9 6z"' + s;   // short
  }
  function propPath(prop) {
    if (prop === "scarf")  return '<path d="M13 30h14v3a7 7 0 0 1-14 0z" fill="#b8503f" stroke="'+INK+'" stroke-width="1.2" stroke-linejoin="round"/>';
    if (prop === "book")   return '<path d="M3 32h8v6H3z" fill="#4f9a97" stroke="'+INK+'" stroke-width="1.1" stroke-linejoin="round"/><path d="M7 32v6" stroke="'+INK+'" stroke-width=".8"/>';
    if (prop === "camera") return '<rect x="3" y="30" width="8" height="6" rx="1.5" fill="#3a3a3a" stroke="'+INK+'" stroke-width="1"/><circle cx="7" cy="33" r="1.6" fill="#f4ede0" stroke="'+INK+'" stroke-width=".8"/>';
    if (prop === "mane")   return '<path d="M33 24c4 0 6 4 6 10v6h-6c1-6 0-12 0-16z" fill="#8a5a30" stroke="'+INK+'" stroke-width="1.1" stroke-linejoin="round"/>';
    return "";
  }
  function build(id) {
    var p = P[id] || P.marta;
    var glasses = p.glasses
      ? '<g fill="none" stroke="'+INK+'" stroke-width="1.2"><circle cx="16.4" cy="19" r="3"/><circle cx="23.6" cy="19" r="3"/><path d="M19.4 19h1.2"/></g>' : "";
    var beard = p.beard
      ? '<path d="M20 28c4 0 7-2 8-5 .2 4.5-3 8-8 8s-8.2-3.5-8-8c1 3 4 5 8 5z" fill="'+p.hair+'" stroke="'+INK+'" stroke-width="1.2" stroke-linejoin="round"/>' : "";
    return '<svg viewBox="0 0 40 40" role="img" aria-label="'+(LABEL[id]||id)+'">'
      + '<rect width="40" height="40" fill="'+(p.key||p.bg||"#e6ede4")+'"/>'
      + '<path d="M6 40c1-9 7-13 14-13s13 4 14 13z" fill="'+p.collar+'" stroke="'+INK+'" stroke-width="1.3" stroke-linejoin="round"/>'
      + '<ellipse cx="20" cy="19" rx="9" ry="10" fill="'+p.skin+'" stroke="'+INK+'" stroke-width="1.3"/>'
      + beard + hairPath(p.style, p.hair)
      + '<circle cx="16.5" cy="19" r="1.3" fill="'+p.eye+'"/><circle cx="23.5" cy="19" r="1.3" fill="'+p.eye+'"/>'
      + glasses
      + '<path d="M16 24q4 3 8 0" stroke="#b5654a" stroke-width="1.3" fill="none" stroke-linecap="round"/>'
      + propPath(p.prop)
      + '</svg>';
  }
  var cache = {};
  M.avatarFor = function (id) { if (!id) id = "student"; if (!cache[id]) cache[id] = build(P[id] ? id : "student"); return cache[id]; };
  M.hasAvatar = function (id) { return !!P[id]; };
})(window.M);
```

### 5b. Scene bands — wide 16:6 horizon (`src/assets/scenes.js`)

- **Proportion:** `viewBox 0 0 400 150` (was 400×108) with `preserveAspectRatio="xMidYMid slice"`;
  the CSS `.scene{aspect-ratio:16/6}` frames it.
- **People are drawn small within the landscape**, same ink line. Recurring cast can be dropped in at
  figure scale (Marta sage, Kira blue + red scarf) so scenes feel populated by *her* people.
- **No baked text scrim** — the CSS caption plate (§4) owns legibility, so scene bottoms stay crisp.
- **Recipe (every scene):** vertical sky→honey `linearGradient` (the only gradients that exist) +
  one honey `radialGradient` sun-glow + a `--line-strong` horizon rule at `y≈94` + a ground band
  below + figures/props at figure scale. Ink strokes ~1.6, `stroke-linejoin round`. Keep low-detail
  and tiny in bytes.

#### Exemplar — Airport gate (fear-of-flying arc; Marta + Kira small at the gate, Kira's red scarf)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true" role="presentation">
  <defs>
    <linearGradient id="air-sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#dfeaf2"/><stop offset=".55" stop-color="#eef0ea"/><stop offset="1" stop-color="#f6e6cf"/>
    </linearGradient>
    <radialGradient id="air-sun" cx="0.82" cy="0.18" r="0.5">
      <stop offset="0" stop-color="#f6d79b" stop-opacity=".9"/><stop offset="1" stop-color="#f6d79b" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="air-clip"><rect width="400" height="150"/></clipPath>
  </defs>
  <g clip-path="url(#air-clip)">
    <rect width="400" height="150" fill="url(#air-sky)"/>
    <rect width="400" height="150" fill="url(#air-sun)"/>
    <circle cx="330" cy="32" r="15" fill="#f2c46b" opacity=".8"/>
    <ellipse cx="86" cy="38" rx="38" ry="11" fill="#faf6ec" opacity=".8"/>
    <ellipse cx="150" cy="50" rx="28" ry="8" fill="#faf6ec" opacity=".7"/>
    <path d="M0 94 H400 V150 H0 Z" fill="#e3ddce"/>
    <path d="M0 94 H400" stroke="var(--line-strong,#c4b697)" stroke-width="1.4"/>
    <g stroke="var(--ink,#2a2420)" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">
      <path d="M196 74 l60 -5 l20 -11 l6 2 l-9 14 l24 4 v4 l-36 2 l-14 11 l-6 -2 l3 -11 l-36 2 z" fill="#fbfbfd"/>
      <path d="M230 70 h40" stroke="#6fb3a9"/>
    </g>
    <g stroke="var(--line-strong,#c4b697)" stroke-width="4" fill="none">
      <path d="M0 8 H400"/><path d="M134 0 V94"/><path d="M266 0 V94"/>
    </g>
    <g stroke="var(--ink,#2a2420)" stroke-width="1.6" stroke-linejoin="round">
      <path d="M34 108 h44 v6 h-44 Z" fill="#0f6b60"/>
      <path d="M40 108 v-2 M72 108 v-2"/>
      <circle cx="48" cy="86" r="7" fill="#f3d3ba"/>
      <path d="M40 108 v-14 a8 8 0 0 1 16 0 v14 Z" fill="#7d9b86"/>
      <circle cx="70" cy="88" r="6.5" fill="#f0cdb4"/>
      <path d="M63 108 v-12 a7 7 0 0 1 14 0 v12 Z" fill="#5f86a6"/>
      <path d="M63 98 h14" stroke="#b8503f" stroke-width="3"/>
    </g>
  </g>
</svg>
```

**Updated `band()` wrapper + per-theme kit** (keep the `SCENES`/`MAP` structure; redraw each body to
the 400×150 canvas following the recipe — horizon at `y≈94`, ground below, figures `y 84–114`):

```js
function band(id, a, b, body) {
  return '<svg viewBox="0 0 400 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true" role="presentation">'
    + '<defs><linearGradient id="'+id+'" x1="0" y1="0" x2="0" y2="1">'
    + '<stop offset="0" stop-color="'+a+'"/><stop offset="1" stop-color="'+b+'"/></linearGradient></defs>'
    + '<rect width="400" height="150" fill="url(#'+id+')"/>' + body + '</svg>';
}
```

Per-theme middle layer (swap only the `body`): **welcome** hills + rising sun · **greeting/home**
doorway + warm interior · **family** overhead cups & plates · **food** plate + cutlery + cup ·
**travel** map horizon + dashed flight-path · **outdoors** sun + clouds + Panna's paddock rail (Luna
small at the fence) · **online** laptop with warm screen + Marta's reflection · **airport (`sky`)**
the exemplar above · **phone** a held handset with a video-call bubble. The `MAP` (u14/u15 → `sky`)
is unchanged.

### 5c. Decorative accents (all inline SVG, `currentColor`, `aria-hidden`; additive)

Provide these as small helpers (e.g. `M.decor.*`) the JS drops in where noted; each inherits
`currentColor` so it is theme-aware.

```html
<!-- dotted travel-map / flight-path divider — section separator + tilegrid connector -->
<svg viewBox="0 0 240 24" fill="none" aria-hidden="true" style="width:100%;height:24px">
  <circle cx="10" cy="12" r="3" fill="currentColor"/>
  <path d="M14 12 C70 2 120 22 176 10" stroke="currentColor" stroke-width="1.6" stroke-dasharray="1 7" stroke-linecap="round" opacity=".6"/>
  <path d="M226 6 l6 4 l-6 4 v-3 l-46 0 v-2 l46 0 z" fill="currentColor" opacity=".8"/>
</svg>

<!-- hand-drawn wobble underline — --warm-700 emphasis words / active tab -->
<svg viewBox="0 0 120 8" fill="none" aria-hidden="true" preserveAspectRatio="none" style="width:100%;height:6px">
  <path d="M2 5 C24 2 44 7 66 4 C88 1 104 6 118 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>

<!-- decorative sprig for the home hero, beside the avatar -->
<svg viewBox="0 0 40 40" fill="none" aria-hidden="true" style="width:34px;height:34px;color:var(--accent-300)">
  <path d="M20 34 C20 22 20 14 20 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M20 16 C15 14 12 15 11 11 C16 10 19 12 20 16 Z" fill="currentColor" opacity=".8"/>
  <path d="M20 22 C25 20 28 21 29 17 C24 16 21 18 20 22 Z" fill="currentColor" opacity=".8"/>
</svg>
```

The **stitched-corner** flourish and **iconwell** seat are done in CSS (`.card.stitched::before`,
`.iconwell`) so no extra SVG is needed there. The **completion ring** is the `.ring` component with
its serif tabular count in the well — the readable numeric fallback the 70+ mandate requires.

### 5d. Icon-set notes (`src/assets/icons.js`)

- **Unify stroke:** all outline icons to `stroke-width:2`, `stroke-linecap:round`,
  `stroke-linejoin:round` so they sit in the same ink hand as the illustration (add the round caps
  to `speaker`, `mic`, `globe`, `family`, `plane`).
- **Colour by role via `currentColor`:** `--ink` in neutral UI, `#fff` inside accent buttons,
  `--warm-700` for warm emphasis. **Never `--accent-300`** on an icon that must be read as content.
- **Never colour-alone:** keep the thick `check` (`stroke-width 2.4`) — it always accompanies the
  correct tint and the "on" switch. The `again` glyph is the gentle "not quite" mark.
- **Retire `heart`** (hard constraint: no hearts/streaks). Because `UNIT_VIS.u16` references it,
  reassign `u16` to `family` in the same change (see §7) so no tile loses its icon.
- **`plane`:** optionally redraw to the scene-band plane silhouette so icon, divider, and airport
  scene are one consistent aircraft.
- Interactive parents stay ≥ 48 px; icons remain decorative, labels remain mandatory.

---

## 6. Motion System

Calm, literary, premium — paper that settles, never bounces. Tokens live in §3 (`--ease-*`,
`--dur-*`, `--stagger`). Put the **keyframes** and the **stage-enter** rule in `base.css` (after the
tokens), and the **reduced-motion gates** at the end of `components.css` + in `responsive.css`.

### 6a. Keyframes (base.css)

```css
@keyframes stageIn  {from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none}}
@keyframes pageLift {from{opacity:0;transform:translateY(6px) scale(.985)} to{opacity:1;transform:none}}
@keyframes fbIn     {from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none}}
@keyframes bubbleIn {from{opacity:0;transform:translateY(8px) scale(.98)} to{opacity:1;transform:none}}
@keyframes checkPop {0%{opacity:0;transform:scale(.5)} 60%{opacity:1} 100%{opacity:1;transform:scale(1)}}
@keyframes settlePop{0%{transform:none} 55%{transform:scale(1.02)} 100%{transform:none}}
@keyframes nudgeOnce{0%,100%{transform:translateX(0)} 30%{transform:translateX(-4px)} 60%{transform:translateX(4px)}}
@keyframes typingDot{0%,60%,100%{opacity:.25;transform:translateY(0)} 30%{opacity:1;transform:translateY(-3px)}}
@keyframes nodeFill {from{opacity:0;transform:scale(.4)} to{opacity:1;transform:scale(1)}}
@keyframes pulse    {50%{opacity:.4}}
@keyframes fadeOnly {from{opacity:0} to{opacity:1}}   /* reduced-motion fallback */

/* screen / route enter — router swaps #main; these children cross-fade + rise as a screen */
body:not([data-motion="reduce"]) .stage,
body:not([data-motion="reduce"]) .card,
body:not([data-motion="reduce"]) .chat{animation:stageIn var(--dur-2) var(--ease-page) both}
body:not([data-motion="reduce"]) .wordcard{animation:pageLift var(--dur-3) var(--ease-page) both}
```

Component-level bindings (option settle/nudge/mark, feedback, bubbles, typing, spine nodes, done
badge, live pulses) are written inline with each component in §4; they all reference the keyframes
above.

### 6b. What animates, and how

| Element | Motion | Curve / duration |
|---|---|---|
| Screen / route enter (`.stage`,`.card`,`.chat`) | cross-fade + 8px rise | `--ease-page` / 220ms |
| Word cards (`.wordcard`) | page-lift, 6px rise + soft scale | `--ease-page` / 360ms |
| Button / tile press | 1px depress; hover box-shadow lift | `--ease-in-out` / 140ms |
| Option select | fill wipes L→R; left-rule + tint appear | `--ease-in-out` 180ms |
| Correct answer | one 1.02 settle + spring pop on ✓ glyph + moss rule | `--ease-spring` / 220ms |
| Wrong answer | ONE 4px nudge + honey rule + `again` glyph (no red, no loop) | `--ease-in-out` / 220ms |
| Feedback panel | fade + 6px rise (good adds settle) | `--ease-page` / 220ms |
| Chat bubbles | rise + settle, 60ms stagger; avatar nods on hover | `--ease-page` / 220ms |
| Typing dots | 3-dot breathe, staggered | `--ease-in-out` / 1.1s loop |
| Live dots (rec / speak / hint) | single slow heartbeat | `--ease-in-out` / 1.4s loop |
| Progress spine nodes | ink node pops as a step lands | `--ease-spring` / 220ms |
| Completion ring (`--p`) | eases 0→value; serif tabular count in the well | `--ease-page` / 360ms |
| Switch | track tints + knob slides; also labelled + ✓ glyph | `--ease-in-out` / 140ms |
| Completion badge | spring settle; glyph pops 120ms later — no confetti | `--ease-spring` / 360ms |

Every meaning-bearing state is redundant beyond colour **and** beyond motion: correct/wrong each
carry a positional left-rule + a glyph; the ring keeps its tabular count; the switch keeps its text
label + ✓ glyph — so it reads correctly for low-vision users and in the reduced-motion path.

### 6c. Reduced motion — DOUBLE-GATED (the locked hybrid)

Fires on **either** the in-app toggle **or** the OS preference. A blanket kills all animation and
transition (every state snaps to its visible end value — verified safe: marks, badges, tints, ring,
spine, switch thumb all reach their final rendered state with `animation/transition:none`). A higher-
specificity allowlist re-enables **opacity-only ≤120ms** fades on the big container reveals only.
Two identical blocks so each gate stands alone.

```css
/* ---------- Gate A: in-app toggle (put at END of components.css; replaces base.css line 51) ---------- */
body[data-motion="reduce"] *{animation:none !important;transition:none !important;scroll-behavior:auto !important}
body[data-motion="reduce"] .stage,
body[data-motion="reduce"] .card,
body[data-motion="reduce"] .wordcard,
body[data-motion="reduce"] .chat,
body[data-motion="reduce"] .turn,
body[data-motion="reduce"] .feedback,
body[data-motion="reduce"] .done-badge{animation:fadeOnly 120ms linear both !important}
body[data-motion="reduce"] .option{background-size:100% 100% !important}   /* fill snaps in */

/* ---------- Gate B: OS preference (replaces responsive.css lines 23–25) ---------- */
@media (prefers-reduced-motion: reduce){
  *{animation:none !important;transition:none !important;scroll-behavior:auto !important}
  .stage,.card,.wordcard,.chat,.turn,.feedback,.done-badge{animation:fadeOnly 120ms linear both !important}
  .option{background-size:100% 100% !important}
}
```

Why the allowlist wins over the blanket: `body[data-motion="reduce"] .stage` (specificity 0,2,1)
beats `body[data-motion="reduce"] *` (0,1,1); `.stage` (0,1,0) beats `*` (0,0,0) — with both
`!important`, higher specificity wins regardless of order. **When adding any new animation, add its
selector to this allowlist only if a state would otherwise be invisible; otherwise let it snap.**

---

## 7. Per-screen composition — `src/app/ui.js`

The existing `el()`-tree markup maps cleanly onto every restyle; these are the only JS touch-points.
Global: wrap each screen's reading/activity column in `.measure` (≈ 608px) while chrome keeps the
920px `.container`. Vertical rhythm between blocks ≈ `2rem`. No numbers shout; the ring shows % quietly.

- **Home (`home`, lines 59–125).** Reorder the hero children to **greeting-then-avatar-then-ring**
  (currently avatar first, line 66–73) so reading order is right; CSS `order` keeps avatar visually
  right. Drop the decorative **sprig** SVG (§5c, `aria-hidden`) beside the avatar. Greeting is serif
  via `.hero h1`. Then the full-bleed warm **scene band**, the honey `.recommend` "today" card (one
  primary Continue pill + secondary warm-up ghost link), then the **book-spine `.tilegrid`**
  (Lessons / Conversations / Practice) — convert the current `.card` rows to `.themetile` and drop
  the dotted **travel-map connector** (§5c) between rows. Monthly card last, quiet.
- **Lessons list (`lessons`, 143–171).** Serif page title → `.unit` accordions as spine cards, each
  with a `.progress` honey meter + `n/total` pill (already rendered) → `.lessonbtn` rows. One column
  in `.measure`. No markup change beyond wrapping in `.measure`.
- **Lesson runner (`lessonRunner`, 178–233).** The scene band (187–188) now renders 16:6 with the
  caption plate automatically. Wrap the step sequence in a `.spine` container and tag each step node
  `.node` (+ `.done`/`.current`) so the honey rail with ink nodes runs down the left margin; the
  `.progress` bar (193) may stay as a secondary meter or be replaced by the spine. Completion (212–
  231): the `.done-badge` gains a `.glyph` wrapper — change line 217 to
  `el("div",{class:"done-badge","aria-hidden":"true"},[el("span",{class:"glyph",html:dom.icon("check")})])`.
- **Exercises (`M.exercise.render` into `.stage`).** `.stage` is roomier (min-height 280, pad 2rem);
  `.prompt` at 1.2rem; options per §4 (fill-wipe + left-rule + spring); feedback lands with the
  spring on correct, one nudge on wrong. The `.mark` glyph is **already** injected by the engine
  (check on correct, `again` on wrong — see §8), so no JS change is needed for redundancy. Center in
  `.measure`.
- **Conversation (`talk` 262–269 → `M.conversation.render`).** Generous bubbles with window-lit
  soft-square avatars (§4). Change the HU line in `conversation.js` `emit()` (line 74) from
  `class:"muted"` (inline style) to `class:"hu"` so it becomes the quiet under-line the CSS styles.
  Optional: a faint kitchen-table scene as a scrim behind `.chat`.
- **Conversations list (`conversations`, 236–261).** Avatars are soft squares now (list uses
  `avatar small`); no change needed. Optionally promote the `.card` rows to `.themetile`.
- **Practice hub (`practice`, 302–365).** The vocab `.tilegrid` (328) already uses `.themetile` →
  picks up book-spine styling; add one `aria-hidden` dotted connector between rows. Collapsible
  cards keep the chevron rotate.
- **Reference (`reference`, 606–655).** `.measure` column of `.card`s; grammar callouts already use
  `.grammarbox` (now honey "margin notes"); serif section heads. Reads like a glossary chapter.
- **Settings (`settings`, 490–562).** `.setrow` rows in one `.card`; text-size control drives the
  three `--type-scale` modes (unchanged JS). Add the switch **✓ glyph**: in `toggle()` (line 573)
  insert `el("span",{class:"switch-check","aria-hidden":"true",html:dom.icon("check")})` inside
  `.switch-thumb`; the `.switch-lbl` text stays (state = label + position + glyph).
- **Help (`help`, 586–594).** `.measure` column, warm `.helppanel` blocks (teal-keyed), serif heads,
  lots of white space — the reassuring page.
- **Diagnostic (`diagnostic.js`).** Already calm (no score, no pass/fail). Just inherits the restyle;
  optionally cap the result with a `.done-badge` + a `.ring` tabular %, framed "here's where we'll
  start."

---

## 8. File-by-file implementation checklist

Work top-to-bottom. Each box is a discrete, verifiable change.

### `src/styles/base.css`
- [ ] Replace `:root{…}` (lines 2–36) with the **§3 token block**. Delete the old greenish
  `--elev-*`, clay `--accent-2`, and the `--fs:20px` line — all are re-expressed as tokens/aliases.
- [ ] Replace the `body[data-textsize]` overrides (lines 49–50) with the two `--type-scale` lines
  from §3.
- [ ] Replace the `body{…}` background + the `h1,h2,h3` block (lines 39–54) with **§3a** (warm ground
  radials retuned to honey/teal; serif heading roles; `p`/`strong`/`a`/utility classes; focus; `.container`/`.measure`).
- [ ] **Delete line 51** (`body[data-motion="reduce"] *{animation:none…}`) — it is superseded by the
  §6c Gate A block (which lives at the end of `components.css`).
- [ ] Keep `@property --p` (line 57). Replace the keyframe block (lines 58–67) + the stage-enter rule
  (64–67) with **§6a** (new `stageIn` 8px, `pageLift`, `checkPop`, `settlePop`, `nudgeOnce`,
  `typingDot`, `nodeFill`, `pulse`, `fadeOnly`; retire `nudge`/`popCheck`).
- [ ] Move `.btn` (80–95) and `.card` (98–105) out — they are re-issued in §4 (place in components.css).

### `src/styles/components.css`
- [ ] Replace every listed selector with its **§4** version: `.appbar`/`.navbtn` (1–15, navbtn → 48px),
  `.avatar` (17–21, circle → soft square), `.ring` (23–28), `.hero`/`.recommend` (30–38, +201–203),
  `.tilegrid`/`.themetile`/`.iconwell` (40–51), `.progress` (53–55), `.unit`/`.lessonbtn`/`.badge-status`
  (56–65), `.stage`/`.prompt`/`.wordcard`/`.stepbadge`/`.grammarbox` (67–80, 186–188), `.options`/`.option`
  (81–87, 159–165), `.blocks`/`.builder`/`.block` (88–92, 140–141), `.textin`/`select` (93–95, 126),
  `.feedback`/`.helppanel` (97–105, 170), `.chat`/`.turn`/`.face`/`.bubble`/`.typing`/`.support-tabs`
  (107–121, 172–184), `.setrow`/`.switch*`/`.recstate`/`.rec-dot`/`.spk-live` (124–139, 151–153),
  `.acc-head` (142–150), `.toast` (154–155), `.scene` (189–199, caption-plate), `.reviewbadge`/`.reviewskip`
  (205–213), `.done-badge` (215–216, + `.glyph`).
- [ ] Add the NEW rules: `.spine`/`.spine .node`/`.spine-fill`, `.card.stitched`, `.measure` (if not in
  base), the `.tnum` numerals block (near progress/chat).
- [ ] Reconcile `.face` to **44px** (drop the 48px override at old line 173).
- [ ] Append the **§6c Gate A** reduced-motion block at the very end (after all animated rules).

### `src/styles/responsive.css`
- [ ] Keep `.options` two-column at ≥640px (line 3).
- [ ] In the ≤639px block, **remove** the hardcoded `h1{font-size:1.45rem}` and
  `.wordcard .en{font-size:1.7rem}` (lines 10–11) — the single multiplier owns sizing now. Keep
  `.bubble{max-width:100%}` and `.btn-row .btn{flex:1}`.
- [ ] In the ≤380px block, **delete `:root{--fs:19px}`** (line 16) — it fights the multiplier; keep
  `.navbtn{font-size:.8rem}`.
- [ ] Keep the `@media(prefers-contrast:more)` block (retune `--line`/`--ink-soft` still valid).
- [ ] Replace the blanket `@media(prefers-reduced-motion){*{animation:none…}}` (lines 23–25) with the
  **§6c Gate B** block.

### `src/assets/marta-avatar.svg`
- [ ] Replace the entire file with **§5a Exemplar 1** (soft square rx 22, ink contour, baked glow,
  `--line-strong` frame). Used in the appbar brand, home hero, and completion — all pick it up.

### `src/assets/avatars.js`
- [ ] Replace the file with the **§5a paste-ready build** (ink contour, `key||bg`, `prop`, `LABEL`
  aria-labels). Verify each dialogue `characterId` in `conversation.js` (`endika, marlene, kira,
  esztella, mirella, peter, emma, margo, martin, david, panna, eva, akos, endre` + roles) resolves in
  `P` — all are present.

### `src/assets/scenes.js`
- [ ] Update `band()` to the **400×150** wrapper (§5b). Add/replace the `sky` scene with the
  **airport exemplar** (scrim removed). Redraw the other 10 scene bodies to the 150-high canvas
  following the recipe (horizon `y≈94`, ground below, figures `y 84–114`); `MAP` unchanged.

### `src/assets/icons.js`
- [ ] Add `stroke-linecap/linejoin:round` to `speaker`, `mic`, `globe`, `family`, `plane` for one
  ink hand.
- [ ] **Remove `heart`** (line 19). (Pair with the `ui.js` `UNIT_VIS.u16` change below.)
- [ ] Optional: redraw `plane` to the scene-band silhouette.

### `src/app/ui.js`
- [ ] Hero (66–73): reorder to greeting → avatar → ring; add the sprig SVG (§5c).
- [ ] `UNIT_VIS.u16` (line 54): change `"heart"` → `"family"` (heart is retired).
- [ ] Lesson runner (212–231): give `.done-badge` a `.glyph` span (see §7); wrap steps in `.spine`
  and tag nodes `.node`/`.done`/`.current`.
- [ ] `toggle()` (573): inject `<span class="switch-check" aria-hidden>` (check icon) into `.switch-thumb`.
- [ ] Wrap each screen's activity/reading column in `.measure`.
- [ ] (Practice/Conversations) optionally promote `.card` rows to `.themetile`; drop the dotted
  connector between `.tilegrid` rows.

### `src/engines/exercise.js` — **no required change** (verify only)
- [ ] Confirm the `.mark` glyph is injected on both states (it is: lines 104, 146, 434 add
  `check`/`again`) and `feedback()` (32–37) emits icon + text. The new CSS supplies the tint +
  positional rule + spring; redundancy already holds. (Optional: standardise the wrong-mark to a
  single glyph if desired — keep `again`.)

### `src/engines/conversation.js`
- [ ] `emit()` (line 74): change the HU line from `class:"muted"` (with inline style) to `class:"hu"`
  so it renders as the quiet bubble under-line.

### Verify (build + eyeball)
- [ ] Rebuild the single-file `dist/Marta_English.html`; confirm no external requests (fonts/CDN/img).
- [ ] Text-size A / A+ / A++ → 20 / 23 / 26 px; nothing below 16px at any mode.
- [ ] Reduced-motion (toggle **and** OS): no transforms/loops; states still legible (rings/bars snap,
  fills snap, gentle ≤120ms fades only on containers).
- [ ] Every interactive target ≥ 48px; focus ring visible on every control (teal `--focus`, 5.9:1).

---

## 9. Contrast ledger (AA verified on `--surface #faf6ec`, L≈0.924)

| Pair | Ratio | Role | Verdict |
|---|---|---|---|
| `--ink #2a2420` on surface | 16.1:1 | body / headings | AA ✓ |
| `--ink-soft #5c5147` on surface | 6.8:1 | HU help, meta, sub | AA ✓ (holds at 16px min) |
| white on `--accent-700 #0a544b` | 8.8:1 | primary button, me-bubble | AA ✓ |
| white on `--accent #0f6b60` | 6.4:1 | accent fills | AA ✓ |
| `--warm-700 #945311` on surface | 5.5:1 | links, eyebrows, labels | AA ✓ |
| `--warm-700` on `--warm-tint #f6e6cf` | 4.9:1 | ghost hover, wrong mark, badge | AA ✓ |
| `--good #3f7d3a` on surface | 4.63:1 | "done" text | AA ✓ |
| `--good` glyph on `--good-bg #e4eddb` | 4.15:1 | ✓ mark (graphical, ≥3:1) | ✓ |
| `--focus #0f6b60` vs surface | 5.9:1 | focus ring | ✓ always visible |
| `--warm #b46a1c` vs surface | 3.9:1 | **rules/borders/fills only** (≥3:1) | ✓ non-text |
| `--accent-300 #6fb3a9` vs surface | 2.2:1 | **decor/hover-hint only** — never text/focus | ✓ (by rule) |
| ink on scene caption plate (surface) | 16:1 | scene title | AA ✓ |

Every meaning-bearing state (correct · wrong · on · success · completion) is signalled by
**position + glyph + tint** together; no information is conveyed by colour, motion, or hue alone.
