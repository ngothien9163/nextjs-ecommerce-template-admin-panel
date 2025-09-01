import React from "react";
import { Form, Input, Select, Space, Tooltip, Tag, Switch } from "antd";
import { EditOutlined, InfoCircleOutlined } from "@ant-design/icons";

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
}

export const MediaTechnicalInfo: React.FC<MediaTechnicalInfoProps> = ({ 
  mode = 'create',
  uploadedFiles = [],
  selectedFileIndex = 0
}) => {
  const isAutoFilled = mode === 'create' && uploadedFiles.length > 0 && uploadedFiles[selectedFileIndex]?.dimensions;
  const isEditMode = mode === 'edit';
  const selectedFile = uploadedFiles[selectedFileIndex];

  return (
    <>
      <Form.Item
        label={
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
        }
        name="image_dimensions"
      >
        <Input 
          placeholder="Ví dụ: 1920x1080" 
          readOnly={!!(isAutoFilled || isEditMode)}
          style={{
            backgroundColor: (isAutoFilled || isEditMode) ? '#f6ffed' : 'white'
          }}
        />
      </Form.Item>

      <Form.Item
        label={
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
        }
        name="file_size_kb"
      >
        <Input 
          placeholder="Ví dụ: 245" 
          readOnly={!!(isAutoFilled || isEditMode)}
          style={{
            backgroundColor: (isAutoFilled || isEditMode) ? '#f6ffed' : 'white'
          }}
        />
      </Form.Item>

      <Form.Item
        label={
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
        }
        name="image_format"
      >
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

      <Form.Item
        label={
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
        }
        name="mime_type"
      >
        <Input 
          placeholder="Ví dụ: image/jpeg" 
          readOnly={!!(isAutoFilled || isEditMode)}
          style={{
            backgroundColor: (isAutoFilled || isEditMode) ? '#f6ffed' : 'white'
          }}
        />
      </Form.Item>

      {mode === 'create' && (
        <>
          <Form.Item
            label={
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
            }
            name="file_path"
          >
            <Input 
              placeholder="Tự động tạo khi upload file" 
              readOnly
              style={{ backgroundColor: '#f6ffed' }}
            />
          </Form.Item>

          <Form.Item
            label={
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
            }
            name="file_url"
          >
            <Input 
              placeholder="Tự động tạo sau khi upload file" 
              readOnly
              style={{ backgroundColor: '#f6ffed' }}
            />
          </Form.Item>
        </>
      )}

      <Form.Item
        label={
          <Space>
            <EditOutlined />
            Lazy Loading
            <Tooltip title="Bật/tắt lazy loading cho hình ảnh - Tối ưu performance">
              <InfoCircleOutlined style={{ color: "#1890ff" }} />
            </Tooltip>
          </Space>
        }
        name="lazy_loading"
        valuePropName="checked"
        initialValue={true}
      >
        <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
      </Form.Item>

      <Form.Item
        label={
          <Space>
            <EditOutlined />
            Priority Loading
            <Tooltip title="Ưu tiên tải hình ảnh quan trọng (Above the fold)">
              <InfoCircleOutlined style={{ color: "#1890ff" }} />
            </Tooltip>
          </Space>
        }
        name="priority_loading"
        valuePropName="checked"
        initialValue={false}
      >
        <Switch checkedChildren="Cao" unCheckedChildren="Thường" />
      </Form.Item>
    </>
  );
};
