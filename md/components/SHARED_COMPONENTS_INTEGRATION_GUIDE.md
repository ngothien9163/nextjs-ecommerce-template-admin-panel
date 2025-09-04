# 🔧 Cách tích hợp Shared SEO & Image Components vào Products & Categories

## 📋 Hướng dẫn sử dụng SharedSEOImageComponents

### 1. **Import component:**

```typescript
import { SharedSEOImageComponents } from '../shared-seo-image-components';
```

### 2. **Sử dụng trong ProductForm:**

```typescript
// Trong src/components/product-form/index.tsx
export const ProductForm: React.FC<ProductFormProps> = ({ 
  form, 
  isEdit = false, 
  categorySelectProps,
  initialData 
}) => {
  // ... existing form fields ...

  return (
    <div className="product-form-wrapper">
      <Form {...form}>
        {/* Existing product form panels */}
        
        {/* Replace existing SEOForm with SharedSEOImageComponents */}
        <SharedSEOImageComponents
          form={form}
          isEdit={isEdit}
          referenceType="product"
          referenceId={initialData?.id}
          entityName={form?.getFieldValue('name')}
          showImageSelector={true}
          onSEODataChange={(seoData) => {
            console.log('Product SEO data changed:', seoData);
          }}
          onImageSelect={(imageId, imageData) => {
            // Set featured image
            form?.setFieldsValue({ featured_image_id: imageId });
          }}
        />
      </Form>
    </div>
  );
};
```

### 3. **Sử dụng trong CategoryForm:**

```typescript
// Trong src/components/category-form/index.tsx
export const CategoryForm: React.FC<CategoryFormProps> = ({ 
  form, 
  isEdit = false,
  initialData 
}) => {
  // ... existing form fields ...

  return (
    <div className="category-form-wrapper">
      <Form {...form}>
        {/* Existing category form panels */}
        
        {/* Add SharedSEOImageComponents */}
        <SharedSEOImageComponents
          form={form}
          isEdit={isEdit}
          referenceType="category"
          referenceId={initialData?.id}
          entityName={form?.getFieldValue('name')}
          showImageSelector={true}
          onSEODataChange={(seoData) => {
            console.log('Category SEO data changed:', seoData);
          }}
          onImageSelect={(imageId, imageData) => {
            // Set featured image
            form?.setFieldsValue({ featured_image_id: imageId });
          }}
        />
      </Form>
    </div>
  );
};
```

### 4. **Tạo service layer cho products (tương tự blog-post-service):**

