-- =====================================================
-- SETUP MEDIA BUCKET COMPLETE - SCRIPT TỔNG HỢP
-- =====================================================
-- Script này gom tất cả các bước cần thiết để setup media bucket
-- Chạy script này để tạo bucket và fix RLS policies

-- =====================================================
-- BƯỚC 1: TẠO BUCKET MEDIA
-- =====================================================

-- Insert bucket record directly into storage.buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media', 
  true,
  52428800, -- 50MB
  ARRAY['image/*']
) ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/*'];

-- Verify bucket was created
SELECT 
  '=== BƯỚC 1: KIỂM TRA BUCKET ĐÃ TẠO ===' as info;

SELECT 
  id, 
  name, 
  public, 
  file_size_limit, 
  allowed_mime_types,
  created_at
FROM storage.buckets 
WHERE id = 'media';

-- =====================================================
-- BƯỚC 2: FIX RLS POLICIES CHO STORAGE.BUCKETS
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to buckets" ON storage.buckets;
DROP POLICY IF EXISTS "Allow authenticated users to create buckets" ON storage.buckets;

-- Create policies for storage.buckets
CREATE POLICY "Allow public read access to buckets" ON storage.buckets
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to create buckets" ON storage.buckets
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Verify policies for storage.buckets
SELECT 
  '=== BƯỚC 2: KIỂM TRA RLS POLICIES CHO BUCKETS ===' as info;

SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual 
FROM pg_policies 
WHERE tablename = 'buckets' AND schemaname = 'storage';

-- =====================================================
-- BƯỚC 3: FIX RLS POLICIES CHO STORAGE.OBJECTS (ANONYMOUS UPLOAD)
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous update" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous delete" ON storage.objects;

-- Create more permissive policies for anonymous upload

-- Policy 1: Public read access
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

-- Policy 2: Allow anonymous upload (less secure)
CREATE POLICY "Allow anonymous upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'media');

-- Policy 3: Allow anonymous update (less secure)
CREATE POLICY "Allow anonymous update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'media');

-- Policy 4: Allow anonymous delete (less secure)
CREATE POLICY "Allow anonymous delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'media');

-- Verify policies for storage.objects
SELECT 
  '=== BƯỚC 3: KIỂM TRA RLS POLICIES CHO OBJECTS ===' as info;

SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual 
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage'
ORDER BY policyname;

-- =====================================================
-- BƯỚC 4: KIỂM TRA TỔNG QUAN
-- =====================================================

-- Check if RLS is enabled on storage.buckets
SELECT 
  '=== BƯỚC 4: KIỂM TRA RLS STATUS ===' as info;

SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE schemaname = 'storage' AND tablename IN ('buckets', 'objects');

-- =====================================================
-- THÔNG BÁO HOÀN THÀNH
-- =====================================================

SELECT 
  '=== HOÀN THÀNH SETUP MEDIA BUCKET ===' as info,
  '✅ Đã tạo bucket media' as step1,
  '✅ Đã fix RLS policies cho storage.buckets' as step2,
  '✅ Đã fix RLS policies cho storage.objects' as step3,
  '✅ Cho phép anonymous upload' as step4,
  '✅ Media bucket đã sẵn sàng sử dụng' as step5;

-- =====================================================
-- HƯỚNG DẪN TIẾP THEO
-- =====================================================

SELECT 
  '=== HƯỚNG DẪN TIẾP THEO ===' as next_steps,
  '1. Test upload file trong ứng dụng' as step1,
  '2. Kiểm tra file có xuất hiện trong bucket không' as step2,
  '3. Nếu vẫn lỗi, kiểm tra Service Role Key' as step3,
  '4. Truy cập: http://localhost:5173/media' as step4;

-- =====================================================
-- HOÀN THÀNH SETUP MEDIA BUCKET COMPLETE
-- =====================================================


