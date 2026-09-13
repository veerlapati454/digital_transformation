// Note: scroll-to-top-on-refresh is handled by the inline script in
// <head> (index.html), which runs before the page paints so there's no
// visible jump on mobile or desktop.

// ---------- HERO TITLE WIDTH FIT ----------
// Stretches the "ANALYTICS" heading (via letter-spacing) so its total
// rendered width always matches the width of the two hero cards below
// it, keeping both right edges (and, visually, both left edges) lined
// up regardless of viewport size, font-loading timing, or zoom level.
(function () {
  const title = document.querySelector('.hero-title');
  const cardsRow = document.querySelector('.hero-cards');
  if (!title || !cardsRow) return;

  // Wrap each character in its own span so we can control spacing only
  // *between* letters. Plain CSS letter-spacing also adds a trailing
  // gap after the final character in most browsers — that gap was
  // invisible in the measured box width (so it looked "matched"), but
  // it pushed the last letter's actual ink to the left of where the
  // box ended, making the final letter look inset from the edge.
  let letters = null;
  function ensureLetters() {
    if (letters) return letters;
    const text = title.textContent;
    title.textContent = '';
    letters = [];
    for (const ch of text) {
      const span = document.createElement('span');
      span.textContent = ch;
      span.style.display = 'inline-block';
      title.appendChild(span);
      letters.push(span);
    }
    return letters;
  }

  function widthAt(gap) {
    const spans = ensureLetters();
    spans.forEach((s, i) => {
      s.style.marginRight = (i < spans.length - 1 ? gap : 0) + 'px';
    });
    return title.getBoundingClientRect().width;
  }

  function fitHeroTitle() {
    const spans = ensureLetters();
    if (!spans.length) return;

    const targetWidth = cardsRow.getBoundingClientRect().width;
    if (!targetWidth) return;

    const baseWidth = widthAt(0);
    if (baseWidth >= targetWidth) {
      // Already as wide as (or wider than) the cards row; leave as-is
      // rather than compressing letters together.
      widthAt(0);
      return;
    }

    // Binary-search the per-letter gap that makes the title's rendered
    // width match the cards row's width exactly.
    let lo = 0;
    let hi = 40;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      const w = widthAt(mid);
      if (w < targetWidth) {
        lo = mid;
      } else {
        hi = mid;
      }
    }
    widthAt(lo);
  }

  let pending = null;
  function scheduleFit() {
    if (pending) cancelAnimationFrame(pending);
    pending = requestAnimationFrame(fitHeroTitle);
  }

  // Keep re-fitting whenever the cards row's own rendered width changes —
  // this covers webfonts finishing their swap after first paint, images
  // affecting layout, and any other late reflow, not just window resize.
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(scheduleFit);
    ro.observe(cardsRow);
  }

  window.addEventListener('load', scheduleFit);
  window.addEventListener('resize', scheduleFit);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(scheduleFit);
  }
  document.addEventListener('DOMContentLoaded', scheduleFit);
  // Belt-and-braces: a couple of delayed re-checks catch any late font
  // swap or image-driven reflow that doesn't fire the events above.
  setTimeout(scheduleFit, 300);
  setTimeout(scheduleFit, 1200);

  scheduleFit();
})();

