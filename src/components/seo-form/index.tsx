import React from 'react';
import { Form, Input, Switch, InputNumber, Select, Upload, Row, Col, Card, Typography, Divider, Space, Button, Collapse, Tooltip } from 'antd';
import { JsonField } from '../JsonField';
import { UploadOutlined, PlusOutlined, MinusCircleOutlined, InfoCircleOutlined, GlobalOutlined, ShareAltOutlined, TwitterOutlined, CodeOutlined, BarChartOutlined, TrophyOutlined, SettingOutlined } from '@ant-design/icons';
import './seo-form.css';

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Panel } = Collapse;

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

  const renderInfoIcon = (tooltip: string) => (
    <Tooltip title={tooltip} placement="top">
      <InfoCircleOutlined style={{ color: '#1890ff', marginLeft: '8px' }} />
    </Tooltip>
  );

  return (
    <Card 
      title={
        <Space>
          <GlobalOutlined style={{ color: '#1890ff' }} />
          <span>Thông tin SEO</span>
          <Tooltip title="Tối ưu hóa công cụ tìm kiếm (SEO) giúp trang web của bạn dễ dàng được tìm thấy trên Google và các công cụ tìm kiếm khác">
            <InfoCircleOutlined style={{ color: '#1890ff' }} />
          </Tooltip>
        </Space>
      } 
      style={{ marginBottom: '24px' }}
      className="seo-form-card"
    >
      <Collapse 
        defaultActiveKey={['basic', 'social', 'advanced']} 
        ghost
        expandIconPosition="end"
        className="seo-collapse"
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
          className="seo-panel"
        >
          <Row gutter={[24, 16]}>
            <Col span={12}>
              <Form.Item
                label={
                  <Space>
                    <span>Meta Title</span>
                    {renderInfoIcon('Tiêu đề trang hiển thị trên kết quả tìm kiếm. Nên có 50-60 ký tự và chứa từ khóa chính')}
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
                    {renderInfoIcon('Mô tả ngắn gọn nội dung trang, hiển thị dưới tiêu đề trên kết quả tìm kiếm. Nên có 120-160 ký tự')}
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
                    {renderInfoIcon('Từ khóa chính của trang. Mặc dù Google không sử dụng trực tiếp, nhưng vẫn hữu ích cho các công cụ tìm kiếm khác')}
                  </Space>
                }
                name={['seo_data', 'meta_keywords']}
              >
                <Select
                  mode="tags"
                  placeholder="Nhập từ khóa SEO"
                  style={{ width: '100%' }}
                  maxTagCount={10}
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <Space>
                    <span>Canonical URL</span>
                    {renderInfoIcon('URL chính thức của trang, giúp tránh duplicate content khi có nhiều URL trỏ đến cùng nội dung')}
                  </Space>
                }
                name={['seo_data', 'canonical_url']}
              >
                <Input 
                  placeholder="https://example.com/product" 
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
                    <span>Ngôn ngữ</span>
                    {renderInfoIcon('Ngôn ngữ chính của trang, giúp Google hiểu và index đúng ngôn ngữ')}
                  </Space>
                }
                name={['seo_data', 'language']}
                initialValue="vi"
              >
                <Select options={languageOptions} size="large" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={
                  <Space>
                    <span>Character Encoding</span>
                    {renderInfoIcon('Bộ mã ký tự của trang, thường là UTF-8 để hỗ trợ đa ngôn ngữ')}
                  </Space>
                }
                name={['seo_data', 'charset']}
                initialValue="UTF-8"
              >
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={
                  <Space>
                    <span>Viewport</span>
                    {renderInfoIcon('Cài đặt viewport cho responsive design, giúp trang hiển thị tốt trên mobile')}
                  </Space>
                }
                name={['seo_data', 'viewport']}
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
                    {renderInfoIcon('Chỉ thị cho các bot tìm kiếm về cách index và follow links trên trang')}
                  </Space>
                }
                name={['seo_data', 'robots_directive']}
                initialValue="index,follow"
              >
                <Select options={robotsOptions} size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <Space>
                    <span>Hreflang Tags (JSON)</span>
                    {renderInfoIcon('Thẻ hreflang cho đa ngôn ngữ, giúp Google hiểu mối quan hệ giữa các phiên bản ngôn ngữ khác nhau')}
                  </Space>
                }
                name={['seo_data', 'hreflang']}
                extra={
                  <Button size="small" onClick={() => {
                    const canonical = form?.form?.getFieldValue(['seo_data','canonical_url']) || 'https://example.com/product';
                    const base = canonical.replace(/\/$/, '');
                    const example = [
                      { lang: 'vi', url: `${base}/vi` },
                      { lang: 'en', url: `${base}/en` },
                    ];
                    form?.form?.setFieldsValue({ seo_data: { hreflang: example } });
                  }}>Tạo dữ liệu thông minh</Button>
                }
              >
                <JsonField height={200} />
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
          className="seo-panel"
        >
          <Row gutter={[24, 16]}>
            <Col span={12}>
              <Form.Item
                label={
                  <Space>
                    <span>OG Title</span>
                    {renderInfoIcon('Tiêu đề hiển thị khi chia sẻ trên Facebook, LinkedIn và các mạng xã hội khác')}
                  </Space>
                }
                name={['seo_data', 'og_title']}
              >
                <Input 
                  placeholder="Tiêu đề Open Graph" 
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
                    <span>OG Description</span>
                    {renderInfoIcon('Mô tả hiển thị khi chia sẻ trên mạng xã hội, nên có 200 ký tự để tối ưu hiển thị')}
                  </Space>
                }
                name={['seo_data', 'og_description']}
              >
                <TextArea 
                  rows={3} 
                  placeholder="Mô tả Open Graph" 
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
                    <span>OG Type</span>
                    {renderInfoIcon('Loại nội dung Open Graph, giúp mạng xã hội hiểu và hiển thị đúng định dạng')}
                  </Space>
                }
                name={['seo_data', 'og_type']}
                initialValue="website"
              >
                <Select options={ogTypeOptions} onChange={setOgType} size="large" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={
                  <Space>
                    <span>OG Site Name</span>
                    {renderInfoIcon('Tên website, hiển thị bên dưới tiêu đề khi chia sẻ trên mạng xã hội')}
                  </Space>
                }
                name={['seo_data', 'og_site_name']}
              >
                <Input placeholder="Tên website" size="large" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={
                  <Space>
                    <span>OG Locale</span>
                    {renderInfoIcon('Ngôn ngữ và vùng miền của nội dung Open Graph')}
                  </Space>
                }
                name={['seo_data', 'og_locale']}
                initialValue="vi_VN"
              >
                <Select options={localeOptions} size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 16]}>
            <Col span={12}>
              <Form.Item
                label={
                  <Space>
                    <span>OG Image</span>
                    {renderInfoIcon('Hình ảnh hiển thị khi chia sẻ trên mạng xã hội. Nên có kích thước 1200x630px')}
                  </Space>
                }
                name={['seo_data', 'og_image']}
              >
                <Input 
                  placeholder="URL hình ảnh Open Graph" 
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <Space>
                    <span>OG Audio</span>
                    {renderInfoIcon('File audio liên quan đến nội dung (nếu có)')}
                  </Space>
                }
                name={['seo_data', 'og_audio']}
              >
                <Input 
                  placeholder="URL audio file (nếu có)" 
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
                    <span>OG Video</span>
                    {renderInfoIcon('File video liên quan đến nội dung (nếu có)')}
                  </Space>
                }
                name={['seo_data', 'og_video']}
              >
                <Input 
                  placeholder="URL video file (nếu có)" 
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>
        </Panel>

        {/* Twitter Card */}
        <Panel 
          header={
            <Space>
              <TwitterOutlined style={{ color: '#1da1f2' }} />
              <span>Twitter Card</span>
            </Space>
          } 
          key="twitter"
          className="seo-panel"
        >
          <Row gutter={[24, 16]}>
            <Col span={12}>
              <Form.Item
                label={
                  <Space>
                    <span>Twitter Title</span>
                    {renderInfoIcon('Tiêu đề hiển thị khi chia sẻ trên Twitter. Nên khác với OG Title để tối ưu cho từng nền tảng')}
                  </Space>
                }
                name={['seo_data', 'twitter_title']}
              >
                <Input 
                  placeholder="Tiêu đề Twitter" 
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
                    <span>Twitter Description</span>
                    {renderInfoIcon('Mô tả hiển thị khi chia sẻ trên Twitter, tối ưu cho giới hạn ký tự của Twitter')}
                  </Space>
                }
                name={['seo_data', 'twitter_description']}
              >
                <TextArea 
                  rows={3} 
                  placeholder="Mô tả Twitter" 
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
                    <span>Twitter Card Type</span>
                    {renderInfoIcon('Loại Twitter Card, ảnh hưởng đến cách nội dung hiển thị trên Twitter')}
                  </Space>
                }
                name={['seo_data', 'twitter_card']}
                initialValue="summary_large_image"
              >
                <Select options={twitterCardOptions} onChange={setTwitterCard} size="large" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={
                  <Space>
                    <span>Twitter Creator</span>
                    {renderInfoIcon('Username Twitter của tác giả nội dung (@username)')}
                  </Space>
                }
                name={['seo_data', 'twitter_creator']}
              >
                <Input placeholder="@username" size="large" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={
                  <Space>
                    <span>Twitter Site</span>
                    {renderInfoIcon('Username Twitter của website (@sitename)')}
                  </Space>
                }
                name={['seo_data', 'twitter_site']}
              >
                <Input placeholder="@sitename" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 16]}>
            <Col span={12}>
              <Form.Item
                label={
                  <Space>
                    <span>Twitter Image</span>
                    {renderInfoIcon('Hình ảnh hiển thị khi chia sẻ trên Twitter. Nên có kích thước 1200x600px')}
                  </Space>
                }
                name={['seo_data', 'twitter_image']}
              >
                <Input 
                  placeholder="URL hình ảnh Twitter" 
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>
        </Panel>

        {/* Schema.org & Technical SEO */}
        <Panel 
          header={
            <Space>
              <CodeOutlined style={{ color: '#fa8c16' }} />
              <span>Schema.org & Technical SEO</span>
            </Space>
          } 
          key="schema"
          className="seo-panel"
        >
          <Form.Item
            label={
              <Space>
                <span>Schema Markup (JSON-LD)</span>
                {renderInfoIcon('Dữ liệu có cấu trúc Schema.org giúp Google hiểu rõ nội dung trang và hiển thị rich snippets')}
              </Space>
            }
            name={['seo_data', 'schema_markup']}
            extra={
              <Space size={8}>
                <span>Nhập dữ liệu có cấu trúc Schema.org dạng JSON-LD để tối ưu hiển thị trên kết quả tìm kiếm</span>
                <Button size="small" onClick={() => {
                  const example = {
                    '@context': 'https://schema.org',
                    '@type': 'Product',
                    name: form?.form?.getFieldValue('name') || 'Tên sản phẩm',
                    description: form?.form?.getFieldValue('short_description') || 'Mô tả sản phẩm',
                    brand: form?.form?.getFieldValue('brand') || 'Thương hiệu',
                    sku: form?.form?.getFieldValue('sku') || 'SKU-001',
                    offers: {
                      '@type': 'Offer',
                      price: String(form?.form?.getFieldValue('price') || 1000000),
                      priceCurrency: 'VND',
                      availability: 'https://schema.org/InStock'
                    }
                  };
                  form?.form?.setFieldsValue({ seo_data: { schema_markup: example } });
                }}>Tạo dữ liệu thông minh</Button>
              </Space>
            }
          >
            <JsonField height={300} />
          </Form.Item>
        </Panel>

        {/* Performance & Metrics */}
        <Panel 
          header={
            <Space>
              <BarChartOutlined style={{ color: '#13c2c2' }} />
              <span>Performance & Metrics</span>
            </Space>
          } 
          key="performance"
          className="seo-panel"
        >
          <Row gutter={[24, 16]}>
            <Col span={8}>
              <Form.Item
                label={
                  <Space>
                    <span>SEO Score</span>
                    {renderInfoIcon('Điểm SEO tổng thể từ 0-100, đánh giá chất lượng SEO của trang')}
                  </Space>
                }
                name={['seo_data', 'seo_score']}
              >
                <InputNumber 
                  min={0} 
                  max={100} 
                  placeholder="0-100"
                  style={{ width: '100%' }}
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={
                  <Space>
                    <span>Keyword Difficulty</span>
                    {renderInfoIcon('Độ khó của từ khóa từ 0-100. Số càng cao thì càng khó xếp hạng')}
                  </Space>
                }
                name={['seo_data', 'keyword_difficulty']}
              >
                <InputNumber 
                  min={0} 
                  max={100} 
                  placeholder="0-100"
                  style={{ width: '100%' }}
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={
                  <Space>
                    <span>Search Volume</span>
                    {renderInfoIcon('Lượt tìm kiếm trung bình hàng tháng cho từ khóa chính')}
                  </Space>
                }
                name={['seo_data', 'search_volume']}
              >
                <InputNumber 
                  min={0} 
                  placeholder="Lượt tìm kiếm/tháng"
                  style={{ width: '100%' }}
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
                    <span>Page Load Time (s)</span>
                    {renderInfoIcon('Thời gian tải trang. Nên dưới 3 giây để tối ưu trải nghiệm người dùng và SEO')}
                  </Space>
                }
                name={['seo_data', 'page_load_time']}
              >
                <InputNumber 
                  min={0} 
                  step={0.1}
                  placeholder="Thời gian tải (giây)"
                  style={{ width: '100%' }}
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={
                  <Space>
                    <span>Mobile Friendly Score</span>
                    {renderInfoIcon('Điểm thân thiện mobile từ 0-100. Google ưu tiên mobile-first indexing')}
                  </Space>
                }
                name={['seo_data', 'mobile_friendly_score']}
              >
                <InputNumber 
                  min={0} 
                  max={100} 
                  placeholder="0-100"
                  style={{ width: '100%' }}
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={
                  <Space>
                    <span>Accessibility Score</span>
                    {renderInfoIcon('Điểm accessibility từ 0-100, đánh giá khả năng tiếp cận của người khuyết tật')}
                  </Space>
                }
                name={['seo_data', 'accessibility_score']}
              >
                <InputNumber 
                  min={0} 
                  max={100} 
                  placeholder="0-100"
                  style={{ width: '100%' }}
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
                    <span>Core Web Vitals Score</span>
                    {renderInfoIcon('Điểm Core Web Vitals từ 0-100, đánh giá trải nghiệm người dùng')}
                  </Space>
                }
                name={['seo_data', 'core_web_vitals_score']}
              >
                <InputNumber 
                  min={0} 
                  max={100} 
                  placeholder="0-100"
                  style={{ width: '100%' }}
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={
                  <Space>
                    <span>Content Length (từ)</span>
                    {renderInfoIcon('Số từ trong nội dung. Nội dung dài thường có cơ hội xếp hạng tốt hơn')}
                  </Space>
                }
                name={['seo_data', 'content_length']}
              >
                <InputNumber 
                  min={0} 
                  placeholder="Số từ"
                  style={{ width: '100%' }}
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={
                  <Space>
                    <span>Image Optimization Score</span>
                    {renderInfoIcon('Điểm tối ưu hình ảnh từ 0-100, bao gồm kích thước, format và alt text')}
                  </Space>
                }
                name={['seo_data', 'image_optimization_score']}
              >
                <InputNumber 
                  min={0} 
                  max={100} 
                  placeholder="0-100"
                  style={{ width: '100%' }}
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>
        </Panel>

        {/* Advanced SEO Metrics */}
        <Panel 
          header={
            <Space>
              <TrophyOutlined style={{ color: '#f5222d' }} />
              <span>Advanced SEO Metrics (2025+)</span>
            </Space>
          } 
          key="advanced"
          className="seo-panel"
        >
          <Row gutter={[24, 16]}>
            <Col span={12}>
              <Form.Item
                label={
                  <Space>
                    <span>Core Web Vitals (JSON)</span>
                    {renderInfoIcon('Chỉ số Core Web Vitals chi tiết: LCP, FID, CLS, INP, TTFB. Giúp đánh giá performance')}
                  </Space>
                }
                name={['seo_data', 'core_web_vitals']}
                extra={
                  <Space size={8}>
                    <span>LCP, FID, CLS, INP, TTFB metrics</span>
                    <Button size="small" onClick={() => {
                      const example = { lcp: 2.4, fid: 80, cls: 0.08, inp: 180, ttfb: 750 };
                      form?.form?.setFieldsValue({ seo_data: { core_web_vitals: example } });
                    }}>Tạo dữ liệu thông minh</Button>
                  </Space>
                }
              >
                <JsonField height={200} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <Space>
                    <span>AI & ML Metrics (JSON)</span>
                    {renderInfoIcon('Chỉ số AI & ML SEO: AI relevance score, ML ranking factors. Xu hướng SEO tương lai')}
                  </Space>
                }
                name={['seo_data', 'ai_ml_metrics']}
                extra={
                  <Space size={8}>
                    <span>AI relevance score, ML ranking factors</span>
                    <Button size="small" onClick={() => {
                      const example = { ai_relevance_score: 88, ml_ranking_factors: ['content_quality', 'user_engagement', 'page_experience'] };
                      form?.form?.setFieldsValue({ seo_data: { ai_ml_metrics: example } });
                    }}>Tạo dữ liệu thông minh</Button>
                  </Space>
                }
              >
                <JsonField height={200} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 16]}>
            <Col span={12}>
              <Form.Item
                label={
                  <Space>
                    <span>E-E-A-T Metrics (JSON)</span>
                    {renderInfoIcon('Experience, Expertise, Authoritativeness, Trust. Tiêu chí đánh giá chất lượng nội dung của Google')}
                  </Space>
                }
                name={['seo_data', 'eeat_metrics']}
                extra={
                  <Space size={8}>
                    <span>Experience, Expertise, Authoritativeness, Trust</span>
                    <Button size="small" onClick={() => {
                      const example = { experience: 90, expertise: 85, authoritativeness: 82, trust: 94 };
                      form?.form?.setFieldsValue({ seo_data: { eeat_metrics: example } });
                    }}>Tạo dữ liệu thông minh</Button>
                  </Space>
                }
              >
                <JsonField height={200} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <Space>
                    <span>Voice & Visual Search (JSON)</span>
                    {renderInfoIcon('Tối ưu cho tìm kiếm bằng giọng nói và hình ảnh. Xu hướng tìm kiếm tương lai')}
                  </Space>
                }
                name={['seo_data', 'voice_visual_metrics']}
                extra={
                  <Space size={8}>
                    <span>Voice search optimization, visual search data</span>
                    <Button size="small" onClick={() => {
                      const example = { voice_optimization: 78, visual_search: 82, semantic_keywords: ['tìm kiếm giọng nói', 'tìm kiếm hình ảnh'] };
                      form?.form?.setFieldsValue({ seo_data: { voice_visual_metrics: example } });
                    }}>Tạo dữ liệu thông minh</Button>
                  </Space>
                }
              >
                <JsonField height={200} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 16]}>
            <Col span={12}>
              <Form.Item
                label={
                  <Space>
                    <span>Privacy & Compliance (JSON)</span>
                    {renderInfoIcon('Tuân thủ quy định bảo mật: GDPR, CCPA. Ảnh hưởng đến trust score và SEO')}
                  </Space>
                }
                name={['seo_data', 'privacy_compliance']}
                extra={
                  <Space size={8}>
                    <span>GDPR, CCPA, privacy signals</span>
                    <Button size="small" onClick={() => {
                      const example = { gdpr_compliant: true, ccpa_compliant: true, privacy_signals: ['https', 'privacy_policy', 'cookie_banner'] };
                      form?.form?.setFieldsValue({ seo_data: { privacy_compliance: example } });
                    }}>Tạo dữ liệu thông minh</Button>
                  </Space>
                }
              >
                <JsonField height={200} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <Space>
                    <span>Future Metrics (JSON)</span>
                    {renderInfoIcon('Chỉ số SEO tương lai: Quantum SEO, Neural networks, BCI, Spatial computing')}
                  </Space>
                }
                name={['seo_data', 'future_metrics']}
                extra={
                  <Space size={8}>
                    <span>Quantum SEO, Neural networks, BCI, Spatial computing</span>
                    <Button size="small" onClick={() => {
                      const example = { quantum_seo: 62, neural_networks: 71, bci_optimization: 54, spatial_computing: 66 };
                      form?.form?.setFieldsValue({ seo_data: { future_metrics: example } });
                    }}>Tạo dữ liệu thông minh</Button>
                  </Space>
                }
              >
                <JsonField height={200} />
              </Form.Item>
            </Col>
          </Row>
        </Panel>

        {/* SEO Status */}
        <Panel 
          header={
            <Space>
              <SettingOutlined style={{ color: '#eb2f96' }} />
              <span>Trạng thái SEO</span>
            </Space>
          } 
          key="status"
          className="seo-panel"
        >
          <Row gutter={[24, 16]}>
            <Col span={6}>
              <Form.Item
                label={
                  <Space>
                    <span>Được index</span>
                    {renderInfoIcon('Cho phép Google và các công cụ tìm kiếm khác index trang này')}
                  </Space>
                }
                name={['seo_data', 'is_indexed']}
                valuePropName="checked"
                initialValue={true}
              >
                <Switch size="default" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label={
                  <Space>
                    <span>SSL Secure</span>
                    {renderInfoIcon('Trang có sử dụng HTTPS. Google ưu tiên các trang bảo mật')}
                  </Space>
                }
                name={['seo_data', 'is_ssl_secure']}
                valuePropName="checked"
                initialValue={true}
              >
                <Switch size="default" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label={
                  <Space>
                    <span>Featured SEO</span>
                    {renderInfoIcon('Đánh dấu trang được ưu tiên SEO, có thể ảnh hưởng đến thứ tự xử lý')}
                  </Space>
                }
                name={['seo_data', 'is_featured']}
                valuePropName="checked"
              >
                <Switch size="default" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label={
                  <Space>
                    <span>Active</span>
                    {renderInfoIcon('Trạng thái hoạt động của trang SEO')}
                  </Space>
                }
                name={['seo_data', 'is_active']}
                valuePropName="checked"
                initialValue={true}
              >
                <Switch size="default" />
              </Form.Item>
            </Col>
          </Row>
        </Panel>
      </Collapse>
    </Card>
  );
};
