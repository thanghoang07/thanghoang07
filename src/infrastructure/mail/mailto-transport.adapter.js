/**
 * @typedef {Object} ContactPayload
 * @property {string} name
 * @property {string} email
 * @property {string} message
 */

export class MailtoTransportAdapter {
  constructor(targetEmail = 'thanghoang07@gmail.com') {
    this.targetEmail = targetEmail;
  }

  /**
   * Tạo URI Mailto tương thích RFC và giữ nguyên ký tự tiếng Việt.
   * @param {ContactPayload} payload
   * @returns {string}
   */
  buildMailtoUri({ name, email, message }) {
    const trimmedName = (name ?? '').trim();
    const trimmedEmail = (email ?? '').trim();
    const trimmedMessage = (message ?? '').trim();

    const subject = encodeURIComponent(`Portfolio contact: ${trimmedName}`);
    const body = encodeURIComponent(
      `Name: ${trimmedName}\nEmail: ${trimmedEmail}\n\n${trimmedMessage}`
    );

    return `mailto:${this.targetEmail}?subject=${subject}&body=${body}`;
  }

  /**
   * Mở trình duyệt mail client của người dùng.
   * @param {ContactPayload} payload
   * @param {Window} [win=window]
   */
  dispatch(payload, win = typeof window !== 'undefined' ? window : null) {
    const uri = this.buildMailtoUri(payload);
    if (win?.location) {
      win.location.href = uri;
    }
    return uri;
  }
}

/**
 * Hàm tiện ích tạo URI mailto (tương thích ngược).
 * @param {ContactPayload} data
 * @returns {string}
 */
export function buildMailto(data) {
  return new MailtoTransportAdapter().buildMailtoUri(data);
}
