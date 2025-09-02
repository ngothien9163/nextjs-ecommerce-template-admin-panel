# Media Management System - Hướng dẫn sử dụng

## Tổng quan

Hệ thống quản lý Media được xây dựng với 4 thư viện chính:
- **React Dropzone**: Upload files với drag & drop
- **React Image Crop**: Chỉnh sửa và crop hình ảnh
- **React Grid Layout**: Sắp xếp hình ảnh theo grid
- **PhotoSwipe**: Lightbox để xem hình ảnh fullscreen

## Cấu trúc Database

### Bảng `media`
```sql
CREATE TABLE media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_url TEXT NOT NULL,
    alt_text TEXT,
    title TEXT,
    meta_description TEXT,
    meta_keywords TEXT[],
    caption TEXT,
    credit TEXT,
    license TEXT,
    file_size INTEGER,
    mime_type TEXT,
    dimensions JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Bảng `media_relations`
```sql
CREATE TABLE media_relations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    media_id UUID REFERENCES media(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    relation_type TEXT DEFAULT 'primary',
    sort_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Tính năng chính

### 1. Upload Media (`/media/create`)
- ✅ Drag & drop files
- ✅ Upload nhiều files cùng lúc
- ✅ Preview files trước khi upload
- ✅ Validation file type và size
- ✅ Progress tracking
- ✅ Metadata management (alt text, title, caption, etc.)

### 2. Quản lý Media (`/media`)
- ✅ Grid layout với drag & drop
- ✅ Lightbox để xem chi tiết
- ✅ Search và filter
- ✅ Bulk operations
- ✅ Status management (active/inactive)

### 3. Chỉnh sửa Media (`/media/edit/:id`)
- ✅ Crop hình ảnh
- ✅ Rotate hình ảnh
- ✅ Edit metadata
- ✅ Preview changes
- ✅ Save cropped version

### 4. Xem chi tiết Media (`/media/show/:id`)
- ✅ Fullscreen lightbox
- ✅ Technical information
- ✅ Usage statistics
- ✅ Download link
- ✅ Copy URL

## Cách sử dụng

### 1. Upload Files
1. Vào `/media/create`
2. Kéo thả files hoặc click để chọn
3. Điền metadata (alt text, title, caption)
4. Click "Upload Files"
5. Files sẽ được upload lên Supabase Storage

### 2. Quản lý Media Library
1. Vào `/media`
2. Sử dụng grid layout để sắp xếp
3. Click vào hình ảnh để xem lightbox
4. Sử dụng search để tìm kiếm
5. Click Edit để chỉnh sửa

### 3. Chỉnh sửa hình ảnh
1. Vào `/media/edit/:id`
2. Click "Crop" để crop hình ảnh
3. Sử dụng "Xoay trái/phải" để rotate
4. Điều chỉnh metadata
5. Click "Lưu Crop" để lưu thay đổi

### 4. Sử dụng MediaSelector trong forms
```tsx
import { MediaSelector } from '../components';

// Trong form
<Form.Item label="Hình ảnh" name="featured_image_id">
  <MediaSelector 
    placeholder="Chọn hình ảnh"
    onChange={(value) => console.log('Selected:', value)}
  />
</Form.Item>
```

## API Endpoints

### Media CRUD
- `GET /media` - Danh sách media
- `POST /media` - Tạo media mới
- `GET /media/:id` - Chi tiết media
- `PUT /media/:id` - Cập nhật media
- `DELETE /media/:id` - Xóa media

### Media Relations
- `GET /media_relations` - Danh sách relations
- `POST /media_relations` - Tạo relation mới
- `DELETE /media_relations/:id` - Xóa relation

## Storage Configuration

### Supabase Storage Bucket
```sql
-- Tạo bucket 'media'
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true);

-- Policy cho public access
CREATE POLICY "Public Access" ON storage.objects 
FOR SELECT USING (bucket_id = 'media');
```

## Performance Optimization

### 1. Image Optimization
- Sử dụng WebP format khi có thể
- Compress images trước khi upload
- Lazy loading cho grid view

### 2. Caching
- Browser caching cho static images
- CDN cho global distribution
- Cache metadata trong memory

### 3. Pagination
- Load 20-50 items per page
- Virtual scrolling cho large datasets
- Infinite scroll option

## Security Considerations

### 1. File Upload Security
- Validate file types
- Limit file sizes
- Scan for malware
- Sanitize filenames

### 2. Access Control
- Role-based permissions
- Public/private media
- Watermarking for sensitive content

### 3. Storage Security
- Encrypted storage
- Backup strategy
- Version control

## Troubleshooting

### Common Issues

1. **Upload fails**
   - Check file size limits
   - Verify file type
   - Check network connection

2. **Images not displaying**
   - Verify Supabase Storage permissions
   - Check file URLs
   - Clear browser cache

3. **Crop not working**
   - Ensure image is loaded
   - Check browser compatibility
   - Verify canvas support

### Debug Mode
```tsx
// Enable debug logging
console.log('Media debug:', {
  file: fileData,
  upload: uploadResult,
  crop: cropData
});
```

## Future Enhancements

### Planned Features
- [ ] Video support
- [ ] Audio support
- [ ] Document preview
- [ ] Bulk operations
- [ ] Advanced filters
- [ ] AI tagging
- [ ] Duplicate detection
- [ ] Usage analytics

### Performance Improvements
- [ ] WebP conversion
- [ ] Thumbnail generation
- [ ] Progressive loading
- [ ] Background processing

## Support

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra console logs
2. Verify database connection
3. Check Supabase configuration
4. Contact development team
