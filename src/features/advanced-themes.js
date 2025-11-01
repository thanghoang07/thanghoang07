/**
 * 🎨 Advanced Theme Manager - Refactored
 * Comprehensive theme management system with base class inheritance
 */

import { UIManager } from '../core/base-manager.js';
import { THEME_CONFIG } from '../core/config.js';
import { Logger, StorageUtils, DOMUtils, DeviceUtils } from '../utils/index.js';

class AdvancedThemeManager extends UIManager {
  constructor() {
    super('Advanced Themes', '.theme-controls', {
      autoRender: true,
      responsive: true,
      storage: true
    });
    
    // Theme configuration
    this.themes = {
      light: {
        name: 'Light',
        icon: '☀️',
        colors: {
          primary: '#9333ea',
          secondary: '#a855f7',
          accent: '#c084fc',
          background: '#ffffff',
          surface: '#f8fafc',
          text: '#1f2937',
          textSecondary: '#6b7280',
          border: '#e5e7eb'
        }
      },
      dark: {
        name: 'Dark',
        icon: '🌙',
        colors: {
          primary: '#a855f7',
          secondary: '#9333ea',
          accent: '#c084fc',
          background: '#0f172a',
          surface: '#1e293b',
          text: '#f1f5f9',
          textSecondary: '#94a3b8',
          border: '#334155'
        }
      },
      neon: {
        name: 'Neon',
        icon: '💫',
        colors: {
          primary: '#00ffff',
          secondary: '#ff00ff', 
          accent: '#ffff00',
          background: '#000011',
          surface: '#001122',
          text: '#ffffff',
          textSecondary: '#cccccc',
          border: '#0088aa'
        }
      },
      minimal: {
        name: 'Minimal',
        icon: '⚪',
        colors: {
          primary: '#000000',
          secondary: '#333333',
          accent: '#666666',
          background: '#ffffff',
          surface: '#fafafa',
          text: '#000000',
          textSecondary: '#666666',
          border: '#eeeeee'
        }
      },
      nature: {
        name: 'Nature',
        icon: '🌿',
        colors: {
          primary: '#059669',
          secondary: '#10b981',
          accent: '#34d399',
          background: '#f0fdf4',
          surface: '#ecfdf5',
          text: '#064e3b',
          textSecondary: '#047857',
          border: '#d1fae5'
        }
      },
      sunset: {
        name: 'Sunset',
        icon: '🌅',
        colors: {
          primary: '#f59e0b',
          secondary: '#f97316',
          accent: '#fb923c',
          background: '#fffbeb',
          surface: '#fef3c7',
          text: '#92400e',
          textSecondary: '#d97706',
          border: '#fed7aa'
        }
      }
    };
    
    this.currentTheme = 'light';
    this.autoSwitchEnabled = false;
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.autoSwitchInterval = null;
  }

  async onInit() {
    await super.onInit();
    
    // Load saved theme
    this.loadTheme();
    
    // Connect to existing HTML button
    this.connectToExistingButton();
    
    // Setup system theme detection
    this.setupSystemThemeDetection();
    
    // Setup auto-switch if enabled
    if (this.autoSwitchEnabled) {
      this.startAutoSwitch();
    }
    
    // Apply initial theme
    this.applyTheme(this.currentTheme, false);
    
    this.debug('Theme system initialized', {
      currentTheme: this.currentTheme,
      autoSwitch: this.autoSwitchEnabled,
      availableThemes: Object.keys(this.themes)
    });
  }

  connectToExistingButton() {
    // Connect to existing toggle-theme button in HTML
    const existingButton = document.getElementById('toggle-theme');
    if (existingButton) {
      existingButton.addEventListener('click', () => {
        const currentTheme = this.getCurrentTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        this.updateButtonIcon();
        this.debug(`Theme switched to: ${newTheme}`);
      });
      
      // Update button icon based on current theme
      this.updateButtonIcon();
      this.debug('Connected to existing theme toggle button');
    }
  }

