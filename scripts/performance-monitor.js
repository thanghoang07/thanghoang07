/**
 * Local Performance Monitor with Lighthouse
 */

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

class PerformanceMonitor {
  constructor(options = {}) {
    this.options = {
      port: 4173,
      hostname: 'localhost',
      outputPath: './performance-reports',
      chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox'],
      lighthouseFlags: {
        logLevel: 'info',
        output: 'html',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        throttling: {
          rttMs: 40,
          throughputKbps: 10 * 1024,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0
        },
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false,
        },
        emulatedUserAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.109 Safari/537.36'
      },
      ...options
    };
    
    this.results = [];
    this.thresholds = {
      performance: 85,
      accessibility: 90,
      bestPractices: 85,
      seo: 90,
      fcp: 2000,
      lcp: 4000,
      cls: 0.1,
      fid: 100,
      tti: 5000
    };
  }

  async runAudit(url) {
    console.log(`🚀 Starting Lighthouse audit for: ${url}`);
    
    const chrome = await chromeLauncher.launch({
      chromeFlags: this.options.chromeFlags
    });

    try {
      const runnerResult = await lighthouse(url, {
        ...this.options.lighthouseFlags,
        port: chrome.port
      });

      const report = this.processResults(runnerResult);
      this.results.push(report);
      
      await this.saveReport(report, runnerResult);
      this.displayResults(report);
      
      return report;
    } finally {
      await chrome.kill();
    }
  }

  processResults(runnerResult) {
    const lhr = runnerResult.lhr;
    const categories = lhr.categories;
    const audits = lhr.audits;

    return {
      url: lhr.finalUrl,
      timestamp: new Date().toISOString(),
      scores: {
        performance: Math.round(categories.performance.score * 100),
        accessibility: Math.round(categories.accessibility.score * 100),
        bestPractices: Math.round(categories['best-practices'].score * 100),
        seo: Math.round(categories.seo.score * 100)
      },
      metrics: {
        fcp: audits['first-contentful-paint']?.numericValue || 0,
        lcp: audits['largest-contentful-paint']?.numericValue || 0,
        cls: audits['cumulative-layout-shift']?.numericValue || 0,
        fid: audits['max-potential-fid']?.numericValue || 0,
        tti: audits.interactive?.numericValue || 0,
        speedIndex: audits['speed-index']?.numericValue || 0,
        tbt: audits['total-blocking-time']?.numericValue || 0
      },
      opportunities: this.extractOpportunities(audits),
      diagnostics: this.extractDiagnostics(audits),
      passed: this.checkThresholds({
        performance: Math.round(categories.performance.score * 100),
        accessibility: Math.round(categories.accessibility.score * 100),
        bestPractices: Math.round(categories['best-practices'].score * 100),
        seo: Math.round(categories.seo.score * 100),
        fcp: audits['first-contentful-paint']?.numericValue || 0,
        lcp: audits['largest-contentful-paint']?.numericValue || 0,
        cls: audits['cumulative-layout-shift']?.numericValue || 0,
        tti: audits.interactive?.numericValue || 0
      })
    };
  }

  extractOpportunities(audits) {
    const opportunities = [];
    const opportunityAudits = [
      'render-blocking-resources',
      'unused-css-rules',
      'unused-javascript',
      'modern-image-formats',
      'uses-webp-images',
      'offscreen-images',
      'unminified-css',
      'unminified-javascript',
      'uses-text-compression',
      'uses-responsive-images',
      'efficient-animated-content',
      'duplicated-javascript',
      'legacy-javascript'
    ];

    opportunityAudits.forEach(auditId => {
      const audit = audits[auditId];
      if (audit && audit.details && audit.details.overallSavingsMs > 0) {
        opportunities.push({
          id: auditId,
          title: audit.title,
          description: audit.description,
          savings: Math.round(audit.details.overallSavingsMs),
          score: audit.score
        });
      }
    });

    return opportunities.sort((a, b) => b.savings - a.savings);
  }

  extractDiagnostics(audits) {
    const diagnostics = [];
    const diagnosticAudits = [
      'mainthread-work-breakdown',
      'bootup-time',
      'uses-long-cache-ttl',
      'total-byte-weight',
      'dom-size',
      'critical-request-chains',
      'user-timings',
      'screenshot-thumbnails',
      'final-screenshot',
      'largest-contentful-paint-element',
      'layout-shift-elements'
    ];

    diagnosticAudits.forEach(auditId => {
      const audit = audits[auditId];
      if (audit && (audit.score !== null || audit.numericValue)) {
        diagnostics.push({
          id: auditId,
          title: audit.title,
          description: audit.description,
          value: audit.displayValue || audit.numericValue,
          score: audit.score
        });
      }
    });

    return diagnostics;
  }

  checkThresholds(metrics) {
    return {
      performance: metrics.performance >= this.thresholds.performance,
      accessibility: metrics.accessibility >= this.thresholds.accessibility,
      bestPractices: metrics.bestPractices >= this.thresholds.bestPractices,
      seo: metrics.seo >= this.thresholds.seo,
      fcp: metrics.fcp <= this.thresholds.fcp,
      lcp: metrics.lcp <= this.thresholds.lcp,
      cls: metrics.cls <= this.thresholds.cls,
      tti: metrics.tti <= this.thresholds.tti
    };
  }

  async saveReport(report, runnerResult) {
    // Create output directory
    if (!fs.existsSync(this.options.outputPath)) {
      fs.mkdirSync(this.options.outputPath, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Save HTML report
    const htmlPath = path.join(this.options.outputPath, `lighthouse-${timestamp}.html`);
    fs.writeFileSync(htmlPath, runnerResult.report);
    
    // Save JSON summary
    const jsonPath = path.join(this.options.outputPath, `summary-${timestamp}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
    
    console.log(`📊 Reports saved:`);
    console.log(`   HTML: ${htmlPath}`);
    console.log(`   JSON: ${jsonPath}`);
  }

  displayResults(report) {
    console.log('\n🎯 Performance Results:');
    console.log('========================');
    
    // Scores
    console.log('\n📊 Lighthouse Scores:');
    Object.entries(report.scores).forEach(([category, score]) => {
      const emoji = score >= 90 ? '🟢' : score >= 50 ? '🟡' : '🔴';
      const status = report.passed[category] ? 'PASS' : 'FAIL';
      console.log(`   ${emoji} ${category.padEnd(15)}: ${score.toString().padStart(3)}% (${status})`);
    });
    
    // Core Web Vitals
    console.log('\n⚡ Core Web Vitals:');
    const vitals = [
      { key: 'fcp', name: 'First Contentful Paint', unit: 'ms', threshold: this.thresholds.fcp },
      { key: 'lcp', name: 'Largest Contentful Paint', unit: 'ms', threshold: this.thresholds.lcp },
      { key: 'cls', name: 'Cumulative Layout Shift', unit: '', threshold: this.thresholds.cls },
      { key: 'tti', name: 'Time to Interactive', unit: 'ms', threshold: this.thresholds.tti }
    ];
    
    vitals.forEach(({ key, name, unit, threshold }) => {
      const value = Math.round(report.metrics[key]);
      const passed = report.passed[key];
      const emoji = passed ? '🟢' : '🔴';
      const status = passed ? 'PASS' : 'FAIL';
      console.log(`   ${emoji} ${name.padEnd(25)}: ${value.toString().padStart(6)}${unit} (${status})`);
    });
    
    // Top opportunities
    if (report.opportunities.length > 0) {
      console.log('\n🚀 Top Optimization Opportunities:');
      report.opportunities.slice(0, 5).forEach((opp, index) => {
        console.log(`   ${index + 1}. ${opp.title}`);
        console.log(`      Potential savings: ${opp.savings}ms`);
      });
    }
    
    // Overall status
    const allPassed = Object.values(report.passed).every(p => p);
    const overallEmoji = allPassed ? '✅' : '❌';
    const overallStatus = allPassed ? 'ALL CHECKS PASSED' : 'SOME CHECKS FAILED';
    console.log(`\n${overallEmoji} Overall Status: ${overallStatus}\n`);
  }

  async runMultipleAudits(urls, iterations = 3) {
    console.log(`🔄 Running ${iterations} iterations for ${urls.length} URL(s)`);
    
    for (const url of urls) {
      console.log(`\n📝 Testing: ${url}`);
      const urlResults = [];
      
      for (let i = 0; i < iterations; i++) {
        console.log(`   Run ${i + 1}/${iterations}`);
        const result = await this.runAudit(url);
        urlResults.push(result);
        
        // Wait between runs
        if (i < iterations - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
      
      // Calculate averages
      const average = this.calculateAverages(urlResults);
      console.log('\n📈 Average Results:');
      this.displayResults(average);
    }
  }

  calculateAverages(results) {
    const avgScores = {};
    const avgMetrics = {};
    const avgPassed = {};
    
    // Calculate averages
    Object.keys(results[0].scores).forEach(key => {
      avgScores[key] = Math.round(
        results.reduce((sum, r) => sum + r.scores[key], 0) / results.length
      );
    });
    
    Object.keys(results[0].metrics).forEach(key => {
      avgMetrics[key] = Math.round(
        results.reduce((sum, r) => sum + r.metrics[key], 0) / results.length
      );
    });
    
    Object.keys(results[0].passed).forEach(key => {
      avgPassed[key] = results.every(r => r.passed[key]);
    });
    
    return {
      ...results[0],
      scores: avgScores,
      metrics: avgMetrics,
      passed: avgPassed,
      isAverage: true
    };
  }

  generateCIReport() {
    if (this.results.length === 0) {
      console.log('❌ No results to report');
      return;
    }
    
    const latest = this.results[this.results.length - 1];
    const ciReportPath = path.join(this.options.outputPath, 'ci-report.json');
    
    const ciReport = {
      timestamp: latest.timestamp,
      url: latest.url,
      scores: latest.scores,
      metrics: latest.metrics,
      passed: latest.passed,
      summary: {
        totalChecks: Object.keys(latest.passed).length,
        passedChecks: Object.values(latest.passed).filter(p => p).length,
        overallPassed: Object.values(latest.passed).every(p => p)
      }
    };
    
    fs.writeFileSync(ciReportPath, JSON.stringify(ciReport, null, 2));
    console.log(`📋 CI report saved: ${ciReportPath}`);
    
    return ciReport;
  }
}

module.exports = PerformanceMonitor;

// CLI usage
if (require.main === module) {
  const monitor = new PerformanceMonitor();
  const url = process.argv[2] || 'http://localhost:4173';
  const iterations = parseInt(process.argv[3]) || 1;
  
  monitor.runMultipleAudits([url], iterations)
    .then(() => {
      monitor.generateCIReport();
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Error running performance audit:', error);
      process.exit(1);
    });
}