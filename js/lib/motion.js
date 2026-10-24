/**
 * motion.js — GSAP-style animations with zero dependencies.
 * Built on the Web Animations API (element.animate), IntersectionObserver
 * and one requestAnimationFrame scroll loop.
 *
 * Declarative hooks (add to any light-DOM element):
 *
 *   data-split              SplitText-style: words rise out of a mask, staggered.
 *   data-split="load"       …same, but plays immediately on page load (hero).
 *   data-animate="fade-up"  Fade + rise when scrolled into view.
 *   data-animate="clip"     Image reveal: clip-path wipe + inner image zoom-out.
 *   data-animate="scale"    Gentle zoom-out on load (hero media).
 *   data-stagger            Animate the element's children one after another.
 *   data-delay="200"        Extra delay in ms.
 *   data-scrub              Words light up from grey to ink as you scroll (scrubbed).
 *   data-parallax="0.15"    Moves at a fraction of scroll speed.
 *
 * Everything respects prefers-reduced-motion.
 */
(() => {
  const EASE = {
    expoOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
    power3Out: 'cubic-bezier(0.33, 1, 0.68, 1)',
    power3InOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
  };

  const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------ utilities */

  /** Wrap every word of `el` in <span class="word"><span class="word-inner">…</span></span>,
   *  keeping inline children such as <em>, <span class="dim"> and <br>. */
  function splitWords(el) {
    const words = [];
    const walk = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) {
              frag.append(document.createTextNode(' '));
              return;
            }
            const outer = document.createElement('span');
            const inner = document.createElement('span');
            outer.className = 'word';
            inner.className = 'word-inner';
            inner.textContent = part;
            outer.append(inner);
            frag.append(outer);
            words.push(inner);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') {
          walk(child);
        }
      });
    };
    walk(el);
    return words;
  }

  /** Run `callback` once, the first time `el` enters the viewport. */
  function onEnter(el, callback, { threshold = 0.15, rootMargin = '0px 0px -10% 0px' } = {}) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        callback(entry.target);
      });
    }, { threshold, rootMargin });
    io.observe(el);
  }

  /** gsap.from()-style tween: animate FROM `from` keyframe to the element's natural state. */
  function from(targets, fromFrame, { duration = 1000, delay = 0, stagger = 0, easing = EASE.expoOut } = {}) {
    const list = targets instanceof Element ? [targets] : [...targets];
    return list.map((el, i) => el.animate(
      [fromFrame, { opacity: 1, transform: 'none', clipPath: 'inset(0 0 0 0)', filter: 'none' }],
      { duration, delay: delay + i * stagger, easing, fill: 'backwards' },
    ));
  }

  /* ---------------------------------------------------- declarative hooks */

  const PRESETS = {
    'fade-up': { opacity: 0, transform: 'translateY(40px)' },
    'fade-in': { opacity: 0 },
    'fade-left': { opacity: 0, transform: 'translateX(40px)' },
    scale: { opacity: 0, transform: 'scale(1.08)' },
    blur: { opacity: 0, filter: 'blur(12px)', transform: 'translateY(20px)' },
  };

  function playSplit(el) {
    const words = el._words;
    el.classList.add('is-split');
    from(words, { transform: 'translateY(110%) rotate(3deg)' }, {
      duration: 1100, stagger: 45, delay: Number(el.dataset.delay ?? 0),
    });
  }

  function playAnimate(el) {
    const type = el.dataset.animate;
    const delay = Number(el.dataset.delay ?? 0);
    el.classList.add('is-ready');

    if (type === 'clip') {
      from(el, { clipPath: 'inset(100% 0 0 0)' }, { duration: 1400, delay, easing: EASE.power3InOut });
      const img = el.querySelector('img');
      if (img) from(img, { transform: 'scale(1.3)' }, { duration: 1800, delay, easing: EASE.expoOut });
      return;
    }
    from(el, PRESETS[type] ?? PRESETS['fade-up'], { duration: 1100, delay });
  }

  function playStagger(el) {
    el.classList.add('is-ready');
    from(el.children, PRESETS[el.dataset.stagger] ?? PRESETS['fade-up'], {
      duration: 1000, stagger: 90, delay: Number(el.dataset.delay ?? 0),
    });
  }

  /* Scroll-linked effects share one rAF loop (like ScrollTrigger scrub) */
  const scrubbers = new Set();
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      scrubbers.forEach((fn) => fn());
      ticking = false;
    });
  }

  /** Register a function called on every scroll/resize frame. */
  function addScrubber(fn) {
    if (scrubbers.size === 0) {
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
    }
    scrubbers.add(fn);
    fn();
  }

  /** 0 → 1 as `el` travels from `start` to `end` (fractions of viewport height from the top). */
  function progressOf(el, start = 0.85, end = 0.35) {
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const p = (vh * start - rect.top) / (vh * start - vh * end + rect.height * 0.5);
    return Math.min(1, Math.max(0, p));
  }

  function initScrub(el) {
    const words = splitWords(el);
    addScrubber(() => {
      const lit = Math.round(progressOf(el) * words.length);
      words.forEach((w, i) => w.classList.toggle('lit', i < lit));
    });
  }

  function initParallax(el) {
    const speed = Number(el.dataset.parallax) || 0.15;
    addScrubber(() => {
      const rect = el.parentElement.getBoundingClientRect();
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
      el.style.transform = `translate3d(0, ${(-offset).toFixed(1)}px, 0)`;
    });
  }

  /* ------------------------------------------------------------- init */

  function initMotion(root = document) {
    const reduced = reducedMotion();
    // Tells motion.css that JS is in control (disables the no-JS failsafe)
    document.documentElement.classList.add('js-motion');

    root.querySelectorAll('[data-split]').forEach((el) => {
      el._words = splitWords(el);
      if (reduced) return el.classList.add('is-split');
      if (el.dataset.split === 'load') playSplit(el);
      else onEnter(el, playSplit);
    });

    root.querySelectorAll('[data-animate]').forEach((el) => {
      if (reduced) return el.classList.add('is-ready');
      if (el.dataset.animate === 'scale') playAnimate(el);
      else onEnter(el, playAnimate);
    });

    root.querySelectorAll('[data-stagger]').forEach((el) => {
      if (reduced) return el.classList.add('is-ready');
      onEnter(el, playStagger);
    });

    if (reduced) return;
    root.querySelectorAll('[data-scrub]').forEach(initScrub);
    root.querySelectorAll('[data-parallax]').forEach(initParallax);
  }

  Object.assign(App, { EASE, reducedMotion, splitWords, onEnter, from, addScrubber, progressOf, initMotion });
})();
