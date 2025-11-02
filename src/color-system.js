/**
 * 🎨 Unified Color System
 * Complete color management with demo and customization tools
 */

/**
 * Color Palettes - Định nghĩa tất cả màu sắc của dự án
 */
export const colorPalettes = {
  // Primary Brand Colors (Màu chủ đạo)
  primary: {
    50: '#faf5ff',   // Purple 50 - Very light purple
    100: '#f3e8ff',  // Purple 100 - Light purple backgrounds
    200: '#e9d5ff',  // Purple 200
    300: '#d8b4fe',  // Purple 300
    400: '#c084fc',  // Purple 400 - Light accents
    500: '#a855f7',  // Purple 500 - Secondary primary
    600: '#9333ea',  // Purple 600 - Main primary color
    700: '#7c3aed',  // Purple 700 - Darker primary
    800: '#6b21a8',  // Purple 800
    900: '#581c87',  // Purple 900 - Very dark purple
  },

  // Secondary Colors (Màu phụ)
  secondary: {
    50: '#f8fafc',   // Slate 50
    100: '#f1f5f9',  // Slate 100
    200: '#e2e8f0',  // Slate 200
    300: '#cbd5e1',  // Slate 300
    400: '#94a3b8',  // Slate 400
    500: '#64748b',  // Slate 500
    600: '#475569',  // Slate 600
    700: '#334155',  // Slate 700
    800: '#1e293b',  // Slate 800 - Dark theme primary
    900: '#0f172a',  // Slate 900
  },

  // Status Colors (Màu trạng thái)
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    900: '#14532d',
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    900: '#78350f',
  },

  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    900: '#7f1d1d',
  },

  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    900: '#1e3a8a',
  },

  // Neutral Colors (Màu trung tính)
  neutral: {
    white: '#ffffff',
    black: '#000000',
    transparent: 'transparent',
    current: 'currentColor',
  },

  // Gradient Colors (Màu gradient)
  gradients: {
    primary: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
    secondary: 'linear-gradient(90deg, #9333ea, #a855f7)',
    success: 'linear-gradient(135deg, #10b981, #059669)',
    error: 'linear-gradient(135deg, #ef4444, #dc2626)',
    info: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    rainbow: 'linear-gradient(90deg, #9333ea, #7c3aed, #a855f7, #c084fc, #e879f9)',
  },

  // Animation Colors (Màu cho animation)
  animation: {
    floatingShapes: ['#9333ea', '#7c3aed', '#a855f7', '#c084fc', '#e879f9'],
    ripple: 'rgba(255, 255, 255, 0.3)',
    progressBar: 'linear-gradient(90deg, #9333ea, #a855f7)',
    scrollProgress: {
      background: 'linear-gradient(90deg, #9333ea, #a855f7)',
      shadow: 'rgba(147, 51, 234, 0.3)',
    },
    floatingOverlay: {
      gradient1: 'rgba(147, 51, 234, 0.03)',
      gradient2: 'rgba(124, 58, 237, 0.02)', 
      gradient3: 'rgba(168, 85, 247, 0.02)',
    },
  }
};

/**
 * Theme-specific Color Mappings
 */
export const themeColors = {
  light: {
    background: colorPalettes.neutral.white,
    surface: colorPalettes.secondary[50],
    text: {
      primary: colorPalettes.secondary[900],
      secondary: colorPalettes.secondary[600],
      muted: colorPalettes.secondary[400],
    },
    border: colorPalettes.secondary[200],
    accent: colorPalettes.primary[600],
    metaTheme: colorPalettes.primary[600],
  },
  dark: {
    background: colorPalettes.secondary[900],
    surface: colorPalettes.secondary[800],
    text: {
      primary: colorPalettes.secondary[50],
      secondary: colorPalettes.secondary[300],
      muted: colorPalettes.secondary[400],
    },
    border: colorPalettes.secondary[700],
    accent: colorPalettes.primary[400],
    metaTheme: colorPalettes.secondary[800],
  }
};

/**
 * Preset Color Themes (Các theme màu có sẵn)
 */
