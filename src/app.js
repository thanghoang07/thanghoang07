import { initTranslations } from './translations.js';
import { initTheme } from './theme.js';
import { initNavigation } from './navigation.js';

// Constants for better maintainability
const ANIMATION_CONFIG = {
  DURATION: 2000,
  TYPING_SPEED: 100,
  TYPING_DELAY: 500,
  CURSOR_DELAY: 1000,
  SCROLL_THRESHOLD: 0.1,
  SCROLL_MARGIN: '0px 0px -50px 0px',
  PARALLAX_SPEED: 0.5
};

const ANIMATION_CLASSES = {
  FADE_IN_UP: 'fade-in-up',
  FADE_IN_LEFT: 'fade-in-left',
  FADE_IN_RIGHT: 'fade-in-right',
  FADE_IN_SCALE: 'fade-in-scale',
  SLIDE_IN_UP: 'slide-in-up',
  SLIDE_IN_DOWN: 'slide-in-down',
  STAGGER_1: 'stagger-1',
  STAGGER_2: 'stagger-2',
  STAGGER_3: 'stagger-3',
  STAGGER_4: 'stagger-4',
  STAGGER_5: 'stagger-5'
};

export function initApp() {
  initTranslations();
  initTheme();
  initNavigation();
  initScrollEffects();
  initParallaxEffect();
  initContactForm();
  setTimeout(ensureElementsVisible, 100);
}

function ensureElementsVisible() {
  const elements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale, section, .card');
  elements.forEach(el => {
    if (el.classList.contains('revealed')) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0) translateX(0) scale(1)';
    }
  });
}

function initScrollEffects() {
  const observer = new IntersectionObserver(handleIntersection, {
    threshold: ANIMATION_CONFIG.SCROLL_THRESHOLD,
    rootMargin: ANIMATION_CONFIG.SCROLL_MARGIN
  });

  const targets = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale, section, .card');
  targets.forEach(el => observer.observe(el));
}

function handleIntersection(entries) {
  entries.forEach(entry => {
    const el = entry.target;
    
    if (entry.isIntersecting) {
      handleElementVisible(el);
    } else {
      handleElementHidden(el);
    }
  });
}

function handleElementVisible(element) {
  resetAnimationClasses(element);
  element.classList.add('revealed');
  
  const animationType = element.dataset.animation || 'fade-in-up';
  const stagger = element.dataset.stagger || '';
  
  // Force reflow for smooth animation
  element.offsetHeight;
  
  if (stagger) {
    element.classList.add(stagger);
  }
  
  element.classList.add(animationType);
}

function handleElementHidden(element) {
  resetAnimationClasses(element);
  element.classList.remove('revealed');
}

function resetAnimationClasses(element) {
  const classesToRemove = [
    ANIMATION_CLASSES.FADE_IN_UP,
    ANIMATION_CLASSES.FADE_IN_LEFT,
    ANIMATION_CLASSES.FADE_IN_RIGHT,
    ANIMATION_CLASSES.FADE_IN_SCALE,
    ANIMATION_CLASSES.SLIDE_IN_UP,
    ANIMATION_CLASSES.SLIDE_IN_DOWN,
    ANIMATION_CLASSES.STAGGER_1,
    ANIMATION_CLASSES.STAGGER_2,
    ANIMATION_CLASSES.STAGGER_3,
    ANIMATION_CLASSES.STAGGER_4,
    ANIMATION_CLASSES.STAGGER_5
  ];
  
  element.classList.remove(...classesToRemove);
}

function initParallaxEffect() {
  let ticking = false;
  
  function updateParallax() {
    const scrolled = window.scrollY;
    document.querySelectorAll('.parallax').forEach(el => {
      const speed = el.dataset.speed || ANIMATION_CONFIG.PARALLAX_SPEED;
      el.style.transform = `translateY(${-scrolled * speed}px)`;
    });
    ticking = false;
  }
  
  function requestParallaxUpdate() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
}

export function addTypingEffect() {
  const heroName = document.getElementById('hero-name');
  if (!heroName) return;
  
  const text = heroName.textContent;
  heroName.textContent = '';
  heroName.style.borderRight = '2px solid #9333ea';
  
  let i = 0;
  
  function typeWriter() {
    if (i < text.length) {
      heroName.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, ANIMATION_CONFIG.TYPING_SPEED);
    } else {
      setTimeout(() => {
        heroName.style.borderRight = 'none';
      }, ANIMATION_CONFIG.CURSOR_DELAY);
    }
  }
  
  setTimeout(typeWriter, ANIMATION_CONFIG.TYPING_DELAY);
}

export function addCounterEffect() {
  const counters = document.querySelectorAll('[data-counter]');
  
  counters.forEach(counter => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(counter);
          observer.unobserve(entry.target);
        }
      });
    });
    
    observer.observe(counter);
  });
}

function animateCounter(counter) {
  const target = parseInt(counter.dataset.counter);
  const duration = ANIMATION_CONFIG.DURATION;
  const step = target / (duration / 16);
  let current = 0;
  
  function update() {
    current += step;
    if (current < target) {
      counter.textContent = Math.floor(current);
      requestAnimationFrame(update);
    } else {
      counter.textContent = target;
    }
  }
  
  update();
}

export function initWorkExpTabs() {
  const tabs = document.querySelectorAll('.company-tab');
  const details = document.querySelectorAll('.company-detail');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => handleTabClick(tab, tabs, details));
  });
}

