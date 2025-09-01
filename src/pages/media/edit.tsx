import React, { useState, useRef } from "react";
import { Edit, useForm } from "@refinedev/antd";
import {
  Form,
  Input,
  Switch,
  Button,
  Card,
  Image,
  Space,
  message,
  Typography,
  Divider,
  Select,
  Tooltip,
} from "antd";
import {
  SaveOutlined,
  ScissorOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  InfoCircleOutlined,
  UserOutlined,
  CopyrightOutlined,
  FileTextOutlined,
  PictureOutlined,
  TagsOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { supabaseAdmin } from "../../lib/supabase-admin";

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Option } = Select;

// Preset data cho Credit và License
const CREDIT_PRESETS = [
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

const LICENSE_PRESETS = [
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

export const MediaEdit: React.FC = () => {
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    x: 0,
    y: 0,
    width: 30,
    height: 30,
  });
  const [isCropping, setIsCropping] = useState(false);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);

  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: "media",
  });

  const mediaData = queryResult?.data?.data;

  // Crop functionality
  const onCropChange = (crop: Crop) => {
    setCrop(crop);
  };

  const onCropComplete = async (crop: any, pixelCrop: any) => {
    if (!imageRef.current) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
    const scaleY = imageRef.current.naturalHeight / imageRef.current.height;

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      imageRef.current,
      pixelCrop.x * scaleX,
      pixelCrop.y * scaleY,
      pixelCrop.width * scaleX,
      pixelCrop.height * scaleY,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    const croppedImageBlob = await new Promise<Blob>((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
        },
        "image/jpeg",
        0.9
      );
    });

    const croppedImageUrl = URL.createObjectURL(croppedImageBlob);
    setCroppedImageUrl(croppedImageUrl);
  };

  const handleCropSave = async () => {
    if (!croppedImageUrl) return;

    try {
      // Convert blob URL to file
      const response = await fetch(croppedImageUrl);
      const blob = await response.blob();
      const file = new File(
        [blob],
        mediaData?.file_name || "cropped-image.jpg",
        { type: "image/jpeg" }
      );

      // Upload cropped image
      const fileExt = file.name.split(".").pop();
      const fileName = `cropped-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;
      const filePath = `media/${fileName}`;

      const { data: uploadData, error: uploadError } =
        await supabaseAdmin.storage.from("media").upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabaseAdmin.storage
        .from("media")
        .getPublicUrl(filePath);

      // Update media record
      const { error: updateError } = await supabaseAdmin
        .from("media")
        .update({
          file_path: filePath,
          file_url: urlData.publicUrl,
          file_size: file.size,
        })
        .eq("id", mediaData?.id);

      if (updateError) throw updateError;

      message.success("Đã crop và lưu hình ảnh thành công!");
      setIsCropping(false);
      setCroppedImageUrl(null);

      // Refresh form data
      window.location.reload();
    } catch (error) {
      console.error("Crop save error:", error);
      message.error("Có lỗi xảy ra khi lưu hình ảnh đã crop!");
    }
  };

  const handleRotate = (direction: "left" | "right") => {
    const newRotation = direction === "left" ? rotation - 90 : rotation + 90;
    setRotation(newRotation);
  };

  const applyRotation = (imageUrl: string): Promise<string> => {
    if (rotation === 0) return Promise.resolve(imageUrl);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new window.Image();

    return new Promise<string>((resolve) => {
      img.onload = () => {
        canvas.width = img.height;
        canvas.height = img.width;

        ctx?.translate(canvas.width / 2, canvas.height / 2);
        ctx?.rotate((rotation * Math.PI) / 180);
        ctx?.drawImage(img, -img.width / 2, -img.height / 2);

        resolve(canvas.toDataURL());
      };
      img.src = imageUrl;
    });
  };

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <div style={{ display: "flex", gap: "20px" }}>
        {/* Form Section */}
        <div style={{ flex: 1 }}>
          <Form {...formProps} layout="vertical">
            <Card title="Thông tin Media" style={{ marginBottom: "20px" }}>
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
              >
                <Input placeholder="Tên file gốc" />
              </Form.Item>

              <Form.Item
                label={
                  <Space>
                    <EyeOutlined />
                    Alt Text
                    <Tooltip title="Mô tả hình ảnh cho SEO và accessibility, rất quan trọng cho người dùng khuyết thị">
                      <InfoCircleOutlined style={{ color: "#1890ff" }} />
                    </Tooltip>
                  </Space>
                }
                name="alt_text"
                rules={[{ required: true, message: "Vui lòng nhập alt text!" }]}
              >
                <Input placeholder="Mô tả hình ảnh cho SEO" />
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
              >
                <Input placeholder="Tiêu đề khi hover" />
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
              >
                <TextArea rows={3} placeholder="Chú thích hình ảnh" />
              </Form.Item>

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
              >
                <TextArea rows={2} placeholder="Mô tả chi tiết cho SEO" />
              </Form.Item>

              <Form.Item
                label={
                  <Space>
                    <TagsOutlined />
                    Meta Keywords
                    <Tooltip title="Từ khóa SEO, phân cách bằng dấu phẩy. Ví dụ: laptop, asus, gaming">
                      <InfoCircleOutlined style={{ color: "#1890ff" }} />
                    </Tooltip>
                  </Space>
                }
                name="meta_keywords"
              >
                <Input placeholder="Từ khóa SEO (phân cách bằng dấu phẩy)" />
              </Form.Item>

              <Form.Item
                label={
                  <Space>
                    <UserOutlined />
                    Credit
                    <Tooltip title="Nguồn gốc hoặc người tạo ra hình ảnh">
                      <InfoCircleOutlined style={{ color: "#1890ff" }} />
                    </Tooltip>
                  </Space>
                }
                name="credit"
              >
                <Select
                  placeholder="Chọn hoặc nhập nguồn"
                  allowClear
                  showSearch
                  optionFilterProp="children"
                >
                  {CREDIT_PRESETS.map((preset) => (
                    <Option key={preset} value={preset}>
                      {preset}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label={
                  <Space>
                    <CopyrightOutlined />
                    License
                    <Tooltip title="Giấy phép sử dụng hình ảnh này">
                      <InfoCircleOutlined style={{ color: "#1890ff" }} />
                    </Tooltip>
                  </Space>
                }
                name="license"
              >
                <Select
                  placeholder="Chọn loại giấy phép"
                  allowClear
                  showSearch
                  optionFilterProp="children"
                >
                  {LICENSE_PRESETS.map((preset) => (
                    <Option key={preset.value} value={preset.value}>
                      {preset.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

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
              >
                <Switch checkedChildren="Hiển thị" unCheckedChildren="Ẩn" />
              </Form.Item>
            </Card>

            <Card title="Thông tin kỹ thuật" style={{ marginBottom: "20px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <div>
                  <Text strong>Loại file:</Text>
                  <br />
                  <Text type="secondary">{mediaData?.mime_type}</Text>
                </div>
                <div>
                  <Text strong>Kích thước file:</Text>
                  <br />
                  <Text type="secondary">
                    {mediaData?.file_size
                      ? `${(mediaData.file_size / 1024 / 1024).toFixed(2)} MB`
                      : mediaData?.file_size_kb
                      ? `${mediaData.file_size_kb} KB`
                      : "N/A"}
                  </Text>
                </div>
                <div>
                  <Text strong>Độ phân giải:</Text>
                  <br />
                  <Text type="secondary">
                    {mediaData?.image_dimensions ||
                    (mediaData?.dimensions
                      ? `${mediaData.dimensions.width} x ${mediaData.dimensions.height}`
                      : "N/A")}
                  </Text>
                </div>
                <div>
                  <Text strong>Định dạng:</Text>
                  <br />
                  <Text type="secondary">{mediaData?.image_format || "N/A"}</Text>
                </div>
                <div>
                  <Text strong>Ngày tạo:</Text>
                  <br />
                  <Text type="secondary">
                    {mediaData?.created_at
                      ? new Date(mediaData.created_at).toLocaleDateString(
                          "vi-VN"
                        )
                      : "N/A"}
                  </Text>
                </div>
                <div>
                  <Text strong>Số lần sử dụng:</Text>
                  <br />
                  <Text type="secondary">{mediaData?.usage_count || 0}</Text>
                </div>
                <div>
                  <Text strong>Phiên bản:</Text>
                  <br />
                  <Text type="secondary">{mediaData?.version || 1}</Text>
                </div>
                <div>
                  <Text strong>URL:</Text>
                  <br />
                  <Text type="secondary" code copyable>
                    {mediaData?.file_url || "N/A"}
                  </Text>
                </div>
              </div>
            </Card>

            {/* Card SEO Scores */}
            <Card title="Điểm SEO & Performance" style={{ marginBottom: "20px" }}>
              <Form.Item
                label={
                  <Space>
                    <TagsOutlined />
                    SEO Score
                    <Tooltip title="Điểm SEO của media (0-100)">
                      <InfoCircleOutlined style={{ color: "#1890ff" }} />
                    </Tooltip>
                  </Space>
                }
                name="seo_score"
              >
                <Input type="number" min={0} max={100} placeholder="0-100" />
              </Form.Item>

              <Form.Item
                label={
                  <Space>
                    <TagsOutlined />
                    Accessibility Score
                    <Tooltip title="Điểm accessibility (0-100)">
                      <InfoCircleOutlined style={{ color: "#1890ff" }} />
                    </Tooltip>
                  </Space>
                }
                name="accessibility_score"
              >
                <Input type="number" min={0} max={100} placeholder="0-100" />
              </Form.Item>

              <Form.Item
                label={
                  <Space>
                    <TagsOutlined />
                    Performance Score
                    <Tooltip title="Điểm performance (0-100)">
                      <InfoCircleOutlined style={{ color: "#1890ff" }} />
                    </Tooltip>
                  </Space>
                }
                name="performance_score"
              >
                <Input type="number" min={0} max={100} placeholder="0-100" />
              </Form.Item>
            </Card>

            {/* Card Settings */}
            <Card title="Cài đặt hiện thị" style={{ marginBottom: "20px" }}>
              <Form.Item
                label={
                  <Space>
                    Lazy Loading
                    <Tooltip title="Bật/tắt lazy loading cho hình ảnh">
                      <InfoCircleOutlined style={{ color: "#1890ff" }} />
                    </Tooltip>
                  </Space>
                }
                name="lazy_loading"
                valuePropName="checked"
              >
                <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
              </Form.Item>

              <Form.Item
                label={
                  <Space>
                    Priority Loading
                    <Tooltip title="Ưu tiên tải hình ảnh quan trọng">
                      <InfoCircleOutlined style={{ color: "#1890ff" }} />
                    </Tooltip>
                  </Space>
                }
                name="priority_loading"
                valuePropName="checked"
              >
                <Switch checkedChildren="Cao" unCheckedChildren="Thường" />
              </Form.Item>
            </Card>
          </Form>
        </div>

        {/* Image Preview & Crop Section */}
        <div style={{ flex: 1 }}>
          <Card title="Xem trước & Chỉnh sửa">
            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <Space>
                <Button
                  icon={<ScissorOutlined />}
                  onClick={() => setIsCropping(!isCropping)}
                  type={isCropping ? "primary" : "default"}
                >
                  {isCropping ? "Thoát Crop" : "Crop"}
                </Button>
                <Button
                  icon={<RotateLeftOutlined />}
                  onClick={() => handleRotate("left")}
                >
                  Xoay trái
                </Button>
                <Button
                  icon={<RotateRightOutlined />}
                  onClick={() => handleRotate("right")}
                >
                  Xoay phải
                </Button>
              </Space>
            </div>

            <div style={{ position: "relative", textAlign: "center" }}>
              {isCropping ? (
                <div style={{ maxWidth: "100%", overflow: "hidden" }}>
                  <ReactCrop
                    crop={crop}
                    onChange={onCropChange}
                    onComplete={(crop, pixelCrop) =>
                      onCropComplete(crop, pixelCrop)
                    }
                  >
                    <img
                      ref={imageRef}
                      src={mediaData?.file_url}
                      alt={mediaData?.alt_text || mediaData?.file_name}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "400px",
                        transform: `rotate(${rotation}deg)`,
                      }}
                    />
                  </ReactCrop>
                  {croppedImageUrl && (
                    <div style={{ marginTop: "16px" }}>
                      <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={handleCropSave}
                      >
                        Lưu Crop
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <Image
                  src={mediaData?.file_url}
                  alt={mediaData?.alt_text || mediaData?.file_name}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "400px",
                    transform: `rotate(${rotation}deg)`,
                  }}
                  fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                />
              )}
            </div>

            {croppedImageUrl && (
              <div style={{ marginTop: "16px" }}>
                <Divider>Hình ảnh đã crop</Divider>
                <Image
                  src={croppedImageUrl}
                  alt="Cropped preview"
                  style={{ maxWidth: "100%", maxHeight: "200px" }}
                />
              </div>
            )}
          </Card>
        </div>
      </div>
    </Edit>
  );
};
