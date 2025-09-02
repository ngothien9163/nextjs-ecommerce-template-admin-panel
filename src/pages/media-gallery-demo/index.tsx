import React, { useState } from 'react';
import { Card, Form, Space, Typography, Divider, Alert } from 'antd';
import { MediaGallerySelector } from '../../components/media-gallery-selector';

const { Title, Text } = Typography;

// =====================================================
// MEDIA GALLERY SELECTOR DEMO PAGE
// =====================================================

export const MediaGallerySelectorDemo: React.FC = () => {
  const [singleImage, setSingleImage] = useState<string[]>([]);
  const [multipleImages, setMultipleImages] = useState<string[]>([]);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [blogImages, setBlogImages] = useState<string[]>([]);

  const handleSingleSelect = (media: any[]) => {
    console.log('Single image selected:', media);
  };

  const handleMultipleSelect = (media: any[]) => {
    console.log('Multiple images selected:', media);
  };

  const handleProductSelect = (media: any[]) => {
    console.log('Product images selected:', media);
  };

  const handleBlogSelect = (media: any[]) => {
    console.log('Blog images selected:', media);
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>🎨 Media Gallery Selector Demo</Title>
      <Text type="secondary">
        Component mới để chọn nhiều hình ảnh với react-grid-gallery
      </Text>

      <Divider />

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Single Image Selection */}
        <Card title="📷 Chọn 1 hình ảnh (Featured Image)" size="small">
          <Form layout="vertical">
            <Form.Item
              label="Ảnh đại diện"
              name="featured_image"
            >
              <MediaGallerySelector
                value={singleImage}
                onChange={setSingleImage}
                multiple={false}
                placeholder="Chọn ảnh đại diện"
                onSelect={handleSingleSelect}
              />
            </Form.Item>
          </Form>
        </Card>

        {/* Multiple Images Selection */}
        <Card title="🖼️ Chọn nhiều hình ảnh (Gallery)" size="small">
          <Form layout="vertical">
            <Form.Item
              label="Thư viện ảnh"
              name="gallery_images"
            >
              <MediaGallerySelector
                value={multipleImages}
                onChange={setMultipleImages}
                multiple={true}
                maxSelect={10}
                placeholder="Chọn nhiều ảnh cho gallery"
                onSelect={handleMultipleSelect}
              />
            </Form.Item>
          </Form>
        </Card>

        {/* Product Images */}
        <Card title="🛍️ Hình ảnh sản phẩm" size="small">
          <Form layout="vertical">
            <Form.Item
              label="Ảnh sản phẩm"
              name="product_images"
            >
              <MediaGallerySelector
                value={productImages}
                onChange={setProductImages}
                multiple={true}
                maxSelect={8}
                placeholder="Chọn ảnh sản phẩm"
                folder="products"
                onSelect={handleProductSelect}
              />
            </Form.Item>
          </Form>
        </Card>

        {/* Blog Images */}
        <Card title="📝 Hình ảnh blog" size="small">
          <Form layout="vertical">
            <Form.Item
              label="Ảnh bài viết"
              name="blog_images"
            >
              <MediaGallerySelector
                value={blogImages}
                onChange={setBlogImages}
                multiple={true}
                maxSelect={5}
                placeholder="Chọn ảnh cho bài viết"
                folder="blog"
                onSelect={handleBlogSelect}
              />
            </Form.Item>
          </Form>
        </Card>

        {/* Usage Instructions */}
        <Card title="📖 Hướng dẫn sử dụng" size="small">
          <Alert
            message="Cách sử dụng MediaGallerySelector"
            description={
              <div>
                <Text strong>Props:</Text>
                <ul>
                  <li><Text code>value</Text> - Array của image IDs</li>
                  <li><Text code>onChange</Text> - Callback khi chọn ảnh</li>
                  <li><Text code>multiple</Text> - Cho phép chọn nhiều ảnh</li>
                  <li><Text code>maxSelect</Text> - Số ảnh tối đa được chọn</li>
                  <li><Text code>folder</Text> - Filter theo folder</li>
                  <li><Text code>onSelect</Text> - Callback với media objects</li>
                </ul>
                
                <Text strong>Features:</Text>
                <ul>
                  <li>✅ Grid view với masonry layout</li>
                  <li>✅ List view cho dễ quản lý</li>
                  <li>✅ Search và filter</li>
                  <li>✅ Preview ảnh đã chọn</li>
                  <li>✅ Multiple selection</li>
                  <li>✅ Responsive design</li>
                </ul>
              </div>
            }
            type="info"
            showIcon
          />
        </Card>
      </Space>
    </div>
  );
};

export default MediaGallerySelectorDemo;
