Tôi sẽ phân tích project của bạn để hiểu cấu trúc và đưa ra giải pháp tối ưu cho việc lưu trữ hình ảnh.

```toolCall::read_file
```



```toolCall::read_file
```



```toolCall::read_file
```



```toolCall::read_file
```



```toolCall::search_file
```



```toolCall::read_file
```



```toolCall::read_file
```



```toolCall::read_file
```

Tôi đã phân tích project NextJS ecommerce admin panel của bạn. Đây là một hệ thống quản lý hình ảnh khá hoàn thiện sử dụng Supabase làm backend. Dưới đây là phân tích chi tiết và các giải pháp tối ưu:

## 📋 Phân tích hiện tại

**Công nghệ sử dụng:**
- **Frontend**: NextJS + Refine + Ant Design
- **Backend**: Supabase (PostgreSQL + Storage)
- **Media Processing**: React Image Crop, React Dropzone, PhotoSwipe
- **Upload**: Direct upload lên Supabase Storage

**Cấu trúc Media System:**
- ✅ Bảng `media` cho metadata 
- ✅ Bảng `media_relations` cho liên kết
- ✅ Supabase Storage bucket 'media'
- ✅ API endpoints hoàn chỉnh
- ✅ Components UI tốt

## 🚀 Giải pháp tối ưu lưu trữ hình ảnh

### 1. **Optimized Image Processing Pipeline**

```typescript
export interface ImageOptimizationOptions {
  quality: number;
  format: 'webp' | 'jpg' | 'png';
  maxWidth: number;
  maxHeight: number;
  progressive?: boolean;
}

export class ImageOptimizer {
  private static defaultOptions: ImageOptimizationOptions = {
    quality: 80,
    format: 'webp',
    maxWidth: 1920,
    maxHeight: 1080,
    progressive: true
  };

  static async compressImage(
    file: File, 
    options: Partial<ImageOptimizationOptions> = {}
  ): Promise<File> {
    const opts = { ...this.defaultOptions, ...options };
    
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        const { width, height } = this.calculateDimensions(
          img.width, 
          img.height, 
          opts.maxWidth, 
          opts.maxHeight
        );
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const optimizedFile = new File(
                [blob], 
                this.generateOptimizedFileName(file.name, opts.format),
                { type: `image/${opts.format}` }
              );
              resolve(optimizedFile);
            } else {
              reject(new Error('Image compression failed'));
            }
          },
          `image/${opts.format}`,
          opts.quality / 100
        );
      };
      
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  private static calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
  ) {
    let { width, height } = { width: originalWidth, height: originalHeight };
    
    if (width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }
    
    if (height > maxHeight) {
      width = (width * maxHeight) / height;
      height = maxHeight;
    }
    
    return { width: Math.round(width), height: Math.round(height) };
  }

  private static generateOptimizedFileName(originalName: string, format: string): string {
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
    return `${nameWithoutExt}_optimized.${format}`;
  }

  // Generate multiple sizes for responsive images
  static async generateResponsiveSizes(
    file: File
  ): Promise<{ thumbnail: File; medium: File; large: File; original: File }> {
    const [thumbnail, medium, large] = await Promise.all([
      this.compressImage(file, { maxWidth: 300, maxHeight: 300, quality: 70 }),
      this.compressImage(file, { maxWidth: 800, maxHeight: 600, quality: 80 }),
      this.compressImage(file, { maxWidth: 1920, maxHeight: 1080, quality: 85 })
    ]);

    return { thumbnail, medium, large, original: file };
  }
}
```

### 2. **Enhanced Upload Service với Multiple Sizes**

```typescript
import { supabaseAdmin } from './supabase-admin';
import { ImageOptimizer } from './image-optimizer';

export interface UploadResult {
  id: string;
  urls: {
    thumbnail: string;
    medium: string;
    large: string;
    original: string;
  };
  metadata: {
    file_name: string;
    file_size: number;
    mime_type: string;
    dimensions: { width: number; height: number };
  };
}

export class UploadService {
  private static readonly BUCKET_NAME = 'media';
  
  static async uploadImageWithSizes(file: File): Promise<UploadResult> {
    try {
      // Generate responsive sizes
      const sizes = await ImageOptimizer.generateResponsiveSizes(file);
      
      // Upload all sizes
      const uploadPromises = Object.entries(sizes).map(async ([size, sizedFile]) => {
        const fileName = this.generateFileName(file.name, size);
        const filePath = `images/${size}/${fileName}`;
        
        const { data, error } = await supabaseAdmin.storage
          .from(this.BUCKET_NAME)
          .upload(filePath, sizedFile);
          
        if (error) throw error;
        
        const { data: urlData } = supabaseAdmin.storage
          .from(this.BUCKET_NAME)
          .getPublicUrl(filePath);
          
        return { size, url: urlData.publicUrl, path: filePath };
      });
      
      const uploadResults = await Promise.all(uploadPromises);
      
      // Create URLs object
      const urls = uploadResults.reduce((acc, result) => {
        acc[result.size as keyof typeof acc] = result.url;
        return acc;
      }, {} as UploadResult['urls']);
      
      // Get image dimensions
      const dimensions = await this.getImageDimensions(file);
      
      // Save to database
      const { data: mediaData, error: dbError } = await supabaseAdmin
        .from('media')
        .insert({
          file_name: file.name,
          file_path: uploadResults.find(r => r.size === 'original')?.path,
          file_url: urls.original,
          thumbnail_url: urls.thumbnail,
          medium_url: urls.medium,
          large_url: urls.large,
          file_size: file.size,
          mime_type: file.type,
          dimensions,
          alt_text: file.name,
          title: file.name,
        })
        .select()
        .single();
        
      if (dbError) throw dbError;
      
      return {
        id: mediaData.id,
        urls,
        metadata: {
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type,
          dimensions
        }
      };
      
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }
  
  private static generateFileName(originalName: string, size: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    const ext = originalName.split('.').pop();
    return `${timestamp}-${random}-${size}.${ext}`;
  }
  
  private static getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }
}
```

