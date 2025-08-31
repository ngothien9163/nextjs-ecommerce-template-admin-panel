import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://gyexgtobqvonkmyesqkl.supabase.co';
const serviceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey || serviceRoleKey === 'your_service_role_key_here') {
  console.error('❌ Service Role Key chưa được cấu hình!');
  console.log('📖 Hãy làm theo hướng dẫn trong SERVICE_ROLE_SETUP.md');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testServiceRole() {
  console.log('🔍 Testing Service Role Key...');
  
  try {
    // Test 1: Kiểm tra kết nối
    console.log('📡 Testing connection...');
    const { data: buckets, error: bucketsError } = await supabaseAdmin.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Connection failed:', bucketsError);
      return;
    }
    console.log('✅ Connection successful');
    
    // Test 2: Kiểm tra bucket media
    console.log('🪣 Checking media bucket...');
    const mediaBucket = buckets.find(bucket => bucket.name === 'media');
    
    if (!mediaBucket) {
      console.log('⚠️  Media bucket not found');
      console.log('📖 Hãy tạo bucket "media" trong Supabase Dashboard');
      return;
    }
    console.log('✅ Media bucket exists');
    
    // Test 3: Kiểm tra bảng media
    console.log('📊 Testing media table access...');
    const { data: mediaCount, error: mediaError } = await supabaseAdmin
      .from('media')
      .select('*', { count: 'exact', head: true });
    
    if (mediaError) {
      console.error('❌ Media table access failed:', mediaError);
      return;
    }
    console.log(`✅ Media table accessible (${mediaCount.length} records)`);
    
    // Test 4: Test upload
    console.log('📤 Testing upload...');
    const testFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('media')
      .upload('test/test.txt', testFile);
    
    if (uploadError) {
      console.error('❌ Upload test failed:', uploadError);
      return;
    }
    console.log('✅ Upload test successful');
    
    // Clean up test file
    await supabaseAdmin.storage
      .from('media')
      .remove(['test/test.txt']);
    console.log('🧹 Test file cleaned up');
    
    console.log('\n🎉 Service Role Key hoạt động tốt!');
    console.log('✅ Có thể sử dụng cho upload và tạo media');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testServiceRole();
