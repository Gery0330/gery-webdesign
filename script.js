/* Gery Webdesign – Hauptseiten
   Menü, Scroll-Effekte, Navigations-Hervorhebung, Kontaktformular (mailto). */
(function () {
  "use strict";

  var CONTACT_MAIL = "kontakt@gery-webdesign.at";

  /* ---------- Mobiles Menü ---------- */
  var header = document.querySelector(".site-header");
  var menuButton = document.querySelector(".menu-toggle");
  var nav = document.querySelector(".nav");

  function setMenu(open) {
    if (!nav || !menuButton) return;
    nav.classList.toggle("open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
  }

  if (menuButton && nav) {
    menuButton.addEventListener("click", function () {
      setMenu(!nav.classList.contains("open"));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        setMenu(false);
        menuButton.focus();
      }
    });
    document.addEventListener("click", function (e) {
      if (nav.classList.contains("open") && !nav.contains(e.target) && !menuButton.contains(e.target)) setMenu(false);
    });
    window.matchMedia("(min-width: 821px)").addEventListener("change", function (m) {
      if (m.matches) setMenu(false);
    });
  }

  /* ---------- Jahr im Footer ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Header-Schatten & Nach-oben-Button ---------- */
  var backTop = document.querySelector(".back-top");
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("scrolled", y > 24);
    if (backTop) backTop.classList.toggle("visible", y > 700);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Einblend-Animationen ---------- */
  var revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
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

  /* ---------- Kontaktformular (öffnet das E-Mail-Programm) ---------- */
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!form.reportValidity()) return;

      var data = new FormData(form);
      var get = function (k) { return String(data.get(k) || "").trim(); };
      var name = get("name");
      var pkg = get("package");

      var subject = "Website-Anfrage von " + name + (pkg ? " (" + pkg + ")" : "");
      var body =
        "Name: " + name + "\n" +
        "E-Mail: " + get("email") + "\n" +
        "Unternehmen: " + (get("company") || "Nicht angegeben") + "\n" +
        "Paket: " + (pkg || "Noch offen") + "\n\n" +
        "Nachricht:\n" + get("message");

      if (status) status.textContent = "Dein E-Mail-Programm wird geöffnet. Bitte sende die vorbereitete Nachricht dort ab.";
      window.location.href = "mailto:" + CONTACT_MAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    });
  }
})();
