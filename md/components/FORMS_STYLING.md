# 🧩 Forms Styling — Product & Category (rút gọn)

## Mục tiêu
- Giao diện form full-width, responsive, điều khiển chuẩn (Switch/Select/InputNumber), section rõ ràng và dễ đọc.

## Category Form (full width)
- Wrapper full width, min-height 100vh, background sáng.
- Input/Select/InputNumber/TextArea 100% width.
- Switch có kích thước, alignment chuẩn.

Snippet CSS tham khảo:
```css
.category-form-wrapper { width: 100%; min-height: 100vh; padding: 20px; background: #f5f5f5; }
.category-form-item .ant-select, .category-form-item .ant-input, .category-form-item .ant-input-number, .category-form-item .ant-textarea { width: 100% !important; }
.category-form-item .ant-switch { min-width: 44px; height: 22px; }
```

Responsive grid: xs/sm: 1 cột; md/lg: 2 cột.

## Product Form (sections đẹp, dễ đọc)
- Nền gradient nhẹ, section có radius, shadow, hover subtle.
- Header mỗi section có gradient riêng, padding 20px.
- Khoảng cách 20px giữa các section, animation nhẹ.

Keys gợi ý màu: basic (green), pricing (blue), inventory (purple), warranty (orange), description (cyan), status (pink).

## Sử dụng nhanh
```tsx
import { ProductForm } from '../../components/product-form';

<ProductForm form={formProps} isEdit={true} categorySelectProps={categorySelectProps} />
```

## Lợi ích
- UX tốt, rõ ràng; responsive; dễ maintain; styling đồng nhất giữa Product/Category.






