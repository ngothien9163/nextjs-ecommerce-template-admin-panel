import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Switch, InputNumber, Card, Row, Col, Typography, Space, Tooltip, Collapse, DatePicker, Button, Image, Dropdown, Upload, message } from 'antd';
import { InfoCircleOutlined, FileTextOutlined, EditOutlined, UserOutlined, PictureOutlined, SettingOutlined, CalendarOutlined, EyeOutlined, SwapOutlined, DeleteOutlined, UploadOutlined, MoreOutlined } from '@ant-design/icons';
import MDEditor from '@uiw/react-md-editor';
import { EnhancedSEOForm } from '../enhanced-seo-form';
import { BlogPostImageSelector } from '../media-selector/BlogPostImageSelector';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import '../../styles/blog-posts-enhanced.css';

// Configure dayjs
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('vi');

const { TextArea } = Input;
const { Title } = Typography;
const { Panel } = Collapse;

interface BlogPostFormProps {
  form: any;
  isEdit?: boolean;
  categorySelectProps?: any;
  authorSelectProps?: any;
  initialData?: any;
}

export const BlogPostForm: React.FC<BlogPostFormProps> = ({
  form,
  isEdit = false,
  categorySelectProps,
  authorSelectProps,
  initialData
}) => {
  const [pageUrl, setPageUrl] = useState('');

  // Generate slug and page URL from title
  const generateSlugFromTitle = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim()
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  };

  // Update slug and page URL when title changes
  const handleTitleChange = (e: any) => {
    const title = e.target.value;
    if (title) { // Generate for both new and edit
      const generatedSlug = generateSlugFromTitle(title);
      // Only auto-set if slug is empty or matches old title pattern
      const currentSlug = form?.form?.getFieldValue('slug');
      if (!currentSlug || !isEdit) {
        form?.form?.setFieldsValue({ slug: generatedSlug });
        setPageUrl(`/blog/${generatedSlug}`);
      }
    }
  };

  // Update page URL when slug changes
  const handleSlugChange = (e: any) => {
    const slug = e.target.value;
    setPageUrl(`/blog/${slug}`);
  };

  // Generate page URL from initial slug
  useEffect(() => {
    const slug = form?.form?.getFieldValue('slug') || initialData?.slug;
    if (slug) {
      setPageUrl(`/blog/${slug}`);
    }
  }, [initialData]);

  // Only log when form is about to be submitted

  // Debug form submission
  const handleFormFinish = (values: any) => {
    console.log('📝 [BlogPostForm] SAVE - Form submitted, featured_image_id:', values.featured_image_id);

    // Call the original onFinish if it exists
    if (form?.onFinish) {
      return form.onFinish(values);
    }
  };

  // Force all input fields to be full width
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

  const renderInfoIcon = (tooltip: string) => (
    <Tooltip title={tooltip} placement="top">
      <InfoCircleOutlined style={{ color: '#1890ff', marginLeft: '8px' }} />
    </Tooltip>
  );

  return (
    <div className="blog-post-form">
      <Form {...form} onFinish={handleFormFinish}>
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
              <Col span={24}>
                <Form.Item
                  label={
                    <Space>
                      <span>Tiêu đề bài viết</span>
                      {renderInfoIcon('Tiêu đề chính của bài viết, sẽ hiển thị trên website và kết quả tìm kiếm')}
                    </Space>
                  }
                  name="title"
                  rules={[{ required: true, message: 'Vui lòng nhập tiêu đề bài viết!' }]}
                  extra="Khuyến nghị: 30-70 ký tự cho SEO tối ưu"
                >
                  <Input
                    placeholder="Nhập tiêu đề bài viết"
                    size="large"
                    style={{ width: '100%' }}
                    onChange={handleTitleChange}
                    showCount
                    maxLength={100}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label={
                    <Space>
                      <span>Slug</span>
                      {renderInfoIcon('URL thân thiện SEO, tự động tạo từ tiêu đề bài viết. Bạn có thể chỉnh sửa nếu cần.')}
                      <Button
                        size="small"
                        type="link"
                        onClick={() => {
                          const title = form?.form?.getFieldValue('title');
                          if (title) {
                            const generatedSlug = generateSlugFromTitle(title);
                            form?.form?.setFieldsValue({ slug: generatedSlug });
                            setPageUrl(`/blog/${generatedSlug}`);
                          }
                        }}
                      >
                        Tạo lại từ tiêu đề
                      </Button>
                    </Space>
                  }
                  name="slug"
                  rules={[{ required: true, message: 'Vui lòng nhập slug!' }]}
                  extra={
                    <div>
                      <div style={{ color: '#666', fontSize: '12px', marginBottom: '4px' }}>
                        Khuyến nghị: 3-50 ký tự cho SEO tối ưu
                      </div>
                      {pageUrl && (
                        <span style={{ color: '#666', fontSize: '12px' }}>
                          URL trang: <code>{window.location.origin}{pageUrl}</code>
                        </span>
                      )}
                    </div>
                  }
                >
                  <Input
                    placeholder="tieu-de-bai-viet"
                    size="large"
                    style={{ width: '100%' }}
                    onChange={handleSlugChange}
                    showCount
                    maxLength={100}
                  />
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
              extra="Khuyến nghị: 120-160 ký tự cho SEO tối ưu"
            >
              <TextArea
                rows={3}
                placeholder="Nhập tóm tắt bài viết"
                size="large"
                style={{ width: '100%' }}
                showCount
                maxLength={300}
              />
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
                     style={{ width: '100%' }}
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
                     style={{ width: '100%' }}
                   />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Panel>

        {/* Hình ảnh & Media */}
        <Panel 
          header={
            <Space>
              <PictureOutlined style={{ color: '#fa8c16' }} />
              <span>Hình ảnh & Media</span>
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
                      <span>Ảnh đại diện</span>
                      {renderInfoIcon('Ảnh chính hiển thị cho bài viết trên danh sách và trang chi tiết')}
                    </Space>
                  }
                  name="featured_image_id"
                >
                  <BlogPostImageSelector placeholder="Chọn ảnh đại diện cho bài viết" />
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
                
                <Form.Item
                  label={
                    <Space>
                      <span>Lượt xem</span>
                      {renderInfoIcon('Số lượt xem bài viết, được cập nhật tự động')}
                    </Space>
                  }
                  name="view_count"
                >
                  <InputNumber 
                    style={{ width: '100%' }} 
                    placeholder="0" 
                    min={0} 
                    size="large"
                    disabled={!isEdit}
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
              <Col span={9}>
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
                                     <Select placeholder="Chọn trạng thái" size="large" style={{ width: '100%' }}>
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
              getValueFromEvent={(value) => {
                // Convert dayjs object to ISO string for database
                return value ? dayjs(value).toISOString() : null;
              }}
              getValueProps={(value) => {
                // Convert ISO string from database to dayjs object for DatePicker
                return {
                  value: value ? dayjs(value) : null
                };
              }}
            >
              <DatePicker 
                showTime 
                placeholder="Chọn thời gian xuất bản" 
                style={{ width: '100%' }} 
                size="large"
                format="DD/MM/YYYY HH:mm:ss"
              />
            </Form.Item>
          </Card>
        </Panel>
      </Collapse>

      {/* Enhanced SEO Form */}
      <EnhancedSEOForm
        form={form}
        isEdit={isEdit}
        referenceType="blog"
        referenceId={initialData?.id}
        pageUrl={pageUrl}
        onSEODataChange={(seoData) => {
          // Auto-sync page URL to SEO form
          if (pageUrl && seoData) {
            form?.form?.setFieldsValue({
              seo_data: {
                ...seoData,
                page_url: pageUrl
              }
            });
          }
        }}
      />

      </Form>
    </div>
  );
};

