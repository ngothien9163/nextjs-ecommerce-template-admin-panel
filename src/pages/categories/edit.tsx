import React from 'react';
import { Edit, useForm } from '@refinedev/antd';
import { Form, Input, Switch, InputNumber, Select } from 'antd';
import { Category } from '../../lib/supabase';

const { TextArea } = Input;

export const CategoryEdit: React.FC = () => {
  const { formProps, saveButtonProps, queryResult } = useForm<Category>();

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Tên danh mục"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
        >
          <Input placeholder="Nhập tên danh mục" />
        </Form.Item>

        <Form.Item
          label="Slug"
          name="slug"
          rules={[{ required: true, message: 'Vui lòng nhập slug!' }]}
        >
          <Input placeholder="ten-danh-muc" />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
        >
          <TextArea rows={4} placeholder="Nhập mô tả danh mục" />
        </Form.Item>

        <Form.Item
          label="Danh mục cha"
          name="parent_id"
        >
          <Select
            placeholder="Chọn danh mục cha (nếu có)"
            allowClear
            showSearch
            optionFilterProp="children"
          >
            {/* Categories will be loaded here */}
          </Select>
        </Form.Item>

        <Form.Item
          label="URL hình ảnh"
          name="image_url"
        >
          <Input placeholder="https://example.com/image.jpg" />
        </Form.Item>

        <Form.Item
          label="Thứ tự sắp xếp"
          name="sort_order"
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Tiêu đề SEO"
          name="meta_title"
        >
          <Input placeholder="Tiêu đề SEO cho danh mục" />
        </Form.Item>

        <Form.Item
          label="Mô tả SEO"
          name="meta_description"
        >
          <TextArea rows={3} placeholder="Mô tả SEO cho danh mục" />
        </Form.Item>

        <Form.Item
          label="Trạng thái hoạt động"
          name="is_active"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Edit>
  );
};
