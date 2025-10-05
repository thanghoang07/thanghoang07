#!/usr/bin/env node

/**
 * Test Build Script
 * Kiểm tra build process trước khi deploy
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔨 Testing build process...\n');

try {
  // 1. Check dependencies
  console.log('📦 Checking dependencies...');
  if (!fs.existsSync('package.json')) {
    throw new Error('package.json not found');
  }
  
  if (!fs.existsSync('package-lock.json')) {
    console.log('⚠️  package-lock.json not found, creating...');
    execSync('npm install', { stdio: 'inherit' });
  }

  // 2. Install dependencies
  console.log('\n📥 Installing dependencies...');
  execSync('npm ci', { stdio: 'inherit' });

  // 3. Run build
  console.log('\n🏗️  Building project...');
  execSync('npm run build', { stdio: 'inherit' });

  // 4. Check build output
  console.log('\n✅ Checking build output...');
  if (!fs.existsSync('dist')) {
    throw new Error('Build output (dist/) not found');
  }

  const distFiles = fs.readdirSync('dist');
  console.log(`📁 Build output contains ${distFiles.length} files/folders:`);
  distFiles.forEach(file => {
    console.log(`   - ${file}`);
  });

  // 5. Validate HTML
  const indexPath = path.join('dist', 'index.html');
  if (fs.existsSync(indexPath)) {
    const htmlContent = fs.readFileSync(indexPath, 'utf8');
    if (htmlContent.includes('<title>') && htmlContent.includes('<body>')) {
      console.log('✅ HTML structure looks good');
    } else {
      console.log('⚠️  HTML structure might be incomplete');
    }
  }

  // 6. Check assets
  const assetsPath = path.join('dist', 'assets');
  if (fs.existsSync(assetsPath)) {
    const assets = fs.readdirSync(assetsPath);
    console.log(`📄 Found ${assets.length} asset files`);
  }

  console.log('\n🎉 Build test completed successfully!');
  console.log('✅ Ready for deployment\n');

} catch (error) {
  console.error('\n❌ Build test failed:');
  console.error(error.message);
  console.error('\n💡 Please fix the issues above before deploying\n');
  process.exit(1);
}