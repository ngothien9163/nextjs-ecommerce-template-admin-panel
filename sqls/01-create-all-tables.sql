-- =====================================================
-- TẠO TẤT CẢ TABLES CẦN THIẾT CHO PROJECT E-COMMERCE (TỐI ƯU CHO SUPABASE AUTH)
-- =====================================================

-- =====================================================
-- XÓA TẤT CẢ ĐỐI TƯỢNG DATABASE CŨ (ĐỂ TRÁNH CONFLICT)
-- =====================================================

-- Xóa tất cả triggers trước
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS trigger_user_addresses_updated_at ON user_addresses;
DROP TRIGGER IF EXISTS trigger_categories_updated_at ON categories;
DROP TRIGGER IF EXISTS trigger_products_updated_at ON products;
DROP TRIGGER IF EXISTS trigger_product_variants_updated_at ON product_variants;
DROP TRIGGER IF EXISTS trigger_product_reviews_updated_at ON product_reviews;
DROP TRIGGER IF EXISTS trigger_cart_items_updated_at ON cart_items;
DROP TRIGGER IF EXISTS trigger_orders_updated_at ON orders;
DROP TRIGGER IF EXISTS trigger_discounts_updated_at ON discounts;
DROP TRIGGER IF EXISTS trigger_coupons_updated_at ON coupons;
DROP TRIGGER IF EXISTS trigger_shipping_zones_updated_at ON shipping_zones;
DROP TRIGGER IF EXISTS trigger_shipping_methods_updated_at ON shipping_methods;
DROP TRIGGER IF EXISTS trigger_payment_methods_updated_at ON payment_methods;
DROP TRIGGER IF EXISTS trigger_notifications_updated_at ON notifications;

-- Xóa triggers cho Materialized Views
DROP TRIGGER IF EXISTS trigger_refresh_categories_mv ON categories;
DROP TRIGGER IF EXISTS trigger_refresh_categories_mv_products ON products;
DROP TRIGGER IF EXISTS trigger_refresh_categories_mv_media ON media;
DROP TRIGGER IF EXISTS trigger_refresh_categories_materialized_views ON categories;
DROP TRIGGER IF EXISTS trigger_refresh_categories_materialized_views ON products;
DROP TRIGGER IF EXISTS trigger_refresh_categories_materialized_views ON media;

-- Xóa tất cả functions
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS update_category_product_count() CASCADE;
DROP FUNCTION IF EXISTS refresh_categories_materialized_views() CASCADE;
DROP FUNCTION IF EXISTS trigger_refresh_categories_materialized_views() CASCADE;
DROP FUNCTION IF EXISTS refresh_categories_dashboard() CASCADE;
DROP FUNCTION IF EXISTS trigger_refresh_categories_dashboard() CASCADE;

-- Xóa tất cả views và materialized views (nếu có)
DROP VIEW IF EXISTS seo_overview_advanced CASCADE;
DROP VIEW IF EXISTS seo_improvement_detailed CASCADE;

-- Xóa Materialized Views
DROP MATERIALIZED VIEW IF EXISTS categories_with_images CASCADE;
DROP MATERIALIZED VIEW IF EXISTS categories_with_stats CASCADE;
DROP MATERIALIZED VIEW IF EXISTS categories_display CASCADE;
DROP MATERIALIZED VIEW IF EXISTS categories_dashboard CASCADE;

-- Xóa tất cả tables theo thứ tự dependencies
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS wishlist_items CASCADE;
DROP TABLE IF EXISTS product_reviews CASCADE;
-- DROP TABLE IF EXISTS product_images CASCADE; -- Đã xóa table này
DROP TABLE IF EXISTS product_variants CASCADE;
DROP TABLE IF EXISTS product_tags CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS blog_comments CASCADE;
DROP TABLE IF EXISTS blog_post_tags CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS blog_categories CASCADE;
DROP TABLE IF EXISTS media_relations CASCADE;
DROP TABLE IF EXISTS user_addresses CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS discounts CASCADE;
DROP TABLE IF EXISTS coupons CASCADE;
DROP TABLE IF EXISTS shipping_zones CASCADE;
DROP TABLE IF EXISTS shipping_methods CASCADE;
DROP TABLE IF EXISTS payment_methods CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS media CASCADE;

-- Xóa SEO tables
DROP TABLE IF EXISTS seo_pages CASCADE;
DROP TABLE IF EXISTS seo_page_types CASCADE;

-- Xóa tất cả indexes (nếu có)
DROP INDEX IF EXISTS idx_profiles_user_id CASCADE;
DROP INDEX IF EXISTS idx_user_addresses_user_id CASCADE;
DROP INDEX IF EXISTS idx_user_addresses_address_type CASCADE;
DROP INDEX IF EXISTS idx_user_addresses_is_default CASCADE;
DROP INDEX IF EXISTS idx_categories_slug CASCADE;
DROP INDEX IF EXISTS idx_categories_parent_id CASCADE;
DROP INDEX IF EXISTS idx_categories_is_active CASCADE;
DROP INDEX IF EXISTS idx_categories_sort_order CASCADE;
DROP INDEX IF EXISTS idx_products_slug CASCADE;
DROP INDEX IF EXISTS idx_products_category_id CASCADE;
DROP INDEX IF EXISTS idx_products_brand CASCADE;
DROP INDEX IF EXISTS idx_products_sku CASCADE;
DROP INDEX IF EXISTS idx_products_price CASCADE;
DROP INDEX IF EXISTS idx_products_is_active CASCADE;
DROP INDEX IF EXISTS idx_products_is_featured CASCADE;
DROP INDEX IF EXISTS idx_products_is_bestseller CASCADE;
DROP INDEX IF EXISTS idx_products_rating CASCADE;
DROP INDEX IF EXISTS idx_products_created_at CASCADE;
DROP INDEX IF EXISTS idx_product_variants_product_id CASCADE;
DROP INDEX IF EXISTS idx_product_variants_sku CASCADE;
DROP INDEX IF EXISTS idx_product_variants_is_active CASCADE;
DROP INDEX IF EXISTS idx_product_tags_product_id CASCADE;
DROP INDEX IF EXISTS idx_product_tags_tag_id CASCADE;
DROP INDEX IF EXISTS idx_product_reviews_product_id CASCADE;
DROP INDEX IF EXISTS idx_product_reviews_user_id CASCADE;
DROP INDEX IF EXISTS idx_product_reviews_reviewer_email CASCADE;
DROP INDEX IF EXISTS idx_product_reviews_rating CASCADE;
DROP INDEX IF EXISTS idx_product_reviews_is_approved CASCADE;
DROP INDEX IF EXISTS idx_product_reviews_created_at CASCADE;
DROP INDEX IF EXISTS idx_product_reviews_ip_address CASCADE;
DROP INDEX IF EXISTS idx_cart_items_user_id CASCADE;
DROP INDEX IF EXISTS idx_cart_items_product_id CASCADE;
DROP INDEX IF EXISTS idx_cart_items_variant_id CASCADE;
DROP INDEX IF EXISTS idx_cart_items_is_saved_for_later CASCADE;
DROP INDEX IF EXISTS idx_cart_items_created_at CASCADE;
DROP INDEX IF EXISTS idx_wishlist_items_user_id CASCADE;
DROP INDEX IF EXISTS idx_wishlist_items_product_id CASCADE;
DROP INDEX IF EXISTS idx_wishlist_items_variant_id CASCADE;
DROP INDEX IF EXISTS idx_wishlist_items_priority CASCADE;
DROP INDEX IF EXISTS idx_wishlist_items_is_active CASCADE;
DROP INDEX IF EXISTS idx_wishlist_items_reminder_date CASCADE;
DROP INDEX IF EXISTS idx_orders_order_number CASCADE;
DROP INDEX IF EXISTS idx_orders_user_id CASCADE;
DROP INDEX IF EXISTS idx_orders_status CASCADE;
DROP INDEX IF EXISTS idx_orders_order_date CASCADE;
DROP INDEX IF EXISTS idx_orders_payment_status CASCADE;
DROP INDEX IF EXISTS idx_orders_created_at CASCADE;
DROP INDEX IF EXISTS idx_order_items_order_id CASCADE;
DROP INDEX IF EXISTS idx_order_items_product_id CASCADE;
DROP INDEX IF EXISTS idx_discounts_code CASCADE;
DROP INDEX IF EXISTS idx_discounts_is_active CASCADE;
DROP INDEX IF EXISTS idx_discounts_starts_at CASCADE;
DROP INDEX IF EXISTS idx_discounts_expires_at CASCADE;
DROP INDEX IF EXISTS idx_coupons_code CASCADE;
DROP INDEX IF EXISTS idx_coupons_is_active CASCADE;
DROP INDEX IF EXISTS idx_coupons_starts_at CASCADE;
DROP INDEX IF EXISTS idx_coupons_expires_at CASCADE;
DROP INDEX IF EXISTS idx_shipping_zones_name CASCADE;
DROP INDEX IF EXISTS idx_shipping_methods_name CASCADE;
DROP INDEX IF EXISTS idx_shipping_methods_shipping_zone_id CASCADE;
DROP INDEX IF EXISTS idx_shipping_methods_is_active CASCADE;
DROP INDEX IF EXISTS idx_payment_methods_name CASCADE;
DROP INDEX IF EXISTS idx_payment_methods_code CASCADE;
DROP INDEX IF EXISTS idx_payment_methods_is_active CASCADE;
DROP INDEX IF EXISTS idx_notifications_user_id CASCADE;
DROP INDEX IF EXISTS idx_notifications_type CASCADE;
DROP INDEX IF EXISTS idx_notifications_is_read CASCADE;
DROP INDEX IF EXISTS idx_notifications_created_at CASCADE;
DROP INDEX IF EXISTS idx_tags_slug CASCADE;
DROP INDEX IF EXISTS idx_tags_name CASCADE;
DROP INDEX IF EXISTS idx_tags_is_active CASCADE;
DROP INDEX IF EXISTS idx_tags_usage_count CASCADE;
-- DROP INDEX IF EXISTS idx_media_file_name CASCADE;
-- DROP INDEX IF EXISTS idx_media_file_path CASCADE;
-- DROP INDEX IF EXISTS idx_media_file_url CASCADE;
-- DROP INDEX IF EXISTS idx_media_mime_type CASCADE;
-- DROP INDEX IF EXISTS idx_media_is_active CASCADE;
-- DROP INDEX IF EXISTS idx_media_relations_media_id CASCADE;
-- DROP INDEX IF EXISTS idx_media_relations_entity_type CASCADE;
-- DROP INDEX IF EXISTS idx_media_relations_entity_id CASCADE;
-- DROP INDEX IF EXISTS idx_media_relations_relation_type CASCADE;
DROP INDEX IF EXISTS idx_blog_categories_slug CASCADE;
DROP INDEX IF EXISTS idx_blog_categories_is_active CASCADE;
DROP INDEX IF EXISTS idx_blog_posts_slug CASCADE;
DROP INDEX IF EXISTS idx_blog_posts_status CASCADE;
DROP INDEX IF EXISTS idx_blog_posts_is_featured CASCADE;
DROP INDEX IF EXISTS idx_blog_posts_is_pinned CASCADE;
DROP INDEX IF EXISTS idx_blog_posts_published_at CASCADE;
DROP INDEX IF EXISTS idx_blog_post_tags_post_id CASCADE;
DROP INDEX IF EXISTS idx_blog_post_tags_tag_id CASCADE;
DROP INDEX IF EXISTS idx_blog_comments_post_id CASCADE;
DROP INDEX IF EXISTS idx_blog_comments_is_approved CASCADE;
DROP INDEX IF EXISTS idx_blog_comments_is_spam CASCADE;

-- Xóa indexes cho Materialized Views
DROP INDEX IF EXISTS idx_categories_with_images_active_sort CASCADE;
DROP INDEX IF EXISTS idx_categories_with_images_slug CASCADE;
DROP INDEX IF EXISTS idx_categories_with_images_parent_id CASCADE;
DROP INDEX IF EXISTS idx_categories_with_stats_active_sort CASCADE;
DROP INDEX IF EXISTS idx_categories_with_stats_slug CASCADE;
DROP INDEX IF EXISTS idx_categories_with_stats_product_count CASCADE;
DROP INDEX IF EXISTS idx_categories_display_sort CASCADE;
DROP INDEX IF EXISTS idx_categories_display_slug CASCADE;
DROP INDEX IF EXISTS idx_categories_display_product_count CASCADE;
DROP INDEX IF EXISTS idx_categories_dashboard_active_sort CASCADE;
DROP INDEX IF EXISTS idx_categories_dashboard_slug CASCADE;

-- Xóa indexes cho SEO tables
DROP INDEX IF EXISTS idx_seo_pages_url CASCADE;
DROP INDEX IF EXISTS idx_seo_pages_page_type_id CASCADE;
DROP INDEX IF EXISTS idx_seo_pages_reference_type CASCADE;
DROP INDEX IF EXISTS idx_seo_pages_is_active CASCADE;
DROP INDEX IF EXISTS idx_seo_pages_seo_score CASCADE;
DROP INDEX IF EXISTS idx_seo_page_types_name CASCADE;
DROP INDEX IF EXISTS idx_seo_page_types_is_active CASCADE;

