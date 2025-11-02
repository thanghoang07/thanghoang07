/**
 * 📧 Contact Form Handler
 * Enhanced contact form with validation and better UX
 */

import { colorSystem, getColor } from './color-system.js';

/**
 * Contact Form Manager Class
 */
export class ContactFormManager {
  constructor() {
    this.form = null;
    this.submitButton = null;
    this.isSubmitting = false;
  }

  /**
   * Initialize contact form functionality
   */
  init() {
    console.log('📧 Initializing contact form...');

    this.form = document.querySelector('#contact form');
    if (!this.form) {
      console.warn('Contact form not found');
      return;
    }

    this.submitButton = this.form.querySelector('[type="submit"], #contact-send-btn');
    
    this.setupFormValidation();
    this.setupFormSubmission();
    this.setupInputEnhancements();

    console.log('✅ Contact form ready');
  }

  /**
   * Setup form validation
   */
  setupFormValidation() {
    const inputs = this.form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
      // Real-time validation
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });
  }

  /**
   * Setup form submission handler
   */
  setupFormSubmission() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });
  }

  /**
   * Setup input enhancements
   */
  setupInputEnhancements() {
    const inputs = this.form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
      // Add floating label effect
      this.addFloatingLabelEffect(input);
      
      // Add character counter for textarea
      if (input.tagName === 'TEXTAREA') {
        this.addCharacterCounter(input);
      }
    });
  }

  /**
   * Handle form submission
   */
  async handleFormSubmit() {
    if (this.isSubmitting) return;

    // Validate all fields
    const isValid = this.validateForm();
    if (!isValid) {
      this.showError('Vui lòng kiểm tra lại thông tin đã nhập.');
      return;
    }

    this.isSubmitting = true;
    this.setSubmittingState(true);

    try {
      const formData = this.getFormData();
      console.log('Contact form submitted:', formData);

      // Simulate API call
      await this.simulateSubmission();

      // Show success message
      this.showSuccess('Cảm ơn bạn đã liên hệ! Tôi sẽ phản hồi sớm nhất có thể.');
      this.resetForm();

    } catch (error) {
      console.error('Form submission error:', error);
      this.showError('Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.');
    } finally {
      this.isSubmitting = false;
      this.setSubmittingState(false);
    }
  }

  /**
   * Get form data
   */
  getFormData() {
    const formData = new FormData(this.form);
    return {
      name: formData.get('name') || document.getElementById('contact-name-input')?.value || '',
      email: formData.get('email') || document.getElementById('contact-email-input')?.value || '',
      message: formData.get('message') || document.getElementById('contact-message-input')?.value || ''
    };
  }

  /**
   * Validate entire form
   */
  validateForm() {
    const inputs = this.form.querySelectorAll('input, textarea');
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  /**
   * Validate individual field
   */
  validateField(input) {
    const value = input.value.trim();
    const fieldName = input.name || input.id;
    let isValid = true;
    let errorMessage = '';

    // Required field validation
    if (!value) {
      errorMessage = 'Trường này là bắt buộc.';
      isValid = false;
    } else {
      // Field-specific validation
      switch (fieldName) {
        case 'email':
        case 'contact-email-input':
          if (!this.isValidEmail(value)) {
            errorMessage = 'Email không hợp lệ.';
            isValid = false;
          }
          break;
        case 'name':
        case 'contact-name-input':
          if (value.length < 2) {
            errorMessage = 'Tên phải có ít nhất 2 ký tự.';
            isValid = false;
          }
          break;
        case 'message':
        case 'contact-message-input':
          if (value.length < 10) {
            errorMessage = 'Tin nhắn phải có ít nhất 10 ký tự.';
            isValid = false;
          }
          break;
      }
    }

    // Show/hide field error
    if (!isValid) {
      this.showFieldError(input, errorMessage);
    } else {
      this.clearFieldError(input);
    }

    return isValid;
  }

  /**
   * Validate email format
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Show field error
   */
  showFieldError(input, message) {
    // Remove existing error
    this.clearFieldError(input);

    // Add error class
    input.classList.add('error');

    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 0.25rem;
      animation: fadeIn 0.3s ease;
    `;

    // Insert after input
    input.parentNode.insertBefore(errorElement, input.nextSibling);
  }

  /**
   * Clear field error
   */
  clearFieldError(input) {
    input.classList.remove('error');
    const errorElement = input.parentNode.querySelector('.field-error');
    if (errorElement) {
      errorElement.remove();
    }
  }

  /**
   * Add floating label effect
   */
  addFloatingLabelEffect(input) {
    const placeholder = input.placeholder;
    if (!placeholder) return;

    // Create floating label
    const label = document.createElement('label');
    label.textContent = placeholder;
    label.className = 'floating-label';
    label.style.cssText = `
      position: absolute;
      left: 0.75rem;
      top: 0.75rem;
      background: white;
      padding: 0 0.25rem;
      font-size: 0.875rem;
      color: #6b7280;
      pointer-events: none;
      transition: all 0.2s ease;
      z-index: 1;
    `;

    // Wrap input in relative container
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);
    wrapper.appendChild(label);

    // Handle focus/blur events
    const updateLabel = () => {
      if (input.value || input === document.activeElement) {
        label.style.transform = 'translateY(-1.5rem) scale(0.875)';
        label.style.color = getColor('primary', 600);
      } else {
        label.style.transform = 'translateY(0) scale(1)';
        label.style.color = getColor('secondary', 500);
      }
    };

    input.addEventListener('focus', updateLabel);
    input.addEventListener('blur', updateLabel);
    input.addEventListener('input', updateLabel);

    // Initial state
    updateLabel();

    // Clear placeholder to avoid overlap
    input.placeholder = '';
  }

  /**
   * Add character counter
   */
  addCharacterCounter(textarea) {
    const maxLength = textarea.getAttribute('maxlength') || 500;
    
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.style.cssText = `
      text-align: right;
      font-size: 0.75rem;
      color: #6b7280;
      margin-top: 0.25rem;
    `;

    textarea.parentNode.appendChild(counter);

    const updateCounter = () => {
      const current = textarea.value.length;
      counter.textContent = `${current}/${maxLength}`;
      
      if (current > maxLength * 0.8) {
        counter.style.color = getColor('warning', 500);
      } else if (current === maxLength) {
        counter.style.color = getColor('error', 500);
      } else {
        counter.style.color = getColor('secondary', 500);
      }
    };

    textarea.addEventListener('input', updateCounter);
    updateCounter();
  }

  /**
   * Set submitting state
   */
  setSubmittingState(isSubmitting) {
    if (!this.submitButton) return;

    if (isSubmitting) {
      this.submitButton.disabled = true;
      this.submitButton.textContent = 'Đang gửi...';
      this.submitButton.style.opacity = '0.7';
    } else {
      this.submitButton.disabled = false;
      this.submitButton.textContent = 'Gửi tin nhắn';
      this.submitButton.style.opacity = '1';
    }
  }

  /**
   * Simulate form submission (replace with actual API call)
   */
  simulateSubmission() {
    return new Promise((resolve) => {
      setTimeout(resolve, 1500); // Simulate 1.5s API call
    });
  }

  /**
   * Show success message
   */
  showSuccess(message) {
    this.showNotification(message, 'success');
  }

  /**
   * Show error message
   */
  showError(message) {
    this.showNotification(message, 'error');
  }

  /**
   * Show notification
   */
  showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.form-notification');
    if (existingNotification) {
      existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'form-notification';
    notification.textContent = message;
    
    const backgroundGradient = type === 'success' 
      ? colorSystem.getGradient('success')
      : colorSystem.getGradient('error');
    
    notification.style.cssText = `
      position: fixed;
      top: 2rem;
      right: 2rem;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      color: white;
      font-weight: 500;
      z-index: 10000;
      animation: slideIn 0.3s ease;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      background: ${backgroundGradient};
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 5000);

    // Add animations
    if (!document.querySelector('#notification-styles')) {
      const style = document.createElement('style');
      style.id = 'notification-styles';
      style.textContent = `
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  /**
   * Reset form to initial state
   */
  resetForm() {
    this.form.reset();
    
    // Clear all field errors
    const inputs = this.form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      this.clearFieldError(input);
      
      // Reset floating labels
      const label = input.parentNode.querySelector('.floating-label');
      if (label) {
        label.style.transform = 'translateY(0) scale(1)';
        label.style.color = getColor('secondary', 500);
      }
    });

    // Reset character counters
    const counters = this.form.querySelectorAll('.character-counter');
    counters.forEach(counter => {
      const textarea = counter.parentNode.querySelector('textarea');
      if (textarea) {
        const maxLength = textarea.getAttribute('maxlength') || 500;
        counter.textContent = `0/${maxLength}`;
        counter.style.color = getColor('secondary', 500);
      }
    });
  }
}

// Initialize work experience tabs (moved from main.js)
export function initWorkExperienceTabs() {
  const tabs = document.querySelectorAll('.company-tab');
  const details = document.querySelectorAll('.company-detail');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const company = tab.dataset.company;

      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove('active', 'bg-purple-50', 'text-purple-600'));
      tabs.forEach(t => t.classList.add('bg-white', 'text-gray-700'));

      // Add active class to clicked tab
      tab.classList.add('active', 'bg-purple-50', 'text-purple-600');
      tab.classList.remove('bg-white', 'text-gray-700');

      // Hide all details
      details.forEach(d => d.classList.add('hidden'));

      // Show selected detail
      const targetDetail = document.getElementById(`exp-${company}`);
      if (targetDetail) {
        targetDetail.classList.remove('hidden');
      }

      console.log(`Switched to company: ${company}`);
    });
  });
}

// Create and export singleton instance
export const contactFormManager = new ContactFormManager();