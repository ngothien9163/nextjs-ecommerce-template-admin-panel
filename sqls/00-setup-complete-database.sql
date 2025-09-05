-- =====================================================
-- MASTER SCRIPT: SETUP TOÀN BỘ DATABASE
-- =====================================================

-- =====================================================
-- HƯỚNG DẪN SỬ DỤNG:
-- =====================================================
-- 1. Chạy script này để setup toàn bộ database
-- 2. Script sẽ tạo tất cả tables và insert dữ liệu mẫu
-- 3. Thời gian chạy: ~1-2 phút tùy theo database size

-- =====================================================
-- BƯỚC 1: TẠO TẤT CẢ TABLES (BAO GỒM SEO TABLES)
-- =====================================================
\i sqls/01-create-all-tables.sql

-- =====================================================
-- BƯỚC 2: INSERT DỮ LIỆU MẪU CHO TẤT CẢ TABLES
-- =====================================================
\i sqls/02-insert-all-data.sql

-- =====================================================
-- BƯỚC 3: KIỂM TRA KẾT QUẢ SETUP
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
FROM medias
UNION ALL
SELECT 
    'SEO Medias' as table_name,
    COUNT(*) as record_count
FROM seo_medias
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

-- Kiểm tra indexes và triggers
SELECT 
    '=== KIỂM TRA INDEXES VÀ TRIGGERS ===' as info;

SELECT 
    'Indexes' as type,
    COUNT(*) as count
FROM pg_indexes 
WHERE schemaname = 'public'
UNION ALL
SELECT 
    'Triggers' as type,
    COUNT(*) as count
FROM pg_trigger 
WHERE tgrelid IN (
    SELECT oid FROM pg_class 
    WHERE relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
);

-- =====================================================
-- BƯỚC 4: THÔNG BÁO HOÀN THÀNH
-- =====================================================

SELECT 
    '=== HOÀN THÀNH SETUP DATABASE ===' as info,
    '✅ Tất cả tables đã được tạo (30 tables chính + 3 tables SEO)' as step1,
    '✅ Dữ liệu mẫu đã được insert' as step2,
    '✅ SEO system đã được setup' as step3,
    '✅ Triggers và functions đã được tạo' as step4,
    '✅ Indexes đã được tạo cho performance' as step5;

SELECT 
    '=== BƯỚC TIẾP THEO ===' as next_steps,
    '1. Truy cập http://localhost:3000 để xem website' as step1,
    '2. Quản lý SEO qua bảng seo_pages' as step2,
    '3. Quản lý SEO media qua bảng seo_medias' as step3,
    '4. Thêm sản phẩm mới qua bảng products' as step4,
    '5. Setup Supabase Storage (nếu cần): chạy sqls/02-setup-supabase-storage.sql' as step5;

-- =====================================================
-- HOÀN THÀNH SETUP TOÀN BỘ DATABASE
-- =====================================================
