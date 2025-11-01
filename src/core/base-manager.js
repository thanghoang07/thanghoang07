/**
 * 🏗️ Base Manager Class
 * Abstract base class for all feature managers
 */

import { Logger, EventUtils, StorageUtils } from '../utils/index.js';
import { FEATURE_FLAGS } from '../core/config.js';

export class BaseManager {
  constructor(name, options = {}) {
    this.name = name;
    this.options = {
      enabled: true,
      debug: false,
      storage: true,
      ...options
    };
    
    this.isInitialized = false;
    this.listeners = new Map();
    this.observers = new Map();
    this.storageKey = `portfolio-${name.toLowerCase()}`;
    
    // Bind methods to maintain context
    this.init = this.init.bind(this);
    this.destroy = this.destroy.bind(this);
    this.enable = this.enable.bind(this);
    this.disable = this.disable.bind(this);
  }

  /**
   * Initialize the manager
   * @override
   */
  async init() {
    if (this.isInitialized) return;
    
    try {
      Logger.info(`Initializing ${this.name}...`);
      
      // Check if feature is enabled
      if (!this.isFeatureEnabled()) {
        Logger.warning(`${this.name} is disabled via feature flag`);
        return;
      }
      
      // Load saved state
      if (this.options.storage) {
        this.loadState();
      }
      
      // Call child initialization
      await this.onInit();
      
      this.isInitialized = true;
      this.emit('initialized');
      
      Logger.success(`${this.name} initialized successfully`);
      
    } catch (error) {
      Logger.error(`Failed to initialize ${this.name}:`, error);
      throw error;
    }
  }

  /**
   * Child classes should override this method
   */
  async onInit() {
    // Override in child classes
  }

  /**
   * Destroy the manager and clean up resources
   */
  destroy() {
    if (!this.isInitialized) return;
    
    try {
      Logger.info(`Destroying ${this.name}...`);
      
      // Call child cleanup
      this.onDestroy();
      
      // Clean up event listeners
      this.listeners.clear();
      
      // Clean up observers
      this.observers.forEach(observer => {
        if (observer.disconnect) observer.disconnect();
        if (observer.unobserve) observer.unobserve();
      });
      this.observers.clear();
      
      // Save state before destroy
      if (this.options.storage) {
        this.saveState();
      }
      
      this.isInitialized = false;
      this.emit('destroyed');
      
      Logger.success(`${this.name} destroyed successfully`);
      
    } catch (error) {
      Logger.error(`Failed to destroy ${this.name}:`, error);
    }
  }

  /**
   * Child classes should override this method
   */
  onDestroy() {
    // Override in child classes
  }

  /**
   * Enable the manager
   */
  enable() {
    this.options.enabled = true;
    this.saveState();
    this.emit('enabled');
    Logger.info(`${this.name} enabled`);
  }

  /**
   * Disable the manager
   */
  disable() {
    this.options.enabled = false;
    this.saveState();
    this.emit('disabled');
    Logger.info(`${this.name} disabled`);
  }

  /**
   * Check if the manager is enabled
   */
  isEnabled() {
    return this.options.enabled && this.isInitialized;
  }

  /**
   * Check if feature is enabled in feature flags
   */
  isFeatureEnabled() {
    const featureKey = this.name.toUpperCase().replace(/\s+/g, '_');
    return FEATURE_FLAGS[featureKey] !== false;
  }

