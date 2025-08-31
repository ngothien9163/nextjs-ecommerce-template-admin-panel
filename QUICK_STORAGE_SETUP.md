# 🚀 **QUICK SETUP SUPABASE STORAGE**

## **❌ Lỗi hiện tại:**
```
StorageApiError: new row violates row-level security policy
```

## **✅ Giải pháp:**

### **Bước 1: Tạo Bucket trong Supabase Dashboard**

1. **Đăng nhập Supabase Dashboard**
   - Vào [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Chọn project của bạn

2. **Tạo Bucket 'media'**
   - Vào tab **Storage**
   - Click **New Bucket**
   - Điền thông tin:
     - **Name**: `media`
     - **Public**: ✅ Checked
     - **File size limit**: `50MB`
   - Click **Create bucket**

### **Bước 2: Chạy SQL Script**

1. **Vào SQL Editor**
   - Trong Supabase Dashboard
   - Click **SQL Editor**

2. **Chạy script setup**
   - Copy nội dung từ file `sqls/02-setup-supabase-storage.sql`
   - Paste vào SQL Editor
   - Click **Run**

### **Bước 3: Kiểm tra**

1. **Test upload**
   - Vào Admin Panel: `http://localhost:5178/media`
   - Thử upload một hình ảnh
   - Kiểm tra console logs

2. **Nếu vẫn lỗi**
   - Mở browser console (F12)
   - Xem error message chi tiết
   - Kiểm tra network tab

## **🔧 Troubleshooting:**

### **Lỗi 1: "Bucket not found"**
```sql
-- Kiểm tra bucket
SELECT * FROM storage.buckets WHERE id = 'media';
```

### **Lỗi 2: "Policy violation"**
```sql
-- Kiểm tra policies
SELECT policyname, cmd FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';
```

### **Lỗi 3: "Authentication required"**
- Đảm bảo user đã đăng nhập
- Kiểm tra `auth.role() = 'authenticated'`

## **📋 Checklist:**

- [ ] Bucket 'media' đã được tạo
- [ ] Bucket public = true
- [ ] RLS policies đã được tạo
- [ ] File size limit = 50MB
- [ ] Allowed MIME types: image/*, video/*, application/pdf

## **🚀 Test Upload:**

Sau khi setup xong, thử upload một hình ảnh và kiểm tra:

1. **Console logs** - Xem quá trình upload
2. **Database** - Kiểm tra record trong bảng `media`
3. **Storage** - Kiểm tra file trong bucket
4. **URL** - Test URL public

## **📞 Support:**

Nếu vẫn gặp vấn đề, hãy:
1. Kiểm tra console logs
2. Chụp screenshot error message
3. Kiểm tra Supabase Dashboard logs
