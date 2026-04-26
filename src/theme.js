/**
 * 🎨 Theme Management System — FIXED VERSION
 *
 * Fixes:
 * 1. `new ThemeManager()` was called at module-load time (before DOM ready),
 *    causing getElementById to return null and toggle button never wired up.
 * 2. `document.body.style.display = 'none'` force-repaint trick caused layout flash.
 * 3. Theme transition now scoped to html/body only (not every element via *).
 */

import { getThemeColor } from './color-system.js';

export class ThemeManager {
  constructor() {
    // DO NOT touch the DOM here — constructor runs at import time.
    // DOM elements are resolved lazily in init().
    this._themeToggle = null;
    this.currentTheme = this._resolveInitialTheme();
  }

  /* ── Helpers ────────────────────────────────── */

  _resolveInitialTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  get _toggle() {
    // Lazy DOM lookup — safe to call after DOMContentLoaded
    if (!this._themeToggle) {
      this._themeToggle = document.getElementById('toggle-theme');
    }
    return this._themeToggle;
  }

  /* ── Public API ─────────────────────────────── */

  init() {
    console.log('🎨 Initialising theme system…');

    // Apply immediately to prevent FOUC
    this._apply(this.currentTheme, false);

    // Wire up toggle button
    if (this._toggle) {
      this._updateButton(this.currentTheme);
      this._toggle.addEventListener('click', () => {
        const next = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(next);
      });
    } else {
      console.warn('⚠️ #toggle-theme not found — theme toggle disabled');
    }

    // React to OS-level changes (only when no manual preference saved)
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          this._apply(e.matches ? 'dark' : 'light', true);
        }
      });

    console.log('✅ Theme system ready');
  }

  setTheme(theme) {
    if (theme !== 'dark' && theme !== 'light') return;
    localStorage.setItem('theme', theme);
    this.currentTheme = theme;
    this._apply(theme, true);
    console.log(`🎨 Theme → ${theme}`);
  }

  toggleTheme() {
    this.setTheme(this.currentTheme === 'dark' ? 'light' : 'dark');
  }

  getCurrentTheme() {
    return this.currentTheme;
  }

  isDarkMode() {
    return this.currentTheme === 'dark';
  }

  /* ── Private ─────────────────────────────────── */

  _apply(theme, animate) {
    const html = document.documentElement;

    if (animate) {
      // Scoped transition on html/body only — NOT on every element via *
      html.style.transition = 'background-color 0.3s ease, color 0.3s ease';
      document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
      setTimeout(() => {
        html.style.transition = '';
        document.body.style.transition = '';
      }, 350);
    }

    html.classList.toggle('dark', theme === 'dark');

    this._updateButton(theme);
    this._updateMetaThemeColor(theme);

    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
  }

  _updateButton(theme) {
    const toggle = this._toggle;
    if (!toggle) return;
    const moon = toggle.querySelector('.fa-moon');
    const sun = toggle.querySelector('.fa-sun');
    moon?.classList.toggle('hidden', theme === 'dark');
    sun?.classList.toggle('hidden', theme === 'light');
  }

  _updateMetaThemeColor(theme) {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return;
    try {
      meta.setAttribute('content', getThemeColor(theme, 'metaTheme'));
    } catch {
      meta.setAttribute('content', theme === 'dark' ? '#1e293b' : '#9333ea');
    }
  }
}

/* ── Singleton ─────────────────────────────────
   FIXED: do NOT call `new ThemeManager()` here.
   The singleton is created lazily on first import of `themeManager`.
   ─────────────────────────────────────────────── */
let _instance = null;

export function getThemeManager() {
  if (!_instance) _instance = new ThemeManager();
  return _instance;
}

// Named export kept for compatibility — but instance is lazy now
export const themeManager = new Proxy(
  {},
  {
    get(_, prop) {
      return getThemeManager()[prop];
    },
  }
);

// Legacy helpers
export function initTheme() {
  const mgr = getThemeManager();
  mgr.init();
  return mgr;
}

export function getCurrentTheme() {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}