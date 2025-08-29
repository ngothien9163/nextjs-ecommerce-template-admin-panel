import React from 'react';
import { Show, useShow } from '@refinedev/antd';
import { useOne } from '@refinedev/core';
import { Descriptions, Card, Tag, Typography } from 'antd';
import { BlogPostTag, BlogPost, Tag as TagType } from '../../lib/supabase';

const { Title, Text } = Typography;

export const BlogPostTagShow: React.FC = () => {
  const { queryResult } = useShow<BlogPostTag>({
    resource: 'blog_post_tags',
  });

  const { data, isLoading } = queryResult;
  const blogPostTag = data?.data;

  const { data: postData, isLoading: postIsLoading } = useOne<BlogPost>({
    resource: 'blog_posts',
    id: blogPostTag?.post_id || '',
    queryOptions: {
      enabled: !!blogPostTag?.post_id,
    },
  });

  const { data: tagData, isLoading: tagIsLoading } = useOne<TagType>({
    resource: 'tags',
    id: blogPostTag?.tag_id || '',
    queryOptions: {
      enabled: !!blogPostTag?.tag_id,
    },
  });

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (!blogPostTag) {
    return <div>Không tìm thấy liên kết bài viết và tag</div>;
  }

  return (
    <Show>
      <Card title="Thông tin liên kết" style={{ marginBottom: 16 }}>
        <Descriptions column={2} bordered>
          <Descriptions.Item label="ID liên kết">
            <Text code>{blogPostTag.id}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {new Date(blogPostTag.created_at).toLocaleString('vi-VN')}
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

      <Card title="Tag">
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Tên tag">
            {tagIsLoading ? (
              'Đang tải...'
            ) : (
              tagData?.data ? (
                <Tag color="blue" style={{ fontSize: '16px', padding: '8px 16px' }}>
                  {tagData.data.name}
                </Tag>
              ) : (
                'Không tìm thấy tag'
              )
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </Show>
  );
};

export default BlogPostTagShow;
