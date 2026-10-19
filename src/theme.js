export class ThemeManager {
  init(doc = document) {
    this.doc = doc;
    this.preference = null;
    try { this.preference = localStorage.getItem('theme'); } catch { /* Storage is optional. */ }
    const system = window.matchMedia('(prefers-color-scheme: dark)');
    this.apply(this.preference === 'dark' || (this.preference !== 'light' && system.matches) ? 'dark' : 'light');
    const toggleBtn = this.doc.getElementById('toggle-theme');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this.preference = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.apply(this.preference);
        try { localStorage.setItem('theme', this.preference); } catch { /* Keep the session usable. */ }
      });
    }
    system.addEventListener('change', event => {
      if (!this.preference) this.apply(event.matches ? 'dark' : 'light');
    });
  }
  apply(theme) {
    const doc = this.doc || document;
    this.currentTheme = theme;
    doc.documentElement.classList.toggle('dark', theme === 'dark');
    doc.getElementById('toggle-theme')?.setAttribute('aria-pressed', String(theme === 'dark'));
    doc.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#080b14' : '#f0f2ff');
  }
}
export const themeManager = new ThemeManager();
