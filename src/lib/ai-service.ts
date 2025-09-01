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

// Rule-based AI Engine
class RuleBasedAI {
  private readonly descriptionTemplates = [
    "Hình ảnh {fileName} chất lượng cao, tối ưu cho SEO và trải nghiệm người dùng tốt nhất.",
    "Khám phá {fileName} với độ phân giải cao, phù hợp cho website và marketing chuyên nghiệp.",
    "{fileName} - Tài nguyên hình ảnh chất lượng, tối ưu cho tốc độ tải và SEO.",
    "Tải xuống {fileName} miễn phí, hình ảnh chuyên nghiệp cho mọi dự án thiết kế.",
    "{fileName} - Bộ sưu tập hình ảnh đa dạng, phù hợp cho nội dung sáng tạo.",
    "Hình ảnh {fileName} chuyên nghiệp, hỗ trợ đa định dạng và tương thích mọi trình duyệt.",
    "Khám phá vẻ đẹp của {fileName} qua góc nhìn chuyên nghiệp và chất lượng cao.",
    "{fileName} - Bức ảnh được chụp với độ phân giải cao, phù hợp cho nhiều mục đích sử dụng.",
    "Tài liệu hình ảnh {fileName} chất lượng, sẵn sàng sử dụng cho website và marketing.",
    "{fileName} - Hình ảnh tối ưu cho thiết kế và marketing, đảm bảo chất lượng cao.",
  ];

  private readonly keywordCategories = {
    quality: ["chất lượng cao", "độ phân giải cao", "chuyên nghiệp", "tối ưu"],
    seo: ["SEO", "tối ưu SEO", "tìm kiếm", "marketing"],
    design: ["thiết kế", "sáng tạo", "nội dung", "website"],
    format: ["hình ảnh", "ảnh đẹp", "tài liệu", "tài nguyên"],
    usage: ["miễn phí", "download", "sử dụng", "dự án"],
  };

  generateMetaDescription(request: AISuggestionRequest): string {
    const { fileName } = request;

    // Extract base name without extension and clean it
    const baseName = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");

    // Choose template based on context
    let template =
      this.descriptionTemplates[
        Math.floor(Math.random() * this.descriptionTemplates.length)
      ];

    // Replace {fileName} with baseName only (no duplicates)
    template = template.replace("{fileName}", baseName);

    return template;
  }

  generateMetaKeywords(request: AISuggestionRequest): string[] {
    const { fileName } = request;

    // Extract base name and create multi-word keywords from filename
    const baseName = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    const words = baseName.toLowerCase().split(" ").filter((word) => word.length >= 2);
    
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

    // Add category keywords (2-3 words each)
    const categoryKeywords = [
      "chất lượng cao",
      "tối ưu SEO",
      "thiết kế chuyên nghiệp",
      "hình ảnh đẹp",
      "tài nguyên miễn phí",
      "nội dung sáng tạo",
      "marketing chuyên nghiệp",
      "website tối ưu",
      "tài liệu chất lượng",
      "ảnh chuyên nghiệp",
    ];

    // Combine and deduplicate
    const allKeywords = [...fileNameKeywords, ...categoryKeywords];

    // Remove duplicates and limit to 12 keywords
    const uniqueKeywords = [...new Set(allKeywords)].slice(0, 12);

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

// External AI API Services
class OpenAI {
  constructor(private apiKey: string) {}

  async generateSuggestions(
    request: AISuggestionRequest
  ): Promise<AISuggestionResponse> {
    try {
             const prompt = `Tạo Meta Description và Keywords SEO cho hình ảnh:
 - Tên file: ${request.fileName}
 - Alt text: ${request.altText || "Không có"}
 - Title: ${request.title || "Không có"}
 - Caption: ${request.caption || "Không có"}

 Yêu cầu:
 1. Meta Description: 150-160 ký tự, tối ưu SEO, hấp dẫn
 2. Keywords: 10-12 từ khóa, MỖI KEYWORD PHẢI CÓ TỪ 2-3 TỪ TRỞ LÊN, phân cách bằng dấu phẩy
    Ví dụ: "laptop gaming asus", "thiết kế chuyên nghiệp", "tối ưu SEO"

 Trả về JSON format:
 {
   "metaDescription": "...",
   "keywords": ["keyword1", "keyword2", ...]
 }`;

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

      // Parse JSON response
      const parsed = JSON.parse(content);

      return {
        metaDescription: parsed.metaDescription,
        metaKeywords: parsed.keywords,
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
             const prompt = `Tạo Meta Description và Keywords SEO cho hình ảnh:
 - Tên file: ${request.fileName}
 - Alt text: ${request.altText || "Không có"}
 - Title: ${request.title || "Không có"}
 - Caption: ${request.caption || "Không có"}

 Yêu cầu:
 1. Meta Description: 150-160 ký tự, tối ưu SEO, hấp dẫn
 2. Keywords: 10-12 từ khóa, MỖI KEYWORD PHẢI CÓ TỪ 2-3 TỪ TRỞ LÊN, phân cách bằng dấu phẩy
    Ví dụ: "laptop gaming asus", "thiết kế chuyên nghiệp", "tối ưu SEO"

 Trả về JSON format:
 {
   "metaDescription": "...",
   "keywords": ["keyword1", "keyword2", ...]
 }`;

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

      // Parse JSON response
      const parsed = JSON.parse(content);

      return {
        metaDescription: parsed.metaDescription,
        metaKeywords: parsed.keywords,
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
    // Try external AI first if enabled
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
        console.warn("External AI failed, falling back to rule-based:", error);

        if (!this.config.fallbackToRuleBased) {
          throw error;
        }
      }
    }

    // Fallback to rule-based AI
    return await this.ruleBasedAI.generateSuggestions(request);
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
