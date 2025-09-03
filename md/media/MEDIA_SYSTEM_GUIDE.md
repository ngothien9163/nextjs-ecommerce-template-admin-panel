# 🖼️ Media System — Hướng dẫn rút gọn (Create, List, Edit, SEO, Crop)

## Tính năng chính
- Upload nhiều file (drag & drop), tạo metadata tự động từ tên file.
- Quản lý: list/grid, xem chi tiết, copy URL, download, pagination.
- Chỉnh sửa: crop/rotate, update file mới lên Storage, cập nhật DB.
- SEO nâng cao: auto-fill điểm SEO/Accessibility/Performance; keywords dạng array; technical specs (dimensions, size KB, format).
- Xoá: xóa file khỏi Storage và record khỏi DB (kể cả bulk).

## Workflow tổng quát
1) Create: upload → lấy kỹ thuật (dimensions, size, mime/format) → auto-fill alt/title/caption/keywords/SEO → save.
2) List: duyệt, tìm, xem nhanh; hành động: View/Edit/Link/Copy/Info/Delete.
3) Edit: Crop/Rotate → preview → Save Crop (upload file mới, update `file_path`, `file_url`, specs, version++). Nút Back/List và View.
4) Show: hiển thị đầy đủ technical + SEO nâng cao; keywords hiển thị dạng tags (hỗ trợ string/array).

## Kỹ thuật quan trọng
- Array fields: `meta_keywords`, `ai_tags`, `visual_search_tags`, `voice_search_phrases` được parse từ string bằng dấu phẩy nếu cần.
- Auto-fill SEO nâng cao cho file mới: seo_score/accessibility_score/performance_score (giá trị hợp lý), `usage_count=1`, `version=1`.
- Crop: tính pixelCrop từ phần trăm, scale theo naturalWidth/Height; tạo blob preview; upload file mới và cập nhật DB; tăng version; điều chỉnh scores nhẹ sau crop.

## Schema chính (rút gọn)
- Bảng `media`: thông tin file, SEO cơ bản, technical specs, SEO nâng cao (điểm số, lazy/priority, image_dimensions, file_size_kb, image_format, ...).
- Quan hệ (tùy chọn): `media_relations` cho entity mapping; `seo_images` cho SEO theo ngữ cảnh nếu cần mở rộng.

## Troubleshooting nhanh
- Lỗi 401/permission: kiểm tra RLS, service role key, policies bucket.
- Lỗi malformed array literal: đảm bảo convert string→array.
- Nút Crop/Preview không hiện: kiểm tra `imageRef`, `crop.width/height`, tính pixelCrop.
- Pagination count = 0: dùng `{ count: 'exact' }` trong list.

## Best practices
- Unique filenames, cleanup blob URLs, validate loại/kích thước file, logs rõ ràng.
- Không ghi đè chỉnh sửa người dùng khi đổi file; cung cấp nút “Tự động điền” để chủ động ghi đè.