  /**
   * Add event listener
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }

  /**
   * Remove event listener
   */
  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  /**
   * Emit event
   */
  emit(event, data = null) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          Logger.error(`Error in ${this.name} event handler:`, error);
        }
      });
    }
  }

  /**
   * Add observer (IntersectionObserver, MutationObserver, etc.)
   */
  addObserver(name, observer) {
    this.observers.set(name, observer);
  }

  /**
   * Get observer by name
   */
  getObserver(name) {
    return this.observers.get(name);
  }

  /**
   * Remove observer
   */
  removeObserver(name) {
    const observer = this.observers.get(name);
    if (observer) {
      if (observer.disconnect) observer.disconnect();
      this.observers.delete(name);
    }
  }

  /**
   * Save manager state to storage
   */
  saveState() {
    if (!this.options.storage) return;
    
    const state = this.getState();
    StorageUtils.setItem(this.storageKey, state);
  }

  /**
   * Load manager state from storage
   */
  loadState() {
    if (!this.options.storage) return;
    
    const state = StorageUtils.getItem(this.storageKey, {});
    this.setState(state);
  }

  /**
   * Get current state (override in child classes)
   */
  getState() {
    return {
      enabled: this.options.enabled,
      initialized: this.isInitialized
    };
  }

  /**
   * Set state (override in child classes)
   */
  setState(state) {
    if (state.enabled !== undefined) {
      this.options.enabled = state.enabled;
    }
  }

  /**
   * Debug logging
   */
  debug(message, data = null) {
    if (this.options.debug) {
      Logger.debug(`[${this.name}] ${message}`, data);
    }
  }

  /**
   * Get manager information
   */
  getInfo() {
    return {
      name: this.name,
      initialized: this.isInitialized,
      enabled: this.options.enabled,
      listeners: this.listeners.size,
      observers: this.observers.size,
      storage: this.options.storage,
      storageKey: this.storageKey
    };
  }

  /**
   * Static method to check browser support
   */
  static checkSupport() {
    return true; // Override in child classes
  }
}

/**
 * 🎯 Feature Manager
 * Specialized base class for feature managers
 */
export class FeatureManager extends BaseManager {
  constructor(name, options = {}) {
    super(name, {
      autoStart: true,
      dependencies: [],
      ...options
    });
    
    this.dependencies = this.options.dependencies;
    this.dependenciesLoaded = false;
  }

  async init() {
    // Check dependencies first
    if (this.dependencies.length > 0) {
      await this.checkDependencies();
    }
    
    return super.init();
  }

  async checkDependencies() {
    Logger.info(`Checking dependencies for ${this.name}:`, this.dependencies);
    
    for (const dependency of this.dependencies) {
      if (typeof dependency === 'string') {
        // Check if global exists
        if (!window[dependency]) {
          throw new Error(`Dependency ${dependency} not found`);
        }
      } else if (typeof dependency === 'function') {
        // Run dependency check function
        const result = await dependency();
        if (!result) {
          throw new Error(`Dependency check failed for ${this.name}`);
        }
      }
    }
    
    this.dependenciesLoaded = true;
    Logger.success(`All dependencies loaded for ${this.name}`);
  }

  getState() {
    return {
      ...super.getState(),
      dependenciesLoaded: this.dependenciesLoaded
    };
  }
}

/**
 * 🎨 UI Manager
 * Specialized base class for UI component managers
 */
export class UIManager extends BaseManager {
  constructor(name, selector, options = {}) {
    super(name, {
      selector,
      autoRender: true,
      responsive: true,
      ...options
    });
    
    this.selector = selector;
    this.element = null;
    this.components = new Map();
  }

  async onInit() {
    // Find or create element
    this.element = document.querySelector(this.selector);
    
    if (!this.element && this.options.autoRender) {
      this.element = this.createElement();
    }
    
    if (!this.element) {
      throw new Error(`Element not found: ${this.selector}`);
    }
    
    // Setup responsive handling
    if (this.options.responsive) {
      this.setupResponsive();
    }
    
    // Render UI
    await this.render();
  }

  onDestroy() {
    // Clean up components
    this.components.forEach(component => {
      if (component.destroy) component.destroy();
    });
    this.components.clear();
    
    // Remove element if auto-created
    if (this.options.autoRender && this.element) {
      this.element.remove();
    }
  }

  createElement() {
    // Override in child classes
    return null;
  }

  async render() {
    // Override in child classes
  }

  setupResponsive() {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    
    const handleResize = (e) => {
      this.onResponsiveChange(e.matches);
    };
    
    mediaQuery.addListener(handleResize);
    this.onResponsiveChange(mediaQuery.matches);
    
    // Store for cleanup
    this.mediaQuery = mediaQuery;
    this.handleResize = handleResize;
  }

  onResponsiveChange(isMobile) {
    // Override in child classes
    this.debug(`Responsive change: ${isMobile ? 'mobile' : 'desktop'}`);
  }

  addComponent(name, component) {
    this.components.set(name, component);
  }

  getComponent(name) {
    return this.components.get(name);
  }

  removeComponent(name) {
    const component = this.components.get(name);
    if (component && component.destroy) {
      component.destroy();
    }
    this.components.delete(name);
  }
}

export default { BaseManager, FeatureManager, UIManager };