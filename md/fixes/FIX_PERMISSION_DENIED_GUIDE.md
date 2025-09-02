# 🚨 KHẮC PHỤC LỖI: permission denied for schema public

## 📋 **Vấn đề**

Lỗi `permission denied for schema public` xảy ra khi:
- Bạn đã tạo lại schema public nhưng không cấp quyền đúng cách
- Role/user không có quyền truy cập vào schema public
- Database bị mất cấu hình quyền mặc định

## 🔧 **Cách khắc phục**

### **Phương pháp 1: Sử dụng Supabase Dashboard (Khuyến nghị)**

1. **Truy cập Supabase Dashboard:**
   - Vào https://supabase.com/dashboard
   - Chọn project: `gyexgtobqvonkmyesqkl`

2. **Mở SQL Editor:**
   - Vào tab "SQL Editor" 
   - Tạo new query

3. **Copy và chạy script sau (Script tổng hợp - không gặp lỗi):**

**Sử dụng file có sẵn:**
- Copy nội dung từ file `sqls/01-fix-database-permissions.sql` và paste vào SQL Editor
- Hoặc copy script dưới đây:

```sql
-- FIX DATABASE PERMISSIONS - SCRIPT TỔNG HỢP
CREATE SCHEMA IF NOT EXISTS public;

-- Cấp quyền cho schema public
GRANT USAGE ON SCHEMA public TO public;
GRANT CREATE ON SCHEMA public TO public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT CREATE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- Cấp quyền cho tất cả tables hiện có
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO public;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Cấp quyền cho sequences và functions
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO public;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO public;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon;

-- Đặt quyền mặc định cho objects mới
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO public;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon;

SELECT 'Schema public permissions fixed!' as status;
```

4. **Chạy các script setup database theo thứ tự:**

```sql
-- Bước 1: Tạo tất cả tables (nếu chưa có)
-- Copy nội dung từ: sqls/02-create-all-tables.sql

-- Bước 2: Insert dữ liệu mẫu (nếu chưa có)
-- Copy nội dung từ: sqls/03-insert-all-data.sql

-- Bước 3: Setup RLS policies
-- Copy nội dung từ: sqls/04-setup-rls-policies.sql
```

### **Phương pháp 2: Tạo lại database hoàn toàn**

1. **Xóa tất cả tables hiện có:**

```sql
-- Xóa tất cả tables (CẨN THẬN: Sẽ mất dữ liệu)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- Cấp quyền lại
GRANT USAGE ON SCHEMA public TO public;
GRANT CREATE ON SCHEMA public TO public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT CREATE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
```

2. **Chạy script setup từ đầu:**

Copy nội dung từ file `sqls/00-setup-complete-database.sql` và chạy trong SQL Editor.

### **Phương pháp 3: Kiểm tra và fix RLS Policies**

1. **Tắt RLS cho tất cả tables:**

```sql
-- Tắt RLS cho các tables chính
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE media DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories DISABLE ROW LEVEL SECURITY;

-- Hoặc tạo policy cho phép tất cả
CREATE POLICY "Allow all access" ON categories FOR ALL USING (true);
CREATE POLICY "Allow all access" ON products FOR ALL USING (true);
CREATE POLICY "Allow all access" ON profiles FOR ALL USING (true);
```

## 🧪 **Test kết nối sau khi fix**

Chạy lệnh sau trong terminal:

```bash
node test-database-fix.js
```

Nếu thành công, bạn sẽ thấy:
```
✅ Connection test successful
✅ Categories query successful
✅ Products query successful
✅ All tests completed successfully!
```

## 🚀 **Sau khi fix xong**

1. **Khởi động lại dev server:**
```bash
npm run dev
```

2. **Truy cập ứng dụng:**
- http://localhost:5173/categories
- http://localhost:5173/products
- http://localhost:5173/dashboard

3. **Kiểm tra các trang:**
- Categories list/create/edit
- Products list/create/edit
- Dashboard

## ❌ **Nếu vẫn lỗi**

### **Lỗi có thể gặp và cách fix:**

1. **"relation does not exist"**
   - Tables chưa được tạo
   - Chạy `sqls/01-create-all-tables.sql`

2. **"RLS policy violation"**
   - RLS policies quá nghiêm ngặt
   - Tắt RLS hoặc tạo policy allow all

3. **"insufficient privilege"**
   - User không có quyền
   - Cấp quyền SUPERUSER hoặc sử dụng postgres user

4. **"connection refused"**
   - Supabase URL/Key sai
   - Kiểm tra file `.env`

## 📞 **Liên hệ hỗ trợ**

Nếu vẫn gặp vấn đề, cung cấp thông tin:
- Error message cụ thể
- Screenshot lỗi
- Kết quả của `node test-database-fix.js`
- Supabase project URL

## ✅ **Checklist sau khi fix**

- [ ] Schema public có quyền đúng
- [ ] Tables đã được tạo
- [ ] Dữ liệu mẫu đã được insert
- [ ] RLS policies không chặn truy cập
- [ ] Test connection thành công
- [ ] Ứng dụng chạy được
- [ ] Tất cả trang hoạt động bình thường