export const presetThemes = {
  default: {
    name: 'Purple Dreams',
    primary: colorPalettes.primary[600],
    secondary: colorPalettes.primary[500],
    accent: colorPalettes.primary[400],
  },
  ocean: {
    name: 'Ocean Blue',
    primary: '#0ea5e9', // Sky 500
    secondary: '#0284c7', // Sky 600
    accent: '#7dd3fc', // Sky 300
  },
  forest: {
    name: 'Forest Green',
    primary: '#059669', // Emerald 600
    secondary: '#047857', // Emerald 700
    accent: '#6ee7b7', // Emerald 300
  },
  sunset: {
    name: 'Sunset Orange',
    primary: '#ea580c', // Orange 600
    secondary: '#c2410c', // Orange 700
    accent: '#fdba74', // Orange 300
  },
  rose: {
    name: 'Rose Pink',
    primary: '#e11d48', // Rose 600
    secondary: '#be185d', // Rose 700
    accent: '#fda4af', // Rose 300
  }
};

/**
 * Color System Manager Class
 */
export class ColorSystem {
  constructor() {
    this.currentPalette = 'primary';
    this.customColors = new Map();
  }

  /**
   * Get color by palette and shade
   * @param {string} palette - Color palette name (e.g., 'primary', 'secondary')
   * @param {string|number} shade - Color shade (e.g., '500', 600)
   * @returns {string} Color value
   */
  getColor(palette, shade = 600) {
    if (colorPalettes[palette] && colorPalettes[palette][shade]) {
      return colorPalettes[palette][shade];
    }
    console.warn(`Color not found: ${palette}.${shade}`);
    return colorPalettes.primary[600]; // fallback
  }

  /**
   * Get gradient color
   * @param {string} type - Gradient type
   * @returns {string} Gradient CSS value
   */
  getGradient(type = 'primary') {
    return colorPalettes.gradients[type] || colorPalettes.gradients.primary;
  }

  /**
   * Get theme-specific color
   * @param {string} theme - Theme name ('light' or 'dark')
   * @param {string} colorKey - Color key (e.g., 'background', 'text.primary')
   * @returns {string} Color value
   */
  getThemeColor(theme, colorKey) {
    const keys = colorKey.split('.');
    let color = themeColors[theme];
    
    for (const key of keys) {
      if (color && typeof color === 'object' && color[key]) {
        color = color[key];
      } else {
        console.warn(`Theme color not found: ${theme}.${colorKey}`);
        return themeColors.light.accent; // fallback
      }
    }
    
    return color;
  }

  /**
   * Get random color from animation palette
   * @returns {string} Random color
   */
  getRandomAnimationColor() {
    const colors = colorPalettes.animation.floatingShapes;
    return colors[Math.floor(Math.random() * colors.length)];
  }

  /**
   * Generate color variations
   * @param {string} baseColor - Base color hex
   * @param {number} steps - Number of variations
   * @returns {Array} Array of color variations
   */
  generateColorVariations(baseColor, steps = 5) {
    const variations = [];
    const { r, g, b } = this.hexToRgb(baseColor);
    
    for (let i = 0; i < steps; i++) {
      const factor = 0.2 + (i * 0.2);
      const newR = Math.round(r + (255 - r) * factor);
      const newG = Math.round(g + (255 - g) * factor);
      const newB = Math.round(b + (255 - b) * factor);
      variations.push(this.rgbToHex(newR, newG, newB));
    }
    
    return variations;
  }

  /**
   * Convert hex to RGB
   * @param {string} hex - Hex color
   * @returns {Object} RGB values
   */
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  /**
   * Convert RGB to hex
   * @param {number} r - Red value
   * @param {number} g - Green value
   * @param {number} b - Blue value
   * @returns {string} Hex color
   */
  rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  /**
   * Add custom color
   * @param {string} name - Color name
   * @param {string} value - Color value
   */
  addCustomColor(name, value) {
    this.customColors.set(name, value);
  }

  /**
   * Get custom color
   * @param {string} name - Color name
   * @returns {string} Color value
   */
  getCustomColor(name) {
    return this.customColors.get(name);
  }

