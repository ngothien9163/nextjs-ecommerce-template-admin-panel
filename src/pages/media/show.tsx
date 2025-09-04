import React, { useState } from "react";
import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import {
  Card,
  Descriptions,
  Image,
  Button,
  Space,
  Tag,
  Typography,
  Modal,
} from "antd";
import {
  EyeOutlined,
  DownloadOutlined,
  CopyOutlined,
  LinkOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

export const MediaShow: React.FC = () => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const { queryResult } = useShow({
    resource: "media",
  });

  const { data, isLoading } = queryResult;
  const record = data?.data;

  const openLightbox = () => {
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Show isLoading={isLoading}>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Top Row - Image Preview and Basic Info */}
        <div style={{ display: "flex", gap: "20px" }}>
          {/* Image Preview Section */}
          <div style={{ flex: 1 }}>
            <Card title="Xem trước hình ảnh">
              <div style={{ textAlign: "center", marginBottom: "16px" }}>
                <Space>
                  <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={openLightbox}
                  >
                    Xem fullscreen
                  </Button>
                  <Button
                    icon={<DownloadOutlined />}
                    onClick={() => window.open(record?.file_url, "_blank")}
                  >
                    Tải xuống
                  </Button>
                </Space>
              </div>

              <Image
                src={record?.file_url}
                alt={record?.alt_text || record?.file_name}
                style={{
                  width: "100%",
                  maxHeight: "500px",
                  objectFit: "contain",
                }}
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
              />
            </Card>
          </div>

          {/* Information Section */}
          <div style={{ flex: 1 }}>
            <Card title="Thông tin chi tiết">
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Tên file">
                  <Text strong>{record?.file_name}</Text>
                </Descriptions.Item>

                <Descriptions.Item label="Alt Text">
                  <Text>{record?.alt_text || "Không có"}</Text>
                </Descriptions.Item>

                <Descriptions.Item label="Title">
                  <Text>{record?.title || "Không có"}</Text>
                </Descriptions.Item>

                <Descriptions.Item label="Caption">
                  <Text>{record?.caption || "Không có"}</Text>
                </Descriptions.Item>

                <Descriptions.Item label="Meta Description">
                  <Text>{record?.meta_description || "Không có"}</Text>
                </Descriptions.Item>

                <Descriptions.Item label="Meta Keywords">
                  <Text>
                    {record?.meta_keywords
                      ? Array.isArray(record.meta_keywords)
                        ? record.meta_keywords.map(
                            (keyword: string, index: number) => (
                              <Tag key={index} color="blue">
                                {keyword}
                              </Tag>
                            )
                          )
                        : typeof record.meta_keywords === "string"
                        ? record.meta_keywords
                            .split(",")
                            .map((keyword: string, index: number) => (
                              <Tag key={index} color="blue">
                                {keyword.trim()}
                              </Tag>
                            ))
                        : record.meta_keywords
                      : "Không có"}
                  </Text>
                </Descriptions.Item>

                <Descriptions.Item label="Credit">
                  <Text>{record?.credit || "Không có"}</Text>
                </Descriptions.Item>

                <Descriptions.Item label="License">
                  <Text>{record?.license || "Không có"}</Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="Thông tin SEO nâng cao" style={{ marginTop: "20px" }}>
              <Descriptions column={1} bordered>
                <Descriptions.Item label="SEO Score">
                  <Text
                    strong
                    style={{
                      color:
                        record?.seo_score && record.seo_score >= 80
                          ? "#52c41a"
                          : "#faad14",
                    }}
                  >
                    {record?.seo_score ? `${record.seo_score}/100` : "Không có"}
                  </Text>
                </Descriptions.Item>

                <Descriptions.Item label="Accessibility Score">
                  <Text
                    strong
                    style={{
                      color:
                        record?.accessibility_score &&
                        record.accessibility_score >= 80
                          ? "#52c41a"
                          : "#faad14",
                    }}
                  >
                    {record?.accessibility_score
                      ? `${record.accessibility_score}/100`
                      : "Không có"}
                  </Text>
                </Descriptions.Item>

                <Descriptions.Item label="Performance Score">
                  <Text
                    strong
                    style={{
                      color:
                        record?.performance_score &&
                        record.performance_score >= 80
                          ? "#52c41a"
                          : "#faad14",
                    }}
                  >
                    {record?.performance_score
                      ? `${record.performance_score}/100`
                      : "Không có"}
                  </Text>
                </Descriptions.Item>

                <Descriptions.Item label="Usage Count">
                  <Text strong>{record?.usage_count || "0"}</Text>
                </Descriptions.Item>

                <Descriptions.Item label="Version">
                  <Text strong>{record?.version || "1"}</Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </div>
        </div>

        {/* Bottom Row - Technical Info, Usage Info, and URLs */}
        <div style={{ display: "flex", gap: "20px" }}>
          <div style={{ flex: 1 }}>
            <Card title="Thông tin kỹ thuật">
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Loại file">
                  <Text>{record?.mime_type}</Text>
                </Descriptions.Item>

                <Descriptions.Item label="Kích thước file">
                  <Text>{formatFileSize(record?.file_size || 0)}</Text>
                </Descriptions.Item>

                <Descriptions.Item label="Kích thước file (KB)">
                  <Text>
                    {record?.file_size_kb
                      ? `${record.file_size_kb} KB`
                      : "Không có"}
                  </Text>
                </Descriptions.Item>

                <Descriptions.Item label="Độ phân giải">
                  <Text>
                    {record?.dimensions
                      ? `${record.dimensions.width} x ${record.dimensions.height} px`
                      : "Không có"}
                  </Text>
                </Descriptions.Item>

                <Descriptions.Item label="Kích thước hình ảnh">
                  <Text>{record?.image_dimensions || "Không có"}</Text>
                </Descriptions.Item>

                <Descriptions.Item label="Định dạng hình ảnh">
                  <Text>{record?.image_format || "Không có"}</Text>
                </Descriptions.Item>

                <Descriptions.Item label="Lazy Loading">
                  <Tag color={record?.lazy_loading ? "green" : "red"}>
                    {record?.lazy_loading ? "Bật" : "Tắt"}
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item label="Priority Loading">
                  <Tag color={record?.priority_loading ? "green" : "red"}>
                    {record?.priority_loading ? "Bật" : "Tắt"}
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item label="Đường dẫn file">
                  <Text code>{record?.file_path}</Text>
                </Descriptions.Item>

                <Descriptions.Item label="Public Image URL">
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Text code style={{ flex: 1, wordBreak: "break-all", fontSize: "12px" }}>
                      {(() => {
                        const imagesBaseUrl =
                          import.meta.env.VITE_PUBLIC_SITE_URL_IMAGES ||
                          "http://localhost:4322/images/";
                        const fileName = record?.file_name || "ten-file-hinh-anh";
                        return `${imagesBaseUrl}${fileName}`;
                      })()}
                    </Text>
                    <Space>
                      <Button
                        size="small"
                        icon={<CopyOutlined />}
                        onClick={() => {
                          const imagesBaseUrl =
                            import.meta.env.VITE_PUBLIC_SITE_URL_IMAGES ||
                            "http://localhost:4322/images/";
                          const fileName = record?.file_name || "ten-file-hinh-anh";
                          const publicLinkUrl = `${imagesBaseUrl}${fileName}`;
                          copyToClipboard(publicLinkUrl);
                        }}
                      >
                        Copy
                      </Button>
                      <Button
                        size="small"
                        icon={<LinkOutlined />}
                        onClick={() => {
                          const imagesBaseUrl =
                            import.meta.env.VITE_PUBLIC_SITE_URL_IMAGES ||
                            "http://localhost:4322/images/";
                          const fileName = record?.file_name || "ten-file-hinh-anh";
                          const publicLinkUrl = `${imagesBaseUrl}${fileName}`;
                          window.open(publicLinkUrl, "_blank");
                        }}
                      >
                        Mở link
                      </Button>
                    </Space>
                  </div>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </div>

          <div style={{ flex: 1 }}>
            <Card title="Thông tin sử dụng">
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Số lần sử dụng">
                  <Text strong>{record?.usage_count || "0"}</Text>
                </Descriptions.Item>

                <Descriptions.Item label="Phiên bản hiện tại">
                  <Text strong>{record?.version || "1"}</Text>
                </Descriptions.Item>

                <Descriptions.Item label="Trạng thái">
                  <Tag color={record?.is_active ? "green" : "red"}>
                    {record?.is_active ? "Hoạt động" : "Không hoạt động"}
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item label="Ngày tạo">
                  <Text>
                    {record?.created_at
                      ? formatDate(record.created_at)
                      : "Không có"}
                  </Text>
                </Descriptions.Item>

                <Descriptions.Item label="Ngày cập nhật">
                  <Text>
                    {record?.updated_at
                      ? formatDate(record.updated_at)
                      : "Không có"}
                  </Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="URL & Links" style={{ marginTop: "20px" }}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <div>
                  <Text strong>Public URL:</Text>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginTop: "4px",
                    }}
                  >
                    <Text code style={{ flex: 1, wordBreak: "break-all" }}>
                      {record?.file_url}
                    </Text>
                    <Button
                      size="small"
                      icon={<CopyOutlined />}
                      onClick={() => copyToClipboard(record?.file_url || "")}
                    >
                      Copy
                    </Button>
                    <Button
                      size="small"
                      icon={<LinkOutlined />}
                      onClick={() => window.open(record?.file_url, "_blank")}
                    >
                      Mở link
                    </Button>
                  </div>
                </div>

                <div>
                  <Text strong>Public Image URL:</Text>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginTop: "4px",
                    }}
                  >
                    <Text code style={{ flex: 1, wordBreak: "break-all" }}>
                      {(() => {
                        const imagesBaseUrl =
                          import.meta.env.VITE_PUBLIC_SITE_URL_IMAGES ||
                          "http://localhost:4322/images/";
                        const fileName = record?.file_name || "ten-file-hinh-anh";
                        return `${imagesBaseUrl}${fileName}`;
                      })()}
                    </Text>
                    <Space>
                      <Button
                        size="small"
                        icon={<CopyOutlined />}
                        onClick={() => {
                          const imagesBaseUrl =
                            import.meta.env.VITE_PUBLIC_SITE_URL_IMAGES ||
                            "http://localhost:4322/images/";
                          const fileName = record?.file_name || "ten-file-hinh-anh";
                          const publicLinkUrl = `${imagesBaseUrl}${fileName}`;
                          copyToClipboard(publicLinkUrl);
                        }}
                      >
                        Copy
                      </Button>
                      <Button
                        size="small"
                        icon={<LinkOutlined />}
                        onClick={() => {
                          const imagesBaseUrl =
                            import.meta.env.VITE_PUBLIC_SITE_URL_IMAGES ||
                            "http://localhost:4322/images/";
                          const fileName = record?.file_name || "ten-file-hinh-anh";
                          const publicLinkUrl = `${imagesBaseUrl}${fileName}`;
                          window.open(publicLinkUrl, "_blank");
                        }}
                      >
                        Mở link
                      </Button>
                    </Space>
                  </div>
                </div>
              </Space>
            </Card>
          </div>
        </div>
      </div>

      {/* Image Lightbox Modal */}
      <Modal
        title={record?.title || record?.file_name}
        open={isLightboxOpen}
        onCancel={closeLightbox}
        footer={null}
        width="80%"
        style={{ top: 20 }}
      >
        <div style={{ textAlign: "center" }}>
          <Image
            src={record?.file_url}
            alt={record?.alt_text || record?.file_name}
            style={{ maxWidth: "100%", maxHeight: "70vh" }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
            />
        </div>
      </Modal>
    </Show>
  );
};
