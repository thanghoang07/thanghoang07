import { ANIMATION_CONFIG, ANIMATION_CLASSES } from '../core/config.js';
import { AnimationUtils } from '../utils/index.js';

export function initScrollEffects() {
  const observer = new IntersectionObserver(handleIntersection, {
    threshold: ANIMATION_CONFIG.SCROLL_THRESHOLD,
    rootMargin: ANIMATION_CONFIG.SCROLL_MARGIN
  });

  const targets = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale, section, .card');
  targets.forEach(el => observer.observe(el));
}

function handleIntersection(entries) {
  entries.forEach(entry => {
    const el = entry.target;

    if (entry.isIntersecting) {
      handleElementVisible(el);
    } else {
      handleElementHidden(el);
    }
  });
}

function handleElementVisible(element) {
  AnimationUtils.resetAnimationClasses(element);
  element.classList.add('revealed');

  const animationType = element.dataset.animation || 'fade-in-up';
  const stagger = element.dataset.stagger || '';

  // Force reflow for smooth animation
  element.offsetHeight;

  if (stagger) {
    element.classList.add(stagger);
  }

  element.classList.add(animationType);
}

function handleElementHidden(element) {
  AnimationUtils.resetAnimationClasses(element);
  element.classList.remove('revealed');
}
