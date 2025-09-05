-- =====================================================
-- SUPABASE STORAGE SETUP FOR MEDIA MANAGEMENT
-- =====================================================

-- LƯU Ý QUAN TRỌNG: 
-- 1. File này chỉ tạo policies cho storage.objects
-- 2. Bucket 'media' phải được tạo thủ công trong Supabase Dashboard
-- 3. RLS đã được enable sẵn bởi Supabase

-- =====================================================
-- BƯỚC 1: TẠO BUCKET 'MEDIA' (THỦ CÔNG TRONG DASHBOARD)
-- =====================================================
-- 1. Vào Supabase Dashboard > Storage
-- 2. Click "New Bucket"
-- 3. Name: "medias"
-- 4. Public: true
-- 5. File size limit: 50MB
-- 6. Allowed MIME types: image/*, video/*, application/pdf

-- =====================================================
-- BƯỚC 2: TẠO POLICIES CHO STORAGE.OBJECTS
-- =====================================================

-- Xóa policies cũ nếu có (để tránh conflict)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;
DROP POLICY IF EXISTS "Service role full access" ON storage.objects;

-- Policy 1: Cho phép public đọc files từ bucket 'media'
CREATE POLICY "Public Access" ON storage.objects 
FOR SELECT USING (bucket_id = 'medias');

-- Policy 2: Cho phép authenticated users upload vào bucket 'media'
CREATE POLICY "Authenticated users can upload" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id = 'medias' 
  AND auth.role() = 'authenticated'
);

-- Policy 3: Cho phép authenticated users update files trong bucket 'media'
CREATE POLICY "Authenticated users can update" ON storage.objects 
FOR UPDATE USING (
  bucket_id = 'medias' 
  AND auth.role() = 'authenticated'
);

-- Policy 4: Cho phép authenticated users delete files trong bucket 'media'
CREATE POLICY "Authenticated users can delete" ON storage.objects 
FOR DELETE USING (
  bucket_id = 'medias' 
  AND auth.role() = 'authenticated'
);

-- Policy 5: Cho phép service role full access (cho admin panel)
CREATE POLICY "Service role full access" ON storage.objects 
FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- BƯỚC 3: KIỂM TRA POLICIES ĐÃ TẠO
-- =====================================================
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
WHERE tablename = 'objects' 
AND schemaname = 'storage'
ORDER BY policyname;

-- =====================================================
-- BƯỚC 4: VERIFICATION QUERIES
-- =====================================================

-- Kiểm tra bucket tồn tại
SELECT 
  '=== KIỂM TRA BUCKET MEDIA ===' as info;

SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
WHERE id = 'medias';

-- Kiểm tra RLS status
SELECT 
  '=== KIỂM TRA RLS STATUS ===' as info;

SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE tablename = 'objects' 
AND schemaname = 'storage';

-- =====================================================
-- BƯỚC 5: TEST POLICIES (TÙY CHỌN)
-- =====================================================
-- Lưu ý: Chạy các lệnh này trong Supabase SQL Editor để test

-- Test public read access
-- SELECT * FROM storage.objects WHERE bucket_id = 'medias' LIMIT 1;

-- Test authenticated upload (cần đăng nhập)
-- INSERT INTO storage.objects (bucket_id, name, owner, metadata) 
-- VALUES ('media', 'test.txt', auth.uid(), '{"size": 100}');

-- =====================================================
-- BƯỚC 6: CẤU HÌNH BUCKET SETTINGS (THỰC HIỆN TRONG DASHBOARD)
-- =====================================================
-- 1. Vào Storage > media bucket > Settings
-- 2. File size limit: 50MB
-- 3. Allowed MIME types: image/*, video/*, application/pdf
-- 4. Public bucket: true

-- =====================================================
-- BƯỚC 7: CẤU HÌNH CORS (THỰC HIỆN TRONG DASHBOARD)
-- =====================================================
-- 1. Vào Settings > API > CORS
-- 2. Thêm domain của frontend (VD: http://localhost:3000)
-- 3. Đảm bảo credentials: true

-- =====================================================
-- HOÀN THÀNH SETUP STORAGE
-- =====================================================
SELECT 
  '=== HOÀN THÀNH SETUP SUPABASE STORAGE ===' as info,
  '✅ Đã tạo policies cho storage.objects' as step1,
  '✅ Bucket media cần được tạo thủ công trong Dashboard' as step2,
  '✅ CORS cần được cấu hình trong Dashboard' as step3,
  '✅ Storage system đã sẵn sàng sử dụng' as step4;

-- =====================================================
-- HƯỚNG DẪN SỬ DỤNG
-- =====================================================
-- 1. Tạo bucket 'medias' trong Supabase Dashboard
-- 2. Cấu hình CORS cho frontend domain
-- 3. Sử dụng Supabase Storage API để upload/download files
-- 4. Files sẽ được lưu trong bucket 'medias' với policies đã tạo

-- =====================================================
-- TROUBLESHOOTING
-- =====================================================

-- Nếu gặp lỗi "row-level security policy":
-- 1. Kiểm tra bucket 'media' đã được tạo chưa
-- 2. Kiểm tra policies đã được tạo đúng chưa
-- 3. Kiểm tra user có quyền authenticated không

-- Nếu gặp lỗi "bucket not found":
-- 1. Tạo bucket 'medias' trong Supabase Dashboard
-- 2. Đảm bảo bucket public
-- 3. Kiểm tra file size limit

-- Nếu gặp lỗi CORS:
-- 1. Vào Settings > API > CORS
-- 2. Thêm domain của frontend
-- 3. Đảm bảo credentials: true
