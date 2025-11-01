/**
 * 🎨 Theme Management System
 * Enhanced theme system with better UX and performance
 */

import { colorSystem, getThemeColor } from './colors.js';

/**
 * Theme Manager Class
 */
export class ThemeManager {
  constructor() {
    this.html = document.documentElement;
    this.themeToggle = document.getElementById('toggle-theme');
    this.currentTheme = this.getInitialTheme();
  }

  /**
   * Get initial theme from localStorage or system preference
   */
  getInitialTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;

    // Detect system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  /**
   * Initialize theme system
   */
  init() {
    console.log('🎨 Initializing theme system...');

    // Apply initial theme immediately to prevent flash
    this.applyTheme(this.currentTheme);

    // Listen for system theme changes
    this.watchSystemTheme();

    // Add theme toggle listener
    this.initThemeToggle();

    console.log('✅ Theme system ready');
  }

  /**
   * Watch for system theme changes
   */
  watchSystemTheme() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Only follow system theme if no manual theme is set
      if (!localStorage.getItem('theme')) {
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  /**
   * Initialize theme toggle button
   */
  initThemeToggle() {
    if (!this.themeToggle) {
      console.warn('Theme toggle button not found');
      return;
    }

    // Update button state
    this.updateThemeButton(this.currentTheme);

    // Add click handler with smooth transition
    this.themeToggle.addEventListener('click', () => {
      const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
      
      console.log(`🔄 Switching from ${this.currentTheme} to ${newTheme}`);
      
      this.toggleTheme(newTheme);
      
      console.log(`✅ Theme switched to: ${newTheme}`);
    });
  }

  /**
   * Toggle theme with smooth transition
   */
  toggleTheme(newTheme) {
    // Add smooth transition
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    this.applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    this.currentTheme = newTheme;

    // Remove transition after animation
    setTimeout(() => {
      document.body.style.transition = '';
      
      // Force repaint for better compatibility
      document.body.style.display = 'none';
      document.body.offsetHeight; // Trigger reflow
      document.body.style.display = '';
    }, 300);
  }

  /**
   * Apply theme to DOM
   */
  applyTheme(theme) {
    console.log(`🎨 Applying theme: ${theme}`);

    try {
      if (theme === 'dark') {
        this.html.classList.add('dark');
      } else {
        this.html.classList.remove('dark');
      }

      // Update theme button
      this.updateThemeButton(theme);

      // Update meta theme-color for mobile browsers
      this.updateMetaThemeColor(theme);

      // Dispatch custom event for other components
      window.dispatchEvent(new CustomEvent('themeChanged', { 
        detail: { theme, timestamp: Date.now() } 
      }));

      // Debug verification
      setTimeout(() => {
        const isDark = this.html.classList.contains('dark');
        console.log(`🔍 Theme applied successfully: ${theme}, DOM has dark class: ${isDark}`);
      }, 100);

    } catch (error) {
      console.error('Error applying theme:', error);
      // Fallback to light theme
      this.html.classList.remove('dark');
    }
  }

  /**
   * Update theme toggle button state
   */
  updateThemeButton(theme) {
    if (!this.themeToggle) return;

    const moonIcon = this.themeToggle.querySelector('.fa-moon');
    const sunIcon = this.themeToggle.querySelector('.fa-sun');

    if (theme === 'dark') {
      if (moonIcon) moonIcon.classList.add('hidden');
      if (sunIcon) sunIcon.classList.remove('hidden');
    } else {
      if (moonIcon) moonIcon.classList.remove('hidden');
      if (sunIcon) sunIcon.classList.add('hidden');
    }
  }

  /**
   * Update meta theme-color for mobile browsers
   */
  updateMetaThemeColor(theme) {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const themeColor = getThemeColor(theme, 'metaTheme');
      metaThemeColor.setAttribute('content', themeColor);
    }
  }

  /**
   * Get current theme
   */
  getCurrentTheme() {
    return this.html.classList.contains('dark') ? 'dark' : 'light';
  }

  /**
   * Check if dark mode is active
   */
  isDarkMode() {
    return this.getCurrentTheme() === 'dark';
  }
}

// Legacy function for backward compatibility
export function initTheme() {
  const themeManager = new ThemeManager();
  themeManager.init();
  return themeManager;
}

export function getCurrentTheme() {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

// Create and export singleton instance
export const themeManager = new ThemeManager(); 