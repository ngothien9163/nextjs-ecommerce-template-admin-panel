# 📝 Hướng dẫn thay đổi Metadata Configuration - SINGLE FILE

## 🎯 Tổng quan
Hệ thống metadata đã được **siêu đơn giản hóa** với **chỉ 1 file duy nhất**. Không còn phức tạp với nhiều file khác nhau!

## 📝 HIỂU VỀ 2 LOẠI METADATA

### 🏢 **COMPANY METADATA** - Giống nhau cho tất cả ảnh:
- `copyright`: Bản quyền công ty
- `creator_artist`: Tên team/phòng ban
- `company_name`: Tên công ty
- `website_url`, `email_contact`: Liên hệ công ty
- `software`: Phần mềm xử lý

### 🖼️ **IMAGE-SPECIFIC METADATA** - Khác nhau cho từng ảnh:
- `caption_description`: Mô tả cụ thể của ảnh (lấy từ form `alt_text`, `title`)
- `keywords`: Keywords SEO cụ thể (🐈 lấy từ form `meta_keywords`)
- `credit`: Nguồn/credit riêng của ảnh

### ⚙️ **CÁCH HỆ THỐNG HOẠT ĐỘNG**:
1. **UNIFIED_METADATA** chỉ chứa **company info** + **fallback values**
2. Khi upload ảnh, hệ thống tự động **extract metadata từ form**:
   - `alt_text` → `caption_description`
   - `meta_keywords` → `keywords`
   - `title` → `description`
3. **Override** fallback values với metadata cụ thể của ảnh
4. **Kết quả**: Mỗi ảnh có company info giống nhau + content info riêng

---

## 📂 File duy nhất cần quan tâm

### **File CHÍNH và DUY NHẤT**: `src/config/metadata-constants.ts`

Đây là **file duy nhất** bạn cần chỉnh sửa để thay đổi tất cả metadata cho mọi môi trường.

---

## 🛠️ Cấu hình chính - UNIFIED_METADATA

### **UNIFIED_METADATA** (Dòng 23-37) - MAIN CONFIG
**Dùng cho**: Company info + fallback cho tất cả ảnh
```typescript
export const UNIFIED_METADATA: MetadataConfig = {
  // Company Information - SỬA THÔNG TIN CÔNG TY TẠI ĐÂY
  copyright: "© 2024 Your Company Name - All Rights Reserved",     // ← Đổi ở đây
  creator_artist: "Your Company Design Team",                      // ← Đổi ở đây
  credit: "Your Company Marketing Department",                     // ← Đổi ở đây
  company_name: "Your Company Name",                               // ← Đổi ở đây
  website_url: "https://yourcompany.com",                          // ← Đổi ở đây
  email_contact: "contact@yourcompany.com",                        // ← Đổi ở đây
  contact_url: "https://yourcompany.com/contact",                  // ← Đổi ở đây
  
  // Technical Information
  software: "Professional Image Processing Suite v2.0",           // ← Đổi ở đây
  user_comment: "Professionally processed product image",          // ← Đổi ở đây
  
  // FALLBACK - Chỉ dùng khi ảnh không có metadata riêng
  caption_description: "[FALLBACK] Image processed by company system", // Sẽ được override
  keywords: ["company", "professional", "quality"]                     // Sẽ được override
};
```

⚠️ **LƯờI CHO TÍNH NĂNG SMART METADATA**:
- `caption_description` và `keywords` trong config này chỉ là **FALLBACK**
- **Thực tế** mỗi ảnh sẽ dùng metadata từ form upload:
  - Alt text → Caption description  
  - Meta keywords → Keywords
  - Title → Description

---

## 📝 VIỆT DỤ MIỆU THọA CÁCH HOẠT ĐỘNG

### **Trường hợp 1: Upload ảnh iPhone**
```
📋 Form upload:
- Alt text: "iPhone 15 Pro Max màu titan tự nhiên"
- Title: "iPhone 15 Pro Max - Premium Smartphone"
- Meta keywords: "iphone, smartphone, apple, premium, titanium"

🏭 Kết quả metadata cuối:
- copyright: "© 2024 Your Company Name" (từ UNIFIED)
- creator_artist: "Your Company Design Team" (từ UNIFIED)
- website_url: "https://yourcompany.com" (từ UNIFIED)
- caption_description: "iPhone 15 Pro Max màu titan tự nhiên" (từ form alt_text)
- keywords: ["iphone", "smartphone", "apple", "premium", "titanium"] (từ form meta_keywords)
```

