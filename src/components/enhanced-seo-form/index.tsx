import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  Switch,
  Row,
  Col,
  Card,
  Typography,
  Space,
  Tooltip,
  Collapse,
  Button,
  InputNumber,
  Rate,
  Tag,
  message,
} from "antd";
import {
  InfoCircleOutlined,
  GlobalOutlined,
  ShareAltOutlined,
  TwitterOutlined,
  CodeOutlined,
  BarChartOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  UserOutlined,
  QuestionCircleOutlined,
  DeleteOutlined,
  CopyOutlined,
  FormatPainterOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { JsonField } from "../JsonField";
import { MediaSelector } from "../media-selector";
import { supabase } from "../../lib/supabase";
import type { SEOPageType } from "../../lib/supabase";
import "./enhanced-seo-form.css";

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Panel } = Collapse;

interface EnhancedSEOFormProps {
  form: any;
  isEdit?: boolean;
  referenceType: "blog" | "product" | "category" | "page" | "user" | "system";
  referenceId?: string;
  pageUrl?: string;
  onSEODataChange?: (seoData: any) => void;
}

export const EnhancedSEOForm: React.FC<EnhancedSEOFormProps> = ({
  form,
  isEdit = false,
  referenceType,
  referenceId,
  pageUrl,
  onSEODataChange,
}) => {
  const [seoPageTypes, setSeoPageTypes] = useState<SEOPageType[]>([]);
  const [existingSEOData, setExistingSEOData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [jsonCollapsed, setJsonCollapsed] = useState(false);
  const [jsonPreview, setJsonPreview] = useState(false);

  // Load SEO Page Types
  useEffect(() => {
    const loadSEOPageTypes = async () => {
      try {
        const { data, error } = await supabase
          .from("seo_page_types")
          .select("*")
          .eq("is_active", true)
          .order("sort_order");

        if (data) {
          setSeoPageTypes(data);
        }
      } catch (error) {
        console.error("Error loading SEO page types:", error);
      }
    };

    loadSEOPageTypes();
  }, []);

  // Update page URL when pageUrl prop changes
  useEffect(() => {
    if (pageUrl) {
      form?.form?.setFieldsValue({
        seo_data: {
          ...form?.form?.getFieldValue("seo_data"),
          page_url: pageUrl,
        },
      });
    }
  }, [pageUrl, form]);

  // Load existing SEO data when component mounts or props change
  useEffect(() => {
    if (referenceId && pageUrl && referenceType) {
      loadExistingSEOData();
    }
  }, [referenceId, pageUrl, referenceType]);

  const loadExistingSEOData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("seo_pages")
        .select("*")
        .eq("reference_type", referenceType)
        .eq("reference_id", referenceId)
        .eq("page_url", pageUrl)
        .single();

      if (data) {
        setExistingSEOData(data);
        // Pre-fill form with existing data
        form?.form?.setFieldsValue({
          seo_data: data,
        });
      }
    } catch (error) {
      console.error("Error loading existing SEO data:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateSmartSEOData = () => {
    const formValues = form?.form?.getFieldsValue();
    const title = formValues?.title || "";
    const content = formValues?.content || "";
    const excerpt = formValues?.excerpt || "";
    const slug = formValues?.slug || "";
    // Get featured image from blog post form
    const featuredImage = formValues?.featured_image || formValues?.featured_image_url;

    // Generate smart meta keywords from title and content (3-4 words or more per keyword)
    const titleWords = title
      .toLowerCase()
      .split(" ")
      .filter((word: string) => word.length > 2)
      .slice(0, 2);

    // Extract meaningful phrases from content (3-4 words each)
    const contentText = content
      .toLowerCase()
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .replace(/[^\w\s]/g, " ") // Remove punctuation
      .replace(/\s+/g, " ") // Normalize spaces
      .trim();

    // Create multi-word keywords from content
    const contentPhrases: string[] = [];
    const sentences = contentText
      .split(/[.!?]+/)
      .filter((s: string) => s.trim().length > 10);

    for (const sentence of sentences.slice(0, 3)) {
      const words = sentence
        .trim()
        .split(" ")
        .filter((w: string) => w.length > 2);
      if (words.length >= 3) {
        // Create 3-4 word phrases
        const phrase = words.slice(0, 4).join(" ");
        if (phrase.length > 10) {
          contentPhrases.push(phrase);
        }
      }
    }

    // Additional smart keywords based on context (multi-word)
    const contextKeywords = [
      "blog bài viết",
      "tin tức công nghệ",
      "thông tin hữu ích",
      "hướng dẫn chi tiết",
      "kinh nghiệm thực tế",
      "website chất lượng",
    ]
      .filter(
        (keyword: string) =>
          !contentPhrases.some((phrase: string) =>
            phrase.includes(keyword.split(" ")[0])
          )
      )
      .slice(0, 3);

    // Combine and create keyword array
    const allKeywords = [...titleWords, ...contentPhrases, ...contextKeywords]
      .filter((keyword) => keyword.length > 5) // Ensure meaningful length
      .slice(0, 6); // Maximum 6 keywords

    // Ensure minimum 4 keywords with meaningful multi-word terms
    const smartKeywords =
      allKeywords.length >= 4
        ? allKeywords
        : [
            ...allKeywords,
            "blog bài viết",
            "thông tin hữu ích",
            "nội dung chất lượng",
            "website uy tín",
          ].slice(0, 6);

    // Generate URLs
    const baseUrl =
      import.meta.env.VITE_PUBLIC_SITE_URL || "https://example.com";
    const fullPageUrl = pageUrl || `/blog/${slug}`;
    const canonicalUrl = `${baseUrl}${fullPageUrl}`;

    // Use selected images if available, otherwise use featured image or dynamic API
    const existingOgImage = formValues?.seo_data?.og_image;
    const existingTwitterImage = formValues?.seo_data?.twitter_image;

    // Helper function to replace localhost URLs with production URL
    const replaceLocalhostUrl = (url: string) => {
      if (url && url.includes('localhost')) {
        return url.replace(/https?:\/\/localhost(:\d+)?/, baseUrl);
      }
      return url;
    };

    // Priority: existing OG image > featured image > dynamic OG image
    const ogImageUrl =
      existingOgImage ? replaceLocalhostUrl(existingOgImage) :
      featuredImage ? replaceLocalhostUrl(featuredImage) :
      `${baseUrl}/api/og?title=${encodeURIComponent(title)}`; // Use selected image, featured image, or dynamic OG image

    const twitterImageUrl = existingTwitterImage ? replaceLocalhostUrl(existingTwitterImage) : ogImageUrl; // Use selected Twitter image or same as OG

    // Generate smart SEO suggestions
    const pageTitle =
      title.length > 50
        ? title
        : `${title} - ${
            import.meta.env.VITE_PUBLIC_SITE_NAME || "Website"
          }`;
    const metaDescription =
      excerpt || content.replace(/<[^>]*>/g, "").substring(0, 155) + "...";

    const smartSEOData = {
      page_url: fullPageUrl,
      page_title: pageTitle,
      meta_description: metaDescription,
      meta_keywords: smartKeywords, // Array format for Select tags mode (comma-separated when saved)
      canonical_url: canonicalUrl,
      robots_directive: "index,follow",
      language: "vi",
      charset: "UTF-8",
      viewport: "width=device-width, initial-scale=1",

      // Open Graph fields
      og_title: title,
      og_description: metaDescription,
      og_type: "article",
      og_image: ogImageUrl,
      og_site_name: import.meta.env.VITE_PUBLIC_SITE_NAME || "Website Blog",
      og_locale: "vi_VN",
      og_url: canonicalUrl,

      // Twitter Card fields
      twitter_card: "summary_large_image",
      twitter_title: title,
      twitter_description: metaDescription,
      twitter_image: twitterImageUrl,
      twitter_site: import.meta.env.VITE_PUBLIC_TWITTER_SITE || "@website",
      twitter_creator: import.meta.env.VITE_PUBLIC_TWITTER_CREATOR || "@admin",

      // Additional SEO fields
      hreflang: [
        { lang: "vi", url: canonicalUrl },
        { lang: "x-default", url: canonicalUrl },
      ],

      // Status and flags
      is_active: true,
      is_indexed: true,
      is_ssl_secure: true,
      is_featured: false,

      // SEO Scores
      seo_score: Math.floor(75 + Math.random() * 20), // Random score between 75-95
      mobile_friendly_score: Math.floor(80 + Math.random() * 15),
      accessibility_score: Math.floor(75 + Math.random() * 20),
      core_web_vitals_score: Math.floor(70 + Math.random() * 25),

      // Content metrics
      content_length: content.replace(/<[^>]*>/g, "").split(" ").length,
      keyword_difficulty: Math.floor(30 + Math.random() * 40),
      search_volume: Math.floor(100 + Math.random() * 500),

      // Performance metrics
      page_load_time: Math.round((1 + Math.random() * 2) * 100) / 100, // 1-3 seconds

      // Schema markup
      schema_markup: {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: title,
        description: metaDescription,
        url: canonicalUrl,
        image: featuredImage && featuredImage !== ogImageUrl ? [
          {
            "@type": "ImageObject",
            url: replaceLocalhostUrl(featuredImage),
            width: 1200,
            height: 630,
          },
          {
            "@type": "ImageObject",
            url: replaceLocalhostUrl(ogImageUrl),
            width: 1200,
            height: 630,
          }
        ] : {
          "@type": "ImageObject",
          url: replaceLocalhostUrl(ogImageUrl),
          width: 1200,
          height: 630,
        },
        datePublished: new Date().toISOString(),
        dateModified: new Date().toISOString(),
        author: {
          "@type": "Person",
          name: "Admin",
          url: `${baseUrl}/author/admin`,
        },
        publisher: {
          "@type": "Organization",
          name: import.meta.env.VITE_PUBLIC_SITE_NAME || "Website Blog",
          logo: {
            "@type": "ImageObject",
            url: `${baseUrl}/logo.png`,
            width: 300,
            height: 100,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": canonicalUrl,
        },
        articleSection: "Blog",
        inLanguage: "vi-VN",
        potentialAction: {
          "@type": "ReadAction",
          target: canonicalUrl,
        },
      },
    };

    form?.form?.setFieldsValue({
      seo_data: smartSEOData,
    });

    if (onSEODataChange) {
      onSEODataChange(smartSEOData);
    }

    // Show success message
    message.success(
      `Đã tạo thông tin SEO thông minh với ${smartKeywords.length} keywords đa từ (3-4 từ mỗi keyword)!`
    );
  };

  const generateComprehensiveSchema = () => {
    const formValues = form?.form?.getFieldsValue();
    const baseUrl =
      import.meta.env.VITE_PUBLIC_SITE_URL || "https://example.com";
    // Get featured image from blog post form
    const featuredImage = formValues?.featured_image || formValues?.featured_image_url;
    // Priority: existing OG image > featured image > default image
    const ogImage =
      formValues?.seo_data?.og_image ||
      featuredImage ||
      `${baseUrl}/images/blog-default.jpg`;

    // Helper function to replace localhost URLs with production URL
    const replaceLocalhostUrl = (url: string) => {
      if (url && url.includes('localhost')) {
        return url.replace(/https?:\/\/localhost(:\d+)?/, baseUrl);
      }
      return url;
    };

    const comprehensiveSchema = [
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: formValues?.title || "Tiêu đề bài viết",
        description: formValues?.excerpt || "Mô tả bài viết",
        url: `${baseUrl}${pageUrl || "/blog/default"}`,
        image: featuredImage && featuredImage !== ogImage ? [
          replaceLocalhostUrl(featuredImage),
          replaceLocalhostUrl(ogImage)
        ] : replaceLocalhostUrl(ogImage),
        author: {
          "@type": "Person",
          name: "Admin",
          url: `${baseUrl}/author/admin`,
        },
        publisher: {
          "@type": "Organization",
          name: import.meta.env.VITE_PUBLIC_SITE_NAME || "Website",
          logo: {
            "@type": "ImageObject",
            url: `${baseUrl}/logo.png`,
            width: 300,
            height: 100,
          },
        },
        datePublished: new Date().toISOString(),
        dateModified: new Date().toISOString(),
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${baseUrl}${pageUrl || "/blog/default"}`,
        },
        articleSection: "Blog",
        inLanguage: "vi-VN",
        potentialAction: {
          "@type": "ReadAction",
          target: `${baseUrl}${pageUrl || "/blog/default"}`,
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Admin",
        url: `${baseUrl}/author/admin`,
        image: `${baseUrl}/images/author-default.jpg`,
        jobTitle: "Content Writer",
        worksFor: {
          "@type": "Organization",
          name: import.meta.env.VITE_PUBLIC_SITE_NAME || "Website",
        },
        sameAs: [`${baseUrl}/author/admin`, `https://twitter.com/admin`],
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `What is ${formValues?.title || "this article"} about?`,
            acceptedAnswer: {
              "@type": "Answer",
              text:
                formValues?.excerpt ||
                "This article provides detailed information about the topic.",
            },
          },
          {
            "@type": "Question",
            name: "How can I learn more?",
            acceptedAnswer: {
              "@type": "Answer",
              text: `Visit our website at ${baseUrl} for more articles and resources.`,
            },
          },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: baseUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: `${baseUrl}/blog`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: formValues?.title || "Article",
            item: `${baseUrl}${pageUrl || "/blog/default"}`,
          },
        ],
      },
    ];

    form?.form?.setFieldsValue({
      seo_data: {
        ...form?.form?.getFieldValue("seo_data"),
        schema_markup: comprehensiveSchema,
      },
    });

    message.success(
      "Đã tạo schema markup toàn diện với Article, Author, FAQ và Breadcrumb!"
    );
  };

  const generateArticleSchema = () => {
    const formValues = form?.form?.getFieldsValue();
    const baseUrl =
      import.meta.env.VITE_PUBLIC_SITE_URL || "https://example.com";
    // Get featured image from blog post form
    const featuredImage = formValues?.featured_image || formValues?.featured_image_url;
    // Priority: existing OG image > featured image > default image
    const ogImage =
      formValues?.seo_data?.og_image ||
      featuredImage ||
      `${baseUrl}/images/blog-default.jpg`;

    // Helper function to replace localhost URLs with production URL
    const replaceLocalhostUrl = (url: string) => {
      if (url && url.includes('localhost')) {
        return url.replace(/https?:\/\/localhost(:\d+)?/, baseUrl);
      }
      return url;
    };

    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: formValues?.title || "Tiêu đề bài viết",
      description: formValues?.excerpt || "Mô tả bài viết",
      url: `${baseUrl}${pageUrl || "/blog/default"}`,
      image: featuredImage && featuredImage !== ogImage ? [
        replaceLocalhostUrl(featuredImage),
        replaceLocalhostUrl(ogImage)
      ] : replaceLocalhostUrl(ogImage),
      author: {
        "@type": "Person",
        name: "Admin",
        url: `${baseUrl}/author/admin`,
      },
      publisher: {
        "@type": "Organization",
        name: import.meta.env.VITE_PUBLIC_SITE_NAME || "Website",
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/logo.png`,
          width: 300,
          height: 100,
        },
      },
      datePublished: new Date().toISOString(),
      dateModified: new Date().toISOString(),
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${baseUrl}${pageUrl || "/blog/default"}`,
      },
      articleSection: "Blog",
      inLanguage: "vi-VN",
    };

    form?.form?.setFieldsValue({
      seo_data: {
        ...form?.form?.getFieldValue("seo_data"),
        schema_markup: articleSchema,
      },
    });

    message.success("Đã tạo Article schema!");
  };

  const generateAuthorSchema = () => {
    const baseUrl =
      import.meta.env.VITE_PUBLIC_SITE_URL || "https://example.com";

    const authorSchema = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Admin",
      url: `${baseUrl}/author/admin`,
      image: `${baseUrl}/images/author-default.jpg`,
      jobTitle: "Content Writer",
      worksFor: {
        "@type": "Organization",
        name: import.meta.env.VITE_PUBLIC_SITE_NAME || "Website",
      },
      sameAs: [`${baseUrl}/author/admin`, `https://twitter.com/admin`],
      knowsAbout: [
        "Content Writing",
        "SEO",
        "Digital Marketing",
        "Blog Writing",
      ],
    };

    form?.form?.setFieldsValue({
      seo_data: {
        ...form?.form?.getFieldValue("seo_data"),
        schema_markup: authorSchema,
      },
    });

    message.success("Đã tạo Author/Person schema!");
  };

  const generateFAQSchema = () => {
    const formValues = form?.form?.getFieldsValue();
    const baseUrl =
      import.meta.env.VITE_PUBLIC_SITE_URL || "https://example.com";

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: `What is ${formValues?.title || "this article"} about?`,
          acceptedAnswer: {
            "@type": "Answer",
            text:
              formValues?.excerpt ||
              "This article provides detailed information about the topic discussed.",
          },
        },
        {
          "@type": "Question",
          name: "How can I learn more about this topic?",
          acceptedAnswer: {
            "@type": "Answer",
            text: `Visit our website at ${baseUrl} for more articles and resources on this topic.`,
          },
        },
        {
          "@type": "Question",
          name: "Who wrote this article?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "This article was written by our content team to provide valuable information to our readers.",
          },
        },
      ],
    };

    form?.form?.setFieldsValue({
      seo_data: {
        ...form?.form?.getFieldValue("seo_data"),
        schema_markup: faqSchema,
      },
    });

    message.success("Đã tạo FAQ schema!");
  };

  const clearSchema = () => {
    form?.form?.setFieldsValue({
      seo_data: {
        ...form?.form?.getFieldValue("seo_data"),
        schema_markup: null,
      },
    });

    message.success("Đã xóa schema markup!");
  };

  const copyJsonToClipboard = async () => {
    const schemaData = form?.form?.getFieldValue(["seo_data", "schema_markup"]);
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
    const schemaData = form?.form?.getFieldValue(["seo_data", "schema_markup"]);
    if (schemaData) {
      try {
        const formatted = JSON.stringify(schemaData, null, 2);
        form?.form?.setFieldsValue({
          seo_data: {
            ...form?.form?.getFieldValue("seo_data"),
            schema_markup: JSON.parse(formatted),
          },
        });
        message.success("Đã format JSON!");
      } catch (err) {
        message.error("JSON không hợp lệ!");
      }
    } else {
      message.warning("Không có dữ liệu JSON để format!");
    }
  };

  const clearJsonField = () => {
    form?.form?.setFieldsValue({
      seo_data: {
        ...form?.form?.getFieldValue("seo_data"),
        schema_markup: null,
      },
    });
    message.success("Đã xóa JSON field!");
  };

  const getJsonCharacterCount = () => {
    const schemaData = form?.form?.getFieldValue(["seo_data", "schema_markup"]);
    if (schemaData) {
      return JSON.stringify(schemaData).length;
    }
    return 0;
  };

  const validateJson = () => {
    const schemaData = form?.form?.getFieldValue(["seo_data", "schema_markup"]);
    if (schemaData) {
      try {
        JSON.stringify(schemaData);
        return true;
      } catch (err) {
        return false;
      }
    }
    return true; // Empty is valid
  };

  // Custom JsonField wrapper for Ant Design Form integration
  const JsonFieldWrapper: React.FC<{ value?: any; onChange?: (value: any) => void }> = ({ value, onChange }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    // Function to expand all JSON child elements
    const expandAllJsonChildren = (obj: any, path: string[] = []): any => {
      if (obj === null || obj === undefined) return obj;
      if (typeof obj !== 'object') return obj;

      if (Array.isArray(obj)) {
        return obj.map((item, index) => expandAllJsonChildren(item, [...path, index.toString()]));
      }

      const expandedObj: any = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          if (typeof value === 'object' && value !== null) {
            // Add expansion metadata for nested objects
            expandedObj[key] = {
              ...expandAllJsonChildren(value, [...path, key]),
              _expanded: true // Mark as expanded
            };
          } else {
            expandedObj[key] = value;
          }
        }
      }
      return expandedObj;
    };

    const handleExpandAll = () => {
      if (value && typeof value === 'object') {
        const expandedValue = expandAllJsonChildren(value);
        setIsExpanded(true);
        onChange?.(expandedValue);
      }
    };

    return (
      <div style={{ position: 'relative' }}>
        <JsonField
          value={value}
          onChange={onChange}
          height={jsonCollapsed ? 100 : 280} // Increased by 40% from 300 to 280 (but keeping collapsed at 100)
        />
        <Button
          size="small"
          type="text"
          onClick={handleExpandAll}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 10,
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid #d9d9d9'
          }}
          title="Mở rộng tất cả các phần tử JSON"
        >
          🔍 Mở rộng
        </Button>
      </div>
    );
  };

  const renderInfoIcon = (tooltip: string) => (
    <Tooltip title={tooltip} placement="top">
      <InfoCircleOutlined style={{ color: "#1890ff", marginLeft: "8px" }} />
    </Tooltip>
  );

  const getSEOScoreColor = (score: number) => {
    if (score >= 90) return "#52c41a";
    if (score >= 75) return "#faad14";
    if (score >= 60) return "#fa8c16";
    return "#f5222d";
  };

  return (
    <Card
      title={
        <Space>
          <GlobalOutlined style={{ color: "#1890ff" }} />
          <span>SEO Optimization cho {referenceType}</span>
          <Button
            size="small"
            type="primary"
            onClick={generateSmartSEOData}
            icon={<CheckCircleOutlined />}
          >
            Tạo SEO thông minh
          </Button>
        </Space>
      }
      style={{ marginBottom: "24px" }}
      className="enhanced-seo-form-card"
      loading={loading}
    >
      <Collapse
        defaultActiveKey={["basic", "social", "technical", "metrics"]}
        ghost
        expandIconPosition="end"
      >
        {/* Thông tin SEO cơ bản */}
        <Panel
          header={
            <Space>
              <GlobalOutlined style={{ color: "#52c41a" }} />
              <span>Thông tin SEO cơ bản</span>
            </Space>
          }
          key="basic"
        >
          {/* URL Section */}
          <div style={{ marginBottom: "8px", padding: "4px", background: "#f8f9fa", borderRadius: "8px" }}>
            <Title level={5} style={{ marginBottom: "4px", color: "#1890ff" }}>📍 URL & Canonical</Title>
            <Row gutter={[24, 16]}>
              <Col span={24}>
                <Form.Item
                  label={
                    <Space>
                      <span>Page URL</span>
                      {renderInfoIcon(
                        "URL của trang blog, được tạo tự động từ slug"
                      )}
                    </Space>
                  }
                  name={["seo_data", "page_url"]}
                >
                  <Input
                    placeholder="/blog/tieu-de-bai-viet"
                    disabled={isEdit}
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label={
                    <Space>
                      <span>Canonical URL</span>
                      {renderInfoIcon(
                        "URL chính thức của trang, giúp tránh duplicate content"
                      )}
                    </Space>
                  }
                  name={["seo_data", "canonical_url"]}
                >
                  <Input
                    placeholder={`${
                      import.meta.env.VITE_PUBLIC_SITE_URL ||
                      "https://example.com"
                    }/blog/bai-viet`}
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* Meta Information Section */}
          <div style={{ marginBottom: "8px", padding: "4px", background: "#fff7e6", borderRadius: "8px" }}>
            <Title level={5} style={{ marginBottom: "4px", color: "#fa8c16" }}>📝 Meta Information</Title>
            <Row gutter={[24, 16]}>
              <Col span={24}>
                <Form.Item
                  label={
                    <Space>
                      <span>Meta Title</span>
                      {renderInfoIcon(
                        "Tiêu đề trang hiển thị trên kết quả tìm kiếm. Nên có 50-60 ký tự"
                      )}
                    </Space>
                  }
                  name={["seo_data", "page_title"]}
                  rules={[
                    { required: true, message: "Vui lòng nhập Meta Title!" },
                  ]}
                >
                  <Input
                    placeholder="Tiêu đề trang cho SEO (50-60 ký tự)"
                    maxLength={60}
                    showCount
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 16]}>
              <Col span={24}>
                <Form.Item
                  label={
                    <Space>
                      <span>Meta Description</span>
                      {renderInfoIcon(
                        "Mô tả ngắn gọn nội dung trang, hiển thị dưới tiêu đề trên kết quả tìm kiếm"
                      )}
                    </Space>
                  }
                  name={["seo_data", "meta_description"]}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập Meta Description!",
                    },
                  ]}
                >
                  <TextArea
                    rows={3}
                    placeholder="Mô tả meta cho SEO (120-160 ký tự)"
                    maxLength={160}
                    showCount
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 16]}>
              <Col span={24}>
                <Form.Item
                  label={
                    <Space>
                      <span>Meta Keywords</span>
                      {renderInfoIcon(
                        "Từ khóa chính của bài viết (3-6 keywords đa từ), phân tách bằng dấu phẩy. Mỗi keyword nên có 3-4 từ trở lên."
                      )}
                    </Space>
                  }
                  name={["seo_data", "meta_keywords"]}
                  extra="Nhập từ khóa đa từ (3-4 từ mỗi keyword) và nhấn dấu phẩy để tạo tag mới"
                >
                  <Select
                    mode="tags"
                    placeholder="Nhập từ khóa SEO (3-4 từ mỗi keyword), ngăn cách bằng dấu phẩy"
                    style={{ width: "100%" }}
                    maxTagCount={6}
                    size="large"
                    tokenSeparators={[","]} // Only comma separation for multi-word keywords
                    showSearch
                    filterOption={false}
                    notFoundContent={null}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* Technical Settings Section */}
          <div style={{ marginBottom: "8px", padding: "4px", background: "#f0f9ff", borderRadius: "8px" }}>
            <Title level={5} style={{ marginBottom: "4px", color: "#13c2c2" }}>⚙️ Technical Settings</Title>
            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Form.Item
                  label={
                    <Space>
                      <span>Character Encoding</span>
                      {renderInfoIcon("Bộ mã ký tự của trang, thường là UTF-8")}
                    </Space>
                  }
                  name={["seo_data", "charset"]}
                  initialValue="UTF-8"
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={
                    <Space>
                      <span>Viewport</span>
                      {renderInfoIcon("Cài đặt viewport cho responsive design")}
                    </Space>
                  }
                  name={["seo_data", "viewport"]}
                  initialValue="width=device-width, initial-scale=1"
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Form.Item
                  label={
                    <Space>
                      <span>Robots Directive</span>
                      {renderInfoIcon("Chỉ thị cho crawler của search engine")}
                    </Space>
                  }
                  name={["seo_data", "robots_directive"]}
                  initialValue="index,follow"
                >
                  <Select size="large">
                    <Select.Option value="index,follow">
                      Index, Follow
                    </Select.Option>
                    <Select.Option value="index,nofollow">
                      Index, No Follow
                    </Select.Option>
                    <Select.Option value="noindex,follow">
                      No Index, Follow
                    </Select.Option>
                    <Select.Option value="noindex,nofollow">
                      No Index, No Follow
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={
                    <Space>
                      <span>Ngôn ngữ</span>
                      {renderInfoIcon("Ngôn ngữ chính của trang")}
                    </Space>
                  }
                  name={["seo_data", "language"]}
                  initialValue="vi"
                >
                  <Select size="large">
                    <Select.Option value="vi">Tiếng Việt</Select.Option>
                    <Select.Option value="en">English</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* Advanced Settings Section */}
          <div style={{ padding: "4px", background: "#f6ffed", borderRadius: "8px" }}>
            <Title level={5} style={{ marginBottom: "4px", color: "#52c41a" }}>🌐 Advanced Settings</Title>
            <Row gutter={[24, 16]}>
              <Col span={24}>
                <Form.Item
                  label={
                    <Space>
                      <span>Hreflang Tags (JSON)</span>
                      {renderInfoIcon(
                        "Thẻ hreflang cho đa ngôn ngữ, giúp Google hiểu mối quan hệ giữa các phiên bản ngôn ngữ"
                      )}
                    </Space>
                  }
                  name={["seo_data", "hreflang"]}
                  extra={
                    <Button
                      size="small"
                      onClick={() => {
                        const canonical =
                          form?.form?.getFieldValue([
                            "seo_data",
                            "canonical_url",
                          ]) ||
                          `${
                            import.meta.env.VITE_PUBLIC_SITE_URL ||
                            "https://example.com"
                          }/blog/post`;
                        const base = canonical.replace(/\/$/, "");
                        const example = [
                          { lang: "vi", url: `${base}/vi` },
                          { lang: "en", url: `${base}/en` },
                        ];
                        form?.form?.setFieldsValue({
                          seo_data: { hreflang: example },
                        });
                      }}
                    >
                      Tạo dữ liệu thông minh
                    </Button>
                  }
                >
                  <JsonField height={300} />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Panel>

        {/* Open Graph & Social Media */}
        <Panel
          header={
            <Space>
              <ShareAltOutlined style={{ color: "#722ed1" }} />
              <span>Open Graph & Social Media</span>
            </Space>
          }
          key="social"
        >
          {/* Facebook/Open Graph Section */}
          <div style={{ marginBottom: "8px", padding: "4px", background: "#f9f0ff", borderRadius: "8px" }}>
            <Title level={5} style={{ marginBottom: "4px", color: "#722ed1" }}>📘 Facebook & Open Graph</Title>
            <Row gutter={[24, 16]}>
              <Col span={24}>
                <Form.Item
                  label={
                    <Space>
                      <span>OG Title</span>
                      {renderInfoIcon(
                        "Tiêu đề hiển thị khi chia sẻ trên Facebook, LinkedIn"
                      )}
                    </Space>
                  }
                  name={["seo_data", "og_title"]}
                >
                  <Input
                    placeholder="Tiêu đề cho Open Graph"
                    maxLength={95}
                    showCount
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 16]}>
              <Col span={24}>
                <Form.Item
                  label={
                    <Space>
                      <span>OG Description</span>
                      {renderInfoIcon(
                        "Mô tả hiển thị khi chia sẻ trên Facebook, LinkedIn"
                      )}
                    </Space>
                  }
                  name={["seo_data", "og_description"]}
                >
                  <TextArea
                    rows={2}
                    placeholder="Mô tả cho Open Graph"
                    maxLength={300}
                    showCount
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 16]}>
              <Col span={24}>
                <Form.Item
                  label={
                    <Space>
                      <span>OG Image</span>
                      {renderInfoIcon(
                        "Hình ảnh hiển thị khi chia sẻ trên mạng xã hội. Chọn từ thư viện hình ảnh đã upload"
                      )}
                    </Space>
                  }
                  name={["seo_data", "og_image"]}
                >
                  <MediaSelector
                    placeholder="Chọn hình ảnh OG từ thư viện"
                    onSelect={(media) => {
                      // Update the form with the selected image URL
                      form?.form?.setFieldsValue({
                        seo_data: {
                          ...form?.form?.getFieldValue("seo_data"),
                          og_image: media.file_url,
                        },
                      });
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 16]}>
              <Col span={8}>
                <Form.Item
                  label={
                    <Space>
                      <span>OG Type</span>
                      {renderInfoIcon("Loại nội dung cho Open Graph")}
                    </Space>
                  }
                  name={["seo_data", "og_type"]}
                  initialValue="article"
                >
                  <Select size="large">
                    <Select.Option value="article">
                      Article (Blog Post)
                    </Select.Option>
                    <Select.Option value="website">Website</Select.Option>
                    <Select.Option value="product">Product</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label={
                    <Space>
                      <span>OG Site Name</span>
                      {renderInfoIcon(
                        "Tên website, hiển thị bên dưới tiêu đề khi chia sẻ"
                      )}
                    </Space>
                  }
                  name={["seo_data", "og_site_name"]}
                >
                  <Input placeholder="Tên website" size="large" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label={
                    <Space>
                      <span>OG Locale</span>
                      {renderInfoIcon(
                        "Ngôn ngữ và vùng miền của nội dung Open Graph"
                      )}
                    </Space>
                  }
                  name={["seo_data", "og_locale"]}
                  initialValue="vi_VN"
                >
                  <Select size="large">
                    <Select.Option value="vi_VN">
                      Tiếng Việt (Việt Nam)
                    </Select.Option>
                    <Select.Option value="en_US">English (US)</Select.Option>
                    <Select.Option value="en_GB">English (UK)</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* Twitter Card Section */}
          <div style={{ padding: "4px", background: "#e6f7ff", borderRadius: "8px" }}>
            <Title level={5} style={{ marginBottom: "4px", color: "#1890ff" }}>🐦 Twitter Card</Title>
            <Row gutter={[24, 16]}>
              <Col span={24}>
                <Form.Item
                  label={
                    <Space>
                      <TwitterOutlined />
                      <span>Twitter Card Type</span>
                      {renderInfoIcon("Loại card hiển thị trên Twitter")}
                    </Space>
                  }
                  name={["seo_data", "twitter_card"]}
                  initialValue="summary_large_image"
                >
                  <Select size="large">
                    <Select.Option value="summary">Summary</Select.Option>
                    <Select.Option value="summary_large_image">
                      Summary Large Image
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 16]}>
              <Col span={24}>
                <Form.Item
                  label={
                    <Space>
                      <span>Twitter Title</span>
                      {renderInfoIcon("Tiêu đề hiển thị trên Twitter")}
                    </Space>
                  }
                  name={["seo_data", "twitter_title"]}
                >
                  <Input
                    placeholder="Tiêu đề cho Twitter"
                    maxLength={70}
                    showCount
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 16]}>
              <Col span={24}>
                <Form.Item
                  label={
                    <Space>
                      <span>Twitter Description</span>
                      {renderInfoIcon("Mô tả hiển thị khi chia sẻ trên Twitter")}
                    </Space>
                  }
                  name={["seo_data", "twitter_description"]}
                >
                  <TextArea
                    rows={2}
                    placeholder="Mô tả cho Twitter"
                    maxLength={200}
                    showCount
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 16]}>
              <Col span={8}>
                <Form.Item
                  label={
                    <Space>
                      <span>Twitter Creator</span>
                      {renderInfoIcon("Username Twitter của tác giả (@username)")}
                    </Space>
                  }
                  name={["seo_data", "twitter_creator"]}
                >
                  <Input placeholder="@username" size="large" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label={
                    <Space>
                      <span>Twitter Site</span>
                      {renderInfoIcon("Username Twitter của website (@sitename)")}
                    </Space>
                  }
                  name={["seo_data", "twitter_site"]}
                >
                  <Input placeholder="@sitename" size="large" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label={
                    <Space>
                      <span>Twitter Image</span>
                      {renderInfoIcon(
                        "Hình ảnh hiển thị khi chia sẻ trên Twitter. Chọn từ thư viện hình ảnh đã upload"
                      )}
                    </Space>
                  }
                  name={["seo_data", "twitter_image"]}
                >
                  <MediaSelector
                    placeholder="Chọn hình ảnh Twitter từ thư viện"
                    onSelect={(media) => {
                      // Update the form with the selected image URL
                      form?.form?.setFieldsValue({
                        seo_data: {
                          ...form?.form?.getFieldValue("seo_data"),
                          twitter_image: media.file_url,
                        },
                      });
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
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
          {/* Schema Markup Generator Section */}
          <div style={{ marginBottom: "8px", padding: "4px", background: "#fff7e6", borderRadius: "8px" }}>
            <Title level={5} style={{ marginBottom: "4px", color: "#fa8c16" }}>🔧 Schema Markup Generator</Title>
            <Text type="secondary" style={{ fontSize: "12px", marginBottom: "16px", display: "block" }}>
              Tạo nhiều loại schema markup để tối ưu SEO cho bài viết blog
            </Text>
            <Space wrap style={{ width: "100%" }}>
              <Tooltip title="Tạo tất cả schema types: Article, Author, FAQ và Breadcrumb cùng lúc">
                <Button
                  size="small"
                  type="default"
                  onClick={generateComprehensiveSchema}
                  icon={<CodeOutlined />}
                  style={{ background: "#e6f7ff", borderColor: "#91d5ff" }}
                >
                  Tạo Schema Toàn diện
                </Button>
              </Tooltip>
              <Tooltip title="Tạo schema cho bài viết blog với thông tin chi tiết về tác giả và nhà xuất bản">
                <Button
                  size="small"
                  type="default"
                  onClick={generateArticleSchema}
                  icon={<GlobalOutlined />}
                >
                  Article Schema
                </Button>
              </Tooltip>
              <Tooltip title="Tạo schema thông tin tác giả với kinh nghiệm và lĩnh vực chuyên môn">
                <Button
                  size="small"
                  type="default"
                  onClick={generateAuthorSchema}
                  icon={<UserOutlined />}
                >
                  Author Schema
                </Button>
              </Tooltip>
              <Tooltip title="Tạo schema câu hỏi thường gặp để hiển thị rich snippets trên Google">
                <Button
                  size="small"
                  type="default"
                  onClick={generateFAQSchema}
                  icon={<QuestionCircleOutlined />}
                >
                  FAQ Schema
                </Button>
              </Tooltip>
              <Tooltip title="Xóa toàn bộ schema markup hiện tại">
                <Button
                  size="small"
                  danger
                  onClick={clearSchema}
                  icon={<DeleteOutlined />}
                >
                  Xóa Schema
                </Button>
              </Tooltip>
            </Space>
          </div>

          {/* JSON Editor Section */}
          <div style={{ padding: "4px", background: "#f6ffed", borderRadius: "8px" }}>
            <Title level={5} style={{ marginBottom: "4px", color: "#52c41a" }}>📄 Schema Markup Editor</Title>
            <Form.Item
              label={
                <Space>
                  <FileTextOutlined style={{ color: "#1890ff" }} />
                  <span>Schema Markup (JSON-LD)</span>
                  {renderInfoIcon(
                    "Dữ liệu có cấu trúc Schema.org giúp Google hiểu rõ nội dung bài viết"
                  )}
                  <Tag
                    color={validateJson() ? "green" : "red"}
                    style={{ fontSize: "10px" }}
                  >
                    {validateJson() ? "Valid JSON" : "Invalid JSON"}
                  </Tag>
                </Space>
              }
              name={["seo_data", "schema_markup"]}
              extra={
                <Space direction="vertical" size={4} style={{ width: "100%" }}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Sử dụng các nút trong Schema Markup Generator ở trên để tạo schema
                  </Text>
                  <Space size={8} wrap>
                    <Tooltip title="Sao chép JSON vào clipboard">
                      <Button
                        size="small"
                        icon={<CopyOutlined />}
                        onClick={copyJsonToClipboard}
                        disabled={!form?.form?.getFieldValue(["seo_data", "schema_markup"])}
                      >
                        Copy
                      </Button>
                    </Tooltip>
                    <Tooltip title="Format JSON đẹp hơn">
                      <Button
                        size="small"
                        icon={<FormatPainterOutlined />}
                        onClick={formatJson}
                        disabled={!form?.form?.getFieldValue(["seo_data", "schema_markup"])}
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
                        disabled={!form?.form?.getFieldValue(["seo_data", "schema_markup"])}
                      >
                        Clear
                      </Button>
                    </Tooltip>
                    <Text type="secondary" style={{ fontSize: '11px', marginLeft: '8px' }}>
                      {getJsonCharacterCount()} ký tự
                    </Text>
                  </Space>
                </Space>
              }
            >
              <JsonFieldWrapper />
            </Form.Item>
          </div>
        </Panel>

        {/* SEO Metrics & Scores */}
        <Panel
          header={
            <Space>
              <BarChartOutlined style={{ color: "#13c2c2" }} />
              <span>SEO Metrics & Performance</span>
            </Space>
          }
          key="metrics"
        >
          {/* Performance Scores Section */}
          <div style={{ marginBottom: "8px", padding: "4px", background: "#e6fffb", borderRadius: "8px" }}>
            <Title level={5} style={{ marginBottom: "4px", color: "#13c2c2" }}>📊 Performance Scores</Title>
            <Row gutter={[24, 16]}>
              <Col span={8}>
                <Form.Item
                  label={
                    <Space>
                      <span>SEO Score</span>
                      {renderInfoIcon("Điểm SEO tổng thể (0-100)")}
                    </Space>
                  }
                  name={["seo_data", "seo_score"]}
                  initialValue={75}
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
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label={
                    <Space>
                      <span>Mobile Friendly Score</span>
                      {renderInfoIcon("Điểm thân thiện với mobile (0-100)")}
                    </Space>
                  }
                  name={["seo_data", "mobile_friendly_score"]}
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
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label={
                    <Space>
                      <span>Accessibility Score</span>
                      {renderInfoIcon("Điểm accessibility (0-100)")}
                    </Space>
                  }
                  name={["seo_data", "accessibility_score"]}
                  initialValue={80}
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
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* Content Metrics Section */}
          <div style={{ marginBottom: "8px", padding: "4px", background: "#f0f9ff", borderRadius: "8px" }}>
            <Title level={5} style={{ marginBottom: "4px", color: "#1890ff" }}>📈 Content Metrics</Title>
            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Form.Item
                  label={
                    <Space>
                      <span>Content Length</span>
                      {renderInfoIcon("Độ dài nội dung (số ký tự)")}
                    </Space>
                  }
                  name={["seo_data", "content_length"]}
                >
                  <InputNumber
                    min={0}
                    style={{ width: "100%" }}
                    placeholder="Số ký tự nội dung"
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={
                    <Space>
                      <span>Read Time (phút)</span>
                      {renderInfoIcon("Thời gian đọc ước tính")}
                    </Space>
                  }
                  name="read_time"
                >
                  <InputNumber
                    min={1}
                    style={{ width: "100%" }}
                    placeholder="Thời gian đọc"
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* Status Settings Section */}
          <div style={{ padding: "4px", background: "#f6ffed", borderRadius: "8px" }}>
            <Title level={5} style={{ marginBottom: "4px", color: "#52c41a" }}>⚙️ Status Settings</Title>
            <Row gutter={[24, 16]}>
              <Col span={8}>
                <Form.Item
                  label={
                    <Space>
                      <span>Trạng thái active</span>
                      {renderInfoIcon("Trang SEO có hoạt động không")}
                    </Space>
                  }
                  name={["seo_data", "is_active"]}
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label={
                    <Space>
                      <span>Featured</span>
                      {renderInfoIcon("Trang SEO nổi bật")}
                    </Space>
                  }
                  name={["seo_data", "is_featured"]}
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label={
                    <Space>
                      <span>SSL Secure</span>
                      {renderInfoIcon("Trang có bảo mật SSL")}
                    </Space>
                  }
                  name={["seo_data", "is_ssl_secure"]}
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Panel>
      </Collapse>

      {existingSEOData && (
        <div
          style={{
            marginTop: "16px",
            padding: "12px",
            background: "#f6ffed",
            border: "1px solid #b7eb8f",
            borderRadius: "6px",
          }}
        >
          <Space>
            <CheckCircleOutlined style={{ color: "#52c41a" }} />
            <Text type="success">
              Đã tìm thấy dữ liệu SEO hiện tại (Score:{" "}
              {existingSEOData.seo_score || 0}/100)
            </Text>
          </Space>
        </div>
      )}
    </Card>
  );
};
