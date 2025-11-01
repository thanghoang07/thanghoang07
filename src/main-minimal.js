/**
 * 🚀 Minimal Main Entry Point
 * Simplified version that ensures loading screen works
 */

import './style.css';

console.log('🎯 Minimal main.js loaded!');

// Simple loading function
function initializeApp() {
  console.log('🚀 Starting app initialization...');
  
  const startTime = Date.now();
  
  // Minimum loading time for smooth UX
  const minLoadingTime = 800;
  
  // Simple initialization
  setTimeout(() => {
    console.log('✅ Initialization complete, hiding loader...');
    
    const loadingTime = Date.now() - startTime;
    const remainingTime = Math.max(0, minLoadingTime - loadingTime);
    
    setTimeout(() => {
      hideLoader();
    }, remainingTime);
    
  }, 100); // Very short init time
}

function hideLoader() {
  console.log('🎭 Hiding loading screen...');
  
  const loader = document.getElementById('page-loader');
  const mainContent = document.getElementById('main-content');
  
  if (loader) {
    console.log('✅ Found loader, applying fade-out...');
    loader.classList.add('fade-out');
    
    setTimeout(() => {
      loader.style.display = 'none';
      console.log('✅ Loader hidden');
    }, 500);
  } else {
    console.error('❌ Loader element not found!');
  }
  
  if (mainContent) {
    console.log('✅ Found main content, showing...');
    mainContent.classList.add('fade-in');
  } else {
    console.error('❌ Main content element not found!');
  }
  
  // Mark body as loaded
  document.body.classList.add('loaded');
  console.log('🎉 App fully loaded!');
}

// Wait for DOM then initialize
if (document.readyState === 'loading') {
  console.log('⏳ Waiting for DOM...');
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  console.log('✅ DOM ready, initializing...');
  initializeApp();
}

// Backup: Force hide after 3 seconds if something goes wrong 
setTimeout(() => {
  const loader = document.getElementById('page-loader');
  if (loader && loader.style.display !== 'none') {
    console.warn('⚠️ Backup timeout: forcing loader hide');
    hideLoader();
  }
}, 3000);

console.log('🎉 Minimal main script loaded!');