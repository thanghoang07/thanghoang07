export function initTheme() {
  const html = document.documentElement
  const themeToggle = document.getElementById('toggle-theme')
  
  // Lấy theme từ localStorage hoặc mặc định là 'light'
  const savedTheme = localStorage.getItem('theme') || 'light'
  
  // Áp dụng theme
  if (savedTheme === 'dark') {
    html.classList.add('dark')
  } else {
    html.classList.remove('dark')
  }
  
  // Thêm event listener cho nút toggle theme
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      html.classList.toggle('dark')
      const currentTheme = html.classList.contains('dark') ? 'dark' : 'light'
      localStorage.setItem('theme', currentTheme)
      
      // Cập nhật icon
      updateThemeIcon(currentTheme)
    })
    
    // Cập nhật icon ban đầu
    updateThemeIcon(savedTheme)
  }
}

function updateThemeIcon(theme) {
  const themeToggle = document.getElementById('toggle-theme')
  if (themeToggle) {
    themeToggle.innerHTML = theme === 'dark' ? '☀️' : '🌙'
  }
} 