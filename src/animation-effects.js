/**
 * 🎨 Animation Effects Module
 * Comprehensive animation system for smooth interactions
 */

import { DOMUtils } from './utils.js';

// Animation configuration
const ANIMATION_CONFIG = {
  PARALLAX_SPEED: 0.5,
  TYPING_SPEED: 100,
  CURSOR_DELAY: 1000,
  TYPING_DELAY: 500,
  DURATION: 2000,
  SCROLL_THRESHOLD: 0.15,
  STAGGER_DELAY: 200,
  RIPPLE_DURATION: 600,
  BOUNCE_DURATION: 150,
  PROGRESS_DURATION: 2000
};

/**
 * Scroll Effects Manager
 */
export class ScrollEffects {
  constructor() {
    this.observerOptions = {
      threshold: ANIMATION_CONFIG.SCROLL_THRESHOLD,
      rootMargin: '0px 0px -50px 0px'
    };
  }

  init() {
    console.log('📜 Initializing scroll effects...');
    
    this.initScrollReveal();
    this.initProgressBars();
    this.initScrollProgress();
    
    console.log('✅ Scroll effects ready');
  }

  initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale');
    console.log(`📜 Found ${revealElements.length} elements with scroll animations`);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const animationType = this.getAnimationType(element);
          const stagger = this.getStaggerDelay(element);

          setTimeout(() => {
            this.applyAnimation(element, animationType);
          }, stagger);

