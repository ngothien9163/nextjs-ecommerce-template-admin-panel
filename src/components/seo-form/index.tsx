import React from 'react';
import { Form, Input, Switch, InputNumber, Select, Upload, Row, Col, Card, Typography, Divider, Space, Button } from 'antd';
import { UploadOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title } = Typography;

interface SEOFormProps {
  form: any;
  isEdit?: boolean;
}

export const SEOForm: React.FC<SEOFormProps> = ({ form, isEdit = false }) => {
  const [ogType, setOgType] = React.useState('website');
  const [twitterCard, setTwitterCard] = React.useState('summary_large_image');

  const ogTypeOptions = [
    { label: 'Website', value: 'website' },
    { label: 'Article', value: 'article' },
    { label: 'Product', value: 'product' },
    { label: 'Book', value: 'book' },
    { label: 'Profile', value: 'profile' },
    { label: 'Music', value: 'music.song' },
    { label: 'Video', value: 'video.other' },
  ];

  const twitterCardOptions = [
    { label: 'Summary', value: 'summary' },
    { label: 'Summary Large Image', value: 'summary_large_image' },
    { label: 'App', value: 'app' },
    { label: 'Player', value: 'player' },
  ];

  const robotsOptions = [
    { label: 'Index, Follow', value: 'index,follow' },
    { label: 'Index, No Follow', value: 'index,nofollow' },
    { label: 'No Index, Follow', value: 'noindex,follow' },
    { label: 'No Index, No Follow', value: 'noindex,nofollow' },
    { label: 'Index, Follow, No Archive', value: 'index,follow,noarchive' },
    { label: 'Index, Follow, No Snippet', value: 'index,follow,nosnippet' },
  ];

  const languageOptions = [
    { label: 'Tiếng Việt', value: 'vi' },
    { label: 'English', value: 'en' },
    { label: '中文', value: 'zh' },
    { label: '日本語', value: 'ja' },
    { label: '한국어', value: 'ko' },
  ];

  const localeOptions = [
    { label: 'Tiếng Việt (Việt Nam)', value: 'vi_VN' },
    { label: 'English (US)', value: 'en_US' },
    { label: 'English (UK)', value: 'en_GB' },
    { label: '中文 (简体)', value: 'zh_CN' },
    { label: '日本語 (日本)', value: 'ja_JP' },
  ];

  return (
    <>
      {/* Thông tin SEO cơ bản */}
      <Card title="Thông tin SEO cơ bản" style={{ marginBottom: '24px' }}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Meta Title"
              name={['seo_data', 'page_title']}
              rules={[{ required: true, message: 'Vui lòng nhập Meta Title!' }]}
            >
              <Input placeholder="Tiêu đề trang cho SEO (50-60 ký tự)" maxLength={60} showCount />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Meta Description"
              name={['seo_data', 'meta_description']}
              rules={[{ required: true, message: 'Vui lòng nhập Meta Description!' }]}
            >
              <TextArea 
                rows={3} 
                placeholder="Mô tả meta cho SEO (120-160 ký tự)" 
                maxLength={160} 
                showCount 
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Meta Keywords"
              name={['seo_data', 'meta_keywords']}
            >
              <Select
                mode="tags"
                placeholder="Nhập từ khóa SEO"
                style={{ width: '100%' }}
                maxTagCount={10}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Canonical URL"
              name={['seo_data', 'canonical_url']}
            >
              <Input placeholder="https://example.com/product" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Ngôn ngữ"
              name={['seo_data', 'language']}
              initialValue="vi"
            >
              <Select options={languageOptions} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Character Encoding"
              name={['seo_data', 'charset']}
              initialValue="UTF-8"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Viewport"
              name={['seo_data', 'viewport']}
              initialValue="width=device-width, initial-scale=1"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Robots Directive"
              name={['seo_data', 'robots_directive']}
              initialValue="index,follow"
            >
              <Select options={robotsOptions} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Hreflang Tags"
              name={['seo_data', 'hreflang']}
            >
              <Input placeholder='[{"lang": "vi", "url": "https://example.com/vi"}]' />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* Open Graph */}
      <Card title="Open Graph (Social Media)" style={{ marginBottom: '24px' }}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="OG Title"
              name={['seo_data', 'og_title']}
            >
              <Input placeholder="Tiêu đề Open Graph" maxLength={60} showCount />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="OG Description"
              name={['seo_data', 'og_description']}
            >
              <TextArea rows={3} placeholder="Mô tả Open Graph" maxLength={200} showCount />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="OG Type"
              name={['seo_data', 'og_type']}
              initialValue="website"
            >
              <Select options={ogTypeOptions} onChange={setOgType} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="OG Site Name"
              name={['seo_data', 'og_site_name']}
            >
              <Input placeholder="Tên website" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="OG Locale"
              name={['seo_data', 'og_locale']}
              initialValue="vi_VN"
            >
              <Select options={localeOptions} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="OG Image"
              name={['seo_data', 'og_image']}
            >
              <Input placeholder="URL hình ảnh Open Graph" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="OG Audio"
              name={['seo_data', 'og_audio']}
            >
              <Input placeholder="URL audio file (nếu có)" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="OG Video"
              name={['seo_data', 'og_video']}
            >
              <Input placeholder="URL video file (nếu có)" />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* Twitter Card */}
      <Card title="Twitter Card" style={{ marginBottom: '24px' }}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Twitter Title"
              name={['seo_data', 'twitter_title']}
            >
              <Input placeholder="Tiêu đề Twitter" maxLength={60} showCount />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Twitter Description"
              name={['seo_data', 'twitter_description']}
            >
              <TextArea rows={3} placeholder="Mô tả Twitter" maxLength={200} showCount />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Twitter Card Type"
              name={['seo_data', 'twitter_card']}
              initialValue="summary_large_image"
            >
              <Select options={twitterCardOptions} onChange={setTwitterCard} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Twitter Creator"
              name={['seo_data', 'twitter_creator']}
            >
              <Input placeholder="@username" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Twitter Site"
              name={['seo_data', 'twitter_site']}
            >
              <Input placeholder="@sitename" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Twitter Image"
              name={['seo_data', 'twitter_image']}
            >
              <Input placeholder="URL hình ảnh Twitter" />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* Schema.org Structured Data */}
      <Card title="Schema.org Structured Data" style={{ marginBottom: '24px' }}>
        <Form.Item
          label="Schema Markup (JSON-LD)"
          name={['seo_data', 'schema_markup']}
          extra="Nhập dữ liệu có cấu trúc Schema.org dạng JSON-LD"
        >
          <TextArea 
            rows={8} 
            placeholder={`{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Tên sản phẩm",
  "description": "Mô tả sản phẩm",
  "brand": "Thương hiệu",
  "offers": {
    "@type": "Offer",
    "price": "1000000",
    "priceCurrency": "VND"
  }
}`}
          />
        </Form.Item>
      </Card>

      {/* Performance & Metrics */}
      <Card title="Performance & Metrics" style={{ marginBottom: '24px' }}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="SEO Score"
              name={['seo_data', 'seo_score']}
            >
              <InputNumber 
                min={0} 
                max={100} 
                placeholder="0-100"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Keyword Difficulty"
              name={['seo_data', 'keyword_difficulty']}
            >
              <InputNumber 
                min={0} 
                max={100} 
                placeholder="0-100"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Search Volume"
              name={['seo_data', 'search_volume']}
            >
              <InputNumber 
                min={0} 
                placeholder="Lượt tìm kiếm/tháng"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Page Load Time (s)"
              name={['seo_data', 'page_load_time']}
            >
              <InputNumber 
                min={0} 
                step={0.1}
                placeholder="Thời gian tải (giây)"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Mobile Friendly Score"
              name={['seo_data', 'mobile_friendly_score']}
            >
              <InputNumber 
                min={0} 
                max={100} 
                placeholder="0-100"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Accessibility Score"
              name={['seo_data', 'accessibility_score']}
            >
              <InputNumber 
                min={0} 
                max={100} 
                placeholder="0-100"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Core Web Vitals Score"
              name={['seo_data', 'core_web_vitals_score']}
            >
              <InputNumber 
                min={0} 
                max={100} 
                placeholder="0-100"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Content Length (từ)"
              name={['seo_data', 'content_length']}
            >
              <InputNumber 
                min={0} 
                placeholder="Số từ"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Image Optimization Score"
              name={['seo_data', 'image_optimization_score']}
            >
              <InputNumber 
                min={0} 
                max={100} 
                placeholder="0-100"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* Social & Content Metrics */}
      <Card title="Social & Content Metrics" style={{ marginBottom: '24px' }}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Social Shares"
              name={['seo_data', 'social_shares']}
            >
              <InputNumber 
                min={0} 
                placeholder="Số lượt chia sẻ"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Social Engagement (%)"
              name={['seo_data', 'social_engagement']}
            >
              <InputNumber 
                min={0} 
                max={100}
                step={0.01}
                placeholder="Tỷ lệ tương tác"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Social CTR (%)"
              name={['seo_data', 'social_click_through_rate']}
            >
              <InputNumber 
                min={0} 
                max={100}
                step={0.01}
                placeholder="Tỷ lệ click"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Content Readability Score"
              name={['seo_data', 'content_readability_score']}
            >
              <InputNumber 
                min={0} 
                max={100} 
                placeholder="0-100"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Content Freshness Score"
              name={['seo_data', 'content_freshness_score']}
            >
              <InputNumber 
                min={0} 
                max={100} 
                placeholder="0-100"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Internal Links Count"
              name={['seo_data', 'internal_links_count']}
            >
              <InputNumber 
                min={0} 
                placeholder="Số internal links"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="External Links Count"
              name={['seo_data', 'external_links_count']}
            >
              <InputNumber 
                min={0} 
                placeholder="Số external links"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Broken Links Count"
              name={['seo_data', 'broken_links_count']}
            >
              <InputNumber 
                min={0} 
                placeholder="Số broken links"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* Advanced SEO Metrics */}
      <Card title="Advanced SEO Metrics (2025+)" style={{ marginBottom: '24px' }}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Core Web Vitals (JSON)"
              name={['seo_data', 'core_web_vitals']}
              extra="LCP, FID, CLS, INP, TTFB metrics"
            >
              <TextArea 
                rows={4} 
                placeholder={`{
  "lcp": 2.5,
  "fid": 100,
  "cls": 0.1,
  "inp": 200,
  "ttfb": 800
}`}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="AI & ML Metrics (JSON)"
              name={['seo_data', 'ai_ml_metrics']}
              extra="AI relevance score, ML ranking factors"
            >
              <TextArea 
                rows={4} 
                placeholder={`{
  "ai_relevance_score": 85,
  "ml_ranking_factors": ["content_quality", "user_engagement"]
}`}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="E-E-A-T Metrics (JSON)"
              name={['seo_data', 'eeat_metrics']}
              extra="Experience, Expertise, Authoritativeness, Trust"
            >
              <TextArea 
                rows={4} 
                placeholder={`{
  "experience": 90,
  "expertise": 85,
  "authoritativeness": 80,
  "trust": 95
}`}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Voice & Visual Search (JSON)"
              name={['seo_data', 'voice_visual_metrics']}
              extra="Voice search optimization, visual search data"
            >
              <TextArea 
                rows={4} 
                placeholder={`{
  "voice_optimization": 75,
  "visual_search": 80,
  "semantic_keywords": ["từ khóa ngữ nghĩa"]
}`}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Privacy & Compliance (JSON)"
              name={['seo_data', 'privacy_compliance']}
              extra="GDPR, CCPA, privacy signals"
            >
              <TextArea 
                rows={4} 
                placeholder={`{
  "gdpr_compliant": true,
  "ccpa_compliant": false,
  "privacy_signals": ["https", "privacy_policy"]
}`}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Future Metrics (JSON)"
              name={['seo_data', 'future_metrics']}
              extra="Quantum SEO, Neural networks, BCI, Spatial computing"
            >
              <TextArea 
                rows={4} 
                placeholder={`{
  "quantum_seo": 60,
  "neural_networks": 70,
  "bci_optimization": 50,
  "spatial_computing": 65
}`}
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* SEO Status */}
      <Card title="Trạng thái SEO" style={{ marginBottom: '24px' }}>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              label="Được index"
              name={['seo_data', 'is_indexed']}
              valuePropName="checked"
              initialValue={true}
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="SSL Secure"
              name={['seo_data', 'is_ssl_secure']}
              valuePropName="checked"
              initialValue={true}
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Featured SEO"
              name={['seo_data', 'is_featured']}
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Active"
              name={['seo_data', 'is_active']}
              valuePropName="checked"
              initialValue={true}
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>
      </Card>
    </>
  );
};