  updateButtonIcon() {
    const button = document.getElementById('toggle-theme');
    if (button) {
      const theme = this.getCurrentTheme();
      const icon = theme === 'dark' ? '☀️' : '🌙';
      button.innerHTML = icon;
    }
  }

  onDestroy() {
    // Stop auto-switch
    this.stopAutoSwitch();
    
    super.onDestroy();
  }

  createElement() {
    return DOMUtils.createElement('div', {
      className: 'theme-controls fixed top-4 right-4 z-50',
      dataset: { component: 'theme-controls' }
    });
  }

  async render() {
    if (!this.element) return;
    
    this.element.innerHTML = `
      <div class="theme-selector bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-gray-200/50 transition-all duration-300">
        <div class="flex items-center gap-2">
          ${Object.entries(this.themes).map(([key, theme]) => `
            <button 
              class="theme-btn w-10 h-10 rounded-xl border-2 transition-all duration-300 hover:scale-110 ${
                this.currentTheme === key ? 'border-current scale-110' : 'border-gray-200'
              }"
              data-theme="${key}"
              title="${theme.name} Theme"
              style="background: ${theme.colors.primary}; color: ${theme.colors.text};"
            >
              ${theme.icon}
            </button>
          `).join('')}
          
          <div class="w-px h-8 bg-gray-200 mx-1"></div>
          
          <button 
            class="auto-switch-btn w-10 h-10 rounded-xl border-2 transition-all duration-300 hover:scale-110 ${
              this.autoSwitchEnabled ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }"
            title="Auto Switch Themes"
          >
            🔄
          </button>
        </div>
      </div>
    `;
    
