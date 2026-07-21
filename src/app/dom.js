// Tiny DOM helpers + shared data accessors + text matching.
window.M = window.M || {};
(function (M) {
  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      if (k === "class") n.className = attrs[k];
      else if (k === "html") n.innerHTML = attrs[k];
      else if (k === "text") n.textContent = attrs[k];
      else if (k.slice(0, 2) === "on" && typeof attrs[k] === "function") n.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
      else if (attrs[k] != null && attrs[k] !== false) n.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c == null) return; n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  }
  // Reviewer/demo mode: lets a helper page through every activity without answering.
  // On when: the Settings toggle is set, the file bakes in window.MARTA_REVIEW,
  // or the URL carries ?review / #review.
  M.reviewMode = function () {
    try {
      if (M.store && M.store.settings && M.store.settings().reviewer === true) return true;
      return window.MARTA_REVIEW === true || /[?#&]review\b/i.test(location.href || "");
    } catch (e) { return false; }
  };
  M.dom = {
    el: el,
    clear: function (node) { while (node.firstChild) node.removeChild(node.firstChild); return node; },
    icon: function (name) { return (M.icons && M.icons[name]) || ""; },
    shuffle: function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(((i + 1) * (M._seed = (M._seed * 9301 + 49297) % 233280) / 233280)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; },
    toast: function (msg) {
      var t = el("div", { class: "toast", role: "status", text: msg });
      document.body.appendChild(t);
      setTimeout(function () { t.remove(); }, 3200);
    },
  };
  M._seed = 12345;

  // ---- data accessors ----
  M.get = {
    lex: function (id) { return M.data._lexById[id]; },
    chunk: function (id) { return M.data._chunkById[id]; },
    grammar: function (id) { return M.data._grammarById[id]; },
    lesson: function (id) { return M.data.lessons[id]; },
    dialogue: function (id) { return M.data._dlgById[id]; },
    family: function (id) { return (M.data.pronunciation.spellingFamilies || []).find(function (f) { return f.id === id; }); },
    focus: function (id) { return (M.data.pronunciation.soundFocus || []).find(function (f) { return f.id === id; }); },
    unit: function (id) { return (M.data.course.units || []).find(function (u) { return u.id === id; }); },
    // Realistic distractor words for a multiple-choice item: prefer the item's own
    // pre-computed same-theme/same-POS distractors, then same theme+POS, then same POS.
    // opts.iconSpecific -> only words that have their own picture (for icon tasks).
    distractorWords: function (target, n, opts) {
      opts = opts || {};
      var out = [], seen = {}; seen[target.id] = 1;
      function add(l) { if (l && !seen[l.id] && (!opts.iconSpecific || l.iconSpecific) && out.length < n) { seen[l.id] = 1; out.push(l); } }
      (target.distractors || []).forEach(function (hw) { add(M.data._lexByWord[hw]); });
      if (out.length < n) M.dom.shuffle(M.data.lexicon.filter(function (l) {
        return l.partOfSpeech === target.partOfSpeech && l.themes[0] === target.themes[0];
      })).forEach(add);
      if (out.length < n) M.dom.shuffle(M.data.lexicon.filter(function (l) {
        return l.partOfSpeech === target.partOfSpeech;
      })).forEach(add);
      return out;
    },
  };

  // ---- text matching for typed answers ----
  // Forgiving on purpose: a 70+ learner on a real keyboard should never be punished
  // for a stray accent, British/US spelling, a hyphen, or a single-key slip.
  var BRIT_US = [
    ["colour", "color"], ["favourite", "favorite"], ["neighbour", "neighbor"], ["flavour", "flavor"],
    ["centre", "center"], ["theatre", "theater"], ["metre", "meter"], ["litre", "liter"],
    ["realise", "realize"], ["organise", "organize"], ["recognise", "recognize"], ["apologise", "apologize"],
    ["travelling", "traveling"], ["cancelled", "canceled"], ["grey", "gray"], ["practise", "practice"],
    ["mum", "mom"], ["aeroplane", "airplane"],
  ];
  function norm(s) {
    var t = String(s || "").toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")   // strip diacritics (á→a, é→e)
      .replace(/[’']/g, "'").replace(/[.,!?;:"]/g, "")
      .replace(/[-–—]/g, " ")                    // hyphen/dash → space (re-book ≈ rebook)
      .replace(/\s+/g, " ").trim();
    // normalise British/US spelling to a single canonical form, both directions
    BRIT_US.forEach(function (p) {
      t = (" " + t + " ").split(" " + p[1] + " ").join(" " + p[0] + " ").trim();
    });
    return t;
  }
  function lev(a, b) {
    var m = a.length, n = b.length, d = [];
    for (var i = 0; i <= m; i++) d[i] = [i];
    for (var j = 0; j <= n; j++) d[0][j] = j;
    for (i = 1; i <= m; i++) for (j = 1; j <= n; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[m][n];
  }
  M.match = {
    norm: norm,
    // exact-ish: tolerate case, punctuation, and tiny spelling slips (<=1 for short, <=2 for long)
    close: function (input, accepted) {
      var a = norm(input); if (!a) return false;
      return (accepted || []).some(function (t) {
        var b = norm(t); if (!b) return false;
        if (a === b) return true;
        // one slip is always forgiven, even on short words; longer words allow more.
        // Kept tight enough that distinct short words (home/house, cat/cut) don't collide.
        var tol = b.length <= 4 ? 1 : b.length <= 8 ? 2 : 3;
        return lev(a, b) <= tol;
      });
    },
    // strict-but-fair: normalised equality (case/accent/punct/spelling-variant tolerant)
    // but NOT typo-tolerant — for grammar forms where teach≠teaches is the whole point.
    exact: function (input, accepted) {
      var a = norm(input); if (!a) return false;
      return (accepted || []).some(function (t) { return norm(t) === a; });
    },
    // intent: any keyword group present
    hasKeyword: function (input, keywords) {
      var a = " " + norm(input) + " ";
      return (keywords || []).some(function (k) { return a.indexOf(" " + norm(k) + " ") >= 0 || a.indexOf(norm(k)) >= 0; });
    },
  };
})(window.M);
