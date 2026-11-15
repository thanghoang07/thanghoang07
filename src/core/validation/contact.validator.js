/**
 * @typedef {'required' | 'tooLong' | 'invalidEmail' | 'nameTooShort' | 'messageTooShort' | null} ContactValidationError
 */

/**
 * Kiểm tra tính hợp lệ của trường thông tin liên hệ.
 * @param {string} name - Tên trường ('name' | 'email' | 'message')
 * @param {string} value - Giá trị nhập vào
 * @param {number} [maxLength=0] - Giới hạn độ dài tối đa
 * @returns {ContactValidationError} Mã lỗi hoặc null nếu hợp lệ
 */
export function validateContactValue(name, value, maxLength = 0) {
  const trimmed = (value ?? '').trim();

  if (!trimmed) {
    return 'required';
  }

  if (maxLength > 0 && trimmed.length > maxLength) {
    return 'tooLong';
  }

  if (name === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return 'invalidEmail';
    }
  }

  if (name === 'name' && trimmed.length < 2) {
    return 'nameTooShort';
  }

  if (name === 'message' && trimmed.length < 10) {
    return 'messageTooShort';
  }

  return null;
}
