# 🔑 **SETUP VỚI SERVICE ROLE KEY**

## **❌ Vấn đề:**
```
ERROR: 42501: must be owner of table objects
```

## **✅ Giải pháp: Sử dụng Service Role Key**

### **Bước 1: Lấy Service Role Key**

1. **Vào Supabase Dashboard**
   - Đăng nhập [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Chọn project của bạn

2. **Lấy Service Role Key**
   - Vào **Settings** → **API**
   - Copy **service_role** key (không phải anon key)
   - Key này có dạng: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### **Bước 2: Tạo Bucket 'media'**

1. **Vào Storage**
   - Click tab **Storage**
   - Click **New Bucket**

2. **Tạo bucket**
   - **Name**: `media`
   - **Public**: ✅ Checked
   - **File size limit**: `50MB`
   - Click **Create bucket**

### **Bước 3: Cập nhật Environment**

1. **Mở file `.env.local`**
2. **Thêm service role key:**
```env
VITE_SUPABASE_URL=https://gyexgtobqvonkmyesqkl.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### **Bước 4: Test Upload**

1. **Restart dev server**
```bash
npm run dev
```

2. **Test upload**
   - Vào: `http://localhost:5179/media`
   - Thử upload một hình ảnh
   - Kiểm tra console logs

## **🔒 Bảo mật Service Role Key**

### **⚠️ Lưu ý quan trọng:**
- **Service Role Key có full access** đến database
- **Không bao giờ expose** trong frontend code
- **Chỉ sử dụng** trong admin panel (server-side)

### **✅ Best Practices:**
1. **Environment Variables**: Luôn dùng `.env.local`
2. **Git Ignore**: Đảm bảo `.env.local` trong `.gitignore`
3. **Production**: Sử dụng server-side API endpoints

## **🚀 Test Connection**

Chạy script test:
```bash
node scripts/check-supabase-storage.js
```

## **📋 Checklist:**

- [ ] Service Role Key đã được copy
- [ ] Bucket 'media' đã được tạo
- [ ] `.env.local` đã được cập nhật
- [ ] Dev server đã restart
- [ ] Upload test thành công

## **🔧 Troubleshooting:**

### **Lỗi 1: "Invalid API key"**
- Kiểm tra Service Role Key có đúng không
- Đảm bảo copy đầy đủ key

### **Lỗi 2: "Bucket not found"**
- Tạo bucket 'media' trong Dashboard
- Đảm bảo public = true

### **Lỗi 3: "Environment variable not found"**
- Kiểm tra `.env.local` có đúng format không
- Restart dev server

## **📊 Verification:**

Sau khi setup, kiểm tra:

1. **Console logs** - Không có lỗi
2. **Upload** - File upload thành công
3. **Database** - Record được tạo trong bảng `media`
4. **Storage** - File xuất hiện trong bucket
5. **URL** - Public URL hoạt động

## **🎯 Kết quả:**

Với Service Role Key:
- ✅ Bypass RLS policies
- ✅ Full access to storage
- ✅ Không cần tạo policies phức tạp
- ✅ Upload hoạt động ngay lập tức
