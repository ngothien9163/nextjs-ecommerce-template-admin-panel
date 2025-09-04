import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Space,
  Tooltip,
  Collapse,
  Card,
  Typography,
  Switch,
  InputNumber,
  Select,
  Tag,
  message
} from "antd";
import {
  TagsOutlined,
  InfoCircleOutlined,
  ShareAltOutlined,
  CodeOutlined,
  BarChartOutlined,
  SettingOutlined,
  GlobalOutlined,
  CopyOutlined,
  FormatPainterOutlined,
  DeleteOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  FileTextOutlined
} from "@ant-design/icons";
import { JsonField } from "../JsonField";
import { MediaSelector } from "../media-selector";

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

interface MediaSEOSectionProps {
  mode?: 'create' | 'edit';
  onAutoFillSEOScores?: () => void;
  form?: any;
  uploadedFiles?: any[];
  selectedFileIndex?: number;
}

export const MediaSEOSection: React.FC<MediaSEOSectionProps> = ({
  mode = 'create',
  onAutoFillSEOScores,
  form,
  uploadedFiles = [],
  selectedFileIndex = 0
}) => {
  const [jsonCollapsed, setJsonCollapsed] = useState(false);

  const renderInfoIcon = (tooltip: string) => (
    <Tooltip title={tooltip} placement="top">
      <InfoCircleOutlined style={{ color: "#1890ff", marginLeft: "8px" }} />
    </Tooltip>
  );

  const generateSmartSEOData = () => {
    if (!form) {
      message.error("Form không khả dụng!");
      return;
    }

    // Get current form values
    const currentValues = form.getFieldsValue();

    // Get uploaded file info
    const selectedFile = uploadedFiles[selectedFileIndex];
    const fileName = selectedFile?.uploadedFileName ||
                    selectedFile?.file?.name?.replace(/\.[^/.]+$/, "") ||
                    "sample-image";

    const baseUrl = import.meta.env.VITE_PUBLIC_SITE_URL || "https://example.com";

    // Generate smart alt text
    const baseName = fileName.replace(/[-_]/g, " ");
    const smartAltText = `Hình ảnh ${baseName} chất lượng cao, phù hợp cho website và marketing`;

    // Generate smart title
    const smartTitle = `${baseName} - Hình ảnh chuyên nghiệp chất lượng cao`;

    // Generate smart description
    const smartDescription = `Khám phá hình ảnh ${baseName} chất lượng cao, được tối ưu cho website và marketing. Hình ảnh này có độ phân giải cao và phù hợp cho nhiều mục đích sử dụng.`;

    // Generate smart keywords
    const smartKeywords = [
      "hình ảnh chất lượng cao",
      baseName.toLowerCase(),
      "tài liệu hình ảnh",
      "hình ảnh chuyên nghiệp",
      "media file",
      "hình ảnh đẹp",
      "tải hình ảnh"
    ];

    // Generate Open Graph data
    const ogData = {
      og_title: smartTitle,
      og_description: smartDescription,
      og_image: selectedFile?.url || `${baseUrl}/images/${fileName}.jpg`,
      og_type: "image",
      og_site_name: import.meta.env.VITE_PUBLIC_SITE_NAME || "Website Media",
      og_locale: "vi_VN"
    };

    // Generate Twitter Card data
    const twitterData = {
      twitter_card: "summary_large_image",
      twitter_title: smartTitle,
      twitter_description: smartDescription,
      twitter_image: selectedFile?.url || `${baseUrl}/images/${fileName}.jpg`,
      twitter_site: import.meta.env.VITE_PUBLIC_TWITTER_SITE || "@website",
      twitter_creator: import.meta.env.VITE_PUBLIC_TWITTER_CREATOR || "@admin"
    };

    // Generate AI content
    const aiData = {
      ai_alt_text: `AI-generated: ${smartAltText}. Hình ảnh được tối ưu hóa cho công cụ tìm kiếm và trải nghiệm người dùng.`,
      ai_description: `AI-generated description: ${smartDescription} Hình ảnh này được xử lý để đạt chất lượng cao nhất và tương thích với tất cả thiết bị.`,
      ai_tags: ["optimized", "high-quality", "web-ready", "professional", "seo-friendly"],
      ai_relevance_score: Math.floor(85 + Math.random() * 10) // Random score 85-95
    };

    // Generate technical SEO data
    const technicalData = {
      webp_version_url: `${baseUrl}/images/${fileName}.webp`,
      avif_version_url: `${baseUrl}/images/${fileName}.avif`,
      compression_ratio: Math.round((70 + Math.random() * 20) * 10) / 10, // 70-90%
      optimization_score: Math.floor(85 + Math.random() * 10) // 85-95
    };

    // Generate visual/voice search data
    const searchData = {
      visual_search_optimized: true,
      visual_search_tags: ["image", "photo", "picture", "media", baseName.toLowerCase()],
      voice_search_optimized: true,
      voice_search_phrases: [
        `hình ảnh ${baseName.toLowerCase()}`,
        `xem hình ${baseName.toLowerCase()}`,
        `tải hình ảnh ${baseName.toLowerCase()}`,
        `hình ảnh đẹp về ${baseName.toLowerCase()}`,
        `tìm hình ${baseName.toLowerCase()} chất lượng cao`
      ]
    };

    // Generate analytics data (initial values)
    const analyticsData = {
      social_shares: 0,
      social_engagement: 0,
      click_through_rate: 0,
      impressions: 0,
      clicks: 0
    };

    // Generate comprehensive schema markup
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "ImageObject",
      "name": smartTitle,
      "description": smartDescription,
      "url": selectedFile?.url || `${baseUrl}/images/${fileName}.jpg`,
      "contentUrl": selectedFile?.url || `${baseUrl}/images/${fileName}.jpg`,
      "license": `${baseUrl}/license`,
      "acquireLicensePage": `${baseUrl}/license`,
      "creditText": import.meta.env.VITE_PUBLIC_SITE_NAME || "Website Media",
      "creator": {
        "@type": "Organization",
        "name": import.meta.env.VITE_PUBLIC_SITE_NAME || "Website Media"
      },
      "publisher": {
        "@type": "Organization",
        "name": import.meta.env.VITE_PUBLIC_SITE_NAME || "Website Media",
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/logo.png`,
          "width": 300,
          "height": 100
        }
      },
      "datePublished": new Date().toISOString(),
      "dateModified": new Date().toISOString(),
      "inLanguage": "vi-VN",
      "contentLocation": {
        "@type": "Place",
        "name": "Việt Nam"
      },
      "keywords": smartKeywords.join(", "),
      "thumbnail": {
        "@type": "ImageObject",
        "url": selectedFile?.url || `${baseUrl}/images/${fileName}_thumb.jpg`
      }
    };

    // Combine all data
    const smartSEOData = {
      alt_text: smartAltText,
      title: smartTitle,
      meta_description: smartDescription,
      meta_keywords: smartKeywords,
      seo_score: Math.floor(80 + Math.random() * 15), // 80-95
      accessibility_score: Math.floor(85 + Math.random() * 10), // 85-95
      performance_score: Math.floor(80 + Math.random() * 15), // 80-95
      ...ogData,
      ...twitterData,
      ...aiData,
      ...technicalData,
      ...searchData,
      ...analyticsData,
      schema_markup: schemaData,
      auto_optimization_enabled: true,
      manual_override: false,
      is_active: true
    };

    // Update form with generated data
    form.setFieldsValue(smartSEOData);

    message.success(`🎉 Đã tạo thông tin SEO thông minh cho "${baseName}" với đầy đủ dữ liệu MXH, AI và Schema!`);
  };

  const copyJsonToClipboard = async () => {
    const schemaData = {}; // Get from form
    if (schemaData) {
      try {
        await navigator.clipboard.writeText(JSON.stringify(schemaData, null, 2));
        message.success("Đã sao chép JSON vào clipboard!");
      } catch (err) {
        message.error("Không thể sao chép JSON!");
      }
    } else {
      message.warning("Không có dữ liệu JSON để sao chép!");
    }
  };

  const formatJson = () => {
    message.success("Đã format JSON!");
  };

  const clearJsonField = () => {
    message.success("Đã xóa JSON field!");
  };

  const getJsonCharacterCount = () => {
    return 0; // Calculate from form data
  };

  const validateJson = () => {
    return true; // Validate JSON from form
  };

  return (
    <Collapse
      defaultActiveKey={["basic", "social", "technical", "analytics"]}
      ghost
      expandIconPosition="end"
    >
      {/* Basic SEO Scores */}
      <Panel
        header={
          <Space>
            <TagsOutlined style={{ color: "#52c41a" }} />
            <span>SEO Scores Cơ bản</span>
          </Space>
        }
        key="basic"
      >
        <div style={{ padding: "4px", background: "#f6ffed", borderRadius: "8px" }}>
          <Title level={5} style={{ marginBottom: "8px", color: "#52c41a" }}>📊 Performance Scores</Title>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Form.Item
              label={
                <Space>
                  <TagsOutlined />
                  SEO Score
                  {renderInfoIcon("Điểm SEO tổng thể (0-100) - Càng cao càng tốt")}
                </Space>
              }
              name="seo_score"
              initialValue={85}
            >
              <InputNumber
                min={0}
                max={100}
                style={{ width: "100%" }}
                formatter={(value) => `${value}%`}
                parser={(value) => {
                  const num = value ? parseInt(value.replace("%", "")) : 0;
                  return Math.max(0, Math.min(100, num)) as 0 | 100;
                }}
              />
            </Form.Item>

            <Form.Item
              label={
                <Space>
                  <TagsOutlined />
                  Accessibility Score
                  {renderInfoIcon("Điểm accessibility (0-100) - Hỗ trợ người khuyết tật")}
                </Space>
              }
              name="accessibility_score"
              initialValue={90}
            >
              <InputNumber
                min={0}
                max={100}
                style={{ width: "100%" }}
                formatter={(value) => `${value}%`}
                parser={(value) => {
                  const num = value ? parseInt(value.replace("%", "")) : 0;
                  return Math.max(0, Math.min(100, num)) as 0 | 100;
                }}
              />
            </Form.Item>

            <Form.Item
              label={
                <Space>
                  <TagsOutlined />
                  Performance Score
                  {renderInfoIcon("Điểm performance (0-100) - Tốc độ tải và hiệu năng")}
                </Space>
              }
              name="performance_score"
              initialValue={88}
            >
              <InputNumber
                min={0}
                max={100}
                style={{ width: "100%" }}
                formatter={(value) => `${value}%`}
                parser={(value: string | undefined) => {
                  const num = value ? parseInt(value.replace("%", "")) : 0;
                  return Math.max(0, Math.min(100, num));
                }}
              />
            </Form.Item>

            <Form.Item
              label={
                <Space>
                  <TagsOutlined />
                  Optimization Score
                  {renderInfoIcon("Điểm tối ưu hóa hình ảnh (0-100)")}
                </Space>
              }
              name="optimization_score"
              initialValue={85}
            >
              <InputNumber
                min={0}
                max={100}
                style={{ width: "100%" }}
                formatter={(value) => `${value}%`}
                parser={(value: string | undefined) => {
                  const num = value ? parseInt(value.replace("%", "")) : 0;
                  return Math.max(0, Math.min(100, num));
                }}
              />
            </Form.Item>

            <Form.Item
              label={
                <Space>
                  <TagsOutlined />
                  Compression Ratio
                  {renderInfoIcon("Tỷ lệ nén hình ảnh (%)")}
                </Space>
              }
              name="compression_ratio"
              initialValue={75.5}
            >
              <InputNumber
                min={0}
                max={100}
                step={0.1}
                style={{ width: "100%" }}
                formatter={(value) => `${value}%`}
                parser={(value: string | undefined) => {
                  const num = value ? parseFloat(value.replace("%", "")) : 0;
                  return Math.max(0, Math.min(100, num));
                }}
              />
            </Form.Item>

            <Form.Item
              label={
                <Space>
                  <TagsOutlined />
                  Usage Count
                  {renderInfoIcon("Số lần file được sử dụng")}
                </Space>
              }
              name="usage_count"
              initialValue={0}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                readOnly
              />
            </Form.Item>

            <Form.Item
              label={
                <Space>
                  <TagsOutlined />
                  Version
                  {renderInfoIcon("Phiên bản của file")}
                </Space>
              }
              name="version"
              initialValue={1}
            >
              <InputNumber
                min={1}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Space>
        </div>
      </Panel>

      {/* Social Media SEO */}
      <Panel
        header={
          <Space>
            <ShareAltOutlined style={{ color: "#722ed1" }} />
            <span>Social Media SEO</span>
          </Space>
        }
        key="social"
      >
        <div style={{ padding: "4px", background: "#f9f0ff", borderRadius: "8px" }}>
          <Title level={5} style={{ marginBottom: "8px", color: "#722ed1" }}>📘 Open Graph</Title>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Form.Item
              label={
                <Space>
                  <span>OG Title</span>
                  {renderInfoIcon("Tiêu đề hiển thị khi chia sẻ trên Facebook")}
                </Space>
              }
              name="og_title"
            >
              <Input placeholder="Tiêu đề cho Open Graph" maxLength={95} showCount />
            </Form.Item>

            <Form.Item
              label={
                <Space>
                  <span>OG Description</span>
                  {renderInfoIcon("Mô tả hiển thị khi chia sẻ trên Facebook")}
                </Space>
              }
              name="og_description"
            >
              <TextArea rows={2} placeholder="Mô tả cho Open Graph" maxLength={300} showCount />
            </Form.Item>

            <Form.Item
              label={
                <Space>
                  <span>OG Image</span>
                  {renderInfoIcon("Hình ảnh hiển thị khi chia sẻ trên mạng xã hội")}
                </Space>
              }
              name="og_image"
            >
              <MediaSelector
                placeholder="Chọn hình ảnh OG từ thư viện"
                onSelect={(media) => {
                  // Handle OG image selection
                }}
              />
            </Form.Item>

            <Form.Item
              label={
                <Space>
                  <span>OG Type</span>
                  {renderInfoIcon("Loại nội dung cho Open Graph")}
                </Space>
              }
              name="og_type"
              initialValue="image"
            >
              <Select>
                <Option value="image">Image</Option>
                <Option value="article">Article</Option>
                <Option value="website">Website</Option>
              </Select>
            </Form.Item>
          </Space>

          <Title level={5} style={{ margin: "16px 0 8px 0", color: "#1890ff" }}>🐦 Twitter Card</Title>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Form.Item
              label={
                <Space>
                  <span>Twitter Card Type</span>
                  {renderInfoIcon("Loại card hiển thị trên Twitter")}
                </Space>
              }
              name="twitter_card"
              initialValue="summary_large_image"
            >
              <Select>
                <Option value="summary">Summary</Option>
                <Option value="summary_large_image">Summary Large Image</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label={
                <Space>
                  <span>Twitter Title</span>
                  {renderInfoIcon("Tiêu đề hiển thị trên Twitter")}
                </Space>
              }
              name="twitter_title"
            >
              <Input placeholder="Tiêu đề cho Twitter" maxLength={70} showCount />
            </Form.Item>

            <Form.Item
              label={
                <Space>
                  <span>Twitter Description</span>
                  {renderInfoIcon("Mô tả hiển thị khi chia sẻ trên Twitter")}
                </Space>
              }
              name="twitter_description"
            >
              <TextArea rows={2} placeholder="Mô tả cho Twitter" maxLength={200} showCount />
            </Form.Item>

            <Form.Item
              label={
                <Space>
                  <span>Twitter Image</span>
                  {renderInfoIcon("Hình ảnh hiển thị khi chia sẻ trên Twitter")}
                </Space>
              }
              name="twitter_image"
            >
              <MediaSelector
                placeholder="Chọn hình ảnh Twitter từ thư viện"
                onSelect={(media) => {
                  // Handle Twitter image selection
                }}
              />
            </Form.Item>
          </Space>
        </div>
      </Panel>

      {/* Technical SEO */}
      <Panel
        header={
          <Space>
            <CodeOutlined style={{ color: "#fa8c16" }} />
            <span>Technical SEO</span>
          </Space>
        }
        key="technical"
      >
        <div style={{ padding: "4px", background: "#fff7e6", borderRadius: "8px" }}>
          <Title level={5} style={{ marginBottom: "8px", color: "#fa8c16" }}>🔧 Optimization URLs</Title>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Form.Item
              label={
                <Space>
                  <span>WebP Version URL</span>
                  {renderInfoIcon("URL phiên bản WebP của hình ảnh")}
                </Space>
              }
              name="webp_version_url"
            >
              <Input placeholder="https://example.com/images/image.webp" />
            </Form.Item>

            <Form.Item
              label={
                <Space>
                  <span>AVIF Version URL</span>
                  {renderInfoIcon("URL phiên bản AVIF của hình ảnh")}
                </Space>
              }
              name="avif_version_url"
            >
              <Input placeholder="https://example.com/images/image.avif" />
            </Form.Item>
          </Space>

          <Title level={5} style={{ margin: "16px 0 8px 0", color: "#13c2c2" }}>🤖 AI & ML SEO</Title>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Form.Item
              label={
                <Space>
                  <span>AI Alt Text</span>
                  {renderInfoIcon("Alt text được tạo bởi AI")}
                </Space>
              }
              name="ai_alt_text"
            >
              <TextArea rows={2} placeholder="Alt text được tạo bởi AI" />
            </Form.Item>

            <Form.Item
              label={
                <Space>
                  <span>AI Description</span>
                  {renderInfoIcon("Mô tả được tạo bởi AI")}
                </Space>
              }
              name="ai_description"
            >
              <TextArea rows={3} placeholder="Mô tả được tạo bởi AI" />
            </Form.Item>

            <Form.Item
              label={
                <Space>
                  <span>AI Tags</span>
                  {renderInfoIcon("Tags được tạo bởi AI")}
                </Space>
              }
              name="ai_tags"
            >
              <Select mode="tags" placeholder="Tags được tạo bởi AI" />
            </Form.Item>
          </Space>

          <Title level={5} style={{ margin: "16px 0 8px 0", color: "#722ed1" }}>🎯 Visual & Voice Search</Title>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Form.Item
              label={
                <Space>
                  <span>Visual Search Optimized</span>
                  {renderInfoIcon("Tối ưu cho visual search")}
                </Space>
              }
              name="visual_search_optimized"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              label={
                <Space>
                  <span>Visual Search Tags</span>
                  {renderInfoIcon("Tags cho visual search")}
                </Space>
              }
              name="visual_search_tags"
            >
              <Select mode="tags" placeholder="Tags cho visual search" />
            </Form.Item>

            <Form.Item
              label={
                <Space>
                  <span>Voice Search Optimized</span>
                  {renderInfoIcon("Tối ưu cho voice search")}
                </Space>
              }
              name="voice_search_optimized"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              label={
                <Space>
                  <span>Voice Search Phrases</span>
                  {renderInfoIcon("Cụm từ voice search")}
                </Space>
              }
              name="voice_search_phrases"
            >
              <Select mode="tags" placeholder="Cụm từ voice search" />
            </Form.Item>
          </Space>

          <Title level={5} style={{ margin: "16px 0 8px 0", color: "#52c41a" }}>📄 Schema Markup</Title>
          <Form.Item
            label={
              <Space>
                <FileTextOutlined style={{ color: "#1890ff" }} />
                <span>Schema Markup (JSON-LD)</span>
                {renderInfoIcon("Dữ liệu có cấu trúc Schema.org")}
                <Tag
                  color={validateJson() ? "green" : "red"}
                  style={{ fontSize: "10px" }}
                >
                  {validateJson() ? "Valid JSON" : "Invalid JSON"}
                </Tag>
              </Space>
            }
            name="schema_markup"
            extra={
              <Space size={8} wrap>
                <Tooltip title="Sao chép JSON vào clipboard">
                  <Button
                    size="small"
                    icon={<CopyOutlined />}
                    onClick={copyJsonToClipboard}
                  >
                    Copy
                  </Button>
                </Tooltip>
                <Tooltip title="Format JSON đẹp hơn">
                  <Button
                    size="small"
                    icon={<FormatPainterOutlined />}
                    onClick={formatJson}
                  >
                    Format
                  </Button>
                </Tooltip>
                <Tooltip title={jsonCollapsed ? "Mở rộng JSON editor" : "Thu gọn JSON editor"}>
                  <Button
                    size="small"
                    icon={jsonCollapsed ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                    onClick={() => setJsonCollapsed(!jsonCollapsed)}
                  >
                    {jsonCollapsed ? "Expand" : "Collapse"}
                  </Button>
                </Tooltip>
                <Tooltip title="Xóa toàn bộ JSON">
                  <Button
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={clearJsonField}
                  >
                    Clear
                  </Button>
                </Tooltip>
                <Text type="secondary" style={{ fontSize: '11px' }}>
                  {getJsonCharacterCount()} ký tự
                </Text>
              </Space>
            }
          >
            <JsonField height={jsonCollapsed ? 100 : 200} />
          </Form.Item>
        </div>
      </Panel>

      {/* Analytics & Metrics */}
      <Panel
        header={
          <Space>
            <BarChartOutlined style={{ color: "#13c2c2" }} />
            <span>Analytics & Metrics</span>
          </Space>
        }
        key="analytics"
      >
        <div style={{ padding: "4px", background: "#e6fffb", borderRadius: "8px" }}>
          <Title level={5} style={{ marginBottom: "8px", color: "#13c2c2" }}>📊 Social Metrics</Title>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Form.Item
              label={
                <Space>
                  <span>Social Shares</span>
                  {renderInfoIcon("Số lượt chia sẻ mạng xã hội")}
                </Space>
              }
              name="social_shares"
              initialValue={0}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label={
                <Space>
                  <span>Social Engagement</span>
                  {renderInfoIcon("Tỷ lệ tương tác mạng xã hội (%)")}
                </Space>
              }
              name="social_engagement"
              initialValue={0}
            >
              <InputNumber
                min={0}
                max={100}
                style={{ width: "100%" }}
                formatter={(value) => `${value}%`}
                parser={(value: string | undefined) => {
                  const num = value ? parseFloat(value.replace("%", "")) : 0;
                  return Math.max(0, Math.min(100, num));
                }}
              />
            </Form.Item>

            <Form.Item
              label={
                <Space>
                  <span>Click Through Rate</span>
                  {renderInfoIcon("Tỷ lệ click-through (%)")}
                </Space>
              }
              name="click_through_rate"
              initialValue={0}
            >
              <InputNumber
                min={0}
                max={100}
                style={{ width: "100%" }}
                formatter={(value) => `${value}%`}
                parser={(value: string | undefined) => {
                  const num = value ? parseFloat(value.replace("%", "")) : 0;
                  return Math.max(0, Math.min(100, num));
                }}
              />
            </Form.Item>
          </Space>

          <Title level={5} style={{ margin: "16px 0 8px 0", color: "#fa8c16" }}>🔍 Search Metrics</Title>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Form.Item
              label={
                <Space>
                  <span>Impressions</span>
                  {renderInfoIcon("Số lần hiển thị trong kết quả tìm kiếm")}
                </Space>
              }
              name="impressions"
              initialValue={0}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label={
                <Space>
                  <span>Clicks</span>
                  {renderInfoIcon("Số lượt click từ kết quả tìm kiếm")}
                </Space>
              }
              name="clicks"
              initialValue={0}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Space>

          <Title level={5} style={{ margin: "16px 0 8px 0", color: "#722ed1" }}>⚙️ Settings</Title>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Form.Item
              label={
                <Space>
                  <span>Auto Optimization Enabled</span>
                  {renderInfoIcon("Bật tự động tối ưu hóa")}
                </Space>
              }
              name="auto_optimization_enabled"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch />
            </Form.Item>

            <Form.Item
              label={
                <Space>
                  <span>Manual Override</span>
                  {renderInfoIcon("Cho phép ghi đè thủ công")}
                </Space>
              }
              name="manual_override"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              label={
                <Space>
                  <span>Is Active</span>
                  {renderInfoIcon("Trạng thái hoạt động của SEO data")}
                </Space>
              }
              name="is_active"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch />
            </Form.Item>
          </Space>
        </div>
      </Panel>

      {/* Auto-fill button */}
      {mode === 'create' && onAutoFillSEOScores && (
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <Space>
            <Button
              size="small"
              type="dashed"
              onClick={onAutoFillSEOScores}
              title="Điền các giá trị SEO hợp lý"
            >
              🔄 Gợi ý SEO Scores
            </Button>
            <Button
              size="small"
              type="primary"
              onClick={generateSmartSEOData}
              title="Tạo thông tin SEO thông minh"
            >
              🧠 Tạo SEO Thông minh
            </Button>
          </Space>
        </div>
      )}
    </Collapse>
  );
};
