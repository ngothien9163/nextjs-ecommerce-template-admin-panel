import React from 'react';
import { Edit, useForm, useSelect } from '@refinedev/antd';
import MDEditor from '@uiw/react-md-editor';
import { Form, Input, Select, Switch, InputNumber, Card, Row, Col, Divider, Typography, DatePicker } from 'antd';
import { BlogPost, BlogCategory, Profile } from '../../lib/supabase';

const { TextArea } = Input;
const { Title } = Typography;

export const BlogPostEdit: React.FC = () => {
  const { formProps, saveButtonProps, queryResult, formLoading } = useForm<BlogPost>({
    resource: 'blog_posts',
  });

  const { data: blogPostData } = queryResult || {};

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
    <Edit saveButtonProps={saveButtonProps} isLoading={formLoading}>
      <Form {...formProps} layout="vertical">
        <Card title="Thông tin cơ bản" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Tiêu đề bài viết"
                name="title"
                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề bài viết!' }]}
              >
                <Input placeholder="Nhập tiêu đề bài viết" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Slug"
                name="slug"
                rules={[{ required: true, message: 'Vui lòng nhập slug!' }]}
              >
                <Input placeholder="tieu-de-bai-viet" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            label="Tóm tắt"
            name="excerpt"
          >
            <TextArea rows={3} placeholder="Nhập tóm tắt bài viết" />
          </Form.Item>
        </Card>

        <Card title="Nội dung bài viết" style={{ marginBottom: 16 }}>
          <Form.Item
            label="Nội dung"
            name="content"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung bài viết!' }]}
          >
            <MDEditor data-color-mode="light" />
          </Form.Item>
        </Card>

        <Card title="Phân loại & Tác giả" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Danh mục"
                name="category_id"
                rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
              >
                <Select {...categorySelectProps} placeholder="Chọn danh mục" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tác giả"
                name="author_id"
                rules={[{ required: true, message: 'Vui lòng chọn tác giả!' }]}
              >
                <Select {...authorSelectProps} placeholder="Chọn tác giả" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="Hình ảnh & Cài đặt" style={{ marginBottom: 16 }}>
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
                label="Thời gian đọc (phút)"
                name="read_time"
              >
                <InputNumber min={1} style={{ width: '100%' }} placeholder="5" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="Trạng thái & Tính năng" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Trạng thái"
                name="status"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
              >
                <Select
                  options={[
                    { value: 'draft', label: 'Bản nháp' },
                    { value: 'published', label: 'Đã xuất bản' },
                    { value: 'archived', label: 'Đã lưu trữ' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Bài viết nổi bật"
                name="is_featured"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Bài viết ghim"
                name="is_pinned"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="Lịch xuất bản">
          <Form.Item
            label="Thời gian xuất bản"
            name="published_at"
          >
            <DatePicker showTime style={{ width: '100%' }} placeholder="Chọn thời gian xuất bản" />
          </Form.Item>
        </Card>
      </Form>
    </Edit>
  );
};

export default BlogPostEdit;
