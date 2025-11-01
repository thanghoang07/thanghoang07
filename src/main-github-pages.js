/**
 * 🚀 GitHub Pages Optimized Entry Point
 * Khắc phục issues với GitHub Pages deployment
 */

console.log('🎯 GitHub Pages optimized main.js loaded!');

/**
 * GitHub Pages Compatible Application Class
 */
class GitHubPagesApplication {
  constructor() {
    this.isInitialized = false;
    this.loadingStartTime = Date.now();
    this.features = new Map();
    this.basePath = '/thanghoang07/'; // GitHub Pages base path
  }

  /**
   * Initialize the application
   */
  async init() {
    console.log('🚀 Starting GitHub Pages optimized initialization...');

    try {
      // Step 1: Wait for DOM
      await this.waitForDOM();
      
      // Step 2: Initialize core animations first (critical for UX)
      this.initializeCoreAnimations();
      
      // Step 3: Initialize theme and language features
      this.initializeTheme();
      this.initializeLanguage();
      
      // Step 4: Initialize remaining features
      this.initializeFeatures();
      
      // Step 5: Finish loading
      this.finishLoading();
      
    } catch (error) {
      console.error('❌ Initialization error:', error);
      this.finishLoading();
    }
  }

  /**
   * Wait for DOM to be ready
   */
  waitForDOM() {
    return new Promise((resolve) => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', resolve);
      } else {
        resolve();
      }
    });
  }

  /**
   * Core animations that work without module dependencies
   */
  initializeCoreAnimations() {
    console.log('🎭 Initializing core animations...');

    try {
      // Initialize scroll reveal
      this.initializeScrollReveal();
      
      // Initialize hover effects
      this.initializeHoverEffects();
      
      // Initialize progress bars
      this.initializeProgressBars();
      
      console.log('✅ Core animations initialized');
    } catch (error) {
      console.error('❌ Core animations error:', error);
    }
  }

  /**
   * Scroll reveal implementation
   */
  initializeScrollReveal() {
    const observerOptions = {
      threshold: [0, 0.1, 0.2],
      rootMargin: '-50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const animation = element.dataset.animation || 'fade-in-up';
          const stagger = element.dataset.stagger || '';
          
          // Apply stagger delay
          let delay = 0;
          if (stagger === 'stagger-1') delay = 100;
          else if (stagger === 'stagger-2') delay = 200;
          else if (stagger === 'stagger-3') delay = 300;
          else if (stagger === 'stagger-4') delay = 400;

          setTimeout(() => {
            element.classList.add('revealed');
            element.style.animationName = animation;
            element.style.animationDuration = '0.6s';
            element.style.animationFillMode = 'forwards';
            element.style.animationTimingFunction = 'ease-out';
          }, delay);

          observer.unobserve(element);
        }
      });
    }, observerOptions);

    // Observe all scroll reveal elements
    document.querySelectorAll('.scroll-reveal, [data-animation]').forEach(el => {
      observer.observe(el);
    });
  }

  /**
   * Hover effects implementation
   */
  initializeHoverEffects() {
    // Magnetic hover effect
    document.querySelectorAll('.magnetic, [data-magnetic]').forEach(element => {
      element.addEventListener('mouseenter', (e) => {
        e.target.style.transform = 'scale(1.05)';
        e.target.style.transition = 'transform 0.3s ease';
      });

      element.addEventListener('mouseleave', (e) => {
        e.target.style.transform = 'scale(1)';
      });

      element.addEventListener('mousemove', (e) => {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        e.target.style.transform = `scale(1.05) translate(${x * 0.1}px, ${y * 0.1}px)`;
      });
    });

    // Ripple effect
    document.querySelectorAll('[data-ripple]').forEach(element => {
      element.addEventListener('click', (e) => {
        const ripple = document.createElement('div');
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(147, 51, 234, 0.3)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.left = x - 25 + 'px';
        ripple.style.top = y - 25 + 'px';
        ripple.style.width = '50px';
        ripple.style.height = '50px';
        ripple.style.pointerEvents = 'none';

        if (!element.style.position || element.style.position === 'static') {
          element.style.position = 'relative';
        }
        element.style.overflow = 'hidden';

        element.appendChild(ripple);

        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });

    // Enhanced hover effects for cards
    document.querySelectorAll('.enhanced-hover, .skill-card, .project-card').forEach(card => {
      card.addEventListener('mouseenter', (e) => {
        e.target.style.transform = 'translateY(-5px) scale(1.02)';
        e.target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
        e.target.style.transition = 'all 0.3s ease';
      });

      card.addEventListener('mouseleave', (e) => {
        e.target.style.transform = 'translateY(0) scale(1)';
        e.target.style.boxShadow = '';
      });
    });
  }

  /**
   * Progress bars animation
   */
  initializeProgressBars() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const progressBar = entry.target.querySelector('.progress-bar');
          if (progressBar) {
            const width = progressBar.style.width || '0%';
            progressBar.style.width = '0%';
            progressBar.style.transition = 'width 1.5s ease-out';
            
            setTimeout(() => {
              progressBar.style.width = width;
            }, 100);
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.progress-bar').forEach(bar => {
      observer.observe(bar.parentElement);
    });
  }

  /**
   * Theme toggle functionality
   */
  initializeTheme() {
    console.log('🎨 Initializing theme...');

    try {
      // Check saved theme
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

      if (shouldUseDark) {
        document.documentElement.classList.add('dark');
      }

      // Theme toggle button
      const themeToggle = document.getElementById('toggle-theme');
      if (themeToggle) {
        themeToggle.addEventListener('click', () => {
          const isDark = document.documentElement.classList.contains('dark');
          
          if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
          } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
          }

          // Add click animation
          themeToggle.style.transform = 'scale(0.95)';
          setTimeout(() => {
            themeToggle.style.transform = 'scale(1)';
          }, 150);
        });
      }

      console.log('✅ Theme initialized');
    } catch (error) {
      console.error('❌ Theme initialization error:', error);
    }
  }

  /**
   * Language toggle functionality
   */
  initializeLanguage() {
    console.log('🌍 Initializing language...');

    try {
      // Language data
      const translations = {
        'en': {
          'hero-mynameis': 'My name is',
          'hero-name': 'Thang Hoang Duc.',
          'hero-intro': 'Front-end developer with 5+ years of experience in UI development, passionate about creating modern web products and optimizing user experience.',
          'specialized-subtitle': 'Specialized',
          'specialized-title': 'Specialized in',
          'skill-ibm-title': 'IBM BPM Development',
          'ux-desc': 'Developing IBM BPM applications with JavaScript and Java, designing interfaces according to gui-spec.',
          'skill-mobile-title': 'Mobile Development',
          'webdev-desc': 'Developing cross-platform mobile applications using Xamarin.Forms for iOS/Android.',
          'skill-iot-title': 'IoT Development',
          'webdesign-desc': 'Developing IoT applications and connecting to Azure IoT hub for custom devices.',
          'portfolio-subtitle': 'My Works',
          'portfolio-title': 'Featured Portfolios',
          'project-agency-title': 'Agency Website',
          'project-agency-category': 'Web Design',
          'project-dashboard-title': 'Dashboard Platform',
          'project-dashboard-category': 'Web Development',
          'project-ecommerce-title': 'E-commerce Website',
          'project-ecommerce-category': 'UX Design',
          'workexp-subtitle': 'Career Path',
          'workexp-title': 'Work Experience',
          'contact-subtitle': 'Contact',
          'contact-title': 'Contact'
        },
        'vi': {
          'hero-mynameis': 'Tôi là',
          'hero-name': 'Thắng Hoàng Đức.',
          'hero-intro': 'Lập trình viên front-end với hơn 5 năm kinh nghiệm phát triển giao diện người dùng, đam mê tạo ra sản phẩm web hiện đại và tối ưu trải nghiệm người dùng.',
          'specialized-subtitle': 'Chuyên môn',
          'specialized-title': 'Chuyên môn của tôi',
          'skill-ibm-title': 'Phát triển IBM BPM',
          'ux-desc': 'Phát triển ứng dụng IBM BPM với JavaScript và Java, thiết kế giao diện theo gui-spec.',
          'skill-mobile-title': 'Phát triển Mobile',
          'webdev-desc': 'Phát triển ứng dụng mobile cross-platform bằng Xamarin.Forms cho iOS/Android.',
          'skill-iot-title': 'Phát triển IoT',
          'webdesign-desc': 'Phát triển ứng dụng IoT và kết nối Azure IoT hub cho thiết bị tùy biến.',
          'portfolio-subtitle': 'Dự án',
          'portfolio-title': 'Dự án nổi bật',
          'project-agency-title': 'Website Agency',
          'project-agency-category': 'Thiết kế Web',
          'project-dashboard-title': 'Nền tảng Dashboard',
          'project-dashboard-category': 'Phát triển Web',
          'project-ecommerce-title': 'Website Thương mại',
          'project-ecommerce-category': 'Thiết kế UX',
          'workexp-subtitle': 'Lộ trình sự nghiệp',
          'workexp-title': 'Kinh nghiệm làm việc',
          'contact-subtitle': 'Liên hệ',
          'contact-title': 'Liên hệ'
        }
      };

      let currentLang = localStorage.getItem('language') || 'en';

      // Update language
      const updateLanguage = (lang) => {
        currentLang = lang;
        localStorage.setItem('language', lang);

        // Update text content
        Object.keys(translations[lang]).forEach(key => {
          const element = document.getElementById(key);
          if (element) {
            element.textContent = translations[lang][key];
          }
        });

        // Update language toggle icons
        const viIcon = document.getElementById('lang-vi-icon');
        const enIcon = document.getElementById('lang-en-icon');
        
        if (lang === 'vi') {
          if (viIcon) viIcon.classList.add('hidden');
          if (enIcon) enIcon.classList.remove('hidden');
        } else {
          if (viIcon) viIcon.classList.remove('hidden');
          if (enIcon) enIcon.classList.add('hidden');
        }
      };

      // Initialize language
      updateLanguage(currentLang);

      // Language toggle button
      const languageToggle = document.getElementById('toggle-language');
      if (languageToggle) {
        languageToggle.addEventListener('click', () => {
          const newLang = currentLang === 'en' ? 'vi' : 'en';
          updateLanguage(newLang);

          // Add click animation
          languageToggle.style.transform = 'scale(0.95)';
          setTimeout(() => {
            languageToggle.style.transform = 'scale(1)';
          }, 150);
        });
      }

      console.log('✅ Language initialized');
    } catch (error) {
      console.error('❌ Language initialization error:', error);
    }
  }

  /**
   * Initialize additional features
   */
  initializeFeatures() {
    console.log('🎪 Initializing additional features...');

    try {
      // Work experience tabs
      this.initializeWorkExperienceTabs();
      
      // Contact form
      this.initializeContactForm();
      
      // Floating shapes
      this.initializeFloatingShapes();

      console.log('✅ Additional features initialized');
    } catch (error) {
      console.error('❌ Additional features error:', error);
    }
  }

  /**
   * Work experience tabs
   */
  initializeWorkExperienceTabs() {
    const tabs = document.querySelectorAll('.company-tab');
    const details = document.querySelectorAll('.company-detail');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Remove active from all tabs
        tabs.forEach(t => {
          t.classList.remove('active', 'bg-purple-50', 'text-purple-600');
          t.classList.add('bg-white', 'dark:bg-gray-800', 'text-gray-700', 'dark:text-gray-200');
        });

        // Add active to clicked tab
        tab.classList.add('active', 'bg-purple-50', 'text-purple-600');
        tab.classList.remove('bg-white', 'dark:bg-gray-800', 'text-gray-700', 'dark:text-gray-200');

        // Hide all details
        details.forEach(detail => detail.classList.add('hidden'));

        // Show corresponding detail
        const company = tab.dataset.company;
        const detail = document.getElementById(`exp-${company}`);
        if (detail) {
          detail.classList.remove('hidden');
        }
      });
    });
  }

  /**
   * Contact form
   */
  initializeContactForm() {
    const form = document.querySelector('#contact form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nameInput = document.getElementById('contact-name-input');
        const emailInput = document.getElementById('contact-email-input');
        const messageInput = document.getElementById('contact-message-input');
        const submitBtn = document.getElementById('contact-send-btn');

        if (nameInput && emailInput && messageInput && submitBtn) {
          // Simulate form submission
          submitBtn.textContent = 'Sending...';
          submitBtn.disabled = true;

          setTimeout(() => {
            alert('Thank you for your message! I will get back to you soon.');
            form.reset();
            submitBtn.textContent = 'Send Message';
            submitBtn.disabled = false;
          }, 1000);
        }
      });
    }
  }

  /**
   * Floating shapes animation
   */
  initializeFloatingShapes() {
    // Avatar floating shapes
    const avatarShapes = document.querySelectorAll('[class*="avatar-shape-"]');
    avatarShapes.forEach((shape, index) => {
      const duration = 3 + index * 0.5;
      const delay = index * 0.2;
      
      shape.style.animation = `float ${duration}s ease-in-out ${delay}s infinite alternate`;
    });

    // Background floating shapes
    const container = document.getElementById('floating-shapes-container');
    if (container) {
      for (let i = 0; i < 6; i++) {
        const shape = document.createElement('div');
        shape.className = 'floating-shape';
        shape.style.cssText = `
          position: absolute;
          width: ${20 + Math.random() * 80}px;
          height: ${20 + Math.random() * 80}px;
          background: linear-gradient(45deg, rgba(147, 51, 234, 0.1), rgba(168, 85, 247, 0.1));
          border-radius: ${Math.random() > 0.5 ? '50%' : '20%'};
          top: ${Math.random() * 100}%;
          left: ${Math.random() * 100}%;
          animation: float ${5 + Math.random() * 5}s ease-in-out ${Math.random() * 2}s infinite alternate;
          pointer-events: none;
        `;
        container.appendChild(shape);
      }
    }
  }

  /**
   * Finish loading and show content
   */
  finishLoading() {
    const minLoadingTime = 500;
    const elapsed = Date.now() - this.loadingStartTime;
    const remainingTime = Math.max(0, minLoadingTime - elapsed);

    setTimeout(() => {
      const loader = document.getElementById('page-loader');
      const mainContent = document.getElementById('main-content');

      if (loader) {
        loader.classList.add('fade-out');
        setTimeout(() => {
          loader.style.display = 'none';
        }, 500);
      }

      if (mainContent) {
        mainContent.style.opacity = '1';
        document.body.classList.add('loaded');
      }

      this.isInitialized = true;
      console.log('🎉 Application fully loaded and ready!');

    }, remainingTime);
  }

  /**
   * Get application status
   */
  getStatus() {
    return {
      initialized: this.isInitialized,
      loadingTime: Date.now() - this.loadingStartTime,
      features: Array.from(this.features.entries())
    };
  }
}

// Add required CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes float {
    0% { transform: translateY(0px) rotate(0deg); }
    100% { transform: translateY(-20px) rotate(5deg); }
  }

  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }

  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fade-in-left {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes fade-in-right {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes fade-in-scale {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .scroll-reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease-out;
  }

  .scroll-reveal.revealed {
    opacity: 1;
    transform: translateY(0);
  }

  .enhanced-hover {
    transition: all 0.3s ease;
  }

  .cert-card {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .cert-icon {
    flex-shrink: 0;
  }
`;
document.head.appendChild(style);

// Initialize application
const app = new GitHubPagesApplication();

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();
}

// Make app globally accessible for debugging
window.githubPagesApp = app;

// Add error handling for uncaught errors
window.addEventListener('error', (event) => {
  console.error('❌ Uncaught error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Unhandled promise rejection:', event.reason);
});

console.log('🎯 GitHub Pages application setup complete!');