import React from 'react';
import { List, useTable, EditButton, DeleteButton, ShowButton } from '@refinedev/antd';
import { Table, Space, Tag, Switch } from 'antd';
import { BlogCategory } from '../../lib/supabase';

export const BlogCategoryList: React.FC = () => {
  const { tableProps } = useTable<BlogCategory>({
    resource: 'blog_categories',
  });

  const columns = [
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (value: string, record: any) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{value}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>/{record.slug}</div>
        </div>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: 300,
      render: (value: string) => value || '-',
    },
    {
      title: 'Màu sắc',
      dataIndex: 'color',
      key: 'color',
      width: 100,
      render: (value: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: value,
              borderRadius: '4px',
              border: '1px solid #d9d9d9',
            }}
          />
          <span style={{ fontSize: '12px' }}>{value}</span>
        </div>
      ),
    },
    {
      title: 'Thứ tự',
      dataIndex: 'sort_order',
      key: 'sort_order',
      width: 80,
      render: (value: number) => value || 0,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'is_active',
      key: 'is_active',
      width: 100,
      render: (value: boolean) => (
        <Switch
          checked={value}
          size="small"
          disabled
        />
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_: any, record: any) => (
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
      <Table
        {...tableProps}
        columns={columns}
        rowKey="id"
        scroll={{ x: 1000 }}
      />
    </List>
  );
};

export default BlogCategoryList;
