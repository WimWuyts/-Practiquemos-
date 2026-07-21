// Hash router + appbar. Keyboard-operable, semantic nav.
window.M = window.M || {};
(function (M) {
  var el, dom, main, liveRegion;
  var current = "home";
  var reviewSkipBtn = null, reviewBadge = null, reviewSkipHandler = null;

  var NAV = [
    ["home", "nav.home", "home"], ["lessons", "nav.lessons", "book"],
    ["conversations", "nav.conversations", "chat"], ["practice", "nav.practice", "star"],
    ["reference", "nav.reference", "list"],
    ["settings", "nav.settings", "gear"], ["help", "nav.help", "help"],
  ];

  function buildChrome() {
    el = M.dom.el; dom = M.dom;
    var bar = el("header", { class: "appbar" }, [
      el("div", { class: "brand" }, [el("span", { html: M.data.avatarSvg, class: "avatar small", "aria-hidden": "true" }), el("span", { text: M.i18n.t("app.title") })]),
      el("div", { class: "spacer" }),
    ]);
    var nav = el("nav", { "aria-label": "Main" });
    NAV.forEach(function (n) {
      var b = el("button", { class: "navbtn", "data-screen": n[0], onclick: function () { M.router.go(n[0]); } },
        [el("span", { html: dom.icon(n[2]), "aria-hidden": "true" }), " " + M.i18n.t(n[1])]);
      nav.appendChild(b);
    });
    bar.appendChild(nav);
    document.body.appendChild(bar);
    main = el("main", { class: "container", id: "main", tabindex: "-1" });
    document.body.appendChild(main);
    liveRegion = el("div", { class: "sr-only", "aria-live": "polite" });
    document.body.appendChild(liveRegion);
    // Reviewer chrome is always created (hidden); the Settings toggle / flag shows it.
    reviewSkipBtn = el("button", { class: "reviewskip hidden", type: "button", "aria-label": "Reviewer: skip this step" }, ["Skip ▸"]);
    reviewSkipBtn.addEventListener("click", function () { if (reviewSkipHandler) reviewSkipHandler(); });
    document.body.appendChild(reviewSkipBtn);
    reviewBadge = el("div", { class: "reviewbadge hidden", text: "REVIEWER MODE" });
    document.body.appendChild(reviewBadge);
    M.updateReviewChrome();
  }
  // Fixed reviewer Skip: point it at the current activity's advance; hide it elsewhere.
  M.setReviewSkip = function (fn) { reviewSkipHandler = fn; if (reviewSkipBtn) reviewSkipBtn.classList.toggle("hidden", !M.reviewMode()); };
  M.clearReviewSkip = function () { reviewSkipHandler = null; if (reviewSkipBtn) reviewSkipBtn.classList.add("hidden"); };
  // Reflect the current review mode on the badge (Skip stays hidden until an activity sets it).
  M.updateReviewChrome = function () {
    if (reviewBadge) reviewBadge.classList.toggle("hidden", !M.reviewMode());
    if (reviewSkipBtn && !M.reviewMode()) reviewSkipBtn.classList.add("hidden");
  };

  function setActive(screen) {
    Array.prototype.forEach.call(document.querySelectorAll(".navbtn"), function (b) {
      b.setAttribute("aria-current", b.dataset.screen === screen ? "page" : "false");
    });
  }

  function route() {
    var hash = (location.hash || "#home").slice(1);
    var parts = hash.split("/");
    var screen = parts[0] || "home";
    current = hash;
    dom.clear(main);
    if (M.clearReviewSkip) M.clearReviewSkip(); // activities re-show it; nav screens don't
    if (M.updateReviewChrome) M.updateReviewChrome();
    M.ui.init();
    if (screen === "lesson") { M.ui.lessonRunner(main, parts[1]); setActive("lessons"); }
    else if (screen === "talk") { M.ui.talk(main, parts[1]); setActive("conversations"); }
    else if (screen === "drill") { M.ui.vocabDrill(main, parts[1]); setActive("practice"); }
    else if (screen === "gram") { M.ui.grammarDrill(main, parts[1]); setActive("practice"); }
    else if (screen === "snd") { M.ui.soundDrill(main, parts[1]); setActive("practice"); }
    else if (screen === "spell") { M.ui.spellDrill(main, parts[1]); setActive("practice"); }
    else if (M.ui.screens[screen]) { M.ui.screens[screen](main); setActive(screen); }
    else { M.ui.screens.home(main); setActive("home"); }
    main.focus();
    if (liveRegion) liveRegion.textContent = screen;
    window.scrollTo(0, 0);
  }

  M.router = {
    start: function () { buildChrome(); window.addEventListener("hashchange", route); route(); },
    go: function (path) { if (("#" + path) === location.hash) route(); else location.hash = path; },
    refresh: function () { route(); },
    mountScreen: function (fn) { dom.clear(main); fn(main); main.focus(); },
  };
})(window.M);
