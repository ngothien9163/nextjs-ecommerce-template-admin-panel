import React from 'react';
import { Create, useForm, useSelect } from '@refinedev/antd';
import { Form, Input, Select, Switch, Card, Row, Col, Typography } from 'antd';
import { BlogComment, BlogPost, Profile } from '../../lib/supabase';

const { TextArea } = Input;
const { Title } = Typography;

export const BlogCommentCreate: React.FC = () => {
  const { formProps, saveButtonProps } = useForm<BlogComment>({
    resource: 'blog_comments',
  });

  const { selectProps: postSelectProps } = useSelect<BlogPost>({
    resource: 'blog_posts',
    optionLabel: 'title',
    optionValue: 'id',
  });

  const { selectProps: userSelectProps } = useSelect<Profile>({
    resource: 'profiles',
    optionLabel: (item) => `${item.first_name || ''} ${item.last_name || ''}`.trim() || item.email || 'User',
    optionValue: 'id',
  });

  const { selectProps: parentCommentSelectProps } = useSelect<BlogComment>({
    resource: 'blog_comments',
    optionLabel: 'content',
    optionValue: 'id',
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Card title="Thông tin bình luận" style={{ marginBottom: 16 }}>
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
                label="Người dùng (tùy chọn)"
                name="user_id"
              >
                <Select {...userSelectProps} placeholder="Chọn người dùng (để trống nếu là guest)" allowClear />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Bình luận cha (tùy chọn)"
                name="parent_id"
              >
                <Select {...parentCommentSelectProps} placeholder="Chọn bình luận cha (để trống nếu là bình luận gốc)" allowClear />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tên tác giả"
                name="author_name"
                rules={[{ required: true, message: 'Vui lòng nhập tên tác giả!' }]}
              >
                <Input placeholder="Nhập tên tác giả bình luận" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            label="Email tác giả"
            name="author_email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input placeholder="Nhập email tác giả" />
          </Form.Item>
        </Card>

        <Card title="Nội dung bình luận" style={{ marginBottom: 16 }}>
          <Form.Item
            label="Nội dung"
            name="content"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung bình luận!' }]}
          >
            <TextArea rows={4} placeholder="Nhập nội dung bình luận" />
          </Form.Item>
        </Card>

        <Card title="Trạng thái">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Đã phê duyệt"
                name="is_approved"
                valuePropName="checked"
                initialValue={false}
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Đánh dấu spam"
                name="is_spam"
                valuePropName="checked"
                initialValue={false}
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
    </Create>
  );
};

export default BlogCommentCreate;
