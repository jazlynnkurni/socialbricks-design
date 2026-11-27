/* Shared form behavior for all motion variants: show/hide password, the
   "Signing in…" state, SSO feedback, forgot-password. Visual only, no server. */
(function () {
  var pw = document.getElementById("password");
  var toggle = document.getElementById("pwToggle");
  if (toggle && pw) {
    toggle.addEventListener("click", function () {
      var showing = pw.type === "text";
      pw.type = showing ? "password" : "text";
      toggle.textContent = showing ? "Show" : "Hide";
      toggle.setAttribute("aria-pressed", String(!showing));
      pw.focus();
    });
  }
  var form = document.getElementById("loginForm");
  var btn = document.getElementById("submitBtn");
  var label = document.getElementById("submitLabel");
  if (form && btn && label) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (btn.getAttribute("aria-busy") === "true") return;
      btn.setAttribute("aria-busy", "true");
      label.textContent = "Signing in…";
      setTimeout(function () { btn.removeAttribute("aria-busy"); label.textContent = "Sign in"; }, 1600);
    });
  }
  var sso = document.getElementById("ssoBtn");
  if (sso) {
    sso.addEventListener("click", function () {
      var self = this; this.disabled = true;
      var last = this.childNodes[this.childNodes.length - 1];
      var original = last.nodeValue;
      last.nodeValue = " Opening agency sign-in…";
      setTimeout(function () { self.disabled = false; last.nodeValue = original; }, 1600);
    });
  }
  var forgot = document.getElementById("forgot");
  if (forgot) forgot.addEventListener("click", function (e) { e.preventDefault(); });
})();
