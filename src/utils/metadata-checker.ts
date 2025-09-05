// Metadata checking utility for downloaded files from Supabase
// Giúp kiểm tra metadata của files đã tải từ Supabase Storage

export interface MetadataCheckResult {
  hasMetadata: boolean;
  exifData?: {
    hasEXIF?: boolean;
    chunkSize?: number;
    copyright?: string;
    creator_artist?: string;
    software?: string;
    description?: string;
    userComment?: string;
    // Raw EXIF data
    [key: string]: any;
  };
  xmpData?: {
    hasXMP?: boolean;
    chunkSize?: number;
    title?: string;
    description?: string;
    creator?: string;
    rights?: string;
    keywords?: string[];
    // Raw XMP data
    [key: string]: any;
  };
  technicalInfo?: {
    width: number;
    height: number;
    format: string;
    size: number;
    channels: number;
  };
  // Additional parsed metadata
  parsedMetadata?: {
    copyright?: string;
    creator_artist?: string;
    credit?: string;
    caption_description?: string;
    keywords?: string[];
    software?: string;
    user_comment?: string;
    contact_info?: string;
  };
  error?: string;
}

/**
 * Kiểm tra metadata của file đã tải từ Supabase Storage
 * Sử dụng browser APIs để đọc metadata từ file
 */
