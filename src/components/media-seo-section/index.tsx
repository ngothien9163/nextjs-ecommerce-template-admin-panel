import React from "react";
import { Form, Input, Button, Space, Tooltip } from "antd";
import { TagsOutlined, InfoCircleOutlined } from "@ant-design/icons";

interface MediaSEOSectionProps {
  mode?: 'create' | 'edit';
  onAutoFillSEOScores?: () => void;
}

export const MediaSEOSection: React.FC<MediaSEOSectionProps> = ({ 
  mode = 'create',
  onAutoFillSEOScores
}) => {
  return (
    <>
      <Form.Item
        label={
          <Space>
            <TagsOutlined />
            SEO Score
            <Tooltip title="Điểm SEO của media (0-100) - Càng cao càng tốt. Giá trị hợp lý: 80-95">
              <InfoCircleOutlined style={{ color: "#1890ff" }} />
            </Tooltip>
          </Space>
        }
        name="seo_score"
        initialValue={0}
      >
        <Input type="number" min={0} max={100} placeholder="0-100" />
      </Form.Item>

      <Form.Item
        label={
          <Space>
            <TagsOutlined />
            Accessibility Score
            <Tooltip title="Điểm accessibility (0-100) - Hỗ trợ người khuyết tật. Giá trị hợp lý: 85-95">
              <InfoCircleOutlined style={{ color: "#1890ff" }} />
            </Tooltip>
          </Space>
        }
        name="accessibility_score"
        initialValue={0}
      >
        <Input type="number" min={0} max={100} placeholder="0-100" />
      </Form.Item>

      <Form.Item
        label={
          <Space>
            <TagsOutlined />
            Performance Score
            <Tooltip title="Điểm performance (0-100) - Tốc độ tải và hiệu năng. Giá trị hợp lý: 85-95">
              <InfoCircleOutlined style={{ color: "#1890ff" }} />
            </Tooltip>
          </Space>
        }
        name="performance_score"
        initialValue={0}
      >
        <Input type="number" min={0} max={100} placeholder="0-100" />
      </Form.Item>

      <Form.Item
        label={
          <Space>
            <TagsOutlined />
            Usage Count
            <Tooltip title="Số lần file được sử dụng trong hệ thống. Giá trị hợp lý: 0-10">
              <InfoCircleOutlined style={{ color: "#1890ff" }} />
            </Tooltip>
          </Space>
        }
        name="usage_count"
        initialValue={0}
      >
        <Input 
          type="number" 
          min={0} 
          placeholder="Số lần sử dụng" 
          readOnly 
          style={{ backgroundColor: '#f6ffed' }} 
        />
      </Form.Item>

      <Form.Item
        label={
          <Space>
            <TagsOutlined />
            Version
            <Tooltip title="Phiên bản của file, bắt đầu từ 1. Giá trị hợp lý: 1-4">
              <InfoCircleOutlined style={{ color: "#1890ff" }} />
            </Tooltip>
          </Space>
        }
        name="version"
        initialValue={1}
      >
        <Input type="number" min={1} placeholder="Phiên bản file" />
      </Form.Item>

      {mode === 'create' && onAutoFillSEOScores && (
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <Button
            size="small"
            type="dashed"
            onClick={onAutoFillSEOScores}
            title="Điền các giá trị SEO hợp lý"
          >
            🔄 Gợi ý SEO Scores
          </Button>
        </div>
      )}
    </>
  );
};
