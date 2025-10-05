import { initTranslations } from './translations.js';
import { initTheme } from './theme.js';
import { initScrollEffects } from './scroll-effects.js';
import { initParallaxEffect, addTypingEffect, addCounterEffect } from './animation-effects.js';
import { initWorkExpTabs } from './work-exp-tabs.js';
import { initContactForm } from './contact-form.js';

export function initApp() {
  initTranslations();
  initTheme();
  initScrollEffects();
  initParallaxEffect();
  initContactForm();
  setTimeout(ensureElementsVisible, 100);
}

function ensureElementsVisible() {
  const elements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale, section, .card');
  elements.forEach(el => {
    if (el.classList.contains('revealed')) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0) translateX(0) scale(1)';
    }
  });
}
