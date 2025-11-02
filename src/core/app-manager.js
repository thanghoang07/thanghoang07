/**
 * 🚀 Application Manager
 * Central orchestrator for all portfolio features
 */

import { BaseManager } from '../core/base-manager.js';
import { FEATURE_FLAGS } from '../unified-config.js';
import { Logger, PerformanceUtils } from '../utils/index.js';

class ApplicationManager extends BaseManager {
  constructor() {
    super('Application', {
      debug: true,
      storage: false
    });
    
    this.features = new Map();
    this.initializationOrder = [
      'error-handler',
      'unified-performance',
      'app-core',
      'navigation',
      'animation-optimizer',
      'animations',
      'unified-interactions',
      'unified-system',
      'work-exp-tabs'
    ];
    
    this.isReady = false;
    this.initializationProgress = 0;
  }

  async onInit() {
    Logger.info('🚀 Starting portfolio application...');
    
    try {
      // Initialize features in order
      await this.initializeFeatures();
      
      // Setup global error handling
      this.setupGlobalErrorHandling();
      
      // Setup performance monitoring
      this.setupPerformanceMonitoring();
      
      // Mark as ready
      this.isReady = true;
      this.emit('ready');
      
      Logger.success('🎉 Portfolio application ready!');
      
    } catch (error) {
      Logger.error('Failed to initialize application:', error);
      this.emit('error', error);
      throw error;
    }
  }

  async initializeFeatures() {
    const totalFeatures = this.initializationOrder.length;
    
    for (const [index, featureName] of this.initializationOrder.entries()) {
      try {
        Logger.info(`Initializing ${featureName}... (${index + 1}/${totalFeatures})`);
        
        const startTime = performance.now();
        await this.initializeFeature(featureName);
        const endTime = performance.now();
        
        this.initializationProgress = ((index + 1) / totalFeatures) * 100;
        this.emit('progress', {
          feature: featureName,
          progress: this.initializationProgress,
          duration: endTime - startTime
        });
        
        Logger.success(`✅ ${featureName} initialized (${(endTime - startTime).toFixed(2)}ms)`);
        
      } catch (error) {
        Logger.error(`❌ Failed to initialize ${featureName}:`, error);
        
        // Continue with other features unless critical
        if (this.isCriticalFeature(featureName)) {
          throw error;
        }
      }
    }
  }

  async initializeFeature(featureName) {
    switch (featureName) {
      case 'error-handler':
        if (FEATURE_FLAGS.ERROR_REPORTING) {
          const { initErrorHandler } = await import('../error-handler.js');
          const handler = initErrorHandler();
          this.features.set(featureName, handler);
        }
        break;

      case 'unified-performance':
        if (FEATURE_FLAGS.PERFORMANCE_MONITORING) {
          const { UnifiedPerformanceManager } = await import('../features/unified-performance.js');
          const performanceManager = new UnifiedPerformanceManager();
          this.features.set(featureName, performanceManager);
        }
        break;

      case 'app-core':
        const { initApp } = await import('../app.js');
        const app = initApp();
        this.features.set(featureName, app);
        break;

      case 'navigation':
        const { initNavigation } = await import('../ui/navigation.js');
        const navigation = initNavigation();
        this.features.set(featureName, navigation);
        break;

      case 'animation-optimizer':
        const { initAnimationOptimizer } = await import('../animation-optimizer.js');
        const optimizer = initAnimationOptimizer();
        this.features.set(featureName, optimizer);
        break;

      case 'animations':
        const { initAnimations } = await import('../animations.js');
        const animations = initAnimations();
        this.features.set(featureName, animations);
        break;

      case 'unified-interactions':
        if (FEATURE_FLAGS.LAZY_LOADING || FEATURE_FLAGS.SECTION_LAZY_LOADING || FEATURE_FLAGS.MICRO_INTERACTIONS) {
          const { UnifiedInteractionsManager } = await import('../features/unified-interactions.js');
          const interactions = new UnifiedInteractionsManager({
            sectionLoader: {
              rootMargin: '50px 0px',
              threshold: 0.1
            }
          });
          this.features.set(featureName, interactions);
        }
        break;

      case 'unified-system':
        if (FEATURE_FLAGS.ADVANCED_THEMES || FEATURE_FLAGS.PWA || FEATURE_FLAGS.ANALYTICS) {
          const { UnifiedSystemManager } = await import('../features/unified-system.js');
          const system = new UnifiedSystemManager({
            measurementId: 'G-XXXXXXXXXX' // Replace with actual GA4 ID
          });
          this.features.set(featureName, system);
        }
        break;

      case 'work-exp-tabs':
        const { initWorkExpTabs } = await import('../ui/work-exp-tabs.js');
        const tabs = initWorkExpTabs();
        this.features.set(featureName, tabs);
        break;



      default:
        Logger.warning(`Unknown feature: ${featureName}`);
    }
  }

