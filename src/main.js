import './style.css'
import { initApp, addTypingEffect, addCounterEffect, initWorkExpTabs } from './app.js'
import { initNavigation } from './navigation.js'
import { initAnimations } from './animations.js'

// Khởi tạo ứng dụng khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
  initApp()
  initNavigation()
  initAnimations()
  
  // Thêm typing effect cho hero section
  setTimeout(() => {
    addTypingEffect()
  }, 1000)
  
  // Thêm counter effects
  addCounterEffect()

  // Khởi tạo tab Work Experience
  initWorkExpTabs()
}) 