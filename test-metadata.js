// Quick test script to check metadata of uploaded WebP file
const { checkFileMetadata } = require('./src/utils/metadata-checker.ts');

async function testUploadedFile() {
  console.log('🧪 Testing metadata for uploaded WebP file...');

  const url = 'https://gyexgtobqvonkmyesqkl.supabase.co/storage/v1/object/public/medias/medias/laptop%20asus%20expertbook%20b1%20b1402cba-eb4202w%202.webp';

  try {
    const result = await checkFileMetadata(url);

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

    if (result.parsedMetadata && Object.keys(result.parsedMetadata).length > 0) {
      console.log('🔍 Parsed Metadata:', result.parsedMetadata);
    }

    if (result.error) {
      console.log('❌ Error:', result.error);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testUploadedFile();