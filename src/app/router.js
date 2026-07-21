// Hash router + appbar. Keyboard-operable, semantic nav.
window.M = window.M || {};
(function (M) {
  var el, dom, main, liveRegion;
  var current = "home";

  var NAV = [
    ["home", "nav.home", "home"], ["lessons", "nav.lessons", "book"],
    ["conversations", "nav.conversations", "chat"], ["practice", "nav.practice", "star"],
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
  }

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
    M.ui.init();
    if (screen === "lesson") { M.ui.lessonRunner(main, parts[1]); setActive("lessons"); }
    else if (screen === "talk") { M.ui.talk(main, parts[1]); setActive("conversations"); }
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