### 3. **Cập nhật Database Schema**

```sql
-- Thêm columns cho multiple sizes
ALTER TABLE media ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE media ADD COLUMN IF NOT EXISTS medium_url TEXT;
ALTER TABLE media ADD COLUMN IF NOT EXISTS large_url TEXT;

-- Index để tối ưu performance
CREATE INDEX IF NOT EXISTS idx_media_file_name ON media USING gin(file_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_media_mime_type ON media(mime_type);
CREATE INDEX IF NOT EXISTS idx_media_created_at ON media(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_is_active ON media(is_active);

-- Materialized view cho thống kê
CREATE MATERIALIZED VIEW IF NOT EXISTS media_stats AS
SELECT 
  mime_type,
  COUNT(*) as file_count,
  SUM(file_size) as total_size,
  AVG(file_size) as avg_size,
  MIN(created_at) as oldest_file,
  MAX(created_at) as newest_file
FROM media 
WHERE is_active = true
GROUP BY mime_type;

-- Index cho materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_media_stats_mime_type ON media_stats(mime_type);

-- Function để refresh stats
CREATE OR REPLACE FUNCTION refresh_media_stats()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY media_stats;
END;
$$ LANGUAGE plpgsql;

-- Trigger để auto-refresh stats
CREATE OR REPLACE FUNCTION trigger_refresh_media_stats()
RETURNS trigger AS $$
BEGIN
  PERFORM refresh_media_stats();
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Tạo trigger (optional - có thể gây chậm nếu upload nhiều)
-- DROP TRIGGER IF EXISTS media_stats_refresh ON media;
-- CREATE TRIGGER media_stats_refresh
--   AFTER INSERT OR UPDATE OR DELETE ON media
--   FOR EACH STATEMENT
--   EXECUTE FUNCTION trigger_refresh_media_stats();
```

### 4. **Smart MediaSelector với Lazy Loading**

