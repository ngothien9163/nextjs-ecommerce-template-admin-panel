# 🔧 **HƯỚNG DẪN KHẮC PHỤC VẤN ĐỀ CATEGORIES**

## **Vấn đề hiện tại:**
Danh sách categories không hiển thị được dữ liệu.

## **Nguyên nhân có thể:**

### 1. **Biến môi trường không đúng**
- ✅ **Đã sửa**: File `env.local` đã được cập nhật từ `REACT_APP_` thành `VITE_`
- 🔄 **Cần làm**: Restart server sau khi thay đổi

### 2. **Bảng categories chưa tồn tại trong Supabase**
- ❌ **Vấn đề**: Bảng `categories` có thể chưa được tạo
- ✅ **Giải pháp**: Chạy SQL script trong file `SUPABASE_SETUP.md`

### 3. **Quyền truy cập bị hạn chế**
- ❌ **Vấn đề**: Row Level Security (RLS) có thể đang bật
- ✅ **Giải pháp**: Kiểm tra và cập nhật policies

## **Các bước khắc phục:**

### **Bước 1: Kiểm tra kết nối**
1. Mở trang `/categories` trong admin panel
2. Nhấn nút "Test Kết nối Supabase"
3. Kiểm tra console log để xem thông báo

### **Bước 2: Tạo bảng categories**
1. Vào Supabase Dashboard → SQL Editor
2. Copy và paste SQL script từ `SUPABASE_SETUP.md`
3. Chạy script để tạo bảng và dữ liệu mẫu

### **Bước 3: Kiểm tra RLS Policies**
1. Vào Supabase Dashboard → Authentication → Policies
2. Kiểm tra xem có policy nào cho bảng `categories` không
3. Nếu không có, tạo policy sau:

```sql
-- Cho phép đọc tất cả categories (public)
CREATE POLICY "Allow public read access" ON categories
FOR SELECT USING (true);

-- Cho phép admin tạo/sửa/xóa categories
CREATE POLICY "Allow admin full access" ON categories
FOR ALL USING (auth.role() = 'authenticated');
```

### **Bước 4: Kiểm tra Console Logs**
1. Mở Developer Tools (F12)
2. Vào tab Console
3. Refresh trang `/categories`
4. Tìm các log có emoji 🔍, 🚀, ✅, ❌

## **Debug Information:**

### **Console Logs cần tìm:**
- `🔗 Supabase URL: [URL]`
- `🔑 Supabase Key: ✅ Set` hoặc `❌ Not set`
- `🔍 getList called for resource: categories`
- `🚀 Executing query for: categories`
- `✅ Successfully fetched X categories` hoặc `❌ Supabase error: [error]`

### **Lỗi thường gặp:**
1. **"relation 'categories' does not exist"** → Cần tạo bảng
2. **"permission denied"** → Cần cập nhật RLS policies
3. **"invalid api key"** → Kiểm tra biến môi trường
4. **"network error"** → Kiểm tra kết nối internet

## **Kiểm tra nhanh:**

### **Test 1: Kết nối cơ bản**
```bash
# Kiểm tra biến môi trường
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY
```

### **Test 2: API trực tiếp**
```bash
# Test API Supabase trực tiếp
curl "https://[YOUR_PROJECT_ID].supabase.co/rest/v1/categories?select=*" \
  -H "apikey: [YOUR_ANON_KEY]" \
  -H "Authorization: Bearer [YOUR_ANON_KEY]"
```

## **Liên hệ hỗ trợ:**
Nếu vẫn gặp vấn đề, hãy:
1. Copy toàn bộ console logs
2. Chụp ảnh lỗi hiển thị
3. Kiểm tra Network tab trong Developer Tools
4. Gửi thông tin cho team hỗ trợ

