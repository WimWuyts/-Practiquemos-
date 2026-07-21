// Capability detection — translated into friendly, non-technical messages.
window.M = window.M || {};
(function (M) {
  M.caps = {
    tts: typeof window.speechSynthesis !== "undefined" && typeof window.SpeechSynthesisUtterance !== "undefined",
    mic: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) && typeof window.MediaRecorder !== "undefined",
    recognition: !!(window.SpeechRecognition || window.webkitSpeechRecognition),
    storage: (function () { try { var k = "__t"; localStorage.setItem(k, "1"); localStorage.removeItem(k); return true; } catch (e) { return false; } })(),
    fileIO: typeof Blob !== "undefined" && typeof URL !== "undefined" && typeof FileReader !== "undefined",
    britishVoice: false, // filled once voices load
    report: function () {
      var t = M.i18n.t;
      return [
        { ok: this.tts, msg: this.tts ? t("cap.tts.ok") : t("cap.tts.no") },
        { ok: this.mic, msg: this.mic ? t("cap.mic.ok") : t("cap.mic.no") },
        { ok: this.storage, msg: this.storage ? t("cap.storage.ok") : t("cap.storage.no") },
      ];
    },
  };
})(window.M);
