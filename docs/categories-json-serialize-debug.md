# Debug Categories Edit - JSON Serialize Error

## Vấn đề
- Lỗi "Cannot coerce the result to a single JSON object"
- Lỗi "Error when updating category (status code: undefined)"

## Nguyên nhân có thể

### 1. Database Schema Issues
- Field `featured_image_id` có thể không tồn tại trong database
- Foreign key constraint violation
- Data type mismatch

### 2. Refine Configuration Issues
- API endpoint không đúng
- Authentication issues
- CORS issues

### 3. Data Format Issues
- Featured image ID không đúng format
- Parent ID không đúng format
- Sort order không phải number

## Debug Steps

### 1. Kiểm tra Database Schema
```sql
-- Kiểm tra bảng categories
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'categories';

-- Kiểm tra foreign key constraints
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE constraint_type = 'FOREIGN KEY' AND tc.table_name='categories';
```

### 2. Kiểm tra API Endpoint
```bash
# Test API endpoint
curl -X GET "YOUR_SUPABASE_URL/rest/v1/categories" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

### 3. Kiểm tra Data Types
```typescript
// Đảm bảo dữ liệu đúng type
const cleanedValues = {
  name: String(values.name),
  slug: String(values.slug),
  description: values.description ? String(values.description) : null,
  parent_id: values.parent_id ? String(values.parent_id) : null,
  featured_image_id: values.featured_image_id ? String(values.featured_image_id) : null,
  is_active: Boolean(values.is_active),
  sort_order: Number(values.sort_order),
};
```

## Giải pháp thử nghiệm

### 1. Tạm thời bỏ featured_image_id
```tsx
// Comment out featured_image_id field
// <Form.Item name="featured_image_id">
//   <CategoryImageSelector />
// </Form.Item>
```

### 2. Sử dụng raw values
```tsx
const handleFormSubmit = (values: any) => {
  // Gửi raw values không xử lý
  console.log('Raw values:', values);
  return values;
};
```

### 3. Kiểm tra network request
- Mở Developer Tools → Network tab
- Bấm Save và xem request
- Kiểm tra request payload và response

## Test Cases

### Case 1: Không có featured_image_id
```json
{
  "name": "Test Category",
  "slug": "test-category",
  "description": "Test description",
  "parent_id": null,
  "is_active": true,
  "sort_order": 0
}
```

### Case 2: Có featured_image_id
```json
{
  "name": "Test Category",
  "slug": "test-category", 
  "description": "Test description",
  "parent_id": null,
  "featured_image_id": "1679800d-1dec-47bb-b2df-df03a7ea3187",
  "is_active": true,
  "sort_order": 0
}
```

## Lưu ý
- Kiểm tra Supabase logs
- Kiểm tra RLS policies
- Kiểm tra API permissions

