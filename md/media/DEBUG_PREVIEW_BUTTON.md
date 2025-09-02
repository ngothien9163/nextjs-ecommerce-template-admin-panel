# 🔧 Debug: Nút "Tạo Preview" không hoạt động

## 📋 Vấn đề

Nút "Tạo Preview" không hoạt động trong trang `/media/edit` khi người dùng click vào nút này.

## 🔍 Nguyên nhân đã phát hiện

### **1. Lỗi chuyển đổi crop coordinates**
- ❌ **Crop coordinates sai**: Hàm `handleManualCrop` đang truyền sai tham số cho `onCropComplete`
- ❌ **Percentage vs Pixels**: ReactCrop sử dụng percentage nhưng `onCropComplete` cần pixel coordinates
- ❌ **Scale calculation**: Không tính toán đúng tỷ lệ giữa percentage và pixel

### **2. Logic validation sai**
- ❌ **Missing validation**: Không kiểm tra `imageRef.current` trước khi sử dụng
- ❌ **State synchronization**: Không đồng bộ giữa crop state và image loading

## ✅ Giải pháp đã áp dụng

### **1. Sửa hàm `handleManualCrop`**
```typescript
const handleManualCrop = () => {
  if (imageRef.current && crop.width && crop.height) {
    console.log("🔍 Manual crop trigger");
    console.log("🔍 Current crop:", crop);
    
    // Convert percentage crop to pixel crop
    const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
    const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
    
    const pixelCrop = {
      x: Math.round((crop.x / 100) * imageRef.current.width),
      y: Math.round((crop.y / 100) * imageRef.current.height),
      width: Math.round((crop.width / 100) * imageRef.current.width),
      height: Math.round((crop.height / 100) * imageRef.current.height)
    };
    
    console.log("🔍 Calculated pixelCrop:", pixelCrop);
    onCropComplete(crop, pixelCrop);
  } else {
    console.log("❌ Cannot trigger manual crop:", {
      imageRef: !!imageRef.current,
      cropWidth: crop.width,
      cropHeight: crop.height
    });
  }
};
```

### **2. Thêm validation cho nút "Tạo Preview"**
```typescript
{isCropping && crop.width && crop.height && (
  <Button
    type="dashed"
    onClick={handleManualCrop}
    disabled={!imageRef.current}
  >
    Tạo Preview
  </Button>
)}
```

### **3. Thêm debug logs**
```typescript
// Debug useEffect
useEffect(() => {
  console.log("🔍 Debug state:", {
    isCropping,
    crop,
    croppedImageUrl: !!croppedImageUrl,
    imageRef: !!imageRef.current,
    imageLoaded: imageRef.current?.complete
  });
}, [isCropping, crop, croppedImageUrl]);

// Debug onCropChange
const onCropChange = (crop: Crop) => {
  console.log("🔍 onCropChange called:", crop);
  setCrop(crop);
};
```

## 🔧 Debug Workflow

### **1. Kiểm tra trạng thái ban đầu**
```javascript
🔍 Debug state: {
  isCropping: false,
  crop: { unit: "%", x: 0, y: 0, width: 30, height: 30 },
  croppedImageUrl: false,
  imageRef: false,
  imageLoaded: false
}
```

### **2. Sau khi click "Crop"**
```javascript
🔍 Debug state: {
  isCropping: true,
  crop: { unit: "%", x: 0, y: 0, width: 30, height: 30 },
  croppedImageUrl: false,
  imageRef: true,
  imageLoaded: true
}
```

### **3. Sau khi chọn vùng crop**
```javascript
🔍 onCropChange called: { unit: "%", x: 25, y: 20, width: 50, height: 40 }
🔍 Debug state: {
  isCropping: true,
  crop: { unit: "%", x: 25, y: 20, width: 50, height: 40 },
  croppedImageUrl: false,
  imageRef: true,
  imageLoaded: true
}
```

