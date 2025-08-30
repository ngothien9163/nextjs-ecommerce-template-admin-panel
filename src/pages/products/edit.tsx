import React from 'react';
import { Edit, useForm, useSelect } from '@refinedev/antd';
import { Product, Category } from '../../lib/supabase';
import { ProductForm } from '../../components/product-form';

export const ProductEdit = () => {
  const { formProps, saveButtonProps, queryResult } = useForm<Product>();
  
  const { selectProps: categorySelectProps } = useSelect<Category>({
    resource: 'categories',
    optionLabel: 'name',
    optionValue: 'id',
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <ProductForm 
        form={formProps} 
        isEdit={true}
        categorySelectProps={categorySelectProps}
      />
    </Edit>
  );
};
