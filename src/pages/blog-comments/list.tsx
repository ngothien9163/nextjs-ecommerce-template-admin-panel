import React from 'react';
import { List, useTable, EditButton, DeleteButton, ShowButton } from '@refinedev/antd';
import { useMany, useOne } from '@refinedev/core';
import { Table, Space, Tag, Switch, Typography } from 'antd';
import { BlogComment, BlogPost, Profile } from '../../lib/supabase';

const { Text } = Typography;

export const BlogCommentList: React.FC = () => {
  const { tableProps } = useTable<BlogComment>({
    resource: 'blog_comments',
    syncWithLocation: true,
  });

  const { data: postData, isLoading: postIsLoading } = useMany<BlogPost>({
    resource: 'blog_posts',
    ids: tableProps?.dataSource?.map((item: any) => item.post_id).filter(Boolean) ?? [],
    queryOptions: {
      enabled: !!tableProps?.dataSource,
    },
  });

  const { data: userData, isLoading: userIsLoading } = useMany<Profile>({
    resource: 'profiles',
    ids: tableProps?.dataSource?.map((item: any) => item.user_id).filter(Boolean) ?? [],
    queryOptions: {
      enabled: !!tableProps?.dataSource,
    },
  });

  const columns = [
    {
      title: 'Bài viết',
      dataIndex: 'post_id',
      key: 'post_id',
      width: 250,
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
      title: 'Tác giả bình luận',
      key: 'author',
      width: 200,
      render: (_: any, record: any) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{record.author_name}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.author_email}</div>
          {record.user_id && (
            <div style={{ fontSize: '11px', color: '#999' }}>
              {userIsLoading ? 'Đang tải...' : (
                (() => {
                  const user = userData?.data?.find((item) => item.id === record.user_id);
                  return user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || 'User' : 'User';
                })()
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
      width: 300,
      render: (value: string) => (
        <Text style={{ fontSize: '12px' }}>
          {value.length > 100 ? `${value.slice(0, 100)}...` : value}
        </Text>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 120,
      render: (_: any, record: any) => (
        <Space direction="vertical" size="small">
          <Tag color={record.is_approved ? 'success' : 'default'}>
            {record.is_approved ? 'Đã phê duyệt' : 'Chưa phê duyệt'}
          </Tag>
          {record.is_spam && <Tag color="red">Spam</Tag>}
        </Space>
      ),
    },
    {
      title: 'Bình luận cha',
      dataIndex: 'parent_id',
      key: 'parent_id',
      width: 100,
      render: (value: string) => value ? (
        <Tag color="orange">Reply</Tag>
      ) : (
        <Tag color="blue">Gốc</Tag>
      ),
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
        scroll={{ x: 1200 }}
      />
    </List>
  );
};

export default BlogCommentList;
