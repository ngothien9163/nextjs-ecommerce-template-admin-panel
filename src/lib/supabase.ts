import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your_supabase_anon_key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection function
export const testSupabaseConnection = async () => {
  try {
    console.log('🧪 Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase.from('categories').select('count').limit(1);
    
    if (error) {
      console.error('❌ Connection test failed:', error);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Supabase connection successful');
    return { success: true, data };
  } catch (err) {
    console.error('❌ Connection test error:', err);
    return { success: false, error: String(err) };
  }
};

// Types for our database tables
export interface Profile {
  id: string;
  auth_user_id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  avatar_id?: string;
  role: 'admin' | 'moderator' | 'customer';
  preferences?: any;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  image_url?: string;
  is_active: boolean;
  sort_order: number;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  variant_name: string;
  sku?: string;
  price?: number;
  sale_price?: number;
  stock_quantity: number;
  attributes?: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text?: string;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
}

export interface SEOPage {
  id: string;
  page_type_id: number;
  page_url: string;
  page_title: string;
  meta_description?: string;
  meta_keywords?: string[];
  reference_type: 'product' | 'category' | 'user' | 'page' | 'system' | 'blog';
  reference_id?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  og_type?: string;
  og_site_name?: string;
  og_locale?: string;
  twitter_card?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  schema_markup?: any;
  core_web_vitals?: any;
  ai_ml_metrics?: any;
  eeat_metrics?: any;
  voice_visual_metrics?: any;
  privacy_compliance?: any;
  future_metrics?: any;
  canonical_url?: string;
  robots_directive?: string;
  hreflang?: any;
  language?: string;
  charset?: string;
  viewport?: string;
  seo_score?: number;
  keyword_difficulty?: number;
  search_volume?: number;
  page_load_time?: number;
  mobile_friendly_score?: number;
  accessibility_score?: number;
  core_web_vitals_score?: number;
  social_shares?: number;
  social_engagement?: number;
  social_click_through_rate?: number;
  content_length?: number;
  content_readability_score?: number;
  content_freshness_score?: number;
  internal_links_count?: number;
  external_links_count?: number;
  broken_links_count?: number;
  image_optimization_score?: number;
  is_active: boolean;
  is_featured: boolean;
  is_indexed: boolean;
  is_ssl_secure: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  featured_image_id?: string;
  color: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image_id?: string;
  category_id: string;
  author_id: string;
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  is_pinned: boolean;
  view_count: number;
  read_time?: number;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface BlogPostTag {
  id: string;
  post_id: string;
  tag_id: string;
  created_at: string;
}

export interface BlogComment {
  id: string;
  post_id: string;
  user_id?: string;
  parent_id?: string;
  author_name: string;
  author_email: string;
  content: string;
  is_approved: boolean;
  is_spam: boolean;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  category_id: string;
  brand?: string;
  sku?: string;
  price: number;
  sale_price?: number;
  cost_price?: number;
  weight?: number;
  dimensions?: any;
  stock_quantity: number;
  min_stock_level: number;
  max_stock_level?: number;
  is_active: boolean;
  is_featured: boolean;
  is_bestseller: boolean;
  rating: number;
  review_count: number;
  view_count: number;
  featured_image_id?: string; // Reference to media table
  warranty?: '3 months' | '6 months' | '12 months' | '18 months' | '24 months' | '36 months' | 'Lifetime';
  return_policy?: '7 days' | '15 days' | '30 days' | '45 days' | '60 days' | '90 days' | 'No return';
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  created_at: string;
  updated_at: string;
  // SEO data from seo_pages table
  seo_data?: SEOPage;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  variant_name: string;
  sku?: string;
  price?: number;
  sale_price?: number;
  stock_quantity: number;
  attributes?: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text?: string;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
}

// Test với process.env (sẽ trả về undefined trong browser)
const processEnvUrl = import.meta.env.VITE_SUPABASE_URL;
const processEnvKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔗 Supabase URL (import.meta.env):', supabaseUrl);
console.log('🔑 Supabase Key (import.meta.env):', supabaseKey ? '✅ Set' : '❌ Not set');
console.log('🔗 Supabase URL (process.env):', processEnvUrl || '❌ Undefined - không hoạt động trong Vite');
console.log('🔑 Supabase Key (process.env):', processEnvKey || '❌ Undefined - không hoạt động trong Vite');

// Test function để so sánh cả hai cách
export const testEnvironmentVariables = () => {
  console.log('🧪 Testing Environment Variables...');
  console.log('📋 import.meta.env.VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
  console.log('📋 import.meta.env.VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set');

  return {
    importMetaEnv: {
      url: import.meta.env.VITE_SUPABASE_URL,
      key: import.meta.env.VITE_SUPABASE_ANON_KEY
    }
  };
};
