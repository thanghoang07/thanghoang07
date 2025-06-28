export function initNavigation() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('a[href^="#"]');
  const navLinksInNav = document.querySelectorAll('nav a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');
  const header = document.querySelector('header');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', e => handleLinkClick(e, link, mobileMenu, header));
  });

  window.addEventListener('scroll', () => handleScroll(sections, navLinksInNav));

  document.addEventListener('click', e => {
    if (mobileMenu && !mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.add('hidden');
    }
  });
}

function handleLinkClick(e, link, mobileMenu, header) {
  e.preventDefault();
  if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
    mobileMenu.classList.add('hidden');
  }
  const targetId = link.getAttribute('href').substring(1);
  const targetElement = document.getElementById(targetId);
  if (!targetElement) return;
  const headerHeight = header ? header.offsetHeight : 0;
  const targetPosition = targetElement.offsetTop - headerHeight - 20;
  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth'
  });
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
    link.classList.remove('text-purple-600', 'font-semibold');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('text-purple-600', 'font-semibold');
    }
  });
}