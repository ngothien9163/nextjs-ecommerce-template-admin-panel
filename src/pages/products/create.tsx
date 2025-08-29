import React from 'react';
import { Create, useForm } from '@refinedev/antd';
import { Form, Input, Switch, InputNumber, Select, Upload, Button, Row, Col, Divider, Card, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Product } from '../../lib/supabase';

const { TextArea } = Input;
const { Title } = Typography;

export const ProductCreate: React.FC = () => {
  const { formProps, saveButtonProps } = useForm<Product>();

  const warrantyOptions = [
    { label: '3 tháng', value: '3 months' },
    { label: '6 tháng', value: '6 months' },
    { label: '12 tháng', value: '12 months' },
    { label: '18 tháng', value: '18 months' },
    { label: '24 tháng', value: '24 months' },
    { label: '36 tháng', value: '36 months' },
    { label: 'Trọn đời', value: 'Lifetime' },
  ];

  const returnPolicyOptions = [
    { label: '7 ngày', value: '7 days' },
    { label: '15 ngày', value: '15 days' },
    { label: '30 ngày', value: '30 days' },
    { label: '45 ngày', value: '45 days' },
    { label: '60 ngày', value: '60 days' },
    { label: '90 ngày', value: '90 days' },
    { label: 'Không đổi trả', value: 'No return' },
  ];

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        {/* Thông tin cơ bản */}
        <Card title="Thông tin cơ bản" style={{ marginBottom: '24px' }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Tên sản phẩm"
                name="name"
                rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
              >
                <Input placeholder="Nhập tên sản phẩm" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Slug"
                name="slug"
                rules={[{ required: true, message: 'Vui lòng nhập slug!' }]}
              >
                <Input placeholder="ten-san-pham" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Danh mục"
                name="category_id"
                rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
              >
                <Select placeholder="Chọn danh mục">
                  <Select.Option value="category1">Laptop</Select.Option>
                  <Select.Option value="category2">Smartphone</Select.Option>
                  <Select.Option value="category3">Tablet</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Thương hiệu"
                name="brand"
              >
                <Input placeholder="Nhập thương hiệu" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="SKU"
                name="sku"
              >
                <Input placeholder="Nhập mã SKU" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Ảnh đại diện ID"
                name="featured_image_id"
              >
                <Input placeholder="Nhập ID ảnh từ media table" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Thông tin giá cả */}
        <Card title="Thông tin giá cả" style={{ marginBottom: '24px' }}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Giá gốc"
                name="price"
                rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="0"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Giá khuyến mãi"
                name="sale_price"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="0"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Giá vốn"
                name="cost_price"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="0"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Thông tin kho hàng */}
        <Card title="Thông tin kho hàng" style={{ marginBottom: '24px' }}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Số lượng tồn kho"
                name="stock_quantity"
                rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
              >
                <InputNumber style={{ width: '100%' }} placeholder="0" min={0} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Mức tồn kho tối thiểu"
                name="min_stock_level"
              >
                <InputNumber style={{ width: '100%' }} placeholder="5" min={0} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Mức tồn kho tối đa"
                name="max_stock_level"
              >
                <InputNumber style={{ width: '100%' }} placeholder="100" min={0} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Trọng lượng (kg)"
                name="weight"
              >
                <InputNumber style={{ width: '100%' }} placeholder="0.5" min={0} step={0.1} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Kích thước (JSON)"
                name="dimensions"
              >
                <Input placeholder='{"length": 10, "width": 5, "height": 2}' />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Bảo hành & Đổi trả */}
        <Card title="Bảo hành & Đổi trả" style={{ marginBottom: '24px' }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Thời hạn bảo hành"
                name="warranty"
              >
                <Select placeholder="Chọn thời hạn bảo hành">
                  {warrantyOptions.map(option => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Chính sách đổi trả"
                name="return_policy"
              >
                <Select placeholder="Chọn chính sách đổi trả">
                  {returnPolicyOptions.map(option => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Thông tin SEO */}
        <Card title="Thông tin SEO" style={{ marginBottom: '24px' }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Meta Title"
                name={['seo_data', 'page_title']}
              >
                <Input placeholder="Tiêu đề trang cho SEO" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Meta Description"
                name={['seo_data', 'meta_description']}
              >
                <TextArea rows={3} placeholder="Mô tả meta cho SEO" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Meta Keywords"
                name={['seo_data', 'meta_keywords']}
              >
                <Select
                  mode="tags"
                  placeholder="Nhập từ khóa SEO"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Canonical URL"
                name={['seo_data', 'canonical_url']}
              >
                <Input placeholder="https://example.com/product" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Open Graph Title"
                name={['seo_data', 'og_title']}
              >
                <Input placeholder="Tiêu đề Open Graph" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Open Graph Description"
                name={['seo_data', 'og_description']}
              >
                <TextArea rows={3} placeholder="Mô tả Open Graph" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Twitter Title"
                name={['seo_data', 'twitter_title']}
              >
                <Input placeholder="Tiêu đề Twitter" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Twitter Description"
                name={['seo_data', 'twitter_description']}
              >
                <TextArea rows={3} placeholder="Mô tả Twitter" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Mô tả sản phẩm */}
        <Card title="Mô tả sản phẩm" style={{ marginBottom: '24px' }}>
          <Form.Item
            label="Mô tả ngắn"
            name="short_description"
          >
            <TextArea rows={3} placeholder="Mô tả ngắn gọn sản phẩm" />
          </Form.Item>

          <Form.Item
            label="Mô tả chi tiết"
            name="description"
          >
            <TextArea rows={6} placeholder="Mô tả chi tiết sản phẩm" />
          </Form.Item>
        </Card>

        {/* Trạng thái */}
        <Card title="Trạng thái" style={{ marginBottom: '24px' }}>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                label="Hoạt động"
                name="is_active"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Nổi bật"
                name="is_featured"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Bán chạy"
                name="is_bestseller"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Được index"
                name={['seo_data', 'is_indexed']}
                valuePropName="checked"
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
