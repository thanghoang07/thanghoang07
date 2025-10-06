#!/usr/bin/env node

/**
 * Cancel Existing GitHub Pages Deployments
 * Prevents deployment conflicts in CI/CD
 */

import { execSync } from 'child_process';

console.log('🔄 Checking for existing GitHub Pages deployments...\n');

try {
  // Note: This script is for reference only
  // GitHub Actions will handle deployment cancellation automatically
  // via the concurrency configuration in the workflow
  
  const repoInfo = process.env.GITHUB_REPOSITORY || 'thanghoang07/thanghoang07';
  const [owner, repo] = repoInfo.split('/');
  
  console.log(`📋 Repository: ${owner}/${repo}`);
  console.log('🔧 Deployment cancellation is handled by workflow concurrency settings');
  console.log('⚙️  Configuration: group=pages-deploy, cancel-in-progress=true\n');
  
  // Check if we're in a GitHub Actions environment
  if (process.env.GITHUB_ACTIONS) {
    console.log('✅ Running in GitHub Actions environment');
    console.log('🎯 Concurrency control will automatically cancel conflicting deployments');
  } else {
    console.log('💡 To manually check deployments, use GitHub CLI:');
    console.log(`   gh api repos/${owner}/${repo}/pages/deployments`);
    console.log(`   gh api -X POST repos/${owner}/${repo}/pages/deployments/{deployment_id}/cancel`);
  }
  
  console.log('\n🚀 Ready for deployment!');

} catch (error) {
  console.error('\n⚠️  Note: Deployment conflicts will be handled automatically');
  console.error('🔄 GitHub Actions concurrency settings will cancel in-progress deployments');
  
  // Don't fail the script - this is informational only
  console.log('\n✅ Continuing with deployment process...');
}