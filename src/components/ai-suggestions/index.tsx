import React, { useState } from "react";
import {
  Button,
  Space,
  message,
  Spin,
  Card,
  Tag,
  Tooltip,
  Switch,
  Input,
  Modal,
} from "antd";
import {
  RobotOutlined,
  LoadingOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  ThunderboltOutlined,
  BulbOutlined,
} from "@ant-design/icons";
import { aiService, AISuggestionRequest, AIConfig } from "../../lib/ai-service";

interface AISuggestionsProps {
  fileName?: string;
  altText?: string;
  title?: string;
  caption?: string;
  onMetaDescriptionSuggest: (suggestion: string) => void;
  onMetaKeywordsSuggest: (keywords: string[]) => void;
}

export const AISuggestions: React.FC<AISuggestionsProps> = ({
  fileName = "",
  altText,
  title,
  caption,
  onMetaDescriptionSuggest,
  onMetaKeywordsSuggest,
}) => {
  const [loadingDescription, setLoadingDescription] = useState(false);
  const [loadingKeywords, setLoadingKeywords] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [aiConfig, setAiConfig] = useState<AIConfig>(aiService.getConfig());

  const handleGenerateDescription = async () => {
    if (!fileName) {
      message.warning("Vui lòng nhập tên file trước!");
      return;
    }

    setLoadingDescription(true);
    try {
      const request: AISuggestionRequest = {
        fileName,
        altText,
        title,
        caption,
      };

      const response = await aiService.generateSuggestions(request);
      onMetaDescriptionSuggest(response.metaDescription);

      message.success(
        `Đã tạo Meta Description (${response.metaDescription.length} ký tự) bằng ${
          response.source === "rule-based"
            ? "AI thông minh (miễn phí)"
            : `${response.source.toUpperCase()} API`
        }!`
      );
    } catch (error) {
      message.error("Lỗi khi tạo Meta Description!");
      console.error("AI Description Error:", error);
    } finally {
      setLoadingDescription(false);
    }
  };

  const handleGenerateKeywords = async () => {
    if (!fileName) {
      message.warning("Vui lòng nhập tên file trước!");
      return;
    }

    setLoadingKeywords(true);
    try {
      const request: AISuggestionRequest = {
        fileName,
        altText,
        title,
        caption,
      };

      const response = await aiService.generateSuggestions(request);
      onMetaKeywordsSuggest(response.metaKeywords);

      message.success(
        `Đã tạo ${response.metaKeywords.length} Meta Keywords bằng ${
          response.source === "rule-based"
            ? "AI thông minh (miễn phí)"
            : `${response.source.toUpperCase()} API`
        }!`
      );
    } catch (error) {
      message.error("Lỗi khi tạo Meta Keywords!");
      console.error("AI Keywords Error:", error);
    } finally {
      setLoadingKeywords(false);
    }
  };

  const handleGenerateAll = async () => {
    if (!fileName) {
      message.warning("Vui lòng nhập tên file trước!");
      return;
    }

    setLoadingAll(true);
    try {
      const request: AISuggestionRequest = {
        fileName,
        altText,
        title,
        caption,
      };

      const response = await aiService.generateSuggestions(request);
      onMetaDescriptionSuggest(response.metaDescription);
      onMetaKeywordsSuggest(response.metaKeywords);

      message.success(
        `Đã tạo tất cả bằng ${
          response.source === "rule-based"
            ? "AI thông minh (miễn phí)"
            : `${response.source.toUpperCase()} API`
        }!`
      );
    } catch (error) {
      message.error("Lỗi khi tạo gợi ý AI!");
      console.error("AI All Error:", error);
    } finally {
      setLoadingAll(false);
    }
  };

  const handleConfigChange = (newConfig: Partial<AIConfig>) => {
    const updatedConfig = { ...aiConfig, ...newConfig };
    setAiConfig(updatedConfig);
    aiService.updateConfig(updatedConfig);
    message.success("Cấu hình AI đã được cập nhật!");
  };

  const renderAISource = () => {
    if (aiConfig.enableExternalAI) {
      return (
        <Tag color="blue" icon={<ThunderboltOutlined />}>
          {aiConfig.preferredProvider.toUpperCase()}
        </Tag>
      );
    }
    return (
      <Tag color="green" icon={<BulbOutlined />}>
        AI Thông minh
      </Tag>
    );
  };

  return (
    <>
      <Card
        size="small"
        style={{
          marginBottom: "16px",
          background: "linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 100%)",
          border: "1px solid #d6e4ff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontWeight: "bold",
              color: "#1890ff",
            }}
          >
            <RobotOutlined />
            AI Gợi ý SEO
            {renderAISource()}
          </div>
          <Button
            size="small"
            type="text"
            icon={<SettingOutlined />}
            onClick={() => setShowSettings(true)}
            title="Cài đặt AI"
          />
        </div>

        <div style={{ fontSize: "12px", color: "#666", marginBottom: "12px" }}>
          {aiConfig.enableExternalAI
            ? `Sử dụng ${aiConfig.preferredProvider.toUpperCase()} để tạo nội dung SEO chất lượng cao`
            : "Sử dụng AI thông minh để tự động tạo Meta Description và Keywords tối ưu cho SEO"
          }
        </div>

        <Space wrap>
          <Button
            size="small"
            type="primary"
            ghost
            icon={
              loadingDescription ? (
                <Spin indicator={<LoadingOutlined spin />} />
              ) : (
                <RobotOutlined />
              )
            }
            onClick={handleGenerateDescription}
            loading={loadingDescription}
            disabled={!fileName}
          >
            Tạo Meta Description
          </Button>

          <Button
            size="small"
            type="primary"
            ghost
            icon={
              loadingKeywords ? (
                <Spin indicator={<LoadingOutlined spin />} />
              ) : (
                <RobotOutlined />
              )
            }
            onClick={handleGenerateKeywords}
            loading={loadingKeywords}
            disabled={!fileName}
          >
            Tạo Meta Keywords
          </Button>

          <Button
            size="small"
            type="primary"
            icon={
              loadingAll ? (
                <Spin indicator={<LoadingOutlined spin />} />
              ) : (
                <CheckCircleOutlined />
              )
            }
            onClick={handleGenerateAll}
            loading={loadingAll}
            disabled={!fileName}
          >
            Tạo Tất Cả
          </Button>
        </Space>
      </Card>

      {/* AI Settings Modal */}
      <Modal
        title={
          <Space>
            <SettingOutlined />
            Cài đặt AI
          </Space>
        }
        open={showSettings}
        onCancel={() => setShowSettings(false)}
        footer={null}
        width={600}
      >
        <div style={{ marginBottom: "16px" }}>
          <div style={{ marginBottom: "12px" }}>
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
          </div>

          {aiConfig.enableExternalAI && (
            <div style={{ marginBottom: "12px" }}>
              <label>Provider:</label>
              <Space style={{ marginLeft: "8px" }}>
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
          )}

          {aiConfig.enableExternalAI &&
            aiConfig.preferredProvider === "openai" && (
              <div style={{ marginBottom: "12px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "4px",
                  }}
                >
                  <label>OpenAI API Key:</label>
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
            )}

          {aiConfig.enableExternalAI &&
            aiConfig.preferredProvider === "gemini" && (
              <div style={{ marginBottom: "12px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "4px",
                  }}
                >
                  <label>Gemini API Key:</label>
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
            )}

          <div style={{ marginBottom: "12px" }}>
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
        </div>

        <div
          style={{
            padding: "12px",
            backgroundColor: "#f6ffed",
            borderRadius: "6px",
            border: "1px solid #b7eb8f",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              color: "#52c41a",
              marginBottom: "4px",
            }}
          >
            💡 AI Thông minh (Miễn phí)
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            Sử dụng thuật toán thông minh dựa trên tên file, alt text và context
            để tạo nội dung SEO tối ưu.
          </div>
        </div>

        <div
          style={{
            padding: "12px",
            backgroundColor: "#fff7e6",
            borderRadius: "6px",
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
        </div>
      </Modal>
    </>
  );
};
