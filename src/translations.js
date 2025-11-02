/**
 * 🌐 Translation System Module
 * Centralized language management and translations
 */

// Translation data
export const translations = {
  vi: {
    // Navigation
    'nav-services': 'Dịch vụ',
    'nav-portfolio': 'Dự án',
    'nav-experience': 'Kinh nghiệm',
    'nav-blog': 'Blog',
    'nav-resume': 'Hồ sơ',
    
    // Hero section
    'hero-mynameis': 'Tên tôi là',
    'hero-name': 'Thang Hoang Duc.',
    'hero-intro': 'Front-end developer với hơn 5 năm kinh nghiệm phát triển giao diện người dùng, đam mê tạo ra sản phẩm web hiện đại và tối ưu trải nghiệm người dùng.',
    
    // Specialized section
    'specialized-subtitle': 'Chuyên môn',
    'specialized-title': 'Chuyên về',
    'skill-ibm-title': 'Phát triển IBM BPM',
    'ux-desc': 'Phát triển ứng dụng IBM BPM với JavaScript và Java, thiết kế giao diện theo gui-spec.',
    'skill-mobile-title': 'Phát triển Mobile',
    'webdev-desc': 'Phát triển ứng dụng mobile cross-platform bằng Xamarin.Forms cho iOS/Android.',
    'skill-iot-title': 'Phát triển IoT',
    'webdesign-desc': 'Phát triển ứng dụng IoT và kết nối Azure IoT hub cho thiết bị tùy biến.',
    
    // Portfolio section
    'portfolio-subtitle': 'Dự án của tôi',
    'portfolio-title': 'Dự án nổi bật',
    'project-agency-title': 'Website Agency',
    'project-agency-category': 'Thiết kế Web',
    'project-dashboard-title': 'Nền tảng Dashboard',
    'project-dashboard-category': 'Phát triển Web',
    'project-ecommerce-title': 'Website Thương mại điện tử',
    'project-ecommerce-category': 'Thiết kế UX',
    
    // Work experience
    'workexp-subtitle': 'Con đường sự nghiệp',
    'workexp-title': 'Kinh nghiệm làm việc',
    'role-hpt': 'IBM BPM Developer',
    'company-hpt-full': 'HPT Vietnam Corporation',
    'location-hpt': 'TP. Hồ Chí Minh, Việt Nam',
    'period-hpt': 'Tháng 10/2022 - Hiện tại · Toàn thời gian',
    
    // Education
    'education-subtitle': 'Kỹ năng',
    'education-title': 'Kỹ năng',
    'university-name': 'TRƯỜNG ĐẠI HỌC NÔNG LÂM TP.HCM',
    'faculty-name': 'Khoa công nghệ thông tin',
    'education-period': '09/2014 – 2018',
    'skills-intro': 'Trong hơn 5 năm, tôi đã không ngừng học hỏi trong lĩnh vực CNTT và thử nghiệm các công nghệ, framework mới, và ngày nay đã có được tổng hợp những kỹ năng chính:',
    'skill-csharp-label': 'C#',
    'skill-java-label': 'Java',
    'skill-javascript-label': 'JavaScript',
    
    // Certifications
    'certifications-subtitle': 'Chứng chỉ',
    'certifications-title': 'Chứng chỉ',
    'cert-xamarin-title': 'Phát triển ứng dụng Mobile đa nền tảng Xamarin',
    'cert-xamarin-date': '05/2018',
    'cert-flutter-title': 'Phát triển Flutter',
    'cert-flutter-date': '01/2023',
    
    // Contact
    'contact-subtitle': 'Liên hệ',
    'contact-title': 'Liên hệ',
    'contact-address-label': 'Địa chỉ',
    'contact-address-value': 'Đa Kao, Quận 1, TP.HCM, Việt Nam',
    'contact-emailinfo-label': 'Email',
    'contact-phone-label': 'Điện thoại',
    'contact-linkedin-label': 'LinkedIn',
    'copyright': '© 2025 thanghoang07. Tất cả quyền được bảo lưu.'
  },
  en: {
    // Navigation
    'nav-services': 'Services',
    'nav-portfolio': 'Portfolio',
    'nav-experience': 'Experience',
    'nav-blog': 'Blog',
    'nav-resume': 'Resume',
    
    // Hero section
    'hero-mynameis': 'My name is',
    'hero-name': 'Thang Hoang Duc.',
    'hero-intro': 'Front-end developer with 5+ years of experience in UI development, passionate about creating modern web products and optimizing user experience.',
    
    // Specialized section
    'specialized-subtitle': 'Specialized',
    'specialized-title': 'Specialized in',
    'skill-ibm-title': 'IBM BPM Development',
    'ux-desc': 'Develop IBM BPM applications with JavaScript and Java, design interfaces according to gui-spec.',
    'skill-mobile-title': 'Mobile Development',
    'webdev-desc': 'Develop cross-platform mobile applications using Xamarin.Forms for iOS/Android.',
    'skill-iot-title': 'IoT Development',
    'webdesign-desc': 'Develop IoT applications and connect Azure IoT hub for custom devices.',
    
    // Portfolio section
    'portfolio-subtitle': 'My Works',
    'portfolio-title': 'Featured Portfolios',
    'project-agency-title': 'Agency Website',
    'project-agency-category': 'Web Design',
    'project-dashboard-title': 'Dashboard Platform',
    'project-dashboard-category': 'Web Development',
    'project-ecommerce-title': 'E-commerce Website',
    'project-ecommerce-category': 'UX Design',
    
    // Work experience
    'workexp-subtitle': 'Career Path',
    'workexp-title': 'Work Experience',
    'role-hpt': 'IBM BPM Developer',
    'company-hpt-full': 'HPT Vietnam Corporation',
    'location-hpt': 'Ho Chi Minh City, Vietnam',
    'period-hpt': 'Oct 2022 - Present · Full-time',
    
    // Education
    'education-subtitle': 'Professional Skillset',
    'education-title': 'Professional Skillset',
    'university-name': 'NONG LAM UNIVERSITY – HO CHI MINH CITY',
    'faculty-name': 'Faculty of information technology',
    'education-period': '09/2014 – 2018',
    'skills-intro': 'For 5+ years, I have been continuously learning in the field of IT and experimenting with new technologies and frameworks, and today have gained a summary of key skills:',
    'skill-csharp-label': 'C#',
    'skill-java-label': 'Java',
    'skill-javascript-label': 'JavaScript',
    
    // Certifications
    'certifications-subtitle': 'Certifications',
    'certifications-title': 'Certifications',
    'cert-xamarin-title': 'Xamarin Cross-Platform Mobile Apps Development',
    'cert-xamarin-date': '05/2018',
    'cert-flutter-title': 'Flutter Development',
    'cert-flutter-date': '01/2023',
    
    // Contact
    'contact-subtitle': 'Contact',
    'contact-title': 'Contact',
    'contact-address-label': 'Address',
    'contact-address-value': 'DaKao, District 1, HCMC, VietNam',
    'contact-emailinfo-label': 'Email',
    'contact-phone-label': 'Phone',
    'contact-linkedin-label': 'LinkedIn',
    'copyright': '© 2025 thanghoang07. All rights reserved.'
  }
};