function handleTabClick(clickedTab, allTabs, allDetails) {
  // Remove active state from all tabs
  allTabs.forEach(tab => tab.classList.remove('active'));
  
  // Hide all details
  allDetails.forEach(detail => detail.classList.add('hidden'));
  
  // Activate clicked tab
  clickedTab.classList.add('active');
  
  // Show corresponding detail
  const detail = document.getElementById('exp-' + clickedTab.dataset.company);
  if (detail) {
    detail.classList.remove('hidden');
  }
}

// Enhanced Contact Form with Validation and Error Handling
function initContactForm() {
  const contactForm = document.querySelector('#contact form');
  if (!contactForm) return;

  const nameInput = document.getElementById('contact-name-input');
  const emailInput = document.getElementById('contact-email-input');
  const messageInput = document.getElementById('contact-message-input');
  const submitBtn = document.getElementById('contact-send-btn');

  // Add form validation attributes
  nameInput.setAttribute('minlength', '2');
  nameInput.setAttribute('maxlength', '50');
  messageInput.setAttribute('minlength', '10');
  messageInput.setAttribute('maxlength', '1000');

  // Real-time validation
  const inputs = [nameInput, emailInput, messageInput];
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => clearFieldError(input));
  });

  // Form submission with error handling
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showFormError('Vui lòng kiểm tra và sửa các lỗi trong form.');
      return;
    }

    // Show loading state
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Đang gửi...';
    submitBtn.disabled = true;
    submitBtn.classList.add('opacity-50');

    try {
      // Simulate form submission (replace with actual API call)
      await submitForm({
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        message: messageInput.value.trim()
      });

      // Success feedback
      showFormSuccess('Tin nhắn đã được gửi thành công! Chúng tôi sẽ liên hệ lại sớm nhất.');
      contactForm.reset();
      clearAllFieldErrors();

    } catch (error) {
      // Error handling
      console.error('Form submission error:', error);
      showFormError('Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.');
    } finally {
      // Reset button state
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      submitBtn.classList.remove('opacity-50');
    }
  });
}

function validateField(field) {
  const value = field.value.trim();
  let isValid = true;
  let errorMessage = '';

  // Remove existing error styling
  clearFieldError(field);

  // Validation rules
  switch (field.type) {
    case 'text':
      if (value.length < 2) {
        isValid = false;
        errorMessage = 'Tên phải có ít nhất 2 ký tự';
      } else if (value.length > 50) {
        isValid = false;
        errorMessage = 'Tên không được quá 50 ký tự';
      }
      break;

    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Email không hợp lệ';
      }
      break;

    case 'textarea':
      if (value.length < 10) {
        isValid = false;
        errorMessage = 'Nội dung phải có ít nhất 10 ký tự';
      } else if (value.length > 1000) {
        isValid = false;
        errorMessage = 'Nội dung không được quá 1000 ký tự';
      }
      break;
  }

  if (!isValid) {
    showFieldError(field, errorMessage);
  }

  return isValid;
}

function validateForm() {
  const nameInput = document.getElementById('contact-name-input');
  const emailInput = document.getElementById('contact-email-input');
  const messageInput = document.getElementById('contact-message-input');

  const isNameValid = validateField(nameInput);
  const isEmailValid = validateField(emailInput);
  const isMessageValid = validateField(messageInput);

  return isNameValid && isEmailValid && isMessageValid;
}

function showFieldError(field, message) {
  // Add error styling
  field.classList.add('border-red-500', 'focus:ring-red-400');
  
  // Create or update error message
  let errorElement = field.parentNode.querySelector('.field-error');
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.className = 'field-error text-red-500 text-sm mt-1';
    field.parentNode.appendChild(errorElement);
  }
  errorElement.textContent = message;
}

function clearFieldError(field) {
  field.classList.remove('border-red-500', 'focus:ring-red-400');
  const errorElement = field.parentNode.querySelector('.field-error');
  if (errorElement) {
    errorElement.remove();
  }
}

function clearAllFieldErrors() {
  const inputs = document.querySelectorAll('#contact input, #contact textarea');
  inputs.forEach(input => clearFieldError(input));
}

function showFormError(message) {
  showFormMessage(message, 'error');
}

function showFormSuccess(message) {
  showFormMessage(message, 'success');
}

function showFormMessage(message, type) {
  // Remove existing messages
  const existingMessage = document.querySelector('.form-message');
  if (existingMessage) {
    existingMessage.remove();
  }

  // Create new message
  const messageElement = document.createElement('div');
  messageElement.className = `form-message p-4 rounded-lg mb-4 ${
    type === 'error' 
      ? 'bg-red-100 border border-red-400 text-red-700' 
      : 'bg-green-100 border border-green-400 text-green-700'
  }`;
  messageElement.textContent = message;

  // Insert message before form
  const form = document.querySelector('#contact form');
  form.parentNode.insertBefore(messageElement, form);

  // Auto-remove message after 5 seconds
  setTimeout(() => {
    if (messageElement.parentNode) {
      messageElement.remove();
    }
  }, 5000);
}

// Simulate form submission (replace with actual API call)
async function submitForm(formData) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulate random failure (remove in production)
  if (Math.random() < 0.1) {
    throw new Error('Network error simulation');
  }
  
  // Return success response
  return { success: true, message: 'Form submitted successfully' };
}