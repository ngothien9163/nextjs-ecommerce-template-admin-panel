# Products Data Loading Troubleshooting

## Vấn đề
Products không load được data trong admin panel.

## Nguyên nhân có thể

### 1. Database chưa được setup
- **Triệu chứng**: Không có dữ liệu products
- **Giải pháp**: Chạy lại SQL files theo thứ tự

### 2. Foreign key constraint errors
- **Triệu chứng**: Lỗi khi insert data
- **Nguyên nhân**: Media files được tham chiếu nhưng không tồn tại
- **Giải pháp**: Đã sửa trong file `02-insert-all-data.sql`

### 3. Interface không khớp với database schema
- **Triệu chứng**: TypeScript errors
- **Nguyên nhân**: Interface `Category` thiếu fields
- **Giải pháp**: Đã cập nhật interface

## Các bước kiểm tra

### Bước 1: Kiểm tra database connection
```sql
-- Test connection
SELECT COUNT(*) FROM profiles;
```

### Bước 2: Kiểm tra dữ liệu
```sql
-- Kiểm tra products
SELECT COUNT(*) FROM products;

-- Kiểm tra categories
SELECT COUNT(*) FROM categories;

-- Kiểm tra media
SELECT COUNT(*) FROM media;

-- Kiểm tra relationship
SELECT 
    p.name as product_name,
    c.name as category_name
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LIMIT 5;
```

### Bước 3: Kiểm tra foreign keys
```sql
-- Kiểm tra products có category_id hợp lệ
SELECT 
    p.name,
    p.category_id,
    c.name as category_name
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE c.id IS NULL;
```

### Bước 4: Kiểm tra media references
```sql
-- Kiểm tra products có featured_image_id hợp lệ
SELECT 
    p.name,
    p.featured_image_id,
    m.file_name
FROM products p
LEFT JOIN media m ON p.featured_image_id = m.id
WHERE p.featured_image_id IS NOT NULL AND m.id IS NULL;
```

## Giải pháp

### 1. Setup lại database
```sql
-- Chạy theo thứ tự:
-- 1. 01-create-all-tables.sql
-- 2. 02-insert-all-data.sql  
-- 3. 03-create-materialized-views.sql
```

### 2. Kiểm tra environment variables
```bash
# .env.local
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Kiểm tra dataProvider
- Đã cập nhật để join với categories
- Đã sửa interface Category

### 4. Test connection trong browser
```javascript
// Mở browser console và chạy:
import { testSupabaseConnection } from './src/lib/supabase';
testSupabaseConnection().then(console.log);
```

## Expected Results

Sau khi setup thành công:
- **18 products** trong database
- **4 categories** (laptops, smartphones, tablets, accessories)
- **32 media files** cho sản phẩm
- **19 tags** đa dạng

## Debug Commands

### Kiểm tra data trong Supabase
```sql
-- Xem tất cả products
SELECT 
    p.name,
    p.slug,
    p.price,
    c.name as category_name,
    m.file_name as image_name
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN media m ON p.featured_image_id = m.id
ORDER BY p.created_at DESC;
```

### Kiểm tra categories với product count
```sql
SELECT 
    c.name,
    c.slug,
    c.product_count,
    COUNT(p.id) as actual_count
FROM categories c
LEFT JOIN products p ON c.id = p.category_id AND p.is_active = true
GROUP BY c.id, c.name, c.slug, c.product_count;
```

## Common Issues

### Issue 1: "No data found"
- **Cause**: Database chưa có dữ liệu
- **Solution**: Chạy lại SQL files

### Issue 2: "Foreign key constraint failed"
- **Cause**: Tham chiếu đến record không tồn tại
- **Solution**: Chạy lại từ đầu theo thứ tự

### Issue 3: "Type error"
- **Cause**: Interface không khớp với database
- **Solution**: Đã cập nhật interfaces

### Issue 4: "Connection failed"
- **Cause**: Supabase URL/Key sai
- **Solution**: Kiểm tra environment variables

## Next Steps

1. Chạy lại SQL files theo thứ tự
2. Kiểm tra kết quả với debug commands
3. Restart development server
4. Test products page

## Support

Nếu vẫn gặp vấn đề:
1. Kiểm tra Supabase logs
2. Kiểm tra browser console
3. Kiểm tra network requests
4. Verify database schema

