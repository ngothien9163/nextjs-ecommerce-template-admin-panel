import React from "react";
import { Form, Input, Select, Space, Tooltip, Tag, Switch, Button, Typography } from "antd";
import { EditOutlined, InfoCircleOutlined, CopyOutlined, LinkOutlined } from "@ant-design/icons";

const { Option } = Select;

interface MediaTechnicalInfoProps {
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
  existingRecord?: any; // For edit mode - existing record data
}

export const MediaTechnicalInfo: React.FC<MediaTechnicalInfoProps> = ({
  mode = 'create',
  uploadedFiles = [],
  selectedFileIndex = 0,
  existingRecord
}) => {
  const isAutoFilled = mode === 'create' && uploadedFiles.length > 0 && uploadedFiles[selectedFileIndex]?.dimensions;
  const isEditMode = mode === 'edit';
  const selectedFile = uploadedFiles[selectedFileIndex];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#262626' }}>
          <Space>
            <EditOutlined />
            Image Dimensions
            <Tooltip title="Kích thước hình ảnh (width x height) - Được lấy tự động từ file">
              <InfoCircleOutlined style={{ color: '#1890ff' }} />
            </Tooltip>
            {(isAutoFilled || isEditMode) && (
              <Tag color="green">
                {isEditMode ? "Tự động (chỉ đọc)" : `Tự động: ${selectedFile?.dimensions?.width}x${selectedFile?.dimensions?.height}`}
              </Tag>
            )}
          </Space>
        </div>
        <Form.Item name="image_dimensions" style={{ marginBottom: 0 }}>
          <Input
            placeholder="Ví dụ: 1920x1080"
            readOnly={!!(isAutoFilled || isEditMode)}
            style={{
              backgroundColor: (isAutoFilled || isEditMode) ? '#f6ffed' : 'white'
            }}
          />
        </Form.Item>
      </div>

      <div>
        <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#262626' }}>
          <Space>
            <EditOutlined />
            File Size (KB)
            <Tooltip title="Kích thước file tính bằng KB - Được lấy tự động từ file">
              <InfoCircleOutlined style={{ color: '#1890ff' }} />
            </Tooltip>
            {(isAutoFilled || isEditMode) && (
              <Tag color="green">
                {isEditMode ? "Tự động (chỉ đọc)" : `Tự động: ${selectedFile?.fileSizeKB} KB`}
              </Tag>
            )}
          </Space>
        </div>
        <Form.Item name="file_size_kb" style={{ marginBottom: 0 }}>
          <Input
            placeholder="Ví dụ: 245"
            readOnly={!!(isAutoFilled || isEditMode)}
            style={{
              backgroundColor: (isAutoFilled || isEditMode) ? '#f6ffed' : 'white'
            }}
          />
        </Form.Item>
      </div>

      <div>
        <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#262626' }}>
          <Space>
            <EditOutlined />
            Image Format
            <Tooltip title="Định dạng hình ảnh - Được lấy tự động từ file">
              <InfoCircleOutlined style={{ color: '#1890ff' }} />
            </Tooltip>
            {(isAutoFilled || isEditMode) && (
              <Tag color="green">
                {isEditMode ? "Tự động (chỉ đọc)" : `Tự động: ${selectedFile?.imageFormat}`}
              </Tag>
            )}
          </Space>
        </div>
        <Form.Item name="image_format" style={{ marginBottom: 0 }}>
          <Select
            placeholder="Chọn định dạng hình ảnh"
            disabled={!!(isAutoFilled || isEditMode)}
            style={{
              backgroundColor: (isAutoFilled || isEditMode) ? '#f6ffed' : 'white'
            }}
          >
            <Option value="JPEG">JPEG - Phù hợp cho ảnh thực tế</Option>
            <Option value="PNG">PNG - Phù hợp cho ảnh có trong suốt</Option>
            <Option value="WebP">WebP - Định dạng hiện đại, nén tốt</Option>
            <Option value="AVIF">AVIF - Định dạng mới nhất, nén tốt nhất</Option>
            <Option value="SVG">SVG - Vector, phù hợp cho icon</Option>
            <Option value="GIF">GIF - Animation</Option>
          </Select>
        </Form.Item>
      </div>

      <div>
        <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#262626' }}>
          <Space>
            <EditOutlined />
            MIME Type
            <Tooltip title="Loại MIME của file - Được lấy tự động từ file">
              <InfoCircleOutlined style={{ color: '#1890ff' }} />
            </Tooltip>
            {(isAutoFilled || isEditMode) && (
              <Tag color="green">
                {isEditMode ? "Tự động (chỉ đọc)" : `Tự động: ${selectedFile?.file.type}`}
              </Tag>
            )}
          </Space>
        </div>
        <Form.Item name="mime_type" style={{ marginBottom: 0 }}>
          <Input
            placeholder="Ví dụ: image/jpeg"
            readOnly={!!(isAutoFilled || isEditMode)}
            style={{
              backgroundColor: (isAutoFilled || isEditMode) ? '#f6ffed' : 'white'
            }}
          />
        </Form.Item>
      </div>


      {mode === 'create' && (
        <>
          <div>
            <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#262626' }}>
              <Space>
                <EditOutlined />
                File Path
                <Tooltip title="Đường dẫn file trong storage - Được tạo tự động">
                  <InfoCircleOutlined style={{ color: '#1890ff' }} />
                </Tooltip>
                {uploadedFiles.length > 0 && selectedFile?.uploaded && (
                  <Tag color="green">
                    ✓ Đã upload: {selectedFile.uploadedFilePath}
                  </Tag>
                )}
              </Space>
            </div>
            <Form.Item name="file_path" style={{ marginBottom: 0 }}>
              <Input
                placeholder="Tự động tạo khi upload file"
                readOnly
                style={{ backgroundColor: '#f6ffed' }}
              />
            </Form.Item>
          </div>

          <div>
            <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#262626' }}>
              <Space>
                <EditOutlined />
                File URL
                <Tooltip title="URL công khai của file - Được tạo sau khi upload">
                  <InfoCircleOutlined style={{ color: '#1890ff' }} />
                </Tooltip>
                {uploadedFiles.length > 0 && selectedFile?.uploaded && (
                  <Tag color="green">
                    ✓ Đã upload
                  </Tag>
                )}
              </Space>
            </div>
            <Form.Item name="file_url" style={{ marginBottom: 0 }}>
              <Input
                placeholder="Tự động tạo sau khi upload file"
                readOnly
                style={{ backgroundColor: '#f6ffed' }}
              />
            </Form.Item>
          </div>
        </>
      )}

      {/* Public Link URL - Display field */}
      <div>
        <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#262626' }}>
          <Space>
            <LinkOutlined />
            Public Image URL
            <Tooltip title="URL công khai để truy cập hình ảnh từ website">
              <InfoCircleOutlined style={{ color: '#1890ff' }} />
            </Tooltip>
          </Space>
        </div>
        <div style={{ padding: '12px', backgroundColor: '#f6ffed', borderRadius: '6px', border: '1px solid #b7eb8f' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Typography.Text code style={{ flex: 1, wordBreak: 'break-all', fontSize: '12px' }}>
              {(() => {
                const imagesBaseUrl = import.meta.env.VITE_PUBLIC_SITE_URL_IMAGES || "http://localhost:4322/images/";
                let fileName = "";

                if (mode === 'create' && uploadedFiles.length > 0 && selectedFileIndex >= 0) {
                  // Create mode - get from uploaded file
                  fileName = uploadedFiles[selectedFileIndex]?.uploadedFileName ||
                            uploadedFiles[selectedFileIndex]?.file?.name?.replace(/\.[^/.]+$/, "") || "";
                } else if (mode === 'edit' && existingRecord?.file_name) {
                  // Edit mode - get from existing record (keep full filename with extension)
                  fileName = existingRecord.file_name || "ten-file-hinh-anh";
                } else {
                  // Fallback
                  fileName = "ten-file-hinh-anh";
                }

                return `${imagesBaseUrl}${fileName}`;
              })()}
            </Typography.Text>
          </div>
          <Space>
            <Button
              size="small"
              icon={<CopyOutlined />}
              onClick={() => {
                const imagesBaseUrl = import.meta.env.VITE_PUBLIC_SITE_URL_IMAGES || "http://localhost:4322/images/";
                let fileName = "";

                if (mode === 'create' && uploadedFiles.length > 0 && selectedFileIndex >= 0) {
                  fileName = uploadedFiles[selectedFileIndex]?.uploadedFileName ||
                            uploadedFiles[selectedFileIndex]?.file?.name?.replace(/\.[^/.]+$/, "") || "";
                } else if (mode === 'edit' && existingRecord?.file_name) {
                  fileName = existingRecord.file_name || "ten-file-hinh-anh";
                } else {
                  fileName = "ten-file-hinh-anh";
                }

                const publicLinkUrl = `${imagesBaseUrl}${fileName}`;
                navigator.clipboard.writeText(publicLinkUrl);
              }}
            >
              Copy
            </Button>
            <Button
              size="small"
              icon={<LinkOutlined />}
              onClick={() => {
                const imagesBaseUrl = import.meta.env.VITE_PUBLIC_SITE_URL_IMAGES || "http://localhost:4322/images/";
                let fileName = "";

                if (mode === 'create' && uploadedFiles.length > 0 && selectedFileIndex >= 0) {
                  fileName = uploadedFiles[selectedFileIndex]?.uploadedFileName ||
                            uploadedFiles[selectedFileIndex]?.file?.name?.replace(/\.[^/.]+$/, "") || "";
                } else if (mode === 'edit' && existingRecord?.file_name) {
                  fileName = existingRecord.file_name || "ten-file-hinh-anh";
                } else {
                  fileName = "ten-file-hinh-anh";
                }

                const publicLinkUrl = `${imagesBaseUrl}${fileName}`;
                window.open(publicLinkUrl, "_blank");
              }}
            >
              Mở link
            </Button>
          </Space>
        </div>
      </div>

      <div>
        <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#262626' }}>
          <Space>
            <EditOutlined />
            Lazy Loading
            <Tooltip title="Bật/tắt lazy loading cho hình ảnh - Tối ưu performance">
              <InfoCircleOutlined style={{ color: "#1890ff" }} />
            </Tooltip>
          </Space>
        </div>
        <Form.Item name="lazy_loading" valuePropName="checked" initialValue={true} style={{ marginBottom: 0 }}>
          <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
        </Form.Item>
      </div>

      <div>
        <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#262626' }}>
          <Space>
            <EditOutlined />
            Priority Loading
            <Tooltip title="Ưu tiên tải hình ảnh quan trọng (Above the fold)">
              <InfoCircleOutlined style={{ color: "#1890ff" }} />
            </Tooltip>
          </Space>
        </div>
        <Form.Item name="priority_loading" valuePropName="checked" initialValue={false} style={{ marginBottom: 0 }}>
          <Switch checkedChildren="Cao" unCheckedChildren="Thường" />
        </Form.Item>
      </div>
    </div>
  );
};
