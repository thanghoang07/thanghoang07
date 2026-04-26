/**
 * 🚀 Unified Main Entry Point
 * ✅ FIX: Removed all console.log/warn — production-clean
 */

import './design-system.css';
import './style.css';
import { initDesignSystemEnhancements } from './design-system-enhancements.js';

class UnifiedApplication {
  constructor() {
    this.isInitialized = false;
    this.loadingStartTime = Date.now();
    this.features = new Map();
    this.isGitHubPages = window.location.hostname === 'thanghoang07.github.io';
    this.basePath = this.isGitHubPages ? '/thanghoang07/' : '/';
    this._cachedTranslations = null;
  }

  async init() {
    try {
      await this._waitForDOM();
      initDesignSystemEnhancements();
      this._applyThemeEarly();
      await this._loadModules();
      this._initTheme();
      this._initLanguage();
      this._initNavbar();
      this._initBackToTop();
      this._initFloatingShapes();
      this._initTypingAnimation();
      this._initLoadedFeatures();
      this._finishLoading();
    } catch (err) {
      console.error('Init error:', err);
      this._finishLoading();
    }
  }

  _waitForDOM() {
    return new Promise((resolve) => {
      if (document.readyState !== 'loading') return resolve();
      document.addEventListener('DOMContentLoaded', resolve, { once: true });
    });
  }

  _applyThemeEarly() {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const useDark = saved === 'dark' || (!saved && prefersDark);
    document.documentElement.classList.toggle('dark', useDark);
  }

  async _loadModules() {
    const modules = [
      { name: 'theme', path: './theme.js', exports: ['themeManager'] },
      { name: 'translations', path: './translations.js', exports: ['languageManager'] },
      { name: 'animation', path: './animation-system.js', exports: ['initAnimations'] },
      { name: 'contact', path: './contact-form.js', exports: ['contactFormManager', 'initWorkExperienceTabs'] },
    ];

    for (const mod of modules) {
      try {
        const loaded = await import(/* @vite-ignore */ mod.path);
        const hasExport = mod.exports.some((e) => loaded[e] !== undefined);
        if (hasExport) this.features.set(mod.name, loaded);
      } catch {
        // Module failed — silently continue, fallbacks handle it
      }
    }
  }

  _initTheme() {
    const mod = this.features.get('theme');
    if (mod?.themeManager) {
      try { mod.themeManager.init?.(); return; } catch { /* fallback */ }
    }
    const btn = document.getElementById('toggle-theme');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }

  _initLanguage() {
    const mod = this.features.get('translations');
    if (mod?.languageManager) {
      try {
        mod.languageManager.init?.();
        const origApply = mod.languageManager.applyLanguage?.bind(mod.languageManager);
        if (origApply) {
          mod.languageManager.applyLanguage = (lang) => {
            origApply(lang);
            setTimeout(() => this._initTypingAnimation(), 100);
          };
        }
        return;
      } catch { /* fallback */ }
    }
    this._initBuiltInLanguage();
  }

  _initBuiltInLanguage() {
    const saved = localStorage.getItem('language') || 'vi';
    this._applyTranslations(saved);
    const btn = document.getElementById('toggle-language');
    if (!btn) return;
    let current = saved;
    btn.addEventListener('click', () => {
      current = current === 'vi' ? 'en' : 'vi';
      localStorage.setItem('language', current);
      this._applyTranslations(current);
      setTimeout(() => this._initTypingAnimation(), 100);
      this._updateLangIcons(current);
    });
    this._updateLangIcons(current);
  }

  _updateLangIcons(lang) {
    document.getElementById('lang-vi-icon')?.classList.toggle('hidden', lang !== 'vi');
    document.getElementById('lang-en-icon')?.classList.toggle('hidden', lang !== 'en');
  }

  async _applyTranslations(lang) {
    if (!this._cachedTranslations) {
      try {
        const res = await fetch(`${this.basePath}src/translations.json`);
        if (res.ok) this._cachedTranslations = await res.json();
      } catch {
        this._cachedTranslations = this._fallbackTranslations();
      }
    }
    const data = this._cachedTranslations?.[lang];
    if (!data) return;
    const flat = Object.values(data).reduce((acc, group) => {
      if (typeof group === 'object') Object.assign(acc, group);
      return acc;
    }, {});
    Object.entries(flat).forEach(([id, text]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    });
  }

  _fallbackTranslations() {
    return {
      vi: { navigation: { 'nav-services': 'Dịch vụ', 'nav-portfolio': 'Dự án' } },
      en: { navigation: { 'nav-services': 'Services', 'nav-portfolio': 'Portfolio' } },
    };
  }

