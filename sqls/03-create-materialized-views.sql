-- =====================================================
-- TẠO MATERIALIZED VIEWS CHO HIỆU SUẤT TRUY VẤN
-- =====================================================

-- =====================================================
-- 1. MATERIALIZED VIEW CHO CATEGORIES VỚI HÌNH ẢNH
-- =====================================================

-- Tạo materialized view cho categories với hình ảnh
CREATE MATERIALIZED VIEW categories_with_images AS
SELECT 
    c.id,
    c.name,
    c.slug,
    c.description,
    c.parent_id,
    c.product_count,
    c.is_active,
    c.sort_order,
    c.created_at,
    c.updated_at,
    -- Thông tin hình ảnh từ bảng media
    m.file_url as image_url,
    m.alt_text as image_alt,
    m.title as image_title,
    m.meta_description as image_description,
    m.meta_keywords as image_keywords,
    m.dimensions as image_dimensions,
    m.file_size as image_file_size,
    m.mime_type as image_mime_type
FROM categories c
LEFT JOIN media m ON c.featured_image_id = m.id AND m.is_active = true
WHERE c.is_active = true
ORDER BY c.sort_order;

-- Tạo index cho materialized view
CREATE INDEX idx_categories_with_images_active_sort ON categories_with_images(is_active, sort_order);
CREATE INDEX idx_categories_with_images_slug ON categories_with_images(slug);
CREATE INDEX idx_categories_with_images_parent_id ON categories_with_images(parent_id);

-- =====================================================
-- 2. MATERIALIZED VIEW CHO CATEGORIES VỚI THỐNG KÊ
-- =====================================================

-- Tạo materialized view cho categories với thống kê chi tiết
CREATE MATERIALIZED VIEW categories_with_stats AS
SELECT 
    c.id,
    c.name,
    c.slug,
    c.description,
    c.parent_id,
    c.product_count,
    c.is_active,
    c.sort_order,
    c.created_at,
    c.updated_at,
    -- Thống kê sản phẩm
    COUNT(p.id) as total_products,
    COUNT(CASE WHEN p.is_featured = true THEN 1 END) as featured_products,
    COUNT(CASE WHEN p.is_bestseller = true THEN 1 END) as bestseller_products,
    AVG(p.rating) as avg_rating,
    SUM(p.view_count) as total_views,
    SUM(p.review_count) as total_reviews,
    -- Thống kê giá
    MIN(p.price) as min_price,
    MAX(p.price) as max_price,
    AVG(p.price) as avg_price,
    -- Thống kê tồn kho
    SUM(p.stock_quantity) as total_stock,
    COUNT(CASE WHEN p.stock_quantity = 0 THEN 1 END) as out_of_stock_count,
    -- Thông tin hình ảnh
    m.file_url as image_url,
    m.alt_text as image_alt,
    m.title as image_title
FROM categories c
LEFT JOIN products p ON c.id = p.category_id AND p.is_active = true
LEFT JOIN media m ON c.featured_image_id = m.id AND m.is_active = true
WHERE c.is_active = true
GROUP BY c.id, c.name, c.slug, c.description, c.parent_id, c.product_count, 
         c.is_active, c.sort_order, c.created_at, c.updated_at,
         m.file_url, m.alt_text, m.title
ORDER BY c.sort_order;

-- Tạo index cho materialized view thống kê
CREATE INDEX idx_categories_with_stats_active_sort ON categories_with_stats(is_active, sort_order);
CREATE INDEX idx_categories_with_stats_slug ON categories_with_stats(slug);
CREATE INDEX idx_categories_with_stats_product_count ON categories_with_stats(product_count DESC);

-- =====================================================
-- 3. MATERIALIZED VIEW CHO CATEGORIES HIỆU SUẤT CAO
-- =====================================================

-- Tạo materialized view tối ưu cho hiển thị danh sách categories
CREATE MATERIALIZED VIEW categories_display AS
SELECT 
    c.id,
    c.name,
    c.slug,
    c.description,
    c.product_count,
    c.sort_order,
    -- Thông tin hình ảnh cơ bản
    m.file_url as image_url,
    m.alt_text as image_alt,
    -- Thống kê nhanh
    COUNT(p.id) as actual_product_count,
    AVG(p.rating) as avg_rating,
    COUNT(CASE WHEN p.is_featured = true THEN 1 END) as featured_count
