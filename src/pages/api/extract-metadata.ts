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

    console.log(`🔍 Extracting metadata from ${file.originalname}...`);

    // Get image metadata using Sharp
    const metadata = await sharp(file.buffer).metadata();
    console.log(`📊 Extracted metadata:`, {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      channels: metadata.channels,
      density: metadata.density,
      orientation: metadata.orientation
    });

    // Extract EXIF data from metadata
    let exifData = {};
    if (metadata.exif) {
      exifData = metadata.exif;
      console.log('📋 EXIF data found in metadata');
    } else {
      console.log('⚠️ No EXIF data found in metadata');
    }

    // Extract IPTC data from metadata
    let iptcData = {};
    if (metadata.iptc) {
      iptcData = metadata.iptc;
      console.log('📋 IPTC data found in metadata');
    } else {
      console.log('⚠️ No IPTC data found in metadata');
    }

    // Parse metadata into form-friendly format
    const extractedMetadata = {
      // Technical info
      image_format: metadata.format?.toUpperCase() || 'JPEG',
      image_dimensions: metadata.width && metadata.height ? `${metadata.width}x${metadata.height}` : '',
      file_size_kb: Math.round(file.size / 1024).toString(),
      mime_type: file.mimetype,

      // EXIF metadata
      title: extractFromExif(exifData, ['ImageDescription', 'DocumentName']),
      description: extractFromExif(exifData, ['ImageDescription', 'UserComment']),
      copyright: extractFromExif(exifData, ['Copyright']),
      creator: extractFromExif(exifData, ['Artist', 'Creator']),
      software: extractFromExif(exifData, ['Software']),

      // IPTC metadata
      caption: extractFromIptc(iptcData, ['Caption']),
      credit: extractFromIptc(iptcData, ['Credit']),
      keywords: extractKeywordsFromIptc(iptcData),

      // Raw data for debugging
      raw: {
        exif: exifData,
        iptc: iptcData,
        sharp: {
          width: metadata.width,
          height: metadata.height,
          format: metadata.format,
          channels: metadata.channels,
          density: metadata.density,
          orientation: metadata.orientation
        }
      }
    };

    console.log('✅ Metadata extraction complete:', extractedMetadata);

    res.status(200).json({
      success: true,
      metadata: extractedMetadata
    });

  } catch (error) {
    console.error('❌ Metadata extraction error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (errorMessage.includes('Input buffer contains unsupported image format')) {
      return res.status(400).json({
        error: 'Unsupported image format',
        message: 'The uploaded image format is not supported'
      });
    }

    res.status(500).json({
      error: 'Extraction failed',
      message: 'Failed to extract metadata from image',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
}

// Helper function to extract values from EXIF data
function extractFromExif(exifData: any, fields: string[]): string {
  if (!exifData) return '';

  for (const field of fields) {
    // Check in IFD0
    if (exifData.IFD0 && exifData.IFD0[field]) {
      return exifData.IFD0[field];
    }
    // Check in ExifIFD
    if (exifData.ExifIFD && exifData.ExifIFD[field]) {
      return exifData.ExifIFD[field];
    }
    // Check direct
    if (exifData[field]) {
      return exifData[field];
    }
  }

  return '';
}

// Helper function to extract values from IPTC data
function extractFromIptc(iptcData: any, fields: string[]): string {
  if (!iptcData) return '';

  for (const field of fields) {
    if (iptcData[field]) {
      return iptcData[field];
    }
  }

  return '';
}

// Helper function to extract keywords from IPTC data
function extractKeywordsFromIptc(iptcData: any): string[] {
  if (!iptcData) return [];

  const keywords = [];

  // Common IPTC keyword fields
  const keywordFields = ['Keywords', 'SubjectReference', 'SupplementalCategories'];

  for (const field of keywordFields) {
    if (iptcData[field]) {
      if (Array.isArray(iptcData[field])) {
        keywords.push(...iptcData[field]);
      } else {
        keywords.push(iptcData[field]);
      }
    }
  }

  return keywords.filter(k => k && typeof k === 'string');
}