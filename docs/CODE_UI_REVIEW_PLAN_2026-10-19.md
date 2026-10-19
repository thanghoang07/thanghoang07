# Review code, UI và kế hoạch chỉnh sửa

Ngày kiểm tra: **19/10/2026**. Commit tham chiếu: **f01408c3**.

## 1. Kết luận

Đây là website portfolio cá nhân, dùng HTML partials, JavaScript thuần, Tailwind CSS và Vite; triển khai lên GitHub Pages. Review theo quy mô website tĩnh cho khách xem hồ sơ và liên hệ, không giả định có backend hay hệ thống nhiều người dùng.

**Chưa đạt để coi là bản phát hành ổn định.** Build thành công nhưng bản production thiếu module chức năng; menu desktop không hiện; form liên hệ trên điện thoại bị vỡ bố cục. Cần sửa các lỗi này trước khi thêm hiệu ứng hoặc thiết kế lại toàn bộ.

Điểm đang làm tốt:

- Đã tách nội dung thành partials theo section, dễ chỉnh nội dung.
- Có hệ thống token CSS, phong cách màu sắc và typography tương đối nhất quán.
- Có bộ lọc dự án, chế độ sáng/tối, cơ chế dịch, trạng thái thông báo và hỗ trợ reduced motion ở mức CSS.
- Có 7 unit test đang chạy đạt; một số interaction đã tách thành hàm có thể kiểm thử.

Skills áp dụng: `ponytail-audit`, `frontend-ui-engineering`, `playwright`. Báo cáo và kế hoạch viết bằng tiếng Việt theo yêu cầu. Không sửa logic sản phẩm trong đợt review này.

## 2. Phạm vi và bằng chứng

Đã đọc entry point đang hoạt động, cấu hình build/Tailwind, các partials, CSS chính, module dịch/theme/contact, interaction, test unit, workflow triển khai và Lighthouse; khảo sát thêm các entry point/hệ thống cũ.

Đã chạy:

| Kiểm tra | Kết quả |
| --- | --- |
| `npm run test:unit` | **7/7 đạt** |
| `npm run build` | **Đạt**, nhưng chỉ xác nhận bundler hoàn tất |
| Production preview | `http://127.0.0.1:4173/thanghoang07/` |
| Chromium/Playwright | Kiểm tra DOM, request lỗi, đổi ngôn ngữ, ảnh giao diện |
| Responsive | Đo ở 320, 375, 768, 1024, 1440px |

| Viewport | Chiều rộng nội dung (`scrollWidth`) | Menu desktop |
| --- | --- | --- |
| 320px | **458px** | Ẩn, phù hợp breakpoint nhưng trang tràn ngang |
| 375px | **458px** | Ẩn, trang tràn ngang |
| 768px | 768px | **Ẩn dù đã tới breakpoint md** |
| 1024px | 1024px | **Ẩn sai** |
| 1440px | 1440px | **Ẩn sai**, nút mobile vẫn hiện |

Ảnh bằng chứng được lưu trong `output/playwright/`:

- [Desktop 1440px](../output/playwright/review-desktop-1440.png).
- [Mobile 320px](../output/playwright/review-mobile-320.png).
- [Form liên hệ 375px](../output/playwright/review-contact-375.png).

Console của bản preview ghi nhận 404 tại `js/theme.js`, `js/translations.js`, `js/animation-system.js`, `js/contact-form.js`, `/src/translations.json` và `/vite.svg`. Bốn lỗi module là lỗi của output build; lỗi JSON còn có nguyên nhân tính base path theo hostname.

Mức ưu tiên: **P1** = hỏng chức năng chính hoặc cản trở sử dụng; **P2** = cần sửa để bảo đảm chất lượng, khả năng truy cập và bảo trì; **P3** = hoàn thiện. “Tái hiện” là đã quan sát trên bản build; “đọc code” là có đường chạy cụ thể nhưng chưa kiểm thử đầy đủ trong trình duyệt.

## 3. Các điểm bắt buộc sửa

