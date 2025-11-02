/**
 * 🎭 Unified Interactions Manager
 * Comprehensive interaction system including micro-interactions, image loading, and section lazy loading
 */

import { FeatureManager } from '../core/base-manager.js';
import { Logger, DOMUtils, DeviceUtils } from '../utils/index.js';

/**
 * 🎭 Advanced Micro-Interactions Manager
 * Visual feedback, animations, and user interaction enhancements
 */
class UnifiedMicroInteractionManager extends FeatureManager {
  constructor() {
    super('Micro Interactions', {
      autoStart: true,
      storage: false
    });
    
    this.interactions = new Map();
    this.performanceMode = this.detectPerformanceMode();
    
    // Configuration
    this.config = {
      magneticDistance: 100,
      hoverScale: 1.05,
      clickScale: 0.95,
      rippleSize: 300,
      hapticEnabled: 'vibrate' in navigator,
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    };
    
    this.init();
  }

  detectPerformanceMode() {
    // Check device capabilities
    const connection = navigator.connection;
    const deviceMemory = navigator.deviceMemory || 4;
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;
    
    // Determine performance level
    if (connection?.effectiveType === '2g' || deviceMemory < 2 || hardwareConcurrency < 2) {
      return 'low';
    } else if (connection?.effectiveType === '3g' || deviceMemory < 4) {
      return 'medium';
    }
    return 'high';
  }

  async init() {
    try {
      if (this.config.reducedMotion) {
        Logger.info('Reduced motion detected, limiting animations');
        return;
      }
      
      this.initMagneticButtons();
      this.initRippleEffects();
      this.initAdvancedHoverEffects();
      this.initCursorTrailing();
      this.initHapticFeedback();
      this.initKeyboardInteractions();
      this.initScrollTriggers();
      
      Logger.info('Micro-interactions initialized', { mode: this.performanceMode });
    } catch (error) {
      Logger.error('Micro-interactions initialization failed', error);
    }
  }

