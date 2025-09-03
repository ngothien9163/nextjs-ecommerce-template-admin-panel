import React, { useState } from 'react';
import { Edit, useForm, useSelect } from '@refinedev/antd';
import { BlogPost, BlogCategory, Profile } from '../../lib/supabase';
import { BlogPostForm } from '../../components/blog-post-form';
import { blogPostService, BlogPostWithSEO } from '../../lib/blog-post-service';
import { SupabaseConfigAlert } from '../../components/supabase-config-alert';
import { message } from 'antd';

// Add CSS animations
const styles = `
@keyframes slideInDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
`;

// Inject styles
if (typeof document !== 'undefined' && !document.querySelector('#blog-edit-animations')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'blog-edit-animations';
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export const BlogPostEdit: React.FC = () => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  const { formProps, saveButtonProps, queryResult, id, query } = useForm<BlogPostWithSEO>({
    mutationMode: 'pessimistic',
    redirect: false, // ⚠️ Không redirect sau khi save thành công
    onMutationSuccess: (data, variables, context) => {
      console.log('✅ [BlogPostEdit] SAVE SUCCESS - Blog post updated successfully!');
      console.log('✅ [BlogPostEdit] SAVE SUCCESS - Updated data:', data);
      
      // Hiển thị success message
      message.success('🎉 Cập nhật bài viết thành công!');
      setShowSuccessMessage(true);

      // Reload data để lấy thông tin mới nhất
      console.log('🔄 [BlogPostEdit] RELOAD - Refreshing data on edit page...');
      
      // Sử dụng queryResult.refetch() thay vì query.refetch()
      if (queryResult?.refetch) {
        queryResult.refetch().then(() => {
          console.log('✅ [BlogPostEdit] RELOAD - Data refreshed successfully!');
        }).catch((error) => {
          console.error('❌ [BlogPostEdit] RELOAD - Error refreshing data:', error);
        });
      }

      // Ẩn success message sau 4 giây
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 4000);
    },
    onMutationError: (error, variables, context) => {
      console.error('❌ [BlogPostEdit] SAVE ERROR - Update failed:', error);
      console.error('❌ [BlogPostEdit] SAVE ERROR - Variables:', variables);
      
      const errorMessage = error?.message || 'Lỗi không xác định';
      message.error(`❌ Lỗi cập nhật bài viết: ${errorMessage}`);
    },
    errorNotification: (error) => {
      console.error('❌ [BlogPostEdit] ERROR NOTIFICATION:', error);
      return {
        message: 'Lỗi cập nhật bài viết',
        description: error?.message || 'Có lỗi xảy ra khi cập nhật bài viết. Vui lòng thử lại.',
        type: 'error'
      };
    }
  });

  // Only log essential data for save debugging
  
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
          extra: [
            // SEO status
            queryResult?.data?.data?.seo_data ? (
              <div key="seo" style={{
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
              <div key="seo" style={{
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
            ),
            // Success message after save
            showSuccessMessage && (
              <div key="success" style={{
                background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                border: '1px solid #52c41a',
                borderRadius: '6px',
                padding: '10px 16px',
                color: 'white',
                fontSize: '13px',
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(82, 196, 26, 0.3)',
                animation: 'slideInDown 0.3s ease-out'
              }}>
                ✅ Dữ liệu đã được cập nhật & tải lại thành công!
              </div>
            )
          ].filter(Boolean)
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
