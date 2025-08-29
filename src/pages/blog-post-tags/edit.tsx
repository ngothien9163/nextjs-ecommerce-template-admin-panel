import React from 'react';
import { Edit, useForm, useSelect } from '@refinedev/antd';
import { Form, Select, Card, Row, Col, Typography } from 'antd';
import { BlogPostTag, BlogPost, Tag as TagType } from '../../lib/supabase';

const { Title } = Typography;

export const BlogPostTagEdit: React.FC = () => {
  const { formProps, saveButtonProps, queryResult } = useForm<BlogPostTag>({
    resource: 'blog_post_tags',
  });

  const { data: blogPostTagData } = queryResult || {};

  const { selectProps: postSelectProps } = useSelect<BlogPost>({
    resource: 'blog_posts',
    optionLabel: 'title',
    optionValue: 'id',
  });

  const { selectProps: tagSelectProps } = useSelect<TagType>({
    resource: 'tags',
    optionLabel: 'name',
    optionValue: 'id',
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Card title="Liên kết bài viết và tag" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Bài viết"
                name="post_id"
                rules={[{ required: true, message: 'Vui lòng chọn bài viết!' }]}
              >
                <Select {...postSelectProps} placeholder="Chọn bài viết" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tag"
                name="tag_id"
                rules={[{ required: true, message: 'Vui lòng chọn tag!' }]}
              >
                <Select {...tagSelectProps} placeholder="Chọn tag" />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
    </Edit>
  );
};

export default BlogPostTagEdit;
