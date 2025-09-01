# 📊 **CLOUDINARY USAGE API - HƯỚNG DẪN SỬ DỤNG**

## **🔍 Các API Cloudinary Cung Cấp**

### **1. 📈 Usage API - Kiểm Tra Quota**

```javascript
// Lấy thông tin usage hiện tại
const usage = await cloudinary.api.usage();

// Response:
{
  "plan": "Free",
  "objects": {
    "used": 150,
    "limit": 1000,
    "reset_at": "2024-02-01T00:00:00Z"
  },
  "bandwidth": {
    "used": 52428800,  // 50MB
    "limit": 26843545600,  // 25GB
    "reset_at": "2024-02-01T00:00:00Z"
  },
  "storage": {
    "used": 104857600,  // 100MB
    "limit": 26843545600  // 25GB
  },
  "requests": {
    "used": 1250,
    "limit": 25000,
    "reset_at": "2024-02-01T00:00:00Z"
  },
  "transformations": {
    "used": 500,
    "limit": 25000,
    "reset_at": "2024-02-01T00:00:00Z"
  }
}
```

### **2. 📊 Analytics API - Phân Tích Chi Tiết**

```javascript
// Lấy analytics theo thời gian
const analytics = await cloudinary.api.usage({
  start_date: "2024-01-01",
  end_date: "2024-01-31"
});

// Response:
{
  "total_requests": 5000,
  "total_bandwidth": 104857600,
  "total_storage": 52428800,
  "total_resources": 150,
  "total_derived_resources": 300,
  "total_transformations": 2000,
  "date_range": {
    "start": "2024-01-01",
    "end": "2024-01-31"
  }
}
```

### **3. 🖼️ Resources API - Quản Lý Hình Ảnh**

```javascript
// Lấy danh sách resources
const resources = await cloudinary.api.resources({
  max_results: 50,
  folder: "products",
  tags: ["featured", "sale"],
  resource_type: "image"
});

// Response:
{
  "resources": [
    {
      "public_id": "products/laptop-1",
      "format": "jpg",
      "version": 1234567890,
      "resource_type": "image",
      "type": "upload",
      "created_at": "2024-01-15T10:30:00Z",
      "bytes": 1048576,
      "width": 1920,
      "height": 1080,
      "url": "http://res.cloudinary.com/demo/image/upload/v1234567890/products/laptop-1.jpg",
      "secure_url": "https://res.cloudinary.com/demo/image/upload/v1234567890/products/laptop-1.jpg",
      "folder": "products",
      "tags": ["laptop", "gaming", "featured"]
    }
  ],
  "next_cursor": "abc123",
  "total_count": 150
}
```

---

## **🛠️ Cách Sử Dụng Trong Project**

### **1. Cài Đặt Cloudinary SDK**

```bash
npm install cloudinary
```

### **2. Cấu Hình Environment Variables**

```env
# .env.local
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_API_KEY=your_api_key
VITE_CLOUDINARY_API_SECRET=your_api_secret
```

### **3. Sử Dụng Usage Tracking**

```javascript
import { getCachedUsage, formatBytes, getUsageStatus } from './lib/cloudinary-usage';

// Kiểm tra usage
const usage = await getCachedUsage();

// Format dữ liệu
const storageUsed = formatBytes(usage.storage.used);
const storageLimit = formatBytes(usage.storage.limit);
const storagePercentage = Math.round((usage.storage.used / usage.storage.limit) * 100);

// Kiểm tra trạng thái
const status = getUsageStatus(storagePercentage);
console.log(status); // { status: 'safe', color: '#52c41a', message: 'An toàn' }
```

### **4. Tích Hợp Vào Admin Panel**

```javascript
// Trong component admin
const AdminDashboard = () => {
  const [usage, setUsage] = useState(null);
  
  useEffect(() => {
    const loadUsage = async () => {
      const data = await getCachedUsage();
      setUsage(data);
    };
    loadUsage();
  }, []);
  
  return (
    <div>
      <h2>Cloudinary Usage</h2>
      <div>
        Storage: {formatBytes(usage?.storage.used)} / {formatBytes(usage?.storage.limit)}
        <Progress percent={storagePercentage} />
      </div>
    </div>
  );
};
```

---

## **📱 Dashboard Features**

### **✅ Tính Năng Đã Implement:**

1. **Real-time Usage Tracking**
   - Storage, Bandwidth, Requests, Transformations
   - Progress bars với color coding
   - Warning alerts khi gần hết quota

2. **Plan Information**
   - Hiển thị plan hiện tại
   - So sánh với limits
   - Cost estimation

3. **Resources Management**
   - Danh sách hình ảnh gần đây
   - Filter theo folder
   - Thông tin chi tiết từng ảnh

4. **Analytics & Monitoring**
   - Usage trends
   - Cost projections
   - Overage warnings

### **🎯 Cách Truy Cập:**