```typescript
// src/lib/product-service.ts
import { supabase } from './supabase';
import type { SEOPage, Product } from './supabase';

export interface ProductWithSEO extends Product {
  seo_data?: Partial<SEOPage>;
}

export const productService = {
  async createProduct(productData: Partial<Product>, seoData?: Partial<SEOPage>) {
    try {
      // 1. Tạo product
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (productError || !product) {
        throw new Error(`Failed to create product: ${productError?.message}`);
      }

      // 2. Tạo SEO page nếu có data
      if (seoData && Object.keys(seoData).length > 0) {
        await this.upsertSEOPage(product.id, product.slug, seoData);
      }

      return product;
    } catch (error) {
      console.error('Error creating product with SEO:', error);
      throw error;
    }
  },

  async updateProduct(id: string, productData: Partial<Product>, seoData?: Partial<SEOPage>) {
    try {
      // 1. Cập nhật product
      const { data: product, error: productError } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)
        .select()
        .single();

      if (productError || !product) {
        throw new Error(`Failed to update product: ${productError?.message}`);
      }

      // 2. Upsert SEO page
      if (seoData && Object.keys(seoData).length > 0) {
        await this.upsertSEOPage(product.id, product.slug, seoData);
      }

      return product;
    } catch (error) {
      console.error('Error updating product with SEO:', error);
      throw error;
    }
  },

  async getProductWithSEO(id: string): Promise<ProductWithSEO | null> {
    try {
      // 1. Lấy product
      const { data: product, error: productError } = await supabase
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
        .eq('id', id)
        .single();

      if (productError || !product) {
        console.error('Error fetching product:', productError);
        return null;
      }

      // 2. Lấy SEO data
      const { data: seoData } = await supabase
        .from('seo_pages')
        .select('*')
        .eq('reference_type', 'product')
        .eq('reference_id', id)
        .single();

      return {
        ...product,
        seo_data: seoData || undefined
      };
    } catch (error) {
      console.error('Error getting product with SEO:', error);
      return null;
    }
  },

  async upsertSEOPage(productId: string, slug: string, seoData: Partial<SEOPage>) {
    try {
      // Lấy page_type_id cho product
      const { data: pageType } = await supabase
        .from('seo_page_types')
        .select('id')
        .eq('name', 'product')
        .single();

      const pageTypeId = pageType?.id || 2; // Default to 2 for products

      // Chuẩn bị SEO data
      const seoPageData: Partial<SEOPage> = {
        page_type_id: pageTypeId,
        page_url: seoData.page_url || `/products/${slug}`,
        page_title: seoData.page_title || '',
        meta_description: seoData.meta_description || '',
        meta_keywords: seoData.meta_keywords || [],
        reference_type: 'product',
        reference_id: productId,
        og_title: seoData.og_title || seoData.page_title,
        og_description: seoData.og_description || seoData.meta_description,
        og_type: seoData.og_type || 'product',
        twitter_card: seoData.twitter_card || 'summary_large_image',
        schema_markup: seoData.schema_markup || {},
        canonical_url: seoData.canonical_url || '',
        robots_directive: seoData.robots_directive || 'index,follow',
        language: seoData.language || 'vi',
        charset: seoData.charset || 'UTF-8',
        seo_score: seoData.seo_score || 75,
        mobile_friendly_score: seoData.mobile_friendly_score || 85,
        accessibility_score: seoData.accessibility_score || 80,
        is_active: seoData.is_active !== undefined ? seoData.is_active : true,
        is_indexed: seoData.is_indexed !== undefined ? seoData.is_indexed : true,
        is_ssl_secure: seoData.is_ssl_secure !== undefined ? seoData.is_ssl_secure : true,
        ...seoData
      };

      // Upsert SEO page
      const { data, error } = await supabase
        .from('seo_pages')
        .upsert([seoPageData], {
          onConflict: 'reference_type,reference_id'
        })
        .select()
        .single();

      if (error) {
        console.error('Error upserting SEO page:', error);
        throw new Error(`Failed to save SEO data: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error in upsertSEOPage:', error);
      throw error;
    }
  }
};
```

### 5. **Cập nhật dataProvider để handle products với SEO:**

```typescript
// Trong src/lib/dataProvider.ts
import { productService } from './product-service';

// Thêm vào create method:
if (resource === 'products') {
  try {
    const { seo_data, ...productData } = variables;
    const data = await productService.createProduct(productData, seo_data);
    return { data };
  } catch (error) {
    console.error('❌ Error creating product with SEO:', error);
    throw new Error(error.message);
  }
}

// Thêm vào update method:
if (resource === 'products') {
  try {
    const { seo_data, ...productData } = variables;
    const data = await productService.updateProduct(id, productData, seo_data);
    return { data };
  } catch (error) {
    console.error('❌ Error updating product with SEO:', error);
    throw new Error(error.message);
  }
}

// Thêm vào getOne method:
if (resource === 'products') {
  try {
    const data = await productService.getProductWithSEO(id);
    if (!data) {
      throw new Error('Product not found');
    }
    return { data };
  } catch (error) {
    console.error('❌ Error fetching product with SEO:', error);
    throw new Error(error.message);
  }
}
```

## 🎯 **Lợi ích của việc tái sử dụng components:**

1. ✅ **DRY Principle** - Không lặp lại code
2. ✅ **Consistency** - UI/UX thống nhất
3. ✅ **Maintainability** - Dễ bảo trì và cập nhật
4. ✅ **Scalability** - Dễ mở rộng cho các entity khác
5. ✅ **Type Safety** - TypeScript support đầy đủ

## 🚀 **Kết quả:**

Sau khi implement, bạn sẽ có:
- Products với full SEO support
- Categories với SEO optimization  
- Unified image management
- Consistent UX across all forms
- Scalable architecture for future entities

**🎯 Next Steps:** Implement tương tự cho Orders, Users, và các entities khác!