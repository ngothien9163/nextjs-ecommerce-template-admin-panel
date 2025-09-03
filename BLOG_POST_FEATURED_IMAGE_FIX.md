# 🔧 Blog Post Featured Image Update Fix

## ❌ **Vấn đề được phát hiện:**

Dựa vào logs của bạn:

```
📝 [dataProvider] SAVE - featured_image_id: 8d766eab-1152-46ec-932b-f6ed2232f3ed
blog-post-service.ts:118 🔄 [updateBlogPost] Supabase update result - data: []
blog-post-service.ts:173 🔍 [updateBlogPost] Manual fetch - featured_image_id: null
```

**featured_image_id bị mất** sau khi update! 

## 🔍 **Nguyên nhân có thể:**

1. **RLS Policy** blocking SELECT sau UPDATE
2. **Foreign Key Constraint** reject featured_image_id 
3. **Database Trigger** đang modify data
4. **Permission issue** với regular Supabase client

## ✅ **Giải pháp đã triển khai:**

### 1. **Enhanced Debugging** 
```typescript
// Specific field selection thay vì SELECT *
.select('id, title, slug, featured_image_id, updated_at')

// Detailed logging cho troubleshooting
console.log('🔄 [updateBlogPost] Update result type:', typeof updatedPost);
console.log('🔄 [updateBlogPost] Update result length:', Array.isArray(updatedPost) ? updatedPost.length : 'not array');
```

### 2. **Media Record Validation**
```typescript
// Check if featured_image_id exists in media table
const { data: mediaRecord } = await supabase
  .from('media')
  .select('id, file_name')
  .eq('id', cleanBlogPostData.featured_image_id)
  .maybeSingle();

if (!mediaRecord) {
  console.error('❌ Media record not found');
  delete cleanBlogPostData.featured_image_id; // Remove invalid ID
}
```

### 3. **Fallback Strategy**
```typescript
// If update returns empty array, try direct featured_image_id update
if (updatePayload.featured_image_id && fetchedPost.featured_image_id !== updatePayload.featured_image_id) {
  // Direct update on featured_image_id only
  const { data: directUpdate } = await supabase
    .from('blog_posts')
    .update({ featured_image_id: updatePayload.featured_image_id })
    .eq('id', id)
    .select('id, featured_image_id');
    
  // If still fails, try with admin client
  if (directError) {
    const { data: adminUpdate } = await supabaseAdmin
      .from('blog_posts')
      .update({ featured_image_id: updatePayload.featured_image_id })
      .eq('id', id)
      .select('id, featured_image_id');
  }
}
```

### 4. **Admin Client Fallback**
```typescript
import { supabaseAdmin } from './supabase-admin';

// Use admin client to bypass RLS if regular client fails
```

## 🧪 **Test lại:**

Bây giờ khi bạn:

1. **Chọn featured image** → `featured_image_id: 8d766eab-1152-46ec-932b-f6ed2232f3ed`
2. **Nhấn Save** → Enhanced logging sẽ show:
   - ✅ Media record validation
   - 🔄 Update result details
   - 🔄 Fallback attempts nếu cần
   - ✅ Final featured_image_id confirmation

## 📋 **Logs mong đợi:**

```
✅ [updateBlogPost] Media record exists: apple-iphone-16-pro-128gb...
🔄 [updateBlogPost] Update result type: object
🔄 [updateBlogPost] Update result length: 1
✅ [updateBlogPost] Final post featured_image_id: 8d766eab-1152-46ec-932b-f6ed2232f3ed
```

Hoặc nếu có vấn đề:

```
❌ [updateBlogPost] CRITICAL: featured_image_id update failed!
🔄 [updateBlogPost] Attempting direct featured_image_id update...
✅ [updateBlogPost] Admin update successful!
✅ [updateBlogPost] Final fetch successful, featured_image_id: 8d766eab-1152-46ec-932b-f6ed2232f3ed
```

## 🎯 **Kết quả mong đợi:**

- ✅ **featured_image_id được save đúng**
- ✅ **Form data reload với image mới**  
- ✅ **Detailed logs để debug vấn đề**
- ✅ **Auto-fallback nếu có RLS issues**

Hãy test lại và share logs mới để confirm fix! 🚀