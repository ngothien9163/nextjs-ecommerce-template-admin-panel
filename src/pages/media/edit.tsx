import React, { useState, useRef, useEffect } from "react";
import { Edit, useForm } from "@refinedev/antd";
import { useNavigate } from "react-router-dom";
import { useUpdate } from "@refinedev/core";
import {
  Form,
  Button,
  Card,
  Image,
  Space,
  message,
  Typography,
  Divider,
} from "antd";
import {
  SaveOutlined,
  ScissorOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  ArrowLeftOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { supabaseAdmin } from "../../lib/supabase-admin";
import { MediaFormFields } from "../../components/media-form-fields";
import { MediaTechnicalInfo } from "../../components/media-technical-info";
import { MediaSEOSection } from "../../components/media-seo-section";
import { SEOMediaService } from "../../lib/seo-media-service";

const { Text } = Typography;

export const MediaEdit: React.FC = () => {
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    x: 0,
    y: 0,
    width: 30,
    height: 30,
  });
  const [isCropping, setIsCropping] = useState(false);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);
  const navigate = useNavigate();

  // Debug useEffect
  useEffect(() => {
    console.log("🔍 Debug state:", {
      isCropping,
      crop,
      croppedImageUrl: !!croppedImageUrl,
      imageRef: !!imageRef.current,
      imageLoaded: imageRef.current?.complete
    });
  }, [isCropping, crop, croppedImageUrl]);

  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: "media",
  });

  const mediaData = queryResult?.data?.data;
  const { mutate: updateMedia } = useUpdate();

  // Crop functionality
  const onCropChange = (crop: Crop) => {
    console.log("🔍 onCropChange called:", crop);
    setCrop(crop);
  };

  const onCropComplete = async (crop: any, pixelCrop: any) => {
    console.log("🔍 onCropComplete called:", { crop, pixelCrop });
    
    if (!imageRef.current) {
      console.log("❌ imageRef.current is null");
      return;
    }

    // Check if crop has valid dimensions
    if (!pixelCrop || !pixelCrop.width || !pixelCrop.height) {
      console.log("❌ Invalid pixelCrop:", pixelCrop);
      return;
    }

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        console.log("❌ Canvas context is null");
        return;
      }

      const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
      const scaleY = imageRef.current.naturalHeight / imageRef.current.height;

      console.log("🔍 Scale factors:", { scaleX, scaleY });
      console.log("🔍 Pixel crop dimensions:", { width: pixelCrop.width, height: pixelCrop.height });

      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      ctx.drawImage(
        imageRef.current,
        pixelCrop.x * scaleX,
        pixelCrop.y * scaleY,
        pixelCrop.width * scaleX,
        pixelCrop.height * scaleY,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      const croppedImageBlob = await new Promise<Blob>((resolve) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              console.log("✅ Blob created successfully:", blob.size, "bytes");
              resolve(blob);
            } else {
              console.log("❌ Failed to create blob");
            }
          },
          "image/jpeg",
          0.9
        );
      });

      const croppedImageUrl = URL.createObjectURL(croppedImageBlob);
      console.log("✅ Setting croppedImageUrl:", croppedImageUrl);
      setCroppedImageUrl(croppedImageUrl);
    } catch (error) {
      console.error("❌ Error in onCropComplete:", error);
    }
  };

  // Add a manual crop trigger function
  const handleManualCrop = () => {
    if (imageRef.current && crop.width && crop.height) {
      console.log("🔍 Manual crop trigger");
      console.log("🔍 Current crop:", crop);
      
      // Convert percentage crop to pixel crop
      const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
      const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
      
      const pixelCrop = {
        x: Math.round((crop.x / 100) * imageRef.current.width),
        y: Math.round((crop.y / 100) * imageRef.current.height),
        width: Math.round((crop.width / 100) * imageRef.current.width),
        height: Math.round((crop.height / 100) * imageRef.current.height)
      };
      
      console.log("🔍 Calculated pixelCrop:", pixelCrop);
      onCropComplete(crop, pixelCrop);
    } else {
      console.log("❌ Cannot trigger manual crop:", {
        imageRef: !!imageRef.current,
        cropWidth: crop.width,
        cropHeight: crop.height
      });
    }
  };

  const handleCropSave = async () => {
    if (!croppedImageUrl) return;

    try {
      // Convert blob URL to file
      const response = await fetch(croppedImageUrl);
      const blob = await response.blob();
      const file = new File(
        [blob],
        mediaData?.file_name || "cropped-image.jpg",
        { type: "image/jpeg" }
      );

      // Calculate new technical specifications
      const fileSizeKB = Math.round(file.size / 1024);
      const imageFormat = file.type.split("/")[1]?.toUpperCase() || "JPEG";
      
      // Get image dimensions from the current crop
      const currentCrop = crop;
      let newDimensions = { width: 0, height: 0 };
      
      if (imageRef.current && currentCrop.width && currentCrop.height) {
        // Calculate actual pixel dimensions from crop
        const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
        const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
        
        newDimensions = {
          width: Math.round(currentCrop.width * scaleX),
          height: Math.round(currentCrop.height * scaleY)
        };
      }

      console.log("🔍 New technical specs:", {
        fileSize: file.size,
        fileSizeKB,
        imageFormat,
        dimensions: newDimensions,
        mimeType: file.type
      });

      // Upload cropped image
      const fileExt = file.name.split(".").pop();
      const fileName = `cropped-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;
      const filePath = `media/${fileName}`;

      const { data: uploadData, error: uploadError } =
        await supabaseAdmin.storage.from("media").upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabaseAdmin.storage
        .from("media")
        .getPublicUrl(filePath);

      // Update media record with all technical specifications
      const updateData: any = {
        file_path: filePath,
        file_url: urlData.publicUrl,
        file_size: file.size,
        file_size_kb: fileSizeKB,
        mime_type: file.type,
        image_format: imageFormat,
        image_dimensions: `${newDimensions.width}x${newDimensions.height}`,
        dimensions: newDimensions,
      };

      // Update SEO scores if they exist
      if (mediaData?.seo_score) {
        updateData.seo_score = Math.max(mediaData.seo_score - 5, 70); // Slight decrease for crop
      }
      if (mediaData?.accessibility_score) {
        updateData.accessibility_score = Math.max(mediaData.accessibility_score - 3, 75);
      }
      if (mediaData?.performance_score) {
        updateData.performance_score = Math.max(mediaData.performance_score - 2, 80);
      }

      // Increment version number
      updateData.version = (mediaData?.version || 1) + 1;

      console.log("🔍 Updating database with:", updateData);

      const { error: updateError } = await supabaseAdmin
        .from("media")
        .update(updateData)
        .eq("id", mediaData?.id);

      if (updateError) throw updateError;

      message.success("Đã crop và lưu hình ảnh thành công!");
      setIsCropping(false);
      setCroppedImageUrl(null);

      // Refresh form data
      window.location.reload();
    } catch (error) {
      console.error("Crop save error:", error);
      message.error("Có lỗi xảy ra khi lưu hình ảnh đã crop!");
    }
  };

  const handleRotate = (direction: "left" | "right") => {
    const newRotation = direction === "left" ? rotation - 90 : rotation + 90;
    setRotation(newRotation);
  };

  const applyRotation = (imageUrl: string): Promise<string> => {
    if (rotation === 0) return Promise.resolve(imageUrl);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new window.Image();

    return new Promise<string>((resolve) => {
      img.onload = () => {
        canvas.width = img.height;
        canvas.height = img.width;

        ctx?.translate(canvas.width / 2, canvas.height / 2);
        ctx?.rotate((rotation * Math.PI) / 180);
        ctx?.drawImage(img, -img.width / 2, -img.height / 2);

        resolve(canvas.toDataURL());
      };
      img.src = imageUrl;
    });
  };

  // Navigation functions
  const handleBackToList = () => {
    navigate("/media");
  };

  const handleViewMedia = () => {
    if (mediaData?.id) {
      navigate(`/media/show/${mediaData.id}`);
    }
  };

  // Custom save handler to reload data after save
  const handleSave = async () => {
    try {
      // Validate form
      await formProps.form?.validateFields();
      const values = formProps.form?.getFieldsValue();

      if (!mediaData?.id) {
        message.error("Không tìm thấy ID của media!");
        return;
      }

      // Tách SEO data từ values (sử dụng safe destructuring)
      const valuesObj = values || {};
      const seoFields = [
        'og_title', 'og_description', 'og_image', 'twitter_title', 'twitter_description', 'twitter_image',
        'schema_markup', 'compression_ratio', 'optimization_score', 'responsive_images',
        'webp_version_url', 'avif_version_url', 'ai_alt_text', 'ai_description', 'ai_tags',
        'ai_relevance_score', 'visual_search_optimized', 'visual_search_tags', 'voice_search_optimized',
        'voice_search_phrases', 'social_shares', 'social_engagement', 'click_through_rate',
        'impressions', 'clicks', 'alt_text_translations', 'caption_translations',
        'auto_optimization_enabled', 'manual_override'
      ];

      const seoData: any = {};
      const mediaDataOnly: any = {};

      Object.keys(valuesObj).forEach(key => {
        if (seoFields.includes(key)) {
          seoData[key] = (valuesObj as any)[key];
        } else {
          mediaDataOnly[key] = (valuesObj as any)[key];
        }
      });

      // Update media data using useUpdate hook
      await updateMedia({
        resource: "media",
        id: mediaData.id,
        values: mediaDataOnly,
      });

      // Lưu SEO data vào bảng seo_medias
      try {
        const seoDataToSave = SEOMediaService.convertFormDataToSEOMedia(seoData, String(mediaData.id));
        await SEOMediaService.saveSEOMediaData(seoDataToSave);
        console.log('✅ SEO data saved to seo_medias table');
      } catch (seoError) {
        console.error('❌ Error saving SEO data:', seoError);
        // Không throw error để không làm fail toàn bộ process
      }

      // Show success message
      message.success("Cập nhật thành công!");

      // Reload the data
      queryResult?.refetch();

    } catch (error) {
      console.error("Save error:", error);
      message.error("Có lỗi xảy ra khi lưu!");
    }
  };

  return (
    <Edit 
      saveButtonProps={{
        ...saveButtonProps,
        onClick: handleSave,
      }}
      headerButtons={[
        <Button
          key="back"
          icon={<ArrowLeftOutlined />}
          onClick={handleBackToList}
        >
          Quay về danh sách
        </Button>,
        <Button
          key="view"
          type="primary"
          icon={<EyeOutlined />}
          onClick={handleViewMedia}
          disabled={!mediaData?.id}
        >
          Xem dữ liệu
        </Button>,
      ]}
    >
      <div style={{ display: "flex", gap: "20px" }}>
        {/* Form Section */}
        <div style={{ flex: 1 }}>
          <Form {...formProps} layout="vertical">
            <Card title="Thông tin Media" style={{ marginBottom: "20px" }}>
              <MediaFormFields mode="edit" form={formProps.form} />
            </Card>

            <Card title="Thông tin kỹ thuật" style={{ marginBottom: "20px" }}>
              <MediaTechnicalInfo mode="edit" />
              
              {/* Display only fields for edit mode */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  marginTop: "16px",
                  padding: "16px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "6px",
                }}
              >
                <div>
                  <Text strong>Ngày tạo:</Text>
                  <br />
                  <Text type="secondary">
                    {mediaData?.created_at
                      ? new Date(mediaData.created_at).toLocaleDateString("vi-VN")
                      : "N/A"}
                  </Text>
                </div>
                <div>
                  <Text strong>Ngày cập nhật:</Text>
                  <br />
                  <Text type="secondary">
                    {mediaData?.updated_at
                      ? new Date(mediaData.updated_at).toLocaleDateString("vi-VN")
                      : "N/A"}
                  </Text>
                </div>
                <div>
                  <Text strong>File Path:</Text>
                  <br />
                  <Text type="secondary" code copyable>
                    {mediaData?.file_path || "N/A"}
                  </Text>
                </div>
                <div>
                  <Text strong>File URL:</Text>
                  <br />
                  <Text type="secondary" code copyable>
                    {mediaData?.file_url || "N/A"}
                  </Text>
                </div>
              </div>
            </Card>

            {/* Card SEO Scores */}
            <Card title="Điểm SEO & Performance" style={{ marginBottom: "20px" }}>
              <MediaSEOSection
                mode="edit"
                form={formProps.form}
                uploadedFiles={[]} // Edit mode doesn't have uploaded files
                selectedFileIndex={0}
              />
            </Card>
          </Form>
        </div>

        {/* Image Preview & Crop Section */}
        <div style={{ flex: 1 }}>
          <Card title="Xem trước & Chỉnh sửa">
            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <Space>
                <Button
                  icon={<ScissorOutlined />}
                  onClick={() => setIsCropping(!isCropping)}
                  type={isCropping ? "primary" : "default"}
                >
                  {isCropping ? "Thoát Crop" : "Crop"}
                </Button>
                <Button
                  icon={<RotateLeftOutlined />}
                  onClick={() => handleRotate("left")}
                >
                  Xoay trái
                </Button>
                <Button
                  icon={<RotateRightOutlined />}
                  onClick={() => handleRotate("right")}
                >
                  Xoay phải
                </Button>
                {isCropping && crop.width && crop.height && (
                  <Button
                    type="dashed"
                    onClick={handleManualCrop}
                    disabled={!imageRef.current}
                  >
                    Tạo Preview
                  </Button>
                )}
              </Space>
            </div>

            <div style={{ position: "relative", textAlign: "center" }}>
              {isCropping ? (
                <div style={{ maxWidth: "100%", overflow: "hidden" }}>
                  <ReactCrop
                    crop={crop}
                    onChange={onCropChange}
                    onComplete={(crop, pixelCrop) =>
                      onCropComplete(crop, pixelCrop)
                    }
                  >
                    <img
                      ref={imageRef}
                      src={mediaData?.file_url}
                      alt={mediaData?.alt_text || mediaData?.file_name}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "400px",
                        transform: `rotate(${rotation}deg)`,
                      }}
                    />
                  </ReactCrop>
                  <div style={{ marginTop: "16px" }}>
                    {croppedImageUrl ? (
                      <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={handleCropSave}
                      >
                        Lưu Crop
                      </Button>
                    ) : (
                      <div style={{ color: "#666", fontSize: "14px" }}>
                        💡 Kéo thả để chọn vùng cắt, sau đó nhấn "Tạo Preview" để xem trước
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <Image
                  src={mediaData?.file_url}
                  alt={mediaData?.alt_text || mediaData?.file_name}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "400px",
                    transform: `rotate(${rotation}deg)`,
                  }}
                  fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                />
              )}
            </div>

            {croppedImageUrl && (
              <div style={{ marginTop: "16px" }}>
                <Divider>Hình ảnh đã crop</Divider>
                <Image
                  src={croppedImageUrl}
                  alt="Cropped preview"
                  style={{ maxWidth: "100%", maxHeight: "200px" }}
                />
              </div>
            )}
          </Card>
        </div>
      </div>
    </Edit>
  );
};
