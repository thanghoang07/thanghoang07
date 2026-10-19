import translations from './translations.json' with { type: 'json' };
export { translations };

export function translate(key, lang = document.documentElement.lang) {
  return translations[lang]?.[key] ?? translations.en[key] ?? key;
}

export class LanguageManager {
  init(doc = document) {
    this.doc = doc;
    let saved;
    try { saved = localStorage.getItem('language'); } catch { /* Storage is optional. */ }
    this.applyLanguage(saved === 'vi' ? 'vi' : 'en');
    const toggleBtn = this.doc.getElementById('toggle-language');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const lang = this.doc.documentElement.lang === 'vi' ? 'en' : 'vi';
        this.applyLanguage(lang);
        try { localStorage.setItem('language', lang); } catch { /* Keep the current session usable. */ }
      });
    }
  }
  applyLanguage(lang) {
    const doc = this.doc || document;
    lang = lang === 'vi' ? 'vi' : 'en';
    doc.documentElement.lang = lang;
    doc.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = translate(el.dataset.i18n, lang); });
    doc.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', translate(el.dataset.i18nAria, lang)); });
    const viIcon = doc.getElementById('lang-vi-icon');
    const enIcon = doc.getElementById('lang-en-icon');
    if (viIcon) viIcon.hidden = lang !== 'vi';
    if (enIcon) enIcon.hidden = lang !== 'en';
    doc.dispatchEvent?.(new CustomEvent('languagechange', { detail: lang }));
  }
}
export const languageManager = new LanguageManager();
