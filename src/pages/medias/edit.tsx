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
  ReloadOutlined,
} from "@ant-design/icons";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { supabaseAdmin } from "../../lib/supabase-admin";
import { MediaFormFields } from "../../components/media-form-fields";
import { MediaTechnicalInfo } from "../../components/media-technical-info";
import { MediaSEOSection } from "../../components/media-seo-section";
import { MediaFormLayout } from "../../components/media-form-layout";
import { SEOMediaService } from "../../lib/seo-media-service";
import { convertToWebP } from "../../lib/image-utils";

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
  const [refreshTrigger, setRefreshTrigger] = useState(0);
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
    resource: "medias",
  });

  const mediaData = queryResult?.data?.data;
  const { mutate: updateMedia } = useUpdate();

  // Load SEO data when media data is available
  useEffect(() => {
    const loadSEOData = async () => {
      if (mediaData?.id && formProps.form) {
        try {
          console.log('🔍 Loading SEO data for media:', mediaData.id, 'Trigger:', refreshTrigger);
          const seoData = await SEOMediaService.getSEOMediaData(String(mediaData.id));

          if (seoData) {
            console.log('✅ SEO data loaded:', seoData);

            // Convert SEO data back to form format
            const formSEOData: any = {};

            // Map SEO data fields back to form fields
            if (seoData.og_title) formSEOData.og_title = seoData.og_title;
            if (seoData.og_description) formSEOData.og_description = seoData.og_description;
            if (seoData.og_image) formSEOData.og_image = seoData.og_image;
            if (seoData.twitter_title) formSEOData.twitter_title = seoData.twitter_title;
            if (seoData.twitter_description) formSEOData.twitter_description = seoData.twitter_description;
            if (seoData.twitter_image) formSEOData.twitter_image = seoData.twitter_image;
            if (seoData.schema_markup) formSEOData.schema_markup = seoData.schema_markup;
            if (seoData.compression_ratio) formSEOData.compression_ratio = seoData.compression_ratio;
            if (seoData.optimization_score) formSEOData.optimization_score = seoData.optimization_score;
            if (seoData.responsive_images) formSEOData.responsive_images = seoData.responsive_images;
            if (seoData.webp_version_url) formSEOData.webp_version_url = seoData.webp_version_url;
            if (seoData.avif_version_url) formSEOData.avif_version_url = seoData.avif_version_url;
            if (seoData.ai_alt_text) formSEOData.ai_alt_text = seoData.ai_alt_text;
            if (seoData.ai_description) formSEOData.ai_description = seoData.ai_description;
            if (seoData.ai_tags) formSEOData.ai_tags = seoData.ai_tags;
            if (seoData.ai_relevance_score) formSEOData.ai_relevance_score = seoData.ai_relevance_score;
            if (seoData.visual_search_optimized !== undefined) formSEOData.visual_search_optimized = seoData.visual_search_optimized;
            if (seoData.visual_search_tags) formSEOData.visual_search_tags = seoData.visual_search_tags;
            if (seoData.voice_search_optimized !== undefined) formSEOData.voice_search_optimized = seoData.voice_search_optimized;
            if (seoData.voice_search_phrases) formSEOData.voice_search_phrases = seoData.voice_search_phrases;
            if (seoData.social_shares !== undefined) formSEOData.social_shares = seoData.social_shares;
            if (seoData.social_engagement !== undefined) formSEOData.social_engagement = seoData.social_engagement;
            if (seoData.click_through_rate !== undefined) formSEOData.click_through_rate = seoData.click_through_rate;
            if (seoData.impressions !== undefined) formSEOData.impressions = seoData.impressions;
            if (seoData.clicks !== undefined) formSEOData.clicks = seoData.clicks;
            if (seoData.alt_text_translations) formSEOData.alt_text_translations = seoData.alt_text_translations;
            if (seoData.caption_translations) formSEOData.caption_translations = seoData.caption_translations;
            if (seoData.auto_optimization_enabled !== undefined) formSEOData.auto_optimization_enabled = seoData.auto_optimization_enabled;
            if (seoData.manual_override !== undefined) formSEOData.manual_override = seoData.manual_override;
            if (seoData.is_active !== undefined) formSEOData.is_active = seoData.is_active;

            // Set default values for missing fields
            if (seoData.og_type === undefined) formSEOData.og_type = 'image';
            if (seoData.twitter_card === undefined) formSEOData.twitter_card = 'summary_large_image';

            // Set SEO data in form
            formProps.form.setFieldsValue(formSEOData);
            console.log('✅ SEO data populated in form');
          } else {
            console.log('ℹ️ No existing SEO data found for this media');
          }
        } catch (error) {
          console.error('❌ Error loading SEO data:', error);
        }
      }
    };

    loadSEOData();
  }, [mediaData?.id, formProps.form, refreshTrigger]);

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
      const originalFile = new File(
        [blob],
        mediaData?.file_name || "cropped-image.jpg",
        { type: "image/jpeg" }
      );

      // Convert to WebP
      console.log(`🔄 Converting cropped image to WebP...`);
      const result = await convertToWebP(originalFile, 85);

      let fileToUpload = originalFile;
      let finalFileName = originalFile.name;

      if (result.success) {
        fileToUpload = result.file;
        finalFileName = result.file.name;
        console.log(`✅ Cropped image converted to WebP: ${finalFileName}`);
        console.log(`📊 Compression: ${result.originalSize} → ${result.webpSize} bytes (${result.compressionRatio}% saved)`);
      } else {
        console.error(`❌ WebP conversion failed for cropped image:`, result.error);
      }

      // Calculate new technical specifications
      const fileSizeKB = Math.round(fileToUpload.size / 1024);
      const imageFormat = fileToUpload.type.split("/")[1]?.toUpperCase() || "WEBP";

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
        fileSize: fileToUpload.size,
        fileSizeKB,
        imageFormat,
        dimensions: newDimensions,
        mimeType: fileToUpload.type
      });

      // Upload cropped image (WebP)
      const fileName = `cropped-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.webp`;
      const filePath = `media/${fileName}`;

      const { data: uploadData, error: uploadError } =
        await supabaseAdmin.storage.from("media").upload(filePath, fileToUpload);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabaseAdmin.storage
        .from("media")
        .getPublicUrl(filePath);

      // Update media record with all technical specifications
      const updateData: any = {
        file_path: filePath,
        file_url: urlData.publicUrl,
        file_size: fileToUpload.size,
        file_size_kb: fileSizeKB,
        mime_type: fileToUpload.type, // Will be "image/webp"
        image_format: imageFormat, // Will be "WEBP"
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
        .from("medias")
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
    navigate("/medias");
  };

  const handleViewMedia = () => {
    if (mediaData?.id) {
      navigate(`/medias/show/${mediaData.id}`);
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
        'og_title', 'og_description', 'og_image', 'og_type', 'og_site_name', 'og_locale',
        'twitter_card', 'twitter_title', 'twitter_description', 'twitter_image', 'twitter_site', 'twitter_creator',
        'schema_markup', 'compression_ratio', 'optimization_score', 'responsive_images',
        'webp_version_url', 'avif_version_url', 'ai_alt_text', 'ai_description', 'ai_tags',
        'ai_relevance_score', 'visual_search_optimized', 'visual_search_tags', 'voice_search_optimized',
        'voice_search_phrases', 'social_shares', 'social_engagement', 'click_through_rate',
        'impressions', 'clicks', 'alt_text_translations', 'caption_translations',
        'auto_optimization_enabled', 'manual_override', 'is_active'
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
        resource: "medias",
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

      // Reload the data to reflect changes
      console.log('💾 Save completed, triggering refresh');
      await queryResult?.refetch();
      setRefreshTrigger(prev => prev + 1);
      console.log('💾 Refresh trigger updated to:', refreshTrigger + 1);
      message.info("Đang tải lại dữ liệu...");

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
          key="refresh"
          icon={<ReloadOutlined />}
          onClick={async () => {
            console.log('🔄 Manual refresh triggered');
            await queryResult?.refetch();
            setRefreshTrigger(prev => prev + 1);
            console.log('🔄 Refresh trigger updated to:', refreshTrigger + 1);
            message.info("Đã làm mới dữ liệu!");
          }}
          title="Làm mới dữ liệu từ server"
        >
          Refresh
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
      <MediaFormLayout
        mode="edit"
        formProps={formProps}
        mediaData={mediaData}
        showTechnicalInfo={true}
        technicalInfoMode="edit"
        form={formProps.form}
      >
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
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
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
      </MediaFormLayout>
    </Edit>
  );
};