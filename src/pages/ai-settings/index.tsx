import React, { useState } from "react";
import {
  Card,
  Space,
  Switch,
  Button,
  Input,
  Tooltip,
  message,
  Typography,
  Divider,
} from "antd";
import {
  SettingOutlined,
  InfoCircleOutlined,
  RobotOutlined,
  ThunderboltOutlined,
  BulbOutlined,
} from "@ant-design/icons";
import { aiService, AIConfig } from "../../lib/ai-service";

const { Title, Text } = Typography;

export const AISettings: React.FC = () => {
  const [aiConfig, setAiConfig] = useState<AIConfig>(aiService.getConfig());

  const handleConfigChange = (newConfig: Partial<AIConfig>) => {
    const updatedConfig = { ...aiConfig, ...newConfig };
    setAiConfig(updatedConfig);
    aiService.updateConfig(updatedConfig);
    message.success("Cấu hình AI đã được cập nhật!");
  };

  const renderAISource = () => {
    if (aiConfig.enableExternalAI) {
      return (
        <span style={{ color: "#1890ff" }}>
          <ThunderboltOutlined /> {aiConfig.preferredProvider.toUpperCase()}
        </span>
      );
    }
    return (
      <span style={{ color: "#52c41a" }}>
        <BulbOutlined /> AI Thông minh
      </span>
    );
  };

  return (
    <div style={{ padding: "24px" }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Title level={2}>
            <RobotOutlined /> Cài đặt AI
          </Title>
          <Text type="secondary">
            Quản lý cấu hình AI - Ưu tiên sử dụng External AI cho chất lượng cao, chỉ dùng AI nội bộ khi cần thiết
          </Text>
        </div>

        <Card
          title={
            <Space>
              <SettingOutlined />
              Cấu hình AI
            </Space>
          }
          size="small"
        >
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <div>
              <Space>
                <Switch
                  checked={aiConfig.enableExternalAI}
                  onChange={(checked) =>
                    handleConfigChange({ enableExternalAI: checked })
                  }
                />
                <span>Bật External AI API</span>
                <Tooltip title="Sử dụng OpenAI/Gemini API để tạo nội dung chất lượng cao hơn">
                  <InfoCircleOutlined style={{ color: "#1890ff" }} />
                </Tooltip>
              </Space>
              <div style={{ marginTop: "8px" }}>
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Nguồn AI hiện tại: {renderAISource()}
                </Text>
              </div>
            </div>

            {aiConfig.enableExternalAI && (
              <>
                <Divider />
                <div>
                  <Text strong>Chọn Provider:</Text>
                  <Space style={{ marginLeft: "8px", marginTop: "8px" }}>
                    <Button
                      size="small"
                      type={
                        aiConfig.preferredProvider === "openai"
                          ? "primary"
                          : "default"
                      }
                      onClick={() =>
                        handleConfigChange({ preferredProvider: "openai" })
                      }
                    >
                      OpenAI
                    </Button>
                    <Button
                      size="small"
                      type={
                        aiConfig.preferredProvider === "gemini"
                          ? "primary"
                          : "default"
                      }
                      onClick={() =>
                        handleConfigChange({ preferredProvider: "gemini" })
                      }
                    >
                      Gemini
                    </Button>
                  </Space>
                </div>
              </>
            )}

            {aiConfig.enableExternalAI &&
              aiConfig.preferredProvider === "openai" && (
                <>
                  <Divider />
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "4px",
                      }}
                    >
                      <Text strong>OpenAI API Key:</Text>
                      {aiService.hasApiKey("openai") && (
                        <Button
                          size="small"
                          type="link"
                          danger
                          onClick={() => handleConfigChange({ openaiApiKey: "" })}
                        >
                          Xóa
                        </Button>
                      )}
                    </div>
                    <Input.Password
                      placeholder="sk-..."
                      value={aiConfig.openaiApiKey || ""}
                      onChange={(e) =>
                        handleConfigChange({ openaiApiKey: e.target.value })
                      }
                      style={{ marginTop: "4px" }}
                    />
                    {aiService.hasApiKey("openai") && (
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#52c41a",
                          marginTop: "2px",
                        }}
                      >
                        ✅ Đã lưu: {aiService.getMaskedApiKey("openai")}
                      </div>
                    )}
                  </div>
                </>
              )}

            {aiConfig.enableExternalAI &&
              aiConfig.preferredProvider === "gemini" && (
                <>
                  <Divider />
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "4px",
                      }}
                    >
                      <Text strong>Gemini API Key:</Text>
                      {aiService.hasApiKey("gemini") && (
                        <Button
                          size="small"
                          type="link"
                          danger
                          onClick={() => handleConfigChange({ geminiApiKey: "" })}
                        >
                          Xóa
                        </Button>
                      )}
                    </div>
                    <Input.Password
                      placeholder="AI..."
                      value={aiConfig.geminiApiKey || ""}
                      onChange={(e) =>
                        handleConfigChange({ geminiApiKey: e.target.value })
                      }
                      style={{ marginTop: "4px" }}
                    />
                    {aiService.hasApiKey("gemini") && (
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#52c41a",
                          marginTop: "2px",
                        }}
                      >
                        ✅ Đã lưu: {aiService.getMaskedApiKey("gemini")}
                      </div>
                    )}
                  </div>
                </>
              )}

            <Divider />
            <div>
              <Space>
                <Switch
                  checked={aiConfig.fallbackToRuleBased}
                  onChange={(checked) =>
                    handleConfigChange({ fallbackToRuleBased: checked })
                  }
                />
                <span>Fallback về AI thông minh</span>
                <Tooltip title="Tự động chuyển về AI thông minh nếu External API lỗi">
                  <InfoCircleOutlined style={{ color: "#1890ff" }} />
                </Tooltip>
              </Space>
            </div>
          </Space>
        </Card>

        <Card
          size="small"
          style={{
            backgroundColor: "#f6ffed",
            border: "1px solid #b7eb8f",
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              color: "#52c41a",
              marginBottom: "4px",
            }}
          >
            🔄 AI Nội bộ (Fallback)
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            Chỉ sử dụng khi External AI không khả dụng. Tạo nội dung dựa trên
            tên file và context có sẵn, không dùng templates cố định.
          </div>
        </Card>

        <Card
          size="small"
          style={{
            backgroundColor: "#fff7e6",
            border: "1px solid #ffd591",
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              color: "#fa8c16",
              marginBottom: "4px",
            }}
          >
            🔐 Lưu trữ API Keys
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            API Keys được lưu an toàn trong <strong>localStorage</strong> của
            trình duyệt. Chỉ bạn có thể truy cập và sử dụng. Keys sẽ được lưu
            trữ bền vững giữa các phiên làm việc.
          </div>
        </Card>
      </Space>
    </div>
  );
};