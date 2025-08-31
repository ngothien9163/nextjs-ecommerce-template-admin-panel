# 🚀 **HƯỚNG DẪN TÍCH HỢP MEDIA CHO FRONTEND**

## **📋 Tổng quan:**

Admin Panel và Frontend là 2 project riêng biệt, sử dụng chung database Supabase để quản lý media.

## **🔗 API Endpoints:**

### **1. Lấy thông tin media theo ID:**
```typescript
// GET /api/media/[id]
const getMediaById = async (id: string) => {
  const response = await fetch(`/api/media/${id}`);
  return response.json();
};
```

### **2. Lấy danh sách media:**
```typescript
// GET /api/media?entity_type=product&entity_id=123&relation_type=primary
const getMediaList = async (params?: {
  entity_type?: string;
  entity_id?: string;
  relation_type?: string;
}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`/api/media?${queryString}`);
  return response.json();
};
```

## **📱 Sử dụng trong Frontend:**

### **1. Component hiển thị hình ảnh sản phẩm:**
```typescript
// components/ProductImage.tsx
import { useState, useEffect } from 'react';

interface ProductImageProps {
  productId: string;
  relationType?: 'primary' | 'gallery' | 'thumbnail';
}

export const ProductImage: React.FC<ProductImageProps> = ({ 
  productId, 
  relationType = 'primary' 
}) => {
  const [media, setMedia] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const data = await getMediaList({
          entity_type: 'product',
          entity_id: productId,
          relation_type: relationType
        });
        
        if (data && data.length > 0) {
          setMedia(data[0]);
        }
      } catch (error) {
        console.error('Error fetching media:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [productId, relationType]);

  if (loading) return <div>Loading...</div>;
  if (!media) return <div>No image</div>;

  return (
    <img 
      src={media.file_url} 
      alt={media.alt_text || media.file_name}
      className="product-image"
    />
  );
};
```

### **2. Gallery component:**
```typescript
// components/ProductGallery.tsx
import { useState, useEffect } from 'react';

export const ProductGallery: React.FC<{ productId: string }> = ({ productId }) => {
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await getMediaList({
          entity_type: 'product',
          entity_id: productId,
          relation_type: 'gallery'
        });
        setMediaList(data);
      } catch (error) {
        console.error('Error fetching gallery:', error);
      }
    };

    fetchGallery();
  }, [productId]);

  return (
    <div className="product-gallery">
      <div className="main-image">
        {mediaList[currentIndex] && (
          <img 
            src={mediaList[currentIndex].file_url}
            alt={mediaList[currentIndex].alt_text}
          />
        )}
      </div>
      
      <div className="thumbnail-list">
        {mediaList.map((media, index) => (
          <img
            key={media.id}
            src={media.file_url}
            alt={media.alt_text}
            className={index === currentIndex ? 'active' : ''}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};
```

### **3. Hero Banner component:**
```typescript
// components/HeroBanner.tsx
export const HeroBanner: React.FC = () => {
  const [bannerMedia, setBannerMedia] = useState<any>(null);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const data = await getMediaList({
          entity_type: 'banner',
          relation_type: 'hero'
        });
        
        if (data && data.length > 0) {
          setBannerMedia(data[0]);
        }
      } catch (error) {
        console.error('Error fetching banner:', error);
      }
    };

    fetchBanner();
  }, []);

  if (!bannerMedia) return null;

  return (
    <div className="hero-banner">
      <img 
        src={bannerMedia.file_url}
        alt={bannerMedia.alt_text}
        className="banner-image"
      />
      <div className="banner-content">
        <h1>{bannerMedia.title}</h1>
        <p>{bannerMedia.caption}</p>
      </div>
    </div>
  );
};
```

## **🔧 Cấu hình Environment:**

### **Frontend (.env.local):**
```env
NEXT_PUBLIC_ADMIN_API_URL=http://localhost:5178
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### **Admin Panel (.env.local):**
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## **🚀 Workflow:**

### **1. Upload trong Admin Panel:**
- Admin upload hình ảnh vào Supabase Storage
- Tạo record trong bảng `media`
- Tạo relation trong bảng `media_relations`

### **2. Hiển thị trong Frontend:**
- Frontend gọi API để lấy thông tin media
- Hiển thị hình ảnh từ Supabase Storage URL
- Cache và optimize performance

## **⚡ Performance Optimization:**

### **1. Image Optimization:**
```typescript
// Sử dụng Supabase Image Transformations
const getOptimizedImageUrl = (url: string, width: number, height: number) => {
  return `${url}?width=${width}&height=${height}&quality=80`;
};
```

### **2. Lazy Loading:**
```typescript
// components/LazyImage.tsx
import { useState, useEffect } from 'react';

export const LazyImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );

    const img = document.createElement('img');
    observer.observe(img);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="lazy-image">
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          className={isLoaded ? 'loaded' : 'loading'}
        />
      )}
    </div>
  );
};
```

## **🔒 Security:**

### **1. CORS Configuration:**
```typescript
// Admin Panel API CORS
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-frontend-domain.com'],
  credentials: true
}));
```

### **2. Rate Limiting:**
```typescript
// Implement rate limiting cho API
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/media', limiter);
```

## **📊 Monitoring:**

### **1. Error Tracking:**
```typescript
// Track media loading errors
const trackMediaError = (mediaId: string, error: Error) => {
  console.error(`Media loading error for ID ${mediaId}:`, error);
  // Send to analytics service
};
```

### **2. Performance Monitoring:**
```typescript
// Monitor image loading performance
const measureImageLoadTime = (url: string) => {
  const start = performance.now();
  
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const loadTime = performance.now() - start;
      console.log(`Image loaded in ${loadTime}ms:`, url);
      resolve(loadTime);
    };
    img.src = url;
  });
};
```
