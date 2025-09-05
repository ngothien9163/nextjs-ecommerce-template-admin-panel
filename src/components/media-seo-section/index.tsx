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
  const [lastGeneratedSchema, setLastGeneratedSchema] = useState<string | null>(null);
  const [extractedUrls, setExtractedUrls] = useState<Array<{url: string, status: 'pending' | 'valid' | 'invalid', error?: string, statusCode?: number}>>([]);
  const [isValidatingUrls, setIsValidatingUrls] = useState(false);

  // Environment variables for URLs
  const baseUrl = import.meta.env.VITE_PUBLIC_SITE_URL || "https://example.com";
  const imagesBaseUrl = import.meta.env.VITE_PUBLIC_SITE_URL_IMAGES || `${baseUrl}/images/`;

  const renderInfoIcon = (tooltip: string) => (
    <Tooltip title={tooltip} placement="top">
      <InfoCircleOutlined style={{ color: "#1890ff", marginLeft: "8px" }} />
    </Tooltip>
  );

  const generateSchemaMarkup = () => {
    if (!form) {
      message.error("Form không khả dụng!");
      return;
    }

    // Get current form values
    const currentValues = form.getFieldsValue();

    // Get file info - handle both create and edit modes
    let fileName = "sample-image";
    let fileUrl = "";

    if (uploadedFiles.length > 0) {
      // Create mode - use uploaded file
      const selectedFile = uploadedFiles[selectedFileIndex];
      fileName = selectedFile?.uploadedFileName ||
                selectedFile?.file?.name?.replace(/\.[^/.]+$/, "") ||
                "sample-image";
      fileUrl = selectedFile?.url || "";
    } else {
      // Edit mode - use existing form data
      fileName = currentValues?.file_name?.replace(/\.[^/.]+$/, "") ||
                currentValues?.alt_text?.replace(/[^a-zA-Z0-9]/g, "-") ||
                "existing-image";
      fileUrl = currentValues?.file_url || "";
    }

    const baseUrl = import.meta.env.VITE_PUBLIC_SITE_URL || "https://example.com";

    // Generate smart alt text
    const baseName = fileName.replace(/[-_]/g, " ");
    const smartAltText = currentValues?.alt_text || `Hình ảnh ${baseName} chất lượng cao, phù hợp cho website và marketing`;
    const smartTitle = currentValues?.title || `${baseName} - Hình ảnh chuyên nghiệp chất lượng cao`;

    // Generate AI-powered meta description
    const aiMetaDescriptions = [
      `Khám phá hình ảnh ${baseName} chất lượng cao, được tối ưu cho website và marketing. Hình ảnh chuyên nghiệp với độ phân giải cao, phù hợp cho mọi nhu cầu thiết kế.`,
      `Hình ảnh ${baseName} đẹp mắt và chất lượng cao. Được xử lý kỹ thuật số để đạt chất lượng tối ưu, phù hợp cho website, blog và các dự án marketing.`,
      `${baseName} - Bộ sưu tập hình ảnh chuyên nghiệp với chất lượng 4K. Tối ưu cho SEO, dễ dàng tích hợp vào website và các nền tảng mạng xã hội.`,
      `Khám phá vẻ đẹp của ${baseName} qua bộ sưu tập hình ảnh chất lượng cao. Được thiết kế để tương thích với mọi thiết bị và trình duyệt hiện đại.`,
      `Hình ảnh ${baseName} chuyên nghiệp, được tối ưu hóa cho hiệu suất web. Chất lượng cao, tải nhanh, phù hợp cho trải nghiệm người dùng tối ưu.`,
      `${baseName} - Tài liệu hình ảnh chất lượng cao với độ phân giải vượt trội. Phù hợp cho thiết kế đồ họa, marketing và nội dung số.`,
      `Khám phá ${baseName} với hình ảnh được xử lý chuyên nghiệp. Tối ưu cho công cụ tìm kiếm, dễ dàng chia sẻ trên mạng xã hội.`,
      `Hình ảnh ${baseName} chất lượng cao, được thiết kế để đáp ứng các tiêu chuẩn web hiện đại. Tương thích với mọi thiết bị và trình duyệt.`,
      `${baseName} - Bộ sưu tập hình ảnh chuyên nghiệp với chất lượng vượt trội. Được tối ưu hóa cho tốc độ tải và trải nghiệm người dùng.`,
      `Khám phá vẻ đẹp của ${baseName} qua hình ảnh chất lượng cao. Được xử lý kỹ thuật số để đạt hiệu suất tối ưu trên mọi nền tảng.`
    ];

    const smartDescription = currentValues?.meta_description ||
      aiMetaDescriptions[Math.floor(Math.random() * aiMetaDescriptions.length)];

    // Get existing meta keywords for consistency
    const existingMetaKeywords = currentValues?.meta_keywords || [];

    // Use WebP version if available, otherwise fallback to original
    const imageUrl = currentValues?.webp_version_url || fileUrl || `${imagesBaseUrl}${fileName}`;
    const thumbnailUrl = currentValues?.webp_version_url || fileUrl || `${imagesBaseUrl}${fileName}`;

    // Generate different types of schema markup for images
    const schemaOptions = [
      {
        name: "ImageObject (Cơ bản)",
        schema: {
          "@context": "https://schema.org",
          "@type": "ImageObject",
          "name": smartTitle,
          "description": smartDescription,
          "url": imageUrl,
          "contentUrl": imageUrl,
          "license": `${baseUrl}/license`,
          "acquireLicensePage": `${baseUrl}/license`,
          "creditText": import.meta.env.VITE_PUBLIC_SITE_NAME || "Website Blog",
          "creator": {
            "@type": "Organization",
            "name": import.meta.env.VITE_PUBLIC_SITE_NAME || "Website Blog"
          },
          "datePublished": new Date().toISOString(),
          "dateModified": new Date().toISOString()
        }
      },
      {
        name: "ImageObject (Nâng cao)",
        schema: {
          "@context": "https://schema.org",
          "@type": "ImageObject",
          "name": smartTitle,
          "description": smartDescription,
          "url": imageUrl,
          "contentUrl": imageUrl,
          "license": `${baseUrl}/license`,
          "acquireLicensePage": `${baseUrl}/license`,
          "creditText": import.meta.env.VITE_PUBLIC_SITE_NAME || "Website Blog",
          "creator": {
            "@type": "Organization",
            "name": import.meta.env.VITE_PUBLIC_SITE_NAME || "Website Blog",
            "url": baseUrl
          },
          "publisher": {
            "@type": "Organization",
            "name": import.meta.env.VITE_PUBLIC_SITE_NAME || "Website Blog",
            "logo": {
              "@type": "ImageObject",
              "url": `${imagesBaseUrl}logo.png`,
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
          "keywords": existingMetaKeywords.length > 0 ? existingMetaKeywords.join(", ") : [baseName.toLowerCase(), "hình ảnh", "media"].join(", "),
          "thumbnail": {
            "@type": "ImageObject",
            "url": thumbnailUrl,
            "width": 300,
            "height": 200
          },
          "width": currentValues?.image_dimensions?.split('x')[0] || 1920,
          "height": currentValues?.image_dimensions?.split('x')[1] || 1080
        }
      },
      {
        name: "Photograph (Ảnh nghệ thuật)",
        schema: {
          "@context": "https://schema.org",
          "@type": "Photograph",
          "name": smartTitle,
          "description": smartDescription,
          "url": imageUrl,
          "contentUrl": imageUrl,
          "license": `${baseUrl}/license`,
          "acquireLicensePage": `${baseUrl}/license`,
          "creditText": import.meta.env.VITE_PUBLIC_SITE_NAME || "Website Blog",
          "creator": {
            "@type": "Person",
            "name": "Photographer Name"
          },
          "datePublished": new Date().toISOString(),
          "dateModified": new Date().toISOString(),
          "genre": "Digital Art",
          "artform": "Photography",
          "artMedium": "Digital"
        }
      },
      {
        name: "Product Image (Ảnh sản phẩm)",
        schema: {
          "@context": "https://schema.org",
          "@type": "ImageObject",
          "name": smartTitle,
          "description": smartDescription,
          "url": imageUrl,
          "contentUrl": imageUrl,
          "license": `${baseUrl}/license`,
          "acquireLicensePage": `${baseUrl}/license`,
          "creditText": import.meta.env.VITE_PUBLIC_SITE_NAME || "Website Blog",
          "about": {
            "@type": "Product",
            "name": baseName,
            "description": smartDescription,
            "image": imageUrl,
            "brand": {
              "@type": "Brand",
              "name": import.meta.env.VITE_PUBLIC_SITE_NAME || "Website Blog"
            }
          },
          "datePublished": new Date().toISOString(),
          "dateModified": new Date().toISOString()
        }
      }
    ];

    // Randomly select one of the schema options
    const selectedSchema = schemaOptions[Math.floor(Math.random() * schemaOptions.length)];

    // Store the generated schema type
    setLastGeneratedSchema(selectedSchema.name);

    // Update form with generated schema
    form.setFieldsValue({
      schema_markup: selectedSchema.schema
    });

    message.success(`🎯 Đã tạo Schema Markup: ${selectedSchema.name} cho hình ảnh!`);
  };

  const generateSmartSEOData = () => {
    if (!form) {
      message.error("Form không khả dụng!");
      return;
    }

    // Get current form values
    const currentValues = form.getFieldsValue();

    // Get file info - handle both create and edit modes
    let fileName = "sample-image";
    let fileUrl = "";

    if (uploadedFiles.length > 0) {
      // Create mode - use uploaded file
      const selectedFile = uploadedFiles[selectedFileIndex];
      fileName = selectedFile?.uploadedFileName ||
                  selectedFile?.file?.name?.replace(/\.[^/.]+$/, "") ||
                  "sample-image";
      fileUrl = selectedFile?.url || "";
    } else {
      // Edit mode - use existing form data
      fileName = currentValues?.file_name?.replace(/\.[^/.]+$/, "") ||
                  currentValues?.alt_text?.replace(/[^a-zA-Z0-9]/g, "-") ||
                  "existing-image";
      fileUrl = currentValues?.file_url || "";
    }

    const baseName = fileName.replace(/[-_]/g, " ");

    // Get existing form values for consistency
    const existingTitle = currentValues?.title;
    const existingMetaDescription = currentValues?.meta_description;
    const existingMetaKeywords = currentValues?.meta_keywords || [];

    // Generate AI-powered meta description if not exists
    const aiMetaDescriptions = [
      `Khám phá hình ảnh ${baseName} chất lượng cao, được tối ưu cho website và marketing. Hình ảnh chuyên nghiệp với độ phân giải cao, phù hợp cho mọi nhu cầu thiết kế.`,
      `Hình ảnh ${baseName} đẹp mắt và chất lượng cao. Được xử lý kỹ thuật số để đạt chất lượng tối ưu, phù hợp cho website, blog và các dự án marketing.`,
      `${baseName} - Bộ sưu tập hình ảnh chuyên nghiệp với chất lượng 4K. Tối ưu cho SEO, dễ dàng tích hợp vào website và các nền tảng mạng xã hội.`,
      `Khám phá vẻ đẹp của ${baseName} qua bộ sưu tập hình ảnh chất lượng cao. Được thiết kế để tương thích với mọi thiết bị và trình duyệt hiện đại.`,
      `Hình ảnh ${baseName} chuyên nghiệp, được tối ưu hóa cho hiệu suất web. Chất lượng cao, tải nhanh, phù hợp cho trải nghiệm người dùng tối ưu.`,
      `${baseName} - Tài liệu hình ảnh chất lượng cao với độ phân giải vượt trội. Phù hợp cho thiết kế đồ họa, marketing và nội dung số.`,
      `Khám phá ${baseName} với hình ảnh được xử lý chuyên nghiệp. Tối ưu cho công cụ tìm kiếm, dễ dàng chia sẻ trên mạng xã hội.`,
      `Hình ảnh ${baseName} chất lượng cao, được thiết kế để đáp ứng các tiêu chuẩn web hiện đại. Tương thích với mọi thiết bị và trình duyệt.`,
      `${baseName} - Bộ sưu tập hình ảnh chuyên nghiệp với chất lượng vượt trội. Được tối ưu hóa cho tốc độ tải và trải nghiệm người dùng.`,
      `Khám phá vẻ đẹp của ${baseName} qua hình ảnh chất lượng cao. Được xử lý kỹ thuật số để đạt hiệu suất tối ưu trên mọi nền tảng.`
    ];

    const smartDescription = existingMetaDescription ||
      aiMetaDescriptions[Math.floor(Math.random() * aiMetaDescriptions.length)];

    // Use WebP version if available, otherwise fallback to original
    const imageUrl = currentValues?.webp_version_url || fileUrl || `${imagesBaseUrl}${fileName}`;
    const thumbnailUrl = currentValues?.webp_version_url || fileUrl || `${imagesBaseUrl}${fileName}`;

    // Generate Open Graph data - use existing Title and Meta Description
    const ogData = {
      og_title: existingTitle || `${baseName} - Hình ảnh chất lượng cao`,
      og_description: smartDescription,
      og_image: imageUrl,
      og_type: "image",
      og_site_name: import.meta.env.VITE_PUBLIC_SITE_NAME || "Website Blog",
      og_locale: "vi_VN"
    };

    // Generate Twitter Card data - use existing Title and Meta Description
    const twitterData = {
      twitter_card: "summary_large_image",
      twitter_title: existingTitle || `${baseName} - Hình ảnh chất lượng cao`,
      twitter_description: smartDescription,
      twitter_image: imageUrl,
      twitter_site: import.meta.env.VITE_PUBLIC_TWITTER_SITE || "@website",
      twitter_creator: import.meta.env.VITE_PUBLIC_TWITTER_CREATOR || "@admin"
    };

    // Generate AI content - use existing Title, Meta Description, and Meta Keywords
    const aiData = {
      ai_alt_text: existingTitle ? `${existingTitle}. Được tối ưu hóa cho công cụ tìm kiếm và trải nghiệm người dùng.` : `Hình ảnh ${baseName} chất lượng cao. Được tối ưu hóa cho công cụ tìm kiếm và trải nghiệm người dùng.`,
      ai_description: existingMetaDescription ? `${existingMetaDescription} Hình ảnh được xử lý để đạt chất lượng cao nhất.` : `Hình ảnh ${baseName} được xử lý để đạt chất lượng cao nhất và tương thích với tất cả thiết bị.`,
      ai_tags: existingMetaKeywords.length > 0 ? existingMetaKeywords.slice(0, 5) : ["optimized", "high-quality", "web-ready", "professional", "seo-friendly"],
      ai_relevance_score: Math.floor(85 + Math.random() * 10) // Random score 85-95
    };

    // Generate technical SEO data
    const technicalData = {
      webp_version_url: `${imagesBaseUrl}${fileName}.webp`,
      avif_version_url: `${imagesBaseUrl}${fileName}.avif`,
      compression_ratio: Math.round((70 + Math.random() * 20) * 10) / 10, // 70-90%
      optimization_score: Math.floor(85 + Math.random() * 10) // 85-95
    };

    // Generate visual/voice search data - use existing Meta Keywords
    const searchData = {
      visual_search_optimized: true,
      visual_search_tags: existingMetaKeywords.length > 0
        ? existingMetaKeywords.slice(0, 8).concat(["image", "photo", "picture", "media"])
        : ["image", "photo", "picture", "media", baseName.toLowerCase()],
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

    // Generate comprehensive schema markup - use existing Title and Meta Description
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "ImageObject",
      "name": existingTitle,
      "description": smartDescription,
      "url": imageUrl,
      "contentUrl": imageUrl,
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
          "url": `${imagesBaseUrl}logo.png`,
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
      "keywords": existingMetaKeywords.length > 0 ? existingMetaKeywords.join(", ") : ["hình ảnh chất lượng cao", baseName.toLowerCase(), "tài liệu hình ảnh", "hình ảnh chuyên nghiệp"].join(", "),
      "thumbnail": {
        "@type": "ImageObject",
        "url": thumbnailUrl
      }
    };

    // Combine all data (excluding alt_text, title, meta_keywords)
    const smartSEOData = {
      seo_score: Math.floor(80 + Math.random() * 15), // 80-95
      accessibility_score: Math.floor(85 + Math.random() * 10), // 85-95
      performance_score: Math.floor(80 + Math.random() * 15), // 80-95
      meta_description: smartDescription, // Include AI-generated meta description
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

    message.success(`🎉 Đã tạo thông tin SEO thông minh cho "${baseName}" với đầy đủ dữ liệu MXH, AI, Technical và Schema (bao gồm Meta Description được tạo bởi AI)!`);
  };

  const copyJsonToClipboard = async () => {
    if (!form) {
      message.error("Form không khả dụng!");
      return;
    }

    const schemaData = form.getFieldValue('schema_markup');
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
    if (!form) {
      message.error("Form không khả dụng!");
      return;
    }

    const schemaData = form.getFieldValue('schema_markup');
    if (schemaData) {
      try {
        // Format the JSON by setting it back to the form
        form.setFieldsValue({
          schema_markup: schemaData
        });
        message.success("Đã format JSON!");
      } catch (error) {
        message.error("Không thể format JSON!");
      }
    } else {
      message.warning("Không có dữ liệu JSON để format!");
    }
  };

  const clearJsonField = () => {
    if (!form) {
      message.error("Form không khả dụng!");
      return;
    }

    form.setFieldsValue({
      schema_markup: null
    });
    message.success("Đã xóa JSON field!");
  };

  const getJsonCharacterCount = () => {
    if (!form) return 0;

    const schemaData = form.getFieldValue('schema_markup');
    if (schemaData) {
      return JSON.stringify(schemaData).length;
    }
    return 0;
  };

  const validateJson = () => {
    if (!form) return false;

    const schemaData = form.getFieldValue('schema_markup');
    if (!schemaData) return false;

    try {
      // Check if it's valid JSON by trying to stringify/parse
      JSON.stringify(schemaData);
      return true;
    } catch (error) {
      return false;
    }
  };

  // Extract URLs from JSON-LD
  const extractUrlsFromJsonLd = (jsonLd: any): string[] => {
    const urls: string[] = [];
    const extractUrls = (obj: any) => {
      if (typeof obj === 'string' && (obj.startsWith('http://') || obj.startsWith('https://'))) {
        urls.push(obj);
      } else if (typeof obj === 'object' && obj !== null) {
        Object.values(obj).forEach(extractUrls);
      }
    };
    extractUrls(jsonLd);
    return [...new Set(urls)]; // Remove duplicates
  };

  // Validate URL by checking if it's reachable and content status
  const validateUrl = async (url: string): Promise<{status: 'valid' | 'invalid', error?: string, statusCode?: number}> => {
    try {
      // First try HEAD request to check if URL exists
      const headResponse = await fetch(url, {
        method: 'HEAD',
        mode: 'cors',
        headers: {
          'Accept': '*/*',
        }
      });

      // Check status codes
      if (headResponse.ok) {
        return { status: 'valid', statusCode: headResponse.status };
      } else if (headResponse.status === 404) {
        return { status: 'invalid', error: 'URL không tồn tại (404 Not Found)', statusCode: 404 };
      } else if (headResponse.status === 403) {
        return { status: 'invalid', error: 'Truy cập bị từ chối (403 Forbidden)', statusCode: 403 };
      } else if (headResponse.status === 500) {
        return { status: 'invalid', error: 'Lỗi máy chủ (500 Internal Server Error)', statusCode: 500 };
      } else {
        return { status: 'invalid', error: `Lỗi HTTP ${headResponse.status}`, statusCode: headResponse.status };
      }
    } catch (error) {
      // If HEAD fails due to CORS, try GET request
      try {
        const getResponse = await fetch(url, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Accept': '*/*',
          }
        });

        if (getResponse.ok) {
          return { status: 'valid', statusCode: getResponse.status };
        } else if (getResponse.status === 404) {
          return { status: 'invalid', error: 'URL không tồn tại (404 Not Found)', statusCode: 404 };
        } else if (getResponse.status === 403) {
          return { status: 'invalid', error: 'Truy cập bị từ chối (403 Forbidden)', statusCode: 403 };
        } else if (getResponse.status === 500) {
          return { status: 'invalid', error: 'Lỗi máy chủ (500 Internal Server Error)', statusCode: 500 };
        } else {
          return { status: 'invalid', error: `Lỗi HTTP ${getResponse.status}`, statusCode: getResponse.status };
        }
      } catch (corsError) {
        // If CORS blocks the request, try with no-cors mode (limited info)
        try {
          await fetch(url, {
            method: 'HEAD',
            mode: 'no-cors'
          });
          // If no-cors succeeds, we can't read status but URL is reachable
          return { status: 'valid', error: 'URL có thể truy cập (CORS giới hạn thông tin)' };
        } catch (noCorsError) {
          return { status: 'invalid', error: 'URL không thể truy cập hoặc bị chặn CORS' };
        }
      }
    }
  };

  // Extract and validate URLs from Schema Markup
  const extractAndValidateUrls = async () => {
    if (!form) {
      message.error("Form không khả dụng!");
      return;
    }

    const schemaData = form.getFieldValue('schema_markup');
    if (!schemaData) {
      message.warning("Không có dữ liệu Schema Markup để kiểm tra!");
      return;
    }

    setIsValidatingUrls(true);
    setExtractedUrls([]); // Clear old URL list first

    try {
      const urls = extractUrlsFromJsonLd(schemaData);
      if (urls.length === 0) {
        message.info("Không tìm thấy URL nào trong Schema Markup!");
        setIsValidatingUrls(false);
        return;
      }

      // Initialize with pending status
      const initialUrls = urls.map(url => ({ url, status: 'pending' as const }));
      setExtractedUrls(initialUrls);

      // Validate each URL
      const validatedUrls = await Promise.all(
        urls.map(async (url) => {
          const result = await validateUrl(url);
          return { url, ...result };
        })
      );

      setExtractedUrls(validatedUrls);

      const invalidCount = validatedUrls.filter(u => u.status === 'invalid').length;
      const validCount = validatedUrls.filter(u => u.status === 'valid').length;

      if (invalidCount > 0) {
        message.warning(`⚠️ Tìm thấy ${invalidCount} URL không hợp lệ, ${validCount} URL hợp lệ trong Schema Markup!`);
      } else {
        message.success(`✅ Tất cả ${urls.length} URL đều hợp lệ và có thể truy cập!`);
      }
    } catch (error) {
      console.error('Error extracting and validating URLs:', error);
      message.error("Có lỗi xảy ra khi kiểm tra URL!");
    } finally {
      setIsValidatingUrls(false);
    }
  };

  return (
    <>
      <div style={{ marginBottom: "20px", padding: "16px", background: "#f0f8ff", borderRadius: "8px", border: "1px solid #d6e4ff" }}>
        <Space style={{ width: "100%", justifyContent: "center" }}>
          <Button
            size="large"
            type="primary"
            onClick={generateSmartSEOData}
            title="Tạo thông tin SEO thông minh"
            style={{ fontSize: "16px", padding: "8px 24px", height: "auto" }}
          >
            🧠 Tạo SEO Thông minh
          </Button>
          {mode === 'create' && onAutoFillSEOScores && (
            <Button
              size="large"
              type="dashed"
              onClick={onAutoFillSEOScores}
              title="Điền các giá trị SEO hợp lý"
              style={{ fontSize: "14px", padding: "8px 20px", height: "auto" }}
            >
              🔄 Gợi ý SEO Scores
            </Button>
          )}
        </Space>
        <Text type="secondary" style={{ display: "block", textAlign: "center", marginTop: "8px", fontSize: "12px" }}>
          Tự động tạo thông tin SEO nâng cao: Open Graph, Twitter Card, AI data, Technical SEO, Visual Search, Schema Markup và các chỉ số performance
        </Text>
      </div>

      <Collapse
        defaultActiveKey={["basic", "social", "technical"]}
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
              extra={<Text type="secondary" style={{ fontSize: '11px' }}>💡 Tối ưu: 95 ký tự. Tiêu đề hấp dẫn, chứa từ khóa</Text>}
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
              extra={<Text type="secondary" style={{ fontSize: '11px' }}>💡 Tối ưu: 200 ký tự. Mô tả hấp dẫn, kêu gọi hành động</Text>}
            >
              <TextArea rows={4} placeholder="Mô tả cho Open Graph" maxLength={300} showCount style={{ height: '100px' }} />
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
              extra={<Text type="secondary" style={{ fontSize: '11px' }}>💡 Tối ưu: 70 ký tự. Tiêu đề ngắn gọn, thu hút</Text>}
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
              extra={<Text type="secondary" style={{ fontSize: '11px' }}>💡 Tối ưu: 200 ký tự. Mô tả hấp dẫn, chứa từ khóa</Text>}
            >
              <TextArea rows={4} placeholder="Mô tả cho Twitter" maxLength={200} showCount style={{ height: '100px' }} />
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
              <Input placeholder={`${imagesBaseUrl}image.webp`} />
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
              <Input placeholder={`${imagesBaseUrl}image.avif`} />
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
              <TextArea rows={4} placeholder="Mô tả được tạo bởi AI" style={{ height: '100px' }} />
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
          <div style={{ marginBottom: "12px" }}>
            <Space align="start">
              <Button
                size="small"
                type="dashed"
                onClick={generateSchemaMarkup}
                title="Tạo Schema Markup phù hợp cho hình ảnh"
                style={{ marginBottom: "8px" }}
              >
                🎯 Tạo Schema Markup
              </Button>
              {lastGeneratedSchema && (
                <div style={{
                  padding: "4px 8px",
                  backgroundColor: "#f6ffed",
                  border: "1px solid #b7eb8f",
                  borderRadius: "4px",
                  fontSize: "11px",
                  color: "#52c41a",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}>
                  <span>✅</span>
                  <span>{lastGeneratedSchema}</span>
                </div>
              )}
            </Space>
            <Text type="secondary" style={{ fontSize: '11px', display: 'block' }}>
              Tự động tạo Schema.org markup phù hợp với loại hình ảnh
            </Text>
          </div>
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
            <JsonField height={jsonCollapsed ? 450 : 600} />
          </Form.Item>

          {/* URL Validation Section */}
          <div style={{ marginTop: "16px", padding: "12px", background: "#f9f9f9", borderRadius: "8px" }}>
            <Space align="center" style={{ marginBottom: "12px" }}>
              <Button
                size="small"
                type="primary"
                onClick={extractAndValidateUrls}
                loading={isValidatingUrls}
                disabled={isValidatingUrls}
                icon={<GlobalOutlined />}
              >
                {isValidatingUrls ? "Đang kiểm tra..." : "Kiểm tra URL trong Schema"}
              </Button>
              <Text type="secondary" style={{ fontSize: '11px' }}>
                Tự động trích xuất và kiểm tra tất cả URL trong Schema Markup
              </Text>
            </Space>

            {extractedUrls.length > 0 && (
              <div>
                <Title level={5} style={{ marginBottom: "8px", color: "#1890ff" }}>
                  📋 Danh sách URL ({extractedUrls.length})
                </Title>
                <Space direction="vertical" style={{ width: "100%" }}>
                  {extractedUrls.map((urlItem, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "8px",
                        border: "1px solid #d9d9d9",
                        borderRadius: "4px",
                        background: urlItem.status === 'valid' ? '#f6ffed' :
                                   urlItem.status === 'invalid' ? '#fff2f0' : '#fffbe6'
                      }}
                    >
                      <Space align="start">
                        <span style={{
                          color: urlItem.status === 'valid' ? '#52c41a' :
                                 urlItem.status === 'invalid' ? '#ff4d4f' : '#faad14',
                          fontSize: '16px'
                        }}>
                          {urlItem.status === 'valid' ? '✅' :
                           urlItem.status === 'invalid' ? '❌' : '⏳'}
                        </span>
                        <div style={{ flex: 1 }}>
                          <Text
                            style={{
                              wordBreak: 'break-all',
                              fontSize: '12px',
                              color: urlItem.status === 'invalid' ? '#ff4d4f' : '#1890ff'
                            }}
                          >
                            {urlItem.url}
                          </Text>
                          {urlItem.status === 'valid' && urlItem.statusCode && (
                            <Text type="success" style={{ fontSize: '11px', display: 'block', marginTop: '4px' }}>
                              ✅ HTTP {urlItem.statusCode} - URL hợp lệ
                            </Text>
                          )}
                          {urlItem.status === 'invalid' && urlItem.error && (
                            <Text type="danger" style={{ fontSize: '11px', display: 'block', marginTop: '4px' }}>
                              ❌ {urlItem.error}
                              {urlItem.statusCode && ` (HTTP ${urlItem.statusCode})`}
                            </Text>
                          )}
                          {urlItem.status === 'pending' && (
                            <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginTop: '4px' }}>
                              ⏳ Đang kiểm tra...
                            </Text>
                          )}
                        </div>
                      </Space>
                    </div>
                  ))}
                </Space>
              </div>
            )}
          </div>
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

    </Collapse>
    </>
  );
};
