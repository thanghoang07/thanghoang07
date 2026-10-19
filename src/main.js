import './style.css';
import './design-system.css';
import './styles/portfolio.css';
import { themeManager } from './theme.js';
import { languageManager } from './translations.js';
import { contactFormManager } from './contact-form.js';
import { initDesignSystemEnhancements } from './design-system-enhancements.js';
import { initActiveNav, initCounters, initPortfolioFilter, updateFooterYear } from './ui/page-interactions.js';
import { initNavigation } from './ui/navigation.js';
import { initWorkExpTabs } from './ui/work-exp-tabs.js';

// Optional enhancements must not disable contact or hide the document.
for (const init of [
  () => languageManager.init(), () => contactFormManager.init(), () => themeManager.init(),
  initNavigation, initWorkExpTabs, initActiveNav, initPortfolioFilter,
  initCounters, updateFooterYear, initDesignSystemEnhancements,
]) {
  try { init(); } catch (error) { console.error('Feature initialization failed:', error); }
}
