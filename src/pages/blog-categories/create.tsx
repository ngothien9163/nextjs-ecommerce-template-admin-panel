import React from 'react';
import { Create, useForm } from '@refinedev/antd';
import { Form, Input, Switch, InputNumber, Card, Row, Col, Divider, Typography } from 'antd';
import { BlogCategory } from '../../lib/supabase';

const { TextArea } = Input;
const { Title } = Typography;

export const BlogCategoryCreate: React.FC = () => {
  const { formProps, saveButtonProps } = useForm<BlogCategory>({
    resource: 'blog_categories',
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Card title="Thông tin cơ bản" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Tên danh mục"
                name="name"
                rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
              >
                <Input placeholder="Nhập tên danh mục blog" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Slug"
                name="slug"
                rules={[{ required: true, message: 'Vui lòng nhập slug!' }]}
              >
                <Input placeholder="ten-danh-muc-blog" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            label="Mô tả"
            name="description"
          >
            <TextArea rows={3} placeholder="Nhập mô tả danh mục" />
          </Form.Item>
        </Card>

        <Card title="Hình ảnh & Giao diện" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="ID hình ảnh đại diện"
                name="featured_image_id"
              >
                <Input placeholder="UUID của hình ảnh" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Màu sắc"
                name="color"
                initialValue="#3B82F6"
              >
                <Input placeholder="#3B82F6" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="Cài đặt" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Thứ tự sắp xếp"
                name="sort_order"
                initialValue={0}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Trạng thái hoạt động"
                name="is_active"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
    </Create>
  );
};

export default BlogCategoryCreate;