    this.setupEventListeners();
    this.setupDragAndDrop();
    this.setupMobileGestures();
  }

  setupEventListeners() {
    // Theme button clicks
    this.element.querySelectorAll('.theme-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const theme = e.target.dataset.theme;
        this.setTheme(theme);
      });
    });
    
    // Auto-switch toggle
    const autoSwitchBtn = this.element.querySelector('.auto-switch-btn');
    autoSwitchBtn?.addEventListener('click', () => {
      this.toggleAutoSwitch();
    });
  }

  setupDragAndDrop() {
    if (!DeviceUtils.isTouchDevice()) {
      this.element.addEventListener('mousedown', this.handleDragStart.bind(this));
      document.addEventListener('mousemove', this.handleDragMove.bind(this));
      document.addEventListener('mouseup', this.handleDragEnd.bind(this));
    }
  }

  setupMobileGestures() {
    if (DeviceUtils.isTouchDevice()) {
      this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
      this.element.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
      this.element.addEventListener('touchend', this.handleTouchEnd.bind(this));
      
      // Swipe gesture for theme switching
      let startX = 0;
      this.element.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
      });
      
      this.element.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        
        if (Math.abs(diff) > 50) {
          if (diff > 0) {
            this.nextTheme();
          } else {
            this.previousTheme();
          }
        }
      });
    }
  }

  handleDragStart(e) {
    if (e.target.closest('.theme-btn, .auto-switch-btn')) return;
    
    this.isDragging = true;
    this.dragStartX = e.clientX - this.element.offsetLeft;
    this.dragStartY = e.clientY - this.element.offsetTop;
    this.element.style.cursor = 'grabbing';
    e.preventDefault();
  }

  handleDragMove(e) {
    if (!this.isDragging) return;
    
    const x = e.clientX - this.dragStartX;
    const y = e.clientY - this.dragStartY;
    
    // Keep within viewport bounds
    const maxX = window.innerWidth - this.element.offsetWidth;
    const maxY = window.innerHeight - this.element.offsetHeight;
    
    this.element.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
    this.element.style.top = `${Math.max(0, Math.min(y, maxY))}px`;
    this.element.style.right = 'auto';
    this.element.style.transform = 'none';
  }

  handleDragEnd() {
    this.isDragging = false;
    this.element.style.cursor = 'grab';
  }

  handleTouchStart(e) {
    if (e.target.closest('.theme-btn, .auto-switch-btn')) return;
    
    this.isDragging = true;
    const touch = e.touches[0];
    this.dragStartX = touch.clientX - this.element.offsetLeft;
    this.dragStartY = touch.clientY - this.element.offsetTop;
    e.preventDefault();
  }

  handleTouchMove(e) {
    if (!this.isDragging) return;
    
    const touch = e.touches[0];
    const x = touch.clientX - this.dragStartX;
    const y = touch.clientY - this.dragStartY;
    
    const maxX = window.innerWidth - this.element.offsetWidth;
    const maxY = window.innerHeight - this.element.offsetHeight;
    
    this.element.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
    this.element.style.top = `${Math.max(0, Math.min(y, maxY))}px`;
    this.element.style.right = 'auto';
    this.element.style.transform = 'none';
    
    e.preventDefault();
  }

  handleTouchEnd() {
    this.isDragging = false;
  }

  setTheme(themeName) {
    if (!this.themes[themeName]) {
      Logger.warning(`Theme "${themeName}" not found`);
      return;
    }
    
    this.applyTheme(themeName);
    this.currentTheme = themeName;
    this.saveTheme();
    this.updateUI();
    
    this.emit('themeChanged', { theme: themeName, colors: this.themes[themeName].colors });
    Logger.success(`Theme changed to: ${themeName}`);
  }

  applyTheme(themeName, animate = true) {
    const theme = this.themes[themeName];
    if (!theme) return;
    
    const root = document.documentElement;
    
    // Add transition class if animating
    if (animate) {
      root.classList.add('theme-transitioning');
      setTimeout(() => root.classList.remove('theme-transitioning'), THEME_CONFIG.TRANSITION_DURATION);
    }
    
    // Apply CSS custom properties
    Object.entries(theme.colors).forEach(([property, value]) => {
      root.style.setProperty(`--color-${property}`, value);
    });
    
    // Handle dark/light mode for Tailwind CSS
    if (themeName === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Set data attribute for CSS selectors
    root.setAttribute('data-theme', themeName);
    
    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme.colors.primary);
    }
    
    this.debug(`Applied theme: ${themeName}`, theme.colors);
  }

  nextTheme() {
    const themes = Object.keys(this.themes);
    const currentIndex = themes.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    this.setTheme(themes[nextIndex]);
  }

  previousTheme() {
    const themes = Object.keys(this.themes);
    const currentIndex = themes.indexOf(this.currentTheme);
    const prevIndex = (currentIndex - 1 + themes.length) % themes.length;
    this.setTheme(themes[prevIndex]);
  }

  toggleAutoSwitch() {
    this.autoSwitchEnabled = !this.autoSwitchEnabled;
    
    if (this.autoSwitchEnabled) {
      this.startAutoSwitch();
    } else {
      this.stopAutoSwitch();
    }
    
    this.saveTheme();
    this.updateUI();
    
    Logger.info(`Auto-switch ${this.autoSwitchEnabled ? 'enabled' : 'disabled'}`);
  }

  startAutoSwitch() {
    this.stopAutoSwitch(); // Clear existing interval
    
    const checkTime = () => {
      const hour = new Date().getHours();
      let newTheme = this.currentTheme;
      
      if (hour >= THEME_CONFIG.AUTO_SWITCH_TIMES.MORNING && hour < THEME_CONFIG.AUTO_SWITCH_TIMES.AFTERNOON) {
        newTheme = 'light';
      } else if (hour >= THEME_CONFIG.AUTO_SWITCH_TIMES.AFTERNOON && hour < THEME_CONFIG.AUTO_SWITCH_TIMES.EVENING) {
        newTheme = 'nature';
      } else if (hour >= THEME_CONFIG.AUTO_SWITCH_TIMES.EVENING && hour < THEME_CONFIG.AUTO_SWITCH_TIMES.NIGHT) {
        newTheme = 'sunset';
      } else {
        newTheme = 'dark';
      }
      
      if (newTheme !== this.currentTheme) {
        this.setTheme(newTheme);
      }
    };
    
    checkTime(); // Check immediately
    this.autoSwitchInterval = setInterval(checkTime, 60000); // Check every minute
  }

  stopAutoSwitch() {
    if (this.autoSwitchInterval) {
      clearInterval(this.autoSwitchInterval);
      this.autoSwitchInterval = null;
    }
  }

  setupSystemThemeDetection() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e) => {
      if (this.autoSwitchEnabled) return; // Don't override auto-switch
      
      const systemTheme = e.matches ? 'dark' : 'light';
      this.setTheme(systemTheme);
    };
    
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    // Apply initial system theme if no saved theme
    const savedTheme = StorageUtils.getItem(THEME_CONFIG.STORAGE_KEY);
    if (!savedTheme && mediaQuery.matches) {
      this.currentTheme = 'dark';
    }
  }

  updateUI() {
    if (!this.element) return;
    
    // Update theme buttons
    this.element.querySelectorAll('.theme-btn').forEach(btn => {
      const isActive = btn.dataset.theme === this.currentTheme;
      btn.classList.toggle('scale-110', isActive);
      btn.style.borderColor = isActive ? 'currentColor' : '#e5e7eb';
    });
    
    // Update auto-switch button
    const autoSwitchBtn = this.element.querySelector('.auto-switch-btn');
    if (autoSwitchBtn) {
      autoSwitchBtn.classList.toggle('border-blue-500', this.autoSwitchEnabled);
      autoSwitchBtn.classList.toggle('bg-blue-50', this.autoSwitchEnabled);
      autoSwitchBtn.classList.toggle('border-gray-200', !this.autoSwitchEnabled);
    }
  }

  saveTheme() {
    const state = {
      theme: this.currentTheme,
      autoSwitch: this.autoSwitchEnabled
    };
    StorageUtils.setItem(THEME_CONFIG.STORAGE_KEY, state);
  }

  loadTheme() {
    const saved = StorageUtils.getItem(THEME_CONFIG.STORAGE_KEY, {});
    
    if (saved.theme && this.themes[saved.theme]) {
      this.currentTheme = saved.theme;
    }
    
    if (saved.autoSwitch !== undefined) {
      this.autoSwitchEnabled = saved.autoSwitch;
    }
  }

  // Override base class methods
  getState() {
    return {
      ...super.getState(),
      currentTheme: this.currentTheme,
      autoSwitchEnabled: this.autoSwitchEnabled,
      availableThemes: Object.keys(this.themes)
    };
  }

  setState(state) {
    super.setState(state);
    
    if (state.currentTheme) {
      this.currentTheme = state.currentTheme;
    }
    
    if (state.autoSwitchEnabled !== undefined) {
      this.autoSwitchEnabled = state.autoSwitchEnabled;
    }
  }

  // Public API
  getCurrentTheme() {
    return this.currentTheme;
  }

  getThemeColors(themeName = this.currentTheme) {
    return this.themes[themeName]?.colors || null;
  }

  getAvailableThemes() {
    return Object.keys(this.themes);
  }

  static checkSupport() {
    return CSS.supports('color', 'var(--test)');
  }
}

// Singleton instance
let themeManagerInstance = null;

export function initAdvancedThemes() {
  if (themeManagerInstance) {
    Logger.warning('Advanced Themes already initialized');
    return themeManagerInstance;
  }
  
  try {
    themeManagerInstance = new AdvancedThemeManager();
    themeManagerInstance.init();
    
    // Make globally accessible
    window.themeManager = themeManagerInstance;
    
    return themeManagerInstance;
    
  } catch (error) {
    Logger.error('Failed to initialize Advanced Themes:', error);
    return null;
  }
}

export { AdvancedThemeManager };
export default { initAdvancedThemes, AdvancedThemeManager };