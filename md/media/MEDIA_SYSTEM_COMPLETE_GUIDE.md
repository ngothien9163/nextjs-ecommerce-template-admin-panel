# 📸 Media System - Complete Guide & Optimization

## 📋 Overview
This document consolidates all media-related guides, optimizations, and troubleshooting for the complete media management system.

## 🏗️ System Architecture

### Database Schema
```sql
-- Media Table
CREATE TABLE media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name TEXT NOT NULL,
    file_path TEXT,
    file_url TEXT,
    thumbnail_url TEXT,      -- NEW: Multiple sizes
    medium_url TEXT,         -- NEW: Multiple sizes
    large_url TEXT,          -- NEW: Multiple sizes
    alt_text TEXT,
    title TEXT,
    meta_description TEXT,
    caption TEXT,
    file_size INTEGER,
    mime_type TEXT,
    dimensions JSONB,        -- {width: number, height: number}
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Media Relations Table
CREATE TABLE media_relations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    media_id UUID REFERENCES media(id),
    reference_type TEXT NOT NULL, -- 'blog', 'product', 'category'
    reference_id UUID NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Storage Structure
```
supabase-storage/
├── media/
│   ├── images/
│   │   ├── thumbnail/
│   │   ├── medium/
│   │   ├── large/
│   │   └── original/
│   ├── documents/
│   └── videos/
```

## 🚀 Optimization Pipeline

### 1. Image Compression & Optimization

#### **ImageOptimizer Class**
```typescript
export class ImageOptimizer {
  static async compressImage(
    file: File,
    options: Partial<ImageOptimizationOptions> = {}
  ): Promise<File> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    return new Promise((resolve, reject) => {
      img.onload = () => {
        // Calculate optimal dimensions
        const { width, height } = this.calculateDimensions(
          img.width, img.height,
          options.maxWidth || 1920,
          options.maxHeight || 1080
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
                this.generateOptimizedFileName(file.name, options.format || 'webp'),
                { type: `image/${options.format || 'webp'}` }
              );
              resolve(optimizedFile);
            } else {
              reject(new Error('Image compression failed'));
            }
          },
          `image/${options.format || 'webp'}`,
          (options.quality || 80) / 100
        );
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  static async generateResponsiveSizes(file: File): Promise<{
    thumbnail: File;
    medium: File;
    large: File;
    original: File;
  }> {
    const [thumbnail, medium, large] = await Promise.all([
      this.compressImage(file, { maxWidth: 300, maxHeight: 300, quality: 70 }),
      this.compressImage(file, { maxWidth: 800, maxHeight: 600, quality: 80 }),
      this.compressImage(file, { maxWidth: 1920, maxHeight: 1080, quality: 85 })
    ]);

    return { thumbnail, medium, large, original: file };
  }
}
```

### 2. Enhanced Upload Service

#### **UploadService with Multiple Sizes**
```typescript
export class UploadService {
  private static readonly BUCKET_NAME = 'media';

