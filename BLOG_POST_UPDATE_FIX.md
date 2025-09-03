# 🔧 Blog Post Update Error Fix

## ❌ Lỗi gốc
```
Lỗi cập nhật bài viết: Failed to update blog post: Cannot coerce the result to a single JSON object
```

## 🔍 Nguyên nhân
Lỗi "Cannot coerce the result to a single JSON object" xảy ra khi Supabase trả về nhiều hơn 1 object hoặc không trả về object nào từ query `.single()`. Có thể do:

1. **Dữ liệu trùng lặp**: Multiple records match the condition
2. **Null values**: Passing null/undefined values to update query
3. **Upsert conflicts**: Conflict trong upsert operation của SEO data
4. **Missing data**: Không có record nào để update

## ✅ Giải pháp đã áp dụng

### 1. **Cải thiện `updateBlogPost()` function**

```typescript
// Trước (có thể gây lỗi):
const { data: blogPost, error: blogError } = await supabase
  .from('blog_posts')
  .update(blogPostData)  // ❌ Có thể chứa null/undefined
  .eq('id', id)
  .select()
  .single();

// Sau (đã fix):
// 1. Clean dữ liệu trước khi update
const cleanBlogPostData = Object.keys(blogPostData).reduce((acc, key) => {
  if (blogPostData[key] !== null && blogPostData[key] !== undefined) {
    acc[key] = blogPostData[key];
  }
  return acc;
}, {} as any);

// 2. Thêm logging chi tiết
console.log('🧹 Cleaned blog post data:', cleanBlogPostData);

const { data: blogPost, error: blogError } = await supabase
  .from('blog_posts')
  .update(cleanBlogPostData)  // ✅ Chỉ update fields hợp lệ
  .eq('id', id)
  .select()
  .single();

// 3. Better error handling
if (blogError) {
  console.error('❌ Blog post update error:', blogError);
  throw new Error(`Failed to update blog post: ${blogError.message}`);
}

if (!blogPost) {
  throw new Error('No blog post returned after update');
}
```

### 2. **Sửa `upsertSEOPage()` để tránh conflicts**

```typescript
// Trước (dùng upsert - có thể gây conflict):
const { data, error } = await supabase
  .from('seo_pages')
  .upsert([seoPageData], {
    onConflict: 'reference_type,reference_id'  // ❌ Có thể không hoạt động đúng
  })
  .select()
  .single();

// Sau (tách riêng update/insert):
// 1. Check existing record
const { data: existingSEO } = await supabase
  .from('seo_pages')
  .select('id')
  .eq('reference_type', 'blog')
  .eq('reference_id', blogPostId)
  .single();

let result;
if (existingSEO) {
  // Update existing ✅
  const { data, error } = await supabase
    .from('seo_pages')
    .update(seoPageData)
    .eq('reference_type', 'blog')
    .eq('reference_id', blogPostId)
    .select()
    .single();
} else {
  // Insert new ✅  
  const { data, error } = await supabase
    .from('seo_pages')
    .insert([seoPageData])
    .select()
    .single();
}
```

### 3. **Enhanced Error Handling trong DataProvider**

```typescript
// Trước:
throw new Error(error.message);

// Sau:
console.log('📝 Blog post data:', blogPostData);
console.log('📊 SEO data:', seo_data);

const data = await blogPostService.updateBlogPost(id, blogPostData, seo_data);
console.log('✅ Blog post updated successfully:', data);
return { data };

// Better error handling:
throw new Error(error.message || 'Failed to update blog post');
```

### 4. **Improved Error Notifications trong BlogPostEdit**

```typescript
const { formProps, saveButtonProps, queryResult, id } = useForm<BlogPostWithSEO>({
  mutationMode: 'pessimistic',
  onMutationSuccess: (data) => {
    console.log('✅ Blog post updated successfully:', data);
    message.success('Cập nhật bài viết thành công!');
  },
  onMutationError: (error) => {
    console.error('❌ Blog post update error:', error);
    const errorMessage = error?.message || 'Lỗi không xác định';
    message.error(`Lỗi cập nhật bài viết: ${errorMessage}`);
  },
  // ✅ Thêm errorNotification để xử lý lỗi tốt hơn
  errorNotification: (error) => {
    console.error('❌ Form error notification:', error);
    return {
      message: 'Lỗi cập nhật bài viết',
      description: error?.message || 'Có lỗi xảy ra khi cập nhật bài viết. Vui lòng thử lại.',
      type: 'error'
    };
  }
});
```

## 🔍 Debug Tools Added

### Console Logging
- `🧹 Cleaned blog post data`: Dữ liệu sau khi clean
- `📊 SEO page data`: Dữ liệu SEO sẽ được lưu  
- `✅ Blog post updated successfully`: Kết quả thành công
- `❌ Error details`: Chi tiết lỗi nếu có

### Error Messages
- Specific error messages cho từng bước
- Fallback error handling cho unknown errors
- User-friendly notifications

## 🎯 Kết quả

### ✅ Đã sửa:
1. **Null/undefined data** không còn được gửi đến database
2. **Upsert conflicts** được giải quyết bằng explicit update/insert
3. **Better error tracking** với detailed console logs
4. **User experience** được cải thiện với error notifications rõ ràng

### 🧪 Test Cases:
1. **Update blog post only** (không có SEO data) ✅
2. **Update blog post + SEO data** (có SEO data) ✅  
3. **Update với null fields** (sẽ bị filter ra) ✅
4. **Error handling** (hiển thị lỗi rõ ràng) ✅

## 📝 Files Updated
- `src/lib/blog-post-service.ts` - Fix updateBlogPost và upsertSEOPage
- `src/lib/dataProvider.ts` - Enhanced error handling
- `src/pages/blog-posts/edit.tsx` - Better error notifications

Lỗi "Cannot coerce the result to a single JSON object" đã được fix! 🎉