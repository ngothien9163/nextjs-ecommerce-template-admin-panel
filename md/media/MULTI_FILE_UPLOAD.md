# 📁 Multi-File Upload & Batch Processing

## 📋 Tổng quan

Hệ thống media hiện tại hỗ trợ **upload nhiều file cùng lúc** và **tạo nhiều media records** trong một lần submit. Khi user chọn nhiều files và nhấn Save, hệ thống sẽ:

1. **Upload tất cả files** chưa được upload lên Supabase Storage
2. **Tạo media record** cho từng file đã upload thành công
3. **Tự động điền thông tin** cho từng file (alt text, title, caption, meta description, keywords)

## 🔧 Cách hoạt động

### 1. **Chọn nhiều files**
```typescript
// User có thể chọn nhiều files cùng lúc
const uploadedFiles = [
  { file: File1, uploaded: false, ... },
  { file: File2, uploaded: false, ... },
  { file: File3, uploaded: false, ... }
];
```

### 2. **Upload tất cả files chưa upload**
```typescript
// Tìm files chưa được upload
const filesToUpload = uploadedFiles.filter(file => !file.uploaded);

// Upload từng file
for (let i = 0; i < uploadedFiles.length; i++) {
  const fileData = uploadedFiles[i];
  
  if (!fileData.uploaded) {
    // Upload file lên Supabase Storage
    const uniqueFileName = await generateUniqueFileName(file.name);
    const filePath = `media/${uniqueFileName}`;
    
    await supabase.storage.from("media").upload(filePath, file);
    
    // Cập nhật trạng thái
    updatedFiles[i] = {
      ...fileData,
      uploaded: true,
      url: urlData.publicUrl,
      uploadedFileName: uniqueFileName,
      uploadedFilePath: filePath,
    };
  }
}
```

### 3. **Tạo media record cho từng file**
```typescript
// Tạo record cho tất cả files đã upload
const uploadedFilesData = uploadedFiles.filter(file => file.uploaded);

for (const fileData of uploadedFilesData) {
  // Tạo base values từ form
  const cleanValues = { ...values };
  
  // Thêm thông tin file
  cleanValues.file_url = fileData.url;
  cleanValues.file_path = fileData.uploadedFilePath;
  cleanValues.file_name = fileData.uploadedFileName;
  
  // Tự động tạo alt text, title, caption, meta description, keywords
  if (!cleanValues.alt_text) {
    cleanValues.alt_text = generateSmartAltText(fileData.uploadedFileName);
  }
  
  // Tạo record trong database
  await dataProvider.create({
    resource: 'media',
    variables: cleanValues
  });
}
```

## 📊 Quy trình xử lý

### **Bước 1: Kiểm tra files**
- ✅ Có ít nhất 1 file được chọn
- ✅ Files chưa được upload sẽ được upload tự động

### **Bước 2: Upload files**
- ✅ Upload từng file lên Supabase Storage
- ✅ Tạo tên file unique để tránh trùng lặp
- ✅ Cập nhật trạng thái `uploaded: true`

### **Bước 3: Tạo media records**
- ✅ Tạo record cho từng file đã upload thành công
- ✅ Tự động điền thông tin SEO cho từng file
- ✅ Sử dụng thông tin từ form làm template

## 🎯 Tính năng tự động

### **1. Tự động tạo alt text và title**
```typescript
const smartAltText = fileName
  .replace(/\.[^/.]+$/, '') // Bỏ extension
  .replace(/[-_]/g, ' ')
  .replace(/\b\w/g, (l) => l.toUpperCase())
  .replace(/\s+/g, ' ')
  .trim();
```

### **2. Tự động tạo caption**
```typescript
const baseName = fileName.replace(/\.[^/.]+$/, '');
cleanValues.caption = `${baseName} - Hình ảnh chất lượng cao`;
```

### **3. Tự động tạo meta description**
```typescript
const baseName = fileName.replace(/\.[^/.]+$/, '');
cleanValues.meta_description = `Hình ảnh ${baseName.toLowerCase()}, chất lượng cao, phù hợp cho website và marketing.`;
```

### **4. Tự động tạo meta keywords**
```typescript
const keywords = generateKeywords(fileName.replace(/\.[^/.]+$/, ''));
cleanValues.meta_keywords = keywords;
```

## 📝 Log Messages