```javascript
// Thêm route vào App.tsx
import { CloudinaryUsagePage } from './pages/cloudinary-usage';

// Trong routing
<Route path="/cloudinary-usage" element={<CloudinaryUsagePage />} />
```

---

## **🚨 Monitoring & Alerts**

### **1. Usage Thresholds**

```javascript
const USAGE_THRESHOLDS = {
  WARNING: 80,  // 80% usage
  DANGER: 90,   // 90% usage
  CRITICAL: 95  // 95% usage
};

// Kiểm tra threshold
const checkUsageThreshold = (usage) => {
  const percentage = (usage.storage.used / usage.storage.limit) * 100;
  
  if (percentage >= USAGE_THRESHOLDS.CRITICAL) {
    return { level: 'critical', message: 'Storage quota critical!' };
  } else if (percentage >= USAGE_THRESHOLDS.DANGER) {
    return { level: 'danger', message: 'Storage quota danger!' };
  } else if (percentage >= USAGE_THRESHOLDS.WARNING) {
    return { level: 'warning', message: 'Storage quota warning!' };
  }
  
  return { level: 'safe', message: 'Storage quota safe' };
};
```

### **2. Automated Alerts**

```javascript
// Gửi email alert khi gần hết quota
const sendUsageAlert = async (usage) => {
  const threshold = checkUsageThreshold(usage);
  
  if (threshold.level !== 'safe') {
    await fetch('/api/send-alert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'cloudinary_usage',
        level: threshold.level,
        message: threshold.message,
        usage: usage
      })
    });
  }
};
```

---

## **💰 Cost Management**

### **1. Plan Comparison**

| Plan | Storage | Bandwidth | Requests | Cost/Month |
|------|---------|-----------|----------|------------|
| Free | 25GB | 25GB | 25K | $0 |
| Plus | 100GB | 100GB | 100K | $89 |
| Advanced | 500GB | 500GB | 500K | $179 |
| Enterprise | Unlimited | Unlimited | Unlimited | $500+ |

### **2. Overage Costs**

```javascript
const OVERAGE_COSTS = {
  bandwidth: 0.10,  // $0.10 per GB
  requests: 0.001,  // $0.001 per 1K requests
  transformations: 0.001,  // $0.001 per 1K transformations
};

// Tính overage cost
const calculateOverageCost = (usage) => {
  const bandwidthOverage = Math.max(0, usage.bandwidth.used - usage.bandwidth.limit);
  const requestsOverage = Math.max(0, usage.requests.used - usage.requests.limit);
  
  const bandwidthCost = bandwidthOverage * OVERAGE_COSTS.bandwidth;
  const requestsCost = (requestsOverage / 1000) * OVERAGE_COSTS.requests;
  
  return bandwidthCost + requestsCost;
};
```

---

## **🔧 Advanced Features**

### **1. Caching Strategy**

```javascript
// Cache usage data để tránh rate limiting
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCachedUsage = async () => {
  const cached = localStorage.getItem('cloudinary_usage');
  const timestamp = localStorage.getItem('cloudinary_usage_timestamp');
  
  if (cached && timestamp && (Date.now() - parseInt(timestamp)) < CACHE_DURATION) {
    return JSON.parse(cached);
  }
  
  const usage = await cloudinary.api.usage();
  localStorage.setItem('cloudinary_usage', JSON.stringify(usage));
  localStorage.setItem('cloudinary_usage_timestamp', Date.now().toString());
  
  return usage;
};
```

### **2. Batch Operations**

```javascript
// Xóa nhiều ảnh cùng lúc
const deleteMultipleImages = async (publicIds) => {
  const results = await Promise.all(
    publicIds.map(id => cloudinary.uploader.destroy(id))
  );
  
  return results;
};

// Upload nhiều ảnh cùng lúc
const uploadMultipleImages = async (files, folder = 'media') => {
  const uploadPromises = files.map(file => 
    cloudinary.uploader.upload(file, { folder })
  );
  
  const results = await Promise.all(uploadPromises);
  return results;
};
```

---

## **📊 Dashboard Screenshots**

### **Usage Overview**
- Storage, Bandwidth, Requests, Transformations
- Progress bars với color coding
- Real-time updates

### **Plan Information**
- Current plan details
- Cost estimation
- Overage warnings

### **Resources Table**
- Recent uploads
- Filter by folder
- Image previews

### **Analytics**
- Usage trends
- Cost projections
- Performance metrics

---

## **🚀 Kết Luận**

**Cloudinary cung cấp đầy đủ API để:**

1. ✅ **Kiểm tra usage** - Real-time quota monitoring
2. ✅ **Analytics** - Detailed usage analytics
3. ✅ **Resource management** - List, filter, manage images
4. ✅ **Cost tracking** - Overage costs và projections
5. ✅ **Alerts** - Automated warnings khi gần hết quota

**Dashboard đã implement sẵn tất cả tính năng này** và có thể tích hợp ngay vào admin panel của bạn!
