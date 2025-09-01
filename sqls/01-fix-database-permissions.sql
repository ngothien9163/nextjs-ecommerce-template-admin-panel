-- =====================================================
-- FIX DATABASE PERMISSIONS - SCRIPT TỔNG HỢP
-- =====================================================
-- Script này gom tất cả các fix permissions cần thiết
-- Chạy script này để fix lỗi "permission denied for schema public"

-- =====================================================
-- BƯỚC 1: TẠO VÀ CẤP QUYỀN CHO SCHEMA PUBLIC
-- =====================================================

-- Tạo schema public nếu không tồn tại
CREATE SCHEMA IF NOT EXISTS public;

-- Cấp quyền cho schema public
GRANT USAGE ON SCHEMA public TO public;
GRANT CREATE ON SCHEMA public TO public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT CREATE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- =====================================================
-- BƯỚC 2: CẤP QUYỀN CHO TẤT CẢ TABLES HIỆN CÓ
-- =====================================================

-- Cấp quyền cho tất cả tables
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO public;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Cấp quyền cho sequences
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO public;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Cấp quyền cho functions
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO public;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon;

-- =====================================================
-- BƯỚC 3: ĐẶT QUYỀN MẶC ĐỊNH CHO OBJECTS MỚI
-- =====================================================

-- Đặt quyền mặc định cho tables mới
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO public;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon;

-- Đặt quyền mặc định cho sequences mới
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO public;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE ON SEQUENCES TO anon;

-- Đặt quyền mặc định cho functions mới
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON FUNCTIONS TO public;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO anon;

-- =====================================================
-- BƯỚC 4: KIỂM TRA KẾT QUẢ
-- =====================================================

-- Kiểm tra schema public
SELECT 
    '=== KIỂM TRA SCHEMA PUBLIC ===' as info;

SELECT 
    nspname as schema_name,
    (SELECT rolname FROM pg_roles WHERE oid = nspowner) as owner_name
FROM pg_namespace 
WHERE nspname = 'public';

-- Kiểm tra số lượng tables
SELECT 
    '=== KIỂM TRA SỐ LƯỢNG TABLES ===' as info;

SELECT 
    COUNT(*) as table_count
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';

-- Liệt kê tables chính
SELECT 
    '=== DANH SÁCH TABLES CHÍNH ===' as info;

SELECT 
    table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
AND table_name IN ('categories', 'products', 'media', 'profiles', 'orders')
ORDER BY table_name;

-- =====================================================
-- THÔNG BÁO HOÀN THÀNH
-- =====================================================

SELECT 
    '=== HOÀN THÀNH FIX PERMISSIONS ===' as info,
    '✅ Đã cấp quyền cho schema public' as step1,
    '✅ Đã cấp quyền cho tất cả tables' as step2,
    '✅ Đã đặt quyền mặc định cho objects mới' as step3,
    '✅ Schema public đã sẵn sàng sử dụng' as step4;

-- =====================================================
-- HƯỚNG DẪN TIẾP THEO
-- =====================================================

SELECT 
    '=== HƯỚNG DẪN TIẾP THEO ===' as next_steps,
    '1. Nếu chưa có tables, chạy: sqls/02-create-all-tables.sql' as step1,
    '2. Nếu chưa có dữ liệu, chạy: sqls/03-insert-all-data.sql' as step2,
    '3. Setup RLS policies: sqls/04-setup-rls-policies.sql' as step3,
    '4. Test ứng dụng: http://localhost:5173/categories' as step4;

-- =====================================================
-- HOÀN THÀNH FIX DATABASE PERMISSIONS
-- =====================================================
