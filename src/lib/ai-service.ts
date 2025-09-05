// AI Service Layer - Hybrid Rule-based + External API
export interface AISuggestionRequest {
  fileName: string;
  altText?: string;
  title?: string;
  caption?: string;
  context?: string;
}

export interface AISuggestionResponse {
  metaDescription: string;
  metaKeywords: string[];
  confidence: number;
  source: "rule-based" | "openai" | "gemini" | "claude";
}

// Alias for backward compatibility
export interface AIResponse {
  metaDescription: string;
  keywords: string[];
}

export interface AIConfig {
  enableExternalAI: boolean;
  preferredProvider: "openai" | "gemini" | "claude";
  openaiApiKey?: string;
  geminiApiKey?: string;
  claudeApiKey?: string;
  fallbackToRuleBased: boolean;
}

// Default AI configuration
export const defaultAIConfig: AIConfig = {
  enableExternalAI: false,
  preferredProvider: "openai",
  fallbackToRuleBased: true,
};

// Storage keys for localStorage
const STORAGE_KEYS = {
  AI_CONFIG: "ai_config",
  OPENAI_API_KEY: "openai_api_key",
  GEMINI_API_KEY: "gemini_api_key",
  CLAUDE_API_KEY: "claude_api_key",
};

// Helper functions for localStorage
const saveToStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("Failed to save to localStorage:", error);
  }
};

const loadFromStorage = (key: string, defaultValue: any = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn("Failed to load from localStorage:", error);
    return defaultValue;
  }
};

const removeFromStorage = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn("Failed to remove from localStorage:", error);
  }
};

// Fallback AI Engine (used only when external AI is unavailable)
class RuleBasedAI {
  generateMetaDescription(request: AISuggestionRequest): string {
    const { fileName, altText, title, caption } = request;

    // Extract base name without extension and clean it
    const baseName = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");

    // Create a dynamic description based on available context
    let description = `Hình ảnh ${baseName}`;

    if (altText) {
      description += ` - ${altText}`;
    }

    if (title) {
      description += ` với tiêu đề "${title}"`;
    }

    description +=
      ". Chất lượng cao, tối ưu cho SEO và trải nghiệm người dùng.";

    // Ensure description is within optimal length (120-160 characters)
    if (description.length > 160) {
      description = description.substring(0, 157) + "...";
    }

    return description;
  }

  generateMetaKeywords(request: AISuggestionRequest): string[] {
    const { fileName, altText, title, caption } = request;

    // Extract base name and create keywords from filename
    const baseName = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    const words = baseName
      .toLowerCase()
      .split(" ")
      .filter((word) => word.length >= 2);

    // Create multi-word combinations from filename (2-3 words)
    const fileNameKeywords: string[] = [];
    for (let i = 0; i < words.length; i++) {
      // Add 2-word combinations
      if (i < words.length - 1) {
        fileNameKeywords.push(`${words[i]} ${words[i + 1]}`);
      }
      // Add 3-word combinations
      if (i < words.length - 2) {
        fileNameKeywords.push(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
      }
    }

    // Add single words from filename
    fileNameKeywords.push(...words);

    // Add context-based keywords from altText, title, caption
    const contextWords: string[] = [];
    if (altText) {
      contextWords.push(
        ...altText
          .toLowerCase()
          .split(" ")
          .filter((word) => word.length >= 2)
      );
    }
    if (title) {
      contextWords.push(
        ...title
          .toLowerCase()
          .split(" ")
          .filter((word) => word.length >= 2)
      );
    }
    if (caption) {
      contextWords.push(
        ...caption
          .toLowerCase()
          .split(" ")
          .filter((word) => word.length >= 2)
      );
    }

    // Create combinations from context words
    for (let i = 0; i < contextWords.length; i++) {
      if (i < contextWords.length - 1) {
        fileNameKeywords.push(`${contextWords[i]} ${contextWords[i + 1]}`);
      }
    }

    // Add common SEO keywords dynamically
    const seoKeywords = [
      "hình ảnh",
      "ảnh đẹp",
      "chất lượng cao",
      "tối ưu SEO",
      "thiết kế",
      "marketing",
      "website",
      "tài nguyên",
      "đồ họa",
      "sáng tạo",
      "chuyên nghiệp",
      "tải xuống",
    ];

    // Combine all keywords
    const allKeywords = [...fileNameKeywords, ...seoKeywords, ...contextWords];

    // Remove duplicates, filter by length, and limit to 12 keywords
    const uniqueKeywords = [...new Set(allKeywords)]
      .filter((keyword) => keyword.length >= 3 && keyword.length <= 50)
      .slice(0, 12);

    return uniqueKeywords;
  }

  async generateSuggestions(
    request: AISuggestionRequest
  ): Promise<AISuggestionResponse> {
    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      metaDescription: this.generateMetaDescription(request),
      metaKeywords: this.generateMetaKeywords(request),
      confidence: 0.85,
      source: "rule-based",
    };
  }
}

