import React from 'react';
import { Space, Tag, Tooltip, Progress } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import type { SEOPage } from '../../lib/supabase';

interface SEOStatusDisplayProps {
  seoData?: Partial<SEOPage>;
  showDetails?: boolean;
  size?: 'small' | 'default';
}

export const SEOStatusDisplay: React.FC<SEOStatusDisplayProps> = ({
  seoData,
  showDetails = false,
  size = 'default'
}) => {
  if (!seoData) {
    return (
      <Tag color="orange" icon={<ExclamationCircleOutlined />}>
        Chưa có SEO
      </Tag>
    );
  }

  const getSEOScoreColor = (score: number) => {
    if (score >= 90) return '#52c41a';
    if (score >= 75) return '#faad14';
    if (score >= 60) return '#fa8c16';
    return '#f5222d';
  };

  const getSEOScoreStatus = (score: number) => {
    if (score >= 90) return { color: 'success', text: 'Xuất sắc' };
    if (score >= 75) return { color: 'warning', text: 'Tốt' };
    if (score >= 60) return { color: 'processing', text: 'Khá' };
    return { color: 'error', text: 'Cần cải thiện' };
  };

  const seoScore = seoData.seo_score || 0;
  const status = getSEOScoreStatus(seoScore);

  if (!showDetails) {
    return (
      <Tooltip title={`SEO Score: ${seoScore}/100 - ${status.text}`}>
        <Tag color={status.color} style={{ cursor: 'pointer' }}>
          SEO: {seoScore}
        </Tag>
      </Tooltip>
    );
  }

  return (
    <div className="seo-status-detailed">
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        {/* Overall SEO Score */}
        <div>
          <Space>
            <span style={{ fontSize: size === 'small' ? '12px' : '14px', fontWeight: 500 }}>
              SEO Score:
            </span>
            <Progress
              percent={seoScore}
              size="small"
              strokeColor={getSEOScoreColor(seoScore)}
              format={() => `${seoScore}`}
              style={{ width: 80 }}
            />
          </Space>
        </div>

        {/* Status Tags */}
        <Space wrap size="small">
          {/* Index Status */}
          <Tooltip title={seoData.is_indexed ? 'Được phép index bởi search engine' : 'Không được index'}>
            <Tag 
              color={seoData.is_indexed ? 'green' : 'red'}
              icon={seoData.is_indexed ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
              style={{ fontSize: size === 'small' ? '10px' : '12px' }}
            >
              {seoData.is_indexed ? 'Indexed' : 'No Index'}
            </Tag>
          </Tooltip>

          {/* SSL Status */}
          {seoData.is_ssl_secure !== undefined && (
            <Tooltip title={seoData.is_ssl_secure ? 'HTTPS bảo mật' : 'Không có SSL'}>
              <Tag 
                color={seoData.is_ssl_secure ? 'green' : 'red'}
                style={{ fontSize: size === 'small' ? '10px' : '12px' }}
              >
                {seoData.is_ssl_secure ? 'SSL' : 'No SSL'}
              </Tag>
            </Tooltip>
          )}

          {/* Featured Status */}
          {seoData.is_featured && (
            <Tag color="blue" style={{ fontSize: size === 'small' ? '10px' : '12px' }}>
              Featured
            </Tag>
          )}

          {/* Mobile Score */}
          {seoData.mobile_friendly_score && (
            <Tooltip title={`Mobile Friendly Score: ${seoData.mobile_friendly_score}/100`}>
              <Tag 
                color={seoData.mobile_friendly_score >= 80 ? 'green' : 'orange'}
                style={{ fontSize: size === 'small' ? '10px' : '12px' }}
              >
                Mobile: {seoData.mobile_friendly_score}
              </Tag>
            </Tooltip>
          )}

          {/* Accessibility Score */}
          {seoData.accessibility_score && (
            <Tooltip title={`Accessibility Score: ${seoData.accessibility_score}/100`}>
              <Tag 
                color={seoData.accessibility_score >= 80 ? 'green' : 'orange'}
                style={{ fontSize: size === 'small' ? '10px' : '12px' }}
              >
                A11y: {seoData.accessibility_score}
              </Tag>
            </Tooltip>
          )}
        </Space>

        {/* Additional Info */}
        {(seoData.content_length || seoData.meta_keywords?.length) && (
          <Space size="small" style={{ fontSize: size === 'small' ? '11px' : '12px', color: '#666' }}>
            {seoData.content_length && (
              <span>
                <InfoCircleOutlined style={{ marginRight: 4 }} />
                {seoData.content_length} ký tự
              </span>
            )}
            {seoData.meta_keywords?.length && (
              <span>
                <InfoCircleOutlined style={{ marginRight: 4 }} />
                {seoData.meta_keywords.length} keywords
              </span>
            )}
          </Space>
        )}
      </Space>
    </div>
  );
};