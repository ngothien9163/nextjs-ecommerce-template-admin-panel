import React from 'react';
import { Card, Descriptions, Typography, Tag, Space, Divider, Progress, Image, Collapse, Tooltip, Row, Col, Statistic } from 'antd';
import { InfoCircleOutlined, GlobalOutlined, ShareAltOutlined, TwitterOutlined, CodeOutlined, BarChartOutlined, TrophyOutlined, SettingOutlined, TrophyOutlined as TrophyIcon, RocketOutlined, MobileOutlined, EyeOutlined } from '@ant-design/icons';
import './seo-display.css';

const { Title, Text } = Typography;
const { Panel } = Collapse;

interface SEOData {
  seo_score?: number;
  keyword_difficulty?: number;
  search_volume?: number;
  page_load_time?: number;
  mobile_friendly_score?: number;
  accessibility_score?: number;
  core_web_vitals_score?: number;
  page_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  og_title?: string;
  og_description?: string;
  og_image?: string;
  og_type?: string;
  og_site_name?: string;
  og_locale?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  twitter_card?: string;
  twitter_creator?: string;
  twitter_site?: string;
  schema_markup?: any;
  canonical_url?: string;
  robots_directive?: string;
  language?: string;
  charset?: string;
  viewport?: string;
  social_shares?: number;
  social_engagement?: number;
  social_click_through_rate?: number;
  content_length?: number;
  content_readability_score?: number;
  content_freshness_score?: number;
  internal_links_count?: number;
  external_links_count?: number;
  broken_links_count?: number;
  image_optimization_score?: number;
  is_indexed?: boolean;
  is_ssl_secure?: boolean;
  is_featured?: boolean;
  is_active?: boolean;
}

interface SEODisplayProps {
  seoData: SEOData;
  title?: string;
  showAdvanced?: boolean;
}

