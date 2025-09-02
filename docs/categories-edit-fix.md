# Sửa lỗi Categories Edit

## Vấn đề đã gặp
- Lỗi "Cannot coerce the result to a single JSON object" khi save
- Lỗi "Error when updating category (status code: undefined)"

## Nguyên nhân
1. **Field không tồn tại**: Form sử dụng `meta_title` và `meta_description` nhưng interface `Category` không có
2. **Kiểu dữ liệu không đúng**: Một số field có kiểu dữ liệu không phù hợp
3. **Serialize dữ liệu**: Dữ liệu form không được xử lý đúng trước khi gửi

## Giải pháp đã áp dụng

### 1. Loại bỏ field SEO không tồn tại
```tsx
// Xóa các field này khỏi form
- meta_title
- meta_description
```

### 2. Thêm onFinish handler để xử lý dữ liệu
```tsx
const handleFormFinish = (values: any) => {
  console.log('Form values before processing:', values);
  
  // Đảm bảo featured_image_id là string hoặc null
  if (values.featured_image_id === '') {
    values.featured_image_id = null;
  }
  
  // Đảm bảo parent_id là string hoặc null
  if (values.parent_id === undefined || values.parent_id === '') {
    values.parent_id = null;
  }
  
  // Đảm bảo sort_order là number
  if (values.sort_order === undefined || values.sort_order === '') {
    values.sort_order = 0;
  } else {
    values.sort_order = Number(values.sort_order);
  }
  
  // Đảm bảo is_active là boolean
  if (values.is_active === undefined) {
    values.is_active = true;
  }
  
  // Loại bỏ các field không có trong interface Category
  const cleanedValues = {
    name: values.name,
    slug: values.slug,
    description: values.description,
    parent_id: values.parent_id,
    featured_image_id: values.featured_image_id,
    is_active: values.is_active,
    sort_order: values.sort_order,
  };
  
  console.log('Form values after processing:', cleanedValues);
  return cleanedValues;
};
```

### 3. Cập nhật Form component
```tsx
<Form 
  {...formProps} 
  layout="vertical"
  onFinish={handleFormFinish}
>
```

### 4. Thêm validation cho sort_order
```tsx
<Form.Item
  name="sort_order"
  initialValue={0}
  rules={[
    { type: 'number', min: 0, message: 'Thứ tự phải là số >= 0!' }
  ]}
>
  <InputNumber min={0} style={{ width: '100%' }} />
</Form.Item>
```

## Files đã sửa
1. `src/pages/categories/edit.tsx` - Sửa form edit
2. `src/pages/categories/create.tsx` - Sửa form create

## Kiểm tra
- Mở Developer Console để xem log dữ liệu
- Test chọn ảnh và save
- Kiểm tra dữ liệu được gửi đúng format

## Lưu ý
- SEO được quản lý trong bảng `SEOPage` riêng biệt
- Interface `Category` chỉ có các field cơ bản
- Cần đảm bảo dữ liệu được serialize đúng trước khi gửi