  initMagneticButtons() {
    const magneticElements = document.querySelectorAll('[data-magnetic]');
    
    magneticElements.forEach(element => {
      let isHovering = false;
      
      element.addEventListener('mouseenter', () => {
        isHovering = true;
        element.style.transition = 'transform 0.3s ease';
      });
      
      element.addEventListener('mouseleave', () => {
        isHovering = false;
        element.style.transform = 'translate(0, 0) scale(1)';
      });
      
      element.addEventListener('mousemove', (e) => {
        if (!isHovering || this.performanceMode === 'low') return;
        
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance < this.config.magneticDistance) {
          const strength = (this.config.magneticDistance - distance) / this.config.magneticDistance;
          const moveX = deltaX * strength * 0.3;
          const moveY = deltaY * strength * 0.3;
          
          element.style.transform = `translate(${moveX}px, ${moveY}px) scale(${1 + strength * 0.05})`;
        }
      });
    });
  }

  initRippleEffects() {
    const rippleElements = document.querySelectorAll('[data-ripple]');
    
    rippleElements.forEach(element => {
      element.addEventListener('click', (e) => {
        this.createRipple(e, element);
      });
    });
  }

  createRipple(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
    ripple.classList.add('ripple-effect');
    
    element.appendChild(ripple);
    
    // Animate ripple
    requestAnimationFrame(() => {
      ripple.style.transform = 'scale(2)';
      ripple.style.opacity = '0';
    });
    
    // Remove ripple after animation
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  initAdvancedHoverEffects() {
    const hoverElements = document.querySelectorAll('[data-hover-effect]');
    
    hoverElements.forEach(element => {
      const effect = element.dataset.hoverEffect;
      
      element.addEventListener('mouseenter', (e) => {
        this.applyHoverEffect(element, effect, true);
      });
      
      element.addEventListener('mouseleave', (e) => {
        this.applyHoverEffect(element, effect, false);
      });
    });
  }

  applyHoverEffect(element, effect, isEnter) {
    const scale = isEnter ? this.config.hoverScale : 1;
    const duration = this.performanceMode === 'high' ? '0.3s' : '0.15s';
    
    element.style.transition = `transform ${duration} ease, filter ${duration} ease`;
    
    switch (effect) {
      case 'scale':
        element.style.transform = `scale(${scale})`;
        break;
        
      case 'lift':
        element.style.transform = `translateY(${isEnter ? -10 : 0}px) scale(${scale})`;
        element.style.filter = `drop-shadow(0 ${isEnter ? 20 : 0}px 25px rgba(0,0,0,0.15))`;
        break;
        
      case 'glow':
        element.style.filter = `brightness(${isEnter ? 1.1 : 1}) contrast(${isEnter ? 1.1 : 1})`;
        break;
        
      case 'rotate':
        element.style.transform = `rotate(${isEnter ? 5 : 0}deg) scale(${scale})`;
        break;
        
      case 'skew':
        element.style.transform = `skew(${isEnter ? 2 : 0}deg, ${isEnter ? 1 : 0}deg)`;
        break;
    }
  }

  initCursorTrailing() {
    if (this.performanceMode === 'low' || DeviceUtils.isTouchDevice()) return;
    
    const trail = [];
    const maxTrailLength = 20;
    
    document.addEventListener('mousemove', (e) => {
      trail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
      
      if (trail.length > maxTrailLength) {
        trail.shift();
      }
      
      this.updateCursorTrail(trail);
    });
  }

  updateCursorTrail(trail) {
    // Remove old trail elements
    document.querySelectorAll('.cursor-trail').forEach(el => el.remove());
    
    trail.forEach((point, index) => {
      const trailElement = document.createElement('div');
      trailElement.className = 'cursor-trail';
      trailElement.style.left = point.x + 'px';
      trailElement.style.top = point.y + 'px';
      trailElement.style.opacity = (index / trail.length) * 0.5;
      trailElement.style.transform = `scale(${index / trail.length})`;
      
      document.body.appendChild(trailElement);
      
      // Auto-remove after animation
      setTimeout(() => trailElement.remove(), 500);
    });
  }

  initHapticFeedback() {
    if (!this.config.hapticEnabled) return;
    
    const hapticElements = document.querySelectorAll('[data-haptic]');
    
    hapticElements.forEach(element => {
      element.addEventListener('click', () => {
        const intensity = element.dataset.haptic || 'light';
        this.triggerHaptic(intensity);
      });
    });
  }

  triggerHaptic(intensity = 'light') {
    if (!navigator.vibrate) return;
    
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30],
      double: [10, 50, 20],
      pattern: [100, 30, 100, 30, 100]
    };
    
    navigator.vibrate(patterns[intensity] || patterns.light);
  }

  initKeyboardInteractions() {
    document.addEventListener('keydown', (e) => {
      // Add keyboard focus indicators
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
      
      // Custom keyboard shortcuts
      this.handleKeyboardShortcuts(e);
    });
    
    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }

  handleKeyboardShortcuts(event) {
    const shortcuts = {
      'Escape': () => this.closeModals(),
      'Space': (e) => this.handleSpaceKey(e),
      'Enter': (e) => this.handleEnterKey(e)
    };
    
    if (shortcuts[event.key]) {
      shortcuts[event.key](event);
    }
  }

  closeModals() {
    document.querySelectorAll('.modal.active, .dropdown.open').forEach(modal => {
      modal.classList.remove('active', 'open');
    });
  }

  handleSpaceKey(event) {
    const target = event.target;
    if (target.matches('[data-space-trigger]')) {
      event.preventDefault();
      target.click();
    }
  }

  handleEnterKey(event) {
    const target = event.target;
    if (target.matches('[data-enter-trigger]')) {
      event.preventDefault();
      target.click();
    }
  }

  initScrollTriggers() {
    // Modern scroll triggers with data attributes
    const triggerElements = document.querySelectorAll('[data-scroll-trigger]');
    
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.handleScrollTrigger(entry.target);
          }
        });
      }, { threshold: 0.1 });
      
      triggerElements.forEach(element => observer.observe(element));
    }
    
    // Legacy scroll effects support
    this.initLegacyScrollEffects();
  }

  initLegacyScrollEffects() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const el = entry.target;
        if (entry.isIntersecting) {
          this.handleElementVisible(el);
        } else {
          this.handleElementHidden(el);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '50px 0px'
    });

    const targets = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale, section, .card');
    targets.forEach(el => observer.observe(el));
  }

  handleElementVisible(element) {
    // Reset any existing animation classes
    this.resetAnimationClasses(element);
    element.classList.add('revealed');

    const animationType = element.dataset.animation || 'fade-in-up';
    const stagger = element.dataset.stagger || '';

    // Force reflow for smooth animation
    element.offsetHeight;

    if (stagger) {
      element.classList.add(stagger);
    }

    element.classList.add(animationType);
  }

  handleElementHidden(element) {
    this.resetAnimationClasses(element);
    element.classList.remove('revealed');
  }

  resetAnimationClasses(element) {
    const animationClasses = [
      'fade-in', 'fade-in-up', 'fade-in-down', 'fade-in-left', 'fade-in-right',
      'slide-in-up', 'slide-in-down', 'slide-in-left', 'slide-in-right',
      'scale-in', 'rotate-in', 'flip-in', 'bounce-in',
      'staggered-1', 'staggered-2', 'staggered-3'
    ];
    
    element.classList.remove(...animationClasses);
  }

  handleScrollTrigger(element) {
    const trigger = element.dataset.scrollTrigger;
    const delay = parseInt(element.dataset.scrollDelay) || 0;
    
    setTimeout(() => {
      switch (trigger) {
        case 'fadeIn':
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
          break;
          
        case 'slideIn':
          element.style.transform = 'translateX(0)';
          break;
          
        case 'scaleIn':
          element.style.transform = 'scale(1)';
          break;
          
        case 'bounceIn':
          element.style.animation = 'bounceIn 0.6s ease';
          break;
      }
    }, delay);
  }
}

