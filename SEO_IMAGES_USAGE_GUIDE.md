# 🎯 **HƯỚNG DẪN SỬ DỤNG BẢNG SEO_IMAGES**

## **📊 Tổng quan:**

Bảng `seo_images` được thiết kế để quản lý SEO cho hình ảnh theo từng context sử dụng. Một hình ảnh có thể được sử dụng ở nhiều nơi khác nhau (sản phẩm, blog, gallery) với SEO khác nhau.

## **🔗 Mối quan hệ:**

```
media (1) ←→ (n) seo_images
```

- **1 media** có thể có **nhiều seo_images** (cho các context khác nhau)
- **1 seo_images** chỉ thuộc về **1 media**

## **📋 Cấu trúc bảng:**

### **Fields chính:**
- `id` - ID duy nhất
- `media_id` - Liên kết với bảng media
- `context_type` - Loại context: 'product', 'blog', 'gallery', 'banner', 'category', 'user', 'page'
- `context_id` - ID của đối tượng context (product_id, blog_post_id, etc.)

### **SEO cơ bản:**
- `alt_text` - Alt text cho context cụ thể
- `title` - Title tag cho context cụ thể
- `caption` - Caption cho context cụ thể
- `meta_description` - Meta description cho context cụ thể
- `meta_keywords` - Meta keywords cho context cụ thể
- `credit` - Credit cho context cụ thể
- `license` - License cho context cụ thể

### **Social Media SEO:**
- `og_title`, `og_description`, `og_image` - Open Graph
- `twitter_title`, `twitter_description`, `twitter_image` - Twitter Card

### **Advanced SEO:**
- `schema_markup` - Schema.org JSON-LD
- `ai_alt_text`, `ai_description`, `ai_tags` - AI-generated content
- `visual_search_optimized`, `visual_search_tags` - Visual search
- `voice_search_optimized`, `voice_search_phrases` - Voice search

## **🔧 Cách sử dụng:**

### **1. Tạo SEO cho hình ảnh sản phẩm:**

```sql
INSERT INTO seo_images (
    media_id, 
    context_type, 
    context_id, 
    alt_text, 
    meta_description, 
    meta_keywords,
    credit,
    license
) VALUES (
    'media-uuid-here',
    'product',
    'product-uuid-here',
    'Laptop Asus Gaming ROG - Giá tốt nhất 2024',
    'Mua laptop Asus Gaming ROG chính hãng, giá rẻ, giao hàng toàn quốc',
    ARRAY['laptop', 'asus', 'gaming', 'rog', 'giá rẻ'],
    'Original Content',
    'All Rights Reserved - Bảo lưu mọi quyền'
);
```

### **2. Tạo SEO cho hình ảnh blog:**

```sql
INSERT INTO seo_images (
    media_id, 
    context_type, 
    context_id, 
    alt_text, 
    meta_description, 
    meta_keywords,
    credit,
    license
) VALUES (
    'media-uuid-here',
    'blog',
    'blog-post-uuid-here',
    'Hình ảnh minh họa laptop gaming hiệu năng cao',
    'Hướng dẫn chi tiết cách chọn laptop gaming phù hợp với nhu cầu',
    ARRAY['hướng dẫn', 'chọn laptop', 'gaming', 'hiệu năng'],
    'Original Content',
    'All Rights Reserved - Bảo lưu mọi quyền'
);
```

### **3. Tạo SEO cho hình ảnh gallery:**

```sql
INSERT INTO seo_images (
    media_id, 
    context_type, 
    context_id, 
    alt_text, 
    meta_description, 
    meta_keywords,
    credit,
    license
) VALUES (
    'media-uuid-here',
    'gallery',
    'gallery-uuid-here',
    'Bộ sưu tập laptop gaming đẹp mắt',
    'Tham khảo các mẫu laptop gaming đẹp và hiện đại',
    ARRAY['bộ sưu tập', 'laptop đẹp', 'gaming', 'thẩm mỹ'],
    'Original Content',
    'All Rights Reserved - Bảo lưu mọi quyền'
);
```

## **📊 Truy vấn dữ liệu:**

### **1. Lấy SEO data cho context cụ thể:**

```sql
-- Sử dụng function có sẵn
SELECT * FROM get_image_seo_data(
    'media-uuid-here', 
    'product', 
    'product-uuid-here'
);
```

### **2. Lấy tất cả SEO data cho một media:**

```sql
SELECT * FROM seo_images 
WHERE media_id = 'media-uuid-here' 
AND is_active = true;
```

### **3. Lấy SEO data theo context type:**

```sql
SELECT * FROM seo_images 
WHERE media_id = 'media-uuid-here' 
AND context_type = 'product'
AND is_active = true;
```

### **4. Tìm hình ảnh có SEO score cao:**

```sql
SELECT 
    m.file_name,
    m.file_url,
    si.context_type,
    si.seo_score,
    si.alt_text
FROM media m
JOIN seo_images si ON m.id = si.media_id
WHERE si.seo_score > 80
AND si.is_active = true
ORDER BY si.seo_score DESC;
```

## **🔧 API Integration:**

