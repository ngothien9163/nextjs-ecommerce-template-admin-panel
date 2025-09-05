const fs = require('fs');

// Simple WebP metadata checker
function checkWebPMetadata() {
  try {
    // Read the downloaded file
    const buffer = fs.readFileSync('test-image.webp');
    console.log('File size:', buffer.length, 'bytes');
    
    // Check WebP signature
    const riff = buffer.toString('ascii', 0, 4);
    const webp = buffer.toString('ascii', 8, 12);
    
    console.log('RIFF signature:', riff);
    console.log('WEBP signature:', webp);
    
    if (riff === 'RIFF' && webp === 'WEBP') {
      console.log('✅ Valid WebP file');
      
      // Look for metadata chunks
      let offset = 12; // Skip RIFF header and WEBP signature
      
      while (offset < Math.min(buffer.length - 8, 10000)) { // Limit search to first 10KB
        // Read chunk fourCC
        const chunkId = buffer.toString('ascii', offset, offset + 4);
        const chunkSize = buffer.readUInt32LE(offset + 4);
        
        console.log(`📦 Chunk: ${chunkId}, size: ${chunkSize}`);
        
        if (chunkId === 'EXIF') {
          console.log('📋 Found EXIF chunk!');
        } else if (chunkId === 'XMP ') {
          console.log('📋 Found XMP chunk!');
        } else if (chunkId === 'VP8 ' || chunkId === 'VP8L' || chunkId === 'VP8X') {
          console.log('🖼️ Found VP8 image data chunk');
        }
        
        // Move to next chunk
        offset += 8 + chunkSize;
        
        // Align to even byte boundary
        if (chunkSize % 2 === 1) {
          offset += 1;
        }
        
        // Safety check to prevent infinite loop
        if (chunkSize <= 0 || offset >= buffer.length) {
          break;
        }
      }
    } else {
      console.log('❌ Not a valid WebP file');
    }
  } catch (error) {
    console.error('Error checking metadata:', error);
  }
}

checkWebPMetadata();