/* =========================================================
   Інтерактив сайту (перенесено з index.html без змін логіки).
   Кожна функція повертає cleanup(), щоб React міг прибрати
   слухачі при повторному монтуванні або зміні контенту в адмінці.
   ========================================================= */

function listen(signal) {
  return function on(el, type, fn, opts) {
    if (!el) return;
    el.addEventListener(type, fn, Object.assign({}, opts || {}, { signal: signal }));
  };
}

/* ---------- Бургер-меню (мобілка) ---------- */
export function initBurger() {
  var btn = document.querySelector('.burger');
  var nav = document.getElementById('main-nav');
  if (!btn || !nav) return function () {};
  var ac = new AbortController();
  var on = listen(ac.signal);

  on(btn, 'click', function () {
    var open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('is-open', !open);
  });
  on(nav, 'click', function (e) {
    if (e.target.closest('a')) {
      btn.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
    }
  });
  on(document, 'keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      btn.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
      btn.focus();
    }
  });
  return function () { ac.abort(); };
}

/* ---------- Sticky header: компактний після скролу, на мобілці ховається при скролі вниз; підсвітка пункту ---------- */
export function initHeader() {
  var hdr = document.querySelector('[data-site-header]');
  if (!hdr) return function () {};
  var ac = new AbortController();
  var on = listen(ac.signal);
  var mobile = window.matchMedia('(max-width: 767px)');
  var burger = hdr.querySelector('.burger');
  var lastY = window.scrollY, ticking = false;

  var links = Array.prototype.slice.call(hdr.querySelectorAll('.nav__link'));
  var spy = links.map(function (a) {
    var href = a.getAttribute('href') || '';
    var id = href.indexOf('#') >= 0 ? href.slice(href.indexOf('#') + 1) : '';
    return { link: a, el: id ? document.getElementById(id) : null };
  }).filter(function (x) { return x.el; });

  function setActive(a) {
    links.forEach(function (l) {
      var isOn = l === a;
      l.classList.toggle('is-active', isOn);
      if (isOn) l.setAttribute('aria-current', 'page'); else l.removeAttribute('aria-current');
    });
  }

  function update() {
    ticking = false;
    var y = window.scrollY;
    hdr.classList.toggle('is-scrolled', y > 10);

    var menuOpen = burger && burger.getAttribute('aria-expanded') === 'true';
    if (mobile.matches && !menuOpen && y > 200 && y > lastY + 4) hdr.classList.add('is-hidden');
    else if (y < lastY - 4 || y <= 200 || !mobile.matches || menuOpen) hdr.classList.remove('is-hidden');
    lastY = y;

    /* активна — та секція, чий верх найближче над лінією 40% екрана */
    var line = window.innerHeight * 0.4, cur = null, best = -Infinity;
    spy.forEach(function (x) {
      var t = x.el.getBoundingClientRect().top;
      if (t <= line && t > best) { best = t; cur = x.link; }
    });
    setActive(cur);
  }
  on(window, 'scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  on(window, 'resize', update);
  update();
  return function () { ac.abort(); };
}

/* ---------- Recent work: нескінченна 3D-карусель (півколо) + стрілки + drag/swipe + курсор ---------- */
export function initCarousel() {
  var stage = document.querySelector('[data-work-track]');
  if (!stage || !stage.children.length) return function () {};
  var ac = new AbortController();
  var on = listen(ac.signal);
  var cards = Array.prototype.slice.call(stage.children);
  var n = cards.length;
  var prev = document.querySelector('[data-work-prev]');
  var next = document.querySelector('[data-work-next]');
  var live = document.querySelector('[data-work-live]');
  var cursor = document.querySelector('.drag-cursor');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  var mobile = window.matchMedia('(max-width: 767px)');

  var pos = 0, anim = null, activeIdx = -1;

  function mod(a, m) { return ((a % m) + m) % m; }

  function geo() {
    var w = cards[0].offsetWidth;
    var small = mobile.matches;
    var step = small ? 32 : 30;
    var R = w * (small ? 1.8 : 2.05);
    return { w: w, step: step, R: R, px: R * Math.sin(step * Math.PI / 180) };
  }

  function render() {
    var g = geo();
    for (var i = 0; i < n; i++) {
      var o = mod(i - pos + n / 2, n) - n / 2;
      var a = Math.abs(o);
      var th = o * g.step;
      var rad = th * Math.PI / 180;
      var x = g.R * Math.sin(rad);
      var z = g.R * (Math.cos(rad) - 1);
      var c = cards[i];
      c.style.transform = 'translate3d(' + x.toFixed(1) + 'px,0,' + z.toFixed(1) + 'px) rotateY(' + th.toFixed(2) + 'deg)';
      c.style.zIndex = String(100 - Math.round(a * 10));
      var vis = a < 1.6 ? 1 : Math.max(0, 1 - (a - 1.6) / 0.5);
      c.style.opacity = vis.toFixed(3);
      c.style.visibility = vis <= 0 ? 'hidden' : 'visible';
      var meta = c.lastElementChild;
      if (meta) meta.style.opacity = Math.max(0, 1 - a * 2).toFixed(3);
    }
    var idx = mod(Math.round(pos), n);
    if (idx !== activeIdx) {
      activeIdx = idx;
      cards.forEach(function (c, k) {
        var isOn = k === idx;
        c.classList.toggle('is-active', isOn);
        c.setAttribute('aria-hidden', isOn ? 'false' : 'true');
      });
      if (live) live.textContent = 'Project ' + (idx + 1) + ' of ' + n;
    }
  }

  function animateTo(target) {
    if (anim) cancelAnimationFrame(anim.raf);
    if (reduce) { pos = target; render(); return; }
    var from = pos, t0 = performance.now();
    var dur = Math.min(900, 450 + Math.abs(target - from) * 180);
    anim = {};
    (function tick(now) {
      var t = Math.min(1, (now - t0) / dur);
      var e = 1 - Math.pow(1 - t, 4);
      pos = from + (target - from) * e;
      render();
      if (t < 1) anim.raf = requestAnimationFrame(tick); else anim = null;
    })(t0);
  }

  on(prev, 'click', function () { animateTo(Math.round(pos) - 1); });
  on(next, 'click', function () { animateTo(Math.round(pos) + 1); });

  on(stage, 'keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); animateTo(Math.round(pos) + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); animateTo(Math.round(pos) - 1); }
  });

  cards.forEach(function (c, i) {
    on(c.querySelector('.work__media'), 'click', function (e) {
      if (i !== activeIdx) {
        e.preventDefault();
        var o = mod(i - pos + n / 2, n) - n / 2;
        animateTo(Math.round(pos + o));
      }
    });
  });

  var drag = null, moved = 0;
  on(stage, 'dragstart', function (e) { e.preventDefault(); });

  on(stage, 'pointerdown', function (e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (anim) { cancelAnimationFrame(anim.raf); anim = null; }
    drag = { x: e.clientX, y: e.clientY, pos: pos, start: Math.round(pos), lastX: e.clientX, lastT: performance.now(), v: 0, locked: e.pointerType === 'mouse' };
    moved = 0;
    if (e.pointerType === 'mouse') {
      stage.setPointerCapture(e.pointerId);
      stage.classList.add('is-dragging');
      if (cursor) cursor.classList.add('is-down');
    }
  });

  on(stage, 'pointermove', function (e) {
    if (!drag) return;
    var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.locked) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      if (Math.abs(dy) > Math.abs(dx)) { drag = null; return; }
      drag.locked = true;
      stage.setPointerCapture(e.pointerId);
      stage.classList.add('is-dragging');
    }
    moved = Math.max(moved, Math.abs(dx));
    var now = performance.now(), dt = Math.max(1, now - drag.lastT);
    drag.v = (e.clientX - drag.lastX) / dt;
    drag.lastX = e.clientX; drag.lastT = now;
    pos = drag.pos - dx / geo().px;
    render();
  });

  function endDrag(e) {
    if (!drag) return;
    var dx = e.clientX - drag.x;
    var projected = pos - drag.v * 180 / geo().px;
    var target = Math.round(projected);
    if (target === drag.start && Math.abs(dx) > 40) target = drag.start + (dx < 0 ? 1 : -1);
    target = Math.max(drag.start - 2, Math.min(drag.start + 2, target));
    stage.classList.remove('is-dragging');
    if (cursor) cursor.classList.remove('is-down');
    var wasLocked = drag.locked;
    drag = null;
    if (wasLocked) animateTo(target);
  }
  on(stage, 'pointerup', endDrag);
  on(stage, 'pointercancel', endDrag);

  on(stage, 'click', function (e) {
    if (moved > 6) { e.preventDefault(); e.stopPropagation(); moved = 0; }
  }, { capture: true });

  var wheelAcc = 0, wheelLock = 0;
  on(stage, 'wheel', function (e) {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault();
    var now = performance.now();
    if (now < wheelLock) return;
    wheelAcc += e.deltaX;
    if (Math.abs(wheelAcc) > 50) {
      animateTo(Math.round(pos) + (wheelAcc > 0 ? 1 : -1));
      wheelAcc = 0; wheelLock = now + 550;
    }
  }, { passive: false });

  on(window, 'resize', render);

  if (cursor) {
    var lastX = -9999, lastY = -9999, frame = null, visible = false;
    var place = function () { frame = null; cursor.style.translate = lastX + 'px ' + lastY + 'px'; };
    var schedule = function () { if (!frame) frame = requestAnimationFrame(place); };
    var setVisible = function (v) { if (v === visible) return; visible = v; cursor.classList.toggle('is-visible', v); };
    var activeMediaAt = function (x, y) {
      var el = document.elementFromPoint(x, y);
      var m = el && el.closest('.work__media');
      return !!(m && m.parentElement.classList.contains('is-active'));
    };
    var onMove = function (e) {
      if (e.pointerType !== 'mouse' || !fine.matches) return;
      lastX = e.clientX; lastY = e.clientY;
      var v = drag ? visible : activeMediaAt(lastX, lastY);
      if (v && !visible) place(); else schedule();
      setVisible(v);
    };
    on(stage, 'pointermove', onMove);
    on(stage, 'pointerover', onMove);
    on(stage, 'pointerleave', function () { if (!drag) setVisible(false); });
    on(stage, 'pointerup', function () { setTimeout(function () { setVisible(activeMediaAt(lastX, lastY)); }, 0); });
    on(window, 'scroll', function () { if (!drag && lastX > -9999) setVisible(activeMediaAt(lastX, lastY)); }, { passive: true });
  }

  render();
  return function () {
    ac.abort();
    if (anim) cancelAnimationFrame(anim.raf);
    if (cursor) cursor.classList.remove('is-visible', 'is-down');
  };
}