### 01 — P1: Module chức năng không được đóng gói vào production

- **Vị trí:** `src/main.js:59–76`, `vite.config.js:72–73`.
- **Bằng chứng:** `_loadModules()` dùng đường dẫn biến và `import(/* @vite-ignore */ mod.path)`. Bundle nằm trong `dist/js/`, nên browser yêu cầu các file như `js/contact-form.js` không tồn tại. Đã tái hiện bốn request 404.
- **Ảnh hưởng:** theme/language chạy fallback không đầy đủ; contact không gắn submit handler. Form HTML không có `action`/`method`, nên khi submit hợp lệ có thể điều hướng GET về trang hiện tại với tên/email/tin nhắn trong URL thay vì xử lý liên hệ. Phần GET này là kết luận từ HTML và đường khởi tạo, không gửi thử dữ liệu thực.
- **Cách sửa:** dùng static imports hoặc map loader có literal `() => import('./contact-form.js')` để Vite theo dõi dependency; không copy JS nguồn thủ công để chữa triệu chứng. Module thiết yếu lỗi phải có trạng thái rõ ràng; contact mặc định không cho submit cho tới khi handler sẵn sàng.
- **Nghiệm thu:** preview production không còn request module 404; form có handler; dữ liệu nhập không xuất hiện trên URL; kiểm tra cả dev và build với cùng thao tác.

### 02 — P1: Tailwind không quét các HTML partials

- **Vị trí:** `tailwind.config.js:3–6`, `src/partials/header.html:14–40`, `src/partials/hero.html:61`.
- **Bằng chứng:** content glob chỉ quét JS/TS trong `src`, bỏ `.html`. Tại 1440px, `header nav` có `display:none`, nút mobile có `display:flex`. Các class responsive chỉ có trong partials không được sinh đầy đủ.
- **Ảnh hưởng:** mất điều hướng desktop, hiện sai controls theo breakpoint. Avatar còn có inline `display:flex` đè class `hidden`, nên chỉ sửa glob chưa đủ để ẩn avatar trên mobile.
- **Cách sửa:** thêm HTML vào content glob; chuyển `display` của vùng avatar khỏi inline style sang class responsive. Rà tất cả partials có class responsive và xung đột inline/CSS.
- **Nghiệm thu:** dưới 768px chỉ có menu mobile; từ 768px menu desktop hiện và nút mobile ẩn; avatar tuân thủ quyết định thiết kế mobile.

### 03 — P1: Bố cục nhiều section tràn ngang, form mobile không dùng được

- **Vị trí:** `src/partials/contact.html:11`, `experience.html:12`, `portfolio.html:22`, `services.html:12`, `certifications.html:13`, `hero.html:5–46`.
- **Bằng chứng:** viewport 320/375px có `scrollWidth=458px`. Contact vẫn giữ hai cột và gap 3rem; tại 320px track form chỉ 66px. Experience giữ cột trái 220px; portfolio yêu cầu cột tối thiểu 320px trong container 264px. Hero có hàng stats không wrap.
- **Ảnh hưởng:** nội dung bị cắt, form bị bóp hẹp, người dùng phải cuộn ngang. Ảnh contact 375px cho thấy input gần như không thể đọc/nhập thuận tiện.
- **Cách sửa:** đưa layout ra class; mobile một cột cho contact/experience; hero stats cho phép wrap hoặc grid ba cột co được; dùng `minmax(0,1fr)` và breakpoint phù hợp cho card grid. Với chuỗi email/link dài, dùng wrap có chủ đích và `min-width:0` cho grid child.
- **Nghiệm thu:** toàn trang không tràn ngang ở 320, 375, 768, 1024, 1440px; trường nhập rộng theo container; test nội dung VI/EN và zoom 200%. Không dùng `overflow-x:hidden` để che lỗi.

### 04 — P1: Đổi ngôn ngữ không đồng nhất và sai ý nghĩa menu

