# 🚀 Performance Monitoring Guide

## Overview
Comprehensive performance monitoring system with Lighthouse CI, real-time browser monitoring, and automated reporting.

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
npm install --save-dev @lhci/cli lighthouse chrome-launcher
```

### 2. GitHub Actions Setup (Automatic CI)
The workflow is already configured in `.github/workflows/lighthouse.yml`. It will:
- ✅ Run automatically on every push/PR to master
- ✅ Run daily performance audits
- ✅ Comment results on PRs
- ✅ Upload detailed reports

### 3. Local Performance Testing

#### Quick Performance Check
```bash
npm run lighthouse
```

#### Full Performance Suite (3 runs + average)
```bash
npm run performance
```

#### Mobile Performance Test
```bash
npm run performance:mobile
```

#### Generate Report & Open
```bash
npm run performance:report
```

## 📊 Available Commands

### Local Commands
| Command | Description |
|---------|-------------|
| `npm run lighthouse` | Single Lighthouse audit |
| `npm run lighthouse:ci` | Lighthouse CI (requires server) |
| `npm run performance` | Build + Preview + 3x Lighthouse |
| `npm run performance:mobile` | Mobile-specific performance test |
| `npm run performance:report` | Generate & open report |

### Manual Scripts
```bash
# Custom URL audit
node scripts/performance-monitor.js http://localhost:4173

# Multiple iterations
node scripts/performance-monitor.js http://localhost:4173 5

# Mobile audit
node scripts/performance-monitor.js http://localhost:4173 3 mobile
```

## 🎯 Performance Thresholds

### Lighthouse Scores (0-100)
- ✅ **Performance**: ≥ 85
- ✅ **Accessibility**: ≥ 90
- ✅ **Best Practices**: ≥ 85
- ✅ **SEO**: ≥ 90

### Core Web Vitals
- ✅ **First Contentful Paint (FCP)**: ≤ 2.0s
- ✅ **Largest Contentful Paint (LCP)**: ≤ 4.0s
- ✅ **Cumulative Layout Shift (CLS)**: ≤ 0.1
- ✅ **First Input Delay (FID)**: ≤ 100ms
- ✅ **Time to Interactive (TTI)**: ≤ 5.0s

## 📈 Real-time Browser Monitor

### Activation
The browser performance monitor automatically loads in development:
- 🔥 **Auto-enabled** on `localhost`
- ⌨️ **Keyboard shortcut**: `Ctrl+Shift+P` (show dashboard)
- 🔧 **Console commands**: `perf.report()`, `perf.dashboard()`

### Features
- ✨ **Real-time metrics** (FCP, LCP, CLS, FID, TTI)
- 💾 **Memory usage** tracking
- 📊 **Performance budget** monitoring
- 📱 **Network condition** detection
- 📋 **Export reports** to JSON

### Console Commands
```javascript
// Generate performance report
perf.report()

// Show floating dashboard
perf.dashboard()

// Get current metrics
perf.metrics()

