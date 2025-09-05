import React from 'react';
import { Show } from '@refinedev/antd';
import { useShow, useOne } from '@refinedev/core';
import { Typography, Descriptions, Tag, Image, Space, Card, Alert } from 'antd';
import { Category } from '../../lib/supabase';

const { Title, Text } = Typography;

export const CategoryShow: React.FC = () => {
  const { queryResult } = useShow<Category>();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  // Fetch media data if featured_image_id exists
  const { data: mediaData, isLoading: mediaLoading } = useOne({
    resource: 'medias',
    id: record?.featured_image_id,
    queryOptions: {
      enabled: !!record?.featured_image_id,
    },
  });

  // Fetch parent category if parent_id exists
  const { data: parentCategoryData, isLoading: parentLoading } = useOne({
    resource: 'categories',
    id: record?.parent_id,
    queryOptions: {
      enabled: !!record?.parent_id,
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Show>
      <Title level={5}>Thông tin danh mục</Title>
      
      {/* Hiển thị ảnh đại diện nếu có */}
      {record?.featured_image_id && (
        <Card 
          title="Ảnh đại diện" 
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
                alt={mediaData.data.alt_text || record.name}
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
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
              description={`ID hình ảnh: ${record.featured_image_id}`}
              type="warning" 
              showIcon 
            />
          )}
        </Card>
      )}
      
      <Descriptions bordered column={2}>
        <Descriptions.Item label="Tên danh mục">
          <Text strong>{record?.name}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Slug">
          <Text code>{record?.slug}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Mô tả" span={2}>
          {record?.description ? (
            <div style={{ 
              maxHeight: '100px', 
              overflowY: 'auto', 
              padding: '8px', 
              backgroundColor: '#f5f5f5', 
              borderRadius: '4px' 
            }}>
              {record.description}
            </div>
          ) : (
            <Text type="secondary" italic>Không có mô tả</Text>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Danh mục cha">
          {parentLoading ? (
            <Text type="secondary">🔄 Đang tải...</Text>
          ) : parentCategoryData?.data ? (
            <Tag color="blue">{parentCategoryData.data.name}</Tag>
          ) : record?.parent_id ? (
            <Text type="warning">ID: {record.parent_id}</Text>
          ) : (
            <Text type="secondary">Không có danh mục cha</Text>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Thứ tự sắp xếp">
          <Tag color="purple">{record?.sort_order}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Tag color={record?.is_active ? 'green' : 'red'}>
            {record?.is_active ? '🟢 Hoạt động' : '🔴 Không hoạt động'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Số lượng sản phẩm">
          <Tag color="orange">{record?.product_count || 0} sản phẩm</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="ID hình ảnh đại diện" span={2}>
          {record?.featured_image_id ? (
            <Text code style={{ fontSize: '12px' }}>{record.featured_image_id}</Text>
          ) : (
            <Text type="secondary" italic>Chưa có ảnh đại diện</Text>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">
          <Text>{
            record?.created_at ? 
            new Date(record.created_at).toLocaleString('vi-VN') : 
            'Không có'
          }</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Ngày cập nhật">
          <Text>{
            record?.updated_at ? 
            new Date(record.updated_at).toLocaleString('vi-VN') : 
            'Không có'
          }</Text>
        </Descriptions.Item>
      </Descriptions>
    </Show>
  );
};
