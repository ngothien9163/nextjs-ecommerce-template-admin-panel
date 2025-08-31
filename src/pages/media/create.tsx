import React, { useState, useCallback } from "react";
import { Create, useForm } from "@refinedev/antd";
import {
  Form,
  Input,
  Switch,
  Button,
  Card,
  Space,
  message,
  Typography,
  Upload,
  Image,
  Tooltip,
  Select,
  Tag,
} from "antd";
import {
  UploadOutlined,
  PlusOutlined,
  InfoCircleOutlined,
  UserOutlined,
  CopyrightOutlined,
  FileTextOutlined,
  PictureOutlined,
  TagsOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useDropzone } from "react-dropzone";
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
  "CC0 (Public Domain) - Miền công cộng, tự do sử dụng",
  "CC BY (Attribution) - Ghi công tác giả",
  "CC BY-SA (Attribution-ShareAlike) - Ghi công và chia sẻ tương tự",
  "CC BY-ND (Attribution-NoDerivs) - Ghi công, không chỉnh sửa",
  "CC BY-NC (Attribution-NonCommercial) - Ghi công, không thương mại",
  "CC BY-NC-SA (Attribution-NonCommercial-ShareAlike) - Ghi công, không thương mại, chia sẻ tương tự",
  "CC BY-NC-ND (Attribution-NonCommercial-NoDerivs) - Ghi công, không thương mại, không chỉnh sửa",
  "All Rights Reserved - Bảo lưu mọi quyền",
  "Fair Use - Sử dụng hợp lý",
  "Custom - Tùy chỉnh",
];

