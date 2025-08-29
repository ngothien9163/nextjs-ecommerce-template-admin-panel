import React from 'react';
import { Card, Descriptions, Typography, Tag, Space, Divider, Progress, Image } from 'antd';

const { Title, Text } = Typography;

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

  return (
    <Card title={title} style={{ marginBottom: '24px' }}>
      {/* Performance Metrics */}
      <div>
        <Title level={5}>Chỉ số hiệu suất</Title>
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Điểm SEO tổng thể">
            <div>
              <Text strong style={{ color: getScoreColor(seoData.seo_score || 0) }}>
                {seoData.seo_score || 0}/100 - {getScoreText(seoData.seo_score || 0)}
              </Text>
              <Progress 
                percent={seoData.seo_score || 0} 
                size="small" 
                strokeColor={getScoreColor(seoData.seo_data?.seo_score || 0)}
                style={{ marginTop: '8px' }}
              />
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="Độ khó từ khóa">
            {seoData.keyword_difficulty ? (
              <Text>{seoData.keyword_difficulty}/100</Text>
            ) : (
              'Chưa cập nhật'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Lượt tìm kiếm">
            {seoData.search_volume ? (
              <Text>{seoData.search_volume.toLocaleString()} lượt/tháng</Text>
            ) : (
              'Chưa cập nhật'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian tải trang">
            {seoData.page_load_time ? (
              <Text>{seoData.page_load_time}s</Text>
            ) : (
              'Chưa cập nhật'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Điểm thân thiện mobile">
            {seoData.mobile_friendly_score ? (
              <Text style={{ color: getScoreColor(seoData.mobile_friendly_score) }}>
                {seoData.mobile_friendly_score}/100
              </Text>
            ) : (
              'Chưa cập nhật'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Điểm accessibility">
            {seoData.accessibility_score ? (
              <Text style={{ color: getScoreColor(seoData.accessibility_score) }}>
                {seoData.accessibility_score}/100
              </Text>
            ) : (
              'Chưa cập nhật'
            )}
          </Descriptions.Item>
        </Descriptions>
      </div>

      <Divider />

      {/* Meta Tags */}
      <div>
        <Title level={5}>Meta Tags</Title>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Meta Title">
            {seoData.page_title || 'Chưa cập nhật'}
          </Descriptions.Item>
          <Descriptions.Item label="Meta Description">
            {seoData.meta_description || 'Chưa cập nhật'}
          </Descriptions.Item>
          <Descriptions.Item label="Meta Keywords">
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
          <Descriptions.Item label="Canonical URL">
            {seoData.canonical_url || 'Chưa cập nhật'}
          </Descriptions.Item>
          <Descriptions.Item label="Robots Directive">
            {seoData.robots_directive || 'Chưa cập nhật'}
          </Descriptions.Item>
          <Descriptions.Item label="Language">
            {seoData.language || 'Chưa cập nhật'}
          </Descriptions.Item>
          <Descriptions.Item label="Charset">
            {seoData.charset || 'Chưa cập nhật'}
          </Descriptions.Item>
          <Descriptions.Item label="Viewport">
            {seoData.viewport || 'Chưa cập nhật'}
          </Descriptions.Item>
        </Descriptions>
      </div>

      <Divider />

      {/* Open Graph */}
      {(seoData.og_title || seoData.og_description || seoData.og_image) && (
        <>
          <div>
            <Title level={5}>Open Graph</Title>
            <Descriptions column={1} bordered>
              {seoData.og_title && (
                <Descriptions.Item label="OG Title">
                  {seoData.og_title}
                </Descriptions.Item>
              )}
              {seoData.og_description && (
                <Descriptions.Item label="OG Description">
                  {seoData.og_description}
                </Descriptions.Item>
              )}
              {seoData.og_image && (
                <Descriptions.Item label="OG Image">
                  <Image width={100} src={seoData.og_image} alt="OG Image" />
                </Descriptions.Item>
              )}
              {seoData.og_type && (
                <Descriptions.Item label="OG Type">
                  {seoData.og_type}
                </Descriptions.Item>
              )}
              {seoData.og_site_name && (
                <Descriptions.Item label="OG Site Name">
                  {seoData.og_site_name}
                </Descriptions.Item>
              )}
              {seoData.og_locale && (
                <Descriptions.Item label="OG Locale">
                  {seoData.og_locale}
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>
          <Divider />
        </>
      )}

      {/* Twitter Card */}
      {(seoData.twitter_title || seoData.twitter_description || seoData.twitter_image) && (
        <>
          <div>
            <Title level={5}>Twitter Card</Title>
            <Descriptions column={1} bordered>
              {seoData.twitter_title && (
                <Descriptions.Item label="Twitter Title">
                  {seoData.twitter_title}
                </Descriptions.Item>
              )}
              {seoData.twitter_description && (
                <Descriptions.Item label="Twitter Description">
                  {seoData.twitter_description}
                </Descriptions.Item>
              )}
              {seoData.twitter_image && (
                <Descriptions.Item label="Twitter Image">
                  <Image width={100} src={seoData.twitter_image} alt="Twitter Image" />
                </Descriptions.Item>
              )}
              {seoData.twitter_card && (
                <Descriptions.Item label="Twitter Card Type">
                  {seoData.twitter_card}
                </Descriptions.Item>
              )}
              {seoData.twitter_creator && (
                <Descriptions.Item label="Twitter Creator">
                  {seoData.twitter_creator}
                </Descriptions.Item>
              )}
              {seoData.twitter_site && (
                <Descriptions.Item label="Twitter Site">
                  {seoData.twitter_site}
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>
          <Divider />
        </>
      )}

      {/* Schema Markup */}
      {seoData.schema_markup && (
        <>
          <div>
            <Title level={5}>Schema Markup</Title>
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#f5f5f5', 
              borderRadius: '6px',
              whiteSpace: 'pre-wrap',
              fontFamily: 'monospace',
              fontSize: '12px'
            }}>
              {JSON.stringify(seoData.schema_markup, null, 2)}
            </div>
          </div>
          <Divider />
        </>
      )}

      {/* Advanced Metrics (if showAdvanced is true) */}
      {showAdvanced && (
        <>
          {/* Social & Content Metrics */}
          <div>
            <Title level={5}>Social & Content Metrics</Title>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Social Shares">
                {seoData.social_shares || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Social Engagement (%)">
                {seoData.social_engagement ? `${seoData.social_engagement}%` : 'Chưa cập nhật'}
              </Descriptions.Item>
              <Descriptions.Item label="Social CTR (%)">
                {seoData.social_click_through_rate ? `${seoData.social_click_through_rate}%` : 'Chưa cập nhật'}
              </Descriptions.Item>
              <Descriptions.Item label="Content Length">
                {seoData.content_length ? `${seoData.content_length} từ` : 'Chưa cập nhật'}
              </Descriptions.Item>
              <Descriptions.Item label="Content Readability Score">
                {seoData.content_readability_score ? (
                  <Text style={{ color: getScoreColor(seoData.content_readability_score) }}>
                    {seoData.content_readability_score}/100
                  </Text>
                ) : (
                  'Chưa cập nhật'
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Content Freshness Score">
                {seoData.content_freshness_score ? (
                  <Text style={{ color: getScoreColor(seoData.content_freshness_score) }}>
                    {seoData.content_freshness_score}/100
                  </Text>
                ) : (
                  'Chưa cập nhật'
                )}
              </Descriptions.Item>
            </Descriptions>
          </div>

          <Divider />

          {/* Technical SEO Metrics */}
          <div>
            <Title level={5}>Technical SEO Metrics</Title>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Internal Links Count">
                {seoData.internal_links_count || 0}
              </Descriptions.Item>
              <Descriptions.Item label="External Links Count">
                {seoData.external_links_count || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Broken Links Count">
                {seoData.broken_links_count || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Image Optimization Score">
                {seoData.image_optimization_score ? (
                  <Text style={{ color: getScoreColor(seoData.image_optimization_score) }}>
                    {seoData.image_optimization_score}/100
                  </Text>
                ) : (
                  'Chưa cập nhật'
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Core Web Vitals Score">
                {seoData.core_web_vitals_score ? (
                  <Text style={{ color: getScoreColor(seoData.core_web_vitals_score) }}>
                    {seoData.core_web_vitals_score}/100
                  </Text>
                ) : (
                  'Chưa cập nhật'
                )}
              </Descriptions.Item>
            </Descriptions>
          </div>

          <Divider />
        </>
      )}

      {/* SEO Status */}
      <div>
        <Title level={5}>Trạng thái SEO</Title>
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Được index">
            <Tag color={seoData.is_indexed ? 'green' : 'red'}>
              {seoData.is_indexed ? 'Có' : 'Không'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="SSL Secure">
            <Tag color={seoData.is_ssl_secure ? 'green' : 'red'}>
              {seoData.is_ssl_secure ? 'Có' : 'Không'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Featured SEO">
            <Tag color={seoData.is_featured ? 'blue' : 'default'}>
              {seoData.is_featured ? 'Có' : 'Không'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Active">
            <Tag color={seoData.is_active ? 'green' : 'red'}>
              {seoData.is_active ? 'Có' : 'Không'}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </div>
    </Card>
  );
};