// Export report as JSON file
perf.export()
```

## 🎛️ Configuration

### Lighthouse CI (`lighthouserc.json`)
```json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "startServerCommand": "npm run preview",
      "url": ["http://localhost:4173/"]
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.85}],
        "categories:accessibility": ["error", {"minScore": 0.90}],
        "first-contentful-paint": ["warn", {"maxNumericValue": 2000}],
        "largest-contentful-paint": ["error", {"maxNumericValue": 4000}]
      }
    }
  }
}
```

### Custom Thresholds
Edit `scripts/performance-monitor.js`:
```javascript
this.thresholds = {
  performance: 85,     // Lighthouse score
  accessibility: 90,   // Lighthouse score
  bestPractices: 85,   // Lighthouse score
  seo: 90,            // Lighthouse score
  fcp: 2000,          // ms
  lcp: 4000,          // ms
  cls: 0.1,           // score
  fid: 100,           // ms
  tti: 5000           // ms
};
```

## 📋 Report Interpretation

### Lighthouse Scores
| Score | Status | Description |
|-------|--------|-------------|
| 90-100 | 🟢 Excellent | No action needed |
| 50-89 | 🟡 Needs improvement | Optimization recommended |
| 0-49 | 🔴 Poor | Immediate action required |

### Core Web Vitals Status
- 🟢 **Good**: Meets recommended thresholds
- 🟡 **Needs Improvement**: Close to threshold
- 🔴 **Poor**: Exceeds threshold significantly

### Common Optimizations
Based on audit results, you might see:

#### Performance
- 🖼️ **Image optimization**: WebP, compression, lazy loading
- 📦 **Bundle size**: Code splitting, tree shaking
- 🔄 **Render blocking**: Critical CSS, async scripts
- 💾 **Caching**: Service worker, CDN optimization

#### Accessibility
- 🏷️ **Labels**: Form inputs, buttons
- 🎨 **Color contrast**: Text readability
- ⌨️ **Keyboard navigation**: Focus management
- 📱 **Screen readers**: ARIA attributes

## 🚀 CI/CD Integration

### GitHub Actions Workflow
Automatically runs on:
- ✅ Push to `master` branch
- ✅ Pull requests
- ✅ Daily scheduled runs (2 AM UTC)

### PR Comments
Automatic performance comments show:
- 📊 Lighthouse scores with status indicators
- ⚡ Core Web Vitals metrics
- 🔗 Link to detailed reports
- 📈 Performance trend comparison

### Failure Conditions
The CI will fail if:
- ❌ Performance score < 85
- ❌ Accessibility score < 90
- ❌ LCP > 4000ms
- ❌ CLS > 0.1

## 📊 Monitoring Dashboard

### Real-time Metrics
- 🎯 **Core Web Vitals**: Live FCP, LCP, CLS, FID
- 💾 **Memory Usage**: Heap size and limits
- 🔄 **Network**: Connection type and speed
- ⚡ **Performance Budget**: Pass/fail status

### Export Options
- 📄 **JSON Report**: Detailed metrics export
- 📈 **CSV Data**: For spreadsheet analysis
- 📊 **Visual Charts**: Performance trends

## 🔧 Troubleshooting

### Common Issues

#### "Chrome not found"
```bash
# Install Chrome/Chromium
sudo apt-get install google-chrome-stable  # Linux
brew install --cask google-chrome          # macOS
```

#### "Server not responding"
```bash
# Ensure preview server is running
npm run build
npm run preview
# In another terminal:
npm run lighthouse
```

#### "Permission denied"
```bash
# Fix script permissions
chmod +x scripts/performance-monitor.js
```

### Debug Mode
Enable detailed logging:
```bash
DEBUG=lhci:* npm run lighthouse:ci
```

## 📈 Performance Optimization Workflow

1. **🔍 Audit**: Run `npm run performance`
2. **📊 Analyze**: Review generated reports
3. **🛠️ Optimize**: Address top opportunities
4. **✅ Verify**: Re-run audits to confirm improvements
5. **🚀 Deploy**: Push changes with automated CI checks

## 🎯 Performance Goals

### Target Metrics (Portfolio Website)
- ⚡ **FCP**: < 1.5s
- 🖼️ **LCP**: < 2.5s
- 📐 **CLS**: < 0.05
- 👆 **FID**: < 50ms
- 🎯 **Overall Score**: > 95

### Optimization Priorities
1. 🖼️ **Images**: WebP, lazy loading, responsive
2. 📦 **JavaScript**: Code splitting, tree shaking
3. 🎨 **CSS**: Critical CSS, unused styles
4. 🔄 **Caching**: Service worker, browser cache
5. 📱 **Mobile**: Touch targets, viewport

---

## 🚀 Quick Start Checklist

- [ ] Install dependencies: `npm install`
- [ ] Run first audit: `npm run performance`
- [ ] Check real-time monitor: `Ctrl+Shift+P` in browser
- [ ] Review reports in `performance-reports/` folder
- [ ] Set up GitHub Actions (already configured)
- [ ] Configure thresholds in `lighthouserc.json`
- [ ] Add performance budget to CI/CD pipeline

**Ready to monitor your portfolio's performance!** 🎉