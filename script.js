/* Gery Webdesign – Hauptseiten
   Theme (hell/dunkel), Menü, Scroll-Effekte, Navigations-Hervorhebung,
   Paketvergleich, Kontaktformular (öffnet Gmail mit vorbereiteter Nachricht). */
(function () {
  "use strict";

  var CONTACT_MAIL = "gery.webdesign@gmail.com";
  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Hell/Dunkel: Auswahl wird gespeichert ---------- */
  var themeButtons = document.querySelectorAll(".theme-toggle");
  var themeMeta = document.querySelector('meta[name="theme-color"]:not([media])');
  function applyTheme(theme, persist) {
    root.setAttribute("data-theme", theme);
    themeButtons.forEach(function (b) {
      b.setAttribute("aria-label", theme === "dark" ? "Helles Design aktivieren" : "Dunkles Design aktivieren");
      b.setAttribute("aria-pressed", String(theme === "light"));
    });
    if (themeMeta) themeMeta.setAttribute("content", theme === "dark" ? "#0C0D10" : "#FAFAF9");
    if (persist) { try { localStorage.setItem("gery-theme", theme); } catch (e) { /* privater Modus */ } }
  }
  applyTheme(root.getAttribute("data-theme") === "light" ? "light" : "dark", false);
  themeButtons.forEach(function (b) {
    b.addEventListener("click", function () {
      applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark", true);
    });
  });
  window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", function (e) {
    var stored = null;
    try { stored = localStorage.getItem("gery-theme"); } catch (err) { /* ignorieren */ }
    if (!stored) applyTheme(e.matches ? "light" : "dark", false);
  });

  /* ---------- Mobiles Menü (Panel mit Fokusfalle) ---------- */
  var header = document.querySelector(".site-header");
  var menuButton = document.querySelector(".menu-toggle");
  var nav = document.querySelector(".nav");
  var mobileQuery = window.matchMedia("(max-width: 1040px)");
  var outside = [document.querySelector("main"), document.querySelector(".site-footer"), document.querySelector(".brand"), document.querySelector(".theme-toggle")];

  function setMenu(open, returnFocus) {
    if (!nav || !menuButton) return;
    if (open && header) nav.style.top = Math.round(header.getBoundingClientRect().bottom) + "px"; // direkt unter dem Header
    nav.classList.toggle("open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    outside.forEach(function (el) { if (el) { if (open) el.setAttribute("inert", ""); else el.removeAttribute("inert"); } });
    document.body.style.overflow = open ? "hidden" : "";
    // Fokus erst setzen, wenn das Panel sichtbar ist (visibility wechselt mit der Einblendung).
    if (open) { var first = nav.querySelector("a"); if (first) setTimeout(function () { first.focus(); }, 60); }
    else if (returnFocus) menuButton.focus();
  }

  if (menuButton && nav) {
    menuButton.addEventListener("click", function () {
      setMenu(!nav.classList.contains("open"), true);
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a") && nav.classList.contains("open")) setMenu(false, false);
    });
    document.addEventListener("keydown", function (e) {
      if (!nav.classList.contains("open")) return;
      if (e.key === "Escape") { e.preventDefault(); setMenu(false, true); return; }
      if (e.key === "Tab") {
        // Fokus kreist nur zwischen Menü-Button und Menü-Links, in beide Richtungen.
        var items = [menuButton].concat(Array.prototype.slice.call(nav.querySelectorAll("a")));
        var i = items.indexOf(document.activeElement);
        e.preventDefault();
        items[(i + (e.shiftKey ? -1 : 1) + items.length) % items.length].focus();
      }
    });
    mobileQuery.addEventListener("change", function (m) {
      if (!m.matches && nav.classList.contains("open")) setMenu(false, false);
    });
  }

  /* ---------- Jahr im Footer ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Header-Schatten & Nach-oben-Button ---------- */
  var backTop = document.querySelector(".back-top");
  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("scrolled", y > 24);
    if (backTop) backTop.classList.toggle("visible", y > 700);
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---------- Einblend-Animationen (dezent) ---------- */
  var revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion.matches) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealItems.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealItems.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ---------- Lichtkegel auf den Karten folgt dem Zeiger ---------- */
  if (!reduceMotion.matches && window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".service-card, .concept-grid article").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - r.left) + "px");
        card.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
  }

  /* ---------- Aktiven Menüpunkt hervorheben (nur Startseite) ---------- */
  var navLinks = document.querySelectorAll('.nav a[href^="#"]:not(.nav-cta)');
  if (navLinks.length && "IntersectionObserver" in window) {
    var map = {};
    var sections = [];
    navLinks.forEach(function (a) {
      var s = document.querySelector(a.getAttribute("href"));
      if (s) { map[s.id] = a; sections.push(s); }
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (a) { a.removeAttribute("aria-current"); });
          map[entry.target.id].setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Paket aus den Preiskarten ins Formular übernehmen ---------- */
  var packageSelect = document.getElementById("package");
  document.querySelectorAll("[data-package]").forEach(function (link) {
    link.addEventListener("click", function () {
      if (packageSelect) packageSelect.value = link.getAttribute("data-package");
    });
  });

  /* ---------- Paketvergleich auf-/zuklappen ---------- */
  var cmpBtn = document.getElementById("compare-toggle");
  var cmpPanel = document.getElementById("compare-panel");
  if (cmpBtn && cmpPanel) {
    var cmpLabel = cmpBtn.querySelector(".cmp-label");
    cmpBtn.addEventListener("click", function () {
      var open = cmpBtn.getAttribute("aria-expanded") !== "true";
      cmpBtn.setAttribute("aria-expanded", String(open));
      cmpPanel.hidden = !open;
      if (cmpLabel) cmpLabel.textContent = open ? "Vergleich ausblenden" : "Pakete vergleichen";
      if (open) cmpPanel.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "nearest" });
    });
  }

  /* ---------- Pakete (Texte wie im Preisbereich der Startseite) ---------- */
  var lastRequest = null;
  var PKG_SLUG = { "Starter – Onepager": "starter", "Business": "business", "Premium – Business Plus": "premium" };
  var PACKAGES = {
    starter: { kicker: "STARTER", name: "Onepager", price: 49, half: "24,50",
      features: ["Eine Seite mit mehreren Abschnitten", "Mobiloptimierung", "Kontaktinformationen", "Verlinkung zu Social Media"] },
    business: { kicker: "BUSINESS", name: "Business", price: 99, half: "49,50",
      features: ["Bis zu fünf Unterseiten", "Individuelles Design", "Leistungen und Referenzen", "Kontaktformular", "Grundlegende Suchmaschinenoptimierung"] },
    premium: { kicker: "PREMIUM", name: "Business Plus", price: 179, half: "89,50",
      features: ["Individuelles Design", "Erweiterte Funktionen", "Bildergalerie", "Termin- oder Anfragefunktionen", "Erweiterte Suchmaschinenoptimierung"] }
  };

  /* ---------- Kontaktformular: Prüfung am Feld, danach Gmail öffnen ---------- */
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");

  if (form) {
    var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var rules = {
      name: function (v) { return v ? "" : "Bitte gib deinen Namen an."; },
      email: function (v) { return !v ? "Bitte gib deine E-Mail-Adresse an." : EMAIL.test(v) ? "" : "Bitte gib eine gültige E-Mail-Adresse an, z. B. max@unternehmen.at."; },
      message: function (v) { return v ? "" : "Bitte beschreibe kurz dein Vorhaben."; },
      consent: function (v, el) { return el.checked ? "" : "Bitte stimme der Verwendung deiner Angaben zu."; }
    };
    var touched = {};

    var check = function (name) {
      var el = form.elements[name];
      var msg = rules[name](String(el.value || "").trim(), el);
      var err = document.getElementById(name + "-error");
      if (err) err.textContent = msg;
      if (msg) el.setAttribute("aria-invalid", "true"); else el.removeAttribute("aria-invalid");
      return msg;
    };

    Object.keys(rules).forEach(function (name) {
      var el = form.elements[name];
      if (!el) return;
      el.addEventListener("blur", function () { if (touched[name] || (el.type !== "checkbox" && el.value)) { touched[name] = true; check(name); } });
      el.addEventListener(el.type === "checkbox" ? "change" : "input", function () { if (touched[name]) check(name); });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (form.elements._honey && form.elements._honey.value) return; // Spam-Falle

      var firstInvalid = null;
      Object.keys(rules).forEach(function (name) {
        touched[name] = true;
        if (check(name) && !firstInvalid) firstInvalid = form.elements[name];
      });
      if (firstInvalid) {
        status.classList.add("is-error");
        status.textContent = "Bitte prüfe die markierten Felder.";
        firstInvalid.focus();
        return;
      }

      var g = function (k) { return String(form.elements[k].value || "").trim(); };
      var pkg = g("package");
      var subject = "Website-Anfrage von " + g("name") + (pkg ? " (" + pkg + ")" : "");
      var body =
        "Name: " + g("name") + "\n" +
        "E-Mail: " + g("email") + "\n" +
        "Unternehmen: " + (g("company") || "Nicht angegeben") + "\n" +
        "Paket: " + (pkg || "Noch offen") + "\n\n" +
        "Nachricht:\n" + g("message");

      var url = "https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(CONTACT_MAIL) +
        "&su=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);

      var win = window.open(url, "_blank");
      if (win) win.opener = null;
      // Weiter zum Danke-Screen (index.html#danke). Die Angaben bleiben nur in diesem Tab, nicht in der Adresse.
      lastRequest = { name: g("name"), pkg: pkg, gmail: url, opened: !!win };
      try { sessionStorage.setItem("gery-anfrage", JSON.stringify(lastRequest)); } catch (e) { /* privater Modus */ }
      status.classList.remove("is-error");
      status.textContent = "";
      form.reset();
      touched = {};
      window.location.hash = "danke";
    });
  }

  /* ---------- Danke-Screen unter index.html#danke: Paket, Name und Gmail-Hinweis ---------- */
  var thanks = document.getElementById("danke");
  if (thanks) {
    var mainEl = document.getElementById("main");
    var baseTitle = document.title;
    var $ = function (sel) { return thanks.querySelector(sel); };

    var fill = function () {
      var data = lastRequest;
      if (!data) { try { data = JSON.parse(sessionStorage.getItem("gery-anfrage") || "null"); } catch (e) { data = null; } }
      data = data || {};
      // ?paket=starter|business|premium (z. B. als Erfolgsadresse eines Zahlungsanbieters) hat Vorrang.
      var slug = (new URLSearchParams(location.search).get("paket") || PKG_SLUG[data.pkg] || "").toLowerCase();
      var P = Object.prototype.hasOwnProperty.call(PACKAGES, slug) ? PACKAGES[slug] : null;

      var firstName = String(data.name || "").trim().split(/\s+/)[0];
      $("[data-thanks-name]").textContent = firstName ? ", " + firstName.slice(0, 40) : "";

      $("[data-pkg-known]").hidden = !P;
      $("[data-pkg-open]").hidden = !!P;
      var ul = $("[data-pkg-features]");
      ul.textContent = "";
      $("[data-pkg-half]").textContent = "";
      if (P) {
        $("[data-pkg-kicker]").textContent = P.kicker;
        $("[data-pkg-name]").textContent = P.name;
        $("[data-pkg-price]").textContent = P.price;
        $("[data-pkg-half]").textContent = "Bei " + P.name + " (" + P.price + " €/Monat): " + P.half + " € vor Projektstart + " + P.half + " € nach Fertigstellung.";
        P.features.forEach(function (f) {
          var li = document.createElement("li");
          li.innerHTML = '<svg class="i" aria-hidden="true" focusable="false"><use href="#i-check"/></svg>';
          var sp = document.createElement("span");
          sp.textContent = f;
          li.appendChild(sp);
          ul.appendChild(li);
        });
      }

      // Gmail-Hinweis nur, wenn man gerade aus dem Formular kommt.
      var mail = $("[data-thanks-mail]");
      var hasMail = !!(data.gmail && /^https:\/\/mail\.google\.com\//.test(data.gmail));
      mail.hidden = !hasMail;
      if (hasMail) {
        $("[data-thanks-mail-link]").href = data.gmail;
        mail.classList.toggle("is-blocked", !data.opened);
        $("[data-thanks-mail-text]").textContent = data.opened
          ? "Gmail wurde in einem neuen Tab mit deiner fertig ausgefüllten Nachricht geöffnet. Erst nach dem Absenden erreicht mich deine Anfrage."
          : "Dein Browser hat das neue Fenster blockiert. Klicke auf „Gmail öffnen“ – deine Nachricht ist bereits fertig ausgefüllt. Erst nach dem Absenden erreicht mich deine Anfrage.";
      }
    };

    var route = function () {
      var on = location.hash === "#danke";
      if (on === !thanks.hidden) return;
      if (on) fill();
      thanks.hidden = !on;
      document.body.classList.toggle("is-thanks", on);
      document.title = on ? "Danke für deine Anfrage | Gery Webdesign" : baseTitle;
      if (on) {
        window.scrollTo(0, 0);
        var h = document.getElementById("thanks-title");
        if (h) h.focus({ preventScroll: true });
      } else if (location.hash.length > 1) {
        // Menü-Link aus dem Danke-Screen: Ziel war ausgeblendet, daher jetzt dorthin springen.
        var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
        if (target) target.scrollIntoView();
      }
    };

    // „Zur Startseite“ blendet den Danke-Screen aus, ohne die Seite neu zu laden.
    $("[data-thanks-close]").addEventListener("click", function (e) {
      e.preventDefault();
      history.pushState(null, "", location.pathname + location.search);
      route();
      window.scrollTo(0, 0);
    });
    window.addEventListener("hashchange", route);
    window.addEventListener("popstate", route);
    route();
  }
})();
