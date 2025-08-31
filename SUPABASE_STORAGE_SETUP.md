# Supabase Storage Setup cho Media Management

## 1. Tạo Storage Bucket

### Bước 1: Vào Supabase Dashboard
1. Đăng nhập vào [Supabase Dashboard](https://supabase.com/dashboard)
2. Chọn project của bạn
3. Vào tab "Storage"

### Bước 2: Tạo Bucket mới
1. Click "New Bucket"
2. Điền thông tin:
   - **Name**: `media`
   - **Public**: ✅ Checked (để có thể truy cập public)
   - **File size limit**: `50MB` (hoặc tùy theo nhu cầu)
3. Click "Create bucket"

## 2. Cấu hình Storage Policies

### Policy cho Public Access (Read)
```sql
-- Cho phép public đọc files
CREATE POLICY "Public Access" ON storage.objects 
FOR SELECT USING (bucket_id = 'media');
```

### Policy cho Authenticated Users (Upload)
```sql
-- Cho phép authenticated users upload
CREATE POLICY "Authenticated users can upload" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id = 'media' 
  AND auth.role() = 'authenticated'
);
```

### Policy cho Owner (Update/Delete)
```sql
-- Cho phép owner update/delete files
CREATE POLICY "Users can update own files" ON storage.objects 
FOR UPDATE USING (
  bucket_id = 'media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own files" ON storage.objects 
FOR DELETE USING (
  bucket_id = 'media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

## 3. Cấu hình RLS (Row Level Security)

### Enable RLS cho storage.objects
```sql
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
```

## 4. Test Upload

### Test với Supabase Client
```typescript
import { supabase } from './lib/supabase';

// Test upload
const testUpload = async () => {
  const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
  
  const { data, error } = await supabase.storage
    .from('media')
    .upload('test/test.jpg', file);
    
  if (error) {
    console.error('Upload error:', error);
  } else {
    console.log('Upload success:', data);
  }
};
```

## 5. Environment Variables

### Cập nhật .env.local
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 6. Troubleshooting

### Lỗi thường gặp

1. **"Bucket not found"**
   - Kiểm tra tên bucket có đúng không
   - Đảm bảo bucket đã được tạo

2. **"Policy violation"**
   - Kiểm tra RLS policies
   - Verify user authentication

3. **"File too large"**
   - Tăng file size limit trong bucket settings
   - Compress file trước khi upload

4. **"CORS error"**
   - Kiểm tra CORS settings trong Supabase
   - Verify domain trong allowed origins

### Debug Commands
```sql
-- Kiểm tra bucket
SELECT * FROM storage.buckets WHERE id = 'media';

-- Kiểm tra policies
SELECT * FROM storage.policies WHERE bucket_id = 'media';

-- Kiểm tra files
SELECT * FROM storage.objects WHERE bucket_id = 'media';
```

## 7. Performance Optimization

### CDN Configuration
```sql
-- Enable CDN cho bucket
UPDATE storage.buckets 
SET public = true, 
    file_size_limit = 52428800, -- 50MB
    allowed_mime_types = ARRAY['image/*', 'video/*', 'application/pdf']
WHERE id = 'media';
```

### Image Transformations
```typescript
// Sử dụng Supabase Image Transformations
const optimizedUrl = supabase.storage
  .from('media')
  .getPublicUrl('image.jpg', {
    transform: {
      width: 300,
      height: 200,
      quality: 80
    }
  });
```

## 8. Backup Strategy

### Automated Backups
```sql
-- Tạo function để backup media
CREATE OR REPLACE FUNCTION backup_media_files()
RETURNS void AS $$
BEGIN
  -- Backup logic here
  INSERT INTO media_backup 
  SELECT * FROM storage.objects 
  WHERE bucket_id = 'media';
END;
$$ LANGUAGE plpgsql;
```

## 9. Monitoring

### Storage Usage
```sql
-- Kiểm tra storage usage
SELECT 
  bucket_id,
  COUNT(*) as file_count,
  SUM(metadata->>'size')::bigint as total_size
FROM storage.objects 
WHERE bucket_id = 'media'
GROUP BY bucket_id;
```

### File Types Distribution
```sql
-- Phân tích file types
SELECT 
  metadata->>'mimetype' as mime_type,
  COUNT(*) as count
FROM storage.objects 
WHERE bucket_id = 'media'
GROUP BY metadata->>'mimetype'
ORDER BY count DESC;
```

## 10. Security Best Practices

### File Validation
```typescript
// Validate file types
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
const maxSize = 50 * 1024 * 1024; // 50MB

const validateFile = (file: File) => {
  if (!allowedTypes.includes(file.type)) {
    throw new Error('File type not allowed');
  }
  if (file.size > maxSize) {
    throw new Error('File too large');
  }
};
```

### Virus Scanning
```typescript
// Integrate with virus scanning service
const scanFile = async (file: File) => {
  // Implement virus scanning logic
  const isClean = await virusScanner.scan(file);
  if (!isClean) {
    throw new Error('File contains virus');
  }
};
```

## 11. Cost Optimization

### Storage Classes
```sql
-- Sử dụng different storage classes
-- Hot storage cho frequently accessed files
-- Cold storage cho archived files
```

### Lifecycle Policies
```sql
-- Auto-delete old files
CREATE POLICY "Auto delete old files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'media' 
  AND created_at < NOW() - INTERVAL '1 year'
);
```
