# 🧪 Tests Directory

Thư mục này chứa tất cả các file test cho dự án.

## 📋 **Test Files:**

### **Animation Tests:**
- `animation-test.html` - Test comprehensive animation system
- `feature-check.html` - Real-time feature status monitoring
- `working-version.html` - Minimal working demo

### **Debug Tests:**
- `debug-loading.html` - Loading screen debugging
- `debug-test.html` - General debugging interface
- `module-test.html` - Module loading tests

### **Component Tests:**
- `architecture-test.html` - UI architecture testing
- `color-demo.html` - Color system demonstration
- `image-test.html` - Image loading tests
- `language-test.html` - Multi-language functionality
- `pwa-test.html` - Progressive Web App features

### **Quick Tests:**
- `quick-test.html` - Fast functionality checks
- `quick-test.js` - JavaScript utility tests
- `test.html` - General testing page

## 🚀 **Cách sử dụng:**

### **Development Testing:**
```bash
# Start dev server
npm run dev

# Access test pages
http://localhost:5173/tests/animation-test.html
http://localhost:5173/tests/feature-check.html
# ... etc
```

### **Production Testing:**
```bash
# Build project
npm run build

# Serve from dist
npx serve dist

# Access test pages
http://localhost:3000/tests/animation-test.html
```

## 📝 **Test Guidelines:**

1. **Tất cả file test mới** phải được tạo trong thư mục `tests/`
2. **Naming convention**: `[feature]-test.html` hoặc `[component]-demo.html`
3. **Include dependencies**: Ensure proper imports and styling
4. **Documentation**: Add comments explaining test purpose

## 🎯 **Test Categories:**

- **Unit Tests**: Individual component testing
- **Integration Tests**: Feature interaction testing  
- **Visual Tests**: UI/UX and animation testing
- **Performance Tests**: Loading and optimization testing
- **Cross-browser Tests**: Compatibility testing

---

**📍 Ghi chú**: Thư mục này được tổ chức để dễ dàng quản lý và maintain các test cases.