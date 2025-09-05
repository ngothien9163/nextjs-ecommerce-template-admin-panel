#!/usr/bin/env node

// Debug metadata configuration for development
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkEnvFile() {
  log('cyan', '\n🔍 Checking Environment Configuration for Development...');
  log('cyan', '='.repeat(60));
  
  const envFiles = ['.env.local', '.env', '.env.development'];
  let foundEnv = false;
  
  envFiles.forEach(file => {
    if (fs.existsSync(file)) {
      log('green', `✅ Found: ${file}`);
      foundEnv = true;
    } else {
      log('yellow', `⚠️  Missing: ${file}`);
    }
  });
  
  if (!foundEnv) {
    log('red', '\n❌ No environment file found!');
    log('yellow', '💡 Quick setup:');
    console.log('   1. Create .env.local file');
    console.log('   2. Add Supabase credentials (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)');
    console.log('   3. Metadata is now managed in src/config/metadata-constants.ts');
    return false;
  }
  
  return true;
}

function showDevMetadata() {
  log('cyan', '\n📋 Development Metadata Preview:');
  log('cyan', '='.repeat(40));
  
  // Simulate what would be loaded in development
  const devDefaults = {
    copyright: 'Local Development',
    creator: 'Developer', 
    software: 'Dev Media Processor',
    license: 'Development License',
    contact: 'dev@localhost',
    website: 'http://localhost:5173',
    companyName: 'Local Development',
    brandName: 'Dev Brand',
    quality: '75',
    density: '72',
    siteUrl: 'http://localhost:5173',
    siteName: 'Local Dev Site',
    keywords: 'development,local,testing'
  };
  
  log('green', '\n🏗️  Default Development Settings:');
  Object.entries(devDefaults).forEach(([key, value]) => {
    console.log(`   ${key}: ${value}`);
  });
  
  log('yellow', '\n💡 To customize metadata:');
  console.log('   1. Edit src/config/metadata-constants.ts');
  console.log('   2. Update UNIFIED_METADATA with company info');
  console.log('   3. No environment variables needed!');
  console.log('   4. Restart development server');
}

function main() {
  log('blue', '🛠️  Development Metadata Debug Tool');
  log('blue', '==================================');
  
  const hasEnv = checkEnvFile();
  showDevMetadata();
  
  if (hasEnv) {
    log('green', '\n🚀 Ready to start development server!');
    log('cyan', 'Run: npm run dev');
  } else {
    log('red', '\n⚠️  Setup required before starting development');
  }
  
  log('cyan', '\n📖 Available commands:');
  console.log('   npm run dev           - Start development server');
  console.log('   npm run dev:debug     - Debug metadata + start server');
  console.log('   npm run preview:metadata - Preview all configurations');
}

main();