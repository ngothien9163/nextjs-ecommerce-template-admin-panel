-- =====================================================
-- SUPABASE STORAGE SETUP FOR MEDIA MANAGEMENT
-- =====================================================

-- Bước 1: Tạo bucket 'media' (nếu chưa có)
-- Lưu ý: Bucket phải được tạo thủ công trong Supabase Dashboard
-- Vào Storage > New Bucket > Name: "media" > Public: true

-- Bước 2: Enable RLS cho storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Bước 3: Tạo policies cho bucket 'media'

-- Policy 1: Cho phép public đọc files
CREATE POLICY "Public Access" ON storage.objects 
FOR SELECT USING (bucket_id = 'media');

-- Policy 2: Cho phép authenticated users upload
CREATE POLICY "Authenticated users can upload" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id = 'media' 
  AND auth.role() = 'authenticated'
);

-- Policy 3: Cho phép authenticated users update files
CREATE POLICY "Authenticated users can update" ON storage.objects 
FOR UPDATE USING (
  bucket_id = 'media' 
  AND auth.role() = 'authenticated'
);

-- Policy 4: Cho phép authenticated users delete files
CREATE POLICY "Authenticated users can delete" ON storage.objects 
FOR DELETE USING (
  bucket_id = 'media' 
  AND auth.role() = 'authenticated'
);

-- Policy 5: Cho phép service role full access (cho admin panel)
CREATE POLICY "Service role full access" ON storage.objects 
FOR ALL USING (auth.role() = 'service_role');

-- Bước 4: Kiểm tra policies đã tạo
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
AND schemaname = 'storage';

-- Bước 5: Test policies
-- Lưu ý: Chạy các lệnh này trong Supabase SQL Editor để test

-- Test public read access
-- SELECT * FROM storage.objects WHERE bucket_id = 'media' LIMIT 1;

-- Test authenticated upload (cần đăng nhập)
-- INSERT INTO storage.objects (bucket_id, name, owner, metadata) 
-- VALUES ('media', 'test.txt', auth.uid(), '{"size": 100}');

-- Bước 6: Cấu hình bucket settings (thực hiện trong Dashboard)
-- 1. Vào Storage > media bucket > Settings
-- 2. File size limit: 50MB
-- 3. Allowed MIME types: image/*, video/*, application/pdf
-- 4. Public bucket: true

-- Bước 7: Tạo function để cleanup old files (tùy chọn)
-- CREATE OR REPLACE FUNCTION cleanup_old_media_files()
-- RETURNS void AS $$
-- BEGIN
  -- -- Xóa files cũ hơn 1 năm
  -- DELETE FROM storage.objects 
  -- WHERE bucket_id = 'media' 
  -- AND created_at < NOW() - INTERVAL '1 year';
  
  -- -- Xóa records trong media table tương ứng
  -- DELETE FROM media 
  -- WHERE created_at < NOW() - INTERVAL '1 year';
-- END;
-- $$ LANGUAGE plpgsql;

-- Bước 8: Tạo trigger để tự động cleanup (tùy chọn)
-- CREATE OR REPLACE FUNCTION trigger_cleanup()
-- RETURNS trigger AS $$
-- BEGIN
--   -- Chạy cleanup mỗi khi có file mới được upload
--   PERFORM cleanup_old_media_files();
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- CREATE TRIGGER auto_cleanup_trigger
--   AFTER INSERT ON storage.objects
--   FOR EACH ROW
--   EXECUTE FUNCTION trigger_cleanup();

-- =====================================================
-- TROUBLESHOOTING
-- =====================================================

-- Nếu gặp lỗi "row-level security policy":
-- 1. Kiểm tra bucket 'media' đã được tạo chưa
-- 2. Kiểm tra policies đã được tạo đúng chưa
-- 3. Kiểm tra user có quyền authenticated không

-- Nếu gặp lỗi "bucket not found":
-- 1. Tạo bucket 'media' trong Supabase Dashboard
-- 2. Đảm bảo bucket public
-- 3. Kiểm tra file size limit

-- Nếu gặp lỗi CORS:
-- 1. Vào Settings > API > CORS
-- 2. Thêm domain của frontend
-- 3. Đảm bảo credentials: true

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Kiểm tra bucket tồn tại
SELECT * FROM storage.buckets WHERE id = 'media';

-- Kiểm tra policies
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage';

-- Kiểm tra RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'objects' 
AND schemaname = 'storage';