// Common prompt generator for all AI providers
// This ensures consistency across OpenAI, Gemini, and future AI providers
function generateSEOContentPrompt(request: AISuggestionRequest): string {
  return `Tạo Meta Description và Keywords SEO cho hình ảnh:
 - Tên file: ${request.fileName}
 - Alt text: ${request.altText || "Không có"}
 - Title: ${request.title || "Không có"}
 - Caption: ${request.caption || "Không có"}

 Yêu cầu NGHIÊM NGẶT:
  1. Meta Description: TỐI ĐA 160 ký tự, TỐI THIỂU 120 ký tự, tối ưu SEO, hấp dẫn.
  2. Keywords: 5-7 từ khóa, mỗi keyword 2-4 từ trở lên, phân cách bằng dấu phẩy.
     Ví dụ: "laptop gaming asus", "thiết kế chuyên nghiệp", "tối ưu SEO"

  QUAN TRỌNG: Meta Description PHẢI dưới 160 ký tự! Nếu vượt quá sẽ bị cắt ngắn.

  Trả về CHỈ JSON format, không có text khác:
  {
    "metaDescription": "...",
    "keywords": ["keyword1", "keyword2", ...]
  }`;
}

// External AI API Services
class OpenAI {
  constructor(private apiKey: string) {}

  async generateSuggestions(
    request: AISuggestionRequest
  ): Promise<AISuggestionResponse> {
    try {
      const prompt = generateSEOContentPrompt(request);

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 500,
            temperature: 0.7,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;

      // Extract JSON from the response (remove markdown code blocks if present)
      let jsonString = content;
      if (content.includes("```json")) {
        jsonString = content.replace(/```json\n?/g, "").replace(/```\n?/g, "");
      }

      // Parse JSON response
      const parsed = JSON.parse(jsonString.trim());

      // Validate and truncate Meta Description to optimal SEO length (150-160 characters)
      let metaDescription = parsed.metaDescription || "";
      if (metaDescription.length > 160) {
        // Find the last complete sentence within 150 characters
        const truncated = metaDescription.substring(0, 150);
        const lastSentenceEnd = Math.max(
          truncated.lastIndexOf("。"),
          truncated.lastIndexOf(". "),
          truncated.lastIndexOf("! "),
          truncated.lastIndexOf("? ")
        );

        if (lastSentenceEnd > 100) {
          // Only truncate at sentence if we have at least 100 chars
          metaDescription = metaDescription.substring(0, lastSentenceEnd + 1);
        } else {
          // Fallback: truncate at word boundary
          const lastSpace = truncated.lastIndexOf(" ");
          metaDescription =
            lastSpace > 100
              ? metaDescription.substring(0, lastSpace) + "..."
              : metaDescription.substring(0, 150) + "...";
        }
      }

      // Validate and limit keywords (max 12 keywords, each max 50 chars)
      let keywords = Array.isArray(parsed.keywords) ? parsed.keywords : [];
      keywords = keywords
        .filter((keyword: string) => keyword && typeof keyword === "string")
        .map((keyword: string) =>
          keyword.length > 50 ? keyword.substring(0, 47) + "..." : keyword
        )
        .slice(0, 12);

      return {
        metaDescription,
        metaKeywords: keywords,
        confidence: 0.95,
        source: "openai",
      };
    } catch (error) {
      console.error("OpenAI API error:", error);
      throw error;
    }
  }
}

