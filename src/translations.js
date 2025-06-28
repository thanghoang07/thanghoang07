const translations = {
  vi: {
    name: "Thang Hoang Duc.",
    intro: "Front-end developer với hơn 5 năm kinh nghiệm phát triển giao diện người dùng, đam mê tạo ra sản phẩm web hiện đại, tối ưu trải nghiệm người dùng.",
    services: "Dịch vụ",
    portfolio: "Dự án",
    experience: "Kinh nghiệm",
    blog: "Blog",
    resume: "Tải CV",
    myNameIs: "Tôi tên là",
    specialized: "Chuyên môn",
    specializedSubtitle: "Chuyên môn",
    portfolioSubtitle: "Dự án tiêu biểu",
    workexp: "Kinh nghiệm làm việc",
    workexpSubtitle: "Lộ trình nghề nghiệp",
    certificationsSubtitle: "Chứng chỉ",
    educationSubtitle: "Học vấn & Kỹ năng",
    contactSubtitle: "Liên hệ",
    contactNameLabel: "Họ và tên",
    contactEmailLabel: "Email",
    contactMessageLabel: "Nội dung",
    contactSendBtn: "Gửi tin nhắn",
    contactAddressLabel: "Địa chỉ",
    contactEmailInfoLabel: "Email",
    contactPhoneLabel: "Số điện thoại",
    contactLinkedinLabel: "LinkedIn",
    ux: "Phát triển ứng dụng IBM BPM với JavaScript và Java, thiết kế giao diện theo gui-spec.",
    webdev: "Phát triển ứng dụng mobile cross-platform bằng Xamarin.Forms cho iOS/Android.",
    webdesign: "Phát triển ứng dụng IoT và kết nối Azure IoT hub cho thiết bị tùy biến.",
    featured: "Dự án tiêu biểu",
    seniorux: "Dẫn dắt team thiết kế trải nghiệm người dùng cho nhiều sản phẩm.",
    uidev: "Phát triển và bảo trì các thành phần front-end cho công cụ nội bộ.",
    webdes: "Thiết kế web và prototype cho các chiến dịch marketing.",
    blogtitle: "Blog cá nhân",
    blog1: "Xu hướng thiết kế web hiện đại và phát triển trong tương lai.",
    blog2: "Các mẹo thiết kế UX giúp nâng cao trải nghiệm người dùng.",
    blog3: "Kinh nghiệm và best practice cho phát triển web hiện đại.",
    testimonials: "Khách hàng nhận xét",
    testi1: "Làm việc với Thang rất tuyệt vời. Sự tỉ mỉ và sáng tạo đã giúp dự án thành công.",
    testi2: "Chuyên môn về UX của Thang giúp chúng tôi tăng tương tác người dùng rõ rệt.",
    testi3: "Chuyên nghiệp, sáng tạo và luôn đúng deadline. Rất đáng tin cậy!",
    copyright: "© 2025 thanghoang07. All rights reserved.",
    
    // New translation keys for complete language sync
    skillIbmTitle: "Phát triển IBM BPM",
    skillMobileTitle: "Phát triển Mobile",
    skillIotTitle: "Phát triển IoT",
    projectAgencyTitle: "Website Agency",
    projectAgencyCategory: "Thiết kế Web",
    projectDashboardTitle: "Nền tảng Dashboard",
    projectDashboardCategory: "Phát triển Web",
    projectEcommerceTitle: "Website Thương mại điện tử",
    projectEcommerceCategory: "Thiết kế UX",
    companyHpt: "HPT Vietnam",
    companyTk25: "TK25 Tech",
    companyNbn: "NBN Media",
    companyDevup: "DevUp",
    roleHpt: "IBM BPM Developer",
    roleTk25: "Xamarin Developer",
    roleNbn: "Xamarin Developer Intern",
    roleDevup: "Xamarin Developer (Part-time)",
    companyHptFull: "HPT Vietnam Corporation",
    companyTk25Full: "TK25 Technology Incorporation",
    companyNbnFull: "NBN Media",
    companyDevupFull: "DevUp",
    locationHpt: "TP. Hồ Chí Minh, Việt Nam",
    locationTk25: "TP. Hồ Chí Minh, Việt Nam",
    locationNbn: "TP. Hồ Chí Minh, Việt Nam",
    locationDevup: "TP. Hồ Chí Minh, Việt Nam",
    periodHpt: "Tháng 10/2022 - Hiện tại · Toàn thời gian",
    periodTk25: "Tháng 7/2019 – Tháng 10/2022 · Toàn thời gian",
    periodNbn: "Tháng 2/2019 – Tháng 7/2019 · Thực tập",
    periodDevup: "Tháng 8/2018 – Tháng 1/2019 · Bán thời gian",
    skillJs: "JavaScript",
    skillJava: "Java",
    skillIbmBpm: "IBM BPM",
    skillAgile: "Agile",
    skillXamarin: "Xamarin",
    skillCsharp: "C#",
    skillAzureIot: "Azure IoT",
    skillAgile2: "Agile",
    skillXamarin2: "Xamarin",
    skillCsharp2: "C#",
    skillMobileDev: "Mobile",
    skillXamarin3: "Xamarin",
    skillCsharp3: "C#",
    skillMobileDev2: "Mobile",
    hptDesc1: "Phát triển ứng dụng web cho LOS (Loan Origination System) Eximbank SALLEM (IBM BPM base) bằng JavaScript và Java.",
    hptDesc2: "Thiết kế giao diện theo gui-spec từ BA.",
    hptDesc3: "Xử lý lỗi giao diện, bug từ tester.",
    hptDesc4: "Dự án theo mô hình agile scrum.",
    tk25Desc1: "Phát triển app locators.asia trên iOS/Android bằng Xamarin.Forms cho các cửa hàng bán lẻ kết nối shipper.",
    tk25Desc2: "Chịu trách nhiệm coding các chức năng \"Advertising\", \"Placement\", \"Signee\".",
    tk25Desc3: "Phát triển ứng dụng cho thiết bị Signee (Android tùy biến, kết nối Bluetooth, Azure IoT hub).",
    tk25Desc4: "Sử dụng Native, Xamarin.Android, Azure IoT hub.",
    nbnDesc1: "Phát triển chức năng đo bước chân cho app \"Sanus\" trên Android/iOS.",
    educationTitle: "Học vấn & Kỹ năng",
    universityName: "ĐẠI HỌC NÔNG LÂM TP. HỒ CHÍ MINH",
    facultyName: "Khoa Công nghệ thông tin",
    educationPeriod: "09/2014 – 2018",
    skillsIntro: "Trong hơn 5 năm, tôi đã liên tục học hỏi trong lĩnh vực CNTT và thử nghiệm các công nghệ và framework mới, và hiện tại đã tích lũy được những kỹ năng chính:",
    skillCsharpLabel: "C#",
    skillJavaLabel: "Java",
    skillJavascriptLabel: "JavaScript",
    certificationsTitle: "Chứng chỉ",
    certXamarinTitle: "Phát triển ứng dụng Mobile đa nền tảng với Xamarin",
    certXamarinDate: "05/2018",
    certFlutterTitle: "Phát triển Flutter",
    certFlutterDate: "01/2023",
    contactTitle: "Liên hệ",
    contactNameInput: "Họ và tên",
    contactEmailInput: "Email",
    contactMessageInput: "Nội dung tin nhắn",
    contactAddressValue: "Đa Kao, Quận 1, TP. HCM, Việt Nam",
    contactEmailValue: "thanghoang07@gmail.com",
    contactPhoneValue: "(+84) 93 243 1562",
    contactLinkedinValue: "linkedin.com/in/thanghoang07"
  },
  en: {
    name: "Thang Hoang Duc.",
    intro: "Front-end developer with 5+ years of experience in UI development, passionate about creating modern web products and optimizing user experience.",
    services: "Services",
    portfolio: "Portfolio",
    experience: "Experience",
    blog: "Blog",
    resume: "Resume",
    myNameIs: "My name is",
    specialized: "Specialized in",
    specializedSubtitle: "Specialized",
    portfolioSubtitle: "My Works",
    workexp: "Work Experience",
    workexpSubtitle: "Career Path",
    certificationsSubtitle: "Certifications",
    educationSubtitle: "Education & Skills",
    contactSubtitle: "Contact",
    contactNameLabel: "Name",
    contactEmailLabel: "Email",
    contactMessageLabel: "Message",
    contactSendBtn: "Send Message",
    contactAddressLabel: "Address",
    contactEmailInfoLabel: "Email",
    contactPhoneLabel: "Phone",
    contactLinkedinLabel: "LinkedIn",
    ux: "IBM BPM application development with JavaScript and Java, designing interfaces according to gui-spec.",
    webdev: "Cross-platform mobile app development using Xamarin.Forms for iOS/Android.",
    webdesign: "IoT application development and Azure IoT hub integration for custom devices.",
    featured: "Featured Portfolios",
    seniorux: "Led the UX team for various products.",
    uidev: "Developed and maintained front-end components for internal tools.",
    webdes: "Designed websites and prototypes for marketing campaigns.",
    blogtitle: "Personal Blog",
    blog1: "Trends in modern web design and future development.",
    blog2: "UX design tips to enhance user experience.",
    blog3: "Best practices and experience for modern web development.",
    testimonials: "Testimonials",
    testi1: "Working with Thang was great. His attention to detail and creativity made the project a success.",
    testi2: "Thang's UX expertise helped us increase user engagement significantly.",
    testi3: "Professional, creative, and always on time. Highly reliable!",
    copyright: "© 2025 thanghoang07. All rights reserved.",
    
    // New translation keys for complete language sync
    skillIbmTitle: "IBM BPM Development",
    skillMobileTitle: "Mobile Development",
    skillIotTitle: "IoT Development",
    projectAgencyTitle: "Agency Website",
    projectAgencyCategory: "Web Design",
    projectDashboardTitle: "Dashboard Platform",
    projectDashboardCategory: "Web Development",
    projectEcommerceTitle: "E-commerce Website",
    projectEcommerceCategory: "UX Design",
    companyHpt: "HPT Vietnam",
    companyTk25: "TK25 Tech",
    companyNbn: "NBN Media",
    companyDevup: "DevUp",
    roleHpt: "IBM BPM Developer",
    roleTk25: "Xamarin Developer",
    roleNbn: "Xamarin Developer Intern",
    roleDevup: "Xamarin Developer (Part-time)",
    companyHptFull: "HPT Vietnam Corporation",
    companyTk25Full: "TK25 Technology Incorporation",
    companyNbnFull: "NBN Media",
    companyDevupFull: "DevUp",
    locationHpt: "Ho Chi Minh City, Vietnam",
    locationTk25: "Ho Chi Minh City, Vietnam",
    locationNbn: "Ho Chi Minh City, Vietnam",
    locationDevup: "Ho Chi Minh City, Vietnam",
    periodHpt: "Oct 2022 - Present · Full-time",
    periodTk25: "Jul 2019 – Oct 2022 · Full-time",
    periodNbn: "Feb 2019 – Jul 2019 · Internship",
    periodDevup: "Aug 2018 – Jan 2019 · Part-time",
    skillJs: "JavaScript",
    skillJava: "Java",
    skillIbmBpm: "IBM BPM",
    skillAgile: "Agile",
    skillXamarin: "Xamarin",
    skillCsharp: "C#",
    skillAzureIot: "Azure IoT",
    skillAgile2: "Agile",
    skillXamarin2: "Xamarin",
    skillCsharp2: "C#",
    skillMobileDev: "Mobile",
    skillXamarin3: "Xamarin",
    skillCsharp3: "C#",
    skillMobileDev2: "Mobile",
    hptDesc1: "Developed web applications for LOS (Loan Origination System) Eximbank SALLEM (IBM BPM base) using JavaScript and Java.",
    hptDesc2: "Designed interfaces according to gui-spec from BA.",
    hptDesc3: "Fixed UI errors and bugs from testers.",
    hptDesc4: "Project following agile scrum methodology.",
    tk25Desc1: "Developed locators.asia app on iOS/Android using Xamarin.Forms for retail stores connecting shippers.",
    tk25Desc2: "Responsible for coding \"Advertising\", \"Placement\", \"Signee\" features.",
    tk25Desc3: "Developed applications for Signee devices (custom Android, Bluetooth connection, Azure IoT hub).",
    tk25Desc4: "Used Native, Xamarin.Android, Azure IoT hub.",
    nbnDesc1: "Developed step counting feature for \"Sanus\" app on Android/iOS.",
    educationTitle: "Education & Skills",
    universityName: "NONG LAM UNIVERSITY – HO CHI MINH CITY",
    facultyName: "Faculty of Information Technology",
    educationPeriod: "09/2014 – 2018",
    skillsIntro: "For 5+ years, I have been continuously learning in the field of IT and experimenting with new technologies and frameworks, and today have gained a summary of key skills:",
    skillCsharpLabel: "C#",
    skillJavaLabel: "Java",
    skillJavascriptLabel: "JavaScript",
    certificationsTitle: "Certifications",
    certXamarinTitle: "Xamarin Cross-Platform Mobile Apps Development",
    certXamarinDate: "05/2018",
    certFlutterTitle: "Flutter Development",
    certFlutterDate: "01/2023",
    contactTitle: "Contact",
    contactNameInput: "Name",
    contactEmailInput: "Email",
    contactMessageInput: "Message",
    contactAddressValue: "DaKao, District 1, HCMC, Vietnam",
    contactEmailValue: "thanghoang07@gmail.com",
    contactPhoneValue: "(+84) 93 243 1562",
    contactLinkedinValue: "linkedin.com/in/thanghoang07"
  }
}

