# 🚀 **HƯỚNG DẪN CẤU HÌNH SUPABASE**

## **Bước 1: Lấy thông tin từ Supabase Dashboard**

1. Đăng nhập vào [Supabase](https://supabase.com)
2. Chọn project của bạn
3. Vào **Settings** → **API**
4. Copy các thông tin sau:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## **Bước 2: Tạo file .env.local**

Tạo file `.env.local` trong thư mục `admin-panel` với nội dung:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

## **Bước 3: Thay thế thông tin thực tế**

- Thay `your-project-id` bằng Project ID thực tế
- Thay `your-actual-anon-key-here` bằng anon key thực tế

## **Bước 4: Tạo bảng categories trong Supabase**

Vào **SQL Editor** trong Supabase Dashboard và chạy lệnh SQL sau:

```sql
-- Tạo bảng categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES categories(id),
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo index cho slug
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Tạo index cho parent_id
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);

-- Tạo index cho sort_order
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order);

-- Thêm một số dữ liệu mẫu
INSERT INTO categories (name, slug, description, is_active, sort_order) VALUES
('Điện tử', 'dien-tu', 'Các sản phẩm điện tử và công nghệ', true, 1),
('Thời trang', 'thoi-trang', 'Quần áo, giày dép và phụ kiện', true, 2),
('Nhà cửa', 'nha-cua', 'Đồ dùng gia đình và nội thất', true, 3),
('Sách', 'sach', 'Sách vở và tài liệu học tập', true, 4),
('Thể thao', 'the-thao', 'Dụng cụ và trang phục thể thao', true, 5);

-- Tạo bảng products
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  category_id UUID REFERENCES categories(id),
  brand VARCHAR(255),
  sku VARCHAR(100),
  price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2),
  cost_price DECIMAL(10,2),
  weight DECIMAL(8,2),
  dimensions JSONB,
  stock_quantity INTEGER DEFAULT 0,
  min_stock_level INTEGER DEFAULT 0,
  max_stock_level INTEGER,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_bestseller BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  meta_title VARCHAR(255),
  meta_description TEXT,
  meta_keywords TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo index cho products
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);

-- Thêm dữ liệu mẫu cho products
INSERT INTO products (name, slug, description, short_description, category_id, brand, sku, price, sale_price, stock_quantity, min_stock_level, is_active, is_featured, rating, review_count) VALUES
('iPhone 15 Pro', 'iphone-15-pro', 'iPhone 15 Pro với chip A17 Pro mạnh mẽ, camera 48MP, màn hình 6.1 inch Super Retina XDR', 'iPhone 15 Pro - Điện thoại cao cấp nhất', (SELECT id FROM categories WHERE slug = 'dien-tu'), 'Apple', 'IP15P-001', 29990000, 27990000, 50, 10, true, true, 4.8, 125),
('MacBook Air M2', 'macbook-air-m2', 'MacBook Air với chip M2, màn hình 13.6 inch Liquid Retina, pin 18 giờ', 'MacBook Air M2 - Laptop mỏng nhẹ, hiệu năng cao', (SELECT id FROM categories WHERE slug = 'dien-tu'), 'Apple', 'MBA-M2-001', 25990000, NULL, 30, 5, true, true, 4.9, 89),
('Samsung Galaxy S24', 'samsung-galaxy-s24', 'Galaxy S24 với chip Snapdragon 8 Gen 3, camera 200MP, màn hình 6.2 inch Dynamic AMOLED', 'Galaxy S24 - Flagship Android mới nhất', (SELECT id FROM categories WHERE slug = 'dien-tu'), 'Samsung', 'SGS24-001', 19990000, 17990000, 45, 8, true, false, 4.7, 67),
('Áo thun nam basic', 'ao-thun-nam-basic', 'Áo thun nam chất liệu cotton 100%, kiểu dáng basic, nhiều màu sắc', 'Áo thun nam chất liệu cao cấp', (SELECT id FROM categories WHERE slug = 'thoi-trang'), 'Local Brand', 'ATN-001', 299000, 249000, 200, 20, true, false, 4.5, 234),
('Giày thể thao Nike', 'giay-the-thao-nike', 'Giày thể thao Nike Air Max, đế cao su bền bỉ, thiết kế thời trang', 'Giày thể thao Nike chính hãng', (SELECT id FROM categories WHERE slug = 'the-thao'), 'Nike', 'GTN-001', 2500000, 2200000, 80, 15, true, true, 4.6, 156);
```

## **Ví dụ cụ thể:**

```bash
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNjU0NzIwMCwiZXhwIjoxOTUyMTIzMjAwfQ.example
```

## **Lưu ý quan trọng:**

- **KHÔNG** commit file `.env.local` lên Git
- **KHÔNG** chia sẻ anon key với người khác
- Restart server sau khi thay đổi environment variables
- Sau khi tạo bảng, hãy kiểm tra quyền truy cập trong **Authentication** → **Policies**
