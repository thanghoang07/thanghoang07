// Floating shapes and animations
export function initAnimations() {
  // Floating shapes: render dynamic shapes
  const container = document.getElementById('floating-shapes-container');
  if (!container) return;

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
    // 10 random extra
    { w: 40, h: 40, color: 'bg-pink-100', rounded: 'rounded-full', opacity: 'opacity-40' },
    { w: 56, h: 56, color: 'bg-yellow-200', rounded: 'rounded-[20px]', opacity: 'opacity-50' },
    { w: 64, h: 48, color: 'bg-green-100', rounded: 'rounded-[16px]', opacity: 'opacity-60' },
    { w: 48, h: 64, color: 'bg-blue-200', rounded: 'rounded-[30px]', opacity: 'opacity-45' },
    { w: 80, h: 80, color: 'bg-purple-200', rounded: 'rounded-full', opacity: 'opacity-30' },
    { w: 72, h: 72, color: 'bg-pink-200', rounded: 'rounded-[24px]', opacity: 'opacity-35' },
    { w: 60, h: 60, color: 'bg-yellow-100', rounded: 'rounded-[10px]', opacity: 'opacity-50' },
    { w: 52, h: 52, color: 'bg-green-200', rounded: 'rounded-full', opacity: 'opacity-40' },
    { w: 48, h: 48, color: 'bg-blue-100', rounded: 'rounded-[14px]', opacity: 'opacity-55' },
    { w: 44, h: 44, color: 'bg-purple-100', rounded: 'rounded-full', opacity: 'opacity-60' },
  ];

  // Randomly assign positions for each shape (using percentages for top/left/right/bottom)
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
    { top: '12.5%', left: '12.5%' },
    { bottom: '12.5%', right: '12.5%' },
    { top: '14.2857%', left: '14.2857%' },
    { bottom: '14.2857%', right: '14.2857%' },
    { top: '11.1111%', left: '11.1111%' },
    { bottom: '11.1111%', right: '11.1111%' },
  ];

  shapesData.forEach((data, i) => {
    const div = document.createElement('div');
    div.className = `floating-shape absolute ${data.color} ${data.rounded} ${data.opacity}`;
    div.style.width = data.w + 'px';
    div.style.height = data.h + 'px';
    // Assign position if available, else random
    const pos = positions[i] || {};
    for (const key in pos) {
      div.style[key] = pos[key];
    }
    container.appendChild(div);
  });

  // Floating shapes animation
  const shapes = container.querySelectorAll('.floating-shape');
  let vw = window.innerWidth;
  let vh = window.innerHeight;

  function moveShape(shape) {
    shape.style.transform = 'translate(0, 0)';
    const rect = shape.getBoundingClientRect();
    const maxX = Math.max(0, vw - rect.width);
    const maxY = Math.max(0, vh - rect.height);
    const x = Math.random() * maxX;
    const y = Math.random() * maxY;
    shape.style.transform = `translate(${x}px, ${y}px)`;
    setTimeout(() => moveShape(shape), 12000);
  }

  shapes.forEach(shape => {
    shape.style.transition = 'transform 12s cubic-bezier(0.4, 0, 0.2, 1)';
    moveShape(shape);
  });

  window.addEventListener('resize', () => {
    vw = window.innerWidth;
    vh = window.innerHeight;
  });

  // Progress bars animation
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetWidth = bar.getAttribute("data-target-width");
        bar.style.width = "0%";
        bar.offsetWidth;
        bar.style.transition = "width 4s ease-out";
        requestAnimationFrame(() => {
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