-- Xóa indexes mới cho categories (sau khi tối ưu)
DROP INDEX IF EXISTS idx_categories_featured_image_id CASCADE;
DROP INDEX IF EXISTS idx_categories_active_sort CASCADE;
DROP INDEX IF EXISTS idx_categories_active_featured CASCADE;

-- Xóa tất cả sequences (nếu có)
DROP SEQUENCE IF EXISTS profiles_id_seq CASCADE;
DROP SEQUENCE IF EXISTS user_addresses_id_seq CASCADE;
DROP SEQUENCE IF EXISTS categories_id_seq CASCADE;
DROP SEQUENCE IF EXISTS products_id_seq CASCADE;
DROP SEQUENCE IF EXISTS product_variants_id_seq CASCADE;
DROP SEQUENCE IF EXISTS product_images_id_seq CASCADE;
DROP SEQUENCE IF EXISTS product_tags_id_seq CASCADE;
DROP SEQUENCE IF EXISTS product_reviews_id_seq CASCADE;
DROP SEQUENCE IF EXISTS cart_items_id_seq CASCADE;
DROP SEQUENCE IF EXISTS wishlist_items_id_seq CASCADE;
DROP SEQUENCE IF EXISTS orders_id_seq CASCADE;
DROP SEQUENCE IF EXISTS order_items_id_seq CASCADE;
DROP SEQUENCE IF EXISTS discounts_id_seq CASCADE;
DROP SEQUENCE IF EXISTS coupons_id_seq CASCADE;
DROP SEQUENCE IF EXISTS shipping_zones_id_seq CASCADE;
DROP SEQUENCE IF EXISTS shipping_methods_id_seq CASCADE;
DROP SEQUENCE IF EXISTS payment_methods_id_seq CASCADE;
DROP SEQUENCE IF EXISTS notifications_id_seq CASCADE;
DROP SEQUENCE IF EXISTS tags_id_seq CASCADE;
-- DROP SEQUENCE IF EXISTS media_id_seq CASCADE;
-- DROP SEQUENCE IF EXISTS media_relations_id_seq CASCADE;
DROP SEQUENCE IF EXISTS blog_categories_id_seq CASCADE;
DROP SEQUENCE IF EXISTS blog_posts_id_seq CASCADE;
DROP SEQUENCE IF EXISTS blog_post_tags_id_seq CASCADE;
DROP SEQUENCE IF EXISTS blog_comments_id_seq CASCADE;

-- Xóa sequences cho SEO tables
DROP SEQUENCE IF EXISTS seo_pages_id_seq CASCADE;
DROP SEQUENCE IF EXISTS seo_page_types_id_seq CASCADE;

-- Xóa tất cả types (nếu có)
DROP TYPE IF EXISTS gender_type CASCADE;
DROP TYPE IF EXISTS address_type CASCADE;
DROP TYPE IF EXISTS order_status_type CASCADE;
DROP TYPE IF EXISTS payment_status_type CASCADE;
DROP TYPE IF EXISTS discount_type CASCADE;
DROP TYPE IF EXISTS coupon_type CASCADE;
DROP TYPE IF EXISTS notification_type CASCADE;

-- Xóa tất cả schemas (nếu có) - CHÚ Ý: KHÔNG XÓA auth schema của Supabase
-- DROP SCHEMA IF EXISTS public CASCADE;
-- CREATE SCHEMA public;

-- =====================================================
-- THÔNG BÁO HOÀN THÀNH XÓA
-- =====================================================
SELECT 
    '=== HOÀN THÀNH XÓA TẤT CẢ ĐỐI TƯỢNG CŨ ===' as info,
    '✅ Đã xóa tất cả triggers' as step1,
    '✅ Đã xóa tất cả functions' as step2,
    '✅ Đã xóa tất cả views và materialized views' as step3,
    '✅ Đã xóa tất cả tables' as step4,
    '✅ Đã xóa tất cả indexes' as step5,
    '✅ Đã xóa tất cả sequences' as step6,
    '✅ Sẵn sàng tạo mới database' as step7;

-- =====================================================
-- BẮT ĐẦU TẠO MỚI TẤT CẢ ĐỐI TƯỢNG
-- =====================================================

-- =====================================================
-- 1. BẢNG MEDIA (HÌNH ẢNH VÀ FILE CHUNG CHO TOÀN BỘ HỆ THỐNG)
-- =====================================================
CREATE TABLE media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),                  -- ID duy nhất của media
    file_name TEXT NOT NULL,                                       -- Tên file gốc
    file_path TEXT NOT NULL,                                       -- Đường dẫn file trên server
    file_url TEXT NOT NULL,                                        -- URL public để truy cập
    alt_text TEXT,                                                 -- Alt text cho SEO
    title TEXT,                                                    -- Title khi hover
    meta_description TEXT,                                          -- Mô tả chi tiết cho SEO
    meta_keywords TEXT[],                                           -- Từ khóa SEO (array)
    caption TEXT,                                                   -- Chú thích hình ảnh
    credit TEXT,                                                    -- Nguồn/người tạo
    license TEXT,                                                   -- Giấy phép sử dụng
    file_size INTEGER,                                             -- Kích thước file (bytes)
    mime_type TEXT,                                                -- Loại file (image/jpeg, image/png, video/mp4)
    dimensions JSONB,                                              -- Kích thước ảnh/video {width, height, duration}
    is_active BOOLEAN DEFAULT true,                                -- Trạng thái hoạt động
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),             -- Thời gian tạo
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()              -- Thời gian cập nhật
);

-- =====================================================
-- 2. BẢNG MEDIA_RELATIONS (QUAN HỆ MEDIA VỚI CÁC ĐỐI TƯỢNG)
-- =====================================================
CREATE TABLE media_relations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),                  -- ID duy nhất của quan hệ
    media_id UUID REFERENCES media(id) ON DELETE CASCADE,          -- Tham chiếu đến bảng media
    entity_type TEXT NOT NULL CHECK (entity_type IN ('product', 'blog_post', 'category', 'blog_category', 'user', 'banner')), -- Loại đối tượng
    entity_id UUID NOT NULL,                                       -- ID của đối tượng
    relation_type TEXT DEFAULT 'primary' CHECK (relation_type IN ('primary', 'gallery', 'thumbnail', 'banner', 'hero')), -- Loại quan hệ
    sort_order INTEGER DEFAULT 0,                                  -- Thứ tự hiển thị
    is_featured BOOLEAN DEFAULT false,                             -- Media nổi bật
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),             -- Thời gian tạo quan hệ
    UNIQUE(media_id, entity_type, entity_id, relation_type)       -- Tránh duplicate quan hệ
);

-- =====================================================
-- 3. BẢNG PROFILES (THÔNG TIN CHI TIẾT USER - LIÊN KẾT VỚI SUPABASE AUTH)
-- =====================================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),                  -- ID duy nhất của profile (có thể tự tạo hoặc liên kết với auth.users)
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Liên kết với auth.users (Supabase) - có thể NULL
    first_name TEXT,                                               -- Tên của người dùng
    last_name TEXT,                                                -- Họ của người dùng
    phone TEXT,                                                    -- Số điện thoại của người dùng
    date_of_birth DATE,                                            -- Ngày sinh của người dùng
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),     -- Giới tính của người dùng
    avatar_id UUID REFERENCES media(id),                           -- Hình ảnh đại diện của người dùng
    role TEXT DEFAULT 'customer' CHECK (role IN ('admin', 'moderator', 'customer')), -- Vai trò người dùng
    preferences JSONB DEFAULT '{}',                                -- Tùy chọn người dùng dưới dạng JSON
    is_verified BOOLEAN DEFAULT false,                             -- Tài khoản đã được xác thực hay chưa
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),             -- Thời gian tạo profile
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()              -- Thời gian cập nhật profile lần cuối
);

-- =====================================================
-- 4. BẢNG USER_ADDRESSES (ĐỊA CHỈ GIAO HÀNG)
-- =====================================================
CREATE TABLE user_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),                  -- ID duy nhất của địa chỉ
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,        -- Tham chiếu đến profiles (thay vì auth.users)
    address_type TEXT DEFAULT 'shipping' CHECK (address_type IN ('shipping', 'billing')), -- Loại địa chỉ
    is_default BOOLEAN DEFAULT false,                              -- Có phải địa chỉ mặc định hay không
    recipient_name TEXT NOT NULL,                                  -- Tên người nhận hàng
    phone TEXT NOT NULL,                                           -- Số điện thoại liên hệ giao hàng
    address_line1 TEXT NOT NULL,                                   -- Dòng địa chỉ chính
    address_line2 TEXT,                                            -- Dòng địa chỉ phụ (tùy chọn)
    city TEXT NOT NULL,                                            -- Tên thành phố
    state TEXT NOT NULL,                                           -- Tên tỉnh/bang
    postal_code TEXT NOT NULL,                                     -- Mã bưu điện/ZIP
    country TEXT NOT NULL,                                         -- Tên quốc gia
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),             -- Thời gian tạo địa chỉ
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()              -- Thời gian cập nhật địa chỉ lần cuối
);

-- =====================================================
-- 5. BẢNG CATEGORIES (DANH MỤC SẢN PHẨM)
-- =====================================================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),                  -- ID duy nhất của danh mục
    name TEXT NOT NULL,                                            -- Tên danh mục
    slug TEXT UNIQUE NOT NULL,                                     -- Tên danh mục thân thiện với URL
    description TEXT,                                               -- Mô tả danh mục
    parent_id UUID REFERENCES categories(id),                       -- Danh mục cha (cho danh mục con)
    featured_image_id UUID REFERENCES media(id),                   -- Hình ảnh đại diện danh mục
    product_count INTEGER DEFAULT 0,                               -- Số lượng sản phẩm trong danh mục (được update tự động)
    is_active BOOLEAN DEFAULT true,                                -- Danh mục có hoạt động hay không
    sort_order INTEGER DEFAULT 0,                                  -- Thứ tự sắp xếp hiển thị
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),             -- Thời gian tạo danh mục
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()              -- Thời gian cập nhật danh mục lần cuối
);

-- =====================================================
-- 6. BẢNG PRODUCTS (SẢN PHẨM)
-- =====================================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),                  -- ID duy nhất của sản phẩm
    name TEXT NOT NULL,                                            -- Tên sản phẩm
    slug TEXT UNIQUE NOT NULL,                                     -- Tên sản phẩm thân thiện với URL
    description TEXT,                                               -- Mô tả đầy đủ sản phẩm
    short_description TEXT,                                         -- Mô tả ngắn gọn sản phẩm
    category_id UUID REFERENCES categories(id),                     -- Tham chiếu đến bảng categories
    brand TEXT,                                                    -- Tên thương hiệu sản phẩm
    sku TEXT UNIQUE,                                               -- Mã sản phẩm duy nhất (Stock Keeping Unit)
    price DECIMAL(10,2) NOT NULL,                                  -- Giá sản phẩm thường
    sale_price DECIMAL(10,2),                                      -- Giá khuyến mãi
    cost_price DECIMAL(10,2),                                      -- Giá vốn sản phẩm
    weight DECIMAL(8,2),                                           -- Trọng lượng sản phẩm (kg)
    dimensions JSONB,                                              -- Kích thước sản phẩm (dài, rộng, cao)
    stock_quantity INTEGER DEFAULT 0,                              -- Số lượng tồn kho
    min_stock_level INTEGER DEFAULT 5,                             -- Mức tồn kho tối thiểu
    max_stock_level INTEGER,                                       -- Mức tồn kho tối đa
    is_active BOOLEAN DEFAULT true,                                -- Sản phẩm có hoạt động hay không
    is_featured BOOLEAN DEFAULT false,                             -- Sản phẩm có được nổi bật hay không
    is_bestseller BOOLEAN DEFAULT false,                           -- Sản phẩm có phải bán chạy hay không
    rating DECIMAL(3,2) DEFAULT 0,                                 -- Điểm đánh giá trung bình
    review_count INTEGER DEFAULT 0,                                -- Số lượng đánh giá
    view_count INTEGER DEFAULT 0,                                  -- Số lượt xem
    featured_image_id UUID REFERENCES media(id),                   -- Hình ảnh đại diện sản phẩm
    warranty TEXT CHECK (warranty IN ('3 months', '6 months', '12 months', '18 months', '24 months', '36 months', 'Lifetime')), -- Thời hạn bảo hành
    return_policy TEXT CHECK (return_policy IN ('7 days', '15 days', '30 days', '45 days', '60 days', '90 days', 'No return')), -- Chính sách đổi trả
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),             -- Thời gian tạo sản phẩm
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()              -- Thời gian cập nhật sản phẩm lần cuối
);

-- =====================================================
-- 7. BẢNG PRODUCT_VARIANTS (BIẾN THỂ SẢN PHẨM)
-- =====================================================
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),                  -- ID duy nhất của biến thể sản phẩm
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,      -- Tham chiếu đến bảng products
    variant_name TEXT NOT NULL,                                    -- Tên biến thể (ví dụ: "Màu đỏ, Size L")
    sku TEXT UNIQUE,                                               -- Mã SKU duy nhất cho biến thể
    price DECIMAL(10,2),                                           -- Giá riêng cho biến thể
    sale_price DECIMAL(10,2),                                      -- Giá khuyến mãi cho biến thể
    stock_quantity INTEGER DEFAULT 0,                              -- Số lượng tồn kho cho biến thể
    attributes JSONB,                                              -- Thuộc tính biến thể (màu sắc, kích thước, v.v.)
    is_active BOOLEAN DEFAULT true,                                -- Biến thể có hoạt động hay không
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),             -- Thời gian tạo biến thể
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()              -- Thời gian cập nhật biến thể lần cuối
);

