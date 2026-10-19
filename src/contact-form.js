import { translate } from './translations.js';
import { validateContactValue, buildMailto } from './contact-validation.js';

export class ContactFormManager {
  init() {
    this.form = document.getElementById('contact-form');
    if (!this.form || this.form.dataset.ready) return;
    this.inputs = [...this.form.querySelectorAll('input, textarea')];
    this.status = document.getElementById('contact-status');
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
    this.form.removeAttribute('onsubmit');
    this.form.dataset.ready = 'true';
    document.getElementById('contact-send-btn').disabled = false;
  }
  clearFieldError(input) {
    const error = document.getElementById('contact-' + input.name + '-error');
    error.hidden = true;
    error.textContent = '';
    delete error.dataset.i18n;
    input.removeAttribute('aria-invalid');
  }
  validateField(input) {
    const code = validateContactValue(input.name, input.value, input.maxLength);
    this.clearFieldError(input);
    if (!code) return true;
    const error = document.getElementById('contact-' + input.name + '-error');
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
