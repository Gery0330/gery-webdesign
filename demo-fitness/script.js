/* PULSEFIT – Skripte (keine Abhängigkeiten) */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var root = document.documentElement;
  root.classList.remove('no-js');
  root.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header, Fortschritt, Nach-oben ---------- */
  var header = $('.header'), bar = $('.progress'), toTop = $('.to-top');
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('scrolled', y > 10);
    if (bar) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, y / h) : 0) + ')';
    }
    if (toTop) toTop.classList.toggle('show', y > 800);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener('click', function (e) { e.preventDefault(); window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

  /* ---------- Mobiles Menü ---------- */
  var menu = $('.menu'), nav = $('.nav');
  function setMenu(open) {
    if (!menu || !nav) return;
    nav.classList.toggle('open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (menu && nav) {
    menu.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 900) setMenu(false); });
  }

  /* ---------- Reveal ---------- */
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
    var t0 = performance.now(), dur = 1700;
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

  /* ---------- Referenzen-Slider ---------- */
  var items = $$('.testi-item');
  if (items.length) {
    var dotsWrap = $('.testi-dots'), cur = 0, timer;
    var dots = items.map(function (_, i) {
      var d = document.createElement('i');
      d.setAttribute('role', 'button'); d.setAttribute('aria-label', 'Bericht ' + (i + 1));
      d.addEventListener('click', function () { show(i); restart(); });
      if (dotsWrap) dotsWrap.appendChild(d);
      return d;
    });
    var show = function (n) {
      cur = (n + items.length) % items.length;
      items.forEach(function (el, i) { el.classList.toggle('on', i === cur); el.setAttribute('aria-hidden', String(i !== cur)); });
      dots.forEach(function (d, i) { d.classList.toggle('on', i === cur); });
    };
    var restart = function () { clearInterval(timer); if (!reduce) timer = setInterval(function () { show(cur + 1); }, 7000); };
    var prev = $('.testi-ctrl .prev'), next = $('.testi-ctrl .next');
    if (prev) prev.addEventListener('click', function () { show(cur - 1); restart(); });
    if (next) next.addEventListener('click', function () { show(cur + 1); restart(); });
    show(0); restart();
  }

  /* ---------- Preis-Umschalter ---------- */
  var billing = $$('.billing button');
  if (billing.length) {
    billing.forEach(function (b) {
      b.addEventListener('click', function () {
        billing.forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
        var mode = b.getAttribute('data-mode');
        $$('[data-month]').forEach(function (el) { el.textContent = el.getAttribute('data-' + mode); });
        $$('.price-note').forEach(function (el) { el.textContent = el.getAttribute('data-' + mode + '-note') || ''; });
      });
    });
  }

  /* ---------- FAQ: nur eine Antwort offen ---------- */
  var det = $$('.faq details');
  det.forEach(function (d) {
    d.addEventListener('toggle', function () { if (d.open) det.forEach(function (o) { if (o !== d) o.open = false; }); });
  });

  /* ---------- Öffnungszeiten & Live-Status ---------- */
  // Betreute Zeiten: Mo–Fr 08–21, Sa/So 09–17. Mitglieder (Plus/Premium) trainieren 24/7.
  var now = new Date(), wd = now.getDay(), mins = now.getHours() * 60 + now.getMinutes();
  var hours = $('.hours');
  if (hours) {
    var li = $$('li', hours)[[6, 0, 1, 2, 3, 4, 5][wd]];
    if (li) li.classList.add('today');
  }
  $$('.live').forEach(function (el) {
    var weekday = wd >= 1 && wd <= 5;
    var open = weekday ? (mins >= 8 * 60 && mins < 21 * 60) : (mins >= 9 * 60 && mins < 17 * 60);
    var close = weekday ? '21:00' : '17:00';
    el.classList.toggle('closed', !open);
    var t = $('span', el);
    if (t) t.textContent = open ? 'Jetzt betreut · Coaches vor Ort bis ' + close + ' Uhr' : 'Aktuell unbetreut · 24/7-Zugang für Mitglieder';
  });

  /* ---------- Kontaktformular (nur Demo, nichts wird gesendet) ---------- */
  var form = $('form[data-demo-form]');
  if (form) {
    var params = new URLSearchParams(location.search);
    var sel = $('select[name="interest"]', form);
    var map = { start: 'Mitgliedschaft Start', plus: 'Mitgliedschaft Plus', premium: 'Mitgliedschaft Premium', probe: 'Kostenloses Probetraining', coaching: 'Personal Coaching' };
    var key = params.get('plan') || params.get('thema');
    if (sel && key && map[key]) {
      $$('option', sel).forEach(function (o) { if (o.value === map[key]) sel.value = o.value; });
    }
    var rules = {
      name: function (v) { return v.trim().length >= 2 ? '' : 'Bitte gib deinen Namen an.'; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Bitte gib eine gültige E-Mail-Adresse an.'; },
      interest: function (v) { return v ? '' : 'Bitte wähle ein Thema aus.'; },
      message: function (v) { return v.trim().length >= 10 ? '' : 'Bitte schreib uns kurz, worum es geht (mind. 10 Zeichen).'; },
      privacy: function (v, el) { return el.checked ? '' : 'Bitte stimme der Verarbeitung deiner Angaben zu.'; }
    };
    var validate = function (el) {
      var rule = rules[el.name]; if (!rule) return true;
      var msg = rule(el.value, el);
      var wrap = el.closest('.field, .check');
      if (wrap) {
        wrap.classList.toggle('invalid', !!msg);
        var e = $('.err', wrap); if (e) e.textContent = msg;
      }
      el.setAttribute('aria-invalid', msg ? 'true' : 'false');
      return !msg;
    };
    $$('input,select,textarea', form).forEach(function (el) {
      el.addEventListener('blur', function () { if (el.name in rules) validate(el); });
      el.addEventListener('input', function () { var w = el.closest('.field, .check'); if (w && w.classList.contains('invalid')) validate(el); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true, first = null;
      $$('input,select,textarea', form).forEach(function (el) {
        if (el.name in rules && !validate(el)) { ok = false; if (!first) first = el; }
      });
      if (!ok) { if (first) first.focus(); return; }
      var box = form.closest('.form');
      var data = {
        name: form.elements.name.value.trim(),
        interest: form.elements.interest.value,
        time: form.elements.time ? form.elements.time.value : ''
      };
      $('#s-name', box).textContent = data.name.split(' ')[0];
      $('#s-interest', box).textContent = data.interest;
      $('#s-time', box).textContent = data.time || 'flexibel';
      box.classList.add('sent');
      box.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      form.reset();
    });
    var again = $('[data-again]');
    if (again) again.addEventListener('click', function () { form.closest('.form').classList.remove('sent'); });
  }

  var y = $('#year'); if (y) y.textContent = String(now.getFullYear());
})();