- **Vị trí:** `src/main.js:17,110–148`, `src/translations.json:3–10`, `src/translations.js:translateContent`, `src/partials/header.html:18–19,47–58`.
- **Bằng chứng:** trên preview có base `/thanghoang07/` nhưng hostname local làm code fetch `/src/translations.json`, trả 404; nhánh `res.ok === false` không khởi tạo fallback. Có hai nguồn bản dịch độc lập. ID `nav-blog` gắn link Skills, `nav-resume` gắn Contact nhưng dịch ra Blog/Hồ sơ hoặc Resume. Menu mobile, CTA và nhiều nội dung không có binding dịch. Module JS còn gán `textContent` lên `hero-name`, xóa các span typing bên trong.
- **Ảnh hưởng:** cờ/ngôn ngữ lưu có thể đổi nhưng nội dung không đổi; menu chỉ sai đích về mặt ngữ nghĩa; VI/EN trộn lẫn. Nhánh fallback không cập nhật `html.lang`.
- **Cách sửa:** chọn một dictionary chuẩn, import JSON qua bundler hoặc dùng `import.meta.env.BASE_URL` nếu cần fetch; xử lý HTTP lỗi. Dùng key theo nghĩa `nav-skills`, `nav-contact`, bind cả desktop/mobile; chỉ dịch node text chuyên dụng, placeholder và label đúng loại. Đồng bộ `html.lang`, thông báo form và nhãn accessibility.
- **Nghiệm thu:** chuyển VI/EN hai chiều, reload giữ lựa chọn; không mất cấu trúc hero; link và nhãn đúng nghĩa; không sót đoạn tiếng Việt ở bản EN trừ tên riêng. Kiểm thử base `/` và `/thanghoang07/` bằng build cấu hình tương ứng.

### 05 — P1: Form coi việc mở ứng dụng email là gửi thành công

- **Vị trí:** `src/contact-form.js:99–103,343–348,456–474`, `src/contact-messages.js:3`.
- **Bằng chứng đọc code:** `sendEmail()` chỉ gọi `mailto`; hàm này resolve thành công ngay, sau đó UI cảm ơn và reset form. Không có xác nhận email được gửi. Đây là lỗi sẽ lộ khi sửa module production ở mục 01, đồng thời tồn tại trên nhánh handler hoạt động.
- **Ảnh hưởng:** khách hủy cửa sổ mail hoặc không có mail client vẫn mất nội dung và tưởng đã liên hệ xong.
- **Cách sửa tối thiểu:** nếu giữ mailto, đổi CTA thành “Mở ứng dụng email”, giải thích bước gửi tiếp theo và không reset nội dung. Nếu muốn gửi trực tiếp, chọn đúng một dịch vụ đã cấu hình, chỉ báo thành công sau phản hồi hợp lệ; giữ dữ liệu khi lỗi. Loại SDK/nhánh gửi không sử dụng sau khi chốt phương án.
- **Nghiệm thu:** test hủy mailto/không có mail client; với dịch vụ, mock thành công, timeout, 4xx/5xx và double submit. Chỉ nghiệm thu gửi thật khi có môi trường và người nhận thử được cho phép.

### 06 — P2: Lỗi validation của trường này xóa thông báo trường khác

- **Vị trí:** `src/contact-form.js:203–234`, `src/partials/contact.html:14–23`.
- **Bằng chứng đọc code:** các input chung parent là form; `clearFieldError()` lấy `.field-error` đầu tiên trong parent. Khi tên quá ngắn và message quá ngắn cùng lúc, xử lý trường sau có thể xóa thông báo tên.
- **Ảnh hưởng:** form báo invalid nhưng không giải thích đầy đủ tại đúng trường; sửa email có thể làm mất lỗi của tên.
- **Cách sửa:** mỗi trường có wrapper/error node riêng hoặc ID lỗi cố định; chỉ cập nhật lỗi liên quan; thêm `aria-invalid` và `aria-describedby`; focus trường lỗi đầu tiên khi submit.
- **Nghiệm thu:** tên `A`, email hợp lệ, message `abc` phải hiện hai lỗi độc lập; sửa một trường không xóa lỗi trường khác. Kiểm tra sau khi mục 01 đã sửa.

