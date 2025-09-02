# 🎯 Selected File Information Management

## 📋 Tổng quan

Khi upload nhiều files, hệ thống sẽ **chỉ áp dụng thông tin từ form cho file đang được chọn**, các file khác sẽ được tự động tạo thông tin dựa trên tên file. Điều này cho phép user tùy chỉnh thông tin cho từng file riêng biệt.

## 🔧 Cách hoạt động

### **File đang được chọn (Selected File)**
- ✅ **Sử dụng thông tin từ form**: Alt text, title, caption, meta description, keywords, SEO scores
- ✅ **User có thể chỉnh sửa**: Tất cả thông tin trong form sẽ được áp dụng cho file này
- ✅ **Hiển thị rõ ràng**: Tag "File đang chọn" và thông báo trong form

### **Các file khác**
- ✅ **Tự động tạo thông tin**: Dựa trên tên file đã upload
- ✅ **SEO scores tự động**: Random scores với usage_count = 1, version = 1
- ✅ **Thông tin cơ bản**: Alt text, title, caption, meta description, keywords

## 📊 Logic xử lý

### **1. Xác định file đang chọn**
```typescript
// File đang được chọn sẽ sử dụng thông tin từ form
if (i === selectedFileIndex) {
  cleanValues = { ...values }; // Sử dụng tất cả thông tin từ form
}
```

### **2. Tự động tạo thông tin cho file khác**
```typescript
// File khác sẽ tự động tạo thông tin
else {
  cleanValues = {} as MediaFormValues;
  
  // Tạo alt text và title từ tên file
  const fileName = fileData.uploadedFileName || fileData.file.name;
  const smartAltText = fileName
    .replace(/\.[^/.]+$/, "") // Bỏ extension
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .replace(/\s+/g, " ")
    .trim();

  cleanValues.alt_text = smartAltText;
  cleanValues.title = smartAltText;
  
  // Tạo caption
  const baseName = fileName.replace(/\.[^/.]+$/, "");
  cleanValues.caption = `${baseName} - Hình ảnh chất lượng cao`;
  
  // Tạo meta description
  cleanValues.meta_description = `Hình ảnh ${baseName.toLowerCase()}, chất lượng cao, phù hợp cho website và marketing.`;
  
  // Tạo meta keywords
  cleanValues.meta_keywords = generateKeywords(fileName.replace(/\.[^/.]+$/, ""));
  
  // Tạo SEO scores tự động
  const seoScores = [85, 92, 78, 95, 88, 90, 82, 94, 87, 91];
  const accessibilityScores = [90, 85, 88, 92, 86, 89, 84, 91, 87, 93];
  const performanceScores = [88, 92, 85, 94, 89, 91, 83, 95, 86, 90];
  const randomIndex = Math.floor(Math.random() * 10);
  
  cleanValues.seo_score = seoScores[randomIndex];
  cleanValues.accessibility_score = accessibilityScores[randomIndex];
  cleanValues.performance_score = performanceScores[randomIndex];
  cleanValues.usage_count = 1;
  cleanValues.version = 1;
}
```

## 🎯 User Experience

### **1. Chọn file để chỉnh sửa**
- ✅ Click vào file trong preview để chọn
- ✅ File được chọn sẽ có border màu xanh
- ✅ Tag hiển thị "File đang chọn: [tên file]"

### **2. Chỉnh sửa thông tin**
- ✅ Chỉnh sửa thông tin trong form
- ✅ Thông tin chỉ áp dụng cho file đang chọn
- ✅ Các file khác không bị ảnh hưởng

### **3. Submit và tạo records**
- ✅ File đang chọn: Sử dụng thông tin từ form
- ✅ Các file khác: Tự động tạo thông tin
- ✅ Mỗi file có thông tin riêng biệt

## 📝 Log Messages

### **Selected File**
```
🔧 Creating media record for: product_1_abc123.jpg (selected)
```

