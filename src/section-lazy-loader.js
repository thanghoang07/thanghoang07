/**
 * Advanced Section Lazy Loading with Intersection Observer
 */

class SectionLazyLoader {
  constructor(options = {}) {
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
    
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.setupSectionLoaders();
    this.setupDependencyTracking();
    this.setupPerformanceOptimizations();
  }

  setupIntersectionObserver() {
    if (!('IntersectionObserver' in window)) {
      // Fallback for browsers without IntersectionObserver
      this.loadAllSections();
      return;
    }

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadSection(entry.target);
        }
      });
    }, {
      rootMargin: this.options.rootMargin,
      threshold: this.options.threshold
    });

    // Observe sections that need lazy loading
    this.observeSections();
  }

  observeSections() {
    const sections = document.querySelectorAll(`
      section[data-lazy],
      .lazy-section,
      [data-lazy-content]
    `);

    sections.forEach(section => {
      if (!section.dataset.lazyObserved) {
        section.dataset.lazyObserved = 'true';
        section.classList.add(this.options.loadingClass);
        this.observer.observe(section);
      }
    });
  }

  async loadSection(section) {
    const sectionId = section.id || `section-${Date.now()}`;
    
    if (this.loadedSections.has(sectionId)) {
      return;
    }

    // Stop observing this section
    this.observer.unobserve(section);

    try {
      // Add to loading queue
      this.loadingQueue.push({ section, sectionId });
      
      if (!this.isProcessingQueue) {
        await this.processLoadingQueue();
      }
    } catch (error) {
      this.handleSectionLoadError(section, error);
    }
  }

  async processLoadingQueue() {
    this.isProcessingQueue = true;

    while (this.loadingQueue.length > 0) {
      const batch = this.loadingQueue.splice(0, 2); // Process 2 sections at a time
      
      await Promise.allSettled(
        batch.map(({ section, sectionId }) => this.loadSectionContent(section, sectionId))
      );
      
      // Small delay between batches to prevent overwhelming the browser
      if (this.loadingQueue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    this.isProcessingQueue = false;
  }

  async loadSectionContent(section, sectionId) {
    try {
      // Check if section has external content to load
      const lazyContent = section.dataset.lazy || section.dataset.lazyContent;
      
      if (lazyContent) {
        await this.loadExternalContent(section, lazyContent);
      }

      // Load section-specific resources
      await this.loadSectionResources(section);

      // Initialize section-specific functionality
      await this.initializeSectionFeatures(section);

      // Mark as loaded
      this.markSectionAsLoaded(section, sectionId);

    } catch (error) {
      throw new Error(`Failed to load section ${sectionId}: ${error.message}`);
    }
  }

  async loadExternalContent(section, contentUrl) {
    try {
      const response = await fetch(contentUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const content = await response.text();
      
      // Insert content into section
      const contentContainer = section.querySelector('.lazy-content') || section;
      contentContainer.innerHTML = content;

      // Process any scripts in the loaded content
      this.executeScriptsInContent(contentContainer);

    } catch (error) {
      console.error('Failed to load external content:', error);
      throw error;
    }
  }

  async loadSectionResources(section) {
    const resourcePromises = [];

    // Load lazy images in this section
    const lazyImages = section.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
      resourcePromises.push(this.loadLazyImage(img));
    });

    // Load lazy stylesheets
    const lazyStyles = section.querySelectorAll('link[data-href]');
    lazyStyles.forEach(link => {
      resourcePromises.push(this.loadLazyStylesheet(link));
    });

    // Load lazy scripts
    const lazyScripts = section.querySelectorAll('script[data-src]');
    lazyScripts.forEach(script => {
      resourcePromises.push(this.loadLazyScript(script));
    });

    await Promise.allSettled(resourcePromises);
  }

  async initializeSectionFeatures(section) {
    // Initialize animations for this section
    this.initializeSectionAnimations(section);

    // Initialize interactive elements
    this.initializeSectionInteractivity(section);

    // Initialize third-party widgets if any
    await this.initializeThirdPartyWidgets(section);

    // Dispatch section loaded event
    section.dispatchEvent(new CustomEvent('sectionLoaded', {
      detail: { sectionId: section.id }
    }));
  }

  initializeSectionAnimations(section) {
    const animatedElements = section.querySelectorAll(`
      .scroll-reveal,
      .scroll-reveal-left,
      .scroll-reveal-right,
      .scroll-reveal-scale
    `);

    animatedElements.forEach(element => {
      // Add stagger delay
      const staggerIndex = Array.from(section.children).indexOf(element);
      element.style.animationDelay = `${staggerIndex * 100}ms`;
      
      // Trigger animation
      setTimeout(() => {
        element.classList.add('revealed');
      }, staggerIndex * 100);
    });
  }

  initializeSectionInteractivity(section) {
    // Initialize tooltips
    const tooltips = section.querySelectorAll('[data-tooltip]');
    tooltips.forEach(element => {
      this.initializeTooltip(element);
    });

    // Initialize modals
    const modals = section.querySelectorAll('[data-modal]');
    modals.forEach(element => {
      this.initializeModal(element);
    });

    // Initialize form validation
    const forms = section.querySelectorAll('form');
    forms.forEach(form => {
      this.initializeFormValidation(form);
    });
  }

  async initializeThirdPartyWidgets(section) {
    // Initialize Google Maps if present
    const maps = section.querySelectorAll('.google-map');
    if (maps.length > 0) {
      await this.loadGoogleMaps(maps);
    }

    // Initialize social media widgets
    const socialWidgets = section.querySelectorAll('.social-widget');
    if (socialWidgets.length > 0) {
      await this.loadSocialWidgets(socialWidgets);
    }

    // Initialize analytics widgets
    const analyticsWidgets = section.querySelectorAll('.analytics-widget');
    if (analyticsWidgets.length > 0) {
      await this.loadAnalyticsWidgets(analyticsWidgets);
    }
  }

  markSectionAsLoaded(section, sectionId) {
    section.classList.remove(this.options.loadingClass);
    section.classList.add(this.options.loadedClass);
    section.dataset.lazyLoaded = 'true';
    
    this.loadedSections.add(sectionId);

    // Trigger layout recalculation if needed
    if (section.offsetHeight === 0) {
      section.style.minHeight = 'auto';
    }
  }

  handleSectionLoadError(section, error) {
    console.error('Section load error:', error);
    
    const sectionId = section.id || 'unknown';
    const failCount = this.failedSections.get(sectionId) || 0;
    
    if (failCount < this.options.retryAttempts) {
      // Retry loading
      this.failedSections.set(sectionId, failCount + 1);
      
      setTimeout(() => {
        this.loadSection(section);
      }, this.options.retryDelay * (failCount + 1));
      
      return;
    }

    // Max retries exceeded
    section.classList.remove(this.options.loadingClass);
    section.classList.add(this.options.errorClass);
    
    // Show fallback content
    this.showSectionErrorFallback(section);
  }

  showSectionErrorFallback(section) {
    const fallback = document.createElement('div');
    fallback.className = 'section-error-fallback';
    fallback.innerHTML = `
      <div class="error-content">
        <p>Unable to load this section. <button onclick="location.reload()">Refresh page</button></p>
      </div>
    `;
    
    section.appendChild(fallback);
  }

  // Resource loading helpers
  loadLazyImage(img) {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        resolve();
      };
      image.onerror = () => {
        console.warn('Failed to load image:', img.dataset.src);
        resolve(); // Don't fail the section load for image errors
      };
      image.src = img.dataset.src;
    });
  }

  loadLazyStylesheet(link) {
    return new Promise((resolve, reject) => {
      link.href = link.dataset.href;
      link.removeAttribute('data-href');
      link.onload = resolve;
      link.onerror = reject;
    });
  }

  loadLazyScript(script) {
    return new Promise((resolve, reject) => {
      const newScript = document.createElement('script');
      newScript.src = script.dataset.src;
      newScript.onload = resolve;
      newScript.onerror = reject;
      script.parentNode.replaceChild(newScript, script);
    });
  }

  executeScriptsInContent(container) {
    const scripts = container.querySelectorAll('script');
    scripts.forEach(script => {
      const newScript = document.createElement('script');
      newScript.textContent = script.textContent;
      script.parentNode.replaceChild(newScript, script);
    });
  }

  // Widget initialization helpers
  async loadGoogleMaps(maps) {
    // Placeholder for Google Maps initialization
    console.log('Initializing Google Maps widgets:', maps.length);
  }

  async loadSocialWidgets(widgets) {
    // Placeholder for social media widgets
    console.log('Initializing social widgets:', widgets.length);
  }

  async loadAnalyticsWidgets(widgets) {
    // Placeholder for analytics widgets
    console.log('Initializing analytics widgets:', widgets.length);
  }

  initializeTooltip(element) {
    // Simple tooltip implementation
    element.addEventListener('mouseenter', (e) => {
      const tooltip = document.createElement('div');
      tooltip.className = 'lazy-tooltip';
      tooltip.textContent = element.dataset.tooltip;
      document.body.appendChild(tooltip);
      
      // Position tooltip
      const rect = element.getBoundingClientRect();
      tooltip.style.left = rect.left + 'px';
      tooltip.style.top = (rect.top - tooltip.offsetHeight - 5) + 'px';
    });
    
    element.addEventListener('mouseleave', () => {
      document.querySelectorAll('.lazy-tooltip').forEach(t => t.remove());
    });
  }

  initializeModal(element) {
    // Simple modal implementation
    element.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = element.dataset.modal;
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('show');
      }
    });
  }

  initializeFormValidation(form) {
    // Basic form validation
    form.addEventListener('submit', (e) => {
      const requiredFields = form.querySelectorAll('[required]');
      let isValid = true;
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          field.classList.add('error');
          isValid = false;
        } else {
          field.classList.remove('error');
        }
      });
      
      if (!isValid) {
        e.preventDefault();
      }
    });
  }

  setupDependencyTracking() {
    // Track section dependencies
    this.dependencies = new Map();
    
    document.querySelectorAll('[data-depends-on]').forEach(section => {
      const dependencies = section.dataset.dependsOn.split(',');
      this.dependencies.set(section.id, dependencies);
    });
  }

  setupPerformanceOptimizations() {
    // Monitor performance and adjust loading strategy
    this.performanceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.duration > 100) {
          console.warn('Slow section loading detected:', entry);
        }
      });
    });
    
    if ('PerformanceObserver' in window) {
      this.performanceObserver.observe({ entryTypes: ['measure'] });
    }
  }

  // Public API
  loadAllSections() {
    const sections = document.querySelectorAll(`
      section[data-lazy],
      .lazy-section,
      [data-lazy-content]
    `);
    
    sections.forEach(section => {
      this.loadSection(section);
    });
  }

  refresh() {
    this.observeSections();
  }

  getLoadedSections() {
    return Array.from(this.loadedSections);
  }

  getFailedSections() {
    return Array.from(this.failedSections.keys());
  }

  cleanup() {
    if (this.observer) {
      this.observer.disconnect();
    }
    
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }
    
    this.loadedSections.clear();
    this.failedSections.clear();
    this.observers.clear();
  }
}

