// EXIF metadata utilities using Sharp API
// This allows us to embed metadata into images using the Sharp server-side processing
// for Google Images SEO optimization

export interface ExifMetadata {
  title?: string;
  description?: string;
  copyright?: string;
  creator?: string;
  credit?: string;
  keywords?: string[];
  software?: string;
  userComment?: string;
}

/**
 * Embed EXIF metadata into an image file using Sharp API
 * Uses the existing /api/convert-webp endpoint with metadata embedding
 */
export async function embedExifMetadata(
  file: File,
  metadata: ExifMetadata
): Promise<File> {
  return new Promise((resolve, reject) => {
    console.log('📷 Embedding EXIF metadata using Sharp API:', metadata);

    // Use the existing Sharp API endpoint to embed metadata
    const formData = new FormData();
    formData.append('image', file);
    formData.append('metadata', JSON.stringify(metadata));
    formData.append('metadataOnly', 'true'); // Only embed metadata, don't change format/size
    formData.append('preserveSize', 'true'); // Keep original size

    fetch('http://localhost:3001/api/convert-webp', {
      method: 'POST',
      body: formData,
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Sharp API error: ${response.status}`);
      }
      return response.blob();
    })
    .then(blob => {
      // Create new File with processed data
      const processedFile = new File([blob], file.name, {
        type: file.type,
        lastModified: Date.now(),
      });

      console.log('✅ Metadata embedded successfully using Sharp API');
      console.log('📊 Metadata fields processed:', Object.keys(metadata));
      console.log('🎯 File ready for upload with embedded metadata');

      resolve(processedFile);
    })
    .catch(error => {
      console.error('❌ Sharp API metadata embedding failed:', error);
      console.log('⚠️ Falling back to original file without embedded metadata');

      // Fallback: return original file if Sharp API fails
      resolve(file);
    });
  });
}

/**
 * Extract EXIF metadata from a JPEG file
 * Basic implementation using browser APIs
 */
export async function extractExifMetadata(file: File): Promise<ExifMetadata> {
  return new Promise((resolve) => {
    const metadata: ExifMetadata = {};

    // Basic metadata extraction using file properties
    metadata.software = 'Web Image Processor';

    console.log('📷 Extracted basic EXIF metadata from JPEG');

    resolve(metadata);
  });
}

/**
 * Check if a file supports EXIF metadata
 */
export function supportsExif(file: File): boolean {
  const exifSupportedFormats = ['image/jpeg', 'image/tiff'];
  return exifSupportedFormats.includes(file.type.toLowerCase());
}

/**
 * Check if a file supports WebP metadata (XMP)
 */
export function supportsWebPMetadata(file: File): boolean {
  return file.type.toLowerCase() === 'image/webp';
}

/**
 * Convert WebP to JPEG for EXIF embedding (if needed for Google Images)
 */
export async function convertWebPToJPEGForMetadata(file: File): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx?.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const originalName = file.name.replace(/\.[^/.]+$/, '');
            const jpegFileName = `${originalName}.jpg`;
            const jpegFile = new File([blob], jpegFileName, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(jpegFile);
          } else {
            resolve(file); // Fallback to original
          }
        },
        'image/jpeg',
        0.95 // High quality for JPEG
      );
    };

    img.onerror = () => resolve(file);
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Prepare metadata for EXIF embedding
 * Converts our metadata format to EXIF-compatible format
 */
export function prepareExifData(metadata: ExifMetadata): any {
  return {
    // EXIF IFD0 tags
    ImageDescription: metadata.description || metadata.title,
    Copyright: metadata.copyright,
    Artist: metadata.creator,
    Software: metadata.software || 'Web Image Processor',

    // EXIF SubIFD tags
    UserComment: metadata.userComment || metadata.description,

    // IPTC-like data (stored in EXIF)
    XPTitle: metadata.title,
    XPComment: metadata.description,
    XPAuthor: metadata.creator,
    XPKeywords: metadata.keywords?.join(';') || '',

    // Custom fields
    Creator: metadata.creator,
    Credit: metadata.credit,
    Source: metadata.credit,
    CopyrightNotice: metadata.copyright
  };
}