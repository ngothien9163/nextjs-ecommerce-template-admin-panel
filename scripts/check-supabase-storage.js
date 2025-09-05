import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://gyexgtobqvonkmyesqkl.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5ZXhndG9icXZvbmtteWVzcWtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMDY4MjYsImV4cCI6MjA3MTc4MjgyNn0.tS8-b_e5qL73ViCxrcYoih7yhvLkeXGRKcrCbPkFSa4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSupabaseStorage() {
  console.log('🔍 Checking Supabase Storage configuration...');
  
  try {
    // 1. Kiểm tra kết nối
    console.log('📡 Testing connection...');
    const { data: testData, error: testError } = await supabase
      .from('medias')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Database connection failed:', testError);
      return;
    }
    console.log('✅ Database connection successful');

    // 2. Kiểm tra bucket 'media'
    console.log('🪣 Checking media bucket...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Failed to list buckets:', bucketsError);
      return;
    }

    const mediaBucket = buckets.find(bucket => bucket.name === 'medias');
    
    if (!mediaBucket) {
      console.log('⚠️  Media bucket not found. Creating...');
      
      const { data: newBucket, error: createError } = await supabase.storage.createBucket('medias', {
        public: true,
        fileSizeLimit: 52428800, // 50MB
        allowedMimeTypes: ['image/*', 'video/*', 'application/pdf']
      });
      
      if (createError) {
        console.error('❌ Failed to create media bucket:', createError);
        return;
      }
      
      console.log('✅ Media bucket created successfully');
    } else {
      console.log('✅ Media bucket exists');
      console.log('   - Public:', mediaBucket.public);
      console.log('   - File size limit:', mediaBucket.fileSizeLimit);
    }

    // 3. Kiểm tra RLS policies
    console.log('🔒 Checking RLS policies...');
    
    // Test upload một file hình ảnh thay vì text
    const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('medias')
      .upload('test/test.jpg', testFile);
    
    if (uploadError) {
      console.error('❌ Upload test failed:', uploadError);
      console.log('💡 This might be due to missing RLS policies');
      console.log('📖 Please check SUPABASE_STORAGE_SETUP.md for setup instructions');
    } else {
      console.log('✅ Upload test successful');
      
      // Clean up test file
      await supabase.storage
        .from('medias')
        .remove(['test/test.jpg']);
      console.log('🧹 Test file cleaned up');
    }

    // 4. Kiểm tra bảng media
    console.log('📊 Checking media table...');
    const { count: mediaCount, error: mediaError } = await supabase
      .from('medias')
      .select('*', { count: 'exact', head: true });
    
    if (mediaError) {
      console.error('❌ Media table check failed:', mediaError);
    } else {
      console.log(`✅ Media table accessible (${mediaCount} records)`);
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Chạy kiểm tra
checkSupabaseStorage();
