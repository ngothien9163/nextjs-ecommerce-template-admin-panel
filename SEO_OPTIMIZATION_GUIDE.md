# 🚀 **HƯỚNG DẪN SEO OPTIMIZATION 2025-2026+**

## **📊 Tổng quan SEO Page Types và SEO Pages**

### **🎯 SEO Page Types (Loại trang SEO):**
- **page**: Trang tĩnh (trang chủ, giới thiệu, liên hệ)
- **product**: Trang sản phẩm (tối ưu SEO cao nhất)
- **category**: Trang danh mục (từ khóa tập trung)
- **user**: Trang người dùng (hồ sơ, đánh giá)
- **system**: Trang hệ thống (404, sitemap, robots.txt)
- **blog**: Trang blog, tin tức, hướng dẫn
- **landing**: Trang đích marketing

### **🔍 SEO Pages (Trang SEO):**
Mỗi trang web sẽ có một bản ghi SEO riêng với đầy đủ thông tin tối ưu.

## **⚡ Cách tối ưu SEO cho từng loại trang:**

### **1. 🏠 Trang chủ (Homepage)**
```sql
-- Tối ưu cho từ khóa chính: "shop online", "thời trang"
INSERT INTO seo_pages (
    page_type_id, page_url, page_title, meta_description, meta_keywords,
    og_title, og_description, og_image, schema_markup
) VALUES (
    (SELECT id FROM seo_page_types WHERE name = 'page'),
    '/',
    'Shop Online - Thương hiệu thời trang hàng đầu Việt Nam | Giá tốt, Giao nhanh',
    'Shop Online chuyên cung cấp thời trang nam nữ chất lượng cao, giá cả hợp lý. Giao hàng toàn quốc, thanh toán an toàn.',
    ARRAY['thời trang', 'shop online', 'quần áo nam', 'quần áo nữ'],
    'Shop Online - Thương hiệu thời trang hàng đầu Việt Nam',
    'Khám phá bộ sưu tập thời trang mới nhất với giá tốt nhất.',
    'https://example.com/images/og-homepage.jpg',
    '{"@context": "https://schema.org", "@type": "WebSite", "name": "Shop Online"}'
);
```

**🎯 Tối ưu:**
- Title: 50-60 ký tự, chứa từ khóa chính
- Meta description: 150-160 ký tự, mô tả hấp dẫn
- Schema markup: WebSite type
- Open Graph: Hình ảnh đẹp, mô tả ngắn gọn

### **2. 📱 Trang sản phẩm (Product)**
```sql
-- Tối ưu cho từ khóa sản phẩm cụ thể
INSERT INTO seo_pages (
    page_type_id, page_url, page_title, meta_description, meta_keywords,
    reference_type, reference_id, schema_markup, core_web_vitals
) VALUES (
    (SELECT id FROM seo_page_types WHERE name = 'product'),
    '/san-pham/iphone-15-pro',
    'iPhone 15 Pro 128GB - Chip A17 Pro, Camera 48MP | Shop Online',
    'iPhone 15 Pro với chip A17 Pro mạnh mẽ, camera 48MP chuyên nghiệp. Mua ngay với giá tốt nhất.',
    ARRAY['iphone 15 pro', 'iphone 15', 'apple', 'điện thoại'],
    'product', (SELECT id FROM products WHERE slug = 'iphone-15-pro'),
    '{"@context": "https://schema.org", "@type": "Product", "name": "iPhone 15 Pro", "offers": {"@type": "Offer", "price": "27990000", "priceCurrency": "VND"}}',
    '{"lcp": 2.0, "fid": 0.07, "cls": 0.04, "inp": 0.10, "ttfb": 0.7}'
);
```

**🎯 Tối ưu:**
- Title: Tên sản phẩm + thông số kỹ thuật + thương hiệu
- Meta description: Mô tả sản phẩm + lợi ích + call-to-action
- Schema markup: Product type với giá, thương hiệu
- Core Web Vitals: LCP < 2.5s, FID < 0.1s, CLS < 0.1

### **3. 📂 Trang danh mục (Category)**
```sql
-- Tối ưu cho từ khóa danh mục
INSERT INTO seo_pages (
    page_type_id, page_url, page_title, meta_description, meta_keywords,
    reference_type, reference_id, schema_markup
) VALUES (
    (SELECT id FROM seo_page_types WHERE name = 'category'),
    '/danh-muc/dien-tu',
    'Điện tử & Công nghệ - Điện thoại, Laptop, Máy tính bảng | Shop Online',
    'Khám phá bộ sưu tập điện tử công nghệ đa dạng: điện thoại iPhone, Samsung, laptop MacBook, máy tính bảng iPad.',
    ARRAY['điện tử', 'điện thoại', 'laptop', 'máy tính bảng'],
    'category', (SELECT id FROM categories WHERE slug = 'dien-tu'),
    '{"@context": "https://schema.org", "@type": "CollectionPage", "name": "Điện tử & Công nghệ"}'
);
```

