/* Atelier Noir – Demo-Skripte (keine externen Abhängigkeiten) */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  };
  document.documentElement.classList.remove('no-js');

  /* ---------- Theme ---------- */
  const root = document.documentElement;
  const saved = store.get('an-theme');
  if (saved) root.setAttribute('data-theme', saved);
  $$('.theme-toggle').forEach(b => b.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    store.set('an-theme', next);
  }));

  /* ---------- Header, Progress, To-Top ---------- */
  const header = $('.header');
  const progress = $('.progress');
  const toTop = $('.to-top');
  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 40);
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
    }
    if (toTop) toTop.classList.toggle('show', y > 700);
    $$('[data-parallax]').forEach(el => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      el.style.transform = 'translateY(' + (r.top * -0.06).toFixed(1) + 'px)';
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Mobile menu ---------- */
  const menuBtn = $('.menu');
  const nav = $('.nav');
  if (menuBtn && nav) {
    const setOpen = open => {
      nav.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      if (header) header.classList.toggle('menu-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    menuBtn.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
    $$('a', nav).forEach(a => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$('.reveal,.reveal-l,.reveal-r');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else revealEls.forEach(el => el.classList.add('in'));

  /* ---------- Counters ---------- */
  const counters = $$('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const co = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      co.unobserve(e.target);
      const el = e.target, end = parseFloat(el.dataset.count), dur = 1800, t0 = performance.now();
      const suffix = el.dataset.suffix || '';
      const tick = t => {
        const p = Math.min(1, (t - t0) / dur), v = Math.round(end * (1 - Math.pow(1 - p, 3)));
        el.textContent = v.toLocaleString('de-AT') + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }), { threshold: 0.5 });
    counters.forEach(c => co.observe(c));
  }

  /* ---------- Generic slider helper ---------- */
  function rotator(items, dots, ms, onChange) {
    if (!items.length) return;
    let i = 0, timer;
    const show = n => {
      i = (n + items.length) % items.length;
      items.forEach((el, k) => el.classList.toggle('on', k === i));
      dots.forEach((d, k) => d.classList.toggle('on', k === i));
      if (onChange) onChange(i);
    };
    const start = () => { clearInterval(timer); timer = setInterval(() => show(i + 1), ms); };
    dots.forEach((d, k) => d.addEventListener('click', () => { show(k); start(); }));
    show(0); start();
  }

  /* Hero */
  const slides = $$('.hero-slide');
  const heroDots = $$('.hero-side button');
  const count = $('.hero-count b');
  rotator(slides, heroDots, 6500, i => { if (count) count.textContent = '0' + (i + 1); });

  /* Testimonials */
  rotator($$('.testi-item'), $$('.testi-dots button'), 7000);

  /* ---------- Quick booking bar → Reservierung ---------- */
  const today = new Date();
  const iso = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const bookingForm = $('#quick-booking');
  if (bookingForm) {
    const d = $('input[type=date]', bookingForm);
    d.min = iso(today);
    const def = new Date(today); def.setDate(def.getDate() + 1);
    d.value = iso(def);
    bookingForm.addEventListener('submit', e => {
      e.preventDefault();
      const q = new URLSearchParams({ date: d.value, people: $('select', bookingForm).value });
      location.href = 'reservierung.html?' + q.toString();
    });
  }

  /* ---------- Opening hours / live status ---------- */
  const statusEl = $('#open-status');
  const hoursList = $('#hours');
  if (hoursList) {
    // Di–Sa 17–23 (Küche bis 21:30); So/Mo Ruhetag
    const wd = today.getDay();
    const items = $$('li', hoursList);
    const map = [6, 0, 1, 2, 3, 4, 5]; // JS Sonntag=0 → Liste beginnt mit Montag
    const idx = map[wd];
    if (items[idx]) items[idx].classList.add('today');
    if (statusEl) {
      const mins = today.getHours() * 60 + today.getMinutes();
      const open = wd >= 2 && wd <= 6 && mins >= 17 * 60 && mins < 23 * 60;
      statusEl.classList.toggle('closed', !open);
      const txt = $('span', statusEl);
      if (open) txt.textContent = 'Jetzt geöffnet · Küche bis 21:30 Uhr';
      else if (wd === 0 || wd === 1) txt.textContent = 'Heute Ruhetag · wieder geöffnet Dienstag ab 17:00';
      else txt.textContent = 'Aktuell geschlossen · öffnet ab 17:00 Uhr';
    }
  }

  /* ---------- Menu filter ---------- */
  const dishes = $$('.dish');
  if (dishes.length) {
    const tabs = $$('.tab[data-filter]');
    const search = $('#menu-search');
    const diets = $$('[data-diet]');
    const secs = $$('.menu-sec');
    const empty = $('.empty');
    let cat = 'all';
    const apply = () => {
      const q = search ? search.value.trim().toLowerCase() : '';
      const need = diets.filter(c => c.checked).map(c => c.dataset.diet);
      let any = false;
      dishes.forEach(d => {
        const okCat = cat === 'all' || d.dataset.category === cat;
        const tags = (d.dataset.tags || '').split(' ');
        const okDiet = need.every(n => tags.includes(n));
        const okQ = !q || d.textContent.toLowerCase().includes(q);
        const show = okCat && okDiet && okQ;
        d.hidden = !show;
        if (show) any = true;
      });
      secs.forEach(s => { s.style.display = $$('.dish:not([hidden])', s).length ? '' : 'none'; });
      if (empty) empty.style.display = any ? 'none' : 'block';
    };
    tabs.forEach(t => t.addEventListener('click', () => {
      tabs.forEach(x => x.classList.remove('active'));
      t.classList.add('active'); cat = t.dataset.filter; apply();
    }));
    if (search) search.addEventListener('input', apply);
    diets.forEach(c => c.addEventListener('change', apply));
    if (location.hash) {
      const t = tabs.find(x => '#' + x.dataset.filter === location.hash);
      if (t) t.click();
    }
  }

  /* ---------- Gallery filter + lightbox ---------- */
  const figs = $$('.masonry figure');
  if (figs.length) {
    const gtabs = $$('.tab[data-gfilter]');
    gtabs.forEach(t => t.addEventListener('click', () => {
      gtabs.forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      figs.forEach(f => { f.style.display = (t.dataset.gfilter === 'all' || f.dataset.cat === t.dataset.gfilter) ? '' : 'none'; });
    }));
    const lb = $('.lightbox');
    const lbImg = $('img', lb), lbCap = $('p', lb);
    let cur = 0;
    const visible = () => figs.filter(f => f.style.display !== 'none');
    const open = f => {
      cur = visible().indexOf(f);
      lbImg.src = $('img', f).src; lbImg.alt = $('img', f).alt;
      lbCap.textContent = $('figcaption', f).textContent;
      lb.classList.add('open'); document.body.style.overflow = 'hidden';
    };
    const step = n => { const v = visible(); open(v[(cur + n + v.length) % v.length]); };
    const close = () => { lb.classList.remove('open'); document.body.style.overflow = ''; };
    figs.forEach(f => f.addEventListener('click', () => open(f)));
    $('.lb-close', lb).addEventListener('click', close);
    $('.lb-prev', lb).addEventListener('click', e => { e.stopPropagation(); step(-1); });
    $('.lb-next', lb).addEventListener('click', e => { e.stopPropagation(); step(1); });
    lb.addEventListener('click', e => { if (e.target === lb) close(); });
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
  }

  /* ---------- Image fallback: kaputte Bilder ausblenden ---------- */
  $$('img').forEach(img => img.addEventListener('error', () => { img.style.visibility = 'hidden'; }));

  /* ---------- Reservation wizard ---------- */
  const wiz = $('#wizard');
  if (wiz) {
    const params = new URLSearchParams(location.search);
    const state = { date: '', people: 2, time: '', seat: 'Innenraum', occasion: '' };
    const steps = $$('.step', wiz), marks = $$('.steps div');
    let cur = 0;
    const dateIn = $('#f-date'), peopleOut = $('#people-out');
    dateIn.min = iso(today);
    const defd = new Date(today); defd.setDate(defd.getDate() + 1);
    state.date = params.get('date') || iso(defd);
    dateIn.value = state.date;
    const p = parseInt(params.get('people'), 10);
    if (p >= 1 && p <= 10) state.people = p;
    if (params.get('occasion')) state.occasion = params.get('occasion');
    peopleOut.textContent = state.people;

    const fmt = s => {
      if (!s) return '';
      const d = new Date(s + 'T12:00:00');
      return d.toLocaleDateString('de-AT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };
    const sum = (id, v) => { const el = $('#sum-' + id); el.textContent = v || 'noch offen'; el.classList.toggle('empty-v', !v); };
    const refresh = () => {
      sum('date', fmt(state.date));
      sum('people', state.people + (state.people === 1 ? ' Person' : ' Personen'));
      sum('time', state.time ? state.time + ' Uhr' : '');
      sum('seat', state.seat + (state.occasion ? ' · ' + state.occasion : ''));
    };
    const go = n => {
      cur = n;
      steps.forEach((s, i) => s.classList.toggle('on', i === n));
      marks.forEach((m, i) => { m.classList.toggle('on', i === n); m.classList.toggle('done', i < n); });
      const top = wiz.getBoundingClientRect().top + window.scrollY - 140;
      window.scrollTo({ top, behavior: 'smooth' });
    };

    // Zeitslots – pro Datum deterministisch einige "ausgebucht" (nur Demo)
    const slots = ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];
    const slotBox = $('#slots');
    const closedMsg = $('#closed-msg');
    const renderSlots = () => {
      slotBox.innerHTML = '';
      const d = new Date(state.date + 'T12:00:00'), wd = d.getDay();
      const closed = wd === 0 || wd === 1;
      closedMsg.classList.toggle('show', closed);
      $('#to-2').disabled = closed || !state.date;
      if (closed) { state.time = ''; return; }
      let seed = 0; for (const ch of state.date + state.people) seed = (seed * 31 + ch.charCodeAt(0)) % 997;
      slots.forEach((t, i) => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'pill'; b.textContent = t;
        const full = ((seed + i * 7) % 5 === 0) || (state.people > 6 && i % 3 === 0);
        b.disabled = full;
        if (state.time === t && !full) b.classList.add('on');
        b.addEventListener('click', () => {
          state.time = t;
          $$('.pill', slotBox).forEach(x => x.classList.remove('on'));
          b.classList.add('on'); $('#to-3').disabled = false; refresh();
        });
        slotBox.appendChild(b);
      });
      if (state.time && !$('.pill.on', slotBox)) state.time = '';
      $('#to-3').disabled = !state.time;
    };

    dateIn.addEventListener('change', () => { state.date = dateIn.value; state.time = ''; renderSlots(); refresh(); });
    $('#p-minus').addEventListener('click', () => { state.people = Math.max(1, state.people - 1); peopleOut.textContent = state.people; state.time = ''; renderSlots(); refresh(); });
    $('#p-plus').addEventListener('click', () => { state.people = Math.min(10, state.people + 1); peopleOut.textContent = state.people; state.time = ''; renderSlots(); refresh(); });
    $$('[data-occasion]', wiz).forEach(b => {
      if (state.occasion === b.dataset.occasion) b.classList.add('on');
      b.addEventListener('click', () => {
        const on = b.classList.contains('on');
        $$('[data-occasion]', wiz).forEach(x => x.classList.remove('on'));
        state.occasion = on ? '' : b.dataset.occasion;
        if (!on) b.classList.add('on');
        refresh();
      });
    });
    $$('[data-seat]', wiz).forEach(b => b.addEventListener('click', () => {
      $$('[data-seat]', wiz).forEach(x => x.classList.remove('on'));
      b.classList.add('on'); state.seat = b.dataset.seat; refresh();
    }));
    $('#to-2').addEventListener('click', () => { renderSlots(); go(1); });
    $('#to-3').addEventListener('click', () => go(2));
    $$('[data-back]', wiz).forEach(b => b.addEventListener('click', () => go(cur - 1)));

    wiz.addEventListener('submit', e => {
      e.preventDefault();
      if (!wiz.reportValidity()) return;
      const f = new FormData(wiz);
      const subject = encodeURIComponent('Tischanfrage – Atelier Noir');
      const body = encodeURIComponent(
        'Name: ' + f.get('name') + '\nE-Mail: ' + f.get('email') + '\nTelefon: ' + (f.get('phone') || '-') +
        '\nDatum: ' + fmt(state.date) + '\nUhrzeit: ' + state.time + '\nPersonen: ' + state.people +
        '\nBereich: ' + state.seat + '\nAnlass: ' + (state.occasion || '-') + '\nNachricht: ' + (f.get('message') || '-'));
      $('#done-name').textContent = String(f.get('name')).split(' ')[0];
      $('#done-sum').textContent = fmt(state.date) + ' · ' + state.time + ' Uhr · ' + state.people + ' Pers.';
      steps.forEach(s => s.classList.remove('on'));
      $('.steps').style.display = 'none';
      $('.success').classList.add('show');
      window.scrollTo({ top: wiz.getBoundingClientRect().top + window.scrollY - 140, behavior: 'smooth' });
      // Demo: öffnet nur das Mailprogramm, kein echter Versand
      location.href = 'mailto:reservierung@atelier-noir.example?subject=' + subject + '&body=' + body;
    });
    refresh(); renderSlots();
    $('#to-3').disabled = !state.time;
  }

  /* ---------- Newsletter (Demo) ---------- */
  const news = $('#newsletter');
  if (news) news.addEventListener('submit', e => {
    e.preventDefault();
    $('#news-status').textContent = 'Danke! Dies ist eine Demo – es wurde nichts gespeichert oder versendet.';
    news.reset();
  });

  /* ---------- Event-Anfrage → Reservierung ---------- */
  $$('[data-occ-link]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    location.href = 'reservierung.html?occasion=' + encodeURIComponent(a.dataset.occLink);
  }));
})();
