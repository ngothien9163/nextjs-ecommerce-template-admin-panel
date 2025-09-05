import React from 'react';
import { Show } from '@refinedev/antd';
import { useShow, useOne } from '@refinedev/core';
import { Descriptions, Card, Tag, Switch, Row, Col, Typography, Image, Alert } from 'antd';
import { BlogCategory } from '../../lib/supabase';

const { Title, Text } = Typography;

export const BlogCategoryShow: React.FC = () => {
  const { queryResult } = useShow<BlogCategory>({
    resource: 'blog_categories',
  });

  const { data, isLoading, error } = queryResult;
  const blogCategory = data?.data;

  // Debug logging
  console.log('🔍 Show page - isLoading:', isLoading);
  console.log('🔍 Show page - data:', data);
  console.log('🔍 Show page - blogCategory:', blogCategory);
  console.log('🔍 Show page - error:', error);

  // Fetch media data if featured_image_id exists
  const { data: mediaData, isLoading: mediaLoading } = useOne({
    resource: 'medias',
    id: blogCategory?.featured_image_id,
    queryOptions: {
      enabled: !!blogCategory?.featured_image_id,
    },
  });

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (!blogCategory) {
    return <div>Không tìm thấy danh mục blog</div>;
  }

  return (
    <Show>
      <Title level={5}>Thông tin danh mục blog</Title>
      
      {/* Hiển thị ảnh đại diện nếu có */}
      {blogCategory.featured_image_id && (
        <Card 
          title="🖼️ Ảnh đại diện" 
          style={{ marginBottom: '24px' }}
          size="small"
        >
          {mediaLoading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              🔄 Đang tải hình ảnh...
            </div>
          ) : mediaData?.data ? (
            <div style={{ textAlign: 'center' }}>
              <Image
                width={200}
                height={150}
                style={{ objectFit: 'cover', borderRadius: '8px' }}
                src={mediaData.data.file_url}
                alt={mediaData.data.alt_text || blogCategory.name}
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYzN"
              />
              <div style={{ marginTop: '12px', fontSize: '14px', color: '#666' }}>
                <div><strong>Tên file:</strong> {mediaData.data.file_name}</div>
                <div><strong>Kích thước:</strong> {mediaData.data.file_size_kb ? `${mediaData.data.file_size_kb} KB` : 'N/A'}</div>
                <div><strong>Alt text:</strong> {mediaData.data.alt_text || 'Chưa có'}</div>
              </div>
            </div>
          ) : (
            <Alert 
              message="Không tìm thấy hình ảnh" 
              description={`ID hình ảnh: ${blogCategory.featured_image_id}`}
              type="warning" 
              showIcon 
            />
          )}
        </Card>
      )}

      <Card title="Thông tin cơ bản" style={{ marginBottom: 16 }}>
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Tên danh mục" span={2}>
            <Text strong>{blogCategory.name}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Slug">
            <Tag color="blue">/{blogCategory.slug}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Mô tả">
            {blogCategory.description ? (
              <div style={{ 
                maxHeight: '100px', 
                overflowY: 'auto', 
                padding: '8px', 
                backgroundColor: '#f5f5f5', 
                borderRadius: '4px' 
              }}>
                {blogCategory.description}
              </div>
            ) : (
              <Text type="secondary" italic>Không có mô tả</Text>
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Giao diện & Thiết kế" style={{ marginBottom: 16 }}>
        <Descriptions column={2} bordered>
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
          <Descriptions.Item label="Thứ tự sắp xếp">
            <Tag color="purple">{blogCategory.sort_order}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Ảnh đại diện" span={2}>
            {blogCategory.featured_image_id ? (
              mediaData?.data ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Image
                    width={40}
                    height={40}
                    style={{ objectFit: 'cover', borderRadius: '4px' }}
                    src={mediaData.data.file_url}
                    alt={mediaData.data.alt_text || blogCategory.name}
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYzN"
                  />
                  <span style={{ fontSize: '14px' }}>{mediaData.data.file_name}</span>
                  <Tag color="green">Đã có ảnh</Tag>
                </div>
              ) : (
                <Text code style={{ fontSize: '12px' }}>{blogCategory.featured_image_id}</Text>
              )
            ) : (
              <Text type="secondary" italic>Chưa có ảnh đại diện</Text>
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Cài đặt" style={{ marginBottom: 16 }}>
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Trạng thái hoạt động">
            <Tag color={blogCategory.is_active ? 'green' : 'red'}>
              {blogCategory.is_active ? '🟢 Hoạt động' : '🔴 Không hoạt động'}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Thông tin hệ thống">
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Ngày tạo">
            <Text>{
              blogCategory.created_at ? 
              new Date(blogCategory.created_at).toLocaleString('vi-VN') : 
              'Không có'
            }</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Ngày cập nhật">
            <Text>{
              blogCategory.updated_at ? 
              new Date(blogCategory.updated_at).toLocaleString('vi-VN') : 
              'Không có'
            }</Text>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </Show>
  );
};

export default BlogCategoryShow;
