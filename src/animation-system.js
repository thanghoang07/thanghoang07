/**
 * 🎭 Unified Animation System - FIXED VERSION
 *
 * Fixes:
 * 1. Double IntersectionObserver initialization (was called from both main.js and app.js)
 * 2. ThemeManager DOM access before ready
 * 3. CSS transition override causing slow hover effects
 * 4. initAnimations export name mismatch
 * 5. Memory leaks from untracked observers
 */

const ANIMATION_CONFIG = {
  PARALLAX_SPEED: 0.5,
  TYPING_SPEED: 100,
  CURSOR_DELAY: 1000,
  TYPING_DELAY: 500,
  SCROLL_THRESHOLD: 0.15,
  STAGGER_DELAY: 120,
  RIPPLE_DURATION: 600,
  PROGRESS_DURATION: 1800,
  MAX_FLOATING_SHAPES: 12,
  PERFORMANCE_THRESHOLD: 16,
};

/* ─────────────────────────────────────────────
   Singleton guard — prevents double-init
   ───────────────────────────────────────────── */
let _animationSystemInstance = null;

/* ─────────────────────────────────────────────
   Performance Optimizer
   ───────────────────────────────────────────── */
class PerformanceOptimizer {
  constructor() {
    this.isReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    this.performanceMode = this._detectMode();
  }

  _detectMode() {
    const mem = navigator.deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 4;
    const mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (mobile || mem < 2 || cores < 2) return 'performance';
    if (cores >= 8 && mem >= 8) return 'quality';
    return 'auto';
  }

  shouldOptimize() {
    return this.isReducedMotion || this.performanceMode === 'performance';
  }

  optimizeAnimation(config) {
    if (this.shouldOptimize()) {
      return { ...config, duration: (config.duration || 600) * 0.6, stagger: (config.stagger || 120) * 0.4 };
    }
    return config;
  }
}

/* ─────────────────────────────────────────────
   Scroll Effects  (FIXED: single observer, no duplicate)
   ───────────────────────────────────────────── */
class ScrollEffects {
  constructor(optimizer) {
    this.optimizer = optimizer;
    this.observers = new Map();
    this._initialized = false;
  }

  init() {
    // Guard: only initialise once per page lifecycle
    if (this._initialized) {
      console.warn('⚠️ ScrollEffects already initialised — skipping duplicate call');
      return;
    }
    this._initialized = true;

    console.log('📜 Initialising scroll effects…');
    this._initScrollReveal();
    this._initProgressBars();
    this._initScrollProgress();
    console.log('✅ Scroll effects ready');
  }

  _initScrollReveal() {
    const targets = document.querySelectorAll(
      '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale, [data-animation]'
    );
    console.log(`📜 ${targets.length} scroll-reveal elements found`);
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el = entry.target;
          const staggerAttr = el.dataset.stagger || '';
          const staggerNum = parseInt((staggerAttr.match(/\d+/) || ['0'])[0], 10);
          const delay = this.optimizer.optimizeAnimation({ stagger: staggerNum * ANIMATION_CONFIG.STAGGER_DELAY }).stagger;

          setTimeout(() => {
            el.classList.add('revealed');
          }, delay);

          observer.unobserve(el);
        });
      },
      { threshold: ANIMATION_CONFIG.SCROLL_THRESHOLD, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach((el) => observer.observe(el));
    this.observers.set('scrollReveal', observer);
  }

  _initProgressBars() {
    const bars = document.querySelectorAll('.progress-bar');
    if (!bars.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const bar = entry.target;
          const targetWidth = bar.style.width || bar.dataset.width || '80%';
          const cfg = this.optimizer.optimizeAnimation({ duration: ANIMATION_CONFIG.PROGRESS_DURATION });

          bar.style.width = '0%';
          // Use rAF so the browser registers the 0% before animating
          requestAnimationFrame(() => {
            bar.style.transition = `width ${cfg.duration}ms cubic-bezier(0.4,0,0.2,1)`;
            bar.style.width = targetWidth;
          });

          observer.unobserve(bar);
        });
      },
      { threshold: 0.4 }
    );

    bars.forEach((bar) => observer.observe(bar));
    this.observers.set('progressBars', observer);
  }

  _initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = `${(scrolled / max) * 100}%`;
        ticking = false;
      });
      ticking = true;
    }, { passive: true });
  }

  destroy() {
    this.observers.forEach((o) => o.disconnect());
    this.observers.clear();
    this._initialized = false;
  }
}

