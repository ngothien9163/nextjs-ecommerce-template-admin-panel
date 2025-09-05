import { NextApiRequest, NextApiResponse } from 'next';
import sharp from 'sharp';
import multer from 'multer';
import { promisify } from 'util';
import { getOptimalWebPConfig, applyWebPEnhancements } from '../../lib/sharp-config';
import { getMetadataForWebP, extractMetadataFromForm, getMetadataTemplates, ImageMetadataConfig } from '../../lib/metadata-config';
import { getMetadataByTemplate, type MetadataTemplateName } from '../../config/metadata-constants';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only allow image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

const uploadMiddleware = promisify(upload.single('image'));

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'Only POST requests are allowed'
    });
  }

  try {
    // Parse multipart form data
    await uploadMiddleware(req, res);

    const file = (req as any).file;
    if (!file) {
      return res.status(400).json({
        error: 'No file uploaded',
        message: 'Please upload an image file'
      });
    }

    // Validate file type
    if (!file.mimetype.startsWith('image/')) {
      return res.status(400).json({
        error: 'Invalid file type',
        message: 'Only image files are allowed'
      });
    }

    console.log(`🔄 Converting ${file.originalname} to WebP...`);
    console.log(`📏 Original: ${(file.size / 1024).toFixed(1)} KB (${file.mimetype})`);

    // Get image metadata first
    const metadata = await sharp(file.buffer).metadata();
    console.log(`🖼️ Image info: ${metadata.width}x${metadata.height}, format: ${metadata.format}`);

    // Get query parameters for custom settings
    const metadataTemplate = req.query.template as string;
    const metadataOnly = req.query.metadataOnly === 'true';
    const preserveSize = req.query.preserveSize === 'true';
    
    // Parse custom metadata from form data if provided
    let customMetadataConfig: Partial<ImageMetadataConfig> = {};
    if ((req as any).body && (req as any).body.metadata) {
      try {
        const metadataString = (req as any).body.metadata;
        if (typeof metadataString === 'string') {
          const metadataData = JSON.parse(metadataString);
          customMetadataConfig = extractMetadataFromForm(metadataData);
          console.log('📋 Received custom metadata from form:', metadataData);
        }
      } catch (e) {
        console.log('⚠️ Could not parse metadata from form data, using defaults:', e);
      }
    }
    
    // Get metadata template if specified - sử dụng constants mới
    if (metadataTemplate) {
      // Kiểm tra xem template có tồn tại không
      const availableTemplates = ['default', 'production', 'blog', 'hero', 'professional'] as MetadataTemplateName[];
      
      if (availableTemplates.includes(metadataTemplate as MetadataTemplateName)) {
        const templateConfig = getMetadataByTemplate(metadataTemplate as MetadataTemplateName);
        
        // Chuyển đổi từ MetadataConfig sang ImageMetadataConfig
        customMetadataConfig = {
          ...customMetadataConfig,
          copyright: templateConfig.copyright,
          creator: templateConfig.creator_artist,
          artist: templateConfig.creator_artist,
          credit: templateConfig.credit,
          caption: templateConfig.caption_description,
          contact: templateConfig.contact_url,
          website: templateConfig.website_url,
          email: templateConfig.email_contact,
          keywords: templateConfig.keywords,
          software: templateConfig.software
        };
        
        console.log(`🎨 Using metadata template: ${metadataTemplate}`);
      } else {
        console.log(`⚠️ Template '${metadataTemplate}' not found, using defaults`);
      }
    }
    
    // Get optimal configuration
    const config = getOptimalWebPConfig(file.size, metadata.format || 'unknown', {
      metadataOnly: metadataOnly,
      preserveOriginalSize: preserveSize || metadataOnly
    });

    console.log(`⚙️ Processing mode: ${metadataOnly ? 'Metadata Only' : 'Full Processing'}`);
    console.log(`📎 Size preservation: ${config.preserveOriginalSize ? 'Yes' : 'No'}`);
    console.log(`🎨 Quality: ${config.quality}%, effort: ${config.effort}`);

    // Generate metadata for WebP
    const webpMetadata = getMetadataForWebP(customMetadataConfig);
    console.log('📋 Generated WebP metadata:', {
      hasCustomMetadata: Object.keys(customMetadataConfig).length > 0,
      customMetadataKeys: Object.keys(customMetadataConfig),
      webpMetadataKeys: Object.keys(webpMetadata),
      hasExif: !!webpMetadata.exif
    });
    
    // Apply enhancements using the new config system
    let sharpInstance = sharp(file.buffer);
    sharpInstance = await applyWebPEnhancements(sharpInstance, config, metadata, webpMetadata);
    
    const webpBuffer = await sharpInstance.toBuffer();

    // Get original filename without extension and convert to lowercase
    const originalName = file.originalname.replace(/\.[^/.]+$/, '');
    const webpFileName = `${originalName.toLowerCase()}.webp`;

    // Calculate compression stats
    const originalSize = file.size;
    const webpSize = webpBuffer.length;
    const compressionRatio = ((originalSize - webpSize) / originalSize * 100).toFixed(1);
    const sizeSavedKB = ((originalSize - webpSize) / 1024).toFixed(1);

    console.log(`✅ Converted ${file.originalname} → ${webpFileName}`);
    console.log(`📊 Compression results:`);
    console.log(`   - Original: ${(originalSize / 1024).toFixed(1)} KB`);
    console.log(`   - WebP: ${(webpSize / 1024).toFixed(1)} KB`);
    console.log(`   - Saved: ${sizeSavedKB} KB (${compressionRatio}%)`);
    console.log(`🎨 Processing applied:`);
    console.log(`   - Mode: ${config.metadataOnly ? 'Metadata Only' : 'Full Processing'}`);
    console.log(`   - Original size preserved: ${config.preserveOriginalSize ? 'Yes' : 'No'}`);
    console.log(`   - Quality: ${config.quality}% (Alpha: ${config.alphaQuality}%)`);
    if (!config.metadataOnly && !config.preserveOriginalSize) {
      console.log(`   - Resize: ${config.maxWidth}x${config.maxHeight} (${config.fit})`);
      console.log(`   - Enhancements: ${config.sharpen ? 'Yes' : 'No'}`);
    }
    console.log(`   - Metadata: Updated with custom fields`);
    console.log(`   - Compression ratio: ${compressionRatio}%`);

    // Set response headers
    res.setHeader('Content-Type', 'image/webp');
    res.setHeader('Content-Disposition', `attachment; filename="${webpFileName}"`);
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.setHeader('X-Compression-Ratio', compressionRatio);
    res.setHeader('X-Original-Size', originalSize.toString());
    res.setHeader('X-WebP-Size', webpSize.toString());

    // Send the WebP buffer
    res.status(200).send(webpBuffer);

  } catch (error) {
    console.error('❌ WebP conversion error:', error);

    // Handle specific Sharp errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (errorMessage.includes('Input buffer contains unsupported image format')) {
      return res.status(400).json({
        error: 'Unsupported image format',
        message: 'The uploaded image format is not supported'
      });
    }

    if (errorMessage.includes('Input image is too large')) {
      return res.status(400).json({
        error: 'Image too large',
        message: 'The uploaded image exceeds the maximum size limit'
      });
    }

    // Generic error
    res.status(500).json({
      error: 'Conversion failed',
      message: 'Failed to convert image to WebP format',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
}