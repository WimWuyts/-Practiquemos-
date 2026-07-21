// Inline SVG "scene bands": a soft, warm illustrated header per theme, so a lesson
// reads as a *place* (kitchen, family table, sky) rather than a form. Decorative only
// (aria-hidden). No external images — everything is hand-drawn vector, offline-safe.
window.M = window.M || {};
(function (M) {
  // a reusable soft gradient + rounded frame; `body` is the scene-specific art
  function band(id, a, b, body) {
    return (
      '<svg viewBox="0 0 400 108" preserveAspectRatio="xMidYMid slice" aria-hidden="true" role="presentation">' +
      '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '"/></linearGradient></defs>' +
      '<rect width="400" height="108" fill="url(#' + id + ')"/>' + body +
      '</svg>'
    );
  }

  // --- individual scenes (kept simple, warm, low-detail so they read at a glance) ---
  var SCENES = {
    // warm welcome — soft hills + rising sun
    welcome: band("sc_w", "#f6ecd6", "#f2e3c4",
      '<circle cx="330" cy="40" r="26" fill="#f2c46b" opacity=".85"/>' +
      '<path d="M0 90 Q100 62 200 82 T400 74 V108 H0 Z" fill="#dfe7d2"/>' +
      '<path d="M0 100 Q120 82 240 96 T400 92 V108 H0 Z" fill="#cdd9bd"/>'),
    // greeting / home interior — a doorway and warm light
    greeting: band("sc_g", "#e7f1ef", "#d8ebe7",
      '<rect x="40" y="30" width="70" height="78" rx="4" fill="#bfe0d9"/>' +
      '<rect x="52" y="42" width="46" height="66" rx="3" fill="#f4ede0"/>' +
      '<circle cx="90" cy="76" r="3" fill="#c8842b"/>' +
      '<circle cx="300" cy="44" r="22" fill="#f2c46b" opacity=".6"/>' +
      '<path d="M250 108 v-30 a30 30 0 0 1 60 0 v30 Z" fill="#cfe4de"/>'),
    // family table — cups + plates from above, together
    family: band("sc_f", "#f4ecf1", "#ecdfe8",
      '<ellipse cx="200" cy="70" rx="150" ry="34" fill="#e6d3df"/>' +
      '<circle cx="140" cy="66" r="15" fill="#f6eef2"/><circle cx="200" cy="72" r="15" fill="#f6eef2"/>' +
      '<circle cx="260" cy="66" r="15" fill="#f6eef2"/>' +
      '<circle cx="140" cy="66" r="7" fill="#d7a6c0"/><circle cx="200" cy="72" r="7" fill="#c8842b"/>' +
      '<circle cx="260" cy="66" r="7" fill="#8fb98f"/>'),
    // travel — map horizon with a winding path
    travel: band("sc_t", "#e7f0f4", "#d8e8f0",
      '<path d="M0 92 Q100 70 200 84 T400 78 V108 H0 Z" fill="#cfe0d3"/>' +
      '<path d="M60 108 C120 78 180 96 210 70 S320 52 360 40" fill="none" stroke="#c8842b" stroke-width="3" stroke-dasharray="2 8" stroke-linecap="round"/>' +
      '<circle cx="360" cy="40" r="6" fill="#a85436"/>'),
    // outdoors / weather — sky, sun, clouds
    outdoors: band("sc_o", "#eaf3f6", "#f3ecd9",
      '<circle cx="90" cy="48" r="24" fill="#f2c46b"/>' +
      '<ellipse cx="250" cy="52" rx="46" ry="20" fill="#fbf7ef"/><ellipse cx="300" cy="60" rx="40" ry="18" fill="#fbf7ef"/>' +
      '<path d="M0 96 Q120 84 240 94 T400 90 V108 H0 Z" fill="#d7e6c9"/>'),
    // online / teaching — a laptop with a warm screen
    online: band("sc_l", "#e9f2f2", "#dcebe9",
      '<rect x="150" y="34" width="100" height="60" rx="5" fill="#2f6f66"/>' +
      '<rect x="158" y="42" width="84" height="44" rx="3" fill="#f4ede0"/>' +
      '<path d="M140 96 h120 l10 8 h-140 Z" fill="#bcd9d3"/>' +
      '<circle cx="200" cy="60" r="9" fill="#c8842b"/><path d="M186 78 q14 -12 28 0" fill="none" stroke="#a85436" stroke-width="3"/>'),
    // airport / sky — plane above clouds
    sky: band("sc_s", "#e3eef6", "#eef4f8",
      '<circle cx="320" cy="40" r="20" fill="#f2c46b" opacity=".55"/>' +
      '<path d="M60 58 l120 -14 l40 -26 l10 4 l-18 30 l40 6 v6 l-70 -2 l-24 26 l-9 -3 l6 -24 z" fill="#fbfbfd" stroke="#bcd0e0" stroke-width="1.5"/>' +
      '<ellipse cx="120" cy="92" rx="52" ry="18" fill="#f2f6fa"/><ellipse cx="290" cy="96" rx="60" ry="20" fill="#f2f6fa"/>'),
    // food / table — a plate, cutlery and a warm cup, from above
    food: band("sc_fd", "#f5eee2", "#efe4cf",
      '<ellipse cx="200" cy="66" rx="150" ry="34" fill="#e9dcc4"/>' +
      '<circle cx="200" cy="64" r="30" fill="#faf5ec"/><circle cx="200" cy="64" r="18" fill="#e7cfa0"/>' +
      '<rect x="150" y="48" width="4" height="34" rx="2" fill="#c7a05a"/>' +
      '<rect x="246" y="48" width="4" height="34" rx="2" fill="#c7a05a"/>' +
      '<circle cx="300" cy="60" r="15" fill="#faf5ec"/><circle cx="300" cy="60" r="8" fill="#a85436"/>'),
    // home interior — window with warm light + a plant
    home: band("sc_hm", "#eef1ea", "#e3e8dd",
      '<rect x="150" y="26" width="100" height="70" rx="4" fill="#cfe0d9"/>' +
      '<rect x="160" y="36" width="80" height="50" rx="2" fill="#f6efe0"/><path d="M200 36 v50 M160 61 h80" stroke="#cfe0d9" stroke-width="3"/>' +
      '<circle cx="315" cy="46" r="14" fill="#f2c46b" opacity=".7"/>' +
      '<path d="M92 96 q-6 -30 8 -40 q18 8 8 40 z" fill="#8fb98f"/><rect x="94" y="94" width="12" height="12" fill="#c8842b"/>'),
    // phone / video call — a phone with a friendly face
    phone: band("sc_ph", "#e9f2f1", "#dcece9",
      '<rect x="158" y="24" width="84" height="74" rx="9" fill="#2f6f66"/>' +
      '<rect x="166" y="32" width="68" height="58" rx="4" fill="#f4ede0"/>' +
      '<circle cx="200" cy="54" r="11" fill="#c8842b"/><path d="M182 78 q18 -14 36 0" fill="none" stroke="#a85436" stroke-width="3"/>' +
      '<circle cx="300" cy="52" r="9" fill="#e7b6a0"/><circle cx="110" cy="60" r="7" fill="#8fb98f"/>'),
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
