// Image processing utilities for WebP conversion

export interface WebPConversionResult {
  file: File;
  originalSize: number;
  webpSize: number;
  compressionRatio: number;
  success: boolean;
  error?: string;
}

/**
 * Convert a single image file to WebP format using Sharp API
 */
export const convertToWebP = async (
  file: File,
  quality = 85
): Promise<WebPConversionResult> => {
  try {
    // Skip if not an image
    if (!file.type.startsWith('image/')) {
      console.log(`⏭️ Skipping ${file.name} - not an image`);
      return {
        file,
        originalSize: file.size,
        webpSize: file.size,
        compressionRatio: 0,
        success: true,
      };
    }

    console.log(`🔄 Converting ${file.name} to WebP...`);
    console.log(`📏 Original size: ${(file.size / 1024).toFixed(1)} KB`);
    console.log(`⚙️ Quality setting: ${quality}%`);

    const formData = new FormData();
    formData.append('image', file);

    console.log(`📤 Sending to API: /api/convert-webp`);

    const response = await fetch('/api/convert-webp', {
      method: 'POST',
      body: formData,
    });

    console.log(`📥 API Response status: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`❌ API Error:`, errorData);
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    const webpBlob = await response.blob();
    const compressionRatio = parseFloat(response.headers.get('X-Compression-Ratio') || '0');
    const originalSize = parseInt(response.headers.get('X-Original-Size') || file.size.toString());
    const webpSize = parseInt(response.headers.get('X-WebP-Size') || webpBlob.size.toString());

    console.log(`📊 Compression results:`);
    console.log(`   - Original: ${(originalSize / 1024).toFixed(1)} KB`);
    console.log(`   - WebP: ${(webpSize / 1024).toFixed(1)} KB`);
    console.log(`   - Saved: ${compressionRatio}%`);

    // Create new File with WebP format and lowercase filename
    const originalName = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
    const webpFileName = `${originalName.toLowerCase()}.webp`;
    const webpFile = new File([webpBlob], webpFileName, {
      type: 'image/webp',
      lastModified: Date.now(),
    });

    console.log(`✅ Converted ${file.name} → ${webpFileName}`);
    console.log(`📊 Final compression: ${(originalSize / 1024).toFixed(1)} KB → ${(webpBlob.size / 1024).toFixed(1)} KB (${compressionRatio}% saved)`);

    return {
      file: webpFile,
      originalSize: originalSize,
      webpSize: webpBlob.size,
      compressionRatio,
      success: true,
    };

  } catch (error) {
    console.error(`❌ WebP conversion failed for ${file.name}:`, error);
    console.log(`🔄 Falling back to client-side conversion...`);

    // Fallback to client-side Canvas conversion
    const fallbackResult = await convertWithCanvas(file, quality / 100);
    if (fallbackResult.success && fallbackResult.compressionRatio > 0) {
      console.log(`✅ Fallback conversion successful: ${fallbackResult.compressionRatio.toFixed(1)}% saved`);
      return fallbackResult;
    }

    return {
      file,
      originalSize: file.size,
      webpSize: file.size,
      compressionRatio: 0,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Convert multiple image files to WebP format
 */
export const convertMultipleToWebP = async (
  files: File[],
  quality = 85,
  onProgress?: (completed: number, total: number, currentFile?: string) => void
): Promise<WebPConversionResult[]> => {
  const results: WebPConversionResult[] = [];
  let completed = 0;

  for (const file of files) {
    onProgress?.(completed, files.length, file.name);

    const result = await convertToWebP(file, quality);
    results.push(result);

    completed++;
    onProgress?.(completed, files.length, file.name);
  }

  return results;
};

/**
 * Smart conversion strategy: small files use client-side, large files use server-side
 */
export const smartConvertToWebP = async (
  file: File,
  quality = 85
): Promise<WebPConversionResult> => {
  // For small files (< 2MB), use client-side Canvas API for speed
  if (file.size < 2 * 1024 * 1024) {
    return convertWithCanvas(file, quality);
  }

  // For larger files, use Sharp for better quality
  return convertToWebP(file, quality);
};

/**
 * Fallback: Convert using Canvas API (client-side)
 */
const convertWithCanvas = async (
  file: File,
  quality = 0.85
): Promise<WebPConversionResult> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = Math.min(img.width, 1920); // Max width
      canvas.height = Math.min(img.height, 1080); // Max height

      // Maintain aspect ratio
      const aspectRatio = img.width / img.height;
      if (img.width > 1920) {
        canvas.width = 1920;
        canvas.height = 1920 / aspectRatio;
      }
      if (img.height > 1080) {
        canvas.height = 1080;
        canvas.width = 1080 * aspectRatio;
      }

      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const originalName = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
            const webpFileName = `${originalName.toLowerCase()}.webp`;
            const webpFile = new File([blob], webpFileName, {
              type: 'image/webp',
              lastModified: Date.now(),
            });

            const compressionRatio = ((file.size - blob.size) / file.size * 100);

            resolve({
              file: webpFile,
              originalSize: file.size,
              webpSize: blob.size,
              compressionRatio,
              success: true,
            });
          } else {
            // Fallback to original file
            resolve({
              file,
              originalSize: file.size,
              webpSize: file.size,
              compressionRatio: 0,
              success: true,
            });
          }
        },
        'image/webp',
        quality
      );
    };

    img.onerror = () => {
      // Fallback to original file on error
      resolve({
        file,
        originalSize: file.size,
        webpSize: file.size,
        compressionRatio: 0,
        success: true,
      });
    };

    img.src = URL.createObjectURL(file);
  });
};

/**
 * Check if WebP is supported in the current browser
 */
export const isWebPSupported = (): boolean => {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;

  return canvas.toDataURL('image/webp').indexOf('image/webp') === 5;
};

/**
 * Normalize filename to lowercase with proper extension
 */
export const normalizeFileName = (fileName: string, extension = 'webp') => {
  const nameWithoutExt = fileName.replace(/\.[^/.]+$/, ''); // Remove existing extension
  return `${nameWithoutExt.toLowerCase()}.${extension.toLowerCase()}`;
};

/**
 * Get image dimensions without loading the full image
 */
export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};