### **Trường hợp 2: Upload ảnh không có metadata**
```
📋 Form upload: (trống, không điền gì)

🏭 Kết quả metadata cuối:
- copyright: "© 2024 Your Company Name" (từ UNIFIED)
- creator_artist: "Your Company Design Team" (từ UNIFIED) 
- website_url: "https://yourcompany.com" (từ UNIFIED)
- caption_description: "[FALLBACK] Image processed by company system" (fallback từ UNIFIED)
- keywords: ["company", "professional", "quality"] (fallback từ UNIFIED)
```

### **🔑 Nguyên tắc quản lý**:
- **Company info**: Chỉ sửa 1 lần trong UNIFIED_METADATA
- **Image info**: Tự động từ form, không cần config thủ công
- **Fallback**: An toàn khi thiếu thông tin

---

## 🎨 Template variations - Kế thừa từ UNIFIED_METADATA

### **BLOG_METADATA** (Dòng 45-51)
```typescript
export const BLOG_METADATA: MetadataConfig = {
  ...UNIFIED_METADATA,  // Kế thừa tất cả từ UNIFIED
  caption_description: "Blog article illustration and content",     // ← Override
  keywords: ["blog", "article", "content", "illustration", "information"], // ← Override
  user_comment: "Blog content image",                              // ← Override  
  credit: "Blog Editorial Team"                                     // ← Override
};
```

### **HERO_METADATA** (Dòng 53-59)
```typescript
export const HERO_METADATA: MetadataConfig = {
  ...UNIFIED_METADATA,  // Kế thừa tất cả từ UNIFIED
  caption_description: "Hero banner showcasing premium products",  // ← Override
  keywords: ["hero", "banner", "marketing", "brand", "showcase"],  // ← Override
  user_comment: "Marketing hero image optimized for web",          // ← Override
  credit: "Brand Marketing Department"                             // ← Override
};
```

### **PROFESSIONAL_METADATA** (Dòng 61-67)
```typescript
export const PROFESSIONAL_METADATA: MetadataConfig = {
  ...UNIFIED_METADATA,  // Kế thừa tất cả từ UNIFIED
  caption_description: "Professional grade product photography",   // ← Override
  keywords: ["professional", "studio", "certified", "premium", "commercial"], // ← Override
  user_comment: "Studio-grade professional image",                // ← Override
  credit: "Certified Professional Photographers"                  // ← Override
};
```

---

## 🎯 Hướng dẫn thay đổi - SIÊU ĐƠN GIẢN!

### **Bước 1: Mở file** 
```
src/config/metadata-constants.ts
```

### **Bước 2: Tìm UNIFIED_METADATA (dòng 17-31)**
### **Bước 3: Sửa thông tin công ty bạn**

#### Ví dụ: Công ty ABC Technology
```typescript
export const UNIFIED_METADATA: MetadataConfig = {
  // Company Information - SỬA ở ĐÂY
  copyright: "© 2024 ABC Technology - All Rights Reserved",
  creator_artist: "ABC Technology Design Team", 
  credit: "ABC Technology Marketing Department",
  company_name: "ABC Technology",
  website_url: "https://abctech.com",
  email_contact: "contact@abctech.com",
  contact_url: "https://abctech.com/contact",
  
  // Technical Information - CÓ THỂ GIỮNG NGUYÊN
  software: "ABC Image Processing Suite v3.0",
  user_comment: "Professionally processed by ABC Technology",
  
  // Content Information - TÙY CHỌN SỬA
  caption_description: "Premium product images by ABC Technology",
  keywords: ["abc technology", "premium", "innovation", "technology", "product"]
};
```

### **Xong! 🎉**
Tất cả ảnh mới sẽ dùng thông tin cập nhật!

---

## ⚙️ Cách hoạt động tự động

### **Development (npm run dev)**:
- Dùng: `UNIFIED_METADATA` + `DEV_OVERRIDES`
- Tự động thêm `[DEV]` prefix
- URL localhost

### **Production (build + deploy)**:
- Dùng: `UNIFIED_METADATA` 
- Thông tin production đầy đủ

---

## 🎨 Thêm template mới (Tùy chọn)

