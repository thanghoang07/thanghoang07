/**
 * 🎨 Advanced Theme Manager
 * Multiple theme variants with smooth transitions and smart switching
 */

class AdvancedThemeManager {
  constructor() {
    this.currentTheme = 'light';
    this.themes = this.initializeThemes();
    this.observers = new Set();
    this.transitionDuration = 300;
    
    // Auto-switching configuration
    this.autoSwitching = {
      enabled: false,
      schedules: [
        { time: '06:00', theme: 'light' },
        { time: '18:00', theme: 'dark' },
        { time: '22:00', theme: 'night' }
      ]
    };
    
    this.init();
  }

  initializeThemes() {
    return {
      light: {
        name: 'Light Mode',
        icon: '☀️',
        colors: {
          primary: '#9333ea',
          secondary: '#7c3aed',
          accent: '#a855f7',
          background: '#ffffff',
          surface: '#f8fafc',
          text: '#1f2937',
          textSecondary: '#6b7280',
          border: '#e5e7eb',
          shadow: 'rgba(0, 0, 0, 0.1)',
          cardBg: '#ffffff'
        },
        css: {
          '--bg-primary': '#ffffff',
          '--bg-secondary': '#f8fafc',
          '--text-primary': '#1f2937',
          '--text-secondary': '#6b7280',
          '--border-color': '#e5e7eb',
          '--shadow': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          '--primary-color': '#9333ea',
          '--accent-color': '#a855f7'
        }
      },
      
      dark: {
        name: 'Dark Mode',
        icon: '🌙',
        colors: {
          primary: '#a855f7',
          secondary: '#8b5cf6',
          accent: '#c084fc',
          background: '#111827',
          surface: '#1f2937',
          text: '#f9fafb',
          textSecondary: '#d1d5db',
          border: '#374151',
          shadow: 'rgba(0, 0, 0, 0.3)',
          cardBg: '#1f2937'
        },
        css: {
          '--bg-primary': '#111827',
          '--bg-secondary': '#1f2937',
          '--text-primary': '#f9fafb',
          '--text-secondary': '#d1d5db',
          '--border-color': '#374151',
          '--shadow': '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
          '--primary-color': '#a855f7',
          '--accent-color': '#c084fc'
        }
      },
      
      neon: {
        name: 'Neon Glow',
        icon: '⚡',
        colors: {
          primary: '#00ff88',
          secondary: '#ff0066',
          accent: '#00d4ff',
          background: '#0a0a0a',
          surface: '#1a1a1a',
          text: '#ffffff',
          textSecondary: '#cccccc',
          border: '#333333',
          shadow: 'rgba(0, 255, 136, 0.3)',
          cardBg: '#1a1a1a'
        },
        css: {
          '--bg-primary': '#0a0a0a',
          '--bg-secondary': '#1a1a1a',
          '--text-primary': '#ffffff',
          '--text-secondary': '#cccccc',
          '--border-color': '#333333',
          '--shadow': '0 0 20px rgba(0, 255, 136, 0.3)',
          '--primary-color': '#00ff88',
          '--accent-color': '#00d4ff',
          '--neon-glow': '0 0 20px currentColor'
        }
      },
      
      minimal: {
        name: 'Minimal',
        icon: '⚪',
        colors: {
          primary: '#000000',
          secondary: '#333333',
          accent: '#666666',
          background: '#fafafa',
          surface: '#ffffff',
          text: '#000000',
          textSecondary: '#666666',
          border: '#e0e0e0',
          shadow: 'rgba(0, 0, 0, 0.05)',
          cardBg: '#ffffff'
        },
        css: {
          '--bg-primary': '#fafafa',
          '--bg-secondary': '#ffffff',
          '--text-primary': '#000000',
          '--text-secondary': '#666666',
          '--border-color': '#e0e0e0',
          '--shadow': '0 2px 4px rgba(0, 0, 0, 0.05)',
          '--primary-color': '#000000',
          '--accent-color': '#666666'
        }
      },
      
      nature: {
        name: 'Nature',
        icon: '🌿',
        colors: {
          primary: '#2d5016',
          secondary: '#5d8029',
          accent: '#8bc34a',
          background: '#f1f8e9',
          surface: '#ffffff',
          text: '#1b5e20',
          textSecondary: '#388e3c',
          border: '#c8e6c9',
          shadow: 'rgba(45, 80, 22, 0.1)',
          cardBg: '#ffffff'
        },
        css: {
          '--bg-primary': '#f1f8e9',
          '--bg-secondary': '#ffffff',
          '--text-primary': '#1b5e20',
          '--text-secondary': '#388e3c',
          '--border-color': '#c8e6c9',
          '--shadow': '0 4px 6px rgba(45, 80, 22, 0.1)',
          '--primary-color': '#2d5016',
          '--accent-color': '#8bc34a'
        }
      },
      
      sunset: {
        name: 'Sunset',
        icon: '🌅',
        colors: {
          primary: '#ff6b35',
          secondary: '#f7931e',
          accent: '#ffd23f',
          background: '#1a1423',
          surface: '#2d1b35',
          text: '#ffffff',
          textSecondary: '#e0aaff',
          border: '#3c2a4a',
          shadow: 'rgba(255, 107, 53, 0.2)',
          cardBg: '#2d1b35'
        },
        css: {
          '--bg-primary': '#1a1423',
          '--bg-secondary': '#2d1b35',
          '--text-primary': '#ffffff',
          '--text-secondary': '#e0aaff',
          '--border-color': '#3c2a4a',
          '--shadow': '0 4px 20px rgba(255, 107, 53, 0.2)',
          '--primary-color': '#ff6b35',
          '--accent-color': '#ffd23f'
        }
      }
    };
  }

