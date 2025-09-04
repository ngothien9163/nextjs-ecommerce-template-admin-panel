# 🚨 HƯỚNG DẪN KHẮC PHỤC LỖI PGRST116 - CATEGORIES EDIT

## ❌ **VẤN ĐỀ**
Khi nhấn nút "Save" ở trang edit category, gặp lỗi:
```
{
    "code": "PGRST116",
    "details": "The result contains 0 rows",
    "hint": null,
    "message": "Cannot coerce the result to a single JSON object"
}
```

## 🔍 **NGUYÊN NHÂN**
1. **Supabase chưa được cấu hình đúng** - thiếu environment variables
2. **RLS (Row Level Security) chặn truy cập** - policies chưa được setup
3. **Record không tồn tại** hoặc **không có quyền update**

## ✅ **GIẢI PHÁP**

### **Bước 1: Cấu hình Supabase Environment Variables**

1. **Lấy thông tin từ Supabase Dashboard:**
   - Vào https://supabase.com/dashboard
   - Chọn project của bạn
   - Vào **Settings > API**

2. **Cập nhật file `.env.local`:**
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### **Bước 2: Chạy Quick Fix Script**

1. **Copy nội dung file `quick-fix-categories-pgrst116.sql`**
2. **Vào Supabase Dashboard > SQL Editor**
3. **Paste và chạy script**

Script này sẽ:
- ✅ Disable RLS tạm thời hoặc tạo policies đúng
- ✅ Tạo record với ID `12ff421a-21b6-48ac-8c13-983cf60ddde6` nếu chưa có
- ✅ Verify kết quả

### **Bước 3: Restart Development Server**

```bash
# Dừng server hiện tại (Ctrl+C)
# Khởi động lại
npm run dev
```

### **Bước 4: Test lại**

1. Vào http://localhost:5173/categories/edit/12ff421a-21b6-48ac-8c13-983cf60ddde6
2. Thay đổi thông tin
3. Nhấn **Save**
4. Kiểm tra Console để xem logs

## 🔧 **GIẢI PHÁP DÀI HẠN**

### **Setup Complete Database (Khuyên dùng):**

Chạy các script theo thứ tự:

1. **`sqls/01-fix-database-permissions.sql`** - Fix permissions
2. **`sqls/04-setup-rls-policies.sql`** - Setup RLS policies
3. **`sqls/05-check-permissions.sql`** - Verify setup

## 📝 **LOGS CẦN KIỂM TRA**

Mở **Browser Console** (F12) và tìm:

### **✅ Success logs:**
```
🔄 UPDATE called for resource: categories with ID: 12ff421a-21b6-48ac-8c13-983cf60ddde6
✅ Record exists, proceeding with update
✅ Update successful: {...}
✅ Category updated successfully: {...}
```

### **❌ Error logs:**
```
❌ Error checking record existence: {...}
❌ Update error: {...}
❌ PGRST116 Error: Record not found or permission denied
```

## 🚨 **NẾU VẪN BỊ LỖI**

### **Kiểm tra Environment Variables:**
```javascript
// Chạy trong Browser Console
console.log('SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Has ANON_KEY:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
console.log('Has SERVICE_ROLE:', !!import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY);
```

### **Kiểm tra Database Connection:**
1. Vào http://localhost:5173/categories (list page)
2. Nhấn nút **Test Kết nối Supabase**
3. Xem kết quả

### **Kiểm tra Record tồn tại:**
Trong Supabase Dashboard > Table Editor > categories:
```sql
SELECT * FROM categories WHERE id = '12ff421a-21b6-48ac-8c13-983cf60ddde6';
```

## 📞 **HỖ TRỢ**

Nếu vẫn gặp lỗi, vui lòng cung cấp:
1. **Console logs** đầy đủ
2. **Environment variables** (ẩn sensitive data)
3. **Kết quả của scripts SQL**
4. **Screenshots** lỗi

---

**🎯 Mục tiêu:** Sau khi hoàn thành, có thể edit categories thành công mà không gặp lỗi PGRST116.