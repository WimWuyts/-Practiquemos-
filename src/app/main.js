// Bootstrap: wire data indexes, apply settings, init audio, start router.
window.M = window.M || {};
(function (M) {
  function indexData() {
    var D = M.data;
    D._lexById = {}; D._lexByWord = {};
    D.lexicon.forEach(function (l) { D._lexById[l.id] = l; D._lexByWord[l.headword] = l; });
    D._chunkById = {}; D.chunks.forEach(function (c) { D._chunkById[c.id] = c; });
    D._grammarById = {}; D.grammar.forEach(function (g) { D._grammarById[g.id] = g; });
    D._dlgById = {}; D.dialogues.forEach(function (d) { D._dlgById[d.id] = d; });
  }

  function applySettings() {
    var s = M.store.settings();
    document.body.dataset.textsize = s.textSize || "normal";
    document.body.dataset.motion = s.reduceMotion ? "reduce" : "";
    document.documentElement.lang = "en";
  }

  M.boot = function () {
    if (!window.MARTA_DATA || !window.MARTA_I18N) {
      document.body.innerHTML = '<p style="padding:2rem;font-family:sans-serif">Data failed to load.</p>';
      return;
    }
    M.data = window.MARTA_DATA;
    M.strings = window.MARTA_I18N;
    indexData();
    applySettings();
    M.audio.init();
    M.onVoicesReady = function () {
      // refresh settings screen voice list if open
      if ((location.hash || "").indexOf("settings") >= 0 && M.router) M.router.refresh();
    };
    M.router.start();
    // first-run: send to diagnostic if never done
    if (!M.store.progress().diagnostic && !location.hash) M.router.go("diagnostic");
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", M.boot);
  else M.boot();
})(window.M);
