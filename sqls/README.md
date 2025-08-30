# 📁 SQL Setup Files - Database Documentation

Thư mục `sqls/` chứa tất cả các file SQL cần thiết để setup database cho project eCommerce.

## 📄 Các file chính:

### 1. **`00-setup-complete-database.sql`** (Master script)
- **Kích thước:** ~2KB
- **Mục đích:** Script chính để setup toàn bộ database
- **Chạy:** `\i sqls/00-setup-complete-database.sql`
- **Thời gian:** ~2-3 phút

### 2. **`01-create-all-tables.sql`** (Tạo tables)
- **Kích thước:** ~45KB
- **Mục đích:** Tạo tất cả 28 tables, indexes, triggers, functions (bao gồm SEO tables)
- **Chạy:** `\i sqls/01-create-all-tables.sql`
- **Nội dung:**
  - 26 tables chính (profiles, products, categories, orders, etc.)
  - 2 tables SEO (seo_page_types, seo_pages)
  - 60+ indexes cho performance
  - 25+ triggers cho auto-update
  - 10+ functions cho business logic

### 3. **`02-insert-all-data.sql`** (Insert dữ liệu mẫu)
- **Kích thước:** ~25KB
- **Mục đích:** Insert dữ liệu mẫu cho 28 tables (bao gồm SEO data)
- **Chạy:** `\i sqls/02-insert-all-data.sql`
- **Nội dung:**
  - 5 profiles (admin, moderator, customers)
  - 4 categories (laptops, smartphones, tablets, accessories)
  - 16 products với variants
  - 20 tags và product_tags
  - 2 blog categories và posts
  - 5 loại trang SEO và 12 trang SEO mẫu
  - Dữ liệu orders, reviews, cart, wishlist

### 4. **`03-create-materialized-views.sql`** (Materialized Views)
- **Kích thước:** ~6KB
- **Mục đích:** Tạo 3 Materialized Views cho performance
- **Chạy:** `\i sqls/03-create-materialized-views.sql`
- **Nội dung:**
  - `categories_with_images`: Categories + image URLs
  - `categories_with_stats`: Categories + detailed stats
  - `categories_display`: Optimized view for UI display

## 🚀 Cách sử dụng:

### Option 1: Setup toàn bộ (Khuyến nghị)
```sql
\i sqls/00-setup-complete-database.sql
```

### Option 2: Setup từng bước
```sql
-- Bước 1: Tạo tables
\i sqls/01-create-all-tables.sql

-- Bước 2: Insert dữ liệu
\i sqls/02-insert-all-data.sql

-- Bước 3: Tạo Materialized Views
\i sqls/03-create-materialized-views.sql
```

## 📊 Database Schema:

### Tables chính (26 tables):
- **User Management:** profiles, user_addresses
- **Products:** products, product_variants, product_tags, product_reviews
- **Categories:** categories, tags
- **Orders:** orders, order_items, cart_items, wishlist_items
- **E-commerce:** discounts, coupons, shipping_zones, shipping_methods, payment_methods
- **Blog:** blog_categories, blog_posts, blog_post_tags, blog_comments
- **Media:** media, media_relations
- **System:** notifications

### SEO Tables (2 tables):
- **seo_page_types:** Loại trang (page, product, category, user, system)
- **seo_pages:** Thông tin SEO cho từng trang (50+ fields)

### Materialized Views (3 views):
- **categories_with_images:** Performance view cho category lists
- **categories_with_stats:** Detailed statistics cho admin
- **categories_display:** Optimized view cho UI

## 🔧 Performance Features:

### Indexes:
- B-tree indexes cho foreign keys
- GIN indexes cho JSONB columns
- Composite indexes cho common queries
- Full-text search indexes

### Triggers:
- Auto-update `updated_at` columns
- Auto-calculate `product_count` in categories
- Auto-refresh Materialized Views

### Materialized Views:
- Pre-computed joins cho fast queries
- Auto-refresh khi data thay đổi
- Optimized cho category display

## 📈 SEO Features:

### Comprehensive SEO System:
- **Meta tags:** title, description, keywords
- **Open Graph:** og:title, og:description, og:image
- **Twitter Cards:** twitter:card, twitter:title
- **Schema.org:** JSON-LD structured data
- **Core Web Vitals:** LCP, FID, CLS, INP, TTFB
- **AI/ML Metrics:** Relevance scores, ranking factors
- **E-E-A-T:** Experience, Expertise, Authoritativeness, Trust
- **Voice & Visual Search:** Optimization data
- **Privacy & Compliance:** GDPR, CCPA signals
- **Future-proof:** Quantum SEO, Neural networks

## 🎯 Next Steps:

1. **Setup Database:** Chạy master script
2. **API Integration:** Sử dụng Materialized Views trong API
3. **SEO Management:** Quản lý SEO qua bảng `seo_pages`
4. **Content Management:** Thêm products, blog posts
5. **Performance Monitoring:** Theo dõi Materialized View performance

## 📝 Notes:

- Tất cả tables đều có `created_at` và `updated_at`
- Foreign keys có `ON DELETE CASCADE/SET NULL` phù hợp
- JSONB columns cho flexible data storage
- UUID primary keys cho scalability
- Comments đầy đủ cho documentation
