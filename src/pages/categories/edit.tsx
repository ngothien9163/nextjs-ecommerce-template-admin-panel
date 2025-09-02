import React, { useEffect } from 'react';
import { Edit, useForm, useSelect } from '@refinedev/antd';
import { Form, Input, Switch, InputNumber, Select, Card, Row, Col, Space, Tooltip } from 'antd';
import { InfoCircleOutlined, FolderOutlined } from '@ant-design/icons';
import { Category } from '../../lib/supabase';
import { CategoryImageSelector } from '../../components/media-selector/CategoryImageSelector';

const { TextArea } = Input;

export const CategoryEdit: React.FC = () => {
  const { formProps, saveButtonProps, queryResult } = useForm<Category>({
    onMutationSuccess: (data) => {
      console.log('✅ Category updated successfully:', data);
    },
    onMutationError: (error) => {
      console.error('❌ Error updating category:', error);
    },
  });
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

  // Custom form handler để xử lý dữ liệu
  const handleFormSubmit = (values: any) => {
    console.log('🔄 Form submit values:', values);
    
    // Đảm bảo featured_image_id là string hoặc null
    let featuredImageId = values.featured_image_id;
    if (featuredImageId === '' || featuredImageId === undefined) {
      featuredImageId = null;
    }
    
    // Đảm bảo parent_id là string hoặc null
    let parentId = values.parent_id;
    if (parentId === '' || parentId === undefined) {
      parentId = null;
    }
    
    // Đảm bảo sort_order là number
    let sortOrder = values.sort_order;
    if (sortOrder === '' || sortOrder === undefined) {
      sortOrder = 0;
    } else {
      sortOrder = Number(sortOrder);
    }
    
    // Đảm bảo is_active là boolean
    let isActive = values.is_active;
    if (isActive === undefined) {
      isActive = true;
    }
    
    const cleanedValues = {
      name: values.name,
      slug: values.slug,
      description: values.description || null,
      parent_id: parentId,
      featured_image_id: featuredImageId,
      is_active: isActive,
      sort_order: sortOrder,
    };
    
    console.log('✅ Cleaned values:', cleanedValues);
    
    // Gọi formProps.onFinish với dữ liệu đã xử lý
    if (formProps.onFinish) {
      return formProps.onFinish(cleanedValues);
    }
    
    return cleanedValues;
  };

  // Debug form values
  useEffect(() => {
    console.log('🔍 Form props:', formProps);
    console.log('🔍 Save button props:', saveButtonProps);
    console.log('🔍 Query result:', queryResult?.data?.data);
  }, [formProps, saveButtonProps, queryResult]);

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <div className="category-form-wrapper">
        <Form 
          {...formProps} 
          layout="vertical"
          onFinish={handleFormSubmit}
        >
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
                  rules={[
                    { type: 'number', min: 0, message: 'Thứ tự phải là số >= 0!' }
                  ]}
                >
                  <InputNumber min={0} style={{ width: '100%' }} />
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
                      <span>Ảnh đại diện</span>
                      {renderInfoIcon('Chọn ảnh đại diện cho danh mục từ thư viện media')}
                    </Space>
                  }
                  name="featured_image_id"
                >
                  <CategoryImageSelector placeholder="Chọn ảnh đại diện cho danh mục" />
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
          </Card>
        </Form>
      </div>
    </Edit>
  );
};
