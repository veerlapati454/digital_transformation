// Blog category tabs — simple active-state toggle.
// Kept separate from service.js so the shared animation script stays untouched.
(function () {
  const tabs = document.querySelectorAll('.blog-tab');
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('is-active'));
      tab.classList.add('is-active');
    });
  });
})();

// Before/after compare sliders — the visible drag handle is decorative;
// the actual dragging happens on a full-size transparent <input type="range">
// layered on top, so it stays keyboard- and touch-accessible for free.
(function () {
  const sliders = document.querySelectorAll('.compare-slider');
  if (!sliders.length) return;

  sliders.forEach((slider) => {
    const range = slider.querySelector('.compare-range');
    if (!range) return;

    const setPos = (value) => {
      slider.style.setProperty('--pos', `${value}%`);
    };

    setPos(range.value);
    range.addEventListener('input', () => setPos(range.value));
  });
})();