**🎯 Tối ưu:**
- Title: Tên danh mục + sản phẩm chính + thương hiệu
- Meta description: Liệt kê sản phẩm tiêu biểu + lợi ích
- Schema markup: CollectionPage type
- Từ khóa: Tập trung vào danh mục và sản phẩm con

### **4. 📝 Trang blog (Blog)**
```sql
-- Tối ưu cho từ khóa bài viết
INSERT INTO seo_pages (
    page_type_id, page_url, page_title, meta_description, meta_keywords,
    schema_markup, content_length, content_readability_score
) VALUES (
    (SELECT id FROM seo_page_types WHERE name = 'blog'),
    '/blog/huong-dan-chon-dien-thoai-phu-hop',
    'Hướng dẫn chọn điện thoại phù hợp 2025 - Tips từ chuyên gia | Shop Online',
    'Hướng dẫn chi tiết cách chọn điện thoại phù hợp với nhu cầu và ngân sách. Tư vấn từ chuyên gia công nghệ.',
    ARRAY['hướng dẫn chọn điện thoại', 'mua điện thoại', 'so sánh điện thoại'],
    '{"@context": "https://schema.org", "@type": "Article", "headline": "Hướng dẫn chọn điện thoại phù hợp 2025"}',
    2500, 88
);
```

**🎯 Tối ưu:**
- Title: Chủ đề bài viết + năm + nguồn uy tín
- Meta description: Tóm tắt nội dung + lợi ích cho người đọc
- Schema markup: Article type với headline, author
- Nội dung: Tối thiểu 1000 từ, dễ đọc, có cấu trúc rõ ràng

## **🚀 Các yếu tố SEO quan trọng 2025-2026+:**

### **1. 📱 Core Web Vitals 2.0**
```json
{
  "lcp": 2.1,        // Largest Contentful Paint < 2.5s
  "fid": 0.08,       // First Input Delay < 0.1s  
  "cls": 0.05,       // Cumulative Layout Shift < 0.1
  "inp": 0.12,       // Interaction to Next Paint < 0.2s
  "ttfb": 0.8        // Time to First Byte < 1.0s
}
```

### **2. 🤖 AI & ML SEO**
```json
{
  "ai_relevance_score": 95,
  "ml_ranking_factors": {
    "content_quality": 90,
    "user_engagement": 88,
    "technical_seo": 92
  }
}
```

### **3. 🎯 E-E-A-T (Experience, Expertise, Authoritativeness, Trust)**
```json
{
  "experience": 90,      // Kinh nghiệm thực tế
  "expertise": 95,       // Chuyên môn cao
  "authoritativeness": 88, // Uy tín trong ngành
  "trust": 92            // Độ tin cậy
}
```

### **4. 🗣️ Voice & Visual Search**
```json
{
  "voice_search_optimization": 85,
  "visual_search_data": {
    "image_alt_texts": 90,
    "structured_data": 95,
    "mobile_friendly": 98
  }
}
```

## **🔧 Cách sử dụng trong Admin Panel:**

### **1. Tạo SEO Page Type mới:**
```sql
INSERT INTO seo_page_types (name, display_name, description, sort_order) VALUES
('news', 'Tin tức', 'Trang tin tức, báo chí, cập nhật', 8);
```

### **2. Tạo SEO Page cho trang mới:**
```sql
INSERT INTO seo_pages (
    page_type_id, page_url, page_title, meta_description,
    reference_type, reference_id, is_active
) VALUES (
    (SELECT id FROM seo_page_types WHERE name = 'news'),
    '/tin-tuc/cong-nghe-2025',
    'Công nghệ 2025: Xu hướng mới nhất | Shop Online',
    'Khám phá những xu hướng công nghệ mới nhất năm 2025.',
    'page', NULL, true
);
```

### **3. Cập nhật SEO score tự động:**
```sql
-- Cập nhật SEO score cho trang cụ thể
UPDATE seo_pages 
SET seo_score = calculate_advanced_seo_score(
    meta_description,
    meta_keywords,
    schema_markup,
    core_web_vitals,
    page_load_time,
    mobile_friendly_score,
    accessibility_score,
    content_length,
    internal_links_count,
    image_optimization_score
)
WHERE page_url = '/tin-tuc/cong-nghe-2025';
```

## **📈 Monitoring và Reporting:**

### **1. Xem tổng quan SEO:**
```sql
SELECT * FROM seo_overview_advanced;
```

### **2. Xem trang cần cải thiện:**
```sql
SELECT * FROM seo_improvement_detailed;
```

### **3. Tìm kiếm trang theo từ khóa:**
```sql
SELECT * FROM search_seo_pages_advanced('điện thoại', 80, 3.0, 80);
```

## **🎯 Kết luận:**

SEO Page Types và SEO Pages giúp:
- **Quản lý tập trung** tất cả thông tin SEO
- **Tối ưu tự động** với AI/ML metrics
- **Monitoring real-time** performance
- **Future-proof** cho xu hướng SEO 2025-2026+
- **Tích hợp dễ dàng** với admin panel

Hãy sử dụng file SQL `03-seo-website-pages.sql` để tạo dữ liệu mẫu và bắt đầu tối ưu SEO cho website của bạn!