          observer.unobserve(element);
        }
      });
    }, this.observerOptions);

    revealElements.forEach((el, index) => {
      this.prepareElementForAnimation(el, index);
      observer.observe(el);
    });
  }

  getAnimationType(element) {
    if (element.classList.contains('scroll-reveal-left')) return 'fade-in-left';
    if (element.classList.contains('scroll-reveal-right')) return 'fade-in-right';
    if (element.classList.contains('scroll-reveal-scale')) return 'fade-in-scale';
    return 'fade-in-up';
  }

  getStaggerDelay(element) {
    const staggerAttr = element.getAttribute('data-stagger');
    if (!staggerAttr) return 0;

    const staggerMap = {
      'stagger-1': 0,
      'stagger-2': ANIMATION_CONFIG.STAGGER_DELAY,
      'stagger-3': ANIMATION_CONFIG.STAGGER_DELAY * 2,
      'stagger-4': ANIMATION_CONFIG.STAGGER_DELAY * 3
    };

    return staggerMap[staggerAttr] || 0;
  }

  prepareElementForAnimation(element) {
    const animationType = this.getAnimationType(element);

    element.style.opacity = '0';
    element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';

    switch (animationType) {
      case 'fade-in-left':
        element.style.transform = 'translateX(-50px)';
        break;
      case 'fade-in-right':
        element.style.transform = 'translateX(50px)';
        break;
      case 'fade-in-scale':
        element.style.transform = 'scale(0.8)';
        break;
      case 'fade-in-up':
      default:
        element.style.transform = 'translateY(30px)';
        break;
    }
  }

  applyAnimation(element, animationType) {
    element.style.opacity = '1';

    switch (animationType) {
      case 'fade-in-left':
      case 'fade-in-right':
        element.style.transform = 'translateX(0)';
        break;
      case 'fade-in-scale':
        element.style.transform = 'scale(1)';
        this.addBounceEffect(element);
        break;
      case 'fade-in-up':
      default:
        element.style.transform = 'translateY(0)';
        break;
    }
  }

  addBounceEffect(element) {
    setTimeout(() => {
      element.style.transform = 'scale(1.02)';
      setTimeout(() => {
        element.style.transform = 'scale(1)';
      }, ANIMATION_CONFIG.BOUNCE_DURATION);
    }, 100);
  }

  initProgressBars() {
    console.log('📊 Initializing progress bar animations...');

    const progressBars = document.querySelectorAll('.progress-bar');
    if (progressBars.length === 0) return;

    const progressObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateProgressBar(entry.target, Array.from(progressBars).indexOf(entry.target));
          progressObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    progressBars.forEach((bar) => {
      const originalWidth = bar.style.width;
      bar.setAttribute('data-target-width', originalWidth);
      bar.style.width = '0%';
      progressObserver.observe(bar);
    });
  }

  animateProgressBar(progressBar, index) {
    const targetWidth = progressBar.getAttribute('data-target-width');
    const targetPercent = parseInt(targetWidth);

    let currentWidth = 0;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / ANIMATION_CONFIG.PROGRESS_DURATION, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      currentWidth = Math.round(targetPercent * eased);

      progressBar.style.width = `${currentWidth}%`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    setTimeout(() => {
      animate();
    }, index * ANIMATION_CONFIG.STAGGER_DELAY);
  }

  initScrollProgress() {
    console.log('📊 Initializing scroll progress indicator...');

    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 4px;
      background: linear-gradient(90deg, #9333ea, #a855f7);
      border-radius: 0 0 2px 2px;
      box-shadow: 0 2px 10px rgba(147, 51, 234, 0.3);
      z-index: 10001;
      width: 0%;
      transition: width 0.1s ease;
    `;

    document.body.appendChild(progressBar);

    let ticking = false;
    const updateProgress = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / scrollHeight) * 100;
      progressBar.style.width = `${Math.min(progress, 100)}%`;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }, { passive: true });
  }
}

/**
 * Floating Shapes Animation
 */
export class FloatingShapes {
  constructor() {
    this.shapes = [];
    this.colors = ['#9333ea', '#7c3aed', '#a855f7', '#c084fc', '#e879f9'];
    this.shapeTypes = ['circle', 'square', 'triangle', 'hexagon'];
  }

  init() {
    console.log('✨ Initializing floating shapes...');

    const container = document.getElementById('floating-shapes-container');
    if (!container) {
      console.warn('Floating shapes container not found');
      return;
    }

    this.createShapes(container);
    this.addGradientOverlay(container);

    console.log(`✨ Created ${this.shapes.length} floating shapes with gradient overlay`);
  }

  createShapes(container) {
    for (let i = 0; i < 12; i++) {
      const shape = this.createShape(i);
      container.appendChild(shape);
      this.shapes.push(shape);
    }
  }

  createShape(index) {
    const shape = document.createElement('div');
    const size = Math.random() * 120 + 40;
    const color = this.colors[Math.floor(Math.random() * this.colors.length)];
    const shapeType = this.shapeTypes[Math.floor(Math.random() * this.shapeTypes.length)];

    const { borderRadius, clipPath } = this.getShapeStyle(shapeType);

    shape.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: linear-gradient(135deg, ${color}15, ${color}05);
      border-radius: ${borderRadius};
      ${clipPath ? `clip-path: ${clipPath};` : ''}
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      opacity: ${0.05 + Math.random() * 0.1};
      filter: blur(${Math.random() * 2}px);
      animation: floatShape${index} ${20 + Math.random() * 15}s ease-in-out infinite;
      animation-delay: ${Math.random() * 5}s;
    `;

    this.addShapeAnimation(index);
    return shape;
  }

  getShapeStyle(shapeType) {
    switch (shapeType) {
      case 'square':
        return { borderRadius: '15%', clipPath: '' };
      case 'triangle':
        return { borderRadius: '0', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' };
      case 'hexagon':
        return { borderRadius: '0', clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' };
      default:
        return { borderRadius: '50%', clipPath: '' };
    }
  }

  addShapeAnimation(index) {
    const keyframes = `
      @keyframes floatShape${index} {
        0%, 100% {
          transform: translate(0, 0) rotate(0deg) scale(1);
        }
        25% {
          transform: translate(${Math.random() * 150 - 75}px, ${Math.random() * 150 - 75}px) rotate(90deg) scale(${0.8 + Math.random() * 0.4});
        }
        50% {
          transform: translate(${Math.random() * 150 - 75}px, ${Math.random() * 150 - 75}px) rotate(180deg) scale(${1.1 + Math.random() * 0.3});
        }
        75% {
          transform: translate(${Math.random() * 150 - 75}px, ${Math.random() * 150 - 75}px) rotate(270deg) scale(${0.9 + Math.random() * 0.2});
        }
      }
    `;

    const style = document.createElement('style');
    style.textContent = keyframes;
    document.head.appendChild(style);
  }

  addGradientOverlay(container) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at 30% 40%, rgba(147, 51, 234, 0.03) 0%, transparent 70%),
                  radial-gradient(circle at 80% 60%, rgba(124, 58, 237, 0.02) 0%, transparent 60%),
                  radial-gradient(circle at 60% 20%, rgba(168, 85, 247, 0.02) 0%, transparent 50%);
      pointer-events: none;
    `;
    container.appendChild(overlay);
  }
}

/**
 * Micro Interactions Manager
 */
export class MicroInteractions {
  init() {
    console.log('⚡ Initializing micro interactions...');

    this.initCardHoverEffects();
    this.initMagneticEffects();
    this.initRippleEffects();

    console.log('⚡ Micro interactions ready');
  }

  initCardHoverEffects() {
    const cards = document.querySelectorAll('.card, .skill-card, .project-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
      });
    });
  }

  initMagneticEffects() {
    const magneticElements = document.querySelectorAll('.magnetic, [data-magnetic]');
    magneticElements.forEach(element => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        element.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      });

      element.addEventListener('mouseleave', () => {
        element.style.transform = 'translate(0, 0)';
      });
    });
  }

  initRippleEffects() {
    const rippleElements = document.querySelectorAll('[data-ripple]');
    rippleElements.forEach(element => {
      element.addEventListener('click', this.createRipple.bind(this));
    });

    // Add ripple keyframes if not exists
    if (!document.querySelector('#ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'ripple-styles';
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    const rect = button.getBoundingClientRect();
    circle.style.cssText = `
      width: ${diameter}px;
      height: ${diameter}px;
      left: ${event.clientX - rect.left - radius}px;
      top: ${event.clientY - rect.top - radius}px;
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      pointer-events: none;
      animation: ripple ${ANIMATION_CONFIG.RIPPLE_DURATION}ms linear;
    `;

    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(circle);

    setTimeout(() => {
      circle.remove();
    }, ANIMATION_CONFIG.RIPPLE_DURATION);
  }
}

/**
 * Parallax Effects Manager
 */
export class ParallaxEffects {
  init() {
    console.log('🌊 Initializing parallax effects...');

    this.setupParallaxElements();
    this.initScrollListener();

    console.log(`🌊 Parallax effects ready`);
  }

  setupParallaxElements() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    if (parallaxElements.length === 0) {
      // Add parallax to hero section elements
      const heroSection = document.querySelector('section');
      if (heroSection) {
        heroSection.setAttribute('data-parallax', '0.1');
      }

      // Add parallax to floating shapes
      const shapesContainer = document.getElementById('floating-shapes-container');
      if (shapesContainer) {
        shapesContainer.setAttribute('data-parallax', '0.05');
      }
    }
  }

  initScrollListener() {
    let ticking = false;

    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('[data-parallax]');

      parallaxElements.forEach(element => {
        const rate = parseFloat(element.getAttribute('data-parallax')) || 0.1;
        const yPos = -(scrolled * rate);
        element.style.transform = `translateY(${yPos}px)`;
      });

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }
}

// Export singleton instances
export const scrollEffects = new ScrollEffects();
export const floatingShapes = new FloatingShapes();
export const microInteractions = new MicroInteractions();
export const parallaxEffects = new ParallaxEffects();

// Legacy functions for backward compatibility
export function initParallaxEffect() {
  parallaxEffects.init();
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
