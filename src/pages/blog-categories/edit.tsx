import React, { useEffect } from 'react';
import { Edit, useForm } from '@refinedev/antd';
import { Form, Input, Switch, InputNumber, Card, Row, Col, Space, Tooltip } from 'antd';
import { InfoCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import { BlogCategory } from '../../lib/supabase';
import { BlogCategoryImageSelector } from '../../components/media-selector/BlogCategoryImageSelector';

const { TextArea } = Input;

export const BlogCategoryEdit: React.FC = () => {
  const { formProps, saveButtonProps, queryResult } = useForm<BlogCategory>({
    resource: 'blog_categories',
    onMutationSuccess: (data) => {
      console.log('✅ Blog category updated successfully:', data);
    },
    onMutationError: (error) => {
      console.error('❌ Error updating blog category:', error);
      if (error.message.includes('PGRST116')) {
        console.error('❌ PGRST116 Error: Record not found or permission denied');
      }
    },
  });

  const renderInfoIcon = (tooltip: string) => (
    <Tooltip title={tooltip} placement="top">
      <InfoCircleOutlined style={{ color: '#1890ff', marginLeft: '8px' }} />
    </Tooltip>
  );

  // Custom form handler để xử lý dữ liệu
  const handleFormSubmit = (values: any) => {
    console.log('🔄 Form submit values:', values);
    console.log('🔄 Current record ID:', queryResult?.data?.data?.id);
    
    // Đảm bảo featured_image_id là string hoặc null
    let featuredImageId = values.featured_image_id;
    if (featuredImageId === '' || featuredImageId === undefined) {
      featuredImageId = null;
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
      color: values.color || '#3B82F6',
      featured_image_id: featuredImageId,
      is_active: isActive,
      sort_order: sortOrder,
    };
    
    console.log('✅ Cleaned values:', cleanedValues);
    console.log('🔄 Will update record with ID:', queryResult?.data?.data?.id);
    
    // Gọi formProps.onFinish với dữ liệu đã xử lý
    if (formProps.onFinish) {
      return formProps.onFinish(cleanedValues);
    }
    
    return cleanedValues;
  };

  // Debug form values
  useEffect(() => {
    console.log('🔍 Edit page - Form props:', formProps);
    console.log('🔍 Edit page - Save button props:', saveButtonProps);
    console.log('🔍 Edit page - Query result:', queryResult);
    console.log('🔍 Edit page - Query result data:', queryResult?.data);
    console.log('🔍 Edit page - Query result loading:', queryResult?.isLoading);
    console.log('🔍 Edit page - Query result error:', queryResult?.error);
  }, [formProps, saveButtonProps, queryResult]);

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <div className="blog-category-form-wrapper">
        <Form 
          {...formProps} 
          layout="vertical"
          onFinish={handleFormSubmit}
        >
          <Card 
            title={
              <Space>
                <FileTextOutlined style={{ color: '#13c2c2' }} />
                <span>Thông tin danh mục blog</span>
              </Space>
            }
            style={{ marginBottom: '24px' }}
          >
            <Row gutter={[24, 16]}>
              <Col xs={24} sm={24} md={12} lg={12}>
                <Form.Item
                  label={
                    <Space>
                      <span>Tên danh mục</span>
                      {renderInfoIcon('Tên hiển thị của danh mục blog, sẽ hiển thị trên website')}
                    </Space>
                  }
                  name="name"
                  rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
                >
                  <Input placeholder="Nhập tên danh mục blog" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12}>
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
                  <Input placeholder="ten-danh-muc-blog" />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item
              label={
                <Space>
                  <span>Mô tả</span>
                  {renderInfoIcon('Mô tả chi tiết về danh mục blog, giúp người đọc hiểu rõ hơn')}
                </Space>
              }
              name="description"
            >
              <TextArea rows={4} placeholder="Nhập mô tả danh mục" />
            </Form.Item>

            <Row gutter={[24, 16]}>
              <Col xs={24} sm={24} md={12} lg={12}>
                <Form.Item
                  label={
                    <Space>
                      <span>Ảnh đại diện</span>
                      {renderInfoIcon('Chọn ảnh đại diện cho danh mục blog từ thư viện media')}
                    </Space>
                  }
                  name="featured_image_id"
                >
                  <BlogCategoryImageSelector placeholder="Chọn ảnh đại diện cho danh mục blog" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12}>
                <Form.Item
                  label={
                    <Space>
                      <span>Màu sắc</span>
                      {renderInfoIcon('Màu sắc để phân biệt danh mục blog')}
                    </Space>
                  }
                  name="color"
                >
                  <Input placeholder="#3B82F6" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[24, 16]}>
              <Col xs={24} sm={24} md={12} lg={12}>
                <Form.Item
                  label={
                    <Space>
                      <span>Thứ tự sắp xếp</span>
                      {renderInfoIcon('Số càng nhỏ càng hiển thị trước, dùng để sắp xếp danh mục')}
                    </Space>
                  }
                  name="sort_order"
                  rules={[
                    { type: 'number', min: 0, message: 'Thứ tự phải là số >= 0!' }
                  ]}
                >
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12}>
                <Form.Item
                  label={
                    <Space>
                      <span>Trạng thái hoạt động</span>
                      {renderInfoIcon('Bật/tắt hiển thị danh mục blog trên website')}
                    </Space>
                  }
                  name="is_active"
                  valuePropName="checked"
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

export default BlogCategoryEdit;
