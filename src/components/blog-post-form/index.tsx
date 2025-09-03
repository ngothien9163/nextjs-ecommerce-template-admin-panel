import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Switch, InputNumber, Card, Row, Col, Typography, Space, Tooltip, Collapse, DatePicker, Button, Image, Dropdown, Upload, message } from 'antd';
import { InfoCircleOutlined, FileTextOutlined, EditOutlined, UserOutlined, PictureOutlined, SettingOutlined, CalendarOutlined, EyeOutlined, SwapOutlined, DeleteOutlined, UploadOutlined, MoreOutlined } from '@ant-design/icons';
import MDEditor from '@uiw/react-md-editor';
import { EnhancedSEOForm } from '../enhanced-seo-form';
import { EnhancedImageSelector } from '../enhanced-image-selector';
import { supabase, supabaseUrl } from '../../lib/supabase';
import type { MediaItem } from '../../lib/supabase';
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
  const [featuredImage, setFeaturedImage] = useState<MediaItem | null>(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [pageUrl, setPageUrl] = useState('');

  // Load featured image data
  useEffect(() => {
    const imageId = form?.form?.getFieldValue('featured_image_id') || initialData?.featured_image_id;
    if (imageId) {
      loadFeaturedImage(imageId);
    }
  }, [initialData]);

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
  const loadFeaturedImage = async (imageId: string) => {
    try {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .eq('id', imageId)
        .single();
      
      if (data) {
        setFeaturedImage(data);
      }
    } catch (error) {
      console.error('Error loading featured image:', error);
    }
  };

  const handleImageSelect = (imageId: string, imageData: MediaItem) => {
    setFeaturedImage(imageData);
    form?.form?.setFieldsValue({ featured_image_id: imageId });
    setImageModalVisible(false);
  };

  const getImageUrl = (image: MediaItem) => {
    if (image.file_path) {
      return `${supabaseUrl}/storage/v1/object/public/media/${image.file_path}`;
    }
    return image.file_url || '/placeholder-image.jpg';
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
      <Form {...form}>
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
                  <Input 
                    placeholder="Nhập tiêu đề bài viết" 
                    size="large" 
                    style={{ width: '100%' }} 
                    onChange={handleTitleChange}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
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
                  extra={pageUrl && (
                    <span style={{ color: '#666', fontSize: '12px' }}>
                      URL trang: <code>{window.location.origin}{pageUrl}</code>
                    </span>
                  )}
                >
                  <Input 
                    placeholder="tieu-de-bai-viet" 
                    size="large" 
                    style={{ width: '100%' }} 
                    onChange={handleSlugChange}
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
            >
              <TextArea rows={3} placeholder="Nhập tóm tắt bài viết" size="large" style={{ width: '100%' }} />
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
                  <div className="featured-image-selector">
                    {featuredImage ? (
                      <div className="selected-image-preview">
                        <div className="image-container" style={{ position: 'relative' }}>
                          <Image
                            src={getImageUrl(featuredImage)}
                            alt={featuredImage.alt_text || featuredImage.file_name}
                            style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '6px' }}
                          />
                          
                          {/* Overlay với các action buttons */}
                          <div className="image-overlay" style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.3)',
                            borderRadius: '6px',
                            opacity: 0,
                            transition: 'opacity 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }} 
                          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                          onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                          >
                            <Space size="middle">
                              <Button 
                                type="primary"
                                icon={<SwapOutlined />}
                                onClick={() => setImageModalVisible(true)}
                                style={{ background: 'rgba(255,255,255,0.9)', border: 'none', color: '#1890ff' }}
                              >
                                Đổi ảnh
                              </Button>
                              <Button 
                                icon={<EyeOutlined />}
                                onClick={() => {
                                  Image.PreviewGroup.previewInstance.close();
                                  setTimeout(() => {
                                    const preview = new Image();
                                    preview.src = getImageUrl(featuredImage);
                                    preview.style.display = 'none';
                                    document.body.appendChild(preview);
                                    preview.click();
                                    document.body.removeChild(preview);
                                  }, 100);
                                }}
                                style={{ background: 'rgba(255,255,255,0.9)', border: 'none' }}
                              >
                                Xem
                              </Button>
                              <Button 
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => {
                                  setFeaturedImage(null);
                                  form?.form?.setFieldsValue({ featured_image_id: undefined });
                                  message.success('Đã xóa ảnh đại diện');
                                }}
                                style={{ background: 'rgba(255,255,255,0.9)', border: 'none', color: '#ff4d4f' }}
                              >
                                Xóa
                              </Button>
                            </Space>
                          </div>
                        </div>
                        
                        {/* Action buttons bên dưới */}
                        <div className="image-actions" style={{ marginTop: '12px' }}>
                          <Row gutter={8}>
                            <Col span={12}>
                              <Button 
                                block
                                icon={<SwapOutlined />} 
                                onClick={() => setImageModalVisible(true)}
                                type="default"
                              >
                                Thay đổi ảnh
                              </Button>
                            </Col>
                            <Col span={6}>
                              <Button 
                                block
                                icon={<EyeOutlined />}
                                onClick={() => {
                                  // Mở preview ảnh
                                  const img = new Image();
                                  img.src = getImageUrl(featuredImage);
                                  img.onload = () => {
                                    const newWindow = window.open('', '_blank');
                                    newWindow?.document.write(`
                                      <html>
                                        <head><title>Preview: ${featuredImage.file_name}</title></head>
                                        <body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#000;">
                                          <img src="${getImageUrl(featuredImage)}" style="max-width:100%;max-height:100vh;object-fit:contain;" />
                                        </body>
                                      </html>
                                    `);
                                  };
                                }}
                              >
                                Xem
                              </Button>
                            </Col>
                            <Col span={6}>
                              <Dropdown
                                menu={{
                                  items: [
                                    {
                                      key: 'info',
                                      label: 'Thông tin ảnh',
                                      icon: <InfoCircleOutlined />,
                                      onClick: () => {
                                        message.info(`
                                          Tên file: ${featuredImage.file_name}\n
                                          Kích thước: ${featuredImage.width}x${featuredImage.height}px\n
                                          Dung lượng: ${featuredImage.file_size ? Math.round(featuredImage.file_size / 1024) + ' KB' : 'N/A'}
                                        `);
                                      }
                                    },
                                    {
                                      key: 'upload',
                                      label: 'Tải ảnh mới',
                                      icon: <UploadOutlined />,
                                      onClick: () => window.open('/media/create', '_blank')
                                    },
                                    {
                                      type: 'divider'
                                    },
                                    {
                                      key: 'remove',
                                      label: 'Xóa ảnh đại diện',
                                      icon: <DeleteOutlined />,
                                      danger: true,
                                      onClick: () => {
                                        setFeaturedImage(null);
                                        form?.form?.setFieldsValue({ featured_image_id: undefined });
                                        message.success('Đã xóa ảnh đại diện');
                                      }
                                    }
                                  ]
                                }}
                                placement="bottomRight"
                              >
                                <Button 
                                  block
                                  icon={<MoreOutlined />}
                                >
                                  Khác
                                </Button>
                              </Dropdown>
                            </Col>
                          </Row>
                        </div>
                        
                        {/* Thông tin ảnh */}
                        <div style={{ marginTop: '8px', padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>
                          <Typography.Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
                            📁 {featuredImage.file_name}
                          </Typography.Text>
                          <Typography.Text type="secondary" style={{ fontSize: '11px', display: 'block' }}>
                            📐 {featuredImage.width}x{featuredImage.height}px
                            {featuredImage.file_size && ` • 💾 ${Math.round(featuredImage.file_size / 1024)} KB`}
                          </Typography.Text>
                          {featuredImage.alt_text && (
                            <Typography.Text type="secondary" style={{ fontSize: '11px', display: 'block' }}>
                              🏷️ {featuredImage.alt_text}
                            </Typography.Text>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="image-placeholder-selector">
                        <Card 
                          hoverable
                          style={{ 
                            height: '160px', 
                            display: 'flex', 
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            border: '2px dashed #d9d9d9',
                            background: '#fafafa'
                          }}
                          bodyStyle={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            height: '100%',
                            padding: '20px'
                          }}
                          onClick={() => setImageModalVisible(true)}
                        >
                          <PictureOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
                          <Typography.Text type="secondary" style={{ textAlign: 'center', marginBottom: '12px' }}>
                            Chọn ảnh đại diện cho bài viết
                          </Typography.Text>
                          <Space>
                            <Button 
                              type="primary"
                              icon={<PictureOutlined />}
                              onClick={(e) => {
                                e.stopPropagation();
                                setImageModalVisible(true);
                              }}
                            >
                              Chọn từ thư viện
                            </Button>
                            <Button 
                              icon={<UploadOutlined />}
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open('/media/create', '_blank');
                              }}
                            >
                              Tải lên mới
                            </Button>
                          </Space>
                        </Card>
                      </div>
                    )}
                  </div>
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

      {/* Enhanced Image Selector Modal */}
      <EnhancedImageSelector
        visible={imageModalVisible}
        onClose={() => setImageModalVisible(false)}
        onSelect={handleImageSelect}
        selectedImageId={featuredImage?.id}
        title="Chọn ảnh đại diện cho bài viết"
        contextType="blog"
      />
      </Form>
    </div>
  );
};

