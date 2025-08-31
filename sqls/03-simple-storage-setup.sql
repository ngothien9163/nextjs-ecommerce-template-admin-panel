-- =====================================================
-- SIMPLE SUPABASE STORAGE SETUP (Không cần quyền owner)
-- =====================================================

-- Bước 1: Kiểm tra bucket 'media' đã tồn tại chưa
SELECT * FROM storage.buckets WHERE id = 'media';

-- Bước 2: Kiểm tra RLS policies hiện tại
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage';

-- Bước 3: Kiểm tra RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'objects' 
AND schemaname = 'storage';

-- =====================================================
-- HƯỚNG DẪN SETUP THỦ CÔNG
-- =====================================================

/*
Nếu bucket 'media' chưa tồn tại, hãy tạo thủ công:

1. Vào Supabase Dashboard
2. Chọn project của bạn
3. Vào tab "Storage"
4. Click "New Bucket"
5. Điền thông tin:
   - Name: media
   - Public: ✅ Checked
   - File size limit: 50MB
6. Click "Create bucket"

Sau đó, nếu cần tạo policies, hãy vào:
1. Storage > media bucket > Settings
2. Policies tab
3. Tạo các policies sau:
*/

-- =====================================================
-- POLICIES CẦN TẠO (Thực hiện trong Dashboard)
-- =====================================================

/*
Policy 1: Public Access (Read)
- Name: "Public Access"
- Operation: SELECT
- Target roles: public
- Using expression: bucket_id = 'media'

Policy 2: Authenticated Upload
- Name: "Authenticated users can upload"
- Operation: INSERT
- Target roles: authenticated
- Using expression: bucket_id = 'media' AND auth.role() = 'authenticated'

Policy 3: Authenticated Update
- Name: "Authenticated users can update"
- Operation: UPDATE
- Target roles: authenticated
- Using expression: bucket_id = 'media' AND auth.role() = 'authenticated'

Policy 4: Authenticated Delete
- Name: "Authenticated users can delete"
- Operation: DELETE
- Target roles: authenticated
- Using expression: bucket_id = 'media' AND auth.role() = 'authenticated'
*/

-- =====================================================
-- TEST QUERIES
-- =====================================================

-- Test 1: Kiểm tra bucket
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets 
WHERE id = 'media';

-- Test 2: Kiểm tra policies
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
ORDER BY policyname;

-- Test 3: Kiểm tra bảng media
SELECT 
  COUNT(*) as total_records,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_records
FROM media;

-- =====================================================
-- TROUBLESHOOTING
-- =====================================================

/*
Nếu gặp lỗi "must be owner of table objects":
- Đây là bảng hệ thống của Supabase
- Không thể thay đổi trực tiếp bằng SQL
- Phải sử dụng Dashboard hoặc API

Nếu gặp lỗi "bucket not found":
- Tạo bucket 'media' trong Dashboard
- Đảm bảo public = true

Nếu gặp lỗi "policy violation":
- Tạo policies trong Dashboard
- Hoặc sử dụng service role key
*/

-- =====================================================
-- ALTERNATIVE: SỬ DỤNG SERVICE ROLE
-- =====================================================

/*
Nếu không thể tạo policies, có thể sử dụng service role:

1. Vào Settings > API
2. Copy "service_role" key (không phải anon key)
3. Sử dụng service role key trong admin panel
4. Service role có full access không cần policies

Cập nhật .env.local:
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
*/
