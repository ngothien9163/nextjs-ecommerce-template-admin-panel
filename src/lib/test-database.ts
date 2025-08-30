import { supabase } from './supabase';

export const testDatabaseConnection = async () => {
  console.log('🧪 Testing database connection...');
  
  try {
    // Test basic connection
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (profilesError) {
      console.error('❌ Profiles query failed:', profilesError);
      return { success: false, error: profilesError.message };
    }
    
    console.log('✅ Basic connection successful');
    
    // Test products table
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(5);
    
    if (productsError) {
      console.error('❌ Products query failed:', productsError);
      return { success: false, error: productsError.message };
    }
    
    console.log('✅ Products query successful');
    console.log('📊 Products count:', products?.length || 0);
    console.log('📋 Sample product:', products?.[0]);
    
    // Test categories table
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*');
    
    if (categoriesError) {
      console.error('❌ Categories query failed:', categoriesError);
      return { success: false, error: categoriesError.message };
    }
    
    console.log('✅ Categories query successful');
    console.log('📊 Categories count:', categories?.length || 0);
    console.log('📋 Categories:', categories);
    
    // Test products with categories join
    const { data: productsWithCategories, error: joinError } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          slug,
          is_active
        )
      `)
      .limit(3);
    
    if (joinError) {
      console.error('❌ Products with categories query failed:', joinError);
      return { success: false, error: joinError.message };
    }
    
    console.log('✅ Products with categories query successful');
    console.log('📊 Products with categories:', productsWithCategories);
    
    return { 
      success: true, 
      data: {
        productsCount: products?.length || 0,
        categoriesCount: categories?.length || 0,
        productsWithCategories
      }
    };
    
  } catch (err) {
    console.error('❌ Database test error:', err);
    return { success: false, error: String(err) };
  }
};

export const testSpecificProduct = async (productId: string) => {
  console.log('🧪 Testing specific product:', productId);
  
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          slug,
          is_active
        )
      `)
      .eq('id', productId)
      .single();
    
    if (error) {
      console.error('❌ Product query failed:', error);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Product query successful');
    console.log('📋 Product data:', data);
    
    return { success: true, data };
    
  } catch (err) {
    console.error('❌ Product test error:', err);
    return { success: false, error: String(err) };
  }
};

// Test function to run in browser console
export const runDatabaseTests = async () => {
  console.log('🚀 Running database tests...');
  
  const connectionTest = await testDatabaseConnection();
  console.log('Connection test result:', connectionTest);
  
  if (connectionTest.success && connectionTest.data?.productsCount > 0) {
    // Test first product
    const firstProduct = connectionTest.data.productsWithCategories?.[0];
    if (firstProduct?.id) {
      const productTest = await testSpecificProduct(firstProduct.id);
      console.log('Product test result:', productTest);
    }
  }
  
  return connectionTest;
};
