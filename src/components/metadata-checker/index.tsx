import React, { useState, useCallback } from 'react';
import { Card, Button, Upload, message, Typography, Divider, Alert, Space, Tag } from 'antd';
import { UploadOutlined, FileImageOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useDropzone } from 'react-dropzone';
import { checkFileMetadata, testFileMetadata, MetadataCheckResult } from '../../utils/metadata-checker';

const { Title, Text, Paragraph } = Typography;

export const MetadataChecker: React.FC = () => {
  const [checkResult, setCheckResult] = useState<MetadataCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [testUrl, setTestUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Handle file drop
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setLoading(true);

    // Set image preview
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    try {
      console.log('🔍 Checking metadata for uploaded file:', file.name);
      console.log('📊 File size:', file.size, 'bytes');
      console.log('📁 File type:', file.type);

      const result = await checkFileMetadata(file);
      console.log('📋 Metadata check result:', result);

      setCheckResult(result);

      if (result.hasMetadata) {
        message.success(`File "${file.name}" có chứa metadata!`);
      } else {
        message.warning(`File "${file.name}" không có metadata hoặc metadata đã bị mất!`);
      }
    } catch (error) {
      console.error('❌ Error checking metadata:', error);
      message.error('Có lỗi khi kiểm tra metadata');
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle URL test
  const handleTestUrl = async () => {
    if (!testUrl.trim()) {
      message.warning('Vui lòng nhập URL của file cần kiểm tra');
      return;
    }

    setLoading(true);
    // Set preview for URL
    setImagePreview(testUrl);

    try {
      console.log('🔍 Testing metadata for URL:', testUrl);
      console.log('🌐 Fetching file from URL...');

      const result = await testFileMetadata(testUrl);
      console.log('📋 URL test result:', result);

      setCheckResult(result);

      if (result.hasMetadata) {
        message.success('File từ URL có chứa metadata!');
      } else {
        message.warning('File từ URL không có metadata hoặc metadata đã bị mất!');
      }
    } catch (error) {
      console.error('❌ Error testing URL:', error);
      message.error('Có lỗi khi test URL. Kiểm tra console để xem chi tiết.');
    } finally {
      setLoading(false);
    }
  };

  // Clear results
  const clearResults = () => {
    setCheckResult(null);
    setImagePreview(null);
    setTestUrl('');
    message.info('Đã xóa kết quả kiểm tra');
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif']
    },
    multiple: false
  });

  const renderMetadataResult = () => {
    if (!checkResult) return null;

    return (
      <Card title="📊 Kết quả kiểm tra Metadata" style={{ marginTop: 20 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          {/* Metadata Status */}
          <Alert
            message={checkResult.hasMetadata ? "✅ File có chứa metadata" : "❌ File không có metadata"}
            type={checkResult.hasMetadata ? "success" : "warning"}
            showIcon
            icon={checkResult.hasMetadata ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          />

          {/* Technical Info */}
          {checkResult.technicalInfo && (
            <Card size="small" title="📐 Thông tin kỹ thuật" style={{ marginBottom: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                <div>
                  <Text strong>Định dạng:</Text>
                  <br />
                  <Tag color="blue" style={{ fontSize: 14, padding: '4px 8px' }}>
                    {checkResult.technicalInfo.format.toUpperCase()}
                  </Tag>
                </div>
                <div>
                  <Text strong>Kích thước:</Text>
                  <br />
                  <Text style={{ fontSize: 14 }}>
                    {checkResult.technicalInfo.width} × {checkResult.technicalInfo.height} pixels
                  </Text>
                </div>
                <div>
                  <Text strong>Dung lượng:</Text>
                  <br />
                  <Text style={{ fontSize: 14 }}>
                    {(checkResult.technicalInfo.size / 1024).toFixed(1)} KB
                    {checkResult.technicalInfo.size > 1024 * 1024 && 
                      ` (${(checkResult.technicalInfo.size / (1024 * 1024)).toFixed(1)} MB)`
                    }
                  </Text>
                </div>
                {checkResult.technicalInfo.channels && (
                  <div>
                    <Text strong>Channels:</Text>
                    <br />
                    <Text style={{ fontSize: 14 }}>{checkResult.technicalInfo.channels}</Text>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Parsed Metadata - Enhanced Display */}
          {checkResult.parsedMetadata && Object.keys(checkResult.parsedMetadata).length > 0 && (
            <Card size="small" title="🏷️ Thông tin Metadata chi tiết" style={{ marginBottom: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
                {checkResult.parsedMetadata.copyright && (
                  <div style={{ padding: 12, background: '#f0f8ff', borderRadius: 6, border: '1px solid #d9d9d9' }}>
                    <Text strong style={{ color: '#1890ff' }}>📜 Copyright:</Text>
                    <br />
                    <Text style={{ fontSize: 13, fontFamily: 'monospace' }}>{checkResult.parsedMetadata.copyright}</Text>
                  </div>
                )}

                {checkResult.parsedMetadata.creator_artist && (
                  <div style={{ padding: 12, background: '#f6ffed', borderRadius: 6, border: '1px solid #d9d9d9' }}>
                    <Text strong style={{ color: '#52c41a' }}>🎨 Creator/Artist:</Text>
                    <br />
                    <Text style={{ fontSize: 13, fontFamily: 'monospace' }}>{checkResult.parsedMetadata.creator_artist}</Text>
                  </div>
                )}

                {checkResult.parsedMetadata.software && (
                  <div style={{ padding: 12, background: '#fff2e8', borderRadius: 6, border: '1px solid #d9d9d9' }}>
                    <Text strong style={{ color: '#fa8c16' }}>🛠️ Software:</Text>
                    <br />
                    <Text style={{ fontSize: 13, fontFamily: 'monospace' }}>{checkResult.parsedMetadata.software}</Text>
                  </div>
                )}

                {checkResult.parsedMetadata.caption_description && (
                  <div style={{ padding: 12, background: '#f9f0ff', borderRadius: 6, border: '1px solid #d9d9d9' }}>
                    <Text strong style={{ color: '#722ed1' }}>📝 Description:</Text>
                    <br />
                    <Text style={{ fontSize: 13, fontFamily: 'monospace' }}>{checkResult.parsedMetadata.caption_description}</Text>
                  </div>
                )}

                {checkResult.parsedMetadata.user_comment && (
                  <div style={{ padding: 12, background: '#fff1f0', borderRadius: 6, border: '1px solid #d9d9d9' }}>
                    <Text strong style={{ color: '#f5222d' }}>💬 User Comment:</Text>
                    <br />
                    <Text style={{ fontSize: 13, fontFamily: 'monospace' }}>{checkResult.parsedMetadata.user_comment}</Text>
                  </div>
                )}

                {checkResult.parsedMetadata.credit && (
                  <div style={{ padding: 12, background: '#f0f5ff', borderRadius: 6, border: '1px solid #d9d9d9' }}>
                    <Text strong style={{ color: '#2f54eb' }}>🏆 Credit:</Text>
                    <br />
                    <Text style={{ fontSize: 13, fontFamily: 'monospace' }}>{checkResult.parsedMetadata.credit}</Text>
                  </div>
                )}

                {checkResult.parsedMetadata.keywords && checkResult.parsedMetadata.keywords.length > 0 && (
                  <div style={{ padding: 12, background: '#fcffe6', borderRadius: 6, border: '1px solid #d9d9d9' }}>
                    <Text strong style={{ color: '#a0d911' }}>🏷️ Keywords:</Text>
                    <br />
                    <Space wrap style={{ marginTop: 4 }}>
                      {checkResult.parsedMetadata.keywords.map((keyword, index) => (
                        <Tag key={index} color="green" style={{ fontSize: 11 }}>
                          {keyword}
                        </Tag>
                      ))}
                    </Space>
                  </div>
                )}

                {checkResult.parsedMetadata.contact_info && (
                  <div style={{ padding: 12, background: '#e6fffb', borderRadius: 6, border: '1px solid #d9d9d9' }}>
                    <Text strong style={{ color: '#13c2c2' }}>📧 Contact Info:</Text>
                    <br />
                    <Text style={{ fontSize: 13, fontFamily: 'monospace' }}>{checkResult.parsedMetadata.contact_info}</Text>
                  </div>
                )}

                {/* Debug info */}
                <div style={{ padding: 12, background: '#f5f5f5', borderRadius: 6, border: '1px solid #d9d9d9', gridColumn: '1 / -1' }}>
                  <Text strong style={{ color: '#666', fontSize: 12 }}>🔍 Debug Info:</Text>
                  <br />
                  <Text style={{ fontSize: 11, fontFamily: 'monospace', color: '#666' }}>
                    Parsed fields: {Object.keys(checkResult.parsedMetadata).join(', ')}
                  </Text>
                </div>
              </div>
            </Card>
          )}

          {/* Show message if no parsed metadata */}
          {checkResult && checkResult.hasMetadata && (!checkResult.parsedMetadata || Object.keys(checkResult.parsedMetadata).length === 0) && (
            <Alert
              message="⚠️ Metadata detected but parsing failed"
              description="File có chứa metadata nhưng không thể parse được thông tin chi tiết. Kiểm tra console để xem debug info."
              type="warning"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}

          {/* EXIF Data - Enhanced Display */}
          {checkResult.exifData && Object.keys(checkResult.exifData).length > 0 && (
            <Card size="small" title="📋 EXIF Metadata" style={{ marginBottom: 16 }}>
              {checkResult.exifData.hasEXIF ? (
                <div>
                  <Alert 
                    message="✅ File chứa EXIF metadata" 
                    type="success" 
                    showIcon 
                    style={{ marginBottom: 12 }}
                  />
                  
                  {/* EXIF Fields Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 12, marginBottom: 12 }}>
                    {checkResult.exifData.chunkSize && (
                      <div>
                        <Text strong>EXIF Chunk Size:</Text>
                        <br />
                        <Text>{checkResult.exifData.chunkSize} bytes</Text>
                      </div>
                    )}
                    
                    {checkResult.exifData.copyright && (
                      <div>
                        <Text strong style={{ color: '#1890ff' }}>Copyright:</Text>
                        <br />
                        <Text style={{ fontSize: 12, fontFamily: 'monospace' }}>{checkResult.exifData.copyright}</Text>
                      </div>
                    )}
                    
                    {checkResult.exifData.creator_artist && (
                      <div>
                        <Text strong style={{ color: '#52c41a' }}>Artist:</Text>
                        <br />
                        <Text style={{ fontSize: 12, fontFamily: 'monospace' }}>{checkResult.exifData.creator_artist}</Text>
                      </div>
                    )}
                    
                    {checkResult.exifData.software && (
                      <div>
                        <Text strong style={{ color: '#fa8c16' }}>Software:</Text>
                        <br />
                        <Text style={{ fontSize: 12, fontFamily: 'monospace' }}>{checkResult.exifData.software}</Text>
                      </div>
                    )}
                    
                    {checkResult.exifData.description && (
                      <div>
                        <Text strong style={{ color: '#722ed1' }}>Description:</Text>
                        <br />
                        <Text style={{ fontSize: 12, fontFamily: 'monospace' }}>{checkResult.exifData.description}</Text>
                      </div>
                    )}
                    
                    {checkResult.exifData.userComment && (
                      <div>
                        <Text strong style={{ color: '#f5222d' }}>User Comment:</Text>
                        <br />
                        <Text style={{ fontSize: 12, fontFamily: 'monospace' }}>{checkResult.exifData.userComment}</Text>
                      </div>
                    )}
                    
                    {(checkResult.exifData.cameraMake || checkResult.exifData.cameraModel) && (
                      <div>
                        <Text strong style={{ color: '#13c2c2' }}>Camera:</Text>
                        <br />
                        <Text style={{ fontSize: 12, fontFamily: 'monospace' }}>
                          {checkResult.exifData.cameraMake} {checkResult.exifData.cameraModel}
                        </Text>
                      </div>
                    )}
                    
                    <div>
                      <Text strong>Trạng thái:</Text>
                      <br />
                      <Tag color="green">Có EXIF data</Tag>
                    </div>
                  </div>
                  
                  <Divider style={{ margin: '12px 0' }} />
                  <details>
                    <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: 8 }}>
                      🔍 Xem chi tiết EXIF data (Raw)
                    </summary>
                    <div style={{ background: '#f5f5f5', padding: 12, borderRadius: 6, maxHeight: 300, overflow: 'auto' }}>
                      <pre style={{ margin: 0, fontSize: 11, fontFamily: 'monospace' }}>
                        {JSON.stringify(checkResult.exifData, null, 2)}
                      </pre>
                    </div>
                  </details>
                </div>
              ) : (
                <Alert message="❌ Không tìm thấy EXIF metadata" type="info" />
              )}
            </Card>
          )}

          {/* XMP Data - Enhanced Display */}
          {checkResult.xmpData && Object.keys(checkResult.xmpData).length > 0 && (
            <Card size="small" title="📋 XMP Metadata" style={{ marginBottom: 16 }}>
              {checkResult.xmpData.hasXMP ? (
                <div>
                  <Alert 
                    message="✅ File chứa XMP metadata" 
                    type="success" 
                    showIcon 
                    style={{ marginBottom: 12 }}
                  />
                  
                  {/* XMP Fields Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 12, marginBottom: 12 }}>
                    {checkResult.xmpData.chunkSize && (
                      <div>
                        <Text strong>XMP Chunk Size:</Text>
                        <br />
                        <Text>{checkResult.xmpData.chunkSize} bytes</Text>
                      </div>
                    )}
                    
                    {checkResult.xmpData.title && (
                      <div>
                        <Text strong style={{ color: '#722ed1' }}>Title:</Text>
                        <br />
                        <Text style={{ fontSize: 12, fontFamily: 'monospace' }}>{checkResult.xmpData.title}</Text>
                      </div>
                    )}
                    
                    {checkResult.xmpData.description && (
                      <div>
                        <Text strong style={{ color: '#1890ff' }}>Description:</Text>
                        <br />
                        <Text style={{ fontSize: 12, fontFamily: 'monospace' }}>{checkResult.xmpData.description}</Text>
                      </div>
                    )}
                    
                    {checkResult.xmpData.creator && (
                      <div>
                        <Text strong style={{ color: '#52c41a' }}>Creator:</Text>
                        <br />
                        <Text style={{ fontSize: 12, fontFamily: 'monospace' }}>{checkResult.xmpData.creator}</Text>
                      </div>
                    )}
                    
                    {checkResult.xmpData.rights && (
                      <div>
                        <Text strong style={{ color: '#fa8c16' }}>Rights:</Text>
                        <br />
                        <Text style={{ fontSize: 12, fontFamily: 'monospace' }}>{checkResult.xmpData.rights}</Text>
                      </div>
                    )}
                    
                    {checkResult.xmpData.credit && (
                      <div>
                        <Text strong style={{ color: '#2f54eb' }}>Credit:</Text>
                        <br />
                        <Text style={{ fontSize: 12, fontFamily: 'monospace' }}>{checkResult.xmpData.credit}</Text>
                      </div>
                    )}
                    
                    <div>
                      <Text strong>Trạng thái:</Text>
                      <br />
                      <Tag color="green">Có XMP data</Tag>
                    </div>
                  </div>
                  
                  {/* XMP Keywords */}
                  {checkResult.xmpData.keywords && checkResult.xmpData.keywords.length > 0 && (
                    <div style={{ marginBottom: 12 }}>
                      <Text strong style={{ color: '#a0d911' }}>XMP Keywords:</Text>
                      <br />
                      <Space wrap style={{ marginTop: 4 }}>
                        {checkResult.xmpData.keywords.map((keyword, index) => (
                          <Tag key={index} color="purple" style={{ fontSize: 11 }}>
                            {keyword}
                          </Tag>
                        ))}
                      </Space>
                    </div>
                  )}
                  
                  <Divider style={{ margin: '12px 0' }} />
                  <details>
                    <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: 8 }}>
                      🔍 Xem chi tiết XMP data (Raw)
                    </summary>
                    <div style={{ background: '#f5f5f5', padding: 12, borderRadius: 6, maxHeight: 300, overflow: 'auto' }}>
                      <pre style={{ margin: 0, fontSize: 11, fontFamily: 'monospace' }}>
                        {JSON.stringify(checkResult.xmpData, null, 2)}
                      </pre>
                    </div>
                  </details>
                </div>
              ) : (
                <Alert message="❌ Không tìm thấy XMP metadata" type="info" />
              )}
            </Card>
          )}

          {/* Summary Card */}
          <Card size="small" title="📝 Tóm tắt kết quả">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              <div>
                <Text strong>Có metadata:</Text>
                <br />
                {checkResult.hasMetadata ? (
                  <Tag color="green" icon={<CheckCircleOutlined />}>Có</Tag>
                ) : (
                  <Tag color="red" icon={<CloseCircleOutlined />}>Không</Tag>
                )}
              </div>
              
              <div>
                <Text strong>Loại metadata tìm thấy:</Text>
                <br />
                <Space wrap>
                  {checkResult.exifData?.hasEXIF && <Tag color="blue">EXIF</Tag>}
                  {checkResult.xmpData?.hasXMP && <Tag color="purple">XMP</Tag>}
                  {checkResult.technicalInfo && <Tag color="orange">Technical Info</Tag>}
                  {checkResult.parsedMetadata && Object.keys(checkResult.parsedMetadata).length > 0 && <Tag color="cyan">Parsed Data</Tag>}
                  {!checkResult.hasMetadata && <Tag color="default">Không có</Tag>}
                </Space>
              </div>
              
              {/* Thống kê fields */}
              {checkResult.parsedMetadata && (
                <div>
                  <Text strong>Các fields metadata:</Text>
                  <br />
                  <Space wrap>
                    {checkResult.parsedMetadata.copyright && <Tag color="geekblue" style={{ fontSize: 10 }}>Copyright</Tag>}
                    {checkResult.parsedMetadata.creator_artist && <Tag color="green" style={{ fontSize: 10 }}>Artist</Tag>}
                    {checkResult.parsedMetadata.software && <Tag color="orange" style={{ fontSize: 10 }}>Software</Tag>}
                    {checkResult.parsedMetadata.caption_description && <Tag color="purple" style={{ fontSize: 10 }}>Description</Tag>}
                    {checkResult.parsedMetadata.user_comment && <Tag color="red" style={{ fontSize: 10 }}>Comment</Tag>}
                    {checkResult.parsedMetadata.credit && <Tag color="blue" style={{ fontSize: 10 }}>Credit</Tag>}
                    {checkResult.parsedMetadata.keywords && checkResult.parsedMetadata.keywords.length > 0 && <Tag color="lime" style={{ fontSize: 10 }}>Keywords ({checkResult.parsedMetadata.keywords.length})</Tag>}
                    {checkResult.parsedMetadata.contact_info && <Tag color="cyan" style={{ fontSize: 10 }}>Contact</Tag>}
                  </Space>
                </div>
              )}
              
              <div>
                <Text strong>Chất lượng metadata:</Text>
                <br />
                {(() => {
                  let score = 0;
                  let total = 0;
                  
                  if (checkResult.hasMetadata) {
                    if (checkResult.parsedMetadata?.copyright) score++;
                    if (checkResult.parsedMetadata?.creator_artist) score++;
                    if (checkResult.parsedMetadata?.caption_description) score++;
                    if (checkResult.parsedMetadata?.keywords && checkResult.parsedMetadata.keywords.length > 0) score++;
                    total = 4;
                  }
                  
                  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
                  let color = 'red';
                  let text = 'Kém';
                  
                  if (percentage >= 75) { color = 'green'; text = 'Tốt'; }
                  else if (percentage >= 50) { color = 'orange'; text = 'Trung bình'; }
                  else if (percentage >= 25) { color = 'gold'; text = 'Yếu'; }
                  
                  return (
                    <Tag color={color}>
                      {text} ({score}/{total} - {percentage}%)
                    </Tag>
                  );
                })()}
              </div>
            </div>
          </Card>

          {/* Error */}
          {checkResult.error && (
            <Alert
              message="❌ Lỗi khi kiểm tra metadata"
              description={checkResult.error}
              type="error"
              showIcon
            />
          )}
        </Space>
      </Card>
    );
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <Title level={2}>🔍 Metadata Checker - Kiểm tra Metadata trong Files</Title>
      
      <Alert
        message="Công cụ này giúp bạn kiểm tra xem files đã tải từ Supabase có còn metadata hay không"
        description="Upload file hoặc nhập URL để kiểm tra EXIF, XMP và metadata khác. Đặc biệt hữu ích để debug vấn đề metadata bị mất."
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      {/* File Upload Section */}
      <Card title="📁 Upload File để kiểm tra" style={{ marginBottom: 20 }}>
        <div
          {...getRootProps()}
          style={{
            border: '2px dashed #d9d9d9',
            borderRadius: 6,
            padding: 40,
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: isDragActive ? '#f0f8ff' : '#fafafa',
            marginBottom: 16
          }}
        >
          <input {...getInputProps()} />
          <FileImageOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
          <p style={{ fontSize: 16, marginBottom: 8 }}>
            {isDragActive ? 'Thả file vào đây...' : 'Kéo thả file hoặc click để chọn'}
          </p>
          <p style={{ fontSize: 14, color: '#666' }}>
            Hỗ trợ: JPG, PNG, WebP, GIF
          </p>
        </div>
      </Card>

      {/* URL Test Section */}
      <Card title="🌐 Test URL từ Supabase Storage" style={{ marginBottom: 20 }}>
        <Space.Compact style={{ width: '100%' }}>
          <input
            style={{
              flex: 1,
              padding: '8px 12px',
              border: '1px solid #d9d9d9',
              borderRadius: '6px 0 0 6px',
              fontSize: 14
            }}
            placeholder="Nhập URL của file cần kiểm tra (VD: https://your-project.supabase.co/storage/v1/object/public/medias/...)"
            value={testUrl}
            onChange={(e) => setTestUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleTestUrl()}
          />
          <Button
            type="primary"
            onClick={handleTestUrl}
            loading={loading}
            style={{ borderRadius: '0 6px 6px 0' }}
          >
            Kiểm tra URL
          </Button>
        </Space.Compact>

        {/* Test URLs for debugging */}
        <div style={{ marginTop: 12 }}>
          <Text strong style={{ fontSize: 12, color: '#666' }}>Test URLs:</Text>
          <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
            <Button
              size="small"
              onClick={() => setTestUrl('http://localhost:3001/api/health')}
              style={{ fontSize: 11 }}
            >
              Test API Health
            </Button>
            <Button
              size="small"
              onClick={() => {
                console.log('🔍 Current checkResult:', checkResult);
                console.log('🔍 Parsed metadata:', checkResult?.parsedMetadata);
                console.log('🔍 EXIF data:', checkResult?.exifData);
                console.log('🔍 XMP data:', checkResult?.xmpData);
                message.info('Check console for debug info');
              }}
              style={{ fontSize: 11 }}
            >
              Debug Result
            </Button>
            <Button
              size="small"
              onClick={async () => {
                try {
                  const response = await fetch('http://localhost:3001/api/health');
                  const data = await response.json();
                  message.success(`API Status: ${data.message}`);
                } catch (error) {
                  message.error('API not reachable');
                }
              }}
              style={{ fontSize: 11 }}
            >
              Check API Status
            </Button>
            <Button
              size="small"
              onClick={async () => {
                // Create a test image with metadata
                const testImageBlob = new Blob(['test image data'], { type: 'image/jpeg' });
                const testFile = new File([testImageBlob], 'test-image.jpg', { type: 'image/jpeg' });

                const formData = new FormData();
                formData.append('image', testFile);
                formData.append('metadata', JSON.stringify({
                  title: 'Test Image',
                  description: 'Test metadata embedding',
                  copyright: '© 2024 Test Company',
                  creator: 'Test Creator',
                  credit: 'Test Credit',
                  keywords: ['test', 'metadata']
                }));
                formData.append('metadataOnly', 'true');

                try {
                  const response = await fetch('http://localhost:3001/api/convert-webp', {
                    method: 'POST',
                    body: formData
                  });

                  if (response.ok) {
                    const processedBlob = await response.blob();
                    const processedFile = new File([processedBlob], 'test-processed.webp', { type: 'image/webp' });

                    // Now test the processed file
                    const result = await checkFileMetadata(processedFile);
                    setCheckResult(result);
                    setImagePreview(URL.createObjectURL(processedBlob));

                    message.success('Test file processed and checked!');
                  } else {
                    message.error('Failed to process test file');
                  }
                } catch (error) {
                  message.error('Error processing test file');
                }
              }}
              style={{ fontSize: 11 }}
            >
              Test Metadata Processing
            </Button>
          </div>
        </div>
        
        <div style={{ marginTop: 12, fontSize: 12, color: '#666' }}>
          <strong>💡 Mẹo:</strong> Copy URL từ Supabase Storage hoặc từ admin panel để kiểm tra
        </div>
        
        {(checkResult || imagePreview) && (
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <Button onClick={clearResults} type="default">
              🗑️ Xóa kết quả
            </Button>
          </div>
        )}
      </Card>

      {/* Sample URLs for testing */}
      <Card title="🧪 URL mẫu để test" size="small" style={{ marginBottom: 20 }}>
        <Paragraph style={{ fontSize: 12, margin: 0 }}>
          <strong>Cách lấy URL để test:</strong><br />
          1. Vào Supabase Dashboard {'&gt;'} Storage {'&gt;'} medias bucket<br />
          2. Click vào file và copy URL<br />
          3. Hoặc vào Admin Panel {'&gt;'} Media {'&gt;'} Click vào image và copy URL<br />
          4. Paste URL vào ô input trên và click "Kiểm tra URL"
        </Paragraph>
      </Card>

      {/* Image Preview */}
      {imagePreview && (
        <Card title="🖼️ Xem trước ảnh" style={{ marginBottom: 20 }}>
          <div style={{ textAlign: 'center' }}>
            <img 
              src={imagePreview} 
              alt="Preview" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '400px', 
                objectFit: 'contain',
                border: '1px solid #d9d9d9',
                borderRadius: 6
              }} 
            />
          </div>
        </Card>
      )}

      {/* Results */}
      {renderMetadataResult()}

      {/* Instructions */}
      <Card title="📚 Hướng dẫn sử dụng" style={{ marginTop: 20 }}>
        <div>
          <Title level={5}>🎯 Mục đích:</Title>
          <ul>
            <li>Kiểm tra xem metadata có bị mất sau khi upload lên Supabase không</li>
            <li>Debug vấn đề Sharp WebP conversion có preserve metadata đúng không</li>
            <li>So sánh metadata giữa file gốc và file đã upload</li>
          </ul>

          <Title level={5}>🔍 Các loại metadata được kiểm tra:</Title>
          <ul>
            <li><strong>EXIF:</strong> Thông tin camera, copyright, software, vv</li>
            <li><strong>XMP:</strong> Metadata mở rộng (Adobe standard)</li>
            <li><strong>Technical:</strong> Kích thước, định dạng, file size</li>
          </ul>

          <Title level={5}>⚠️ Lưu ý:</Title>
          <ul>
            <li>Metadata có thể bị mất khi upload qua một số service</li>
            <li>WebP format hỗ trợ EXIF và XMP metadata</li>
            <li>Kiểm tra console browser để xem log chi tiết</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};