// Note: scroll-to-top-on-refresh is handled by the inline script in
// <head> (index.html / about.html), which runs before the page paints
// so there's no visible jump on mobile or desktop.

// ---------- HERO TITLE WIDTH FIT ----------
// Stretches the "ANALYTICS" heading (via letter-spacing) so its total
// rendered width always matches the width of the two hero cards below
// it, keeping both right edges (and, visually, both left edges) lined
// up regardless of viewport size, font-loading timing, or zoom level.
// No-ops safely on pages (like About) that don't have this hero.
// On narrow/mobile viewports the heading wraps normally instead (see
// CSS), so this script skips the letter-spacing math there to avoid
// fighting with text wrapping and causing horizontal overflow.
(function () {
  const title = document.querySelector('.hero-title');
  const cardsRow = document.querySelector('.hero-cards');
  if (!title || !cardsRow) return;

  const mobileQuery = window.matchMedia('(max-width: 700px)');

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

  function resetSpacing() {
    if (!letters) return;
    letters.forEach((s) => { s.style.marginRight = '0px'; });
  }

  function fitHeroTitle() {
    if (mobileQuery.matches) {
      // Let the heading wrap naturally on small screens; no forced spacing.
      resetSpacing();
      return;
    }

    const spans = ensureLetters();
    if (!spans.length) return;

    const targetWidth = cardsRow.getBoundingClientRect().width;
    if (!targetWidth) return;

    const baseWidth = widthAt(0);
    if (baseWidth >= targetWidth) {
      widthAt(0);
      return;
    }

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

  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(scheduleFit);
    ro.observe(cardsRow);
  }

  window.addEventListener('load', scheduleFit);
  window.addEventListener('resize', scheduleFit);
  if (mobileQuery.addEventListener) {
    mobileQuery.addEventListener('change', scheduleFit);
  } else if (mobileQuery.addListener) {
    mobileQuery.addListener(scheduleFit);
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(scheduleFit);
  }
  document.addEventListener('DOMContentLoaded', scheduleFit);
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

  gsap.set(logo, { transformPerspective: 600 });
  gsap.from(logo, {
    rotateY: 90,
    opacity: 0,
    scale: 0.85,
    duration: 0.8,
    ease: 'power3.out'
  });
  gsap.to(logo, {
    scale: 1.05,
    duration: 1.1,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    delay: 0.7
  });
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

    // Hero background parallax (scroll + mouse) — only present on the home page
    const heroBg = document.querySelector('.hero-bg');
    const heroSection = document.querySelector('.hero');
    if (heroBg && heroSection) {
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
    // (window.playHeroEntrance) so it plays right as the preloader clears.
    // On pages without a .hero-left/.hero-title/.hero-cards (like About),
    // this timeline simply animates nothing and is a safe no-op.
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
    gsap.utils.toArray('.stats-row .num, .mini-stat .num, .stat-card .big, .team-stat-card .num, .revenue-figure .num').forEach((el) => {
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

    // Stat progress bars (About page) fill in sync with the number count-up
    gsap.utils.toArray('.stat-bar').forEach((bar) => {
      ScrollTrigger.create({
        trigger: bar,
        start: 'top 88%',
        onEnter: () => bar.classList.add('in-view'),
        onLeaveBack: () => bar.classList.remove('in-view')
      });
    });

    // About hero: gentle scroll parallax on the background photo
    const aboutHeroBg = document.querySelector('.js-parallax');
    const aboutHeroSection = document.querySelector('.about-hero');
    if (aboutHeroBg && aboutHeroSection) {
      gsap.to(aboutHeroBg, {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: aboutHeroSection,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }
  }
}

// ---------- Tilt cards (About page: team stat card, founder card) ----------
(function () {
  const tiltEls = document.querySelectorAll('.js-tilt');
  if (!tiltEls.length) return;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (prefersReducedMotion || !hasFinePointer) return;

  tiltEls.forEach((el) => {
    let raf = null;
    el.style.transformStyle = 'preserve-3d';

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `rotateX(${(-relY * 8).toFixed(2)}deg) rotateY(${(relX * 8).toFixed(2)}deg) translateY(-4px)`;
      });
    });

    el.addEventListener('mouseleave', () => {
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = 'rotateX(0) rotateY(0) translateY(0)';
    });
  });
})();

// ---------- Flip cards: tap-to-flip fallback for touch devices ----------
(function () {
  const cards = document.querySelectorAll('.flip-card');
  if (!cards.length) return;
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  if (!isTouch) return;

  cards.forEach((card) => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      cards.forEach((c) => { if (c !== card) c.classList.remove('is-flipped'); });
      card.classList.toggle('is-flipped');
    });
  });
})();