/**
 * Google Analytics 4 Integration
 */

class Analytics {
  constructor(measurementId = 'G-XXXXXXXXXX') {
    this.measurementId = measurementId;
    this.initialized = false;
    this.debug = process.env.NODE_ENV === 'development';
    
    this.init();
  }

  async init() {
    try {
      // Check if user has consented to analytics
      const consent = this.getConsent();
      if (!consent) {
        this.showConsentBanner();
        return;
      }

      await this.loadGtagScript();
      this.setupGtag();
      this.setupEventListeners();
      this.initialized = true;
      
      if (this.debug) {
        console.log('Analytics initialized successfully');
      }
    } catch (error) {
      console.error('Failed to initialize analytics:', error);
    }
  }

  async loadGtagScript() {
    return new Promise((resolve, reject) => {
      // Check if script already exists
      if (document.querySelector(`script[src*="gtag/js?id=${this.measurementId}"]`)) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
      script.onload = resolve;
      script.onerror = reject;
      
      document.head.appendChild(script);
    });
  }

  setupGtag() {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      dataLayer.push(arguments);
    };

    gtag('js', new Date());
    gtag('config', this.measurementId, {
      anonymize_ip: true,
      cookie_flags: 'SameSite=Strict;Secure',
      send_page_view: false // We'll send this manually
    });
  }

  setupEventListeners() {
    // Track page views
    this.trackPageView();

    // Track scroll depth
    this.setupScrollTracking();

    // Track outbound links
    this.setupLinkTracking();

    // Track form interactions
    this.setupFormTracking();

    // Track error events
    this.setupErrorTracking();

    // Track performance metrics
    this.setupPerformanceTracking();
  }

  trackPageView(path = window.location.pathname) {
    if (!this.initialized) return;

    try {
      gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: path
      });

      if (this.debug) {
        console.log('Page view tracked:', path);
      }
    } catch (error) {
      console.error('Failed to track page view:', error);
    }
  }

  trackEvent(eventName, parameters = {}) {
    if (!this.initialized) {
      if (this.debug) {
        console.log('Analytics not initialized, event not tracked:', eventName);
      }
      return;
    }

    try {
      gtag('event', eventName, {
        ...parameters,
        timestamp: Date.now()
      });

      if (this.debug) {
        console.log('Event tracked:', eventName, parameters);
      }
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  setupScrollTracking() {
    const scrollPoints = [25, 50, 75, 90];
    const trackedPoints = new Set();

    const throttle = (func, wait) => {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    };

    const trackScroll = throttle(() => {
      const scrollPercent = Math.round(
        ((window.scrollY + window.innerHeight) / document.body.scrollHeight) * 100
      );

      scrollPoints.forEach(point => {
        if (scrollPercent >= point && !trackedPoints.has(point)) {
          trackedPoints.add(point);
          this.trackEvent('scroll_depth', {
            percent: point,
            page_path: window.location.pathname
          });
        }
      });
    }, 1000);

    window.addEventListener('scroll', trackScroll, { passive: true });
  }

  setupLinkTracking() {
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href) return;

      // Track external links
      if (href.startsWith('http') && !href.includes(window.location.hostname)) {
        this.trackEvent('click_external_link', {
          link_url: href,
          link_text: link.textContent.trim(),
          link_domain: new URL(href).hostname
        });
      }

      // Track email links
      if (href.startsWith('mailto:')) {
        this.trackEvent('click_email', {
          email_address: href.replace('mailto:', '')
        });
      }

      // Track phone links
      if (href.startsWith('tel:')) {
        this.trackEvent('click_phone', {
          phone_number: href.replace('tel:', '')
        });
      }

      // Track navigation clicks
      if (link.closest('nav')) {
        this.trackEvent('click_navigation', {
          link_text: link.textContent.trim(),
          link_url: href
        });
      }

      // Track social media clicks
      if (link.classList.contains('social-link') || link.closest('.social-links')) {
        const platform = this.getSocialPlatform(href);
        this.trackEvent('click_social', {
          platform: platform,
          link_url: href
        });
      }
    });
  }

  setupFormTracking() {
    // Track form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target;
      if (!form.tagName === 'FORM') return;

      this.trackEvent('form_submit', {
        form_id: form.id || 'unknown',
        form_name: form.name || 'contact_form'
      });
    });

    // Track form field interactions
    document.addEventListener('focus', (event) => {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        this.trackEvent('form_field_focus', {
          field_name: event.target.name || event.target.id,
          field_type: event.target.type
        });
      }
    }, true);
  }

  setupErrorTracking() {
    window.addEventListener('error', (event) => {
      this.trackEvent('javascript_error', {
        error_message: event.message,
        error_filename: event.filename,
        error_lineno: event.lineno,
        error_colno: event.colno
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.trackEvent('promise_rejection', {
        error_message: event.reason.toString()
      });
    });
  }

  setupPerformanceTracking() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        if ('performance' in window && 'getEntriesByType' in performance) {
          const navigation = performance.getEntriesByType('navigation')[0];
          
          this.trackEvent('performance_timing', {
            dom_content_loaded: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
            load_complete: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
            page_load_time: Math.round(navigation.loadEventEnd - navigation.fetchStart),
            dns_time: Math.round(navigation.domainLookupEnd - navigation.domainLookupStart),
            tcp_time: Math.round(navigation.connectEnd - navigation.connectStart)
          });
        }
      }, 1000);
    });
  }

  getSocialPlatform(url) {
    if (url.includes('facebook.com')) return 'facebook';
    if (url.includes('twitter.com')) return 'twitter';
    if (url.includes('linkedin.com')) return 'linkedin';
    if (url.includes('github.com')) return 'github';
    if (url.includes('instagram.com')) return 'instagram';
    return 'other';
  }

  // Consent management
  getConsent() {
    return localStorage.getItem('analytics_consent') === 'true';
  }

  setConsent(consent) {
    localStorage.setItem('analytics_consent', consent.toString());
    if (consent && !this.initialized) {
      this.init();
    }
  }

  showConsentBanner() {
    const banner = document.createElement('div');
    banner.className = 'analytics-consent-banner';
    banner.innerHTML = `
      <div class="consent-content">
        <p>We use analytics to improve your experience. Do you consent to analytics tracking?</p>
        <div class="consent-buttons">
          <button id="analytics-accept" class="btn-accept">Accept</button>
          <button id="analytics-decline" class="btn-decline">Decline</button>
        </div>
      </div>
    `;

    // Add styles
    banner.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      max-width: 300px;
      font-size: 14px;
    `;

    document.body.appendChild(banner);

    // Handle button clicks
    banner.querySelector('#analytics-accept').addEventListener('click', () => {
      this.setConsent(true);
      banner.remove();
    });

    banner.querySelector('#analytics-decline').addEventListener('click', () => {
      this.setConsent(false);
      banner.remove();
    });
  }

  // Public methods for manual tracking
  trackButtonClick(buttonName) {
    this.trackEvent('click_button', { button_name: buttonName });
  }

  trackSectionView(sectionName) {
    this.trackEvent('view_section', { section_name: sectionName });
  }

  trackLanguageChange(language) {
    this.trackEvent('change_language', { language: language });
  }

  trackThemeChange(theme) {
    this.trackEvent('change_theme', { theme: theme });
  }

  trackDownload(fileName) {
    this.trackEvent('download', { file_name: fileName });
  }
}

// Initialize analytics
let analyticsInstance;

export function initAnalytics(measurementId) {
  if (!analyticsInstance) {
    analyticsInstance = new Analytics(measurementId);
  }
  return analyticsInstance;
}

export function getAnalytics() {
  return analyticsInstance;
}