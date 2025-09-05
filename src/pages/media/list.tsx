import React, { useState, useCallback, useEffect } from "react";
import { List, CreateButton, useTable } from "@refinedev/antd";
import { useGo, useNavigation, useList } from "@refinedev/core";
import { useSearchParams } from "react-router-dom";
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
  Pagination,
  Tooltip,
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
  ReloadOutlined,
  GlobalOutlined,
  PictureOutlined,
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
  const go = useGo();
  const { list } = useNavigation();
  const [searchParams] = useSearchParams();
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [layout, setLayout] = useState<any[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  
  // Get current pagination from URL
  const currentPage = parseInt(searchParams.get('current') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');
  
  console.log('🔄 MediaList component rendered with URL params:', { currentPage, pageSize });

  // Use only useList for complete control over data fetching
  const { data, isLoading, refetch } = useList({
    resource: "media",
    pagination: {
      current: currentPage,
      pageSize: pageSize,
    },
    meta: {
      count: true,
    },
  });

  // Create tableProps-like structure for compatibility
  const tableProps = {
    dataSource: data?.data || [],
    loading: isLoading,
    pagination: {
      current: currentPage,
      pageSize: pageSize,
      total: data?.total || 0,
    },
  };

  // Debug: Log all important values
  console.log('🔍 Current debugging info:', {
    currentPage,
    pageSize,
    'data?.data length': data?.data?.length,
    'data?.total': data?.total,
    'isLoading': isLoading,
    'URL searchParams': searchParams.toString(),
  });

  // Force refresh when URL params change
  useEffect(() => {
    console.log('🔄 URL params changed, refetching data:', { currentPage, pageSize });
    refetch();
  }, [currentPage, pageSize, refetch]);

  // Generate grid layout
  React.useEffect(() => {
    console.log("🔍 Table props:", tableProps);
    console.log("🔍 Data source length:", tableProps.dataSource?.length);
    console.log("🔍 Table props pagination:", tableProps.pagination);
    
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
  }, [tableProps.dataSource, tableProps.pagination]);

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

        // Upload to Supabase Storage using regular client
        const { data: uploadData, error: uploadError } =
          await supabase.storage.from("media").upload(filePath, file);

        if (uploadError) {
          console.error("Supabase upload error:", uploadError);
          throw uploadError;
        }

        console.log("Upload successful:", uploadData);

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("media")
          .getPublicUrl(filePath);

        console.log("Public URL:", urlData.publicUrl);

        // Create media record
        const { data: mediaData, error: mediaError } = await supabase
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
            <Tooltip 
              title="Upload hình ảnh/media files vào hệ thống. Hỗ trợ: JPG, PNG, GIF, WEBP, SVG. Có thể kéo thả nhiều files cùng lúc."
              placement="bottom"
            >
              <Button
                type="primary"
                icon={<UploadOutlined />}
                onClick={() => setIsUploadModalVisible(true)}
              >
                Upload Media
              </Button>
            </Tooltip>
            <Tooltip title="Làm mới dữ liệu media từ database">
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  console.log('🔄 Manual refresh clicked');
                  console.log('🔄 Calling refetch manually');
                  refetch();
                }}
                title="Refresh data"
              >
                Refresh
              </Button>
            </Tooltip>
            <Tooltip title="Mở thư mục images trên server để xem tất cả hình ảnh">
              <Button
                icon={<GlobalOutlined />}
                onClick={() => {
                  const imagesUrl = "http://localhost:4321/images";
                  console.log('🌐 Opening images URL:', imagesUrl);
                  window.open(imagesUrl, "_blank");
                  message.info("Đã mở thư mục images trong tab mới!");
                }}
                title="Mở thư mục images"
              >
                Xem Images
              </Button>
            </Tooltip>
            <CreateButton />
          </Space>
        }
      >
        <div style={{ padding: "20px" }}>
          {/* Media count info with debug */}
          <div style={{ 
            marginBottom: '16px', 
            padding: '12px', 
            backgroundColor: isLoading ? '#fff7e6' : '#f6ffed', 
            border: `1px solid ${isLoading ? '#ffd591' : '#b7eb8f'}`, 
            borderRadius: '6px' 
          }}>
            <Text strong style={{ color: isLoading ? '#fa8c16' : '#52c41a' }}>
              {isLoading ? '🔄 Đang tải...' : '📊'} Hiển thị {mediaItems.length} / {tableProps.pagination.total || 'Loading...'} media files
              {!isLoading && (
                <span style={{ marginLeft: '8px', color: '#1890ff' }}>
                  (Trang {tableProps.pagination.current}/{Math.ceil((tableProps.pagination.total || 0) / (tableProps.pagination.pageSize || 10))})
                </span>
              )}
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              URL: {window.location.href} | Loading: {isLoading ? 'Yes' : 'No'} | Items: {mediaItems.length}
            </Text>
          </div>

          {/* Top Pagination - Same as bottom */}
          {!isLoading && mediaItems.length > 0 && (
            <div style={{ 
              marginBottom: '24px', 
              textAlign: 'center',
              padding: '16px 0',
              borderBottom: '1px solid #f0f0f0',
              backgroundColor: '#fafafa'
            }}>
              <Text strong style={{ marginBottom: '12px', display: 'block', color: '#1890ff' }}>
                🔊 Pagination - Top
              </Text>
              <Pagination
                current={currentPage}
                total={tableProps.pagination.total}
                pageSize={pageSize}
                showSizeChanger
                showQuickJumper
                showTotal={(total, range) => 
                  `Hiển thị ${range[0]}-${range[1]} của ${total} media files`
                }
                pageSizeOptions={['5', '10', '20', '50', '100']}
                onChange={(page: number, pageSize?: number) => {
                  console.log('🟢 Top Pagination onChange:', { page, pageSize });
                  const newSearchParams = new URLSearchParams(searchParams);
                  newSearchParams.set('current', page.toString());
                  newSearchParams.set('pageSize', (pageSize || 10).toString());
                  
                  console.log('🔍 New URL will be:', `/media?${newSearchParams.toString()}`);
                  
                  go({
                    to: `/media?${newSearchParams.toString()}`,
                    type: "replace",
                  });
                  
                  // Force immediate data refresh
                  setTimeout(() => {
                    console.log('🔄 Top Pagination: Force refetching after URL change');
                    refetch();
                  }, 100);
                }}
                onShowSizeChange={(current: number, size: number) => {
                  console.log('🟢 Top Pagination onShowSizeChange:', { current, size });
                  const newSearchParams = new URLSearchParams(searchParams);
                  newSearchParams.set('current', '1'); // Reset to first page
                  newSearchParams.set('pageSize', size.toString());
                  
                  console.log('🔍 New URL will be:', `/media?${newSearchParams.toString()}`);
                  
                  go({
                    to: `/media?${newSearchParams.toString()}`,
                    type: "replace",
                  });
                  
                  // Force immediate data refresh
                  setTimeout(() => {
                    console.log('🔄 Top Pagination: Force refetching after page size change');
                    refetch();
                  }, 100);
                }}
                style={{ marginTop: '8px' }}
              />
            </div>
          )}
          
          {/* Simple Grid Layout without react-grid-layout for debugging */}
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <Text>🔄 Đang tải dữ liệu...</Text>
            </div>
          ) : (
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
                    <PictureOutlined
                      key="image"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Use public images URL instead of Supabase storage URL
                        const publicImageUrl = `http://localhost:4321/images/${item.file_name}`;
                        console.log('Image view clicked:', publicImageUrl);
                        window.open(publicImageUrl, "_blank");
                        message.info("Đã mở hình ảnh qua public URL!");
                      }}
                      style={{ color: "#eb2f96" }}
                      title="Xem hình ảnh qua public URL"
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
          )}
          
          {/* Bottom Pagination - Same as top */}
          {!isLoading && mediaItems.length > 0 && (
            <div style={{ 
              marginTop: '24px', 
              textAlign: 'center',
              padding: '16px 0',
              borderTop: '1px solid #f0f0f0',
              backgroundColor: '#fafafa'
            }}>
              <Text strong style={{ marginBottom: '12px', display: 'block', color: '#52c41a' }}>
                🔋 Pagination - Bottom
              </Text>
              <Pagination
                current={currentPage}
                total={tableProps.pagination.total}
                pageSize={pageSize}
                showSizeChanger
                showQuickJumper
                showTotal={(total, range) => 
                  `Hiển thị ${range[0]}-${range[1]} của ${total} media files`
                }
                pageSizeOptions={['5', '10', '20', '50', '100']}
                onChange={(page: number, pageSize?: number) => {
                  console.log('🟢 Bottom Pagination onChange:', { page, pageSize });
                  const newSearchParams = new URLSearchParams(searchParams);
                  newSearchParams.set('current', page.toString());
                  newSearchParams.set('pageSize', (pageSize || 10).toString());
                  
                  console.log('🔍 New URL will be:', `/media?${newSearchParams.toString()}`);
                  
                  go({
                    to: `/media?${newSearchParams.toString()}`,
                    type: "replace",
                  });
                  
                  // Force immediate data refresh
                  setTimeout(() => {
                    console.log('🔄 Bottom Pagination: Force refetching after URL change');
                    refetch();
                  }, 100);
                }}
                onShowSizeChange={(current: number, size: number) => {
                  console.log('🟢 Bottom Pagination onShowSizeChange:', { current, size });
                  const newSearchParams = new URLSearchParams(searchParams);
                  newSearchParams.set('current', '1'); // Reset to first page
                  newSearchParams.set('pageSize', size.toString());
                  
                  console.log('🔍 New URL will be:', `/media?${newSearchParams.toString()}`);
                  
                  go({
                    to: `/media?${newSearchParams.toString()}`,
                    type: "replace",
                  });
                  
                  // Force immediate data refresh
                  setTimeout(() => {
                    console.log('🔄 Bottom Pagination: Force refetching after page size change');
                    refetch();
                  }, 100);
                }}
                style={{ marginTop: '16px' }}
              />
            </div>
          )}
        </div>
      </List>

      {/* Upload Modal */}
      <Modal
        title={
          <div>
            <UploadOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
            Upload Media Files
          </div>
        }
        open={isUploadModalVisible}
        onCancel={() => setIsUploadModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsUploadModalVisible(false)}>
            Hủy
          </Button>,
          <Button key="info" type="link" onClick={() => {
            Modal.info({
              title: '📚 Hướng dẫn Upload Media',
              width: 600,
              content: (
                <div>
                  <h4>📁 Các định dạng hỗ trợ:</h4>
                  <ul>
                    <li>🖼️ <strong>Hình ảnh:</strong> JPG, JPEG, PNG, GIF, WEBP, SVG</li>
                    <li>📹 <strong>Video:</strong> MP4, WEBM, OGV (sắp có)</li>
                    <li>📄 <strong>Tài liệu:</strong> PDF, DOC, DOCX (sắp có)</li>
                  </ul>
                  <h4>🚀 Cách sử dụng:</h4>
                  <ol>
                    <li>Kéo thả files vào vùng upload hoặc click để chọn</li>
                    <li>Có thể chọn nhiều files cùng lúc</li>
                    <li>Hệ thống sẽ tự động upload và tạo metadata</li>
                    <li>Files sẽ được lưu trữ trong Supabase Storage</li>
                  </ol>
                  <h4>⚠️ Lưu ý:</h4>
                  <ul>
                    <li>Kích thước file tối đa: 10MB mỗi file</li>
                    <li>Tên file sẽ được tự động đổi tên để tránh trùng lặp</li>
                    <li>Metadata (alt text, title) sẽ được tạo tự động</li>
                  </ul>
                </div>
              )
            });
          }}>
            📚 Hướng dẫn
          </Button>
        ]}
        width={700}
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