-- =====================================================
-- 8. BẢNG PRODUCT_IMAGES (HÌNH ẢNH SẢN PHẨM) - ĐÃ XÓA, THAY THẾ BẰNG MEDIA + MEDIA_RELATIONS
-- =====================================================
-- Table product_images đã được thay thế bằng hệ thống media tập trung:
-- - Sử dụng table 'media' để lưu trữ tất cả hình ảnh/file
-- - Sử dụng table 'media_relations' để liên kết media với products
-- - Ưu điểm: Quản lý tập trung, tái sử dụng, SEO tốt hơn

-- =====================================================
-- 9. BẢNG TAGS (THẺ GẮN CHO SẢN PHẨM, BÀI VIẾT VÀ BLOG)
-- =====================================================
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),                  -- ID duy nhất của tag
    name TEXT UNIQUE NOT NULL,                                     -- Tên tag (ví dụ: "laptop", "gaming", "apple")
    slug TEXT UNIQUE NOT NULL,                                     -- Slug URL thân thiện (ví dụ: "laptop", "gaming", "apple")
    description TEXT,                                               -- Mô tả tag
    color TEXT DEFAULT '#3B82F6',                                  -- Màu hiển thị tag
    tag_type TEXT DEFAULT 'general' CHECK (tag_type IN ('general', 'product', 'blog', 'mixed')), -- Loại tag
    is_active BOOLEAN DEFAULT true,                                -- Tag có hoạt động hay không
    usage_count INTEGER DEFAULT 0,                                 -- Số lần tag được sử dụng
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),             -- Thời gian tạo tag
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()              -- Thời gian cập nhật tag lần cuối
);

-- =====================================================
-- 10. BẢNG PRODUCT_TAGS (QUAN HỆ NHIỀU-NHIỀU GIỮA PRODUCTS VÀ TAGS)
-- =====================================================
CREATE TABLE product_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),                  -- ID duy nhất của quan hệ
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,      -- Tham chiếu đến bảng products
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,             -- Tham chiếu đến bảng tags
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),             -- Thời gian tạo quan hệ
    UNIQUE(product_id, tag_id)                                     -- Tránh duplicate quan hệ
);



-- =====================================================
-- 11. BẢNG BLOG_CATEGORIES (DANH MỤC BLOG)
-- =====================================================
CREATE TABLE blog_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),                  -- ID duy nhất của danh mục blog
    name TEXT NOT NULL,                                            -- Tên danh mục
    slug TEXT UNIQUE NOT NULL,                                     -- Slug URL thân thiện
    description TEXT,                                               -- Mô tả danh mục
    featured_image_id UUID REFERENCES media(id),                   -- Hình ảnh đại diện danh mục
    color TEXT DEFAULT '#3B82F6',                                  -- Màu hiển thị danh mục
    is_active BOOLEAN DEFAULT true,                                -- Trạng thái hoạt động
    sort_order INTEGER DEFAULT 0,                                  -- Thứ tự sắp xếp hiển thị
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),             -- Thời gian tạo danh mục
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()              -- Thời gian cập nhật danh mục
);

-- =====================================================
-- 12. BẢNG BLOG_POSTS (BÀI VIẾT BLOG)
-- =====================================================
CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),                  -- ID duy nhất của bài viết
    title TEXT NOT NULL,                                           -- Tiêu đề bài viết
    slug TEXT UNIQUE NOT NULL,                                     -- Slug URL thân thiện
    excerpt TEXT,                                                   -- Tóm tắt bài viết
    content TEXT NOT NULL,                                         -- Nội dung đầy đủ bài viết
    featured_image_id UUID REFERENCES media(id),                   -- Hình ảnh đại diện bài viết
    category_id UUID REFERENCES blog_categories(id),               -- Tham chiếu đến danh mục blog
    author_id UUID REFERENCES profiles(id),                        -- Tham chiếu đến tác giả
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')), -- Trạng thái bài viết
    is_featured BOOLEAN DEFAULT false,                             -- Bài viết nổi bật
    is_pinned BOOLEAN DEFAULT false,                               -- Bài viết ghim
    view_count INTEGER DEFAULT 0,                                  -- Số lượt xem
    read_time INTEGER,                                             -- Thời gian đọc (phút)
    published_at TIMESTAMP WITH TIME ZONE,                         -- Thời gian xuất bản
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),             -- Thời gian tạo bài viết
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()              -- Thời gian cập nhật bài viết
);

-- =====================================================
-- 13. BẢNG BLOG_POST_TAGS (QUAN HỆ NHIỀU-NHIỀU GIỮA BLOG_POSTS VÀ TAGS)
-- =====================================================
CREATE TABLE blog_post_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),                  -- ID duy nhất của quan hệ
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,      -- Tham chiếu đến bảng blog_posts
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,             -- Tham chiếu đến bảng tags
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),             -- Thời gian tạo quan hệ
    UNIQUE(post_id, tag_id)                                       -- Tránh duplicate quan hệ
);

-- =====================================================
-- 14. BẢNG BLOG_COMMENTS (BÌNH LUẬN BLOG)
-- =====================================================
CREATE TABLE blog_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),                  -- ID duy nhất của bình luận
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,      -- Tham chiếu đến bài viết
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,       -- Tham chiếu đến người bình luận (có thể NULL cho guest)
    parent_id UUID REFERENCES blog_comments(id),                   -- Bình luận cha (cho reply comments)
    author_name TEXT NOT NULL,                                     -- Tên người bình luận
    author_email TEXT NOT NULL,                                    -- Email người bình luận
    content TEXT NOT NULL,                                         -- Nội dung bình luận
    is_approved BOOLEAN DEFAULT false,                             -- Bình luận có được phê duyệt hay không
    is_spam BOOLEAN DEFAULT false,                                 -- Bình luận có phải spam hay không
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),             -- Thời gian tạo bình luận
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()              -- Thời gian cập nhật bình luận
);

-- =====================================================
-- 15. BẢNG PRODUCT_REVIEWS (ĐÁNH GIÁ SẢN PHẨM - TỐI ƯU CHO CẢ USER VÀ GUEST)
-- =====================================================
CREATE TABLE product_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),                  -- ID duy nhất của đánh giá
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,      -- Tham chiếu đến bảng products
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,       -- Tham chiếu đến profiles (có thể NULL cho guest)
    
    -- Thông tin người đánh giá (bắt buộc cho tất cả reviews)
    reviewer_name TEXT NOT NULL,                                   -- Tên người đánh giá (bắt buộc)
    reviewer_email TEXT NOT NULL,                                  -- Email người đánh giá (bắt buộc)
    
    -- Thông tin đánh giá
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),   -- Điểm đánh giá (1-5)
    title TEXT,                                                    -- Tiêu đề đánh giá
    comment TEXT,                                                   -- Nội dung đánh giá
    is_verified_purchase BOOLEAN DEFAULT false,                    -- Có phải mua hàng đã xác thực hay không
    is_approved BOOLEAN DEFAULT false,                             -- Đánh giá có được phê duyệt hay không
    helpful_votes INTEGER DEFAULT 0,                               -- Số lượt bình chọn hữu ích
    
    -- Thông tin bổ sung
    ip_address INET,                                               -- IP address (để chống spam)
    user_agent TEXT,                                               -- User agent
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),             -- Thời gian tạo đánh giá
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()              -- Thời gian cập nhật đánh giá lần cuối
);

-- =====================================================
-- 12. BẢNG CART_ITEMS (GIỎ HÀNG)
-- =====================================================
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),                  -- ID duy nhất của item giỏ hàng
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,        -- Tham chiếu đến profiles (thay vì auth.users)
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,     -- Tham chiếu đến bảng products
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL, -- Tham chiếu đến bảng product_variants
    quantity INTEGER NOT NULL CHECK (quantity > 0),                -- Số lượng sản phẩm
    price DECIMAL(10,2) NOT NULL,                                 -- Giá sản phẩm tại thời điểm thêm vào giỏ
    notes TEXT,                                                    -- Ghi chú của user về sản phẩm
    is_saved_for_later BOOLEAN DEFAULT false,                      -- Có phải item được lưu để mua sau không
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),             -- Thời gian thêm vào giỏ hàng
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()              -- Thời gian cập nhật giỏ hàng lần cuối
);

-- =====================================================
-- 13. BẢNG WISHLIST_ITEMS (DANH SÁCH YÊU THÍCH)
-- =====================================================
CREATE TABLE wishlist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),                  -- ID duy nhất của item yêu thích
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,        -- Tham chiếu đến profiles (thay vì auth.users)
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,     -- Tham chiếu đến bảng products
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL, -- Tham chiếu đến biến thể sản phẩm
    notes TEXT,                                                    -- Ghi chú của user về sản phẩm
    priority INTEGER DEFAULT 3 CHECK (priority >= 1 AND priority <= 5), -- Mức độ ưu tiên (1-5)
    is_active BOOLEAN DEFAULT true,                                -- Trạng thái hoạt động của item
    reminder_date DATE,                                            -- Ngày nhắc nhở mua hàng
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),             -- Thời gian thêm vào danh sách yêu thích
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()              -- Thời gian cập nhật item lần cuối
);

-- =====================================================
-- 14. BẢNG ORDERS (ĐƠN HÀNG)
-- =====================================================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),                  -- ID duy nhất của đơn hàng
    order_number TEXT UNIQUE NOT NULL,                             -- Số đơn hàng duy nhất
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,       -- Tham chiếu đến profiles (thay vì auth.users)
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')), -- Trạng thái đơn hàng
    order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),             -- Ngày đặt hàng
    shipping_address_id UUID REFERENCES user_addresses(id),        -- Tham chiếu đến địa chỉ giao hàng
    billing_address_id UUID REFERENCES user_addresses(id),         -- Tham chiếu đến địa chỉ thanh toán
    subtotal DECIMAL(10,2) NOT NULL,                               -- Tổng tiền hàng (chưa tính phí)
    shipping_fee DECIMAL(10,2) DEFAULT 0,                          -- Phí vận chuyển
    tax_amount DECIMAL(10,2) DEFAULT 0,                            -- Số tiền thuế
    discount_amount DECIMAL(10,2) DEFAULT 0,                       -- Số tiền giảm giá
    total_amount DECIMAL(10,2) NOT NULL,                           -- Tổng tiền đơn hàng
    payment_method TEXT,                                           -- Phương thức thanh toán
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')), -- Trạng thái thanh toán
    shipping_method TEXT,                                          -- Phương thức vận chuyển
    tracking_number TEXT,                                          -- Số theo dõi vận chuyển
    estimated_delivery DATE,                                       -- Ngày dự kiến giao hàng
    notes TEXT,                                                    -- Ghi chú đơn hàng
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),             -- Thời gian tạo đơn hàng
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()              -- Thời gian cập nhật đơn hàng lần cuối
);

-- =====================================================
-- 15. BẢNG ORDER_ITEMS (CHI TIẾT ĐƠN HÀNG)
-- =====================================================
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),                  -- ID duy nhất của item đơn hàng
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,         -- Tham chiếu đến bảng orders
    product_id UUID REFERENCES products(id),                       -- Tham chiếu đến bảng products
    variant_id UUID REFERENCES product_variants(id),               -- Tham chiếu đến bảng product_variants
    product_name TEXT NOT NULL,                                    -- Tên sản phẩm tại thời điểm đặt hàng
    product_sku TEXT,                                              -- SKU sản phẩm tại thời điểm đặt hàng
    quantity INTEGER NOT NULL CHECK (quantity > 0),                -- Số lượng sản phẩm
    unit_price DECIMAL(10,2) NOT NULL,                             -- Đơn giá sản phẩm
    total_price DECIMAL(10,2) NOT NULL,                            -- Tổng tiền item
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()              -- Thời gian tạo item đơn hàng
);

-- =====================================================
-- 16. BẢNG DISCOUNTS (MÃ GIẢM GIÁ)
-- =====================================================
CREATE TABLE discounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),                  -- ID duy nhất của mã giảm giá
    code TEXT UNIQUE NOT NULL,                                     -- Mã giảm giá (ví dụ: SALE20)
    name TEXT NOT NULL,                                            -- Tên mã giảm giá
    description TEXT,                                               -- Mô tả mã giảm giá
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')), -- Loại giảm giá
    discount_value DECIMAL(10,2) NOT NULL,                         -- Giá trị giảm (phần trăm hoặc số tiền)
    min_order_amount DECIMAL(10,2),                                -- Giá trị đơn hàng tối thiểu
    max_discount_amount DECIMAL(10,2),                             -- Số tiền giảm tối đa
    usage_limit INTEGER,                                           -- Giới hạn số lần sử dụng
    used_count INTEGER DEFAULT 0,                                  -- Số lần đã sử dụng
    per_user_limit INTEGER DEFAULT 1,                              -- Giới hạn sử dụng mỗi user
    is_active BOOLEAN DEFAULT true,                                -- Mã có hoạt động hay không
    starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),              -- Thời gian bắt đầu hiệu lực
    expires_at TIMESTAMP WITH TIME ZONE,                           -- Thời gian hết hạn
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),             -- Thời gian tạo mã
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()              -- Thời gian cập nhật mã
);

