import React, { useState, useCallback } from "react";
import { Create, useForm } from "@refinedev/antd";
import {
  Form,
  Input,
  Switch,
  Button,
  Card,
  Space,
  message,
  Typography,
  Image,
  Tooltip,
  Select,
  Tag,
} from "antd";
import {
  UploadOutlined,
  InfoCircleOutlined,
  UserOutlined,
  CopyrightOutlined,
  FileTextOutlined,
  PictureOutlined,
  TagsOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useDropzone } from "react-dropzone";
import { supabase } from "../../lib/supabase";
import { dataProvider } from "../../lib/dataProvider";
import { KeywordsInput } from "../../components/keywords-input";

const { TextArea } = Input;
const { Text } = Typography;
const { Option } = Select;

// Interface cho form values
interface MediaFormValues {
  file_name?: string;
  file_url?: string;
  file_path?: string;
  [key: string]: unknown;
}



const LICENSE_PRESETS = [
  { value: "CC0", label: "CC0 (Public Domain) - Miền công cộng, tự do sử dụng" },
  { value: "CC BY", label: "CC BY (Attribution) - Ghi công tác giả" },
  { value: "CC BY-SA", label: "CC BY-SA (Attribution-ShareAlike) - Ghi công và chia sẻ tương tự" },
  { value: "CC BY-ND", label: "CC BY-ND (Attribution-NoDerivs) - Ghi công, không chỉnh sửa" },
  { value: "CC BY-NC", label: "CC BY-NC (Attribution-NonCommercial) - Ghi công, không thương mại" },
  { value: "CC BY-NC-SA", label: "CC BY-NC-SA (Attribution-NonCommercial-ShareAlike) - Ghi công, không thương mại, chia sẻ tương tự" },
  { value: "CC BY-NC-ND", label: "CC BY-NC-ND (Attribution-NonCommercial-NoDerivs) - Ghi công, không thương mại, không chỉnh sửa" },
  { value: "All Rights Reserved", label: "All Rights Reserved - Bảo lưu mọi quyền" },
  { value: "Fair Use", label: "Fair Use - Sử dụng hợp lý" },
  { value: "Custom", label: "Custom - Tùy chỉnh" },
];

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

  const { formProps, saveButtonProps } = useForm({
    resource: "media",
  });

  // Hàm để lấy thông tin chi tiết từ file ảnh
  const getImageDetails = (file: File): Promise<{
    dimensions: { width: number; height: number };
    fileSizeKB: number;
    imageFormat: string;
  }> => {
    return new Promise((resolve, reject) => {
      const img = document.createElement('img');
      img.onload = () => {
        resolve({
          dimensions: { width: img.width, height: img.height },
          fileSizeKB: Math.round(file.size / 1024),
          imageFormat: file.type.split('/')[1]?.toUpperCase() || 'JPEG'
        });
        URL.revokeObjectURL(img.src);
      };
      img.onerror = () => {
        reject(new Error('Không thể đọc thông tin hình ảnh'));
      };
      img.src = URL.createObjectURL(file);
    });
  };
    // Hàm tự động điền thông số SEO nâng cao
  const autoFillSEOScores = useCallback((showMessage = false) => {
    if (!formProps.form) {
      console.log('❌ Form not available for auto-fill SEO scores');
      return;
    }
    
    const currentValues = formProps.form.getFieldsValue();
    
    // Tạo các giá trị SEO hợp lý
    const seoScores = [85, 92, 78, 95, 88, 90, 82, 94, 87, 91];
    const accessibilityScores = [90, 85, 88, 92, 86, 89, 84, 91, 87, 93];
    const performanceScores = [88, 92, 85, 94, 89, 91, 83, 95, 86, 90];
    const usageCounts = [0, 1, 3, 5, 2, 7, 4, 6, 8, 9];
    const versions = [1, 1, 2, 1, 3, 1, 2, 1, 4, 1];

    const randomIndex = Math.floor(Math.random() * 10);
    
    const seoValues = {
      seo_score: seoScores[randomIndex],
      accessibility_score: accessibilityScores[randomIndex],
      performance_score: performanceScores[randomIndex],
      usage_count: usageCounts[randomIndex],
      version: versions[randomIndex],
    };
    
    console.log('🔧 Auto-filling SEO scores:', seoValues);
    
    formProps.form.setFieldsValue({
      ...currentValues,
      ...seoValues,
    });
    
    if (showMessage) {
      message.success('Đã tự động điền thông số SEO nâng cao!');
    }
  }, [formProps.form]);

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
            imageFormat: details.imageFormat
          };
        } catch (error) {
          console.error('Lỗi khi đọc thông tin file:', file.name, error);
          return {
            file,
            preview: URL.createObjectURL(file),
            uploaded: false,
            dimensions: { width: 0, height: 0 },
            fileSizeKB: Math.round(file.size / 1024),
            imageFormat: file.type.split('/')[1]?.toUpperCase() || 'JPEG'
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
          const fileName = firstFile.file.name.replace(/\.[^/.]+$/, ''); // Bỏ extension

          // Tạo alt text và title thông minh hơn
          const smartAltText = fileName
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase())
            .replace(/\s+/g, ' ')
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
            image_dimensions: `${firstFile.dimensions?.width || 0}x${firstFile.dimensions?.height || 0}`,
            file_size_kb: firstFile.fileSizeKB?.toString() || '0',
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
  const generateUniqueFileName = async (originalFileName: string): Promise<string> => {
    const fileExt = originalFileName.split(".").pop();
    const baseName = originalFileName.replace(/\.[^/.]+$/, "");
    
    // Thử tên file gốc trước
    let fileName = originalFileName;
    
    // Kiểm tra xem file đã tồn tại chưa
    const { data: existingFile } = await supabase.storage
      .from("media")
      .list("media", {
        search: fileName
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
    const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
    const words = nameWithoutExt.replace(/[-_]/g, ' ').split(' ').filter((word) => word.length > 2);
    const keywords = [];
    
    // Thêm tên file gốc (không có extension) như một keyword
    keywords.push(nameWithoutExt.replace(/[-_]/g, ' '));
    
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
    keywords.push('hình ảnh chất lượng cao', 'ảnh đẹp', 'tài liệu hình ảnh', 'hình ảnh chuyên nghiệp');
    
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
        const { error: uploadError } =
          await supabase.storage.from("media").upload(filePath, file);

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
        const currentIndex = Math.min(selectedFileIndex, uploadedFilesData.length - 1);
        const uploadedFile = uploadedFilesData[currentIndex];
        
        if (uploadedFile.uploaded) {
          const currentValues = formProps.form.getFieldsValue();
          
          // Cập nhật form ngay lập tức với thông tin file đã upload
          formProps.form.setFieldsValue({
            ...currentValues,
            file_path: uploadedFile.uploadedFilePath,
            file_url: uploadedFile.url,
          });
          
          console.log('🔧 Updated form with uploaded file info:', {
            file_path: uploadedFile.uploadedFilePath,
            file_url: uploadedFile.url
          });
          
          // Tự động điền thông số SEO nâng cao
          setTimeout(() => {
            autoFillSEOScores();
            message.info('Đã tự động điền thông số SEO nâng cao!');
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
      const fileName = file.name.replace(/\.[^/.]+$/, ''); // Bỏ extension

      // Tạo alt text và title thông minh hơn
      const smartAltText = fileName
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase())
        .replace(/\s+/g, ' ')
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
          setUploadedFiles(prev => {
            const updated = [...prev];
            updated[index] = {
              ...updated[index],
              dimensions,
              fileSizeKB,
              imageFormat
            };
            return updated;
          });
        } catch (error) {
          console.error('Lỗi khi lấy thông tin hình ảnh:', error);
        }
      }

                     // Cập nhật lại form với thông tin file mới
           formProps.form.setFieldsValue({
             file_name: fileName,
             alt_text: smartAltText,
             title: smartAltText,
             caption: captions[0], // Sử dụng caption đầu tiên
             meta_description: metaDescriptions[0], // Sử dụng description đầu tiên
             meta_keywords: keywords,
             image_format: imageFormat || file.type.split('/')[1]?.toUpperCase() || 'JPEG',
             image_dimensions: `${dimensions?.width || 0}x${dimensions?.height || 0}`,
             file_size_kb: (fileSizeKB || Math.round(file.size / 1024)).toString(),
             mime_type: file.type,
             // file_path và file_url sẽ được set sau khi upload
             lazy_loading: true,
             priority_loading: false,
           });
           
           // Cập nhật file_path và file_url nếu file đã upload
           if (uploadedFiles[index]?.uploaded && uploadedFiles[index]?.uploadedFilePath) {
             formProps.form.setFieldsValue({
               file_path: uploadedFiles[index].uploadedFilePath,
               file_url: uploadedFiles[index].url,
             });
             
             console.log('🔧 Updated form with selected uploaded file info:', {
               file_path: uploadedFiles[index].uploadedFilePath,
               file_url: uploadedFiles[index].url
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
        message.error('Vui lòng chọn ít nhất một file!');
        return;
      }
      
      // Kiểm tra nếu có file nhưng chưa upload, tự động upload trước
      if (uploadedFiles.length > 0 && !uploadedFiles[selectedFileIndex]?.uploaded) {
        message.info('Đang upload file lên Supabase Storage...');
        
        // Upload file được chọn
        const fileData = uploadedFiles[selectedFileIndex];
        const file = fileData.file;
        
        // Tạo tên file unique (giữ tên gốc + thêm suffix nếu trùng)
        const uniqueFileName = await generateUniqueFileName(file.name);
        const filePath = `media/${uniqueFileName}`;

        // Upload to Supabase Storage using regular client
        const { error: uploadError } =
          await supabase.storage.from("media").upload(filePath, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          message.error(`Lỗi upload file: ${uploadError.message}`);
          return;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("media")
          .getPublicUrl(filePath);

                 // Cập nhật uploadedFiles với thông tin mới
         const updatedFiles = [...uploadedFiles];
         updatedFiles[selectedFileIndex] = {
           ...fileData,
           uploaded: true,
           url: urlData.publicUrl,
           uploadedFileName: uniqueFileName,
           uploadedFilePath: filePath,
         };
         setUploadedFiles(updatedFiles);
         
         // Cập nhật lại selectedFile để sử dụng trong phần tiếp theo
         uploadedFiles[selectedFileIndex] = updatedFiles[selectedFileIndex];

         // Tự động điền thông số SEO nâng cao sau khi upload
         if (formProps.form) {
           const currentValues = formProps.form.getFieldsValue();
           
           // Cập nhật form ngay lập tức với thông tin file đã upload
           formProps.form.setFieldsValue({
             ...currentValues,
             file_path: filePath,
             file_url: urlData.publicUrl,
           });
           
           console.log('🔧 Updated form with uploaded file info (submit):', {
             file_path: filePath,
             file_url: urlData.publicUrl
           });
           
           // Tự động điền thông số SEO nâng cao
           setTimeout(() => {
             autoFillSEOScores();
             message.info('Đã tự động điền thông số SEO nâng cao!');
           }, 200);
         }

         message.success('Upload file thành công!');
      }

      // Data provider đã xử lý array fields, chỉ cần xử lý thông tin file
      const cleanValues = { ...values };

      // Thêm file_url và thông tin chi tiết từ file được chọn
      if (uploadedFiles.length > 0) {
        // Lấy file hiện tại (có thể đã được upload trong phần trên)
        const selectedFile = uploadedFiles[selectedFileIndex];
        
        // Nếu file đã upload, lấy URL từ Supabase
        if (selectedFile.uploaded && selectedFile.url) {
          cleanValues.file_url = selectedFile.url;
          cleanValues.file_path = selectedFile.uploadedFilePath || `media/${selectedFile.uploadedFileName || selectedFile.file.name}`;
        } else {
          // Nếu chưa upload, báo lỗi và dừng submit
          message.error('Vui lòng upload file trước khi lưu!');
          return;
        }
        
        cleanValues.file_size = selectedFile.file.size;
        cleanValues.file_size_kb = selectedFile.fileSizeKB || Math.round(selectedFile.file.size / 1024);
        cleanValues.mime_type = selectedFile.file.type;
        
        // Thêm thông tin dimensions nếu có
        if (selectedFile.dimensions) {
          cleanValues.dimensions = JSON.stringify(selectedFile.dimensions);
          cleanValues.image_dimensions = `${selectedFile.dimensions.width}x${selectedFile.dimensions.height}`;
        }
        
        // Thêm image_format
        cleanValues.image_format = selectedFile.imageFormat || selectedFile.file.type.split('/')[1]?.toUpperCase() || 'JPEG';
      }

      console.log('Submitting values:', cleanValues);

      // Sử dụng data provider để tạo record (đã xử lý array fields)
      await dataProvider.create({
        resource: 'media',
        variables: cleanValues
      });

      message.success('Tạo media thành công!');
      formProps.form?.resetFields();
      setUploadedFiles([]);
    } catch (error: unknown) {
      console.error('Submit error:', error);
      message.error(`Có lỗi xảy ra: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <Create
      saveButtonProps={{
        ...saveButtonProps,
        onClick: () => {
          formProps.form?.validateFields().then(handleFormSubmit);
        },
      }}
    >
      <div style={{ display: "flex", gap: "20px" }}>
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
              <div style={{ 
                marginTop: '12px', 
                padding: '8px 12px', 
                backgroundColor: '#fff7e6', 
                border: '1px solid #ffd591', 
                borderRadius: '6px',
                fontSize: '12px',
                color: '#d46b08'
              }}>
                <strong>💡 Lưu ý:</strong> Nhấn "Upload Files" trước khi Save, hoặc file sẽ được tự động upload khi Save.
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
                      File đang chọn:{" "}
                      {uploadedFiles[selectedFileIndex]?.uploadedFileName || uploadedFiles[selectedFileIndex]?.file.name}
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
                        {(fileData.uploadedFileName && fileData.uploadedFileName !== fileData.file.name) && (
                          <span style={{ color: '#1890ff', fontSize: '10px' }}> (đã đổi tên)</span>
                        )}
                      </Text>
                      <Text type="secondary" style={{ fontSize: "10px" }}>
                        {(fileData.file.size / 1024 / 1024).toFixed(2)} MB
                        {fileData.dimensions && (
                          <> | {fileData.dimensions.width}x{fileData.dimensions.height}</>
                        )}
                        {fileData.imageFormat && (
                          <> | {fileData.imageFormat}</>
                        )}
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
        </div>

        {/* Form Section */}
        <div style={{ flex: 1 }}>
          <Form {...formProps} layout="vertical" onFinish={handleFormSubmit}>
            <Card
              title={
                <div>
                  <div style={{ marginBottom: "8px" }}>
                    <span>Thông tin Media</span>
                  </div>
                  {uploadedFiles.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        flexWrap: "wrap",
                        padding: "8px 12px",
                        backgroundColor: "#f6ffed",
                        border: "1px solid #b7eb8f",
                        borderRadius: "6px",
                        marginTop: "8px",
                      }}
                    >
                      <Tag
                        color="green"
                        style={{
                          maxWidth: "100%",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          margin: 0,
                          padding: "4px 8px",
                          fontSize: "13px",
                        }}
                      >
                        File: {uploadedFiles[selectedFileIndex]?.uploadedFileName || uploadedFiles[selectedFileIndex]?.file.name}
                        {(uploadedFiles[selectedFileIndex]?.uploadedFileName && uploadedFiles[selectedFileIndex]?.uploadedFileName !== uploadedFiles[selectedFileIndex]?.file.name) && (
                          <span style={{ color: '#1890ff' }}> (đã đổi tên)</span>
                        )}
                      </Tag>
                      <Button
                        size="small"
                        type="dashed"
                        onClick={() => selectFile(selectedFileIndex)}
                        title="Tự động điền lại thông tin từ file"
                        style={{
                          margin: 0,
                          fontSize: "12px",
                          height: "24px",
                          padding: "0 8px",
                        }}
                      >
                        🔄 Tự động điền
                      </Button>
                    </div>
                  )}
                </div>
              }
            >
              {uploadedFiles.length > 0 && (
                <div style={{ 
                  marginBottom: '16px',
                  padding: '12px', 
                  backgroundColor: '#f6ffed', 
                  border: '1px solid #b7eb8f', 
                  borderRadius: '6px' 
                }}>
                  <Text strong style={{ color: '#52c41a', marginBottom: '8px', display: 'block' }}>
                    ✓ Thông tin tự động đã được lấy:
                  </Text>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                    <div>
                      <strong>Kích thước:</strong> {uploadedFiles[selectedFileIndex]?.dimensions ? 
                        `${uploadedFiles[selectedFileIndex].dimensions.width}x${uploadedFiles[selectedFileIndex].dimensions.height}` : 
                        'Chưa xác định'
                      }
                    </div>
                    <div>
                      <strong>Dung lượng:</strong> {uploadedFiles[selectedFileIndex]?.fileSizeKB ? 
                        `${uploadedFiles[selectedFileIndex].fileSizeKB} KB` : 
                        'Chưa xác định'
                      }
                    </div>
                    <div>
                      <strong>Định dạng:</strong> {uploadedFiles[selectedFileIndex]?.imageFormat || 'Chưa xác định'}
                    </div>
                    <div>
                      <strong>MIME Type:</strong> {uploadedFiles[selectedFileIndex]?.file.type || 'Chưa xác định'}
                    </div>
                  </div>
                  {uploadedFiles[selectedFileIndex]?.uploaded && (
                    <div style={{ marginTop: '8px', color: '#52c41a' }}>
                      <strong>✓ Đã upload thành công!</strong> <br/>
                      <div style={{ fontSize: '11px', marginTop: '4px' }}>
                        <strong>Tên file:</strong> {uploadedFiles[selectedFileIndex].uploadedFileName || uploadedFiles[selectedFileIndex].file.name} <br/>
                        <strong>URL:</strong> <Text code copyable style={{ fontSize: '11px' }}>{uploadedFiles[selectedFileIndex].url}</Text>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <Form.Item
                label={
                  <Space>
                    <FileTextOutlined />
                    Tên file
                    <Tooltip title="Tên file gốc, sẽ được hiển thị trong admin panel">
                      <InfoCircleOutlined style={{ color: "#1890ff" }} />
                    </Tooltip>
                  </Space>
                }
                name="file_name"
                rules={[{ required: true, message: "Vui lòng nhập tên file!" }]}
              >
                <Input placeholder="Tên file gốc" />
              </Form.Item>

              <Form.Item
                label={
                  <Space>
                    <EyeOutlined />
                    Alt Text
                    <Tooltip title="Mô tả hình ảnh cho SEO và accessibility, rất quan trọng cho người dùng khiếm thị">
                      <InfoCircleOutlined style={{ color: "#1890ff" }} />
                    </Tooltip>
                  </Space>
                }
                name="alt_text"
                rules={[{ required: true, message: "Vui lòng nhập alt text!" }]}
              >
                <Input placeholder="Mô tả hình ảnh cho SEO" />
              </Form.Item>

              <Form.Item
                label={
                  <Space>
                    <EditOutlined />
                    Title
                    <Tooltip title="Tiêu đề hiển thị khi hover chuột lên hình ảnh">
                      <InfoCircleOutlined style={{ color: "#1890ff" }} />
                    </Tooltip>
                  </Space>
                }
                name="title"
              >
                <Input placeholder="Tiêu đề khi hover" />
              </Form.Item>

              <Form.Item
                label={
                  <Space>
                    <PictureOutlined />
                    Caption
                    <Tooltip title="Chú thích chi tiết về hình ảnh, có thể hiển thị dưới hình ảnh">
                      <InfoCircleOutlined style={{ color: "#1890ff" }} />
                    </Tooltip>
                    {uploadedFiles.length > 0 && (
                      <Button
                        size="small"
                        type="dashed"
                        onClick={() => {
                          const file = uploadedFiles[selectedFileIndex]?.file;
                          if (file && formProps.form) {
                            const fileName = file.name.replace(/\.[^/.]+$/, "");
                            const smartAltText = fileName
                              .replace(/[-_]/g, " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())
                              .replace(/\s+/g, " ")
                              .trim();

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

                            const currentCaption =
                              formProps.form.getFieldValue("caption");
                            const currentIndex =
                              captions.indexOf(currentCaption);
                            const nextIndex =
                              (currentIndex + 1) % captions.length;
                            formProps.form.setFieldsValue({
                              caption: captions[nextIndex],
                            });
                          }
                        }}
                        title="Chọn gợi ý Caption khác"
                      >
                        🔄 Gợi ý
                      </Button>
                    )}
                  </Space>
                }
                name="caption"
              >
                <TextArea rows={3} placeholder="Chú thích hình ảnh" />
              </Form.Item>

              <Form.Item
                label={
                  <Space>
                    <EditOutlined />
                    Meta Description
                    <Tooltip title="Mô tả chi tiết cho SEO, giúp tăng thứ hạng tìm kiếm">
                      <InfoCircleOutlined style={{ color: "#1890ff" }} />
                    </Tooltip>
                    {uploadedFiles.length > 0 && (
                      <Button
                        size="small"
                        type="dashed"
                        onClick={() => {
                          const file = uploadedFiles[selectedFileIndex]?.file;
                          if (file && formProps.form) {
                            const fileName = file.name.replace(/\.[^/.]+$/, "");
                            const smartAltText = fileName
                              .replace(/[-_]/g, " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())
                              .replace(/\s+/g, " ")
                              .trim();

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

                            const currentDescription =
                              formProps.form.getFieldValue("meta_description");
                            const currentIndex =
                              metaDescriptions.indexOf(currentDescription);
                            const nextIndex =
                              (currentIndex + 1) % metaDescriptions.length;
                            formProps.form.setFieldsValue({
                              meta_description: metaDescriptions[nextIndex],
                            });
                          }
                        }}
                        title="Chọn gợi ý Meta Description khác"
                      >
                        🔄 Gợi ý
                      </Button>
                    )}
                  </Space>
                }
                name="meta_description"
              >
                <TextArea rows={2} placeholder="Mô tả chi tiết cho SEO" />
              </Form.Item>

              <Form.Item
                name="meta_keywords"
              >
                <KeywordsInput
                  label="Meta Keywords"
                  tooltip="Nhập từ khóa SEO, phân cách bằng dấu phẩy. Ví dụ: Laptop Asus ExpertBook B1, Gaming, Computer"
                  placeholder="Nhập từ khóa, phân cách bằng dấu phẩy"
                  maxTags={15}
                  allowDuplicates={false}
                />
              </Form.Item>

              <Form.Item
                label={
                  <Space>
                    <EditOutlined />
                    Image Dimensions
                    <Tooltip title="Kích thước hình ảnh (width x height) - Được lấy tự động từ file">
                      <InfoCircleOutlined style={{ color: '#1890ff' }} />
                    </Tooltip>
                    {uploadedFiles.length > 0 && uploadedFiles[selectedFileIndex]?.dimensions && (
                      <Tag color="green">
                        Tự động: {uploadedFiles[selectedFileIndex].dimensions.width}x{uploadedFiles[selectedFileIndex].dimensions.height}
                      </Tag>
                    )}
                  </Space>
                }
                name="image_dimensions"
              >
                <Input 
                  placeholder="Ví dụ: 1920x1080" 
                  readOnly={!!(uploadedFiles.length > 0 && uploadedFiles[selectedFileIndex]?.dimensions)}
                  style={{
                    backgroundColor: uploadedFiles.length > 0 && uploadedFiles[selectedFileIndex]?.dimensions ? '#f6ffed' : 'white'
                  }}
                />
              </Form.Item>

              <Form.Item
                label={
                  <Space>
                    <EditOutlined />
                    File Size (KB)
                    <Tooltip title="Kích thước file tính bằng KB - Được lấy tự động từ file">
                      <InfoCircleOutlined style={{ color: '#1890ff' }} />
                    </Tooltip>
                    {uploadedFiles.length > 0 && uploadedFiles[selectedFileIndex]?.fileSizeKB && (
                      <Tag color="green">
                        Tự động: {uploadedFiles[selectedFileIndex].fileSizeKB} KB
                      </Tag>
                    )}
                  </Space>
                }
                name="file_size_kb"
              >
                <Input 
                  placeholder="Ví dụ: 245" 
                  readOnly={!!(uploadedFiles.length > 0 && uploadedFiles[selectedFileIndex]?.fileSizeKB)}
                  style={{
                    backgroundColor: uploadedFiles.length > 0 && uploadedFiles[selectedFileIndex]?.fileSizeKB ? '#f6ffed' : 'white'
                  }}
                />
              </Form.Item>

              <Form.Item
                label={
                  <Space>
                    <EditOutlined />
                    Image Format
                    <Tooltip title="Định dạng hình ảnh - Được lấy tự động từ file">
                      <InfoCircleOutlined style={{ color: '#1890ff' }} />
                    </Tooltip>
                    {uploadedFiles.length > 0 && uploadedFiles[selectedFileIndex]?.imageFormat && (
                      <Tag color="green">
                        Tự động: {uploadedFiles[selectedFileIndex].imageFormat}
                      </Tag>
                    )}
                  </Space>
                }
                name="image_format"
              >
                <Select 
                  placeholder="Chọn định dạng hình ảnh"
                  disabled={!!(uploadedFiles.length > 0 && uploadedFiles[selectedFileIndex]?.imageFormat)}
                  style={{
                    backgroundColor: uploadedFiles.length > 0 && uploadedFiles[selectedFileIndex]?.imageFormat ? '#f6ffed' : 'white'
                  }}
                >
                  <Option value="JPEG">JPEG - Phù hợp cho ảnh thực tế</Option>
                  <Option value="PNG">
                    PNG - Phù hợp cho ảnh có trong suốt
                  </Option>
                  <Option value="WebP">
                    WebP - Định dạng hiện đại, nén tốt
                  </Option>
                  <Option value="AVIF">
                    AVIF - Định dạng mới nhất, nén tốt nhất
                  </Option>
                  <Option value="SVG">SVG - Vector, phù hợp cho icon</Option>
                  <Option value="GIF">GIF - Animation</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label={
                  <Space>
                    <EditOutlined />
                    MIME Type
                    <Tooltip title="Loại MIME của file - Được lấy tự động từ file">
                      <InfoCircleOutlined style={{ color: '#1890ff' }} />
                    </Tooltip>
                    {uploadedFiles.length > 0 && uploadedFiles[selectedFileIndex]?.file.type && (
                      <Tag color="green">
                        Tự động: {uploadedFiles[selectedFileIndex].file.type}
                      </Tag>
                    )}
                  </Space>
                }
                name="mime_type"
              >
                <Input 
                  placeholder="Ví dụ: image/jpeg" 
                  readOnly={!!(uploadedFiles.length > 0 && uploadedFiles[selectedFileIndex]?.file.type)}
                  style={{
                    backgroundColor: uploadedFiles.length > 0 && uploadedFiles[selectedFileIndex]?.file.type ? '#f6ffed' : 'white'
                  }}
                />
              </Form.Item>

              <Form.Item
                label={
                  <Space>
                    <EditOutlined />
                    File Path
                    <Tooltip title="Đường dẫn file trong storage - Được tạo tự động">
                      <InfoCircleOutlined style={{ color: '#1890ff' }} />
                    </Tooltip>
                    {uploadedFiles.length > 0 && uploadedFiles[selectedFileIndex]?.uploaded && (
                      <Tag color="green">
                        ✓ Đã upload: {uploadedFiles[selectedFileIndex].uploadedFilePath}
                      </Tag>
                    )}
                  </Space>
                }
                name="file_path"
              >
                <Input 
                  placeholder="Tự động tạo khi upload file" 
                  readOnly
                  style={{ backgroundColor: '#f6ffed' }}
                />
              </Form.Item>

              <Form.Item
                label={
                  <Space>
                    <EditOutlined />
                    File URL
                    <Tooltip title="URL công khai của file - Được tạo sau khi upload">
                      <InfoCircleOutlined style={{ color: '#1890ff' }} />
                    </Tooltip>
                    {uploadedFiles.length > 0 && uploadedFiles[selectedFileIndex]?.uploaded && (
                      <Tag color="green">
                        ✓ Đã upload
                      </Tag>
                    )}
                  </Space>
                }
                name="file_url"
              >
                <Input 
                  placeholder="Tự động tạo sau khi upload file" 
                  readOnly
                  style={{ backgroundColor: '#f6ffed' }}
                />
              </Form.Item>

              <Form.Item
                label={
                  <Space>
                    <EditOutlined />
                    Lazy Loading
                    <Tooltip title="Bật/tắt lazy loading cho hình ảnh - Tối ưu performance">
                      <InfoCircleOutlined style={{ color: "#1890ff" }} />
                    </Tooltip>
                  </Space>
                }
                name="lazy_loading"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
              </Form.Item>

              <Form.Item
                label={
                  <Space>
                    <EditOutlined />
                    Priority Loading
                    <Tooltip title="Ưu tiên tải hình ảnh quan trọng (Above the fold)">
                      <InfoCircleOutlined style={{ color: "#1890ff" }} />
                    </Tooltip>
                  </Space>
                }
                name="priority_loading"
                valuePropName="checked"
                initialValue={false}
              >
                <Switch checkedChildren="Cao" unCheckedChildren="Thường" />
              </Form.Item>

              <Form.Item
                label={
                  <Space>
                    <UserOutlined />
                    Credit
                    <Tooltip title="Nguồn gốc hoặc người tạo ra hình ảnh (Mặc định: Original Content - Tối ưu SEO)">
                      <InfoCircleOutlined style={{ color: "#1890ff" }} />
                    </Tooltip>
                    <a
                      href="/credit-license-guide.html#credit"
                      target="_blank"
                      style={{
                        color: "#1890ff",
                        textDecoration: "none",
                        fontSize: "12px",
                      }}
                      title="Xem hướng dẫn Credit"
                    >
                      📖 Hướng dẫn
                    </a>
                  </Space>
                }
                name="credit"
                initialValue="Original Content"
              >
                <Select
                  placeholder="Original Content (Mặc định - Tối ưu SEO)"
                  allowClear
                  showSearch
                  optionFilterProp="children"
                >
                  <Option value="Unsplash">🆓 Unsplash</Option>
                  <Option value="Pexels">🆓 Pexels</Option>
                  <Option value="Pixabay">🆓 Pixabay</Option>
                  <Option value="Freepik">🆓 Freepik</Option>
                  <Option value="Wikimedia Commons">
                    🆓 Wikimedia Commons
                  </Option>
                  <Option value="OpenClipart">🆓 OpenClipart</Option>
                  <Option value="Flaticon">🆓 Flaticon</Option>
                  <Option value="Adobe Stock">💰 Adobe Stock</Option>
                  <Option value="Shutterstock">💰 Shutterstock</Option>
                  <Option value="Getty Images">💰 Getty Images</Option>
                  <Option value="iStock">💰 iStock</Option>
                  <Option value="Depositphotos">💰 Depositphotos</Option>
                  <Option value="Original Content">🎨 Original Content</Option>
                  <Option value="Self Created">🎨 Self Created</Option>
                  <Option value="Custom Design">🎨 Custom Design</Option>
                  <Option value="Custom">📝 Custom</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label={
                  <Space>
                    <CopyrightOutlined />
                    License
                    <Tooltip title="Giấy phép sử dụng hình ảnh, quan trọng cho bản quyền (Mặc định: All Rights Reserved - Bảo lưu mọi quyền)">
                      <InfoCircleOutlined style={{ color: "#1890ff" }} />
                    </Tooltip>
                    <a
                      href="/credit-license-guide.html#license"
                      target="_blank"
                      style={{
                        color: "#1890ff",
                        textDecoration: "none",
                        fontSize: "12px",
                      }}
                      title="Xem hướng dẫn License"
                    >
                      📖 Hướng dẫn
                    </a>
                  </Space>
                }
                name="license"
                initialValue="All Rights Reserved"
              >
                <Select
                  placeholder="All Rights Reserved (Mặc định - Bảo lưu mọi quyền)"
                  allowClear
                  showSearch
                  optionFilterProp="children"
                >
                  {LICENSE_PRESETS.map((license) => (
                    <Option key={license.value} value={license.value}>
                      {license.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label={
                  <Space>
                    Trạng thái
                    <Tooltip title="Bật/tắt hiển thị hình ảnh trên website">
                      <InfoCircleOutlined style={{ color: "#1890ff" }} />
                    </Tooltip>
                  </Space>
                }
                name="is_active"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch checkedChildren="Hiển thị" unCheckedChildren="Ẩn" />
              </Form.Item>
            </Card>

            {/* Card SEO nâng cao */}
            <Card 
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span>Thông tin SEO nâng cao</span>
                                     <Button
                     size="small"
                     type="dashed"
                     onClick={() => autoFillSEOScores(true)}
                     title="Điền các giá trị SEO hợp lý"
                   >
                     🔄 Gợi ý
                   </Button>
                </div>
              } 
              style={{ marginBottom: "20px" }}
            >
              <Form.Item
                label={
                  <Space>
                    <TagsOutlined />
                    SEO Score
                    <Tooltip title="Điểm SEO của media (0-100) - Càng cao càng tốt. Giá trị hợp lý: 80-95">
                      <InfoCircleOutlined style={{ color: "#1890ff" }} />
                    </Tooltip>
                  </Space>
                }
                name="seo_score"
                initialValue={0}
              >
                <Input type="number" min={0} max={100} placeholder="0-100" />
              </Form.Item>

              <Form.Item
                label={
                  <Space>
                    <TagsOutlined />
                    Accessibility Score
                    <Tooltip title="Điểm accessibility (0-100) - Hỗ trợ người khuyết tật. Giá trị hợp lý: 85-95">
                      <InfoCircleOutlined style={{ color: "#1890ff" }} />
                    </Tooltip>
                  </Space>
                }
                name="accessibility_score"
                initialValue={0}
              >
                <Input type="number" min={0} max={100} placeholder="0-100" />
              </Form.Item>

              <Form.Item
                label={
                  <Space>
                    <TagsOutlined />
                    Performance Score
                    <Tooltip title="Điểm performance (0-100) - Tốc độ tải và hiệu năng. Giá trị hợp lý: 85-95">
                      <InfoCircleOutlined style={{ color: "#1890ff" }} />
                    </Tooltip>
                  </Space>
                }
                name="performance_score"
                initialValue={0}
              >
                <Input type="number" min={0} max={100} placeholder="0-100" />
              </Form.Item>

              <Form.Item
                label={
                  <Space>
                    <TagsOutlined />
                    Usage Count
                    <Tooltip title="Số lần file được sử dụng trong hệ thống. Giá trị hợp lý: 0-10">
                      <InfoCircleOutlined style={{ color: "#1890ff" }} />
                    </Tooltip>
                  </Space>
                }
                name="usage_count"
                initialValue={0}
              >
                <Input type="number" min={0} placeholder="Số lần sử dụng" readOnly style={{ backgroundColor: '#f6ffed' }} />
              </Form.Item>

              <Form.Item
                label={
                  <Space>
                    <TagsOutlined />
                    Version
                    <Tooltip title="Phiên bản của file, bắt đầu từ 1. Giá trị hợp lý: 1-4">
                      <InfoCircleOutlined style={{ color: "#1890ff" }} />
                    </Tooltip>
                  </Space>
                }
                name="version"
                initialValue={1}
              >
                <Input type="number" min={1} placeholder="Phiên bản file" />
              </Form.Item>
            </Card>
          </Form>
        </div>
      </div>
    </Create>
  );
};
