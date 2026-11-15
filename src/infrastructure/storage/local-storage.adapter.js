/**
 * Adapter lưu trữ an toàn bọc ngoài Web Storage API.
 */
export class LocalStorageAdapter {
  /**
   * @param {Storage | null} [storage]
   */
  constructor(storage = typeof localStorage !== 'undefined' ? localStorage : null) {
    this.storage = storage;
  }

  /**
   * @param {string} key
   * @returns {string|null}
   */
  getItem(key) {
    try {
      const target = this.storage ?? (typeof localStorage !== 'undefined' ? localStorage : null);
      return target?.getItem(key) ?? null;
    } catch {
      return null;
    }
  }

  /**
   * @param {string} key
   * @param {string} value
   * @returns {boolean}
   */
  setItem(key, value) {
    try {
      const target = this.storage ?? (typeof localStorage !== 'undefined' ? localStorage : null);
      target?.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * @param {string} key
   */
  removeItem(key) {
    try {
      const target = this.storage ?? (typeof localStorage !== 'undefined' ? localStorage : null);
      target?.removeItem(key);
    } catch {
      // Storage is optional
    }
  }
}
