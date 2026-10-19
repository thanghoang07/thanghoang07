import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import puppeteer from 'puppeteer-core';
import { Launcher } from 'chrome-launcher';
import { preview } from 'vite';

const require = createRequire(import.meta.url);
const server = await preview({ preview: { host: '127.0.0.1', port: 4183, strictPort: true, open: false } });
const base = process.env.BASE_PATH || '/thanghoang07/';
const url = `http://127.0.0.1:4183${base}`;
let browser;
const errors = [];
const measurements = [];
const accessibility = [];
await mkdir('output/playwright', { recursive: true });

try {
  browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || Launcher.getInstallations()[0], headless: true });
  const page = await browser.newPage();
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('response', response => {
    if (response.url().startsWith(url) && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
  });
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.waitForSelector('#contact-form[data-ready="true"]');
  assert.equal(await page.$eval('#contact-send-btn', el => el.disabled), false);

  for (const lang of ['en', 'vi']) {
    await page.evaluate(lang => localStorage.setItem('language', lang), lang);
    await page.reload({ waitUntil: 'networkidle0' });
    assert.equal(await page.$eval('html', el => el.lang), lang);
    assert.equal(await page.$eval('#nav-contact', el => el.textContent), lang === 'vi' ? 'Liên hệ' : 'Contact');
    assert.equal(await page.$eval('#hero-name .typing-text', el => el.textContent), 'Thang Hoang Duc.');
    for (const theme of ['light', 'dark']) {
      await page.evaluate(theme => localStorage.setItem('theme', theme), theme);
      await page.reload({ waitUntil: 'networkidle0' });
      assert.equal(await page.$eval('html', el => el.classList.contains('dark')), theme === 'dark');
      for (const width of [320, 375, 768, 1024, 1440]) {
        await page.setViewport({ width, height: 900 });
        const result = await page.evaluate(() => ({
          width: innerWidth, scroll: document.documentElement.scrollWidth,
          nav: getComputedStyle(document.querySelector('header nav')).display,
          menu: getComputedStyle(document.getElementById('mobile-menu-btn')).display,
          form: document.querySelector('form').getBoundingClientRect().width,
        }));
        measurements.push({ lang, theme, ...result });
        assert.ok(result.scroll <= width + 1, `Overflow: ${JSON.stringify(result)} ${lang} ${theme}`);
        assert.equal(result.nav === 'none', width < 768);
        assert.equal(result.menu === 'none', width >= 768);
        assert.ok(result.form >= 270, `Contact form too narrow: ${result.form}`);
      }
      await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
      const findings = await page.evaluate(async () => (await axe.run(document, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
      })).violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) })));
      accessibility.push({ lang, theme, findings });
      await page.screenshot({ path: `output/playwright/fixed-${lang}-${theme}-1440.png` });
    }
  }

  await page.setViewport({ width: 375, height: 900 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.click('#mobile-menu-btn');
  assert.equal(await page.$eval('#mobile-menu-btn', el => el.getAttribute('aria-expanded')), 'true');
  await page.keyboard.press('Escape');
  assert.equal(await page.$eval('#mobile-menu', el => el.hidden), true);
  assert.equal(await page.evaluate(() => document.activeElement.id), 'mobile-menu-btn');

  await page.focus('#tab-hpt');
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.$eval('#tab-tk25', el => el.getAttribute('aria-selected')), 'true');
  assert.equal(await page.$eval('#content-tk25', el => el.hidden), false);
  assert.equal(await page.$eval('#content-hpt', el => el.hidden), true);
  await page.click('[data-filter="mobile"]');
  assert.equal(await page.$$eval('[data-project-category]', els => els.filter(el => getComputedStyle(el).display !== 'none').length), 1);
  assert.equal(await page.$eval('[data-filter="mobile"]', el => el.getAttribute('aria-pressed')), 'true');
  await page.click('[data-filter="all"]');

  await page.type('#contact-name-input', 'A');
  await page.type('#contact-email-input', 'user@example.com');
  await page.type('#contact-message-input', 'abc');
  await page.click('#contact-send-btn');
  assert.equal(page.url(), url, 'Invalid submit must not navigate or add personal data to URL');
  assert.equal(await page.$eval('#contact-name-error', el => el.hidden), false);
  assert.equal(await page.$eval('#contact-message-error', el => el.hidden), false);
  await page.type('#contact-name-input', 'nna');
  assert.equal(await page.$eval('#contact-name-error', el => el.hidden), true);
  assert.equal(await page.$eval('#contact-message-error', el => el.hidden), false);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.click('#toggle-language');
  assert.equal(await page.$eval('#contact-message-error', el => el.textContent), 'Use at least 10 characters for your message.');
  assert.equal(await page.$eval('#contact-message-input', el => el.value), 'abc');
  await page.$eval('#contact', el => el.scrollIntoView({ behavior: 'instant' }));
  await page.screenshot({ path: 'output/playwright/fixed-contact-375.png' });

  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  assert.equal(await page.$eval('.ds-cursor-glow', el => getComputedStyle(el).display), 'none');
  assert.equal(await page.$$eval('.ds-cursor-glow', els => els.length), 1);

  const noJS = await browser.newPage();
  await noJS.setJavaScriptEnabled(false);
  await noJS.setViewport({ width: 320, height: 800 });
  await noJS.goto(url, { waitUntil: 'networkidle0' });
  assert.ok(await noJS.$eval('h1', el => el.getBoundingClientRect().height > 0 && getComputedStyle(el).opacity === '1'));
  assert.equal(await noJS.$eval('#contact-send-btn', el => el.disabled), true);
  assert.equal(await noJS.$$eval('.ds-exp-panel', els => els.every(el => getComputedStyle(el).display !== 'none')), true);
  assert.ok(await noJS.$('a[href="mailto:thanghoang07@gmail.com"]'));
  assert.equal(await noJS.$('#page-loader'), null);

  await writeFile('output/playwright/verification.json', JSON.stringify({ measurements, errors, accessibility }, null, 2));
  assert.deepEqual(errors, [], 'Browser errors');
  assert.deepEqual(accessibility.filter(result => result.findings.length), [], 'Accessibility violations (see verification.json)');
  console.log(`Production smoke passed: ${measurements.length} responsive combinations, navigation, form, language, no-JS and axe.`);
} finally {
  await browser?.close();
  await new Promise(resolve => server.httpServer.close(resolve));
}
