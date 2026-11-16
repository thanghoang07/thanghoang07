import { LocalStorageAdapter } from '../../infrastructure/storage/local-storage.adapter.js';

export class ThemeController {
  /**
   * @param {Object} [dependencies]
   * @param {LocalStorageAdapter} [dependencies.storage]
   */
  constructor({ storage = new LocalStorageAdapter() } = {}) {
    this.storage = storage;
    this.preference = null;
    this.currentTheme = 'light';
  }

  init(doc = document) {
    this.doc = doc;
    this.preference = this.storage.getItem('theme');
    const system = window.matchMedia('(prefers-color-scheme: dark)');
    this.apply(
      this.preference === 'dark' || (this.preference !== 'light' && system.matches)
        ? 'dark'
        : 'light'
    );

    const toggleBtn = this.doc.getElementById('toggle-theme');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this.preference = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.apply(this.preference);
        this.storage.setItem('theme', this.preference);
      });
    }

    system.addEventListener('change', event => {
      if (!this.preference) {
        this.apply(event.matches ? 'dark' : 'light');
      }
    });
  }

  apply(theme) {
    const doc = this.doc || document;
    this.currentTheme = theme;
    doc.documentElement.classList.toggle('dark', theme === 'dark');
    doc.getElementById('toggle-theme')?.setAttribute('aria-pressed', String(theme === 'dark'));
    doc.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      theme === 'dark' ? '#0b0f19' : '#ffffff'
    );
  }
}

export const themeManager = new ThemeController();
export { ThemeController as ThemeManager };
