import React from 'react';
import { Create, useForm, useSelect } from '@refinedev/antd';
import { Form, Input, Select, Switch, Card, Row, Col, Space, Tooltip } from 'antd';
import { InfoCircleOutlined, FolderOutlined } from '@ant-design/icons';
import { Category } from '../../lib/supabase';

const { TextArea } = Input;

export const CategoryCreate: React.FC = () => {
  const { formProps, saveButtonProps } = useForm<Category>();
  const { selectProps: parentCategorySelectProps } = useSelect<Category>({
    resource: 'categories',
    optionLabel: 'name',
    optionValue: 'id',
  });

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
              <FolderOutlined style={{ color: '#52c41a' }} />
              <span>Thông tin danh mục</span>
            </Space>
          }
          style={{ marginBottom: '24px' }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={
                  <Space>
                    <span>Tên danh mục</span>
                    {renderInfoIcon('Tên hiển thị của danh mục, sẽ hiển thị trên website')}
                  </Space>
                }
                name="name"
                rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
              >
                <Input placeholder="Nhập tên danh mục" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <Space>
                    <span>Slug</span>
                    {renderInfoIcon('URL thân thiện SEO, tự động tạo từ tên danh mục')}
                  </Space>
                }
                name="slug"
                rules={[{ required: true, message: 'Vui lòng nhập slug!' }]}
              >
                <Input placeholder="ten-danh-muc" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={
                  <Space>
                    <span>Danh mục cha</span>
                    {renderInfoIcon('Danh mục cấp cao hơn, để tạo cấu trúc phân cấp')}
                  </Space>
                }
                name="parent_id"
              >
                <Select 
                  placeholder="Chọn danh mục cha (nếu có)" 
                  {...parentCategorySelectProps} 
                  size="large"
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <Space>
                    <span>Thứ tự hiển thị</span>
                    {renderInfoIcon('Số càng nhỏ càng hiển thị trước, dùng để sắp xếp danh mục')}
                  </Space>
                }
                name="sort_order"
                initialValue={0}
              >
                <Input placeholder="0" size="large" type="number" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={
              <Space>
                <span>Mô tả</span>
                {renderInfoIcon('Mô tả chi tiết về danh mục, giúp khách hàng hiểu rõ hơn')}
              </Space>
            }
            name="description"
          >
            <TextArea rows={4} placeholder="Mô tả danh mục" size="large" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={
                  <Space>
                    <span>ID ảnh đại diện</span>
                    {renderInfoIcon('ID của ảnh từ bảng media, ảnh này sẽ hiển thị cho danh mục')}
                  </Space>
                }
                name="featured_image_id"
              >
                <Input placeholder="Nhập ID ảnh từ media table" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <Space>
                    <span>Hoạt động</span>
                    {renderInfoIcon('Bật/tắt hiển thị danh mục trên website')}
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
