import translations from '../../translations.json' with { type: 'json' };

export { translations };

export class TranslationService {
  /**
   * @param {Object} [dictionary=translations]
   * @param {string} [fallbackLocale='en']
   */
  constructor(dictionary = translations, fallbackLocale = 'en') {
    this.translations = dictionary;
    this.fallbackLocale = fallbackLocale;
  }

  /**
   * Dịch một khóa sang ngôn ngữ chỉ định.
   * @param {string} key
   * @param {string} [lang]
   * @returns {string}
   */
  translate(key, lang = (typeof document !== 'undefined' && document.documentElement?.lang) || this.fallbackLocale) {
    return this.translations[lang]?.[key] ?? this.translations[this.fallbackLocale]?.[key] ?? key;
  }
}

export const translationService = new TranslationService();

export function translate(key, lang = (typeof document !== 'undefined' && document.documentElement?.lang) || 'en') {
  return translationService.translate(key, lang);
}
