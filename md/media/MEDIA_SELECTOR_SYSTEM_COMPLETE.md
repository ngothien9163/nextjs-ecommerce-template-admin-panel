# 🎨 Media Selector System - Complete Guide

## 📋 Overview
This document consolidates all media selector and gallery functionality including improvements, gallery selector component, and UI enhancements.

## 🎯 Core Components

### 1. Enhanced Media Selector

#### **Features Added**
- ✅ **Refresh Button**: Làm mới danh sách hình ảnh từ server
- ✅ **Upload Button**: Mở trang upload trong tab mới
- ✅ **Improved Layout**: Responsive 4-column layout
- ✅ **Loading States**: Visual feedback cho các actions
- ✅ **Success Messages**: Thông báo khi refresh thành công

#### **UI Improvements**
```tsx
// Enhanced layout with actions column
<Col span={4}>
  <Space size={8}>
    <Button
      icon={<ReloadOutlined />}
      onClick={handleRefresh}
      loading={tableProps.loading}
      title="Làm mới danh sách"
    />
    <Button
      type="primary"
      icon={<UploadOutlined />}
      onClick={handleUploadImage}
      title="Upload hình ảnh mới"
    >
      Upload
    </Button>
  </Space>
</Col>
```

#### **Functionality**
```typescript
// Refresh functionality
const handleRefresh = () => {
  tableQuery.refetch();
  message.success('Đã làm mới danh sách hình ảnh!');
};

// Upload functionality
const handleUploadImage = () => {
  window.open('/media/create', '_blank');
};
```

### 2. Media Gallery Selector Component

#### **Overview**
**MediaGallerySelector** là component mới thay thế cho `CategoryImageSelector`, được xây dựng với `react-grid-gallery` để hỗ trợ chọn nhiều hình ảnh với UI/UX tốt hơn.

#### **Key Advantages**
| Feature | CategoryImageSelector | MediaGallerySelector |
|---------|----------------------|---------------------|
| Multiple Selection | ❌ | ✅ |
| Grid Layout | ✅ | ✅ (Masonry) |
| List View | ❌ | ✅ |
| Search | ✅ | ✅ |
| Filter | ✅ | ✅ |
| Preview Grid | ❌ | ✅ |
| Responsive | ✅ | ✅ |
| Performance | 🟡 | ✅ |

#### **Installation**
```bash
npm install react-grid-gallery
```

#### **Basic Usage**
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

#### **Form Integration**
```tsx
// Product form
<Form.Item label="Ảnh đại diện" name="featured_image_id">
  <MediaGallerySelector
    multiple={false}
    placeholder="Chọn ảnh đại diện"
  />
</Form.Item>

<Form.Item label="Thư viện ảnh" name="gallery_image_ids">
  <MediaGallerySelector
    multiple={true}
    maxSelect={8}
    placeholder="Chọn ảnh cho gallery"
  />
</Form.Item>
```

### 3. Advanced Features

#### **Grid View (Masonry Layout)**
- Layout tự động điều chỉnh theo kích thước ảnh
- Hover effects với scale và shadow
- Selection state với border highlight
- Tags hiển thị thông tin ảnh (type, size, dimensions)

#### **List View**
- Hiển thị dạng danh sách với thông tin chi tiết
- Thumbnail + metadata (tên, kích thước, ngày tạo)
- Selection state rõ ràng
- Responsive design

#### **Search & Filter**
- **Search**: Tìm kiếm theo tên file
- **File Type Filter**: JPEG, PNG, GIF, WebP
- **Sort**: Theo ngày tạo, tên file, kích thước
- **View Mode**: Grid hoặc List

#### **Preview Area**
- Grid preview của tất cả ảnh đã chọn
- Remove button cho từng ảnh
- "Xóa tất cả" button
- Empty state khi chưa chọn ảnh

## 🔧 Technical Implementation

### Props Reference
```typescript
interface MediaGallerySelectorProps {
  value?: string[];                    // Array of selected image IDs
  onChange?: (value: string[]) => void; // Callback when selection changes
  placeholder?: string;                // Placeholder text
  disabled?: boolean;                  // Disable component
  multiple?: boolean;                  // Allow multiple selection
  maxSelect?: number;                  // Maximum selectable images
  onSelect?: (media: Media[]) => void; // Callback with media objects
  folder?: string;                     // Filter by folder
  showUpload?: boolean;                // Show upload button
}
```

### Component Architecture
```typescript
// Main component structure
const MediaGallerySelector: React.FC<MediaGallerySelectorProps> = ({
  value = [],
  onChange,
  placeholder = "Chọn hình ảnh",
  disabled = false,
  multiple = true,
  maxSelect = 10,
  onSelect,
  folder,
  showUpload = false
}) => {
  // State management
  const [selectedImages, setSelectedImages] = useState<string[]>(value);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchText, setSearchText] = useState('');

  // Data fetching
  const { tableProps, searchFormProps } = useTable({
    resource: 'media',
    // ... configuration
  });

  // Event handlers
  const handleImageSelect = (imageId: string) => {
    // Selection logic
  };

  const handleImageRemove = (imageId: string) => {
    // Removal logic
  };

  // Render
  return (
    <div className="media-gallery-selector">
      {/* Header with controls */}
      {/* Gallery/List view */}
      {/* Preview area */}
    </div>
  );
};
```

