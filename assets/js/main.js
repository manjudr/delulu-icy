/* Delulu Icy — scroll choreography.
   No dependencies. Everything degrades to a readable page if this never runs. */
(() => {
  'use strict';

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- current year ---------- */
  const yr = $('[data-year]');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- reveal on enter ---------- */
  const rises = $$('[data-rise]');
  const revealAll = () => rises.forEach(el => el.classList.add('in'));

  /* Tell the head bootstrap we're alive, so it leaves the .js class in place. */
  window.__riseReady = true;

  if (reduced || !('IntersectionObserver' in window)) {
    revealAll();
  } else {
    /* threshold 0: an element taller than the shrunk root must still reveal. */
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0 });
    rises.forEach(el => io.observe(el));

    /* Deep links and restored scroll positions can land past an element before
       the observer attaches — reveal anything already at or above the fold. */
    requestAnimationFrame(() => {
      rises.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add('in');
          io.unobserve(el);
        }
      });
    });

    /* Last resort: nothing on this page may stay invisible. */
    setTimeout(revealAll, 8000);
  }

  if (reduced) return;   // pinned sequences are flattened by CSS; nothing else to drive

  /* ---------- pinned-section driver ----------
     Returns scroll progress 0→1 across a section's pinned travel. */
  const progressOf = (section) => {
    const r = section.getBoundingClientRect();
    const travel = section.offsetHeight - window.innerHeight;
    if (travel <= 0) return 0;
    return Math.min(1, Math.max(0, -r.top / travel));
  };

  const setActive = (nodes, i) => {
    nodes.forEach((n, k) => n.classList.toggle('is-on', k === i));
  };

  /* --- 3. The Creed: one word per viewport-beat --- */
  const creed      = $('.creed');
  const creedWords = $$('.creed__word');
  const creedCount = $('[data-count]');
  let creedAt = -1;

  const driveCreed = () => {
    if (!creed) return;
    const p = progressOf(creed);
    // hold each word slightly longer than the transition so it reads as deliberate
    const i = Math.min(creedWords.length - 1, Math.floor(p * creedWords.length * 0.999));
    if (i === creedAt) return;
    creedAt = i;
    setActive(creedWords, i);
    if (creedCount) creedCount.textContent = String(i + 1).padStart(2, '0');
  };

  /* --- 4. The Trio: object + copy morph together --- */
  const trio  = $('.trio');
  const objs  = $$('.obj');
  const panes = $$('.pane');
  const dots  = $$('.trio__dots li');
  let trioAt = -1;

  const driveTrio = () => {
    if (!trio) return;
    const p = progressOf(trio);
    const i = Math.min(objs.length - 1, Math.floor(p * objs.length * 0.999));
    if (i === trioAt) return;
    trioAt = i;
    setActive(objs, i);
    setActive(panes, i);
    setActive(dots, i);
  };

  /* ---------- rAF-throttled scroll loop ---------- */
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      driveCreed();
      driveTrio();
      ticking = false;
    });
  };

  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  addEventListener('orientationchange', onScroll, { passive: true });
  onScroll();

  /* ---------- flavour rail: drag to scroll on pointer devices ---------- */
  const rail = $('.rail');
  if (rail && matchMedia('(hover:hover)').matches) {
    let down = false, startX = 0, startLeft = 0, moved = 0;

    rail.addEventListener('pointerdown', (e) => {
      down = true; moved = 0;
      startX = e.clientX; startLeft = rail.scrollLeft;
      rail.setPointerCapture(e.pointerId);
      rail.style.cursor = 'grabbing';
      rail.style.scrollSnapType = 'none';
    });

    rail.addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      rail.scrollLeft = startLeft - dx;
    });

    const release = (e) => {
      if (!down) return;
      down = false;
      if (e.pointerId !== undefined && rail.hasPointerCapture?.(e.pointerId)) {
        rail.releasePointerCapture(e.pointerId);
      }
      rail.style.cursor = '';
      rail.style.scrollSnapType = '';
    };
    rail.addEventListener('pointerup', release);
    rail.addEventListener('pointercancel', release);
    rail.style.cursor = 'grab';

    // keyboard access for the horizontal rail
    rail.addEventListener('keydown', (e) => {
      const step = rail.clientWidth * 0.8;
      if (e.key === 'ArrowRight') { rail.scrollBy({ left: step, behavior: 'smooth' }); e.preventDefault(); }
      if (e.key === 'ArrowLeft')  { rail.scrollBy({ left: -step, behavior: 'smooth' }); e.preventDefault(); }
    });
  }

  /* ---------- drop the intro curtain from the tree once it's done ---------- */
  const curtain = $('#curtain');
  if (curtain) {
    curtain.addEventListener('animationend', (e) => {
      if (e.animationName === 'curtain-out') curtain.remove();
    });
    setTimeout(() => curtain.remove(), 3000);  // hard safety net
  }
})();
