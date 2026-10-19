#!/usr/bin/env node
/**
 * GitHub Actions Workflow Status Checker
 * Monitors deployment and performance workflows
 */

import fs from 'node:fs';
import { execSync } from 'node:child_process';

console.log('GitHub Actions Workflow Status\n');

const workflowsDir = '.github/workflows';
if (fs.existsSync(workflowsDir)) {
  const workflows = fs.readdirSync(workflowsDir);
  workflows.forEach(file => {
    if (file.endsWith('.yml')) {
      const content = fs.readFileSync(`${workflowsDir}/${file}`, 'utf8');
      const nameMatch = content.match(/^name:\s*(.+)$/m);
      const name = nameMatch ? nameMatch[1].replace(/['"]/g, '') : file;
      const triggers = [];
      if (content.includes('push:')) triggers.push('push');
      if (content.includes('pull_request:')) triggers.push('PR');
      if (content.includes('workflow_dispatch:')) triggers.push('manual');
      if (content.includes('schedule:')) triggers.push('scheduled');

      console.log(`  - ${file}: ${name} (${triggers.join(', ')})`);
    }
  });
}

try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log('\nAvailable CI & Verification Scripts:');
  ['test:unit', 'test:smoke', 'test:build', 'ci:test', 'lighthouse:ci'].forEach(name => {
    if (pkg.scripts?.[name]) {
      console.log(`  - ${name}: ${pkg.scripts[name]}`);
    }
  });
} catch {
  console.log('Package.json not readable');
}

try {
  const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
  console.log(`\nCurrent branch: ${branch}`);
} catch {
  // Ignore when git is unavailable
}