/**
 * 🚀 Unified Main Entry Point
 * Compatible with both development and GitHub Pages deployment
 */

import './style.css';

console.log('🎯 Unified main.js loaded!');

/**
 * Unified Application Class
 * Handles both local development and GitHub Pages deployment
 */
class UnifiedApplication {
  constructor() {
    this.isInitialized = false;
    this.loadingStartTime = Date.now();
    this.features = new Map();
    this.isGitHubPages = window.location.hostname === 'thanghoang07.github.io';
    this.basePath = this.isGitHubPages ? '/thanghoang07/' : '/';
    this.loadedModules = new Set();
  }

  /**
   * Initialize the application
   */
  async init() {
    console.log(`🚀 Starting ${this.isGitHubPages ? 'GitHub Pages' : 'development'} initialization...`);

    try {
      // Step 1: Wait for DOM
      await this.waitForDOM();
      
      // Step 2: Try to load external modules (development mode)
      if (!this.isGitHubPages) {
        await this.loadExternalModules();
      }
      
      // Step 3: Initialize core features (always available)
      this.initializeCoreAnimations();
      this.initializeTheme();
      this.initializeLanguage();
      
      // Step 4: Initialize loaded features
      this.initializeLoadedFeatures();
      
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
        console.log('⏳ Waiting for DOM...');
        document.addEventListener('DOMContentLoaded', () => {
          console.log('✅ DOM ready!');
          resolve();
        });
      } else {
        console.log('✅ DOM already ready!');
        resolve();
      }
    });
  }

  /**
   * Load external modules (development mode only)
   */
  async loadExternalModules() {
    console.log('📦 Loading external modules...');

    const modules = [
      { name: 'colorSystem', path: './color-system.js', exports: ['colorSystem', 'colorDemo'] },
      { name: 'theme', path: './theme.js', exports: ['themeManager'] },
      { name: 'translations', path: './translations.js', exports: ['languageManager'] },
      { name: 'animation', path: './animation-system.js', exports: ['scrollEffects', 'floatingShapes', 'microInteractions', 'parallaxEffects'] },
      { name: 'contact', path: './contact-form.js', exports: ['contactFormManager', 'initWorkExperienceTabs'] },
      { name: 'utilities', path: './utilities.js', exports: ['DOMUtils', 'PerformanceUtils'] }
    ];

    for (const moduleInfo of modules) {
      try {
        console.log(`🔄 Loading ${moduleInfo.name}...`);
        const module = await import(moduleInfo.path);
        
        // Check if exports exist
        const availableExports = moduleInfo.exports.filter(exp => module[exp]);
        
        if (availableExports.length > 0) {
          this.features.set(moduleInfo.name, module);
          this.loadedModules.add(moduleInfo.name);
          console.log(`✅ ${moduleInfo.name} loaded (${availableExports.length}/${moduleInfo.exports.length} exports)`);
        } else {
          throw new Error(`No valid exports found in ${moduleInfo.name}`);
        }
        
      } catch (error) {
        console.warn(`⚠️ Failed to load ${moduleInfo.name}:`, error.message);
        // Continue with built-in implementations
      }
    }

    console.log(`📊 Module loading complete: ${this.loadedModules.size} modules loaded`);
  }

  /**
   * Initialize core animations (self-contained, no dependencies)
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
   * Initialize scroll reveal (self-contained)
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
   * Initialize hover effects (self-contained)
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
   * Create ripple effect (self-contained)
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
   * Initialize progress bars (self-contained)
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
              // Use existing width or set to default
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
   * Initialize image loading (self-contained)
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
   * Initialize theme (built-in implementation)
   */
  initializeTheme() {
    console.log('🎨 Initializing theme system...');

    // Use external module if available
    const themeModule = this.features.get('theme');
    if (themeModule && themeModule.themeManager) {
      try {
        themeModule.themeManager.init();
        console.log('✅ External theme manager initialized');
        return;
      } catch (error) {
        console.warn('⚠️ External theme initialization failed:', error);
      }
    }

    // Fallback to built-in theme implementation
    this.initBuiltInTheme();
  }

  /**
   * Built-in theme implementation
   */
  initBuiltInTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme immediately
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    
    // Update meta theme color
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', savedTheme === 'dark' ? '#1e293b' : '#9333ea');
    }

    // Setup theme toggle functionality
      const themeToggle = document.getElementById('toggle-theme');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.contains('dark');
        const newTheme = isDark ? 'light' : 'dark';
        
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', newTheme);
        
        // Update meta theme color
        if (metaTheme) {
          metaTheme.setAttribute('content', newTheme === 'dark' ? '#1e293b' : '#9333ea');
        }
        
        console.log(`🎨 Theme switched to: ${newTheme}`);
      });
    }

    this.features.set('themeBuiltIn', true);
    console.log('✅ Built-in theme system initialized');
  }

  /**
   * Initialize language system
   */
  initializeLanguage() {
    console.log('🌍 Initializing language system...');

    // Use external module if available
    const translationModule = this.features.get('translations');
    if (translationModule && translationModule.languageManager) {
      try {
        translationModule.languageManager.init();
        console.log('✅ External language manager initialized');
        return;
      } catch (error) {
        console.warn('⚠️ External language initialization failed:', error);
      }
    }

    // Fallback to built-in language implementation
    this.initBuiltInLanguage();
  }

  /**
   * Built-in language implementation
   */
  initBuiltInLanguage() {
    const savedLanguage = localStorage.getItem('language') || 'vi';
    
    // Setup language toggle functionality
      const languageToggle = document.getElementById('toggle-language');
    if (languageToggle) {
      languageToggle.addEventListener('click', () => {
        const currentLang = localStorage.getItem('language') || 'vi';
        const newLang = currentLang === 'vi' ? 'en' : 'vi';
        
        localStorage.setItem('language', newLang);
        
        // Update toggle text/icon
        const toggleText = languageToggle.querySelector('.toggle-text');
        if (toggleText) {
          toggleText.textContent = newLang === 'vi' ? 'EN' : 'VI';
        }
        
        console.log(`🌍 Language switched to: ${newLang}`);
        
        // Apply translations asynchronously
        this.applyTranslations(newLang);
      });
      
      // Set initial state
      const toggleText = languageToggle.querySelector('.toggle-text');
      if (toggleText) {
        toggleText.textContent = savedLanguage === 'vi' ? 'EN' : 'VI';
      }
    }

    // Apply initial translations
    this.applyTranslations(savedLanguage);

    this.features.set('languageBuiltIn', true);
    console.log('✅ Built-in language system initialized');
  }

  /**
   * Apply translations (built-in)
   */
  async applyTranslations(language) {
    try {
      // Load translations from JSON file
      const translations = await this.loadTranslations();
      
      if (!translations) {
        console.warn('⚠️ No translations loaded, using fallback');
        return;
      }

      const elements = document.querySelectorAll('[data-i18n]');
      elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = this.getNestedTranslation(translations[language], key);
        
        if (translation) {
          element.textContent = translation;
        }
      });
      
      console.log(`🌍 Applied ${language} translations to ${elements.length} elements`);
    } catch (error) {
      console.error('❌ Translation error:', error);
    }
  }

  /**
   * Load translations from JSON file
   */
  async loadTranslations() {
    if (this.cachedTranslations) {
      return this.cachedTranslations;
    }

    try {
      const response = await fetch(`${this.basePath}src/translations.json`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      this.cachedTranslations = await response.json();
      console.log('✅ Translations loaded from JSON file');
      return this.cachedTranslations;
    } catch (error) {
      console.warn('⚠️ Failed to load translations.json:', error.message);
      
      // Fallback to inline translations
      this.cachedTranslations = this.getFallbackTranslations();
      return this.cachedTranslations;
    }
  }

  /**
   * Get nested translation by key (supports dot notation)
   */
  getNestedTranslation(translations, key) {
    // First try direct key lookup
    if (translations[key]) {
      return translations[key];
    }

    // Then try nested lookup through all categories
    for (const category of Object.values(translations)) {
      if (category && typeof category === 'object' && category[key]) {
        return category[key];
      }
    }

    return null;
  }

  /**
   * Fallback translations (in case JSON fails to load)
   */
  getFallbackTranslations() {
    return {
      vi: {
        'nav-services': 'Dịch vụ',
        'nav-portfolio': 'Dự án',
        'nav-experience': 'Kinh nghiệm',
        'nav-blog': 'Blog',
        'nav-resume': 'Hồ sơ',
        'hero-mynameis': 'Tôi là',
        'hero-intro': 'Front-end developer với hơn 5 năm kinh nghiệm phát triển UI.',
        'specialized-title': 'Chuyên về',
        'contact-title': 'Liên hệ'
      },
      en: {
        'nav-services': 'Services',
        'nav-portfolio': 'Portfolio',
        'nav-experience': 'Experience',
        'nav-blog': 'Blog',
        'nav-resume': 'Resume',
        'hero-mynameis': 'My name is',
        'hero-intro': 'Front-end developer with 5+ years of experience in UI development.',
        'specialized-title': 'Specialized in',
        'contact-title': 'Contact'
      }
    };
  }

  /**
   * Initialize loaded features from external modules
   */
  initializeLoadedFeatures() {
    console.log('🔧 Initializing loaded features...');

    // Initialize contact form if available
    const contactModule = this.features.get('contact');
    if (contactModule) {
      try {
        if (contactModule.contactFormManager?.init) {
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

    // Initialize advanced animations if available
    const animationModule = this.features.get('animation');
    if (animationModule) {
      try {
        if (animationModule.scrollEffects?.init) {
          animationModule.scrollEffects.init();
          console.log('✅ Advanced scroll effects initialized');
        }
        if (animationModule.floatingShapes?.init) {
          animationModule.floatingShapes.init();
          console.log('✅ Floating shapes initialized');
        }
        if (animationModule.microInteractions?.init) {
          animationModule.microInteractions.init();
          console.log('✅ Micro interactions initialized');
        }
        if (animationModule.parallaxEffects?.init) {
          animationModule.parallaxEffects.init();
          console.log('✅ Parallax effects initialized');
        }
      } catch (error) {
        console.warn('⚠️ Advanced animation initialization failed:', error);
      }
    }

    console.log('✅ Feature initialization complete');
  }

  /**
   * Finish loading with smooth transition
   */
  finishLoading() {
    const loadingTime = Date.now() - this.loadingStartTime;
    console.log(`🎯 Loading completed in ${loadingTime}ms`);

    const minLoadingTime = 500;
    const remainingTime = Math.max(0, minLoadingTime - loadingTime);

    setTimeout(() => {
      const loader = document.getElementById('page-loader');
      const mainContent = document.getElementById('main-content');

      console.log('🎭 Starting loading transition...');

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
      const totalModules = this.loadedModules.size;
      
      console.log(`🎉 Application ready!`);
      console.log(`📊 Status: ${workingFeatures} features active, ${totalModules} external modules loaded`);
      console.log(`🌐 Environment: ${this.isGitHubPages ? 'GitHub Pages' : 'Development'}`);
      
      if (totalModules === 0 && !this.isGitHubPages) {
        console.log('💡 Running with built-in implementations only');
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
      features: Object.fromEntries(this.features),
      loadedModules: Array.from(this.loadedModules),
      environment: this.isGitHubPages ? 'GitHub Pages' : 'Development',
      basePath: this.basePath
    };
  }
}

// Global error handlers
window.addEventListener('error', (e) => {
  console.error('💥 Global error:', e.error?.message || e.message);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('💥 Unhandled promise rejection:', e.reason);
});

// Initialize application
const app = new UnifiedApplication();
app.init();

// Backup timeout
setTimeout(() => {
  if (!app.isInitialized) {
    console.warn('⚠️ Backup timeout triggered');
    app.finishLoading();
  }
}, 4000);

// Export for debugging
window.unifiedApp = app;

console.log('🎉 Unified main script ready!');