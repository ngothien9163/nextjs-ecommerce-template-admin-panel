# 🔧 SEO Advanced Fields Auto-Fill

## 📋 Tổng quan

Khi upload file mới vào media, hệ thống sẽ tự động điền các thông số SEO nâng cao với giá trị hợp lý:

- **SEO Score**: 78-95 (random)
- **Accessibility Score**: 84-93 (random)  
- **Performance Score**: 83-95 (random)
- **Usage Count**: **1** (cố định cho file mới)
- **Version**: **1** (cố định cho file mới)

## 🔧 Cách hoạt động

### 1. **Khi chọn file**
```typescript
// Tự động điền thông số SEO nâng cao khi chọn file đầu tiên
setTimeout(() => {
  autoFillSEOScores();
}, 200);
```

### 2. **Khi upload file**
```typescript
// Tự động điền thông số SEO nâng cao sau khi upload
setTimeout(() => {
  autoFillSEOScores();
  message.info('Đã tự động điền thông số SEO nâng cao!');
}, 200);
```

### 3. **Khi click nút "Gợi ý"**
```typescript
// Nút gợi ý trong card SEO nâng cao
<Button onClick={() => autoFillSEOScores(true)}>
  🔄 Gợi ý
</Button>
```

## 📊 Giá trị được set

### **File mới upload:**
```typescript
const seoValues = {
  seo_score: seoScores[randomIndex],        // 78-95
  accessibility_score: accessibilityScores[randomIndex], // 84-93
  performance_score: performanceScores[randomIndex],     // 83-95
  usage_count: 1,                          // Cố định = 1
  version: 1,                              // Cố định = 1
};
```

### **Lý do set cố định:**
- **Usage Count = 1**: File mới upload chưa được sử dụng ở đâu
- **Version = 1**: Đây là phiên bản đầu tiên của file

## 🎯 Các trường hợp gọi autoFillSEOScores

1. **Chọn file đầu tiên**: Tự động điền khi user chọn file
2. **Upload file**: Tự động điền sau khi upload thành công
3. **Click nút "Gợi ý"**: Điền lại với giá trị mới
4. **Chọn file khác**: Điền lại thông tin cho file mới

## 📝 Log Messages

### **Success**
```
🔧 Auto-filling SEO scores: {
  seo_score: 88,
  accessibility_score: 90,
  performance_score: 92,
  usage_count: 1,
  version: 1
}
```

### **User Feedback**
```
✅ Đã tự động điền thông số SEO nâng cao!
```

## 🔍 Kiểm tra

### **Trước khi upload**
- ❌ Các field SEO nâng cao trống hoặc có giá trị cũ

### **Sau khi upload**
- ✅ `usage_count` = 1
- ✅ `version` = 1
- ✅ `seo_score` = 78-95
- ✅ `accessibility_score` = 84-93
- ✅ `performance_score` = 83-95

## ⚠️ Lưu ý

1. **Giá trị cố định**: `usage_count` và `version` luôn = 1 cho file mới
2. **Giá trị random**: Các score khác được random để tạo sự đa dạng
3. **Có thể thay đổi**: User có thể chỉnh sửa các giá trị này sau khi auto-fill
4. **Không ảnh hưởng**: Việc auto-fill không ảnh hưởng đến dữ liệu khác

## 🚀 Cách test

1. Upload file mới vào media
2. Kiểm tra card "Thông tin SEO nâng cao"
3. Xác nhận:
   - `Usage Count` = 1
   - `Version` = 1
   - Các score khác có giá trị hợp lý
4. Click nút "🔄 Gợi ý" để thay đổi giá trị
