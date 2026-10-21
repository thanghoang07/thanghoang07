import { translate } from './translations.js';
import { validateContactValue, buildMailto } from './contact-validation.js';

export class ContactFormManager {
  init(doc = document) {
    this.doc = doc;
    this.form = doc.getElementById('contact-form');
    if (!this.form || this.form.dataset.ready) return;
    this.inputs = [...this.form.querySelectorAll('input, textarea')];
    this.status = doc.getElementById('contact-status');
    this.copyBtn = doc.getElementById('contact-copy-email');
    this.inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => {
        this.clearFieldError(input);
        this.status.textContent = '';
        delete this.status.dataset.i18n;
      });
    });
    this.form.addEventListener('submit', event => {
      event.preventDefault();
      this.handleFormSubmit();
    });
    if (this.copyBtn) {
      this.copyBtn.addEventListener('click', () => this.handleCopyEmail());
    }
    this.form.removeAttribute('onsubmit');
    this.form.dataset.ready = 'true';
    doc.getElementById('contact-send-btn').disabled = false;
  }
  async handleCopyEmail(clipboard = navigator?.clipboard) {
    if (!this.copyBtn) return false;
    const email = this.copyBtn.dataset.email || 'thanghoang07@gmail.com';
    try {
      if (clipboard?.writeText) {
        await clipboard.writeText(email);
      }
      const label = this.doc.getElementById('contact-copy-label');
      const copyIcon = this.copyBtn.querySelector('[data-copy-icon="copy"]');
      const checkIcon = this.copyBtn.querySelector('[data-copy-icon="check"]');
      if (label) {
        label.dataset.i18n = 'contact-copied';
        label.textContent = translate('contact-copied');
      }
      if (copyIcon) copyIcon.setAttribute('hidden', '');
      if (checkIcon) checkIcon.removeAttribute('hidden');
      this.copyBtn.classList.add('is-copied');
      this.showStatus('copy-status');
      clearTimeout(this.copyTimer);
      this.copyTimer = setTimeout(() => {
        if (label) {
          label.dataset.i18n = 'contact-copy';
          label.textContent = translate('contact-copy');
        }
        if (copyIcon) copyIcon.removeAttribute('hidden');
        if (checkIcon) checkIcon.setAttribute('hidden', '');
        this.copyBtn.classList.remove('is-copied');
      }, 2400);
      return true;
    } catch {
      this.showStatus('error');
      return false;
    }
  }
  clearFieldError(input) {
    const error = (this.doc || document).getElementById('contact-' + input.name + '-error');
    error.hidden = true;
    error.textContent = '';
    delete error.dataset.i18n;
    input.removeAttribute('aria-invalid');
  }
  validateField(input) {
    const code = validateContactValue(input.name, input.value, input.maxLength);
    this.clearFieldError(input);
    if (!code) return true;
    const error = (this.doc || document).getElementById('contact-' + input.name + '-error');
    error.dataset.i18n = 'contact-' + code;
    error.textContent = translate(error.dataset.i18n);
    error.hidden = false;
    input.setAttribute('aria-invalid', 'true');
    return false;
  }
  showStatus(key) {
    this.status.dataset.i18n = 'contact-' + key;
    this.status.textContent = translate(this.status.dataset.i18n);
  }
  handleFormSubmit() {
    const invalid = this.inputs.filter(input => !this.validateField(input));
    if (invalid.length) {
      this.showStatus('invalidForm');
      invalid[0].focus();
      return;
    }
    const data = Object.fromEntries(this.inputs.map(input => [input.name, input.value]));
    try {
      window.location.href = buildMailto(data);
      this.showStatus('opened');
    } catch {
      this.showStatus('error');
    }
    // Opening a mail client is not delivery confirmation. Keep the draft intact.
  }
}
export const contactFormManager = new ContactFormManager();