  /**
   * Apply CSS custom properties for colors
   */
  applyCSSCustomProperties() {
    const root = document.documentElement;
    
    // Apply primary colors
    Object.entries(colorPalettes.primary).forEach(([key, value]) => {
      root.style.setProperty(`--color-primary-${key}`, value);
    });

    // Apply secondary colors
    Object.entries(colorPalettes.secondary).forEach(([key, value]) => {
      root.style.setProperty(`--color-secondary-${key}`, value);
    });

    // Apply status colors
    ['success', 'warning', 'error', 'info'].forEach(status => {
      Object.entries(colorPalettes[status]).forEach(([key, value]) => {
        root.style.setProperty(`--color-${status}-${key}`, value);
      });
    });

    // Apply gradients
    Object.entries(colorPalettes.gradients).forEach(([key, value]) => {
      root.style.setProperty(`--gradient-${key}`, value);
    });

    console.log('✅ CSS custom properties applied for color system');
  }

  /**
   * Switch color palette (for future customization)
   * @param {string} paletteName - New palette name
   */
  switchPalette(paletteName) {
    if (colorPalettes[paletteName]) {
      this.currentPalette = paletteName;
      this.applyCSSCustomProperties();
      console.log(`🎨 Switched to ${paletteName} palette`);
    } else {
      console.warn(`Palette ${paletteName} not found`);
    }
  }

  /**
   * Get color info for debugging
   * @returns {Object} Color system info
   */
  getColorInfo() {
    return {
      currentPalette: this.currentPalette,
      availablePalettes: Object.keys(colorPalettes),
      customColors: Array.from(this.customColors.entries()),
      totalColors: Object.keys(colorPalettes).reduce((total, key) => {
        return total + (typeof colorPalettes[key] === 'object' ? Object.keys(colorPalettes[key]).length : 1);
      }, 0)
    };
  }

  // === DEMO & CUSTOMIZATION METHODS ===

  /**
   * Show color demo in console
   */
  showColorDemo() {
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
    
    return this.getColorInfo();
  }

  /**
   * Change main colors of website
   * @param {string} newPrimaryColor - New primary color (hex)
   * @param {string} newSecondaryColor - New secondary color (hex, optional)
   */
  changeMainColors(newPrimaryColor, newSecondaryColor = null) {
    console.log(`🎨 Changing main colors to: ${newPrimaryColor}`);
    
    // Apply new colors
    document.documentElement.style.setProperty('--color-primary-600', newPrimaryColor);
    if (newSecondaryColor) {
      document.documentElement.style.setProperty('--color-primary-500', newSecondaryColor);
    }
    
    // Update meta theme color
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', newPrimaryColor);
    }
    
