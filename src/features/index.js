/**
 * 🎯 Unified Features Index
 * Centralized export of all unified feature modules
 */

// Performance Management
export {
  PerformanceMonitor,
  ResourceOptimizer,
  PerformanceAnalytics,
  UnifiedPerformanceManager
} from './unified-performance.js';

// System Management (Themes, PWA, Analytics)
export {
  UnifiedThemeManager,
  UnifiedPWAManager,
  UnifiedAnalyticsManager,
  UnifiedSystemManager
} from './unified-system.js';

// Interactions Management (Micro-interactions, Images, Sections)
export {
  UnifiedMicroInteractionManager,
  UnifiedImageLoader,
  UnifiedSectionLoader,
  UnifiedInteractionsManager
} from './unified-interactions.js';

// Convenience exports for backward compatibility
export { UnifiedPerformanceManager as AdvancedPerformance } from './unified-performance.js';
export { UnifiedThemeManager as AdvancedThemes } from './unified-system.js';
export { UnifiedPWAManager as PWAOptimization } from './unified-system.js';
export { UnifiedAnalyticsManager as Analytics } from './unified-system.js';
export { UnifiedMicroInteractionManager as MicroInteractions } from './unified-interactions.js';
export { UnifiedImageLoader as ImageLoader } from './unified-interactions.js';
export { UnifiedSectionLoader as SectionLazyLoader } from './unified-interactions.js';

// Initialize all systems
export function initializeUnifiedFeatures(config = {}) {
  const systems = {
    performance: new UnifiedPerformanceManager(config.performance),
    system: new UnifiedSystemManager(config.system),
    interactions: new UnifiedInteractionsManager(config.interactions)
  };
  
  // Setup cross-system integrations
  setupSystemIntegrations(systems);
  
  return systems;
}

function setupSystemIntegrations(systems) {
  const { performance, system, interactions } = systems;
  
  // Performance-System integration
  performance.on('performanceChange', (data) => {
    system.analyticsManager.track('performance_change', data);
  });
  
  // System-Interactions integration
  system.themeManager.on('themeChanged', (data) => {
    // Update interaction styles for new theme
    interactions.microInteractions.updateTheme?.(data.theme);
  });
  
  // Global error handling
  window.addEventListener('error', (e) => {
    system.analyticsManager.track('javascript_error', {
      message: e.message,
      filename: e.filename,
      lineno: e.lineno
    });
  });
}