// Form placeholders data
const formPlaceholders = {
  vi: {
    'contact-name-input': 'Họ tên',
    'contact-email-input': 'Email',
    'contact-message-input': 'Tin nhắn',
    'contact-send-btn': 'Gửi tin nhắn'
  },
  en: {
    'contact-name-input': 'Name',
    'contact-email-input': 'Email',
    'contact-message-input': 'Message',
    'contact-send-btn': 'Send Message'
  }
};

/**
 * Language Management Class
 */
export class LanguageManager {
  constructor() {
    this.currentLanguage = localStorage.getItem('language') || 'vi';
  }

  /**
   * Initialize language toggle functionality
   */
  init() {
    console.log('🌐 Initializing language system...');
    
    const button = document.getElementById('toggle-language');
    if (!button) {
      console.warn('Language button not found');
      return;
    }

    // Apply saved language
    this.applyLanguage(this.currentLanguage);

    // Add click handler
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggleLanguage();
    });

    console.log('✅ Language system ready');
  }

  /**
   * Toggle between languages
   */
  toggleLanguage() {
    const newLang = this.currentLanguage === 'vi' ? 'en' : 'vi';
    console.log(`🌐 Switching from ${this.currentLanguage} to ${newLang}`);

    this.currentLanguage = newLang;
    this.applyLanguage(newLang);
    localStorage.setItem('language', newLang);

    console.log(`✅ Language switched to: ${newLang}`);
  }

  /**
   * Apply language to UI
   */
  applyLanguage(lang) {
    console.log(`🌐 Applying language: ${lang}`);

    // Update flag icons
    this.updateFlagIcons(lang);
    
    // Translate content
    this.translateContent(lang);
    
    // Update form placeholders
    this.updateFormPlaceholders(lang);
    
    // Set document language
    document.documentElement.setAttribute('lang', lang);
  }

  /**
   * Update flag icons visibility
   */
  updateFlagIcons(lang) {
    const viIcon = document.getElementById('lang-vi-icon');
    const enIcon = document.getElementById('lang-en-icon');

    if (lang === 'vi') {
      if (viIcon) {
        viIcon.classList.remove('hidden');
        viIcon.style.display = 'inline';
      }
      if (enIcon) {
        enIcon.classList.add('hidden');
        enIcon.style.display = 'none';
      }
    } else {
      if (viIcon) {
        viIcon.classList.add('hidden');
        viIcon.style.display = 'none';
      }
      if (enIcon) {
        enIcon.classList.remove('hidden');
        enIcon.style.display = 'inline';
      }
    }
  }

  /**
   * Translate all content elements
   */
  translateContent(lang) {
    const langData = translations[lang];
    if (!langData) {
      console.warn(`🌐 No translation data for language: ${lang}`);
      return;
    }

    let translatedCount = 0;

    // Translate all elements with IDs that exist in translation data
    Object.keys(langData).forEach(key => {
      const element = document.getElementById(key);
      if (element) {
        element.textContent = langData[key];
        translatedCount++;
      }
    });

    console.log(`🌐 Translated ${translatedCount} elements to ${lang}`);
  }

  /**
   * Update form placeholders
   */
  updateFormPlaceholders(lang) {
    const langPlaceholders = formPlaceholders[lang];
    if (!langPlaceholders) return;

    Object.keys(langPlaceholders).forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        if (element.tagName === 'BUTTON') {
          element.textContent = langPlaceholders[id];
        } else {
          element.placeholder = langPlaceholders[id];
        }
      }
    });
  }

  /**
   * Get current language
   */
  getCurrentLanguage() {
    return this.currentLanguage;
  }
}

// Create singleton instance
export const languageManager = new LanguageManager();