/**
 * 🖼️ Progressive Image Loader
 * Advanced image loading with blur effects, lazy loading, and optimization
 */
class UnifiedImageLoader extends FeatureManager {
  constructor() {
    super('Image Loader', {
      autoStart: true,
      storage: false
    });
    
    this.imageObserver = null;
    this.loadedImages = new Set();
    this.failedImages = new Set();
    this.loadingQueue = [];
    
    this.init();
  }

  async init() {
    try {
      this.setupIntersectionObserver();
      this.setupImages();
      this.setupImageOptimization();
      this.setupErrorHandling();
      
      Logger.info('Image Loader initialized');
    } catch (error) {
      Logger.error('Image Loader initialization failed', error);
    }
  }

  setupIntersectionObserver() {
    if ('IntersectionObserver' in window) {
      this.imageObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.loadImage(entry.target);
              this.imageObserver.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '50px 0px',
          threshold: 0.01
        }
      );
    }
  }

  setupImages() {
    const images = document.querySelectorAll('[data-src], [data-lazy]');
    
    images.forEach(img => {
      // Add loading placeholder
      this.addLoadingState(img);
      
      if (this.imageObserver) {
        this.imageObserver.observe(img);
      } else {
        // Fallback for browsers without IntersectionObserver
        this.loadImage(img);
      }
    });
  }

  addLoadingState(img) {
    img.style.filter = 'blur(10px)';
    img.style.transition = 'filter 0.3s ease, opacity 0.3s ease';
    
    // Add loading skeleton
    if (!img.style.backgroundColor) {
      img.style.backgroundColor = '#f0f0f0';
    }
  }

  async loadImage(img) {
    if (this.loadedImages.has(img)) return;
    
    const src = img.dataset.src || img.dataset.lazy;
    if (!src) return;
    
    try {
      // Create temporary image for loading
      const tempImg = new Image();
      
      // Handle different image formats
      const optimizedSrc = this.getOptimizedImageSrc(src, img);
      
      tempImg.onload = () => {
        this.onImageLoad(img, optimizedSrc);
      };
      
      tempImg.onerror = () => {
        this.onImageError(img, src);
      };
      
      tempImg.src = optimizedSrc;
      
    } catch (error) {
      this.onImageError(img, src);
    }
  }

  getOptimizedImageSrc(src, img) {
    // Get image dimensions
    const width = img.getAttribute('width') || img.offsetWidth;
    const height = img.getAttribute('height') || img.offsetHeight;
    
    // Device pixel ratio
    const dpr = window.devicePixelRatio || 1;
    
    // Calculate optimal dimensions
    const optimalWidth = Math.round(width * dpr);
    const optimalHeight = Math.round(height * dpr);
    
    // Check if we should use WebP
    const supportsWebP = this.supportsWebP();
    
    // Return optimized URL (this would integrate with your image service)
    if (src.includes('?')) {
      return `${src}&w=${optimalWidth}&h=${optimalHeight}${supportsWebP ? '&format=webp' : ''}`;
    } else {
      return `${src}?w=${optimalWidth}&h=${optimalHeight}${supportsWebP ? '&format=webp' : ''}`;
    }
  }

  supportsWebP() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  onImageLoad(img, src) {
    img.src = src;
    img.style.filter = 'none';
    img.style.opacity = '1';
    
    // Remove data attributes
    img.removeAttribute('data-src');
    img.removeAttribute('data-lazy');
    
    this.loadedImages.add(img);
    
    // Trigger load event
    img.dispatchEvent(new CustomEvent('imageLoaded', { detail: { src } }));
    
    Logger.debug('Image loaded', src);
  }

  onImageError(img, src) {
    this.failedImages.add(img);
    
    // Add error class
    img.classList.add('image-error');
    
    // Show placeholder or fallback
    const fallback = img.dataset.fallback;
    if (fallback) {
      img.src = fallback;
    } else {
      img.style.backgroundColor = '#f5f5f5';
      img.style.color = '#999';
      img.alt = 'Image failed to load';
    }
    
    Logger.warn('Image load failed', src);
  }

  setupImageOptimization() {
    // Preload critical images
    const criticalImages = document.querySelectorAll('[data-critical]');
    criticalImages.forEach(img => {
      const src = img.dataset.src || img.src;
      if (src) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      }
    });
    
    // Progressive loading for large images
    this.setupProgressiveLoading();
  }

  setupProgressiveLoading() {
    const progressiveImages = document.querySelectorAll('[data-progressive]');
    
    progressiveImages.forEach(img => {
      const lowRes = img.dataset.progressive;
      const highRes = img.dataset.src;
      
      if (lowRes && highRes) {
        // Load low-res first
        img.src = lowRes;
        img.style.filter = 'blur(5px)';
        
        // Then load high-res
        const highResImg = new Image();
        highResImg.onload = () => {
          img.src = highRes;
          img.style.filter = 'none';
        };
        highResImg.src = highRes;
      }
    });
  }

  setupErrorHandling() {
    // Global image error handler
    document.addEventListener('error', (e) => {
      if (e.target.tagName === 'IMG') {
        this.onImageError(e.target, e.target.src);
      }
    }, true);
  }

  // Public methods
  retryFailedImages() {
    this.failedImages.forEach(img => {
      this.failedImages.delete(img);
      img.classList.remove('image-error');
      this.loadImage(img);
    });
  }

  preloadImages(urls) {
    urls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  }
}