/* ─────────────────────────────────────────────
   Floating Shapes
   ───────────────────────────────────────────── */
class FloatingShapes {
  constructor(optimizer) {
    this.optimizer = optimizer;
    this.shapes = [];
    this.animationId = null;
    this._initialized = false;
  }

  init() {
    if (this._initialized) return;
    this._initialized = true;

    const container = document.getElementById('floating-shapes-container');
    if (!container) return;

    this._createShapes(container);
    if (!this.optimizer.shouldOptimize()) this._startAnimation();
  }

  _createShapes(container) {
    const count = this.optimizer.shouldOptimize() ? 6 : ANIMATION_CONFIG.MAX_FLOATING_SHAPES;
    const configs = [
      { w: 96, h: 96, cls: 'bg-purple-100 rounded-[20px] opacity-20' },
      { w: 80, h: 80, cls: 'bg-purple-200 rounded-full opacity-15' },
      { w: 64, h: 64, cls: 'bg-blue-100 rounded-[20px] opacity-10' },
      { w: 56, h: 56, cls: 'bg-yellow-100 rounded-full opacity-25' },
      { w: 80, h: 40, cls: 'bg-pink-200 rounded-[16px] opacity-15' },
      { w: 40, h: 40, cls: 'bg-green-100 rounded-full opacity-20' },
      { w: 48, h: 48, cls: 'bg-blue-200 rounded-[30px] opacity-10' },
      { w: 64, h: 64, cls: 'bg-yellow-200 rounded-full opacity-15' },
      { w: 48, h: 96, cls: 'bg-purple-300 rounded-[40px] opacity-10' },
      { w: 56, h: 56, cls: 'bg-green-300 rounded-[30px] opacity-15' },
      { w: 40, h: 40, cls: 'bg-pink-100 rounded-full opacity-20' },
      { w: 56, h: 56, cls: 'bg-yellow-300 rounded-[20px] opacity-10' },
    ];

    const positions = [
      { top: '2.5rem', left: '2.5rem' },
      { top: '5rem', right: '2.5rem' },
      { bottom: '2.5rem', left: '5rem' },
      { bottom: '5rem', right: '5rem' },
      { top: '33%', left: '33%' },
      { top: '50%', right: '33%' },
      { bottom: '33%', left: '25%' },
      { top: '25%', right: '25%' },
      { bottom: '25%', left: '50%' },
      { top: '16%', right: '16%' },
      { top: '1.25rem', left: '1.25rem' },
      { bottom: '1.25rem', right: '1.25rem' },
    ];

    for (let i = 0; i < Math.min(count, configs.length); i++) {
      const { w, h, cls } = configs[i];
      const el = document.createElement('div');
      el.className = `absolute pointer-events-none ${cls}`;
      el.style.cssText = `width:${w}px;height:${h}px;`;
      Object.entries(positions[i]).forEach(([k, v]) => (el.style[k] = v));
      container.appendChild(el);

      this.shapes.push({
        el,
        amplitude: 8 + Math.random() * 14,
        frequency: 0.4 + Math.random() * 1.2,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  _startAnimation() {
    const tick = (ts) => {
      this.shapes.forEach(({ el, amplitude, frequency, phase }) => {
        const y = Math.sin(ts * 0.001 * frequency + phase) * amplitude;
        const r = Math.sin(ts * 0.0004 + phase) * 4;
        el.style.transform = `translateY(${y}px) rotate(${r}deg)`;
      });
      this.animationId = requestAnimationFrame(tick);
    };
    this.animationId = requestAnimationFrame(tick);
  }

  destroy() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.shapes.forEach(({ el }) => el.remove());
    this.shapes = [];
    this._initialized = false;
  }
}

/* ─────────────────────────────────────────────
   Micro Interactions  (FIXED: no interference with scroll observer)
   ───────────────────────────────────────────── */
class MicroInteractions {
  constructor(optimizer) {
    this.optimizer = optimizer;
    this._initialized = false;
  }

  init() {
    if (this._initialized) return;
    this._initialized = true;

    this._initHover();
    this._initRipple();
    this._initMagnetic();
  }

  _initHover() {
    document.querySelectorAll('.enhanced-hover, .skill-card, .project-card').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        if (this.optimizer.shouldOptimize()) return;
        el.style.transform = 'translateY(-6px) scale(1.02)';
        el.style.boxShadow = '0 20px 40px rgba(0,0,0,0.12)';
        // Use a specific transition here, NOT the global * rule
        el.style.transition = 'transform 0.28s cubic-bezier(0.4,0,0.2,1), box-shadow 0.28s cubic-bezier(0.4,0,0.2,1)';
      }, { passive: true });

      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
        el.style.boxShadow = '';
      }, { passive: true });
    });
  }

  _initRipple() {
    document.querySelectorAll('[data-ripple]').forEach((el) => {
      el.addEventListener('click', (e) => {
        if (this.optimizer.shouldOptimize()) return;
        const rect = el.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.style.cssText = `
          position:absolute;border-radius:50%;
          background:rgba(147,51,234,0.25);
          transform:scale(0);pointer-events:none;
          width:50px;height:50px;
          left:${e.clientX - rect.left - 25}px;
          top:${e.clientY - rect.top - 25}px;
          animation:_ripple ${ANIMATION_CONFIG.RIPPLE_DURATION}ms linear forwards;
        `;
        if (!el.style.position || el.style.position === 'static') el.style.position = 'relative';
        el.style.overflow = 'hidden';
        el.appendChild(ripple);
        setTimeout(() => ripple.remove(), ANIMATION_CONFIG.RIPPLE_DURATION + 50);
      });
    });
  }

  _initMagnetic() {
    document.querySelectorAll('.magnetic, [data-magnetic]').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        if (this.optimizer.shouldOptimize()) return;
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.12;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.12;
        el.style.transform = `scale(1.05) translate(${x}px,${y}px)`;
        el.style.transition = 'transform 0.2s ease';
      }, { passive: true });

      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      }, { passive: true });
    });
  }
}

