import React from 'react';
import { Form, Input, Select, Switch, InputNumber, Card, Row, Col, Typography, Space, Tooltip, Collapse, DatePicker } from 'antd';
import { InfoCircleOutlined, FileTextOutlined, EditOutlined, UserOutlined, PictureOutlined, SettingOutlined, CalendarOutlined } from '@ant-design/icons';
import MDEditor from '@uiw/react-md-editor';
import { SEOForm } from '../seo-form';

const { TextArea } = Input;
const { Title } = Typography;
const { Panel } = Collapse;

interface BlogPostFormProps {
  form: any;
  isEdit?: boolean;
  categorySelectProps?: any;
  authorSelectProps?: any;
}

export const BlogPostForm: React.FC<BlogPostFormProps> = ({ 
  form, 
  isEdit = false, 
  categorySelectProps,
  authorSelectProps
}) => {
  const renderInfoIcon = (tooltip: string) => (
    <Tooltip title={tooltip} placement="top">
      <InfoCircleOutlined style={{ color: '#1890ff', marginLeft: '8px' }} />
    </Tooltip>
  );

  return (
    <>
      <Collapse 
        defaultActiveKey={['basic', 'content', 'category', 'media', 'settings', 'schedule']} 
        ghost
        expandIconPosition="end"
        style={{ marginBottom: '24px' }}
      >
        {/* Thông tin cơ bản */}
        <Panel 
          header={
            <Space>
              <FileTextOutlined style={{ color: '#52c41a' }} />
              <span>Thông tin cơ bản</span>
            </Space>
          } 
          key="basic"
          style={{ marginBottom: '16px' }}
        >
          <Card style={{ border: 'none', boxShadow: 'none' }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label={
                    <Space>
                      <span>Tiêu đề bài viết</span>
                      {renderInfoIcon('Tiêu đề chính của bài viết, sẽ hiển thị trên website và kết quả tìm kiếm')}
                    </Space>
                  }
                  name="title"
                  rules={[{ required: true, message: 'Vui lòng nhập tiêu đề bài viết!' }]}
                >
                  <Input placeholder="Nhập tiêu đề bài viết" size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={
                    <Space>
                      <span>Slug</span>
                      {renderInfoIcon('URL thân thiện SEO, tự động tạo từ tiêu đề bài viết')}
                    </Space>
                  }
                  name="slug"
                  rules={[{ required: true, message: 'Vui lòng nhập slug!' }]}
                >
                  <Input placeholder="tieu-de-bai-viet" size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label={
                <Space>
                  <span>Tóm tắt</span>
                  {renderInfoIcon('Mô tả ngắn gọn nội dung bài viết, hiển thị trong danh sách bài viết')}
                </Space>
              }
              name="excerpt"
            >
              <TextArea rows={3} placeholder="Nhập tóm tắt bài viết" size="large" />
            </Form.Item>
          </Card>
        </Panel>

        {/* Nội dung bài viết */}
        <Panel 
          header={
            <Space>
              <EditOutlined style={{ color: '#13c2c2' }} />
              <span>Nội dung bài viết</span>
            </Space>
          } 
          key="content"
          style={{ marginBottom: '16px' }}
        >
          <Card style={{ border: 'none', boxShadow: 'none' }}>
            <Form.Item
              label={
                <Space>
                  <span>Nội dung</span>
                  {renderInfoIcon('Nội dung đầy đủ của bài viết, hỗ trợ Markdown để định dạng văn bản')}
                </Space>
              }
              name="content"
              rules={[{ required: true, message: 'Vui lòng nhập nội dung bài viết!' }]}
            >
              <MDEditor
                height={400}
                preview="edit"
                style={{ border: '1px solid #d9d9d9', borderRadius: '6px' }}
              />
            </Form.Item>
          </Card>
        </Panel>

        {/* Phân loại & Tác giả */}
        <Panel 
          header={
            <Space>
              <UserOutlined style={{ color: '#722ed1' }} />
              <span>Phân loại & Tác giả</span>
            </Space>
          } 
          key="category"
          style={{ marginBottom: '16px' }}
        >
          <Card style={{ border: 'none', boxShadow: 'none' }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label={
                    <Space>
                      <span>Danh mục blog</span>
                      {renderInfoIcon('Phân loại bài viết để dễ dàng quản lý và tìm kiếm')}
                    </Space>
                  }
                  name="category_id"
                  rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                >
                  <Select 
                    placeholder="Chọn danh mục blog" 
                    {...categorySelectProps} 
                    size="large" 
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={
                    <Space>
                      <span>Tác giả</span>
                      {renderInfoIcon('Người viết bài, tham chiếu đến bảng profiles')}
                    </Space>
                  }
                  name="author_id"
                  rules={[{ required: true, message: 'Vui lòng chọn tác giả!' }]}
                >
                  <Select 
                    placeholder="Chọn tác giả" 
                    {...authorSelectProps} 
                    size="large" 
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Panel>

        {/* Hình ảnh & Cài đặt */}
        <Panel 
          header={
            <Space>
              <PictureOutlined style={{ color: '#fa8c16' }} />
              <span>Hình ảnh & Cài đặt</span>
            </Space>
          } 
          key="media"
          style={{ marginBottom: '16px' }}
        >
          <Card style={{ border: 'none', boxShadow: 'none' }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label={
                    <Space>
                      <span>Ảnh đại diện ID</span>
                      {renderInfoIcon('ID của ảnh chính từ bảng media, ảnh này sẽ hiển thị đầu tiên')}
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
                      <span>Thời gian đọc (phút)</span>
                      {renderInfoIcon('Ước tính thời gian đọc bài viết, giúp người đọc chuẩn bị')}
                    </Space>
                  }
                  name="read_time"
                >
                  <InputNumber 
                    style={{ width: '100%' }} 
                    placeholder="5" 
                    min={1} 
                    size="large" 
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Panel>

        {/* Cài đặt bài viết */}
        <Panel 
          header={
            <Space>
              <SettingOutlined style={{ color: '#eb2f96' }} />
              <span>Cài đặt bài viết</span>
            </Space>
          } 
          key="settings"
          style={{ marginBottom: '16px' }}
        >
          <Card style={{ border: 'none', boxShadow: 'none' }}>
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item
                  label={
                    <Space>
                      <span>Trạng thái</span>
                      {renderInfoIcon('Trạng thái hiện tại của bài viết: nháp, đã xuất bản, hoặc lưu trữ')}
                    </Space>
                  }
                  name="status"
                  rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                >
                  <Select placeholder="Chọn trạng thái" size="large">
                    <Select.Option value="draft">Nháp</Select.Option>
                    <Select.Option value="published">Đã xuất bản</Select.Option>
                    <Select.Option value="archived">Lưu trữ</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label={
                    <Space>
                      <span>Nổi bật</span>
                      {renderInfoIcon('Đánh dấu bài viết nổi bật, hiển thị ở vị trí ưu tiên')}
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
                      <span>Ghim</span>
                      {renderInfoIcon('Ghim bài viết ở đầu trang, luôn hiển thị trước các bài khác')}
                    </Space>
                  }
                  name="is_pinned"
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
                      {renderInfoIcon('Cho phép Google và các công cụ tìm kiếm index trang bài viết')}
                    </Space>
                  }
                  name={['seo_data', 'is_indexed']}
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Panel>

        {/* Lịch xuất bản */}
        <Panel 
          header={
            <Space>
              <CalendarOutlined style={{ color: '#f5222d' }} />
              <span>Lịch xuất bản</span>
            </Space>
          } 
          key="schedule"
          style={{ marginBottom: '16px' }}
        >
          <Card style={{ border: 'none', boxShadow: 'none' }}>
            <Form.Item
              label={
                <Space>
                  <span>Thời gian xuất bản</span>
                  {renderInfoIcon('Thời gian bài viết sẽ được xuất bản, để trống để xuất bản ngay')}
                </Space>
              }
              name="published_at"
            >
              <DatePicker 
                showTime 
                placeholder="Chọn thời gian xuất bản" 
                style={{ width: '100%' }} 
                size="large"
              />
            </Form.Item>
          </Card>
        </Panel>
      </Collapse>

      {/* Thông tin SEO */}
      <SEOForm form={form} isEdit={isEdit} />
    </>
  );
};

