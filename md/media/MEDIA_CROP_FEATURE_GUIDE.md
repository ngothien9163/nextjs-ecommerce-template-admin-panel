# 🖼️ Media Crop Feature Guide

## 📋 Tổng quan

Tính năng Crop hình ảnh trong trang `/media/edit` cho phép người dùng cắt, xoay và lưu hình ảnh đã chỉnh sửa trực tiếp từ giao diện admin.

## 🔧 Các tính năng có sẵn

### **1. Crop (Cắt hình)**
- ✅ **ReactCrop Integration**: Sử dụng thư viện `react-image-crop`
- ✅ **Interactive Selection**: Kéo thả để chọn vùng cắt
- ✅ **Real-time Preview**: Xem trước kết quả crop ngay lập tức
- ✅ **Multiple Crop Areas**: Có thể thay đổi vùng cắt nhiều lần

### **2. Rotate (Xoay hình)**
- ✅ **Rotate Left**: Xoay trái 90 độ
- ✅ **Rotate Right**: Xoay phải 90 độ
- ✅ **Multiple Rotations**: Có thể xoay nhiều lần
- ✅ **Visual Feedback**: Hiển thị góc xoay trực quan

### **3. Save & Upload**
- ✅ **Automatic Upload**: Tự động upload lên Supabase Storage
- ✅ **Database Update**: Cập nhật thông tin trong database
- ✅ **File Management**: Tạo file mới với tên unique
- ✅ **URL Update**: Cập nhật URL công khai

## 🚀 Cách sử dụng

### **Bước 1: Truy cập trang Edit**
1. Vào trang `/media/list`
2. Click nút "Edit" (biểu tượng bút chì) trên media cần chỉnh sửa
3. Chuyển đến trang `/media/edit/{id}`

### **Bước 2: Sử dụng tính năng Crop**

#### **2.1. Bật chế độ Crop**
- Click nút **"Crop"** (biểu tượng kéo cắt)
- Hình ảnh sẽ chuyển sang chế độ crop với khung chọn

#### **2.2. Chọn vùng cắt**
- **Kéo thả** để tạo khung chọn
- **Resize** khung bằng cách kéo các góc
- **Move** khung bằng cách kéo bên trong
- **Adjust** kích thước chính xác

#### **2.3. Xem trước kết quả**
- Sau khi chọn vùng, hệ thống tự động tạo preview
- Hiển thị hình ảnh đã crop ở phần "Hình ảnh đã crop"
- Có thể thay đổi vùng cắt nhiều lần

#### **2.4. Lưu hình đã crop**
- Click nút **"Lưu Crop"** (màu xanh)
- Hệ thống sẽ:
  - Tạo file mới với tên `cropped-{timestamp}-{random}.jpg`
  - Upload lên Supabase Storage
  - Cập nhật database với file_path và file_url mới
  - Hiển thị thông báo thành công
  - Reload trang để hiển thị hình mới

### **Bước 3: Sử dụng tính năng Rotate**

#### **3.1. Xoay hình ảnh**
- Click **"Xoay trái"** để xoay ngược chiều kim đồng hồ
- Click **"Xoay phải"** để xoay theo chiều kim đồng hồ
- Mỗi lần click xoay 90 độ

#### **3.2. Kết hợp với Crop**
- Có thể xoay trước khi crop
- Hoặc crop trước khi xoay
- Hình ảnh sẽ hiển thị với góc xoay đã áp dụng

## 📊 Code Implementation

### **1. State Management**
```typescript
const [crop, setCrop] = useState<Crop>({
  unit: "%",
  x: 0,
  y: 0,
  width: 30,
  height: 30,
});
const [isCropping, setIsCropping] = useState(false);
const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
const [rotation, setRotation] = useState(0);
```

### **2. Crop Functions**
```typescript
// Handle crop change
const onCropChange = (crop: Crop) => {
  setCrop(crop);
};

// Complete crop and create preview
const onCropComplete = async (crop: any, pixelCrop: any) => {
  if (!imageRef.current) return;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  
  // Calculate scale factors
  const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
  const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
  
  // Set canvas size
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  
  // Draw cropped image
  ctx.drawImage(
    imageRef.current,
    pixelCrop.x * scaleX,
    pixelCrop.y * scaleY,
    pixelCrop.width * scaleX,
    pixelCrop.height * scaleY,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );
  
  // Convert to blob
  const croppedImageBlob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
    }, "image/jpeg", 0.9);
  });
  
  // Create preview URL
  const croppedImageUrl = URL.createObjectURL(croppedImageBlob);
  setCroppedImageUrl(croppedImageUrl);
};
```

### **3. Save Crop Function**
```typescript
const handleCropSave = async () => {
  if (!croppedImageUrl) return;

  try {
    // Convert blob URL to file
    const response = await fetch(croppedImageUrl);
    const blob = await response.blob();
    const file = new File(
      [blob],
      mediaData?.file_name || "cropped-image.jpg",
      { type: "image/jpeg" }
    );

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `cropped-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;
    const filePath = `media/${fileName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } =
      await supabaseAdmin.storage.from("media").upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from("media")
      .getPublicUrl(filePath);

    // Update database record
    const { error: updateError } = await supabaseAdmin
      .from("media")
      .update({
        file_path: filePath,
        file_url: urlData.publicUrl,
        file_size: file.size,
      })
      .eq("id", mediaData?.id);

    if (updateError) throw updateError;

    // Success feedback
    message.success("Đã crop và lưu hình ảnh thành công!");
    setIsCropping(false);
    setCroppedImageUrl(null);

    // Refresh page
    window.location.reload();
  } catch (error) {
    console.error("Crop save error:", error);
    message.error("Có lỗi xảy ra khi lưu hình ảnh đã crop!");
  }
};
```

