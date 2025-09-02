# 🏷️ KeywordsInput Demo - Cách sử dụng với cụm từ dài

## 🎯 **Ví dụ thực tế**

### **Input:**
```
Laptop Asus ExpertBook B1, Gaming Computer, High Performance, Business Laptop, Portable Device
```

### **Output (Array):**
```javascript
[
  "Laptop Asus ExpertBook B1",
  "Gaming Computer", 
  "High Performance",
  "Business Laptop",
  "Portable Device"
]
```

## 📝 **Cách nhập từ khóa**

### **1. Nhập cụm từ dài:**
- ✅ `Laptop Asus ExpertBook B1` → Giữ nguyên cụm từ
- ✅ `Gaming Computer` → Giữ nguyên cụm từ  
- ✅ `High Performance` → Giữ nguyên cụm từ

### **2. Phân cách bằng dấu phẩy:**
- ✅ `Laptop Asus ExpertBook B1, Gaming Computer, High Performance`
- ✅ Mỗi cụm từ sẽ thành một tag riêng biệt

### **3. Không phân cách bằng space:**
- ❌ `Laptop Asus ExpertBook B1 Gaming Computer` → Sẽ thành 1 tag dài
- ✅ `Laptop Asus ExpertBook B1, Gaming Computer` → Sẽ thành 2 tags

## 🎨 **Giao diện**

### **Khi nhập:**
```
┌─────────────────────────────────────────────────────────┐
│ Nhập từ khóa, phân cách bằng dấu phẩy                  │
└─────────────────────────────────────────────────────────┘
```

### **Sau khi nhập:**
```
┌─────────────────────────────────────────────────────────┐
│ [Laptop Asus ExpertBook B1] [Gaming Computer] [High...] │
│ Nhập từ khóa, phân cách bằng dấu phẩy                  │
└─────────────────────────────────────────────────────────┘
```

## 🔧 **Tính năng**

### **1. Auto-complete:**
- Tự động tách khi nhập dấu phẩy `,`
- Giữ nguyên cụm từ có space
- Loại bỏ khoảng trắng thừa

### **2. Validation:**
- Loại bỏ tags rỗng
- Loại bỏ duplicates
- Giới hạn số lượng tags

### **3. UI/UX:**
- Tags có màu xanh
- Có thể xóa từng tag
- Hiển thị tooltip cho tags dài
- Tự động xuống dòng

## 📋 **Ví dụ sử dụng trong Media Form**

### **Khi upload file: `laptop-asus-expertbook-b1.jpg`**

**Auto-fill sẽ tạo:**
```javascript
meta_keywords: [
  "laptop asus expertbook b1",  // Tên file gốc
  "laptop",                     // Từ riêng lẻ
  "asus",                       // Từ riêng lẻ  
  "expertbook"                  // Từ riêng lẻ
]
```

**User có thể chỉnh sửa thành:**
```javascript
meta_keywords: [
  "Laptop Asus ExpertBook B1",
  "Gaming Computer",
  "Business Laptop",
  "High Performance"
]
```

## 🚀 **Lợi ích**

1. **SEO tốt hơn**: Cụm từ dài có ý nghĩa hơn từ đơn lẻ
2. **Dễ sử dụng**: Chỉ cần nhập dấu phẩy để phân cách
3. **Linh hoạt**: Có thể nhập cả cụm từ và từ đơn lẻ
4. **Tự động**: Auto-fill từ tên file
5. **Validation**: Tự động loại bỏ lỗi

## 📝 **Lưu ý**

- **Chỉ dùng dấu phẩy** để phân cách từ khóa
- **Không dùng space** để phân cách (sẽ tạo tag dài)
- **Có thể nhập cụm từ dài** như "Laptop Asus ExpertBook B1"
- **Tự động loại bỏ** duplicates và tags rỗng
- **Giới hạn** số lượng tags theo `maxTags`

---

**🎉 KeywordsInput đã được tối ưu cho cụm từ dài!**
