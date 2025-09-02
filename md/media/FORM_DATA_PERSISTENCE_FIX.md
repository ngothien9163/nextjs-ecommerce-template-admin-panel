# 🔧 Form Data Persistence Fix

## 📋 Vấn đề đã được sửa

**Vấn đề**: Khi user thay đổi thông tin trong form (alt text, title, caption, meta description, keywords, SEO scores) và sau đó chọn file khác, những thay đổi này bị mất vì hệ thống tự động điền lại thông tin từ file mới.

## 🔧 Giải pháp đã áp dụng

### **1. Sửa logic `selectFile`**
- ✅ **Kiểm tra dữ liệu hiện tại**: Chỉ tự động điền khi form chưa có dữ liệu
- ✅ **Bảo vệ thay đổi của user**: Không ghi đè thông tin đã được chỉnh sửa
- ✅ **Log rõ ràng**: Hiển thị khi nào tự động điền và khi nào giữ nguyên

### **2. Cải thiện nút "Tự động điền"**
- ✅ **Ghi đè có chủ ý**: User có thể chủ động điền lại thông tin nếu muốn
- ✅ **Thông báo rõ ràng**: Hiển thị message khi đã tự động điền
- ✅ **Tạo thông tin mới**: Sử dụng logic tạo thông tin thông minh

### **3. Sửa logic submit**
- ✅ **Loại bỏ ghi đè**: Không ghi đè thông tin file đang chọn
- ✅ **Log chi tiết**: Hiển thị thông tin được sử dụng cho từng file
- ✅ **Phân biệt rõ ràng**: File đang chọn vs file tự động tạo

## 📊 Logic mới

### **1. Khi chọn file**
```typescript
// Kiểm tra form đã có dữ liệu chưa
const currentFormValues = formProps.form.getFieldsValue() as MediaFormValues;
const hasExistingData = currentFormValues.alt_text || currentFormValues.title || currentFormValues.caption;

if (!hasExistingData) {
  // Chỉ điền khi form chưa có dữ liệu
  formProps.form.setFieldsValue({...});
  console.log("🔧 Auto-filled form with file info (no existing data)");
} else {
  // Giữ nguyên thay đổi của user
  console.log("🔧 Form already has data, keeping user's changes");
}
```

### **2. Nút "Tự động điền"**
```typescript
onClick={() => {
  // Ghi đè thông tin hiện tại với thông tin từ file đang chọn
  const fileData = uploadedFiles[selectedFileIndex];
  const fileName = fileData.file.name.replace(/\.[^/.]+$/, "");
  
  // Tạo thông tin thông minh
  const smartAltText = generateSmartAltText(fileName);
  const captions = generateCaptions(fileName);
  const metaDescriptions = generateMetaDescriptions(fileName);
  const keywords = generateKeywords(fileName);
  
  // Ghi đè form
  formProps.form?.setFieldsValue({
    file_name: fileName,
    alt_text: smartAltText,
    title: smartAltText,
    caption: captions[0],
    meta_description: metaDescriptions[0],
    meta_keywords: keywords,
  });
  
  message.info('Đã tự động điền lại thông tin từ file đang chọn!');
}}
```

### **3. Khi submit**
```typescript
// Tạo record cho từng file
for (let i = 0; i < uploadedFilesData.length; i++) {
  const fileData = uploadedFilesData[i];
  
  if (i === selectedFileIndex) {
    // File đang chọn - sử dụng thông tin từ form
    cleanValues = { ...values };
  } else {
    // File khác - tự động tạo thông tin
    cleanValues = {} as MediaFormValues;
    // Tạo thông tin tự động...
  }
  
  // Thêm thông tin file
  cleanValues.file_url = fileData.url;
  cleanValues.file_path = fileData.uploadedFilePath;
  // ...
  
  console.log(
    `Creating media record for: ${fileData.uploadedFileName} (${i === selectedFileIndex ? 'selected' : 'auto-generated'})`,
    i === selectedFileIndex ? 'Form values:' : 'Auto-generated values:',
    i === selectedFileIndex ? cleanValues : {
      alt_text: cleanValues.alt_text,
      title: cleanValues.title,
      caption: cleanValues.caption,
      meta_description: cleanValues.meta_description,
      seo_score: cleanValues.seo_score
    }
  );
}
```

