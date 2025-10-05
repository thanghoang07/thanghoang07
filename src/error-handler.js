/**
 * Comprehensive Error Handling System
 */

class ErrorHandler {
  constructor() {
    this.errors = [];
    this.maxErrors = 50;
    this.retryAttempts = new Map();
    this.maxRetries = 3;
    this.debug = process.env.NODE_ENV === 'development';
    
    this.init();
  }

  init() {
    this.setupGlobalErrorHandlers();
    this.setupNetworkErrorHandling();
    this.setupImageErrorHandling();
    this.setupPromiseRejectionHandling();
    this.setupResourceLoadingErrors();
  }

  setupGlobalErrorHandlers() {
    // JavaScript runtime errors
    window.addEventListener('error', (event) => {
      this.handleJavaScriptError({
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
        stack: event.error?.stack,
        timestamp: Date.now(),
        type: 'javascript'
      });
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handlePromiseRejection({
        reason: event.reason,
        promise: event.promise,
        timestamp: Date.now(),
        type: 'promise_rejection'
      });
    });

    // Resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window && event.target.tagName) {
        this.handleResourceError({
          element: event.target.tagName.toLowerCase(),
          source: event.target.src || event.target.href,
          message: 'Failed to load resource',
          timestamp: Date.now(),
          type: 'resource'
        });
      }
    }, true);
  }

  setupNetworkErrorHandling() {
    // Intercept fetch requests
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const url = args[0];
      const options = args[1] || {};
      
      try {
        const response = await originalFetch(...args);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return response;
      } catch (error) {
        this.handleNetworkError({
          url: url,
          method: options.method || 'GET',
          error: error.message,
          status: error.status,
          timestamp: Date.now(),
          type: 'network'
        });
        
        // Try to retry the request
        const retryKey = `${options.method || 'GET'}:${url}`;
        const retryCount = this.retryAttempts.get(retryKey) || 0;
        
        if (retryCount < this.maxRetries && this.shouldRetry(error)) {
          this.retryAttempts.set(retryKey, retryCount + 1);
          
          // Exponential backoff
          const delay = Math.pow(2, retryCount) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          
          return window.fetch(...args);
        }
        
        throw error;
      }
    };
  }

  setupImageErrorHandling() {
    // Handle image loading errors with retry mechanism
    document.addEventListener('error', (event) => {
      const target = event.target;
      
      if (target.tagName === 'IMG') {
        const retryCount = parseInt(target.dataset.retryCount || '0');
        
        if (retryCount < this.maxRetries) {
          target.dataset.retryCount = (retryCount + 1).toString();
          
          // Try reloading after delay
          setTimeout(() => {
            const originalSrc = target.dataset.originalSrc || target.src;
            target.src = '';
            target.src = originalSrc + '?retry=' + Date.now();
          }, 1000 * retryCount);
          
          return;
        }
        
        // Max retries reached, show fallback
        this.handleImageError(target);
      }
    }, true);
  }

  setupPromiseRejectionHandling() {
    // Enhanced promise rejection handling
    const originalPromiseResolve = Promise.resolve;
    const originalPromiseReject = Promise.reject;
    
    Promise.resolve = function(value) {
      return originalPromiseResolve.call(this, value);
    };
    
    Promise.reject = function(reason) {
      // Log promise rejections for debugging
      if (process.env.NODE_ENV === 'development') {
        console.warn('Promise rejected:', reason);
      }
      
      return originalPromiseReject.call(this, reason);
    };
  }

  setupResourceLoadingErrors() {
    // Monitor critical resource loading
    const criticalResources = ['link[rel="stylesheet"]', 'script[src]'];
    
    criticalResources.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        element.addEventListener('error', () => {
          this.handleCriticalResourceError({
            type: element.tagName.toLowerCase(),
            source: element.src || element.href,
            timestamp: Date.now()
          });
        });
      });
    });
  }

  handleJavaScriptError(errorInfo) {
    this.logError('JavaScript Error', errorInfo);
    
    // Try to recover from common errors
    if (errorInfo.message.includes('Cannot read property') || 
        errorInfo.message.includes('is not defined')) {
      this.attemptGracefulRecovery(errorInfo);
    }
    
    this.showUserFriendlyError('Something went wrong. Please refresh the page.');
  }

  handleNetworkError(errorInfo) {
    this.logError('Network Error', errorInfo);
    
    // Show appropriate message based on error type
    if (errorInfo.status >= 500) {
      this.showUserFriendlyError('Server error. Please try again later.');
    } else if (errorInfo.status === 404) {
      this.showUserFriendlyError('Resource not found.');
    } else {
      this.showUserFriendlyError('Connection error. Please check your internet connection.');
    }
  }

  handleImageError(img) {
    // Create fallback image
    const fallbackSrc = this.generateFallbackImage(img);
    img.src = fallbackSrc;
    img.classList.add('error-fallback');
    
    this.logError('Image Load Error', {
      src: img.dataset.originalSrc || img.src,
      alt: img.alt,
      timestamp: Date.now()
    });
  }

  handlePromiseRejection(errorInfo) {
    this.logError('Promise Rejection', errorInfo);
    
    // Prevent default behavior for handled rejections
    if (errorInfo.reason?.handled) {
      return;
    }
    
    this.showUserFriendlyError('An unexpected error occurred.');
  }

  handleResourceError(errorInfo) {
    this.logError('Resource Error', errorInfo);
    
    // Try to reload critical resources
    if (errorInfo.element === 'link' && errorInfo.source?.includes('.css')) {
      this.reloadStylesheet(errorInfo.source);
    }
  }

  handleCriticalResourceError(errorInfo) {
    this.logError('Critical Resource Error', errorInfo);
    this.showUserFriendlyError('Failed to load required resources. Please refresh the page.');
  }

  attemptGracefulRecovery(errorInfo) {
    try {
      // Re-initialize core functionality
      if (typeof window.initApp === 'function') {
        setTimeout(() => {
          window.initApp();
        }, 1000);
      }
    } catch (error) {
      console.error('Recovery attempt failed:', error);
    }
  }

  shouldRetry(error) {
    // Don't retry client errors (4xx) except 429
    if (error.status >= 400 && error.status < 500 && error.status !== 429) {
      return false;
    }
    
    // Retry network errors and server errors
    return true;
  }

  reloadStylesheet(href) {
    const link = document.querySelector(`link[href*="${href}"]`);
    if (link) {
      const newLink = link.cloneNode();
      newLink.href = href + '?reload=' + Date.now();
      link.parentNode.insertBefore(newLink, link.nextSibling);
      link.remove();
    }
  }

  generateFallbackImage(img) {
    const width = img.offsetWidth || 400;
    const height = img.offsetHeight || 300;
    
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#9ca3af" text-anchor="middle" dy=".3em">
          Image unavailable
        </text>
        <path d="M${width/2-10} ${height/2-10} L${width/2+10} ${height/2+10} M${width/2+10} ${height/2-10} L${width/2-10} ${height/2+10}" 
              stroke="#9ca3af" stroke-width="2"/>
      </svg>
    `)}`;
  }

  showUserFriendlyError(message, type = 'error', duration = 5000) {
    // Remove existing error notifications
    document.querySelectorAll('.error-notification').forEach(el => el.remove());
    
    const notification = document.createElement('div');
    notification.className = `error-notification error-notification-${type}`;
    notification.innerHTML = `
      <div class="error-content">
        <span class="error-icon">${type === 'error' ? '⚠️' : 'ℹ️'}</span>
        <span class="error-message">${message}</span>
        <button class="error-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after duration
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, duration);
    
    // Animate in
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
  }

  logError(category, errorInfo) {
    const errorEntry = {
      id: Date.now() + Math.random(),
      category,
      ...errorInfo,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: Date.now()
    };
    
    this.errors.unshift(errorEntry);
    
    // Keep only the latest errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }
    
    if (this.debug) {
      console.error(`[${category}]`, errorInfo);
    }
    
    // Send to analytics if available
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: `${category}: ${errorInfo.message || errorInfo.error || 'Unknown error'}`,
        fatal: category === 'Critical Resource Error'
      });
    }
  }

  getErrorReport() {
    return {
      errors: this.errors,
      totalErrors: this.errors.length,
      errorsByCategory: this.getErrorsByCategory(),
      lastError: this.errors[0] || null
    };
  }

  getErrorsByCategory() {
    const categories = {};
    this.errors.forEach(error => {
      categories[error.category] = (categories[error.category] || 0) + 1;
    });
    return categories;
  }

  clearErrors() {
    this.errors = [];
    this.retryAttempts.clear();
  }

  // Public methods for manual error reporting
  reportError(message, details = {}) {
    this.handleJavaScriptError({
      message,
      ...details,
      timestamp: Date.now(),
      type: 'manual'
    });
  }

  reportWarning(message, details = {}) {
    this.logError('Warning', {
      message,
      ...details,
      timestamp: Date.now()
    });
    
    if (this.debug) {
      this.showUserFriendlyError(message, 'warning', 3000);
    }
  }
}

// CSS for error notifications
const errorNotificationCSS = `
.error-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #fee2e2;
  border: 1px solid #fca5a5;
  border-radius: 8px;
  padding: 0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 10000;
  max-width: 400px;
  opacity: 0;
  transform: translateX(100%);
  transition: all 0.3s ease-out;
}

