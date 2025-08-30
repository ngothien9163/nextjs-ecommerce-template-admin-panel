-- =====================================================
-- MASTER SCRIPT: SETUP TOÀN BỘ DATABASE
-- =====================================================

-- =====================================================
-- HƯỚNG DẪN SỬ DỤNG:
-- =====================================================
-- 1. Chạy script này để setup toàn bộ database
-- 2. Script sẽ tạo tất cả tables, insert dữ liệu mẫu, và tạo materialized views
-- 3. Thời gian chạy: ~2-3 phút tùy theo database size

-- =====================================================
-- BƯỚC 1: TẠO TẤT CẢ TABLES (BAO GỒM SEO TABLES)
-- =====================================================
\i sqls/01-create-all-tables.sql

-- =====================================================
-- BƯỚC 2: INSERT DỮ LIỆU MẪU CHO TẤT CẢ TABLES (BAO GỒM SEO)
-- =====================================================
\i sqls/02-insert-all-data.sql

-- =====================================================
-- BƯỚC 3: TẠO MATERIALIZED VIEWS CHO PERFORMANCE
-- =====================================================
\i sqls/03-create-materialized-views.sql

-- =====================================================
-- BƯỚC 4: KIỂM TRA KẾT QUẢ SETUP
-- =====================================================

-- Kiểm tra số lượng records trong từng bảng chính
SELECT 
    '=== KẾT QUẢ SETUP DATABASE ===' as info;

SELECT 
    'Profiles' as table_name,
    COUNT(*) as record_count
FROM profiles
UNION ALL
SELECT 
    'Categories' as table_name,
    COUNT(*) as record_count
FROM categories
UNION ALL
SELECT 
    'Products' as table_name,
    COUNT(*) as record_count
FROM products
UNION ALL
SELECT 
    'Product Variants' as table_name,
    COUNT(*) as record_count
FROM product_variants
UNION ALL
SELECT 
    'Media' as table_name,
    COUNT(*) as record_count
FROM media
UNION ALL
SELECT 
    'SEO Pages' as table_name,
    COUNT(*) as record_count
FROM seo_pages
UNION ALL
SELECT 
    'Blog Posts' as table_name,
    COUNT(*) as record_count
FROM blog_posts
UNION ALL
SELECT 
    'Orders' as table_name,
    COUNT(*) as record_count
FROM orders;

-- Kiểm tra product_count trong categories
SELECT 
    '=== KIỂM TRA PRODUCT_COUNT ===' as info;

SELECT 
    name,
    slug,
    product_count,
    (SELECT COUNT(*) FROM products WHERE category_id = c.id AND is_active = true) as actual_count
FROM categories c
ORDER BY sort_order;

-- Kiểm tra materialized views
SELECT 
    '=== KIỂM TRA MATERIALIZED VIEWS ===' as info;

SELECT 
    schemaname,
    matviewname,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||matviewname)) as size
FROM pg_matviews 
WHERE schemaname = 'public' AND matviewname LIKE 'categories%';

-- Kiểm tra hiệu suất materialized view
SELECT 
    '=== KIỂM TRA HIỆU SUẤT ===' as info;

EXPLAIN (ANALYZE, BUFFERS) 
SELECT id, name, slug, image_url, image_alt
FROM categories_display
ORDER BY sort_order
LIMIT 5;

-- =====================================================
-- BƯỚC 5: THÔNG BÁO HOÀN THÀNH
-- =====================================================

SELECT 
    '=== HOÀN THÀNH SETUP DATABASE ===' as info,
    '✅ Tất cả tables đã được tạo' as step1,
    '✅ Dữ liệu mẫu đã được insert' as step2,
    '✅ SEO system đã được setup' as step3,
    '✅ Materialized views đã được tạo' as step4,
    '✅ Triggers và functions đã được tạo' as step5,
    '✅ Indexes đã được tạo cho performance' as step6;

SELECT 
    '=== BƯỚC TIẾP THEO ===' as next_steps,
    '1. Truy cập http://localhost:3000 để xem website' as step1,
    '2. Sử dụng Materialized Views trong API: categories_display' as step2,
    '3. Quản lý SEO qua bảng seo_pages' as step3,
    '4. Thêm sản phẩm mới qua bảng products' as step4;

-- =====================================================
-- HOÀN THÀNH SETUP TOÀN BỘ DATABASE
-- =====================================================
