// Sharp configuration and enhancement options for WebP conversion

export interface WebPEnhancementOptions {
  // Quality settings
  quality?: number;
  alphaQuality?: number;
  effort?: number;
  lossless?: boolean;
  nearLossless?: boolean;
  
  // Resize options (optional - nếu không set sẽ giữ nguyên kích thước)
  maxWidth?: number;
  maxHeight?: number;
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  position?: string;
  background?: string;
  preserveOriginalSize?: boolean; // Mới: giữ nguyên kích thước gốc
  
  // Enhancement options
  sharpen?: boolean | { sigma?: number; flat?: number; jagged?: number };
  brightness?: number;
  saturation?: number;
  hue?: number;
  gamma?: number;
  normalize?: boolean;
  
  // Metadata options
  preserveMetadata?: boolean;
  metadataOnly?: boolean; // Mới: chỉ thay đổi metadata
  addCustomMetadata?: Record<string, string>;
  density?: number;
  
  // Advanced options
  blur?: number;
  median?: number;
  negate?: boolean;
  clahe?: boolean | { width?: number; height?: number; maxSlope?: number };
}

export const getOptimalWebPConfig = (
  fileSize: number,
  format: string,
  options: Partial<WebPEnhancementOptions> = {}
): WebPEnhancementOptions => {
  // Default config chỉ thay đổi metadata, giữ nguyên kích thước
  let baseConfig: WebPEnhancementOptions = {
    quality: 85, // Chất lượng cao hơn để giữ nguyên chất lượng
    alphaQuality: 85,
    effort: 4, // Giảm effort để tăng tốc độ khi chỉ đổi metadata
    lossless: false,
    nearLossless: false,
    
    // Giữ nguyên kích thước
    preserveOriginalSize: true,
    metadataOnly: true,
    
    // Không áp dụng các hiệu ứng
    sharpen: false,
    brightness: 1.0, // Giữ nguyên
    saturation: 1.0, // Giữ nguyên
    hue: 0,
    gamma: 1.0, // Giữ nguyên
    normalize: false, // Không tự động chỉnh
    
    preserveMetadata: true,
    density: 300,
    addCustomMetadata: {
      'EXIF:Software': 'Sharp WebP Metadata Converter v2.0',
      'EXIF:ProcessingSoftware': 'Next.js Admin Panel - Metadata Only',
      'XMP:ProcessingNote': 'Metadata updated, original quality preserved'
    }
  };

  // Chỉ điều chỉnh quality nếu file quá lớn
  if (fileSize > 10 * 1024 * 1024) { // > 10MB
    baseConfig.quality = 90; // Vẫn giữ chất lượng cao
    baseConfig.alphaQuality = 90;
  }

  // Merge với user options
  return { ...baseConfig, ...options };
};

export const getWebPPresets = () => ({
  // High quality for hero images
  hero: {
    quality: 85,
    alphaQuality: 85,
    effort: 6,
    maxWidth: 2048,
    maxHeight: 1536,
    sharpen: { sigma: 1.2, flat: 1.0, jagged: 2.5 },
    brightness: 1.08,
    saturation: 1.05,
    normalize: true
  },
  
  // Optimized for thumbnails
  thumbnail: {
    quality: 70,
    alphaQuality: 70,
    effort: 4,
    maxWidth: 400,
    maxHeight: 400,
    fit: 'cover' as const,
    sharpen: { sigma: 0.8, flat: 1.0, jagged: 1.5 },
    brightness: 1.02,
    saturation: 1.0
  },
  
  // Maximum compression for archives
  archive: {
    quality: 50,
    alphaQuality: 50,
    effort: 6,
    maxWidth: 1200,
    maxHeight: 800,
    sharpen: false,
    brightness: 1.0,
    saturation: 1.0,
    normalize: false
  },
  
  // Lossless for technical diagrams
  diagram: {
    quality: 100,
    lossless: true,
    effort: 6,
    maxWidth: 1920,
    maxHeight: 1080,
    sharpen: false,
    brightness: 1.0,
    saturation: 1.0,
    normalize: false
  }
});

