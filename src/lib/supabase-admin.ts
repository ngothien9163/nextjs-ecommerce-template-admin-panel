import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gyexgtobqvonkmyesqkl.supabase.co';
const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'your_service_role_key_here';

// Supabase client với service role key (bypass RLS)
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Test connection
export const testAdminConnection = async () => {
  try {
    const { data, error } = await supabaseAdmin.storage.listBuckets();
    if (error) {
      console.error('Admin connection failed:', error);
      return false;
    }
    console.log('Admin connection successful');
    return true;
  } catch (error) {
    console.error('Admin connection error:', error);
    return false;
  }
};
