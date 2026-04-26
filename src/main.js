/**
 * 🚀 Unified Main Entry Point — FIXED VERSION
 *
 * Fixes:
 * 1. Removed duplicate scroll-reveal / hover IntersectionObserver calls
 *    that conflicted with UnifiedInteractionsManager in app.js.
 * 2. Reduced minLoadingTime from 1200ms → 500ms.
 * 3. ThemeManager is no longer constructed at module-load time.
 * 4. Typing animation re-runs after language switch.
 * 5. initAnimations / initEnhancedAnimations import mismatch resolved.
 * 6. All observers are passive where possible.
 */

import './style.css';

console.log('🎯 main.js loaded (fixed)');

/* ─────────────────────────────────────────────
   Unified Application
   ───────────────────────────────────────────── */
class UnifiedApplication {
  constructor() {
    this.isInitialized = false;
    this.loadingStartTime = Date.now();
    this.features = new Map();
    this.isGitHubPages = window.location.hostname === 'thanghoang07.github.io';
    this.basePath = this.isGitHubPages ? '/thanghoang07/' : '/';
    this._cachedTranslations = null;
  }

  /* ─── Entry point ──────────────────────────── */

  async init() {
    console.log(`🚀 Starting (${this.isGitHubPages ? 'GitHub Pages' : 'dev'}) init…`);
    try {
      await this._waitForDOM();

      // Apply saved theme BEFORE anything else to prevent FOUC
      this._applyThemeEarly();

      // Load JS modules (non-blocking — failures are caught individually)
      await this._loadModules();

      // Core UI — no dependency on external modules
      this._initTheme();
      this._initLanguage();
      this._initNavbar();
      this._initBackToTop();

      // FIXED: animation init delegated entirely to the singleton system.
      // Do NOT call initScrollReveal / initHoverEffects here — those are
      // handled by UnifiedInteractionsManager (loaded via modules).
      this._initFloatingShapes(); // lightweight, standalone
      this._initTypingAnimation(); // standalone, re-runnable

      // Module-based features
      this._initLoadedFeatures();

      this._finishLoading();
    } catch (err) {
      console.error('❌ Init error:', err);
      this._finishLoading();
    }
  }

  /* ─── DOM ready ────────────────────────────── */

  _waitForDOM() {
    return new Promise((resolve) => {
      if (document.readyState !== 'loading') return resolve();
      document.addEventListener('DOMContentLoaded', resolve, { once: true });
    });
  }

  /* ─── Early theme (prevents flash) ─────────── */

  _applyThemeEarly() {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const useDark = saved === 'dark' || (!saved && prefersDark);
    document.documentElement.classList.toggle('dark', useDark);
  }

  /* ─── Module loading ───────────────────────── */

  async _loadModules() {
    const modules = [
      {
        name: 'theme',
        path: './theme.js',
        exports: ['themeManager'],
      },
      {
        name: 'translations',
        path: './translations.js',
        exports: ['languageManager'],
      },
      {
        // FIXED: use animation-system.js which exports initAnimations correctly
        name: 'animation',
        path: './animation-system.js',
        exports: ['initAnimations', 'scrollEffects', 'floatingShapes', 'microInteractions', 'parallaxEffects'],
      },
      {
        name: 'contact',
        path: './contact-form.js',
        exports: ['contactFormManager', 'initWorkExperienceTabs'],
      },
    ];

    for (const mod of modules) {
      try {
        const loaded = await import(/* @vite-ignore */ mod.path);
        const hasExport = mod.exports.some((e) => loaded[e] !== undefined);
        if (hasExport) {
          this.features.set(mod.name, loaded);
          console.log(`✅ Module loaded: ${mod.name}`);
        }
      } catch (err) {
        console.warn(`⚠️ Module failed (${mod.name}): ${err.message}`);
      }
    }
  }

  /* ─── Theme ────────────────────────────────── */

  _initTheme() {
    const mod = this.features.get('theme');
    if (mod?.themeManager) {
      try {
        // themeManager is a Proxy — calling init() is safe after DOM ready
        mod.themeManager.init?.();
        console.log('✅ ThemeManager initialised');
        return;
      } catch (e) {
        console.warn('⚠️ ThemeManager.init failed:', e.message);
      }
    }
    // Fallback: wire up toggle button manually
    const btn = document.getElementById('toggle-theme');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }

  /* ─── Language ─────────────────────────────── */

