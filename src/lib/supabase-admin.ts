import { createClient } from '@supabase/supabase-js';

// Service Role Key - có quyền bypass RLS
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gyexgtobqvonkmyesqkl.supabase.co';
const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'your_service_role_key';

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Test function
export const testSupabaseAdminConnection = async () => {
  try {
    console.log('🧪 Testing Supabase Admin connection...');
    
    // Test storage upload
    const testFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    const { data, error } = await supabaseAdmin.storage
      .from('medias')
      .upload('test-admin.txt', testFile);
    
    if (error) {
      console.error('❌ Admin connection test failed:', error);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Supabase Admin connection successful');
    return { success: true, data };
  } catch (err) {
    console.error('❌ Admin connection test error:', err);
    return { success: false, error: String(err) };
  }
};