  static async uploadImageWithSizes(file: File): Promise<UploadResult> {
    try {
      // Generate responsive sizes
      const sizes = await ImageOptimizer.generateResponsiveSizes(file);

      // Upload all sizes in parallel
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

      // Create database record
      const { data: mediaData, error: dbError } = await supabaseAdmin
        .from('media')
        .insert({
          file_name: file.name,
          file_path: uploadResults.find(r => r.size === 'original')?.path,
          file_url: uploadResults.find(r => r.size === 'original')?.url,
          thumbnail_url: uploadResults.find(r => r.size === 'thumbnail')?.url,
          medium_url: uploadResults.find(r => r.size === 'medium')?.url,
          large_url: uploadResults.find(r => r.size === 'large')?.url,
          file_size: file.size,
          mime_type: file.type,
          dimensions: await this.getImageDimensions(file),
          alt_text: file.name,
          title: file.name,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      return {
        id: mediaData.id,
        urls: {
          thumbnail: uploadResults.find(r => r.size === 'thumbnail')?.url || '',
          medium: uploadResults.find(r => r.size === 'medium')?.url || '',
          large: uploadResults.find(r => r.size === 'large')?.url || '',
          original: uploadResults.find(r => r.size === 'original')?.url || '',
        },
        metadata: {
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type,
          dimensions: await this.getImageDimensions(file)
        }
      };

    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }
}
```

## 🎨 UI Components

### 1. React Dropzone Integration

#### **Installation & Setup**
```bash
npm install react-dropzone
```

#### **Basic Usage**
```tsx
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

function MediaUpload() {
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach(file => {
      console.log('Uploaded file:', file);
      // Process upload here
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: true,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  return (
    <div {...getRootProps()} className="dropzone">
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Thả files vào đây...</p>
      ) : (
        <p>Kéo thả files hoặc click để chọn</p>
      )}
    </div>
  );
}
```

### 2. React Image Crop

#### **Installation & Setup**
```bash
npm install react-image-crop
```

#### **Usage**
```tsx
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

function ImageCropper({ imageSrc, onCropComplete }) {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 30,
    aspect: 16 / 9
  });

  return (
    <ReactCrop
      crop={crop}
      onChange={setCrop}
      onComplete={onCropComplete}
    >
      <img src={imageSrc} alt="Crop me" />
    </ReactCrop>
  );
}
```

### 3. React Grid Layout

#### **Installation & Setup**
```bash
npm install react-grid-layout
```

#### **Usage**
```tsx
import GridLayout from 'react-grid-layout';

function MediaGrid({ mediaItems }) {
  const layout = mediaItems.map((item, index) => ({
    i: item.id,
    x: (index % 4) * 3,
    y: Math.floor(index / 4) * 3,
    w: 3,
    h: 3
  }));

  return (
    <GridLayout
      className="layout"
      layout={layout}
      cols={12}
      rowHeight={100}
      width={1200}
    >
      {mediaItems.map(item => (
        <div key={item.id}>
          <img src={item.file_url} alt={item.alt_text} />
        </div>
      ))}
    </GridLayout>
  );
}
```

### 4. React Image Lightbox

#### **Installation & Setup**
```bash
npm install react-image-lightbox
```

#### **Usage**
```tsx
import Lightbox from 'react-image-lightbox';

function MediaLightbox({ images, photoIndex, isOpen, onClose }) {
  return (
    isOpen && (
      <Lightbox
        mainSrc={images[photoIndex].file_url}
        nextSrc={images[(photoIndex + 1) % images.length].file_url}
        prevSrc={images[(photoIndex + images.length - 1) % images.length].file_url}
        onCloseRequest={onClose}
        onMovePrevRequest={() => setPhotoIndex((photoIndex + images.length - 1) % images.length)}
        onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % images.length)}
      />
    )
  );
}
```

## 🔧 Media Selector Component

### **Enhanced Media Selector**
```tsx
import React, { useState, useCallback } from 'react';
import { Modal, Button, Image, Card, Input, Space, Tag } from 'antd';
import { PictureOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { useTable } from '@refinedev/antd';

const { Search } = Input;

interface MediaSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  preferredSize?: 'thumbnail' | 'medium' | 'large' | 'original';
}