### **Upload Progress**
```
🔧 Đang upload 3 file(s) lên Supabase Storage...
✅ Uploaded file 1/3: image_1_abc123.jpg
✅ Uploaded file 2/3: image_2_def456.png
✅ Uploaded file 3/3: image_3_ghi789.webp
✅ Upload thành công 3 file(s)!
```

### **Create Records**
```
🔧 Creating media record for: image_1_abc123.jpg
🔧 Creating media record for: image_2_def456.png
🔧 Creating media record for: image_3_ghi789.webp
✅ Tạo thành công 3 media record(s)!
```

## 🔍 Kiểm tra

### **Trước khi submit**
- ✅ User đã chọn nhiều files
- ✅ Files hiển thị trong preview
- ✅ Form có thông tin cơ bản

### **Sau khi submit**
- ✅ Tất cả files đã được upload lên Supabase Storage
- ✅ Tất cả media records đã được tạo trong database
- ✅ Mỗi file có thông tin SEO riêng biệt

## ⚠️ Lưu ý quan trọng

### **1. Tên file unique**
- ✅ Hệ thống tự động tạo tên file unique
- ✅ Thêm suffix random nếu tên file trùng lặp
- ✅ Giữ tên gốc khi có thể

### **2. Thông tin SEO**
- ✅ Mỗi file có alt text, title, caption riêng
- ✅ Meta description và keywords được tạo tự động
- ✅ Dựa trên tên file đã upload

### **3. Error handling**
- ✅ Nếu upload 1 file fail, các file khác vẫn tiếp tục
- ✅ Chỉ tạo record cho files upload thành công
- ✅ Thông báo lỗi chi tiết cho từng file

### **4. Performance**
- ✅ Upload tuần tự để tránh quá tải
- ✅ Progress tracking cho từng file
- ✅ Batch processing cho database operations

## 🚀 Cách test

### **Test case 1: Upload nhiều files mới**
1. Chọn 3-5 files khác nhau
2. Nhấn Save (không cần nhấn "Upload Files" trước)
3. Kiểm tra:
   - Tất cả files được upload
   - Tất cả media records được tạo
   - Mỗi file có thông tin SEO riêng

### **Test case 2: Mix uploaded và chưa upload**
1. Upload 2 files trước bằng nút "Upload Files"
2. Thêm 3 files mới
3. Nhấn Save
4. Kiểm tra:
   - Chỉ 3 files mới được upload
   - Tổng cộng 5 media records được tạo

### **Test case 3: Error handling**
1. Chọn 1 file có lỗi + 2 files bình thường
2. Nhấn Save
3. Kiểm tra:
   - File lỗi được báo lỗi cụ thể
   - 2 files bình thường vẫn được xử lý
   - Chỉ 2 media records được tạo

## 📊 Kết quả mong đợi

### **Input: 3 files**
- `product_1.jpg`
- `product_2.png`
- `product_3.webp`

### **Output: 3 media records**
```json
[
  {
    "file_name": "product_1_abc123",
    "file_url": "https://.../media/product_1_abc123.jpg",
    "alt_text": "Product 1",
    "title": "Product 1",
    "caption": "product_1_abc123 - Hình ảnh chất lượng cao",
    "meta_description": "Hình ảnh product_1_abc123, chất lượng cao, phù hợp cho website và marketing.",
    "meta_keywords": ["product 1", "hình ảnh chất lượng cao", "ảnh đẹp"]
  },
  {
    "file_name": "product_2_def456",
    "file_url": "https://.../media/product_2_def456.png",
    "alt_text": "Product 2",
    "title": "Product 2",
    "caption": "product_2_def456 - Hình ảnh chất lượng cao",
    "meta_description": "Hình ảnh product_2_def456, chất lượng cao, phù hợp cho website và marketing.",
    "meta_keywords": ["product 2", "hình ảnh chất lượng cao", "ảnh đẹp"]
  },
  {
    "file_name": "product_3_ghi789",
    "file_url": "https://.../media/product_3_ghi789.webp",
    "alt_text": "Product 3",
    "title": "Product 3",
    "caption": "product_3_ghi789 - Hình ảnh chất lượng cao",
    "meta_description": "Hình ảnh product_3_ghi789, chất lượng cao, phù hợp cho website và marketing.",
    "meta_keywords": ["product 3", "hình ảnh chất lượng cao", "ảnh đẹp"]
  }
]
```
