#!/usr/bin/env node

/**
 * Fix Rollup Dependencies Script
 * Resolves common Rollup optional dependencies issues in CI environments
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔧 Fixing Rollup dependencies...\n');

try {
  // 1. Check current environment
  console.log('📋 Environment Info:');
  console.log(`Node: ${process.version}`);
  console.log(`Platform: ${process.platform}`);
  console.log(`Arch: ${process.arch}`);

  // 2. Clean npm cache
  console.log('\n🧹 Cleaning npm cache...');
  try {
    execSync('npm cache clean --force', { stdio: 'inherit' });
  } catch (e) {
    console.log('Cache clean failed, continuing...');
  }

  // 3. Remove problematic files
  console.log('\n🗑️  Removing problematic files...');
  const filesToRemove = ['package-lock.json', 'node_modules'];
  filesToRemove.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`Removing ${file}...`);
      if (file === 'node_modules') {
        execSync(`rm -rf ${file}`, { stdio: 'inherit' });
      } else {
        fs.unlinkSync(file);
      }
    }
  });

  // 4. Install dependencies with specific flags
  console.log('\n📦 Installing dependencies...');
  const installCmd = [
    'npm install',
    '--prefer-offline',
    '--no-audit',
    '--no-fund',
    '--progress=false',
    '--loglevel=error'
  ].join(' ');
  
  execSync(installCmd, { stdio: 'inherit' });

  // 5. Verify Rollup installation
  console.log('\n✅ Verifying Rollup installation...');
  try {
    execSync('npx rollup --version', { stdio: 'inherit' });
  } catch (e) {
    console.log('⚠️  Rollup not found, installing explicitly...');
    execSync('npm install rollup @rollup/rollup-linux-x64-gnu --save-dev', { stdio: 'inherit' });
  }

  // 6. Test Vite
  console.log('\n🔍 Testing Vite...');
  try {
    execSync('npx vite --version', { stdio: 'inherit' });
  } catch (e) {
    console.log('⚠️  Vite issue detected, reinstalling...');
    execSync('npm install vite --save-dev', { stdio: 'inherit' });
  }

  // 7. List dependencies
  console.log('\n📋 Final dependency check:');
  execSync('npm list --depth=0 | grep -E "(rollup|vite)"', { stdio: 'inherit' });

  console.log('\n✅ Rollup dependencies fixed successfully!');
  console.log('🚀 Ready to build...\n');

} catch (error) {
  console.error('\n❌ Failed to fix Rollup dependencies:');
  console.error(error.message);
  
  console.log('\n💡 Fallback suggestions:');
  console.log('1. Try: npm install --force');
  console.log('2. Use Node.js 20+');
  console.log('3. Clear all caches: npm cache clean --force');
  
  process.exit(1);
}