// HTML Component Templates for better maintainability

export const templates = {
  // Skill card template
  skillCard: (data) => `
    <div class="card skill-card flex flex-col items-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 scroll-reveal-${data.animation} enhanced-hover" 
         data-animation="fade-in-${data.animation}" data-stagger="stagger-${data.stagger}" data-ripple data-longpress data-zoomable>
      <div class="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-6">
        <svg class="w-8 h-8 text-purple-600 dark:text-purple-400 skill-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          ${data.icon}
        </svg>
      </div>
      <h3 class="text-lg font-semibold mb-2 text-center text-gray-900 dark:text-gray-100" id="${data.titleId}">${data.title}</h3>
      <p id="${data.descId}" class="text-gray-600 dark:text-gray-300 text-center">${data.description}</p>
    </div>
  `,

  // Project card template
  projectCard: (data) => `
    <div class="card project-card flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg overflow-hidden transition-all duration-300 scroll-reveal-scale border border-gray-100 dark:border-gray-700 ${data.enhanced || ''}" 
         data-animation="fade-in-scale" data-stagger="stagger-${data.stagger}" ${data.interactions || ''}>
      <img data-src="${data.image}" alt="${data.alt}" class="w-full h-56 object-cover project-image" loading="lazy">
      <div class="p-6 flex-1 flex flex-col justify-between">
        <h3 class="text-lg font-semibold mb-2 project-title text-center text-gray-900 dark:text-gray-100" id="${data.titleId}">${data.title}</h3>
        <p class="text-gray-500 dark:text-gray-400 text-sm text-center" id="${data.categoryId}">${data.category}</p>
      </div>
    </div>
  `,

  // Company tab template
  companyTab: (data) => `
    <button class="company-tab ${data.active ? 'active' : ''} w-full px-6 py-4 rounded-xl ${data.active ? 'bg-purple-50 text-purple-600 font-semibold' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200'} shadow transition-all duration-200 focus:outline-none scroll-reveal-left magnetic" 
            data-animation="fade-in-left" data-stagger="stagger-${data.stagger}" data-company="${data.company}" id="company-${data.company}" data-ripple>
      ${data.name}
    </button>
  `,

  // Contact info template
  contactInfo: (data) => `
    <div class="flex items-center space-x-4">
      <span class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400">
        <svg class="w-6 h-6" fill="${data.fill || 'none'}" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          ${data.icon}
        </svg>
      </span>
      <div>
        <div class="font-semibold text-gray-800 dark:text-gray-100" id="${data.labelId}">${data.label}</div>
        ${data.link ? 
          `<a href="${data.link}" ${data.target ? `target="${data.target}" rel="noopener"` : ''} class="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400" id="${data.valueId}">${data.value}</a>` :
          `<div class="text-gray-500 dark:text-gray-400" id="${data.valueId}">${data.value}</div>`
        }
      </div>
    </div>
  `
};

// Data for components
export const skillsData = [
  {
    animation: 'left',
    stagger: 1,
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />',
    titleId: 'skill-ibm-title',
    title: 'IBM BPM Development',
    descId: 'ux-desc',
    description: 'Phát triển ứng dụng IBM BPM với JavaScript và Java, thiết kế giao diện theo gui-spec.'
  },
  {
    animation: 'up',
    stagger: 2,
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />',
    titleId: 'skill-mobile-title',
    title: 'Mobile Development',
    descId: 'webdev-desc',
    description: 'Phát triển ứng dụng mobile cross-platform bằng Xamarin.Forms cho iOS/Android.'
  },
  {
    animation: 'right',
    stagger: 3,
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />',
    titleId: 'skill-iot-title',
    title: 'IoT Development',
    descId: 'webdesign-desc',
    description: 'Phát triển ứng dụng IoT và kết nối Azure IoT hub cho thiết bị tùy biến.'
  }
];

export const projectsData = [
  {
    stagger: 1,
    image: 'https://via.placeholder.com/400x300/9333ea/ffffff?text=Agency+Website',
    alt: 'Agency Website project',
    titleId: 'project-agency-title',
    title: 'Agency Website',
    categoryId: 'project-agency-category',
    category: 'Web Design',
    enhanced: 'enhanced-hover',
    interactions: 'data-ripple data-longpress data-zoomable'
  },
  {
    stagger: 2,
    image: 'https://via.placeholder.com/400x300/7c3aed/ffffff?text=Dashboard+Platform',
    alt: 'Dashboard Platform project',
    titleId: 'project-dashboard-title',
    title: 'Dashboard Platform',
    categoryId: 'project-dashboard-category',
    category: 'Web Development'
  },
  {
    stagger: 3,
    image: 'https://via.placeholder.com/400x300/a855f7/ffffff?text=E-commerce+Website',
    alt: 'E-commerce Website project',
    titleId: 'project-ecommerce-title',
    title: 'E-commerce Website',
    categoryId: 'project-ecommerce-category',
    category: 'UX Design'
  }
];

export const companiesData = [
  { company: 'hpt', name: 'HPT Vietnam', stagger: 1, active: true },
  { company: 'tk25', name: 'TK25 Tech', stagger: 2, active: false },
  { company: 'nbn', name: 'NBN Media', stagger: 3, active: false },
  { company: 'devup', name: 'DevUp', stagger: 4, active: false }
];

export const contactData = [
  {
    icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 21c-4.418 0-8-4.03-8-9a8 8 0 1116 0c0 4.97-3.582 9-8 9z"/><circle cx="12" cy="12" r="2" stroke="currentColor" stroke-width="2" fill="none"/>',
    labelId: 'contact-address-label',
    label: 'Address',
    valueId: 'contact-address-value',
    value: 'DaKao, District 1, HCMC, VietNam'
  },
  {
    icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 0l8 7 8-7"/>',
    labelId: 'contact-emailinfo-label',
    label: 'Email',
    valueId: 'contact-email-value',
    value: 'thanghoang07@gmail.com',
    link: 'mailto:thanghoang07@gmail.com'
  },
  {
    icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M22 16.92v3a2 2 0 01-2.18 2A19.72 19.72 0 013 5.18 2 2 0 015 3h3a2 2 0 012 1.72c.13.81.36 1.6.7 2.34a2 2 0 01-.45 2.11l-1.27 1.27a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.74.34 1.53.57 2.34.7A2 2 0 0122 16.92z"/>',
    labelId: 'contact-phone-label',
    label: 'Phone',
    valueId: 'contact-phone-value',
    value: '(+84) 93 243 1562',
    link: 'tel:+84932431562'
  },
  {
    fill: 'currentColor',
    icon: '<path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z"/>',
    labelId: 'contact-linkedin-label',
    label: 'LinkedIn',
    valueId: 'contact-linkedin-value',
    value: 'linkedin.com/in/thanghoang07',
    link: 'https://linkedin.com/in/thanghoang07',
    target: '_blank'
  }
];