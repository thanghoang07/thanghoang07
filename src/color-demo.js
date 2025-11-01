/**
 * 🎨 Color System Demo & Customization Helper
 * File này giúp bạn test và thay đổi màu sắc của dự án dễ dàng
 */

import { colorSystem, colorPalettes, presetThemes, getColor, getGradient } from './colors.js';

/**
 * Color System Demo - Hiển thị tất cả màu sắc có sẵn
 */
export function showColorDemo() {
  console.log('🎨 Color System Demo');
  console.log('===================');
  
  // Hiển thị màu chính
  console.log('\n📍 Primary Colors:');
  Object.entries(colorPalettes.primary).forEach(([shade, color]) => {
    console.log(`  ${shade}: ${color}`);
  });
  
  // Hiển thị gradients
  console.log('\n🌈 Gradients:');
  Object.entries(colorPalettes.gradients).forEach(([name, gradient]) => {
    console.log(`  ${name}: ${gradient}`);
  });
  
  // Hiển thị preset themes
  console.log('\n🎭 Preset Themes:');
  Object.entries(presetThemes).forEach(([key, theme]) => {
    console.log(`  ${key}: ${theme.name} - ${theme.primary}`);
  });
  
  return colorSystem.getColorInfo();
}

/**
 * Thay đổi màu chính của website
 * @param {string} newPrimaryColor - Màu chính mới (hex)
 * @param {string} newSecondaryColor - Màu phụ mới (hex, optional)
 */
export function changeMainColors(newPrimaryColor, newSecondaryColor = null) {
  console.log(`🎨 Changing main colors to: ${newPrimaryColor}`);
  
  // Tạo custom theme
  const customTheme = {
    name: 'Custom Theme',
    primary: newPrimaryColor,
    secondary: newSecondaryColor || newPrimaryColor,
    accent: colorSystem.generateColorVariations(newPrimaryColor, 1)[0]
  };
  
  // Áp dụng màu mới
  document.documentElement.style.setProperty('--color-primary-600', newPrimaryColor);
  if (newSecondaryColor) {
    document.documentElement.style.setProperty('--color-primary-500', newSecondaryColor);
  }
  
  // Cập nhật meta theme color
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', newPrimaryColor);
  }
  
  console.log('✅ Colors updated! Refresh page to see changes.');
  return customTheme;
}

/**
 * Áp dụng preset theme
 * @param {string} themeName - Tên theme từ presetThemes
 */
export function applyPresetTheme(themeName) {
  if (!presetThemes[themeName]) {
    console.error(`❌ Theme "${themeName}" not found. Available themes:`, Object.keys(presetThemes));
    return;
  }
  
  const theme = presetThemes[themeName];
  console.log(`🎨 Applying preset theme: ${theme.name}`);
  
  return changeMainColors(theme.primary, theme.secondary);
}

/**
 * Tạo color palette mới từ một màu base
 * @param {string} baseColor - Màu cơ sở (hex)
 * @param {string} paletteName - Tên palette mới
 */
export function createCustomPalette(baseColor, paletteName = 'custom') {
  console.log(`🎨 Creating custom palette "${paletteName}" from ${baseColor}`);
  
  const variations = colorSystem.generateColorVariations(baseColor, 9);
  const newPalette = {};
  
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  variations.forEach((color, index) => {
    newPalette[shades[index]] = color;
  });
  
  // Thêm vào color system
  colorPalettes[paletteName] = newPalette;
  
  console.log(`✅ Created palette "${paletteName}":`, newPalette);
  return newPalette;
}

/**
 * Tạo gradient tùy chỉnh
 * @param {string} color1 - Màu thứ nhất
 * @param {string} color2 - Màu thứ hai
 * @param {number} angle - Góc gradient (độ)
 */
export function createCustomGradient(color1, color2, angle = 135) {
  const gradient = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
  console.log(`🌈 Created custom gradient: ${gradient}`);
  
  // Thêm vào system
  colorPalettes.gradients.custom = gradient;
  
  return gradient;
}

/**
 * Test màu sắc hiện tại
 */