### **Auto-generated Files**
```
🔧 Creating media record for: product_2_def456.png (auto-generated)
🔧 Creating media record for: product_3_ghi789.webp (auto-generated)
```

## 🔍 Kiểm tra

### **Trước khi submit**
- ✅ File đang chọn được highlight
- ✅ Form hiển thị thông tin của file đang chọn
- ✅ User có thể chỉnh sửa thông tin

### **Sau khi submit**
- ✅ File đang chọn có thông tin từ form
- ✅ Các file khác có thông tin tự động tạo
- ✅ Mỗi file có thông tin riêng biệt

## ⚠️ Lưu ý quan trọng

### **1. Chọn file**
- ✅ Chỉ file được chọn mới sử dụng thông tin từ form
- ✅ Các file khác sẽ tự động tạo thông tin
- ✅ Có thể thay đổi file đang chọn bất cứ lúc nào

### **2. Thông tin form**
- ✅ Alt text, title, caption, meta description, keywords
- ✅ SEO scores (seo_score, accessibility_score, performance_score)
- ✅ Usage count và version
- ✅ License, lazy_loading, priority_loading

### **3. Auto-generation**
- ✅ Dựa trên tên file đã upload
- ✅ SEO scores random nhưng hợp lý
- ✅ Usage count = 1, version = 1 cho file mới

## 🚀 Cách test

### **Test case 1: Chỉnh sửa file đang chọn**
1. Upload 3 files
2. Chọn file thứ 2
3. Chỉnh sửa alt text, title, caption
4. Nhấn Save
5. Kiểm tra:
   - File 2 có thông tin đã chỉnh sửa
   - File 1 và 3 có thông tin tự động tạo

### **Test case 2: Thay đổi file đang chọn**
1. Upload 3 files
2. Chọn file 1, chỉnh sửa thông tin
3. Chọn file 3, chỉnh sửa thông tin khác
4. Nhấn Save
5. Kiểm tra:
   - File 3 có thông tin mới nhất
   - File 1 và 2 có thông tin tự động tạo

### **Test case 3: Không chỉnh sửa**
1. Upload 3 files
2. Không chỉnh sửa gì
3. Nhấn Save
4. Kiểm tra:
   - File đang chọn có thông tin tự động tạo
   - Các file khác cũng có thông tin tự động tạo

## 📊 Kết quả mong đợi

### **Input: 3 files với file 2 được chọn**
- File 1: `product_1.jpg` (không chọn)
- File 2: `product_2.png` (đang chọn, user chỉnh sửa)
- File 3: `product_3.webp` (không chọn)

### **Output: 3 media records với thông tin khác nhau**
```json
[
  {
    "file_name": "product_1_abc123",
    "alt_text": "Product 1 Abc123", // Auto-generated
    "title": "Product 1 Abc123", // Auto-generated
    "caption": "product_1_abc123 - Hình ảnh chất lượng cao", // Auto-generated
    "meta_description": "Hình ảnh product_1_abc123, chất lượng cao, phù hợp cho website và marketing.", // Auto-generated
    "seo_score": 88, // Random
    "usage_count": 1,
    "version": 1
  },
  {
    "file_name": "product_2_def456",
    "alt_text": "Sản phẩm chất lượng cao", // From form
    "title": "Sản phẩm chất lượng cao", // From form
    "caption": "Caption tùy chỉnh", // From form
    "meta_description": "Mô tả tùy chỉnh", // From form
    "seo_score": 95, // From form
    "usage_count": 1, // From form
    "version": 1 // From form
  },
  {
    "file_name": "product_3_ghi789",
    "alt_text": "Product 3 Ghi789", // Auto-generated
    "title": "Product 3 Ghi789", // Auto-generated
    "caption": "product_3_ghi789 - Hình ảnh chất lượng cao", // Auto-generated
    "meta_description": "Hình ảnh product_3_ghi789, chất lượng cao, phù hợp cho website và marketing.", // Auto-generated
    "seo_score": 92, // Random
    "usage_count": 1,
    "version": 1
  }
]
```
