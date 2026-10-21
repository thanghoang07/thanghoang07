# Kiểm tra lại code và UI — 19/10/2026

## Kết luận

Bản hiện tại cải thiện rõ về responsive, accessibility và khả năng kiểm thử. Tuy nhiên, chưa nên đánh dấu hoàn tất: có 4 vấn đề đã tái hiện và một số hạng mục V3 chưa triển khai. Lượt này chỉ kiểm tra và ghi báo cáo, không sửa mã sản phẩm.

Phạm vi: code hiện tại gồm cả thay đổi chưa commit; đối chiếu `CODE_UI_REVIEW_PLAN_2026-10-19.md` và `PORTFOLIO_ENHANCEMENT_PLAN_V3_2026-10-19.md`. Các mục V3 bổ sung được tách khỏi lỗi hồi quy.

## Các vấn đề cần sửa

### 1. P2 — Menu mobile gây dịch chuyển bố cục khi tải trang

- Vị trí: `src/partials/header.html:40`, `src/ui/navigation.js:5–11`.
- Menu được render mở sẵn; khi module JavaScript chạy, `setOpen(false)` mới đóng menu. Khi tải script chậm, toàn bộ nội dung phía dưới nhảy lên.
- Bằng chứng: trì hoãn entry JavaScript 2 giây ở viewport 412×823 tái hiện CLS **0,2605**; `main-content` chuyển từ Y **306,55** xuống **76**, tức dịch lên khoảng **230 px**. Hai trong ba lần Lighthouse cũng có CLS **0,2604**.
- Sửa: xác định trạng thái menu đóng trước lần vẽ đầu tiên khi có JavaScript; giữ truy cập điều hướng khi không có JavaScript bằng progressive enhancement phù hợp (ví dụ cơ chế `noscript` hoặc disclosure native). Không chỉ ẩn menu rồi làm mất điều hướng trong chế độ không JS.
- Nghiệm thu: tải lạnh trên mobile với script chậm không xuất hiện menu mở thoáng qua; CLS ≤ 0,1; mở/đóng, Escape, focus và điều hướng không JS vẫn hoạt động.
- Bằng chứng máy đọc được: `output/recheck/layout-shifts.json`.

### 2. P2 — Lighthouse báo pass dù phần lớn lần chạy không đạt

- Vị trí: `lighthouserc.json`, cấu hình `ci.assert`.
- Chưa đặt `aggregationMethod`; phiên bản LHCI đang cài mặc định dùng `optimistic` (xác nhận tại `node_modules/@lhci/utils/src/assertions.js:139`). Vì vậy lần tốt nhất che khuất các lần không đạt.
- Kết quả thực tế: Performance **99 / 77 / 76**; CLS **0,0011 / 0,2604 / 0,2604**, nhưng lệnh vẫn thành công. Ngưỡng hiện tại là Performance ≥ 85 và CLS ≤ 0,1.
- Sửa: dùng `aggregationMethod: "median"` cho các assertion liên quan, hoặc `pessimistic` nếu yêu cầu mọi lần đều đạt. Giữ nguyên ngưỡng chất lượng.
- Nghiệm thu: bộ số liệu hiện tại phải bị gate từ chối; sau khi sửa menu, chạy lại 3 lần và kiểm tra cả từng báo cáo lẫn kết quả tổng hợp.

### 3. P2 — Copy Email báo thành công khi không có Clipboard API

- Vị trí: `src/contact-form.js:31–60`.
- Code chỉ gọi `writeText` nếu API tồn tại, nhưng vẫn cập nhật nhãn và status thành công khi API không tồn tại. Người dùng có thể tưởng địa chỉ đã được sao chép trong môi trường không hỗ trợ clipboard.
- Tái hiện trực tiếp: `await manager.handleCopyEmail({})` trả `true`, nhãn thành `Email copied!`, status thông báo đã copy dù không ghi clipboard.
- Nhánh lỗi hiện dùng thông báo không mở được ứng dụng email, không đúng với lỗi clipboard.
- Sửa: chỉ báo thành công sau khi `writeText` hoàn tất; nếu API thiếu hoặc bị từ chối, hiển thị thông báo riêng theo ngôn ngữ hiện tại và địa chỉ email để người dùng tự sao chép.
- Nghiệm thu: test đủ ba trường hợp thành công, API thiếu, promise bị reject; hai trường hợp lỗi không được hiện trạng thái đã copy. Test hiện tại mới bao phủ thành công.

### 4. P2 — Light mode hiện đồng thời icon mặt trăng và mặt trời

