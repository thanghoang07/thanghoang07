import { initTranslations } from './translations.js';
import { initTheme } from './theme.js';
import { initNavigation } from './navigation.js';

export function initApp() {
  initTranslations();
  initTheme();
  initNavigation();
  addScrollEffects();
  addParallaxEffect();
  setTimeout(ensureElementsVisible, 100);
}

function ensureElementsVisible() {
  document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale, section, .card').forEach(el => {
    if (el.classList.contains('revealed')) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0) translateX(0) scale(1)';
    }
  });
}

function addScrollEffects() {
  const observer = new IntersectionObserver(handleIntersection, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  const targets = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale, section, .card');
  targets.forEach(el => observer.observe(el));
}

function handleIntersection(entries) {
  entries.forEach(entry => {
    const el = entry.target;
    if (entry.isIntersecting) {
      resetAnimationClasses(el);
      el.classList.add('revealed');
      const animationType = el.dataset.animation || 'fade-in-up';
      const stagger = el.dataset.stagger || '';
      el.offsetHeight;
      if (stagger) el.classList.add(stagger);
      el.classList.add(animationType);
    } else {
      resetAnimationClasses(el);
      el.classList.remove('revealed');
    }
  });
}

function resetAnimationClasses(el) {
  el.classList.remove('fade-in-up', 'fade-in-left', 'fade-in-right', 'fade-in-scale', 'slide-in-up', 'slide-in-down', 'stagger-1', 'stagger-2', 'stagger-3', 'stagger-4', 'stagger-5');
}

function addParallaxEffect() {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    document.querySelectorAll('.parallax').forEach(el => {
      const speed = el.dataset.speed || 0.5;
      el.style.transform = `translateY(${-scrolled * speed}px)`;
    });
  });
}

export function addTypingEffect() {
  const heroName = document.getElementById('hero-name');
  if (!heroName) return;
  const text = heroName.textContent;
  heroName.textContent = '';
  heroName.style.borderRight = '2px solid #9333ea';
  let i = 0;
  const typeWriter = () => {
    if (i < text.length) {
      heroName.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, 100);
    } else {
      setTimeout(() => {
        heroName.style.borderRight = 'none';
      }, 1000);
    }
  };
  setTimeout(typeWriter, 500);
}

export function addCounterEffect() {
  document.querySelectorAll('[data-counter]').forEach(counter => {
    const target = parseInt(counter.dataset.counter);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const update = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(update);
      } else {
        counter.textContent = target;
      }
    };
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          update();
          observer.unobserve(entry.target);
        }
      });
    });
    observer.observe(counter);
  });
}

export function initWorkExpTabs() {
  const tabs = document.querySelectorAll('.company-tab');
  const details = document.querySelectorAll('.company-detail');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      details.forEach(d => d.classList.add('hidden'));
      tab.classList.add('active');
      const detail = document.getElementById('exp-' + tab.dataset.company);
      if (detail) detail.classList.remove('hidden');
    });
  });
}