class Gemini {
  constructor(private apiKey: string) {}

  async generateSuggestions(
    request: AISuggestionRequest
  ): Promise<AISuggestionResponse> {
    try {
      const prompt = generateSEOContentPrompt(request);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.candidates[0].content.parts[0].text;

      // Extract JSON from the response (remove markdown code blocks if present)
      let jsonString = content;
      if (content.includes("```json")) {
        jsonString = content.replace(/```json\n?/g, "").replace(/```\n?/g, "");
      }

      // Parse JSON response
      const parsed = JSON.parse(jsonString.trim());

      // Validate and truncate Meta Description to optimal SEO length (150-160 characters)
      let metaDescription = parsed.metaDescription || "";
      if (metaDescription.length > 160) {
        // Find the last complete sentence within 150 characters
        const truncated = metaDescription.substring(0, 150);
        const lastSentenceEnd = Math.max(
          truncated.lastIndexOf("。"),
          truncated.lastIndexOf(". "),
          truncated.lastIndexOf("! "),
          truncated.lastIndexOf("? ")
        );

        if (lastSentenceEnd > 100) {
          // Only truncate at sentence if we have at least 100 chars
          metaDescription = metaDescription.substring(0, lastSentenceEnd + 1);
        } else {
          // Fallback: truncate at word boundary
          const lastSpace = truncated.lastIndexOf(" ");
          metaDescription =
            lastSpace > 100
              ? metaDescription.substring(0, lastSpace) + "..."
              : metaDescription.substring(0, 150) + "...";
        }
      }

      // Validate and limit keywords (max 12 keywords, each max 50 chars)
      let keywords = Array.isArray(parsed.keywords) ? parsed.keywords : [];
      keywords = keywords
        .filter((keyword: string) => keyword && typeof keyword === "string")
        .map((keyword: string) =>
          keyword.length > 50 ? keyword.substring(0, 47) + "..." : keyword
        )
        .slice(0, 12);

      return {
        metaDescription,
        metaKeywords: keywords,
        confidence: 0.92,
        source: "gemini",
      };
    } catch (error) {
      console.error("Gemini API error:", error);
      throw error;
    }
  }
}

// Main AI Service
export class AIService {
  private ruleBasedAI: RuleBasedAI;
  private openai?: OpenAI;
  private gemini?: Gemini;
  private config: AIConfig;

  constructor(config?: AIConfig) {
    // Load config from localStorage or use provided/default config
    const savedConfig = loadFromStorage(
      STORAGE_KEYS.AI_CONFIG,
      defaultAIConfig
    );
    this.config = config || savedConfig;

    // Load API keys from localStorage
    this.config.openaiApiKey =
      this.config.openaiApiKey || loadFromStorage(STORAGE_KEYS.OPENAI_API_KEY);
    this.config.geminiApiKey =
      this.config.geminiApiKey || loadFromStorage(STORAGE_KEYS.GEMINI_API_KEY);
    this.config.claudeApiKey =
      this.config.claudeApiKey || loadFromStorage(STORAGE_KEYS.CLAUDE_API_KEY);

    this.ruleBasedAI = new RuleBasedAI();

    if (this.config.openaiApiKey) {
      this.openai = new OpenAI(this.config.openaiApiKey);
    }

    if (this.config.geminiApiKey) {
      this.gemini = new Gemini(this.config.geminiApiKey);
    }
  }