### 07 — P2: Icon ở light mode gần như hòa vào nền

- **Vị trí:** `src/design-system.css:480–485`, `src/partials/header.html:24–38`, `src/partials/hero.html:51–56`.
- **Bằng chứng:** `.ds-btn--icon` dùng trắng alpha 0.6 cho cả light mode; ảnh desktop/mobile cho thấy theme/menu/social icons rất khó nhận ra. CSS override light mode cho inline text không sửa màu này.
- **Ảnh hưởng:** người dùng khó thấy các thao tác; biểu tượng chức năng không đủ rõ.
- **Cách sửa:** tạo token foreground cho icon ở từng theme; áp dụng cả default/hover/focus/disabled. Kiểm tra thêm chữ cyan nhỏ và màu muted trên nền thực tế, không đổi palette chỉ vì sở thích.
- **Nghiệm thu:** đo contrast của icon chức năng đạt mục tiêu 3:1 và chữ thường 4.5:1; chụp lại light/dark. Review này chưa đo toàn bộ contrast nên không tuyên bố toàn trang đạt/không đạt WCAG.

### 08 — P2: Navigation active chỉ cập nhật bản mobile và dễ chọn sai section

- **Vị trí:** `src/ui/page-interactions.js:47–87`, `src/partials/header.html`.
- **Bằng chứng đọc code:** `Map(id → link)` nhận cả hai menu có cùng href; bản mobile xuất hiện sau ghi đè link desktop. Khi chọn section, chỉ link cuối được thêm active. Observer chỉ so sánh batch `entries` mới thay đổi, không giữ trạng thái tất cả section đang giao nhau.
- **Ảnh hưởng:** sau khi phục hồi menu desktop, active indicator vẫn không hoạt động đúng; khi nhiều section giao vùng theo dõi, active có thể nhảy sai.
- **Cách sửa:** map mỗi ID sang danh sách link; cập nhật mọi bản tương ứng và `aria-current`. Giữ trạng thái giao nhau hoặc chọn section bằng quy tắc vị trí đơn giản, ổn định.
- **Nghiệm thu:** test có hai link cùng href và nhiều callback observer liên tiếp; desktop/mobile cùng active cho section hiện tại, trạng thái đầu trang được xóa đúng.

## 4. Các điểm nên sửa

### 09 — P2: Ngữ nghĩa và thao tác bàn phím chưa đầy đủ

- **Vị trí:** `src/partials/contact.html:14–23`, `header.html:28–38`, `experience.html:15–34`, `portfolio.html:15–19`, `src/ui/page-interactions.js:12–16`, `index.html:294–296`.
- **Bằng chứng đọc code:** form chỉ có placeholder, không có label ổn định; input có inline `outline:none`; menu không cập nhật `aria-expanded`/`aria-controls`; tab chỉ thay class/hidden; filter không công bố trạng thái chọn. Nút ngôn ngữ dựa vào tên ảnh quốc kỳ, chưa nói rõ hành động.
- **Ảnh hưởng:** sau khi nhập khó xác định trường; người dùng bàn phím/trình đọc màn hình thiếu thông tin về trạng thái và vùng được điều khiển. Focus input hiện chỉ dựa vào đổi border, cần kiểm chứng độ rõ.
- **Cách sửa:** thêm label, focus ring rõ, tên hành động cho language toggle. Menu công bố expanded, đóng bằng Escape và trả focus. Tabs dùng `tablist/tab/tabpanel`, selected, controls và phím mũi tên/Home/End; filter dùng `aria-pressed`. Nếu chọn nút thường thay vì pattern tabs thì phải đặt tên/quan hệ đủ rõ, không thêm role nửa chừng.
- **Nghiệm thu:** dùng Tab/Shift+Tab/Enter/Space/Escape, kiểm tra tên và trạng thái trong accessibility tree; chạy axe rồi kiểm tra thủ công. Không chỉ dựa vào điểm Lighthouse.