### **4. Sau khi click "Tạo Preview"**
```javascript
🔍 Manual crop trigger
🔍 Current crop: { unit: "%", x: 25, y: 20, width: 50, height: 40 }
🔍 Calculated pixelCrop: { x: 200, y: 160, width: 400, height: 320 }
🔍 onCropComplete called: { crop: {...}, pixelCrop: {...} }
🔍 Scale factors: { scaleX: 1.5, scaleY: 1.5 }
🔍 Pixel crop dimensions: { width: 400, height: 320 }
✅ Blob created successfully: 819200 bytes
✅ Setting croppedImageUrl: blob:http://localhost:5173/...
```

## 🚀 Cách sử dụng đã sửa

### **Bước 1: Bật chế độ Crop**
1. Click nút **"Crop"** để bật chế độ crop
2. Kiểm tra console log: `🔍 Debug state: { isCropping: true, ... }`

### **Bước 2: Chọn vùng cắt**
1. **Kéo thả** để tạo khung chọn vùng cắt
2. Kiểm tra console log: `🔍 onCropChange called: { ... }`
3. Đảm bảo `crop.width` và `crop.height` > 0

### **Bước 3: Tạo Preview**
1. Click nút **"Tạo Preview"** (nút sẽ không bị disabled)
2. Kiểm tra console log: `🔍 Manual crop trigger`
3. Kiểm tra: `🔍 Calculated pixelCrop: { ... }`
4. Kiểm tra: `✅ Setting croppedImageUrl: ...`

### **Bước 4: Lưu hình đã crop**
1. Nút **"Lưu Crop"** sẽ xuất hiện
2. Click để lưu và cập nhật database

## ⚠️ Troubleshooting

### **1. Nút "Tạo Preview" bị disabled**
- **Check**: Console log `🔍 Debug state`
- **Solution**: Đảm bảo `imageRef.current` có giá trị
- **Debug**: Kiểm tra image loading status

### **2. Click "Tạo Preview" không có phản hồi**
- **Check**: Console log `🔍 Manual crop trigger`
- **Solution**: Đảm bảo `crop.width` và `crop.height` > 0
- **Debug**: Kiểm tra crop state

### **3. Preview không tạo được**
- **Check**: Console log `🔍 Calculated pixelCrop`
- **Solution**: Đảm bảo tính toán pixel coordinates đúng
- **Debug**: Kiểm tra scale factors

### **4. Blob creation failed**
- **Check**: Console log `❌ Failed to create blob`
- **Solution**: Đảm bảo canvas context và image data
- **Debug**: Kiểm tra canvas operations

## 📊 Expected Console Output

### **Success Flow:**
```javascript
🔍 Debug state: { isCropping: true, crop: {...}, croppedImageUrl: false, imageRef: true, imageLoaded: true }
🔍 onCropChange called: { unit: "%", x: 25, y: 20, width: 50, height: 40 }
🔍 Manual crop trigger
🔍 Current crop: { unit: "%", x: 25, y: 20, width: 50, height: 40 }
🔍 Calculated pixelCrop: { x: 200, y: 160, width: 400, height: 320 }
🔍 onCropComplete called: { crop: {...}, pixelCrop: {...} }
🔍 Scale factors: { scaleX: 1.5, scaleY: 1.5 }
🔍 Pixel crop dimensions: { width: 400, height: 320 }
✅ Blob created successfully: 819200 bytes
✅ Setting croppedImageUrl: blob:http://localhost:5173/...
🔍 Debug state: { isCropping: true, crop: {...}, croppedImageUrl: true, imageRef: true, imageLoaded: true }
```

### **Error Flow:**
```javascript
❌ Cannot trigger manual crop: { imageRef: false, cropWidth: 0, cropHeight: 0 }
❌ imageRef.current is null
❌ Invalid pixelCrop: undefined
❌ Error in onCropComplete: Error message
```

**Kết quả**: Nút "Tạo Preview" giờ đây hoạt động đúng cách với debug logs chi tiết! 🎯✅
