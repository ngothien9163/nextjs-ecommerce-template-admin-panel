import React from 'react';
import { Show, useShow } from '@refinedev/antd';
import { Descriptions, Card, Tag, Switch, Row, Col, Typography } from 'antd';
import { BlogCategory } from '../../lib/supabase';

const { Title, Text } = Typography;

export const BlogCategoryShow: React.FC = () => {
  const { queryResult } = useShow<BlogCategory>({
    resource: 'blog_categories',
  });

  const { data, isLoading } = queryResult;
  const blogCategory = data?.data;

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (!blogCategory) {
    return <div>Không tìm thấy danh mục blog</div>;
  }

  return (
    <Show>
      <Card title="Thông tin cơ bản" style={{ marginBottom: 16 }}>
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Tên danh mục" span={2}>
            <Text strong>{blogCategory.name}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Slug">
            <Tag color="blue">/{blogCategory.slug}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Mô tả">
            {blogCategory.description || 'Không có mô tả'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Hình ảnh & Giao diện" style={{ marginBottom: 16 }}>
        <Descriptions column={2} bordered>
          <Descriptions.Item label="ID hình ảnh đại diện">
            {blogCategory.featured_image_id || 'Không có hình ảnh'}
          </Descriptions.Item>
          <Descriptions.Item label="Màu sắc">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: blogCategory.color,
                  borderRadius: '4px',
                  border: '1px solid #d9d9d9',
                }}
              />
              <span>{blogCategory.color}</span>
            </div>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Cài đặt" style={{ marginBottom: 16 }}>
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Thứ tự sắp xếp">
            {blogCategory.sort_order}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái hoạt động">
            <Switch
              checked={blogCategory.is_active}
              disabled
            />
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Thông tin hệ thống">
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Ngày tạo">
            {new Date(blogCategory.created_at).toLocaleString('vi-VN')}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày cập nhật">
            {new Date(blogCategory.updated_at).toLocaleString('vi-VN')}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </Show>
  );
};

export default BlogCategoryShow;
