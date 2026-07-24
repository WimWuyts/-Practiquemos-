// Original, non-photorealistic vector avatars — single-weight ink line, keyed per person.
// Soft-square "tipped-in plate" framing comes from the CSS .avatar / .turn .face clip.
window.M = window.M || {};
(function (M) {
  var INK = "var(--ink,#2a2420)";
  // params: key(tint bg), skin, hair, style(short|bob|grey|bald), beard, eye, collar, glasses, prop
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
