// Metadata configuration for WebP images - Simplified with constants
import { 
  MetadataConfig, 
  getMetadataByEnvironment, 
  getMetadataByTemplate, 
  mergeMetadata,
  type MetadataTemplateName 
} from '../config/metadata-constants';

export interface ImageMetadataConfig {
  // Basic metadata
  title?: string;
  description?: string;
  copyright?: string;
  creator?: string;
  artist?: string;
  credit?: string;
  caption?: string;
  contact?: string;
  website?: string;
  email?: string;
  
  // Professional metadata
  software?: string;
  processingSoftware?: string; // Sửa từ processing软件
  keywords?: string[];
  subject?: string;
  category?: string;
  
  // Rights and licensing
  license?: string;
  rightsStatement?: string;
  usage?: string;
  
  // Technical metadata
  colorSpace?: string;
  orientation?: number;
  density?: number;
  
  // Custom fields
  customFields?: Record<string, string>;
}

// Đơn giản hóa: lấy metadata từ constants thay vì env
export const getDefaultMetadata = (): ImageMetadataConfig => {
  const config = getMetadataByEnvironment(); // Tự động detect dev/production
  
  return {
    software: config.software,
    processingSoftware: 'Next.js Admin Panel', // Sửa từ processing软件
    copyright: config.copyright,
    creator: config.creator_artist,
    artist: config.creator_artist,
    credit: config.credit,
    caption: config.caption_description,
    contact: config.contact_url,
    website: config.website_url,
    email: config.email_contact,
    keywords: config.keywords,
    colorSpace: 'sRGB',
    density: 300,
    orientation: 1,
    customFields: {
      'CompanyName': config.company_name,
      'Website': config.website_url,
      'Email': config.email_contact,
      'Environment': import.meta.env.MODE || 'development',
      'BuildDate': new Date().toISOString(),
      'Version': '1.0.0'
    }
  };
};

export const getMetadataForWebP = (config: Partial<ImageMetadataConfig> = {}): Record<string, any> => {
  const defaultConfig = getDefaultMetadata();
  const finalConfig = { ...defaultConfig, ...config };
  
  // EXIF data structure - Sharp requires IFD sections
  const exifData: Record<string, any> = {
    IFD0: {},  // Main image metadata
    ExifIFD: {}  // EXIF-specific metadata
  };
  
  // Basic EXIF fields in IFD0
  if (finalConfig.title) {
    exifData.IFD0.ImageDescription = finalConfig.title;
    exifData.IFD0.DocumentName = finalConfig.title;
  }
  
  if (finalConfig.description) {
    exifData.IFD0.ImageDescription = finalConfig.description;
    exifData.ExifIFD.UserComment = finalConfig.description;
  }
  
  if (finalConfig.copyright) {
    exifData.IFD0.Copyright = finalConfig.copyright;
  }
  
  if (finalConfig.creator || finalConfig.artist) {
    exifData.IFD0.Artist = finalConfig.creator || finalConfig.artist;
  }
  
  if (finalConfig.software) {
    exifData.IFD0.Software = finalConfig.software;
  }
  
  if (finalConfig.processingSoftware) {
    exifData.ExifIFD.ProcessingSoftware = finalConfig.processingSoftware;
  }
  
  // XMP-like metadata (stored in EXIF as custom fields)
  const xmpLikeData: Record<string, any> = {};
  
  // XMP fields for more detailed metadata
  if (finalConfig.credit) {
    xmpLikeData.Credit = finalConfig.credit;
    xmpLikeData.Source = finalConfig.credit;
  }
  
  if (finalConfig.caption) {
    xmpLikeData.Description = finalConfig.caption;
    xmpLikeData.Caption = finalConfig.caption;
  }
  
  if (finalConfig.contact) {
    xmpLikeData.CreatorContactInfo = finalConfig.contact;
  }
  
  if (finalConfig.website) {
    xmpLikeData.CreatorWorkURL = finalConfig.website;
  }
  
  if (finalConfig.email) {
    xmpLikeData.CreatorWorkEmail = finalConfig.email;
  }
  
  if (finalConfig.keywords && finalConfig.keywords.length > 0) {
    xmpLikeData.Keywords = finalConfig.keywords.join(', ');
    exifData.IFD0.XPKeywords = finalConfig.keywords.join(';');
  }
  
  if (finalConfig.subject) {
    xmpLikeData.Subject = finalConfig.subject;
  }
  
  if (finalConfig.category) {
    xmpLikeData.Category = finalConfig.category;
  }
  
  if (finalConfig.license) {
    xmpLikeData.Rights = finalConfig.license;
    xmpLikeData.UsageTerms = finalConfig.license;
  }
  
  if (finalConfig.rightsStatement) {
    xmpLikeData.RightsStatement = finalConfig.rightsStatement;
  }
  
  if (finalConfig.usage) {
    xmpLikeData.Instructions = finalConfig.usage;
  }
  
  // Add XMP-like data to a custom section
  if (Object.keys(xmpLikeData).length > 0) {
    exifData.IFD0['XMP'] = xmpLikeData;
  }
  
  // Custom fields
  if (finalConfig.customFields) {
    Object.entries(finalConfig.customFields).forEach(([key, value]) => {
      xmpLikeData[key] = value;
    });
  }
  
  return {
    orientation: finalConfig.orientation || 1,
    density: finalConfig.density || 300,
    exif: exifData,
    icc: finalConfig.colorSpace === 'sRGB' ? 'srgb' : undefined
  };
};;