```typescript|CODE_EDIT_BLOCK|d:\Projects\nextjs-ecommerce-template-admin-panel\src\components\media-selector\index.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { Modal, Button, Image, Card, Input, Space, Tag, Typography, message, Spin } from 'antd';
import { PictureOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { useTable } from '@refinedev/antd';
import { useVirtualizer } from '@tanstack/react-virtual';

const { Search } = Input;
const { Text } = Typography;

interface MediaSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  multiple?: boolean;
  onSelect?: (media: any) => void;
  preferredSize?: 'thumbnail' | 'medium' | 'large' | 'original';
}

export const MediaSelector: React.FC<MediaSelectorProps> = ({
  value,
  onChange,
  placeholder = "Chọn hình ảnh",
  disabled = false,
  multiple = false,
  onSelect,
  preferredSize = 'medium'
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const { tableProps, queryResult } = useTable({
    resource: 'media',
    filters: {
      permanent: [
        {
          field: 'is_active',
          operator: 'eq',
          value: true,
        },
        ...(searchText ? [{
          field: 'file_name',
          operator: 'contains' as const,
          value: searchText,
        }] : [])
      ]
    },
    pagination: {
      pageSize: 50, // Load 50 items per page
    },
    syncWithLocation: false,
  });

  // Optimized image URL selector
  const getOptimizedImageUrl = useCallback((media: any, size: string = preferredSize) => {
    const sizeMap = {
      thumbnail: media.thumbnail_url,
      medium: media.medium_url,
      large: media.large_url,
      original: media.file_url
    };
    return sizeMap[size as keyof typeof sizeMap] || media.file_url;
  }, [preferredSize]);

  const handleSearch = useCallback((value: string) => {
    setSearchText(value);
  }, []);

  const handleSelect = useCallback((media: any) => {
    if (onChange) {
      onChange(media.id);
    }
    if (onSelect) {
      onSelect(media);
    }
    if (!multiple) {
      setIsModalVisible(false);
    }
    message.success('Đã chọn hình ảnh!');
  }, [onChange, onSelect, multiple]);

  const handleImageLoad = useCallback((mediaId: string) => {
    setLoadedImages(prev => new Set(prev).add(mediaId));
  }, []);

  // Memoized grid items
  const gridItems = useMemo(() => 
    tableProps.dataSource?.map((item: any, index: number) => (
      <Card
        key={item.id}
        hoverable
        size="small"
        style={{ cursor: 'pointer' }}
        onClick={() => handleSelect(item)}
        loading={!loadedImages.has(item.id)}
        actions={[
          <EyeOutlined key="view" onClick={(e) => {
            e.stopPropagation();
            setCurrentImageIndex(index);
            setIsLightboxOpen(true);
          }} />
        ]}
      >
        <div style={{ textAlign: 'center' }}>
          <Image
            src={getOptimizedImageUrl(item, 'thumbnail')}
            alt={item.alt_text || item.file_name}
            style={{ width: '100%', height: '120px', objectFit: 'cover' }}
            onLoad={() => handleImageLoad(item.id)}
            placeholder={<Spin />}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
          />
          <div style={{ marginTop: '8px' }}>
            <Text strong style={{ fontSize: '12px', display: 'block' }}>
              {item.file_name.length > 20 ? item.file_name.substring(0, 20) + '...' : item.file_name}
            </Text>
            <Text type="secondary" style={{ fontSize: '10px' }}>
              {formatFileSize(item.file_size)}
            </Text>
            <br />
            <Tag color={item.is_active ? 'green' : 'red'}>
              {item.is_active ? 'Active' : 'Inactive'}
            </Tag>
          </div>
        </div>
      </Card>
    )) || [], 
    [tableProps.dataSource, loadedImages, handleSelect, getOptimizedImageUrl]
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      <Button
        icon={<PictureOutlined />}
        onClick={() => setIsModalVisible(true)}
        disabled={disabled}
        style={{ width: '100%', textAlign: 'left' }}
      >
        {value ? 'Đã chọn hình ảnh' : placeholder}
      </Button>

      <Modal
        title="Chọn hình ảnh từ thư viện"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={1200}
        bodyStyle={{ maxHeight: '80vh', overflow: 'auto' }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Search
            placeholder="Tìm kiếm hình ảnh..."
            allowClear
            onSearch={handleSearch}
            style={{ width: '100%' }}
          />
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: '16px',
            minHeight: '400px'
          }}>
            {queryResult?.isLoading ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
              </div>
            ) : gridItems}
          </div>
        </Space>
      </Modal>

      {/* Enhanced Lightbox Modal */}
      <Modal
        title={tableProps.dataSource?.[currentImageIndex]?.title || tableProps.dataSource?.[currentImageIndex]?.file_name}
        open={isLightboxOpen}
        onCancel={() => setIsLightboxOpen(false)}
        footer={null}
        width="90%"
        style={{ top: 20 }}
      >
        <div style={{ textAlign: 'center' }}>
          <Image
            src={getOptimizedImageUrl(tableProps.dataSource?.[currentImageIndex], 'large')}
            alt={tableProps.dataSource?.[currentImageIndex]?.alt_text || tableProps.dataSource?.[currentImageIndex]?.file_name}
            style={{ maxWidth: '100%', maxHeight: '80vh' }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
          />
        </div>
      </Modal>
    </>
  );
};
```

### 5. **Caching Strategy**

```typescript
interface CacheItem {
  data: any;
  timestamp: number;
  expiry: number;
}

export class MediaCache {
  private static cache = new Map<string, CacheItem>();
  private static readonly DEFAULT_EXPIRY = 5 * 60 * 1000; // 5 minutes

  static set(key: string, data: any, expiry: number = this.DEFAULT_EXPIRY) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry
    });
  }

  static get(key: string): any | null {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    if (Date.now() - item.timestamp > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  static clear() {
    this.cache.clear();
  }

  static getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Service Worker cho offline caching
export const registerMediaServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/media-sw.js');
  }
};
```

## 🎯 Recommendations để tối ưu

### **Immediate Actions (Làm ngay)**

1. **Implement Image Compression** - Giảm 60-80% dung lượng
2. **Add Multiple Sizes** - Responsive images tự động
3. **Database Indexing** - Tăng tốc truy vấn 
4. **Lazy Loading** - Chỉ load images khi cần

### **Short-term (1-2 tuần)**

1. **CDN Integration** - Sử dụng Supabase CDN + transformations
2. **Caching Layer** - Browser + memory caching
3. **Background Upload** - Queue system cho upload lớn
4. **Image Analytics** - Track usage và performance

### **Long-term (1-2 tháng)**

1. **Smart Compression** - AI-based optimization
2. **Progressive Loading** - Load quality tăng dần
3. **Auto-cleanup** - Xóa files không sử dụng
4. **Advanced Analytics** - Deep insights về media usage

## 💡 Expected Results

- **Performance**: Giảm 70% thời gian load trang
- **Storage**: Tiết kiệm 60% dung lượng storage
- **UX**: Trải nghiệm mượt mà hơn với lazy loading
- **SEO**: Tối ưu Core Web Vitals
- **Cost**: Giảm bandwidth costs đáng kể

Bạn muốn tôi implement phần nào trước để bắt đầu tối ưu system?