  _initLanguage() {
    const mod = this.features.get('translations');
    if (mod?.languageManager) {
      try {
        mod.languageManager.init?.();
        // FIXED: re-run typing animation whenever language changes
        window.addEventListener('themeChanged', () => { });
        const origApply = mod.languageManager.applyLanguage?.bind(mod.languageManager);
        if (origApply) {
          mod.languageManager.applyLanguage = (lang) => {
            origApply(lang);
            // Re-trigger typing so the new hero name animates
            setTimeout(() => this._initTypingAnimation(), 100);
          };
        }
        console.log('✅ LanguageManager initialised');
        return;
      } catch (e) {
        console.warn('⚠️ LanguageManager.init failed:', e.message);
      }
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
    // Flatten nested keys
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

  /* ─── Navbar ───────────────────────────────── */

  _initNavbar() {
    const header = document.querySelector('header');
    if (!header) return;

    let lastScroll = 0;
    let ticking = false;

    window.addEventListener(
      'scroll',
      () => {
        if (ticking) return;
        requestAnimationFrame(() => {
          const cur = window.pageYOffset;
          header.style.boxShadow = cur > 10 ? '0 2px 20px rgba(0,0,0,0.08)' : '';
          header.style.backdropFilter = cur > 10 ? 'blur(10px)' : '';
          header.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
          // Hide on scroll-down, show on scroll-up
          if (cur > lastScroll && cur > 80) {
            header.style.transform = 'translateY(-100%)';
          } else {
            header.style.transform = 'translateY(0)';
          }
          lastScroll = cur;
          ticking = false;
        });
        ticking = true;
      },
      { passive: true }
    );
  }

  /* ─── Back to top ──────────────────────────── */

  _initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener(
      'scroll',
      () => {
        btn.classList.toggle('show', window.scrollY > 300);
        btn.classList.toggle('hide', window.scrollY <= 300);
      },
      { passive: true }
    );

    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ─── Typing animation ─────────────────────── */

  _initTypingAnimation() {
    const container = document.querySelector('#hero-name .typing-container, #hero-name');
    const textEl = container?.querySelector('.typing-text');
    const cursorEl = container?.querySelector('.typing-cursor');
    if (!textEl) return;

    // Cancel any in-progress typing
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
        // Hide cursor after done typing
        this._cursorTimeout = setTimeout(() => {
          if (cursorEl) cursorEl.style.opacity = '0';
        }, 1000);
      }
    };

    this._typingTimeout = setTimeout(type, 500);
  }

  /* ─── Floating shapes (standalone) ─────────── */

  _initFloatingShapes() {
    const container = document.getElementById('floating-shapes-container');
    if (!container || container.children.length) return; // already populated

    const shapes = [
      { size: 60, color: 'rgba(147,51,234,0.08)', delay: 0 },
      { size: 40, color: 'rgba(79,70,229,0.08)', delay: 2 },
      { size: 50, color: 'rgba(236,72,153,0.07)', delay: 4 },
    ];

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

    shapes.forEach(({ size, color, delay }) => {
      const el = document.createElement('div');
      el.style.cssText = `
        position:absolute; width:${size}px; height:${size}px;
        background:${color}; border-radius:50%;
        top:${10 + Math.random() * 75}%; left:${10 + Math.random() * 75}%;
        animation:_floatShape 6s ease-in-out ${delay}s infinite;
        pointer-events:none;
      `;
      container.appendChild(el);
    });
  }

  /* ─── Module-based features ────────────────── */

  _initLoadedFeatures() {
    // Contact form
    const contact = this.features.get('contact');
    if (contact) {
      try {
        contact.contactFormManager?.init?.();
        contact.initWorkExperienceTabs?.();
        console.log('✅ Contact form + work tabs initialised');
      } catch (e) {
        console.warn('⚠️ Contact features failed:', e.message);
      }
    }

    // FIXED: animation initialisation — call initAnimations() once via singleton.
    // Do NOT also call scrollEffects.init() / microInteractions.init() here,
    // because UnifiedInteractionsManager in app.js handles those.
    // initAnimations() is idempotent (singleton guard inside).
    const anim = this.features.get('animation');
    if (anim?.initAnimations) {
      try {
        anim.initAnimations();
        console.log('✅ Animation system initialised (singleton)');
      } catch (e) {
        console.warn('⚠️ Animation init failed:', e.message);
      }
    }
  }

  /* ─── Loading screen ───────────────────────── */

  _finishLoading() {
    const elapsed = Date.now() - this.loadingStartTime;
    // FIXED: reduced from 1200ms to 500ms — content is ready, no need to delay
    const MIN_TIME = 500;
    const wait = Math.max(0, MIN_TIME - elapsed);

    const messages = ['Initialising…', 'Loading animations…', 'Almost ready…', 'Welcome! 🎉'];
    const loaderText = document.querySelector('.loader-text');
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
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            main.style.opacity = '1';
            main.style.transform = 'translateY(0)';
          });
        });
      }

      document.body.classList.add('loaded');
      this.isInitialized = true;
      console.log('🎉 App ready!');
    }, wait);
  }
}

/* ─────────────────────────────────────────────
   Bootstrap
   ───────────────────────────────────────────── */
window.addEventListener('error', (e) => console.error('💥 Global error:', e.message));
window.addEventListener('unhandledrejection', (e) => console.error('💥 Unhandled rejection:', e.reason));

const app = new UnifiedApplication();
app.init();

// Safety fallback — force finish loading after 5 s
setTimeout(() => {
  if (!app.isInitialized) {
    console.warn('⏰ Timeout fallback triggered');
    app._finishLoading?.();
  }
}, 5000);

window.unifiedApp = app;