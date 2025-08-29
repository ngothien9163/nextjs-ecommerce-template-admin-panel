import React from 'react';
import { List, useTable, EditButton, DeleteButton, ShowButton } from '@refinedev/antd';
import { useMany } from '@refinedev/core';
import { Table, Space, Tag, Switch, Progress } from 'antd';
import { BlogPost, BlogCategory, Profile } from '../../lib/supabase';

export const BlogPostList: React.FC = () => {
  const { tableProps } = useTable<BlogPost>({
    resource: 'blog_posts',
    syncWithLocation: true,
  });

  const { data: categoryData, isLoading: categoryIsLoading } = useMany<BlogCategory>({
    resource: 'blog_categories',
    ids: tableProps?.dataSource?.map((item: any) => item.category_id).filter(Boolean) ?? [],
    queryOptions: {
      enabled: !!tableProps?.dataSource,
    },
  });

  const { data: authorData, isLoading: authorIsLoading } = useMany<Profile>({
    resource: 'profiles',
    ids: tableProps?.dataSource?.map((item: any) => item.author_id).filter(Boolean) ?? [],
    queryOptions: {
      enabled: !!tableProps?.dataSource,
    },
  });

  const columns = [
    {
      title: 'Tiêu đề bài viết',
      dataIndex: 'title',
      key: 'title',
      width: 250,
      render: (value: string, record: any) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{value}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>/{record.slug}</div>
        </div>
      ),
    },
    {
      title: 'Tóm tắt',
      dataIndex: 'excerpt',
      key: 'excerpt',
      width: 300,
      render: (value: string) => value ? `${value.slice(0, 80)}...` : '-',
    },
    {
      title: 'Danh mục',
      dataIndex: 'category_id',
      key: 'category_id',
      width: 150,
      render: (value: string) => {
        if (categoryIsLoading) return 'Đang tải...';
        const category = categoryData?.data?.find((item) => item.id === value);
        return category ? (
          <Tag color="blue">{category.name}</Tag>
        ) : '-';
      },
    },
    {
      title: 'Tác giả',
      dataIndex: 'author_id',
      key: 'author_id',
      width: 120,
      render: (value: string) => {
        if (authorIsLoading) return 'Đang tải...';
        const author = authorData?.data?.find((item) => item.id === value);
        return author ? `${author.first_name || ''} ${author.last_name || ''}`.trim() || author.email || '-' : '-';
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (value: string) => {
        const statusConfig = {
          draft: { color: 'default', text: 'Bản nháp' },
          published: { color: 'success', text: 'Đã xuất bản' },
          archived: { color: 'warning', text: 'Đã lưu trữ' },
        };
        const config = statusConfig[value as keyof typeof statusConfig] || statusConfig.draft;
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Tính năng',
      key: 'features',
      width: 120,
      render: (_: any, record: any) => (
        <Space direction="vertical" size="small">
          {record.is_featured && <Tag color="gold">Nổi bật</Tag>}
          {record.is_pinned && <Tag color="red">Ghim</Tag>}
        </Space>
      ),
    },
    {
      title: 'Thống kê',
      key: 'stats',
      width: 150,
      render: (_: any, record: any) => (
        <div>
          <div>👁️ {record.view_count} lượt xem</div>
          {record.read_time && <div>⏱️ {record.read_time} phút</div>}
        </div>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      fixed: 'right',
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
        scroll={{ x: 1430 }}
      />
    </List>
  );
};

export default BlogPostList;