const idsMap = {
  "nav-services": "services",
  "nav-portfolio": "portfolio",
  "nav-experience": "experience",
  "nav-blog": "blog",
  "nav-resume": "resume",
  "nav-services-mobile": "services",
  "nav-portfolio-mobile": "portfolio",
  "nav-experience-mobile": "experience",
  "nav-blog-mobile": "blog",
  "nav-resume-mobile": "resume",
  "hero-mynameis": "myNameIs",
  "hero-name": "name",
  "hero-intro": "intro",
  "specialized-title": "specialized",
  "specialized-subtitle": "specializedSubtitle",
  "portfolio-title": "featured",
  "portfolio-subtitle": "portfolioSubtitle",
  "workexp-title": "workexp",
  "workexp-subtitle": "workexpSubtitle",
  "seniorux-desc": "seniorux",
  "uidev-desc": "uidev",
  "webdes-desc": "webdes",
  "blog-title": "blogtitle",
  "blog1-desc": "blog1",
  "blog2-desc": "blog2",
  "blog3-desc": "blog3",
  "testimonials-title": "testimonials",
  "testi1-desc": "testi1",
  "testi2-desc": "testi2",
  "testi3-desc": "testi3",
  "copyright": "copyright",
  "certifications-subtitle": "certificationsSubtitle",
  "education-subtitle": "educationSubtitle",
  "contact-subtitle": "contactSubtitle",
  "contact-name-label": "contactNameLabel",
  "contact-email-label": "contactEmailLabel",
  "contact-message-label": "contactMessageLabel",
  "contact-send-btn": "contactSendBtn",
  "contact-address-label": "contactAddressLabel",
  "contact-emailinfo-label": "contactEmailInfoLabel",
  "contact-phone-label": "contactPhoneLabel",
  "contact-linkedin-label": "contactLinkedinLabel",
  
  // New ID mappings for complete language sync
  "skill-ibm-title": "skillIbmTitle",
  "skill-mobile-title": "skillMobileTitle",
  "skill-iot-title": "skillIotTitle",
  "project-agency-title": "projectAgencyTitle",
  "project-agency-category": "projectAgencyCategory",
  "project-dashboard-title": "projectDashboardTitle",
  "project-dashboard-category": "projectDashboardCategory",
  "project-ecommerce-title": "projectEcommerceTitle",
  "project-ecommerce-category": "projectEcommerceCategory",
  "company-hpt": "companyHpt",
  "company-tk25": "companyTk25",
  "company-nbn": "companyNbn",
  "company-devup": "companyDevup",
  "role-hpt": "roleHpt",
  "role-tk25": "roleTk25",
  "role-nbn": "roleNbn",
  "role-devup": "roleDevup",
  "company-hpt-full": "companyHptFull",
  "company-tk25-full": "companyTk25Full",
  "company-nbn-full": "companyNbnFull",
  "company-devup-full": "companyDevupFull",
  "location-hpt": "locationHpt",
  "location-tk25": "locationTk25",
  "location-nbn": "locationNbn",
  "location-devup": "locationDevup",
  "period-hpt": "periodHpt",
  "period-tk25": "periodTk25",
  "period-nbn": "periodNbn",
  "period-devup": "periodDevup",
  "skill-js": "skillJs",
  "skill-java": "skillJava",
  "skill-ibm-bpm": "skillIbmBpm",
  "skill-agile": "skillAgile",
  "skill-xamarin": "skillXamarin",
  "skill-csharp": "skillCsharp",
  "skill-azure-iot": "skillAzureIot",
  "skill-agile-2": "skillAgile2",
  "skill-xamarin-2": "skillXamarin2",
  "skill-csharp-2": "skillCsharp2",
  "skill-mobile-dev": "skillMobileDev",
  "skill-xamarin-3": "skillXamarin3",
  "skill-csharp-3": "skillCsharp3",
  "skill-mobile-dev-2": "skillMobileDev2",
  "hpt-desc-1": "hptDesc1",
  "hpt-desc-2": "hptDesc2",
  "hpt-desc-3": "hptDesc3",
  "hpt-desc-4": "hptDesc4",
  "tk25-desc-1": "tk25Desc1",
  "tk25-desc-2": "tk25Desc2",
  "tk25-desc-3": "tk25Desc3",
  "tk25-desc-4": "tk25Desc4",
  "nbn-desc-1": "nbnDesc1",
  "education-title": "educationTitle",
  "university-name": "universityName",
  "faculty-name": "facultyName",
  "education-period": "educationPeriod",
  "skills-intro": "skillsIntro",
  "skill-csharp-label": "skillCsharpLabel",
  "skill-java-label": "skillJavaLabel",
  "skill-javascript-label": "skillJavascriptLabel",
  "certifications-title": "certificationsTitle",
  "cert-xamarin-title": "certXamarinTitle",
  "cert-xamarin-date": "certXamarinDate",
  "cert-flutter-title": "certFlutterTitle",
  "cert-flutter-date": "certFlutterDate",
  "contact-title": "contactTitle",
  "contact-name-input": "contactNameInput",
  "contact-email-input": "contactEmailInput",
  "contact-message-input": "contactMessageInput",
  "contact-address-value": "contactAddressValue",
  "contact-email-value": "contactEmailValue",
  "contact-phone-value": "contactPhoneValue",
  "contact-linkedin-value": "contactLinkedinValue"
}

