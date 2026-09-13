// ---------- Contact form: validation + submit ----------
(function () {
  const form = document.getElementById('ctcContactForm');
  if (!form) return;

  const nameInput = form.querySelector('input[name="name"]');
  if (nameInput) {
    // Strip anything that isn't a letter or space as the person types
    nameInput.addEventListener('input', () => {
      const cleaned = nameInput.value.replace(/[^A-Za-z ]/g, '');
      if (cleaned !== nameInput.value) nameInput.value = cleaned;
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (form.checkValidity()) {
      window.location.href = form.getAttribute('action') || './404.html';
    } else {
      form.reportValidity();
    }
  });
})();

// ---------- FAQ accordion ----------
(function () {
  const accordion = document.getElementById('ctcAccordion');
  if (!accordion) return;

  const items = Array.from(accordion.querySelectorAll('.ctc-accordion-item'));

  items.forEach((item) => {
    const trigger = item.querySelector('.ctc-accordion-trigger');
    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      items.forEach((i) => i.classList.remove('is-open'));
      if (!isOpen) item.classList.add('is-open');
    });
  });
})();

// ---------- GSAP-driven extras (scoped to the contact page) ----------
if (window.gsap) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  if (!prefersReducedMotion) {

    // Hero: title and the copy box settle in on load, title first
    const heroTitle = document.querySelector('.ctc-hero-title');
    const heroSide = document.querySelector('.ctc-hero-side');
    if (heroTitle || heroSide) {
      gsap.timeline({ delay: 0.1 })
        .from(heroTitle, { y: 36, opacity: 0, duration: 0.8, ease: 'power3.out' })
        .from(heroSide, { y: 24, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5');
    }

    // Hero background: slow parallax drift as the section scrolls
    const ctcHeroBg = document.querySelector('.ctc-hero-bg img');
    const ctcHeroSection = document.querySelector('.ctc-hero');
    if (ctcHeroBg && ctcHeroSection) {
      gsap.to(ctcHeroBg, {
        yPercent: 14,
        scale: 1.08,
        ease: 'none',
        scrollTrigger: {
          trigger: ctcHeroSection,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    // Contact info card + form: soft rise-in, staggered so the eye lands
    // on the form second
    const reachGrid = document.querySelector('.ctc-reach-grid');
    if (reachGrid) {
      gsap.from([document.querySelector('.ctc-reach-side'), document.querySelector('.ctc-form')], {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: reachGrid,
          start: 'top 82%',
          toggleActions: 'play none none reverse'
        }
      });
    }

    // Map: gentle fade + scale-in rather than the generic slide-up
    const mapFrame = document.querySelector('.ctc-map-frame');
    if (mapFrame) {
      gsap.from(mapFrame, {
        scale: 0.97,
        opacity: 0,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: mapFrame,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });
    }

    // Accordion rows: quick stagger as the list enters view
    const accordionItems = gsap.utils.toArray('.ctc-accordion-item');
    if (accordionItems.length) {
      gsap.from(accordionItems, {
        y: 18,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.ctc-accordion',
          start: 'top 88%',
          toggleActions: 'play none none reverse'
        }
      });
    }
  }
}