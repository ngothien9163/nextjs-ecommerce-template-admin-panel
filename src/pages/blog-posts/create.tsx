import React from 'react';
import { Create, useForm, useSelect } from '@refinedev/antd';
import { BlogPost, BlogCategory, Profile } from '../../lib/supabase';
import { BlogPostForm } from '../../components/blog-post-form';

export const BlogPostCreate: React.FC = () => {
  const { formProps, saveButtonProps } = useForm<BlogPost>();
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
    <Create saveButtonProps={saveButtonProps}>
      <BlogPostForm 
        form={formProps} 
        categorySelectProps={categorySelectProps}
        authorSelectProps={authorSelectProps}
      />
    </Create>
  );
};

export default BlogPostCreate;
