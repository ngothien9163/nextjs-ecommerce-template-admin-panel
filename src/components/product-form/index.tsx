import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Select, Switch, Space, Row, Col, Card, Typography, Tooltip, Collapse, Button } from 'antd';
import { InfoCircleOutlined, ShoppingOutlined, DollarOutlined, InboxOutlined, SafetyOutlined, FileTextOutlined, SettingOutlined } from '@ant-design/icons';
import { SEOForm } from '../seo-form';
import '../../styles/product-form-styles.css';
import { CategoryImageSelector } from '../media-selector/CategoryImageSelector';
import { JsonField } from '../JsonField';

const { TextArea } = Input;
const { Title } = Typography;
const { Panel } = Collapse;

interface ProductFormProps {
  form: any;
  isEdit?: boolean;
  categorySelectProps?: any;
}

export const ProductForm: React.FC<ProductFormProps> = ({ 
  form, 
  isEdit = false, 
  categorySelectProps 
}) => {
  // Force all input fields to be full width - Commented out to avoid conflicts with category forms
  /*
  useEffect(() => {
    const forceFullWidth = () => {
      const inputs = document.querySelectorAll('.ant-input, .ant-input-number, .ant-select, .ant-textarea, .ant-picker');
      inputs.forEach((input: any) => {
        if (input) {
          input.style.width = '100%';
          input.style.maxWidth = '100%';
          input.style.minWidth = '100%';
          input.style.boxSizing = 'border-box';
        }
      });
    };

    // Run immediately
    forceFullWidth();
    
    // Run after a short delay to catch any dynamically added elements
    setTimeout(forceFullWidth, 100);
    setTimeout(forceFullWidth, 500);
    setTimeout(forceFullWidth, 1000);
  }, []);
  */

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

  const renderInfoIcon = (tooltip: string) => (
    <Tooltip title={tooltip} placement="top">
      <InfoCircleOutlined style={{ color: '#1890ff', marginLeft: '8px' }} />
    </Tooltip>
  );

  return (
    <div className="product-form-wrapper">
      <Form {...form}>
        <Collapse 
          defaultActiveKey={['basic', 'pricing', 'inventory', 'warranty', 'description', 'status']} 
          ghost
          expandIconPosition="end"
          style={{ marginBottom: '24px' }}
        >
        {/* Thông tin cơ bản */}
        <Panel 
          header={
            <Space>
              <ShoppingOutlined style={{ color: '#52c41a' }} />
              <span>Thông tin cơ bản</span>
            </Space>
          } 
          key="basic"
          style={{ marginBottom: '16px' }}
        >
          <Card style={{ border: 'none', boxShadow: 'none' }}>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  label={
                    <Space>
                      <span>Tên sản phẩm</span>
                      {renderInfoIcon('Tên đầy đủ của sản phẩm, sẽ hiển thị trên website và kết quả tìm kiếm')}
                    </Space>
                  }
                  name="name"
                  rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
                >
                  <Input placeholder="Nhập tên sản phẩm" size="large" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label={
                    <Space>
                      <span>Slug</span>
                      {renderInfoIcon('URL thân thiện SEO, tự động tạo từ tên sản phẩm. Ví dụ: ten-san-pham')}
                    </Space>
                  }
                  name="slug"
                  rules={[{ required: true, message: 'Vui lòng nhập slug!' }]}
                >
                  <Input placeholder="ten-san-pham" size="large" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={
                    <Space>
                      <span>Danh mục</span>
                      {renderInfoIcon('Phân loại sản phẩm để dễ dàng quản lý và tìm kiếm')}
                    </Space>
                  }
                  name="category_id"
                  rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                >
                  <Select 
                    placeholder="Chọn danh mục" 
                    {...categorySelectProps} 
                    size="large" 
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label={
                    <Space>
                      <span>Thương hiệu</span>
                      {renderInfoIcon('Thương hiệu sản xuất sản phẩm, giúp khách hàng nhận diện')}
                    </Space>
                  }
                  name="brand"
                >
                  <Input placeholder="Nhập thương hiệu" size="large" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={
                    <Space>
                      <span>SKU</span>
                      {renderInfoIcon('Mã sản phẩm duy nhất, dùng để quản lý kho hàng và đơn hàng')}
                    </Space>
                  }
                  name="sku"
                >
                  <Input placeholder="Nhập mã SKU" size="large" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  label={
                    <Space>
                      <span>Ảnh đại diện</span>
                      {renderInfoIcon('Chọn ảnh chính từ thư viện media, ảnh này sẽ hiển thị đầu tiên')}
                    </Space>
                  }
                  name="featured_image_id"
                >
                  <CategoryImageSelector placeholder="Chọn ảnh đại diện cho sản phẩm" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Panel>

        {/* Thông tin giá cả */}
        <Panel 
          header={
            <Space>
              <DollarOutlined style={{ color: '#13c2c2' }} />
              <span>Thông tin giá cả</span>
            </Space>
          } 
          key="pricing"
          style={{ marginBottom: '16px' }}
        >
          <Card style={{ border: 'none', boxShadow: 'none' }}>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item
                  label={
                    <Space>
                      <span>Giá gốc</span>
                      {renderInfoIcon('Giá bán chính thức của sản phẩm, hiển thị cho khách hàng')}
                    </Space>
                  }
                  name="price"
                  rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="0"
                    size="large"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label={
                    <Space>
                      <span>Giá khuyến mãi</span>
                      {renderInfoIcon('Giá đặc biệt khi có chương trình khuyến mãi, giảm giá')}
                    </Space>
                  }
                  name="sale_price"
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="0"
                    size="large"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label={
                    <Space>
                      <span>Giá vốn</span>
                      {renderInfoIcon('Giá nhập sản phẩm, dùng để tính toán lợi nhuận')}
                    </Space>
                  }
                  name="cost_price"
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="0"
                    size="large"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Panel>

        {/* Thông tin kho hàng */}
        <Panel 
          header={
            <Space>
              <InboxOutlined style={{ color: '#722ed1' }} />
              <span>Thông tin kho hàng</span>
            </Space>
          } 
          key="inventory"
          style={{ marginBottom: '16px' }}
        >
          <Card style={{ border: 'none', boxShadow: 'none' }}>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item
                  label={
                    <Space>
                      <span>Số lượng tồn kho</span>
                      {renderInfoIcon('Số lượng sản phẩm hiện có trong kho, ảnh hưởng đến khả năng bán hàng')}
                    </Space>
                  }
                  name="stock_quantity"
                  rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
                >
                  <InputNumber style={{ width: '100%' }} placeholder="0" min={0} size="large" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label={
                    <Space>
                      <span>Mức tồn kho tối thiểu</span>
                      {renderInfoIcon('Số lượng tối thiểu để cảnh báo khi cần nhập thêm hàng')}
                    </Space>
                  }
                  name="min_stock_level"
                >
                  <InputNumber style={{ width: '100%' }} placeholder="5" min={0} size="large" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label={
                    <Space>
                      <span>Mức tồn kho tối đa</span>
                      {renderInfoIcon('Số lượng tối đa để tránh tồn kho quá nhiều')}
                    </Space>
                  }
                  name="max_stock_level"
                >
                  <InputNumber style={{ width: '100%' }} placeholder="100" min={0} size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label={
                    <Space>
                      <span>Trọng lượng (kg)</span>
                      {renderInfoIcon('Trọng lượng sản phẩm, dùng để tính phí vận chuyển')}
                    </Space>
                  }
                  name="weight"
                >
                  <InputNumber style={{ width: '100%' }} placeholder="0.5" min={0} step={0.1} size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={
                    <Space>
                      <span>Kích thước (JSON)</span>
                      {renderInfoIcon('Kích thước sản phẩm dạng JSON, bao gồm chiều dài, rộng, cao')}
                    </Space>
                  }
                  name="dimensions"
                  extra={
                    <Button size="small" onClick={() => {
                      const example = { length: 10, width: 5, height: 2, unit: 'cm' };
                      (form as any)?.form?.setFieldsValue({ dimensions: example });
                    }}>Tạo dữ liệu thông minh</Button>
                  }
                >
                  <JsonField height={220} />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Panel>

        {/* Bảo hành & Đổi trả */}
        <Panel 
          header={
            <Space>
              <SafetyOutlined style={{ color: '#fa8c16' }} />
              <span>Bảo hành & Đổi trả</span>
            </Space>
          } 
          key="warranty"
          style={{ marginBottom: '16px' }}
        >
          <Card style={{ border: 'none', boxShadow: 'none' }}>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label={
                    <Space>
                      <span>Thời hạn bảo hành</span>
                      {renderInfoIcon('Thời gian bảo hành sản phẩm, cam kết với khách hàng')}
                    </Space>
                  }
                  name="warranty"
                >
                  <Select placeholder="Chọn thời hạn bảo hành" size="large" style={{ width: '100%' }}>
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
                  label={
                    <Space>
                      <span>Chính sách đổi trả</span>
                      {renderInfoIcon('Thời gian cho phép khách hàng đổi trả sản phẩm')}
                    </Space>
                  }
                  name="return_policy"
                >
                  <Select placeholder="Chọn chính sách đổi trả" size="large" style={{ width: '100%' }}>
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
        </Panel>

        {/* Mô tả sản phẩm */}
        <Panel 
          header={
            <Space>
              <FileTextOutlined style={{ color: '#eb2f96' }} />
              <span>Mô tả sản phẩm</span>
            </Space>
          } 
          key="description"
          style={{ marginBottom: '16px' }}
        >
          <Card style={{ border: 'none', boxShadow: 'none' }}>
            <Form.Item
              label={
                <Space>
                  <span>Mô tả ngắn</span>
                  {renderInfoIcon('Mô tả ngắn gọn sản phẩm, hiển thị trong danh sách sản phẩm')}
                </Space>
              }
              name="short_description"
            >
              <TextArea rows={3} placeholder="Mô tả ngắn gọn sản phẩm" size="large" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label={
                <Space>
                  <span>Mô tả chi tiết</span>
                  {renderInfoIcon('Mô tả đầy đủ tính năng, thông số kỹ thuật của sản phẩm')}
                </Space>
              }
              name="description"
            >
              <TextArea rows={6} placeholder="Mô tả chi tiết sản phẩm" size="large" style={{ width: '100%' }} />
            </Form.Item>
          </Card>
        </Panel>

        {/* Trạng thái */}
        <Panel 
          header={
            <Space>
              <SettingOutlined style={{ color: '#f5222d' }} />
              <span>Trạng thái</span>
            </Space>
          } 
          key="status"
          style={{ marginBottom: '16px' }}
        >
          <Card style={{ border: 'none', boxShadow: 'none' }}>
            <Row gutter={24}>
              <Col span={6}>
                <Form.Item
                  label={
                    <Space>
                      <span>Hoạt động</span>
                      {renderInfoIcon('Bật/tắt hiển thị sản phẩm trên website')}
                    </Space>
                  }
                  name="is_active"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label={
                    <Space>
                      <span>Nổi bật</span>
                      {renderInfoIcon('Đánh dấu sản phẩm nổi bật, hiển thị ở vị trí ưu tiên')}
                    </Space>
                  }
                  name="is_featured"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label={
                    <Space>
                      <span>Bán chạy</span>
                      {renderInfoIcon('Đánh dấu sản phẩm bán chạy, hiển thị trong danh sách bestseller')}
                    </Space>
                  }
                  name="is_bestseller"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label={
                    <Space>
                      <span>Được index</span>
                      {renderInfoIcon('Cho phép Google và các công cụ tìm kiếm index trang sản phẩm')}
                    </Space>
                  }
                  name={["seo_data", "is_indexed"]}
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Panel>
      </Collapse>

      {/* Thông tin SEO */}
      <SEOForm form={form} isEdit={isEdit} />
    </Form>
    </div>
  );
};