/* ─────────────────────────────────────────────
   Parallax
   ───────────────────────────────────────────── */
class ParallaxEffects {
  constructor(optimizer) {
    this.optimizer = optimizer;
    this.elements = [];
    this.ticking = false;
    this._initialized = false;
  }

  init() {
    if (this.optimizer.shouldOptimize() || this._initialized) return;
    this._initialized = true;

    document.querySelectorAll('[data-parallax]').forEach((el) => {
      const speed = parseFloat(el.dataset.parallax) || ANIMATION_CONFIG.PARALLAX_SPEED;
      this.elements.push({ el, speed });
    });

    if (!this.elements.length) return;

    window.addEventListener('scroll', () => {
      if (this.ticking) return;
      requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        this.elements.forEach(({ el, speed }) => {
          el.style.transform = `translateY(${-(scrolled * speed)}px)`;
        });
        this.ticking = false;
      });
      this.ticking = true;
    }, { passive: true });
  }

  destroy() {
    this.elements = [];
    this._initialized = false;
  }
}

/* ─────────────────────────────────────────────
   CSS injection  (FIXED: no global * transition override)
   ───────────────────────────────────────────── */
function injectAnimationCSS() {
  if (document.getElementById('_anim-sys-styles')) return;
  const style = document.createElement('style');
  style.id = '_anim-sys-styles';
  style.textContent = `
    @keyframes _ripple { to { transform:scale(4); opacity:0; } }

    /* Scroll reveal base states */
    .scroll-reveal          { opacity:0; transform:translateY(28px); }
    .scroll-reveal-left     { opacity:0; transform:translateX(-40px); }
    .scroll-reveal-right    { opacity:0; transform:translateX(40px); }
    .scroll-reveal-scale    { opacity:0; transform:scale(0.85); }

    /* Revealed state — transition only on these specific classes */
    .scroll-reveal.revealed,
    .scroll-reveal-left.revealed,
    .scroll-reveal-right.revealed,
    .scroll-reveal-scale.revealed {
      opacity:1 !important;
      transform:translateY(0) translateX(0) scale(1) !important;
      transition: opacity 0.55s cubic-bezier(0.4,0,0.2,1),
                  transform 0.55s cubic-bezier(0.4,0,0.2,1);
    }

    /* Stagger delays */
    [data-stagger="stagger-1"].revealed { transition-delay:0.07s; }
    [data-stagger="stagger-2"].revealed { transition-delay:0.14s; }
    [data-stagger="stagger-3"].revealed { transition-delay:0.21s; }
    [data-stagger="stagger-4"].revealed { transition-delay:0.28s; }
    [data-stagger="stagger-5"].revealed { transition-delay:0.35s; }

    /* FIXED: Scope theme-colour transitions to body/html only — not every element */
    html, body {
      transition: background-color 300ms cubic-bezier(0.4,0,0.2,1),
                  color 300ms cubic-bezier(0.4,0,0.2,1);
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  `;
  document.head.appendChild(style);
}

