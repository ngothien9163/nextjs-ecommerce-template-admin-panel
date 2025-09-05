// Quick config demo - check trong browser console
// Paste đoạn này vào browser console khi project đang chạy

import { 
  DEFAULT_METADATA, 
  PRODUCTION_METADATA, 
  getMetadataByEnvironment,
  getMetadataByTemplate 
} from './src/config/metadata-constants';

console.log('🎯 Testing New Simplified Config System');
console.log('=====================================');

// Test constants
console.log('\n📋 DEFAULT_METADATA:', DEFAULT_METADATA);
console.log('\n🏭 PRODUCTION_METADATA:', PRODUCTION_METADATA);

// Test auto environment detection  
console.log('\n🌐 Auto Environment Config:', getMetadataByEnvironment());

// Test templates
const templates = ['default', 'production', 'blog', 'hero', 'professional'];
templates.forEach(template => {
  console.log(`\n🎨 Template "${template}":`, getMetadataByTemplate(template));
});

console.log('\n✅ Config system ready! Now you can:');
console.log('   - Edit values in src/config/metadata-constants.ts'); 
console.log('   - No more env files confusion!');
console.log('   - Automatic dev/production switching');