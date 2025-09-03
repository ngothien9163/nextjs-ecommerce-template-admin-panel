import React from 'react';
import { List, useTable, EditButton, ShowButton } from '@refinedev/antd';
import { Table, Space, Tag, Switch } from 'antd';
import { BlogCategory } from '../../lib/supabase';
import { CustomDeleteButton } from '../../components/custom-delete-button';

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
      render: (value: string) => (
        value ? (
          <span style={{ 
            display: 'block',
            maxWidth: '200px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {value}
          </span>
        ) : (
          <span style={{ color: '#ccc', fontStyle: 'italic' }}>Không có mô tả</span>
        )
      ),
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
      render: (value: number) => (
        <Tag color="purple">{value || 0}</Tag>
      ),
      sorter: (a: any, b: any) => a.sort_order - b.sort_order,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'is_active',
      key: 'is_active',
      width: 120,
      render: (value: boolean) => (
        <Tag color={value ? 'green' : 'red'}>
          {value ? '🟢 Hoạt động' : '🔴 Không hoạt động'}
        </Tag>
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
          <CustomDeleteButton 
            recordItemId={record.id} 
            resource="blog_categories"
            size="small"
            hideText
          />
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
