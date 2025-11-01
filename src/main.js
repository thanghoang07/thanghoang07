/**
 * 🚀 Main Application Entry Point
 * Optimized modular initialization system
 */

import './style.css';

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
      this.finishLoading();

    } catch (error) {
      console.error('❌ Error during feature initialization:', error);
      // Still try to finish loading even if some features fail
      this.finishLoading();
    }
  }

  /**
   * Initialize core features (theme, language, etc.)
   */
  async initializeCoreFeatures() {
    console.log('🔧 Initializing core features...');

    // Initialize theme system first (prevents flash)
    themeManager.init();

    // Initialize language system
    languageManager.init();

    // Initialize contact form
    contactFormManager.init();

    // Initialize work experience tabs
    initWorkExperienceTabs();

    console.log('✅ Core features ready');
  }

  /**
   * Initialize UI features (animations, effects)
   */
  async initializeUIFeatures() {
    console.log('🎨 Initializing UI features...');

    // Initialize scroll-based features
    scrollEffects.init();

    // Initialize floating background shapes
    floatingShapes.init();

    // Initialize parallax effects
    parallaxEffects.init();

    console.log('✅ UI features ready');
  }

  /**
   * Initialize interactive features
   */
  async initializeInteractiveFeatures() {
    console.log('⚡ Initializing interactive features...');

    // Initialize micro interactions
    microInteractions.init();

    // Debug images in development
    if (process.env.NODE_ENV === 'development') {
      this.debugImages();
    }

    console.log('✅ Interactive features ready');
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

// Create application instance
const app = new Application();

// Initialize application
app.init();

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