// ---------- PRELOADER ----------
(function () {
  const preloader = document.getElementById('preloader');
  if (!preloader) { document.documentElement.classList.remove('is-loading'); return; }

  const logo = document.getElementById('preloaderLogo');
  const fill = document.getElementById('preloaderFill');
  const percent = document.getElementById('preloaderPercent');
  const tagline = document.getElementById('preloaderTagline');
  const bg = preloader.querySelector('.preloader-bg');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let windowLoaded = document.readyState === 'complete';
  window.addEventListener('load', () => { windowLoaded = true; });
  // Hard cap: never let a slow/broken asset hold the preloader hostage.
  // If real load takes too long, we proceed anyway after this ceiling.
  const MAX_WAIT_MS = 4500;
  const startedAt = Date.now();
  function loadReadyOrTimedOut() {
    return windowLoaded || (Date.now() - startedAt) > MAX_WAIT_MS;
  }

  function updateBar(v) {
    const rounded = Math.round(v);
    if (fill) fill.style.width = rounded + '%';
    if (percent) percent.textContent = rounded + '%';
  }

  function reveal() {
    document.documentElement.classList.remove('is-loading');
    preloader.style.display = 'none';
    window.playHeroEntrance && window.playHeroEntrance();
  }

  // No GSAP / reduced motion: skip straight to a simple, still-graceful exit
  if (!window.gsap || prefersReducedMotion) {
    updateBar(100);
    const finish = () => {
      preloader.style.transition = 'opacity .4s ease';
      preloader.style.opacity = '0';
      setTimeout(reveal, 400);
    };
    if (loadReadyOrTimedOut()) {
      finish();
    } else {
      window.addEventListener('load', finish);
      setTimeout(finish, MAX_WAIT_MS);
    }
    return;
  }

  // Logo flip-in entrance (matches the site's existing js-flip motif)
  gsap.set(logo, { transformPerspective: 600 });
  gsap.from(logo, {
    rotateY: 90,
    opacity: 0,
    scale: 0.85,
    duration: 0.8,
    ease: 'power3.out'
  });
  // Gentle idle pulse while the bar fills
  gsap.to(logo, {
    scale: 1.05,
    duration: 1.1,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    delay: 0.7
  });
  // Tagline: words rise into place just after the logo lands
  if (tagline) {
    gsap.to(tagline.querySelectorAll('span'), {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.06,
      delay: 0.35
    });
  }
  // Background: slow, subtle breathing so the preloader feels alive, not static
  if (bg) {
    gsap.to(bg, {
      scale: 1.08,
      duration: 5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      transformOrigin: 'center center'
    });
  }

  const progress = { val: 0 };

  function exitPreloader() {
    gsap.to(logo, { scale: 1.12, opacity: 1, duration: 0.3, ease: 'power2.out' });

    // Circular "iris" wipe reveal, closing in on the logo's center
    const clipState = { r: 150 };
    gsap.timeline({ onComplete: reveal })
      .to('.preloader-content', { opacity: 0, y: -16, duration: 0.35, ease: 'power2.in' }, 0)
      .to(clipState, {
        r: 0,
        duration: 0.85,
        ease: 'power3.inOut',
        onUpdate: () => {
          const val = 'circle(' + clipState.r + '% at 50% 50%)';
          preloader.style.clipPath = val;
          preloader.style.webkitClipPath = val;
        }
      }, 0.1);
  }

  function finish() {
    gsap.to(progress, {
      val: 100,
      duration: 0.4,
      ease: 'power1.out',
      onUpdate: () => updateBar(progress.val),
      onComplete: exitPreloader
    });
  }

  // Progress eases up to 90% quickly, then holds until the page has
  // actually finished loading before completing to 100% and exiting —
  // so the bar reflects real load time rather than a fake fixed delay.
  gsap.to(progress, {
    val: 90,
    duration: 1.3,
    ease: 'power2.out',
    onUpdate: () => updateBar(progress.val),
    onComplete: () => {
      if (loadReadyOrTimedOut()) { finish(); return; }
      const check = setInterval(() => {
        if (loadReadyOrTimedOut()) { clearInterval(check); finish(); }
      }, 100);
    }
  });
})();

// Header becomes solid after scrolling past the hero
const header = document.getElementById('site-header');

function toggleSolid() {
  if (window.scrollY > 60) {
    header.classList.add('solid');
  } else {
    header.classList.remove('solid');
  }
}
window.addEventListener('scroll', toggleSolid);
toggleSolid();

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navClose = document.getElementById('navClose');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