  init() {
    try {
      this.loadSavedTheme();
      this.detectSystemPreference();
      this.createThemeControls();
      this.setupTransitions();
      this.initAutoSwitching();
      
      console.log('🎨 Advanced Theme Manager initialized');
    } catch (error) {
      console.error('Failed to initialize Theme Manager:', error);
    }
  }

  loadSavedTheme() {
    const saved = localStorage.getItem('portfolio-theme');
    if (saved && this.themes[saved]) {
      this.currentTheme = saved;
    } else {
      // Detect system preference
      this.currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    this.applyTheme(this.currentTheme, false);
  }

  detectSystemPreference() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', (e) => {
      if (!localStorage.getItem('portfolio-theme')) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  createThemeControls() {
    // Remove existing controls
    const existing = document.querySelector('.theme-controls');
    if (existing) existing.remove();
    
    const controls = document.createElement('div');
    controls.className = 'theme-controls';
    controls.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      gap: 8px;
      background: var(--bg-secondary, #f8fafc);
      padding: 8px;
      border-radius: 16px;
      box-shadow: var(--shadow, 0 4px 6px rgba(0,0,0,0.1));
      border: 1px solid var(--border-color, #e5e7eb);
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
    `;
    
    // Theme toggle button
    const themeButton = this.createThemeButton();
    controls.appendChild(themeButton);
    
    // Theme selector dropdown
    const themeSelector = this.createThemeSelector();
    controls.appendChild(themeSelector);
    
    // Auto-switch toggle
    const autoToggle = this.createAutoToggle();
    controls.appendChild(autoToggle);
    
    document.body.appendChild(controls);
    
    // Make draggable on mobile
    this.makeDraggable(controls);
  }

  createThemeButton() {
    const button = document.createElement('button');
    const theme = this.themes[this.currentTheme];
    
    button.innerHTML = `${theme.icon}`;
    button.title = `Current: ${theme.name}`;
    button.style.cssText = `
      width: 40px;
      height: 40px;
      border: none;
      border-radius: 12px;
      background: var(--primary-color, #9333ea);
      color: white;
      font-size: 18px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    
    // Cycle through themes on click
    button.addEventListener('click', () => {
      const themeKeys = Object.keys(this.themes);
      const currentIndex = themeKeys.indexOf(this.currentTheme);
      const nextIndex = (currentIndex + 1) % themeKeys.length;
      this.setTheme(themeKeys[nextIndex]);
    });
    
    return button;
  }

  createThemeSelector() {
    const container = document.createElement('div');
    container.style.position = 'relative';
    
    const selector = document.createElement('select');
    selector.style.cssText = `
      padding: 8px 12px;
      border: 1px solid var(--border-color, #e5e7eb);
      border-radius: 8px;
      background: var(--bg-primary, #ffffff);
      color: var(--text-primary, #1f2937);
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
      min-width: 120px;
    `;
    
    Object.entries(this.themes).forEach(([key, theme]) => {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = `${theme.icon} ${theme.name}`;
      option.selected = key === this.currentTheme;
      selector.appendChild(option);
    });
    
    selector.addEventListener('change', (e) => {
      this.setTheme(e.target.value);
    });
    
    container.appendChild(selector);
    return container;
  }

  createAutoToggle() {
    const container = document.createElement('div');
    container.style.cssText = `
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 8px;
    `;
    
    const toggle = document.createElement('input');
    toggle.type = 'checkbox';
    toggle.id = 'auto-theme';
    toggle.checked = this.autoSwitching.enabled;
    toggle.style.cssText = `
      width: 16px;
      height: 16px;
      cursor: pointer;
    `;
    
    const label = document.createElement('label');
    label.htmlFor = 'auto-theme';
    label.textContent = '🕐';
    label.title = 'Auto-switch themes';
    label.style.cssText = `
      font-size: 16px;
      cursor: pointer;
    `;
    
    toggle.addEventListener('change', (e) => {
      this.toggleAutoSwitching(e.target.checked);
    });
    
    container.appendChild(toggle);
    container.appendChild(label);
    return container;
  }

  makeDraggable(element) {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;
    
    element.addEventListener('mousedown', dragStart);
    element.addEventListener('touchstart', dragStart, { passive: false });
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, { passive: false });
    
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchend', dragEnd);
    
    function dragStart(e) {
      if (e.type === 'touchstart') {
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
      } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
      }
      
      if (e.target === element || element.contains(e.target)) {
        isDragging = true;
      }
    }
    
    function drag(e) {
      if (isDragging) {
        e.preventDefault();
        
        if (e.type === 'touchmove') {
          currentX = e.touches[0].clientX - initialX;
          currentY = e.touches[0].clientY - initialY;
        } else {
          currentX = e.clientX - initialX;
          currentY = e.clientY - initialY;
        }
        
        xOffset = currentX;
        yOffset = currentY;
        
        element.style.transform = `translate(${currentX}px, ${currentY}px)`;
      }
    }
    
    function dragEnd() {
      initialX = currentX;
      initialY = currentY;
      isDragging = false;
      
      // Snap to edges
      const rect = element.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      if (rect.right > windowWidth - 20) {
        xOffset = windowWidth - rect.width - 20;
      }
      if (rect.left < 20) {
        xOffset = 20;
      }
      if (rect.bottom > windowHeight - 20) {
        yOffset = windowHeight - rect.height - 20;
      }
      if (rect.top < 20) {
        yOffset = 20;
      }
      
      element.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
      element.style.transition = 'transform 0.3s ease';
      
      setTimeout(() => {
        element.style.transition = '';
      }, 300);
    }
  }

  setTheme(themeName, animate = true) {
    if (!this.themes[themeName]) {
      console.warn(`Theme "${themeName}" not found`);
      return;
    }
    
    const previousTheme = this.currentTheme;
    this.currentTheme = themeName;
    
    // Save preference
    localStorage.setItem('portfolio-theme', themeName);
    
    // Apply theme
    this.applyTheme(themeName, animate);
    
    // Update controls
    this.updateControls();
    
    // Notify observers
    this.notifyObservers(themeName, previousTheme);
    
    console.log(`🎨 Theme changed to: ${this.themes[themeName].name}`);
  }

  applyTheme(themeName, animate = true) {
    const theme = this.themes[themeName];
    const root = document.documentElement;
    
    // Add transition class for smooth animation
    if (animate) {
      document.body.classList.add('theme-transitioning');
      
      setTimeout(() => {
        document.body.classList.remove('theme-transitioning');
      }, this.transitionDuration);
    }
    
    // Apply CSS custom properties
    Object.entries(theme.css).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
    
    // Update body classes
    document.body.className = document.body.className
      .replace(/theme-\w+/g, '')
      .trim();
    document.body.classList.add(`theme-${themeName}`);
    
    // Update meta theme-color for mobile browsers
    this.updateMetaThemeColor(theme.colors.primary);
    
    // Apply special theme effects
    this.applyThemeEffects(themeName);
  }

  applyThemeEffects(themeName) {
    // Remove existing effect classes
    document.body.classList.remove('neon-effects', 'minimal-effects', 'nature-effects');
    
    switch (themeName) {
      case 'neon':
        document.body.classList.add('neon-effects');
        this.applyNeonEffects();
        break;
      case 'minimal':
        document.body.classList.add('minimal-effects');
        this.applyMinimalEffects();
        break;
      case 'nature':
        document.body.classList.add('nature-effects');
        this.applyNatureEffects();
        break;
    }
  }

  applyNeonEffects() {
    // Add neon glow effects to buttons and cards
    const elements = document.querySelectorAll('.btn, .card, .project-card');
    elements.forEach(el => {
      el.style.boxShadow = 'var(--neon-glow, 0 0 20px currentColor)';
    });
  }

  applyMinimalEffects() {
    // Remove excessive shadows and effects
    const elements = document.querySelectorAll('.btn, .card, .project-card');
    elements.forEach(el => {
      el.style.boxShadow = 'var(--shadow)';
    });
  }

  applyNatureEffects() {
    // Add nature-inspired animations (subtle leaf movements, etc.)
    // This could be expanded with CSS animations
  }

  updateMetaThemeColor(color) {
    let metaTheme = document.querySelector('meta[name="theme-color"]');
    if (!metaTheme) {
      metaTheme = document.createElement('meta');
      metaTheme.name = 'theme-color';
      document.head.appendChild(metaTheme);
    }
    metaTheme.content = color;
  }

  updateControls() {
    const themeButton = document.querySelector('.theme-controls button');
    const themeSelector = document.querySelector('.theme-controls select');
    
    if (themeButton) {
      const theme = this.themes[this.currentTheme];
      themeButton.innerHTML = theme.icon;
      themeButton.title = `Current: ${theme.name}`;
    }
    
    if (themeSelector) {
      themeSelector.value = this.currentTheme;
    }
  }

  setupTransitions() {
    // Add global transition styles
    const styles = document.createElement('style');
    styles.textContent = `
      .theme-transitioning * {
        transition: background-color ${this.transitionDuration}ms ease,
                   color ${this.transitionDuration}ms ease,
                   border-color ${this.transitionDuration}ms ease,
                   box-shadow ${this.transitionDuration}ms ease !important;
      }
      
      .neon-effects .btn:hover,
      .neon-effects .card:hover {
        box-shadow: 0 0 30px var(--primary-color) !important;
      }
      
      .minimal-effects * {
        box-shadow: none !important;
        border-radius: 4px !important;
      }
      
      .nature-effects {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill='%23c8e6c9' opacity='0.03'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v20h20z'/%3E%3C/g%3E%3C/svg%3E");
      }
    `;
    
    if (!document.querySelector('#advanced-theme-styles')) {
      styles.id = 'advanced-theme-styles';
      document.head.appendChild(styles);
    }
  }

  initAutoSwitching() {
    if (!this.autoSwitching.enabled) return;
    
    const checkTime = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      const schedule = this.autoSwitching.schedules
        .filter(s => s.time <= currentTime)
        .sort((a, b) => b.time.localeCompare(a.time))[0];
      
      if (schedule && schedule.theme !== this.currentTheme) {
        this.setTheme(schedule.theme);
      }
    };
    
    // Check every minute
    this.autoSwitchInterval = setInterval(checkTime, 60000);
    checkTime(); // Check immediately
  }

  toggleAutoSwitching(enabled) {
    this.autoSwitching.enabled = enabled;
    localStorage.setItem('auto-theme-switching', enabled);
    
    if (enabled) {
      this.initAutoSwitching();
    } else if (this.autoSwitchInterval) {
      clearInterval(this.autoSwitchInterval);
    }
  }

  // Observer pattern for theme changes
  subscribe(callback) {
    this.observers.add(callback);
  }

  unsubscribe(callback) {
    this.observers.delete(callback);
  }

  notifyObservers(newTheme, oldTheme) {
    this.observers.forEach(callback => {
      try {
        callback(newTheme, oldTheme);
      } catch (error) {
        console.error('Theme observer error:', error);
      }
    });
  }

  // Public API
  getCurrentTheme() {
    return this.currentTheme;
  }

  getThemeColors(themeName = this.currentTheme) {
    return this.themes[themeName]?.colors || {};
  }

  getAvailableThemes() {
    return Object.keys(this.themes);
  }

  addCustomTheme(name, themeConfig) {
    this.themes[name] = themeConfig;
    this.updateControls();
  }

  removeCustomTheme(name) {
    if (this.themes[name] && name !== 'light' && name !== 'dark') {
      delete this.themes[name];
      if (this.currentTheme === name) {
        this.setTheme('light');
      }
      this.updateControls();
    }
  }

  exportTheme(themeName = this.currentTheme) {
    return JSON.stringify(this.themes[themeName], null, 2);
  }

  importTheme(themeJson, name) {
    try {
      const theme = JSON.parse(themeJson);
      this.addCustomTheme(name, theme);
      return true;
    } catch (error) {
      console.error('Failed to import theme:', error);
      return false;
    }
  }

  // Cleanup
  destroy() {
    if (this.autoSwitchInterval) {
      clearInterval(this.autoSwitchInterval);
    }
    
    const controls = document.querySelector('.theme-controls');
    if (controls) {
      controls.remove();
    }
    
    const styles = document.querySelector('#advanced-theme-styles');
    if (styles) {
      styles.remove();
    }
    
    this.observers.clear();
  }
}

// 🚀 Initialize Advanced Theme System
export function initAdvancedThemes() {
  try {
    window.advancedThemeManager = new AdvancedThemeManager();
    
    console.log('🎨 Advanced Theme System initialized!');
    return window.advancedThemeManager;
    
  } catch (error) {
    console.error('❌ Failed to initialize Advanced Theme System:', error);
    return null;
  }
}

export { AdvancedThemeManager };