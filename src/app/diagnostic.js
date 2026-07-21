// Friendly diagnostic — no score, no red failures. Sets audio + a warm recommendation.
window.M = window.M || {};
(function (M) {
  M.diagnostic = {
    render: function (mount, done) {
      var el = M.dom.el, dom = M.dom;
      dom.clear(mount);
      // Reviewer mode: skip the whole warm-up and land on Home (not the diagnostic lesson).
      if (M.reviewMode() && M.setReviewSkip) M.setReviewSkip(function () {
        M.store.setDiagnostic({ known: 0, total: probe.length, recommend: "u01-l01", at: 0 });
        M.router.go("home");
      });
      // small familiar-word probe (all easy words Marta likely half-knows)
      var probe = ["hello", "family", "coffee", "thank you", "water", "airport"].map(function (w) {
        return M.data.lexicon.find(function (l) { return l.headword === w; });
      }).filter(Boolean);
      var i = 0, known = 0;
      function step() {
        dom.clear(mount);
        mount.appendChild(el("h2", { text: M.i18n.t("diag.title") }));
        mount.appendChild(el("p", { class: "muted", text: M.i18n.t("diag.intro") }));
        if (i >= probe.length) return result();
        var lx = probe[i];
        var card = el("div", { class: "card wordcard" }, [el("div", { class: "en", text: lx.headword })]);
        card.appendChild(el("div", { class: "btn-row" }, [
          el("button", { class: "btn secondary", onclick: function () { M.audio.speak(lx.tts); } }, [el("span", { html: dom.icon("speaker") }), " " + M.i18n.t("btn.listen")]),
        ]));
        mount.appendChild(card);
        mount.appendChild(el("p", { class: "prompt", text: M.i18n.t("diag.q.know") }));
        mount.appendChild(el("div", { class: "options" }, [
          opt(M.i18n.t("diag.yes"), function () { known++; M.store.touchItem(lx.id, "meaning", true); i++; step(); }),
          opt(M.i18n.t("diag.some"), function () { M.store.touchItem(lx.id, "meaning", true); i++; step(); }),
          opt(M.i18n.t("diag.no"), function () { i++; step(); }),
        ]));
        mount.appendChild(el("p", { class: "muted", text: (i + 1) + " / " + probe.length }));
      }
      function opt(label, fn) { return el("button", { class: "option", onclick: fn }, [el("span", { text: label })]); }
      function result() {
        M.store.setDiagnostic({ known: known, total: probe.length, recommend: "u01-l01", at: Date.now() });
        dom.clear(mount);
        mount.appendChild(el("div", { class: "card" }, [
          el("h2", { text: M.i18n.t("diag.title") }),
          el("p", { text: M.i18n.t("diag.result") }),
          M.i18n.helpAvailable() ? el("p", { class: "muted", text: M.i18n.hu("diag.result") }) : null,
        ]));
        mount.appendChild(el("div", { class: "btn-row" }, [
          el("button", { class: "btn", onclick: function () { done(true); } }, [M.i18n.t("btn.continue")]),
        ]));
      }
      step();
    },
  };
})(window.M);
