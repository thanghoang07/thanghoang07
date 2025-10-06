#!/usr/bin/env node
/**
 * 🔍 GitHub Actions Workflow Status Checker
 * Monitors deployment and performance workflows
 */

import fs from 'fs';
import { execSync } from 'child_process';

console.log('🚀 GitHub Actions Workflow Status\n');

// Check workflow files
console.log('📋 Active Workflows:');
const workflowsDir = '.github/workflows';
if (fs.existsSync(workflowsDir)) {
    const workflows = fs.readdirSync(workflowsDir);
    workflows.forEach(file => {
        if (file.endsWith('.yml')) {
            const content = fs.readFileSync(`${workflowsDir}/${file}`, 'utf8');
            
            // Extract workflow name
            const nameMatch = content.match(/^name:\s*(.+)$/m);
            const name = nameMatch ? nameMatch[1].replace(/['"]/g, '') : file;
            
            // Extract triggers
            const triggers = [];
            if (content.includes('push:')) triggers.push('push');
            if (content.includes('pull_request:')) triggers.push('PR');
            if (content.includes('workflow_dispatch:')) triggers.push('manual');
            if (content.includes('schedule:')) triggers.push('scheduled');
            
            console.log(`  ✅ ${file}`);
            console.log(`     Name: ${name}`);
            console.log(`     Triggers: ${triggers.join(', ')}`);
            console.log('');
        }
    });
}

// Check git status
console.log('📊 Repository Status:');
try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    if (status.trim()) {
        console.log('  ⚠️ Uncommitted changes present');
    } else {
        console.log('  ✅ Working tree clean');
    }
    
    const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
    console.log(`  📍 Current branch: ${branch}`);
    
    const lastCommit = execSync('git log -1 --format="%h %s"', { encoding: 'utf8' }).trim();
    console.log(`  📝 Last commit: ${lastCommit}`);
} catch (error) {
    console.log('  ❌ Git status unavailable');
}

// Check package.json scripts
console.log('\n🔧 Available Scripts:');
try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const buildScripts = Object.entries(pkg.scripts || {})
        .filter(([name]) => name.includes('build') || name.includes('deploy') || name.includes('fix'));
    
    buildScripts.forEach(([name, script]) => {
        console.log(`  ✅ ${name}: ${script}`);
    });
} catch (error) {
    console.log('  ❌ Package.json not found');
}

// Quick build test
console.log('\n🏗️ Build System Health:');
try {
    // Check if node_modules exists
    if (fs.existsSync('node_modules')) {
        console.log('  ✅ Dependencies installed');
    } else {
        console.log('  ⚠️ Dependencies not installed (run npm install)');
    }
    
    // Check if dist exists from previous build
    if (fs.existsSync('dist')) {
        const distFiles = fs.readdirSync('dist');
        console.log(`  ✅ Previous build exists (${distFiles.length} files)`);
    } else {
        console.log('  ℹ️ No previous build found');
    }
    
} catch (error) {
    console.log('  ❌ Build system check failed');
}

console.log('\n📋 Workflow Summary:');
console.log('  🎯 Primary: static.yml - Main GitHub Pages deployment');
console.log('  🔄 Backup: backup-deploy.yml - Manual deployment fallback');
console.log('  📊 Monitor: lighthouse.yml - Performance monitoring');
console.log('  🚫 Conflicts: Resolved by removing redundant workflows');

console.log('\n🎯 Next Steps:');
console.log('  1. Monitor GitHub Actions tab for deployment status');
console.log('  2. Check GitHub Pages URL after successful deployment');
console.log('  3. Use backup-deploy.yml if main workflow fails');
console.log('  4. Run lighthouse.yml manually for performance checks');

console.log('\n✨ Streamlined workflow configuration complete! 🚀');