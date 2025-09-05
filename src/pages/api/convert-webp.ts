import { NextApiRequest, NextApiResponse } from 'next';
import sharp from 'sharp';
import multer from 'multer';
import { promisify } from 'util';

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

    // Determine optimal quality based on file size and type
    let quality = 75;
    if (file.size > 5 * 1024 * 1024) { // > 5MB
      quality = 60; // More aggressive compression for large files
    } else if (file.size > 1 * 1024 * 1024) { // > 1MB
      quality = 70;
    }

    console.log(`⚙️ Using quality: ${quality}%`);

    // Convert to WebP using Sharp with optimal settings for maximum compression
    const webpBuffer = await sharp(file.buffer)
      .webp({
        quality: quality,         // Dynamic quality based on file size
        effort: 6,                // Maximum compression effort (0-6)
        smartSubsample: true,     // Smart subsampling for better quality
        nearLossless: false,      // Use lossy compression for smaller files
        alphaQuality: quality,    // Alpha channel quality
        force: true,              // Force WebP output
        preset: 'photo',          // Optimize for photos
      })
      .resize({
        width: 1920,              // Max width for web
        height: 1080,             // Max height for web
        fit: 'inside',            // Maintain aspect ratio
        withoutEnlargement: true, // Don't enlarge small images
      })
      .sharpen()                  // Sharpen after resize
      .toBuffer();

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