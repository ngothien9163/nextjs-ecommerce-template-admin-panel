# Database Test Guide - Products Edit Issue

## Vấn đề
Products edit không load được dữ liệu.

## Các bước test

### Bước 1: Test Database Connection
Mở browser console và chạy:

```javascript
// Import test function
import { runDatabaseTests } from './src/lib/test-database';

// Run tests
runDatabaseTests().then(console.log);
```

### Bước 2: Kiểm tra Console Logs
Khi vào trang edit product, kiểm tra console logs:

```
🔍 ProductEdit - queryResult: {...}
🔍 ProductEdit - isLoading: true/false
🔍 ProductEdit - error: null/error
🔍 ProductEdit - data: {...}
```

### Bước 3: Test Supabase trực tiếp
Trong Supabase SQL Editor, chạy:

```sql
-- Kiểm tra products
SELECT COUNT(*) FROM products;

-- Kiểm tra categories
SELECT COUNT(*) FROM categories;

-- Kiểm tra products với categories
SELECT 
    p.id,
    p.name,
    p.slug,
    c.name as category_name
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LIMIT 5;
```

## Expected Results

### Nếu database có dữ liệu:
- Products count > 0
- Categories count = 4
- Products có category_name

### Nếu database không có dữ liệu:
- Products count = 0
- Cần chạy SQL files

## Debug Steps

### 1. Kiểm tra Environment Variables
```bash
# .env.local
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 2. Test Connection
```javascript
// Browser console
import { testSupabaseConnection } from './src/lib/supabase';
testSupabaseConnection().then(console.log);
```

### 3. Test Specific Product
```javascript
// Nếu có product ID
import { testSpecificProduct } from './src/lib/test-database';
testSpecificProduct('product-id-here').then(console.log);
```

## Common Issues

### Issue 1: "No data found"
- **Cause**: Database chưa có dữ liệu
- **Solution**: Chạy SQL files

### Issue 2: "Connection failed"
- **Cause**: Environment variables sai
- **Solution**: Kiểm tra .env.local

### Issue 3: "Foreign key constraint"
- **Cause**: Data không khớp
- **Solution**: Chạy lại SQL files từ đầu

## SQL Files Setup

Chạy theo thứ tự:
1. `01-create-all-tables.sql`
2. `02-insert-all-data.sql`
3. `03-create-materialized-views.sql`

## Verification Commands

```sql
-- Sau khi setup, kiểm tra:
SELECT COUNT(*) FROM products; -- Phải có 18
SELECT COUNT(*) FROM categories; -- Phải có 4
SELECT COUNT(*) FROM media; -- Phải có 32

-- Kiểm tra relationship
SELECT 
    p.name,
    c.name as category_name
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LIMIT 3;
```

## Next Steps

1. Chạy database tests
2. Kiểm tra console logs
3. Verify SQL setup
4. Test edit form
5. Report results
