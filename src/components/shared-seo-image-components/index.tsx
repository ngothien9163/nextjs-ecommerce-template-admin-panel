import React from 'react';
import { Card, Space, Typography, Button } from 'antd';
import { GlobalOutlined, PictureOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { EnhancedSEOForm } from '../enhanced-seo-form';
import { EnhancedImageSelector } from '../enhanced-image-selector';

const { Title, Text } = Typography;

interface SharedSEOImageComponentsProps {
  form: any;
  isEdit?: boolean;
  referenceType: 'product' | 'category' | 'blog' | 'page';
  referenceId?: string;
  entityName?: string; // tên sản phẩm/danh mục để tạo smart SEO
  showImageSelector?: boolean;
  onSEODataChange?: (seoData: any) => void;
  onImageSelect?: (imageId: string, imageData: any) => void;
}

export const SharedSEOImageComponents: React.FC<SharedSEOImageComponentsProps> = ({
  form,
  isEdit = false,
  referenceType,
  referenceId,
  entityName,
  showImageSelector = true,
  onSEODataChange,
  onImageSelect
}) => {
  const [imageModalVisible, setImageModalVisible] = React.useState(false);
  const [pageUrl, setPageUrl] = React.useState('');

  // Generate page URL based on type and slug
  React.useEffect(() => {
    const slug = form?.getFieldValue('slug');
    if (slug) {
      let url = '';
      switch (referenceType) {
        case 'product':
          url = `/products/${slug}`;
          break;
        case 'category':
          url = `/categories/${slug}`;
          break;
        case 'blog':
          url = `/blog/${slug}`;
          break;
        case 'page':
          url = `/${slug}`;
          break;
        default:
          url = `/${slug}`;
      }
      setPageUrl(url);
    }
  }, [form, referenceType]);

  const handleImageSelect = (imageId: string, imageData: any) => {
    if (onImageSelect) {
      onImageSelect(imageId, imageData);
    }
    setImageModalVisible(false);
  };

  const getContextTitle = () => {
    switch (referenceType) {
      case 'product': return 'Sản phẩm';
      case 'category': return 'Danh mục';
      case 'blog': return 'Blog';
      case 'page': return 'Trang';
      default: return 'Nội dung';
    }
  };

  return (
    <>
      {/* Enhanced SEO Form */}
      <EnhancedSEOForm
        form={form}
        isEdit={isEdit}
        referenceType={referenceType}
        referenceId={referenceId}
        pageUrl={pageUrl}
        onSEODataChange={onSEODataChange}
      />

      {/* Image Selector Button (if enabled) */}
      {showImageSelector && (
        <Card 
          title={
            <Space>
              <PictureOutlined style={{ color: '#fa8c16' }} />
              <span>Quản lý hình ảnh</span>
            </Space>
          }
          style={{ marginTop: '24px' }}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text type="secondary">
              Chọn hình ảnh từ thư viện media cho {getContextTitle().toLowerCase()}
            </Text>
            <Button 
              type="dashed" 
              icon={<PictureOutlined />}
              onClick={() => setImageModalVisible(true)}
              size="large"
            >
              Mở thư viện hình ảnh
            </Button>
          </Space>
        </Card>
      )}

      {/* Enhanced Image Selector Modal */}
      <EnhancedImageSelector
        visible={imageModalVisible}
        onClose={() => setImageModalVisible(false)}
        onSelect={handleImageSelect}
        title={`Chọn hình ảnh cho ${getContextTitle().toLowerCase()}`}
        contextType={referenceType === 'blog' ? 'blog' : referenceType === 'product' ? 'product' : 'general'}
      />
    </>
  );
};

export default SharedSEOImageComponents;