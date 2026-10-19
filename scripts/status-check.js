#!/usr/bin/env node
/**
 * Portfolio Deployment Status Checker
 */

import fs from 'node:fs';

console.log('Portfolio Deployment Status Check\n');

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
console.log('Package:', pkg.name, pkg.version);
console.log('Scripts:', {
  build: Boolean(pkg.scripts?.build),
  unit: Boolean(pkg.scripts?.['test:unit']),
  smoke: Boolean(pkg.scripts?.['test:smoke']),
  lighthouse: Boolean(pkg.scripts?.['lighthouse:ci']),
});

const criticalFiles = [
  'index.html',
  'package.json',
  'vite.config.js',
  'tailwind.config.js',
  'src/main.js',
  'src/style.css',
  'src/design-system.css',
  'src/styles/portfolio.css',
];

criticalFiles.forEach(file => {
  console.log(`  ${fs.existsSync(file) ? 'OK' : 'MISSING'}: ${file}`);
});