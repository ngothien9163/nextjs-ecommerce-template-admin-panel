-- =====================================================
-- CHECK PERMISSIONS & RLS STATUS - SCRIPT TỔNG HỢP
-- =====================================================
-- Script này kiểm tra permissions và RLS status
-- Chạy để debug khi gặp lỗi permissions

-- =====================================================
-- BƯỚC 1: KIỂM TRA RLS STATUS CHO TẤT CẢ TABLES
-- =====================================================

SELECT 
    '=== KIỂM TRA RLS STATUS ===' as info;

SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public'
   AND tablename IN ('medias', 'categories', 'products', 'blog_posts', 'blog_categories', 'tags', 'profiles', 'orders', 'product_variants')
   ORDER BY tablename;

-- =====================================================
-- BƯỚC 2: KIỂM TRA TẤT CẢ POLICIES HIỆN TẠI
-- =====================================================

SELECT 
    '=== KIỂM TRA TẤT CẢ POLICIES ===' as info;

SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- =====================================================
-- BƯỚC 3: KIỂM TRA PERMISSIONS CHO MEDIA TABLE
-- =====================================================

SELECT 
    '=== KIỂM TRA MEDIA TABLE POLICIES ===' as info;

SELECT 
    schemaname,
    tablename,
    policyname,
    cmd as operation,
    CASE 
        WHEN cmd = 'SELECT' THEN 'Read'
        WHEN cmd = 'INSERT' THEN 'Create' 
        WHEN cmd = 'UPDATE' THEN 'Update'
        WHEN cmd = 'DELETE' THEN 'Delete'
        ELSE 'Other'
    END as permission_type
FROM pg_policies
WHERE tablename = 'medias'
ORDER BY cmd;

-- =====================================================
-- BƯỚC 4: TEST TRUY CẬP MEDIA TABLE
-- =====================================================

SELECT 
    '=== TESTING MEDIA TABLE ACCESS ===' as test_info;

-- Đếm số records trong medias table
SELECT
    COUNT(*) as total_media_records,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active_records,
    COUNT(CASE WHEN file_url IS NOT NULL THEN 1 END) as records_with_url
FROM medias;

-- Hiển thị một vài record mẫu
SELECT 
    id,
    file_name,
    LEFT(file_url, 50) as file_url_preview,
    image_format,
    file_size_kb,
    is_active,
    created_at
FROM medias
ORDER BY created_at DESC
LIMIT 5;

-- =====================================================
-- BƯỚC 5: KIỂM TRA STRUCTURE CỦA MEDIA TABLE
-- =====================================================

SELECT 
    '=== KIỂM TRA MEDIA TABLE STRUCTURE ===' as info;

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public'
   AND table_name = 'medias'
   ORDER BY ordinal_position;

-- =====================================================
-- BƯỚC 6: KIỂM TRA CONSTRAINTS
-- =====================================================

SELECT 
    '=== KIỂM TRA CONSTRAINTS ===' as info;

SELECT 
    constraint_name,
    constraint_type,
    table_name
FROM information_schema.table_constraints 
WHERE table_schema = 'public'
   AND table_name = 'medias';

-- =====================================================
-- BƯỚC 7: TEST TRUY CẬP CÁC TABLES KHÁC
-- =====================================================

SELECT 
    '=== TESTING OTHER TABLES ACCESS ===' as test_info;

-- Test categories
SELECT 
    'categories' as table_name,
    COUNT(*) as record_count
FROM categories
UNION ALL
-- Test products
SELECT 
    'products' as table_name,
    COUNT(*) as record_count
FROM products
UNION ALL
-- Test profiles
SELECT 
    'profiles' as table_name,
    COUNT(*) as record_count
FROM profiles
UNION ALL
-- Test orders
SELECT 
    'orders' as table_name,
    COUNT(*) as record_count
FROM orders;

-- =====================================================
-- BƯỚC 8: SUMMARY REPORT
-- =====================================================

SELECT 
    '=== PERMISSION CHECK SUMMARY ===' as summary,
    (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'medias') as media_policies_count,
    (SELECT rowsecurity FROM pg_tables WHERE tablename = 'medias' AND schemaname = 'public') as media_rls_enabled,
    (SELECT COUNT(*) FROM medias) as total_media_records,
    (SELECT COUNT(*) FROM categories) as total_categories_records,
    (SELECT COUNT(*) FROM products) as total_products_records;

-- =====================================================
-- BƯỚC 9: KIỂM TRA SCHEMA PERMISSIONS
-- =====================================================

SELECT 
    '=== KIỂM TRA SCHEMA PERMISSIONS ===' as info;

SELECT 
    n.nspname as schema_name,
    r.rolname as role_name,
    CASE 
        WHEN has_schema_privilege(r.oid, n.oid, 'USAGE') THEN 'USAGE'
        WHEN has_schema_privilege(r.oid, n.oid, 'CREATE') THEN 'CREATE'
        ELSE 'NO ACCESS'
    END as privilege_type
FROM pg_namespace n
CROSS JOIN pg_roles r
WHERE n.nspname = 'public'
AND r.rolname IN ('public', 'postgres', 'authenticated', 'anon')
ORDER BY r.rolname;

-- =====================================================
-- THÔNG BÁO HOÀN THÀNH
-- =====================================================

SELECT 
    '=== HOÀN THÀNH CHECK PERMISSIONS ===' as info,
    '✅ Đã kiểm tra RLS status cho tất cả tables' as step1,
    '✅ Đã kiểm tra policies cho tất cả tables' as step2,
    '✅ Đã test truy cập medias table' as step3,
    '✅ Đã kiểm tra structure và constraints' as step4,
    '✅ Đã tạo summary report' as step5;

-- =====================================================
-- HƯỚNG DẪN TIẾP THEO
-- =====================================================

SELECT 
    '=== HƯỚNG DẪN TIẾP THEO ===' as next_steps,
    '1. Nếu media table không có policies, chạy: sqls/04-setup-rls-policies.sql' as step1,
    '2. Nếu schema permissions bị lỗi, chạy: sqls/01-fix-database-permissions.sql' as step2,
    '3. Nếu tables chưa tồn tại, chạy: sqls/02-create-all-tables.sql' as step3,
    '4. Test ứng dụng: http://localhost:5173/categories' as step4;

-- =====================================================
-- HOÀN THÀNH CHECK PERMISSIONS
-- =====================================================
