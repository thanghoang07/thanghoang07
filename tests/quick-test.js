// Quick test to check if loading screen will disappear
console.log('🔥 Quick loading test started');

setTimeout(() => {
  console.log('🎯 Force removing loading screen...');
  
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
    console.log('❌ Loader not found!');
  }

  if (mainContent) {
    console.log('✅ Found main content, applying fade-in...');
    mainContent.classList.add('fade-in');
  } else {
    console.log('❌ Main content not found!');
  }

  document.body.classList.add('loaded');
  console.log('✅ Body marked as loaded');
  
}, 2000); // Wait 2 seconds then force remove loading

console.log('🎯 Quick test loaded, will run in 2 seconds...');