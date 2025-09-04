import React from "react";
import { Form, Card, Button, Space, Typography, message } from "antd";
import { ArrowLeftOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { MediaFormFields } from "../media-form-fields";
import { MediaSEOSection } from "../media-seo-section";
import { MediaTechnicalInfo } from "../media-technical-info";

const { Text } = Typography;

interface MediaFormLayoutProps {
  mode: "create" | "edit";
  formProps: any;
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
  mediaData?: any;
  onAutoFillSEOScores?: () => void;
  children?: React.ReactNode; // For the right column content (upload section or image preview)
  showTechnicalInfo?: boolean;
  technicalInfoMode?: "create" | "edit";
  form?: any; // Form instance
}

export const MediaFormLayout: React.FC<MediaFormLayoutProps> = ({
  mode,
  formProps,
  uploadedFiles = [],
  selectedFileIndex = 0,
  mediaData,
  onAutoFillSEOScores,
  children,
  showTechnicalInfo = true,
  technicalInfoMode,
  form,
}) => {
  const navigate = useNavigate();

  // Navigation functions
  const handleBackToList = () => {
    navigate("/media");
  };

  const handleViewMedia = () => {
    if (mediaData?.id) {
      navigate(`/media/show/${mediaData.id}`);
    }
  };

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      {/* Left Column - Form Section */}
      <div style={{ flex: 1 }}>
        <Form {...formProps} layout="vertical">
          <Card
            title={
              <div>
                <div style={{ marginBottom: "8px" }}>
                  <span>Thông tin Media</span>
                </div>
                {mode === "create" && uploadedFiles.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      flexWrap: "wrap",
                      padding: "8px 12px",
                      backgroundColor: "#f6ffed",
                      border: "1px solid #b7eb8f",
                      borderRadius: "6px",
                      marginTop: "8px",
                    }}
                  >
                    <span
                      style={{
                        maxWidth: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        margin: 0,
                        padding: "4px 8px",
                        fontSize: "13px",
                        backgroundColor: "#52c41a",
                        color: "white",
                        borderRadius: "4px",
                      }}
                    >
                      {uploadedFiles.length === 1 ? (
                        <>
                          File:{" "}
                          {uploadedFiles[0]?.uploadedFileName ||
                            uploadedFiles[0]?.file.name}
                          {uploadedFiles[0]?.uploadedFileName &&
                            uploadedFiles[0]?.uploadedFileName !==
                              uploadedFiles[0]?.file.name && (
                              <span style={{ color: "#1890ff" }}>
                                {" "}
                                (đã đổi tên)
                              </span>
                            )}
                        </>
                      ) : (
                        <>
                          File đang chọn: {uploadedFiles[selectedFileIndex]?.uploadedFileName || uploadedFiles[selectedFileIndex]?.file.name}
                          <br />
                          <span style={{ fontSize: "11px", color: "#666" }}>
                            (Các file khác sẽ tự động tạo thông tin)
                          </span>
                        </>
                      )}
                    </span>
                    <Button
                      size="small"
                      type="dashed"
                      onClick={() => {
                        // Ghi đè thông tin hiện tại với thông tin từ file đang chọn
                        const fileData = uploadedFiles[selectedFileIndex];
                        const file = fileData.file;
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
                          `${smartAltText} - Bức ảnh được chụp với độ phân giải cao`,
                          `Khám phá vẻ đẹp của ${smartAltText.toLowerCase()} qua góc nhìn chuyên nghiệp`,
                          `${smartAltText} - Hình ảnh tối ưu cho thiết kế và marketing`,
                          `Tài liệu hình ảnh ${smartAltText.toLowerCase()} chất lượng, sẵn sàng sử dụng`,
                          `${smartAltText} - Bộ sưu tập hình ảnh đa dạng và phong phú`,
                          `Hình ảnh ${smartAltText.toLowerCase()} chuyên nghiệp, phù hợp cho mọi dự án`,
                        ];

                        const metaDescriptions = [
                          `Hình ảnh ${smartAltText.toLowerCase()}, chất lượng cao, phù hợp cho website và marketing.`,
                          `Ảnh ${smartAltText.toLowerCase()} đẹp, rõ nét, tối ưu cho SEO và trải nghiệm người dùng.`,
                          `${smartAltText} - Hình ảnh chuyên nghiệp, phù hợp cho các dự án thương mại và cá nhân.`,
                          `Tải hình ảnh ${smartAltText.toLowerCase()} miễn phí, chất lượng cao, không có watermark.`,
                          `Khám phá ${smartAltText.toLowerCase()} với hình ảnh chất lượng 4K, tối ưu cho mọi thiết bị.`,
                          `${smartAltText} - Bộ sưu tập hình ảnh đa dạng, phù hợp cho thiết kế và nội dung sáng tạo.`,
                          `Hình ảnh ${smartAltText.toLowerCase()} chuyên nghiệp, hỗ trợ đa định dạng và tương thích mọi trình duyệt.`,
                          `Tải xuống ${smartAltText.toLowerCase()} miễn phí, độ phân giải cao, không giới hạn sử dụng.`,
                          `${smartAltText} - Tài nguyên hình ảnh chất lượng, tối ưu cho SEO và tốc độ tải trang.`,
                          `Khám phá bộ sưu tập ${smartAltText.toLowerCase()} đa dạng, phù hợp cho mọi nhu cầu thiết kế.`,
                        ];

                        const keywords = generateKeywords(fileName);

                        formProps.form?.setFieldsValue({
                          file_name: fileName,
                          alt_text: smartAltText,
                          title: smartAltText,
                          caption: captions[0],
                          meta_description: metaDescriptions[0],
                          meta_keywords: keywords,
                        });

                        message.info("Đã tự động điền lại thông tin từ file đang chọn!");
                      }}
                      title="Tự động điền lại thông tin từ file"
                      style={{
                        margin: 0,
                        fontSize: "12px",
                        height: "24px",
                        padding: "0 8px",
                      }}
                    >
                      🔄 Tự động điền
                    </Button>
                  </div>
                )}
              </div>
            }
          >
            {mode === "create" && uploadedFiles.length > 0 && (
              <div
                style={{
                  marginBottom: "16px",
                  padding: "12px",
                  backgroundColor: "#f6ffed",
                  border: "1px solid #b7eb8f",
                  borderRadius: "6px",
                }}
              >
                <Text
                  strong
                  style={{
                    color: "#52c41a",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  ✓ Thông tin tự động đã được lấy:
                </Text>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px",
                    fontSize: "12px",
                  }}
                >
                  <div>
                    <strong>Kích thước:</strong>{" "}
                    {uploadedFiles[selectedFileIndex]?.dimensions
                      ? `${uploadedFiles[selectedFileIndex].dimensions.width}x${uploadedFiles[selectedFileIndex].dimensions.height}`
                      : "Chưa xác định"}
                  </div>
                  <div>
                    <strong>Dung lượng:</strong>{" "}
                    {uploadedFiles[selectedFileIndex]?.fileSizeKB
                      ? `${uploadedFiles[selectedFileIndex].fileSizeKB} KB`
                      : "Chưa xác định"}
                  </div>
                  <div>
                    <strong>Định dạng:</strong>{" "}
                    {uploadedFiles[selectedFileIndex]?.imageFormat ||
                      "Chưa xác định"}
                  </div>
                  <div>
                    <strong>MIME Type:</strong>{" "}
                    {uploadedFiles[selectedFileIndex]?.file.type ||
                      "Chưa xác định"}
                  </div>
                </div>
                {uploadedFiles[selectedFileIndex]?.uploaded && (
                  <div style={{ marginTop: "8px", color: "#52c41a" }}>
                    <strong>✓ Đã upload thành công!</strong> <br />
                    <div style={{ fontSize: "11px", marginTop: "4px" }}>
                      <strong>Tên file:</strong>{" "}
                      {uploadedFiles[selectedFileIndex].uploadedFileName ||
                        uploadedFiles[selectedFileIndex].file.name}{" "}
                      <br />
                      <strong>URL:</strong>{" "}
                      <Text code copyable style={{ fontSize: "11px" }}>
                        {uploadedFiles[selectedFileIndex].url}
                      </Text>
                    </div>
                  </div>
                )}
              </div>
            )}
            <MediaFormFields
              mode={mode}
              uploadedFiles={uploadedFiles}
              selectedFileIndex={selectedFileIndex}
              form={formProps.form}
            />
          </Card>

          {/* Card SEO nâng cao */}
          <Card
            title={
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <span>Thông tin SEO nâng cao</span>
                {mode === "create" && (
                  <Button
                    size="small"
                    type="dashed"
                    onClick={onAutoFillSEOScores}
                    title="Điền các giá trị SEO hợp lý"
                  >
                    🔄 Gợi ý
                  </Button>
                )}
              </div>
            }
            style={{ marginBottom: "20px" }}
          >
            <MediaSEOSection
              mode={mode}
              onAutoFillSEOScores={onAutoFillSEOScores}
              form={formProps.form}
              uploadedFiles={uploadedFiles}
              selectedFileIndex={selectedFileIndex}
            />
          </Card>
        </Form>
      </div>

      {/* Right Column - Content Section */}
      <div style={{ flex: 1 }}>
        {children}

        {/* Technical Info Section */}
        {showTechnicalInfo && (
          <Card title="Thông tin kỹ thuật" style={{ marginTop: "20px" }}>
            <MediaTechnicalInfo
              mode={technicalInfoMode || mode}
              uploadedFiles={uploadedFiles}
              selectedFileIndex={selectedFileIndex}
              existingRecord={mediaData}
              form={form || formProps?.form}
            />

            {/* Display only fields for edit mode */}
            {mode === "edit" && mediaData && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  marginTop: "16px",
                  padding: "16px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "6px",
                }}
              >
                <div>
                  <Text strong>Ngày tạo:</Text>
                  <br />
                  <Text type="secondary">
                    {mediaData?.created_at
                      ? new Date(mediaData.created_at).toLocaleDateString("vi-VN")
                      : "N/A"}
                  </Text>
                </div>
                <div>
                  <Text strong>Ngày cập nhật:</Text>
                  <br />
                  <Text type="secondary">
                    {mediaData?.updated_at
                      ? new Date(mediaData.updated_at).toLocaleDateString("vi-VN")
                      : "N/A"}
                  </Text>
                </div>
                <div>
                  <Text strong>File Path:</Text>
                  <br />
                  <Text type="secondary" code copyable>
                    {mediaData?.file_path || "N/A"}
                  </Text>
                </div>
                <div>
                  <Text strong>File URL:</Text>
                  <br />
                  <Text type="secondary" code copyable>
                    {mediaData?.file_url || "N/A"}
                  </Text>
                </div>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

// Helper function for keywords generation (moved from create.tsx)
const generateKeywords = (fileName: string): string[] => {
  // Loại bỏ extension file
  const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
  const words = nameWithoutExt
    .replace(/[-_]/g, " ")
    .split(" ")
    .filter((word) => word.length > 2);
  const keywords = [];

  // Thêm tên file gốc (không có extension) như một keyword
  keywords.push(nameWithoutExt.replace(/[-_]/g, " "));

  // Tạo các cụm từ 2-3 từ
  for (let i = 0; i < words.length - 1; i++) {
    // Cụm 2 từ
    keywords.push(`${words[i]} ${words[i + 1]}`);

    // Cụm 3 từ (nếu có đủ từ)
    if (i < words.length - 2) {
      keywords.push(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
    }
  }

  // Thêm một số từ khóa chung về hình ảnh
  keywords.push(
    "hình ảnh chất lượng cao",
    "ảnh đẹp",
    "tài liệu hình ảnh",
    "hình ảnh chuyên nghiệp"
  );

  // Loại bỏ trùng lặp và giới hạn số lượng
  return [...new Set(keywords)].slice(0, 10);
};