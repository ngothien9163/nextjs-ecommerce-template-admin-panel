import React from 'react';
import { Edit, useForm, useSelect } from '@refinedev/antd';
import { Form, Input, Switch, InputNumber, Select, Card, Row, Col, Space, Tooltip } from 'antd';
import { InfoCircleOutlined, FolderOutlined } from '@ant-design/icons';
import { Category } from '../../lib/supabase';

const { TextArea } = Input;

export const CategoryEdit: React.FC = () => {
  const { formProps, saveButtonProps, queryResult } = useForm<Category>();
  const { selectProps: parentCategorySelectProps } = useSelect<Category>({
    resource: 'categories',
    optionLabel: 'name',
    optionValue: 'id',
    filters: [
      {
        field: 'id',
        operator: 'ne',
        value: queryResult?.data?.data?.id,
      },
    ],
  });

  const renderInfoIcon = (tooltip: string) => (
    <Tooltip title={tooltip} placement="top">
      <InfoCircleOutlined style={{ color: '#1890ff', marginLeft: '8px' }} />
    </Tooltip>
  );

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <div className="category-form-wrapper">
        <Form {...formProps} layout="vertical">
          <Card 
            className="category-form-card"
            title={
              <Space>
                <FolderOutlined style={{ color: '#52c41a' }} />
                <span>Thông tin danh mục</span>
              </Space>
            }
          >
            <Row gutter={[24, 16]}>
              <Col xs={24} sm={24} md={12} lg={12}>
                <Form.Item
                  className="category-form-item"
                  label={
                    <Space>
                      <span>Tên danh mục</span>
                      {renderInfoIcon('Tên hiển thị của danh mục, sẽ hiển thị trên website')}
                    </Space>
                  }
                  name="name"
                  rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
                >
                  <Input placeholder="Nhập tên danh mục" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12}>
                <Form.Item
                  className="category-form-item"
                  label={
                    <Space>
                      <span>Slug</span>
                      {renderInfoIcon('URL thân thiện SEO, tự động tạo từ tên danh mục')}
                    </Space>
                  }
                  name="slug"
                  rules={[{ required: true, message: 'Vui lòng nhập slug!' }]}
                >
                  <Input placeholder="ten-danh-muc" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[24, 16]}>
              <Col xs={24} sm={24} md={12} lg={12}>
                <Form.Item
                  className="category-form-item"
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
                    allowClear
                    showSearch
                    optionFilterProp="children"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12}>
                <Form.Item
                  className="category-form-item"
                  label={
                    <Space>
                      <span>Thứ tự hiển thị</span>
                      {renderInfoIcon('Số càng nhỏ càng hiển thị trước, dùng để sắp xếp danh mục')}
                    </Space>
                  }
                  name="sort_order"
                  initialValue={0}
                >
                  <InputNumber min={0} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              className="category-form-item"
              label={
                <Space>
                  <span>Mô tả</span>
                  {renderInfoIcon('Mô tả chi tiết về danh mục, giúp khách hàng hiểu rõ hơn')}
                </Space>
              }
              name="description"
            >
              <TextArea rows={4} placeholder="Nhập mô tả danh mục" />
            </Form.Item>

            <Row gutter={[24, 16]}>
              <Col xs={24} sm={24} md={12} lg={12}>
                <Form.Item
                  className="category-form-item"
                  label={
                    <Space>
                      <span>URL hình ảnh</span>
                      {renderInfoIcon('Đường dẫn đến hình ảnh đại diện cho danh mục')}
                    </Space>
                  }
                  name="image_url"
                >
                  <Input placeholder="https://example.com/image.jpg" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12}>
                <Form.Item
                  className="category-form-item"
                  label={
                    <Space>
                      <span>Trạng thái hoạt động</span>
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

            <Row gutter={[24, 16]}>
              <Col xs={24} sm={24} md={12} lg={12}>
                <Form.Item
                  className="category-form-item"
                  label={
                    <Space>
                      <span>Tiêu đề SEO</span>
                      {renderInfoIcon('Tiêu đề hiển thị trên kết quả tìm kiếm, tối đa 60 ký tự')}
                    </Space>
                  }
                  name="meta_title"
                >
                  <Input placeholder="Tiêu đề SEO cho danh mục" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12}>
                <Form.Item
                  className="category-form-item"
                  label={
                    <Space>
                      <span>Mô tả SEO</span>
                      {renderInfoIcon('Mô tả hiển thị trên kết quả tìm kiếm, tối đa 160 ký tự')}
                    </Space>
                  }
                  name="meta_description"
                >
                  <TextArea rows={3} placeholder="Mô tả SEO cho danh mục" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Form>
      </div>
    </Edit>
  );
};