FROM categories c
LEFT JOIN products p ON c.id = p.category_id AND p.is_active = true
LEFT JOIN media m ON c.featured_image_id = m.id AND m.is_active = true
WHERE c.is_active = true
GROUP BY c.id, c.name, c.slug, c.description, c.product_count, c.sort_order,
         m.file_url, m.alt_text
ORDER BY c.sort_order;

-- Tạo index cho materialized view hiển thị
CREATE INDEX idx_categories_display_sort ON categories_display(sort_order);
CREATE INDEX idx_categories_display_slug ON categories_display(slug);
CREATE INDEX idx_categories_display_product_count ON categories_display(product_count DESC);

-- =====================================================
-- 4. FUNCTION ĐỂ REFRESH MATERIALIZED VIEWS
-- =====================================================

-- Function để refresh tất cả materialized views
CREATE OR REPLACE FUNCTION refresh_categories_materialized_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY categories_with_images;
    REFRESH MATERIALIZED VIEW CONCURRENTLY categories_with_stats;
    REFRESH MATERIALIZED VIEW CONCURRENTLY categories_display;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 5. TRIGGER ĐỂ TỰ ĐỘNG REFRESH MATERIALIZED VIEWS
-- =====================================================

-- Function để refresh materialized views khi có thay đổi
CREATE OR REPLACE FUNCTION trigger_refresh_categories_materialized_views()
RETURNS TRIGGER AS $$
BEGIN
    -- Refresh materialized views sau khi có thay đổi
    PERFORM refresh_categories_materialized_views();
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger cho bảng categories
CREATE TRIGGER trigger_refresh_categories_mv
    AFTER INSERT OR UPDATE OR DELETE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION trigger_refresh_categories_materialized_views();

-- Trigger cho bảng products (ảnh hưởng đến product_count)
CREATE TRIGGER trigger_refresh_categories_mv_products
    AFTER INSERT OR UPDATE OR DELETE ON products
    FOR EACH ROW
    EXECUTE FUNCTION trigger_refresh_categories_materialized_views();

-- Trigger cho bảng media (ảnh hưởng đến hình ảnh)
CREATE TRIGGER trigger_refresh_categories_mv_media
    AFTER INSERT OR UPDATE OR DELETE ON media
    FOR EACH ROW
    EXECUTE FUNCTION trigger_refresh_categories_materialized_views();

-- =====================================================
-- 6. KIỂM TRA HIỆU SUẤT MATERIALIZED VIEWS
-- =====================================================

-- Kiểm tra kích thước materialized views
SELECT 
    schemaname,
    matviewname,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||matviewname)) as size
FROM pg_matviews 
WHERE schemaname = 'public' AND matviewname LIKE 'categories%';

-- Kiểm tra hiệu suất query
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM categories_with_images 
WHERE is_active = true 
ORDER BY sort_order;

-- So sánh hiệu suất với query gốc
EXPLAIN (ANALYZE, BUFFERS) 
SELECT 
    c.id, c.name, c.slug, c.description, c.product_count,
    m.file_url, m.alt_text, m.title
FROM categories c
LEFT JOIN media m ON c.featured_image_id = m.id AND m.is_active = true
WHERE c.is_active = true 
ORDER BY c.sort_order;

-- =====================================================
-- 7. HƯỚNG DẪN SỬ DỤNG
-- =====================================================

/*
=== CÁCH SỬ DỤNG MATERIALIZED VIEWS ===

1. Query cơ bản (nhanh nhất):
   SELECT * FROM categories_display ORDER BY sort_order;

2. Query với thông tin chi tiết:
   SELECT * FROM categories_with_images WHERE is_active = true;

3. Query với thống kê:
   SELECT * FROM categories_with_stats WHERE product_count > 0;

4. Refresh manual:
   SELECT refresh_categories_materialized_views();

5. Refresh một view cụ thể:
   REFRESH MATERIALIZED VIEW categories_with_images;

=== LƯU Ý ===
- Materialized views sẽ tự động refresh khi có thay đổi
- Có thể refresh manual khi cần thiết
- Sử dụng CONCURRENTLY để không block queries khác
- Index được tạo tự động cho hiệu suất tối ưu
*/

-- =====================================================
-- HOÀN THÀNH TẠO MATERIALIZED VIEWS
-- =====================================================