  isCriticalFeature(featureName) {
    const criticalFeatures = ['error-handler', 'app-core'];
    return criticalFeatures.includes(featureName);
  }

  setupGlobalErrorHandling() {
    // Global error handler
    window.addEventListener('error', (event) => {
      Logger.error('Global error:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      });
      
      this.emit('globalError', event);
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      Logger.error('Unhandled promise rejection:', event.reason);
      this.emit('unhandledRejection', event);
    });
  }

  setupPerformanceMonitoring() {
    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
      try {
        // Largest Contentful Paint
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          Logger.info(`LCP: ${lastEntry.startTime.toFixed(2)}ms`);
          this.emit('lcp', lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            Logger.info(`FID: ${entry.processingStart - entry.startTime}ms`);
            this.emit('fid', entry.processingStart - entry.startTime);
          });
        }).observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift
        new PerformanceObserver((list) => {
          let cumulativeScore = 0;
          list.getEntries().forEach(entry => {
            if (!entry.hadRecentInput) {
              cumulativeScore += entry.value;
            }
          });
          Logger.info(`CLS: ${cumulativeScore.toFixed(4)}`);
          this.emit('cls', cumulativeScore);
        }).observe({ entryTypes: ['layout-shift'] });

      } catch (error) {
        Logger.warning('Performance monitoring setup failed:', error);
      }
    }
  }

  // Public API methods
  getFeature(name) {
    return this.features.get(name);
  }

  getAllFeatures() {
    return Array.from(this.features.keys());
  }

  getFeatureStatus() {
    const status = {};
    for (const [name, feature] of this.features) {
      status[name] = {
        initialized: !!feature,
        enabled: feature?.isEnabled ? feature.isEnabled() : true,
        info: feature?.getInfo ? feature.getInfo() : null
      };
    }
    return status;
  }

  async restartFeature(name) {
    const feature = this.features.get(name);
    if (feature && feature.destroy) {
      feature.destroy();
    }
    
    await this.initializeFeature(name);
    Logger.success(`Feature ${name} restarted`);
  }

  async addDelayedEffects() {
    // Add typing effect with delay
    setTimeout(async () => {
      try {
        const { addOptimizedTypingEffect } = await import('../animation-optimizer.js');
        addOptimizedTypingEffect();
      } catch (error) {
        Logger.error('Failed to add typing effect:', error);
      }
    }, 1000);

    // Add counter effect
    try {
      const { addOptimizedCounterEffect } = await import('../animation-optimizer.js');
      addOptimizedCounterEffect();
    } catch (error) {
      Logger.error('Failed to add counter effect:', error);
    }
  }

  // Health check
  healthCheck() {
    const health = {
      ready: this.isReady,
      progress: this.initializationProgress,
      features: this.getFeatureStatus(),
      performance: {
        timing: performance.timing,
        memory: performance.memory
      },
      timestamp: Date.now()
    };

    Logger.info('Health check:', health);
    return health;
  }

  // Cleanup method
  onDestroy() {
    Logger.info('Shutting down application...');
    
    // Destroy all features
    for (const [name, feature] of this.features) {
      try {
        if (feature && typeof feature.destroy === 'function') {
          feature.destroy();
          Logger.info(`Feature ${name} destroyed`);
        }
      } catch (error) {
        Logger.error(`Failed to destroy feature ${name}:`, error);
      }
    }
    
    this.features.clear();
    this.isReady = false;
    
    Logger.success('Application shutdown complete');
  }

  getState() {
    return {
      ...super.getState(),
      ready: this.isReady,
      progress: this.initializationProgress,
      featuresCount: this.features.size
    };
  }
}

// Singleton instance
let appManagerInstance = null;

export async function initApplicationManager() {
  if (appManagerInstance) {
    Logger.warning('Application Manager already initialized');
    return appManagerInstance;
  }

  try {
    appManagerInstance = new ApplicationManager();
    await appManagerInstance.init();
    
    // Add delayed effects
    await appManagerInstance.addDelayedEffects();
    
    // Make globally accessible for debugging
    if (window) {
      window.appManager = appManagerInstance;
    }
    
    return appManagerInstance;
    
  } catch (error) {
    Logger.error('Failed to initialize Application Manager:', error);
    return null;
  }
}

export { ApplicationManager };
export default { initApplicationManager, ApplicationManager };