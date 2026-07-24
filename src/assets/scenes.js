// Inline SVG "scene bands": a wide 16:6 illustrated header per theme, so a lesson
// reads as a *place* (kitchen, family table, airport gate) rather than a form. Decorative
// only (aria-hidden). The CSS caption plate (§4) owns the title's legibility — no baked
// text scrim here, so the drawn people stay crisp. No external images — hand-drawn vector,
// offline-safe. Recipe: sky→honey gradient, horizon rule at y≈94, ground below, figures y 84–114.
window.M = window.M || {};
(function (M) {
  var INK  = "var(--ink,#2a2420)";
  var LINE = "var(--line-strong,#c4b697)";

  // Standard band: one vertical sky→honey linearGradient + scene-specific body. 400×150 canvas.
  function band(id, a, b, body) {
    return '<svg viewBox="0 0 400 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true" role="presentation">' +
      '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '"/></linearGradient></defs>' +
      '<rect width="400" height="150" fill="url(#' + id + ')"/>' + body + '</svg>';
  }
  // shared horizon rule at y≈94 (the one drawn line every landscape shares)
  var HORIZON = '<path d="M0 94 H400" stroke="' + LINE + '" stroke-width="1.4" opacity=".7"/>';

  // --- individual scenes (warm, low-detail so they read at a glance at band scale) ---
  var SCENES = {
    // warm welcome — soft hills + rising sun
    welcome: band("sc_w", "#eaf1f4", "#f4e6cd",
      '<circle cx="322" cy="44" r="25" fill="#f2c46b" opacity=".85"/>' +
      HORIZON +
      '<path d="M0 96 Q100 74 200 92 T400 86 V150 H0 Z" fill="#dfe7d2"/>' +
      '<path d="M0 112 Q120 96 240 108 T400 102 V150 H0 Z" fill="#cbd7b6"/>'),

    // greeting / home interior — a doorway open to warm light
    greeting: band("sc_g", "#e7f1ef", "#e2ecd6",
      '<path d="M0 118 H400" stroke="' + LINE + '" stroke-width="1.4" opacity=".7"/>' +
      '<circle cx="312" cy="52" r="22" fill="#f2c46b" opacity=".6"/>' +
      '<rect x="150" y="40" width="86" height="78" rx="5" fill="#bfe0d9" stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round"/>' +
      '<rect x="162" y="52" width="62" height="66" rx="3" fill="#f6e6cf"/>' +
      '<circle cx="216" cy="86" r="3.5" fill="#c8842b"/>' +
      '<path d="M60 118 v-34 a34 34 0 0 1 68 0 v34 Z" fill="#cfe4de" opacity=".8"/>'),

    // family table — cups + plates seen from above, three places set
    family: band("sc_f", "#f3ecf0", "#efe1ea",
      '<ellipse cx="200" cy="92" rx="176" ry="44" fill="#e6d3df"/>' +
      '<ellipse cx="200" cy="92" rx="176" ry="44" fill="none" stroke="' + LINE + '" stroke-width="1.4"/>' +
      '<circle cx="132" cy="84" r="18" fill="#f6eef2" stroke="' + INK + '" stroke-width="1.4"/>' +
      '<circle cx="200" cy="94" r="18" fill="#f6eef2" stroke="' + INK + '" stroke-width="1.4"/>' +
      '<circle cx="268" cy="84" r="18" fill="#f6eef2" stroke="' + INK + '" stroke-width="1.4"/>' +
      '<circle cx="132" cy="84" r="8" fill="#d7a6c0"/>' +
      '<circle cx="200" cy="94" r="8" fill="#c8842b"/>' +
      '<circle cx="268" cy="84" r="8" fill="#8fb98f"/>'),

    // travel — map horizon with a dashed flight-path arc
    travel: band("sc_t", "#e6eff4", "#f1e7d4",
      HORIZON +
      '<path d="M0 96 Q100 78 200 92 T400 86 V150 H0 Z" fill="#cfe0d3"/>' +
      '<path d="M50 130 C130 98 200 118 240 84 S350 58 372 44" fill="none" stroke="#c8842b" stroke-width="3" stroke-dasharray="1 8" stroke-linecap="round"/>' +
      '<path d="M366 38 l8 5 l-8 5 v-3 h-10 v-4 h10 z" fill="#a85436"/>' +
      '<circle cx="50" cy="130" r="5" fill="#a85436"/>'),

    // outdoors / weather — sun, clouds, and Panna's paddock rail (Luna small at the fence)
    outdoors: band("sc_o", "#e9f2f5", "#f2ecd9",
      '<circle cx="88" cy="52" r="24" fill="#f2c46b"/>' +
      '<ellipse cx="248" cy="52" rx="46" ry="18" fill="#fbf7ef"/>' +
      '<ellipse cx="300" cy="62" rx="38" ry="16" fill="#fbf7ef"/>' +
      HORIZON +
      '<path d="M0 100 Q120 88 240 98 T400 94 V150 H0 Z" fill="#d7e6c9"/>' +
      '<g stroke="#a8895f" stroke-width="3" stroke-linecap="round"><path d="M250 118 h96"/><path d="M262 104 v28 M334 104 v28"/></g>' +
      '<g stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round" fill="#c9a06a">' +
      '<path d="M296 112 q-2 -12 8 -12 q3 -4 8 -1 q6 1 6 8 v5 h-6 v-4 h-4 v4 z"/></g>'),

    // online / teaching — a laptop with a warm screen and Marta's reflection
    online: band("sc_l", "#e8f2f1", "#e2ece2",
      '<path d="M0 120 H400" stroke="' + LINE + '" stroke-width="1.4" opacity=".7"/>' +
      '<rect x="146" y="40" width="108" height="66" rx="6" fill="#2f6f66" stroke="' + INK + '" stroke-width="1.6"/>' +
      '<rect x="154" y="48" width="92" height="50" rx="3" fill="#f6e6cf"/>' +
      '<circle cx="200" cy="66" r="10" fill="#c8842b"/>' +
      '<path d="M184 86 q16 -13 32 0" fill="none" stroke="#a85436" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M132 106 h136 l12 10 h-160 Z" fill="#bcd9d3" stroke="' + INK + '" stroke-width="1.4" stroke-linejoin="round"/>'),

    // airport / sky — plane above clouds, Marta + Kira small at the gate (fear-of-flying arc)
    sky:
      '<svg viewBox="0 0 400 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true" role="presentation">' +
      '<defs><linearGradient id="air-sky" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#dfeaf2"/><stop offset=".55" stop-color="#eef0ea"/><stop offset="1" stop-color="#f6e6cf"/></linearGradient>' +
      '<radialGradient id="air-sun" cx="0.82" cy="0.18" r="0.5">' +
      '<stop offset="0" stop-color="#f6d79b" stop-opacity=".9"/><stop offset="1" stop-color="#f6d79b" stop-opacity="0"/></radialGradient></defs>' +
      '<rect width="400" height="150" fill="url(#air-sky)"/>' +
      '<rect width="400" height="150" fill="url(#air-sun)"/>' +
      '<circle cx="330" cy="32" r="15" fill="#f2c46b" opacity=".8"/>' +
      '<ellipse cx="86" cy="38" rx="38" ry="11" fill="#faf6ec" opacity=".8"/>' +
      '<ellipse cx="150" cy="50" rx="28" ry="8" fill="#faf6ec" opacity=".7"/>' +
      '<path d="M0 94 H400 V150 H0 Z" fill="#e3ddce"/>' +
      '<path d="M0 94 H400" stroke="' + LINE + '" stroke-width="1.4"/>' +
      '<g stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M196 74 l60 -5 l20 -11 l6 2 l-9 14 l24 4 v4 l-36 2 l-14 11 l-6 -2 l3 -11 l-36 2 z" fill="#fbfbfd"/>' +
      '<path d="M230 70 h40" stroke="#6fb3a9"/></g>' +
      '<g stroke="' + LINE + '" stroke-width="4" fill="none"><path d="M0 8 H400"/><path d="M134 0 V94"/><path d="M266 0 V94"/></g>' +
      '<g stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round">' +
      '<path d="M34 108 h44 v6 h-44 Z" fill="#0f6b60"/><path d="M40 108 v-2 M72 108 v-2"/>' +
      '<circle cx="48" cy="86" r="7" fill="#f3d3ba"/>' +
      '<path d="M40 108 v-14 a8 8 0 0 1 16 0 v14 Z" fill="#7d9b86"/>' +
      '<circle cx="70" cy="88" r="6.5" fill="#f0cdb4"/>' +
      '<path d="M63 108 v-12 a7 7 0 0 1 14 0 v12 Z" fill="#5f86a6"/>' +
      '<path d="M63 98 h14" stroke="#b8503f" stroke-width="3"/></g>' +
      '</svg>',

    // food / table — a plate, cutlery and a warm cup, from above
    food: band("sc_fd", "#f4ede1", "#eee2cd",
      '<ellipse cx="200" cy="88" rx="176" ry="44" fill="#e9dcc4"/>' +
      '<ellipse cx="200" cy="88" rx="176" ry="44" fill="none" stroke="' + LINE + '" stroke-width="1.4"/>' +
      '<circle cx="196" cy="86" r="38" fill="#faf5ec" stroke="' + INK + '" stroke-width="1.4"/>' +
      '<circle cx="196" cy="86" r="22" fill="#e7cfa0"/>' +
      '<rect x="128" y="62" width="5" height="46" rx="2.5" fill="#c7a05a" stroke="' + INK + '" stroke-width="1"/>' +
      '<rect x="262" y="62" width="5" height="46" rx="2.5" fill="#c7a05a" stroke="' + INK + '" stroke-width="1"/>' +
      '<circle cx="320" cy="78" r="18" fill="#faf5ec" stroke="' + INK + '" stroke-width="1.4"/>' +
      '<circle cx="320" cy="78" r="10" fill="#a85436"/>'),

    // home interior — a bright window with warm light + a plant on the sill
    home: band("sc_hm", "#edf1ea", "#e5eadb",
      '<path d="M0 120 H400" stroke="' + LINE + '" stroke-width="1.4" opacity=".7"/>' +
      '<rect x="150" y="32" width="100" height="76" rx="4" fill="#cfe0d9" stroke="' + INK + '" stroke-width="1.6"/>' +
      '<rect x="160" y="42" width="80" height="56" rx="2" fill="#f6efe0"/>' +
      '<path d="M200 42 v56 M160 70 h80" stroke="#cfe0d9" stroke-width="3"/>' +
      '<circle cx="315" cy="52" r="15" fill="#f2c46b" opacity=".7"/>' +
      '<path d="M92 108 q-6 -32 8 -42 q18 8 8 42 z" fill="#8fb98f" stroke="' + INK + '" stroke-width="1.4" stroke-linejoin="round"/>' +
      '<rect x="92" y="106" width="16" height="14" rx="2" fill="#c8842b" stroke="' + INK + '" stroke-width="1.2"/>'),

    // phone / video call — a held handset with a friendly face
    phone: band("sc_ph", "#e8f2f1", "#e1ece7",
      '<path d="M0 122 H400" stroke="' + LINE + '" stroke-width="1.4" opacity=".7"/>' +
      '<rect x="160" y="24" width="88" height="98" rx="11" fill="#2f6f66" stroke="' + INK + '" stroke-width="1.6"/>' +
      '<rect x="168" y="34" width="72" height="78" rx="4" fill="#f6e6cf"/>' +
      '<circle cx="204" cy="62" r="13" fill="#c8842b"/>' +
      '<path d="M184 92 q20 -16 40 0" fill="none" stroke="#a85436" stroke-width="3" stroke-linecap="round"/>' +
      '<circle cx="316" cy="60" r="10" fill="#e7b6a0"/>' +
      '<circle cx="96" cy="72" r="8" fill="#8fb98f"/>'),
  };

  var MAP = {
    u00: "welcome", u01: "greeting", u02: "family", u03: "travel", u04: "home",
    u05: "food", u06: "outdoors", u07: "phone", u08: "outdoors", u09: "travel",
    u10: "food", u11: "online", u12: "welcome", u13: "travel", u14: "sky",
    u15: "sky", u16: "family",
  };

  M.scenes = {
    // return the SVG markup for a unit's themed band (falls back to welcome)
    band: function (unitId) { return SCENES[MAP[unitId] || "welcome"] || SCENES.welcome; },
    forScene: function (name) { return SCENES[name] || SCENES.welcome; },
  };
})(window.M);
