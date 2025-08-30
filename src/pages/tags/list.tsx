import React from 'react';
import { List, useTable, EditButton, DeleteButton, ShowButton } from '@refinedev/antd';
import { Table, Space, Tag as AntTag } from 'antd';
import { Tag } from '../../lib/supabase';

export const TagList: React.FC = () => {
  const { tableProps } = useTable<Tag>();

  const columns = [
    {
      title: 'Tên tag',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
    },
    {
      title: 'Loại',
      dataIndex: 'tag_type',
      key: 'tag_type',
      render: (tagType: string) => {
        const colorMap: { [key: string]: string } = {
          general: 'blue',
          product: 'green',
          blog: 'purple',
          mixed: 'orange',
        };
        return <AntTag color={colorMap[tagType] || 'default'}>{tagType}</AntTag>;
      },
    },
    {
      title: 'Màu sắc',
      dataIndex: 'color',
      key: 'color',
      render: (color: string) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: color,
              borderRadius: '4px',
              marginRight: '8px',
            }}
          />
          {color}
        </div>
      ),
    },
    {
      title: 'Số lần sử dụng',
      dataIndex: 'usage_count',
      key: 'usage_count',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive: boolean) => (
        <AntTag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Hoạt động' : 'Không hoạt động'}
        </AntTag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: Tag) => (
        <Space>
          <ShowButton hideText size="small" recordItemId={record.id} />
          <EditButton hideText size="small" recordItemId={record.id} />
          <DeleteButton hideText size="small" recordItemId={record.id} />
        </Space>
      ),
    },
  ];

  return (
    <List>
      <Table {...tableProps} columns={columns} rowKey="id" />
    </List>
  );
};