/**
 * 📜 Advanced Section Lazy Loader
 * Intelligent section loading with dependency management and performance optimization
 */
class UnifiedSectionLoader extends FeatureManager {
  constructor(options = {}) {
    super('Section Loader', {
      autoStart: true,
      storage: false
    });
    
    this.options = {
      rootMargin: '100px 0px',
      threshold: 0.1,
      loadingClass: 'section-loading',
      loadedClass: 'section-loaded',
      errorClass: 'section-error',
      retryAttempts: 3,
      retryDelay: 1000,
      ...options
    };
    
    this.loadedSections = new Set();
    this.failedSections = new Map();
    this.observers = new Map();
    this.loadingQueue = [];
    this.isProcessingQueue = false;
    this.dependencies = new Map();
    
    this.init();
  }

  async init() {
    try {
      this.setupIntersectionObserver();
      this.setupSectionLoaders();
      this.setupDependencyTracking();
      this.setupPerformanceOptimizations();
      
      Logger.info('Section Loader initialized');
    } catch (error) {
      Logger.error('Section Loader initialization failed', error);
    }
  }

  setupIntersectionObserver() {
    if ('IntersectionObserver' in window) {
      this.mainObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.queueSectionLoad(entry.target);
            }
          });
        },
        {
          rootMargin: this.options.rootMargin,
          threshold: this.options.threshold
        }
      );
    }
  }

  setupSectionLoaders() {
    const sections = document.querySelectorAll('[data-lazy-section]');
    
    sections.forEach(section => {
      // Parse section configuration
      const config = this.parseSectionConfig(section);
      
      // Set up dependencies
      this.setupSectionDependencies(section, config);
      
      // Add to observer
      if (this.mainObserver) {
        this.mainObserver.observe(section);
      } else {
        // Fallback
        this.loadSection(section);
      }
    });
  }

  parseSectionConfig(section) {
    return {
      id: section.id || `section-${Date.now()}`,
      src: section.dataset.lazySrc,
      dependencies: section.dataset.dependencies?.split(',').map(d => d.trim()) || [],
      priority: parseInt(section.dataset.priority) || 0,
      timeout: parseInt(section.dataset.timeout) || 10000,
      retries: parseInt(section.dataset.retries) || this.options.retryAttempts
    };
  }

  setupSectionDependencies(section, config) {
    if (config.dependencies.length > 0) {
      this.dependencies.set(section, config.dependencies);
    }
  }

  setupDependencyTracking() {
    // Monitor when dependencies are loaded
    this.on('sectionLoaded', (data) => {
      this.checkDependentSections(data.section);
    });
  }

  checkDependentSections(loadedSection) {
    const loadedId = loadedSection.id;
    
    this.dependencies.forEach((deps, section) => {
      if (deps.includes(loadedId) && !this.loadedSections.has(section)) {
        const remainingDeps = deps.filter(dep => 
          !document.querySelector(`#${dep}`).classList.contains(this.options.loadedClass)
        );
        
        if (remainingDeps.length === 0) {
          this.queueSectionLoad(section);
        }
      }
    });
  }

  queueSectionLoad(section) {
    if (this.loadedSections.has(section) || this.loadingQueue.includes(section)) {
      return;
    }
    
    const config = this.parseSectionConfig(section);
    this.loadingQueue.push({ section, config });
    
    // Sort by priority
    this.loadingQueue.sort((a, b) => b.config.priority - a.config.priority);
    
    if (!this.isProcessingQueue) {
      this.processLoadingQueue();
    }
  }

  async processLoadingQueue() {
    if (this.isProcessingQueue || this.loadingQueue.length === 0) return;
    
    this.isProcessingQueue = true;
    
    while (this.loadingQueue.length > 0) {
      const { section, config } = this.loadingQueue.shift();
      
      try {
        await this.loadSection(section, config);
        
        // Small delay to prevent overwhelming
        await new Promise(resolve => setTimeout(resolve, 50));
        
      } catch (error) {
        Logger.error('Section load failed', error);
      }
    }
    
    this.isProcessingQueue = false;
  }

  async loadSection(section, config = null) {
    if (this.loadedSections.has(section)) return;
    
    if (!config) {
      config = this.parseSectionConfig(section);
    }
    
    // Check dependencies
    if (!this.checkDependencies(section, config)) {
      return; // Wait for dependencies
    }
    
    section.classList.add(this.options.loadingClass);
    
    try {
      let content;
      
      if (config.src) {
        // Load external content
        content = await this.fetchSectionContent(config.src, config.timeout);
      } else {
        // Load inline content
        content = await this.loadInlineSection(section);
      }
      
      await this.renderSection(section, content);
      this.onSectionLoaded(section, config);
      
    } catch (error) {
      this.onSectionError(section, config, error);
    }
  }

  checkDependencies(section, config) {
    if (!config.dependencies || config.dependencies.length === 0) {
      return true;
    }
    
    return config.dependencies.every(depId => {
      const depElement = document.getElementById(depId);
      return depElement && depElement.classList.contains(this.options.loadedClass);
    });
  }

  async fetchSectionContent(src, timeout) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(src, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'text/html'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.text();
      
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async loadInlineSection(section) {
    // Process templates or data attributes
    const template = section.querySelector('template');
    if (template) {
      return template.innerHTML;
    }
    
    const dataContent = section.dataset.content;
    if (dataContent) {
      try {
        return JSON.parse(dataContent);
      } catch {
        return dataContent;
      }
    }
    
    return section.innerHTML;
  }

  async renderSection(section, content) {
    if (typeof content === 'string') {
      section.innerHTML = content;
    } else if (typeof content === 'object') {
      // Handle JSON data
      await this.renderDataSection(section, content);
    }
    
    // Initialize any scripts in the loaded content
    this.initializeSectionScripts(section);
    
    // Trigger custom initialization
    this.initializeSectionFeatures(section);
  }

  async renderDataSection(section, data) {
    const template = section.dataset.template;
    if (template) {
      // Use template engine (simplified version)
      const rendered = this.processTemplate(template, data);
      section.innerHTML = rendered;
    } else {
      // Default JSON rendering
      section.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    }
  }

  processTemplate(template, data) {
    // Simple template processing (replace {{key}} with data.key)
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] || match;
    });
  }

  initializeSectionScripts(section) {
    const scripts = section.querySelectorAll('script');
    scripts.forEach(script => {
      if (script.src) {
        // External script
        const newScript = document.createElement('script');
        newScript.src = script.src;
        newScript.async = true;
        document.head.appendChild(newScript);
      } else {
        // Inline script
        try {
          eval(script.textContent);
        } catch (error) {
          Logger.error('Script execution failed', error);
        }
      }
    });
  }

  initializeSectionFeatures(section) {
    // Re-initialize features for new content
    const events = [
      'sectionInitialize',
      'contentLoaded',
      'featuresReady'
    ];
    
    events.forEach(eventName => {
      section.dispatchEvent(new CustomEvent(eventName, {
        detail: { section, timestamp: Date.now() }
      }));
    });
  }

  onSectionLoaded(section, config) {
    section.classList.remove(this.options.loadingClass);
    section.classList.add(this.options.loadedClass);
    
    this.loadedSections.add(section);
    
    // Remove from failed sections if it was there
    this.failedSections.delete(section);
    
    // Unobserve the section
    if (this.mainObserver) {
      this.mainObserver.unobserve(section);
    }
    
    this.emit('sectionLoaded', { section, config });
    Logger.info('Section loaded', config.id);
  }

  onSectionError(section, config, error) {
    section.classList.remove(this.options.loadingClass);
    section.classList.add(this.options.errorClass);
    
    const attempts = this.failedSections.get(section) || 0;
    
    if (attempts < config.retries) {
      // Retry after delay
      this.failedSections.set(section, attempts + 1);
      
      setTimeout(() => {
        section.classList.remove(this.options.errorClass);
        this.loadSection(section, config);
      }, this.options.retryDelay * (attempts + 1));
      
    } else {
      // Max retries reached
      this.showSectionError(section, error);
    }
    
    Logger.error('Section load error', { section: config.id, error, attempts });
  }

  showSectionError(section, error) {
    section.innerHTML = `
      <div class="section-error-message">
        <h3>⚠️ Content Unavailable</h3>
        <p>This section failed to load. Please try refreshing the page.</p>
        <button onclick="location.reload()" class="retry-btn">Refresh Page</button>
      </div>
    `;
  }

  setupPerformanceOptimizations() {
    // Pause loading when page is hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseLoading();
      } else {
        this.resumeLoading();
      }
    });
    
    // Adjust loading based on connection
    if ('connection' in navigator) {
      this.optimizeForConnection();
    }
  }

  pauseLoading() {
    this.loadingPaused = true;
  }

  resumeLoading() {
    this.loadingPaused = false;
    if (this.loadingQueue.length > 0) {
      this.processLoadingQueue();
    }
  }

  optimizeForConnection() {
    const connection = navigator.connection;
    const effectiveType = connection.effectiveType;
    
    if (effectiveType === '2g' || effectiveType === 'slow-2g') {
      this.options.rootMargin = '10px 0px'; // Load closer to viewport
    } else if (effectiveType === '3g') {
      this.options.rootMargin = '50px 0px';
    }
  }

  // Public methods
  retrySections() {
    const failedSections = Array.from(this.failedSections.keys());
    failedSections.forEach(section => {
      this.failedSections.delete(section);
      section.classList.remove(this.options.errorClass);
      this.queueSectionLoad(section);
    });
  }

  loadSectionById(id) {
    const section = document.getElementById(id);
    if (section) {
      this.queueSectionLoad(section);
    }
  }

  getSectionStatus() {
    return {
      loaded: this.loadedSections.size,
      failed: this.failedSections.size,
      queued: this.loadingQueue.length,
      processing: this.isProcessingQueue
    };
  }
}

