import React from 'react';
import { Create, useForm } from '@refinedev/antd';
import { Form, Input, Select, Switch, Card, Row, Col, Space, Tooltip } from 'antd';
import { InfoCircleOutlined, TagsOutlined } from '@ant-design/icons';
import { Tag } from '../../lib/supabase';

const { TextArea } = Input;

export const TagCreate: React.FC = () => {
  const { formProps, saveButtonProps } = useForm<Tag>();

  const renderInfoIcon = (tooltip: string) => (
    <Tooltip title={tooltip} placement="top">
      <InfoCircleOutlined style={{ color: '#1890ff', marginLeft: '8px' }} />
    </Tooltip>
  );

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Card 
          title={
            <Space>
              <TagsOutlined style={{ color: '#722ed1' }} />
              <span>Thông tin tag</span>
            </Space>
          }
          style={{ marginBottom: '24px' }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={
                  <Space>
                    <span>Tên tag</span>
                    {renderInfoIcon('Tên hiển thị của tag, ví dụ: "laptop", "gaming", "apple"')}
                  </Space>
                }
                name="name"
                rules={[{ required: true, message: 'Vui lòng nhập tên tag!' }]}
              >
                <Input placeholder="Nhập tên tag" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <Space>
                    <span>Slug</span>
                    {renderInfoIcon('URL thân thiện SEO, tự động tạo từ tên tag')}
                  </Space>
                }
                name="slug"
                rules={[{ required: true, message: 'Vui lòng nhập slug!' }]}
              >
                <Input placeholder="ten-tag" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={
                  <Space>
                    <span>Loại tag</span>
                    {renderInfoIcon('Phân loại tag để quản lý và hiển thị phù hợp')}
                  </Space>
                }
                name="tag_type"
                initialValue="general"
              >
                <Select size="large">
                  <Select.Option value="general">Chung</Select.Option>
                  <Select.Option value="product">Sản phẩm</Select.Option>
                  <Select.Option value="blog">Blog</Select.Option>
                  <Select.Option value="mixed">Hỗn hợp</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <Space>
                    <span>Màu hiển thị</span>
                    {renderInfoIcon('Màu sắc để phân biệt tag, dùng mã hex')}
                  </Space>
                }
                name="color"
                initialValue="#3B82F6"
              >
                <Input placeholder="#3B82F6" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={
              <Space>
                <span>Mô tả</span>
                {renderInfoIcon('Mô tả chi tiết về tag, giúp người dùng hiểu rõ hơn')}
              </Space>
            }
            name="description"
          >
            <TextArea rows={4} placeholder="Mô tả tag" size="large" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={
                  <Space>
                    <span>Số lần sử dụng</span>
                    {renderInfoIcon('Số lần tag được gắn vào sản phẩm hoặc bài viết')}
                  </Space>
                }
                name="usage_count"
                initialValue={0}
              >
                <Input placeholder="0" size="large" type="number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <Space>
                    <span>Hoạt động</span>
                    {renderInfoIcon('Bật/tắt hiển thị tag trên website')}
                  </Space>
                }
                name="is_active"
                valuePropName="checked"
                initialValue={true}
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

