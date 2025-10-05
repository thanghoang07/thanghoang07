/**
 * Advanced Animation Performance Optimizer
 */

import { ANIMATION_CONFIG } from './utils.js';

class AnimationOptimizer {
  constructor() {
    this.activeAnimations = new Set();
    this.observers = new Map();
    this.isReducedMotion = false;
    this.performanceMode = 'auto'; // 'auto', 'performance', 'quality'
    
    this.init();
  }

  init() {
    this.checkReducedMotionPreference();
    this.detectPerformanceCapabilities();
    this.setupPerformanceMonitoring();
    this.optimizeExistingAnimations();
  }

  checkReducedMotionPreference() {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.isReducedMotion = mediaQuery.matches;

    mediaQuery.addEventListener('change', (e) => {
      this.isReducedMotion = e.matches;
      this.updateAnimationSettings();
    });
  }

  detectPerformanceCapabilities() {
    // Detect device capabilities
    const deviceCapabilities = {
      hardwareConcurrency: navigator.hardwareConcurrency || 2,
      deviceMemory: navigator.deviceMemory || 2,
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    };

    // Auto-adjust performance mode based on capabilities
    if (deviceCapabilities.isMobile || deviceCapabilities.deviceMemory < 4) {
      this.performanceMode = 'performance';
    } else if (deviceCapabilities.hardwareConcurrency >= 8 && deviceCapabilities.deviceMemory >= 8) {
      this.performanceMode = 'quality';
    }

    if (this.debug) {
      console.log('Device capabilities:', deviceCapabilities);
      console.log('Performance mode:', this.performanceMode);
    }
  }

  setupPerformanceMonitoring() {
    let frameCount = 0;
    let lastTime = performance.now();

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        // Adjust performance mode based on FPS
        if (fps < 30 && this.performanceMode !== 'performance') {
          console.warn('Low FPS detected, switching to performance mode');
          this.performanceMode = 'performance';
          this.updateAnimationSettings();
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      if (this.activeAnimations.size > 0) {
        requestAnimationFrame(measureFPS);
      }
    };

    // Start monitoring when animations are active
    this.startFPSMonitoring = () => {
      if (frameCount === 0) {
        requestAnimationFrame(measureFPS);
      }
    };
  }

  optimizeExistingAnimations() {
    // Optimize CSS animations and transitions
    this.optimizeCSSAnimations();
    
    // Setup optimized scroll animations
    this.optimizeScrollAnimations();
    
    // Setup optimized hover effects
    this.optimizeHoverEffects();
    
    // Setup intersection observer for reveal animations
    this.setupOptimizedRevealAnimations();
  }

  optimizeCSSAnimations() {
    const animatedElements = document.querySelectorAll(`
      .card,
      .scroll-reveal,
      .scroll-reveal-left,
      .scroll-reveal-right,
      .scroll-reveal-scale,
      .project-card,
      .skill-card
    `);

    animatedElements.forEach(element => {
      // Add will-change for GPU acceleration
      if (!this.isReducedMotion) {
        element.style.willChange = 'transform, opacity';
      }

      // Use transform3d for hardware acceleration
      element.style.transform = element.style.transform.replace('translate(', 'translate3d(').replace(')', ', 0)');
      
      // Add backface-visibility for better performance
      element.style.backfaceVisibility = 'hidden';
      element.style.perspective = '1000px';
    });
  }

  optimizeScrollAnimations() {
    let ticking = false;
    let lastScrollY = 0;

    const optimizedScrollHandler = () => {
      const scrollY = window.scrollY;
      const scrollDelta = Math.abs(scrollY - lastScrollY);
      
      // Skip small scroll changes for better performance
      if (scrollDelta < 2) {
        ticking = false;
        return;
      }

      // Update parallax elements
      document.querySelectorAll('.parallax').forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const transform = `translate3d(0, ${-scrollY * speed}px, 0)`;
        element.style.transform = transform;
      });

