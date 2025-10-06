/**
 * 🎭 Micro-Interactions Manager
 * Advanced micro-interactions and visual feedback systems
 */

class MicroInteractionManager {
  constructor() {
    this.isInitialized = false;
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

  init() {
    if (this.isInitialized) return;
    
    try {
      this.initMagneticButtons();
      this.initRippleEffects();
      this.initAdvancedHoverEffects();
      this.initClickFeedback();
      this.initFormInteractions();
      this.initScrollInteractions();
      
      this.isInitialized = true;
      console.log('✨ Micro-Interactions Manager initialized');
    } catch (error) {
      console.warn('⚠️ Micro-Interactions Manager initialization failed:', error);
    }
  }

  detectPerformanceMode() {
    // Detect device performance capabilities
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const memoryInfo = navigator.deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 4;
    
    if (connection?.effectiveType === '2g' || memoryInfo < 2 || cores < 4) {
      return 'performance';
    }
    
    return 'quality';
  }

  // 🧲 Magnetic Button Effects
  initMagneticButtons() {
    const magneticElements = document.querySelectorAll('.btn, .magnetic, [data-magnetic]');
    
    magneticElements.forEach(element => {
      if (this.config.reducedMotion) return;
      
      const handleMouseMove = (e) => {
        if (this.performanceMode === 'performance') return;
        
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
      };
      
      const handleMouseLeave = () => {
        element.style.transform = '';
        element.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
        
        setTimeout(() => {
          element.style.transition = '';
        }, 500);
      };
      
      element.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('mouseleave', handleMouseLeave);
      
      // Store for cleanup
      this.interactions.set(element, { handleMouseMove, handleMouseLeave });
    });
  }

  // 💫 Ripple Effects
  initRippleEffects() {
    const rippleElements = document.querySelectorAll('.btn, .card, .project-card, [data-ripple]');
    
    rippleElements.forEach(element => {
      element.style.position = 'relative';
      element.style.overflow = 'hidden';
      
      const handleClick = (e) => {
        if (this.config.reducedMotion) return;
        
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          pointer-events: none;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          transform: scale(0);
          animation: ripple 0.6s ease-out;
          z-index: 1;
        `;
        
        element.appendChild(ripple);
        
        // Haptic feedback
        if (this.config.hapticEnabled) {
          navigator.vibrate(10);
        }
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
      };
      
      element.addEventListener('click', handleClick);
      this.interactions.set(element, { handleClick });
    });
  }

  // ✨ Advanced Hover Effects
  initAdvancedHoverEffects() {
    const hoverElements = document.querySelectorAll('.project-card, .skill-card, .cert-card');
    
    hoverElements.forEach(element => {
      if (this.config.reducedMotion) return;
      
      const handleMouseEnter = () => {
        element.style.transform = `scale(${this.config.hoverScale}) translateY(-5px)`;
        element.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
        element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Add glow effect
        element.style.filter = 'brightness(1.05)';
      };
      
      const handleMouseLeave = () => {
        element.style.transform = '';
        element.style.boxShadow = '';
        element.style.filter = '';
      };
      
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
    });
  }

  // 👆 Click Feedback
  initClickFeedback() {
    const clickElements = document.querySelectorAll('button, .btn, a[href], .clickable');
    
    clickElements.forEach(element => {
      const handleMouseDown = () => {
        if (this.config.reducedMotion) return;
        element.style.transform = `scale(${this.config.clickScale})`;
        element.style.transition = 'transform 0.1s ease';
      };
      
      const handleMouseUp = () => {
        element.style.transform = '';
        element.style.transition = 'transform 0.2s ease';
      };
      
      element.addEventListener('mousedown', handleMouseDown);
      element.addEventListener('mouseup', handleMouseUp);
      element.addEventListener('mouseleave', handleMouseUp); // Reset if mouse leaves while pressed
    });
  }

  // 📝 Form Interactions
  initFormInteractions() {
    const formInputs = document.querySelectorAll('input, textarea, select');
    
    formInputs.forEach(input => {
      const container = input.closest('.form-group') || input.parentElement;
      
      const handleFocus = () => {
        container.style.transform = 'translateY(-2px)';
        container.style.boxShadow = '0 8px 25px rgba(147, 51, 234, 0.15)';
        container.style.borderColor = 'var(--primary-color, #9333ea)';
        container.style.transition = 'all 0.3s ease';
      };
      
      const handleBlur = () => {
        container.style.transform = '';
        container.style.boxShadow = '';
        container.style.borderColor = '';
      };
      
      // Real-time validation feedback
      const handleInput = () => {
        if (input.validity.valid) {
          input.style.borderColor = '#10b981'; // Green
          this.showValidationIcon(input, '✓');
        } else if (input.value.length > 0) {
          input.style.borderColor = '#ef4444'; // Red  
          this.showValidationIcon(input, '✗');
        } else {
          input.style.borderColor = '';
          this.removeValidationIcon(input);
        }
      };
      
      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);
      input.addEventListener('input', handleInput);
    });
  }

  showValidationIcon(input, icon) {
    let iconElement = input.nextElementSibling;
    if (!iconElement || !iconElement.classList.contains('validation-icon')) {
      iconElement = document.createElement('span');
      iconElement.classList.add('validation-icon');
      iconElement.style.cssText = `
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        font-weight: bold;
        pointer-events: none;
        z-index: 10;
      `;
      input.parentElement.style.position = 'relative';
      input.parentElement.appendChild(iconElement);
    }
    
    iconElement.textContent = icon;
    iconElement.style.color = icon === '✓' ? '#10b981' : '#ef4444';
  }

  removeValidationIcon(input) {
    const iconElement = input.nextElementSibling;
    if (iconElement && iconElement.classList.contains('validation-icon')) {
      iconElement.remove();
    }
  }

  // 📜 Scroll Interactions
  initScrollInteractions() {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.updateScrollProgress();
          this.updateParallaxElements();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  updateScrollProgress() {
    const scrollTop = window.pageYOffset;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = (scrollTop / documentHeight) * 100;
    
    // Update scroll progress bar
    let progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.className = 'scroll-progress';
      progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #9333ea, #7c3aed);
        z-index: 9999;
        transition: width 0.1s ease;
      `;
      document.body.appendChild(progressBar);
    }
    
    progressBar.style.width = `${scrollProgress}%`;
  }

  updateParallaxElements() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    const scrollTop = window.pageYOffset;
    
    parallaxElements.forEach(element => {
      const speed = parseFloat(element.dataset.parallax) || 0.5;
      const yPos = -(scrollTop * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  }

  // 🎮 Public Methods
  enableHapticFeedback() {
    this.config.hapticEnabled = true && ('vibrate' in navigator);
  }

  disableHapticFeedback() {
    this.config.hapticEnabled = false;
  }

  setPerformanceMode(mode) {
    this.performanceMode = mode;
    if (mode === 'performance') {
      this.disableExpensiveEffects();
    }
  }

  disableExpensiveEffects() {
    // Disable magnetic effects and reduce animation complexity
    const magneticElements = document.querySelectorAll('[data-magnetic]');
    magneticElements.forEach(el => {
      el.style.transform = '';
      el.removeEventListener('mousemove', this.interactions.get(el)?.handleMouseMove);
    });
  }

  // 🧹 Cleanup
  destroy() {
    this.interactions.forEach((handlers, element) => {
      Object.values(handlers).forEach(handler => {
        element.removeEventListener('mousemove', handler);
        element.removeEventListener('mouseleave', handler);
        element.removeEventListener('click', handler);
        element.removeEventListener('mouseenter', handler);
        element.removeEventListener('mousedown', handler);
        element.removeEventListener('mouseup', handler);
      });
    });
    
    this.interactions.clear();
    this.isInitialized = false;
  }
}

// 🎯 Enhanced Loading States Manager
class LoadingStateManager {
  constructor() {
    this.activeLoaders = new Set();
    this.init();
  }

  init() {
    this.createSkeletonStyles();
    this.initImageLoadingStates();
    this.initSectionLoadingStates();
  }

  createSkeletonStyles() {
    if (document.querySelector('#skeleton-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'skeleton-styles';
    styles.textContent = `
      .skeleton {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: skeleton-loading 1.5s infinite;
      }
      
      .dark .skeleton {
        background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
        background-size: 200% 100%;
      }
      
      @keyframes skeleton-loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      
      .skeleton-text {
        height: 1em;
        border-radius: 4px;
        margin: 0.5em 0;
      }
      
      .skeleton-avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
      }
      
      .skeleton-card {
        height: 200px;
        border-radius: 12px;
        margin: 1em 0;
      }
    `;
    
    document.head.appendChild(styles);
  }

  createSkeleton(type, container) {
    const skeleton = document.createElement('div');
    skeleton.className = `skeleton skeleton-${type}`;
    
    switch (type) {
      case 'card':
        skeleton.innerHTML = `
          <div class="p-6 space-y-4">
            <div class="skeleton skeleton-text" style="width: 70%"></div>
            <div class="skeleton skeleton-text" style="width: 90%"></div>
            <div class="skeleton skeleton-text" style="width: 60%"></div>
          </div>
        `;
        break;
      case 'text':
        skeleton.style.height = '1em';
        break;
      case 'avatar':
        skeleton.className += ' skeleton-avatar';
        break;
    }
    
    container.appendChild(skeleton);
    this.activeLoaders.add(skeleton);
    
    return skeleton;
  }

  initImageLoadingStates() {
    const images = document.querySelectorAll('img[data-src], img[src]');
    
    images.forEach(img => {
      if (!img.complete) {
        const skeleton = this.createSkeleton('card', img.parentElement);
        img.style.display = 'none';
        
        const handleLoad = () => {
          skeleton.style.opacity = '0';
          skeleton.style.transition = 'opacity 0.3s ease';
          
          setTimeout(() => {
            skeleton.remove();
            img.style.display = '';
            img.style.opacity = '0';
            img.style.animation = 'fadeIn 0.5s ease forwards';
            this.activeLoaders.delete(skeleton);
          }, 300);
        };
        
        img.addEventListener('load', handleLoad);
        img.addEventListener('error', () => {
          skeleton.remove();
          this.activeLoaders.delete(skeleton);
        });
      }
    });
  }

  initSectionLoadingStates() {
    const sections = document.querySelectorAll('section[data-lazy]');
    
    sections.forEach(section => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadSection(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '100px' });
      
      observer.observe(section);
    });
  }

  loadSection(section) {
    const skeleton = this.createSkeleton('card', section);
    
    // Simulate section loading
    setTimeout(() => {
      skeleton.style.opacity = '0';
      skeleton.style.transition = 'opacity 0.5s ease';
      
      setTimeout(() => {
        skeleton.remove();
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
        this.activeLoaders.delete(skeleton);
      }, 500);
    }, Math.random() * 1000 + 500);
  }

  showLoader(container, type = 'card') {
    return this.createSkeleton(type, container);
  }

  hideLoader(loader) {
    if (this.activeLoaders.has(loader)) {
      loader.style.opacity = '0';
      loader.style.transition = 'opacity 0.3s ease';
      
      setTimeout(() => {
        loader.remove();
        this.activeLoaders.delete(loader);
      }, 300);
    }
  }

  hideAllLoaders() {
    this.activeLoaders.forEach(loader => this.hideLoader(loader));
  }
}

// 📱 Mobile Gesture Manager
class MobileGestureManager {
  constructor() {
    this.gestures = new Map();
    this.init();
  }

  init() {
    this.initSwipeNavigation();
    this.initPinchZoom();
    this.initLongPress();
    this.initTouchFeedback();
  }

  initSwipeNavigation() {
    let startY = 0;
    let startX = 0;
    
    document.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
      if (!startY || !startX) return;
      
      const currentY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      const diffY = startY - currentY;
      const diffX = startX - currentX;
      
      // Horizontal swipe detection
      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (Math.abs(diffX) > 50) {
          if (diffX > 0) {
            this.handleSwipeLeft();
          } else {
            this.handleSwipeRight();
          }
        }
      }
    }, { passive: true });
  }

  handleSwipeLeft() {
    // Navigate to next section or page
    const sections = document.querySelectorAll('section[id]');
    const currentSection = this.getCurrentSection();
    const currentIndex = Array.from(sections).indexOf(currentSection);
    
    if (currentIndex < sections.length - 1) {
      sections[currentIndex + 1].scrollIntoView({ 
        behavior: 'smooth',
        block: 'start' 
      });
    }
  }

  handleSwipeRight() {
    // Navigate to previous section
    const sections = document.querySelectorAll('section[id]');
    const currentSection = this.getCurrentSection();
    const currentIndex = Array.from(sections).indexOf(currentSection);
    
    if (currentIndex > 0) {
      sections[currentIndex - 1].scrollIntoView({ 
        behavior: 'smooth',
        block: 'start' 
      });
    }
  }

  getCurrentSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    
    for (let section of sections) {
      const rect = section.getBoundingClientRect();
      const absoluteTop = rect.top + window.scrollY;
      
      if (scrollPosition >= absoluteTop && scrollPosition <= absoluteTop + section.offsetHeight) {
        return section;
      }
    }
    
    return sections[0];
  }

  initPinchZoom() {
    const zoomableElements = document.querySelectorAll('.project-card img, [data-zoomable]');
    
    zoomableElements.forEach(element => {
      let scale = 1;
      let initialDistance = 0;
      
      element.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
          initialDistance = this.getDistance(e.touches[0], e.touches[1]);
        }
      });
      
      element.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
          e.preventDefault();
          
          const currentDistance = this.getDistance(e.touches[0], e.touches[1]);
          const scaleRatio = currentDistance / initialDistance;
          scale = Math.min(Math.max(scaleRatio, 0.5), 3);
          
          element.style.transform = `scale(${scale})`;
          element.style.transformOrigin = 'center';
          element.style.transition = 'transform 0.1s ease';
        }
      });
      
      element.addEventListener('touchend', () => {
        scale = 1;
        element.style.transform = '';
        element.style.transition = 'transform 0.3s ease';
      });
    });
  }

  getDistance(touch1, touch2) {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  initLongPress() {
    const longPressElements = document.querySelectorAll('.project-card, [data-longpress]');
    
    longPressElements.forEach(element => {
      let pressTimer;
      
      element.addEventListener('touchstart', (e) => {
        pressTimer = setTimeout(() => {
          this.handleLongPress(element, e);
          navigator.vibrate && navigator.vibrate(50);
        }, 800);
      });
      
      element.addEventListener('touchend', () => {
        clearTimeout(pressTimer);
      });
      
      element.addEventListener('touchmove', () => {
        clearTimeout(pressTimer);
      });
    });
  }

  handleLongPress(element, event) {
    // Show context menu or additional options
    const contextMenu = document.createElement('div');
    contextMenu.className = 'context-menu';
    contextMenu.style.cssText = `
      position: fixed;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      padding: 8px 0;
      z-index: 10000;
      min-width: 150px;
      animation: contextMenuShow 0.2s ease;
    `;
    
    const menuItems = [
      { text: '📱 Share', action: () => this.shareElement(element) },
      { text: '🔍 View Details', action: () => this.viewDetails(element) },
      { text: '⭐ Favorite', action: () => this.toggleFavorite(element) }
    ];
    
    menuItems.forEach(item => {
      const menuItem = document.createElement('div');
      menuItem.textContent = item.text;
      menuItem.style.cssText = `
        padding: 12px 16px;
        cursor: pointer;
        transition: background 0.2s ease;
      `;
      
      menuItem.addEventListener('click', () => {
        item.action();
        contextMenu.remove();
      });
      
      menuItem.addEventListener('touchend', (e) => {
        e.preventDefault();
        item.action();
        contextMenu.remove();
      });
      
      contextMenu.appendChild(menuItem);
    });
    
    // Position context menu
    const touch = event.touches[0];
    contextMenu.style.left = `${touch.clientX}px`;
    contextMenu.style.top = `${touch.clientY - 50}px`;
    
    document.body.appendChild(contextMenu);
    
    // Remove on outside click
    setTimeout(() => {
      document.addEventListener('click', () => contextMenu.remove(), { once: true });
      document.addEventListener('touchstart', () => contextMenu.remove(), { once: true });
    }, 100);
  }

  shareElement(element) {
    if (navigator.share) {
      navigator.share({
        title: element.querySelector('h3, h2')?.textContent || 'Portfolio Item',
        text: element.querySelector('p')?.textContent || 'Check out this portfolio item',
        url: window.location.href
      });
    }
  }

  viewDetails(element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    element.classList.add('highlighted');
    setTimeout(() => element.classList.remove('highlighted'), 2000);
  }

  toggleFavorite(element) {
    const isFavorited = element.classList.contains('favorited');
    element.classList.toggle('favorited');
    
    // Visual feedback
    const heart = document.createElement('div');
    heart.textContent = '❤️';
    heart.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 24px;
      animation: heartPop 0.5s ease;
      pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.appendChild(heart);
    
    setTimeout(() => heart.remove(), 500);
  }

  initTouchFeedback() {
    const touchElements = document.querySelectorAll('button, .btn, .card, a[href]');
    
    touchElements.forEach(element => {
      element.addEventListener('touchstart', () => {
        element.style.transform = 'scale(0.98)';
        element.style.transition = 'transform 0.1s ease';
      }, { passive: true });
      
      element.addEventListener('touchend', () => {
        element.style.transform = '';
        element.style.transition = 'transform 0.2s ease';
      }, { passive: true });
    });
  }
}

