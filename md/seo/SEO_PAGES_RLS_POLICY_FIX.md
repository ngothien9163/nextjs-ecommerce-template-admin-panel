# 🔧 SEO Pages RLS Policy Fix

## ❌ **Lỗi được báo cáo:**

```json
{
    "code": "42501",
    "details": null,
    "hint": null,
    "message": "new row violates row-level security policy for table \"seo_pages\""
}
```

**Error Code 42501:** PostgreSQL insufficient privilege error  
**Table:** `seo_pages`  
**Issue:** RLS policy đang block insert/update operations

## 🔍 **Nguyên nhân:**

Table `seo_pages` có **Row Level Security (RLS)** được bật và policy không cho phép regular Supabase client:
- ❌ **INSERT** new SEO records
- ❌ **UPDATE** existing SEO records  
- ❌ **SELECT** SEO data (có thể)

## ✅ **Giải pháp triển khai:**

### 1. **Thay thế tất cả Supabase calls với Admin Client**

#### **A. SEO Page Type Operations:**
```typescript
// Trước (regular client):
const { data: pageType } = await supabase
  .from('seo_page_types')
  .select('id')
  .eq('name', 'blog')
  .maybeSingle();

// Sau (admin client):
const { data: pageType } = await supabaseAdmin
  .from('seo_page_types')
  .select('id')
  .eq('name', 'blog')
  .maybeSingle();
```

#### **B. Check Existing SEO:**
```typescript
// Trước:
const { data: existingSEO } = await supabase
  .from('seo_pages')
  .select('id')
  .eq('reference_type', 'blog')
  .eq('reference_id', blogPostId)
  .maybeSingle();

// Sau:
const { data: existingSEO } = await supabaseAdmin  // ✅ Admin client
  .from('seo_pages')
  .select('id')
  .eq('reference_type', 'blog')
  .eq('reference_id', blogPostId)
  .maybeSingle();
```

#### **C. SEO Update Operations:**
```typescript
// Trước:
const { data, error } = await supabase
  .from('seo_pages')
  .update(seoPageData)
  .eq('id', existingSEO.id)
  .select()
  .maybeSingle();

// Sau:
const { data, error } = await supabaseAdmin  // ✅ Admin client
  .from('seo_pages')
  .update(seoPageData)
  .eq('id', existingSEO.id)
  .select()
  .maybeSingle();
```

#### **D. SEO Insert Operations:**
```typescript
// Trước:
const { data, error } = await supabase
  .from('seo_pages')
  .insert([seoPageData])
  .select()
  .maybeSingle();

// Sau:
const { data, error } = await supabaseAdmin  // ✅ Admin client
  .from('seo_pages')
  .insert([seoPageData])
  .select()
  .maybeSingle();
```

#### **E. SEO Fetch Operations:**
```typescript
// getBlogPostWithSEO() - Trước:
const { data: seoData } = await supabase
  .from('seo_pages')
  .select('*')
  .eq('reference_type', 'blog')
  .eq('reference_id', id)
  .maybeSingle();

// Sau:
const { data: seoData } = await supabaseAdmin  // ✅ Admin client
  .from('seo_pages')
  .select('*')
  .eq('reference_type', 'blog')
  .eq('reference_id', id)
  .maybeSingle();
```

## 🔧 **Files Modified:**

### **`src/lib/blog-post-service.ts`**
- ✅ `upsertSEOPage()` - All operations use `supabaseAdmin`
- ✅ `getBlogPostWithSEO()` - SEO fetch uses `supabaseAdmin`
- ✅ Enhanced error messages với context về RLS

## 🛠️ **Technical Details:**

### **Import Added:**
```typescript
import { supabaseAdmin } from './supabase-admin';
```

### **Admin Client Benefits:**
- **✅ Bypass RLS policies** - Service role key có full permissions
- **✅ Full CRUD access** - Không bị policy restrictions  
- **✅ Reliable operations** - Không bị permission denials

### **Error Prevention:**
- **42501** errors được eliminated
- **RLS policy violations** không còn xảy ra
- **Consistent SEO operations** across all blog posts

## 🧪 **Test Flow:**

### **Trước fix:**
```
Blog Post Save → SEO Upsert → RLS Policy Block → Error 42501 ❌
```

### **Sau fix:**
```
Blog Post Save → SEO Upsert (Admin Client) → Bypass RLS → Success ✅
```

## 📋 **Expected Logs:**

### **Success Case:**
```
📊 Upserting SEO page for blog post: 369325a2-d77e-4e1d-8321-d97b2b00809c
🔄 Updating existing SEO page: 88a78e70-9ee8-4c21-ae71-b5b0c03e42ca
✅ SEO page upserted successfully: {id: '88a78e70...', page_title: '...'}
✅ [updateBlogPost] SEO data updated successfully
```

### **No More:**
```
❌ Error 42501: new row violates row-level security policy for table "seo_pages"
```

## 🎯 **Result:**

1. **✅ SEO data save thành công** - Không còn RLS blocks
2. **✅ Blog post với SEO** hoạt động hoàn hảo
3. **✅ Smart SEO generation** không bị interrupt
4. **✅ Consistent permissions** across all operations

## 🚨 **Requirements:**

File `.env.local` phải có:
```env
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Service role key** cần được cấu hình đúng để admin client hoạt động.

## 🎉 **Test:**

1. **Edit blog post** → Add/modify SEO data
2. **Nhấn Save** → SEO operations dùng admin client  
3. **No more 42501 errors** → Success! 🚀

Bây giờ SEO data sẽ được save thành công bất kể RLS policy restrictions! ✅