/**
 * 🎭 Unified Animation System
 * Consolidated animation module with performance optimization
 */

/**
 * Animation Configuration
 */
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
  PROGRESS_DURATION: 2000,
  MAX_FLOATING_SHAPES: 15,
  PERFORMANCE_THRESHOLD: 16 // 60fps target
};

/**
 * Performance Optimizer
 */
class PerformanceOptimizer {
  constructor() {
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.performanceMode = this.detectPerformanceMode();
    this.activeAnimations = new Set();
    this.frameTime = 0;
    this.lastFrameTime = 0;
  }

  detectPerformanceMode() {
    const capabilities = {
      hardwareConcurrency: navigator.hardwareConcurrency || 2,
      deviceMemory: navigator.deviceMemory || 2,
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    };

    if (capabilities.isMobile || capabilities.deviceMemory < 4) {
      return 'performance';
    } else if (capabilities.hardwareConcurrency >= 8 && capabilities.deviceMemory >= 8) {
      return 'quality';
    }
    return 'auto';
  }

  shouldOptimize() {
    return this.isReducedMotion || this.performanceMode === 'performance' || this.frameTime > ANIMATION_CONFIG.PERFORMANCE_THRESHOLD;
  }

  optimizeAnimation(config) {
    if (this.shouldOptimize()) {
      return {
        ...config,
        duration: config.duration * 0.7,
        stagger: config.stagger * 0.5,
        complexity: 'reduced'
      };
    }
    return config;
  }
}

/**
 * Scroll Effects Manager
 */
class ScrollEffects {
  constructor(optimizer) {
    this.optimizer = optimizer;
    this.observers = new Map();
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
          const animation = element.dataset.animation || 'fade-in-up';
          const stagger = element.dataset.stagger || '';
          
          let delay = 0;
          if (stagger.includes('stagger-')) {
            const staggerNum = parseInt(stagger.split('-')[1]) || 1;
            delay = staggerNum * ANIMATION_CONFIG.STAGGER_DELAY;
          }

          // Apply performance optimization
          const config = this.optimizer.optimizeAnimation({ delay, animation });
          
          setTimeout(() => {
            element.classList.add('revealed');
            element.style.animationName = config.animation;
            element.style.animationDuration = '0.6s';
            element.style.animationFillMode = 'forwards';
            element.style.animationTimingFunction = 'ease-out';
          }, config.delay);

          observer.unobserve(element);
        }
      });
    }, this.observerOptions);

    revealElements.forEach(el => observer.observe(el));
    this.observers.set('scrollReveal', observer);
  }

  initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const progressBar = entry.target.querySelector('.progress-bar') || entry.target;
          if (progressBar && progressBar.style.width) {
            const targetWidth = progressBar.style.width;
            const config = this.optimizer.optimizeAnimation({ duration: ANIMATION_CONFIG.PROGRESS_DURATION });
            
            progressBar.style.width = '0%';
            progressBar.style.transition = `width ${config.duration}ms ease-out`;
            
            setTimeout(() => {
              progressBar.style.width = targetWidth;
            }, 100);
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => {
      observer.observe(bar.parentElement || bar);
    });
  }

  initScrollProgress() {
    let ticking = false;
    
    const updateScrollProgress = () => {
      const scrolled = window.pageYOffset;
      const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrolled / maxHeight) * 100;
      
      const progressBar = document.querySelector('.scroll-progress');
      if (progressBar) {
        progressBar.style.width = `${progress}%`;
      }
      
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    });
  }

  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

/**
 * Floating Shapes Manager
 */
class FloatingShapes {
  constructor(optimizer) {
    this.optimizer = optimizer;
    this.shapes = [];
    this.animationId = null;
  }

  init() {
    console.log('🎈 Initializing floating shapes...');
    
    const container = document.getElementById('floating-shapes-container');
    if (!container) {
      console.warn('⚠️ Floating shapes container not found');
      return;
    }

    this.createShapes(container);
    this.startAnimation();
    
    console.log('✅ Floating shapes ready');
  }