/* ---------- Services: картки наїжджають одна на одну + прилиплий заголовок ---------- */
export function initServices() {
  var cards = Array.prototype.slice.call(document.querySelectorAll('.svc-card'));
  var svc = document.querySelector('.svc');
  var head = document.querySelector('.svc__head');
  if (!svc || !head || cards.length < 1) return function () {};
  var ac = new AbortController();
  var on = listen(ac.signal);
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  svc.style.setProperty('--n', cards.length);

  function layout() {
    svc.style.setProperty('--head-h', head.offsetHeight + 'px');
    svc.classList.remove('svc--free');
    var probe = document.createElement('div');
    probe.style.cssText = 'position:absolute;visibility:hidden;height:calc(var(--head-top) + var(--head-h) + var(--head-gap) + (var(--n) - 1) * var(--peek) + var(--card-h))';
    svc.appendChild(probe);
    var need = probe.offsetHeight;
    svc.removeChild(probe);
    svc.classList.toggle('svc--free', need > window.innerHeight);
  }
  layout();
  on(window, 'resize', layout);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (!ac.signal.aborted) layout(); });

  var SCALE = 0.05, FADE = 0.4, ticking = false;

  function update() {
    ticking = false;
    var p = [];
    for (var j = 0; j < cards.length; j++) {
      if (j === 0) { p.push(0); continue; }
      var c = cards[j];
      var stickTop = parseFloat(getComputedStyle(c).top) || 0;
      var dist = c.getBoundingClientRect().top - stickTop;
      var h = cards[j - 1].offsetHeight;
      p.push(Math.max(0, Math.min(1, 1 - dist / h)));
    }
    for (var i = 0; i < cards.length; i++) {
      var depth = 0;
      for (var k = i + 1; k < cards.length; k++) depth += p[k];
      cards[i].style.transform = depth ? 'scale(' + (1 - depth * SCALE).toFixed(4) + ')' : '';
      cards[i].style.setProperty('--veil', Math.min(0.75, depth * FADE).toFixed(3));
    }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }

  if (!reduce) {
    on(window, 'scroll', onScroll, { passive: true });
    on(window, 'resize', onScroll);
    update();
  }
  return function () { ac.abort(); };
}