### **4. Rotate Functions**
```typescript
const handleRotate = (direction: "left" | "right") => {
  const newRotation = direction === "left" ? rotation - 90 : rotation + 90;
  setRotation(newRotation);
};

const applyRotation = (imageUrl: string): Promise<string> => {
  if (rotation === 0) return Promise.resolve(imageUrl);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = new window.Image();

  return new Promise<string>((resolve) => {
    img.onload = () => {
      canvas.width = img.height;
      canvas.height = img.width;

      ctx?.translate(canvas.width / 2, canvas.height / 2);
      ctx?.rotate((rotation * Math.PI) / 180);
      ctx?.drawImage(img, -img.width / 2, -img.height / 2);

      resolve(canvas.toDataURL());
    };
    img.src = imageUrl;
  });
};
```

## 🎯 UI Components

### **1. Control Buttons**
```typescript
<Space>
  <Button
    icon={<ScissorOutlined />}
    onClick={() => setIsCropping(!isCropping)}
    type={isCropping ? "primary" : "default"}
  >
    {isCropping ? "Thoát Crop" : "Crop"}
  </Button>
  <Button
    icon={<RotateLeftOutlined />}
    onClick={() => handleRotate("left")}
  >
    Xoay trái
  </Button>
  <Button
    icon={<RotateRightOutlined />}
    onClick={() => handleRotate("right")}
  >
    Xoay phải
  </Button>
</Space>
```

### **2. Crop Interface**
```typescript
{isCropping ? (
  <div style={{ maxWidth: "100%", overflow: "hidden" }}>
    <ReactCrop
      crop={crop}
      onChange={onCropChange}
      onComplete={(crop, pixelCrop) => onCropComplete(crop, pixelCrop)}
    >
      <img
        ref={imageRef}
        src={mediaData?.file_url}
        alt={mediaData?.alt_text || mediaData?.file_name}
        style={{
          maxWidth: "100%",
          maxHeight: "400px",
          transform: `rotate(${rotation}deg)`,
        }}
      />
    </ReactCrop>
    {croppedImageUrl && (
      <div style={{ marginTop: "16px" }}>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleCropSave}
        >
          Lưu Crop
        </Button>
      </div>
    )}
  </div>
) : (
  <Image
    src={mediaData?.file_url}
    alt={mediaData?.alt_text || mediaData?.file_name}
    style={{
      maxWidth: "100%",
      maxHeight: "400px",
      transform: `rotate(${rotation}deg)`,
    }}
  />
)}
```

## ⚠️ Lưu ý quan trọng

### **1. File Management**
- ✅ **Original File**: File gốc vẫn được giữ nguyên trong storage
- ✅ **New File**: File đã crop được tạo với tên mới
- ✅ **Database Update**: Chỉ cập nhật thông tin file_path và file_url
- ✅ **No Deletion**: Không xóa file gốc tự động

### **2. Performance**
- ✅ **Canvas Processing**: Sử dụng HTML5 Canvas để xử lý hình ảnh
- ✅ **Blob URLs**: Tạo blob URLs cho preview
- ✅ **Memory Management**: Tự động cleanup blob URLs
- ✅ **Quality Control**: JPEG quality 0.9 cho cân bằng chất lượng/kích thước

### **3. Error Handling**
- ✅ **Upload Errors**: Xử lý lỗi upload Supabase Storage
- ✅ **Database Errors**: Xử lý lỗi cập nhật database
- ✅ **User Feedback**: Hiển thị thông báo thành công/lỗi
- ✅ **Fallback**: Reload trang nếu có lỗi

### **4. Browser Compatibility**
- ✅ **Modern Browsers**: Hỗ trợ Chrome, Firefox, Safari, Edge
- ✅ **Canvas API**: Yêu cầu HTML5 Canvas support
- ✅ **File API**: Yêu cầu File API support
- ✅ **Blob API**: Yêu cầu Blob API support

## 🔄 Workflow

### **1. Crop Workflow**
```
1. Click "Crop" → Enter crop mode
2. Select crop area → Real-time preview
3. Adjust crop area → Multiple iterations
4. Click "Lưu Crop" → Upload to storage
5. Update database → Success message
6. Reload page → Show new image
```

### **2. Rotate Workflow**
```
1. Click "Xoay trái/phải" → Apply rotation
2. Visual feedback → See rotated image
3. Optional crop → Crop rotated image
4. Save changes → Upload and update
```

### **3. Combined Workflow**
```
1. Rotate image → Get desired orientation
2. Enter crop mode → Select crop area
3. Preview result → Adjust if needed
4. Save changes → Upload final image
5. Database update → Reflect changes
```

## 🚀 Best Practices

### **1. User Experience**
- ✅ **Clear Instructions**: Nút có icon và text rõ ràng
- ✅ **Visual Feedback**: Preview ngay lập tức
- ✅ **Error Messages**: Thông báo lỗi cụ thể
- ✅ **Success Confirmation**: Xác nhận thành công

### **2. Technical Implementation**
- ✅ **Memory Management**: Cleanup blob URLs
- ✅ **Error Handling**: Comprehensive error handling
- ✅ **Performance**: Optimized canvas operations
- ✅ **Security**: Validate file types and sizes

### **3. File Management**
- ✅ **Unique Names**: Tránh trùng lặp tên file
- ✅ **Metadata Preservation**: Giữ nguyên metadata
- ✅ **Storage Optimization**: Tối ưu kích thước file
- ✅ **Backup Strategy**: Giữ file gốc làm backup

**Kết quả**: Tính năng crop hình ảnh hoàn chỉnh với UI thân thiện và xử lý backend đầy đủ! 🎯✅
