export function initNavigation() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('a[href^="#"]');
  const navLinksInNav = document.querySelectorAll('nav a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');
  const header = document.querySelector('header');

  // Accessibility: Add ARIA labels and keyboard support
  if (mobileMenuBtn && mobileMenu) {
    // Add ARIA attributes
    mobileMenuBtn.setAttribute('aria-label', 'Toggle mobile menu');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileMenuBtn.setAttribute('aria-controls', 'mobile-menu');
    
    // Add role for screen readers
    mobileMenu.setAttribute('role', 'navigation');
    mobileMenu.setAttribute('aria-label', 'Mobile navigation menu');

    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden');
      
      // Update ARIA state
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      
      // Focus management
      if (!isExpanded) {
        // Menu is now open, focus first menu item
        const firstMenuItem = mobileMenu.querySelector('a[href^="#"]');
        if (firstMenuItem) {
          firstMenuItem.focus();
        }
      } else {
        // Menu is now closed, return focus to button
        mobileMenuBtn.focus();
      }
    });

    // Keyboard support for mobile menu
    mobileMenu.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.focus();
      }
    });
  }

  // Enhanced navigation with keyboard support
  navLinks.forEach(link => {
    link.addEventListener('click', e => handleLinkClick(e, link, mobileMenu, header));
    
    // Add keyboard support for Enter key
    link.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleLinkClick(e, link, mobileMenu, header);
      }
    });
  });

  // Smooth scrolling with keyboard navigation
  window.addEventListener('scroll', () => handleScroll(sections, navLinksInNav));

  // Close mobile menu when clicking outside
  document.addEventListener('click', e => {
    if (mobileMenu && !mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.add('hidden');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Trap focus in mobile menu when open
  if (mobileMenu) {
    const focusableElements = mobileMenu.querySelectorAll('a, button, input, textarea, select');
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    mobileMenu.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      }
    });
  }
}

function handleLinkClick(e, link, mobileMenu, header) {
  e.preventDefault();
  
  // Close mobile menu if open
  if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
    mobileMenu.classList.add('hidden');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (mobileMenuBtn) {
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
  }
  
  const targetId = link.getAttribute('href').substring(1);
  const targetElement = document.getElementById(targetId);
  
  if (!targetElement) return;
  
  const headerHeight = header ? header.offsetHeight : 0;
  const targetPosition = targetElement.offsetTop - headerHeight - 20;
  
  // Smooth scroll to target
  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth'
  });

  // Focus management: focus the target section for screen readers
  setTimeout(() => {
    targetElement.setAttribute('tabindex', '-1');
    targetElement.focus();
    targetElement.removeAttribute('tabindex');
  }, 1000);
}

function handleScroll(sections, navLinks) {
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.clientHeight;
    
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    // Remove active state
    link.classList.remove('text-purple-600', 'font-semibold');
    link.setAttribute('aria-current', 'false');
    
    // Add active state to current section
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('text-purple-600', 'font-semibold');
      link.setAttribute('aria-current', 'page');
    }
  });
}