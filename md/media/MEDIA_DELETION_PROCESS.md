# 🗑️ Media Deletion Process

## 📋 Tổng quan

Khi xóa media từ trang `/media/`, hệ thống sẽ thực hiện **2 bước xóa**:

1. **Xóa file từ Supabase Storage bucket**
2. **Xóa record từ database**

## 🔧 Cách hoạt động

### 1. **Single Delete** (`deleteOne`)
```typescript
// Khi click nút delete một media
deleteOne({ resource: 'media', id: 'media-id' })
```

**Quy trình:**
1. Lấy thông tin `file_path` từ record media
2. Xóa file từ Supabase Storage bucket (`media` bucket)
3. Xóa record từ bảng `media` trong database

### 2. **Bulk Delete** (`deleteMany`)
```typescript
// Khi xóa nhiều media cùng lúc
deleteMany({ resource: 'media', ids: ['id1', 'id2', 'id3'] })
```

**Quy trình:**
1. Lấy thông tin `file_path` của tất cả media records
2. Xóa tất cả files từ Supabase Storage bucket
3. Xóa tất cả records từ bảng `media` trong database

## 🛡️ Error Handling

### **Storage Deletion Fails**
- ❌ File không thể xóa từ bucket (file không tồn tại, quyền truy cập, v.v.)
- ✅ **Vẫn tiếp tục xóa record từ database**
- 📝 Log lỗi để debug

### **Database Deletion Fails**
- ❌ Record không thể xóa từ database
- ❌ **Không xóa file từ bucket** (để tránh mất dữ liệu)
- 📝 Log lỗi và throw exception

## 📊 Log Messages

### **Success**
```
🔍 deleteOne called for resource: media with ID: xxx
🗑️ Deleting file from bucket: /path/to/file.jpg
✅ File deleted from storage successfully
✅ Successfully deleted media with ID: xxx
```

### **Storage Error**
```
🔍 deleteOne called for resource: media with ID: xxx
🗑️ Deleting file from bucket: /path/to/file.jpg
❌ Error deleting file from storage: [error details]
✅ Successfully deleted media with ID: xxx
```

### **Database Error**
```
🔍 deleteOne called for resource: media with ID: xxx
❌ Database deletion error: [error details]
```

## 🔍 Kiểm tra

### **Trước khi xóa**
- ✅ File tồn tại trong bucket
- ✅ Record tồn tại trong database
- ✅ `file_path` không null

### **Sau khi xóa**
- ❌ File không còn trong bucket
- ❌ Record không còn trong database
- ✅ Không có orphaned files

## ⚠️ Lưu ý quan trọng

1. **Backup**: Luôn backup dữ liệu quan trọng trước khi xóa
2. **Permissions**: Đảm bảo có quyền xóa từ cả storage và database
3. **Dependencies**: Kiểm tra xem media có được sử dụng ở nơi khác không
4. **Recovery**: Có thể khôi phục file từ backup nếu cần

## 🚀 Cách test

1. Upload một file mới vào media
2. Xóa media đó từ admin panel
3. Kiểm tra:
   - File đã biến mất khỏi Supabase Storage
   - Record đã biến mất khỏi database
   - Console log hiển thị quá trình xóa thành công
