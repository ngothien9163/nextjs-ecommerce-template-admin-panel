# 🔧 Fix Lỗi "malformed array literal" trong Media Form

## 🐛 **Vấn đề**

Khi nhấn nút Save trong form tạo media tại `http://localhost:5173/media/create`, xuất hiện lỗi:

```
Có lỗi xảy ra: malformed array literal: "Laptop, Asus, ExpertBook, B1402CBA, EB4202W"
```

## 🔍 **Nguyên nhân**

Lỗi này xảy ra vì:

1. **Database Schema**: Field `meta_keywords` trong bảng `media` có kiểu dữ liệu `TEXT[]` (array)
2. **Form Input**: Form gửi dữ liệu dưới dạng string (ví dụ: "Laptop, Asus, ExpertBook")
3. **Mismatch**: PostgreSQL không thể chuyển đổi string thành array tự động

## ✅ **Giải pháp đã áp dụng**

### **1. Cập nhật Data Provider**

Đã thêm xử lý array fields trong `src/lib/dataProvider.ts`:

```typescript
// Xử lý array fields cho media resource
if (resource === 'media') {
  const arrayFields = ['meta_keywords', 'backup_urls', 'ai_tags', 'visual_search_tags', 'voice_search_phrases'];
  processedVariables = Object.keys(variables).reduce((acc, key) => {
    const value = variables[key];
    
    // Xử lý các field có kiểu TEXT[] - chuyển từ string thành array
    if (arrayFields.includes(key) && typeof value === 'string') {
      acc[key] = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
    } else {
      acc[key] = value;
    }
    return acc;
  }, {} as any);
}
```

### **2. Cập nhật Media Create Form**

Đã cập nhật `src/pages/media/create.tsx` để sử dụng data provider thay vì gọi Supabase trực tiếp.

### **3. Các Array Fields được xử lý**

- `meta_keywords` - Từ khóa SEO
- `backup_urls` - URL backup của file
- `ai_tags` - AI-generated tags
- `visual_search_tags` - Tags cho visual search
- `voice_search_phrases` - Voice search phrases

## 🧪 **Test kết quả**

Đã test thành công:

```javascript
// Input: "laptop, asus, gaming, test"
// Output: ["laptop", "asus", "gaming", "test"]
```

## 📋 **Cách sử dụng**

### **Trong Form:**

1. **Meta Keywords**: Nhập từ khóa phân cách bằng dấu phẩy
   ```
   Ví dụ: laptop, asus, gaming, computer
   ```

2. **Các field khác**: Tương tự, phân cách bằng dấu phẩy
   ```
   Ví dụ: tag1, tag2, tag3
   ```

### **Trong Database:**

Dữ liệu sẽ được lưu dưới dạng array:
```sql
meta_keywords: ["laptop", "asus", "gaming", "computer"]
```

## 🔄 **Tự động xử lý**

- **Create Form**: ✅ Đã fix
- **Edit Form**: ✅ Đã fix (thông qua data provider)
- **Data Provider**: ✅ Đã xử lý cho cả create và update

## 🎯 **Lợi ích**

1. **Tương thích**: Form hoạt động bình thường với array fields
2. **Linh hoạt**: User có thể nhập string, hệ thống tự chuyển thành array
3. **Nhất quán**: Xử lý thống nhất cho cả create và edit
4. **Mở rộng**: Dễ dàng thêm array fields mới

## 🚀 **Kết quả**

- ✅ Form tạo media hoạt động bình thường
- ✅ Không còn lỗi "malformed array literal"
- ✅ Dữ liệu được lưu đúng định dạng array
- ✅ Edit form cũng hoạt động tương tự

## 📝 **Lưu ý**

- Khi nhập từ khóa, sử dụng dấu phẩy để phân cách
- Hệ thống tự động loại bỏ khoảng trắng thừa
- Các từ khóa rỗng sẽ bị loại bỏ
- Không cần thay đổi cách sử dụng form

---

**🎉 Fix hoàn tất! Form media đã hoạt động bình thường.**
