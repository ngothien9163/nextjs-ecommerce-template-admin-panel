import React from "react";
import { Form, Input, Select, Switch, Space, Tooltip, Typography } from "antd";
import {
  FileTextOutlined,
  EyeOutlined,
  EditOutlined,
  PictureOutlined,
  UserOutlined,
  CopyrightOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { KeywordsInput } from "../keywords-input";
import { AISuggestions } from "../ai-suggestions";

const { TextArea } = Input;
const { Text } = Typography;
const { Option } = Select;

// Preset data cho Credit và License
export const CREDIT_PRESETS = [
  // Free Sources
  "Unsplash",
  "Pexels", 
  "Pixabay",
  "Freepik",
  "Wikimedia Commons",
  "OpenClipart",
  "Flaticon",
  // Paid Sources
  "Adobe Stock",
  "Shutterstock",
  "Getty Images",
  "iStock",
  "Depositphotos",
  // Self Created
  "Original Content",
  "Self Created",
  "Custom Design",
  // Custom
  "Custom",
];

export const LICENSE_PRESETS = [
  { value: "CC0", label: "CC0 (Public Domain) - Miền công cộng, tự do sử dụng" },
  { value: "CC BY", label: "CC BY (Attribution) - Ghi công tác giả" },
  { value: "CC BY-SA", label: "CC BY-SA (Attribution-ShareAlike) - Ghi công và chia sẻ tương tự" },
  { value: "CC BY-ND", label: "CC BY-ND (Attribution-NoDerivs) - Ghi công, không chỉnh sửa" },
  { value: "CC BY-NC", label: "CC BY-NC (Attribution-NonCommercial) - Ghi công, không thương mại" },
  { value: "CC BY-NC-SA", label: "CC BY-NC-SA (Attribution-NonCommercial-ShareAlike) - Ghi công, không thương mại, chia sẻ tương tự" },
  { value: "CC BY-NC-ND", label: "CC BY-NC-ND (Attribution-NonCommercial-NoDerivs) - Ghi công, không thương mại, không chỉnh sửa" },
  { value: "All Rights Reserved", label: "All Rights Reserved - Bảo lưu mọi quyền" },
  { value: "Fair Use", label: "Fair Use - Sử dụng hợp lý" },
  { value: "Custom", label: "Custom - Tùy chỉnh" },
];

interface MediaFormFieldsProps {
  mode?: 'create' | 'edit';
  uploadedFiles?: Array<{
    file: File;
    preview: string;
    uploaded: boolean;
    url?: string;
    dimensions?: { width: number; height: number };
    fileSizeKB?: number;
    imageFormat?: string;
    uploadedFileName?: string;
    uploadedFilePath?: string;
  }>;
  selectedFileIndex?: number;
  form?: any; // Ant Design form instance
}

export const MediaFormFields: React.FC<MediaFormFieldsProps> = ({ 
  mode = 'create', 
  uploadedFiles = [],
  selectedFileIndex = 0,
  form
}) => {
  const selectedFile = uploadedFiles[selectedFileIndex];
  const hasUploadedFile = mode === 'create' && uploadedFiles.length > 0 && selectedFile?.uploaded;
  return (
    <>
      {/* File Upload Status */}
      {hasUploadedFile && (
        <div style={{ 
          marginBottom: '16px', 
          padding: '12px', 
          backgroundColor: '#f6ffed', 
          border: '1px solid #b7eb8f', 
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ color: '#52c41a', fontSize: '16px' }}>✅</span>
          <div>
            <div style={{ fontWeight: 'bold', color: '#52c41a', marginBottom: '4px' }}>
              Đã có file này
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              File: <strong>{selectedFile?.uploadedFileName || selectedFile?.file.name}</strong>
              {selectedFile?.dimensions && (
                <span> • Kích thước: {selectedFile.dimensions.width}x{selectedFile.dimensions.height}</span>
              )}
              {selectedFile?.fileSizeKB && (
                <span> • Dung lượng: {selectedFile.fileSizeKB} KB</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Basic Information */}
      <Form.Item
        label={
          <Space>
            <FileTextOutlined />
            Tên file
            <Tooltip title="Tên file gốc, sẽ được hiển thị trong admin panel">
              <InfoCircleOutlined style={{ color: "#1890ff" }} />
            </Tooltip>
          </Space>
        }
        name="file_name"
        rules={[{ required: true, message: "Vui lòng nhập tên file!" }]}
        extra={<Text type="secondary" style={{ fontSize: '11px' }}>💡 Giữ tên file mô tả, không quá dài (không giới hạn ký tự)</Text>}
      >
        <Input placeholder="Tên file gốc" showCount maxLength={100} />
      </Form.Item>

      <Form.Item
        label={
          <Space>
            <EyeOutlined />
            Alt Text
            <Tooltip title="Mô tả hình ảnh cho SEO và accessibility, rất quan trọng cho người dùng khiếm thị">
              <InfoCircleOutlined style={{ color: "#1890ff" }} />
            </Tooltip>
          </Space>
        }
        name="alt_text"
        rules={[{ required: true, message: "Vui lòng nhập alt text!" }]}
        extra={<Text type="secondary" style={{ fontSize: '11px' }}>💡 Tối ưu: 125 ký tự. Mô tả ngắn gọn, chứa từ khóa chính</Text>}
      >
        <Input placeholder="Mô tả hình ảnh cho SEO" showCount maxLength={125} />
      </Form.Item>

      <Form.Item
        label={
          <Space>
            <EditOutlined />
            Title
            <Tooltip title="Tiêu đề hiển thị khi hover chuột lên hình ảnh">
              <InfoCircleOutlined style={{ color: "#1890ff" }} />
            </Tooltip>
          </Space>
        }
        name="title"
        extra={<Text type="secondary" style={{ fontSize: '11px' }}>💡 Tối ưu: 60 ký tự. Tiêu đề ngắn gọn, hấp dẫn</Text>}
      >
        <Input placeholder="Tiêu đề khi hover" showCount maxLength={60} />
      </Form.Item>

      <Form.Item
        label={
          <Space>
            <PictureOutlined />
            Caption
            <Tooltip title="Chú thích chi tiết về hình ảnh, có thể hiển thị dưới hình ảnh">
              <InfoCircleOutlined style={{ color: "#1890ff" }} />
            </Tooltip>
          </Space>
        }
        name="caption"
        extra={<Text type="secondary" style={{ fontSize: '11px' }}>💡 Tối ưu: 150-200 ký tự. Mô tả chi tiết, hấp dẫn</Text>}
      >
        <TextArea rows={3} placeholder="Chú thích hình ảnh" showCount maxLength={200} />
      </Form.Item>

      {/* AI Suggestions */}
      {form && (
        <AISuggestions
          fileName={form.getFieldValue('file_name') || selectedFile?.file.name || ''}
          altText={form.getFieldValue('alt_text')}
          title={form.getFieldValue('title')}
          caption={form.getFieldValue('caption')}
          onMetaDescriptionSuggest={(suggestion) => {
            form.setFieldsValue({ meta_description: suggestion });
          }}
          onMetaKeywordsSuggest={(keywords) => {
            form.setFieldsValue({ meta_keywords: keywords });
          }}
        />
      )}

      <Form.Item
        label={
          <Space>
            <EditOutlined />
            Meta Description
            <Tooltip title="Mô tả chi tiết cho SEO, giúp tăng thứ hạng tìm kiếm">
              <InfoCircleOutlined style={{ color: "#1890ff" }} />
            </Tooltip>
          </Space>
        }
        name="meta_description"
        extra={<Text type="secondary" style={{ fontSize: '11px' }}>💡 Tối ưu: 160 ký tự. Chứa từ khóa, kêu gọi hành động</Text>}
      >
        <TextArea rows={2} placeholder="Mô tả chi tiết cho SEO" showCount maxLength={160} />
      </Form.Item>

      <Form.Item name="meta_keywords">
        <KeywordsInput
          label="Meta Keywords"
          tooltip="Nhập từ khóa SEO, phân cách bằng dấu phẩy. Ví dụ: Laptop Asus ExpertBook B1, Gaming, Computer"
          placeholder="Nhập từ khóa, phân cách bằng dấu phẩy"
          maxTags={15}
          allowDuplicates={false}
        />
      </Form.Item>

      {/* Credit and License */}
      <Form.Item
        label={
          <Space>
            <UserOutlined />
            Credit
            <Tooltip title="Nguồn gốc hoặc người tạo ra hình ảnh (Mặc định: Original Content - Tối ưu SEO)">
              <InfoCircleOutlined style={{ color: "#1890ff" }} />
            </Tooltip>
            <a
              href="/credit-license-guide.html#credit"
              target="_blank"
              style={{
                color: "#1890ff",
                textDecoration: "none",
                fontSize: "12px",
              }}
              title="Xem hướng dẫn Credit"
            >
              📖 Hướng dẫn
            </a>
          </Space>
        }
        name="credit"
        initialValue={mode === 'create' ? "Original Content" : undefined}
      >
        <Select
          placeholder="Original Content (Mặc định - Tối ưu SEO)"
          allowClear
          showSearch
          optionFilterProp="children"
        >
          <Option value="Unsplash">🆓 Unsplash</Option>
          <Option value="Pexels">🆓 Pexels</Option>
          <Option value="Pixabay">🆓 Pixabay</Option>
          <Option value="Freepik">🆓 Freepik</Option>
          <Option value="Wikimedia Commons">🆓 Wikimedia Commons</Option>
          <Option value="OpenClipart">🆓 OpenClipart</Option>
          <Option value="Flaticon">🆓 Flaticon</Option>
          <Option value="Adobe Stock">💰 Adobe Stock</Option>
          <Option value="Shutterstock">💰 Shutterstock</Option>
          <Option value="Getty Images">💰 Getty Images</Option>
          <Option value="iStock">💰 iStock</Option>
          <Option value="Depositphotos">💰 Depositphotos</Option>
          <Option value="Original Content">🎨 Original Content</Option>
          <Option value="Self Created">🎨 Self Created</Option>
          <Option value="Custom Design">🎨 Custom Design</Option>
          <Option value="Custom">📝 Custom</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label={
          <Space>
            <CopyrightOutlined />
            License
            <Tooltip title="Giấy phép sử dụng hình ảnh, quan trọng cho bản quyền (Mặc định: All Rights Reserved - Bảo lưu mọi quyền)">
              <InfoCircleOutlined style={{ color: "#1890ff" }} />
            </Tooltip>
            <a
              href="/credit-license-guide.html#license"
              target="_blank"
              style={{
                color: "#1890ff",
                textDecoration: "none",
                fontSize: "12px",
              }}
              title="Xem hướng dẫn License"
            >
              📖 Hướng dẫn
            </a>
          </Space>
        }
        name="license"
        initialValue={mode === 'create' ? "All Rights Reserved" : undefined}
      >
        <Select
          placeholder="All Rights Reserved (Mặc định - Bảo lưu mọi quyền)"
          allowClear
          showSearch
          optionFilterProp="children"
        >
          {LICENSE_PRESETS.map((license) => (
            <Option key={license.value} value={license.value}>
              {license.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      {/* Status */}
      <Form.Item
        label={
          <Space>
            Trạng thái
            <Tooltip title="Bật/tắt hiển thị hình ảnh trên website">
              <InfoCircleOutlined style={{ color: "#1890ff" }} />
            </Tooltip>
          </Space>
        }
        name="is_active"
        valuePropName="checked"
        initialValue={true}
      >
        <Switch checkedChildren="Hiển thị" unCheckedChildren="Ẩn" />
      </Form.Item>
    </>
  );
};
