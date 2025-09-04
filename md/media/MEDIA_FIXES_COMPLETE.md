# 🔧 Media System Fixes - Complete Guide

## 📋 Overview
This document consolidates all media-related fixes including array field issues, URL permission problems, and other technical fixes.

## 🎯 Major Fixes Implemented

### 1. Array Fields Fix

#### **Problem**
Lỗi "malformed array literal" khi submit form tạo media:
```
Có lỗi xảy ra: malformed array literal: "Laptop, Asus, ExpertBook, B1402CBA, EB4202W"
```

#### **Root Cause**
- Database field `meta_keywords` có kiểu dữ liệu `TEXT[]` (array)
- Form gửi dữ liệu dưới dạng string: "Laptop, Asus, ExpertBook"
- PostgreSQL không thể chuyển đổi string thành array tự động

#### **Solution Applied**
```typescript
// Data provider enhancement in src/lib/dataProvider.ts
if (resource === 'media') {
  const arrayFields = ['meta_keywords', 'backup_urls', 'ai_tags', 'visual_search_tags', 'voice_search_phrases'];
  processedVariables = Object.keys(variables).reduce((acc, key) => {
    const value = variables[key];

    // Convert string to array for array fields
    if (arrayFields.includes(key) && typeof value === 'string') {
      acc[key] = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
    } else {
      acc[key] = value;
    }
    return acc;
  }, {} as any);
}
```

#### **Usage**
```typescript
// Input: "laptop, asus, gaming, computer"
// Output: ["laptop", "asus", "gaming", "computer"]
```

#### **Database Storage**
```sql
-- Data stored as proper array
meta_keywords: ["laptop", "asus", "gaming", "computer"]
```

### 2. URL Permission Fix

#### **Problem**
Lỗi `401 Unauthorized` và `permission denied for schema public` khi truy cập `/media`:
- Row Level Security (RLS) chưa được thiết lập đúng
- Service Role Key chưa được cấu hình
- Database permissions bị thiếu

#### **Solution Steps**

##### **Step 1: Run Fix Script**
```bash
# Recommended: Run simple fix script
# Supabase Dashboard > SQL Editor
# Execute: sqls/simple-media-fix.sql
```

##### **Step 2: Alternative Full Setup**
```bash
# For complete RLS setup:
# Execute: sqls/03-setup-rls-policies.sql
```

##### **Step 3: Environment Variables**
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

##### **Step 4: Test Connection**
- Visit: `http://localhost:3000` (Dashboard)
- Check "Supabase Connection Debug" section
- Verify all tests pass

##### **Step 5: Verify Media Access**
- Visit: `http://localhost:3000/media`
- Check: Media list loads successfully
- Check: Create/edit operations work

#### **Data Provider Updates**
```typescript
// Use supabaseAdmin for all media operations
if (resource === 'media') {
  // Bypass RLS issues temporarily
  const { data, error } = await supabaseAdmin
    .from(resource)
    .select('*')
    .limit(10);
}
```

#### **Debug Component**
```typescript
// Real-time connection testing
<DebugConnection
  onTestComplete={(results) => {
    console.log('Connection test results:', results);
  }}
/>
```

### 3. Additional Technical Fixes

#### **Pagination Count Fix**
```typescript
// Add exact count for proper pagination
const { tableProps } = useTable({
  resource: 'media',
  pagination: {
    pageSize: 10,
    // Add this for accurate count
    mode: 'server'
  },
  sorters: {
    initial: [{ field: 'created_at', order: 'desc' }]
  }
});
```

#### **File Upload Path Fix**
```typescript
// Ensure unique file paths
const generateUniqueFileName = (originalName: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2);
  const extension = originalName.split('.').pop();
  return `${timestamp}-${random}.${extension}`;
};

const filePath = `media/${uniqueFileName}`;
```

## 🗄️ Database Schema & Permissions

### RLS Policies
```sql
-- Enable RLS
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Public read access for active media
CREATE POLICY "Public read access for active media" ON media
  FOR SELECT USING (is_active = true);

-- Authenticated users can manage their own media
CREATE POLICY "Users can manage their own media" ON media
  FOR ALL USING (auth.uid() = created_by);

-- Admin full access
CREATE POLICY "Admin full access" ON media
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );
```

### Storage Policies
```sql
-- Storage bucket policies
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

CREATE POLICY "Authenticated upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'media'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Owner delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'media'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

## 🔧 Troubleshooting Guide

### Common Issues & Solutions

#### **Issue 1: 401 Permission Denied**
**Symptoms**: Cannot access media pages, API returns 401
**Solutions**:
1. Check environment variables
2. Run RLS setup script
3. Verify service role key
4. Check Supabase dashboard permissions

#### **Issue 2: Malformed Array Literal**
**Symptoms**: Form submission fails with array conversion error
**Solutions**:
1. Ensure data provider has array field processing
2. Check form input format (comma-separated)
3. Verify database field types
4. Test with simple array values

#### **Issue 3: Upload Fails**
**Symptoms**: Files not uploading to storage
**Solutions**:
1. Check storage bucket exists
2. Verify storage policies
3. Check file size limits
4. Validate file types
5. Test Supabase storage connection

#### **Issue 4: Records Not Created**
**Symptoms**: Files upload but no database records
**Solutions**:
1. Check data provider configuration
2. Verify table permissions
3. Check foreign key constraints
4. Validate data transformation
5. Test database connection

### Debug Checklist

#### **Environment Setup**
- [ ] `VITE_SUPABASE_URL` is set
- [ ] `VITE_SUPABASE_ANON_KEY` is set
- [ ] `VITE_SUPABASE_SERVICE_ROLE_KEY` is set

#### **Database Configuration**
- [ ] Media table exists
- [ ] RLS policies are created
- [ ] Service role has permissions
- [ ] Foreign key constraints are valid

#### **Storage Setup**
- [ ] `media` bucket exists
- [ ] Storage policies are configured
- [ ] Public access is enabled for reading
- [ ] Upload permissions are set

#### **Application Code**
- [ ] Data provider uses correct client
- [ ] Array fields are processed
- [ ] Error handling is implemented
- [ ] File paths are unique

## 📊 Performance Monitoring

### Key Metrics to Monitor
- Upload success rate
- API response times
- Database query performance
- Storage usage
- Error rates by type

### Logging Implementation
```typescript
// Enhanced error logging
const logError = (error: any, context: string) => {
  console.error(`[${context}] Error:`, {
    message: error.message,
    code: error.code,
    details: error.details,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  });
};
```

## 🚀 Best Practices

### Error Prevention
1. **Validate inputs** before submission
2. **Check permissions** before operations
3. **Handle network errors** gracefully
4. **Provide user feedback** for all states
5. **Log errors** for debugging

### Performance Optimization
1. **Use appropriate file sizes** for uploads
2. **Implement lazy loading** for large lists
3. **Cache frequently accessed data**
4. **Optimize database queries**
5. **Monitor memory usage**

### Security Measures
1. **Validate file types** and sizes
2. **Sanitize user inputs**
3. **Use HTTPS** for all connections
4. **Implement rate limiting**
5. **Regular security audits**

## 📈 Maintenance & Updates

### Regular Tasks
- Monitor error logs
- Update dependencies
- Review security policies
- Optimize performance
- Backup configurations

### Version Compatibility
- Test with new Supabase versions
- Update RLS policies as needed
- Verify storage policies
- Check API compatibility

---

*This document consolidates all media fixes from:*
- MEDIA_ARRAY_FIELDS_FIX.md
- MEDIA_URL_FIX_GUIDE.md