export const MediaCreate: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{
      file: File;
      preview: string;
      uploaded: boolean;
      url?: string;
    }>
  >([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);

  const { formProps, saveButtonProps } = useForm({
    resource: "media",
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        uploaded: false,
      }));
      setUploadedFiles((prev) => [...prev, ...newFiles]);

      // Tự động điền thông tin từ file đầu tiên nếu form chưa có dữ liệu
      if (acceptedFiles.length > 0 && formProps.form) {
        const currentValues = formProps.form.getFieldsValue() as any;
        const firstFile = acceptedFiles[0];

        // Chỉ điền nếu các field chưa có dữ liệu
        if (!currentValues.file_name) {
          const fileName = firstFile.name.replace(/\.[^/.]+$/, ""); // Bỏ extension

          // Tạo alt text và title thông minh hơn
          const smartAltText = fileName
            .replace(/[-_]/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase())
            .replace(/\s+/g, " ")
            .trim();

          // Tạo meta description từ alt text với nhiều gợi ý
          const metaDescriptions = [
            `Hình ảnh ${smartAltText.toLowerCase()}, chất lượng cao, phù hợp cho website và marketing.`,
            `Ảnh ${smartAltText.toLowerCase()} đẹp, rõ nét, tối ưu cho SEO và trải nghiệm người dùng.`,
            `${smartAltText} - Hình ảnh chuyên nghiệp, phù hợp cho các dự án thương mại và cá nhân.`,
            `Tải hình ảnh ${smartAltText.toLowerCase()} miễn phí, chất lượng cao, không có watermark.`,
          ];

          // Tạo caption từ alt text
          const captions = [
            `${smartAltText} - Hình ảnh chất lượng cao`,
            `Ảnh ${smartAltText.toLowerCase()} đẹp và rõ nét`,
            `${smartAltText} - Tài liệu hình ảnh chuyên nghiệp`,
            `Hình ảnh ${smartAltText.toLowerCase()} phù hợp cho nhiều mục đích sử dụng`,
          ];

          // Tạo keywords từ tên file
          const keywords = fileName
            .replace(/[-_]/g, " ")
            .split(" ")
            .filter((word) => word.length > 2)
            .join(", ");

          formProps.form.setFieldsValue({
            file_name: fileName,
            alt_text: smartAltText,
            title: smartAltText,
            caption: captions[0], // Sử dụng caption đầu tiên
            meta_description: metaDescriptions[0], // Sử dụng description đầu tiên
            meta_keywords: keywords,
            image_format: firstFile.type.split("/")[1]?.toUpperCase() || "JPEG",
            lazy_loading: true,
            priority_loading: false,
          });
        }
      }
    },
    [formProps.form]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp", ".svg"],
    },
    multiple: true,
  });

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) {
      message.warning("Vui lòng chọn files để upload!");
      return;
    }

    try {
      const uploadPromises = uploadedFiles.map(async (fileData) => {
        if (fileData.uploaded) return fileData;

        const file = fileData.file;
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${fileExt}`;
        const filePath = `media/${fileName}`;

        // Upload to Supabase Storage using admin client
        const { data: uploadData, error: uploadError } =
          await supabaseAdmin.storage.from("media").upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabaseAdmin.storage
          .from("media")
          .getPublicUrl(filePath);

        return {
          ...fileData,
          uploaded: true,
          url: urlData.publicUrl,
        };
      });

      const uploadedFilesData = await Promise.all(uploadPromises);
      setUploadedFiles(uploadedFilesData);
      message.success("Upload thành công!");
    } catch (error) {
      console.error("Upload error:", error);
      message.error("Có lỗi xảy ra khi upload!");
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);

      // Cập nhật selectedFileIndex nếu cần
      if (newFiles.length === 0) {
        setSelectedFileIndex(0);
      } else if (selectedFileIndex >= newFiles.length) {
        setSelectedFileIndex(newFiles.length - 1);
      }

      return newFiles;
    });
  };

  const selectFile = (index: number) => {
    setSelectedFileIndex(index);

    // Cập nhật form với thông tin của file được chọn
    if (uploadedFiles[index] && formProps.form) {
      const file = uploadedFiles[index].file;
      const fileName = file.name.replace(/\.[^/.]+$/, ""); // Bỏ extension

      // Tạo alt text và title thông minh hơn
      const smartAltText = fileName
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase())
        .replace(/\s+/g, " ")
        .trim();

      // Tạo meta description từ alt text với nhiều gợi ý
      const metaDescriptions = [
        `Hình ảnh ${smartAltText.toLowerCase()}, chất lượng cao, phù hợp cho website và marketing.`,
        `Ảnh ${smartAltText.toLowerCase()} đẹp, rõ nét, tối ưu cho SEO và trải nghiệm người dùng.`,
        `${smartAltText} - Hình ảnh chuyên nghiệp, phù hợp cho các dự án thương mại và cá nhân.`,
        `Tải hình ảnh ${smartAltText.toLowerCase()} miễn phí, chất lượng cao, không có watermark.`,
      ];

      // Tạo caption từ alt text
      const captions = [
        `${smartAltText} - Hình ảnh chất lượng cao`,
        `Ảnh ${smartAltText.toLowerCase()} đẹp và rõ nét`,
        `${smartAltText} - Tài liệu hình ảnh chuyên nghiệp`,
        `Hình ảnh ${smartAltText.toLowerCase()} phù hợp cho nhiều mục đích sử dụng`,
      ];

      // Tạo keywords từ tên file
      const keywords = fileName
        .replace(/[-_]/g, " ")
        .split(" ")
        .filter((word) => word.length > 2)
        .join(", ");

      formProps.form.setFieldsValue({
        file_name: fileName,
        alt_text: smartAltText,
        title: smartAltText,
        caption: captions[0], // Sử dụng caption đầu tiên
        meta_description: metaDescriptions[0], // Sử dụng description đầu tiên
        meta_keywords: keywords,
        image_format: file.type.split("/")[1]?.toUpperCase() || "JPEG",
        lazy_loading: true,
        priority_loading: false,
      });
    }
  };

  const handleFormSubmit = async (values: any) => {
    try {
      // Đảm bảo tất cả values là string, không phải array
      const cleanValues = Object.keys(values).reduce((acc, key) => {
        const value = values[key];
        // Nếu là array, chuyển thành string
        if (Array.isArray(value)) {
          acc[key] = value.join(", ");
        } else {
          acc[key] = value;
        }
        return acc;
      }, {} as any);

      // Thêm file_url từ file được chọn
      if (
        uploadedFiles.length > 0 &&
        uploadedFiles[selectedFileIndex]?.uploaded
      ) {
        const selectedFile = uploadedFiles[selectedFileIndex];
        cleanValues.file_url = selectedFile.url;
        cleanValues.file_path = `media/${selectedFile.file.name}`;
        cleanValues.file_size = selectedFile.file.size;
        cleanValues.mime_type = selectedFile.file.type;
      }

      console.log("Submitting values:", cleanValues);

      // Sử dụng supabaseAdmin để tạo record
      const { data, error } = await supabaseAdmin
        .from("media")
        .insert(cleanValues)
        .select()
        .single();

      if (error) {
        console.error("Database error:", error);
        throw error;
      }

      message.success("Tạo media thành công!");
      formProps.form?.resetFields();
      setUploadedFiles([]);
    } catch (error: any) {
      console.error("Submit error:", error);
      message.error(`Có lỗi xảy ra: ${error?.message || error}`);
    }
  };

  return (
    <Create
      saveButtonProps={{
        ...saveButtonProps,
        onClick: () => {
          formProps.form?.validateFields().then(handleFormSubmit);
        },
      }}
    >
      <div style={{ display: "flex", gap: "20px" }}>
        {/* Upload Section */}
        <div style={{ flex: 1 }}>
          <Card title="Upload Files" style={{ marginBottom: "20px" }}>
            <div
              {...getRootProps()}
              style={{
                border: "2px dashed #d9d9d9",
                borderRadius: "6px",
                padding: "40px",
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: isDragActive ? "#f0f8ff" : "#fafafa",
                marginBottom: "16px",
              }}
            >
              <input {...getInputProps()} />
              <UploadOutlined
                style={{
                  fontSize: "48px",
                  color: "#1890ff",
                  marginBottom: "16px",
                }}
              />
              <p style={{ fontSize: "16px", marginBottom: "8px" }}>
                {isDragActive
                  ? "Thả files vào đây..."
                  : "Kéo thả files hoặc click để chọn"}
              </p>
              <p style={{ fontSize: "14px", color: "#666" }}>
                Hỗ trợ: JPG, PNG, GIF, WEBP, SVG
              </p>
            </div>

            <Button
              type="primary"
              icon={<UploadOutlined />}
              onClick={handleUpload}
              disabled={uploadedFiles.length === 0}
              style={{ width: "100%" }}
            >
              Upload Files
            </Button>
          </Card>

          {/* File Preview */}
          {uploadedFiles.length > 0 && (
            <Card
              title={
                <Space>
                  <span>Files đã chọn ({uploadedFiles.length})</span>
                  {uploadedFiles.length > 1 && (
                    <Tag color="blue">
                      File đang chọn:{" "}
                      {uploadedFiles[selectedFileIndex]?.file.name}
                    </Tag>
                  )}
                </Space>
              }
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                  gap: "12px",
                }}
              >
                {uploadedFiles.map((fileData, index) => (
                  <div
                    key={index}
                    style={{
                      position: "relative",
                      border:
                        selectedFileIndex === index
                          ? "2px solid #1890ff"
                          : "2px solid transparent",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onClick={() => selectFile(index)}
                  >
                    <Image
                      src={fileData.preview}
                      alt={fileData.file.name}
                      style={{
                        width: "100%",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "6px",
                      }}
                      fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                    />
                    <div style={{ padding: "8px" }}>
                      <Text
                        strong
                        style={{ fontSize: "12px", display: "block" }}
                      >
                        {fileData.file.name.length > 15
                          ? fileData.file.name.substring(0, 15) + "..."
                          : fileData.file.name}
                      </Text>
                      <Text type="secondary" style={{ fontSize: "10px" }}>
                        {(fileData.file.size / 1024 / 1024).toFixed(2)} MB
                      </Text>
                      <div
                        style={{
                          marginTop: "4px",
                          display: "flex",
                          gap: "4px",
                        }}
                      >
                        <Button
                          size="small"
                          type={
                            selectedFileIndex === index ? "primary" : "default"
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            selectFile(index);
                          }}
                        >
                          {selectedFileIndex === index ? "Đang chọn" : "Chọn"}
                        </Button>
                        <Button
                          size="small"
                          danger
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(index);
                          }}
                        >
                          Xóa
                        </Button>
                      </div>
                    </div>
                    {fileData.uploaded && (
                      <div
                        style={{
                          position: "absolute",
                          top: "4px",
                          right: "4px",
                          background: "#52c41a",
                          color: "white",
                          borderRadius: "50%",
                          width: "20px",
                          height: "20px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                        }}
                      >
                        ✓
                      </div>
                    )}
                    {selectedFileIndex === index && (
                      <div
                        style={{
                          position: "absolute",
                          top: "4px",
                          left: "4px",
                          background: "#1890ff",
                          color: "white",
                          borderRadius: "50%",
                          width: "20px",
                          height: "20px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                        }}
                      >
                        👁
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Form Section */}
        <div style={{ flex: 1 }}>
          <Form {...formProps} layout="vertical" onFinish={handleFormSubmit}>
            <Card
              title={
                <div>
                  <div style={{ marginBottom: "8px" }}>
                    <span>Thông tin Media</span>
                  </div>
                  {uploadedFiles.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      <Tag
                        color="green"
                        style={{
                          maxWidth: "100%",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        File: {uploadedFiles[selectedFileIndex]?.file.name}
                      </Tag>
                      <Button
                        size="small"
                        type="dashed"
                        onClick={() => selectFile(selectedFileIndex)}
                        title="Tự động điền lại thông tin từ file"
                      >
                        🔄 Tự động điền
                      </Button>
                    </div>
                  )}
                </div>
              }
            >
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
                    <Tooltip title="Mô tả hình ảnh cho SEO và accessibility, rất quan trọng cho người dùng khiếm thị">
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
                    {uploadedFiles.length > 0 && (
                      <Button
                        size="small"
                        type="dashed"
                        onClick={() => {
                          const file = uploadedFiles[selectedFileIndex]?.file;
                          if (file && formProps.form) {
                            const fileName = file.name.replace(/\.[^/.]+$/, "");
                            const smartAltText = fileName
                              .replace(/[-_]/g, " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())
                              .replace(/\s+/g, " ")
                              .trim();

                            const captions = [
                              `${smartAltText} - Hình ảnh chất lượng cao`,
                              `Ảnh ${smartAltText.toLowerCase()} đẹp và rõ nét`,
                              `${smartAltText} - Tài liệu hình ảnh chuyên nghiệp`,
                              `Hình ảnh ${smartAltText.toLowerCase()} phù hợp cho nhiều mục đích sử dụng`,
                            ];

                            const currentCaption =
                              formProps.form.getFieldValue("caption");
                            const currentIndex =
                              captions.indexOf(currentCaption);
                            const nextIndex =
                              (currentIndex + 1) % captions.length;
                            formProps.form.setFieldsValue({
                              caption: captions[nextIndex],
                            });
                          }
                        }}
                        title="Chọn gợi ý Caption khác"
                      >
                        🔄 Gợi ý
                      </Button>
                    )}
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
                    {uploadedFiles.length > 0 && (
                      <Button
                        size="small"
                        type="dashed"
                        onClick={() => {
                          const file = uploadedFiles[selectedFileIndex]?.file;
                          if (file && formProps.form) {
                            const fileName = file.name.replace(/\.[^/.]+$/, "");
                            const smartAltText = fileName
                              .replace(/[-_]/g, " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())
                              .replace(/\s+/g, " ")
                              .trim();

                            const metaDescriptions = [
                              `Hình ảnh ${smartAltText.toLowerCase()}, chất lượng cao, phù hợp cho website và marketing.`,
                              `Ảnh ${smartAltText.toLowerCase()} đẹp, rõ nét, tối ưu cho SEO và trải nghiệm người dùng.`,
                              `${smartAltText} - Hình ảnh chuyên nghiệp, phù hợp cho các dự án thương mại và cá nhân.`,
                              `Tải hình ảnh ${smartAltText.toLowerCase()} miễn phí, chất lượng cao, không có watermark.`,
                            ];

                            const currentDescription =
                              formProps.form.getFieldValue("meta_description");
                            const currentIndex =
                              metaDescriptions.indexOf(currentDescription);
                            const nextIndex =
                              (currentIndex + 1) % metaDescriptions.length;
                            formProps.form.setFieldsValue({
                              meta_description: metaDescriptions[nextIndex],
                            });
                          }
                        }}
                        title="Chọn gợi ý Meta Description khác"
                      >
                        🔄 Gợi ý
                      </Button>
                    )}
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
                    <EditOutlined />
                    Image Dimensions
                    <Tooltip title="Kích thước hình ảnh (width x height) - Quan trọng cho SEO và performance">
                      <InfoCircleOutlined style={{ color: "#1890ff" }} />
                    </Tooltip>
                  </Space>
                }
                name="image_dimensions"
              >
                <Input placeholder="Ví dụ: 1920x1080" />
              </Form.Item>

              <Form.Item
                label={
                  <Space>
                    <EditOutlined />
                    File Size (KB)
                    <Tooltip title="Kích thước file tính bằng KB - Quan trọng cho performance">
                      <InfoCircleOutlined style={{ color: "#1890ff" }} />
                    </Tooltip>
                  </Space>
                }
                name="file_size_kb"
              >
                <Input placeholder="Ví dụ: 245" />
              </Form.Item>

              <Form.Item
                label={
                  <Space>
                    <EditOutlined />
                    Image Format
                    <Tooltip title="Định dạng hình ảnh - Quan trọng cho SEO và performance">
                      <InfoCircleOutlined style={{ color: "#1890ff" }} />
                    </Tooltip>
                  </Space>
                }
                name="image_format"
              >
                <Select placeholder="Chọn định dạng hình ảnh">
                  <Option value="JPEG">JPEG - Phù hợp cho ảnh thực tế</Option>
                  <Option value="PNG">
                    PNG - Phù hợp cho ảnh có trong suốt
                  </Option>
                  <Option value="WebP">
                    WebP - Định dạng hiện đại, nén tốt
                  </Option>
                  <Option value="AVIF">
                    AVIF - Định dạng mới nhất, nén tốt nhất
                  </Option>
                  <Option value="SVG">SVG - Vector, phù hợp cho icon</Option>
                  <Option value="GIF">GIF - Animation</Option>
                </Select>
              </Form.Item>

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
                initialValue="Original Content"
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
                  <Option value="Wikimedia Commons">
                    🆓 Wikimedia Commons
                  </Option>
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
                initialValue="All Rights Reserved - Bảo lưu mọi quyền"
              >
                <Select
                  placeholder="All Rights Reserved (Mặc định - Bảo lưu mọi quyền)"
                  allowClear
                  showSearch
                  optionFilterProp="children"
                >
                  {LICENSE_PRESETS.map((license) => (
                    <Option key={license} value={license}>
                      {license}
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
                initialValue={true}
              >
                <Switch checkedChildren="Hiển thị" unCheckedChildren="Ẩn" />
              </Form.Item>
            </Card>
          </Form>
        </div>
      </div>
    </Create>
  );
};