/**
 * 🎯 Unified Interactions Manager
 * Orchestrates all interaction systems
 */
class UnifiedInteractionsManager extends FeatureManager {
  constructor(config = {}) {
    super('Unified Interactions', {
      autoStart: true,
      storage: false
    });
    
    this.config = config;
    
    // Initialize subsystems
    this.microInteractions = new UnifiedMicroInteractionManager();
    this.imageLoader = new UnifiedImageLoader();
    this.sectionLoader = new UnifiedSectionLoader(config.sectionLoader);
    
    this.init();
  }

  async init() {
    try {
      this.setupIntegrations();
      this.setupGlobalEvents();
      
      Logger.info('Unified Interactions initialized');
    } catch (error) {
      Logger.error('Unified Interactions initialization failed', error);
    }
  }

  setupIntegrations() {
    // Image loader - Section loader integration
    this.sectionLoader.on('sectionLoaded', (data) => {
      // Re-scan for new images in loaded sections
      const newImages = data.section.querySelectorAll('[data-src], [data-lazy]');
      newImages.forEach(img => {
        this.imageLoader.setupImages();
      });
    });
    
    // Micro-interactions - Section integration
    this.sectionLoader.on('sectionLoaded', (data) => {
      // Re-initialize interactions for new content
      this.microInteractions.initMagneticButtons();
      this.microInteractions.initRippleEffects();
    });
  }