### **1. TypeScript Interface:**

```typescript
interface SEOImage {
    id: string;
    media_id: string;
    context_type: 'product' | 'blog' | 'gallery' | 'banner' | 'category' | 'user' | 'page';
    context_id?: string;
    alt_text?: string;
    title?: string;
    caption?: string;
    meta_description?: string;
    meta_keywords?: string[];
    credit?: string;
    license?: string;
    og_title?: string;
    og_description?: string;
    og_image?: string;
    twitter_title?: string;
    twitter_description?: string;
    twitter_image?: string;
    schema_markup?: any;
    seo_score?: number;
    optimization_score?: number;
    ai_alt_text?: string;
    ai_description?: string;
    ai_tags?: string[];
    visual_search_optimized?: boolean;
    visual_search_tags?: string[];
    voice_search_optimized?: boolean;
    voice_search_phrases?: string[];
    social_shares?: number;
    social_engagement?: number;
    click_through_rate?: number;
    impressions?: number;
    clicks?: number;
    accessibility_score?: number;
    readability_score?: number;
    responsive_images?: any;
    webp_version_url?: string;
    avif_version_url?: string;
    compression_ratio?: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}
```

### **2. Supabase Functions:**

```typescript
// Tạo SEO cho hình ảnh
const createImageSEO = async (seoData: Partial<SEOImage>) => {
    const { data, error } = await supabase
        .from('seo_images')
        .insert(seoData);
    
    return { data, error };
};

// Lấy SEO data cho context cụ thể
const getImageSEO = async (mediaId: string, contextType?: string, contextId?: string) => {
    let query = supabase
        .from('seo_images')
        .select('*')
        .eq('media_id', mediaId)
        .eq('is_active', true);
        
    if (contextType) {
        query = query.eq('context_type', contextType);
    }
    if (contextId) {
        query = query.eq('context_id', contextId);
    }
    
    const { data, error } = await query.single();
    return { data, error };
};

// Cập nhật SEO data
const updateImageSEO = async (id: string, updates: Partial<SEOImage>) => {
    const { data, error } = await supabase
        .from('seo_images')
        .update(updates)
        .eq('id', id);
    
    return { data, error };
};

// Xóa SEO data
const deleteImageSEO = async (id: string) => {
    const { data, error } = await supabase
        .from('seo_images')
        .delete()
        .eq('id', id);
    
    return { data, error };
};
```

## **🎯 Best Practices:**

### **1. Context-specific SEO:**
- Luôn tạo SEO riêng cho từng context sử dụng
- Sử dụng từ khóa phù hợp với context
- Tối ưu alt text cho từng mục đích sử dụng

### **2. Performance:**
- Sử dụng indexes có sẵn cho queries
- Chỉ load SEO data cần thiết
- Sử dụng function `get_image_seo_data` cho queries phức tạp

### **3. SEO Optimization:**
- Điền đầy đủ alt_text, meta_description
- Sử dụng từ khóa phù hợp trong meta_keywords
- Tối ưu schema_markup cho search engines

### **4. Analytics:**
- Theo dõi seo_score, social_shares, click_through_rate
- Cập nhật analytics data định kỳ
- Sử dụng data để tối ưu SEO

## **🚀 Ví dụ thực tế:**

### **Scenario: Cùng 1 hình ảnh dùng ở 3 nơi**

```sql
-- Hình ảnh: laptop-asus-gaming.jpg (media_id: abc-123)

-- 1. SEO cho sản phẩm
INSERT INTO seo_images (media_id, context_type, context_id, alt_text, meta_description) VALUES
('abc-123', 'product', 'product-456', 'Laptop Asus Gaming ROG - Giá tốt nhất 2024', 'Mua laptop Asus Gaming ROG chính hãng, giá rẻ');

-- 2. SEO cho blog
INSERT INTO seo_images (media_id, context_type, context_id, alt_text, meta_description) VALUES
('abc-123', 'blog', 'blog-789', 'Hình ảnh minh họa laptop gaming hiệu năng cao', 'Hướng dẫn chi tiết cách chọn laptop gaming');

-- 3. SEO cho gallery
INSERT INTO seo_images (media_id, context_type, context_id, alt_text, meta_description) VALUES
('abc-123', 'gallery', 'gallery-101', 'Bộ sưu tập laptop gaming đẹp mắt', 'Tham khảo các mẫu laptop gaming đẹp');

-- Lấy SEO data cho từng context
SELECT * FROM get_image_seo_data('abc-123', 'product', 'product-456'); -- SEO cho sản phẩm
SELECT * FROM get_image_seo_data('abc-123', 'blog', 'blog-789');       -- SEO cho blog
SELECT * FROM get_image_seo_data('abc-123', 'gallery', 'gallery-101'); -- SEO cho gallery
```

## **🎉 Kết luận:**

Bảng `seo_images` cung cấp giải pháp linh hoạt và mạnh mẽ để quản lý SEO cho hình ảnh theo từng context sử dụng. Với 50+ fields SEO, hỗ trợ AI/ML, visual/voice search, và analytics, bảng này sẵn sàng cho SEO 2025+.






