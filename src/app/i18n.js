// i18n: central strings, no UI text hard-coded in logic elsewhere.
window.M = window.M || {};
(function (M) {
  M.i18n = {
    // t(key) -> UI language string. UI is English-primary; Hungarian used for help.
    t: function (key) {
      var en = (M.strings && M.strings.en) || {};
      return en[key] != null ? en[key] : key;
    },
    // hu(key) -> Hungarian string for help / bilingual labels
    hu: function (key) {
      var h = (M.strings && M.strings.hu) || {};
      return h[key] != null ? h[key] : (M.i18n.t(key));
    },
    // label(key): bilingual menu label depending on helpMode
    label: function (key) {
      var s = M.store.settings();
      var en = M.i18n.t(key);
      if (s.helpMode === "menu" || s.helpMode === "panels" || s.helpMode === "heavy") {
        var hu = M.i18n.hu(key);
        if (hu && hu !== en) return en + " · " + hu;
      }
      return en;
    },
    helpAvailable: function () { return M.store.settings().helpLang === "hu"; },
  };
})(window.M);
