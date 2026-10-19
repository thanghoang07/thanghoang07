export function validateContactValue(name, value, maxLength) {
  value = value.trim();
  if (!value) return 'required';
  if (maxLength > 0 && value.length > maxLength) return 'tooLong';
  if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'invalidEmail';
  if (name === 'name' && value.length < 2) return 'nameTooShort';
  if (name === 'message' && value.length < 10) return 'messageTooShort';
  return null;
}
export function buildMailto({ name, email, message }) {
  const subject = encodeURIComponent('Portfolio contact: ' + name.trim());
  const body = encodeURIComponent('Name: ' + name.trim() + '\nEmail: ' + email.trim() + '\n\n' + message.trim());
  return 'mailto:thanghoang07@gmail.com?subject=' + subject + '&body=' + body;
}
