export function initNavigation() {
  const button = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (button && menu) {
    const setOpen = open => {
      menu.hidden = !open;
      button.setAttribute('aria-expanded', String(open));
    };
    button.hidden = false;
    setOpen(false);
    button.addEventListener('click', () => setOpen(menu.hidden));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !menu.hidden) { setOpen(false); button.focus(); }
    });
    document.addEventListener('click', event => {
      if (!menu.contains(event.target) && !button.contains(event.target)) setOpen(false);
    });
    menu.addEventListener('click', event => {
      const link = event.target.closest('a[href^="#"]');
      if (!link) return;
      setOpen(false);
      const section = document.querySelector(link.getAttribute('href'));
      section?.setAttribute('tabindex', '-1');
      section?.focus({ preventScroll: true });
    });
    window.matchMedia('(min-width: 768px)').addEventListener('change', () => setOpen(false));
  }

  const back = document.getElementById('back-to-top');
  if (!back) return;
  const update = () => {
    const visible = window.scrollY > 300;
    back.classList.toggle('show', visible);
    back.tabIndex = visible ? 0 : -1;
    back.setAttribute('aria-hidden', String(!visible));
  };
  window.addEventListener('scroll', update, { passive: true });
  back.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    document.querySelector('header a')?.focus({ preventScroll: true });
  });
  update();
}
