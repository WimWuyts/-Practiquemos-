// Simple, transparent spaced-review model suitable for local storage.
window.M = window.M || {};
(function (M) {
  var DAY = 24 * 60 * 60 * 1000;
  // steps grow gently with successful contexts
  var STEPS = [1, 2, 4, 8, 16, 30];
  M.review = {
    nextDue: function (item) {
      var s = Math.min((item.contexts || 0), STEPS.length - 1);
      return Date.now() + STEPS[s] * DAY;
    },
    isDue: function (item) {
      if (!item) return false;
      return (item.next || 0) <= Date.now();
    },
    // items (productive) due for review, most overdue first
    dueItems: function (limit) {
      var prog = M.store.progress().items;
      var out = [];
      M.data.lexicon.forEach(function (l) {
        if (l.status !== "productive") return;
        var it = prog[l.id];
        if (it && M.review.isDue(it)) out.push({ id: l.id, next: it.next });
      });
      out.sort(function (a, b) { return a.next - b.next; });
      return out.slice(0, limit || 12).map(function (x) { return x.id; });
    },
    statusLabel: function (id) {
      var map = {
        "new": M.i18n.t("status.new"), "practising": M.i18n.t("status.practising"),
        "familiar": M.i18n.t("status.familiar"), "ready": M.i18n.t("status.ready"),
        "review": M.i18n.t("status.review"),
      };
      return map[M.store.itemStatus(id)] || map["new"];
    },
  };
})(window.M);
