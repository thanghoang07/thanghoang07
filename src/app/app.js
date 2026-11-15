import { themeManager } from '../presentation/controllers/theme-toggle.controller.js';
import { languageManager } from '../presentation/controllers/language-toggle.controller.js';
import { contactFormManager } from '../presentation/controllers/contact-form.controller.js';
import { initNavigation } from '../presentation/components/navigation.component.js';
import { initWorkExpTabs } from '../presentation/components/work-tabs.component.js';
import {
  initActiveNav,
  initCounters,
  initPortfolioFilter,
  updateFooterYear,
} from '../presentation/components/portfolio-interactions.component.js';
import { initDesignSystemEnhancements } from '../presentation/components/visual-effects.component.js';

export class Application {
  constructor() {
    this.modules = [
      { name: 'i18n', init: () => languageManager.init() },
      { name: 'contact-form', init: () => contactFormManager.init() },
      { name: 'theme', init: () => themeManager.init() },
      { name: 'navigation', init: initNavigation },
      { name: 'work-tabs', init: initWorkExpTabs },
      { name: 'active-nav', init: initActiveNav },
      { name: 'portfolio-filter', init: initPortfolioFilter },
      { name: 'counters', init: initCounters },
      { name: 'footer-year', init: updateFooterYear },
      { name: 'design-enhancements', init: initDesignSystemEnhancements },
    ];
  }

  /**
   * Khởi tạo tuần tự các module tính năng với cơ chế cách ly lỗi (fault isolation).
   */
  bootstrap() {
    for (const { name, init } of this.modules) {
      try {
        init();
      } catch (error) {
        console.error(`Feature initialization failed [${name}]:`, error);
      }
    }
  }
}

export const app = new Application();
