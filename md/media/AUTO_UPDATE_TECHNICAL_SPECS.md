# 🔄 Auto-Update Technical Specifications After Crop

## 📋 Tổng quan

Tính năng tự động cập nhật các thông số kỹ thuật sau khi crop hình ảnh đã được tích hợp vào trang `/media/edit`. Khi người dùng crop và lưu hình ảnh, hệ thống sẽ tự động tính toán và cập nhật tất cả các thông số liên quan.

## 🔧 Các thông số được cập nhật tự động

### **1. Thông số File**
- ✅ **File Size**: Kích thước file mới (bytes)
- ✅ **File Size KB**: Kích thước file tính bằng KB
- ✅ **MIME Type**: Loại file (image/jpeg)
- ✅ **Image Format**: Định dạng hình ảnh (JPEG)

### **2. Thông số Hình ảnh**
- ✅ **Image Dimensions**: Kích thước hình ảnh (width x height)
- ✅ **Dimensions Object**: Object chứa width và height
- ✅ **File Path**: Đường dẫn file mới
- ✅ **File URL**: URL công khai mới

### **3. Thông số SEO & Performance**
- ✅ **SEO Score**: Giảm nhẹ 5 điểm (tối thiểu 70)
- ✅ **Accessibility Score**: Giảm nhẹ 3 điểm (tối thiểu 75)
- ✅ **Performance Score**: Giảm nhẹ 2 điểm (tối thiểu 80)
- ✅ **Version**: Tăng số phiên bản lên 1

## 📊 Code Implementation

### **1. Tính toán thông số mới**
```typescript
// Calculate new technical specifications
const fileSizeKB = Math.round(file.size / 1024);
const imageFormat = file.type.split("/")[1]?.toUpperCase() || "JPEG";

// Get image dimensions from the current crop
const currentCrop = crop;
let newDimensions = { width: 0, height: 0 };

if (imageRef.current && currentCrop.width && currentCrop.height) {
  // Calculate actual pixel dimensions from crop
  const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
  const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
  
  newDimensions = {
    width: Math.round(currentCrop.width * scaleX),
    height: Math.round(currentCrop.height * scaleY)
  };
}
```

### **2. Cập nhật database với tất cả thông số**
```typescript
// Update media record with all technical specifications
const updateData: any = {
  file_path: filePath,
  file_url: urlData.publicUrl,
  file_size: file.size,
  file_size_kb: fileSizeKB,
  mime_type: file.type,
  image_format: imageFormat,
  image_dimensions: `${newDimensions.width}x${newDimensions.height}`,
  dimensions: newDimensions,
};

// Update SEO scores if they exist
if (mediaData?.seo_score) {
  updateData.seo_score = Math.max(mediaData.seo_score - 5, 70);
}
if (mediaData?.accessibility_score) {
  updateData.accessibility_score = Math.max(mediaData.accessibility_score - 3, 75);
}
if (mediaData?.performance_score) {
  updateData.performance_score = Math.max(mediaData.performance_score - 2, 80);
}

// Increment version number
updateData.version = (mediaData?.version || 1) + 1;
```

### **3. Debug logging**
```typescript
console.log("🔍 New technical specs:", {
  fileSize: file.size,
  fileSizeKB,
  imageFormat,
  dimensions: newDimensions,
  mimeType: file.type
});

console.log("🔍 Updating database with:", updateData);
```

## 🎯 Cách hoạt động

### **1. Quy trình cập nhật**
```
1. User crop hình ảnh → Select crop area
2. Click "Lưu Crop" → Trigger handleCropSave
3. Calculate new specs → File size, dimensions, format
4. Upload new file → Supabase Storage
5. Update database → All technical specifications
6. Update SEO scores → Slight decrease for crop
7. Increment version → Version + 1
8. Success message → User feedback
9. Reload page → Show updated data
```

### **2. Tính toán kích thước**
- **Scale Factors**: Tính tỷ lệ giữa kích thước thực và hiển thị
- **Pixel Dimensions**: Chuyển đổi từ crop area sang pixel thực
- **File Size**: Lấy kích thước file từ blob
- **Format**: Tự động xác định định dạng từ MIME type

