import React from 'react';
import { Show } from '@refinedev/antd';
import { useOne , useShow } from '@refinedev/core';
import { Descriptions, Card, Tag, Switch, Row, Col, Typography, Space } from 'antd';
import { BlogPost, BlogCategory, Profile } from '../../lib/supabase';
import { SEODisplay } from '../../components/seo-display';

const { Title, Text } = Typography;

export const BlogPostShow: React.FC = () => {
  const { queryResult } = useShow<BlogPost>({
    resource: 'blog_posts',
  });

  const { data, isLoading } = queryResult;
  const blogPost = data?.data;

  const { data: categoryData, isLoading: categoryIsLoading } = useOne<BlogCategory>({
    resource: 'blog_categories',
    id: blogPost?.category_id || '',
    queryOptions: {
      enabled: !!blogPost?.category_id,
    },
  });

  const { data: authorData, isLoading: authorIsLoading } = useOne<Profile>({
    resource: 'profiles',
    id: blogPost?.author_id || '',
    queryOptions: {
      enabled: !!blogPost?.author_id,
    },
  });

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (!blogPost) {
    return <div>Không tìm thấy bài viết</div>;
  }

  return (
    <Show>
      <Card title="Thông tin cơ bản" style={{ marginBottom: 16 }}>
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Tiêu đề bài viết" span={2}>
            <Text strong>{blogPost.title}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Slug">
            <Tag color="blue">/{blogPost.slug}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Tóm tắt">
            {blogPost.excerpt || 'Không có tóm tắt'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Nội dung bài viết" style={{ marginBottom: 16 }}>
        <div style={{ 
          padding: '16px', 
          backgroundColor: '#f5f5f5', 
          borderRadius: '6px',
          whiteSpace: 'pre-wrap',
          fontFamily: 'monospace'
        }}>
          {blogPost.content}
        </div>
      </Card>

      <Card title="Phân loại & Tác giả" style={{ marginBottom: 16 }}>
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Danh mục">
            {categoryIsLoading ? (
              'Đang tải...'
            ) : (
              categoryData?.data ? (
                <Tag color="blue">{categoryData.data.name}</Tag>
              ) : (
                'Không có danh mục'
              )
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Tác giả">
            {authorIsLoading ? (
              'Đang tải...'
            ) : (
              authorData?.data ? (
                `${authorData.data.first_name || ''} ${authorData.data.last_name || ''}`.trim() || authorData.data.email || 'Author'
              ) : (
                'Không có tác giả'
              )
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Hình ảnh & Cài đặt" style={{ marginBottom: 16 }}>
        <Descriptions column={2} bordered>
          <Descriptions.Item label="ID hình ảnh đại diện">
            {blogPost.featured_image_id || 'Không có hình ảnh'}
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian đọc">
            {blogPost.read_time ? `${blogPost.read_time} phút` : 'Không có thông tin'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Trạng thái & Tính năng" style={{ marginBottom: 16 }}>
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Trạng thái">
            {(() => {
              const statusConfig = {
                draft: { color: 'default', text: 'Bản nháp' },
                published: { color: 'success', text: 'Đã xuất bản' },
                archived: { color: 'warning', text: 'Đã lưu trữ' },
              };
              const config = statusConfig[blogPost.status] || statusConfig.draft;
              return <Tag color={config.color}>{config.text}</Tag>;
            })()}
          </Descriptions.Item>
          <Descriptions.Item label="Tính năng">
            <Space direction="vertical" size="small">
              {blogPost.is_featured && <Tag color="gold">Nổi bật</Tag>}
              {blogPost.is_pinned && <Tag color="red">Ghim</Tag>}
            </Space>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Thống kê" style={{ marginBottom: 16 }}>
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Lượt xem">
            {blogPost.view_count}
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian xuất bản">
            {blogPost.published_at ? new Date(blogPost.published_at).toLocaleString('vi-VN') : 'Chưa xuất bản'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Thông tin SEO */}
      {blogPost.seo_data && (
        <SEODisplay seoData={blogPost.seo_data} showAdvanced={true} />
      )}

      <Card title="Thông tin hệ thống">
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Ngày tạo">
            {new Date(blogPost.created_at).toLocaleString('vi-VN')}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày cập nhật">
            {new Date(blogPost.updated_at).toLocaleString('vi-VN')}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </Show>
  );
};

export default BlogPostShow;