### Nếu muốn tạo template riêng:
```typescript
// Thêm sau dòng 67
export const MY_COMPANY_METADATA: MetadataConfig = {
  ...UNIFIED_METADATA,  // Kế thừa tất cả
  caption_description: "Custom processed images",     // Override
  keywords: ["my company", "custom", "professional"], // Override
  user_comment: "Processed by My Company",            // Override
};

// Cập nhật METADATA_TEMPLATES (dòng 70-76)
export const METADATA_TEMPLATES = {
  default: UNIFIED_METADATA,
  production: UNIFIED_METADATA,
  blog: BLOG_METADATA,
  hero: HERO_METADATA,
  professional: PROFESSIONAL_METADATA,
  mycompany: MY_COMPANY_METADATA  // ← Thêm dòng này
} as const;
```

---

## 📊 Metadata fields chi tiết

| Field | Mô tả | Ví dụ |
|-------|--------|-------|
| `copyright` | Bản quyền | `© 2024 Company Name` |
| `creator_artist` | Người/team tạo | `Professional Team` |
| `credit` | Credit/nguồn | `Company Marketing Dept` |
| `caption_description` | Mô tả ảnh | `High-quality product photo` |
| `contact_url` | URL liên hệ | `https://company.com/contact` |
| `keywords` | Keywords SEO | `["product", "quality", "professional"]` |
| `software` | Phần mềm tạo ảnh | `Image Processing Suite v2.0` |
| `user_comment` | Comment | `Professionally processed` |
| `company_name` | Tên công ty | `Your Company Name` |
| `website_url` | Website chính | `https://company.com` |
| `email_contact` | Email liên hệ | `contact@company.com` |

---

## ⚠️ Lưu ý quan trọng

### ✅ **Do's**:
- Chỉ sửa trong `UNIFIED_METADATA` cho config chung
- Sửa trong template cụ thể nếu muốn override
- Test sau khi thay đổi bằng cách upload ảnh mới
- Backup file trước khi chỉnh sửa lớn

### ❌ **Don'ts**:
- Không sửa trong `metadata-config.ts` (file này chỉ xử lý logic)
- Không dùng environment variables nữa (đã bỏ)
- Không hardcode trong các component khác
- Không tạo nhiều file config

---

## 🔍 Debug & Test

### Kiểm tra config hiện tại:
```javascript
// Paste vào browser console
import { getMetadataByEnvironment } from './src/config/metadata-constants';
console.log('Current config:', getMetadataByEnvironment());
```

### Test template:
```javascript
// Test template cụ thể
import { getMetadataByTemplate } from './src/config/metadata-constants';
console.log('Hero config:', getMetadataByTemplate('hero'));
```

---

## 🎯 Tóm tắt - SIÊU ĐƠN GIẢN & THÔNG MINH!

**1 file, 2 loại metadata, tự động quản lý**: `src/config/metadata-constants.ts`

### 🏢 **COMPANY METADATA** - Sửa 1 lần, áp dụng cho tất cả:
- ✅ **UNIFIED_METADATA**: Chứa thông tin công ty chung
- ✅ **Tự động apply**: Cho tất cả ảnh, tất cả environment
- ✅ **Dev override**: Tự động thêm `[DEV]` khi development

### 🖼️ **IMAGE-SPECIFIC METADATA** - Tự động từ form:
- ✅ **Smart extraction**: Tự động lấy từ alt_text, title, meta_keywords
- ✅ **Per-image unique**: Mỗi ảnh có description và keywords riêng
- ✅ **Fallback safe**: Dùng default nếu thiếu thông tin

### 👉 **Workflow cực kỳ đơn giản**:
1. **Lần đầu setup**: Sửa UNIFIED_METADATA (company info)
2. **Upload ảnh**: Điền form bình thường (alt_text, keywords)
3. **Auto magic**: Hệ thống tự động combine company + image metadata
4. **Kết quả**: Ảnh có metadata hoàn hảo!

**Bạn KHOONG cần làm gì thêm! Hệ thống tự quản lý!** 🎉✨

---

## 🔍 Debug giá trị hiện tại

### Kiểm tra company config:
```javascript
import { UNIFIED_METADATA } from './src/config/metadata-constants';
console.log('Company info:', UNIFIED_METADATA);
```

### Kiểm tra metadata của 1 ảnh cụ thể:
- Xem console log khi upload ảnh
- Tìm dòng `🎨 Processing applied: Metadata: Updated with custom fields`

**Happy smart metadata!** 🚀✨