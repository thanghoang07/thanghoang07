> Historical document: describes the pre-review implementation. For current setup, architecture and tests, see the root README and docs/REVIEW_IMPLEMENTATION_2026-10-19.md.

# 📧 Hướng dẫn Setup EmailJS cho Contact Form

## 🚀 Bước 1: Tạo tài khoản EmailJS
1. Truy cập [EmailJS.com](https://www.emailjs.com/)
2. Đăng ký tài khoản miễn phí
3. Đăng nhập vào dashboard

## ⚙️ Bước 2: Tạo Email Service
1. Vào **Email Services** → **Add New Service**
2. Chọn **Gmail** (hoặc email provider bạn muốn)
3. Kết nối với Gmail của bạn (thanghoang07@gmail.com)
4. Lưu lại **Service ID** (ví dụ: `service_abc123`)

## 📝 Bước 3: Tạo Email Template
1. Vào **Email Templates** → **Create New Template**
2. Thiết lập template như sau:

**Template Content:**
```
Subject: New Contact from {{from_name}}

From: {{from_name}}
Email: {{from_email}}

Message:
{{message}}

---
Sent from Portfolio Contact Form
```

**Template Variables:**
- `{{from_name}}` - Tên người gửi
- `{{from_email}}` - Email người gửi  
- `{{message}}` - Nội dung tin nhắn

3. Lưu lại **Template ID** (ví dụ: `template_abc123`)

## 🔑 Bước 4: Lấy Public Key
1. Vào **Account** → **General**
2. Copy **Public Key** (ví dụ: `abc123xyz`)

## 🛠️ Bước 5: Cập nhật Configuration
Mở file `src/contact-form.js` và thay thế:

```javascript
const emailJSConfig = {
  publicKey: 'YOUR_PUBLIC_KEY',    // → Thay bằng Public Key của bạn
  serviceId: 'YOUR_SERVICE_ID',    // → Thay bằng Service ID của bạn  
  templateId: 'YOUR_TEMPLATE_ID'   // → Thay bằng Template ID của bạn
};
```

## ✅ Bước 6: Test Contact Form
1. Build lại project: `npm run build`
2. Test form contact trên website
3. Kiểm tra email đến thanghoang07@gmail.com

## 🔄 Fallback Solution
Nếu không muốn setup EmailJS, form sẽ tự động sử dụng **Formspree** làm backup:
- Emails sẽ được gửi qua Formspree service
- Không cần configuration thêm
- Hoạt động ngay lập tức

## 🎯 Email sẽ được gửi đến:
**thanghoang07@gmail.com**

## 📊 Features đã implement:
- ✅ Form validation (name, email, message)  
- ✅ Character counter for message
- ✅ Loading states & animations
- ✅ Success/error notifications
- ✅ EmailJS integration với Formspree fallback
- ✅ Responsive design
- ✅ Dark mode support

## 🚨 Lưu ý:
- EmailJS free plan: 200 emails/tháng
- Formspree fallback: 50 emails/tháng  
- Form sẽ tự động chuyển đổi giữa 2 service

## 🛠️ Troubleshooting:
Nếu có lỗi, check Console (F12) để xem log chi tiết.