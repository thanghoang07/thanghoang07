/**
 * 🚀 Main Application Entry Point
 * Optimized modular initialization system
 */

import './style.css';

// Import color system first
import { colorSystem } from './colors.js';
import { colorDemo } from './color-demo.js';

// Import feature modules
import { themeManager } from './theme.js';
import { languageManager } from './translations.js';
import { 
  scrollEffects, 
  floatingShapes, 
  microInteractions, 
  parallaxEffects 
} from './animation-effects.js';
import { contactFormManager, initWorkExperienceTabs } from './contact-form.js';
import { DOMUtils, PerformanceUtils } from './utils.js';

/**
 * Application Class - Central coordinator
 */
class Application {
  constructor() {
    this.isInitialized = false;
    this.loadingStartTime = Date.now();
  }

  /**
   * Initialize the entire application
   */
  async init() {
    console.log('🚀 Starting application initialization...');

    // Initialize loading screen management
    this.initLoadingScreen();

    // Early performance optimizations
    PerformanceUtils.optimizeImages();
    DOMUtils.lazyLoad('img[data-src], [data-lazy]');

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeFeatures());
    } else {
      this.initializeFeatures();
    }
  }

  /**
   * Initialize loading screen
   */
  initLoadingScreen() {
    console.log('⏳ Initializing loading screen...');

    // Apply saved theme immediately to prevent flash
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }

  /**
   * Initialize all application features
   */
  async initializeFeatures() {
    console.log('🚀 DOM ready, initializing features...');

    try {
      // Initialize core systems first (order matters for UX)
      await this.initializeCoreFeatures();
      
      // Initialize UI enhancements
      await this.initializeUIFeatures();
      
      // Initialize interactive features
      await this.initializeInteractiveFeatures();

      console.log('✅ All features initialized successfully');
      
      // Mark as initialized and finish loading
      this.isInitialized = true;
      
    } catch (error) {
      console.error('❌ Error during feature initialization:', error);
      console.error('Full error details:', error.stack);
      // Mark as initialized anyway to prevent hanging
      this.isInitialized = true;
    }

    // Always finish loading regardless of errors
    this.finishLoading();
  }

  /**
   * Initialize core features (theme, language, etc.)
   */
  async initializeCoreFeatures() {
    console.log('🔧 Initializing core features...');

    try {
      // Initialize theme system first (prevents flash)
      if (themeManager && typeof themeManager.init === 'function') {
        themeManager.init();
        console.log('✅ Theme manager initialized');
      } else {
        console.warn('⚠️ Theme manager not available');
      }

      // Initialize language system
      if (languageManager && typeof languageManager.init === 'function') {
        languageManager.init();
        console.log('✅ Language manager initialized');
      } else {
        console.warn('⚠️ Language manager not available');
      }

      // Initialize contact form
      if (contactFormManager && typeof contactFormManager.init === 'function') {
        contactFormManager.init();
        console.log('✅ Contact form manager initialized');
      } else {
        console.warn('⚠️ Contact form manager not available');
      }

      // Initialize work experience tabs
      if (typeof initWorkExperienceTabs === 'function') {
        initWorkExperienceTabs();
        console.log('✅ Work experience tabs initialized');
      } else {
        console.warn('⚠️ Work experience tabs function not available');
      }

      console.log('✅ Core features ready');
    } catch (error) {
      console.error('❌ Error in core features:', error);
      throw error;
    }
  }

  /**
   * Initialize UI features (animations, effects)
   */
  async initializeUIFeatures() {
    console.log('🎨 Initializing UI features...');

    try {
      // Initialize scroll-based features
      if (scrollEffects && typeof scrollEffects.init === 'function') {
        scrollEffects.init();
        console.log('✅ Scroll effects initialized');
      } else {
        console.warn('⚠️ Scroll effects not available');
      }

      // Initialize floating background shapes
      if (floatingShapes && typeof floatingShapes.init === 'function') {
        floatingShapes.init();
        console.log('✅ Floating shapes initialized');
      } else {
        console.warn('⚠️ Floating shapes not available');
      }

      // Initialize parallax effects
      if (parallaxEffects && typeof parallaxEffects.init === 'function') {
        parallaxEffects.init();
        console.log('✅ Parallax effects initialized');
      } else {
        console.warn('⚠️ Parallax effects not available');
      }

      console.log('✅ UI features ready');
    } catch (error) {
      console.error('❌ Error in UI features:', error);
      throw error;
    }
  }

  /**
   * Initialize interactive features
   */
  async initializeInteractiveFeatures() {
    console.log('⚡ Initializing interactive features...');

    try {
      // Initialize micro interactions
      if (microInteractions && typeof microInteractions.init === 'function') {
        microInteractions.init();
        console.log('✅ Micro interactions initialized');
      } else {
        console.warn('⚠️ Micro interactions not available');
      }

      // Debug images in development
      if (process.env.NODE_ENV === 'development') {
        this.debugImages();
      }

      console.log('✅ Interactive features ready');
    } catch (error) {
      console.error('❌ Error in interactive features:', error);
      throw error;
    }
  }

  /**
   * Finish loading process with smooth transition
   */
  finishLoading() {
    const loadingTime = Date.now() - this.loadingStartTime;
    console.log(`🎯 Loading completed in ${loadingTime}ms`);

    // Ensure minimum loading time for smooth UX
    const minLoadingTime = 300;
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

      // Mark body as loaded
      document.body.classList.add('loaded');

      console.log('✅ Application fully loaded and ready!');
    }, remainingTime);
  }

  /**
   * Debug helper for development
   */
  debugImages() {
    console.log('🖼️ Debugging images...');

    const allImages = document.querySelectorAll('img');
    console.log(`🖼️ Found ${allImages.length} total images`);

    allImages.forEach((img, index) => {
      // Add error handler
      img.onerror = () => {
        console.error(`❌ Image failed to load:`, img.src || img.getAttribute('data-src'));
      };

      img.onload = () => {
        console.log(`✅ Image loaded successfully:`, img.src);
      };
    });
  }

  /**
   * Get application status
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      loadingTime: Date.now() - this.loadingStartTime,
      theme: themeManager.getCurrentTheme(),
      language: languageManager.getCurrentLanguage()
    };
  }
}

// Global error handlers
window.addEventListener('error', (e) => {
  console.error('💥 Global error:', e.error?.message || e.message);
  console.error('Error details:', e);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('💥 Unhandled promise rejection:', e.reason);
  console.error('Promise rejection details:', e);
});

// Create application instance
const app = new Application();

// Initialize application with timeout backup
app.init();

// Backup timeout - force finish loading after 5 seconds if something goes wrong
setTimeout(() => {
  if (!app.isInitialized) {
    console.warn('⚠️ Loading timeout reached, forcing finish loading...');
    app.finishLoading();
  }
}, 5000);

// Handle window load event for additional resources
window.addEventListener('load', () => {
  console.log('🌟 Window fully loaded, all resources ready');
  
  // Additional optimizations can be added here
  if (app.isInitialized) {
    console.log('📊 Application Status:', app.getStatus());
  }
});

// Export for debugging/testing
if (process.env.NODE_ENV === 'development') {
  window.app = app;
}

console.log('🎉 Main application script loaded!');



console.log('🎉 Main application script loaded!');