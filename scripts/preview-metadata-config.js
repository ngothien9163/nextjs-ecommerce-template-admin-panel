#!/usr/bin/env node

// Preview metadata configuration script
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const config = {};
  
  content.split('\n').forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#') && line.includes('=')) {
      const [key, ...value] = line.split('=');
      config[key.trim()] = value.join('=').replace(/^["']|["']$/g, '');
    }
  });
  
  return config;
}

function previewConfig(envFile) {
  log('cyan', `\n📋 Preview Metadata Configuration: ${envFile}`);
  log('cyan', '='.repeat(60));
  
  const config = loadEnvFile(envFile);
  
  if (!config) {
    log('red', `❌ File not found: ${envFile}`);
    return;
  }
  
  // Company Information
  log('green', '\n🏢 Company Information:');
  console.log(`   Company: ${config.VITE_METADATA_COMPANY_NAME || 'Not set'}`);
  console.log(`   Brand: ${config.VITE_METADATA_BRAND_NAME || 'Not set'}`);
  console.log(`   Address: ${config.VITE_METADATA_COMPANY_ADDRESS || 'Not set'}`);
  console.log(`   Website: ${config.VITE_METADATA_CONTACT_WEBSITE || 'Not set'}`);
  console.log(`   Email: ${config.VITE_METADATA_CONTACT_EMAIL || 'Not set'}`);
  console.log(`   Phone: ${config.VITE_METADATA_CONTACT_PHONE || 'Not set'}`);
  
  // Copyright & Legal
  log('green', '\n📄 Copyright & Legal:');
  console.log(`   Copyright: ${config.VITE_METADATA_DEFAULT_COPYRIGHT || 'Not set'}`);
  console.log(`   License: ${config.VITE_METADATA_DEFAULT_LICENSE || 'Not set'}`);
  console.log(`   Rights: ${config.VITE_METADATA_RIGHTS_STATEMENT || 'Not set'}`);
  console.log(`   Usage Terms: ${config.VITE_METADATA_USAGE_TERMS || 'Not set'}`);
  
  // Technical Settings
  log('green', '\n⚙️ Technical Settings:');
  console.log(`   Quality: ${config.VITE_METADATA_DEFAULT_QUALITY || '85'}%`);
  console.log(`   DPI: ${config.VITE_METADATA_DEFAULT_DENSITY || '300'}`);
  console.log(`   Color Space: ${config.VITE_METADATA_COLOR_SPACE || 'sRGB'}`);
  console.log(`   Software: ${config.VITE_METADATA_DEFAULT_SOFTWARE || 'Not set'}`);
  
  // SEO Settings
  log('green', '\n🔍 SEO Settings:');
  console.log(`   Site Name: ${config.VITE_METADATA_SITE_NAME || 'Not set'}`);
  console.log(`   Site URL: ${config.VITE_METADATA_SITE_URL || 'Not set'}`);
  console.log(`   Keywords: ${config.VITE_METADATA_DEFAULT_KEYWORDS || 'Not set'}`);
}

function main() {
  log('blue', '🎯 Metadata Configuration Preview Tool');
  log('blue', '===================================');
  
  const environments = [
    '.env.staging.example', 
    '.env.development.example'
  ];
  
  const specificEnv = process.argv[2];
  
  if (specificEnv) {
    previewConfig(specificEnv);
  } else {
    environments.forEach(env => {
      if (fs.existsSync(env)) {
        previewConfig(env);
      }
    });
  }
  
  log('cyan', '\n💡 Usage Examples:');
  console.log('   npm run preview:metadata');
  console.log('   node scripts/preview-metadata-config.js .env.staging.example');
  console.log('   npm run deploy:company-a');
  console.log('   npm run deploy:production');
}

main();