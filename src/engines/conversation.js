// Conversation engine: guided dialogue graph, 3 support styles, human-like repair.
window.M = window.M || {};
(function (M) {
  var CHAR = {
    endika: "Endika", marlene: "Marlene", kira: "Kira", esztella: "Esztella", mirella: "Rita",
    peter: "Peter", emma: "Emma", margo: "Margó", martin: "Martin", david: "David", panna: "Panna",
    eva: "Aunt Eva", akos: "Ákos", endre: "Endre", student: "Student", parent: "Parent",
    agent: "Airport staff", attendant: "Flight attendant", waiter: "Waiter", receptionist: "Receptionist",
  };

  M.conversation = {
    render: function (mount, dialogueId, done) {
      var el = M.dom.el, dom = M.dom;
      var dlg = M.get.dialogue(dialogueId);
      if (!dlg) return done(true);
      dom.clear(mount);
      var memory = {};
      var chat = el("div", { class: "chat", "aria-live": "polite" });
      var interact = el("div", {});
      mount.appendChild(el("div", { class: "avatar-row" }, [
        el("div", { class: "pill", text: dlg.scene.en + (M.i18n.helpAvailable() ? " · " + dlg.scene.hu : "") }),
      ]));
      mount.appendChild(chat);
      mount.appendChild(interact);
      // Reviewer mode: the fixed Skip button jumps straight past the whole dialogue.
      if (M.reviewMode() && M.setReviewSkip) M.setReviewSkip(function () { done(true); });

      function who(id) { return CHAR[id] || id; }
      function bubble(side, name, text, charId) {
        var faceId = side === "me" ? "marta" : (charId || dlg.characterId);
        var turn = el("div", { class: "turn " + side }, [
          el("span", { class: "face", "aria-hidden": "true", html: M.avatarFor(faceId) }),
          el("div", { class: "bubble" }, [el("div", { class: "who", text: name }), el("span", { text: text })]),
        ]);
        chat.appendChild(turn); turn.scrollIntoView({ block: "nearest" });
        return turn.querySelector(".bubble");
      }
      // a short "typing…" beat before the partner speaks — makes the chat feel alive
      function typingBubble(name, charId) {
        var turn = el("div", { class: "turn them", "aria-hidden": "true" }, [
          el("span", { class: "face", html: M.avatarFor(charId || dlg.characterId) }),
          el("div", { class: "bubble" }, [
            el("div", { class: "who", text: name }),
            el("div", { class: "typing" }, [el("i", {}), el("i", {}), el("i", {})]),
          ]),
        ]);
        chat.appendChild(turn); turn.scrollIntoView({ block: "nearest" });
        return turn;
      }

      function go(nodeId) {
        dom.clear(interact);
        var node = dlg.nodes[nodeId];
        if (!node) return finish();
        if (!node.speaker) return proceed(node);
        // character line (with optional variation for non-identical repeats)
        var line = node.text;
        if (node.alts && node.alts.length) {
          M._seed = (M._seed * 9301 + 49297) % 233280;
          line = node.alts[Math.floor(M._seed / 233280 * node.alts.length)] || node.text;
        }
        node = Object.assign({}, node, { text: line, tts: line.en });
        if (document.body.dataset.motion === "reduce") { emit(node); proceed(node); return; }
        var typing = typingBubble(who(node.speaker), node.speaker);
        setTimeout(function () {
          if (!chat.isConnected) return; // user navigated away during the beat — don't speak/append
          if (typing.parentNode) typing.parentNode.removeChild(typing);
          emit(node); proceed(node);
        }, 700);
      }
      function emit(node) {
        var bb = bubble("them", who(node.speaker), node.text.en, node.speaker);
        M.audio.speak(node.tts || node.text.en);
        if (M.i18n.helpAvailable() && node.text.hu) bb.appendChild(el("div", { class: "muted", style: "margin-top:.3rem;font-size:.9rem", text: node.text.hu }));
      }
      function proceed(node) {
        var r = node.response || { mode: "end" };
        if (r.mode === "end") return finish();
        // gentle "listen again" affordance — no jarring "Your turn" banner
        interact.appendChild(el("div", { class: "btn-row" }, [
          el("button", { class: "btn ghost small", onclick: function () { M.audio.speak(node.tts || node.text.en); } }, [el("span", { html: dom.icon("speaker") }), " " + M.i18n.t("btn.listen")]),
        ]));
        if (r.mode === "choose") return renderChoose(node, r);
        if (r.mode === "build") return renderBuild(node, r);
        if (r.mode === "type") return renderType(node, r);
        finish();
      }

      function renderChoose(node, r) {
        var opts = el("div", { class: "options" });
        dom.shuffle(r.choices).forEach(function (ch) {
          var b = el("button", { class: "option" }, [el("span", { text: ch.text.en })]);
          b.addEventListener("click", function () {
            Array.prototype.forEach.call(opts.children, function (c) { c.disabled = true; });
            b.classList.add(ch.correct ? "correct" : "wrong");
            bubble("me", "Marta", ch.text.en);
            M.audio.speak(ch.text.en);
            interact.appendChild(mkFeedback(ch.correct, ch.feedback && ch.feedback.en));
            // say your answer aloud (speaking practice on every turn)
            interact.appendChild(el("div", { class: "card", style: "margin-top:.6rem" }, [
              el("div", { class: "stepbadge", text: "🎤 " + M.i18n.t("say.title") }),
              el("div", { style: "font-size:1.1rem;font-weight:700", text: ch.text.en }),
              M.speakRecord(ch.text.en),
              el("div", { class: "btn-row" }, [el("button", { class: "btn", onclick: function () { M.audio.clearRecording(); go(ch.next); } }, [M.i18n.t("btn.continue")])]),
            ]));
          });
          opts.appendChild(b);
        });
        interact.appendChild(opts);
      }

      function renderBuild(node, r) {
        var target = M.match.norm(r.modelAnswer);
        var current = [];
        var builder = el("div", { class: "builder", "data-empty": "…" });
        var blocks = el("div", { class: "blocks" });
        function refresh() { builder.textContent = current.join(" "); }
        dom.shuffle(r.blocks).forEach(function (w) {
          var b = el("button", { class: "block", text: w });
          b.addEventListener("click", function () { current.push(w); refresh(); });
          blocks.appendChild(b);
        });
        interact.appendChild(builder);
        interact.appendChild(blocks);
        interact.appendChild(controls(node, r, function () {
          var ans = current.join(" ");
          var ok = M.match.close(ans, r.accepted) || M.match.norm(ans) === target;
          handleAnswer(node, r, ok, ans, function reset() { current = []; refresh(); });
        }, function undo() { current.pop(); refresh(); }));
      }

      function renderType(node, r) {
        var input = el("input", { class: "textin", type: "text", autocomplete: "off", spellcheck: "false", placeholder: M.i18n.t("conv.type_here"), "aria-label": M.i18n.t("conv.type_here") });
        interact.appendChild(input);
        interact.appendChild(controls(node, r, function () {
          var ans = input.value;
          var ok = M.match.close(ans, r.accepted || []) || M.match.hasKeyword(ans, r.keywords || []);
          handleAnswer(node, r, ok, ans, function reset() { input.value = ""; input.focus(); });
        }, null));
        input.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); interact.querySelector(".btn:not(.ghost)").click(); } });
        input.focus();
      }

      var fails = {};
      function speakStep(sayText, nextNode) {
        interact.appendChild(el("div", { class: "card", style: "margin-top:.6rem" }, [
          el("div", { class: "stepbadge", text: "🎤 " + M.i18n.t("say.title") }),
          el("div", { style: "font-size:1.15rem;font-weight:700", text: sayText }),
          M.speakRecord(sayText),
          el("div", { class: "btn-row" }, [el("button", { class: "btn", onclick: function () { M.audio.clearRecording(); go(nextNode); } }, [M.i18n.t("btn.continue")])]),
        ]));
      }
      function handleAnswer(node, r, ok, ans, reset) {
        if (ok) {
          bubble("me", "Marta", ans);
          interact.appendChild(mkFeedback(true, M.i18n.t("fb.correct")));
          interact.querySelectorAll("button,input").forEach(function (x) { x.disabled = true; });
          M.store.markSpoken && M.store.markSpoken();
          speakStep(r.modelAnswer || ans, r.next);
        } else {
          var key = node.speaker + (r.next || "");
          fails[key] = (fails[key] || 0) + 1;
          interact.appendChild(mkFeedback(false, M.i18n.t("conv.repair")));
          if (fails[key] >= 2 && r.fallbackNode) {
            interact.appendChild(el("p", { class: "muted", text: M.i18n.t("conv.repair.shorter") }));
            interact.appendChild(el("div", { class: "btn-row" }, [el("button", { class: "btn", onclick: function () { go(r.fallbackNode); } }, [M.i18n.t("btn.continue")])]));
          } else {
            reset && reset();
          }
        }
      }

      function controls(node, r, onCheck, onUndo) {
        var row = el("div", { class: "btn-row" }, []);
        if (onUndo) row.appendChild(el("button", { class: "btn ghost small", onclick: onUndo, text: "⟲" }));
        row.appendChild(el("button", { class: "btn secondary small", onclick: function () {
          if (r.hints && r.hints.length) dom.toast(r.hints[0]);
          else if (r.modelAnswer) dom.toast(r.modelAnswer);
        } }, [el("span", { html: dom.icon("help") }), " " + M.i18n.t("btn.hint")]));
        if (r.modelAnswer) row.appendChild(el("button", { class: "btn ghost small", onclick: function () { M.audio.speak(r.modelAnswer); dom.toast(r.modelAnswer); } }, [M.i18n.t("btn.model")]));
        row.appendChild(el("button", { class: "btn", onclick: onCheck }, [M.i18n.t("btn.check")]));
        return row;
      }

      function mkFeedback(ok, msg) {
        return el("div", { class: "feedback " + (ok ? "good" : "gentle"), role: "status", "aria-live": "polite" }, [
          el("span", { html: dom.icon(ok ? "check" : "again") }),
          el("span", {}, [el("strong", { text: (ok ? M.i18n.t("a11y.correct") : "") + " " }), msg || ""]),
        ]);
      }

      function finish() {
        M.store.markConversation(dialogueId);
        dom.clear(interact);
        interact.appendChild(mkFeedback(true, M.i18n.t("conv.finished")));
        interact.appendChild(el("div", { class: "btn-row" }, [
          el("button", { class: "btn secondary", onclick: function () { M.conversation.render(mount, dialogueId, done); } }, [el("span", { html: dom.icon("again") }), " " + M.i18n.t("conv.again")]),
          el("button", { class: "btn", onclick: function () { done(true); } }, [M.i18n.t("btn.continue")]),
        ]));
      }

      go(dlg.startNode);
    },
  };
})(window.M);