### 10 — P2: Animation vẫn chạy nền và nhiều hệ thống cùng ghi một phần tử

- **Vị trí:** `src/design-system-enhancements.js:18–49,147–181,234`, `src/main.js:35,185–186,193–201`, `src/ui/page-interactions.js:96–128`, `index.html:298–305`.
- **Bằng chứng:** DOM có hai `.ds-cursor-glow`; HTML đã tạo một, JS tạo thêm một. Sau mousemove, vòng `requestAnimationFrame` không dừng dù glow đã opacity 0. Hai counter cùng chạy lên `[data-count]`; back-to-top có hai nơi đăng ký scroll/click.
- **Ảnh hưởng:** tính toán/style updates không cần thiết; counter có thể ghi đè nhau giữa hai thời lượng; khó truy lỗi. CSS reduced-motion chỉ giấu hiệu ứng, không dừng vòng JS.
- **Cách sửa:** tái sử dụng một glow, dừng RAF khi idle/tab ẩn/reduced motion; chỉ khởi tạo khi cần. Giữ `initCounters` ở một nơi và trả số cuối ngay khi reduce; gom back-to-top vào một module. Sau khi khôi phục animation-system cần kiểm tra nó có khởi tạo trùng chức năng còn lại không.
- **Nghiệm thu:** một glow, một controller counter/back-to-top; không tiếp tục RAF glow khi idle/ẩn tab/reduce; counter kết thúc đúng. Dùng profiling ngắn để chứng minh, không gán số cải thiện hiệu năng khi chưa đo.

### 11 — P2: CI không chặn đúng lỗi và build không tái lập theo lockfile

- **Vị trí:** `.github/workflows/static.yml:39–51`, `scripts/fix-rollup.js:25–58`, `.github/workflows/lighthouse.yml:49–51`, `scripts/test-build.js:58–73`, `tests/unit/page-interactions.test.js`.
- **Bằng chứng đọc code:** deploy gọi script xóa `package-lock.json` rồi `npm install`; không chạy unit test trước deploy. Lighthouse dùng `|| echo` làm lỗi không chặn job. Test build chỉ kiểm tra cấu trúc/output, không mở trang; 7 unit test hiện tại không bao phủ module production/responsive/contact.
- **Ảnh hưởng:** cùng commit có thể lấy dependency khác; CI xanh nhưng người dùng gặp lỗi như mục 01–03.
- **Cách sửa:** dùng `npm ci` với lockfile đã kiểm chứng; nếu cần sửa optional dependency thì làm có điều kiện và sửa tận gốc lockfile, không xóa mỗi lần. Chạy unit → build → smoke test production → deploy. Bỏ nuốt exit code Lighthouse khi đó là quality gate; chốt ngưỡng sau baseline thực tế.
- **Nghiệm thu:** cố tình làm thiếu một module hoặc sai responsive selector phải khiến CI fail; hai lần cài từ lockfile không sửa lockfile. Workflow deploy không chạy khi gate chưa đạt.

### 12 — P2: JavaScript lỗi có thể khiến toàn bộ nội dung bị che

- **Vị trí:** `index.html:73–85,197–199,238–243`, `src/main.js:285–318`.
- **Bằng chứng đọc code:** overlay loader mặc định phủ trang, nội dung bị ẩn khi chưa có `body.loaded`; cơ chế cứu sau 5 giây cũng nằm trong module chính. Nếu module chính không tải hoặc JS bị tắt, cơ chế này không chạy.
- **Ảnh hưởng:** website portfolio tĩnh vẫn có HTML nhưng khách chỉ thấy loading, không đọc được hồ sơ/liên hệ.
- **Cách sửa:** hiển thị nội dung HTML mặc định; chỉ bật enhancement/loading cục bộ khi JS đã sẵn sàng. Nếu giữ loader, phải có đường thoát độc lập và phương án no-JS; ưu tiên bỏ loader chặn toàn màn hình vì trang không cần chờ dữ liệu thiết yếu.
- **Nghiệm thu:** tắt JavaScript hoặc chặn bundle chính vẫn đọc được tên, dự án và email; failure không để overlay vô hạn. Đây là test còn cần thực hiện khi sửa.

