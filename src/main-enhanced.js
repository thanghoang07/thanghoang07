/**
 * 🚀 Enhanced Main Entry Point
 * Full-featured version with robust error handling
 */

import './style.css';

console.log('🎯 Enhanced main.js loaded!');

/**
 * Enhanced Application Class with Error Recovery
 */
class EnhancedApplication {
  constructor() {
    this.isInitialized = false;
    this.loadingStartTime = Date.now();
    this.loadedModules = new Set();
    this.failedModules = new Set();
  }

  /**
   * Initialize the application with progressive loading
   */
  async init() {
    console.log('🚀 Starting enhanced initialization...');

    try {
      // Step 1: Wait for DOM
      await this.waitForDOM();
      
      // Step 2: Load modules progressively
      await this.loadModulesProgressively();
      
      // Step 3: Initialize loaded features
      await this.initializeLoadedFeatures();
      
      // Step 4: Finish loading
      this.finishLoading();
      
    } catch (error) {
      console.error('❌ Critical initialization error:', error);
      // Always finish loading even on error
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
   * Load modules one by one with error handling
   */
  async loadModulesProgressively() {
    console.log('📦 Loading modules progressively...');

    const modules = [
      { name: 'colors', path: './colors.js', exports: ['colorSystem'] },
      { name: 'theme', path: './theme.js', exports: ['themeManager'] },
      { name: 'translations', path: './translations.js', exports: ['languageManager'] },
      { name: 'animations', path: './animation-effects.js', exports: ['scrollEffects', 'floatingShapes', 'microInteractions', 'parallaxEffects'] },
      { name: 'contact', path: './contact-form.js', exports: ['contactFormManager', 'initWorkExperienceTabs'] },
      { name: 'utils', path: './utils.js', exports: ['DOMUtils', 'PerformanceUtils'] }
    ];

    for (const moduleInfo of modules) {
      try {
        console.log(`🔄 Loading ${moduleInfo.name}...`);
        const module = await import(moduleInfo.path);
        
        // Check if exports exist
        const availableExports = moduleInfo.exports.filter(exp => module[exp]);
        
        if (availableExports.length > 0) {
          this.loadedModules.add(moduleInfo.name);
          window[`${moduleInfo.name}Module`] = module; // Store for later use
          console.log(`✅ ${moduleInfo.name} loaded (${availableExports.length}/${moduleInfo.exports.length} exports)`);
        } else {
          throw new Error(`No valid exports found in ${moduleInfo.name}`);
        }
        
      } catch (error) {
        console.error(`❌ Failed to load ${moduleInfo.name}:`, error.message);
        this.failedModules.add(moduleInfo.name);
        // Continue loading other modules
      }
    }

    console.log(`📊 Module loading complete: ${this.loadedModules.size} loaded, ${this.failedModules.size} failed`);
  }

  /**
   * Initialize features from loaded modules
   */
  async initializeLoadedFeatures() {
    console.log('🔧 Initializing loaded features...');

    // Initialize theme (critical for UI)
    if (this.loadedModules.has('theme')) {
      try {
        const themeModule = window.themeModule;
        if (themeModule.themeManager?.init) {
          themeModule.themeManager.init();
          console.log('✅ Theme initialized');
        }
      } catch (error) {
        console.error('❌ Theme initialization failed:', error);
      }
    }

    // Initialize translations
    if (this.loadedModules.has('translations')) {
      try {
        const translationModule = window.translationsModule;
        if (translationModule.languageManager?.init) {
          translationModule.languageManager.init();
          console.log('✅ Translations initialized');
        }
      } catch (error) {
        console.error('❌ Translation initialization failed:', error);
      }
    }

    // Initialize animations (non-critical)
    if (this.loadedModules.has('animations')) {
      try {
        const animationModule = window.animationsModule;
        
        if (animationModule.scrollEffects?.init) {
          animationModule.scrollEffects.init();
          console.log('✅ Scroll effects initialized');
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
        console.error('❌ Animation initialization failed:', error);
      }
    }

    // Initialize contact form
    if (this.loadedModules.has('contact')) {
      try {
        const contactModule = window.contactModule;
        
        if (contactModule.contactFormManager?.init) {
          contactModule.contactFormManager.init();
          console.log('✅ Contact form initialized');
        }
        
        if (contactModule.initWorkExperienceTabs) {
          contactModule.initWorkExperienceTabs();
          console.log('✅ Work experience tabs initialized');
        }
        
      } catch (error) {
        console.error('❌ Contact form initialization failed:', error);
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

    // Ensure minimum loading time for smooth UX
    const minLoadingTime = 600;
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

      console.log('🎉 Application fully loaded and ready!');
      console.log(`📊 Final status: ${this.loadedModules.size} modules loaded, ${this.failedModules.size} failed`);
      
      if (this.failedModules.size > 0) {
        console.warn('⚠️ Some modules failed to load:', Array.from(this.failedModules));
        console.log('💡 Website will work with reduced functionality');
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
      loadedModules: Array.from(this.loadedModules),
      failedModules: Array.from(this.failedModules)
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

// Create and initialize application
const app = new EnhancedApplication();

// Initialize with timeout backup
app.init();

// Backup timeout - force finish loading after 5 seconds
setTimeout(() => {
  if (!app.isInitialized) {
    console.warn('⚠️ Loading timeout reached, forcing finish...');
    app.finishLoading();
  }
}, 5000);

// Export for debugging
if (typeof window !== 'undefined') {
  window.enhancedApp = app;
}

console.log('🎉 Enhanced main script loaded! Use window.enhancedApp to check status.');