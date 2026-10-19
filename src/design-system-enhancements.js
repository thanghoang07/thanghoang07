export function initDesignSystemEnhancements() {
  const glow = document.querySelector('.ds-cursor-glow');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = window.matchMedia('(pointer: fine)');
  if (glow) {
    let idle;
    const hide = () => { glow.style.opacity = '0'; clearTimeout(idle); };
    document.addEventListener('pointermove', event => {
      if (motion.matches || !pointer.matches || document.hidden) return;
      glow.style.left = event.clientX + 'px';
      glow.style.top = event.clientY + 'px';
      glow.style.opacity = '1';
      clearTimeout(idle);
      idle = setTimeout(hide, 1000);
    }, { passive: true });
    document.addEventListener('visibilitychange', hide);
    motion.addEventListener('change', hide);
  }
  const progress = document.querySelector('.ds-scroll-progress');
  const header = document.querySelector('header');
  if (!progress && !header) return;
  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.width = (max > 0 ? scrollY / max * 100 : 0) + '%';
    if (header) header.classList.toggle('scrolled', scrollY > 20);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
}