### 13 — P3: Một số liên kết và favicon còn là placeholder

- **Vị trí:** `src/partials/hero.html:52`, `footer.html:12`, `contact.html:32`, `portfolio.html:100,138`, `index.html:38`.
- **Bằng chứng:** Facebook trỏ `#`; địa chỉ chỉ mở trang Google Maps chung; hai CTA dự án trỏ chung profile GitHub; favicon `/vite.svg` trả 404 trên preview.
- **Ảnh hưởng:** người xem bấm mà không tới nội dung cụ thể; website chưa thể hiện đầy đủ mức độ hoàn thiện.
- **Cách sửa:** dùng link Facebook thật hoặc bỏ nút; Maps trỏ truy vấn địa chỉ phù hợp; dự án công khai có repo/demo cụ thể, dự án kín ghi rõ và đưa case study được phép chia sẻ; thêm favicon local đúng base.
- **Nghiệm thu:** click audit mọi CTA; không còn link giả hoặc favicon 404. Không tự tạo thành tích, URL repo hay thông tin khách hàng chưa được xác minh.

### 14 — P2: Còn nhiều đường khởi tạo cũ gây khó bảo trì

- **Vị trí:** `src/app.js:1–5`, `src/core/app-manager.js:109–124`, `src/ui/contact-form.js`, `src/main-old.js.bak`, `src/main-github-pages.js.bak`, `vite.config.js:87–116`.
- **Bằng chứng đọc code:** entry thực tế là `src/main.js`; đường app cũ import `./utils/translations.js` không có trong cây source, app-manager tham chiếu `animation-optimizer.js` không có. Có nhiều triển khai contact/navigation/animation; build còn copy toàn bộ tests ra production.
- **Ảnh hưởng:** người bảo trì dễ sửa nhầm module không chạy hoặc kích hoạt lại đường đã hỏng; tài liệu và output phát hành bị lẫn công cụ thử nghiệm. Không kết luận các module cũ đang làm crash production hiện tại.
- **Cách sửa:** lập sơ đồ import và tìm cả tham chiếu động, test, docs trước khi xóa; chỉ giữ entry và owner đang dùng cho mỗi feature. Xóa `.bak` sau khi xác nhận Git đã giữ lịch sử; ngừng copy tests ra dist trừ khi có yêu cầu cung cấp test page công khai. Cập nhật README với lệnh chạy/kiểm tra/deploy đúng.
- **Nghiệm thu:** build/import graph không còn nhánh hỏng được sử dụng; test và docs không tham chiếu file vừa xóa; output chỉ chứa tài nguyên cần phát hành. Chưa ước lượng số dòng/dependency có thể bỏ vì chưa chứng minh toàn bộ reachability.

## 5. Kế hoạch thực hiện chi tiết

Ước lượng dưới đây là thời gian làm việc tập trung của một lập trình viên đã quen project, gồm sửa và kiểm thử; chưa tính chờ cấu hình dịch vụ gửi mail hoặc xác nhận nội dung. Không phải cam kết tiến độ.

### Đợt A — Khôi phục chức năng build (0,5–1 ngày)

**Phụ thuộc:** không. **Xử lý:** 01, 02, phần đường dẫn của 04, favicon trong 13.

1. Thay dynamic import bị bỏ qua bằng loader literal; xác định module nào thiết yếu, module nào có thể lỗi độc lập.
2. Chặn native submit cho tới khi contact sẵn sàng; khi lỗi cho người dùng cách liên hệ bằng email trực tiếp.
3. Sửa Tailwind content glob và xung đột display inline của avatar.
4. Thống nhất base URL theo cấu hình build; bỏ hostname hardcode khỏi đường dẫn tài nguyên.
5. Xử lý JSON HTTP lỗi và favicon; kiểm tra lại preload của main vì hiện output có thêm bản main trong `assets/`.
6. Thêm smoke test chạy trên preview: tải trang, không có lỗi asset nội bộ, menu theo viewport, contact handler được khởi tạo.

