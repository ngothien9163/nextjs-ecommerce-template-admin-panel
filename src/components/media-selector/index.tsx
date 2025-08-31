import React, { useState } from 'react';
import { Modal, Button, Image, Card, Input, Space, Tag, Typography, message } from 'antd';
import { PictureOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { useTable } from '@refinedev/antd';


const { Search } = Input;
const { Text } = Typography;

interface MediaSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  multiple?: boolean;
  onSelect?: (media: any) => void;
}

export const MediaSelector: React.FC<MediaSelectorProps> = ({
  value,
  onChange,
  placeholder = "Chọn hình ảnh",
  disabled = false,
  multiple = false,
  onSelect
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchText, setSearchText] = useState('');

  const { tableProps } = useTable({
    resource: 'media',
    filters: {
      permanent: [
        {
          field: 'is_active',
          operator: 'eq',
          value: true,
        },
        ...(searchText ? [{
          field: 'file_name',
          operator: 'contains' as const,
          value: searchText,
        }] : [])
      ]
    },
    syncWithLocation: false,
  });

  const handleSearch = (value: string) => {
    setSearchText(value);
    // The table will automatically refetch when filters change
  };

  const handleSelect = (media: any) => {
    if (onChange) {
      onChange(media.id);
    }
    if (onSelect) {
      onSelect(media);
    }
    if (!multiple) {
      setIsModalVisible(false);
    }
    message.success('Đã chọn hình ảnh!');
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

  return (
    <>
      <Button
        icon={<PictureOutlined />}
        onClick={() => setIsModalVisible(true)}
        disabled={disabled}
        style={{ width: '100%', textAlign: 'left' }}
      >
        {value ? 'Đã chọn hình ảnh' : placeholder}
      </Button>

      <Modal
        title="Chọn hình ảnh từ thư viện"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={1000}
        bodyStyle={{ maxHeight: '70vh', overflow: 'auto' }}
      >
        <div style={{ marginBottom: '16px' }}>
          <Search
            placeholder="Tìm kiếm hình ảnh..."
            allowClear
            onSearch={handleSearch}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
          gap: '16px' 
        }}>
          {tableProps.dataSource?.map((item: any, index: number) => (
            <Card
              key={item.id}
              hoverable
              size="small"
              style={{ cursor: 'pointer' }}
              onClick={() => handleSelect(item)}
              actions={[
                <EyeOutlined key="view" onClick={(e) => {
                  e.stopPropagation();
                  openLightbox(index);
                }} />
              ]}
            >
              <div style={{ textAlign: 'center' }}>
                <Image
                  src={item.file_url}
                  alt={item.alt_text || item.file_name}
                  style={{ width: '100%', height: '120px', objectFit: 'cover' }}
                  fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                />
                <div style={{ marginTop: '8px' }}>
                  <Text strong style={{ fontSize: '12px', display: 'block' }}>
                    {item.file_name.length > 20 ? item.file_name.substring(0, 20) + '...' : item.file_name}
                  </Text>
                  <Text type="secondary" style={{ fontSize: '10px' }}>
                    {formatFileSize(item.file_size)}
                  </Text>
                  <br />
                  <Tag color={item.is_active ? 'green' : 'red'}>
                    {item.is_active ? 'Active' : 'Inactive'}
                  </Tag>
                </div>
              </div>
            </Card>
          ))}
        </div>
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
    </>
  );
};