navClose.addEventListener('click', () => {
  navLinks.classList.remove('open');
  document.body.style.overflow = '';
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ---------- GSAP scroll + flip animations ----------
if (window.gsap) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  if (!prefersReducedMotion) {

    // Hero background parallax (scroll + mouse) — a single deliberate atmospheric touch
    const heroBg = document.querySelector('.hero-bg');
    const heroSection = document.querySelector('.hero');
    if (heroBg && heroSection) {
      // Scroll: background drifts slower than the page as you leave the hero
      gsap.to(heroBg, {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });

      // Mouse: only on devices with a real pointer (skip touch/mobile)
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const xTo = gsap.quickTo(heroBg, 'x', { duration: 0.9, ease: 'power3.out' });
        const yTo = gsap.quickTo(heroBg, 'y', { duration: 0.9, ease: 'power3.out' });
        heroSection.addEventListener('mousemove', (e) => {
          const rect = heroSection.getBoundingClientRect();
          const relX = (e.clientX - rect.left) / rect.width - 0.5;
          const relY = (e.clientY - rect.top) / rect.height - 0.5;
          xTo(relX * 40);
          yTo(relY * 40);
        });
        heroSection.addEventListener('mouseleave', () => {
          xTo(0);
          yTo(0);
        });
      }
    }

    // Hero: entrance timeline. Held back and triggered by the preloader
    // (window.playHeroEntrance) so it plays right as the preloader clears,
    // instead of finishing invisibly underneath it.
    window.playHeroEntrance = function () {
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      heroTl
        .from('.hero-left .js-reveal', {
          y: 26, opacity: 0, duration: 0.7, stagger: 0.12
        })
        .from('.hero-title.js-reveal', {
          y: 20, opacity: 0, duration: 0.7
        }, '-=0.5')
        .from('.hero-cards .js-flip', {
          rotateY: 75, opacity: 0, duration: 0.9, stagger: 0.15, transformOrigin: 'left center'
        }, '-=0.4');
    };
    // Fallback in case the preloader element is missing for any reason
    if (!document.getElementById('preloader')) {
      window.playHeroEntrance();
    }

    // Fade + slide reveal for standard content, one section at a time
    gsap.utils.toArray('.js-reveal').forEach((el) => {
      if (el.closest('.hero')) return; // hero handled by the timeline above
      gsap.from(el, {
        y: 34,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none reverse'
        }
      });
    });

    // Flip-in reveal for card / image elements as they scroll into view
    gsap.utils.toArray('.js-flip').forEach((el) => {
      if (el.closest('.hero')) return; // hero handled by the timeline above
      gsap.from(el, {
        rotateY: 80,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        transformOrigin: 'center center',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });
    });

    // Avatar cluster: pop in with a stagger
    const avatarCluster = document.querySelector('.js-avatars');
    if (avatarCluster) {
      gsap.from(avatarCluster.querySelectorAll('.av'), {
        scale: 0.4,
        opacity: 0,
        duration: 0.6,
        ease: 'back.out(1.7)',
        stagger: 0.08,
        scrollTrigger: {
          trigger: avatarCluster,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });
      gsap.from(avatarCluster.querySelectorAll('.dot'), {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        ease: 'back.out(2)',
        stagger: 0.06,
        scrollTrigger: {
          trigger: avatarCluster,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });
    }

    // Big stat numbers count up as they enter view
    gsap.utils.toArray('.stats-row .num, .mini-stat .num, .stat-card .big').forEach((el) => {
      const raw = el.textContent.trim();
      const match = raw.match(/^([\d.]+)(.*)$/);
      if (!match) return;
      const end = parseFloat(match[1]);
      const suffix = match[2];
      const counter = { val: 0 };
      gsap.to(counter, {
        val: end,
        duration: 1.4,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none reverse'
        },
        onUpdate: () => {
          const isDecimal = raw.includes('.');
          el.textContent = (isDecimal ? counter.val.toFixed(1) : Math.round(counter.val)) + suffix;
        }
      });
    });
  }
}