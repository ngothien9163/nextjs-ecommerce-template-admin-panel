import React from 'react';
import { List, EditButton, DeleteButton, ShowButton } from '@refinedev/antd';
import { Table, Space, Tag, Switch } from 'antd';
import { Category } from '../../lib/supabase';

export const CategoryList: React.FC = () => {
  return (
    <List>
      <Table<Category>
        dataSource={[]}
        rowKey="id"
        pagination={{
          pageSize: 10,
        }}
      >
        <Table.Column<Category>
          title="Tên danh mục"
          dataIndex="name"
          key="name"
          render={(value, record) => (
            <div>
              <div style={{ fontWeight: 'bold' }}>{value}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                Slug: {record.slug}
              </div>
            </div>
          )}
        />
        <Table.Column<Category>
          title="Mô tả"
          dataIndex="description"
          key="description"
          render={(value) => value || '-'}
        />
        <Table.Column<Category>
          title="Thứ tự"
          dataIndex="sort_order"
          key="sort_order"
          sorter={(a, b) => a.sort_order - b.sort_order}
        />
        <Table.Column<Category>
          title="Trạng thái"
          dataIndex="is_active"
          key="is_active"
          render={(value) => (
            <Switch
              checked={value}
              disabled
              size="small"
            />
          )}
        />
        <Table.Column<Category>
          title="Ngày tạo"
          dataIndex="created_at"
          key="created_at"
          render={(value) => new Date(value).toLocaleDateString('vi-VN')}
        />
        <Table.Column<Category>
          title="Thao tác"
          dataIndex="actions"
          key="actions"
          render={(_, record) => (
            <Space>
              <ShowButton hideText size="small" recordItemId={record.id} />
              <EditButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
