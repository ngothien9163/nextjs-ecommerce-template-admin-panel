# 📁 SQL Scripts - Hướng dẫn sử dụng

## 🎯 **Mục đích**

Thư mục này chứa các script SQL để setup và fix database cho dự án NextJS E-commerce Admin Panel.

## 📋 **Danh sách Scripts**

### **1. Scripts Setup Database**

| File | Mục đích | Khi nào chạy |
|------|----------|--------------|
| `00-setup-complete-database.sql` | Setup toàn bộ database (master script) | Lần đầu setup |
| `02-create-all-tables.sql` | Tạo tất cả tables | Khi chưa có tables |
| `03-insert-all-data.sql` | Insert dữ liệu mẫu | Sau khi tạo tables |

### **2. Scripts Fix Permissions**

| File | Mục đích | Khi nào chạy |
|------|----------|--------------|
| `01-fix-database-permissions.sql` | Fix lỗi "permission denied for schema public" | Khi gặp lỗi permissions |
| `04-setup-rls-policies.sql` | Setup RLS policies cho tất cả tables | Sau khi fix permissions |
| `05-check-permissions.sql` | Kiểm tra permissions và RLS status | Để debug lỗi |

### **3. Scripts SEO (Tùy chọn)**

| File | Mục đích | Khi nào chạy |
|------|----------|--------------|
| `04-create-seo-images-table.sql` | Tạo bảng SEO cho hình ảnh | Nếu cần SEO nâng cao |

## 🚀 **Hướng dẫn sử dụng**

### **Trường hợp 1: Setup lần đầu**

```bash
# Chạy script master (tự động chạy tất cả)
Copy nội dung từ: sqls/00-setup-complete-database.sql
Paste vào Supabase SQL Editor và chạy
```

### **Trường hợp 2: Gặp lỗi "permission denied for schema public"**

```bash
# Bước 1: Fix permissions
Copy nội dung từ: sqls/01-fix-database-permissions.sql
Paste vào Supabase SQL Editor và chạy

# Bước 2: Setup RLS policies
Copy nội dung từ: sqls/04-setup-rls-policies.sql
Paste vào Supabase SQL Editor và chạy

# Bước 3: Test ứng dụng
Truy cập: http://localhost:5173/categories
```

### **Trường hợp 3: Debug lỗi permissions**

```bash
# Kiểm tra permissions và RLS status
Copy nội dung từ: sqls/05-check-permissions.sql
Paste vào Supabase SQL Editor và chạy

# Xem kết quả để xác định vấn đề
```

## 🔧 **Cách chạy Scripts**

### **Phương pháp 1: Supabase Dashboard (Khuyến nghị)**

1. **Truy cập Supabase Dashboard:**
   - Vào https://supabase.com/dashboard
   - Chọn project của bạn

2. **Mở SQL Editor:**
   - Vào tab "SQL Editor"
   - Tạo new query

3. **Copy và chạy:**
   - Copy nội dung từ file SQL
   - Paste vào SQL Editor
   - Click "Run" để chạy

### **Phương pháp 2: Command Line (Nếu có psql)**

```bash
# Kết nối đến database
psql "postgresql://postgres:password@db.project.supabase.co:5432/postgres"

# Chạy script
\i sqls/01-fix-database-permissions.sql
```

## ⚠️ **Lưu ý quan trọng**

### **Thứ tự chạy scripts:**

1. **`01-fix-database-permissions.sql`** - Fix permissions trước
2. **`02-create-all-tables.sql`** - Tạo tables (nếu chưa có)
3. **`03-insert-all-data.sql`** - Insert dữ liệu (nếu chưa có)
4. **`04-setup-rls-policies.sql`** - Setup RLS policies
5. **`05-check-permissions.sql`** - Kiểm tra (nếu cần debug)

### **Backup trước khi chạy:**

```sql
-- Backup dữ liệu quan trọng trước khi chạy scripts
-- Đặc biệt khi chạy scripts có DROP TABLE hoặc DROP POLICY
```

## 🐛 **Troubleshooting**

### **Lỗi thường gặp:**

1. **"permission denied for schema public"**
   - **Giải pháp:** Chạy `01-fix-database-permissions.sql`

2. **"relation does not exist"**
   - **Giải pháp:** Chạy `02-create-all-tables.sql`

3. **"RLS policy violation"**
   - **Giải pháp:** Chạy `04-setup-rls-policies.sql`

4. **"insufficient privilege"**
   - **Giải pháp:** Kiểm tra Supabase URL và API Key

### **Kiểm tra kết quả:**

```sql
-- Test cơ bản
SELECT COUNT(*) FROM categories;
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM media;

-- Nếu trả về số > 0 thì database đã hoạt động
```

## 📞 **Hỗ trợ**

Nếu gặp vấn đề:

1. **Chạy script check:** `05-check-permissions.sql`
2. **Xem logs:** Browser console và Supabase logs
3. **Kiểm tra:** Supabase URL và API Key trong `.env`
4. **Báo cáo:** Cung cấp error message cụ thể

## ✅ **Checklist hoàn thành**

- [ ] Schema public có quyền đúng
- [ ] Tables đã được tạo
- [ ] Dữ liệu mẫu đã được insert
- [ ] RLS policies đã được setup
- [ ] Test connection thành công
- [ ] Ứng dụng chạy được
- [ ] Tất cả trang hoạt động bình thường

---

**📝 Lưu ý:** Các script này đã được tối ưu và gom lại từ nhiều file trùng lặp để dễ sử dụng hơn.