  createShapes(container) {
    const shapeCount = this.optimizer.shouldOptimize() ? 8 : ANIMATION_CONFIG.MAX_FLOATING_SHAPES;
    
    const shapesData = [
      { w: 96, h: 96, color: 'bg-purple-100', rounded: 'rounded-[20px]', opacity: 'opacity-20' },
      { w: 80, h: 80, color: 'bg-purple-200', rounded: 'rounded-full', opacity: 'opacity-15' },
      { w: 64, h: 64, color: 'bg-blue-100', rounded: 'rounded-[20px]', opacity: 'opacity-10' },
      { w: 56, h: 56, color: 'bg-yellow-100', rounded: 'rounded-full', opacity: 'opacity-25' },
      { w: 80, h: 40, color: 'bg-pink-200', rounded: 'rounded-[16px]', opacity: 'opacity-15' },
      { w: 40, h: 40, color: 'bg-green-100', rounded: 'rounded-full', opacity: 'opacity-20' },
      { w: 48, h: 48, color: 'bg-blue-200', rounded: 'rounded-[30px]', opacity: 'opacity-10' },
      { w: 64, h: 64, color: 'bg-yellow-200', rounded: 'rounded-full', opacity: 'opacity-15' },
      { w: 48, h: 96, color: 'bg-purple-300', rounded: 'rounded-[40px]', opacity: 'opacity-10' },
      { w: 56, h: 56, color: 'bg-green-300', rounded: 'rounded-[30px]', opacity: 'opacity-15' },
      { w: 40, h: 40, color: 'bg-pink-100', rounded: 'rounded-full', opacity: 'opacity-20' },
      { w: 56, h: 56, color: 'bg-yellow-300', rounded: 'rounded-[20px]', opacity: 'opacity-10' },
      { w: 64, h: 48, color: 'bg-green-200', rounded: 'rounded-[16px]', opacity: 'opacity-15' },
      { w: 48, h: 64, color: 'bg-blue-300', rounded: 'rounded-[30px]', opacity: 'opacity-10' },
      { w: 80, h: 80, color: 'bg-purple-400', rounded: 'rounded-full', opacity: 'opacity-10' }
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
      { top: '16.6667%', right: '16.6667%' },
      { top: '1.25rem', left: '1.25rem' },
      { bottom: '1.25rem', right: '1.25rem' },
      { top: '20%', left: '16.6667%' },
      { bottom: '16.6667%', right: '20%' },
      { top: '12.5%', left: '12.5%' }
    ];

    for (let i = 0; i < Math.min(shapeCount, shapesData.length); i++) {
      const shapeData = shapesData[i];
      const position = positions[i];
      
      const shape = document.createElement('div');
      shape.className = `absolute pointer-events-none transition-all duration-1000 ${shapeData.color} ${shapeData.rounded} ${shapeData.opacity}`;
      shape.style.width = `${shapeData.w}px`;
      shape.style.height = `${shapeData.h}px`;
      
      // Apply position
      Object.entries(position).forEach(([key, value]) => {
        shape.style[key] = value;
      });

      container.appendChild(shape);
      this.shapes.push({
        element: shape,
        baseY: 0,
        amplitude: 10 + Math.random() * 20,
        frequency: 0.5 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  startAnimation() {
    if (this.optimizer.shouldOptimize()) {
      // Static shapes for performance mode
      return;
    }

    const animate = (timestamp) => {
      this.shapes.forEach((shape, index) => {
        const y = Math.sin(timestamp * 0.001 * shape.frequency + shape.phase) * shape.amplitude;
        const rotation = Math.sin(timestamp * 0.0005 + shape.phase) * 5;
        
        shape.element.style.transform = `translateY(${y}px) rotate(${rotation}deg)`;
      });

      this.animationId = requestAnimationFrame(animate);
    };

    this.animationId = requestAnimationFrame(animate);
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.shapes.forEach(shape => shape.element.remove());
    this.shapes = [];
  }
}

/**
 * Micro Interactions Manager
 */
class MicroInteractions {
  constructor(optimizer) {
    this.optimizer = optimizer;
  }

  init() {
    console.log('⚡ Initializing micro interactions...');
    
    this.initHoverEffects();
    this.initRippleEffects();
    this.initMagneticEffects();
    
    console.log('✅ Micro interactions ready');
  }

  initHoverEffects() {
    const hoverElements = document.querySelectorAll('.enhanced-hover, .skill-card, .project-card');
    
    hoverElements.forEach(element => {
      element.addEventListener('mouseenter', (e) => {
        if (this.optimizer.shouldOptimize()) return;
        
        e.target.style.transform = 'translateY(-5px) scale(1.02)';
        e.target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
        e.target.style.transition = 'all 0.3s ease';
      });

      element.addEventListener('mouseleave', (e) => {
        e.target.style.transform = 'translateY(0) scale(1)';
        e.target.style.boxShadow = '';
      });
    });
  }

  initRippleEffects() {
    const rippleElements = document.querySelectorAll('[data-ripple]');
    
    rippleElements.forEach(element => {
      element.addEventListener('click', (e) => {
        if (this.optimizer.shouldOptimize()) return;
        
        const ripple = document.createElement('div');
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ripple.style.cssText = `
          position: absolute;
          border-radius: 50%;
          background: rgba(147, 51, 234, 0.3);
          transform: scale(0);
          animation: ripple ${ANIMATION_CONFIG.RIPPLE_DURATION}ms linear;
          left: ${x - 25}px;
          top: ${y - 25}px;
          width: 50px;
          height: 50px;
          pointer-events: none;
        `;

        if (!element.style.position || element.style.position === 'static') {
          element.style.position = 'relative';
        }
        element.style.overflow = 'hidden';

        element.appendChild(ripple);

        setTimeout(() => ripple.remove(), ANIMATION_CONFIG.RIPPLE_DURATION);
      });
    });
  }

  initMagneticEffects() {
    const magneticElements = document.querySelectorAll('.magnetic, [data-magnetic]');
    
    magneticElements.forEach(element => {
      element.addEventListener('mouseenter', (e) => {
        if (this.optimizer.shouldOptimize()) return;
        
        e.target.style.transform = 'scale(1.05)';
        e.target.style.transition = 'transform 0.3s ease';
      });

      element.addEventListener('mouseleave', (e) => {
        e.target.style.transform = 'scale(1)';
      });

      element.addEventListener('mousemove', (e) => {
        if (this.optimizer.shouldOptimize()) return;
        
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        e.target.style.transform = `scale(1.05) translate(${x * 0.1}px, ${y * 0.1}px)`;
      });
    });
  }
}

/**
 * Parallax Effects Manager
 */
class ParallaxEffects {
  constructor(optimizer) {
    this.optimizer = optimizer;
    this.elements = [];
    this.ticking = false;
  }

  init() {
    if (this.optimizer.shouldOptimize()) {
      console.log('⚠️ Parallax effects disabled for performance');
      return;
    }

    console.log('🌊 Initializing parallax effects...');
    
    this.findParallaxElements();
    this.bindScrollEvents();
    
    console.log('✅ Parallax effects ready');
  }

  findParallaxElements() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    parallaxElements.forEach(element => {
      const speed = parseFloat(element.dataset.parallax) || ANIMATION_CONFIG.PARALLAX_SPEED;
      this.elements.push({ element, speed });
    });
  }

  bindScrollEvents() {
    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      
      this.elements.forEach(({ element, speed }) => {
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
      
      this.ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!this.ticking) {
        requestAnimationFrame(updateParallax);
        this.ticking = true;
      }
    });
  }

  destroy() {
    this.elements = [];
  }
}

/**
 * Main Animation System
 */
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
    console.log('🎭 Initializing unified animation system...');
    
    try {
      // Add required CSS animations
      this.injectCSS();
      
      // Initialize all animation modules
      this.scrollEffects.init();
      this.floatingShapes.init();
      this.microInteractions.init();
      this.parallaxEffects.init();
      
      this.isInitialized = true;
      console.log('✅ Animation system ready');
      
    } catch (error) {
      console.error('❌ Animation system initialization error:', error);
    }
  }