/* ---------- Every site includes: клік + автоперемикання + стрілки ---------- */
export function initFeatures() {
  var root = document.querySelector('[data-feat]');
  if (!root) return function () {};
  var tabs = Array.prototype.slice.call(root.querySelectorAll('.feat__item'));
  if (!tabs.length) return function () {};
  var ac = new AbortController();
  var on = listen(ac.signal);
  var items = tabs.map(function (t) { return t.parentElement; });
  var panels = Array.prototype.slice.call(root.querySelectorAll('.feat__panelimg'));
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DURATION = 5000;
  var current = 0, start = 0, elapsed = 0, raf = null, inView = false, paused = false, hideT = null;

  function show(i, focus) {
    current = (i + tabs.length) % tabs.length;
    tabs.forEach(function (t, k) {
      var isOn = k === current;
      t.classList.toggle('is-active', isOn);
      t.setAttribute('aria-selected', isOn ? 'true' : 'false');
      t.tabIndex = isOn ? 0 : -1;
      if (panels[k]) {
        panels[k].classList.toggle('is-active', isOn);
        if (isOn) panels[k].hidden = false;
      }
    });
    clearTimeout(hideT);
    hideT = setTimeout(function () { panels.forEach(function (p, k) { if (k !== current) p.hidden = true; }); }, 550);
    items.forEach(function (li) { li.style.setProperty('--p', 0); });
    elapsed = 0; start = performance.now();
    if (focus) tabs[current].focus();
  }

  function tick(now) {
    raf = null;
    if (!inView || paused || reduce) return;
    elapsed += now - start; start = now;
    var p = Math.min(1, elapsed / DURATION);
    items[current].style.setProperty('--p', p.toFixed(3));
    if (p >= 1) show(current + 1);
    raf = requestAnimationFrame(tick);
  }
  function run() { if (!raf && inView && !paused && !reduce) { start = performance.now(); raf = requestAnimationFrame(tick); } }
  function stop() { if (raf) { cancelAnimationFrame(raf); raf = null; } }

  tabs.forEach(function (t, k) {
    on(t, 'click', function () { show(k); });
    on(t, 'keydown', function (e) {
      var d = (e.key === 'ArrowDown' || e.key === 'ArrowRight') ? 1 : (e.key === 'ArrowUp' || e.key === 'ArrowLeft') ? -1 : 0;
      if (e.key === 'Home') { e.preventDefault(); show(0, true); }
      else if (e.key === 'End') { e.preventDefault(); show(tabs.length - 1, true); }
      else if (d) { e.preventDefault(); show(current + d, true); }
    });
  });

  on(root, 'mouseenter', function () { paused = true; stop(); });
  on(root, 'mouseleave', function () { paused = false; run(); });
  on(root, 'focusin', function () { paused = true; stop(); });
  on(root, 'focusout', function (e) { if (!root.contains(e.relatedTarget)) { paused = false; run(); } });

  var io = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(function (en) {
      inView = en[0].isIntersecting;
      if (inView) run(); else stop();
    }, { threshold: 0.35 });
    io.observe(root);
  }

  show(0);
  return function () { ac.abort(); stop(); clearTimeout(hideT); if (io) io.disconnect(); };
}
