import React from 'react';
import { Edit, useForm, useSelect } from '@refinedev/antd';
import { BlogPost, BlogCategory, Profile } from '../../lib/supabase';
import { BlogPostForm } from '../../components/blog-post-form';

export const BlogPostEdit: React.FC = () => {
  const { formProps, saveButtonProps, queryResult } = useForm<BlogPost>();
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

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <BlogPostForm 
        form={formProps} 
        isEdit={true}
        categorySelectProps={categorySelectProps}
        authorSelectProps={authorSelectProps}
      />
    </Edit>
  );
};

export default BlogPostEdit;
