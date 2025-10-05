export function initTheme() {
  const html = document.documentElement
  const themeToggle = document.getElementById('toggle-theme')
  
  // Detect system preference
  const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  
  // Get theme from localStorage or use system preference
  const savedTheme = localStorage.getItem('theme') || systemPreference
  
  // Apply theme
  applyTheme(savedTheme)
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light')
    }
  })
  
  // Add event listener for theme toggle
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = html.classList.contains('dark') ? 'light' : 'dark'
      applyTheme(currentTheme)
      localStorage.setItem('theme', currentTheme)
      
      // Add smooth transition effect
      document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease'
      setTimeout(() => {
        document.body.style.transition = ''
      }, 300)
    })
  }
}

function applyTheme(theme) {
  const html = document.documentElement
  
  try {
    if (theme === 'dark') {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#1f2937' : '#9333ea')
    }
    
    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }))
    
  } catch (error) {
    console.error('Error applying theme:', error)
    // Fallback to light theme
    html.classList.remove('dark')
  }
}

export function getCurrentTheme() {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
} 