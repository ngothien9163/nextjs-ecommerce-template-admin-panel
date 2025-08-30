import React from 'react';
import { Create, useForm, useSelect } from '@refinedev/antd';
import { Product, Category } from '../../lib/supabase';
import { ProductForm } from '../../components/product-form';

export const ProductCreate: React.FC = () => {
  const { formProps, saveButtonProps } = useForm<Product>();
  const { selectProps: categorySelectProps } = useSelect<Category>({
    resource: 'categories',
    optionLabel: 'name',
    optionValue: 'id',
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <ProductForm 
        form={formProps} 
        categorySelectProps={categorySelectProps}
      />
    </Create>
  );
};