.error-notification.show {
  opacity: 1;
  transform: translateX(0);
}

.error-notification-warning {
  background: #fef3cd;
  border-color: #fbbf24;
}

.error-content {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 8px;
}

.error-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.error-message {
  flex: 1;
  font-size: 14px;
  color: #374151;
  line-height: 1.4;
}

.error-close {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.error-close:hover {
  background: rgba(0, 0, 0, 0.1);
}

.error-fallback {
  filter: grayscale(100%);
  opacity: 0.7;
}

/* Dark mode support */
html.dark .error-notification {
  background: #7f1d1d;
  border-color: #dc2626;
}

html.dark .error-notification-warning {
  background: #78350f;
  border-color: #f59e0b;
}

html.dark .error-message {
  color: #f9fafb;
}
`;

// Inject CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = errorNotificationCSS;
document.head.appendChild(styleSheet);

// Initialize error handler
let errorHandler;

export function initErrorHandler() {
  if (!errorHandler) {
    errorHandler = new ErrorHandler();
  }
  return errorHandler;
}

export function getErrorHandler() {
  return errorHandler;
}

// Utility functions for common error scenarios
export function safeQuerySelector(selector, context = document) {
  try {
    return context.querySelector(selector);
  } catch (error) {
    errorHandler?.reportWarning(`Invalid selector: ${selector}`);
    return null;
  }
}

export function safeAddEventListener(element, event, handler, options = {}) {
  if (!element) {
    errorHandler?.reportWarning('Cannot add event listener to null element');
    return;
  }
  
  try {
    element.addEventListener(event, handler, options);
  } catch (error) {
    errorHandler?.reportError('Failed to add event listener', { event, error: error.message });
  }
}

export function safeExecute(fn, errorMessage = 'Function execution failed') {
  try {
    return fn();
  } catch (error) {
    errorHandler?.reportError(errorMessage, { error: error.message, stack: error.stack });
    return null;
  }
}