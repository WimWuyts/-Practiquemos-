// Backup: human-readable JSON export/import with validation. No uploads.
window.M = window.M || {};
(function (M) {
  M.backup = {
    export: function () {
      var payload = {
        _type: "MartaEnglishBackup", appVersion: M.store.APP_VERSION, schemaVersion: M.store.SCHEMA,
        exportedAt: new Date().toISOString(),
        settings: M.store.settings(), progress: M.store.progress(),
      };
      var blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "Marta_English_backup_" + new Date().toISOString().slice(0, 10) + ".json";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      M.dom.toast(M.i18n.t("backup.exported"));
    },
    validate: function (obj) {
      return obj && obj._type === "MartaEnglishBackup" && obj.progress && typeof obj.progress === "object" && obj.settings && typeof obj.settings === "object";
    },
    import: function (file, after) {
      var reader = new FileReader();
      reader.onload = function () {
        var obj;
        try { obj = JSON.parse(reader.result); } catch (e) { M.dom.toast(M.i18n.t("backup.invalid")); return; }
        if (!M.backup.validate(obj)) { M.dom.toast(M.i18n.t("backup.invalid")); return; }
        // migrate if needed, then replace atomically
        var settings = M.migrate("settings", obj.settings);
        var progress = M.migrate("progress", obj.progress);
        M.store.replaceAll(settings, progress);
        M.dom.toast(M.i18n.t("backup.imported"));
        after && after();
      };
      reader.onerror = function () { M.dom.toast(M.i18n.t("backup.invalid")); };
      reader.readAsText(file);
    },
  };
})(window.M);
