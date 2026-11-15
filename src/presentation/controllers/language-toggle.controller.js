import { LocalStorageAdapter } from '../../infrastructure/storage/local-storage.adapter.js';
import { translate, translations } from '../../application/localization/translate.service.js';

export { translate, translations };

export class LanguageController {
  /**
   * @param {Object} [dependencies]
   * @param {LocalStorageAdapter} [dependencies.storage]
   * @param {Function} [dependencies.translator]
   */
  constructor({
    storage = new LocalStorageAdapter(),
    translator = translate,
  } = {}) {
    this.storage = storage;
    this.translator = translator;
  }

  init(doc = document) {
    this.doc = doc;
    const saved = this.storage.getItem('language');
    this.applyLanguage(saved === 'vi' ? 'vi' : 'en');

    const toggleBtn = this.doc.getElementById('toggle-language');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const lang = this.doc.documentElement.lang === 'vi' ? 'en' : 'vi';
        this.applyLanguage(lang);
        this.storage.setItem('language', lang);
      });
    }
  }

  applyLanguage(lang) {
    const doc = this.doc || document;
    lang = lang === 'vi' ? 'vi' : 'en';
    doc.documentElement.lang = lang;
    doc.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = this.translator(el.dataset.i18n, lang);
    });
    doc.querySelectorAll('[data-i18n-aria]').forEach(el => {
      el.setAttribute('aria-label', this.translator(el.dataset.i18nAria, lang));
    });
    const viIcon = doc.getElementById('lang-vi-icon');
    const enIcon = doc.getElementById('lang-en-icon');
    if (viIcon) viIcon.hidden = lang !== 'vi';
    if (enIcon) enIcon.hidden = lang !== 'en';
    doc.dispatchEvent?.(new CustomEvent('languagechange', { detail: lang }));
  }
}

export const languageManager = new LanguageController();
export { LanguageController as LanguageManager };
