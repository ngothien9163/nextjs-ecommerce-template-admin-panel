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

    // Convert to WebP using Sharp with optimal settings
    const webpBuffer = await sharp(file.buffer)
      .webp({
        quality: 85,              // 85% quality for good balance
        effort: 6,                // Maximum compression effort
        smartSubsample: true,     // Smart subsampling
        nearLossless: false,      // Use lossy compression
        alphaQuality: 85,         // Alpha channel quality
        force: true,              // Force WebP output
      })
      .resize({
        width: 1920,              // Max width for web
        height: 1080,             // Max height for web
        fit: 'inside',            // Maintain aspect ratio
        withoutEnlargement: true, // Don't enlarge small images
      })
      .toBuffer();

    // Get original filename without extension and convert to lowercase
    const originalName = file.originalname.replace(/\.[^/.]+$/, '');
    const webpFileName = `${originalName.toLowerCase()}.webp`;

    // Calculate compression stats
    const originalSize = file.size;
    const webpSize = webpBuffer.length;
    const compressionRatio = ((originalSize - webpSize) / originalSize * 100).toFixed(1);

    console.log(`✅ Converted ${file.originalname} → ${webpFileName}`);
    console.log(`📊 Compression: ${originalSize} bytes → ${webpSize} bytes (${compressionRatio}% saved)`);

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