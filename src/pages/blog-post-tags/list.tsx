import React from 'react';
import { List, useTable, EditButton, DeleteButton, ShowButton } from '@refinedev/antd';
import { useMany } from '@refinedev/core';
import { Table, Space, Tag } from 'antd';
import { BlogPostTag, BlogPost, Tag as TagType } from '../../lib/supabase';

export const BlogPostTagList: React.FC = () => {
  const { tableProps } = useTable<BlogPostTag>({
    resource: 'blog_post_tags',
    syncWithLocation: true,
  });

  const { data: postData, isLoading: postIsLoading } = useMany<BlogPost>({
    resource: 'blog_posts',
    ids: tableProps?.dataSource?.map((item: any) => item.post_id).filter(Boolean) ?? [],
    queryOptions: {
      enabled: !!tableProps?.dataSource,
    },
  });

  const { data: tagData, isLoading: tagIsLoading } = useMany<TagType>({
    resource: 'tags',
    ids: tableProps?.dataSource?.map((item: any) => item.tag_id).filter(Boolean) ?? [],
    queryOptions: {
      enabled: !!tableProps?.dataSource,
    },
  });

  const columns = [
    {
      title: 'Bài viết',
      dataIndex: 'post_id',
      key: 'post_id',
      width: 300,
      render: (value: string) => {
        if (postIsLoading) return 'Đang tải...';
        const post = postData?.data?.find((item) => item.id === value);
        return post ? (
          <div>
            <div style={{ fontWeight: 'bold' }}>{post.title}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>/{post.slug}</div>
          </div>
        ) : '-';
      },
    },
    {
      title: 'Tag',
      dataIndex: 'tag_id',
      key: 'tag_id',
      width: 200,
      render: (value: string) => {
        if (tagIsLoading) return 'Đang tải...';
        const tag = tagData?.data?.find((item) => item.id === value);
        return tag ? (
          <Tag color="blue">{tag.name}</Tag>
        ) : '-';
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
      render: (value: string) => new Date(value).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
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
        scroll={{ x: 800 }}
      />
    </List>
  );
};

export default BlogPostTagList;