### **3. Cập nhật SEO Scores**
- **SEO Score**: Giảm 5 điểm (do crop có thể ảnh hưởng SEO)
- **Accessibility**: Giảm 3 điểm (có thể mất thông tin)
- **Performance**: Giảm 2 điểm (file mới có thể khác)
- **Minimum Values**: Đảm bảo không giảm quá thấp

## 📈 Benefits

### **1. Data Accuracy**
- ✅ **Real-time Updates**: Thông số luôn chính xác
- ✅ **Automatic Calculation**: Không cần nhập thủ công
- ✅ **Consistent Format**: Định dạng nhất quán
- ✅ **Version Tracking**: Theo dõi phiên bản

### **2. User Experience**
- ✅ **No Manual Input**: Không cần nhập thông số
- ✅ **Immediate Feedback**: Cập nhật ngay lập tức
- ✅ **Error Prevention**: Tránh lỗi nhập liệu
- ✅ **Time Saving**: Tiết kiệm thời gian

### **3. System Integrity**
- ✅ **Data Consistency**: Dữ liệu nhất quán
- ✅ **SEO Optimization**: Tự động điều chỉnh SEO
- ✅ **Performance Tracking**: Theo dõi hiệu suất
- ✅ **Version Control**: Quản lý phiên bản

## ⚠️ Lưu ý quan trọng

### **1. SEO Score Adjustment**
- **Giảm nhẹ**: Crop có thể ảnh hưởng đến SEO
- **Minimum Threshold**: Không giảm dưới ngưỡng tối thiểu
- **Reasoning**: Crop có thể làm mất thông tin quan trọng

### **2. Version Management**
- **Auto Increment**: Tự động tăng số phiên bản
- **Tracking**: Theo dõi lịch sử thay đổi
- **Rollback**: Có thể rollback về phiên bản trước

### **3. Data Validation**
- **File Size Check**: Đảm bảo file size hợp lệ
- **Dimensions Validation**: Kiểm tra kích thước
- **Format Verification**: Xác minh định dạng file

## 🔄 Workflow chi tiết

### **1. Pre-Crop State**
```
Original Image: 1920x1080, 2.5MB, JPEG
SEO Score: 85, Accessibility: 88, Performance: 92
Version: 1
```

### **2. Crop Process**
```
User selects: 800x600 crop area
System calculates: 800x600 pixels
New file size: ~800KB
```

### **3. Post-Crop Update**
```
Updated Image: 800x600, 800KB, JPEG
SEO Score: 80 (-5), Accessibility: 85 (-3), Performance: 90 (-2)
Version: 2 (+1)
```

### **4. Database Update**
```sql
UPDATE media SET
  file_size = 819200,
  file_size_kb = 800,
  image_dimensions = '800x600',
  dimensions = '{"width": 800, "height": 600}',
  seo_score = 80,
  accessibility_score = 85,
  performance_score = 90,
  version = 2
WHERE id = 'media_id';
```

## 🚀 Best Practices

### **1. Performance Optimization**
- ✅ **Efficient Calculation**: Tính toán hiệu quả
- ✅ **Minimal Database Calls**: Giảm thiểu truy vấn DB
- ✅ **Batch Updates**: Cập nhật hàng loạt
- ✅ **Error Handling**: Xử lý lỗi tốt

### **2. Data Integrity**
- ✅ **Validation**: Kiểm tra dữ liệu
- ✅ **Consistency**: Đảm bảo nhất quán
- ✅ **Backup**: Sao lưu dữ liệu
- ✅ **Rollback**: Khôi phục khi cần

### **3. User Experience**
- ✅ **Clear Feedback**: Thông báo rõ ràng
- ✅ **Progress Indication**: Hiển thị tiến trình
- ✅ **Error Messages**: Thông báo lỗi cụ thể
- ✅ **Success Confirmation**: Xác nhận thành công

**Kết quả**: Hệ thống tự động cập nhật tất cả thông số kỹ thuật sau khi crop, đảm bảo dữ liệu chính xác và nhất quán! 🎯✅