export const applyWebPEnhancements = async (
  sharpInstance: any,
  config: WebPEnhancementOptions,
  metadata: any,
  customMetadata?: any
) => {
  // Apply metadata (luôn áp dụng)
  if (config.preserveMetadata) {
    // Extract metadata fields from customMetadata
    let exifData = {};
    let orientation = metadata.orientation || 1;
    let density = config.density || 300;
    let icc = 'srgb';
    
    if (customMetadata) {
      console.log('🔍 Processing customMetadata:', {
        hasExif: !!customMetadata.exif,
        metadataKeys: Object.keys(customMetadata),
        exifKeys: customMetadata.exif ? Object.keys(customMetadata.exif) : []
      });

      // Handle metadata object structure from getMetadataForWebP
      if (customMetadata.exif) {
        // This is the proper EXIF structure from getMetadataForWebP
        exifData = { ...config.addCustomMetadata, ...customMetadata.exif };

        // Extract other metadata fields if provided
        if (customMetadata.orientation !== undefined) {
          orientation = customMetadata.orientation;
        }
        if (customMetadata.density !== undefined) {
          density = customMetadata.density;
        }
        if (customMetadata.icc !== undefined) {
          icc = customMetadata.icc;
        }
      } else {
        // Fallback for direct metadata fields
        exifData = { ...config.addCustomMetadata, ...customMetadata };
      }
    } else {
      exifData = { ...config.addCustomMetadata };
    }

    console.log('📋 Final metadata for Sharp:', {
      exifDataKeys: Object.keys(exifData),
      orientation,
      density,
      icc,
      hasExifData: Object.keys(exifData).length > 0
    });

    sharpInstance = sharpInstance.withMetadata({
      orientation: orientation,
      density: density,
      exif: exifData,
      icc: icc
    });
  }

  // Apply WebP settings
  sharpInstance = sharpInstance.webp({
    quality: config.quality,
    alphaQuality: config.alphaQuality,
    effort: config.effort,
    lossless: config.lossless,
    nearLossless: config.nearLossless,
    smartSubsample: true,
    force: true,
    preset: 'photo',
    mixed: false
  });

  // Chỉ resize nếu không phải metadata-only mode
  if (!config.metadataOnly && !config.preserveOriginalSize && (config.maxWidth || config.maxHeight)) {
    sharpInstance = sharpInstance.resize({
      width: config.maxWidth,
      height: config.maxHeight,
      fit: config.fit,
      position: config.position,
      background: config.background,
      kernel: 'lanczos3',
      withoutEnlargement: true,
      withoutReduction: false,
      fastShrinkOnLoad: true
    });
  }

  // Chỉ apply enhancements nếu không phải metadata-only mode
  if (!config.metadataOnly) {
    if (config.sharpen) {
      if (typeof config.sharpen === 'object') {
        sharpInstance = sharpInstance.sharpen(config.sharpen);
      } else {
        sharpInstance = sharpInstance.sharpen();
      }
    }

    if (config.blur) {
      sharpInstance = sharpInstance.blur(config.blur);
    }

    if (config.median) {
      sharpInstance = sharpInstance.median(config.median);
    }

    if (config.negate) {
      sharpInstance = sharpInstance.negate();
    }

    // Apply color adjustments chỉ khi không phải metadata-only
    if (metadata.channels && metadata.channels >= 3) {
      if (config.brightness !== 1.0 || config.saturation !== 1.0 || config.hue !== 0) {
        sharpInstance = sharpInstance.modulate({
          brightness: config.brightness,
          saturation: config.saturation,
          hue: config.hue
        });
      }

      if (config.gamma && config.gamma !== 1.0) {
        sharpInstance = sharpInstance.gamma(config.gamma);
      }

      if (config.normalize) {
        sharpInstance = sharpInstance.normalize();
      }
    }

    // Apply CLAHE chỉ khi không phải metadata-only
    if (config.clahe) {
      if (typeof config.clahe === 'object') {
        sharpInstance = sharpInstance.clahe(config.clahe);
      } else {
        sharpInstance = sharpInstance.clahe({
          width: 3,
          height: 3,
          maxSlope: 3
        });
      }
    }
  }

  return sharpInstance;
};