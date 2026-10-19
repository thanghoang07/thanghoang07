import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateContactValue, buildMailto } from '../../src/contact-validation.js';
const translations = JSON.parse(readFileSync(new URL('../../src/translations.json', import.meta.url)));

test('contact validates blank, short, malformed and overlong values', () => {
  assert.equal(validateContactValue('name', '  ', 100), 'required');
  assert.equal(validateContactValue('name', 'A', 100), 'nameTooShort');
  assert.equal(validateContactValue('email', 'a@', 254), 'invalidEmail');
  assert.equal(validateContactValue('message', 'abc', 1000), 'messageTooShort');
  assert.equal(validateContactValue('message', 'x'.repeat(1001), 1000), 'tooLong');
  assert.equal(validateContactValue('email', 'user@example.com', 254), null);
});
test('mailto preserves accented text and encodes reserved query characters', () => {
  const uri = new URL(buildMailto({ name: 'Thắng & Co', email: 'a+b@example.com', message: 'Hello? # & tiếng Việt' }));
  assert.equal(uri.protocol, 'mailto:');
  assert.equal(uri.searchParams.get('subject'), 'Portfolio contact: Thắng & Co');
  assert.match(uri.searchParams.get('body'), /Hello\? # & tiếng Việt/);
  assert.equal([...uri.searchParams.keys()].length, 2);
});
test('both languages contain the same keys and mailto copy never claims delivery', () => {
  assert.deepEqual(Object.keys(translations.vi).sort(), Object.keys(translations.en).sort());
  assert.equal(translations.vi['contact-invalidEmail'], 'Email không hợp lệ.');
  assert.equal(translations.en['contact-submit'], 'Open email app');
  assert.match(translations.en['contact-opened'], /Finish sending/);
});
