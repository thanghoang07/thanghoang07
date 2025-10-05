export function initContactForm() {
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