-- =====================================================
-- 17. BẢNG COUPONS (MÃ KHUYẾN MÃI)
-- =====================================================
CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),                  -- ID duy nhất của mã khuyến mãi
    code TEXT UNIQUE NOT NULL,                                     -- Mã khuyến mãi
    name TEXT NOT NULL,                                            -- Tên mã khuyến mãi
    description TEXT,                                               -- Mô tả mã khuyến mãi
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount', 'free_shipping')), -- Loại khuyến mãi
    discount_value DECIMAL(10,2),                                  -- Giá trị khuyến mãi
    min_order_amount DECIMAL(10,2),                                -- Giá trị đơn hàng tối thiểu
    max_discount_amount DECIMAL(10,2),                             -- Số tiền khuyến mãi tối đa
    usage_limit INTEGER,                                           -- Giới hạn số lần sử dụng
    used_count INTEGER DEFAULT 0,                                  -- Số lần đã sử dụng
    per_user_limit INTEGER DEFAULT 1,                              -- Giới hạn sử dụng mỗi user
    is_active BOOLEAN DEFAULT true,                                -- Mã có hoạt động hay không
    starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),              -- Thời gian bắt đầu hiệu lực
    expires_at TIMESTAMP WITH TIME ZONE,                           -- Thời gian hết hạn
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),             -- Thời gian tạo mã
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()              -- Thời gian cập nhật mã
);

-- =====================================================
-- 18. BẢNG SHIPPING_ZONES (KHU VỰC VẬN CHUYỂN)
-- =====================================================
CREATE TABLE shipping_zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),                  -- ID duy nhất của khu vực vận chuyển
    name TEXT NOT NULL,                                            -- Tên khu vực (ví dụ: "Hà Nội", "TP.HCM")
    description TEXT,                                               -- Mô tả khu vực
    countries TEXT[],                                               -- Danh sách quốc gia
    states TEXT[],                                                  -- Danh sách tỉnh/bang
    cities TEXT[],                                                  -- Danh sách thành phố
    postal_codes TEXT[],                                            -- Danh sách mã bưu điện
    is_active BOOLEAN DEFAULT true,                                -- Khu vực có hoạt động hay không
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),             -- Thời gian tạo khu vực
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()              -- Thời gian cập nhật khu vực
);

-- =====================================================
-- 19. BẢNG SHIPPING_METHODS (PHƯƠNG THỨC VẬN CHUYỂN)
-- =====================================================
CREATE TABLE shipping_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),                  -- ID duy nhất của phương thức vận chuyển
    name TEXT NOT NULL,                                            -- Tên phương thức (ví dụ: "Giao hàng tiêu chuẩn", "Giao hàng nhanh")
    description TEXT,                                               -- Mô tả phương thức
    shipping_zone_id UUID REFERENCES shipping_zones(id),            -- Tham chiếu đến khu vực vận chuyển
    base_price DECIMAL(10,2) NOT NULL,                             -- Giá cơ bản
    price_per_kg DECIMAL(10,2) DEFAULT 0,                          -- Giá theo kg
    estimated_days_min INTEGER,                                     -- Số ngày giao hàng tối thiểu
    estimated_days_max INTEGER,                                     -- Số ngày giao hàng tối đa
    is_active BOOLEAN DEFAULT true,                                -- Phương thức có hoạt động hay không
    sort_order INTEGER DEFAULT 0,                                  -- Thứ tự sắp xếp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),             -- Thời gian tạo phương thức
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()              -- Thời gian cập nhật phương thức
);

-- =====================================================
-- 20. BẢNG PAYMENT_METHODS (PHƯƠNG THỨC THANH TOÁN)
-- =====================================================
CREATE TABLE payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),                  -- ID duy nhất của phương thức thanh toán
    name TEXT NOT NULL,                                            -- Tên phương thức (ví dụ: "Thẻ tín dụng", "Chuyển khoản ngân hàng")
    code TEXT UNIQUE NOT NULL,                                     -- Mã phương thức (ví dụ: "credit_card", "bank_transfer")
    description TEXT,                                               -- Mô tả phương thức
    is_active BOOLEAN DEFAULT true,                                -- Phương thức có hoạt động hay không
    sort_order INTEGER DEFAULT 0,                                  -- Thứ tự sắp xếp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),             -- Thời gian tạo phương thức
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()              -- Thời gian cập nhật phương thức
);

-- =====================================================
-- 21. BẢNG NOTIFICATIONS (THÔNG BÁO)
-- =====================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),                  -- ID duy nhất của thông báo
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,        -- Tham chiếu đến profiles (có thể NULL cho thông báo chung)
    type TEXT NOT NULL CHECK (type IN ('order_status', 'promotion', 'system', 'security')), -- Loại thông báo
    title TEXT NOT NULL,                                           -- Tiêu đề thông báo
    message TEXT NOT NULL,                                         -- Nội dung thông báo
    is_read BOOLEAN DEFAULT false,                                 -- Đã đọc hay chưa
    data JSONB DEFAULT '{}',                                       -- Dữ liệu bổ sung (ví dụ: order_id, product_id)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()              -- Thời gian tạo thông báo
);

-- =====================================================
-- 22. BẢNG SEO_PAGE_TYPES (LOẠI TRANG SEO)
-- =====================================================
CREATE TABLE seo_page_types (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,                    -- 'page', 'product', 'category', 'user', 'system'
    display_name TEXT NOT NULL,                   -- 'Trang tĩnh', 'Sản phẩm', 'Danh mục', 'Người dùng', 'Hệ thống'
    description TEXT,                             -- Mô tả chi tiết loại trang
    is_active BOOLEAN DEFAULT true,               -- Trạng thái hoạt động
    sort_order INTEGER DEFAULT 0,                 -- Thứ tự sắp xếp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 23. BẢNG SEO_PAGES (THÔNG TIN SEO CHO TỪNG TRANG)
-- =====================================================
CREATE TABLE seo_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Thông tin cơ bản
    page_type_id INTEGER NOT NULL REFERENCES seo_page_types(id),
    page_url TEXT UNIQUE NOT NULL,                -- URL của trang (ví dụ: /shop-details/iphone-15)
    page_title TEXT NOT NULL,                     -- Tiêu đề trang (title tag)
    meta_description TEXT,                        -- Meta description
    meta_keywords TEXT[],                         -- Mảng từ khóa
    
    -- Thông tin tham chiếu
    reference_type TEXT NOT NULL,                 -- 'product', 'category', 'user', 'page', 'system', 'blog'
    reference_id UUID,                            -- ID của bảng tham chiếu (products.id, categories.id, etc.)
    
    -- Open Graph (Enhanced 2025+)
    og_title TEXT,                                -- Open Graph title
    og_description TEXT,                          -- Open Graph description
    og_image TEXT,                                -- Open Graph image URL
    og_type TEXT DEFAULT 'website',               -- Open Graph type
    og_site_name TEXT,                            -- Tên website
    og_locale TEXT DEFAULT 'vi_VN',               -- Ngôn ngữ
    og_audio TEXT,                                -- Audio file URL
    og_video TEXT,                                -- Video file URL
    
    -- Twitter Card (Enhanced 2025+)
    twitter_card TEXT DEFAULT 'summary_large_image',
    twitter_title TEXT,                           -- Twitter title
    twitter_description TEXT,                     -- Twitter description
    twitter_image TEXT,                           -- Twitter image URL
    twitter_creator TEXT,                         -- Twitter creator handle
    twitter_site TEXT,                            -- Twitter site handle
    
    -- Schema.org Structured Data
    schema_markup JSONB,                          -- JSON-LD structured data
    
    -- Core Web Vitals 2.0 (2025+)
    core_web_vitals JSONB,                        -- LCP, FID, CLS, INP, TTFB
    
    -- AI & ML SEO (2025+)
    ai_ml_metrics JSONB,                          -- AI relevance score, ML ranking factors
    
    -- E-E-A-T (2025+)
    eeat_metrics JSONB,                           -- Experience, Expertise, Authoritativeness, Trust
    
    -- Voice & Visual Search (2025+)
    voice_visual_metrics JSONB,                   -- Voice search optimization, visual search data
    
    -- Privacy & Compliance (2025+)
    privacy_compliance JSONB,                     -- GDPR, CCPA, privacy signals
    
    -- Future-proof fields (2026+)
    future_metrics JSONB,                         -- Quantum SEO, Neural networks, BCI, Spatial computing
    
    -- Thông tin kỹ thuật (Enhanced 2025+)
    canonical_url TEXT,                           -- Canonical URL
    robots_directive TEXT DEFAULT 'index,follow', -- Robots meta tag
    hreflang JSONB,                               -- Hreflang tags cho đa ngôn ngữ
    language TEXT DEFAULT 'vi',                   -- Ngôn ngữ chính của trang
    charset TEXT DEFAULT 'UTF-8',                 -- Character encoding
    viewport TEXT DEFAULT 'width=device-width, initial-scale=1', -- Viewport meta tag
    
    -- Thống kê và phân tích
    seo_score INTEGER DEFAULT 0,                  -- Điểm SEO tổng thể (0-100)
    keyword_difficulty INTEGER,                   -- Độ khó từ khóa (0-100)
    search_volume INTEGER,                        -- Lượt tìm kiếm hàng tháng
    
    -- Performance metrics (2025+)
    page_load_time DECIMAL(8,3),                  -- Thời gian tải trang (giây)
    mobile_friendly_score INTEGER,                -- Điểm thân thiện mobile (0-100)
    accessibility_score INTEGER,                  -- Điểm accessibility (0-100)
    core_web_vitals_score INTEGER,                -- Điểm Core Web Vitals (0-100)
    
    -- Social metrics (2025+)
    social_shares INTEGER DEFAULT 0,              -- Số lượt chia sẻ mạng xã hội
    social_engagement DECIMAL(8,2) DEFAULT 0,     -- Tỷ lệ tương tác mạng xã hội
    social_click_through_rate DECIMAL(5,2),       -- Tỷ lệ click qua mạng xã hội
    
    -- Content metrics (2025+)
    content_length INTEGER,                       -- Độ dài nội dung (số ký tự)
    content_readability_score INTEGER,            -- Điểm khả năng đọc nội dung (0-100)
    content_freshness_score INTEGER,              -- Điểm độ mới của nội dung (0-100)
    
    -- Link metrics (2025+)
    internal_links_count INTEGER DEFAULT 0,       -- Số liên kết nội bộ
    external_links_count INTEGER DEFAULT 0,       -- Số liên kết ngoài
    broken_links_count INTEGER DEFAULT 0,          -- Số liên kết bị hỏng
    
    -- Image optimization (2025+)
    image_optimization_score INTEGER,             -- Điểm tối ưu hóa hình ảnh (0-100)
    
    -- Trạng thái và flags
    is_active BOOLEAN DEFAULT true,               -- Trạng thái hoạt động
    is_featured BOOLEAN DEFAULT false,            -- Trang SEO nổi bật
    is_indexed BOOLEAN DEFAULT true,              -- Được index bởi search engine
    is_ssl_secure BOOLEAN DEFAULT true,           -- Bảo mật SSL
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TẠO INDEXES CHO HIỆU SUẤT
-- =====================================================

-- Indexes cho bảng profiles
CREATE INDEX idx_profiles_user_id ON profiles(id);

-- Indexes cho bảng user_addresses
CREATE INDEX idx_user_addresses_user_id ON user_addresses(user_id);
CREATE INDEX idx_user_addresses_address_type ON user_addresses(address_type);
CREATE INDEX idx_user_addresses_is_default ON user_addresses(is_default);

-- Indexes cho bảng categories
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_is_active ON categories(is_active);
CREATE INDEX idx_categories_sort_order ON categories(sort_order);
CREATE INDEX idx_categories_featured_image_id ON categories(featured_image_id);
CREATE INDEX idx_categories_active_sort ON categories(is_active, sort_order);
CREATE INDEX idx_categories_active_featured ON categories(is_active, featured_image_id);

-- Indexes cho bảng products
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_is_featured ON products(is_featured);
CREATE INDEX idx_products_is_bestseller ON products(is_bestseller);
CREATE INDEX idx_products_rating ON products(rating DESC);
CREATE INDEX idx_products_created_at ON products(created_at);

-- Indexes cho bảng product_variants
CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_product_variants_sku ON product_variants(sku);
CREATE INDEX idx_product_variants_is_active ON product_variants(is_active);

-- Indexes cho bảng tags
CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_tags_name ON tags(name);
CREATE INDEX idx_tags_is_active ON tags(is_active);
CREATE INDEX idx_tags_usage_count ON tags(usage_count DESC);

-- Indexes cho bảng product_tags
CREATE INDEX idx_product_tags_product_id ON product_tags(product_id);
CREATE INDEX idx_product_tags_tag_id ON product_tags(tag_id);

-- Indexes cho bảng media
CREATE INDEX idx_media_file_name ON media(file_name);
CREATE INDEX idx_media_file_path ON media(file_path);
CREATE INDEX idx_media_file_url ON media(file_url);
CREATE INDEX idx_media_mime_type ON media(mime_type);
CREATE INDEX idx_media_is_active ON media(is_active);
CREATE INDEX idx_media_meta_keywords ON media USING GIN(meta_keywords); -- Index cho array meta_keywords
CREATE INDEX idx_media_alt_text ON media(alt_text); -- Index cho SEO alt_text
CREATE INDEX idx_media_meta_description ON media(meta_description); -- Index cho SEO meta_description

-- Indexes cho bảng media_relations
CREATE INDEX idx_media_relations_media_id ON media_relations(media_id);
CREATE INDEX idx_media_relations_entity_type ON media_relations(entity_type);
CREATE INDEX idx_media_relations_entity_id ON media_relations(entity_id);
CREATE INDEX idx_media_relations_relation_type ON media_relations(relation_type);

-- Indexes cho bảng blog_categories
CREATE INDEX idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX idx_blog_categories_is_active ON blog_categories(is_active);

-- Indexes cho bảng blog_posts
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_is_featured ON blog_posts(is_featured);
CREATE INDEX idx_blog_posts_is_pinned ON blog_posts(is_pinned);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at);

