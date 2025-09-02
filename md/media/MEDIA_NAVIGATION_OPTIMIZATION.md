# 🖼️ Media Pages Navigation Optimization

## 📋 Tổng quan

Đã tối ưu lại các nút thêm, xóa, sửa và navigation cho tất cả các trang media để đảm bảo trải nghiệm người dùng nhất quán và dễ sử dụng.

## 🔧 Các cải thiện đã thực hiện

### **1. Trang `/media/list` (Danh sách)**
- ✅ **Upload Media**: Nút upload với tooltip hướng dẫn
- ✅ **Refresh**: Nút làm mới dữ liệu
- ✅ **Create Button**: Nút tạo mới media
- ✅ **Action Buttons**: Xem, Sửa, Link, Copy, Info cho từng item
- ✅ **Pagination**: Phân trang ở đầu và cuối trang

### **2. Trang `/media/create` (Tạo mới)**
- ✅ **Quay về danh sách**: Nút navigation về trang list
- ✅ **Save Button**: Nút lưu với custom logic
- ✅ **Upload Files**: Nút upload files
- ✅ **Auto-fill SEO**: Nút gợi ý SEO scores

### **3. Trang `/media/edit` (Chỉnh sửa)**
- ✅ **Quay về danh sách**: Nút navigation về trang list
- ✅ **Xem dữ liệu**: Nút chuyển đến trang show
- ✅ **Save Button**: Nút lưu với data reload
- ✅ **Crop/Rotate**: Các nút chỉnh sửa hình ảnh

### **4. Trang `/media/show` (Xem chi tiết)**
- ✅ **Quay về danh sách**: Nút navigation về trang list
- ✅ **Chỉnh sửa**: Nút chuyển đến trang edit
- ✅ **Xem fullscreen**: Nút xem hình ảnh lớn
- ✅ **Tải xuống**: Nút tải hình ảnh
- ✅ **Copy URL**: Nút copy URL vào clipboard

## 📊 Cấu trúc nút theo từng trang

### **1. Header Buttons - List Page**
```typescript
headerButtons={
  <Space>
    <Tooltip title="Upload hình ảnh/media files vào hệ thống">
      <Button type="primary" icon={<UploadOutlined />}>
        Upload Media
      </Button>
    </Tooltip>
    <Tooltip title="Làm mới dữ liệu media từ database">
      <Button icon={<ReloadOutlined />}>
        Refresh
      </Button>
    </Tooltip>
    <CreateButton />
  </Space>
}
```

### **2. Header Buttons - Create Page**
```typescript
headerButtons={[
  <Button
    key="back"
    icon={<ArrowLeftOutlined />}
    onClick={handleBackToList}
  >
    Quay về danh sách
  </Button>,
]}
```

### **3. Header Buttons - Edit Page**
```typescript
headerButtons={[
  <Button
    key="back"
    icon={<ArrowLeftOutlined />}
    onClick={handleBackToList}
  >
    Quay về danh sách
  </Button>,
  <Button
    key="view"
    type="primary"
    icon={<EyeOutlined />}
    onClick={handleViewMedia}
    disabled={!mediaData?.id}
  >
    Xem dữ liệu
  </Button>,
]}
```

### **4. Header Buttons - Show Page**
```typescript
headerButtons={[
  <Button
    key="back"
    icon={<ArrowLeftOutlined />}
    onClick={handleBackToList}
  >
    Quay về danh sách
  </Button>,
  <Button
    key="edit"
    type="primary"
    icon={<EditOutlined />}
    onClick={handleEdit}
    disabled={!record?.id}
  >
    Chỉnh sửa
  </Button>,
]}
```

## 🎯 User Experience

### **Navigation Flow**
```
/media/list → /media/create → /media/list
/media/list → /media/edit/{id} → /media/list
/media/list → /media/show/{id} → /media/edit/{id}
/media/show/{id} → /media/edit/{id} → /media/show/{id}
```

### **Consistent Design**
- ✅ **Icon Usage**: Sử dụng icon nhất quán cho từng chức năng
- ✅ **Button Types**: Primary cho actions chính, default cho navigation
- ✅ **Disabled States**: Disable nút khi không có dữ liệu cần thiết
- ✅ **Tooltips**: Hướng dẫn rõ ràng cho các nút phức tạp

