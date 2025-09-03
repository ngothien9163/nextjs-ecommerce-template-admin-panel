import React from 'react';
import { Edit, useForm, useSelect } from '@refinedev/antd';
import { BlogPost, BlogCategory, Profile } from '../../lib/supabase';
import { BlogPostForm } from '../../components/blog-post-form';
import { blogPostService, BlogPostWithSEO } from '../../lib/blog-post-service';
import { SupabaseConfigAlert } from '../../components/supabase-config-alert';
import { message } from 'antd';

export const BlogPostEdit: React.FC = () => {
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
    // Thêm errorNotification để xử lý lỗi tốt hơn
    errorNotification: (error) => {
      console.error('❌ Form error notification:', error);
      return {
        message: 'Lỗi cập nhật bài viết',
        description: error?.message || 'Có lỗi xảy ra khi cập nhật bài viết. Vui lòng thử lại.',
        type: 'error'
      };
    }
  });
  
  // Log data for debugging
  console.log('🔍 BlogPostEdit queryResult:', queryResult);
  console.log('🔍 BlogPostEdit data:', queryResult?.data);
  console.log('🔍 BlogPostEdit isLoading:', queryResult?.isLoading);
  console.log('🔍 BlogPostEdit error:', queryResult?.error);
  
  const { selectProps: categorySelectProps } = useSelect<BlogCategory>({
    resource: 'blog_categories',
    optionLabel: 'name',
    optionValue: 'id',
  });
  const { selectProps: authorSelectProps } = useSelect<Profile>({
    resource: 'profiles',
    optionLabel: (item) => `${item.first_name || ''} ${item.last_name || ''}`.trim() || item.email || 'User',
    optionValue: 'id',
  });

  // Show loading state
  if (queryResult?.isLoading) {
    return (
      <Edit>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          Đang tải dữ liệu...
        </div>
      </Edit>
    );
  }

  // Show error state
  if (queryResult?.error) {
    return (
      <Edit>
        <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
          Lỗi: {queryResult.error.message}
        </div>
      </Edit>
    );
  }

  return (
    <>
      <SupabaseConfigAlert />
      <Edit 
        saveButtonProps={saveButtonProps}
        headerProps={{
          extra: queryResult?.data?.data?.seo_data ? (
            <div style={{ 
              background: '#f6ffed', 
              border: '1px solid #b7eb8f', 
              borderRadius: '6px', 
              padding: '8px 12px',
              color: '#52c41a',
              fontSize: '12px',
              fontWeight: 500
            }}>
              ✅ SEO được cấu hình (Score: {queryResult.data.data.seo_data.seo_score || 0}/100)
            </div>
          ) : (
            <div style={{ 
              background: '#fff7e6', 
              border: '1px solid #ffd591', 
              borderRadius: '6px', 
              padding: '8px 12px',
              color: '#fa8c16',
              fontSize: '12px',
              fontWeight: 500
            }}>
              ⚠️ Chưa cấu hình SEO
            </div>
          )
        }}
      >
        <BlogPostForm 
          form={formProps} 
          isEdit={true}
          categorySelectProps={categorySelectProps}
          authorSelectProps={authorSelectProps}
          initialData={queryResult?.data?.data}
        />
      </Edit>
    </>
  );
};

export default BlogPostEdit;