-- Indexes cho bảng blog_post_tags
CREATE INDEX idx_blog_post_tags_post_id ON blog_post_tags(post_id);
CREATE INDEX idx_blog_post_tags_tag_id ON blog_post_tags(tag_id);

-- Indexes cho bảng blog_comments
CREATE INDEX idx_blog_comments_post_id ON blog_comments(post_id);
CREATE INDEX idx_blog_comments_is_approved ON blog_comments(is_approved);
CREATE INDEX idx_blog_comments_is_spam ON blog_comments(is_spam);

-- Indexes cho bảng product_reviews
CREATE INDEX idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX idx_product_reviews_user_id ON product_reviews(user_id);
CREATE INDEX idx_product_reviews_reviewer_email ON product_reviews(reviewer_email);
CREATE INDEX idx_product_reviews_rating ON product_reviews(rating);
CREATE INDEX idx_product_reviews_is_approved ON product_reviews(is_approved);
CREATE INDEX idx_product_reviews_created_at ON product_reviews(created_at);
CREATE INDEX idx_product_reviews_ip_address ON product_reviews(ip_address);

-- Indexes cho bảng cart_items
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX idx_cart_items_variant_id ON cart_items(variant_id);
CREATE INDEX idx_cart_items_is_saved_for_later ON cart_items(is_saved_for_later);
CREATE INDEX idx_cart_items_created_at ON cart_items(created_at);

-- Indexes cho bảng wishlist_items
CREATE INDEX idx_wishlist_items_user_id ON wishlist_items(user_id);
CREATE INDEX idx_wishlist_items_product_id ON wishlist_items(product_id);
CREATE INDEX idx_wishlist_items_variant_id ON wishlist_items(variant_id);
CREATE INDEX idx_wishlist_items_priority ON wishlist_items(priority DESC);
CREATE INDEX idx_wishlist_items_is_active ON wishlist_items(is_active);
CREATE INDEX idx_wishlist_items_reminder_date ON wishlist_items(reminder_date);

-- Indexes cho bảng orders
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_date ON orders(order_date);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- Indexes cho bảng order_items
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Indexes cho bảng discounts
CREATE INDEX idx_discounts_code ON discounts(code);
CREATE INDEX idx_discounts_is_active ON discounts(is_active);
CREATE INDEX idx_discounts_starts_at ON discounts(starts_at);
CREATE INDEX idx_discounts_expires_at ON discounts(expires_at);

-- Indexes cho bảng coupons
CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_is_active ON coupons(is_active);
CREATE INDEX idx_coupons_starts_at ON coupons(starts_at);
CREATE INDEX idx_coupons_expires_at ON coupons(expires_at);

-- Indexes cho bảng shipping_zones
CREATE INDEX idx_shipping_zones_name ON shipping_zones(name);
CREATE INDEX idx_shipping_zones_is_active ON shipping_zones(is_active);

-- Indexes cho bảng shipping_methods
CREATE INDEX idx_shipping_methods_name ON shipping_methods(name);
CREATE INDEX idx_shipping_methods_shipping_zone_id ON shipping_methods(shipping_zone_id);
CREATE INDEX idx_shipping_methods_is_active ON shipping_methods(is_active);

-- Indexes cho bảng payment_methods
CREATE INDEX idx_payment_methods_name ON payment_methods(name);
CREATE INDEX idx_payment_methods_code ON payment_methods(code);
CREATE INDEX idx_payment_methods_is_active ON payment_methods(is_active);

-- Indexes cho bảng notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Indexes cho bảng seo_page_types
CREATE INDEX idx_seo_page_types_name ON seo_page_types(name);
CREATE INDEX idx_seo_page_types_is_active ON seo_page_types(is_active);

-- Indexes cho bảng seo_pages
CREATE INDEX idx_seo_pages_url ON seo_pages(page_url);
CREATE INDEX idx_seo_pages_page_type_id ON seo_pages(page_type_id);
CREATE INDEX idx_seo_pages_reference_type ON seo_pages(reference_type);
CREATE INDEX idx_seo_pages_is_active ON seo_pages(is_active);
CREATE INDEX idx_seo_pages_seo_score ON seo_pages(seo_score DESC);
CREATE INDEX idx_seo_pages_meta_keywords ON seo_pages USING GIN(meta_keywords);
CREATE INDEX idx_seo_pages_schema_markup ON seo_pages USING GIN(schema_markup);
CREATE INDEX idx_seo_pages_core_web_vitals ON seo_pages USING GIN(core_web_vitals);
CREATE INDEX idx_seo_pages_ai_ml_metrics ON seo_pages USING GIN(ai_ml_metrics);
CREATE INDEX idx_seo_pages_eeat_metrics ON seo_pages USING GIN(eeat_metrics);
CREATE INDEX idx_seo_pages_voice_visual_metrics ON seo_pages USING GIN(voice_visual_metrics);
CREATE INDEX idx_seo_pages_privacy_compliance ON seo_pages USING GIN(privacy_compliance);
CREATE INDEX idx_seo_pages_future_metrics ON seo_pages USING GIN(future_metrics);
CREATE INDEX idx_seo_pages_hreflang ON seo_pages USING GIN(hreflang);

-- =====================================================
-- TẠO TRIGGERS CHO AUTO-UPDATE
-- =====================================================

-- Function tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function tự động cập nhật product_count trong categories
CREATE OR REPLACE FUNCTION update_category_product_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Nếu là INSERT hoặc UPDATE
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        -- Cập nhật product_count cho category của sản phẩm mới
        UPDATE categories 
        SET product_count = (
            SELECT COUNT(*) 
            FROM products 
            WHERE category_id = NEW.category_id AND is_active = true
        )
        WHERE id = NEW.category_id;
        
        -- Nếu có category_id cũ (trong trường hợp UPDATE)
        IF TG_OP = 'UPDATE' AND OLD.category_id IS DISTINCT FROM NEW.category_id THEN
            UPDATE categories 
            SET product_count = (
                SELECT COUNT(*) 
                FROM products 
                WHERE category_id = OLD.category_id AND is_active = true
            )
            WHERE id = OLD.category_id;
        END IF;
    END IF;
    
    -- Nếu là DELETE
    IF TG_OP = 'DELETE' THEN
        UPDATE categories 
        SET product_count = (
            SELECT COUNT(*) 
            FROM products 
            WHERE category_id = OLD.category_id AND is_active = true
        )
        WHERE id = OLD.category_id;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Triggers cho các bảng có updated_at
CREATE TRIGGER trigger_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_user_addresses_updated_at
    BEFORE UPDATE ON user_addresses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Triggers để tự động cập nhật product_count trong categories
CREATE TRIGGER trigger_products_category_count
    AFTER INSERT OR UPDATE OR DELETE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_category_product_count();

CREATE TRIGGER trigger_product_variants_updated_at
    BEFORE UPDATE ON product_variants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Triggers cho bảng tags
CREATE TRIGGER trigger_tags_updated_at
    BEFORE UPDATE ON tags
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_media_updated_at
    BEFORE UPDATE ON media
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_media_relations_updated_at
    BEFORE UPDATE ON media_relations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_blog_categories_updated_at
    BEFORE UPDATE ON blog_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_blog_post_tags_updated_at
    BEFORE UPDATE ON blog_post_tags
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_product_reviews_updated_at
    BEFORE UPDATE ON product_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_cart_items_updated_at
    BEFORE UPDATE ON cart_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_wishlist_items_updated_at
    BEFORE UPDATE ON wishlist_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Triggers cho bảng discounts
CREATE TRIGGER trigger_discounts_updated_at
    BEFORE UPDATE ON discounts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Triggers cho bảng coupons
CREATE TRIGGER trigger_coupons_updated_at
    BEFORE UPDATE ON coupons
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Triggers cho bảng shipping_zones
CREATE TRIGGER trigger_shipping_zones_updated_at
    BEFORE UPDATE ON shipping_zones
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Triggers cho bảng shipping_methods
CREATE TRIGGER trigger_shipping_methods_updated_at
    BEFORE UPDATE ON shipping_methods
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Triggers cho bảng payment_methods
CREATE TRIGGER trigger_payment_methods_updated_at
    BEFORE UPDATE ON payment_methods
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Triggers cho bảng notifications
CREATE TRIGGER trigger_notifications_updated_at
    BEFORE UPDATE ON notifications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Triggers cho bảng seo_pages
CREATE TRIGGER trigger_seo_pages_updated_at
    BEFORE UPDATE ON seo_pages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TẠO TRIGGER TỰ ĐỘNG TẠO PROFILE KHI USER ĐĂNG KÝ
-- =====================================================

