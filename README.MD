# 🚀 Admin Panel - E-commerce Management

Admin panel được xây dựng bằng **Refine** và **Ant Design** để quản lý website e-commerce.

## ✨ Tính năng

- **Dashboard**: Tổng quan về website
- **Quản lý danh mục**: CRUD danh mục sản phẩm
- **Quản lý sản phẩm**: CRUD sản phẩm với đầy đủ thông tin
- **Giao diện tiếng Việt**: 100% tiếng Việt
- **Responsive**: Tương thích mọi thiết bị

## 🛠️ Cài đặt

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Cấu hình Supabase
Tạo file `.env` trong thư mục gốc:
```env
REACT_APP_SUPABASE_URL=your_supabase_url_here
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Chạy development server
```bash
npm run dev
```

## 📁 Cấu trúc thư mục

```
src/
├── lib/
│   ├── supabase.ts          # Cấu hình Supabase client
│   └── dataProvider.ts      # Data provider cho Refine
├── pages/
│   ├── dashboard/           # Trang dashboard
│   ├── categories/          # Quản lý danh mục
│   └── products/            # Quản lý sản phẩm
└── App.tsx                  # Cấu hình routing và resources
```

## 🔧 Cấu hình

### Supabase Setup
1. Tạo project trên [Supabase](https://supabase.com)
2. Lấy URL và Anon Key từ Settings > API
3. Cập nhật vào file `.env`

### Database Tables
Đảm bảo đã tạo các bảng sau trong Supabase:
- `categories` - Danh mục sản phẩm
- `products` - Sản phẩm
- `product_variants` - Biến thể sản phẩm
- `product_images` - Hình ảnh sản phẩm

## 📱 Sử dụng

### Dashboard
- Xem tổng quan về website
- Thống kê sản phẩm, đơn hàng, khách hàng

### Quản lý danh mục
- **Danh sách**: Xem tất cả danh mục
- **Tạo mới**: Thêm danh mục mới
- **Chỉnh sửa**: Cập nhật thông tin danh mục
- **Xem chi tiết**: Hiển thị đầy đủ thông tin
- **Xóa**: Xóa danh mục (có xác nhận)

### Quản lý sản phẩm
- **Danh sách**: Xem tất cả sản phẩm với hình ảnh
- **Tạo mới**: Thêm sản phẩm mới với đầy đủ thông tin
- **Chỉnh sửa**: Cập nhật thông tin sản phẩm
- **Xem chi tiết**: Hiển thị đầy đủ thông tin và hình ảnh
- **Xóa**: Xóa sản phẩm (có xác nhận)

## 🎨 Giao diện

- **Ant Design**: Sử dụng component library hiện đại
- **Responsive**: Tương thích mobile, tablet, desktop
- **Tiếng Việt**: 100% giao diện tiếng Việt
- **Dark/Light Mode**: Hỗ trợ chế độ tối/sáng

## 🚀 Deployment

### Build production
```bash
npm run build
```

### Deploy
Có thể deploy lên:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 🔒 Bảo mật

- **Supabase Auth**: Xác thực người dùng
- **Row Level Security**: Bảo mật dữ liệu
- **Environment Variables**: Bảo vệ thông tin nhạy cảm

## 📞 Hỗ trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra console browser
2. Kiểm tra cấu hình Supabase
3. Kiểm tra file `.env`

## 🔄 Cập nhật

Để cập nhật admin panel:
```bash
git pull origin main
npm install
npm run dev
```

---

**Made with ❤️ by Refine + Ant Design**