export const checkFileMetadata = async (
  file: File | Blob | string
): Promise<MetadataCheckResult> => {
  try {
    let fileBlob: Blob;
    
    // Xử lý input khác nhau
    if (typeof file === 'string') {
      // Nếu là URL, fetch file
      console.log('🔍 Fetching file from URL:', file);
      const response = await fetch(file);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status}`);
      }
      fileBlob = await response.blob();
    } else {
      fileBlob = file;
    }

    // Đọc file như ArrayBuffer để phân tích metadata
    const arrayBuffer = await fileBlob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    console.log('📊 File info:', {
      size: fileBlob.size,
      type: fileBlob.type,
      arrayLength: uint8Array.length
    });

    // Kiểm tra định dạng file
    const fileFormat = detectImageFormat(uint8Array);
    console.log('🖼️ Detected format:', fileFormat);

    const result: MetadataCheckResult = {
      hasMetadata: false,
      technicalInfo: {
        width: 0,
        height: 0,
        format: fileFormat,
        size: fileBlob.size,
        channels: 0
      }
    };

    // Kiểm tra metadata dựa trên định dạng
    if (fileFormat === 'webp') {
      const webpMetadata = await checkWebPMetadata(uint8Array);
      result.hasMetadata = webpMetadata.hasMetadata;
      result.exifData = webpMetadata.exifData;
      result.xmpData = webpMetadata.xmpData;
      result.parsedMetadata = webpMetadata.parsedMetadata;
      
      // Cập nhật technical info
      if (webpMetadata.technicalInfo) {
        result.technicalInfo = { ...result.technicalInfo, ...webpMetadata.technicalInfo };
      }
    } else if (fileFormat === 'jpeg') {
      const jpegMetadata = await checkJPEGMetadata(uint8Array);
      result.hasMetadata = jpegMetadata.hasMetadata;
      result.exifData = jpegMetadata.exifData;
      result.xmpData = jpegMetadata.xmpData;
    } else if (fileFormat === 'png') {
      const pngMetadata = await checkPNGMetadata(uint8Array);
      result.hasMetadata = pngMetadata.hasMetadata;
      result.exifData = pngMetadata.textChunks;
    }

    // Thử sử dụng browser Image API để lấy dimensions
    try {
      const imageDimensions = await getImageDimensions(fileBlob);
      if (result.technicalInfo) {
        result.technicalInfo.width = imageDimensions.width;
        result.technicalInfo.height = imageDimensions.height;
      }
    } catch (err) {
      console.warn('⚠️ Could not get image dimensions:', err);
    }

    console.log('✅ Metadata check result:', result);
    return result;

  } catch (error) {
    console.error('❌ Error checking metadata:', error);
    return {
      hasMetadata: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Detect image format from byte signature
 */
function detectImageFormat(bytes: Uint8Array): string {
  // WebP signature: "RIFF" + 4 bytes + "WEBP"
  if (bytes.length >= 12 &&
      bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
      bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) {
    return 'webp';
  }
  
  // JPEG signature: 0xFF, 0xD8
  if (bytes.length >= 2 && bytes[0] === 0xFF && bytes[1] === 0xD8) {
    return 'jpeg';
  }
  
  // PNG signature: 89 50 4E 47 0D 0A 1A 0A
  if (bytes.length >= 8 &&
      bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47 &&
      bytes[4] === 0x0D && bytes[5] === 0x0A && bytes[6] === 0x1A && bytes[7] === 0x0A) {
    return 'png';
  }

  return 'unknown';
}

/**
 * Check WebP metadata với parsing chi tiết hơn
 */
async function checkWebPMetadata(bytes: Uint8Array) {
  const result = {
    hasMetadata: false,
    exifData: {} as any,
    xmpData: {} as any,
    technicalInfo: {} as any,
    parsedMetadata: {} as any
  };

  try {
    // WebP format analysis
    let offset = 12; // Skip RIFF header and WEBP signature
    
    while (offset < bytes.length - 8) {
      // Read chunk fourCC
      const chunkId = String.fromCharCode(bytes[offset], bytes[offset + 1], bytes[offset + 2], bytes[offset + 3]);
      const chunkSize = bytes[offset + 4] | (bytes[offset + 5] << 8) | (bytes[offset + 6] << 16) | (bytes[offset + 7] << 24);
      
      console.log(`📦 WebP chunk: ${chunkId}, size: ${chunkSize}`);
      
      if (chunkId === 'EXIF') {
        console.log('📋 Found EXIF chunk');
        result.hasMetadata = true;
        
        // Parse EXIF data
        const exifChunk = bytes.slice(offset + 8, offset + 8 + chunkSize);
        const parsedExif = parseEXIFData(exifChunk);
        
        result.exifData = {
          hasEXIF: true,
          chunkSize: chunkSize,
          ...parsedExif
        };
        
        // Extract to parsedMetadata
        if (parsedExif.copyright) result.parsedMetadata.copyright = parsedExif.copyright;
        if (parsedExif.creator_artist) result.parsedMetadata.creator_artist = parsedExif.creator_artist;
        if (parsedExif.software) result.parsedMetadata.software = parsedExif.software;
        if (parsedExif.userComment) result.parsedMetadata.user_comment = parsedExif.userComment;
        
      } else if (chunkId === 'XMP ') {
        console.log('📋 Found XMP chunk');
        result.hasMetadata = true;
        
        // Parse XMP data
        const xmpChunk = bytes.slice(offset + 8, offset + 8 + chunkSize);
        const parsedXmp = parseXMPData(xmpChunk);
        
        result.xmpData = {
          hasXMP: true,
          chunkSize: chunkSize,
          ...parsedXmp
        };
        
        // Extract to parsedMetadata
        if (parsedXmp.title) result.parsedMetadata.caption_description = parsedXmp.title;
        if (parsedXmp.description) result.parsedMetadata.caption_description = parsedXmp.description;
        if (parsedXmp.creator) result.parsedMetadata.creator_artist = parsedXmp.creator;
        if (parsedXmp.rights) result.parsedMetadata.copyright = parsedXmp.rights;
        if (parsedXmp.keywords) result.parsedMetadata.keywords = parsedXmp.keywords;
        
      } else if (chunkId === 'VP8 ' || chunkId === 'VP8L' || chunkId === 'VP8X') {
        console.log('🖼️ Found VP8 image data chunk');
        
        if (chunkId === 'VP8X') {
          // Extended WebP with dimensions in VP8X header
          if (offset + 18 < bytes.length) {
            const width = 1 + (bytes[offset + 12] | (bytes[offset + 13] << 8) | (bytes[offset + 14] << 16));
            const height = 1 + (bytes[offset + 15] | (bytes[offset + 16] << 8) | (bytes[offset + 17] << 16));
            result.technicalInfo.width = width;
            result.technicalInfo.height = height;
          }
        }
      }
      
      // Move to next chunk
      offset += 8 + chunkSize;
      
      // Align to even byte boundary
      if (chunkSize % 2 === 1) {
        offset += 1;
      }
    }
  } catch (error) {
    console.error('❌ Error parsing WebP metadata:', error);
  }

  return result;
}

/**
 * Parse EXIF data từ bytes - Enhanced for Sharp-generated EXIF
 */
function parseEXIFData(exifBytes: Uint8Array) {
  const result: any = {};

  try {
    // Log raw EXIF data for debugging
    console.log('🔍 Raw EXIF bytes length:', exifBytes.length);
    console.log('🔍 First 100 bytes:', Array.from(exifBytes.slice(0, 100)).map(b => b.toString(16).padStart(2, '0')).join(' '));

    // Try multiple decoding approaches
    let textData = '';
    try {
      textData = new TextDecoder('utf-8', { ignoreBOM: true }).decode(exifBytes);
    } catch (e) {
      console.warn('⚠️ UTF-8 decode failed, trying latin1');
      textData = new TextDecoder('latin1').decode(exifBytes);
    }

    console.log('🔍 EXIF text data (first 500 chars):', textData.substring(0, 500));

    // Enhanced patterns for Sharp-generated EXIF
    const patterns = {
      copyright: /(?:Copyright|©|Rights)[\s\x00:]*([^\x00\n\r]{1,200})/i,
      artist: /(?:Artist|Creator|Author)[\s\x00:]*([^\x00\n\r]{1,100})/i,
      software: /(?:Software|ProcessingSoftware)[\s\x00:]*([^\x00\n\r]{1,100})/i,
      description: /(?:ImageDescription|Description|Title)[\s\x00:]*([^\x00\n\r]{1,200})/i,
      userComment: /(?:UserComment|Comment)[\s\x00:]*([^\x00\n\r]{1,200})/i,
      make: /Make[\s\x00:]*([^\x00\n\r]{1,50})/i,
      model: /Model[\s\x00:]*([^\x00\n\r]{1,50})/i,
      // Additional patterns for Sharp metadata
      credit: /Credit[\s\x00:]*([^\x00\n\r]{1,100})/i,
      source: /Source[\s\x00:]*([^\x00\n\r]{1,100})/i
    };

    // Extract data with enhanced patterns
    for (const [key, pattern] of Object.entries(patterns)) {
      const match = textData.match(pattern);
      if (match) {
        let value = match[1].trim();
        // Clean up common artifacts
        value = value.replace(/[\x00-\x1F\x7F-\x9F]/g, '').trim();

        switch (key) {
          case 'copyright':
            result.copyright = value;
            break;
          case 'artist':
            result.creator_artist = value;
            break;
          case 'software':
            result.software = value;
            break;
          case 'description':
            result.description = value;
            break;
          case 'userComment':
            result.userComment = value;
            break;
          case 'make':
            result.cameraMake = value;
            break;
          case 'model':
            result.cameraModel = value;
            break;
          case 'credit':
            result.credit = value;
            break;
          case 'source':
            if (!result.credit) result.credit = value;
            break;
        }

        console.log(`✅ Found ${key}:`, value);
      }
    }

    // Try to extract from JSON-like structures in EXIF
    try {
      // Look for JSON-like metadata in EXIF
      const jsonMatches = textData.match(/\{[^}]*\}/g);
      if (jsonMatches) {
        for (const jsonStr of jsonMatches) {
          try {
            const jsonData = JSON.parse(jsonStr);
            console.log('🔍 Found JSON metadata in EXIF:', jsonData);

            // Extract fields from JSON
            if (jsonData.Copyright && !result.copyright) result.copyright = jsonData.Copyright;
            if (jsonData.Artist && !result.creator_artist) result.creator_artist = jsonData.Artist;
            if (jsonData.Software && !result.software) result.software = jsonData.Software;
            if (jsonData.Description && !result.description) result.description = jsonData.Description;
            if (jsonData.Credit && !result.credit) result.credit = jsonData.Credit;
          } catch (e) {
            // Not valid JSON, continue
          }
        }
      }
    } catch (e) {
      console.warn('⚠️ Error parsing JSON in EXIF:', e);
    }

    console.log('🔍 Final parsed EXIF data:', result);
    console.log('🔍 EXIF parsing completed with', Object.keys(result).length, 'fields found');

  } catch (error) {
    console.warn('⚠️ Error parsing EXIF data:', error);
  }

  return result;
}

/**
 * Parse XMP data từ bytes
 */
function parseXMPData(xmpBytes: Uint8Array) {
  const result: any = {};
  
  try {
    // XMP is XML format
    const xmpText = new TextDecoder('utf-8').decode(xmpBytes);
    
    // Common XMP patterns
    const patterns = {
      title: /<dc:title[^>]*>\s*<rdf:Alt[^>]*>\s*<rdf:li[^>]*>([^<]+)<\/rdf:li>/i,
      description: /<dc:description[^>]*>\s*<rdf:Alt[^>]*>\s*<rdf:li[^>]*>([^<]+)<\/rdf:li>/i,
      creator: /<dc:creator[^>]*>\s*<rdf:Seq[^>]*>\s*<rdf:li[^>]*>([^<]+)<\/rdf:li>/i,
      rights: /<dc:rights[^>]*>\s*<rdf:Alt[^>]*>\s*<rdf:li[^>]*>([^<]+)<\/rdf:li>/i,
      keywords: /<dc:subject[^>]*>\s*<rdf:Bag[^>]*>(.*?)<\/rdf:Bag>/is,
      // Adobe XMP fields
      xmpCreator: /<xmp:Creator>([^<]+)<\/xmp:Creator>/i,
      photoshop: /<photoshop:Credit>([^<]+)<\/photoshop:Credit>/i
    };
    
    // Extract title/description
    const titleMatch = xmpText.match(patterns.title);
    if (titleMatch) result.title = titleMatch[1].trim();
    
    const descMatch = xmpText.match(patterns.description);
    if (descMatch) result.description = descMatch[1].trim();
    
    // Extract creator
    const creatorMatch = xmpText.match(patterns.creator) || xmpText.match(patterns.xmpCreator);
    if (creatorMatch) result.creator = creatorMatch[1].trim();
    
    // Extract rights/copyright
    const rightsMatch = xmpText.match(patterns.rights);
    if (rightsMatch) result.rights = rightsMatch[1].trim();
    
    // Extract keywords
    const keywordsMatch = xmpText.match(patterns.keywords);
    if (keywordsMatch) {
      const keywordItems = keywordsMatch[1].match(/<rdf:li[^>]*>([^<]+)<\/rdf:li>/g);
      if (keywordItems) {
        result.keywords = keywordItems.map(item => {
          const match = item.match(/>([^<]+)</);
          return match ? match[1].trim() : '';
        }).filter(Boolean);
      }
    }
    
    // Extract Photoshop credit
    const creditMatch = xmpText.match(patterns.photoshop);
    if (creditMatch) result.credit = creditMatch[1].trim();
    
    console.log('🔍 Parsed XMP data:', result);
    
  } catch (error) {
    console.warn('⚠️ Error parsing XMP data:', error);
  }
  
  return result;
}

/**
 * Check JPEG metadata (simplified)
 */
async function checkJPEGMetadata(bytes: Uint8Array) {
  const result = {
    hasMetadata: false,
    exifData: {} as any,
    xmpData: {} as any
  };

  try {
    let offset = 2; // Skip initial 0xFF 0xD8
    
    while (offset < bytes.length - 4) {
      if (bytes[offset] !== 0xFF) break;
      
      const marker = bytes[offset + 1];
      const length = (bytes[offset + 2] << 8) | bytes[offset + 3];
      
      if (marker === 0xE1) { // APP1 segment (usually EXIF or XMP)
        console.log('📋 Found APP1 segment (EXIF/XMP)');
        result.hasMetadata = true;
        
        // Check if it's EXIF or XMP
        const segmentData = bytes.slice(offset + 4, offset + 4 + length - 2);
        const dataString = new TextDecoder().decode(segmentData.slice(0, 20));
        
        if (dataString.includes('Exif')) {
          result.exifData.hasEXIF = true;
          console.log('📋 Contains EXIF data');
        }
        
        if (dataString.includes('http://ns.adobe.com/xap/1.0/')) {
          result.xmpData.hasXMP = true;
          console.log('📋 Contains XMP data');
        }
      }
      
      offset += length + 2;
    }
  } catch (error) {
    console.error('❌ Error parsing JPEG metadata:', error);
  }

  return result;
}

/**
 * Check PNG metadata (simplified)
 */
async function checkPNGMetadata(bytes: Uint8Array) {
  const result = {
    hasMetadata: false,
    textChunks: {} as any
  };

  try {
    let offset = 8; // Skip PNG signature
    
    while (offset < bytes.length - 12) {
      const length = (bytes[offset] << 24) | (bytes[offset + 1] << 16) | (bytes[offset + 2] << 8) | bytes[offset + 3];
      const type = String.fromCharCode(bytes[offset + 4], bytes[offset + 5], bytes[offset + 6], bytes[offset + 7]);
      
      if (type === 'tEXt' || type === 'iTXt' || type === 'zTXt') {
        console.log(`📋 Found PNG text chunk: ${type}`);
        result.hasMetadata = true;
        result.textChunks[type] = length;
      }
      
      offset += length + 12; // length + type + data + CRC
    }
  } catch (error) {
    console.error('❌ Error parsing PNG metadata:', error);
  }

  return result;
}

/**
 * Get image dimensions using browser Image API
 */
function getImageDimensions(blob: Blob): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.width || img.naturalWidth,
        height: img.height || img.naturalHeight
      });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
}

/**
 * Utility function để test metadata trực tiếp trong browser console
 */
export const testFileMetadata = async (fileUrl: string) => {
  console.log('🧪 Testing metadata for:', fileUrl);
  const result = await checkFileMetadata(fileUrl);
  
  console.log('📊 Metadata Check Results:');
  console.log('========================');
  console.log('Has Metadata:', result.hasMetadata ? '✅ YES' : '❌ NO');
  
  if (result.technicalInfo) {
    console.log('📐 Technical Info:');
    console.log('  - Format:', result.technicalInfo.format);
    console.log('  - Dimensions:', `${result.technicalInfo.width}x${result.technicalInfo.height}`);
    console.log('  - File Size:', `${(result.technicalInfo.size / 1024).toFixed(1)} KB`);
  }
  
  if (result.exifData && Object.keys(result.exifData).length > 0) {
    console.log('📋 EXIF Data Found:', result.exifData);
  }
  
  if (result.xmpData && Object.keys(result.xmpData).length > 0) {
    console.log('📋 XMP Data Found:', result.xmpData);
  }
  
  if (result.error) {
    console.log('❌ Error:', result.error);
  }
  
  return result;
};