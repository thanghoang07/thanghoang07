import './style.css'
import { initApp } from './app.js'
import { initNavigation } from './navigation.js'
import { initAnimations } from './animations.js'
import { addOptimizedTypingEffect, addOptimizedCounterEffect, initAnimationOptimizer } from './animation-optimizer.js'
import { initWorkExpTabs } from './work-exp-tabs.js'
import { initImageLoader } from './image-loader.js'
import { initAnalytics } from './analytics.js'
import { initErrorHandler, getErrorHandler } from './error-handler.js'
import { initSectionLazyLoader } from './section-lazy-loader.js'
import BrowserPerformanceMonitor from './performance-monitor.js'
import { initAdvancedInteractions } from './micro-interactions.js'
import { initAdvancedThemes } from './advanced-themes.js'

// Khởi tạo ứng dụng khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
  // Initialize error handler first to catch any initialization errors
  initErrorHandler()
  
  try {
    // Initialize core app functionality
    initApp()
    initNavigation()
    
    // Initialize performance optimizations
    initAnimationOptimizer()
    
    // Initialize animations with optimization
    initAnimations()

    // Initialize progressive image loading
    initImageLoader()

    // Initialize section lazy loading
    initSectionLazyLoader({
      rootMargin: '50px 0px',
      threshold: 0.1
    })

    // Initialize advanced UX/UI improvements
    initAdvancedInteractions()
    
    // Initialize advanced theme system
    initAdvancedThemes()

    // Initialize analytics (replace with your actual GA4 measurement ID)
    // initAnalytics('G-XXXXXXXXXX')

    // Add optimized effects with delay
    setTimeout(() => {
      addOptimizedTypingEffect()
    }, 1000)

    addOptimizedCounterEffect()

    // Initialize tab functionality
    initWorkExpTabs()
    
    console.log('✅ Portfolio initialization completed successfully')
    
  } catch (error) {
    console.error('❌ Portfolio initialization failed:', error)
    
    // Show user-friendly error message
    const errorHandler = getErrorHandler()
    if (errorHandler) {
      errorHandler.reportError('Application initialization failed', {
        error: error.message,
        stack: error.stack
      })
    }
  }
})