// CSS for section lazy loading
const sectionLazyLoadingCSS = `
.section-loading {
  min-height: 200px;
  position: relative;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
}

.section-loading::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px;
  height: 40px;
  margin: -20px 0 0 -20px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #9333ea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.section-loaded {
  animation: fadeInUp 0.6s ease-out;
}

.section-error {
  background: #fee2e2;
  border: 1px solid #fca5a5;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}

.section-error-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100px;
}

.lazy-tooltip {
  position: absolute;
  background: #1f2937;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  z-index: 1000;
  pointer-events: none;
}

/* Dark mode support */
html.dark .section-loading {
  background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
}

html.dark .section-loading::before {
  border-color: #4b5563;
  border-top-color: #a855f7;
}

html.dark .section-error {
  background: #7f1d1d;
  border-color: #dc2626;
  color: #f9fafb;
}

html.dark .lazy-tooltip {
  background: #f3f4f6;
  color: #1f2937;
}
`;

// Inject CSS
if (!document.querySelector('#section-lazy-loading-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'section-lazy-loading-styles';
  styleSheet.textContent = sectionLazyLoadingCSS;
  document.head.appendChild(styleSheet);
}

// Initialize section lazy loader
let sectionLoader;

export function initSectionLazyLoader(options) {
  if (!sectionLoader) {
    sectionLoader = new SectionLazyLoader(options);
  }
  return sectionLoader;
}

export function getSectionLazyLoader() {
  return sectionLoader;
}