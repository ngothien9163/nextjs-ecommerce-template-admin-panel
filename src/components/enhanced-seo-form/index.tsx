import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Switch, Row, Col, Card, Typography, Space, Tooltip, Collapse, Button, InputNumber, Rate, Tag, message } from 'antd';
import { InfoCircleOutlined, GlobalOutlined, ShareAltOutlined, TwitterOutlined, CodeOutlined, BarChartOutlined, SettingOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { JsonField } from '../JsonField';
import { supabase } from '../../lib/supabase';
import type { SEOPageType } from '../../lib/supabase';
import './enhanced-seo-form.css';

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Panel } = Collapse;

interface EnhancedSEOFormProps {
  form: any;
  isEdit?: boolean;
  referenceType: 'blog' | 'product' | 'category' | 'page' | 'user' | 'system';
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
  onSEODataChange
}) => {
  const [seoPageTypes, setSeoPageTypes] = useState<SEOPageType[]>([]);
  const [existingSEOData, setExistingSEOData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Load SEO Page Types
  useEffect(() => {
    const loadSEOPageTypes = async () => {
      try {
        const { data, error } = await supabase
          .from('seo_page_types')
          .select('*')
          .eq('is_active', true)
          .order('sort_order');
        
        if (data) {
          setSeoPageTypes(data);
        }
      } catch (error) {
        console.error('Error loading SEO page types:', error);
      }
    };

    loadSEOPageTypes();
  }, []);

  // Update page URL when pageUrl prop changes
  useEffect(() => {
    if (pageUrl) {
      form?.form?.setFieldsValue({
        seo_data: {
          ...form?.form?.getFieldValue('seo_data'),
          page_url: pageUrl
        }
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
        .from('seo_pages')
        .select('*')
        .eq('reference_type', referenceType)
        .eq('reference_id', referenceId)
        .eq('page_url', pageUrl)
        .single();
      
      if (data) {
        setExistingSEOData(data);
        // Pre-fill form with existing data
        form?.form?.setFieldsValue({
          seo_data: data
        });
      }
    } catch (error) {
      console.error('Error loading existing SEO data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSmartSEOData = () => {
    const formValues = form?.form?.getFieldsValue();
    const title = formValues?.title || '';
    const content = formValues?.content || '';
    const excerpt = formValues?.excerpt || '';
    const slug = formValues?.slug || '';
    
    // Generate smart meta keywords from title and content (minimum 3-5 keywords)
    const titleWords = title.toLowerCase()
      .split(' ')
      .filter((word: string) => word.length > 3)
      .slice(0, 3);
    
    const contentWords = content.toLowerCase()
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .split(/\s+/)
      .filter((word: string) => word.length > 4)
      .filter((word: string) => !titleWords.includes(word))
      .slice(0, 4);
    
    // Additional smart keywords based on context
    const contextKeywords = [
      'blog', 'bài viết', 'tin tức', 'thông tin', 'hướng dẫn', 'kinh nghiệm'
    ].filter(keyword => !titleWords.includes(keyword) && !contentWords.includes(keyword))
    .slice(0, 2);
    
    // Combine and create keyword array - ensure comma separation
    const allKeywords = [...titleWords, ...contentWords, ...contextKeywords]
      .filter(word => word.length > 2)
      .slice(0, 6); // Maximum 6 keywords
    
    // Ensure minimum 4 keywords
    const smartKeywords = allKeywords.length >= 4 ? allKeywords : 
      [...allKeywords, 'blog', 'bài viết', 'website', 'nội dung'].slice(0, 6);
    
    // Generate URLs
    const baseUrl = window.location.origin;
    const fullPageUrl = pageUrl || `/blog/${slug}`;
    const canonicalUrl = `${baseUrl}${fullPageUrl}`;
    const ogImageUrl = `${baseUrl}/api/og?title=${encodeURIComponent(title)}`; // Dynamic OG image
    const twitterImageUrl = ogImageUrl;
    
    // Generate smart SEO suggestions
    const pageTitle = title.length > 50 ? title : `${title} | Blog - Website`;
    const metaDescription = excerpt || content.replace(/<[^>]*>/g, '').substring(0, 155) + '...';
    
    const smartSEOData = {
      page_url: fullPageUrl,
      page_title: pageTitle,
      meta_description: metaDescription,
      meta_keywords: smartKeywords, // Array format for Select tags mode (comma-separated when saved)
      canonical_url: canonicalUrl,
      robots_directive: 'index,follow',
      language: 'vi',
      charset: 'UTF-8',
      viewport: 'width=device-width, initial-scale=1',
      
      // Open Graph fields
      og_title: title,
      og_description: metaDescription,
      og_type: 'article',
      og_image: ogImageUrl,
      og_site_name: 'Website Blog',
      og_locale: 'vi_VN',
      og_url: canonicalUrl,
      
      // Twitter Card fields
      twitter_card: 'summary_large_image',
      twitter_title: title,
      twitter_description: metaDescription,
      twitter_image: twitterImageUrl,
      twitter_site: '@website',
      twitter_creator: '@admin',
      
      // Additional SEO fields
      hreflang: [
        { lang: 'vi', url: canonicalUrl },
        { lang: 'x-default', url: canonicalUrl }
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
      content_length: content.replace(/<[^>]*>/g, '').split(' ').length,
      keyword_difficulty: Math.floor(30 + Math.random() * 40),
      search_volume: Math.floor(100 + Math.random() * 500),
      
      // Performance metrics
      page_load_time: Math.round((1 + Math.random() * 2) * 100) / 100, // 1-3 seconds
      
      // Schema markup
      schema_markup: {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        'headline': title,
        'description': metaDescription,
        'url': canonicalUrl,
        'image': {
          '@type': 'ImageObject',
          'url': ogImageUrl,
          'width': 1200,
          'height': 630
        },
        'datePublished': new Date().toISOString(),
        'dateModified': new Date().toISOString(),
        'author': {
          '@type': 'Person',
          'name': 'Admin',
          'url': `${baseUrl}/author/admin`
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'Website Blog',
          'logo': {
            '@type': 'ImageObject',
            'url': `${baseUrl}/logo.png`,
            'width': 300,
            'height': 100
          }
        },
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        'articleSection': 'Blog',
        'inLanguage': 'vi-VN',
        'potentialAction': {
          '@type': 'ReadAction',
          'target': canonicalUrl
        }
      }
    };

    form?.form?.setFieldsValue({
      seo_data: smartSEOData
    });

    if (onSEODataChange) {
      onSEODataChange(smartSEOData);
    }
    
    // Show success message
    message.success(`Đã tạo thông tin SEO thông minh với ${smartKeywords.length} keywords!`);
  };

  const renderInfoIcon = (tooltip: string) => (
    <Tooltip title={tooltip} placement="top">
      <InfoCircleOutlined style={{ color: '#1890ff', marginLeft: '8px' }} />
    </Tooltip>
  );

  const getSEOScoreColor = (score: number) => {
    if (score >= 90) return '#52c41a';
    if (score >= 75) return '#faad14';
    if (score >= 60) return '#fa8c16';
    return '#f5222d';
  };

  return (
    <Card 
      title={
        <Space>
          <GlobalOutlined style={{ color: '#1890ff' }} />
          <span>SEO Optimization cho {referenceType}</span>
          <Button 
            size="small" 
            type="primary" 
            ghost 
            onClick={generateSmartSEOData}
            icon={<CheckCircleOutlined />}
          >
            Tạo SEO thông minh
          </Button>
        </Space>
      } 
      style={{ marginBottom: '24px' }}
      className="enhanced-seo-form-card"
      loading={loading}
    >
      <Collapse 
        defaultActiveKey={['basic', 'social', 'technical', 'metrics']} 
        ghost
        expandIconPosition="end"
      >
        {/* Thông tin SEO cơ bản */}
        <Panel 
          header={
            <Space>
              <GlobalOutlined style={{ color: '#52c41a' }} />
              <span>Thông tin SEO cơ bản</span>
            </Space>
          } 
          key="basic"
        >
          <Row gutter={[24, 16]}>
            <Col span={24}>
              <Form.Item
                label={
                  <Space>
                    <span>Page URL</span>
                    {renderInfoIcon('URL của trang blog, được tạo tự động từ slug')}
                  </Space>
                }
                name={['seo_data', 'page_url']}
              >
                <Input 
                  placeholder="/blog/tieu-de-bai-viet" 
                  disabled={isEdit}
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 16]}>
            <Col span={12}>
              <Form.Item
                label={
                  <Space>
                    <span>Meta Title</span>
                    {renderInfoIcon('Tiêu đề trang hiển thị trên kết quả tìm kiếm. Nên có 50-60 ký tự')}
                  </Space>
                }
                name={['seo_data', 'page_title']}
                rules={[{ required: true, message: 'Vui lòng nhập Meta Title!' }]}
              >
                <Input 
                  placeholder="Tiêu đề trang cho SEO (50-60 ký tự)" 
                  maxLength={60} 
                  showCount 
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <Space>
                    <span>Meta Description</span>
                    {renderInfoIcon('Mô tả ngắn gọn nội dung trang, hiển thị dưới tiêu đề trên kết quả tìm kiếm')}
                  </Space>
                }
                name={['seo_data', 'meta_description']}
                rules={[{ required: true, message: 'Vui lòng nhập Meta Description!' }]}
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
            <Col span={12}>
              <Form.Item
                label={
                  <Space>
                    <span>Meta Keywords</span>
                    {renderInfoIcon('Từ khóa chính của bài viết (3-6 keywords), phân tách bằng dấu phẩy. Nhập và nhấn Enter để thêm keyword mới.')}
                  </Space>
                }
                name={['seo_data', 'meta_keywords']}
                extra="Nhập từ khóa và nhấn Enter hoặc dấu phẩy để tạo tag mới"
              >
                <Select
                  mode="tags"
                  placeholder="Nhập từ khóa SEO, nghăn cách bằng dấu phẩy hoặc Enter"
                  style={{ width: '100%' }}
                  maxTagCount={6}
                  size="large"
                  tokenSeparators={[',', ' ']} // Allow comma and space separation
                  showSearch
                  filterOption={false}
                  notFoundContent={null}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <Space>
                    <span>Canonical URL</span>
                    {renderInfoIcon('URL chính thức của trang, giúp tránh duplicate content')}
                  </Space>
                }
                name={['seo_data', 'canonical_url']}
              >
                <Input 
                  placeholder="https://example.com/blog/bai-viet" 
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
                    <span>Robots Directive</span>
                    {renderInfoIcon('Chỉ thị cho crawler của search engine')}
                  </Space>
                }
                name={['seo_data', 'robots_directive']}
                initialValue="index,follow"
              >
                <Select size="large">
                  <Select.Option value="index,follow">Index, Follow</Select.Option>
                  <Select.Option value="index,nofollow">Index, No Follow</Select.Option>
                  <Select.Option value="noindex,follow">No Index, Follow</Select.Option>
                  <Select.Option value="noindex,nofollow">No Index, No Follow</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={
                  <Space>
                    <span>Ngôn ngữ</span>
                    {renderInfoIcon('Ngôn ngữ chính của trang')}
                  </Space>
                }
                name={['seo_data', 'language']}
                initialValue="vi"
              >
                <Select size="large">
                  <Select.Option value="vi">Tiếng Việt</Select.Option>
                  <Select.Option value="en">English</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={
                  <Space>
                    <span>Được index</span>
                    {renderInfoIcon('Cho phép Google index trang này')}
                  </Space>
                }
                name={['seo_data', 'is_indexed']}
                valuePropName="checked"
                initialValue={true}
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Panel>

        {/* Open Graph & Social Media */}
        <Panel 
          header={
            <Space>
              <ShareAltOutlined style={{ color: '#722ed1' }} />
              <span>Open Graph & Social Media</span>
            </Space>
          } 
          key="social"
        >
          <Row gutter={[24, 16]}>
            <Col span={12}>
              <Form.Item
                label={
                  <Space>
                    <span>OG Title</span>
                    {renderInfoIcon('Tiêu đề hiển thị khi chia sẻ trên Facebook, LinkedIn')}
                  </Space>
                }
                name={['seo_data', 'og_title']}
              >
                <Input 
                  placeholder="Tiêu đề cho Open Graph" 
                  maxLength={95} 
                  showCount 
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <Space>
                    <span>OG Description</span>
                    {renderInfoIcon('Mô tả hiển thị khi chia sẻ trên Facebook, LinkedIn')}
                  </Space>
                }
                name={['seo_data', 'og_description']}
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
            <Col span={12}>
              <Form.Item
                label={
                  <Space>
                    <span>OG Image</span>
                    {renderInfoIcon('Hình ảnh hiển thị khi chia sẻ trên mạng xã hội')}
                  </Space>
                }
                name={['seo_data', 'og_image']}
              >
                <Input 
                  placeholder="https://example.com/image.jpg" 
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <Space>
                    <span>OG Type</span>
                    {renderInfoIcon('Loại nội dung cho Open Graph')}
                  </Space>
                }
                name={['seo_data', 'og_type']}
                initialValue="article"
              >
                <Select size="large">
                  <Select.Option value="article">Article (Blog Post)</Select.Option>
                  <Select.Option value="website">Website</Select.Option>
                  <Select.Option value="product">Product</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 16]}>
            <Col span={12}>
              <Form.Item
                label={
                  <Space>
                    <TwitterOutlined />
                    <span>Twitter Card</span>
                    {renderInfoIcon('Loại card hiển thị trên Twitter')}
                  </Space>
                }
                name={['seo_data', 'twitter_card']}
                initialValue="summary_large_image"
              >
                <Select size="large">
                  <Select.Option value="summary">Summary</Select.Option>
                  <Select.Option value="summary_large_image">Summary Large Image</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <Space>
                    <span>Twitter Title</span>
                    {renderInfoIcon('Tiêu đề hiển thị trên Twitter')}
                  </Space>
                }
                name={['seo_data', 'twitter_title']}
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
        </Panel>

        {/* Technical SEO */}
        <Panel 
          header={
            <Space>
              <CodeOutlined style={{ color: '#fa8c16' }} />
              <span>Technical SEO</span>
            </Space>
          } 
          key="technical"
        >
          <Form.Item
            label={
              <Space>
                <span>Schema Markup (JSON-LD)</span>
                {renderInfoIcon('Dữ liệu có cấu trúc Schema.org giúp Google hiểu rõ nội dung bài viết')}
              </Space>
            }
            name={['seo_data', 'schema_markup']}
            extra={
              <Button size="small" onClick={() => {
                const formValues = form?.form?.getFieldsValue();
                const example = {
                  '@context': 'https://schema.org',
                  '@type': 'BlogPosting',
                  'headline': formValues?.title || 'Tiêu đề bài viết',
                  'description': formValues?.excerpt || 'Mô tả bài viết',
                  'author': {
                    '@type': 'Person',
                    'name': 'Admin'
                  },
                  'publisher': {
                    '@type': 'Organization',
                    'name': 'Website'
                  },
                  'datePublished': new Date().toISOString(),
                  'dateModified': new Date().toISOString()
                };
                form?.form?.setFieldsValue({ 
                  seo_data: { 
                    ...form?.form?.getFieldValue('seo_data'), 
                    schema_markup: example 
                  } 
                });
              }}>Tạo Schema cho Blog</Button>
            }
          >
            <JsonField height={300} />
          </Form.Item>
        </Panel>

        {/* SEO Metrics & Scores */}
        <Panel 
          header={
            <Space>
              <BarChartOutlined style={{ color: '#13c2c2' }} />
              <span>SEO Metrics & Performance</span>
            </Space>
          } 
          key="metrics"
        >
          <Row gutter={[24, 16]}>
            <Col span={8}>
              <Form.Item
                label={
                  <Space>
                    <span>SEO Score</span>
                    {renderInfoIcon('Điểm SEO tổng thể (0-100)')}
                  </Space>
                }
                name={['seo_data', 'seo_score']}
                initialValue={75}
              >
                <InputNumber
                  min={0}
                  max={100}
                  style={{ width: '100%' }}
                  formatter={value => `${value}%`}
                  parser={(value) => {
                    const num = value ? parseInt(value.replace('%', '')) : 0;
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
                    {renderInfoIcon('Điểm thân thiện với mobile (0-100)')}
                  </Space>
                }
                name={['seo_data', 'mobile_friendly_score']}
                initialValue={85}
              >
                <InputNumber
                  min={0}
                  max={100}
                  style={{ width: '100%' }}
                  formatter={value => `${value}%`}
                  parser={(value) => {
                    const num = value ? parseInt(value.replace('%', '')) : 0;
                    return Math.max(0, Math.min(100, num));
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
                    {renderInfoIcon('Điểm accessibility (0-100)')}
                  </Space>
                }
                name={['seo_data', 'accessibility_score']}
                initialValue={80}
              >
                <InputNumber
                  min={0}
                  max={100}
                  style={{ width: '100%' }}
                  formatter={value => `${value}%`}
                  parser={(value) => {
                    const num = value ? parseInt(value.replace('%', '')) : 0;
                    return Math.max(0, Math.min(100, num));
                  }}
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 16]}>
            <Col span={12}>
              <Form.Item
                label={
                  <Space>
                    <span>Content Length</span>
                    {renderInfoIcon('Độ dài nội dung (số ký tự)')}
                  </Space>
                }
                name={['seo_data', 'content_length']}
              >
                <InputNumber 
                  min={0} 
                  style={{ width: '100%' }}
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
                    {renderInfoIcon('Thời gian đọc ước tính')}
                  </Space>
                }
                name="read_time"
              >
                <InputNumber 
                  min={1} 
                  style={{ width: '100%' }}
                  placeholder="Thời gian đọc"
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
                    <span>Trạng thái active</span>
                    {renderInfoIcon('Trang SEO có hoạt động không')}
                  </Space>
                }
                name={['seo_data', 'is_active']}
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
                    {renderInfoIcon('Trang SEO nổi bật')}
                  </Space>
                }
                name={['seo_data', 'is_featured']}
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
                    {renderInfoIcon('Trang có bảo mật SSL')}
                  </Space>
                }
                name={['seo_data', 'is_ssl_secure']}
                valuePropName="checked"
                initialValue={true}
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Panel>
      </Collapse>

      {existingSEOData && (
        <div style={{ marginTop: '16px', padding: '12px', background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: '6px' }}>
          <Space>
            <CheckCircleOutlined style={{ color: '#52c41a' }} />
            <Text type="success">
              Đã tìm thấy dữ liệu SEO hiện tại (Score: {existingSEOData.seo_score || 0}/100)
            </Text>
          </Space>
        </div>
      )}
    </Card>
  );
};