let currentLanguage = 'vi' // Default language

export function initTranslations() {
  // Load saved language preference
  const savedLanguage = localStorage.getItem('language')
  if (savedLanguage && translations[savedLanguage]) {
    currentLanguage = savedLanguage
  }
  
  // Apply initial translation
  applyTranslation(currentLanguage)
  
  // Set up language toggle
  setupLanguageToggle()
}

function setupLanguageToggle() {
  const toggleLanguageBtn = document.getElementById('toggle-language')
  const langViIcon = document.getElementById('lang-vi-icon')
  const langEnIcon = document.getElementById('lang-en-icon')
  
  if (toggleLanguageBtn) {
    toggleLanguageBtn.addEventListener('click', () => {
      // Toggle language
      currentLanguage = currentLanguage === 'vi' ? 'en' : 'vi'
      
      // Update icons
      if (currentLanguage === 'vi') {
        langViIcon.classList.remove('hidden')
        langEnIcon.classList.add('hidden')
      } else {
        langViIcon.classList.add('hidden')
        langEnIcon.classList.remove('hidden')
      }
      
      // Apply translation
      applyTranslation(currentLanguage)
      
      // Save preference
      localStorage.setItem('language', currentLanguage)
    })
  }
  
  // Set initial icon state
  if (currentLanguage === 'vi') {
    langViIcon.classList.remove('hidden')
    langEnIcon.classList.add('hidden')
  } else {
    langViIcon.classList.add('hidden')
    langEnIcon.classList.remove('hidden')
  }
}

function applyTranslation(language) {
  // Use idsMap to translate elements
  for (const [id, key] of Object.entries(idsMap)) {
    const element = document.getElementById(id)
    if (element && translations[language][key]) {
      // Handle different element types
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.placeholder = translations[language][key]
      } else {
        element.textContent = translations[language][key]
      }
    }
  }
}

export function getCurrentLanguage() {
  return currentLanguage
} 