export function initNavigation() {
  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn')
  const mobileMenu = document.getElementById('mobile-menu')
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden')
    })
  }
  
  // Smooth scrolling cho các link navigation
  const navLinks = document.querySelectorAll('a[href^="#"]')
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      
      // Close mobile menu if open
      if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden')
      }
      
      const targetId = link.getAttribute('href').substring(1)
      const targetElement = document.getElementById(targetId)
      
      if (targetElement) {
        const headerHeight = document.querySelector('header').offsetHeight
        const targetPosition = targetElement.offsetTop - headerHeight - 20
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        })
      }
    })
  })
  
  // Active navigation link khi scroll
  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]')
    const navLinks = document.querySelectorAll('nav a[href^="#"]')
    
    let current = ''
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100
      const sectionHeight = section.clientHeight
      
      if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
        current = section.getAttribute('id')
      }
    })
    
    navLinks.forEach(link => {
      link.classList.remove('text-purple-600', 'font-semibold')
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('text-purple-600', 'font-semibold')
      }
    })
  })
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (mobileMenu && !mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.add('hidden')
    }
  })
} 