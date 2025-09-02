import React, { useState, useEffect } from 'react';
import { Modal, Button, Space, Input, Select, message, Typography, Tag, Row, Col, Spin, Empty, Checkbox } from 'antd';
import { PictureOutlined, PlusOutlined, CheckCircleFilled } from '@ant-design/icons';
import { useTable } from '@refinedev/antd';
import { BaseRecord } from '@refinedev/core';

const { Search } = Input;
const { Text } = Typography;
const { Option } = Select;

interface Media extends BaseRecord {
  id: string;
  file_name: string;
  file_url: string;
  file_path: string;
  file_size: number;
  file_size_kb?: number;
  is_active: boolean;
  alt_text?: string;
  title?: string;
  caption?: string;
  mime_type?: string;
  image_dimensions?: string;
  created_at?: string;
  updated_at?: string;
}

interface MediaGallerySelectorProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  multiple?: boolean;
  maxSelect?: number;
  onSelect?: (media: Media[]) => void;
  folder?: string;
  showUpload?: boolean;
}

export const MediaGallerySelector: React.FC<MediaGallerySelectorProps> = ({
  value = [],
  onChange,
  placeholder = "Chọn hình ảnh",
  disabled = false,
  multiple = true,
  maxSelect = 10,
  onSelect,
  folder,
  showUpload = false,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>(value);
  const [searchText, setSearchText] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { tableProps } = useTable({
    resource: 'media',
    filters: {
      permanent: [
        {
          field: 'is_active',
          operator: 'eq' as const,
          value: true,
        },
        ...(searchText ? [{
          field: 'file_name',
          operator: 'contains' as const,
          value: searchText,
        }] : []),
        ...(fileTypeFilter !== 'all' ? [{
          field: 'mime_type',
          operator: 'eq' as const,
          value: fileTypeFilter,
        }] : []),
        ...(folder ? [{
          field: 'file_path',
          operator: 'contains' as const,
          value: folder,
        }] : [])
      ]
    },
    sorters: {
      permanent: [
        {
          field: sortBy,
          order: sortBy === 'created_at' ? 'desc' : 'asc',
        },
      ],
    },
    syncWithLocation: false,
  });

  // Sync selected images with value prop
  useEffect(() => {
    setSelectedImages(value);
  }, [value]);

  const handleImageSelect = (mediaItem: Media) => {
    if (!mediaItem || !mediaItem.id) return;

    console.log('handleImageSelect called:', mediaItem.id, mediaItem.file_name); // Debug log

    if (multiple) {
      setSelectedImages(prev => {
        const isSelected = prev.includes(mediaItem.id);
        console.log('Current selection:', prev, 'Is selected:', isSelected, 'Will toggle to:', !isSelected); // Debug log
        if (isSelected) {
          return prev.filter(id => id !== mediaItem.id);
        } else {
          if (prev.length >= maxSelect) {
            message.warning(`Chỉ được chọn tối đa ${maxSelect} hình ảnh`);
            return prev;
          }
          return [...prev, mediaItem.id];
        }
      });
    } else {
      setSelectedImages([mediaItem.id]);
    }
  };



  const handleConfirmSelection = () => {
    if (selectedImages.length === 0) {
      message.warning('Vui lòng chọn ít nhất 1 hình ảnh');
      return;
    }

    if (onChange) {
      onChange(selectedImages);
    }

    if (onSelect) {
      const selectedMedia = tableProps.dataSource?.filter((item: BaseRecord) => 
        selectedImages.includes(item.id as string)
      ) as Media[];
      onSelect(selectedMedia);
    }

    setIsModalVisible(false);
    message.success(`Đã chọn ${selectedImages.length} hình ảnh!`);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleRemoveImage = (imageId: string) => {
    setSelectedImages(prev => prev.filter(id => id !== imageId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div>
      {/* Preview Area */}
      <div style={{ marginBottom: '16px' }}>
        {selectedImages.length > 0 ? (
          <div style={{ 
            border: '1px solid #d9d9d9', 
            borderRadius: '6px', 
            padding: '12px',
            backgroundColor: '#fafafa'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <Text strong>Đã chọn {selectedImages.length} hình ảnh</Text>
              <Button 
                type="text" 
                size="small" 
                danger 
                onClick={() => setSelectedImages([])}
              >
                Xóa tất cả
              </Button>
            </div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', 
              gap: '8px'
            }}>
              {selectedImages.map((imageId) => {
                const mediaItem = tableProps.dataSource?.find((item: BaseRecord) => item.id === imageId) as Media;
                return mediaItem ? (
                  <div key={imageId} style={{ position: 'relative' }}>
                    <img
                      src={mediaItem.file_url}
                      alt={mediaItem.file_name}
                      style={{ 
                        width: '100%', 
                        height: '60px', 
                        objectFit: 'cover',
                        borderRadius: '4px'
                      }}
                    />
                    <Button
                      type="text"
                      size="small"
                      danger
                      style={{
                        position: 'absolute',
                        top: -4,
                        right: -4,
                        width: '20px',
                        height: '20px',
                        padding: 0,
                        borderRadius: '50%',
                        backgroundColor: '#ff4d4f',
                        color: 'white',
                        border: 'none',
                        fontSize: '12px',
                        lineHeight: '1'
                      }}
                      onClick={() => handleRemoveImage(imageId)}
                    >
                      ×
                    </Button>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        ) : (
          <div style={{ 
            border: '2px dashed #d9d9d9', 
            borderRadius: '6px', 
            padding: '20px', 
            textAlign: 'center',
            backgroundColor: '#fafafa'
          }}>
            <PictureOutlined style={{ fontSize: '24px', color: '#bfbfbf', marginBottom: '8px' }} />
            <div style={{ color: '#bfbfbf' }}>Chưa có hình ảnh nào được chọn</div>
          </div>
        )}
      </div>

      {/* Select Button */}
      <Button
        type="dashed"
        icon={<PlusOutlined />}
        onClick={() => setIsModalVisible(true)}
        disabled={disabled}
        style={{ width: '100%' }}
      >
        {selectedImages.length > 0 ? `Thay đổi hình ảnh (${selectedImages.length})` : placeholder}
      </Button>

      {/* Media Selection Modal */}
      <Modal
        title={
          <Space>
            <span>Chọn hình ảnh từ thư viện</span>
            {selectedImages.length > 0 && (
              <Tag color="blue">{selectedImages.length}/{maxSelect} đã chọn</Tag>
            )}
          </Space>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={
          <Space>
            <Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
            <Button 
              type="primary" 
              onClick={handleConfirmSelection}
              disabled={selectedImages.length === 0}
            >
              Chọn ({selectedImages.length})
            </Button>
          </Space>
        }
        width={1200}
                 styles={{ body: { maxHeight: '70vh', overflow: 'auto' } }}
      >
        {/* Filters and Search */}
        <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
          <Col span={8}>
            <Search
              placeholder="Tìm kiếm hình ảnh..."
              allowClear
              onSearch={handleSearch}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="Loại file"
              value={fileTypeFilter}
              onChange={setFileTypeFilter}
              style={{ width: '100%' }}
            >
              <Option value="all">Tất cả</Option>
              <Option value="image/jpeg">JPEG</Option>
              <Option value="image/png">PNG</Option>
              <Option value="image/gif">GIF</Option>
              <Option value="image/webp">WebP</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="Sắp xếp theo"
              value={sortBy}
              onChange={setSortBy}
              style={{ width: '100%' }}
            >
              <Option value="created_at">Mới nhất</Option>
              <Option value="file_name">Tên file</Option>
              <Option value="file_size">Kích thước</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="Chế độ xem"
              value={viewMode}
              onChange={setViewMode}
              style={{ width: '100%' }}
            >
              <Option value="grid">Grid</Option>
              <Option value="list">List</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Space>
              <Text type="secondary">Tổng: {tableProps.dataSource?.length || 0}</Text>
            </Space>
          </Col>
        </Row>

        {/* Gallery Content */}
        {tableProps.loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px' }}>Đang tải hình ảnh...</div>
          </div>
        ) : tableProps.dataSource?.length === 0 ? (
          <Empty 
            description="Không tìm thấy hình ảnh nào" 
            style={{ margin: '40px 0' }}
          />
        ) : viewMode === 'grid' ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: '16px',
            padding: '16px 0'
          }}>
            {tableProps.dataSource?.map((item: BaseRecord) => {
              const mediaItem = item as Media;
              const isSelected = selectedImages.includes(mediaItem.id);
              return (
                <div
                  key={mediaItem.id}
                  style={{
                    position: 'relative',
                    border: isSelected ? '2px solid #1890ff' : '1px solid #d9d9d9',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? '#f0f8ff' : 'white',
                    transition: 'all 0.2s',
                    padding: '8px'
                  }}
                  onClick={() => handleImageSelect(mediaItem)}
                >
                  {/* Selection Checkbox */}
                  <div 
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      zIndex: 100,
                      pointerEvents: 'auto',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '4px',
                      padding: '2px'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                  >
                    <Checkbox
                      checked={isSelected}
                      onChange={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleImageSelect(mediaItem); // Call directly instead of handleCheckboxChange
                      }}
                      style={{ pointerEvents: 'auto' }}
                    />
                  </div>

                  {/* Image */}
                  <div style={{ position: 'relative', marginBottom: '8px' }}>
                    <img
                      src={mediaItem.file_url}
                      alt={mediaItem.file_name}
                      style={{
                        width: '100%',
                        height: '150px',
                        objectFit: 'cover',
                        borderRadius: '4px'
                      }}
                    />
                    {isSelected && (
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(24, 144, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <CheckCircleFilled style={{ 
                          fontSize: '24px', 
                          color: '#1890ff' 
                        }} />
                      </div>
                    )}
                  </div>

                  {/* Image Info */}
                  <div>
                    <Text strong style={{ 
                      display: 'block', 
                      fontSize: '12px',
                      marginBottom: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {mediaItem.file_name}
                    </Text>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <Tag color="blue">
                        {mediaItem.mime_type?.split('/')[1]?.toUpperCase() || 'IMAGE'}
                      </Tag>
                      <Tag color="green">
                        {mediaItem.file_size_kb || Math.round(mediaItem.file_size / 1024)}KB
                      </Tag>
                      <Tag color="orange">
                        {mediaItem.image_dimensions || 'Unknown'}
                      </Tag>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {tableProps.dataSource?.map((item: BaseRecord) => {
              const mediaItem = item as Media;
              const isSelected = selectedImages.includes(mediaItem.id);
              return (
                <div
                  key={mediaItem.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px',
                    border: isSelected ? '2px solid #1890ff' : '1px solid #d9d9d9',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? '#f0f8ff' : 'white',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => handleImageSelect(mediaItem)}
                >
                  <div
                    style={{
                      pointerEvents: 'auto',
                      marginRight: '12px',
                      zIndex: 10
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                  >
                    <Checkbox
                      checked={isSelected}
                      onChange={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleImageSelect(mediaItem); // Call directly instead of handleCheckboxChange
                      }}
                      style={{ pointerEvents: 'auto' }}
                    />
                  </div>
                  <img
                    src={mediaItem.file_url}
                    alt={mediaItem.file_name}
                    style={{
                      width: '60px',
                      height: '60px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      marginRight: '12px'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <Text strong style={{ display: 'block' }}>
                      {mediaItem.file_name}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {formatFileSize(mediaItem.file_size)} • {mediaItem.image_dimensions} • {formatDate(mediaItem.created_at || '')}
                    </Text>
                  </div>
                  <Space>
                    {isSelected && <Tag color="blue">Đã chọn</Tag>}
                    <Tag color={mediaItem.is_active ? 'green' : 'red'}>
                      {mediaItem.is_active ? 'Active' : 'Inactive'}
                    </Tag>
                  </Space>
                </div>
              );
            })}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MediaGallerySelector;