export const SEODisplay: React.FC<SEODisplayProps> = ({ 
  seoData, 
  title = "Thông tin SEO",
  showAdvanced = false 
}) => {
  if (!seoData) {
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#52c41a';
    if (score >= 60) return '#faad14';
    return '#ff4d4f';
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return 'Tốt';
    if (score >= 60) return 'Trung bình';
    return 'Kém';
  };

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
          <span>{title}</span>
          <Tooltip title="Thông tin chi tiết về tối ưu hóa công cụ tìm kiếm (SEO) của trang này">
            <InfoCircleOutlined style={{ color: '#1890ff' }} />
          </Tooltip>
        </Space>
      } 
      style={{ marginBottom: '24px' }}
      className="seo-display-card"
    >
      <Collapse 
        defaultActiveKey={['overview', 'meta', 'social', 'technical']} 
        ghost
        expandIconPosition="end"
        className="seo-display-collapse"
      >
        {/* Tổng quan SEO */}
        <Panel 
          header={
            <Space>
              <BarChartOutlined style={{ color: '#52c41a' }} />
              <span>Tổng quan SEO</span>
            </Space>
          } 
          key="overview"
          className="seo-display-panel"
        >
          <Row gutter={[24, 16]}>
            <Col span={6}>
              <Statistic
                title={
                  <Space>
                    <span>Điểm SEO tổng thể</span>
                    {renderInfoIcon('Điểm SEO tổng thể từ 0-100, đánh giá chất lượng SEO của trang')}
                  </Space>
                }
                value={seoData.seo_score || 0}
                suffix="/100"
                valueStyle={{ 
                  color: getScoreColor(seoData.seo_score || 0),
                  fontSize: '24px',
                  fontWeight: 'bold'
                }}
              />
              <Progress 
                percent={seoData.seo_score || 0} 
                size="small" 
                strokeColor={getScoreColor(seoData.seo_score || 0)}
                style={{ marginTop: '8px' }}
                showInfo={false}
              />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {getScoreText(seoData.seo_score || 0)}
              </Text>
            </Col>
            <Col span={6}>
              <Statistic
                title={
                  <Space>
                    <span>Độ khó từ khóa</span>
                    {renderInfoIcon('Độ khó của từ khóa từ 0-100. Số càng cao thì càng khó xếp hạng')}
                  </Space>
                }
                value={seoData.keyword_difficulty || 0}
                suffix="/100"
                valueStyle={{ 
                  color: getScoreColor(seoData.keyword_difficulty || 0),
                  fontSize: '24px',
                  fontWeight: 'bold'
                }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title={
                  <Space>
                    <span>Lượt tìm kiếm</span>
                    {renderInfoIcon('Lượt tìm kiếm trung bình hàng tháng cho từ khóa chính')}
                  </Space>
                }
                value={seoData.search_volume || 0}
                suffix="lượt/tháng"
                valueStyle={{ 
                  color: '#1890ff',
                  fontSize: '24px',
                  fontWeight: 'bold'
                }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title={
                  <Space>
                    <span>Thời gian tải</span>
                    {renderInfoIcon('Thời gian tải trang. Nên dưới 3 giây để tối ưu trải nghiệm người dùng')}
                  </Space>
                }
                value={seoData.page_load_time || 0}
                suffix="s"
                valueStyle={{ 
                  color: seoData.page_load_time && seoData.page_load_time > 3 ? '#ff4d4f' : '#52c41a',
                  fontSize: '24px',
                  fontWeight: 'bold'
                }}
              />
            </Col>
          </Row>

          <Divider />

          <Row gutter={[24, 16]}>
            <Col span={8}>
              <Statistic
                title={
                  <Space>
                    <MobileOutlined />
                    <span>Mobile Friendly</span>
                    {renderInfoIcon('Điểm thân thiện mobile từ 0-100. Google ưu tiên mobile-first indexing')}
                  </Space>
                }
                value={seoData.mobile_friendly_score || 0}
                suffix="/100"
                valueStyle={{ 
                  color: getScoreColor(seoData.mobile_friendly_score || 0),
                  fontSize: '20px',
                  fontWeight: 'bold'
                }}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title={
                  <Space>
                    <EyeOutlined />
                    <span>Accessibility</span>
                    {renderInfoIcon('Điểm accessibility từ 0-100, đánh giá khả năng tiếp cận của người khuyết tật')}
                  </Space>
                }
                value={seoData.accessibility_score || 0}
                suffix="/100"
                valueStyle={{ 
                  color: getScoreColor(seoData.accessibility_score || 0),
                  fontSize: '20px',
                  fontWeight: 'bold'
                }}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title={
                  <Space>
                    <RocketOutlined />
                    <span>Core Web Vitals</span>
                    {renderInfoIcon('Điểm Core Web Vitals từ 0-100, đánh giá trải nghiệm người dùng')}
                  </Space>
                }
                value={seoData.core_web_vitals_score || 0}
                suffix="/100"
                valueStyle={{ 
                  color: getScoreColor(seoData.core_web_vitals_score || 0),
                  fontSize: '20px',
                  fontWeight: 'bold'
                }}
              />
            </Col>
          </Row>
        </Panel>

        {/* Meta Tags & Basic SEO */}
        <Panel 
          header={
            <Space>
              <GlobalOutlined style={{ color: '#13c2c2' }} />
              <span>Meta Tags & Basic SEO</span>
            </Space>
          } 
          key="meta"
          className="seo-display-panel"
        >
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item 
              label={
                <Space>
                  <span>Meta Title</span>
                  {renderInfoIcon('Tiêu đề trang hiển thị trên kết quả tìm kiếm. Nên có 50-60 ký tự')}
                </Space>
              }
            >
              {seoData.page_title || 'Chưa cập nhật'}
            </Descriptions.Item>
            <Descriptions.Item 
              label={
                <Space>
                  <span>Meta Description</span>
                  {renderInfoIcon('Mô tả ngắn gọn nội dung trang, hiển thị dưới tiêu đề trên kết quả tìm kiếm')}
                </Space>
              }
            >
              {seoData.meta_description || 'Chưa cập nhật'}
            </Descriptions.Item>
            <Descriptions.Item 
              label={
                <Space>
                  <span>Meta Keywords</span>
                  {renderInfoIcon('Từ khóa chính của trang. Mặc dù Google không sử dụng trực tiếp, nhưng vẫn hữu ích')}
                </Space>
              }
            >
              {seoData.meta_keywords && seoData.meta_keywords.length > 0 ? (
                <Space wrap>
                  {seoData.meta_keywords.map((keyword: string, index: number) => (
                    <Tag key={index} color="blue">{keyword}</Tag>
                  ))}
                </Space>
              ) : (
                'Chưa cập nhật'
              )}
            </Descriptions.Item>
            <Descriptions.Item 
              label={
                <Space>
                  <span>Canonical URL</span>
                  {renderInfoIcon('URL chính thức của trang, giúp tránh duplicate content')}
                </Space>
              }
            >
              {seoData.canonical_url || 'Chưa cập nhật'}
            </Descriptions.Item>
            <Descriptions.Item 
              label={
                <Space>
                  <span>Robots Directive</span>
                  {renderInfoIcon('Chỉ thị cho các bot tìm kiếm về cách index và follow links trên trang')}
                </Space>
              }
            >
              {seoData.robots_directive || 'Chưa cập nhật'}
            </Descriptions.Item>
            <Descriptions.Item 
              label={
                <Space>
                  <span>Language</span>
                  {renderInfoIcon('Ngôn ngữ chính của trang, giúp Google hiểu và index đúng ngôn ngữ')}
                </Space>
              }
            >
              {seoData.language || 'Chưa cập nhật'}
            </Descriptions.Item>
            <Descriptions.Item 
              label={
                <Space>
                  <span>Charset</span>
                  {renderInfoIcon('Bộ mã ký tự của trang, thường là UTF-8 để hỗ trợ đa ngôn ngữ')}
                </Space>
              }
            >
              {seoData.charset || 'Chưa cập nhật'}
            </Descriptions.Item>
            <Descriptions.Item 
              label={
                <Space>
                  <span>Viewport</span>
                  {renderInfoIcon('Cài đặt viewport cho responsive design, giúp trang hiển thị tốt trên mobile')}
                </Space>
              }
            >
              {seoData.viewport || 'Chưa cập nhật'}
            </Descriptions.Item>
          </Descriptions>
        </Panel>

        {/* Social Media & Open Graph */}
        <Panel 
          header={
            <Space>
              <ShareAltOutlined style={{ color: '#722ed1' }} />
              <span>Social Media & Open Graph</span>
            </Space>
          } 
          key="social"
          className="seo-display-panel"
        >
          {(seoData.og_title || seoData.og_description || seoData.og_image) && (
            <>
              <Title level={5}>
                <ShareAltOutlined style={{ marginRight: '8px' }} />
                Open Graph
              </Title>
              <Descriptions column={1} bordered size="small">
                {seoData.og_title && (
                  <Descriptions.Item 
                    label={
                      <Space>
                        <span>OG Title</span>
                        {renderInfoIcon('Tiêu đề hiển thị khi chia sẻ trên Facebook, LinkedIn và các mạng xã hội khác')}
                      </Space>
                    }
                  >
                    {seoData.og_title}
                  </Descriptions.Item>
                )}
                {seoData.og_description && (
                  <Descriptions.Item 
                    label={
                      <Space>
                        <span>OG Description</span>
                        {renderInfoIcon('Mô tả hiển thị khi chia sẻ trên mạng xã hội')}
                      </Space>
                    }
                  >
                    {seoData.og_description}
                  </Descriptions.Item>
                )}
                {seoData.og_image && (
                  <Descriptions.Item 
                    label={
                      <Space>
                        <span>OG Image</span>
                        {renderInfoIcon('Hình ảnh hiển thị khi chia sẻ trên mạng xã hội. Nên có kích thước 1200x630px')}
                      </Space>
                    }
                  >
                    <Image width={100} src={seoData.og_image} alt="OG Image" />
                  </Descriptions.Item>
                )}
                {seoData.og_type && (
                  <Descriptions.Item 
                    label={
                      <Space>
                        <span>OG Type</span>
                        {renderInfoIcon('Loại nội dung Open Graph, giúp mạng xã hội hiểu và hiển thị đúng định dạng')}
                      </Space>
                    }
                  >
                    {seoData.og_type}
                  </Descriptions.Item>
                )}
                {seoData.og_site_name && (
                  <Descriptions.Item 
                    label={
                      <Space>
                        <span>OG Site Name</span>
                        {renderInfoIcon('Tên website, hiển thị bên dưới tiêu đề khi chia sẻ trên mạng xã hội')}
                      </Space>
                    }
                  >
                    {seoData.og_site_name}
                  </Descriptions.Item>
                )}
                {seoData.og_locale && (
                  <Descriptions.Item 
                    label={
                      <Space>
                        <span>OG Locale</span>
                        {renderInfoIcon('Ngôn ngữ và vùng miền của nội dung Open Graph')}
                      </Space>
                    }
                  >
                    {seoData.og_locale}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </>
          )}

          {(seoData.twitter_title || seoData.twitter_description || seoData.twitter_image) && (
            <>
              <Divider />
              <Title level={5}>
                <TwitterOutlined style={{ marginRight: '8px', color: '#1da1f2' }} />
                Twitter Card
              </Title>
              <Descriptions column={1} bordered size="small">
                {seoData.twitter_title && (
                  <Descriptions.Item 
                    label={
                      <Space>
                        <span>Twitter Title</span>
                        {renderInfoIcon('Tiêu đề hiển thị khi chia sẻ trên Twitter')}
                      </Space>
                    }
                  >
                    {seoData.twitter_title}
                  </Descriptions.Item>
                )}
                {seoData.twitter_description && (
                  <Descriptions.Item 
                    label={
                      <Space>
                        <span>Twitter Description</span>
                        {renderInfoIcon('Mô tả hiển thị khi chia sẻ trên Twitter')}
                      </Space>
                    }
                  >
                    {seoData.twitter_description}
                  </Descriptions.Item>
                )}
                {seoData.twitter_image && (
                  <Descriptions.Item 
                    label={
                      <Space>
                        <span>Twitter Image</span>
                        {renderInfoIcon('Hình ảnh hiển thị khi chia sẻ trên Twitter. Nên có kích thước 1200x600px')}
                      </Space>
                    }
                  >
                    <Image width={100} src={seoData.twitter_image} alt="Twitter Image" />
                  </Descriptions.Item>
                )}
                {seoData.twitter_card && (
                  <Descriptions.Item 
                    label={
                      <Space>
                        <span>Twitter Card Type</span>
                        {renderInfoIcon('Loại Twitter Card, ảnh hưởng đến cách nội dung hiển thị trên Twitter')}
                      </Space>
                    }
                  >
                    {seoData.twitter_card}
                  </Descriptions.Item>
                )}
                {seoData.twitter_creator && (
                  <Descriptions.Item 
                    label={
                      <Space>
                        <span>Twitter Creator</span>
                        {renderInfoIcon('Username Twitter của tác giả nội dung (@username)')}
                      </Space>
                    }
                  >
                    {seoData.twitter_creator}
                  </Descriptions.Item>
                )}
                {seoData.twitter_site && (
                  <Descriptions.Item 
                    label={
                      <Space>
                        <span>Twitter Site</span>
                        {renderInfoIcon('Username Twitter của website (@sitename)')}
                      </Space>
                    }
                  >
                    {seoData.twitter_site}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </>
          )}
        </Panel>

        {/* Technical SEO & Advanced */}
        <Panel 
          header={
            <Space>
              <CodeOutlined style={{ color: '#fa8c16' }} />
              <span>Technical SEO & Advanced</span>
            </Space>
          } 
          key="technical"
          className="seo-display-panel"
        >
          {/* Schema Markup */}
          {seoData.schema_markup && (
            <>
              <Title level={5}>
                <CodeOutlined style={{ marginRight: '8px' }} />
                Schema Markup
                {renderInfoIcon('Dữ liệu có cấu trúc Schema.org giúp Google hiểu rõ nội dung trang và hiển thị rich snippets')}
              </Title>
              <div style={{ 
                padding: '16px', 
                backgroundColor: '#f5f5f5', 
                borderRadius: '6px',
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace',
                fontSize: '12px',
                border: '1px solid #d9d9d9'
              }}>
                {JSON.stringify(seoData.schema_markup, null, 2)}
              </div>
              <Divider />
            </>
          )}

          {/* Advanced Metrics (if showAdvanced is true) */}
          {showAdvanced && (
            <>
              <Title level={5}>
                <TrophyIcon style={{ marginRight: '8px' }} />
                Advanced Metrics (2025+)
              </Title>
              
              {/* Social & Content Metrics */}
              <Row gutter={[24, 16]} style={{ marginBottom: '24px' }}>
                <Col span={8}>
                  <Statistic
                    title={
                      <Space>
                        <span>Social Shares</span>
                        {renderInfoIcon('Số lượt chia sẻ mạng xã hội')}
                      </Space>
                    }
                    value={seoData.social_shares || 0}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title={
                      <Space>
                        <span>Social Engagement (%)</span>
                        {renderInfoIcon('Tỷ lệ tương tác mạng xã hội')}
                      </Space>
                    }
                    value={seoData.social_engagement || 0}
                    suffix="%"
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title={
                      <Space>
                        <span>Social CTR (%)</span>
                        {renderInfoIcon('Tỷ lệ click qua mạng xã hội')}
                      </Space>
                    }
                    value={seoData.social_click_through_rate || 0}
                    suffix="%"
                    valueStyle={{ color: '#722ed1' }}
                  />
                </Col>
              </Row>

              <Row gutter={[24, 16]} style={{ marginBottom: '24px' }}>
                <Col span={8}>
                  <Statistic
                    title={
                      <Space>
                        <span>Content Length</span>
                        {renderInfoIcon('Độ dài nội dung (số từ). Nội dung dài thường có cơ hội xếp hạng tốt hơn')}
                      </Space>
                    }
                    value={seoData.content_length || 0}
                    suffix="từ"
                    valueStyle={{ color: '#13c2c2' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title={
                      <Space>
                        <span>Content Readability</span>
                        {renderInfoIcon('Điểm dễ đọc từ 0-100')}
                      </Space>
                    }
                    value={seoData.content_readability_score || 0}
                    suffix="/100"
                    valueStyle={{ 
                      color: getScoreColor(seoData.content_readability_score || 0)
                    }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title={
                      <Space>
                        <span>Content Freshness</span>
                        {renderInfoIcon('Điểm cập nhật nội dung từ 0-100')}
                      </Space>
                    }
                    value={seoData.content_freshness_score || 0}
                    suffix="/100"
                    valueStyle={{ 
                      color: getScoreColor(seoData.content_freshness_score || 0)
                    }}
                  />
                </Col>
              </Row>

              <Row gutter={[24, 16]} style={{ marginBottom: '24px' }}>
                <Col span={8}>
                  <Statistic
                    title={
                      <Space>
                        <span>Internal Links</span>
                        {renderInfoIcon('Số internal links. Nên có ít nhất 3 internal links')}
                      </Space>
                    }
                    value={seoData.internal_links_count || 0}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title={
                      <Space>
                        <span>External Links</span>
                        {renderInfoIcon('Số external links. Nên có ít nhất 1 external link chất lượng')}
                      </Space>
                    }
                    value={seoData.external_links_count || 0}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title={
                      <Space>
                        <span>Broken Links</span>
                        {renderInfoIcon('Số broken links. Nên có 0 broken links')}
                      </Space>
                    }
                    value={seoData.broken_links_count || 0}
                    valueStyle={{ color: '#ff4d4f' }}
                  />
                </Col>
              </Row>

              <Row gutter={[24, 16]}>
                <Col span={8}>
                  <Statistic
                    title={
                      <Space>
                        <span>Image Optimization</span>
                        {renderInfoIcon('Điểm tối ưu hình ảnh từ 0-100, bao gồm kích thước, format và alt text')}
                      </Space>
                    }
                    value={seoData.image_optimization_score || 0}
                    suffix="/100"
                    valueStyle={{ 
                      color: getScoreColor(seoData.image_optimization_score || 0)
                    }}
                  />
                </Col>
              </Row>
            </>
          )}
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
          className="seo-display-panel"
        >
          <Row gutter={[24, 16]}>
            <Col span={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '8px' }}>
                  {renderInfoIcon('Cho phép Google và các công cụ tìm kiếm khác index trang này')}
                </div>
                                 <Tag color={seoData.is_indexed ? 'green' : 'red'}>
                   {seoData.is_indexed ? 'Được index' : 'Không được index'}
                 </Tag>
              </div>
            </Col>
            <Col span={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '8px' }}>
                  {renderInfoIcon('Trang có sử dụng HTTPS. Google ưu tiên các trang bảo mật')}
                </div>
                                 <Tag color={seoData.is_ssl_secure ? 'green' : 'red'}>
                   {seoData.is_ssl_secure ? 'SSL Secure' : 'Không SSL'}
                 </Tag>
              </div>
            </Col>
            <Col span={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '8px' }}>
                  {renderInfoIcon('Đánh dấu trang được ưu tiên SEO, có thể ảnh hưởng đến thứ tự xử lý')}
                </div>
                                 <Tag color={seoData.is_featured ? 'blue' : 'default'}>
                   {seoData.is_featured ? 'Featured SEO' : 'Không featured'}
                 </Tag>
              </div>
            </Col>
            <Col span={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '8px' }}>
                  {renderInfoIcon('Trạng thái hoạt động của trang SEO')}
                </div>
                                 <Tag color={seoData.is_active ? 'green' : 'red'}>
                   {seoData.is_active ? 'Active' : 'Inactive'}
                 </Tag>
              </div>
            </Col>
          </Row>
        </Panel>
      </Collapse>
    </Card>
  );
};