    console.log('✅ Colors updated!');
    return { primary: newPrimaryColor, secondary: newSecondaryColor || newPrimaryColor };
  }

  /**
   * Apply preset theme
   * @param {string} themeName - Theme name from presetThemes
   */
  applyPresetTheme(themeName) {
    if (!presetThemes[themeName]) {
      console.error(`❌ Theme "${themeName}" not found. Available themes:`, Object.keys(presetThemes));
      return;
    }
    
    const theme = presetThemes[themeName];
    console.log(`🎨 Applying preset theme: ${theme.name}`);
    
    return this.changeMainColors(theme.primary, theme.secondary);
  }

  /**
   * Create custom palette from base color
   * @param {string} baseColor - Base color (hex)
   * @param {string} paletteName - New palette name
   */
  createCustomPalette(baseColor, paletteName = 'custom') {
    console.log(`🎨 Creating custom palette "${paletteName}" from ${baseColor}`);
    
    const variations = this.generateColorVariations(baseColor, 9);
    const newPalette = {};
    
    const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
    variations.forEach((color, index) => {
      newPalette[shades[index]] = color;
    });
    
    // Add to color system
    colorPalettes[paletteName] = newPalette;
    
    console.log(`✅ Created palette "${paletteName}":`, newPalette);
    return newPalette;
  }

  /**
   * Create custom gradient
   * @param {string} color1 - First color
   * @param {string} color2 - Second color
   * @param {number} angle - Gradient angle (degrees)
   */
  createCustomGradient(color1, color2, angle = 135) {
    const gradient = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
    console.log(`🌈 Created custom gradient: ${gradient}`);
    
    // Add to system
    colorPalettes.gradients.custom = gradient;
    
    return gradient;
  }

  /**
   * Test current colors with visual preview
   */
  testCurrentColors() {
    const testDiv = document.createElement('div');
    testDiv.innerHTML = `
      <div style="position: fixed; top: 20px; left: 20px; z-index: 10000; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); max-width: 300px;">
        <h3 style="margin: 0 0 15px 0; color: ${this.getColor('primary', 600)};">🎨 Current Colors</h3>
        
        <div style="margin-bottom: 10px;">
          <strong>Primary:</strong>
          <div style="width: 100%; height: 30px; background: ${this.getColor('primary', 600)}; border-radius: 5px; margin-top: 5px;"></div>
          <small>${this.getColor('primary', 600)}</small>
        </div>
        
        <div style="margin-bottom: 10px;">
          <strong>Secondary:</strong>
          <div style="width: 100%; height: 30px; background: ${this.getColor('primary', 500)}; border-radius: 5px; margin-top: 5px;"></div>
          <small>${this.getColor('primary', 500)}</small>
        </div>
        
        <div style="margin-bottom: 10px;">
          <strong>Gradient:</strong>
          <div style="width: 100%; height: 30px; background: ${this.getGradient('primary')}; border-radius: 5px; margin-top: 5px;"></div>
        </div>
        
        <button onclick="this.parentElement.remove()" style="background: ${this.getColor('error', 500)}; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; margin-top: 10px;">Close</button>
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
   * Export color configuration
   */
  exportColorConfig() {
    const config = {
      timestamp: new Date().toISOString(),
      palettes: colorPalettes,
      customColors: Array.from(this.customColors.entries()),
      currentPalette: this.currentPalette,
      cssProperties: {}
    };
    
    console.log('📋 Color configuration exported:', config);
    
    // Copy to clipboard if available
    if (navigator.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(config, null, 2))
        .then(() => console.log('✅ Configuration copied to clipboard!'))
        .catch(() => console.log('ℹ️ Could not copy to clipboard'));
    }
    
    return config;
  }
}

// Create and export singleton instance
export const colorSystem = new ColorSystem();

// Apply CSS custom properties on module load
colorSystem.applyCSSCustomProperties();

// Export utility functions
export const getColor = (palette, shade) => colorSystem.getColor(palette, shade);
export const getGradient = (type) => colorSystem.getGradient(type);
export const getThemeColor = (theme, colorKey) => colorSystem.getThemeColor(theme, colorKey);
export const getRandomAnimationColor = () => colorSystem.getRandomAnimationColor();

/**
 * Quick color change presets
 */
export const quickPresets = {
  blue: () => colorSystem.changeMainColors('#3b82f6', '#2563eb'),
  green: () => colorSystem.changeMainColors('#059669', '#047857'),
  orange: () => colorSystem.changeMainColors('#ea580c', '#c2410c'),
  pink: () => colorSystem.changeMainColors('#e11d48', '#be185d'),
  purple: () => colorSystem.changeMainColors('#9333ea', '#7c3aed'),
  red: () => colorSystem.changeMainColors('#dc2626', '#b91c1c'),
  yellow: () => colorSystem.changeMainColors('#eab308', '#ca8a04'),
  cyan: () => colorSystem.changeMainColors('#0891b2', '#0e7490'),
};

// Export demo interface
export const colorDemo = {
  show: () => colorSystem.showColorDemo(),
  change: (primary, secondary) => colorSystem.changeMainColors(primary, secondary),
  preset: (themeName) => colorSystem.applyPresetTheme(themeName),
  create: (baseColor, name) => colorSystem.createCustomPalette(baseColor, name),
  gradient: (color1, color2, angle) => colorSystem.createCustomGradient(color1, color2, angle),
  test: () => colorSystem.testCurrentColors(),
  export: () => colorSystem.exportColorConfig(),
  quick: quickPresets,
  
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

// Export for debugging in development
if (typeof window !== 'undefined') {
  window.colorSystem = colorSystem;
  window.colorDemo = colorDemo;
  window.colorPalettes = colorPalettes;
  
  if (process.env.NODE_ENV === 'development') {
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
}