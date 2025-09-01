import React, { useState, useCallback } from "react";
import { List, CreateButton, useTable } from "@refinedev/antd";
import {
  Card,
  Button,
  Modal,
  Input,
  Select,
  Space,
  Tag,
  Image,
  Typography,
  message,
} from "antd";
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  LinkOutlined,
  CopyOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useDropzone } from "react-dropzone";
// Disable GridLayout import for now
// import GridLayout from "react-grid-layout";
// import "react-grid-layout/css/styles.css";
// import "react-resizable/css/styles.css";
import "../../styles/media-management.css";
import { supabase } from "../../lib/supabase";
import { supabaseAdmin } from "../../lib/supabase-admin";
import { CustomDeleteButton } from "../../components/custom-delete-button";
import { useNavigate } from "react-router-dom";

const { Text, Title } = Typography;
const { Option } = Select;

interface MediaItem {
  id: string;
  file_name: string;
  file_url: string;
  file_path?: string;
  alt_text?: string;
  title?: string;
  caption?: string;
  file_size: number;
  mime_type: string;
  dimensions?: { width: number; height: number };
  is_active: boolean;
  created_at: string;
}

export const MediaList: React.FC = () => {
  const navigate = useNavigate();
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [layout, setLayout] = useState<any[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

  const { tableProps } = useTable({
    resource: "media",
    syncWithLocation: true,
  });

  // Generate grid layout
  React.useEffect(() => {
    if (tableProps.dataSource) {
      console.log("Media data:", tableProps.dataSource);

      // Debug: Log URL của từng item
      tableProps.dataSource.forEach((item: any, index: number) => {
        console.log(`Item ${index}:`, {
          id: item.id,
          file_name: item.file_name,
          file_url: item.file_url,
          file_path: item.file_path,
        });
      });

      const newLayout = tableProps.dataSource.map(
        (item: any, index: number) => ({
          i: item.id,
          x: (index % 4) * 3,
          y: Math.floor(index / 4) * 3,
          w: 3,
          h: 4,
          minW: 2,
          minH: 3,
        })
      );
      setLayout(newLayout);
      setMediaItems(tableProps.dataSource as MediaItem[]);
    }
  }, [tableProps.dataSource]);

  // Upload functionality
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      console.log(
        "Starting upload for files:",
        acceptedFiles.map((f) => f.name)
      );

      const uploadPromises = acceptedFiles.map(async (file) => {
        console.log(
          "Processing file:",
          file.name,
          "Size:",
          file.size,
          "Type:",
          file.type
        );

        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${fileExt}`;
        const filePath = `media/${fileName}`;

        console.log("File path:", filePath);

        // Upload to Supabase Storage using admin client
        const { data: uploadData, error: uploadError } =
          await supabaseAdmin.storage.from("media").upload(filePath, file);

        if (uploadError) {
          console.error("Supabase upload error:", uploadError);
          throw uploadError;
        }

        console.log("Upload successful:", uploadData);

        // Get public URL
        const { data: urlData } = supabaseAdmin.storage
          .from("media")
          .getPublicUrl(filePath);

        console.log("Public URL:", urlData.publicUrl);

        // Create media record
        const { data: mediaData, error: mediaError } = await supabaseAdmin
          .from("media")
          .insert({
            file_name: file.name,
            file_path: filePath,
            file_url: urlData.publicUrl,
            file_size: file.size,
            mime_type: file.type,
            alt_text: file.name,
            title: file.name,
          })
          .select()
          .single();

        if (mediaError) {
          console.error("Database insert error:", mediaError);
          throw mediaError;
        }

        console.log("Media record created:", mediaData);
        return mediaData;
      });

      const uploadedMedia = await Promise.all(uploadPromises);
      message.success(`Đã upload ${uploadedMedia.length} file thành công!`);
      setIsUploadModalVisible(false);
      // Refresh the page to show new data
      window.location.reload();
    } catch (error: any) {
      console.error("Upload error details:", error);
      message.error(
        `Có lỗi xảy ra khi upload file: ${error?.message || error}`
      );
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp", ".svg"],
    },
    multiple: true,
  });

  // Lightbox functionality
  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  // Navigation functions
  const handleEdit = (id: string) => {
    navigate(`/media/edit/${id}`);
  };

  const handleView = (id: string) => {
    navigate(`/media/show/${id}`);
  };

  // Utility functions
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success("Đã copy URL vào clipboard!");
  };

  const openImageUrl = (url: string) => {
    window.open(url, "_blank");
  };

  const showImageInfo = (item: MediaItem) => {
    Modal.info({
      title: "Thông tin hình ảnh",
      width: 600,
      content: (
        <div>
          <p>
            <strong>ID:</strong> {item.id}
          </p>
          <p>
            <strong>Tên file:</strong> {item.file_name}
          </p>
          <p>
            <strong>Đường dẫn:</strong> {item.file_path}
          </p>
          <p>
            <strong>URL:</strong> {item.file_url}
          </p>
          <p>
            <strong>Kích thước:</strong> {formatFileSize(item.file_size)}
          </p>
          <p>
            <strong>Loại file:</strong> {item.mime_type}
          </p>
          <p>
            <strong>Trạng thái:</strong>{" "}
            {item.is_active ? "Active" : "Inactive"}
          </p>
          <p>
            <strong>Ngày tạo:</strong>{" "}
            {new Date(item.created_at).toLocaleString("vi-VN")}
          </p>
          <hr />
          <p>
            <strong>Test URL:</strong>
          </p>
          <Button
            type="link"
            onClick={() => window.open(item.file_url, "_blank")}
          >
            Mở trong tab mới
          </Button>
        </div>
      ),
    });
  };

  // Grid layout change - disabled for now
  // const onLayoutChange = (newLayout: any[]) => {
  //   setLayout(newLayout);
  //   // Here you can save the new order to database if needed
  // };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <>
      <List
        headerButtons={
          <Space>
            <Button
              type="primary"
              icon={<UploadOutlined />}
              onClick={() => setIsUploadModalVisible(true)}
            >
              Upload Media
            </Button>
            <CreateButton />
          </Space>
        }
      >
        <div style={{ padding: "20px" }}>
          {/* Simple Grid Layout without react-grid-layout for debugging */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "16px",
            width: "100%"
          }}>
            {mediaItems.map((item, index) => (
              <div key={item.id} className="media-item">
                <Card 
                  hoverable 
                  size="small" 
                  style={{ height: "100%" }}
                  actions={[
                    <EyeOutlined 
                      key="view" 
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('View clicked:', item.id);
                        handleView(item.id);
                      }} 
                      style={{ color: "#1890ff" }}
                      title="Xem chi tiết"
                    />,
                    <EditOutlined 
                      key="edit" 
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Edit clicked:', item.id);
                        handleEdit(item.id);
                      }} 
                      style={{ color: "#52c41a" }}
                      title="Chỉnh sửa"
                    />,
                    <LinkOutlined 
                      key="link" 
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Link clicked:', item.file_url);
                        openImageUrl(item.file_url);
                      }} 
                      style={{ color: "#722ed1" }}
                      title="Mở link"
                    />,
                    <CopyOutlined 
                      key="copy" 
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Copy clicked:', item.file_url);
                        copyToClipboard(item.file_url);
                      }} 
                      style={{ color: "#fa8c16" }}
                      title="Copy URL"
                    />,
                    <InfoCircleOutlined 
                      key="info" 
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Info clicked:', item.id);
                        showImageInfo(item);
                      }} 
                      style={{ color: "#13c2c2" }}
                      title="Thông tin"
                    />
                  ]}
                >
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{ position: "relative", cursor: "pointer" }}
                      onClick={(e) => {
                        console.log('Image clicked:', item.id);
                        openLightbox(index);
                      }}
                    >
                      <Image
                        src={item.file_url}
                        alt={item.alt_text || item.file_name}
                        style={{
                          width: "100%",
                          height: "150px",
                          objectFit: "cover",
                        }}
                        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                      />
                    </div>
                    <div style={{ marginTop: "8px" }}>
                      <Text strong style={{ fontSize: "12px" }}>
                        {item.file_name.length > 20
                          ? item.file_name.substring(0, 20) + "..."
                          : item.file_name}
                      </Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: "10px" }}>
                        {formatFileSize(item.file_size)}
                      </Text>
                      <br />
                      <Tag color={item.is_active ? "green" : "red"}>
                        {item.is_active ? "Active" : "Inactive"}
                      </Tag>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </List>

      {/* Upload Modal */}
      <Modal
        title="Upload Media Files"
        open={isUploadModalVisible}
        onCancel={() => setIsUploadModalVisible(false)}
        footer={null}
        width={600}
      >
        <div
          {...getRootProps()}
          style={{
            border: "2px dashed #d9d9d9",
            borderRadius: "6px",
            padding: "40px",
            textAlign: "center",
            cursor: "pointer",
            backgroundColor: isDragActive ? "#f0f8ff" : "#fafafa",
          }}
        >
          <input {...getInputProps()} />
          <UploadOutlined
            style={{ fontSize: "48px", color: "#1890ff", marginBottom: "16px" }}
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
      </Modal>

      {/* Image Lightbox Modal */}
      <Modal
        title={
          mediaItems[currentImageIndex]?.title ||
          mediaItems[currentImageIndex]?.file_name
        }
        open={isLightboxOpen}
        onCancel={closeLightbox}
        footer={null}
        width="80%"
        style={{ top: 20 }}
      >
        <div style={{ textAlign: "center" }}>
          <Image
            src={mediaItems[currentImageIndex]?.file_url}
            alt={
              mediaItems[currentImageIndex]?.alt_text ||
              mediaItems[currentImageIndex]?.file_name
            }
            style={{ maxWidth: "100%", maxHeight: "70vh" }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
          />
        </div>
      </Modal>
    </>
  );
};
