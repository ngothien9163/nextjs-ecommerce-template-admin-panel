# 🔗 **SEO WEBSITE MAPPING - KẾT NỐI ADMIN PANEL VỚI WEBSITE**

## **📊 Cấu trúc dự án:**

```
D:\Projects\admin-panel\          ← Admin Panel (Quản lý SEO)
├── sqls/03-seo-website-pages.sql
├── SEO_OPTIMIZATION_GUIDE.md
└── SEO_WEBSITE_MAPPING.md

D:\Projects\nextjs-ecommerce-template\  ← Website thực tế (Next.js)
├── pages/
│   ├── index.tsx              ← Trang chủ (/)
│   ├── products/
│   │   ├── [slug].tsx         ← Trang sản phẩm (/products/[slug])
│   │   └── index.tsx          ← Danh sách sản phẩm (/products)
│   ├── categories/
│   │   └── [slug].tsx         ← Trang danh mục (/categories/[slug])
│   ├── user/
│   │   ├── profile.tsx        ← Hồ sơ người dùng (/user/profile)
│   │   └── orders.tsx         ← Đơn hàng người dùng (/user/orders)
│   ├── blog/
│   │   └── [slug].tsx         ← Trang blog (/blog/[slug])
│   └── 404.tsx                ← Trang 404
```

## **🎯 Cách SEO Pages hoạt động:**

### **1. Admin Panel (Quản lý):**
- Tạo, chỉnh sửa thông tin SEO cho từng trang
- Lưu vào database `seo_pages`
- Quản lý meta tags, schema markup, performance metrics

### **2. Website Next.js (Hiển thị):**
- Lấy thông tin SEO từ database qua API
- Render meta tags, Open Graph, Twitter Cards
- Hiển thị structured data (JSON-LD)

## **⚡ Cách implement:**

### **Bước 1: Tạo API endpoints trong Admin Panel**

```typescript
// src/pages/api/seo/[url].ts
export default async function handler(req, res) {
  const { url } = req.query;
  
  // Lấy thông tin SEO từ database
  const seoData = await supabase
    .from('seo_pages')
    .select('*')
    .eq('page_url', url)
    .single();
    
  res.json(seoData);
}
```

### **Bước 2: Tạo SEO Component trong Next.js**

```typescript
// components/SEO.tsx
import { useEffect, useState } from 'react';

interface SEOData {
  page_title: string;
  meta_description: string;
  meta_keywords: string[];
  og_title: string;
  og_description: string;
  og_image: string;
  schema_markup: any;
}

export default function SEO({ url }: { url: string }) {
  const [seoData, setSeoData] = useState<SEOData | null>(null);
  
  useEffect(() => {
    // Lấy SEO data từ Admin Panel API
    fetch(`/api/seo/${encodeURIComponent(url)}`)
      .then(res => res.json())
      .then(data => setSeoData(data));
  }, [url]);
  
  if (!seoData) return null;
  
  return (
    <>
      {/* Meta Tags */}
      <title>{seoData.page_title}</title>
      <meta name="description" content={seoData.meta_description} />
      <meta name="keywords" content={seoData.meta_keywords.join(', ')} />
      
      {/* Open Graph */}
      <meta property="og:title" content={seoData.og_title} />
      <meta property="og:description" content={seoData.og_description} />
      <meta property="og:image" content={seoData.og_image} />
      
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(seoData.schema_markup)
        }}
      />
    </>
  );
}
```

### **Bước 3: Sử dụng trong các trang Next.js**

```typescript
// pages/index.tsx (Trang chủ)
import SEO from '../components/SEO';

export default function HomePage() {
  return (
    <>
      <SEO url="/" />
      <div>
        {/* Nội dung trang chủ */}
      </div>
    </>
  );
}

// pages/products/[slug].tsx (Trang sản phẩm)
export default function ProductPage({ product }) {
  return (
    <>
      <SEO url={`/products/${product.slug}`} />
      <div>
        {/* Nội dung sản phẩm */}
      </div>
    </>
  );
}
```

## **📝 Cập nhật SQL để phù hợp với Website:**

### **1. Thêm các trang thực tế:**

