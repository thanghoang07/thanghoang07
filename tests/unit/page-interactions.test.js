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
import { CONTACT_MESSAGES } from '../../src/contact-messages.js';
import { switchWorkExperienceTab } from '../../src/ui/work-exp-tabs.js';

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
    attributes: {},
    dataset: category ? { projectCategory: category, filter: category } : {},
    classList: classList(classes),
    getAttribute(name) {
      if (name === 'href') return href;
      return this.attributes[name] || null;
    },
    setAttribute(name, value) {
      this.attributes[name] = value;
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

test('contact messages stay readable and centralized', () => {
  assert.equal(CONTACT_MESSAGES.invalidEmail, 'Email không hợp lệ.');
  assert.equal(CONTACT_MESSAGES.submit, 'Gửi tin nhắn');
});
test('switchWorkExperienceTab activates matching tab and panel only', () => {
  const nodes = {
    'tab-hpt': element(),
    'tab-tk25': element(),
    'content-hpt': element({ classes: ['hidden'] }),
    'content-tk25': element(),
  };
  const doc = { getElementById: (id) => nodes[id] || null };

  switchWorkExperienceTab('hpt', doc);

  assert.equal(nodes['tab-hpt'].classList.contains('active'), true);
  assert.equal(nodes['tab-tk25'].classList.contains('active'), false);
  assert.equal(nodes['tab-hpt'].getAttribute('aria-selected'), 'true');
  assert.equal(nodes['tab-tk25'].getAttribute('aria-selected'), 'false');
  assert.equal(nodes['content-hpt'].classList.contains('hidden'), false);
  assert.equal(nodes['content-tk25'].classList.contains('hidden'), true);
});
