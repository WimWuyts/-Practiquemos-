// Original, non-photorealistic vector avatars for the family & roles.
// Built from a small parameter table so faces stay consistent and light-weight.
window.M = window.M || {};
(function (M) {
  // params: bg, skin, hair, hairStyle(short|bob|bald|grey), beard(bool), eye, collar
  var P = {
    marta:   { bg: "#eaddc7", skin: "#f3d3ba", hair: "#b8ae9d", style: "grey", eye: "#3f7bb0", collar: "#7d9b86", glasses: true },
    endika:  { bg: "#dfe7d8", skin: "#e6b48c", hair: "#2b241c", style: "short", beard: true, eye: "#3a2a1e", collar: "#4d6b7a" },
    marlene: { bg: "#efe6f0", skin: "#f0cdb4", hair: "#c9a24a", style: "bob", eye: "#5a7d4a", collar: "#9a6f8f" },
    kira:    { bg: "#e6dced", skin: "#f0cdb4", hair: "#6b4a2f", style: "bob", eye: "#4a3526", collar: "#c9829a" },
    esztella:{ bg: "#e0ecec", skin: "#efc7a6", hair: "#8a5a30", style: "bob", eye: "#5a3a22", collar: "#4f9a97" },
    mirella: { bg: "#f0e0d6", skin: "#edc3a3", hair: "#3a2c22", style: "bob", eye: "#3a2a1e", collar: "#b06a4e" },
    peter:   { bg: "#e2e6ef", skin: "#e8b892", hair: "#4a3a2a", style: "short", eye: "#3a2a1e", collar: "#42618a" },
    emma:    { bg: "#f1ead8", skin: "#f2d2b6", hair: "#caa24e", style: "bob", eye: "#5a4a2a", collar: "#8aa06a" },
    martin:  { bg: "#dfe9ef", skin: "#e9b892", hair: "#7a5a38", style: "short", eye: "#4a3a2a", collar: "#3e7ca8" },
    david:   { bg: "#e4e9e2", skin: "#e6b48c", hair: "#3a2c1e", style: "short", eye: "#3a2a1e", collar: "#5a8a6a" },
    panna:   { bg: "#f0e6ec", skin: "#f2d2b6", hair: "#5a3a22", style: "bob", eye: "#4a3526", collar: "#b57a95" },
    margo:   { bg: "#ece4d6", skin: "#f0cdb4", hair: "#c0bbb0", style: "grey", eye: "#5a6a4a", collar: "#a8895f" },
    // roles (neutral, friendly)
    student: { bg: "#eef1dc", skin: "#f2d2b6", hair: "#3a2c1e", style: "short", eye: "#3a2a1e", collar: "#c7a23a" },
    parent:  { bg: "#e8e6f0", skin: "#e8b892", hair: "#4a3a2a", style: "short", eye: "#3a2a1e", collar: "#6a6a9a" },
    agent:   { bg: "#e2ecef", skin: "#e6b48c", hair: "#2b2b2b", style: "short", eye: "#2b2b2b", collar: "#2e5e8c" },
    attendant:{ bg: "#eae2ef", skin: "#f0cdb4", hair: "#3a2c22", style: "bob", eye: "#3a2a1e", collar: "#7a3a6a" },
    waiter:  { bg: "#e8e8e2", skin: "#e8b892", hair: "#2b241c", style: "short", eye: "#2b2b2b", collar: "#3a3a3a" },
    receptionist:{ bg: "#e2ecec", skin: "#efc7a6", hair: "#6b4a2f", style: "bob", eye: "#4a3526", collar: "#2f8a86" },
  };

  function hairPath(style, hair, skin) {
    if (style === "bald") return "";
    if (style === "grey") return '<path d="M11 17c-1-8 4-12 9-12s10 4 9 12c-2-4-5-6-9-6s-7 2-9 6z" fill="' + hair + '"/>';
    if (style === "bob") return '<path d="M9.5 21c-1.5-10 4-14 10.5-14s12 4 10.5 14c-.5-2-1-4-2-5.5V25a2 2 0 0 1-2 2h-.5c1-3 1-8 1-10-2-2-4-3-7-3s-5 1-7 3c0 2 0 7 1 10H13a2 2 0 0 1-2-2v-4.5c-1 1.5-1.5 3.5-1.5 5.5z" fill="' + hair + '"/>';
    // short
    return '<path d="M11 16c-1-8 4-11 9-11s10 3 9 11c-2-4-5-6-9-6s-7 2-9 6z" fill="' + hair + '"/>';
  }

  function build(id) {
    var p = P[id] || P.marta;
    var g = p.glasses
      ? '<g fill="none" stroke="#6b6357" stroke-width="1.1"><circle cx="16.4" cy="19" r="2.9"/><circle cx="23.6" cy="19" r="2.9"/><path d="M19.3 19h1.4"/></g>'
      : "";
    var beard = p.beard
      ? '<path d="M20 28c4 0 7-2 8-5 .2 4.5-3 8-8 8s-8.2-3.5-8-8c1 3 4 5 8 5z" fill="' + p.hair + '"/>'
      : "";
    return '<svg viewBox="0 0 40 40" role="img" aria-label="' + id + '">'
      + '<rect width="40" height="40" fill="' + p.bg + '"/>'
      + '<path d="M6 40c1-9 7-13 14-13s13 4 14 13z" fill="' + p.collar + '"/>'
      + '<ellipse cx="20" cy="19" rx="9" ry="10" fill="' + p.skin + '"/>'
      + beard
      + hairPath(p.style, p.hair, p.skin)
      + '<circle cx="16.5" cy="19" r="1.3" fill="' + p.eye + '"/><circle cx="23.5" cy="19" r="1.3" fill="' + p.eye + '"/>'
      + g
      + '<path d="M16 24q4 3 8 0" stroke="#b5654a" stroke-width="1.3" fill="none" stroke-linecap="round"/>'
      + '</svg>';
  }

  var cache = {};
  M.avatarFor = function (id) {
    if (!id) id = "student";
    if (!cache[id]) cache[id] = build(P[id] ? id : "student");
    return cache[id];
  };
  M.hasAvatar = function (id) { return !!P[id]; };
})(window.M);
