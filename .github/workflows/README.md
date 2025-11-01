# 🚀 GitHub Actions Workflows

**Optimized CI/CD pipeline for portfolio deployment and monitoring.**

## 📋 Active Workflows

This directory has been **streamlined** from 4 workflows to **2 essential workflows**:

### 1. 🎯 **Primary Deployment** (`static.yml`)
**Status**: ✅ **ACTIVE** - Main deployment workflow

**Triggers**:
- ✅ Automatic on push to `master` branch
- ✅ Manual dispatch available

**Features**:
- 🔧 **Rollup Dependencies Fix** - Automated fix for build issues
- ⚡ **Optimized Build Process** - NODE_ENV=production
- 🚀 **GitHub Pages Native Deployment** - Uses official actions
- ⏱️ **Concurrency Management** - Prevents deployment conflicts
- 🔄 **Retry Logic** - 10 minutes timeout with retries

**Why Keep**: Primary deployment method, battle-tested, includes critical fixes.

### 2. 📊 **Performance Monitoring** (`lighthouse.yml`)
**Status**: ✅ **ACTIVE** - Performance monitoring and PR feedback

**Triggers**:
- ✅ Pull requests to master
- ✅ Daily scheduled runs (2 AM UTC)
- ✅ Manual dispatch available

**Features**:
- 🔍 **Lighthouse CI Integration** - Automated performance audits
- 📈 **Core Web Vitals Tracking** - FCP, LCP, CLS monitoring
- 💬 **PR Comments** - Automatic performance reports on PRs
- 📊 **Performance Trends** - Historical performance data
- 🏆 **Performance Budgets** - Fail builds if thresholds exceeded

**Why Keep**: Essential for performance monitoring and maintaining quality.

## 🗑️ Removed Workflows

### ❌ **Removed**: `deploy-github-pages.yml`
**Reason**: Redundant with `static.yml`
- Duplicate deployment functionality
- Missing Rollup dependencies fix
- Unnecessary PR deployments
- **No unique value over static.yml**

### ❌ **Removed**: `backup-deploy.yml`  
**Reason**: Manual-only with limited functionality
- Only manual trigger
- No advanced features
- **static.yml** already has manual dispatch option
- **No backup value provided**

## 🔄 Workflow Execution Flow

### 📈 **Normal Development Flow**:
1. **Developer pushes to master** → `static.yml` deploys automatically
2. **Developer creates PR** → `lighthouse.yml` runs performance audit
3. **Daily at 2 AM UTC** → `lighthouse.yml` runs performance monitoring

### 🚨 **Emergency/Manual Flow**:
1. **Manual deployment needed** → Use `static.yml` manual dispatch
2. **Performance check needed** → Use `lighthouse.yml` manual dispatch

## ⚡ **Performance Benefits**

### Build Optimization
- ✅ **Faster Builds**: Rollup fix prevents dependency issues
- ✅ **Reliable Deployments**: Concurrency management prevents conflicts
- ✅ **Error Recovery**: Retry logic handles temporary failures

### Monitoring Benefits  
- ✅ **Quality Gates**: Performance thresholds prevent regressions
- ✅ **Visibility**: PR comments show performance impact
- ✅ **Historical Data**: Track performance over time

## 🛠️ Configuration

### Static Deployment Settings
```yaml
# Permissions needed for GitHub Pages
permissions:
  contents: read
  pages: write  
  id-token: write

# Concurrency to prevent conflicts
concurrency:
  group: "pages-deployment"
  cancel-in-progress: true
```

### Lighthouse Performance Thresholds
```yaml
# Performance budgets (configured in lighthouserc.json)
Performance: ≥ 85
Accessibility: ≥ 90  
Best Practices: ≥ 85
SEO: ≥ 90
```

## 🔍 Monitoring & Debugging

### Check Workflow Status
- **GitHub Actions Tab**: Monitor real-time execution
- **PR Comments**: View performance results automatically
- **Artifacts**: Download detailed Lighthouse reports

### Common Issues
- **Build Failures**: `static.yml` includes Rollup fix for dependencies
- **Performance Regressions**: `lighthouse.yml` will comment on PRs with alerts
- **Deployment Conflicts**: Concurrency management prevents simultaneous deploys

## 📊 Workflow Statistics

### Efficiency Improvements
- **🗂️ Workflows**: Reduced from 4 → 2 (50% reduction)
- **🔄 Redundancy**: Eliminated duplicate deployment workflows
- **🎯 Focus**: Streamlined to essential functions only
- **🛠️ Maintenance**: Single deployment workflow to maintain

### Current Status
- ✅ **Deployment**: Fully automated with `static.yml`
- ✅ **Monitoring**: Continuous performance tracking with `lighthouse.yml`
- ✅ **Quality**: Performance budgets enforced
- ✅ **Reliability**: Concurrency management and retries

---

## 🎯 Quick Reference

### Manual Deployment
```bash
# Go to GitHub Actions tab
# Select "Deploy static content to Pages"
# Click "Run workflow"
```

### Manual Performance Check
```bash
# Go to GitHub Actions tab  
# Select "Performance Monitoring with Lighthouse CI"
# Click "Run workflow"
```

### Local Development
```bash
npm run build           # Test build locally
npm run preview         # Preview built site
npm run performance     # Local Lighthouse audit
```

---

**📍 Result**: From 4 redundant workflows → 2 optimized, essential workflows!

**🎯 Benefits**: Reduced complexity, eliminated redundancy, maintained full functionality! 🚀✨