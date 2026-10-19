import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyPortfolioFilter,
  formatCounterValue,
  initActiveNav,
  initPortfolioFilter,
  shouldShowProject,
  updateFooterYear,
} from '../../src/ui/page-interactions.js';
import { initWorkExpTabs } from '../../src/ui/work-exp-tabs.js';
import { LanguageManager } from '../../src/translations.js';

function classList(initial = []) {
  const values = new Set(initial);
  return {
    add: (name) => values.add(name),
    remove: (name) => values.delete(name),
    contains: (name) => values.has(name),
    toggle(name, force) {
      const shouldHave = force === undefined ? !values.has(name) : Boolean(force);
      if (shouldHave) values.add(name);
      else values.delete(name);
      return shouldHave;
    },
  };
}

function element({ href, category, classes = [] } = {}) {
  return {
    dataset: category ? { projectCategory: category, filter: category } : {},
    classList: classList(classes),
    getAttribute(name) {
      if (name === 'href') return href;
      return null;
    },
  };
}

test('shouldShowProject supports all and exact category filters', () => {
  assert.equal(shouldShowProject('enterprise', 'all'), true);
  assert.equal(shouldShowProject('enterprise', 'enterprise'), true);
  assert.equal(shouldShowProject('mobile', 'backend'), false);
});

test('applyPortfolioFilter activates one button and hides non-matching cards', () => {
  const all = element();
  const enterprise = element();
  const mobile = element();
  const cards = [element({ category: 'enterprise' }), element({ category: 'mobile' })];

  applyPortfolioFilter(cards, [all, enterprise, mobile], enterprise, 'enterprise');

  assert.equal(enterprise.classList.contains('active'), true);
  assert.equal(all.classList.contains('active'), false);
  assert.equal(cards[0].classList.contains('is-filtered-out'), false);
  assert.equal(cards[1].classList.contains('is-filtered-out'), true);
});

test('initPortfolioFilter wires delegated click handling and returns cleanup', () => {
  const allButton = { dataset: { filter: 'all' }, classList: classList(['active']) };
  const backendButton = { dataset: { filter: 'backend' }, classList: classList(), closest: () => backendButton };
  const cards = [element({ category: 'backend' }), element({ category: 'mobile' })];
  let listener;
  let removed = false;
  const filterBar = {
    querySelectorAll: () => [allButton, backendButton],
    addEventListener: (_type, cb) => { listener = cb; },
    removeEventListener: (_type, cb) => { removed = cb === listener; },
  };
  const doc = {
    querySelector: () => filterBar,
    querySelectorAll: () => cards,
  };

  const cleanup = initPortfolioFilter(doc);
  listener({ target: backendButton });
  cleanup();

  assert.equal(backendButton.classList.contains('active'), true);
  assert.equal(cards[0].classList.contains('is-filtered-out'), false);
  assert.equal(cards[1].classList.contains('is-filtered-out'), true);
  assert.equal(removed, true);
});

test('initActiveNav highlights the section with the strongest intersection', () => {
  const servicesLink = element({ href: '#services' });
  const portfolioLink = element({ href: '#portfolio' });
  const sections = { services: { id: 'services' }, portfolio: { id: 'portfolio' } };
  let observerCallback;
  const observed = [];
  const observer = {
    observe: (section) => observed.push(section.id),
    disconnect: () => {},
  };
  const doc = {
    querySelectorAll: () => [servicesLink, portfolioLink],
    getElementById: (id) => sections[id] || null,
  };
  const win = {
    scrollY: 250,
    IntersectionObserver: true,
    addEventListener: () => {},
    removeEventListener: () => {},
  };

  initActiveNav({
    doc,
    win,
    sectionIds: ['services', 'portfolio'],
    observerFactory: (callback) => {
      observerCallback = callback;
      return observer;
    },
  });
  observerCallback([
    { target: sections.services, isIntersecting: true, intersectionRatio: 0.31 },
    { target: sections.portfolio, isIntersecting: true, intersectionRatio: 0.72 },
  ]);

  assert.deepEqual(observed, ['services', 'portfolio']);
  assert.equal(portfolioLink.classList.contains('active'), true);
  assert.equal(servicesLink.classList.contains('active'), false);
});

test('formatCounterValue clamps progress and appends suffix', () => {
  assert.equal(formatCounterValue(10, 0.52, '+'), '5+');
  assert.equal(formatCounterValue(10, 2, '+'), '10+');
  assert.equal(formatCounterValue(10, -1), '0');
});