  setupGlobalEvents() {
    // Performance monitoring
    this.monitorPerformance();
    
    // Error handling
    this.setupErrorHandling();
  }

  monitorPerformance() {
    // Monitor interaction performance
    let interactionCount = 0;
    let lastResetTime = Date.now();
    
    document.addEventListener('click', () => {
      interactionCount++;
      
      // Reset counter every minute
      if (Date.now() - lastResetTime > 60000) {
        Logger.debug('Interaction rate', { count: interactionCount, duration: '1min' });
        interactionCount = 0;
        lastResetTime = Date.now();
      }
    });
  }

  setupErrorHandling() {
    // Global interaction error handler
    window.addEventListener('error', (e) => {
      if (e.target.closest('[data-interactive]')) {
        Logger.error('Interactive element error', {
          element: e.target.tagName,
          error: e.message
        });
      }
    });
  }

  // Public API
  getStatus() {
    return {
      microInteractions: this.microInteractions.isInitialized,
      imageLoader: this.imageLoader.loadedImages.size,
      sectionLoader: this.sectionLoader.getSectionStatus(),
      performance: this.microInteractions.performanceMode
    };
  }

  retryFailedLoads() {
    this.imageLoader.retryFailedImages();
    this.sectionLoader.retrySections();
  }

  preloadCriticalContent(images = [], sections = []) {
    if (images.length > 0) {
      this.imageLoader.preloadImages(images);
    }
    
    if (sections.length > 0) {
      sections.forEach(id => this.sectionLoader.loadSectionById(id));
    }
  }
}

// Export classes and create global instance
export {
  UnifiedMicroInteractionManager,
  UnifiedImageLoader,
  UnifiedSectionLoader,
  UnifiedInteractionsManager
};

// Auto-initialize if not in module context
if (typeof window !== 'undefined' && !window.unifiedInteractions) {
  window.unifiedInteractions = new UnifiedInteractionsManager();
}