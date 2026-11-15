import { validateContactValue } from '../../core/validation/contact.validator.js';
import { MailtoTransportAdapter } from '../../infrastructure/mail/mailto-transport.adapter.js';
import { translate } from '../../application/localization/translate.service.js';

export class ContactFormController {
  /**
   * @param {Object} [dependencies]
   * @param {MailtoTransportAdapter} [dependencies.transport]
   * @param {Function} [dependencies.translator]
   */
  constructor({
    transport = new MailtoTransportAdapter(),
    translator = translate,
  } = {}) {
    this.transport = transport;
    this.translator = translator;
    this.copyTimer = null;
  }

  init(doc = document) {
    this.doc = doc;
    this.form = doc.getElementById('contact-form');
    if (!this.form || this.form.dataset.ready) return;

    this.inputs = [...this.form.querySelectorAll('input, textarea')];
    this.status = doc.getElementById('contact-status');
    this.copyBtn = doc.getElementById('contact-copy-email');

    this._bindEvents();
    this._finalizeSetup();
  }

  _bindEvents() {
    this.inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => {
        this.clearFieldError(input);
        if (this.status) {
          this.status.textContent = '';
          delete this.status.dataset.i18n;
        }
      });
    });

    this.form.addEventListener('submit', event => {
      event.preventDefault();
      this.handleFormSubmit();
    });

    if (this.copyBtn) {
      this.copyBtn.addEventListener('click', () => this.handleCopyEmail());
    }
  }

  _finalizeSetup() {
    this.form.removeAttribute('onsubmit');
    this.form.dataset.ready = 'true';
    const sendBtn = this.doc.getElementById('contact-send-btn');
    if (sendBtn) sendBtn.disabled = false;
  }

  async handleCopyEmail(clipboard = typeof navigator !== 'undefined' ? navigator?.clipboard : undefined) {
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
        label.textContent = this.translator('contact-copied');
      }
      if (copyIcon) copyIcon.setAttribute('hidden', '');
      if (checkIcon) checkIcon.removeAttribute('hidden');
      this.copyBtn.classList.add('is-copied');
      this.showStatus('copy-status');
      clearTimeout(this.copyTimer);
      this.copyTimer = setTimeout(() => {
        if (label) {
          label.dataset.i18n = 'contact-copy';
          label.textContent = this.translator('contact-copy');
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
    if (!error) return;
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
    if (error) {
      error.dataset.i18n = 'contact-' + code;
      error.textContent = this.translator(error.dataset.i18n);
      error.hidden = false;
    }
    input.setAttribute('aria-invalid', 'true');
    return false;
  }

  showStatus(key) {
    if (!this.status) return;
    this.status.dataset.i18n = 'contact-' + key;
    this.status.textContent = this.translator(this.status.dataset.i18n);
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
      this.transport.dispatch(data);
      this.showStatus('opened');
    } catch {
      this.showStatus('error');
    }
    // Opening a mail client is not delivery confirmation. Keep the draft intact.
  }
}

export const contactFormManager = new ContactFormController();
export { ContactFormController as ContactFormManager };
