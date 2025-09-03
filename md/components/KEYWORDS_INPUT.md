# 🏷️ KeywordsInput — Hướng dẫn rút gọn

## Mục đích
- Nhập từ khóa dạng tags, hỗ trợ tách bằng dấu phẩy, loại bỏ trùng lặp, và hiển thị đẹp trên mọi thiết bị.

## Cách dùng nhanh
```tsx
import { KeywordsInput } from '../../components/keywords-input';

<Form.Item name="meta_keywords">
  <KeywordsInput
    label="Meta Keywords"
    placeholder="Nhập từ khóa và nhấn Enter"
    maxTags={15}
  />
></Form.Item>
```

## Props chính
- value: string[] — giá trị hiện tại
- onChange: (value: string[]) => void — callback khi thay đổi
- placeholder: string (default: "Nhập từ khóa và nhấn Enter")
- tooltip: string (default: hướng dẫn nhập)
- label: string (default: "Keywords")
- disabled: boolean (default: false)
- maxTags: number (default: 20)
- allowDuplicates: boolean (default: false)

## Hành vi/Validation
- Tự động tách khi nhập dấu phẩy ,
- Giữ nguyên cụm từ có khoảng trắng (ví dụ: "Laptop Asus ExpertBook B1")
- Loại bỏ rỗng và duplicates (trừ khi allowDuplicates=true)

## Ví dụ input → output
Input: `Laptop Asus ExpertBook B1, Gaming Computer, High Performance`
Output:
```js
["Laptop Asus ExpertBook B1", "Gaming Computer", "High Performance"]
```

## Tích hợp Data Provider (array fields)
Nếu form gửi string, data provider sẽ chuyển sang array:
```ts
if (arrayFields.includes(key)) {
  if (Array.isArray(value)) {
    acc[key] = value.filter((v) => v && v.trim());
  } else if (typeof value === 'string') {
    acc[key] = value.split(',').map((v) => v.trim()).filter(Boolean);
  }
}
```

## Use cases phổ biến
- Media Form: `meta_keywords`
- Product Form: `tags`
- Blog Form: `categories`

## Lợi ích chính
- UX tốt (tags UI), tự động tách/loại trùng, responsive, tương thích với Form.Item và data provider.