### **Accessibility**
- ✅ **Keyboard Navigation**: Tất cả nút đều có thể truy cập bằng keyboard
- ✅ **Screen Reader**: Alt text và aria-labels phù hợp
- ✅ **Color Contrast**: Màu sắc đảm bảo độ tương phản tốt
- ✅ **Focus States**: Focus indicator rõ ràng

## 📝 Code Changes

### **File: `src/pages/media/create.tsx`**

#### **Thêm imports:**
```typescript
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
```

#### **Thêm navigation:**
```typescript
const navigate = useNavigate();

const handleBackToList = () => {
  navigate("/media");
};
```

#### **Cập nhật Create component:**
```typescript
<Create
  headerButtons={[
    <Button
      key="back"
      icon={<ArrowLeftOutlined />}
      onClick={handleBackToList}
    >
      Quay về danh sách
    </Button>,
  ]}
  saveButtonProps={{...}}
>
```

### **File: `src/pages/media/show.tsx`**

#### **Thêm imports:**
```typescript
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
```

#### **Thêm navigation:**
```typescript
const navigate = useNavigate();

const handleBackToList = () => {
  navigate("/media");
};

const handleEdit = () => {
  if (record?.id) {
    navigate(`/media/edit/${record.id}`);
  }
};
```

#### **Cập nhật Show component:**
```typescript
<Show 
  headerButtons={[
    <Button
      key="back"
      icon={<ArrowLeftOutlined />}
      onClick={handleBackToList}
    >
      Quay về danh sách
    </Button>,
    <Button
      key="edit"
      type="primary"
      icon={<EditOutlined />}
      onClick={handleEdit}
      disabled={!record?.id}
    >
      Chỉnh sửa
    </Button>,
  ]}
  isLoading={isLoading}
>
```

## 🚀 Cách sử dụng

### **Navigation Patterns**

#### **1. List → Create → List**
1. Từ `/media/list` click "Create" hoặc "Upload Media"
2. Tạo media mới ở `/media/create`
3. Click "Quay về danh sách" để trở về

#### **2. List → Edit → List**
1. Từ `/media/list` click "Edit" trên item
2. Chỉnh sửa ở `/media/edit/{id}`
3. Click "Quay về danh sách" hoặc "Xem dữ liệu"

#### **3. List → Show → Edit**
1. Từ `/media/list` click "View" trên item
2. Xem chi tiết ở `/media/show/{id}`
3. Click "Chỉnh sửa" để edit hoặc "Quay về danh sách"

### **Action Buttons**

#### **1. Upload & Create**
- **Upload Media**: Upload files trực tiếp
- **Create**: Tạo media mới với form đầy đủ
- **Refresh**: Làm mới dữ liệu từ database

#### **2. Edit & View**
- **Edit**: Chỉnh sửa thông tin media
- **View**: Xem chi tiết media
- **Crop/Rotate**: Chỉnh sửa hình ảnh

#### **3. Utility Actions**
- **Copy URL**: Copy URL vào clipboard
- **Open Link**: Mở hình ảnh trong tab mới
- **Download**: Tải xuống hình ảnh
- **Info**: Xem thông tin chi tiết

## ⚠️ Lưu ý quan trọng

### **1. State Management**
- ✅ Disable nút khi không có dữ liệu cần thiết
- ✅ Loading states cho các actions async
- ✅ Error handling cho navigation

### **2. Performance**
- ✅ Lazy loading cho hình ảnh
- ✅ Debounce cho search/filter
- ✅ Optimistic updates cho actions

### **3. UX/UI**
- ✅ Consistent button styling
- ✅ Clear visual hierarchy
- ✅ Responsive design cho mobile
- ✅ Smooth transitions

## 🔄 Workflow Optimization

### **1. Create Flow**
```
List → Create → Upload Files → Fill Form → Save → List
```

### **2. Edit Flow**
```
List → Edit → Modify Data → Save → Reload → Continue/View
```

### **3. View Flow**
```
List → View → Show Details → Edit/Back
```

**Kết quả**: Tất cả các trang media giờ đây có navigation nhất quán và trải nghiệm người dùng tối ưu! 🎯✅
