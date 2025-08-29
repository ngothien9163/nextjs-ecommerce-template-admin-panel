import React from 'react';
import { Show, useShow } from '@refinedev/antd';
import { useOne } from '@refinedev/core';
import { Descriptions, Card, Tag, Typography, Space } from 'antd';
import { BlogComment, BlogPost, Profile } from '../../lib/supabase';

const { Title, Text } = Typography;

export const BlogCommentShow: React.FC = () => {
  const { queryResult } = useShow<BlogComment>({
    resource: 'blog_comments',
  });

  const { data, isLoading } = queryResult;
  const blogComment = data?.data;

  const { data: postData, isLoading: postIsLoading } = useOne<BlogPost>({
    resource: 'blog_posts',
    id: blogComment?.post_id || '',
    queryOptions: {
      enabled: !!blogComment?.post_id,
    },
  });

  const { data: userData, isLoading: userIsLoading } = useOne<Profile>({
    resource: 'profiles',
    id: blogComment?.user_id || '',
    queryOptions: {
      enabled: !!blogComment?.user_id,
    },
  });

  const { data: parentCommentData, isLoading: parentCommentIsLoading } = useOne<BlogComment>({
    resource: 'blog_comments',
    id: blogComment?.parent_id || '',
    queryOptions: {
      enabled: !!blogComment?.parent_id,
    },
  });

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (!blogComment) {
    return <div>Không tìm thấy bình luận</div>;
  }

  return (
    <Show>
      <Card title="Thông tin cơ bản" style={{ marginBottom: 16 }}>
        <Descriptions column={2} bordered>
          <Descriptions.Item label="ID bình luận">
            <Text code>{blogComment.id}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {new Date(blogComment.created_at).toLocaleString('vi-VN')}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Bài viết" style={{ marginBottom: 16 }}>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Tiêu đề">
            {postIsLoading ? (
              'Đang tải...'
            ) : (
              postData?.data ? (
                <div>
                  <Text strong>{postData.data.title}</Text>
                  <br />
                  <Tag color="blue">/{postData.data.slug}</Tag>
                </div>
              ) : (
                'Không tìm thấy bài viết'
              )
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Tác giả bình luận" style={{ marginBottom: 16 }}>
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Tên tác giả">
            <Text strong>{blogComment.author_name}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            <Text code>{blogComment.author_email}</Text>
          </Descriptions.Item>
          {blogComment.user_id && (
            <Descriptions.Item label="Người dùng đăng nhập" span={2}>
              {userIsLoading ? (
                'Đang tải...'
              ) : (
                                 userData?.data ? (
                   <div>
                     <Text strong>{`${userData.data.first_name || ''} ${userData.data.last_name || ''}`.trim() || 'User'}</Text>
                     <br />
                     <Text type="secondary">{userData.data.email || 'No email'}</Text>
                   </div>
                 ) : (
                  'Không tìm thấy thông tin người dùng'
                )
              )}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      <Card title="Nội dung bình luận" style={{ marginBottom: 16 }}>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Nội dung">
            <Text>{blogComment.content}</Text>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Bình luận cha" style={{ marginBottom: 16 }}>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Loại bình luận">
            {blogComment.parent_id ? (
              <Tag color="orange">Bình luận trả lời</Tag>
            ) : (
              <Tag color="blue">Bình luận gốc</Tag>
            )}
          </Descriptions.Item>
          {blogComment.parent_id && (
            <Descriptions.Item label="Nội dung bình luận cha">
              {parentCommentIsLoading ? (
                'Đang tải...'
              ) : (
                parentCommentData?.data ? (
                  <div>
                    <Text strong>{parentCommentData.data.author_name}</Text>
                    <br />
                    <Text>{parentCommentData.data.content}</Text>
                  </div>
                ) : (
                  'Không tìm thấy bình luận cha'
                )
              )}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      <Card title="Trạng thái & Thông tin hệ thống">
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Trạng thái phê duyệt">
            <Tag color={blogComment.is_approved ? 'success' : 'default'}>
              {blogComment.is_approved ? 'Đã phê duyệt' : 'Chưa phê duyệt'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái spam">
            <Tag color={blogComment.is_spam ? 'red' : 'green'}>
              {blogComment.is_spam ? 'Spam' : 'Không phải spam'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Ngày cập nhật">
            {new Date(blogComment.updated_at).toLocaleString('vi-VN')}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </Show>
  );
};

export default BlogCommentShow;
