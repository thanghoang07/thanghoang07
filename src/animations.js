/**
 * 🎭 Enhanced Animation System
 * Advanced animations and interactive effects
 */

/**
 * Typing Animation Effect
 */
class TypingAnimation {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      speed: 100,
      delay: 1000,
      cursor: true,
      loop: false,
      ...options
    };
    this.isTyping = false;
  }

  async typeText(text) {
    if (this.isTyping) return;
    this.isTyping = true;

    const textElement = this.element.querySelector('.typing-text');
    const cursor = this.element.querySelector('.typing-cursor');
    
    if (!textElement) return;

    // Clear existing text
    textElement.textContent = '';
    textElement.style.opacity = '1';

    // Type each character
    for (let i = 0; i < text.length; i++) {
      textElement.textContent += text[i];
      await this.delay(this.options.speed);
    }

    // Hide cursor after typing
    if (cursor && !this.options.loop) {
      setTimeout(() => {
        cursor.style.opacity = '0';
      }, 1000);
    }

    this.isTyping = false;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  start() {
    const textElement = this.element.querySelector('.typing-text');
    if (!textElement) return;

    const originalText = textElement.textContent;
    setTimeout(() => {
      this.typeText(originalText);
    }, this.options.delay);
  }
}

/**
 * Staggered Animation System
 */
class StaggeredAnimations {
  constructor() {
    this.observers = new Map();
  }

  init() {
    this.initScrollAnimations();
    this.initProjectCardAnimations();
    this.initSkillsAnimations();
  }

  initScrollAnimations() {
    const staggerElements = document.querySelectorAll('[data-stagger]');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const stagger = element.dataset.stagger;
          const delay = this.getStaggerDelay(stagger);
          
          setTimeout(() => {
            element.classList.add('animate-in');
          }, delay);
          
          observer.unobserve(element);
        }
      });
    }, { threshold: 0.1 });

    staggerElements.forEach(el => observer.observe(el));
    this.observers.set('stagger', observer);
  }

  initProjectCardAnimations() {
    const projectCards = document.querySelectorAll('.project-card');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0) scale(1)';
            entry.target.style.transition = 'all 0.6s ease-out';
          }, index * 200);
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    // Initially hide cards
    projectCards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px) scale(0.9)';
      observer.observe(card);
    });

    this.observers.set('projects', observer);
  }

  initSkillsAnimations() {
    const skillBadges = document.querySelectorAll('.skill-badge');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const badges = entry.target.querySelectorAll('.skill-badge');
          badges.forEach((badge, index) => {
            setTimeout(() => {
              badge.style.opacity = '1';
              badge.style.transform = 'translateY(0) scale(1)';
              badge.style.transition = 'all 0.4s ease-out';
            }, index * 100);
          });
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    // Initially hide skill badges
    skillBadges.forEach(badge => {
      badge.style.opacity = '0';
      badge.style.transform = 'translateY(20px) scale(0.8)';
    });

    const skillsSection = document.querySelector('#skills');
    if (skillsSection) {
      observer.observe(skillsSection);
    }

    this.observers.set('skills', observer);
  }

  getStaggerDelay(staggerClass) {
    const match = staggerClass.match(/stagger-(\d+)/);
    return match ? parseInt(match[1]) * 100 : 0;
  }

  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

/**
 * Enhanced Hover Effects
 */
class EnhancedHoverEffects {
  constructor() {
    this.init();
  }

  init() {
    this.initMagneticEffect();
    this.initTiltEffect();
    this.initRippleEffect();
  }

  initMagneticEffect() {
    const magneticElements = document.querySelectorAll('[data-magnetic], .magnetic');
    
    magneticElements.forEach(element => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const distance = Math.sqrt(x * x + y * y);
        const maxDistance = 50;
        
        if (distance < maxDistance) {
          const strength = (maxDistance - distance) / maxDistance;
          const moveX = (x / distance) * strength * 10;
          const moveY = (y / distance) * strength * 10;
          
          element.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
      });

      element.addEventListener('mouseleave', () => {
        element.style.transform = 'translate(0, 0)';
      });
    });
  }

  initTiltEffect() {
    const tiltElements = document.querySelectorAll('[data-tilt], .project-card');
    
    tiltElements.forEach(element => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / centerY * -10;
        const rotateY = (x - centerX) / centerX * 10;
        
        element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
      });

      element.addEventListener('mouseleave', () => {
        element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
      });
    });
  }

  initRippleEffect() {
    const rippleElements = document.querySelectorAll('[data-ripple], .btn, button');
    
    rippleElements.forEach(element => {
      element.addEventListener('click', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          pointer-events: none;
          left: ${x}px;
          top: ${y}px;
          width: 0;
          height: 0;
          transform: translate(-50%, -50%);
          animation: ripple 0.6s ease-out;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });
  }
}

/**
 * Background Animations
 */
class BackgroundAnimations {
  constructor() {
    this.particles = [];
    this.canvas = null;
    this.ctx = null;
    this.animationId = null;
  }

  init() {
    this.createFloatingShapes();
    if (window.innerWidth > 768) {
      this.initParticleSystem();
    }
  }

  createFloatingShapes() {
    const container = document.getElementById('floating-shapes-container');
    if (!container) return;

    const shapes = [
      { type: 'circle', size: 60, color: 'rgba(147, 51, 234, 0.1)' },
      { type: 'square', size: 40, color: 'rgba(79, 70, 229, 0.1)' },
      { type: 'triangle', size: 50, color: 'rgba(236, 72, 153, 0.1)' },
    ];

    shapes.forEach((shape, index) => {
      const element = document.createElement('div');
      element.style.cssText = `
        position: absolute;
        width: ${shape.size}px;
        height: ${shape.size}px;
        background: ${shape.color};
        border-radius: ${shape.type === 'circle' ? '50%' : '0'};
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        animation: float 6s ease-in-out infinite;
        animation-delay: ${index * 2}s;
        opacity: 0.7;
      `;
      
      container.appendChild(element);
    });
  }

  initParticleSystem() {
    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
      opacity: 0.6;
    `;
    
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    
    this.resizeCanvas();
    this.createParticles();
    this.animate();
    
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    const particleCount = Math.min(50, Math.floor(window.innerWidth / 20));
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach(particle => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;
      
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(147, 51, 234, ${particle.opacity})`;
      this.ctx.fill();
    });
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.canvas) {
      this.canvas.remove();
    }
  }
}

/**
 * Initialize Enhanced Animations
 */
export function initEnhancedAnimations() {
  console.log('🎭 Initializing enhanced animations...');
  
  // Initialize typing animation for hero
  const heroName = document.querySelector('#hero-name .typing-container');
  if (heroName) {
    const typing = new TypingAnimation(heroName, {
      speed: 100,
      delay: 500,
      cursor: true
    });
    typing.start();
  }
  
  // Initialize staggered animations
  const staggered = new StaggeredAnimations();
  staggered.init();
  
  // Initialize enhanced hover effects
  new EnhancedHoverEffects();
  
  // Initialize background animations
  const background = new BackgroundAnimations();
  background.init();
  
  console.log('✅ Enhanced animations ready');
}

// Add floating animation keyframes to CSS
const floatingCSS = `
  @keyframes float {
    0%, 100% {
      transform: translateY(0) rotate(0deg);
    }
    33% {
      transform: translateY(-20px) rotate(5deg);
    }
    66% {
      transform: translateY(10px) rotate(-5deg);
    }
  }
  
  @keyframes ripple {
    to {
      width: 200px;
      height: 200px;
      opacity: 0;
    }
  }
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = floatingCSS;
document.head.appendChild(style);