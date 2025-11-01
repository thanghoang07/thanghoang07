/**
 * Progressive Image Loading with blur effect and lazy loading
 */

export class ProgressiveImageLoader {
  constructor() {
    this.imageObserver = null;
    this.loadedImages = new Set();
    this.init();
  }

  init() {
    // Create intersection observer for lazy loading
    if ('IntersectionObserver' in window) {
      this.imageObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.loadImage(entry.target);
              this.imageObserver.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '50px 0px',
          threshold: 0.01
        }
      );
    }

    this.setupImages();
  }

  setupImages() {
    const images = document.querySelectorAll('img[data-src], img[src]');
    
    images.forEach((img) => {
      this.prepareImage(img);
    });
  }

  prepareImage(img) {
    const wrapper = document.createElement('div');
    wrapper.className = 'progressive-image-wrapper';
    wrapper.style.cssText = `
      position: relative;
      overflow: hidden;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200px 100%;
      animation: shimmer 1.5s infinite;
      border-radius: inherit;
    `;

    // Insert wrapper before the image
    img.parentNode.insertBefore(wrapper, img);
    wrapper.appendChild(img);

    // Create low-quality placeholder if original has high-res src
    if (img.src && !img.dataset.src) {
      img.dataset.src = img.src;
      img.src = this.generatePlaceholder(img);
    }

    // Apply initial styles
    img.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: opacity 0.3s ease, filter 0.3s ease;
      filter: blur(5px);
      transform: scale(1.1);
    `;

    // Add loading class
    img.classList.add('progressive-image', 'loading');

    // Observe for lazy loading if supported
    if (this.imageObserver) {
      this.imageObserver.observe(img);
    } else {
      // Fallback for browsers without IntersectionObserver
      this.loadImage(img);
    }
  }

  generatePlaceholder(img) {
    // Create a tiny base64 placeholder
    const canvas = document.createElement('canvas');
    canvas.width = 10;
    canvas.height = 10;
    const ctx = canvas.getContext('2d');
    
    // Create a simple gradient
    const gradient = ctx.createLinearGradient(0, 0, 10, 10);
    gradient.addColorStop(0, '#e5e7eb');
    gradient.addColorStop(1, '#f3f4f6');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 10, 10);
    
    return canvas.toDataURL();
  }

  loadImage(img) {
    if (this.loadedImages.has(img)) return;
    
    const actualSrc = img.dataset.src || img.src;
    if (!actualSrc) return;

    // Create new image to preload
    const imageLoader = new Image();
    
    imageLoader.onload = () => {
      this.onImageLoad(img, actualSrc);
    };
    
    imageLoader.onerror = () => {
      this.onImageError(img);
    };
    
    // Add loading indicator
    this.showLoadingState(img);
    
    // Start loading
    imageLoader.src = actualSrc;
    this.loadedImages.add(img);
  }

  onImageLoad(img, src) {
    // Update src
    img.src = src;
    
    // Remove loading state
    this.hideLoadingState(img);
    
    // Animate in
    requestAnimationFrame(() => {
      img.style.filter = 'blur(0px)';
      img.style.transform = 'scale(1)';
      img.classList.remove('loading');
      img.classList.add('loaded');
    });

    // Dispatch custom event
    img.dispatchEvent(new CustomEvent('imageLoaded', {
      detail: { src, element: img }
    }));
  }

  onImageError(img) {
    console.warn('Failed to load image:', img.dataset.src || img.src);
    
    // Hide loading state
    this.hideLoadingState(img);
    
    // Add error state
    img.classList.remove('loading');
    img.classList.add('error');
    
    // Set fallback image
    img.src = this.generateErrorPlaceholder();
    
    // Dispatch error event
    img.dispatchEvent(new CustomEvent('imageError', {
      detail: { element: img }
    }));
  }

  showLoadingState(img) {
    const wrapper = img.parentNode;
    if (wrapper.classList.contains('progressive-image-wrapper')) {
      wrapper.setAttribute('data-loading', 'true');
    }
  }

  hideLoadingState(img) {
    const wrapper = img.parentNode;
    if (wrapper.classList.contains('progressive-image-wrapper')) {
      wrapper.removeAttribute('data-loading');
      wrapper.style.animation = 'none';
    }
  }

  generateErrorPlaceholder() {
    // SVG fallback for broken images
    const svg = `
      <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" font-family="Arial" font-size="12" fill="#9ca3af" text-anchor="middle" dy=".3em">
          Image not found
        </text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  // Public method to manually load images
  loadAllImages() {
    const lazyImages = document.querySelectorAll('img.progressive-image.loading');
    lazyImages.forEach(img => this.loadImage(img));
  }

  // Public method to refresh observer
  refresh() {
    if (this.imageObserver) {
      this.imageObserver.disconnect();
    }
    this.init();
  }
}

// Auto-initialize when DOM is ready
let imageLoader;

export function initImageLoader() {
  if (!imageLoader) {
    imageLoader = new ProgressiveImageLoader();
  }
  return imageLoader;
}

export function getImageLoader() {
  return imageLoader;
}