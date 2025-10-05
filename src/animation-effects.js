import { ANIMATION_CONFIG } from './utils.js';

export function initParallaxEffect() {
  let ticking = false;

  function updateParallax() {
    const scrolled = window.scrollY;
    document.querySelectorAll('.parallax').forEach(el => {
      const speed = el.dataset.speed || ANIMATION_CONFIG.PARALLAX_SPEED;
      el.style.transform = `translateY(${-scrolled * speed}px)`;
    });
    ticking = false;
  }

  function requestParallaxUpdate() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
}

export function addTypingEffect() {
  const heroName = document.getElementById('hero-name');
  if (!heroName) return;

  const text = heroName.textContent;
  heroName.textContent = '';
  heroName.style.borderRight = '2px solid #9333ea';

  let i = 0;

  function typeWriter() {
    if (i < text.length) {
      heroName.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, ANIMATION_CONFIG.TYPING_SPEED);
    } else {
      setTimeout(() => {
        heroName.style.borderRight = 'none';
      }, ANIMATION_CONFIG.CURSOR_DELAY);
    }
  }

  setTimeout(typeWriter, ANIMATION_CONFIG.TYPING_DELAY);
}

export function addCounterEffect() {
  const counters = document.querySelectorAll('[data-counter]');

  counters.forEach(counter => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(counter);
          observer.unobserve(entry.target);
        }
      });
    });

    observer.observe(counter);
  });
}

function animateCounter(counter) {
  const target = parseInt(counter.dataset.counter);
  const duration = ANIMATION_CONFIG.DURATION;
  const step = target / (duration / 16);
  let current = 0;

  function update() {
    current += step;
    if (current < target) {
      counter.textContent = Math.floor(current);
      requestAnimationFrame(update);
    } else {
      counter.textContent = target;
    }
  }

  update();
}
