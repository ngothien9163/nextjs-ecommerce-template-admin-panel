# 🎨 MediaGallerySelector Component

## 📖 Tổng quan

**MediaGallerySelector** là component mới thay thế cho `CategoryImageSelector`, được xây dựng với `react-grid-gallery` để hỗ trợ chọn nhiều hình ảnh với UI/UX tốt hơn.

## ✨ Tính năng

### 🏆 Ưu điểm chính:
- **✅ Multiple Selection** - Chọn nhiều ảnh cùng lúc
- **✅ Masonry Layout** - Hiển thị đẹp với kích thước khác nhau
- **✅ Grid & List View** - 2 chế độ xem linh hoạt
- **✅ Search & Filter** - Tìm kiếm và lọc theo loại file
- **✅ Preview Grid** - Xem trước tất cả ảnh đã chọn
- **✅ Responsive Design** - Tự động điều chỉnh theo màn hình
- **✅ Performance** - Tối ưu cho danh sách lớn

### 🎯 So sánh với CategoryImageSelector:

| Tính năng | CategoryImageSelector | MediaGallerySelector |
|-----------|---------------------|---------------------|
| Multiple Selection | ❌ | ✅ |
| Grid Layout | ✅ | ✅ (Masonry) |
| List View | ❌ | ✅ |
| Search | ✅ | ✅ |
| Filter | ✅ | ✅ |
| Preview Grid | ❌ | ✅ |
| Responsive | ✅ | ✅ |
| Performance | 🟡 | ✅ |

## 🔧 Cài đặt

```bash
npm install react-grid-gallery
```

## 📝 Sử dụng

### 1. Import Component

```tsx
import { MediaGallerySelector } from '../../components/media-gallery-selector';
```

### 2. Basic Usage

```tsx
// Single image selection
<MediaGallerySelector
  value={selectedImage}
  onChange={setSelectedImage}
  multiple={false}
  placeholder="Chọn ảnh đại diện"
/>

// Multiple images selection
<MediaGallerySelector
  value={selectedImages}
  onChange={setSelectedImages}
  multiple={true}
  maxSelect={10}
  placeholder="Chọn nhiều ảnh cho gallery"
/>
```

### 3. Form Integration

```tsx
// Trong ProductForm hoặc BlogPostForm
<Form.Item
  label="Ảnh đại diện"
  name="featured_image_id"
>
  <MediaGallerySelector
    multiple={false}
    placeholder="Chọn ảnh đại diện"
  />
</Form.Item>

<Form.Item
  label="Thư viện ảnh"
  name="gallery_image_ids"
>
  <MediaGallerySelector
    multiple={true}
    maxSelect={8}
    placeholder="Chọn ảnh cho gallery"
  />
</Form.Item>
```

## ⚙️ Props

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `value` | `string[]` | `[]` | Array của image IDs đã chọn |
| `onChange` | `(value: string[]) => void` | - | Callback khi thay đổi selection |
| `placeholder` | `string` | "Chọn hình ảnh" | Placeholder text |
| `disabled` | `boolean` | `false` | Disable component |
| `multiple` | `boolean` | `true` | Cho phép chọn nhiều ảnh |
| `maxSelect` | `number` | `10` | Số ảnh tối đa được chọn |
| `onSelect` | `(media: Media[]) => void` | - | Callback với media objects |
| `folder` | `string` | - | Filter theo folder |
| `showUpload` | `boolean` | `false` | Hiển thị nút upload |

## 🎨 Features Chi tiết

### 1. Grid View (Masonry Layout)
- Layout tự động điều chỉnh theo kích thước ảnh
- Hover effects với scale và shadow
- Selection state với border highlight
- Tags hiển thị thông tin ảnh (type, size, dimensions)

### 2. List View
- Hiển thị dạng danh sách với thông tin chi tiết
- Thumbnail + metadata (tên, kích thước, ngày tạo)
- Selection state rõ ràng
- Responsive design

### 3. Search & Filter
- **Search**: Tìm kiếm theo tên file
- **File Type Filter**: JPEG, PNG, GIF, WebP
- **Sort**: Theo ngày tạo, tên file, kích thước
- **View Mode**: Grid hoặc List

### 4. Preview Area
- Grid preview của tất cả ảnh đã chọn
- Remove button cho từng ảnh
- "Xóa tất cả" button
- Empty state khi chưa chọn ảnh

## 🚀 Demo

Truy cập: `http://localhost:5173/media/gallery-selector-demo`

Demo bao gồm:
- ✅ Single image selection
- ✅ Multiple images selection  
- ✅ Product images (max 8)
- ✅ Blog images (max 5)
- ✅ Usage instructions

## 🛠️ Customization

### CSS Classes
```css
.media-gallery-selector
.media-gallery-selector .preview-area
.media-gallery-selector .preview-grid
.media-gallery-modal
.react-grid-gallery
.media-gallery-list
```

### Custom Styling
```tsx
<MediaGallerySelector
  style={{ border: '1px solid #d9d9d9' }}
  className="custom-media-selector"
/>
```

## 📱 Responsive Behavior

- **Desktop**: Full grid layout với filters
- **Tablet**: Responsive grid, filters stack
- **Mobile**: Compact preview, simplified filters

## ⚡ Performance

- **Virtualization**: Chỉ render ảnh trong viewport
- **Lazy Loading**: Load ảnh khi cần thiết
- **Caching**: Cache API responses
- **Debounced Search**: Tránh spam API calls

## 🔄 Migration từ CategoryImageSelector

```tsx
// Cũ
<CategoryImageSelector
  value={imageId}
  onChange={setImageId}
/>

// Mới
<MediaGallerySelector
  value={imageId ? [imageId] : []}
  onChange={(ids) => setImageId(ids[0])}
  multiple={false}
/>
```

## 🐛 Troubleshooting

### Common Issues:

1. **Images không load**: Kiểm tra Supabase Storage permissions
2. **Selection không work**: Đảm bảo `onChange` callback
3. **Performance chậm**: Kiểm tra số lượng ảnh và enable pagination

### Debug Mode:
```tsx
<MediaGallerySelector
  onSelect={(media) => console.log('Selected:', media)}
  onChange={(ids) => console.log('IDs:', ids)}
/>
```

## 🎯 Use Cases

### E-commerce:
- ✅ Product featured image (single)
- ✅ Product gallery (multiple)
- ✅ Category banner (single)

### Blog:
- ✅ Featured image (single)
- ✅ Content images (multiple)
- ✅ Gallery posts (multiple)

### CMS:
- ✅ Page banners (single/multiple)
- ✅ Content blocks (multiple)
- ✅ Media library management

## 📈 Roadmap

- [ ] Drag & drop reordering
- [ ] Bulk operations
- [ ] Advanced filters (date, size range)
- [ ] Upload integration
- [ ] Folder navigation
- [ ] Image editing integration

---

**✨ Component được tối ưu cho admin panel với UX/UI chuyên nghiệp!**