**Đầu ra:** commit sửa runtime/build và test chống tái phát. **Chốt đợt:** production không còn 404 module, desktop nav hiện, input không có đường rơi xuống GET.

### Đợt B — Responsive và độ rõ của giao diện (1–1,5 ngày)

**Phụ thuộc:** A để CSS phản ánh đúng class. **Xử lý:** 03, 07, phần focus của 09.

1. Tạo các class layout cụ thể cho hero, project grid, experience, contact; bỏ inline grid/display tương ứng.
2. Mobile contact một cột, info nằm dưới form; experience dùng selector công ty phía trên panel hoặc danh sách nút wrap được.
3. Card grid co được ở 320px; stats/CTA không đẩy container rộng; xử lý link dài.
4. Đưa màu icon, text muted, field background và focus vào token light/dark; thay dần selector dò chuỗi inline style bằng class có nghĩa ở các vùng đang sửa.
5. Chụp cùng góc trước/sau ở 320/375/768/1024/1440; đo overflow từng section và kiểm tra zoom 200%.

**Đầu ra:** CSS/partials có quy tắc responsive rõ và bộ ảnh nghiệm thu. **Chốt đợt:** không tràn ngang, form đủ rộng, nút và focus nhìn rõ ở hai theme.

### Đợt C — Form liên hệ và ngôn ngữ (1–1,5 ngày)

**Phụ thuộc:** A; phối hợp layout từ B. **Xử lý:** 04, 05, 06, label của 09.

1. Chốt mailto hay gửi trực tiếp. Phương án ít thay đổi nhất là mailto với lời dẫn đúng, giữ nội dung; không cần thêm backend chỉ để làm đúng thông báo.
2. Mỗi field có label, wrapper/error node, `autocomplete` thích hợp và liên kết ARIA; xử lý validation độc lập.
3. Một dictionary VI/EN; thống nhất ID/key của header, experience, form, CTA, filter, footer. Không gán text lên container có icon/span động.
4. Đồng bộ saved language, document lang, placeholders, nút gửi và thông báo lỗi/thành công.
5. Test hai lỗi cùng lúc, đổi ngôn ngữ sau lỗi, reload giữ locale, mạng lỗi và thao tác gửi lặp. Dùng mock để tránh gửi thư thật.

**Đầu ra:** hợp đồng trạng thái form và test integration. **Chốt đợt:** không báo gửi thành công giả, không mất dữ liệu do lỗi/hủy, không xóa nhầm field error, nhãn đúng ngôn ngữ.

### Đợt D — Navigation, accessibility và animation (0,5–1 ngày)

**Phụ thuộc:** A–C. **Xử lý:** 08, phần còn lại của 09, 10, 12.

1. Map section → mọi link tương ứng; xác định section active qua nhiều callback, cập nhật `aria-current`.
2. Hoàn thiện menu/tabs/filter bằng bàn phím và trạng thái accessibility; có tên hành động rõ cho controls.
3. Loại counter/back-to-top/glow trùng; tôn trọng reduced motion cả JS; dừng hiệu ứng lúc không sử dụng.
4. Bỏ cơ chế ẩn toàn bộ portfolio phụ thuộc bundle; thử chặn module/no-JS.
5. Chạy axe và kiểm tra tay focus order, focus visibility, menu Escape, tab keyboard, screen-reader names; xem CPU idle ngắn.

**Đầu ra:** interaction thống nhất và test hành vi. **Chốt đợt:** các thao tác chính dùng được bằng bàn phím; animation không chạy thừa; HTML vẫn đọc được khi JS thất bại.

### Đợt E — Quality gates và dọn code (0,5–1 ngày)

**Phụ thuộc:** A–D đã có baseline hoạt động. **Xử lý:** 11, 13, 14.

