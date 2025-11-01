import { initTranslations } from './utils/translations.js';
import { initScrollEffects } from './features/scroll-effects.js';
import { initParallaxEffect, addTypingEffect, addCounterEffect } from './animations.js';
import { initWorkExpTabs } from './ui/work-exp-tabs.js';
import { initContactForm } from './ui/contact-form.js';

export function initApp() {
  console.log('🚀 Initializing core app features...');
  
  try {
    initTranslations();
    console.log('✅ Translations initialized');
    
    initScrollEffects();
    console.log('✅ Scroll effects initialized');
    
    initParallaxEffect();
    console.log('✅ Parallax effects initialized');
    
    initContactForm();
    console.log('✅ Contact form initialized');
    
    setTimeout(ensureElementsVisible, 100);
    console.log('✅ Core app initialization complete');
    
  } catch (error) {
    console.error('❌ Error in core app initialization:', error);
  }
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
