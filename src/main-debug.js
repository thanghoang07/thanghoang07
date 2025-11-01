/**
 * 🚀 Simplified Main Entry Point - Debug Version
 * This version helps identify loading issues
 */

import './style.css';

console.log('🎯 Debug main.js loaded!');

/**
 * Simple Loading Manager
 */
class SimpleApp {
  constructor() {
    this.isInitialized = false;
    this.loadingStartTime = Date.now();
    this.debugMode = true;
  }

  /**
   * Debug log with timestamp
   */
  debugLog(message, type = 'info') {
    const time = Date.now() - this.loadingStartTime;
    const icon = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    console.log(`[${time}ms] ${icon} ${message}`);
  }

  /**
   * Initialize the app step by step
   */
  async init() {
    this.debugLog('🚀 Starting simplified initialization...');

    try {
      // Step 1: Check DOM
      this.debugLog('📋 Checking DOM readiness...');
      await this.waitForDOM();
      
      // Step 2: Initialize core systems
      this.debugLog('🔧 Initializing core systems...');
      await this.initializeCoreFeatures();
      
      // Step 3: Initialize UI
      this.debugLog('🎨 Initializing UI features...');
      await this.initializeUIFeatures();
      
      // Step 4: Finish loading
      this.debugLog('🎯 Finishing loading process...');
      this.finishLoading();
      
    } catch (error) {
      this.debugLog(`💥 Initialization error: ${error.message}`, 'error');
      console.error('Full error:', error);
      
      // Still try to finish loading
      this.finishLoading();
    }
  }

  /**
   * Wait for DOM to be ready
   */
  waitForDOM() {
    return new Promise((resolve) => {
      if (document.readyState === 'loading') {
        this.debugLog('⏳ Waiting for DOM...');
        document.addEventListener('DOMContentLoaded', () => {
          this.debugLog('✅ DOM ready!');
          resolve();
        });
      } else {
        this.debugLog('✅ DOM already ready!');
        resolve();
      }
    });
  }

  /**
   * Initialize core features with error handling
   */
  async initializeCoreFeatures() {
    const features = [
      { name: 'Color System', module: './colors.js', export: 'colorSystem' },
      { name: 'Theme Manager', module: './theme.js', export: 'themeManager' },
      { name: 'Language Manager', module: './translations.js', export: 'languageManager' }
    ];

    for (const feature of features) {
      try {
        this.debugLog(`🔄 Loading ${feature.name}...`);
        const module = await import(feature.module);
        
        if (module[feature.export]) {
          this.debugLog(`✅ ${feature.name} loaded successfully`);
          
          // Initialize if it has an init method
          if (typeof module[feature.export].init === 'function') {
            await module[feature.export].init();
            this.debugLog(`✅ ${feature.name} initialized`);
          }
        } else {
          this.debugLog(`⚠️ ${feature.name} export '${feature.export}' not found`, 'error');
        }
      } catch (error) {
        this.debugLog(`❌ ${feature.name} failed: ${error.message}`, 'error');
      }
    }
  }

  /**
   * Initialize UI features with error handling
   */
  async initializeUIFeatures() {
    const uiFeatures = [
      { name: 'Animation Effects', module: './animation-effects.js', exports: ['scrollEffects', 'floatingShapes', 'microInteractions'] },
      { name: 'Contact Form', module: './contact-form.js', exports: ['contactFormManager'] }
    ];

    for (const feature of uiFeatures) {
      try {
        this.debugLog(`🔄 Loading ${feature.name}...`);
        const module = await import(feature.module);
        
        let loadedCount = 0;
        for (const exportName of feature.exports) {
          if (module[exportName]) {
            loadedCount++;
            
            // Initialize if it has an init method
            if (typeof module[exportName].init === 'function') {
              try {
                await module[exportName].init();
                this.debugLog(`✅ ${feature.name}.${exportName} initialized`);
              } catch (initError) {
                this.debugLog(`⚠️ ${feature.name}.${exportName} init failed: ${initError.message}`, 'error');
              }
            }
          }
        }
        
        this.debugLog(`✅ ${feature.name} loaded (${loadedCount}/${feature.exports.length} exports)`);
      } catch (error) {
        this.debugLog(`❌ ${feature.name} failed: ${error.message}`, 'error');
      }
    }
  }

  /**
   * Finish loading with proper transition
   */
  finishLoading() {
    const loadingTime = Date.now() - this.loadingStartTime;
    this.debugLog(`🎯 Total loading time: ${loadingTime}ms`);

    // Ensure minimum loading time for smooth UX
    const minLoadingTime = 800;
    const remainingTime = Math.max(0, minLoadingTime - loadingTime);

    setTimeout(() => {
      const loader = document.getElementById('page-loader');
      const mainContent = document.getElementById('main-content');

      this.debugLog('🎭 Starting loading transition...');

      if (loader) {
        loader.classList.add('fade-out');
        this.debugLog('✅ Loader fade-out started');
        
        setTimeout(() => {
          loader.style.display = 'none';
          this.debugLog('✅ Loader hidden');
        }, 500);
      } else {
        this.debugLog('⚠️ Loader element not found!', 'error');
      }

      if (mainContent) {
        mainContent.classList.add('fade-in');
        this.debugLog('✅ Main content fade-in started');
      } else {
        this.debugLog('⚠️ Main content element not found!', 'error');
      }

      // Mark body as loaded
      document.body.classList.add('loaded');
      this.isInitialized = true;
      
      this.debugLog('🎉 Application fully loaded and ready!', 'success');
    }, remainingTime);
  }

  /**
   * Get debug status
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      loadingTime: Date.now() - this.loadingStartTime,
      debugMode: this.debugMode
    };
  }
}

// Create and initialize app
const app = new SimpleApp();

// Global error handlers
window.addEventListener('error', (e) => {
  app.debugLog(`💥 Global error: ${e.error?.message || e.message}`, 'error');
  console.error('Global error details:', e);
});

window.addEventListener('unhandledrejection', (e) => {
  app.debugLog(`💥 Unhandled promise rejection: ${e.reason}`, 'error');
  console.error('Promise rejection details:', e);
});

// Initialize app
app.init();

// Export for debugging
if (typeof window !== 'undefined') {
  window.debugApp = app;
}

console.log('🎉 Debug main script loaded! Use window.debugApp to check status.');