      lastScrollY = scrollY;
      ticking = false;
    };

    const requestScrollUpdate = () => {
      if (!ticking) {
        requestAnimationFrame(optimizedScrollHandler);
        ticking = true;
        this.activeAnimations.add('scroll');
        this.startFPSMonitoring();
      }
    };

    window.addEventListener('scroll', requestScrollUpdate, { 
      passive: true,
      capture: false
    });

    // Clean up when scrolling stops
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.activeAnimations.delete('scroll');
      }, 100);
    }, { passive: true });
  }

  optimizeHoverEffects() {
    const hoverElements = document.querySelectorAll(`
      .card,
      .project-card,
      .skill-card,
      .cert-card,
      .contact-card,
      .btn,
      .social-links a
    `);

    hoverElements.forEach(element => {
      let isAnimating = false;

      const optimizedMouseEnter = () => {
        if (this.isReducedMotion || isAnimating) return;
        
        isAnimating = true;
        element.style.willChange = 'transform, box-shadow, filter';
        
        // Use requestAnimationFrame for smooth animations
        requestAnimationFrame(() => {
          element.classList.add('hovering');
          
          setTimeout(() => {
            isAnimating = false;
          }, 300);
        });
      };

      const optimizedMouseLeave = () => {
        if (this.isReducedMotion) return;
        
        element.classList.remove('hovering');
        
        // Remove will-change after animation
        setTimeout(() => {
          element.style.willChange = 'auto';
        }, 300);
      };

      element.addEventListener('mouseenter', optimizedMouseEnter, { passive: true });
      element.addEventListener('mouseleave', optimizedMouseLeave, { passive: true });
    });
  }

  setupOptimizedRevealAnimations() {
    const revealElements = document.querySelectorAll(`
      .scroll-reveal,
      .scroll-reveal-left,
      .scroll-reveal-right,
      .scroll-reveal-scale
    `);

    if (!revealElements.length) return;

    // Use single observer for all reveal animations
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateReveal(entry.target);
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: this.performanceMode === 'performance' ? 0.1 : 0.3,
        rootMargin: this.performanceMode === 'performance' ? '50px' : '100px'
      }
    );

    revealElements.forEach(element => {
      if (!this.isReducedMotion) {
        revealObserver.observe(element);
      } else {
        // Show immediately if reduced motion is preferred
        element.classList.add('revealed');
      }
    });

    this.observers.set('reveal', revealObserver);
  }

  animateReveal(element) {
    if (this.isReducedMotion) {
      element.classList.add('revealed');
      return;
    }

    // Add staggered animation delay based on performance mode
    const staggerDelay = this.performanceMode === 'performance' ? 50 : 100;
    const staggerIndex = Array.from(element.parentNode.children).indexOf(element);
    
    setTimeout(() => {
      element.style.willChange = 'transform, opacity';
      element.classList.add('revealed');
      
      // Clean up will-change after animation
      setTimeout(() => {
        element.style.willChange = 'auto';
      }, 600);
    }, staggerIndex * staggerDelay);
  }

  updateAnimationSettings() {
    const root = document.documentElement;
    
    if (this.isReducedMotion) {
      root.style.setProperty('--animation-duration', '0.01ms');
      root.style.setProperty('--transition-duration', '0.01ms');
    } else {
      const duration = this.performanceMode === 'performance' ? '200ms' : '300ms';
      root.style.setProperty('--animation-duration', duration);
      root.style.setProperty('--transition-duration', duration);
    }
  }

  // Public methods
  pauseAllAnimations() {
    document.body.style.animationPlayState = 'paused';
    document.body.style.transitionDuration = '0ms';
  }

  resumeAllAnimations() {
    document.body.style.animationPlayState = 'running';
    document.body.style.transitionDuration = '';
  }

  setPerformanceMode(mode) {
    this.performanceMode = mode;
    this.updateAnimationSettings();
  }

  getPerformanceMetrics() {
    return {
      activeAnimations: this.activeAnimations.size,
      performanceMode: this.performanceMode,
      isReducedMotion: this.isReducedMotion,
      observers: this.observers.size
    };
  }

  cleanup() {
    // Clean up all observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.activeAnimations.clear();
  }
}

// Enhanced animation utilities with performance optimizations
export function addOptimizedTypingEffect() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Skip typing animation for reduced motion preference
    const heroName = document.getElementById('hero-name');
    if (heroName) {
      heroName.style.opacity = '1';
    }
    return;
  }

  const heroName = document.getElementById('hero-name');
  if (!heroName) return;

  const text = heroName.textContent;
  heroName.textContent = '';
  heroName.style.borderRight = '2px solid #9333ea';
  heroName.style.willChange = 'contents';

  let i = 0;
  let animationFrame;

  function typeWriter() {
    if (i < text.length) {
      heroName.textContent += text.charAt(i);
      i++;
      animationFrame = setTimeout(typeWriter, ANIMATION_CONFIG.TYPING_SPEED);
    } else {
      setTimeout(() => {
        heroName.style.borderRight = 'none';
        heroName.style.willChange = 'auto';
      }, ANIMATION_CONFIG.CURSOR_DELAY);
    }
  }

  // Use setTimeout instead of setInterval for better performance
  setTimeout(typeWriter, ANIMATION_CONFIG.TYPING_DELAY);

  // Cleanup function
  return () => {
    if (animationFrame) {
      clearTimeout(animationFrame);
    }
  };
}

export function addOptimizedCounterEffect() {
  const counters = document.querySelectorAll('[data-counter]');
  
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Show final values immediately for reduced motion
    counters.forEach(counter => {
      counter.textContent = counter.dataset.counter;
    });
    return;
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateOptimizedCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(counter => {
    counterObserver.observe(counter);
  });

  return counterObserver;
}

function animateOptimizedCounter(counter) {
  const target = parseInt(counter.dataset.counter);
  const duration = ANIMATION_CONFIG.COUNTER_DURATION || 2000;
  const startTime = performance.now();
  
  counter.style.willChange = 'contents';

  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Use easing function for smoother animation
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(target * easeOutQuart);
    
    counter.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      counter.textContent = target;
      counter.style.willChange = 'auto';
    }
  }

  requestAnimationFrame(updateCounter);
}

// Initialize animation optimizer
let animationOptimizer;

export function initAnimationOptimizer() {
  if (!animationOptimizer) {
    animationOptimizer = new AnimationOptimizer();
  }
  return animationOptimizer;
}

export function getAnimationOptimizer() {
  return animationOptimizer;
}