- Vị trí: `src/partials/header.html:24–25`, `src/styles/portfolio.css:421–425`.
- `.ds-icon { display: inline-block }` được áp dụng sau Tailwind, ghi đè utility `.hidden` có cùng specificity. Icon mặt trời vì thế không được ẩn trong light mode.
- Bằng chứng trình duyệt: cả `#icon-moon` và `#icon-sun` đều có computed display `block` trong light mode; quan sát được trong `output/recheck/fixed-en-light-1440.png`.
- Sửa: tránh khai báo display xung đột utility, hoặc dùng quy tắc visibility theo theme có độ ưu tiên rõ ràng. Nếu dùng thuộc tính `hidden`, bảo đảm CSS không ghi đè trạng thái đó.
- Nghiệm thu: đúng một icon hiển thị ở mỗi theme, cả sau reload và sau thao tác đổi theme; nút vẫn có tên truy cập phù hợp.

## Đối chiếu phần bổ sung V3

| Hạng mục | Trạng thái hiện tại | Việc còn lại |
| --- | --- | --- |
| Canonical, OG và ảnh chia sẻ | Chưa hoàn tất | Metadata trong `index.html` vẫn dùng URL gốc; cần thống nhất với base `/thanghoang07/`. Hiện chỉ có `og-preview.svg`, chưa có PNG 1200×630 theo V3. |
| Số công ty ở Hero | Chưa hoàn tất | `src/partials/hero.html` vẫn đặt `data-count="3"`, trong khi Experience có 4 tab công ty. |
| CV PDF/trang in và CTA | Chưa thấy triển khai | Chưa thấy tài nguyên CV hoặc liên kết tải/xem CV trong bản kiểm tra. |
| Case study dialog | Chưa thấy triển khai | Chưa có dialog, module điều khiển và kiểm thử tương ứng. |
| Copy Email | Đã có, cần sửa | Xử lý API thiếu và lỗi clipboard như mục 3. |
| Thay Font Awesome bằng SVG sprite | Đã có, cần sửa nhỏ | Các tham chiếu symbol đều resolve; sửa icon theme như mục 4. Đưa `icons-sprite.html` vào cùng commit khi bàn giao vì file đang untracked. |

Các mục chưa có ở bảng này là phần phạm vi V3 còn lại, không phải tất cả đều là lỗi phát sinh từ bản trước.

## Kết quả kiểm chứng

| Kiểm tra | Kết quả |
| --- | --- |
| `npm run test:unit` | **13/13 pass** |
| `npm run build -- --outDir output/review-dist` | **Pass**; build riêng để không ghi đè `dist` đang chỉnh |
| Smoke test bản build | **20 tổ hợp pass**: 320, 375, 768, 1024, 1440 px × EN/VI × light/dark |
| Responsive | Không thấy tràn ngang trong các tổ hợp kiểm tra; form mobile đủ rộng |
| Lỗi trình duyệt/tài nguyên nội bộ | Không ghi nhận lỗi JS hoặc asset nội bộ 404 trong smoke test |
| axe | 0 vi phạm bộ WCAG 2 A/AA và 2.1 AA trong 4 tổ hợp theme/ngôn ngữ desktop được quét |
| Tương tác | Menu, Escape, keyboard, bộ lọc, lỗi từng trường, đổi ngôn ngữ, nội dung không JS và reduced motion đạt bộ kiểm tra hiện tại |
| Lighthouse 3 lần | Accessibility, Best Practices, SEO đều **100**; Performance **99/77/76**; CLS không ổn định như mục 1–2 |

Smoke test pass không chứng minh mọi nhánh đều đúng: test hiện chưa phát hiện clipboard thiếu, số icon theme và CLS khi script tải chậm. Không kiểm chứng gửi email thực tế hoặc triển khai production; axe chưa bao phủ mọi trạng thái tương tác trên mobile.

Bằng chứng lưu trong `output/recheck/` (ảnh, `verification.json`, `layout-shifts.json`) và `output/recheck-lighthouse/` (báo cáo Lighthouse). Đây là output cục bộ bị Git ignore.

## Thứ tự chỉnh sửa đề xuất

1. Sửa trạng thái menu ban đầu và gate Lighthouse; kiểm tra lại tải chậm, no-JS, keyboard và 3 lần Lighthouse.
2. Sửa Copy Email và thêm test thiếu API/reject; giữ test thành công hiện có.
3. Sửa xung đột display của icon; xác nhận đúng một icon ở cả hai theme.
4. Hoàn tất metadata/base URL và số công ty; kiểm tra đường dẫn trên bản build dưới `/thanghoang07/`.
5. Thực hiện CV và case study theo V3 khi có nội dung thực tế phù hợp; không dùng dữ liệu dự án hoặc thành tích chưa được xác thực.
6. Chạy lại unit, build và smoke sau thay đổi; bổ sung các kiểm tra hồi quy vừa nêu rồi cập nhật trạng thái plan theo kết quả thực tế.