-- Function tự động tạo profile khi user đăng ký
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (auth_user_id, first_name, last_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger tự động tạo profile
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- HOÀN THÀNH TẠO TẤT CẢ TABLES (TỐI ƯU CHO SUPABASE AUTH + BLOG SYSTEM + MEDIA SYSTEM)
-- =====================================================

-- =====================================================
-- TỔNG KẾT SCHEMA:
-- =====================================================
-- 1. profiles (19 cột) - Thông tin user chi tiết
-- 2. user_addresses (13 cột) - Địa chỉ giao hàng
-- 3. categories (12 cột) - Danh mục sản phẩm
-- 4. products (28 cột) - Sản phẩm chính
-- 5. product_variants (10 cột) - Biến thể sản phẩm
-- 6. tags (12 cột) - Hệ thống tags (hỗ trợ product + blog)
-- 7. product_tags (4 cột) - Quan hệ products-tags
-- 8. media (15 cột) - Hình ảnh và file chung (TĂNG CƯỜNG SEO)
-- 9. media_relations (7 cột) - Quan hệ media-entities
-- 10. blog_categories (10 cột) - Danh mục blog
-- 11. blog_posts (15 cột) - Bài viết blog
-- 12. blog_post_tags (4 cột) - Quan hệ blog_posts-tags
-- 13. blog_comments (10 cột) - Bình luận blog
-- 14. product_reviews (15 cột) - Đánh giá sản phẩm
-- 15. cart_items (10 cột) - Giỏ hàng
-- 16. wishlist_items (10 cột) - Danh sách yêu thích
-- 17. orders (22 cột) - Đơn hàng
-- 18. order_items (9 cột) - Chi tiết đơn hàng
-- 19. discounts (15 cột) - Mã giảm giá
-- 20. coupons (16 cột) - Mã khuyến mãi
-- 21. shipping_zones (10 cột) - Khu vực vận chuyển
-- 22. shipping_methods (12 cột) - Phương thức vận chuyển
-- 23. payment_methods (8 cột) - Phương thức thanh toán
-- 24. notifications (8 cột) - Thông báo
-- 25. seo_page_types (6 cột) - Loại trang SEO
-- 26. seo_pages (50+ cột) - Thông tin SEO cho từng trang
-- =====================================================
-- LƯU Ý: Table product_images đã được xóa, thay thế bằng hệ thống media tập trung
-- Ưu điểm: Quản lý tập trung, tái sử dụng, SEO tốt hơn, dễ bảo trì


-- =====================================================
-- HOÀN THÀNH TẠO TẤT CẢ TABLES (28 TABLES)
-- =====================================================

-- =====================================================
-- THÊM COMMENTS CHO TẤT CẢ TABLES VÀ COLUMNS
-- =====================================================

-- Comments cho bảng profiles
COMMENT ON TABLE profiles IS 'Bảng lưu thông tin chi tiết của người dùng, mở rộng từ auth.users';
COMMENT ON COLUMN profiles.id IS 'ID duy nhất của profile';
COMMENT ON COLUMN profiles.auth_user_id IS 'ID tham chiếu đến bảng auth.users';
COMMENT ON COLUMN profiles.first_name IS 'Tên của người dùng';
COMMENT ON COLUMN profiles.last_name IS 'Họ của người dùng';
COMMENT ON COLUMN profiles.phone IS 'Số điện thoại liên hệ';
COMMENT ON COLUMN profiles.date_of_birth IS 'Ngày sinh của người dùng';
COMMENT ON COLUMN profiles.gender IS 'Giới tính: male, female, other';
COMMENT ON COLUMN profiles.avatar_id IS 'ID tham chiếu đến bảng media cho ảnh đại diện';
COMMENT ON COLUMN profiles.role IS 'Vai trò: admin, moderator, customer';
COMMENT ON COLUMN profiles.preferences IS 'Các tùy chọn cá nhân dạng JSON';
COMMENT ON COLUMN profiles.is_verified IS 'Trạng thái xác thực tài khoản';
COMMENT ON COLUMN profiles.created_at IS 'Thời gian tạo profile';
COMMENT ON COLUMN profiles.updated_at IS 'Thời gian cập nhật profile cuối cùng';

-- Comments cho bảng user_addresses
COMMENT ON TABLE user_addresses IS 'Bảng lưu địa chỉ giao hàng và thanh toán của người dùng';
COMMENT ON COLUMN user_addresses.id IS 'ID duy nhất của địa chỉ';
COMMENT ON COLUMN user_addresses.user_id IS 'ID tham chiếu đến bảng profiles';
COMMENT ON COLUMN user_addresses.address_type IS 'Loại địa chỉ: shipping (giao hàng) hoặc billing (thanh toán)';
COMMENT ON COLUMN user_addresses.is_default IS 'Địa chỉ mặc định của người dùng';
COMMENT ON COLUMN user_addresses.recipient_name IS 'Tên người nhận hàng';
COMMENT ON COLUMN user_addresses.phone IS 'Số điện thoại người nhận';
COMMENT ON COLUMN user_addresses.address_line1 IS 'Địa chỉ dòng 1';
COMMENT ON COLUMN user_addresses.address_line2 IS 'Địa chỉ dòng 2 (tùy chọn)';
COMMENT ON COLUMN user_addresses.city IS 'Thành phố';
COMMENT ON COLUMN user_addresses.state IS 'Tỉnh/Bang';
COMMENT ON COLUMN user_addresses.postal_code IS 'Mã bưu điện';
COMMENT ON COLUMN user_addresses.country IS 'Quốc gia';
COMMENT ON COLUMN user_addresses.created_at IS 'Thời gian tạo địa chỉ';
COMMENT ON COLUMN user_addresses.updated_at IS 'Thời gian cập nhật địa chỉ cuối cùng';

-- Comments cho bảng media
COMMENT ON TABLE media IS 'Bảng trung tâm quản lý tất cả file media (hình ảnh, video, tài liệu)';
COMMENT ON COLUMN media.id IS 'ID duy nhất của media';
COMMENT ON COLUMN media.file_name IS 'Tên file gốc';
COMMENT ON COLUMN media.file_path IS 'Đường dẫn file trên server';
COMMENT ON COLUMN media.file_url IS 'URL công khai để truy cập file';
COMMENT ON COLUMN media.alt_text IS 'Văn bản thay thế cho SEO và accessibility';
COMMENT ON COLUMN media.title IS 'Tiêu đề của media';
COMMENT ON COLUMN media.meta_description IS 'Mô tả meta cho SEO';
COMMENT ON COLUMN media.meta_keywords IS 'Từ khóa meta dạng mảng';
COMMENT ON COLUMN media.caption IS 'Chú thích cho media';
COMMENT ON COLUMN media.credit IS 'Ghi công tác giả';
COMMENT ON COLUMN media.license IS 'Thông tin bản quyền';
COMMENT ON COLUMN media.file_size IS 'Kích thước file tính bằng bytes';
COMMENT ON COLUMN media.mime_type IS 'Loại MIME của file';
COMMENT ON COLUMN media.dimensions IS 'Kích thước (width, height) dạng JSON';
COMMENT ON COLUMN media.is_active IS 'Trạng thái hoạt động của media';
COMMENT ON COLUMN media.created_at IS 'Thời gian tạo media';
COMMENT ON COLUMN media.updated_at IS 'Thời gian cập nhật media cuối cùng';

-- Comments cho bảng media_relations
COMMENT ON TABLE media_relations IS 'Bảng quan hệ nhiều-nhiều giữa media và các đối tượng khác';
COMMENT ON COLUMN media_relations.id IS 'ID duy nhất của quan hệ';
COMMENT ON COLUMN media_relations.media_id IS 'ID tham chiếu đến bảng media';
COMMENT ON COLUMN media_relations.entity_type IS 'Loại đối tượng: product, blog_post, category, blog_category, user, banner';
COMMENT ON COLUMN media_relations.entity_id IS 'ID của đối tượng được liên kết';
COMMENT ON COLUMN media_relations.relation_type IS 'Loại quan hệ: primary, gallery, thumbnail, banner, hero';
COMMENT ON COLUMN media_relations.sort_order IS 'Thứ tự sắp xếp';
COMMENT ON COLUMN media_relations.is_featured IS 'Có phải là media nổi bật không';
COMMENT ON COLUMN media_relations.created_at IS 'Thời gian tạo quan hệ';

-- Comments cho bảng categories
COMMENT ON TABLE categories IS 'Bảng danh mục sản phẩm với cấu trúc phân cấp';
COMMENT ON COLUMN categories.id IS 'ID duy nhất của danh mục';
COMMENT ON COLUMN categories.name IS 'Tên danh mục';
COMMENT ON COLUMN categories.slug IS 'URL slug duy nhất cho danh mục';
COMMENT ON COLUMN categories.description IS 'Mô tả chi tiết danh mục';
COMMENT ON COLUMN categories.parent_id IS 'ID danh mục cha (để tạo cấu trúc phân cấp)';
COMMENT ON COLUMN categories.featured_image_id IS 'ID tham chiếu đến bảng media cho ảnh đại diện';
COMMENT ON COLUMN categories.product_count IS 'Số lượng sản phẩm trong danh mục (được update tự động)';
COMMENT ON COLUMN categories.is_active IS 'Trạng thái hoạt động của danh mục';
COMMENT ON COLUMN categories.sort_order IS 'Thứ tự sắp xếp hiển thị';
COMMENT ON COLUMN categories.created_at IS 'Thời gian tạo danh mục';
COMMENT ON COLUMN categories.updated_at IS 'Thời gian cập nhật danh mục cuối cùng';

-- Comments cho bảng products
COMMENT ON TABLE products IS 'Bảng chính lưu thông tin sản phẩm';
COMMENT ON COLUMN products.id IS 'ID duy nhất của sản phẩm';
COMMENT ON COLUMN products.name IS 'Tên sản phẩm';
COMMENT ON COLUMN products.slug IS 'URL slug duy nhất cho sản phẩm';
COMMENT ON COLUMN products.description IS 'Mô tả chi tiết sản phẩm';
COMMENT ON COLUMN products.short_description IS 'Mô tả ngắn gọn sản phẩm';
COMMENT ON COLUMN products.category_id IS 'ID tham chiếu đến bảng categories';
COMMENT ON COLUMN products.brand IS 'Thương hiệu sản phẩm';
COMMENT ON COLUMN products.sku IS 'Mã sản phẩm duy nhất';
COMMENT ON COLUMN products.price IS 'Giá gốc sản phẩm';
COMMENT ON COLUMN products.sale_price IS 'Giá khuyến mãi (nếu có)';
COMMENT ON COLUMN products.cost_price IS 'Giá vốn sản phẩm';
COMMENT ON COLUMN products.weight IS 'Trọng lượng sản phẩm (kg)';
COMMENT ON COLUMN products.dimensions IS 'Kích thước sản phẩm dạng JSON';
COMMENT ON COLUMN products.stock_quantity IS 'Số lượng tồn kho hiện tại';
COMMENT ON COLUMN products.min_stock_level IS 'Mức tồn kho tối thiểu để cảnh báo';
COMMENT ON COLUMN products.max_stock_level IS 'Mức tồn kho tối đa';
COMMENT ON COLUMN products.is_active IS 'Trạng thái hoạt động của sản phẩm';
COMMENT ON COLUMN products.is_featured IS 'Có phải là sản phẩm nổi bật không';
COMMENT ON COLUMN products.is_bestseller IS 'Có phải là sản phẩm bán chạy không';
COMMENT ON COLUMN products.rating IS 'Điểm đánh giá trung bình (1-5)';
COMMENT ON COLUMN products.review_count IS 'Số lượng đánh giá';
COMMENT ON COLUMN products.view_count IS 'Số lượt xem sản phẩm';
COMMENT ON COLUMN products.featured_image_id IS 'ID tham chiếu đến bảng media cho ảnh chính';
COMMENT ON COLUMN products.warranty IS 'Thời gian bảo hành';
COMMENT ON COLUMN products.return_policy IS 'Chính sách đổi trả';
COMMENT ON COLUMN products.created_at IS 'Thời gian tạo sản phẩm';
COMMENT ON COLUMN products.updated_at IS 'Thời gian cập nhật sản phẩm cuối cùng';

-- Comments cho bảng product_variants
COMMENT ON TABLE product_variants IS 'Bảng lưu các biến thể của sản phẩm (màu sắc, kích thước, v.v.)';
COMMENT ON COLUMN product_variants.id IS 'ID duy nhất của biến thể';
COMMENT ON COLUMN product_variants.product_id IS 'ID tham chiếu đến bảng products';
COMMENT ON COLUMN product_variants.variant_name IS 'Tên biến thể (ví dụ: "Đỏ - L", "Xanh - M")';
COMMENT ON COLUMN product_variants.sku IS 'Mã SKU riêng cho biến thể';
COMMENT ON COLUMN product_variants.price IS 'Giá riêng cho biến thể (nếu khác giá gốc)';
COMMENT ON COLUMN product_variants.sale_price IS 'Giá khuyến mãi cho biến thể';
COMMENT ON COLUMN product_variants.stock_quantity IS 'Số lượng tồn kho của biến thể';
COMMENT ON COLUMN product_variants.attributes IS 'Thuộc tính biến thể dạng JSON (màu, size, v.v.)';
COMMENT ON COLUMN product_variants.is_active IS 'Trạng thái hoạt động của biến thể';
COMMENT ON COLUMN product_variants.created_at IS 'Thời gian tạo biến thể';
COMMENT ON COLUMN product_variants.updated_at IS 'Thời gian cập nhật biến thể cuối cùng';

-- Comments cho bảng tags
COMMENT ON TABLE tags IS 'Bảng lưu các thẻ (tag) dùng chung cho sản phẩm và blog';
COMMENT ON COLUMN tags.id IS 'ID duy nhất của thẻ';
COMMENT ON COLUMN tags.name IS 'Tên thẻ';
COMMENT ON COLUMN tags.slug IS 'URL slug duy nhất cho thẻ';
COMMENT ON COLUMN tags.description IS 'Mô tả thẻ';
COMMENT ON COLUMN tags.color IS 'Màu sắc hiển thị cho thẻ (hex code)';
COMMENT ON COLUMN tags.tag_type IS 'Loại thẻ: general, product, blog, mixed';
COMMENT ON COLUMN tags.is_active IS 'Trạng thái hoạt động của thẻ';
COMMENT ON COLUMN tags.usage_count IS 'Số lần sử dụng thẻ';
COMMENT ON COLUMN tags.created_at IS 'Thời gian tạo thẻ';
COMMENT ON COLUMN tags.updated_at IS 'Thời gian cập nhật thẻ cuối cùng';

-- Comments cho bảng product_tags
COMMENT ON TABLE product_tags IS 'Bảng quan hệ nhiều-nhiều giữa products và tags';
COMMENT ON COLUMN product_tags.id IS 'ID duy nhất của quan hệ';
COMMENT ON COLUMN product_tags.product_id IS 'ID tham chiếu đến bảng products';
COMMENT ON COLUMN product_tags.tag_id IS 'ID tham chiếu đến bảng tags';
COMMENT ON COLUMN product_tags.created_at IS 'Thời gian tạo quan hệ';

-- Comments cho bảng blog_categories
COMMENT ON TABLE blog_categories IS 'Bảng danh mục cho blog posts';
COMMENT ON COLUMN blog_categories.id IS 'ID duy nhất của danh mục blog';
COMMENT ON COLUMN blog_categories.name IS 'Tên danh mục blog';
COMMENT ON COLUMN blog_categories.slug IS 'URL slug duy nhất cho danh mục blog';
COMMENT ON COLUMN blog_categories.description IS 'Mô tả danh mục blog';
COMMENT ON COLUMN blog_categories.featured_image_id IS 'ID tham chiếu đến bảng media cho ảnh đại diện';
COMMENT ON COLUMN blog_categories.color IS 'Màu sắc hiển thị cho danh mục';
COMMENT ON COLUMN blog_categories.is_active IS 'Trạng thái hoạt động của danh mục blog';
COMMENT ON COLUMN blog_categories.sort_order IS 'Thứ tự sắp xếp hiển thị';
COMMENT ON COLUMN blog_categories.created_at IS 'Thời gian tạo danh mục blog';
COMMENT ON COLUMN blog_categories.updated_at IS 'Thời gian cập nhật danh mục blog cuối cùng';

-- Comments cho bảng blog_posts
COMMENT ON TABLE blog_posts IS 'Bảng lưu các bài viết blog';
COMMENT ON COLUMN blog_posts.id IS 'ID duy nhất của bài viết';
COMMENT ON COLUMN blog_posts.title IS 'Tiêu đề bài viết';
COMMENT ON COLUMN blog_posts.slug IS 'URL slug duy nhất cho bài viết';
COMMENT ON COLUMN blog_posts.excerpt IS 'Tóm tắt ngắn gọn bài viết';
COMMENT ON COLUMN blog_posts.content IS 'Nội dung đầy đủ bài viết';
COMMENT ON COLUMN blog_posts.featured_image_id IS 'ID tham chiếu đến bảng media cho ảnh chính';
COMMENT ON COLUMN blog_posts.category_id IS 'ID tham chiếu đến bảng blog_categories';
COMMENT ON COLUMN blog_posts.author_id IS 'ID tham chiếu đến bảng profiles (tác giả)';
COMMENT ON COLUMN blog_posts.status IS 'Trạng thái: draft, published, archived';
COMMENT ON COLUMN blog_posts.is_featured IS 'Có phải là bài viết nổi bật không';
COMMENT ON COLUMN blog_posts.is_pinned IS 'Có phải là bài viết ghim không';
COMMENT ON COLUMN blog_posts.view_count IS 'Số lượt xem bài viết';
COMMENT ON COLUMN blog_posts.read_time IS 'Thời gian đọc ước tính (phút)';
COMMENT ON COLUMN blog_posts.published_at IS 'Thời gian xuất bản bài viết';
COMMENT ON COLUMN blog_posts.created_at IS 'Thời gian tạo bài viết';
COMMENT ON COLUMN blog_posts.updated_at IS 'Thời gian cập nhật bài viết cuối cùng';

-- Comments cho bảng blog_post_tags
COMMENT ON TABLE blog_post_tags IS 'Bảng quan hệ nhiều-nhiều giữa blog_posts và tags';
COMMENT ON COLUMN blog_post_tags.id IS 'ID duy nhất của quan hệ';
COMMENT ON COLUMN blog_post_tags.post_id IS 'ID tham chiếu đến bảng blog_posts';
COMMENT ON COLUMN blog_post_tags.tag_id IS 'ID tham chiếu đến bảng tags';
COMMENT ON COLUMN blog_post_tags.created_at IS 'Thời gian tạo quan hệ';

-- Comments cho bảng blog_comments
COMMENT ON TABLE blog_comments IS 'Bảng lưu bình luận cho blog posts';
COMMENT ON COLUMN blog_comments.id IS 'ID duy nhất của bình luận';
COMMENT ON COLUMN blog_comments.post_id IS 'ID tham chiếu đến bảng blog_posts';
COMMENT ON COLUMN blog_comments.user_id IS 'ID tham chiếu đến bảng profiles (nếu user đã đăng nhập)';
COMMENT ON COLUMN blog_comments.parent_id IS 'ID bình luận cha (để tạo cấu trúc reply)';
COMMENT ON COLUMN blog_comments.author_name IS 'Tên tác giả bình luận';
COMMENT ON COLUMN blog_comments.author_email IS 'Email tác giả bình luận';
COMMENT ON COLUMN blog_comments.content IS 'Nội dung bình luận';
COMMENT ON COLUMN blog_comments.is_approved IS 'Trạng thái duyệt bình luận';
COMMENT ON COLUMN blog_comments.is_spam IS 'Có phải là spam không';
COMMENT ON COLUMN blog_comments.created_at IS 'Thời gian tạo bình luận';
COMMENT ON COLUMN blog_comments.updated_at IS 'Thời gian cập nhật bình luận cuối cùng';

-- Comments cho bảng product_reviews
COMMENT ON TABLE product_reviews IS 'Bảng lưu đánh giá và nhận xét của khách hàng về sản phẩm';
COMMENT ON COLUMN product_reviews.id IS 'ID duy nhất của đánh giá';
COMMENT ON COLUMN product_reviews.product_id IS 'ID tham chiếu đến bảng products';
COMMENT ON COLUMN product_reviews.user_id IS 'ID tham chiếu đến bảng profiles (nếu user đã đăng nhập)';
COMMENT ON COLUMN product_reviews.reviewer_name IS 'Tên người đánh giá';
COMMENT ON COLUMN product_reviews.reviewer_email IS 'Email người đánh giá';
COMMENT ON COLUMN product_reviews.rating IS 'Điểm đánh giá (1-5)';
COMMENT ON COLUMN product_reviews.title IS 'Tiêu đề đánh giá';
COMMENT ON COLUMN product_reviews.comment IS 'Nội dung đánh giá chi tiết';
COMMENT ON COLUMN product_reviews.is_verified_purchase IS 'Có phải là khách hàng đã mua sản phẩm không';
COMMENT ON COLUMN product_reviews.is_approved IS 'Trạng thái duyệt đánh giá';
COMMENT ON COLUMN product_reviews.helpful_votes IS 'Số lượt vote hữu ích';
COMMENT ON COLUMN product_reviews.ip_address IS 'Địa chỉ IP của người đánh giá';
COMMENT ON COLUMN product_reviews.user_agent IS 'User agent của trình duyệt';
COMMENT ON COLUMN product_reviews.created_at IS 'Thời gian tạo đánh giá';
COMMENT ON COLUMN product_reviews.updated_at IS 'Thời gian cập nhật đánh giá cuối cùng';

-- Comments cho bảng cart_items
COMMENT ON TABLE cart_items IS 'Bảng lưu các sản phẩm trong giỏ hàng của người dùng';
COMMENT ON COLUMN cart_items.id IS 'ID duy nhất của item giỏ hàng';
COMMENT ON COLUMN cart_items.user_id IS 'ID tham chiếu đến bảng profiles';
COMMENT ON COLUMN cart_items.product_id IS 'ID tham chiếu đến bảng products';
COMMENT ON COLUMN cart_items.variant_id IS 'ID tham chiếu đến bảng product_variants (nếu có)';
COMMENT ON COLUMN cart_items.quantity IS 'Số lượng sản phẩm';
COMMENT ON COLUMN cart_items.price IS 'Giá sản phẩm tại thời điểm thêm vào giỏ';
COMMENT ON COLUMN cart_items.notes IS 'Ghi chú cho item';
COMMENT ON COLUMN cart_items.is_saved_for_later IS 'Có phải là item để dành sau không';
COMMENT ON COLUMN cart_items.created_at IS 'Thời gian thêm vào giỏ hàng';
COMMENT ON COLUMN cart_items.updated_at IS 'Thời gian cập nhật item cuối cùng';

-- Comments cho bảng wishlist_items
COMMENT ON TABLE wishlist_items IS 'Bảng lưu danh sách yêu thích của người dùng';
COMMENT ON COLUMN wishlist_items.id IS 'ID duy nhất của item yêu thích';
COMMENT ON COLUMN wishlist_items.user_id IS 'ID tham chiếu đến bảng profiles';
COMMENT ON COLUMN wishlist_items.product_id IS 'ID tham chiếu đến bảng products';
COMMENT ON COLUMN wishlist_items.variant_id IS 'ID tham chiếu đến bảng product_variants (nếu có)';
COMMENT ON COLUMN wishlist_items.notes IS 'Ghi chú cho item yêu thích';
COMMENT ON COLUMN wishlist_items.priority IS 'Mức độ ưu tiên (1-5)';
COMMENT ON COLUMN wishlist_items.is_active IS 'Trạng thái hoạt động của item';
COMMENT ON COLUMN wishlist_items.reminder_date IS 'Ngày nhắc nhở (nếu có)';
COMMENT ON COLUMN wishlist_items.created_at IS 'Thời gian thêm vào danh sách yêu thích';
COMMENT ON COLUMN wishlist_items.updated_at IS 'Thời gian cập nhật item cuối cùng';

-- Comments cho bảng orders
COMMENT ON TABLE orders IS 'Bảng chính lưu thông tin đơn hàng';
COMMENT ON COLUMN orders.id IS 'ID duy nhất của đơn hàng';
COMMENT ON COLUMN orders.order_number IS 'Mã đơn hàng duy nhất';
COMMENT ON COLUMN orders.user_id IS 'ID tham chiếu đến bảng profiles (có thể null nếu guest checkout)';
COMMENT ON COLUMN orders.status IS 'Trạng thái đơn hàng: pending, confirmed, processing, shipped, delivered, cancelled, refunded';
COMMENT ON COLUMN orders.order_date IS 'Thời gian đặt hàng';
COMMENT ON COLUMN orders.shipping_address_id IS 'ID tham chiếu đến bảng user_addresses cho địa chỉ giao hàng';
COMMENT ON COLUMN orders.billing_address_id IS 'ID tham chiếu đến bảng user_addresses cho địa chỉ thanh toán';
COMMENT ON COLUMN orders.subtotal IS 'Tổng tiền sản phẩm (chưa tính phí vận chuyển, thuế, giảm giá)';
COMMENT ON COLUMN orders.shipping_fee IS 'Phí vận chuyển';
COMMENT ON COLUMN orders.tax_amount IS 'Số tiền thuế';
COMMENT ON COLUMN orders.discount_amount IS 'Số tiền được giảm giá';
COMMENT ON COLUMN orders.total_amount IS 'Tổng tiền cuối cùng';
COMMENT ON COLUMN orders.payment_method IS 'Phương thức thanh toán';
COMMENT ON COLUMN orders.payment_status IS 'Trạng thái thanh toán: pending, paid, failed, refunded';
COMMENT ON COLUMN orders.shipping_method IS 'Phương thức vận chuyển';
COMMENT ON COLUMN orders.tracking_number IS 'Mã theo dõi vận chuyển';
COMMENT ON COLUMN orders.estimated_delivery IS 'Ngày dự kiến giao hàng';
COMMENT ON COLUMN orders.notes IS 'Ghi chú cho đơn hàng';
COMMENT ON COLUMN orders.created_at IS 'Thời gian tạo đơn hàng';
COMMENT ON COLUMN orders.updated_at IS 'Thời gian cập nhật đơn hàng cuối cùng';

-- Comments cho bảng order_items
COMMENT ON TABLE order_items IS 'Bảng lưu chi tiết từng sản phẩm trong đơn hàng';
COMMENT ON COLUMN order_items.id IS 'ID duy nhất của item đơn hàng';
COMMENT ON COLUMN order_items.order_id IS 'ID tham chiếu đến bảng orders';
COMMENT ON COLUMN order_items.product_id IS 'ID tham chiếu đến bảng products';
COMMENT ON COLUMN order_items.variant_id IS 'ID tham chiếu đến bảng product_variants (nếu có)';
COMMENT ON COLUMN order_items.product_name IS 'Tên sản phẩm tại thời điểm đặt hàng';
COMMENT ON COLUMN order_items.product_sku IS 'SKU sản phẩm tại thời điểm đặt hàng';
COMMENT ON COLUMN order_items.quantity IS 'Số lượng sản phẩm';
COMMENT ON COLUMN order_items.unit_price IS 'Đơn giá sản phẩm';
COMMENT ON COLUMN order_items.total_price IS 'Tổng tiền cho item này';
COMMENT ON COLUMN order_items.created_at IS 'Thời gian tạo item';

-- Comments cho bảng discounts
COMMENT ON TABLE discounts IS 'Bảng lưu các mã giảm giá';
COMMENT ON COLUMN discounts.id IS 'ID duy nhất của mã giảm giá';
COMMENT ON COLUMN discounts.code IS 'Mã giảm giá duy nhất';
COMMENT ON COLUMN discounts.name IS 'Tên mã giảm giá';
COMMENT ON COLUMN discounts.description IS 'Mô tả mã giảm giá';
COMMENT ON COLUMN discounts.discount_type IS 'Loại giảm giá: percentage (phần trăm) hoặc fixed_amount (số tiền cố định)';
COMMENT ON COLUMN discounts.discount_value IS 'Giá trị giảm giá';
COMMENT ON COLUMN discounts.min_order_amount IS 'Giá trị đơn hàng tối thiểu để áp dụng';
COMMENT ON COLUMN discounts.max_discount_amount IS 'Số tiền giảm giá tối đa';
COMMENT ON COLUMN discounts.usage_limit IS 'Giới hạn số lần sử dụng tổng cộng';
COMMENT ON COLUMN discounts.used_count IS 'Số lần đã sử dụng';
COMMENT ON COLUMN discounts.per_user_limit IS 'Giới hạn số lần sử dụng mỗi user';
COMMENT ON COLUMN discounts.is_active IS 'Trạng thái hoạt động của mã giảm giá';
COMMENT ON COLUMN discounts.starts_at IS 'Thời gian bắt đầu có hiệu lực';
COMMENT ON COLUMN discounts.expires_at IS 'Thời gian hết hạn';
COMMENT ON COLUMN discounts.created_at IS 'Thời gian tạo mã giảm giá';
COMMENT ON COLUMN discounts.updated_at IS 'Thời gian cập nhật mã giảm giá cuối cùng';

-- Comments cho bảng coupons
COMMENT ON TABLE coupons IS 'Bảng lưu các mã khuyến mãi (tương tự discounts nhưng có thêm free_shipping)';
COMMENT ON COLUMN coupons.id IS 'ID duy nhất của mã khuyến mãi';
COMMENT ON COLUMN coupons.code IS 'Mã khuyến mãi duy nhất';
COMMENT ON COLUMN coupons.name IS 'Tên mã khuyến mãi';
COMMENT ON COLUMN coupons.description IS 'Mô tả mã khuyến mãi';
COMMENT ON COLUMN coupons.discount_type IS 'Loại khuyến mãi: percentage, fixed_amount, free_shipping';
COMMENT ON COLUMN coupons.discount_value IS 'Giá trị khuyến mãi (null nếu là free_shipping)';
COMMENT ON COLUMN coupons.min_order_amount IS 'Giá trị đơn hàng tối thiểu để áp dụng';
COMMENT ON COLUMN coupons.max_discount_amount IS 'Số tiền khuyến mãi tối đa';
COMMENT ON COLUMN coupons.usage_limit IS 'Giới hạn số lần sử dụng tổng cộng';
COMMENT ON COLUMN coupons.used_count IS 'Số lần đã sử dụng';
COMMENT ON COLUMN coupons.per_user_limit IS 'Giới hạn số lần sử dụng mỗi user';
COMMENT ON COLUMN coupons.is_active IS 'Trạng thái hoạt động của mã khuyến mãi';
COMMENT ON COLUMN coupons.starts_at IS 'Thời gian bắt đầu có hiệu lực';
COMMENT ON COLUMN coupons.expires_at IS 'Thời gian hết hạn';
COMMENT ON COLUMN coupons.created_at IS 'Thời gian tạo mã khuyến mãi';
COMMENT ON COLUMN coupons.updated_at IS 'Thời gian cập nhật mã khuyến mãi cuối cùng';

-- Comments cho bảng shipping_zones
COMMENT ON TABLE shipping_zones IS 'Bảng lưu các khu vực vận chuyển';
COMMENT ON COLUMN shipping_zones.id IS 'ID duy nhất của khu vực vận chuyển';
COMMENT ON COLUMN shipping_zones.name IS 'Tên khu vực vận chuyển';
COMMENT ON COLUMN shipping_zones.description IS 'Mô tả khu vực vận chuyển';
COMMENT ON COLUMN shipping_zones.countries IS 'Danh sách quốc gia trong khu vực';
COMMENT ON COLUMN shipping_zones.states IS 'Danh sách tỉnh/bang trong khu vực';
COMMENT ON COLUMN shipping_zones.cities IS 'Danh sách thành phố trong khu vực';
COMMENT ON COLUMN shipping_zones.postal_codes IS 'Danh sách mã bưu điện trong khu vực';
COMMENT ON COLUMN shipping_zones.is_active IS 'Trạng thái hoạt động của khu vực';
COMMENT ON COLUMN shipping_zones.created_at IS 'Thời gian tạo khu vực vận chuyển';
COMMENT ON COLUMN shipping_zones.updated_at IS 'Thời gian cập nhật khu vực vận chuyển cuối cùng';

-- Comments cho bảng shipping_methods
COMMENT ON TABLE shipping_methods IS 'Bảng lưu các phương thức vận chuyển';
COMMENT ON COLUMN shipping_methods.id IS 'ID duy nhất của phương thức vận chuyển';
COMMENT ON COLUMN shipping_methods.name IS 'Tên phương thức vận chuyển';
COMMENT ON COLUMN shipping_methods.description IS 'Mô tả phương thức vận chuyển';
COMMENT ON COLUMN shipping_methods.shipping_zone_id IS 'ID tham chiếu đến bảng shipping_zones';
COMMENT ON COLUMN shipping_methods.base_price IS 'Phí cơ bản';
COMMENT ON COLUMN shipping_methods.price_per_kg IS 'Phí tính theo kg (nếu có)';
COMMENT ON COLUMN shipping_methods.estimated_days_min IS 'Số ngày vận chuyển tối thiểu';
COMMENT ON COLUMN shipping_methods.estimated_days_max IS 'Số ngày vận chuyển tối đa';
COMMENT ON COLUMN shipping_methods.is_active IS 'Trạng thái hoạt động của phương thức vận chuyển';
COMMENT ON COLUMN shipping_methods.sort_order IS 'Thứ tự sắp xếp hiển thị';
COMMENT ON COLUMN shipping_methods.created_at IS 'Thời gian tạo phương thức vận chuyển';
COMMENT ON COLUMN shipping_methods.updated_at IS 'Thời gian cập nhật phương thức vận chuyển cuối cùng';

-- Comments cho bảng payment_methods
COMMENT ON TABLE payment_methods IS 'Bảng lưu các phương thức thanh toán';
COMMENT ON COLUMN payment_methods.id IS 'ID duy nhất của phương thức thanh toán';
COMMENT ON COLUMN payment_methods.name IS 'Tên phương thức thanh toán';
COMMENT ON COLUMN payment_methods.code IS 'Mã phương thức thanh toán duy nhất';
COMMENT ON COLUMN payment_methods.description IS 'Mô tả phương thức thanh toán';
COMMENT ON COLUMN payment_methods.is_active IS 'Trạng thái hoạt động của phương thức thanh toán';
COMMENT ON COLUMN payment_methods.sort_order IS 'Thứ tự sắp xếp hiển thị';
COMMENT ON COLUMN payment_methods.created_at IS 'Thời gian tạo phương thức thanh toán';
COMMENT ON COLUMN payment_methods.updated_at IS 'Thời gian cập nhật phương thức thanh toán cuối cùng';

-- Comments cho bảng notifications
COMMENT ON TABLE notifications IS 'Bảng lưu thông báo cho người dùng';
COMMENT ON COLUMN notifications.id IS 'ID duy nhất của thông báo';
COMMENT ON COLUMN notifications.user_id IS 'ID tham chiếu đến bảng profiles';
COMMENT ON COLUMN notifications.type IS 'Loại thông báo: order_status, promotion, system, security';
COMMENT ON COLUMN notifications.title IS 'Tiêu đề thông báo';
COMMENT ON COLUMN notifications.message IS 'Nội dung thông báo';
COMMENT ON COLUMN notifications.is_read IS 'Trạng thái đã đọc thông báo';
COMMENT ON COLUMN notifications.data IS 'Dữ liệu bổ sung dạng JSON';
COMMENT ON COLUMN notifications.created_at IS 'Thời gian tạo thông báo';

-- Comments cho bảng seo_page_types
COMMENT ON TABLE seo_page_types IS 'Bảng lưu các loại trang để phân loại SEO';
COMMENT ON COLUMN seo_page_types.id IS 'ID duy nhất của loại trang (auto increment)';
COMMENT ON COLUMN seo_page_types.name IS 'Tên loại trang (unique)';
COMMENT ON COLUMN seo_page_types.display_name IS 'Tên hiển thị cho người dùng';
COMMENT ON COLUMN seo_page_types.description IS 'Mô tả loại trang';
COMMENT ON COLUMN seo_page_types.is_active IS 'Trạng thái hoạt động của loại trang';
COMMENT ON COLUMN seo_page_types.sort_order IS 'Thứ tự sắp xếp hiển thị';
COMMENT ON COLUMN seo_page_types.created_at IS 'Thời gian tạo loại trang';

-- Comments cho bảng seo_pages
COMMENT ON TABLE seo_pages IS 'Bảng trung tâm lưu tất cả thông tin SEO cho từng trang';
COMMENT ON COLUMN seo_pages.id IS 'ID duy nhất của trang SEO';
COMMENT ON COLUMN seo_pages.page_type_id IS 'ID tham chiếu đến bảng seo_page_types';
COMMENT ON COLUMN seo_pages.page_url IS 'URL của trang (unique)';
COMMENT ON COLUMN seo_pages.page_title IS 'Tiêu đề trang (title tag)';
COMMENT ON COLUMN seo_pages.meta_description IS 'Mô tả meta (meta description)';
COMMENT ON COLUMN seo_pages.meta_keywords IS 'Từ khóa meta dạng mảng';
COMMENT ON COLUMN seo_pages.reference_type IS 'Loại đối tượng tham chiếu: product, category, user, page';
COMMENT ON COLUMN seo_pages.reference_id IS 'ID của đối tượng tham chiếu';
COMMENT ON COLUMN seo_pages.og_title IS 'Tiêu đề Open Graph';
COMMENT ON COLUMN seo_pages.og_description IS 'Mô tả Open Graph';
COMMENT ON COLUMN seo_pages.og_image IS 'Ảnh Open Graph';
COMMENT ON COLUMN seo_pages.og_type IS 'Loại Open Graph (mặc định: website)';
COMMENT ON COLUMN seo_pages.og_site_name IS 'Tên website cho Open Graph';
COMMENT ON COLUMN seo_pages.og_locale IS 'Ngôn ngữ cho Open Graph (mặc định: vi_VN)';
COMMENT ON COLUMN seo_pages.twitter_card IS 'Loại Twitter Card (mặc định: summary_large_image)';
COMMENT ON COLUMN seo_pages.twitter_title IS 'Tiêu đề Twitter';
COMMENT ON COLUMN seo_pages.twitter_description IS 'Mô tả Twitter';
COMMENT ON COLUMN seo_pages.twitter_image IS 'Ảnh Twitter';
COMMENT ON COLUMN seo_pages.schema_markup IS 'Schema.org markup dạng JSON';
COMMENT ON COLUMN seo_pages.core_web_vitals IS 'Chỉ số Core Web Vitals dạng JSON';
COMMENT ON COLUMN seo_pages.ai_ml_metrics IS 'Chỉ số AI/ML dạng JSON';
COMMENT ON COLUMN seo_pages.eeat_metrics IS 'Chỉ số E-E-A-T dạng JSON';
COMMENT ON COLUMN seo_pages.voice_visual_metrics IS 'Chỉ số Voice và Visual dạng JSON';
COMMENT ON COLUMN seo_pages.privacy_compliance IS 'Chỉ số tuân thủ quyền riêng tư dạng JSON';
COMMENT ON COLUMN seo_pages.future_metrics IS 'Chỉ số tương lai dạng JSON';
COMMENT ON COLUMN seo_pages.canonical_url IS 'URL canonical';
COMMENT ON COLUMN seo_pages.robots_directive IS 'Chỉ thị robots (mặc định: index,follow)';
COMMENT ON COLUMN seo_pages.hreflang IS 'Thông tin hreflang dạng JSON';
COMMENT ON COLUMN seo_pages.language IS 'Ngôn ngữ trang (mặc định: vi)';
COMMENT ON COLUMN seo_pages.charset IS 'Bộ ký tự (mặc định: UTF-8)';
COMMENT ON COLUMN seo_pages.viewport IS 'Viewport meta tag (mặc định: width=device-width, initial-scale=1)';
COMMENT ON COLUMN seo_pages.seo_score IS 'Điểm SEO tổng thể (0-100)';
COMMENT ON COLUMN seo_pages.keyword_difficulty IS 'Độ khó từ khóa';
COMMENT ON COLUMN seo_pages.search_volume IS 'Lượt tìm kiếm từ khóa';
COMMENT ON COLUMN seo_pages.page_load_time IS 'Thời gian tải trang (giây)';
COMMENT ON COLUMN seo_pages.mobile_friendly_score IS 'Điểm thân thiện mobile (0-100)';
COMMENT ON COLUMN seo_pages.accessibility_score IS 'Điểm accessibility (0-100)';
COMMENT ON COLUMN seo_pages.core_web_vitals_score IS 'Điểm Core Web Vitals (0-100)';
COMMENT ON COLUMN seo_pages.social_shares IS 'Số lượt chia sẻ mạng xã hội';
COMMENT ON COLUMN seo_pages.social_engagement IS 'Tỷ lệ tương tác mạng xã hội';
COMMENT ON COLUMN seo_pages.social_click_through_rate IS 'Tỷ lệ click-through mạng xã hội (%)';
COMMENT ON COLUMN seo_pages.content_length IS 'Độ dài nội dung (số ký tự)';
COMMENT ON COLUMN seo_pages.content_readability_score IS 'Điểm khả năng đọc nội dung (0-100)';
COMMENT ON COLUMN seo_pages.content_freshness_score IS 'Điểm độ mới của nội dung (0-100)';
COMMENT ON COLUMN seo_pages.internal_links_count IS 'Số liên kết nội bộ';
COMMENT ON COLUMN seo_pages.external_links_count IS 'Số liên kết ngoài';
COMMENT ON COLUMN seo_pages.broken_links_count IS 'Số liên kết bị hỏng';
COMMENT ON COLUMN seo_pages.image_optimization_score IS 'Điểm tối ưu hóa hình ảnh (0-100)';
COMMENT ON COLUMN seo_pages.is_active IS 'Trạng thái hoạt động của trang SEO';
COMMENT ON COLUMN seo_pages.is_featured IS 'Có phải là trang SEO nổi bật không';
COMMENT ON COLUMN seo_pages.is_indexed IS 'Trạng thái được index bởi search engine';
COMMENT ON COLUMN seo_pages.is_ssl_secure IS 'Trạng thái bảo mật SSL';
COMMENT ON COLUMN seo_pages.created_at IS 'Thời gian tạo trang SEO';
COMMENT ON COLUMN seo_pages.updated_at IS 'Thời gian cập nhật trang SEO cuối cùng';

-- =====================================================
-- HOÀN THÀNH THÊM COMMENTS CHO TẤT CẢ TABLES VÀ COLUMNS
-- =====================================================

-- =====================================================
-- THÔNG BÁO HOÀN THÀNH TẠO TABLES
-- =====================================================
SELECT 
    '=== HOÀN THÀNH TẠO TẤT CẢ TABLES ===' as info,
    '✅ Đã tạo 26 tables chính' as step1,
    '✅ Đã tạo 2 tables SEO' as step2,
    '✅ Đã tạo 60+ indexes' as step3,
    '✅ Đã tạo 25+ triggers' as step4,
    '✅ Đã tạo 10+ functions' as step5,
    '✅ Đã tạo comments cho tất cả tables' as step6,
    '✅ Database schema đã sẵn sàng cho dữ liệu' as step7;

-- =====================================================
-- HOÀN THÀNH TẠO TẤT CẢ TABLES (28 TABLES)
-- =====================================================