  injectCSS() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0% { transform: translateY(0px) rotate(0deg); }
        100% { transform: translateY(-20px) rotate(5deg); }
      }

      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }

      @keyframes fade-in-up {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes fade-in-left {
        from {
          opacity: 0;
          transform: translateX(-30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes fade-in-right {
        from {
          opacity: 0;
          transform: translateX(30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes fade-in-scale {
        from {
          opacity: 0;
          transform: scale(0.8);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      .scroll-reveal {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease-out;
      }

      .scroll-reveal.revealed {
        opacity: 1;
        transform: translateY(0);
      }

      .enhanced-hover {
        transition: all 0.3s ease;
      }

      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    `;
    
    document.head.appendChild(style);
  }

  destroy() {
    this.scrollEffects.destroy();
    this.floatingShapes.destroy();
    this.parallaxEffects.destroy();
    this.isInitialized = false;
  }

  getStatus() {
    return {
      initialized: this.isInitialized,
      performanceMode: this.optimizer.performanceMode,
      reducedMotion: this.optimizer.isReducedMotion,
      activeAnimations: this.optimizer.activeAnimations.size
    };
  }
}

// Create singleton instance
const animationSystem = new AnimationSystem();

// Export individual components for compatibility
export const scrollEffects = {
  init: () => animationSystem.scrollEffects.init()
};

export const floatingShapes = {
  init: () => animationSystem.floatingShapes.init()
};

export const microInteractions = {
  init: () => animationSystem.microInteractions.init()
};

export const parallaxEffects = {
  init: () => animationSystem.parallaxEffects.init()
};

// Export main system
export { animationSystem };
export default animationSystem;

console.log('🎭 Animation system module loaded');