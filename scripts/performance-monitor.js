/**
 * Local Performance Monitor with Lighthouse (ESM)
 */

import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export class PerformanceMonitor {
  constructor(options = {}) {
    this.options = {
      port: 4173,
      hostname: '127.0.0.1',
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
          uploadThroughputKbps: 0,
        },
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false,
        },
      },
      ...options,
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
      tti: 5000,
    };
  }

  async runAudit(url) {
    console.log(`Starting Lighthouse audit for: ${url}`);

    const chrome = await chromeLauncher.launch({
      chromeFlags: this.options.chromeFlags,
    });

    try {
      const runnerResult = await lighthouse(url, {
        ...this.options.lighthouseFlags,
        port: chrome.port,
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

    const scores = {
      performance: Math.round(categories.performance.score * 100),
      accessibility: Math.round(categories.accessibility.score * 100),
      bestPractices: Math.round(categories['best-practices'].score * 100),
      seo: Math.round(categories.seo.score * 100),
    };

    const metrics = {
      fcp: audits['first-contentful-paint']?.numericValue || 0,
      lcp: audits['largest-contentful-paint']?.numericValue || 0,
      cls: audits['cumulative-layout-shift']?.numericValue || 0,
      fid: audits['max-potential-fid']?.numericValue || 0,
      tti: audits.interactive?.numericValue || 0,
      speedIndex: audits['speed-index']?.numericValue || 0,
      tbt: audits['total-blocking-time']?.numericValue || 0,
    };

    return {
      url: lhr.finalUrl,
      timestamp: new Date().toISOString(),
      scores,
      metrics,
      passed: this.checkThresholds({ ...scores, ...metrics }),
    };
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
      tti: metrics.tti <= this.thresholds.tti,
    };
  }

  async saveReport(report, runnerResult) {
    if (!fs.existsSync(this.options.outputPath)) {
      fs.mkdirSync(this.options.outputPath, { recursive: true });
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const htmlPath = path.join(this.options.outputPath, `lighthouse-${timestamp}.html`);
    const jsonPath = path.join(this.options.outputPath, `summary-${timestamp}.json`);
    fs.writeFileSync(htmlPath, runnerResult.report);
    fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
  }

  displayResults(report) {
    Object.entries(report.scores).forEach(([category, score]) => {
      const status = report.passed[category] ? 'PASS' : 'FAIL';
      console.log(`  ${category.padEnd(15)}: ${score}% (${status})`);
    });
  }

  async runMultipleAudits(urls, iterations = 1) {
    for (const url of urls) {
      for (let i = 0; i < iterations; i++) {
        await this.runAudit(url);
      }
    }
  }

  generateCIReport() {
    if (this.results.length === 0) return null;
    const latest = this.results[this.results.length - 1];
    const ciReportPath = path.join(this.options.outputPath, 'ci-report.json');
    const ciReport = {
      timestamp: latest.timestamp,
      url: latest.url,
      scores: latest.scores,
      metrics: latest.metrics,
      passed: latest.passed,
    };
    fs.writeFileSync(ciReportPath, JSON.stringify(ciReport, null, 2));
    return ciReport;
  }
}

export default PerformanceMonitor;

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const mode = process.argv[4] === 'mobile' ? 'mobile' : 'desktop';
  const monitor = new PerformanceMonitor(
    mode === 'mobile'
      ? {
          lighthouseFlags: {
            logLevel: 'info',
            output: 'html',
            onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
          },
        }
      : {}
  );
  const url = process.argv[2] || 'http://127.0.0.1:4173/thanghoang07/';
  const iterations = parseInt(process.argv[3], 10) || 1;

  monitor
    .runMultipleAudits([url], iterations)
    .then(() => {
      monitor.generateCIReport();
      process.exit(0);
    })
    .catch(error => {
      console.error('Error running performance audit:', error);
      process.exit(1);
    });
}