import React, { useState, useEffect } from 'react';
import { Modal, Button, Image, Card, Input, Space, Tag, Typography, message, Empty, Spin, Select, Row, Col } from 'antd';
import { PictureOutlined, SearchOutlined, EyeOutlined, DeleteOutlined, PlusOutlined, SortAscendingOutlined } from '@ant-design/icons';
import { useTable } from '@refinedev/antd';
import { BaseRecord } from '@refinedev/core';

const { Search } = Input;
const { Text } = Typography;
const { Option } = Select;

interface Media extends BaseRecord {
  id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  is_active: boolean;
  alt_text?: string;
  title?: string;
  file_type?: string;
  created_at?: string;
}

interface CategoryImageSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  onSelect?: (media: Media) => void;
}

export const CategoryImageSelector: React.FC<CategoryImageSelectorProps> = ({
  value,
  onChange,
  placeholder = "Chọn ảnh đại diện",
  disabled = false,
  onSelect
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [fileTypeFilter, setFileTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('created_at');

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
          field: 'file_type',
          operator: 'eq' as const,
          value: fileTypeFilter,
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

  // Tìm media đã chọn khi component mount hoặc value thay đổi
  useEffect(() => {
    if (value && tableProps.dataSource) {
      const found = tableProps.dataSource.find((item: BaseRecord) => item.id === value) as Media | undefined;
      if (found) {
        setSelectedMedia(found);
      }
    } else {
      setSelectedMedia(null);
    }
  }, [value, tableProps.dataSource]);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleSelect = (media: Media) => {
    setSelectedMedia(media);
    if (onChange) {
      onChange(media.id);
    }
    if (onSelect) {
      onSelect(media);
    }
    setIsModalVisible(false);
    message.success('Đã chọn ảnh đại diện!');
  };

  const handleRemove = () => {
    setSelectedMedia(null);
    if (onChange) {
      onChange('');
    }
    message.success('Đã xóa ảnh đại diện!');
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
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

  const getFileTypeIcon = (fileType: string) => {
    if (fileType?.startsWith('image/')) return '🖼️';
    if (fileType?.startsWith('video/')) return '🎥';
    return '📄';
  };

  return (
    <div>
      {/* Preview Area */}
      <div style={{ marginBottom: '16px' }}>
        {selectedMedia ? (
          <Card
            size="small"
            style={{ border: '1px solid #d9d9d9', borderRadius: '6px' }}
            styles={{ body: { padding: '12px' } }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Image
                src={selectedMedia.file_url}
                alt={selectedMedia.alt_text || selectedMedia.file_name}
                style={{ 
                  width: '60px', 
                  height: '60px', 
                  objectFit: 'cover',
                  borderRadius: '4px'
                }}
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
              />
              <div style={{ flex: 1 }}>
                <Text strong style={{ fontSize: '14px', display: 'block' }}>
                  {selectedMedia.file_name}
                </Text>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {formatFileSize(selectedMedia.file_size)} • {formatDate(selectedMedia.created_at || '')}
                </Text>
                <Tag color="green" style={{ marginTop: '4px' }}>Đã chọn</Tag>
              </div>
              <Space>
                <Button
                  type="text"
                  icon={<EyeOutlined />}
                  size="small"
                  onClick={() => {
                    const index = tableProps.dataSource?.findIndex((item: BaseRecord) => item.id === selectedMedia.id) || 0;
                    openLightbox(index);
                  }}
                />
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  size="small"
                  danger
                  onClick={handleRemove}
                />
              </Space>
            </div>
          </Card>
        ) : (
          <div style={{ 
            border: '2px dashed #d9d9d9', 
            borderRadius: '6px', 
            padding: '20px', 
            textAlign: 'center',
            backgroundColor: '#fafafa'
          }}>
            <PictureOutlined style={{ fontSize: '24px', color: '#bfbfbf', marginBottom: '8px' }} />
            <div style={{ color: '#bfbfbf' }}>Chưa có ảnh đại diện</div>
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
        {selectedMedia ? 'Thay đổi ảnh đại diện' : placeholder}
      </Button>

      {/* Media Selection Modal */}
      <Modal
        title="Chọn ảnh đại diện từ thư viện"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={1000}
                 styles={{ body: { maxHeight: '70vh', overflow: 'auto' } }}
      >
        {/* Filters and Search */}
        <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
          <Col span={12}>
            <Search
              placeholder="Tìm kiếm hình ảnh..."
              allowClear
              onSearch={handleSearch}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={6}>
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
          <Col span={6}>
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
        </Row>

        {tableProps.loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" />
          </div>
        ) : tableProps.dataSource?.length === 0 ? (
          <Empty 
            description="Không tìm thấy hình ảnh nào" 
            style={{ margin: '40px 0' }}
          />
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: '16px' 
          }}>
            {tableProps.dataSource?.map((item: BaseRecord, index: number) => {
              const mediaItem = item as Media;
              return (
                <Card
                  key={mediaItem.id}
                  hoverable
                  size="small"
                  style={{ 
                    cursor: 'pointer',
                    border: selectedMedia?.id === mediaItem.id ? '2px solid #1890ff' : undefined
                  }}
                  onClick={() => handleSelect(mediaItem)}
                  actions={[
                    <EyeOutlined key="view" onClick={(e) => {
                      e.stopPropagation();
                      openLightbox(index);
                    }} />
                  ]}
                >
                  <div style={{ textAlign: 'center' }}>
                    <Image
                      src={mediaItem.file_url}
                      alt={mediaItem.alt_text || mediaItem.file_name}
                      style={{ width: '100%', height: '120px', objectFit: 'cover' }}
                      fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                    />
                    <div style={{ marginTop: '8px' }}>
                      <Text strong style={{ fontSize: '12px', display: 'block' }}>
                        {mediaItem.file_name.length > 20 ? mediaItem.file_name.substring(0, 20) + '...' : mediaItem.file_name}
                      </Text>
                      <Text type="secondary" style={{ fontSize: '10px' }}>
                        {formatFileSize(mediaItem.file_size)} • {formatDate(mediaItem.created_at || '')}
                      </Text>
                      <br />
                      <Space size={4}>
                        <Tag color={mediaItem.is_active ? 'green' : 'red'}>
                          {mediaItem.is_active ? 'Active' : 'Inactive'}
                        </Tag>
                        {selectedMedia?.id === mediaItem.id && (
                          <Tag color="blue">Đã chọn</Tag>
                        )}
                      </Space>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Modal>

      {/* Image Lightbox Modal */}
      <Modal
        title={tableProps.dataSource?.[currentImageIndex]?.title || tableProps.dataSource?.[currentImageIndex]?.file_name}
        open={isLightboxOpen}
        onCancel={closeLightbox}
        footer={null}
        width="80%"
        style={{ top: 20 }}
      >
        <div style={{ textAlign: 'center' }}>
          <Image
            src={tableProps.dataSource?.[currentImageIndex]?.file_url}
            alt={tableProps.dataSource?.[currentImageIndex]?.alt_text || tableProps.dataSource?.[currentImageIndex]?.file_name}
            style={{ maxWidth: '100%', maxHeight: '70vh' }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
          />
        </div>
      </Modal>
    </div>
  );
};
