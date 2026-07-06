export const DEFAULT_NAV_SECTION_IDS = ['services', 'portfolio', 'experience', 'skills-tools', 'contact'];

export function setOnlyActive(items, activeItem, activeClass = 'active') {
  items.forEach((item) => item.classList.toggle(activeClass, item === activeItem));
}

export function shouldShowProject(category, filter) {
  return filter === 'all' || category === filter;
}

export function applyPortfolioFilter(cards, buttons, activeButton, filter) {
  setOnlyActive(buttons, activeButton);
  cards.forEach((card) => {
    card.classList.toggle('is-filtered-out', !shouldShowProject(card.dataset.projectCategory, filter));
  });
}

export function formatCounterValue(target, progress, suffix = '') {
  const boundedProgress = Math.min(Math.max(progress, 0), 1);
  return String(Math.round(target * boundedProgress)) + suffix;
}

export function easeOutCubic(progress) {
  return 1 - Math.pow(1 - progress, 3);
}

export function updateFooterYear(doc = document, date = new Date()) {
  const year = doc.getElementById('footer-year');
  if (year) year.textContent = String(date.getFullYear());
}

export function initPortfolioFilter(doc = document) {
  const filterBar = doc.querySelector('[data-portfolio-filter]');
  if (!filterBar) return null;

  const cards = Array.from(doc.querySelectorAll('[data-project-category]'));
  const buttons = Array.from(filterBar.querySelectorAll('[data-filter]'));

  const onClick = (event) => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    applyPortfolioFilter(cards, buttons, button, button.dataset.filter);
  };

  filterBar.addEventListener('click', onClick);
  return () => filterBar.removeEventListener('click', onClick);
}

export function initActiveNav({
  doc = document,
  win = window,
  sectionIds = DEFAULT_NAV_SECTION_IDS,
  observerFactory = (callback, options) => new IntersectionObserver(callback, options),
} = {}) {
  const links = Array.from(doc.querySelectorAll('.ds-nav__link[href^="#"]'));
  if (!links.length) return null;

  const linkById = new Map(
    links
      .map((link) => [link.getAttribute('href')?.slice(1), link])
      .filter(([id]) => sectionIds.includes(id))
  );
  const sections = sectionIds.map((id) => doc.getElementById(id)).filter(Boolean);
  if (!sections.length || !('IntersectionObserver' in win)) return null;

  const clearActive = () => links.forEach((link) => link.classList.remove('active'));
  const setActive = (id) => {
    clearActive();
    linkById.get(id)?.classList.add('active');
  };

  const onScroll = () => {
    if (win.scrollY < 100) clearActive();
  };
  win.addEventListener('scroll', onScroll, { passive: true });

  const observer = observerFactory((entries) => {
    if (win.scrollY < 100) {
      clearActive();
      return;
    }

    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible?.target?.id) setActive(visible.target.id);
  }, { rootMargin: '-25% 0px -45% 0px', threshold: [0.3, 0.55] });

  sections.forEach((section) => observer.observe(section));
  return () => {
    win.removeEventListener('scroll', onScroll);
    observer.disconnect?.();
  };
}

export function initCounters({
  doc = document,
  win = window,
  now = () => performance.now(),
  observerFactory = (callback, options) => new IntersectionObserver(callback, options),
} = {}) {
  const counters = Array.from(doc.querySelectorAll('[data-count]'));
  if (!counters.length || !('IntersectionObserver' in win)) return null;

  const animate = (el) => {
    const target = Number(el.dataset.count || 0);
    const suffix = el.dataset.suffix || '';
    const duration = 1500;
    const start = now();

    const tick = (currentTime) => {
      const progress = Math.min((currentTime - start) / duration, 1);
      el.textContent = formatCounterValue(target, easeOutCubic(progress), suffix);
      if (progress < 1) win.requestAnimationFrame(tick);
    };
    win.requestAnimationFrame(tick);
  };

  const observer = observerFactory((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animate(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  counters.forEach((counter) => observer.observe(counter));
  return () => observer.disconnect?.();
}
