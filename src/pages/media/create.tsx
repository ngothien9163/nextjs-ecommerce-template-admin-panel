import React, { useState, useCallback } from "react";
import { Create, useForm } from "@refinedev/antd";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Card,
  Space,
  message,
  Typography,
  Image,
  Tag,
} from "antd";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useDropzone } from "react-dropzone";
import { supabase } from "../../lib/supabase";
import { dataProvider } from "../../lib/dataProvider";
import { MediaFormFields } from "../../components/media-form-fields";
import { MediaTechnicalInfo } from "../../components/media-technical-info";
import { MediaSEOSection } from "../../components/media-seo-section";
import { MediaFormLayout } from "../../components/media-form-layout";
import { SEOMediaService } from "../../lib/seo-media-service";

const { Text } = Typography;

// Interface cho form values
interface MediaFormValues {
  file_name?: string;
  file_url?: string;
  file_path?: string;
  [key: string]: unknown;
}

export const MediaCreate: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{
      file: File;
      preview: string;
      uploaded: boolean;
      url?: string;
      dimensions?: { width: number; height: number };
      fileSizeKB?: number;
      imageFormat?: string;
      uploadedFileName?: string; // Tên file đã upload (có thể khác tên gốc)
      uploadedFilePath?: string; // Đường dẫn file đã upload
    }>
  >([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
  const navigate = useNavigate();

  const { formProps, saveButtonProps } = useForm({
    resource: "media",
  });

  // Navigation function
  const handleBackToList = () => {
    navigate("/media");
  };

  // Hàm để lấy thông tin chi tiết từ file ảnh
  const getImageDetails = (
    file: File
  ): Promise<{
    dimensions: { width: number; height: number };
    fileSizeKB: number;
    imageFormat: string;
  }> => {
    return new Promise((resolve, reject) => {
      const img = document.createElement("img");
      img.onload = () => {
        resolve({
          dimensions: { width: img.width, height: img.height },
          fileSizeKB: Math.round(file.size / 1024),
          imageFormat: file.type.split("/")[1]?.toUpperCase() || "JPEG",
        });
        URL.revokeObjectURL(img.src);
      };
      img.onerror = () => {
        reject(new Error("Không thể đọc thông tin hình ảnh"));
      };
      img.src = URL.createObjectURL(file);
    });
  };
  // Hàm tự động điền thông số SEO nâng cao
  const autoFillSEOScores = useCallback(
    (showMessage = false) => {
      if (!formProps.form) {
        console.log("❌ Form not available for auto-fill SEO scores");
        return;
      }

      const currentValues = formProps.form.getFieldsValue();

      // Tạo các giá trị SEO hợp lý
      const seoScores = [85, 92, 78, 95, 88, 90, 82, 94, 87, 91];
      const accessibilityScores = [90, 85, 88, 92, 86, 89, 84, 91, 87, 93];
      const performanceScores = [88, 92, 85, 94, 89, 91, 83, 95, 86, 90];

      // Khi upload file mới, usage_count = 1 và version = 1
      const usageCount = 1;
      const version = 1;

      const randomIndex = Math.floor(Math.random() * 10);

      const seoValues = {
        seo_score: seoScores[randomIndex],
        accessibility_score: accessibilityScores[randomIndex],
        performance_score: performanceScores[randomIndex],
        usage_count: usageCount,
        version: version,
      };

      console.log("🔧 Auto-filling SEO scores:", seoValues);

      formProps.form.setFieldsValue({
        ...currentValues,
        ...seoValues,
      });

      if (showMessage) {
        message.success("Đã tự động điền thông số SEO nâng cao!");
      }
    },
    [formProps.form]
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      // Tạo array promises để xử lý tất cả files đồng thời
      const filePromises = acceptedFiles.map(async (file) => {
        try {
          const details = await getImageDetails(file);
          return {
            file,
            preview: URL.createObjectURL(file),
            uploaded: false,
            dimensions: details.dimensions,
            fileSizeKB: details.fileSizeKB,
            imageFormat: details.imageFormat,
          };
        } catch (error) {
          console.error("Lỗi khi đọc thông tin file:", file.name, error);
          return {
            file,
            preview: URL.createObjectURL(file),
            uploaded: false,
            dimensions: { width: 0, height: 0 },
            fileSizeKB: Math.round(file.size / 1024),
            imageFormat: file.type.split("/")[1]?.toUpperCase() || "JPEG",
          };
        }
      });

      const newFiles = await Promise.all(filePromises);
      setUploadedFiles((prev) => [...prev, ...newFiles]);

      // Tự động điền thông tin từ file đầu tiên nếu form chưa có dữ liệu
      if (newFiles.length > 0 && formProps.form) {
        const currentValues = formProps.form.getFieldsValue();
        const firstFile = newFiles[0];

        // Chỉ điền nếu các field chưa có dữ liệu
        if (!(currentValues as MediaFormValues).file_name) {
          const fileName = firstFile.file.name.replace(/\.[^/.]+$/, ""); // Bỏ extension

          // Tạo alt text và title thông minh hơn
          const smartAltText = fileName
            .replace(/[-_]/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase())
            .replace(/\s+/g, " ")
            .trim();

          // Tạo meta description từ alt text với nhiều gợi ý
          const metaDescriptions = [
            `Hình ảnh ${smartAltText.toLowerCase()}, chất lượng cao, phù hợp cho website và marketing.`,
            `Ảnh ${smartAltText.toLowerCase()} đẹp, rõ nét, tối ưu cho SEO và trải nghiệm người dùng.`,
            `${smartAltText} - Hình ảnh chuyên nghiệp, phù hợp cho các dự án thương mại và cá nhân.`,
            `Tải hình ảnh ${smartAltText.toLowerCase()} miễn phí, chất lượng cao, không có watermark.`,
            `Khám phá ${smartAltText.toLowerCase()} với hình ảnh chất lượng 4K, tối ưu cho mọi thiết bị.`,
            `${smartAltText} - Bộ sưu tập hình ảnh đa dạng, phù hợp cho thiết kế và nội dung sáng tạo.`,
            `Hình ảnh ${smartAltText.toLowerCase()} chuyên nghiệp, hỗ trợ đa định dạng và tương thích mọi trình duyệt.`,
            `Tải xuống ${smartAltText.toLowerCase()} miễn phí, độ phân giải cao, không giới hạn sử dụng.`,
            `${smartAltText} - Tài nguyên hình ảnh chất lượng, tối ưu cho SEO và tốc độ tải trang.`,
            `Khám phá bộ sưu tập ${smartAltText.toLowerCase()} đa dạng, phù hợp cho mọi nhu cầu thiết kế.`,
          ];

          // Tạo caption từ alt text
          const captions = [
            `${smartAltText} - Hình ảnh chất lượng cao`,
            `Ảnh ${smartAltText.toLowerCase()} đẹp và rõ nét`,
            `${smartAltText} - Tài liệu hình ảnh chuyên nghiệp`,
            `Hình ảnh ${smartAltText.toLowerCase()} phù hợp cho nhiều mục đích sử dụng`,
            `${smartAltText} - Bức ảnh được chụp với độ phân giải cao`,
            `Khám phá vẻ đẹp của ${smartAltText.toLowerCase()} qua góc nhìn chuyên nghiệp`,
            `${smartAltText} - Hình ảnh tối ưu cho thiết kế và marketing`,
            `Tài liệu hình ảnh ${smartAltText.toLowerCase()} chất lượng, sẵn sàng sử dụng`,
            `${smartAltText} - Bộ sưu tập hình ảnh đa dạng và phong phú`,
            `Hình ảnh ${smartAltText.toLowerCase()} chuyên nghiệp, phù hợp cho mọi dự án`,
          ];

          // Tạo keywords từ tên file (các cụm từ 2-3 từ có ý nghĩa)
          const keywords = generateKeywords(fileName);

          formProps.form.setFieldsValue({
            file_name: fileName,
            alt_text: smartAltText,
            title: smartAltText,
            caption: captions[0], // Sử dụng caption đầu tiên
            meta_description: metaDescriptions[0], // Sử dụng description đầu tiên
            meta_keywords: keywords,
            image_format: firstFile.imageFormat,
            image_dimensions: `${firstFile.dimensions?.width || 0}x${
              firstFile.dimensions?.height || 0
            }`,
            file_size_kb: firstFile.fileSizeKB?.toString() || "0",
            mime_type: firstFile.file.type,
            // file_path và file_url sẽ được set sau khi upload
            lazy_loading: true,
            priority_loading: false,
          });

          // Tự động điền thông số SEO nâng cao khi chọn file đầu tiên
          setTimeout(() => {
            autoFillSEOScores();
          }, 200);
        }
      }
    },
    [formProps.form, autoFillSEOScores]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp", ".svg"],
    },
    multiple: true,
  });

  // Hàm tạo tên file unique (giữ tên gốc + thêm suffix nếu trùng)
  const generateUniqueFileName = async (
    originalFileName: string
  ): Promise<string> => {
    const fileExt = originalFileName.split(".").pop();
    const baseName = originalFileName.replace(/\.[^/.]+$/, "");

    // Thử tên file gốc trước
    let fileName = originalFileName;

    // Kiểm tra xem file đã tồn tại chưa
    const { data: existingFile } = await supabase.storage
      .from("media")
      .list("media", {
        search: fileName,
      });

    // Nếu file đã tồn tại, thêm suffix random
    if (existingFile && existingFile.length > 0) {
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      fileName = `${baseName}_${randomSuffix}.${fileExt}`;
    }

    return fileName;
  };

  // Hàm tạo keywords từ tên file (các cụm từ 2-3 từ có ý nghĩa)
  const generateKeywords = (fileName: string): string[] => {
    // Loại bỏ extension file
    const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
    const words = nameWithoutExt
      .replace(/[-_]/g, " ")
      .split(" ")
      .filter((word) => word.length > 2);
    const keywords = [];

    // Thêm tên file gốc (không có extension) như một keyword
    keywords.push(nameWithoutExt.replace(/[-_]/g, " "));

    // Tạo các cụm từ 2-3 từ
    for (let i = 0; i < words.length - 1; i++) {
      // Cụm 2 từ
      keywords.push(`${words[i]} ${words[i + 1]}`);

      // Cụm 3 từ (nếu có đủ từ)
      if (i < words.length - 2) {
        keywords.push(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
      }
    }

    // Thêm một số từ khóa chung về hình ảnh
    keywords.push(
      "hình ảnh chất lượng cao",
      "ảnh đẹp",
      "tài liệu hình ảnh",
      "hình ảnh chuyên nghiệp"
    );

    // Loại bỏ trùng lặp và giới hạn số lượng
    return [...new Set(keywords)].slice(0, 10);
  };

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) {
      message.warning("Vui lòng chọn files để upload!");
      return;
    }

    try {
      const uploadPromises = uploadedFiles.map(async (fileData) => {
        if (fileData.uploaded) return fileData;

        const file = fileData.file;

        // Tạo tên file unique (giữ tên gốc + thêm suffix nếu trùng)
        const uniqueFileName = await generateUniqueFileName(file.name);
        const filePath = `media/${uniqueFileName}`;

        // Upload to Supabase Storage using regular client
        const { error: uploadError } = await supabase.storage
          .from("media")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("media")
          .getPublicUrl(filePath);

        return {
          ...fileData,
          uploaded: true,
          url: urlData.publicUrl,
          uploadedFileName: uniqueFileName, // Lưu tên file đã upload
          uploadedFilePath: filePath, // Lưu đường dẫn đã upload
        };
      });

      const uploadedFilesData = await Promise.all(uploadPromises);
      setUploadedFiles(uploadedFilesData);

      // Cập nhật form với thông tin file đã upload (nếu có file đang được chọn)
      if (uploadedFilesData.length > 0 && formProps.form) {
        const currentIndex = Math.min(
          selectedFileIndex,
          uploadedFilesData.length - 1
        );
        const uploadedFile = uploadedFilesData[currentIndex];

        if (uploadedFile.uploaded) {
          const currentValues = formProps.form.getFieldsValue();

          // Cập nhật form ngay lập tức với thông tin file đã upload
          formProps.form.setFieldsValue({
            ...currentValues,
            file_path: uploadedFile.uploadedFilePath,
            file_url: uploadedFile.url,
          });

          console.log("🔧 Updated form with uploaded file info:", {
            file_path: uploadedFile.uploadedFilePath,
            file_url: uploadedFile.url,
          });

          // Tự động điền thông số SEO nâng cao
          setTimeout(() => {
            autoFillSEOScores();
            message.info("Đã tự động điền thông số SEO nâng cao!");
          }, 200);
        }
      }

      message.success("Upload thành công!");
    } catch (error) {
      console.error("Upload error:", error);
      message.error("Có lỗi xảy ra khi upload!");
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);

      // Cập nhật selectedFileIndex nếu cần
      if (newFiles.length === 0) {
        setSelectedFileIndex(0);
      } else if (selectedFileIndex >= newFiles.length) {
        setSelectedFileIndex(newFiles.length - 1);
      }

      return newFiles;
    });
  };

  const selectFile = async (index: number) => {
    setSelectedFileIndex(index);

    // Cập nhật form với thông tin của file được chọn
    if (uploadedFiles[index] && formProps.form) {
      const fileData = uploadedFiles[index];
      const file = fileData.file;
      const fileName = file.name.replace(/\.[^/.]+$/, ""); // Bỏ extension

      // Tạo alt text và title thông minh hơn
      const smartAltText = fileName
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase())
        .replace(/\s+/g, " ")
        .trim();

      // Tạo meta description từ alt text với nhiều gợi ý
      const metaDescriptions = [
        `Hình ảnh ${smartAltText.toLowerCase()}, chất lượng cao, phù hợp cho website và marketing.`,
        `Ảnh ${smartAltText.toLowerCase()} đẹp, rõ nét, tối ưu cho SEO và trải nghiệm người dùng.`,
        `${smartAltText} - Hình ảnh chuyên nghiệp, phù hợp cho các dự án thương mại và cá nhân.`,
        `Tải hình ảnh ${smartAltText.toLowerCase()} miễn phí, chất lượng cao, không có watermark.`,
        `Khám phá ${smartAltText.toLowerCase()} với hình ảnh chất lượng 4K, tối ưu cho mọi thiết bị.`,
        `${smartAltText} - Bộ sưu tập hình ảnh đa dạng, phù hợp cho thiết kế và nội dung sáng tạo.`,
        `Hình ảnh ${smartAltText.toLowerCase()} chuyên nghiệp, hỗ trợ đa định dạng và tương thích mọi trình duyệt.`,
        `Tải xuống ${smartAltText.toLowerCase()} miễn phí, độ phân giải cao, không giới hạn sử dụng.`,
        `${smartAltText} - Tài nguyên hình ảnh chất lượng, tối ưu cho SEO và tốc độ tải trang.`,
        `Khám phá bộ sưu tập ${smartAltText.toLowerCase()} đa dạng, phù hợp cho mọi nhu cầu thiết kế.`,
      ];

      // Tạo caption từ alt text
      const captions = [
        `${smartAltText} - Hình ảnh chất lượng cao`,
        `Ảnh ${smartAltText.toLowerCase()} đẹp và rõ nét`,
        `${smartAltText} - Tài liệu hình ảnh chuyên nghiệp`,
        `Hình ảnh ${smartAltText.toLowerCase()} phù hợp cho nhiều mục đích sử dụng`,
        `${smartAltText} - Bức ảnh được chụp với độ phân giải cao`,
        `Khám phá vẻ đẹp của ${smartAltText.toLowerCase()} qua góc nhìn chuyên nghiệp`,
        `${smartAltText} - Hình ảnh tối ưu cho thiết kế và marketing`,
        `Tài liệu hình ảnh ${smartAltText.toLowerCase()} chất lượng, sẵn sàng sử dụng`,
        `${smartAltText} - Bộ sưu tập hình ảnh đa dạng và phong phú`,
        `Hình ảnh ${smartAltText.toLowerCase()} chuyên nghiệp, phù hợp cho mọi dự án`,
      ];

      // Tạo keywords từ tên file (các cụm từ 2-3 từ có ý nghĩa)
      const keywords = generateKeywords(fileName);

      // Nếu chưa có thông tin dimensions, thử lấy lại
      let dimensions = fileData.dimensions;
      let fileSizeKB = fileData.fileSizeKB;
      let imageFormat = fileData.imageFormat;

      if (!dimensions || dimensions.width === 0) {
        try {
          const details = await getImageDetails(file);
          dimensions = details.dimensions;
          fileSizeKB = details.fileSizeKB;
          imageFormat = details.imageFormat;

          // Cập nhật lại uploadedFiles với thông tin mới
          setUploadedFiles((prev) => {
            const updated = [...prev];
            updated[index] = {
              ...updated[index],
              dimensions,
              fileSizeKB,
              imageFormat,
            };
            return updated;
          });
        } catch (error) {
          console.error("Lỗi khi lấy thông tin hình ảnh:", error);
        }
      }

      // Cập nhật lại form với thông tin file mới (chỉ khi form chưa có dữ liệu)
      const currentFormValues = formProps.form.getFieldsValue() as MediaFormValues;
      const hasExistingData = currentFormValues.alt_text || currentFormValues.title || currentFormValues.caption;
      
      if (!hasExistingData) {
        // Chỉ điền thông tin nếu form chưa có dữ liệu
        formProps.form.setFieldsValue({
          file_name: fileName,
          alt_text: smartAltText,
          title: smartAltText,
          caption: captions[0], // Sử dụng caption đầu tiên
          meta_description: metaDescriptions[0], // Sử dụng description đầu tiên
          meta_keywords: keywords,
          image_format:
            imageFormat || file.type.split("/")[1]?.toUpperCase() || "JPEG",
          image_dimensions: `${dimensions?.width || 0}x${
            dimensions?.height || 0
          }`,
          file_size_kb: (fileSizeKB || Math.round(file.size / 1024)).toString(),
          mime_type: file.type,
          // file_path và file_url sẽ được set sau khi upload
          lazy_loading: true,
          priority_loading: false,
        });
        
        console.log("🔧 Auto-filled form with file info (no existing data)");
      } else {
        console.log("🔧 Form already has data, keeping user's changes");
      }

      // Cập nhật file_path và file_url nếu file đã upload
      if (
        uploadedFiles[index]?.uploaded &&
        uploadedFiles[index]?.uploadedFilePath
      ) {
        formProps.form.setFieldsValue({
          file_path: uploadedFiles[index].uploadedFilePath,
          file_url: uploadedFiles[index].url,
        });

        console.log("🔧 Updated form with selected uploaded file info:", {
          file_path: uploadedFiles[index].uploadedFilePath,
          file_url: uploadedFiles[index].url,
        });
      }

      // Tự động điền thông số SEO nâng cao khi chọn file
      setTimeout(() => {
        autoFillSEOScores();
      }, 200);
    }
  };

  const handleFormSubmit = async (values: MediaFormValues) => {
    try {
      // Kiểm tra có file được chọn không
      if (uploadedFiles.length === 0) {
        message.error("Vui lòng chọn ít nhất một file!");
        return;
      }

      // Upload tất cả files chưa được upload
      const filesToUpload = uploadedFiles.filter((file) => !file.uploaded);
      let finalUploadedFiles: typeof uploadedFiles = [];

      if (filesToUpload.length > 0) {
        message.info(
          `Đang upload ${filesToUpload.length} file(s) lên Supabase Storage...`
        );

        // Tạo một bản copy mới của uploadedFiles để cập nhật
        const updatedFiles = [...uploadedFiles];

        // Upload tất cả files chưa được upload
        for (let i = 0; i < uploadedFiles.length; i++) {
          const fileData = uploadedFiles[i];

          if (!fileData.uploaded) {
            const file = fileData.file;

            // Tạo tên file unique (giữ tên gốc + thêm suffix nếu trùng)
            const uniqueFileName = await generateUniqueFileName(file.name);
            const filePath = `media/${uniqueFileName}`;

            // Upload to Supabase Storage using regular client
            const { error: uploadError } = await supabase.storage
              .from("media")
              .upload(filePath, file);

            if (uploadError) {
              console.error("Upload error:", uploadError);
              message.error(
                `Lỗi upload file ${file.name}: ${uploadError.message}`
              );
              return;
            }

            // Get public URL
            const { data: urlData } = supabase.storage
              .from("media")
              .getPublicUrl(filePath);

            // Cập nhật updatedFiles với thông tin mới
            updatedFiles[i] = {
              ...fileData,
              uploaded: true,
              url: urlData.publicUrl,
              uploadedFileName: uniqueFileName,
              uploadedFilePath: filePath,
            };

            console.log(
              `✅ Uploaded file ${i + 1}/${
                filesToUpload.length
              }: ${uniqueFileName}`
            );
          }
        }

        // Cập nhật state với files đã upload
        setUploadedFiles(updatedFiles);
        message.success(`Upload thành công ${filesToUpload.length} file(s)!`);

        // Sử dụng updatedFiles để tạo records
        finalUploadedFiles = updatedFiles.filter((file) => file.uploaded);
      } else {
        // Nếu không có file nào cần upload, sử dụng uploadedFiles hiện tại
        finalUploadedFiles = uploadedFiles.filter((file) => file.uploaded);
      }

      console.log("🔍 Debug - Files status:", {
        totalFiles: finalUploadedFiles.length,
        uploadedFiles: finalUploadedFiles.length,
        filesStatus: finalUploadedFiles.map((f: any) => ({
          name: f.file.name,
          uploaded: f.uploaded,
          url: f.url
        })),
        rawFiles: finalUploadedFiles.map((f: any) => ({
          name: f.file.name,
          uploaded: f.uploaded,
          url: f.url,
          uploadedFileName: f.uploadedFileName,
          uploadedFilePath: f.uploadedFilePath
        }))
      });

      if (finalUploadedFiles.length === 0) {
        message.error("Không có file nào được upload thành công!");
        return;
      }

      // Tạo record cho từng file
      for (let i = 0; i < finalUploadedFiles.length; i++) {
        const fileData = finalUploadedFiles[i];
        
        // Lấy thông tin form cho file này (nếu là file đang được chọn)
        let cleanValues: MediaFormValues;
        if (i === selectedFileIndex) {
          // File đang được chọn - sử dụng thông tin từ form
          cleanValues = { ...values };
        } else {
          // File khác - tạo thông tin tự động từ tên file
          cleanValues = {} as MediaFormValues;
          
          // Tạo alt text và title từ tên file
          const fileName = fileData.uploadedFileName || fileData.file.name;
          const smartAltText = fileName
            .replace(/\.[^/.]+$/, "") // Bỏ extension
            .replace(/[-_]/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase())
            .replace(/\s+/g, " ")
            .trim();

          cleanValues.alt_text = smartAltText;
          cleanValues.title = smartAltText;
          
          // Tạo caption
          const baseName = fileName.replace(/\.[^/.]+$/, "");
          cleanValues.caption = `${baseName} - Hình ảnh chất lượng cao`;
          
          // Tạo meta description
          cleanValues.meta_description = `Hình ảnh ${baseName.toLowerCase()}, chất lượng cao, phù hợp cho website và marketing.`;
          
          // Tạo meta keywords
          cleanValues.meta_keywords = generateKeywords(fileName.replace(/\.[^/.]+$/, ""));
          
          // Sử dụng SEO scores từ form nếu có, không thì tự động tạo
          if (values.seo_score) {
            cleanValues.seo_score = values.seo_score;
            cleanValues.accessibility_score = values.accessibility_score;
            cleanValues.performance_score = values.performance_score;
            cleanValues.usage_count = values.usage_count;
            cleanValues.version = values.version;
          } else {
            // Tạo SEO scores tự động
            const seoScores = [85, 92, 78, 95, 88, 90, 82, 94, 87, 91];
            const accessibilityScores = [90, 85, 88, 92, 86, 89, 84, 91, 87, 93];
            const performanceScores = [88, 92, 85, 94, 89, 91, 83, 95, 86, 90];
            const randomIndex = Math.floor(Math.random() * 10);
            
            cleanValues.seo_score = seoScores[randomIndex];
            cleanValues.accessibility_score = accessibilityScores[randomIndex];
            cleanValues.performance_score = performanceScores[randomIndex];
            cleanValues.usage_count = 1;
            cleanValues.version = 1;
          }
          
          // Thêm các trường cần thiết khác cho file không được chọn
          cleanValues.lazy_loading = values.lazy_loading || true;
          cleanValues.priority_loading = values.priority_loading || false;
          cleanValues.license = values.license || "All Rights Reserved";
        }

        // Thêm thông tin file (cho tất cả files)
        cleanValues.file_url = fileData.url;
        cleanValues.file_path =
          fileData.uploadedFilePath ||
          `media/${fileData.uploadedFileName || fileData.file.name}`;
        cleanValues.file_name =
          fileData.uploadedFileName ||
          fileData.file.name.replace(/\.[^/.]+$/, "");
        cleanValues.file_size = fileData.file.size;
        cleanValues.file_size_kb =
          fileData.fileSizeKB || Math.round(fileData.file.size / 1024);
        cleanValues.mime_type = fileData.file.type;

        // Thêm thông tin dimensions nếu có
        if (fileData.dimensions) {
          cleanValues.dimensions = JSON.stringify(fileData.dimensions);
          cleanValues.image_dimensions = `${fileData.dimensions.width}x${fileData.dimensions.height}`;
        }

        // Thêm image_format
        cleanValues.image_format =
          fileData.imageFormat ||
          fileData.file.type.split("/")[1]?.toUpperCase() ||
          "JPEG";

        console.log(
          `Creating media record for: ${fileData.uploadedFileName || fileData.file.name} (${i === selectedFileIndex ? 'selected' : 'auto-generated'})`,
          i === selectedFileIndex ? 'Form values:' : 'Auto-generated values:',
          i === selectedFileIndex ? cleanValues : {
            alt_text: cleanValues.alt_text,
            title: cleanValues.title,
            caption: cleanValues.caption,
            meta_description: cleanValues.meta_description,
            seo_score: cleanValues.seo_score
          }
        );

        // Tách SEO data từ cleanValues
        const {
          og_title,
          og_description,
          og_image,
          og_type,
          og_site_name,
          og_locale,
          twitter_card,
          twitter_title,
          twitter_description,
          twitter_image,
          twitter_site,
          twitter_creator,
          schema_markup,
          compression_ratio,
          optimization_score,
          responsive_images,
          webp_version_url,
          avif_version_url,
          ai_alt_text,
          ai_description,
          ai_tags,
          ai_relevance_score,
          visual_search_optimized,
          visual_search_tags,
          voice_search_optimized,
          voice_search_phrases,
          social_shares,
          social_engagement,
          click_through_rate,
          impressions,
          clicks,
          alt_text_translations,
          caption_translations,
          auto_optimization_enabled,
          manual_override,
          is_active,
          ...mediaData
        } = cleanValues;

        // Sử dụng data provider để tạo record media
        const mediaResult = await dataProvider.create({
          resource: "media",
          variables: mediaData,
        });

        console.log('✅ Media record created:', mediaResult.data);

        // Lưu SEO data vào bảng seo_medias nếu có media_id
        if (mediaResult.data?.id) {
          try {
            const seoData = SEOMediaService.convertFormDataToSEOMedia(cleanValues, String(mediaResult.data.id));
            await SEOMediaService.saveSEOMediaData(seoData);
            console.log('✅ SEO data saved to seo_medias table');
          } catch (seoError) {
            console.error('❌ Error saving SEO data:', seoError);
            // Không throw error để không làm fail toàn bộ process
          }
        }
      }

      message.success(
        `Tạo thành công ${finalUploadedFiles.length} media record(s)!`
      );
      formProps.form?.resetFields();
      setUploadedFiles([]);
    } catch (error: unknown) {
      console.error("Submit error:", error);
      message.error(
        `Có lỗi xảy ra: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };

  return (
    <Create
      headerButtons={[
        <Button
          key="back"
          icon={<ArrowLeftOutlined />}
          onClick={handleBackToList}
        >
          Quay về danh sách
        </Button>,
      ]}
      saveButtonProps={{
        ...saveButtonProps,
        onClick: () => {
          formProps.form?.validateFields().then(handleFormSubmit);
        },
      }}
    >
      <MediaFormLayout
        mode="create"
        formProps={formProps}
        uploadedFiles={uploadedFiles}
        selectedFileIndex={selectedFileIndex}
        onAutoFillSEOScores={() => autoFillSEOScores(true)}
        showTechnicalInfo={uploadedFiles.length > 0}
        technicalInfoMode="create"
      >
        {/* Upload Section */}
        <div style={{ flex: 1 }}>
          <Card title="Upload Files" style={{ marginBottom: "20px" }}>
            <div
              {...getRootProps()}
              style={{
                border: "2px dashed #d9d9d9",
                borderRadius: "6px",
                padding: "40px",
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: isDragActive ? "#f0f8ff" : "#fafafa",
                marginBottom: "16px",
              }}
            >
              <input {...getInputProps()} />
              <UploadOutlined
                style={{
                  fontSize: "48px",
                  color: "#1890ff",
                  marginBottom: "16px",
                }}
              />
              <p style={{ fontSize: "16px", marginBottom: "8px" }}>
                {isDragActive
                  ? "Thả files vào đây..."
                  : "Kéo thả files hoặc click để chọn"}
              </p>
              <p style={{ fontSize: "14px", color: "#666" }}>
                Hỗ trợ: JPG, PNG, GIF, WEBP, SVG
              </p>
            </div>

            <Button
              type="primary"
              icon={<UploadOutlined />}
              onClick={handleUpload}
              disabled={uploadedFiles.length === 0}
              style={{ width: "100%" }}
            >
              Upload Files
            </Button>

            {uploadedFiles.length > 0 && (
              <div
                style={{
                  marginTop: "12px",
                  padding: "8px 12px",
                  backgroundColor: "#fff7e6",
                  border: "1px solid #ffd591",
                  borderRadius: "6px",
                  fontSize: "12px",
                  color: "#d46b08",
                }}
              >
                                <strong>💡 Lưu ý:</strong> Nhấn "Upload Files" trước khi Save, hoặc tất cả files sẽ được tự động upload khi Save. File đang chọn sẽ sử dụng thông tin từ form, các file khác sẽ tự động tạo thông tin.
              </div>
            )}
          </Card>

          {/* File Preview */}
          {uploadedFiles.length > 0 && (
            <Card
              title={
                <Space>
                  <span>Files đã chọn ({uploadedFiles.length})</span>
                  {uploadedFiles.length > 1 && (
                    <Tag color="blue">
                      File đang chọn: {uploadedFiles[selectedFileIndex]?.uploadedFileName || uploadedFiles[selectedFileIndex]?.file.name}
                    </Tag>
                  )}
                </Space>
              }
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                  gap: "12px",
                }}
              >
                {uploadedFiles.map((fileData, index) => (
                  <div
                    key={index}
                    style={{
                      position: "relative",
                      border:
                        selectedFileIndex === index
                          ? "2px solid #1890ff"
                          : "2px solid transparent",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onClick={() => selectFile(index)}
                  >
                    <Image
                      src={fileData.preview}
                      alt={fileData.file.name}
                      style={{
                        width: "100%",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "6px",
                      }}
                      fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                    />
                    <div style={{ padding: "8px" }}>
                      <Text
                        strong
                        style={{ fontSize: "12px", display: "block" }}
                      >
                        {fileData.uploadedFileName || fileData.file.name}
                        {fileData.uploadedFileName &&
                          fileData.uploadedFileName !== fileData.file.name && (
                            <span
                              style={{ color: "#1890ff", fontSize: "10px" }}
                            >
                              {" "}
                              (đã đổi tên)
                            </span>
                          )}
                      </Text>
                      <Text type="secondary" style={{ fontSize: "10px" }}>
                        {(fileData.file.size / 1024 / 1024).toFixed(2)} MB
                        {fileData.dimensions && (
                          <>
                            {" "}
                            | {fileData.dimensions.width}x
                            {fileData.dimensions.height}
                          </>
                        )}
                        {fileData.imageFormat && <> | {fileData.imageFormat}</>}
                      </Text>
                      <div
                        style={{
                          marginTop: "4px",
                          display: "flex",
                          gap: "4px",
                        }}
                      >
                        <Button
                          size="small"
                          type={
                            selectedFileIndex === index ? "primary" : "default"
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            selectFile(index);
                          }}
                        >
                          {selectedFileIndex === index ? "Đang chọn" : "Chọn"}
                        </Button>
                        <Button
                          size="small"
                          danger
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(index);
                          }}
                        >
                          Xóa
                        </Button>
                      </div>
                    </div>
                    {fileData.uploaded && (
                      <div
                        style={{
                          position: "absolute",
                          top: "4px",
                          right: "4px",
                          background: "#52c41a",
                          color: "white",
                          borderRadius: "50%",
                          width: "20px",
                          height: "20px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                        }}
                      >
                        ✓
                      </div>
                    )}
                    {selectedFileIndex === index && (
                      <div
                        style={{
                          position: "absolute",
                          top: "4px",
                          left: "4px",
                          background: "#1890ff",
                          color: "white",
                          borderRadius: "50%",
                          width: "20px",
                          height: "20px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                        }}
                      >
                        👁
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Thông tin kỹ thuật Section */}
          {uploadedFiles.length > 0 && (
            <Card title="Thông tin kỹ thuật" style={{ marginTop: "20px" }}>
              <MediaTechnicalInfo
                mode="create"
                uploadedFiles={uploadedFiles}
                selectedFileIndex={selectedFileIndex}
              />
            </Card>
          )}
        </div>

        {/* Upload Section Content */}
        </MediaFormLayout>
    </Create>
  );
};