test('updateFooterYear writes the supplied year when footer exists', () => {
  const footerYear = { textContent: '' };
  updateFooterYear({ getElementById: () => footerYear }, new Date('2032-01-01T00:00:00Z'));
  assert.equal(footerYear.textContent, '2032');
});

test('active navigation updates desktop and mobile copies across observer batches', () => {
  const desktop = element({ href: '#services' });
  const mobile = element({ href: '#services' });
  const portfolio = element({ href: '#portfolio' });
  let callback;
  initActiveNav({
    doc: { querySelectorAll: () => [desktop, mobile, portfolio], getElementById: id => ({ id }) },
    win: { scrollY: 250, IntersectionObserver: true, addEventListener() {}, removeEventListener() {} },
    sectionIds: ['services', 'portfolio'],
    observerFactory: cb => { callback = cb; return { observe() {}, disconnect() {} }; },
  });
  callback([{ target: { id: 'services' }, isIntersecting: true, intersectionRatio: 0.8 }]);
  assert.equal(desktop.classList.contains('active'), true);
  assert.equal(mobile.classList.contains('active'), true);
  callback([{ target: { id: 'portfolio' }, isIntersecting: true, intersectionRatio: 0.2 }]);
  assert.equal(desktop.classList.contains('active'), true);
});

test('initWorkExpTabs assigns WAI-ARIA tab roles and handles keyboard navigation', () => {
  const attrs = new Map();
  const makeTab = (id) => {
    const tabAttrs = new Map();
    const handlers = {};
    return {
      id,
      tabIndex: -1,
      focused: false,
      classList: classList(),
      setAttribute: (k, v) => tabAttrs.set(k, v),
      getAttribute: (k) => tabAttrs.get(k),
      addEventListener: (type, cb) => { handlers[type] = cb; },
      focus() { this.focused = true; },
      triggerKey(key) { handlers.keydown?.({ key, preventDefault() {} }); },
    };
  };
  const makePanel = (id) => {
    const panelAttrs = new Map();
    return {
      id,
      hidden: false,
      tabIndex: -1,
      setAttribute: (k, v) => panelAttrs.set(k, v),
      getAttribute: (k) => panelAttrs.get(k),
    };
  };
  const tabs = [makeTab('tab-hpt'), makeTab('tab-tk25')];
  const panels = { 'content-hpt': makePanel('content-hpt'), 'content-tk25': makePanel('content-tk25') };
  const list = {
    setAttribute: (k, v) => attrs.set(k, v),
    querySelectorAll: () => tabs,
  };
  const doc = {
    querySelector: () => list,
    getElementById: (id) => panels[id] || null,
  };

  initWorkExpTabs(doc);
  assert.equal(attrs.get('role'), 'tablist');
  assert.equal(tabs[0].getAttribute('role'), 'tab');
  assert.equal(tabs[0].getAttribute('aria-selected'), 'true');
  assert.equal(panels['content-hpt'].hidden, false);
  assert.equal(panels['content-tk25'].hidden, true);

  tabs[0].triggerKey('ArrowRight');
  assert.equal(tabs[1].getAttribute('aria-selected'), 'true');
  assert.equal(tabs[1].focused, true);
  assert.equal(panels['content-tk25'].hidden, false);
  assert.equal(panels['content-hpt'].hidden, true);
});

test('LanguageManager updates text, aria-label, and language badges safely', () => {
  const textEl = { dataset: { i18n: 'nav-contact' }, textContent: '' };
  const ariaEl = {
    dataset: { i18nAria: 'toggle-language' },
    label: '',
    setAttribute(_k, v) { this.label = v; },
  };
  const viBadge = { hidden: true };
  const enBadge = { hidden: false };
  const doc = {
    documentElement: { lang: 'en' },
    querySelectorAll: (sel) => (sel === '[data-i18n]' ? [textEl] : [ariaEl]),
    getElementById: (id) => {
      if (id === 'lang-vi-icon') return viBadge;
      if (id === 'lang-en-icon') return enBadge;
      return null;
    },
  };

  const manager = new LanguageManager();
  manager.init(doc);
  manager.applyLanguage('vi');
  assert.equal(doc.documentElement.lang, 'vi');
  assert.equal(textEl.textContent, 'Liên hệ');
  assert.equal(ariaEl.label, 'Switch to English');
  assert.equal(viBadge.hidden, false);
  assert.equal(enBadge.hidden, true);
});