// 🚀 Initialize All Systems
export function initAdvancedInteractions() {
  try {
    // Initialize managers
    window.microInteractionManager = new MicroInteractionManager();
    window.loadingStateManager = new LoadingStateManager();
    
    // Initialize mobile gestures only on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      window.mobileGestureManager = new MobileGestureManager();
    }
    
    // Add required styles
    addInteractionStyles();
    
    console.log('🎭 Advanced Interactions initialized successfully!');
    
    return {
      microInteractions: window.microInteractionManager,
      loadingStates: window.loadingStateManager,
      mobileGestures: window.mobileGestureManager
    };
    
  } catch (error) {
    console.error('❌ Failed to initialize Advanced Interactions:', error);
    return null;
  }
}

function addInteractionStyles() {
  if (document.querySelector('#advanced-interaction-styles')) return;
  
  const styles = document.createElement('style');
  styles.id = 'advanced-interaction-styles';
  styles.textContent = `
    /* Ripple Animation */
    @keyframes ripple {
      0% { transform: scale(0); opacity: 1; }
      100% { transform: scale(1); opacity: 0; }
    }
    
    /* Fade In Animation */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    /* Context Menu Animation */
    @keyframes contextMenuShow {
      from { opacity: 0; transform: translateY(-10px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    
    /* Heart Pop Animation */
    @keyframes heartPop {
      0% { transform: scale(0); }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }
    
    /* Highlighted Element */
    .highlighted {
      outline: 3px solid #9333ea;
      outline-offset: 5px;
      border-radius: 12px;
      transition: outline 0.3s ease;
    }
    
    /* Favorited Element */
    .favorited {
      border: 2px solid #ef4444;
      box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
    }
    
    /* Context Menu Hover */
    .context-menu div:hover {
      background: #f3f4f6;
    }
    
    .dark .context-menu {
      background: #374151;
      color: white;
    }
    
    .dark .context-menu div:hover {
      background: #4b5563;
    }
    
    /* Improved button states */
    .btn, button {
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .btn:active, button:active {
      transform: scale(0.95);
    }
    
    /* Enhanced card hover states */
    .project-card, .skill-card, .cert-card {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    /* Scroll progress bar responsive */
    .scroll-progress {
      box-shadow: 0 0 10px rgba(147, 51, 234, 0.5);
    }
  `;
  
  document.head.appendChild(styles);
}

export { MicroInteractionManager, LoadingStateManager, MobileGestureManager };