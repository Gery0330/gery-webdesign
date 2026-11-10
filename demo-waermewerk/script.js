/* WärmeWerk – Onepager-Skripte (keine Abhängigkeiten) */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var root = document.documentElement;
  root.classList.remove('no-js');
  root.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header, Fortschritt, Nach-oben ---------- */
  var header = $('.site-header'), bar = $('.progress'), toTop = $('.to-top');
  var steps = $('.steps');
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('scrolled', y > 10);
    if (bar) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, y / h) : 0) + ')';
    }
    if (toTop) toTop.classList.toggle('show', y > 800);
    if (steps) {
      var r = steps.getBoundingClientRect(), vh = window.innerHeight;
      var p = Math.max(0, Math.min(1, (vh * 0.7 - r.top) / r.height));
      steps.style.setProperty('--p', p.toFixed(3));
      $$('li', steps).forEach(function (li, i, all) {
        li.classList.toggle('on', p >= i / (all.length - 1) - 0.02);
      });
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- Mobiles Menü ---------- */
  var toggle = $('.menu-toggle'), nav = $('.main-nav');
  function setMenu(open) {
    if (!toggle || !nav) return;
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 860) setMenu(false); });
  }

  /* ---------- Scrollspy ---------- */
  var links = $$('.main-nav a[href^="#"]');
  var sections = links.map(function (a) { return $(a.getAttribute('href')); }).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Scroll-Reveal ---------- */
  var rev = $$('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    rev.forEach(function (el) { io.observe(el); });
  } else rev.forEach(function (el) { el.classList.add('in'); });

  /* ---------- Zähler ---------- */
  var counters = $$('[data-count]');
  function runCounter(el) {
    var end = parseFloat(el.getAttribute('data-count')), suffix = el.getAttribute('data-suffix') || '';
    if (reduce) { el.textContent = end.toLocaleString('de-AT') + suffix; return; }
    var t0 = performance.now(), dur = 1600;
    (function tick(t) {
      var p = Math.min(1, (t - t0) / dur), v = Math.round(end * (1 - Math.pow(1 - p, 3)));
      el.textContent = v.toLocaleString('de-AT') + suffix;
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { co.unobserve(e.target); runCounter(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { co.observe(c); });
  }

  /* ---------- Tabs (Leistungen) ---------- */
  var tabs = $('[data-tabs]');
  if (tabs) {
    var btns = $$('[role="tab"]', tabs), panels = $$('[role="tabpanel"]', tabs);
    var activate = function (btn, focus) {
      btns.forEach(function (b) {
        var on = b === btn;
        b.setAttribute('aria-selected', String(on));
        b.tabIndex = on ? 0 : -1;
      });
      panels.forEach(function (p) { p.hidden = p.id !== btn.getAttribute('aria-controls'); });
      if (focus) btn.focus();
      if (btn.scrollIntoView && window.innerWidth <= 1060) btn.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    };
    btns.forEach(function (b, i) {
      b.tabIndex = i === 0 ? 0 : -1;
      b.addEventListener('click', function () { activate(b); });
      b.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') n = btns[(i + 1) % btns.length];
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') n = btns[(i - 1 + btns.length) % btns.length];
        if (e.key === 'Home') n = btns[0];
        if (e.key === 'End') n = btns[btns.length - 1];
        if (n) { e.preventDefault(); activate(n, true); }
      });
    });
  }

  /* ---------- FAQ: jeweils nur eine Antwort offen ---------- */
  var details = $$('.faq details');
  details.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) details.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* ---------- Öffnungszeiten & Live-Status ---------- */
  // Mo–Do 07–17, Fr 07–14, Sa nach Vereinbarung, So geschlossen
  var now = new Date(), wd = now.getDay(), mins = now.getHours() * 60 + now.getMinutes();
  var list = $('#hours');
  if (list) {
    var idx = [6, 0, 1, 2, 3, 4, 5][wd];
    var li = $$('li', list)[idx];
    if (li) li.classList.add('today');
  }
  var st = $('#open-status');
  if (st) {
    var label = $('span', st);
    var close = wd >= 1 && wd <= 4 ? 17 * 60 : wd === 5 ? 14 * 60 : 0;
    var isOpen = wd >= 1 && wd <= 5 && mins >= 7 * 60 && mins < close;
    st.classList.toggle('closed', !isOpen);
    if (isOpen) label.textContent = 'Jetzt geöffnet · bis ' + (close / 60) + ':00 Uhr erreichbar';
    else label.textContent = 'Büro geschlossen · Störungsdienst 24/7 erreichbar';
  }

  var y = $('#year');
  if (y) y.textContent = String(now.getFullYear());
})();
