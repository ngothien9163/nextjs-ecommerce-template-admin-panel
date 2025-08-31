# 🔧 **SETUP ENVIRONMENT VARIABLES**

## **Bước 1: Tạo file `.env.local`**

Tạo file `.env.local` trong thư mục gốc của project với nội dung:

```env
VITE_SUPABASE_URL=https://gyexgtobqvonkmyesqkl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5ZXhndG9icXZvbmtteWVzcWtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMDY4MjYsImV4cCI6MjA3MTc4MjgyNn0.tS8-b_e5qL73ViCxrcYoih7yhvLkeXGRKcrCbPkFSa4
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## **Bước 2: Lấy Service Role Key**

1. Vào [Supabase Dashboard](https://supabase.com/dashboard)
2. Chọn project của bạn
3. Vào **Settings** → **API**
4. Copy **service_role** key (không phải anon key)
5. Thay thế `your_service_role_key_here` bằng key thật

## **Bước 3: Restart Dev Server**

```bash
npm run dev
```

## **Bước 4: Test**

Vào `http://localhost:5179/media/create` và thử tạo media mới.