```sql
-- Trang danh sách sản phẩm
INSERT INTO seo_pages (
    page_type_id, page_url, page_title, meta_description, meta_keywords,
    reference_type, reference_id, og_title, og_description, og_image,
    schema_markup, is_active
) VALUES (
    (SELECT id FROM seo_page_types WHERE name = 'page'),
    '/products',
    'Tất cả sản phẩm - Shop Online | Giá tốt, Giao nhanh',
    'Khám phá bộ sưu tập sản phẩm đa dạng: điện tử, thời trang, thể thao. Chính hãng, giá tốt, bảo hành uy tín.',
    ARRAY['sản phẩm', 'mua sắm', 'shop online', 'giá tốt'],
    'page', NULL,
    'Tất cả sản phẩm - Shop Online',
    'Khám phá bộ sưu tập sản phẩm đa dạng với giá tốt nhất.',
    'https://example.com/images/og-products.jpg',
    '{"@context": "https://schema.org", "@type": "CollectionPage", "name": "Tất cả sản phẩm"}',
    true
);

-- Trang hồ sơ người dùng
INSERT INTO seo_pages (
    page_type_id, page_url, page_title, meta_description, meta_keywords,
    reference_type, reference_id, og_title, og_description, og_image,
    robots_directive, is_indexed, is_active
) VALUES (
    (SELECT id FROM seo_page_types WHERE name = 'user'),
    '/user/profile',
    'Hồ sơ người dùng - Shop Online',
    'Quản lý thông tin cá nhân, địa chỉ giao hàng, lịch sử mua hàng.',
    ARRAY['hồ sơ', 'người dùng', 'tài khoản', 'thông tin cá nhân'],
    'user', NULL,
    'Hồ sơ người dùng - Shop Online',
    'Quản lý thông tin cá nhân và lịch sử mua hàng.',
    'https://example.com/images/og-user-profile.jpg',
    'noindex,nofollow', false, true
);

-- Trang đơn hàng người dùng
INSERT INTO seo_pages (
    page_type_id, page_url, page_title, meta_description, meta_keywords,
    reference_type, reference_id, og_title, og_description, og_image,
    robots_directive, is_indexed, is_active
) VALUES (
    (SELECT id FROM seo_page_types WHERE name = 'user'),
    '/user/orders',
    'Đơn hàng của tôi - Shop Online',
    'Xem lịch sử đơn hàng, trạng thái giao hàng, chi tiết thanh toán.',
    ARRAY['đơn hàng', 'lịch sử mua hàng', 'trạng thái giao hàng'],
    'user', NULL,
    'Đơn hàng của tôi - Shop Online',
    'Xem lịch sử đơn hàng và trạng thái giao hàng.',
    'https://example.com/images/og-user-orders.jpg',
    'noindex,nofollow', false, true
);
```

### **2. Tạo function tự động tạo SEO cho sản phẩm mới:**

```sql
-- Function tự động tạo SEO page khi có sản phẩm mới
CREATE OR REPLACE FUNCTION auto_create_product_seo()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO seo_pages (
        page_type_id, page_url, page_title, meta_description, meta_keywords,
        reference_type, reference_id, og_title, og_description, og_image,
        schema_markup, is_active
    ) VALUES (
        (SELECT id FROM seo_page_types WHERE name = 'product'),
        '/products/' || NEW.slug,
        NEW.name || ' - ' || NEW.brand || ' | Shop Online',
        COALESCE(NEW.short_description, NEW.description),
        ARRAY[NEW.name, NEW.brand, 'sản phẩm', 'mua sắm'],
        'product', NEW.id,
        NEW.name || ' - ' || NEW.brand,
        COALESCE(NEW.short_description, NEW.description),
        COALESCE(NEW.image_url, 'https://example.com/images/default-product.jpg'),
        jsonb_build_object(
            '@context', 'https://schema.org',
            '@type', 'Product',
            'name', NEW.name,
            'brand', jsonb_build_object('@type', 'Brand', 'name', NEW.brand),
            'description', COALESCE(NEW.short_description, NEW.description),
            'offers', jsonb_build_object(
                '@type', 'Offer',
                'price', NEW.price,
                'priceCurrency', 'VND'
            )
        ),
        true
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger tự động tạo SEO khi insert sản phẩm mới
CREATE TRIGGER trigger_auto_create_product_seo
    AFTER INSERT ON products
    FOR EACH ROW
    EXECUTE FUNCTION auto_create_product_seo();
```

## **🚀 Workflow hoàn chỉnh:**

### **1. Admin tạo/chỉnh sửa sản phẩm:**
- Admin Panel → Database → Trigger tự động tạo SEO page
- Hoặc admin tạo thủ công SEO page

### **2. Website hiển thị:**
- Next.js page load → Gọi API lấy SEO data
- Render meta tags, Open Graph, Schema markup
- Google bot crawl → Thấy đầy đủ SEO information

### **3. Monitoring:**
- Admin Panel theo dõi performance
- Cập nhật Core Web Vitals, AI/ML metrics
- Tối ưu liên tục

## **📱 Ví dụ thực tế:**

### **Trang sản phẩm iPhone 15 Pro:**
- **URL**: `/products/iphone-15-pro`
- **Admin Panel**: Quản lý title, description, keywords, schema
- **Website**: Hiển thị meta tags, Open Graph, JSON-LD
- **Google**: Index với đầy đủ thông tin SEO

### **Trang danh mục Điện tử:**
- **URL**: `/categories/dien-tu`
- **Admin Panel**: Quản lý từ khóa tập trung, sản phẩm tiêu biểu
- **Website**: Hiển thị CollectionPage schema, meta tags
- **Google**: Hiểu đây là trang danh mục sản phẩm

## **🎯 Lợi ích:**

1. **Quản lý tập trung**: Tất cả SEO ở Admin Panel
2. **Tự động hóa**: Trigger tạo SEO cho sản phẩm mới
3. **Real-time**: Cập nhật SEO ngay lập tức
4. **Performance**: Monitoring Core Web Vitals
5. **Future-proof**: AI/ML metrics, E-E-A-T

Bây giờ bạn có thể quản lý SEO cho tất cả trang website Next.js từ Admin Panel một cách chuyên nghiệp!
