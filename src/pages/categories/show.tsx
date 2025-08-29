import React from 'react';
import { Show } from '@refinedev/antd';
import {  useShow } from '@refinedev/core';
import { Typography, Descriptions, Tag, Image, Space } from 'antd';
import { Category } from '../../lib/supabase';

const { Title, Text } = Typography;

export const CategoryShow: React.FC = () => {
  const { queryResult } = useShow<Category>();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Show>
      <Title level={5}>Thông tin danh mục</Title>
      <Descriptions bordered column={2}>
        <Descriptions.Item label="Tên danh mục">
          <Text strong>{record?.name}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Slug">
          <Text code>{record?.slug}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Mô tả" span={2}>
          {record?.description || 'Không có mô tả'}
        </Descriptions.Item>
        <Descriptions.Item label="Danh mục cha">
          {record?.parent_id ? record.parent_id : 'Không có'}
        </Descriptions.Item>
        <Descriptions.Item label="Thứ tự sắp xếp">
          {record?.sort_order}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Tag color={record?.is_active ? 'green' : 'red'}>
            {record?.is_active ? 'Hoạt động' : 'Không hoạt động'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Hình ảnh">
          {record?.image_url ? (
            <Image
              width={100}
              src={record.image_url}
              alt={record.name}
              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
            />
          ) : (
            'Không có hình ảnh'
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Tiêu đề SEO">
          {record?.meta_title || 'Không có'}
        </Descriptions.Item>
        <Descriptions.Item label="Mô tả SEO">
          {record?.meta_description || 'Không có'}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">
          {record?.created_at ? new Date(record.created_at).toLocaleDateString('vi-VN') : 'Không có'}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày cập nhật">
          {record?.updated_at ? new Date(record.updated_at).toLocaleDateString('vi-VN') : 'Không có'}
        </Descriptions.Item>
      </Descriptions>
    </Show>
  );
};
