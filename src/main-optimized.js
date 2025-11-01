/**
 * 🚀 Optimized Main Entry Point
 * Ensures all animations and features work properly
 */

import './style.css';

console.log('🎯 Optimized main.js loaded!');

/**
 * Optimized Application Class
 */
class OptimizedApplication {
  constructor() {
    this.isInitialized = false;
    this.loadingStartTime = Date.now();
    this.features = new Map();
  }

  /**
   * Initialize the application
   */
  async init() {
    console.log('🚀 Starting optimized initialization...');

    try {
      // Step 1: Wait for DOM
      await this.waitForDOM();
      
      // Step 2: Initialize core animations first (critical for UX)
      this.initializeCoreAnimations();
      
      // Step 3: Load and initialize modules
      await this.loadModules();
      
      // Step 4: Initialize remaining features
      this.initializeFeatures();
      
      // Step 5: Finish loading
      this.finishLoading();
      
    } catch (error) {
      console.error('❌ Initialization error:', error);
      this.finishLoading();
    }
  }

  /**
   * Wait for DOM to be ready
   */
  waitForDOM() {
    return new Promise((resolve) => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', resolve);
      } else {
        resolve();
      }
    });
  }

  /**
   * Initialize core animations immediately (no module dependencies)
   */
  initializeCoreAnimations() {
    console.log('🎨 Initializing core animations...');

    // Initialize scroll reveal animations
    this.initScrollReveal();
    
    // Initialize hover effects
    this.initHoverEffects();
    
    // Initialize progress bars
    this.initProgressBars();
    
    // Initialize basic image loading
    this.initImageLoading();
    
    console.log('✅ Core animations ready');
  }

  /**
   * Simple scroll reveal implementation
   */
  initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale');
    console.log(`📜 Found ${revealElements.length} scroll reveal elements`);

    if (revealElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          element.classList.add('revealed');
          
          // Add staggered animation delay if specified
          const staggerClass = element.className.match(/stagger-(\d+)/);
          if (staggerClass) {
            const delay = parseInt(staggerClass[1]) * 100;
            setTimeout(() => {
              element.style.animationDelay = `${delay}ms`;
            }, delay);
          }
          
          observer.unobserve(element);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
    this.features.set('scrollReveal', true);
  }

  /**
   * Initialize hover effects
   */
  initHoverEffects() {
    const hoverElements = document.querySelectorAll('.enhanced-hover, .magnetic, .card');
    console.log(`✨ Found ${hoverElements.length} hover elements`);

    hoverElements.forEach(element => {
      // Add magnetic effect for magnetic elements
      if (element.classList.contains('magnetic')) {
        element.addEventListener('mousemove', (e) => {
          const rect = element.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          
          element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        
        element.addEventListener('mouseleave', () => {
          element.style.transform = 'translate(0px, 0px)';
        });
      }

      // Add ripple effect for elements with data-ripple
      if (element.hasAttribute('data-ripple')) {
        element.addEventListener('click', (e) => {
          this.createRipple(e, element);
        });
      }
    });

    this.features.set('hoverEffects', true);
  }

  /**
   * Create ripple effect
   */
  createRipple(event, element) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.4);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 600ms linear;
      pointer-events: none;
    `;

    // Add keyframes if not exists
    if (!document.querySelector('#ripple-keyframes')) {
      const style = document.createElement('style');
      style.id = 'ripple-keyframes';
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(2);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    const container = element.style.position === 'relative' ? element : element.parentElement;
    if (container.style.position !== 'relative') {
      container.style.position = 'relative';
    }
    
    container.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }

  /**
   * Initialize progress bars
   */
  initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    console.log(`📊 Found ${progressBars.length} progress bars`);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const progressBar = entry.target;
          const fill = progressBar.querySelector('.progress-fill, [style*="width"]');
          
          if (fill) {
            // Animate progress bar
            setTimeout(() => {
              fill.style.transition = 'width 2s ease-out';
              // Use existing width or set to 100%
              if (!fill.style.width || fill.style.width === '0%') {
                fill.style.width = '85%';
              }
            }, 200);
          }
          
          observer.unobserve(progressBar);
        }
      });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => observer.observe(bar));
    this.features.set('progressBars', true);
  }

  /**
   * Initialize image loading (fallback if lazy loading fails)
   */
  initImageLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    console.log(`📸 Found ${lazyImages.length} lazy images`);

    if (lazyImages.length === 0) {
      this.features.set('imageLoading', true);
      return;
    }

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute('data-src');
          
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            img.onload = () => {
              img.style.opacity = '1';
            };
          }
          
          imageObserver.unobserve(img);
        }
      });
    }, { rootMargin: '50px' });

    lazyImages.forEach(img => imageObserver.observe(img));
    this.features.set('imageLoading', true);
  }

  /**
   * Load modules with error handling
   */
  async loadModules() {
    console.log('📦 Loading optional modules...');

    const modules = [
      { name: 'colors', path: './colors.js' },
      { name: 'theme', path: './theme.js' },
      { name: 'translations', path: './translations.js' },
      { name: 'animations', path: './animation-effects.js' },
      { name: 'contact', path: './contact-form.js' }
    ];

    for (const moduleInfo of modules) {
      try {
        const module = await import(moduleInfo.path);
        this.features.set(moduleInfo.name, module);
        console.log(`✅ ${moduleInfo.name} module loaded`);
      } catch (error) {
        console.warn(`⚠️ ${moduleInfo.name} module failed to load:`, error.message);
        this.features.set(moduleInfo.name, false);
      }
    }
  }

  /**
   * Initialize features from loaded modules
   */
  initializeFeatures() {
    console.log('🔧 Initializing module features...');

    // Initialize theme
    const themeModule = this.features.get('theme');
    if (themeModule && themeModule.themeManager) {
      try {
        themeModule.themeManager.init();
        console.log('✅ Theme manager initialized');
      } catch (error) {
        console.warn('⚠️ Theme initialization failed:', error);
      }
    }

    // Initialize translations
    const translationModule = this.features.get('translations');
    if (translationModule && translationModule.languageManager) {
      try {
        translationModule.languageManager.init();
        console.log('✅ Language manager initialized');
      } catch (error) {
        console.warn('⚠️ Translation initialization failed:', error);
      }
    }

    // Initialize animations (additional ones)
    const animationModule = this.features.get('animations');
    if (animationModule) {
      try {
        if (animationModule.floatingShapes) {
          animationModule.floatingShapes.init();
          console.log('✅ Floating shapes initialized');
        }
        if (animationModule.parallaxEffects) {
          animationModule.parallaxEffects.init();
          console.log('✅ Parallax effects initialized');
        }
      } catch (error) {
        console.warn('⚠️ Advanced animation initialization failed:', error);
      }
    }

    // Initialize contact form
    const contactModule = this.features.get('contact');
    if (contactModule) {
      try {
        if (contactModule.contactFormManager) {
          contactModule.contactFormManager.init();
          console.log('✅ Contact form initialized');
        }
        if (contactModule.initWorkExperienceTabs) {
          contactModule.initWorkExperienceTabs();
          console.log('✅ Work experience tabs initialized');
        }
      } catch (error) {
        console.warn('⚠️ Contact form initialization failed:', error);
      }
    }

    console.log('✅ Feature initialization complete');
  }

  /**
   * Finish loading
   */
  finishLoading() {
    const loadingTime = Date.now() - this.loadingStartTime;
    console.log(`🎯 Loading completed in ${loadingTime}ms`);

    const minLoadingTime = 500;
    const remainingTime = Math.max(0, minLoadingTime - loadingTime);

    setTimeout(() => {
      const loader = document.getElementById('page-loader');
      const mainContent = document.getElementById('main-content');

      if (loader) {
        loader.classList.add('fade-out');
        setTimeout(() => {
          loader.style.display = 'none';
        }, 500);
      }

      if (mainContent) {
        mainContent.classList.add('fade-in');
      }

      document.body.classList.add('loaded');
      this.isInitialized = true;

      // Log final status
      const workingFeatures = Array.from(this.features.entries()).filter(([name, status]) => status).length;
      const totalFeatures = this.features.size;
      
      console.log(`🎉 Application ready! ${workingFeatures}/${totalFeatures} features loaded`);
      
      if (workingFeatures < totalFeatures) {
        console.log('💡 Some advanced features may not be available, but core functionality works');
      }
      
    }, remainingTime);
  }

  /**
   * Get application status
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      loadingTime: Date.now() - this.loadingStartTime,
      features: Object.fromEntries(this.features)
    };
  }
}

// Initialize application
const app = new OptimizedApplication();
app.init();

// Backup timeout
setTimeout(() => {
  if (!app.isInitialized) {
    console.warn('⚠️ Backup timeout triggered');
    app.finishLoading();
  }
}, 4000);

// Export for debugging
window.optimizedApp = app;

console.log('🎉 Optimized main script ready!');