/* ─────────────────────────────────────────────
   Main AnimationSystem  (singleton)
   ───────────────────────────────────────────── */
class AnimationSystem {
  constructor() {
    this.optimizer = new PerformanceOptimizer();
    this.scrollEffects = new ScrollEffects(this.optimizer);
    this.floatingShapes = new FloatingShapes(this.optimizer);
    this.microInteractions = new MicroInteractions(this.optimizer);
    this.parallaxEffects = new ParallaxEffects(this.optimizer);
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) {
      console.warn('⚠️ AnimationSystem already initialised — skipping');
      return this;
    }

    console.log('🎭 Initialising unified animation system…');
    injectAnimationCSS();

    this.scrollEffects.init();
    this.floatingShapes.init();
    this.microInteractions.init();
    this.parallaxEffects.init();

    this.isInitialized = true;
    console.log('✅ Animation system ready');
    return this;
  }

  destroy() {
    this.scrollEffects.destroy();
    this.floatingShapes.destroy();
    this.parallaxEffects.destroy();
    this.isInitialized = false;
    _animationSystemInstance = null;
  }

  getStatus() {
    return {
      initialized: this.isInitialized,
      performanceMode: this.optimizer.performanceMode,
      reducedMotion: this.optimizer.isReducedMotion,
    };
  }
}

/* ─────────────────────────────────────────────
   Exports
   ───────────────────────────────────────────── */

/** Returns the singleton AnimationSystem (creates on first call) */
export function getAnimationSystem() {
  if (!_animationSystemInstance) {
    _animationSystemInstance = new AnimationSystem();
  }
  return _animationSystemInstance;
}

/**
 * FIXED export name — was 'initEnhancedAnimations' in animations.js
 * app-manager.js tried to import 'initAnimations' which didn't exist.
 * Both names are now exported here for compatibility.
 */
export function initAnimations() {
  return getAnimationSystem().init();
}

export const initEnhancedAnimations = initAnimations;

// Named sub-system exports (used in app.js / main.js)
export const scrollEffects = {
  init: () => getAnimationSystem().scrollEffects.init(),
};
export const floatingShapes = {
  init: () => getAnimationSystem().floatingShapes.init(),
};
export const microInteractions = {
  init: () => getAnimationSystem().microInteractions.init(),
};
export const parallaxEffects = {
  init: () => getAnimationSystem().parallaxEffects.init(),
};

export const animationSystem = getAnimationSystem();
export default animationSystem;

console.log('🎭 animation-system.js loaded (fixed version)');