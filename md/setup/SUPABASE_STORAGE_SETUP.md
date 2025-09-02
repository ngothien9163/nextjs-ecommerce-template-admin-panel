# 🗂️ Hướng dẫn thiết lập Supabase Storage

## 🚨 **Vấn đề hiện tại**

File không upload được lên Supabase Storage vì:
1. **Bucket `media` chưa tồn tại**
2. **RLS policies chưa được cấu hình**

## 🔧 **Cách khắc phục**

### **Bước 1: Tạo bucket `media`**

1. **Truy cập Supabase Dashboard**: https://supabase.com/dashboard
2. **Chọn project**: `gyexgtobqvonkmyesqkl`
3. **Vào Storage**: Click vào "Storage" ở sidebar
4. **Tạo bucket mới**:
   - Click "New bucket"
   - **Name**: `media`
   - **Public**: ✅ Bật (để có thể truy cập public)
   - **File size limit**: `10 MB`
   - **Allowed MIME types**: 
     ```
     image/jpeg
     image/png
     image/gif
     image/webp
     image/svg+xml
     ```

### **Bước 2: Cấu hình RLS Policies**

1. **Vào Authentication > Policies**
2. **Tạo policy cho bucket `media`**:

```sql
-- Policy cho việc upload file
CREATE POLICY "Allow authenticated users to upload files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'media' AND 
  auth.role() = 'authenticated'
);

-- Policy cho việc xem file
CREATE POLICY "Allow public to view files" ON storage.objects
FOR SELECT USING (bucket_id = 'media');

-- Policy cho việc xóa file (admin only)
CREATE POLICY "Allow authenticated users to delete files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'media' AND 
  auth.role() = 'authenticated'
);
```

### **Bước 3: Test upload**

Sau khi tạo bucket và policies, test lại:

1. **Vào**: `http://localhost:5174/media/create`
2. **Upload file** và nhấn "Upload Files"
3. **Kiểm tra** trong Supabase Storage xem file đã upload chưa

## 🔍 **Debug nếu vẫn lỗi**

### **Kiểm tra Console**

Mở Developer Tools (F12) và xem Console có lỗi gì không:

```javascript
// Test connection
const { data, error } = await supabase.storage.listBuckets();
console.log('Buckets:', data, error);
```

### **Kiểm tra Network**

Trong Developer Tools > Network, xem request upload có thành công không.

### **Kiểm tra Supabase Logs**

1. Vào Supabase Dashboard
2. Vào "Logs" 
3. Xem có lỗi gì trong Storage logs

## 📋 **Cấu hình hoàn chỉnh**

### **Bucket Settings**
- **Name**: `media`
- **Public**: ✅ Yes
- **File size limit**: `10485760` (10MB)
- **Allowed MIME types**: `image/*`

### **RLS Policies**
```sql
-- Cho phép upload
CREATE POLICY "media_upload_policy" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'media');

-- Cho phép xem
CREATE POLICY "media_view_policy" ON storage.objects  
FOR SELECT USING (bucket_id = 'media');

-- Cho phép xóa
CREATE POLICY "media_delete_policy" ON storage.objects
FOR DELETE USING (bucket_id = 'media');
```

## ✅ **Kết quả mong đợi**

Sau khi thiết lập xong:
- ✅ File upload thành công lên Supabase Storage
- ✅ File có URL public có thể truy cập
- ✅ Database lưu đúng `file_url` và `file_path`
- ✅ Form submit thành công

---

**🎯 Lưu ý**: Nếu vẫn gặp vấn đề, hãy kiểm tra lại:
1. Bucket `media` đã được tạo chưa
2. RLS policies đã được cấu hình chưa  
3. User đã đăng nhập chưa (nếu cần)
4. File size có vượt quá limit không