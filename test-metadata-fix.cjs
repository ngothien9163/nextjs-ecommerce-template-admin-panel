// Test to check correct metadata handling with Sharp
const sharp = require('sharp');
const fs = require('fs');

async function testMetadata() {
  try {
    // Create a simple test image (100x100 red square)
    const testBuffer = await sharp({
      create: {
        width: 100,
        height: 100,
        channels: 4,
        background: { r: 255, g: 0, b: 0, alpha: 1 }
      }
    })
    .png()
    .toBuffer();
    
    console.log('Created test image, size:', testBuffer.length, 'bytes');
    
    // Apply metadata correctly - EXIF should be an object
    const exifData = {
      IFD0: {
        Copyright: 'Test Copyright 2024',
        Artist: 'Test Artist',
        ImageDescription: 'Test Description'
      }
    };
    
    const metadata = {
      exif: exifData,
      orientation: 1,
      density: 300,
      icc: 'srgb'
    };
    
    console.log('Applying metadata:', JSON.stringify(metadata, null, 2));
    
    // Convert to WebP with metadata
    const webpBuffer = await sharp(testBuffer)
      .withMetadata(metadata)
      .webp({ quality: 80 })
      .toBuffer();
      
    console.log('Converted to WebP, size:', webpBuffer.length, 'bytes');
    
    // Save to file
    fs.writeFileSync('test-with-metadata-fixed.webp', webpBuffer);
    console.log('Saved test-with-metadata-fixed.webp');
    
    // Check if metadata chunks exist
    checkMetadataChunks('test-with-metadata-fixed.webp');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

function checkMetadataChunks(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    console.log('\nChecking file:', filePath);
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
      
      while (offset < Math.min(buffer.length - 8, 5000)) { // Limit search to first 5KB
        // Read chunk fourCC
        const chunkId = buffer.toString('ascii', offset, offset + 4);
        const chunkSize = buffer.readUInt32LE(offset + 4);
        
        console.log(`📦 Chunk: ${chunkId}, size: ${chunkSize}`);
        
        if (chunkId === 'EXIF') {
          console.log('📋 Found EXIF chunk!');
          // Try to read EXIF content
          const exifContent = buffer.subarray(offset + 8, offset + 8 + Math.min(chunkSize, 100));
          console.log('   EXIF content (first 100 bytes):', exifContent);
        } else if (chunkId === 'XMP ') {
          console.log('📋 Found XMP chunk!');
          // Try to read XMP content
          const xmpContent = buffer.subarray(offset + 8, offset + 8 + Math.min(chunkSize, 200));
          console.log('   XMP content (first 200 bytes):', xmpContent.toString('utf8'));
        } else if (chunkId === 'VP8 ' || chunkId === 'VP8L' || chunkId === 'VP8X') {
          console.log('🖼️ Found VP8 image data chunk');
        } else if (chunkId === 'ICCP') {
          console.log('🎨 Found ICC profile chunk');
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

testMetadata();