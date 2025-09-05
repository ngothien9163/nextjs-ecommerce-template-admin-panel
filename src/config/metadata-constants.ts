// Metadata constants cho WebP images - Single file configuration
// Tất cả metadata config được quản lý tại đây, không cần file riêng cho production

// 📝 LƯờI GIẢI THÍCH VỀ METADATA:
// - Company info (copyright, creator, website, etc.): GIỐNG NHAU cho tất cả ảnh
// - Image-specific info (caption_description, keywords): KHÁC NHAU cho từng ảnh
//   + Lấy từ form data khi upload (alt_text, title, meta_keywords, etc.)
//   + Hệ thống tự động extract và override UNIFIED_METADATA
//   + Nếu không có thì dùng fallback từ UNIFIED_METADATA

export interface MetadataConfig {
  copyright: string;
  creator_artist: string;
  credit: string;
  caption_description: string;
  contact_url: string;
  keywords: string[];
  software: string;
  user_comment: string;
  company_name: string;
  website_url: string;
  email_contact: string;
}

// Cấu hình chung cho tất cả environments - chỉ chứa COMPANY INFO
// caption_description và keywords sẽ được lấy từ từng ảnh cụ thể
export const UNIFIED_METADATA: MetadataConfig = {
  // Company Information - SỬA THÔNG TIN CÔNG TY TẠI ĐÂY
  copyright: "© 2024 Your Company Name - All Rights Reserved",
  creator_artist: "Your Company Design Team",
  credit: "Your Company Marketing Department", 
  company_name: "Your Company Name",
  website_url: "https://yourcompany.com",
  email_contact: "contact@yourcompany.com",
  contact_url: "https://yourcompany.com/contact",
  
  // Technical Information - COMPANY STANDARD
  software: "Professional Image Processing Suite v2.0",
  user_comment: "Professionally processed product image",
  
  // DEFAULT FALLBACK - Chỉ dùng khi ảnh không có metadata riêng
  caption_description: "[FALLBACK] Image processed by company system",
  keywords: ["company", "professional", "quality"] // Sẽ được override bởi keywords của từng ảnh
};

// Development override - chỉ khác biệt minimal cho dev
export const DEV_OVERRIDES = {
  copyright: "© 2024 [DEV] Your Company Name - Development Mode",
  creator_artist: "Development Team",
  software: "Dev Image Processor v1.0",
  user_comment: "Development processed image",
  company_name: "[DEV] Your Company Name",
  website_url: "http://localhost:5176",
  email_contact: "dev@yourcompany.com",
  contact_url: "http://localhost:5176/contact",
  
  // FALLBACK cho dev - thực tế sẽ dùng metadata của từng ảnh
  caption_description: "[DEV FALLBACK] Image in development mode",
  keywords: ["development", "testing", "local"]
};

// Template-specific variations - kế thừa từ UNIFIED_METADATA
export const BLOG_METADATA: MetadataConfig = {
  ...UNIFIED_METADATA,
  caption_description: "Blog article illustration and content",
  keywords: ["blog", "article", "content", "illustration", "information"],
  user_comment: "Blog content image",
  credit: "Blog Editorial Team"
};

export const HERO_METADATA: MetadataConfig = {
  ...UNIFIED_METADATA,
  caption_description: "Hero banner showcasing premium products",
  keywords: ["hero", "banner", "marketing", "brand", "showcase"],
  user_comment: "Marketing hero image optimized for web",
  credit: "Brand Marketing Department"
};

export const PROFESSIONAL_METADATA: MetadataConfig = {
  ...UNIFIED_METADATA,
  caption_description: "Professional grade product photography",
  keywords: ["professional", "studio", "certified", "premium", "commercial"],
  user_comment: "Studio-grade professional image",
  credit: "Certified Professional Photographers"
};

// Main templates map - giờ lại các template để tương thích
export const METADATA_TEMPLATES = {
  default: UNIFIED_METADATA,      // Sử dụng UNIFIED thay vì DEFAULT
  production: UNIFIED_METADATA,   // Sử dụng UNIFIED thay vì PRODUCTION  
  blog: BLOG_METADATA,
  hero: HERO_METADATA,
  professional: PROFESSIONAL_METADATA
} as const;

// Type cho template names
export type MetadataTemplateName = keyof typeof METADATA_TEMPLATES;

// Environment detection function - đơn giản hóa
export function getCurrentEnvironment(): 'development' | 'production' | 'test' {
  // Trong Next.js, kiểm tra NODE_ENV
  if (typeof process !== 'undefined' && process.env.NODE_ENV) {
    return process.env.NODE_ENV as 'development' | 'production' | 'test';
  }
  
  // Fallback cho client-side
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'development';
    }
  }
  
  return 'production';
}

// Utility function - lấy metadata dựa trên environment 
export function getMetadataByEnvironment(): MetadataConfig {
  const env = getCurrentEnvironment();
  
  if (env === 'development') {
    // Development: Merge UNIFIED với DEV_OVERRIDES
    return {
      ...UNIFIED_METADATA,
      ...DEV_OVERRIDES
    };
  }
  
  // Production/test: Dùng UNIFIED_METADATA
  return UNIFIED_METADATA;
}

// Utility function - lấy metadata theo template name
export function getMetadataByTemplate(templateName: MetadataTemplateName): MetadataConfig {
  return METADATA_TEMPLATES[templateName];
}

// Utility function - merge custom metadata với template
export function mergeMetadata(
  base: MetadataConfig, 
  custom: Partial<MetadataConfig>
): MetadataConfig {
  return {
    ...base,
    ...custom,
    // Merge keywords arrays 
    keywords: custom.keywords || base.keywords
  };
}

// Export aliases để tương thích ngược
export {
  UNIFIED_METADATA as DEFAULT_METADATA,    // Alias cho cũ
  UNIFIED_METADATA as PRODUCTION_METADATA, // Alias cho cũ  
  UNIFIED_METADATA as DEFAULT,
  UNIFIED_METADATA as PRODUCTION,
  BLOG_METADATA as BLOG,
  HERO_METADATA as HERO,
  PROFESSIONAL_METADATA as PROFESSIONAL
};