import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testBlogPosts() {
  console.log('🔍 Testing blog_posts table...');
  
  try {
    // Test getList
    console.log('\n📋 Testing getList...');
    const { data: listData, error: listError, count } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .limit(5);
    
    if (listError) {
      console.error('❌ List error:', listError);
    } else {
      console.log('✅ List successful');
      console.log('📊 Count:', count);
      console.log('📊 Sample data:', listData?.slice(0, 2));
    }
    
    // Test getOne if we have data
    if (listData && listData.length > 0) {
      const firstPost = listData[0];
      console.log('\n📋 Testing getOne with ID:', firstPost.id);
      
      const { data: oneData, error: oneError } = await supabase
        .from('blog_posts')
        .select(`
          *,
          blog_categories (
            id,
            name,
            slug,
            is_active
          )
        `)
        .eq('id', firstPost.id)
        .single();
      
      if (oneError) {
        console.error('❌ GetOne error:', oneError);
      } else {
        console.log('✅ GetOne successful');
        console.log('📊 Data:', oneData);
      }
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testBlogPosts();
