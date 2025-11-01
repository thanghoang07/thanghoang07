# 🎨 Hướng dẫn sử dụng Color System

## 📋 Tổng quan
Hệ thống màu sắc đã được tối ưu và centralize, giúp bạn dễ dàng thay đổi màu sắc của toàn bộ website từ một nơi duy nhất.

## 🚀 Cách sử dụng nhanh

### 1. Mở trang demo
```bash
# Mở file color-demo.html trong browser
# Hoặc chạy dev server:
npm run dev
# Sau đó mở: http://localhost:5173/color-demo.html
```

### 2. Thay đổi màu sắc qua Browser Console
```javascript
// Hiển thị tất cả màu sắc có sẵn
colorDemo.show()

// Thay đổi màu chính
colorDemo.change('#3b82f6')  // Màu xanh dương

// Áp dụng preset theme
colorDemo.preset('ocean')    // Theme đại dương
colorDemo.preset('forest')   // Theme rừng xanh
colorDemo.preset('sunset')   // Theme hoàng hôn

// Quick presets
colorDemo.quick.blue()       // Xanh dương
colorDemo.quick.green()      // Xanh lá
colorDemo.quick.orange()     // Cam
colorDemo.quick.pink()       // Hồng
```

### 3. Thay đổi màu sắc trong code
```javascript
import { getColor, getGradient, colorSystem } from './src/colors.js';

// Lấy màu theo palette
const primaryColor = getColor('primary', 600);      // #9333ea
const successColor = getColor('success', 500);      // #10b981

// Lấy gradient
const primaryGradient = getGradient('primary');     // Linear gradient
const customGradient = getGradient('sunset');       // Sunset gradient

// Thay đổi màu chính của toàn bộ website
colorSystem.setPrimaryColor('#3b82f6');

// Tạo palette mới
colorSystem.createPalette('#ff6b6b', 'custom');
```

## 🎛️ Các file quan trọng

### `src/colors.js` - Hệ thống màu chính
- **ColorSystem class**: Quản lý toàn bộ màu sắc
- **Color palettes**: Primary, secondary, status colors
- **Gradients**: Các gradient đẹp sẵn có
- **Preset themes**: Ocean, forest, sunset, rose
- **Utility functions**: getColor(), getGradient(), etc.

### `src/color-demo.js` - Demo và customization
- **showColorDemo()**: Hiển thị tất cả màu sắc
- **changeMainColors()**: Thay đổi màu chính
- **applyPresetTheme()**: Áp dụng preset theme
- **createCustomPalette()**: Tạo palette mới
- **exportColorConfig()**: Xuất cấu hình để lưu lại

### `color-demo.html` - Trang demo trực quan
- Interface thân thiện để test màu sắc
- Preview trực tiếp khi thay đổi
- Export/import cấu hình màu
- Console output để debug

## 🎨 Color Palettes có sẵn

### Primary Colors
```javascript
primary: {
  50: '#faf5ff',   // Rất nhạt
  100: '#f3e8ff',
  200: '#e9d5ff',
  300: '#d8b4fe',
  400: '#c084fc',
  500: '#a855f7',  // Mặc định
  600: '#9333ea',  // Chính
  700: '#7c3aed',
  800: '#6b21a8',
  900: '#581c87'   // Đậm nhất
}
```

### Status Colors
```javascript
success: { 500: '#10b981' }  // Xanh lá - thành công
warning: { 500: '#f59e0b' }  // Vàng - cảnh báo  
error: { 500: '#ef4444' }    // Đỏ - lỗi
info: { 500: '#3b82f6' }     // Xanh dương - thông tin
```

### Gradients
```javascript
gradients: {
  primary: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
  secondary: 'linear-gradient(135deg, #a855f7 0%, #c084fc 100%)',
  success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  ocean: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  sunset: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)'
}
```

## 🌟 Preset Themes

### Default Theme (Purple)
```javascript
colorDemo.preset('default')
// hoặc
colorDemo.quick.purple()
```

### Ocean Theme (Blue)
```javascript
colorDemo.preset('ocean')
// Màu xanh dương đại dương với gradient đẹp
```

### Forest Theme (Green)
```javascript
colorDemo.preset('forest')  
// Màu xanh lá tươi mát như rừng xanh
```

### Sunset Theme (Orange/Pink)
```javascript
colorDemo.preset('sunset')
// Màu hoàng hôn với gradient cam hồng
```

### Rose Theme (Pink)
```javascript
colorDemo.preset('rose')
// Màu hồng rose đẹp mắt
```

## 🔧 Customization nâng cao

### Tạo theme mới
```javascript
// Tạo palette mới từ màu base
const myPalette = colorDemo.create('#ff6b6b', 'myTheme');

// Tạo gradient tùy chỉnh  
const myGradient = colorDemo.gradient('#ff6b6b', '#4ecdc4', 45);

// Áp dụng màu mới
colorDemo.change('#ff6b6b', '#4ecdc4');
```

### Export/Import cấu hình
```javascript
// Xuất cấu hình hiện tại
const config = colorDemo.export();

// Lưu vào localStorage
localStorage.setItem('myColorConfig', JSON.stringify(config));

// Load cấu hình đã lưu
const savedConfig = JSON.parse(localStorage.getItem('myColorConfig'));
```

### Sử dụng CSS Custom Properties
```css
/* Các biến CSS được tự động tạo */
:root {
  --color-primary-50: #faf5ff;
  --color-primary-600: #9333ea;
  --color-primary-700: #7c3aed;
  /* ... */
}

/* Sử dụng trong CSS */
.my-element {
  background: var(--color-primary-600);
  color: var(--color-primary-50);
  border: 2px solid var(--color-primary-700);
}
```

## 🚀 Integration với các module khác

Tất cả các module đã được cập nhật để sử dụng color system:

- ✅ `animation-effects.js` - Scroll effects, floating shapes
- ✅ `theme.js` - Theme switching  
- ✅ `contact-form.js` - Form styling
- ✅ `main.js` - App initialization

## 💡 Tips và Best Practices

1. **Luôn sử dụng getColor()** thay vì hard-code màu
2. **Test trên nhiều theme** để đảm bảo tương thích
3. **Sử dụng CSS custom properties** cho dynamic styling
4. **Export cấu hình** trước khi deploy production
5. **Kết hợp gradients** để tạo hiệu ứng đẹp

## 🐛 Troubleshooting

### Màu không thay đổi?
```javascript
// Force reload color system
location.reload();

// Hoặc check console errors
colorDemo.show();
```

### Muốn reset về mặc định?
```javascript
colorDemo.quick.purple();
// hoặc reload trang
```

### Gradient không hiển thị?
```javascript
// Check gradient syntax
console.log(getGradient('primary'));

// Tạo gradient mới
colorDemo.gradient('#color1', '#color2', 135);
```

---

💡 **Pro tip**: Mở Browser Console (F12) và gõ `colorDemo.showPresets()` để xem tất cả các preset có sẵn!

🎨 **Chúc bạn tạo ra những theme màu sắc tuyệt đẹp!**