export const MediaSelector: React.FC<MediaSelectorProps> = ({
  value,
  onChange,
  preferredSize = 'medium'
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const { tableProps, queryResult } = useTable({
    resource: 'media',
    filters: {
      permanent: [
        { field: 'is_active', operator: 'eq', value: true },
        ...(searchText ? [{
          field: 'file_name',
          operator: 'contains',
          value: searchText
        }] : [])
      ]
    },
    pagination: { pageSize: 50 }
  });

  const getOptimizedImageUrl = useCallback((media: any, size: string = preferredSize) => {
    const sizeMap = {
      thumbnail: media.thumbnail_url,
      medium: media.medium_url,
      large: media.large_url,
      original: media.file_url
    };
    return sizeMap[size as keyof typeof sizeMap] || media.file_url;
  }, [preferredSize]);

  const handleSelect = useCallback((media: any) => {
    if (onChange) onChange(media.id);
    setIsModalVisible(false);
  }, [onChange]);

  return (
    <>
      <Button
        icon={<PictureOutlined />}
        onClick={() => setIsModalVisible(true)}
        style={{ width: '100%', textAlign: 'left' }}
      >
        {value ? 'Đã chọn hình ảnh' : 'Chọn hình ảnh'}
      </Button>

      <Modal
        title="Chọn hình ảnh từ thư viện"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={1200}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Search
            placeholder="Tìm kiếm hình ảnh..."
            onSearch={setSearchText}
            style={{ width: '100%' }}
          />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '16px',
            minHeight: '400px'
          }}>
            {tableProps.dataSource?.map((item: any) => (
              <Card
                key={item.id}
                hoverable
                size="small"
                onClick={() => handleSelect(item)}
                actions={[<EyeOutlined key="view" />]}
              >
                <Image
                  src={getOptimizedImageUrl(item, 'thumbnail')}
                  alt={item.alt_text || item.file_name}
                  style={{ width: '100%', height: '120px', objectFit: 'cover' }}
                />
                <div style={{ marginTop: '8px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
                    {item.file_name.length > 20
                      ? item.file_name.substring(0, 20) + '...'
                      : item.file_name}
                  </div>
                  <div style={{ fontSize: '10px', color: '#666' }}>
                    {formatFileSize(item.file_size)}
                  </div>
                  <Tag color={item.is_active ? 'green' : 'red'}>
                    {item.is_active ? 'Active' : 'Inactive'}
                  </Tag>
                </div>
              </Card>
            ))}
          </div>
        </Space>
      </Modal>
    </>
  );
};

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
```

## 🗄️ Database Optimizations

### **Indexes for Performance**
```sql
-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_media_file_name ON media USING gin(file_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_media_mime_type ON media(mime_type);
CREATE INDEX IF NOT EXISTS idx_media_created_at ON media(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_is_active ON media(is_active);

-- Foreign key indexes
CREATE INDEX IF NOT EXISTS idx_media_relations_media_id ON media_relations(media_id);
CREATE INDEX IF NOT EXISTS idx_media_relations_reference ON media_relations(reference_type, reference_id);
```

### **Statistics Table**
```sql
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

CREATE UNIQUE INDEX IF NOT EXISTS idx_media_stats_mime_type ON media_stats(mime_type);
```

## 🔒 Security & Permissions

### **RLS Policies**
```sql
-- Enable RLS
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_relations ENABLE ROW LEVEL SECURITY;

-- Public read access for active media
CREATE POLICY "Public read access for active media" ON media
  FOR SELECT USING (is_active = true);

-- Authenticated users can manage their own media
CREATE POLICY "Users can manage their own media" ON media
  FOR ALL USING (auth.uid() = created_by);

-- Admin full access
CREATE POLICY "Admin full access" ON media
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );
```

### **Storage Policies**
```sql
-- Storage bucket policies
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

CREATE POLICY "Authenticated upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'media'
    AND auth.role() = 'authenticated'
  );
```

## 📊 Performance Monitoring

### **Caching Strategy**
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
}
```

## 🚀 Deployment & Production

### **Environment Variables**
```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Media Configuration
VITE_MEDIA_BUCKET=media
VITE_MAX_FILE_SIZE=10485760
VITE_ALLOWED_TYPES=image/jpeg,image/png,image/webp,image/gif
```

### **Build Optimizations**
```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['antd', '@ant-design/icons'],
          'media-vendor': ['react-dropzone', 'react-image-crop']
        }
      }
    }
  }
};
```

## 🧪 Testing & Debugging

### **Common Issues & Solutions**

#### **Upload Failures**
- Check file size limits
- Verify MIME types
- Check storage permissions
- Validate Supabase configuration

#### **Image Not Displaying**
- Check public URL generation
- Verify bucket policies
- Check image optimization process
- Validate file paths

#### **Performance Issues**
- Implement lazy loading
- Add image compression
- Use appropriate image sizes
- Implement caching

### **Debug Logging**
```typescript
// Enhanced logging for media operations
console.log('📸 [MediaUpload] Starting upload:', file.name);
console.log('🗜️ [ImageOptimizer] Compressing image...');
console.log('☁️ [UploadService] Uploading to storage...');
console.log('💾 [Database] Saving metadata...');
console.log('✅ [MediaUpload] Upload complete:', result.id);
```

## 📚 API Reference

### **Upload Endpoints**
```typescript
// Single file upload
POST /api/media/upload
Content-Type: multipart/form-data

// Multiple files upload
POST /api/media/upload-batch
Content-Type: multipart/form-data

// Get media by ID
GET /api/media/:id

// Update media metadata
PUT /api/media/:id

// Delete media
DELETE /api/media/:id
```

## 🎯 Best Practices

### **File Organization**
- Use consistent naming conventions
- Organize files by type and date
- Implement cleanup policies for old files
- Use CDN for better performance

### **Security**
- Validate file types and sizes
- Implement rate limiting
- Use secure upload tokens
- Regular security audits

### **Performance**
- Compress images before upload
- Use appropriate image formats
- Implement lazy loading
- Cache frequently accessed images

### **User Experience**
- Show upload progress
- Provide preview functionality
- Allow drag & drop uploads
- Support bulk operations

---

*This document consolidates all media-related guides from:*
- docs/hinh-anh.md (Media optimization guide)
- docs/admin-image.md (NPM libraries guide)
- MEDIA_SELECTOR_IMPROVEMENTS.md
- docs/MEDIA_GALLERY_SELECTOR_GUIDE.md
- MEDIA_URL_FIX_GUIDE.md