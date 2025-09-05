const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Simple metadata generation function
function getMetadataForWebP(config = {}) {
  const defaultConfig = {
    software: 'Next.js Admin Panel',
    copyright: '© 2024 Your Company Name',
    creator: 'Development Team',
    credit: 'Original Content',
    keywords: ['web', 'image', 'content'],
    colorSpace: 'sRGB',
    density: 300,
    orientation: 1
  };

  const finalConfig = { ...defaultConfig, ...config };

  // EXIF data structure - Sharp requires IFD sections
  const exifData = {
    IFD0: {},
    ExifIFD: {}
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

  if (finalConfig.creator) {
    exifData.IFD0.Artist = finalConfig.creator;
  }

  if (finalConfig.software) {
    exifData.IFD0.Software = finalConfig.software;
  }

  return {
    orientation: finalConfig.orientation || 1,
    density: finalConfig.density || 300,
    exif: exifData,
    icc: finalConfig.colorSpace === 'sRGB' ? 'srgb' : undefined
  };
}

// Extract metadata from form data
function extractMetadataFromForm(formData) {
  return {
    title: formData.title || formData.alt_text,
    description: formData.meta_description || formData.caption,
    copyright: formData.copyright,
    creator: formData.creator,
    credit: formData.credit,
    keywords: formData.meta_keywords ? formData.meta_keywords.split(',').map(k => k.trim()) : undefined
  };
}

// API endpoint for WebP conversion with metadata
app.post('/api/convert-webp', upload.single('image'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        error: 'No file uploaded',
        message: 'Please upload an image file'
      });
    }

    console.log(`🔄 Converting ${file.originalname} to WebP with Sharp...`);

    // Get metadata from form data
    let customMetadataConfig = {};
    if (req.body.metadata) {
      try {
        const metadataData = JSON.parse(req.body.metadata);
        customMetadataConfig = extractMetadataFromForm(metadataData);
        console.log('📋 Received custom metadata:', metadataData);
      } catch (e) {
        console.log('⚠️ Could not parse metadata from form data:', e);
      }
    }

    // Generate metadata for WebP
    const webpMetadata = getMetadataForWebP(customMetadataConfig);
    console.log('📋 Generated WebP metadata:', {
      hasCustomMetadata: Object.keys(customMetadataConfig).length > 0,
      customMetadataKeys: Object.keys(customMetadataConfig),
      webpMetadataKeys: Object.keys(webpMetadata),
      hasExif: !!webpMetadata.exif
    });

    // Process image with Sharp
    let sharpInstance = sharp(file.buffer);

    // Apply metadata
    sharpInstance = sharpInstance.withMetadata(webpMetadata);

    // Convert to WebP
    const webpBuffer = await sharpInstance
      .webp({ quality: 85 })
      .toBuffer();

    // Get original filename without extension
    const originalName = file.originalname.replace(/\.[^/.]+$/, '');
    const webpFileName = `${originalName}.webp`;

    console.log(`✅ Converted ${file.originalname} → ${webpFileName}`);
    console.log(`📊 Compression: ${file.size} → ${webpBuffer.length} bytes`);

    // Set response headers
    res.setHeader('Content-Type', 'image/webp');
    res.setHeader('Content-Disposition', `attachment; filename="${webpFileName}"`);
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.setHeader('X-Compression-Ratio', ((file.size - webpBuffer.length) / file.size * 100).toFixed(1));
    res.setHeader('X-Original-Size', file.size.toString());
    res.setHeader('X-WebP-Size', webpBuffer.length.toString());

    // Send the WebP buffer
    res.status(200).send(webpBuffer);

  } catch (error) {
    console.error('❌ Sharp conversion error:', error);

    const errorMessage = error.message || 'Unknown error';

    if (errorMessage.includes('Input buffer contains unsupported image format')) {
      return res.status(400).json({
        error: 'Unsupported image format',
        message: 'The uploaded image format is not supported'
      });
    }

    res.status(500).json({
      error: 'Conversion failed',
      message: 'Failed to convert image to WebP format',
      details: errorMessage
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Sharp server is running' });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Sharp server running on http://localhost:${port}`);
  console.log(`📡 API endpoints:`);
  console.log(`   POST /api/convert-webp - Convert image to WebP with metadata`);
  console.log(`   GET /api/health - Health check`);
});