// Predefined metadata templates - đơn giản hóa với constants
export const getMetadataTemplates = () => {
  return {
    // Template cho ảnh sản phẩm e-commerce
    ecommerce: {
      ...getMetadataByTemplate('production'),
      category: 'Product Photography',
      usage: 'Commercial product display',
      keywords: ['product', 'ecommerce', 'commercial', 'quality'],
      customFields: {
        'ProductCategory': 'General',
        'StoreSection': 'Main Catalog',
        'ImageType': 'Product'
      }
    },
    
    // Template cho ảnh blog/content  
    blog: {
      ...getMetadataByTemplate('blog'),
      customFields: {
        'ContentType': 'Blog Post',
        'PublicationStatus': 'Published'
      }
    },
    
    // Template cho ảnh hero/banner
    hero: {
      ...getMetadataByTemplate('hero'),
      customFields: {
        'ImageType': 'Hero Banner',
        'Priority': 'High'
      }
    },
    
    // Template cho ảnh professional
    professional: {
      ...getMetadataByTemplate('professional'),
      customFields: {
        'QualityLevel': 'Professional',
        'CommercialUse': 'Approved'
      }
    }
  };
};

// Helper function để extract metadata từ form data
export const extractMetadataFromForm = (formData: any): ImageMetadataConfig => {
  return {
    title: formData.title || formData.alt_text,
    description: formData.meta_description || formData.caption,
    copyright: formData.copyright,
    creator: formData.creator,
    artist: formData.artist,
    credit: formData.credit,
    caption: formData.caption,
    contact: formData.contact,
    website: formData.website,
    email: formData.email,
    keywords: parseMetaKeywords(formData.meta_keywords), // Sử dụng utility function
    subject: formData.subject,
    category: formData.category,
    license: formData.license,
    rightsStatement: formData.rights_statement,
    usage: formData.usage_terms,
    customFields: {
      'FileSource': 'Admin Panel Upload',
      'ProcessingDate': new Date().toISOString(),
      'Quality': 'High',
      'Approved': 'Yes'
    }
  };
};

// Helper function để validate metadata
export const validateMetadata = (metadata: ImageMetadataConfig): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (metadata.title && metadata.title.length > 200) {
    errors.push('Title quá dài (tối đa 200 ký tự)');
  }
  
  if (metadata.description && metadata.description.length > 500) {
    errors.push('Description quá dài (tối đa 500 ký tự)');
  }
  
  if (metadata.keywords && metadata.keywords.length > 20) {
    errors.push('Quá nhiều keywords (tối đa 20)');
  }
  
  if (metadata.copyright && metadata.copyright.length > 100) {
    errors.push('Copyright quá dài (tối đa 100 ký tự)');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

// Utility function để safely parse meta_keywords
export const parseMetaKeywords = (value: any): string[] => {
  if (!value) return [];
  
  // Nếu đã là array (từ Select mode="tags")
  if (Array.isArray(value)) {
    return value.filter(item => item && typeof item === 'string' && item.trim().length > 0);
  }
  
  // Nếu là string (từ TextArea hoặc Input)
  if (typeof value === 'string') {
    return value.split(',').map(k => k.trim()).filter(k => k.length > 0);
  }
  
  return [];
};