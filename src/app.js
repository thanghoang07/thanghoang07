import { initTranslations } from './translations.js'
import { initTheme } from './theme.js'
import { initNavigation } from './navigation.js'

export function initApp() {
  // Khởi tạo các module
  initTranslations()
  initTheme()
  initNavigation()
  
  // Thêm hiệu ứng scroll cho các section
  addScrollEffects()
  
  // Thêm parallax effect
  addParallaxEffect()
  
  // Đảm bảo elements hiển thị ngay khi trang load
  setTimeout(() => {
    ensureElementsVisible()
  }, 100)
}

function ensureElementsVisible() {
  // Đảm bảo tất cả elements có class scroll-reveal được hiển thị
  document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale, section, .card').forEach(el => {
    if (el.classList.contains('revealed')) {
      el.style.opacity = '1'
      el.style.transform = 'translateY(0) translateX(0) scale(1)'
    }
  })
}

function addScrollEffects() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Remove previous animation classes to reset
        const element = entry.target
        element.classList.remove('fade-in-up', 'fade-in-left', 'fade-in-right', 'fade-in-scale', 'slide-in-up', 'slide-in-down')
        element.classList.remove('stagger-1', 'stagger-2', 'stagger-3', 'stagger-4', 'stagger-5')
        
        // Add revealed class for CSS transitions
        element.classList.add('revealed')
        
        // Add animation classes based on data attributes
        const animationType = element.dataset.animation || 'fade-in-up'
        const staggerDelay = element.dataset.stagger || ''
        
        // Force reflow to ensure animation plays again
        element.offsetHeight
        
        if (staggerDelay) {
          element.classList.add(staggerDelay)
        }
        
        element.classList.add(animationType)
      } else {
        // When element leaves viewport, remove animation classes
        const element = entry.target
        element.classList.remove('revealed')
        element.classList.remove('fade-in-up', 'fade-in-left', 'fade-in-right', 'fade-in-scale', 'slide-in-up', 'slide-in-down')
        element.classList.remove('stagger-1', 'stagger-2', 'stagger-3', 'stagger-4', 'stagger-5')
      }
    })
  }, observerOptions)

  // Quan sát các element có class scroll-reveal
  document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale').forEach(el => {
    observer.observe(el)
  })
  
  // Quan sát các section và card
  document.querySelectorAll('section, .card').forEach(el => {
    observer.observe(el)
  })
}

function addParallaxEffect() {
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset
    const parallaxElements = document.querySelectorAll('.parallax')
    
    parallaxElements.forEach(element => {
      const speed = element.dataset.speed || 0.5
      const yPos = -(scrolled * speed)
      element.style.transform = `translateY(${yPos}px)`
    })
  })
}

// Thêm hiệu ứng typing cho hero text
export function addTypingEffect() {
  const heroName = document.getElementById('hero-name')
  if (heroName) {
    const text = heroName.textContent
    heroName.textContent = ''
    heroName.style.borderRight = '2px solid #9333ea'
    
    let i = 0
    const typeWriter = () => {
      if (i < text.length) {
        heroName.textContent += text.charAt(i)
        i++
        setTimeout(typeWriter, 100)
      } else {
        // Remove cursor after typing is complete
        setTimeout(() => {
          heroName.style.borderRight = 'none'
        }, 1000)
      }
    }
    
    // Start typing effect after a short delay
    setTimeout(typeWriter, 500)
  }
}

// Thêm hiệu ứng counter cho numbers
export function addCounterEffect() {
  const counters = document.querySelectorAll('[data-counter]')
  
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.counter)
    const duration = 2000 // 2 seconds
    const step = target / (duration / 16) // 60fps
    
    let current = 0
    const updateCounter = () => {
      current += step
      if (current < target) {
        counter.textContent = Math.floor(current)
        requestAnimationFrame(updateCounter)
      } else {
        counter.textContent = target
      }
    }
    
    // Start counter when element is visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          updateCounter()
          observer.unobserve(entry.target)
        }
      })
    })
    
    observer.observe(counter)
  })
}

// Work Experience Tab logic
export function initWorkExpTabs() {
  const tabs = document.querySelectorAll('.company-tab')
  const details = document.querySelectorAll('.company-detail')

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active from all
      tabs.forEach(t => t.classList.remove('active'))
      details.forEach(d => d.classList.add('hidden'))
      // Add active to clicked
      tab.classList.add('active')
      const company = tab.dataset.company
      const detail = document.getElementById('exp-' + company)
      if (detail) detail.classList.remove('hidden')
    })
  })
} 