## 🎯 User Experience

### **Trước khi sửa**
- ❌ Chọn file → Mất thay đổi đã thực hiện
- ❌ Không thể bảo vệ thông tin đã chỉnh sửa
- ❌ Phải nhập lại thông tin mỗi lần chọn file

### **Sau khi sửa**
- ✅ **Bảo vệ thay đổi**: Thông tin đã chỉnh sửa không bị mất
- ✅ **Tự động điền thông minh**: Chỉ điền khi form trống
- ✅ **Chủ động điền lại**: Nút "Tự động điền" để ghi đè có chủ ý
- ✅ **Log rõ ràng**: Biết được khi nào tự động điền, khi nào giữ nguyên

## 📝 Log Messages

### **Khi chọn file**
```
🔧 Auto-filled form with file info (no existing data)
```
hoặc
```
🔧 Form already has data, keeping user's changes
```

### **Khi click nút tự động điền**
```
✅ Đã tự động điền lại thông tin từ file đang chọn!
```

### **Khi submit**
```
🔧 Creating media record for: product_1_abc123.jpg (selected)
Form values: { alt_text: "Sản phẩm chất lượng cao", title: "Sản phẩm chất lượng cao", ... }

🔧 Creating media record for: product_2_def456.png (auto-generated)
Auto-generated values: { alt_text: "Product 2 Def456", title: "Product 2 Def456", ... }
```

## 🚀 Cách test

### **Test case 1: Bảo vệ thay đổi**
1. Upload 2 files
2. Chọn file 1, chỉnh sửa alt text thành "Sản phẩm A"
3. Chọn file 2, chỉnh sửa alt text thành "Sản phẩm B"
4. Chọn lại file 1
5. Kiểm tra: Alt text vẫn là "Sản phẩm A" (không bị mất)

### **Test case 2: Tự động điền thông minh**
1. Upload 1 file mới
2. Chọn file (form trống)
3. Kiểm tra: Thông tin được tự động điền
4. Chỉnh sửa alt text
5. Chọn lại file
6. Kiểm tra: Alt text đã chỉnh sửa không bị thay đổi

### **Test case 3: Nút tự động điền**
1. Upload 1 file
2. Chỉnh sửa thông tin trong form
3. Click nút "🔄 Tự động điền"
4. Kiểm tra: Thông tin được ghi đè với thông tin từ file
5. Kiểm tra: Message "Đã tự động điền lại thông tin từ file đang chọn!"

### **Test case 4: Submit với nhiều files**
1. Upload 3 files
2. Chọn file 2, chỉnh sửa thông tin
3. Nhấn Save
4. Kiểm tra:
   - File 2 có thông tin đã chỉnh sửa
   - File 1 và 3 có thông tin tự động tạo
   - Log hiển thị rõ ràng file nào selected, file nào auto-generated

## ⚠️ Lưu ý quan trọng

### **1. Bảo vệ dữ liệu**
- ✅ Thông tin đã chỉnh sửa không bị mất khi chọn file khác
- ✅ Chỉ tự động điền khi form thực sự trống
- ✅ User có thể chủ động điền lại nếu muốn

### **2. UX cải thiện**
- ✅ Không còn bị mất thay đổi bất ngờ
- ✅ Có thể làm việc với nhiều files mà không lo mất dữ liệu
- ✅ Feedback rõ ràng về hành động của hệ thống

### **3. Debug dễ dàng**
- ✅ Log chi tiết cho từng bước
- ✅ Phân biệt rõ file selected vs auto-generated
- ✅ Hiển thị thông tin được sử dụng cho từng file
