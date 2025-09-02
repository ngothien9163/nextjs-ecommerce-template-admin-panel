# CategoryImageSelector Component

## Mô tả
Component tối ưu hóa để chọn ảnh đại diện cho categories từ thư viện media.

## Tính năng chính

### 1. Preview ảnh đã chọn
- Hiển thị ảnh đại diện đã chọn với kích thước thumbnail
- Thông tin chi tiết: tên file, kích thước, ngày tạo
- Nút xem ảnh full size và xóa ảnh

### 2. Modal chọn ảnh tối ưu
- **Tìm kiếm**: Tìm kiếm theo tên file
- **Lọc theo loại file**: JPEG, PNG, GIF, WebP
- **Sắp xếp**: Theo ngày tạo, tên file, kích thước
- **Grid layout**: Hiển thị ảnh dạng lưới responsive
- **Lightbox**: Xem ảnh full size

### 3. UX/UI tối ưu
- Loading state khi tải dữ liệu
- Empty state khi không có ảnh
- Highlight ảnh đã chọn
- Responsive design
- Keyboard navigation

## Cách sử dụng

### Import component
```tsx
import { CategoryImageSelector } from '../../components/media-selector/CategoryImageSelector';
```

### Sử dụng trong Form
```tsx
<Form.Item
  label="Ảnh đại diện"
  name="featured_image_id"
>
  <CategoryImageSelector 
    placeholder="Chọn ảnh đại diện cho danh mục"
    onSelect={(media) => {
      console.log('Đã chọn:', media);
    }}
  />
</Form.Item>
```

### Props
| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `value` | `string` | - | ID của media đã chọn |
| `onChange` | `(value: string) => void` | - | Callback khi chọn/xóa ảnh |
| `placeholder` | `string` | "Chọn ảnh đại diện" | Placeholder cho button |
| `disabled` | `boolean` | `false` | Vô hiệu hóa component |
| `onSelect` | `(media: Media) => void` | - | Callback khi chọn media |

### Interface Media
```tsx
interface Media extends BaseRecord {
  id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  is_active: boolean;
  alt_text?: string;
  title?: string;
  file_type?: string;
  created_at?: string;
}
```

## Tối ưu hóa hiệu suất

### 1. Lazy loading
- Chỉ tải ảnh khi cần thiết
- Sử dụng fallback image cho ảnh lỗi

### 2. Debounced search
- Tìm kiếm được debounce để tránh gọi API quá nhiều

### 3. Efficient filtering
- Filter được thực hiện ở server side
- Chỉ load ảnh active

### 4. Memory management
- Cleanup state khi component unmount
- Optimized re-renders

## Tích hợp với Refine

Component sử dụng `useTable` hook của Refine để:
- Quản lý state loading
- Xử lý pagination
- Filter và sort data
- Sync với URL params (tắt trong trường hợp này)

## Styling

Component sử dụng Ant Design components với:
- Consistent spacing và typography
- Responsive grid layout
- Hover effects
- Loading states
- Empty states

## Accessibility

- Keyboard navigation support
- Screen reader friendly
- Proper ARIA labels
- Focus management

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11+ (với polyfills)
- Mobile browsers

## Dependencies

- React 16.8+
- Ant Design 4.x+
- Refine 4.x+
- TypeScript 4.x+