  _initNavbar() {
    const header = document.querySelector('header');
    if (!header) return;
    let lastScroll = 0, ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      requestAnimationFrame(() => {
        const cur = window.pageYOffset;
        header.style.boxShadow = cur > 10 ? '0 2px 20px rgba(0,0,0,0.08)' : '';
        header.style.backdropFilter = cur > 10 ? 'blur(10px)' : '';
        header.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        header.style.transform = (cur > lastScroll && cur > 80) ? 'translateY(-100%)' : 'translateY(0)';
        lastScroll = cur;
        ticking = false;
      });
      ticking = true;
    }, { passive: true });
  }

  _initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('show', window.scrollY > 300);
      btn.classList.toggle('hide', window.scrollY <= 300);
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  _initTypingAnimation() {
    const container = document.querySelector('#hero-name .typing-container, #hero-name');
    const textEl = container?.querySelector('.typing-text');
    const cursorEl = container?.querySelector('.typing-cursor');
    if (!textEl) return;

    if (this._typingTimeout) clearTimeout(this._typingTimeout);
    if (this._cursorTimeout) clearTimeout(this._cursorTimeout);

    const fullText = textEl.dataset.text || textEl.textContent.trim() || 'Thang Hoang Duc.';
    textEl.textContent = '';
    textEl.style.opacity = '1';
    if (cursorEl) cursorEl.style.opacity = '1';

    let i = 0;
    const type = () => {
      if (i < fullText.length) {
        textEl.textContent += fullText[i++];
        this._typingTimeout = setTimeout(type, 100);
      } else {
        this._cursorTimeout = setTimeout(() => {
          if (cursorEl) cursorEl.style.opacity = '0';
        }, 1000);
      }
    };
    this._typingTimeout = setTimeout(type, 500);
  }

  _initFloatingShapes() {
    const container = document.getElementById('floating-shapes-container');
    if (!container || container.children.length) return;

    if (!document.getElementById('_float-css')) {
      const style = document.createElement('style');
      style.id = '_float-css';
      style.textContent = `
        @keyframes _floatShape {
          0%,100% { transform: translateY(0) rotate(0deg); }
          33%      { transform: translateY(-18px) rotate(5deg); }
          66%      { transform: translateY(9px) rotate(-4deg); }
        }
      `;
      document.head.appendChild(style);
    }

    [
      { size: 60, color: 'rgba(124,58,237,0.07)', delay: 0 },
      { size: 40, color: 'rgba(34,211,238,0.06)', delay: 2 },
      { size: 50, color: 'rgba(167,139,250,0.05)', delay: 4 },
    ].forEach(({ size, color, delay }) => {
      const el = document.createElement('div');
      el.style.cssText = `
        position:absolute;width:${size}px;height:${size}px;
        background:${color};border-radius:50%;
        top:${10 + Math.random() * 75}%;left:${10 + Math.random() * 75}%;
        animation:_floatShape 6s ease-in-out ${delay}s infinite;
        pointer-events:none;
      `;
      container.appendChild(el);
    });
  }

  _initLoadedFeatures() {
    const contact = this.features.get('contact');
    if (contact) {
      try {
        contact.contactFormManager?.init?.();
        contact.initWorkExperienceTabs?.();
      } catch { /* non-critical */ }
    }
    const anim = this.features.get('animation');
    if (anim?.initAnimations) {
      try { anim.initAnimations(); } catch { /* non-critical */ }
    }
  }

  _finishLoading() {
    const elapsed = Date.now() - this.loadingStartTime;
    const wait = Math.max(0, 500 - elapsed);
    const messages = ['Initialising…', 'Loading…', 'Almost ready…', 'Welcome! 🎉'];
    const loaderText = document.querySelector('.loader-text, #loader-msg');
    let msgIdx = 0;
    const cycle = () => {
      if (loaderText && msgIdx < messages.length) {
        loaderText.textContent = messages[msgIdx++];
        setTimeout(cycle, Math.min(150, wait / messages.length));
      }
    };
    cycle();

    setTimeout(() => {
      const loader = document.getElementById('page-loader');
      const main = document.getElementById('main-content');
      if (loader) {
        loader.classList.add('fade-out');
        setTimeout(() => (loader.style.display = 'none'), 600);
      }
      if (main) {
        main.style.opacity = '0';
        main.style.transform = 'translateY(16px)';
        main.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        requestAnimationFrame(() => requestAnimationFrame(() => {
          main.style.opacity = '1';
          main.style.transform = 'translateY(0)';
        }));
      }
      document.body.classList.add('loaded');
      this.isInitialized = true;
    }, wait);
  }
}

/* ── Bootstrap ─────────────────────────────────── */
window.addEventListener('error', (e) => console.error('Global error:', e.message));
window.addEventListener('unhandledrejection', (e) => console.error('Unhandled rejection:', e.reason));

const app = new UnifiedApplication();
app.init();

setTimeout(() => {
  if (!app.isInitialized) app._finishLoading?.();
}, 5000);

// ✅ FIX 3: Tab switching global function
window.switchTab = (company) => {
  ['hpt', 'tk25', 'nbn', 'devup'].forEach((c) => {
    document.getElementById(`tab-${c}`)?.classList.toggle('active', c === company);
    document.getElementById(`content-${c}`)?.classList.toggle('hidden', c !== company);
  });
};