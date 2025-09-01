# 🏷️ KeywordsInput Component - Hướng dẫn sử dụng

## 🎯 **Mục đích**

Component `KeywordsInput` được tạo ra để thay thế input thông thường cho việc nhập từ khóa, cung cấp trải nghiệm người dùng tốt hơn với:

- ✅ **Tags UI**: Hiển thị từ khóa dưới dạng tags có thể xóa
- ✅ **Auto-complete**: Tự động tách từ khóa khi nhập dấu phẩy
- ✅ **Validation**: Loại bỏ duplicates, giới hạn số lượng
- ✅ **Responsive**: Tự động xuống dòng khi quá dài

## 📦 **Cài đặt**

Component đã được tích hợp sẵn trong project, không cần cài thêm thư viện nào.

## 🚀 **Cách sử dụng**

### **1. Import Component**

```tsx
import { KeywordsInput } from '../../components/keywords-input';
// hoặc
import { KeywordsInput } from '../../components';
```

### **2. Sử dụng cơ bản**

```tsx
<Form.Item name="meta_keywords">
  <KeywordsInput
    label="Meta Keywords"
    placeholder="Nhập từ khóa và nhấn Enter"
    maxTags={15}
  />
</Form.Item>
```

### **3. Sử dụng với Form.Item**

```tsx
<Form.Item
  name="keywords"
  rules={[{ required: true, message: 'Vui lòng nhập từ khóa!' }]}
>
  <KeywordsInput
    label="Từ khóa SEO"
    tooltip="Nhập từ khóa quan trọng cho SEO"
    placeholder="Ví dụ: laptop, gaming, asus"
    maxTags={10}
    allowDuplicates={false}
  />
</Form.Item>
```

## ⚙️ **Props**

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `value` | `string[]` | `[]` | Giá trị hiện tại (array các từ khóa) |
| `onChange` | `(value: string[]) => void` | - | Callback khi giá trị thay đổi |
| `placeholder` | `string` | `"Nhập từ khóa và nhấn Enter"` | Placeholder text |
| `tooltip` | `string` | `"Nhập từ khóa SEO, nhấn Enter hoặc dấu phẩy để thêm tag"` | Tooltip hiển thị |
| `label` | `string` | `"Keywords"` | Label hiển thị |
| `style` | `React.CSSProperties` | - | Custom styles |
| `disabled` | `boolean` | `false` | Vô hiệu hóa component |
| `maxTags` | `number` | `20` | Số lượng tags tối đa |
| `allowDuplicates` | `boolean` | `false` | Cho phép từ khóa trùng lặp |

## 🎨 **Tính năng**

### **1. Auto-separation**
- Tự động tách từ khóa khi nhập dấu phẩy `,`
- Hỗ trợ cụm từ dài như "Laptop Asus ExpertBook B1"
- Chỉ phân cách bằng dấu phẩy để giữ nguyên cụm từ

### **2. Validation**
- Loại bỏ từ khóa rỗng
- Loại bỏ duplicates (nếu `allowDuplicates={false}`)
- Giới hạn số lượng tags (theo `maxTags`)

### **3. UI/UX**
- Tags có màu xanh, dễ nhận biết
- Có thể xóa từng tag bằng nút X
- Tự động xuống dòng khi quá dài
- Hiển thị tooltip cho từ khóa dài

### **4. Responsive**
- Tự động điều chỉnh kích thước
- Hiển thị ellipsis cho từ khóa quá dài
- Responsive trên mobile

## 📝 **Ví dụ sử dụng**

### **1. Trong Media Form**

```tsx
<Form.Item name="meta_keywords">
  <KeywordsInput
    label="Meta Keywords"
    tooltip="Từ khóa SEO cho hình ảnh, phân cách bằng dấu phẩy"
    placeholder="Nhập từ khóa, phân cách bằng dấu phẩy"
    maxTags={15}
  />
</Form.Item>
```

### **2. Trong Product Form**

```tsx
<Form.Item name="tags">
  <KeywordsInput
    label="Product Tags"
    tooltip="Tags cho sản phẩm, phân cách bằng dấu phẩy"
    placeholder="Nhập từ khóa, phân cách bằng dấu phẩy"
    maxTags={10}
    allowDuplicates={false}
  />
</Form.Item>
```

### **3. Trong Blog Form**

```tsx
<Form.Item name="categories">
  <KeywordsInput
    label="Blog Categories"
    tooltip="Danh mục blog, phân cách bằng dấu phẩy"
    placeholder="Nhập từ khóa, phân cách bằng dấu phẩy"
    maxTags={5}
  />
</Form.Item>
```

## 🔧 **Tích hợp với Data Provider**

Component tự động tương thích với data provider đã được cập nhật:

```typescript
// Data provider tự động xử lý array fields
if (arrayFields.includes(key)) {
  if (Array.isArray(value)) {
    // Nếu đã là array (từ KeywordsInput), giữ nguyên
    acc[key] = value.filter(item => item && item.trim().length > 0);
  } else if (typeof value === 'string') {
    // Nếu là string, chuyển thành array
    acc[key] = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
  }
}
```

## 🎯 **Lợi ích**

1. **UX tốt hơn**: Tags UI dễ sử dụng hơn input thông thường
2. **Validation tự động**: Loại bỏ lỗi và duplicates
3. **Responsive**: Hoạt động tốt trên mọi thiết bị
4. **Tái sử dụng**: Có thể dùng ở nhiều form khác nhau
5. **Tương thích**: Hoạt động với Form.Item và data provider

## 🚀 **Kết quả**

- ✅ **Media Form**: Đã được cập nhật sử dụng KeywordsInput
- ✅ **Data Provider**: Tự động xử lý array fields
- ✅ **Database**: Lưu đúng định dạng array
- ✅ **UX**: Trải nghiệm người dùng tốt hơn

---

**🎉 KeywordsInput component đã sẵn sàng sử dụng!**
