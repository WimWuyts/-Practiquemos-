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
  };

  // ---- text matching for typed answers ----
  function norm(s) { return String(s || "").toLowerCase().replace(/[’']/g, "'").replace(/[.,!?;:"]/g, "").replace(/\s+/g, " ").trim(); }
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
        var tol = b.length <= 4 ? 0 : b.length <= 8 ? 1 : 2;
        return lev(a, b) <= tol;
      });
    },
    // intent: any keyword group present
    hasKeyword: function (input, keywords) {
      var a = " " + norm(input) + " ";
      return (keywords || []).some(function (k) { return a.indexOf(" " + norm(k) + " ") >= 0 || a.indexOf(norm(k)) >= 0; });
    },
  };
})(window.M);