### Data Flow
```
User Interaction → State Update → onChange Callback → Form Update
       ↓
Data Fetching → Filtering → Sorting → Rendering
       ↓
Selection Logic → Validation → Preview Update
```

## 🎨 UI/UX Design

### Responsive Behavior
- **Desktop**: Full grid layout với filters
- **Tablet**: Responsive grid, filters stack
- **Mobile**: Compact preview, simplified filters

### Visual Design
```css
.media-gallery-selector {
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  padding: 16px;
}

.media-gallery-selector .preview-area {
  margin-top: 16px;
  padding: 12px;
  background: #fafafa;
  border-radius: 4px;
}

.media-gallery-selector .preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 8px;
}
```

### Interaction States
- **Hover**: Scale effect on images
- **Selected**: Blue border and checkmark
- **Loading**: Skeleton placeholders
- **Error**: Error messages and retry options

## 📊 Performance Optimizations

### Virtualization
- Chỉ render ảnh trong viewport
- Lazy loading cho images
- Infinite scroll cho large datasets

### Caching Strategy
- Cache API responses
- Memoize expensive computations
- Debounced search input

### Memory Management
- Clean up blob URLs
- Efficient state updates
- Garbage collection optimization

## 🔄 Migration Guide

### From CategoryImageSelector
```tsx
// Old implementation
<CategoryImageSelector
  value={imageId}
  onChange={setImageId}
/>

// New implementation
<MediaGallerySelector
  value={imageId ? [imageId] : []}
  onChange={(ids) => setImageId(ids[0])}
  multiple={false}
/>
```

### Form Integration Update
```tsx
// Update form handling
const handleImageChange = (selectedIds: string[]) => {
  if (multiple) {
    setGalleryImages(selectedIds);
  } else {
    setFeaturedImage(selectedIds[0]);
  }
};
```

## 🧪 Testing & Quality Assurance

### Test Scenarios
1. **Single Selection**: Select/deselect individual images
2. **Multiple Selection**: Select multiple images with limits
3. **Search & Filter**: Test search and filtering functionality
4. **View Modes**: Switch between grid and list views
5. **Responsive**: Test on different screen sizes
6. **Error Handling**: Test error states and recovery

### Performance Testing
- Large dataset handling (1000+ images)
- Search performance with debouncing
- Memory usage monitoring
- Network request optimization

### Accessibility Testing
- Keyboard navigation
- Screen reader compatibility
- Color contrast verification
- Focus management

## 🚀 Advanced Usage

### Custom Styling
```tsx
<MediaGallerySelector
  style={{ border: '1px solid #d9d9d9' }}
  className="custom-media-selector"
/>
```

### Custom Validation
```tsx
<MediaGallerySelector
  maxSelect={5}
  onSelect={(media) => {
    // Custom validation logic
    const validImages = media.filter(img => img.file_size < 5 * 1024 * 1024);
    if (validImages.length !== media.length) {
      message.warning('Some images exceed 5MB limit');
    }
  }}
/>
```

### Integration with External APIs
```tsx
// Custom data source
const customDataProvider = {
  getList: async (params) => {
    // Fetch from external API
    const response = await fetch('/api/external-media');
    return response.json();
  }
};
```

## 📚 API Integration

### RESTful Endpoints
```typescript
// Get media list
GET /api/media?search=query&type=image&limit=20&offset=0

// Get media by ID
GET /api/media/:id

// Upload media
POST /api/media/upload
Content-Type: multipart/form-data

// Update media
PUT /api/media/:id

// Delete media
DELETE /api/media/:id
```

### WebSocket Support
```typescript
// Real-time updates
const socket = io('/media');

socket.on('media:uploaded', (newMedia) => {
  // Update UI with new media
});

socket.on('media:deleted', (deletedId) => {
  // Remove from selection
});
```

## 🔒 Security Features

### Input Validation
- File type verification
- Size limit enforcement
- Content security scanning
- XSS prevention

### Access Control
- User authentication
- Permission-based access
- Rate limiting
- Audit logging

## 📈 Analytics & Monitoring

### Usage Tracking
- Selection patterns
- Popular image types
- User interaction flows
- Performance metrics

### Error Monitoring
- Failed selections
- Network errors
- Component crashes
- User feedback

---

*This document consolidates all selector-related guides from:*
- MEDIA_SELECTOR_IMPROVEMENTS.md
- MEDIA_GALLERY_SELECTOR_GUIDE.md