export function testCurrentColors() {
  const testDiv = document.createElement('div');
  testDiv.innerHTML = `
    <div style="position: fixed; top: 20px; left: 20px; z-index: 10000; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); max-width: 300px;">
      <h3 style="margin: 0 0 15px 0; color: ${getColor('primary', 600)};">🎨 Current Colors</h3>
      
      <div style="margin-bottom: 10px;">
        <strong>Primary:</strong>
        <div style="width: 100%; height: 30px; background: ${getColor('primary', 600)}; border-radius: 5px; margin-top: 5px;"></div>
        <small>${getColor('primary', 600)}</small>
      </div>
      
      <div style="margin-bottom: 10px;">
        <strong>Secondary:</strong>
        <div style="width: 100%; height: 30px; background: ${getColor('primary', 500)}; border-radius: 5px; margin-top: 5px;"></div>
        <small>${getColor('primary', 500)}</small>
      </div>
      
      <div style="margin-bottom: 10px;">
        <strong>Gradient:</strong>
        <div style="width: 100%; height: 30px; background: ${getGradient('primary')}; border-radius: 5px; margin-top: 5px;"></div>
      </div>
      
      <button onclick="this.parentElement.remove()" style="background: ${getColor('error', 500)}; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; margin-top: 10px;">Close</button>
    </div>
  `;
  
  document.body.appendChild(testDiv);
  
  // Auto remove after 10 seconds
  setTimeout(() => {
    if (testDiv.parentElement) {
      testDiv.remove();
    }
  }, 10000);
}

/**
 * Xuất cấu hình màu hiện tại để lưu lại
 */
export function exportColorConfig() {
  const config = {
    timestamp: new Date().toISOString(),
    palettes: colorPalettes,
    customColors: Array.from(colorSystem.customColors.entries()),
    currentPalette: colorSystem.currentPalette,
    cssProperties: {}
  };
  
  // Lấy CSS custom properties hiện tại
  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);
  
  // Lấy tất cả CSS variables bắt đầu với --color
  Array.from(document.styleSheets).forEach(sheet => {
    try {
      Array.from(sheet.cssRules).forEach(rule => {
        if (rule.style) {
          for (let i = 0; i < rule.style.length; i++) {
            const prop = rule.style[i];
            if (prop.startsWith('--color')) {
              config.cssProperties[prop] = rule.style.getPropertyValue(prop);
            }
          }
        }
      });
    } catch (e) {
      // Cross-origin stylesheet, skip
    }
  });
  
  console.log('📋 Color configuration exported:', config);
  
  // Copy to clipboard if available
  if (navigator.clipboard) {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2))
      .then(() => console.log('✅ Configuration copied to clipboard!'))
      .catch(() => console.log('ℹ️ Could not copy to clipboard'));
  }
  
  return config;
}

/**
 * Quick color change presets (Các preset thay đổi nhanh)
 */
export const quickPresets = {
  // Màu xanh dương
  blue: () => changeMainColors('#3b82f6', '#2563eb'),
  
  // Màu xanh lá
  green: () => changeMainColors('#059669', '#047857'),
  
  // Màu cam
  orange: () => changeMainColors('#ea580c', '#c2410c'),
  
  // Màu hồng
  pink: () => changeMainColors('#e11d48', '#be185d'),
  
  // Màu tím (original)
  purple: () => changeMainColors('#9333ea', '#7c3aed'),
  
  // Màu đỏ
  red: () => changeMainColors('#dc2626', '#b91c1c'),
  
  // Màu vàng
  yellow: () => changeMainColors('#eab308', '#ca8a04'),
  
  // Màu cyan
  cyan: () => changeMainColors('#0891b2', '#0e7490'),
};

// Export all functions for easy access
export const colorDemo = {
  show: showColorDemo,
  change: changeMainColors,
  preset: applyPresetTheme,
  create: createCustomPalette,
  gradient: createCustomGradient,
  test: testCurrentColors,
  export: exportColorConfig,
  quick: quickPresets,
  
  // Helper: Hiển thị tất cả preset themes
  showPresets() {
    console.log('🎭 Available Preset Themes:');
    Object.entries(presetThemes).forEach(([key, theme]) => {
      console.log(`  colorDemo.preset('${key}') - ${theme.name}`);
    });
    
    console.log('\n⚡ Quick Presets:');
    Object.keys(quickPresets).forEach(key => {
      console.log(`  colorDemo.quick.${key}() - ${key.charAt(0).toUpperCase() + key.slice(1)} theme`);
    });
  }
};

// Auto-export to window for easy browser console access
if (typeof window !== 'undefined') {
  window.colorDemo = colorDemo;
  window.colorSystem = colorSystem;
  
  console.log(`
🎨 Color System loaded successfully!

Try these commands in browser console:
┌─────────────────────────────────────────────┐
│  colorDemo.show()           - Show all colors │
│  colorDemo.test()           - Test current colors │
│  colorDemo.showPresets()    - Show all presets │
│  colorDemo.quick.blue()     - Quick blue theme │
│  colorDemo.quick.green()    - Quick green theme │
│  colorDemo.preset('ocean')  - Apply ocean theme │
│  colorDemo.change('#ff6b6b') - Custom color │
└─────────────────────────────────────────────┘
  `);
}