# 🔧 CI/CD Troubleshooting Guide

## 🚨 Common Issues & Solutions

### 1. Rollup Dependencies Error
**Error**: `Cannot find module @rollup/rollup-linux-x64-gnu`

**Cause**: npm ci sometimes fails to install optional dependencies correctly

**Solutions**:
```bash
# Method 1: Use fix script
npm run fix:rollup
npm run build

# Method 2: Manual fix
rm -rf node_modules package-lock.json
npm install --no-optional
npm install rollup @rollup/rollup-linux-x64-gnu --save-dev

# Method 3: Use alternative workflow
# Trigger "Deploy Pages (Alternative)" workflow manually
```

### 2. Build Process Issues

**Quick Diagnostics**:
```bash
# Check Node.js version
node --version  # Should be 18+ or 20+

# Check npm version  
npm --version   # Should be 9+ or 10+

# Verify dependencies
npm list --depth=0

# Test local build
npm run ci:build
```

### 3. GitHub Actions Failures

**Workflow Files**:
- `static.yml` - Main deployment (uses npm ci)
- `deploy-alt.yml` - Alternative (uses npm install)
- `lighthouse.yml` - Performance monitoring

**Debugging Steps**:
1. Check workflow logs for specific error
2. Try alternative deployment workflow
3. Use manual workflow dispatch
4. Check GitHub Pages settings

### 4. Local Development Issues

```bash
# Full reset
rm -rf node_modules package-lock.json dist
npm install
npm run build

# Test build environment
docker build -t portfolio-test .
docker run --rm portfolio-test

# Performance test
npm run test:build
```

## 📋 Environment Requirements

### Node.js Versions
- **Recommended**: Node.js 20.x
- **Minimum**: Node.js 18.x
- **NPM**: 9.x or 10.x

### Dependencies Status
- ✅ Vite 5.4+
- ✅ Rollup 4.x (auto-installed with Vite)
- ✅ TailwindCSS 3.3+
- ✅ Lighthouse CI 0.12+

## 🛠️ Manual Fixes

### If CI Keeps Failing:
1. **Use Alternative Workflow**:
   - Go to Actions tab
   - Click "Deploy Pages (Alternative)"
   - Click "Run workflow"

2. **Local Build & Deploy**:
   ```bash
   npm run build
   npm run deploy
   ```

3. **Force Dependency Refresh**:
   ```bash
   # In GitHub repository settings
   # Delete package-lock.json
   # Let CI regenerate it
   ```

## 🚀 Quick Commands

```bash
# Fix and build
npm run ci:build

# Test everything
npm run test:build

# Performance check
npm run performance

# Manual deploy
npm run build && npm run deploy
```

## 📞 Support

If issues persist:
1. Check [GitHub Actions logs](../../actions)
2. Compare with working commits
3. Use alternative deployment method
4. Check Node.js/npm versions

**Last Updated**: October 2025