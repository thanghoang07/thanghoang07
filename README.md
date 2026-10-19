# Thang Hoang Duc — Portfolio

Website portfolio dùng Vite, JavaScript, HTML partials và Tailwind CSS.

## Chạy local

Cần Node.js 22, npm và Chrome/Chromium để chạy smoke test.

```sh
npm ci
npm run dev
npm run test:unit
npm run build
npm run preview
npm run test:smoke
```

Dev: http://localhost:5173/. Production preview: http://localhost:4173/thanghoang07/.
Smoke test tự mở preview riêng tại port 4183. Nếu Chrome không được tự tìm thấy, đặt biến môi trường `CHROME_PATH` tới executable.

`BASE_PATH` tùy chọn phải được dùng nhất quán khi build và preview; mặc định production là `/thanghoang07/`, dev là `/`. Ví dụ PowerShell: `$env:BASE_PATH='/'; npm run build; npm run test:smoke`.

## Kiến trúc đang sử dụng

- `src/main.js`: entry duy nhất, import các feature trực tiếp qua Vite.
- `src/partials/`: nội dung và layout HTML; `src/styles/portfolio.css`: responsive, form và token cho hai theme.
- `src/translations.json`: dictionary VI/EN duy nhất. Dùng `data-i18n` trên text node, `data-i18n-aria` cho nhãn hỗ trợ truy cập.
- `src/contact-form.js` và `src/contact-validation.js`: validation và mở mailto. Website **không xác nhận đã gửi thư**; người dùng gửi tiếp trong ứng dụng email và draft được giữ trên trang.
- `src/ui/`: navigation, tabs, filter và counters; enhancement trang nằm trong `src/design-system-enhancements.js`.
- `public/images/`: bộ ảnh SVG minh họa nội bộ cho Avatar, OpenGraph và các dự án tiêu biểu.
- `tests/unit/` và `scripts/smoke-test.js`: test logic, production runtime, responsive VI/EN × light/dark, bàn phím, no-JS và axe.

Khi JavaScript không chạy, nội dung hồ sơ, các kinh nghiệm và địa chỉ email vẫn đọc được. Form bị vô hiệu hóa để không gửi dữ liệu cá nhân lên URL.

## Kiểm tra và phát hành

`npm run ci:test` chạy unit → build → smoke. `npm run lighthouse:ci` chạy Lighthouse với các ngưỡng trong `lighthouserc.json`. Kết quả local nằm ở `output/playwright/` và `.lighthouseci/`.

GitHub Actions dùng `npm ci`; PR/push phải qua test và Lighthouse. Chỉ push vào master hoặc chạy workflow thủ công trên nhánh phù hợp mới có thể triển khai Pages sau quality gates. Không cần xóa lockfile để build.

Xem [báo cáo review đợt 1](docs/CODE_UI_REVIEW_PLAN_2026-10-19.md) và [báo cáo review & kế hoạch chỉnh sửa V2](docs/CODE_UI_REVIEW_PLAN_V2_2026-10-19.md). Các tài liệu/test HTML cũ được lưu trữ tại `docs/archive/`.