1. Deploy dùng `npm ci`, chạy unit/build/production smoke trước upload Pages.
2. Bổ sung test lỗi đã tìm thấy thay vì tăng coverage bằng test không kiểm chứng hành vi thật.
3. Lighthouse chạy đúng URL có base path; quality gate phải trả mã lỗi khi vi phạm ngưỡng đã chốt.
4. Lập import/reference map; xóa phần legacy được chứng minh không dùng và ngừng đưa tests lên dist.
5. Sửa link thật, favicon, README; cập nhật báo cáo với bằng chứng sau sửa.

**Đầu ra:** CI có khả năng chặn regression, source ít đường chạy trùng, tài liệu đúng. **Chốt đợt:** chạy pipeline từ checkout sạch và kiểm tra artifact production trước khi phát hành.

**Tổng dự kiến: khoảng 3,5–6 ngày làm việc.** Có thể chia thành 5 PR/commit review độc lập theo các đợt trên; không cần chuyển framework hoặc viết lại toàn bộ website.

## 6. Checklist nghiệm thu cuối

- [ ] 7 unit test hiện có vẫn đạt; thêm test regression cho từng lỗi logic đã sửa.
- [ ] Production preview không có asset nội bộ 404, exception hoặc unhandled rejection.
- [ ] Desktop/mobile menu hoạt động đúng tại breakpoint; section active đồng bộ.
- [ ] Không tràn ngang ở 320/375/768/1024/1440px, VI/EN, light/dark; zoom 200% vẫn dùng được.
- [ ] Form có nhãn rõ; nhiều lỗi độc lập; lỗi/hủy không mất nội dung; không có PII trên URL submit.
- [ ] Không thông báo “đã gửi” nếu mới chỉ mở mail client.
- [ ] Đổi ngôn ngữ không xóa cấu trúc DOM, không đổi nhãn menu sang sai chức năng.
- [ ] Bàn phím truy cập được controls; menu/tabs/filter công bố đúng trạng thái.
- [ ] Contrast được đo ở hai theme; xử lý findings axe và kiểm tra tay.
- [ ] Reduced motion dừng animation JS không cần thiết; không còn controller trùng.
- [ ] Chặn main bundle hoặc tắt JS vẫn đọc được nội dung hồ sơ và email liên hệ.
- [ ] CI dùng lockfile, chặn test fail và không deploy khi smoke test lỗi.
- [ ] Link public trỏ đúng nội dung; không còn favicon placeholder; dist không chứa test pages ngoài yêu cầu.

## 7. Giới hạn của lần review

- Kiểm tra browser ở Chromium local và production preview; chưa kiểm tra Firefox, Safari hay thiết bị thật.
- Chưa truy cập bản GitHub Pages đang chạy; không coi khác biệt hostname/base path trên preview là bằng chứng website live có cùng lỗi JSON. Bốn module thiếu được xác nhận ngay trong artifact build.
- Không gửi email thật, không thay cấu hình dịch vụ và không triển khai lên production.
- Không chạy `fix:rollup`/`test:build` vì các script này xóa hoặc cài lại dependency; đã chạy trực tiếp unit/build với dependency hiện có.
- Chưa chạy Lighthouse/axe đầy đủ, chưa kiểm tra screen reader thực tế, chưa làm security audit dependency hoặc kiểm thử tải. Không suy diễn điểm hiệu năng/điểm accessibility.
- Chưa đọc sâu mọi module legacy, service worker/PWA và các trang test thủ công; các kết luận chủ yếu dựa trên đường chạy hiện tại. Không quy lỗi runtime hiện tại cho module không được tải.
- Chưa xác minh nội dung nghề nghiệp, số liệu thành tích và quyền chia sẻ dự án; cần chủ website xác nhận khi hoàn thiện nội dung.

**Thứ tự ưu tiên cuối cùng:** sửa 01–03 trước; tiếp theo 04–06; hoàn thiện 07–12 và đưa quality gates vào CI; dọn nội dung/legacy sau khi đã có bằng chứng hành vi ổn định.
