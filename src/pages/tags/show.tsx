import React from 'react';
import { Show } from '@refinedev/antd';
import { useShow } from '@refinedev/core';
import { Typography, Descriptions, Tag as AntTag, Space } from 'antd';
import { Tag } from '../../lib/supabase';

const { Title } = Typography;

export const TagShow: React.FC = () => {
  const { queryResult } = useShow<Tag>();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>Thông tin tag</Title>
      <Descriptions bordered column={2}>
        <Descriptions.Item label="Tên tag" span={2}>
          {record?.name}
        </Descriptions.Item>
        <Descriptions.Item label="Slug">
          {record?.slug}
        </Descriptions.Item>
        <Descriptions.Item label="Loại tag">
          <AntTag color="blue">{record?.tag_type}</AntTag>
        </Descriptions.Item>
        <Descriptions.Item label="Màu sắc" span={2}>
          <Space>
            <div
              style={{
                width: '24px',
                height: '24px',
                backgroundColor: record?.color,
                borderRadius: '4px',
                border: '1px solid #d9d9d9',
              }}
            />
            {record?.color}
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Mô tả" span={2}>
          {record?.description || 'Không có mô tả'}
        </Descriptions.Item>
        <Descriptions.Item label="Số lần sử dụng">
          {record?.usage_count || 0}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <AntTag color={record?.is_active ? 'green' : 'red'}>
            {record?.is_active ? 'Hoạt động' : 'Không hoạt động'}
          </AntTag>
        </Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">
          {record?.created_at ? new Date(record.created_at).toLocaleDateString('vi-VN') : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày cập nhật">
          {record?.updated_at ? new Date(record.updated_at).toLocaleDateString('vi-VN') : '-'}
        </Descriptions.Item>
      </Descriptions>
    </Show>
  );
};

