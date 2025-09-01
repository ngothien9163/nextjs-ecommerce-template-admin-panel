## �� **Hướng dẫn chi tiết tạo bucket `media` trong Supabase Dashboard**

### **Bước 1: Truy cập Supabase Dashboard**
1. **Mở trình duyệt** và truy cập: https://supabase.com/dashboard
2. **Đăng nhập** vào tài khoản Supabase của bạn
3. **Chọn project**: `gyexgtobqvonkmyesqkl` (hoặc tên project của bạn)

### **Bước 2: Tạo Storage Bucket**
1. **Trong menu bên trái**, click **"Storage"**
2. **Click nút "New bucket"** (màu xanh, góc trên bên phải)
3. **Điền thông tin**:
   - **Name**: `media`
   - **Public bucket**: ✅ **BẬT** (quan trọng!)
   - **File size limit**: `50 MB` (tùy chọn)
   - **Allowed MIME types**: `image/*` (tùy chọn)
4. **Click "Create bucket"**

### **Bước 3: Cấu hình RLS Policies**
1. **Vẫn trong Storage**, click tab **"Policies"**
2. **Click "New Policy"**
3. **Tạo 4 policies sau**:

#### **Policy 1: Public Read Access**
```sql
-- Name: "Public read access"
-- Operation: SELECT
-- Target roles: public
-- USING expression:
bucket_id = 'media'
```

#### **Policy 2: Authenticated Upload**
```sql
-- Name: "Authenticated upload"  
-- Operation: INSERT
-- Target roles: authenticated
-- WITH CHECK expression:
bucket_id = 'media' AND auth.role() = 'authenticated'
```

#### **Policy 3: Authenticated Update**
```sql
-- Name: "Authenticated update"
-- Operation: UPDATE  
-- Target roles: authenticated
-- USING expression:
bucket_id = 'media' AND auth.role() = 'authenticated'
```

#### **Policy 4: Authenticated Delete**
```sql
-- Name: "Authenticated delete"
-- Operation: DELETE
-- Target roles: authenticated  
-- USING expression:
bucket_id = 'media' AND auth.role() = 'authenticated'
```

### **Bước 4: Kiểm tra kết quả**
1. **Quay lại tab "Buckets"**
2. **Xác nhận** bucket `media` đã xuất hiện
3. **Kiểm tra** cột "Public" hiển thị ✅

### **Bước 5: Test upload**
1. **Quay lại ứng dụng** của bạn
2. **Thử upload file** trong modal
3. **Kiểm tra** file có xuất hiện trong bucket không

### **📸 Screenshots hướng dẫn:**

**Tạo bucket:**
```
Storage → New bucket → Name: "media" → Public: ON → Create
```

**Tạo policies:**
```
Storage → Policies → New Policy → (4 policies như trên)
```

### **🔧 Nếu gặp lỗi:**
- **"Permission denied"**: Kiểm tra bạn có quyền admin không
- **"Bucket already exists"**: Bucket đã tồn tại, bỏ qua bước tạo
- **"Policy creation failed"**: Kiểm tra syntax SQL

**Bạn đã tạo xong bucket chưa? Hãy thử upload file để test!** 🚀

```sql
-- Name: "Public read access"
-- Operation: SELECT
-- Target roles: public
-- USING expression:
bucket_id = 'media'
```

```sql
-- Name: "Authenticated upload"  
-- Operation: INSERT
-- Target roles: authenticated
-- WITH CHECK expression:
bucket_id = 'media' AND auth.role() = 'authenticated'
```

```sql
-- Name: "Authenticated update"
-- Operation: UPDATE  
-- Target roles: authenticated
-- USING expression:
bucket_id = 'media' AND auth.role() = 'authenticated'
```

```sql
-- Name: "Authenticated delete"
-- Operation: DELETE
-- Target roles: authenticated  
-- USING expression:
bucket_id = 'media' AND auth.role() = 'authenticated'
```

```plaintext
Storage → New bucket → Name: "media" → Public: ON → Create
```

```plaintext
Storage → Policies → New Policy → (4 policies như trên)
```

