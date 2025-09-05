import React, { useState, useEffect } from 'react';
import { Modal, Card, Row, Col, Input, Select, Button, Space, Typography, Tag, Spin, Empty, Image, Tooltip, Upload } from 'antd';
import { SearchOutlined, PictureOutlined, EyeOutlined, UploadOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import { supabase, supabaseUrl } from '../../lib/supabase';
import type { MediaItem } from '../../lib/supabase';
import './enhanced-image-selector.css';

const { Search } = Input;
const { Title, Text } = Typography;
const { Meta } = Card;

interface EnhancedImageSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (imageId: string, imageData: MediaItem) => void;
  selectedImageId?: string;
  title?: string;
  multiple?: boolean;
  allowUpload?: boolean;
  contextType?: 'blog' | 'product' | 'category' | 'general';
}

export const EnhancedImageSelector: React.FC<EnhancedImageSelectorProps> = ({
  visible,
  onClose,
  onSelect,
  selectedImageId,
  title = 'Chọn hình ảnh',
  multiple = false,
  allowUpload = true,
  contextType = 'general'
}) => {
  const [images, setImages] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [filterFormat, setFilterFormat] = useState('all');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const pageSize = 20;

  useEffect(() => {
    if (visible) {
      loadImages(true);
    }
  }, [visible, searchText, sortBy, filterFormat]);

  useEffect(() => {
    if (selectedImageId) {
      setSelectedImages([selectedImageId]);
    }
  }, [selectedImageId]);

  const loadImages = async (reset = false) => {
    try {
      setLoading(true);
      const currentPage = reset ? 1 : page;
      const offset = (currentPage - 1) * pageSize;

      let query = supabase
        .from('medias')
        .select('*')
        .eq('is_active', true)
        .order(sortBy, { ascending: false })
        .range(offset, offset + pageSize - 1);

      // Apply search filter
      if (searchText) {
        query = query.or(`file_name.ilike.%${searchText}%,alt_text.ilike.%${searchText}%,title.ilike.%${searchText}%`);
      }

      // Apply format filter
      if (filterFormat !== 'all') {
        query = query.eq('image_format', filterFormat.toUpperCase());
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error loading images:', error);
        return;
      }

      if (reset) {
        setImages(data || []);
        setPage(2);
      } else {
        setImages(prev => [...prev, ...(data || [])]);
        setPage(prev => prev + 1);
      }

      setHasMore((data || []).length === pageSize);
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (image: MediaItem) => {
    if (multiple) {
      setSelectedImages(prev => {
        if (prev.includes(image.id)) {
          return prev.filter(id => id !== image.id);
        } else {
          return [...prev, image.id];
        }
      });
    } else {
      // Single selection - always allow selection/reselection
      setSelectedImages([image.id]);
      onSelect(image.id, image);
      // Don't auto-close so user can see their selection
      // onClose();
    }
  };

  const handleConfirmSelection = () => {
    if (multiple && selectedImages.length > 0) {
      // For multiple selection, we need to pass all selected images
      const selectedImageData = images.filter(img => selectedImages.includes(img.id));
      // For now, just pass the first one for compatibility
      if (selectedImageData.length > 0) {
        onSelect(selectedImageData[0].id, selectedImageData[0]);
      }
    }
    onClose();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getImageUrl = (image: MediaItem) => {
    // Construct Supabase storage URL
    if (image.file_path) {
      return `${supabaseUrl}/storage/v1/object/public/media/${image.file_path}`;
    }
    return image.file_url || '/placeholder-image.jpg';
  };

  const renderImageCard = (image: MediaItem) => {
    const isSelected = selectedImages.includes(image.id);
    const imageUrl = getImageUrl(image);

    return (
      <Col xs={24} sm={12} md={8} lg={6} key={image.id}>
        <Card
          className={`image-selector-card ${isSelected ? 'selected' : ''}`}
          hoverable
          onClick={() => handleImageClick(image)}
          cover={
            <div className="image-cover-container">
              <Image
                src={imageUrl}
                alt={image.alt_text || image.file_name}
                preview={false}
                className="image-cover"
                placeholder={
                  <div className="image-placeholder">
                    <PictureOutlined />
                  </div>
                }
                fallback="/placeholder-image.jpg"
              />
              {isSelected && (
                <div className="image-selected-overlay">
                  <CheckOutlined className="selected-icon" />
                </div>
              )}
              <div className="image-actions">
                <Tooltip title="Xem trước">
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<EyeOutlined />}
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      Modal.info({
                        title: image.title || image.file_name,
                        content: (
                          <div>
                            <Image src={imageUrl} alt={image.alt_text || image.file_name} />
                            <div style={{ marginTop: 16 }}>
                              <p><strong>Kích thước:</strong> {image.width} x {image.height}px</p>
                              <p><strong>Dung lượng:</strong> {formatFileSize((image.file_size_kb || 0) * 1024)}</p>
                              <p><strong>Định dạng:</strong> {image.image_format}</p>
                              {image.alt_text && <p><strong>Alt text:</strong> {image.alt_text}</p>}
                            </div>
                          </div>
                        ),
                        width: 600,
                      });
                    }}
                  />
                </Tooltip>
              </div>
            </div>
          }
        >
          <Meta
            title={
              <Tooltip title={image.title || image.file_name}>
                <div className="image-title">
                  {image.title || image.file_name}
                </div>
              </Tooltip>
            }
            description={
              <div className="image-meta">
                <Space size={4} wrap>
                  <Tag color="blue">{image.image_format}</Tag>
                  <Tag color="green">{image.width}x{image.height}</Tag>
                  <Tag color="orange">{formatFileSize((image.file_size_kb || 0) * 1024)}</Tag>
                </Space>
                {image.seo_score && (
                  <div className="seo-score">
                    SEO: {image.seo_score}/100
                  </div>
                )}
              </div>
            }
          />
        </Card>
      </Col>
    );
  };

  return (
    <Modal
      title={
        <Space>
          <PictureOutlined />
          {title}
          {multiple && selectedImages.length > 0 && (
            <Tag color="blue">{selectedImages.length} đã chọn</Tag>
          )}
        </Space>
      }
      open={visible}
      onCancel={onClose}
      width={1200}
      style={{ top: 20 }}
      bodyStyle={{ padding: 0 }}
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            {allowUpload && (
              <Button
                type="dashed"
                icon={<UploadOutlined />}
                onClick={() => {
                  // Redirect to media upload page or open upload modal
                  window.open('/media/create', '_blank');
                }}
              >
                Tải ảnh mới
              </Button>
            )}
          </div>
          <Space>
            <Button onClick={onClose}>Hủy</Button>
            <Button
              type="primary"
              onClick={() => {
                if (selectedImages.length > 0) {
                  const selectedImageData = images.find(img => selectedImages.includes(img.id));
                  if (selectedImageData) {
                    onSelect(selectedImageData.id, selectedImageData);
                  }
                }
                onClose();
              }}
              disabled={selectedImages.length === 0}
            >
              Chọn ({selectedImages.length})
            </Button>
            {multiple && (
              <Button
                type="primary"
                onClick={handleConfirmSelection}
                disabled={selectedImages.length === 0}
              >
                Chọn nhiều ({selectedImages.length})
              </Button>
            )}
          </Space>
        </div>
      }
    >
      <div className="image-selector-content">
        {/* Search and Filter Bar */}
        <div className="image-selector-toolbar">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={8}>
              <Search
                placeholder="Tìm kiếm hình ảnh..."
                allowClear
                onChange={(e) => setSearchText(e.target.value)}
                onSearch={(value) => setSearchText(value)}
                prefix={<SearchOutlined />}
                size="large"
              />
            </Col>
            <Col xs={12} sm={4}>
              <Select
                placeholder="Sắp xếp"
                value={sortBy}
                onChange={setSortBy}
                style={{ width: '100%' }}
                size="large"
              >
                <Select.Option value="created_at">Mới nhất</Select.Option>
                <Select.Option value="file_name">Tên file</Select.Option>
                <Select.Option value="file_size_kb">Kích thước</Select.Option>
                <Select.Option value="seo_score">SEO Score</Select.Option>
              </Select>
            </Col>
            <Col xs={12} sm={4}>
              <Select
                placeholder="Định dạng"
                value={filterFormat}
                onChange={setFilterFormat}
                style={{ width: '100%' }}
                size="large"
              >
                <Select.Option value="all">Tất cả</Select.Option>
                <Select.Option value="jpg">JPG</Select.Option>
                <Select.Option value="png">PNG</Select.Option>
                <Select.Option value="webp">WebP</Select.Option>
                <Select.Option value="gif">GIF</Select.Option>
              </Select>
            </Col>
            <Col xs={24} sm={8}>
              <div className="image-count">
                <Text type="secondary">
                  Tìm thấy {images.length} hình ảnh
                </Text>
              </div>
            </Col>
          </Row>
        </div>

        {/* Images Grid */}
        <div className="image-selector-grid">
          {loading && images.length === 0 ? (
            <div className="loading-container">
              <Spin size="large" />
              <div style={{ marginTop: 16 }}>
                <Text>Đang tải hình ảnh...</Text>
              </div>
            </div>
          ) : images.length === 0 ? (
            <Empty
              description="Không tìm thấy hình ảnh nào"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <>
              <Row gutter={[16, 16]}>
                {images.map(renderImageCard)}
              </Row>
              
              {hasMore && (
                <div className="load-more-container">
                  <Button
                    type="dashed"
                    onClick={() => loadImages(false)}
                    loading={loading}
                    size="large"
                  >
                    Tải thêm hình ảnh
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};