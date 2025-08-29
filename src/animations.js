// Floating shapes and animations
export function initAnimations() {
  // Floating shapes: render dynamic shapes - OPTIMIZED for performance
  const container = document.getElementById('floating-shapes-container');
  if (!container) return;

  // Giảm từ 30 xuống 15 shapes để tăng performance
  const shapesData = [
    { w: 96, h: 96, color: 'bg-purple-100', rounded: 'rounded-[20px]', opacity: 'opacity-100' },
    { w: 80, h: 80, color: 'bg-purple-200', rounded: 'rounded-full', opacity: 'opacity-100' },
    { w: 64, h: 64, color: 'bg-blue-100', rounded: 'rounded-[20px]', opacity: 'opacity-100' },
    { w: 56, h: 56, color: 'bg-yellow-100', rounded: 'rounded-full', opacity: 'opacity-100' },
    { w: 80, h: 40, color: 'bg-pink-200', rounded: 'rounded-[16px]', opacity: 'opacity-70' },
    { w: 40, h: 40, color: 'bg-green-100', rounded: 'rounded-full', opacity: 'opacity-60' },
    { w: 48, h: 48, color: 'bg-blue-200', rounded: 'rounded-[30px]', opacity: 'opacity-50' },
    { w: 64, h: 64, color: 'bg-yellow-200', rounded: 'rounded-full', opacity: 'opacity-80' },
    { w: 48, h: 96, color: 'bg-purple-300', rounded: 'rounded-[40px]', opacity: 'opacity-60' },
    { w: 56, h: 56, color: 'bg-green-300', rounded: 'rounded-[30px]', opacity: 'opacity-50' },
    { w: 40, h: 40, color: 'bg-pink-100', rounded: 'rounded-full', opacity: 'opacity-40' },
    { w: 56, h: 56, color: 'bg-yellow-200', rounded: 'rounded-[20px]', opacity: 'opacity-50' },
    { w: 64, h: 48, color: 'bg-green-100', rounded: 'rounded-[16px]', opacity: 'opacity-60' },
    { w: 48, h: 64, color: 'bg-blue-200', rounded: 'rounded-[30px]', opacity: 'opacity-45' },
    { w: 80, h: 80, color: 'bg-purple-200', rounded: 'rounded-full', opacity: 'opacity-30' }
  ];

  // Tối ưu positions array
  const positions = [
    { top: '2.5rem', left: '2.5rem' },
    { top: '5rem', right: '2.5rem' },
    { bottom: '2.5rem', left: '5rem' },
    { bottom: '5rem', right: '5rem' },
    { top: '33%', left: '33%' },
    { top: '50%', right: '33%' },
    { bottom: '33%', left: '25%' },
    { top: '25%', right: '25%' },
    { bottom: '25%', left: '50%' },
    { top: '16.6667%', right: '16.6667%' },
    { top: '1.25rem', left: '1.25rem' },
    { bottom: '1.25rem', right: '1.25rem' },
    { top: '20%', left: '16.6667%' },
    { bottom: '16.6667%', right: '20%' },
    { top: '12.5%', left: '12.5%' }
  ];

  // Batch DOM operations for better performance
  const fragment = document.createDocumentFragment();
  
  shapesData.forEach((data, i) => {
    const div = document.createElement('div');
    div.className = `floating-shape absolute ${data.color} ${data.rounded} ${data.opacity}`;
    div.style.width = data.w + 'px';
    div.style.height = data.h + 'px';
    
    // Assign position if available
    const pos = positions[i] || {};
    for (const key in pos) {
      div.style[key] = pos[key];
    }
    
    fragment.appendChild(div);
  });
  
  container.appendChild(fragment);

  // Floating shapes animation - OPTIMIZED
  const shapes = container.querySelectorAll('.floating-shape');
  let vw = window.innerWidth;
  let vh = window.innerHeight;

  // Sử dụng requestAnimationFrame để tối ưu performance
  function moveShape(shape) {
    shape.style.transform = 'translate(0, 0)';
    const rect = shape.getBoundingClientRect();
    const maxX = Math.max(0, vw - rect.width);
    const maxY = Math.max(0, vh - rect.height);
    const x = Math.random() * maxX;
    const y = Math.random() * maxY;
    
    // Sử dụng transform3d để trigger hardware acceleration
    shape.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    
    // Tăng thời gian animation để giảm CPU usage
    setTimeout(() => moveShape(shape), 15000);
  }

  shapes.forEach(shape => {
    // Tối ưu CSS transitions
    shape.style.transition = 'transform 15s cubic-bezier(0.4, 0, 0.2, 1)';
    shape.style.willChange = 'transform'; // Hint cho browser
    moveShape(shape);
  });

  // Debounced resize handler
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      vw = window.innerWidth;
      vh = window.innerHeight;
    }, 100);
  });

  // Progress bars animation - OPTIMIZED
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetWidth = bar.getAttribute("data-target-width");
        
        // Sử dụng requestAnimationFrame để tối ưu
        requestAnimationFrame(() => {
          bar.style.width = "0%";
          bar.offsetWidth; // Force reflow
          bar.style.transition = "width 3s ease-out";
          bar.style.width = targetWidth;
        });
        
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll(".progress-bar").forEach(bar => {
    const width = bar.style.width;
    bar.setAttribute("data-target-width", width);
    bar.style.width = "0%";
    observer.observe(bar);
  });
} 