  async generateSuggestions(
    request: AISuggestionRequest
  ): Promise<AISuggestionResponse> {
    // If external AI is enabled, try it first
    if (this.config.enableExternalAI) {
      try {
        switch (this.config.preferredProvider) {
          case "openai":
            if (this.openai) {
              return await this.openai.generateSuggestions(request);
            }
            break;
          case "gemini":
            if (this.gemini) {
              return await this.gemini.generateSuggestions(request);
            }
            break;
        }
      } catch (error) {
        console.warn("External AI failed:", error);

        if (!this.config.fallbackToRuleBased) {
          throw error;
        }
      }
    }

    // Only use rule-based AI if external AI is disabled OR if fallback is enabled and external AI failed
    if (!this.config.enableExternalAI || this.config.fallbackToRuleBased) {
      return await this.ruleBasedAI.generateSuggestions(request);
    }

    // If external AI is enabled but no provider is available and no fallback, throw error
    throw new Error(
      "External AI is enabled but no valid provider or API key is configured"
    );
  }

  updateConfig(newConfig: Partial<AIConfig>) {
    this.config = { ...this.config, ...newConfig };

    // Save config to localStorage
    saveToStorage(STORAGE_KEYS.AI_CONFIG, {
      enableExternalAI: this.config.enableExternalAI,
      preferredProvider: this.config.preferredProvider,
      fallbackToRuleBased: this.config.fallbackToRuleBased,
    });

    // Save API keys to localStorage
    if (newConfig.openaiApiKey !== undefined) {
      if (newConfig.openaiApiKey) {
        saveToStorage(STORAGE_KEYS.OPENAI_API_KEY, newConfig.openaiApiKey);
        this.openai = new OpenAI(newConfig.openaiApiKey);
      } else {
        removeFromStorage(STORAGE_KEYS.OPENAI_API_KEY);
        this.openai = undefined;
      }
    }

    if (newConfig.geminiApiKey !== undefined) {
      if (newConfig.geminiApiKey) {
        saveToStorage(STORAGE_KEYS.GEMINI_API_KEY, newConfig.geminiApiKey);
        this.gemini = new Gemini(newConfig.geminiApiKey);
      } else {
        removeFromStorage(STORAGE_KEYS.GEMINI_API_KEY);
        this.gemini = undefined;
      }
    }

    if (newConfig.claudeApiKey !== undefined) {
      if (newConfig.claudeApiKey) {
        saveToStorage(STORAGE_KEYS.CLAUDE_API_KEY, newConfig.claudeApiKey);
      } else {
        removeFromStorage(STORAGE_KEYS.CLAUDE_API_KEY);
      }
    }
  }

  getConfig(): AIConfig {
    return { ...this.config };
  }

  // Clear all stored API keys
  clearApiKeys() {
    removeFromStorage(STORAGE_KEYS.OPENAI_API_KEY);
    removeFromStorage(STORAGE_KEYS.GEMINI_API_KEY);
    removeFromStorage(STORAGE_KEYS.CLAUDE_API_KEY);

    this.config.openaiApiKey = undefined;
    this.config.geminiApiKey = undefined;
    this.config.claudeApiKey = undefined;
    this.openai = undefined;
    this.gemini = undefined;
  }

  // Check if API key exists for a provider
  hasApiKey(provider: "openai" | "gemini" | "claude"): boolean {
    switch (provider) {
      case "openai":
        return !!this.config.openaiApiKey;
      case "gemini":
        return !!this.config.geminiApiKey;
      case "claude":
        return !!this.config.claudeApiKey;
      default:
        return false;
    }
  }

  // Get masked API key for display
  getMaskedApiKey(provider: "openai" | "gemini" | "claude"): string {
    let apiKey = "";
    switch (provider) {
      case "openai":
        apiKey = this.config.openaiApiKey || "";
        break;
      case "gemini":
        apiKey = this.config.geminiApiKey || "";
        break;
      case "claude":
        apiKey = this.config.claudeApiKey || "";
        break;
    }

    if (!apiKey) return "";

    // Mask the key: show first 4 and last 4 characters
    if (apiKey.length <= 8) return "••••••••";
    return `${apiKey.substring(0, 4)}••••${apiKey.substring(
      apiKey.length - 4
    )}`;
  }
}

// Singleton instance
export const aiService = new AIService();
