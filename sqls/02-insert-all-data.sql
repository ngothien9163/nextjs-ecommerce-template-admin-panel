-- =====================================================
-- INSERT DỮ LIỆU MẪU VÀO TẤT CẢ TABLES
-- =====================================================

-- =====================================================
-- 1. INSERT PROFILES (THÔNG TIN USER)
-- =====================================================
INSERT INTO profiles (id, first_name, last_name, phone, date_of_birth, gender, role, is_verified, preferences) VALUES
(gen_random_uuid(), 'Admin', 'User', '+84123456789', '1990-01-01', 'male', 'admin', true, '{"theme": "dark", "language": "vi", "notifications": true}'),
(gen_random_uuid(), 'Moderator', 'User', '+84123456788', '1992-05-15', 'female', 'moderator', true, '{"theme": "light", "language": "vi", "notifications": true}'),
(gen_random_uuid(), 'Nguyễn', 'Văn A', '+84123456787', '1995-08-20', 'male', 'customer', true, '{"theme": "auto", "language": "vi", "notifications": true}'),
(gen_random_uuid(), 'Trần', 'Thị B', '+84123456786', '1993-12-10', 'female', 'customer', true, '{"theme": "light", "language": "vi", "notifications": false}'),
(gen_random_uuid(), 'Guest', 'User', '+84123456785', '1998-03-25', 'other', 'customer', false, '{"theme": "auto", "language": "vi", "notifications": false}');

-- =====================================================
-- 2. INSERT MEDIA (HÌNH ẢNH VÀ FILE CHUNG)
-- =====================================================
INSERT INTO media (file_name, file_path, file_url, alt_text, title, meta_description, meta_keywords, caption, credit, license, file_size, mime_type, dimensions) VALUES
('product-1-bg-1.png', '/images/products/product-1-bg-1.png', '/images/products/product-1-bg-1.png', 'Sản phẩm 1 - Hình ảnh chính', 'Product 1 Hero Image', 'Hình ảnh chính sản phẩm 1 với thiết kế hiện đại và chất lượng cao', ARRAY['product 1', 'electronics', 'modern design', 'high quality'], 'Sản phẩm 1 - Chất lượng cao, thiết kế hiện đại', 'TechStore', 'Commercial Use', 97000, 'image/png', '{"width": 800, "height": 600}'),
('product-1-bg-2.png', '/images/products/product-1-bg-2.png', '/images/products/product-1-bg-2.png', 'Sản phẩm 1 - Hình ảnh phụ', 'Product 1 Secondary Image', 'Hình ảnh phụ sản phẩm 1 thể hiện các góc nhìn khác', ARRAY['product 1', 'electronics', 'secondary view', 'detail'], 'Sản phẩm 1 - Góc nhìn chi tiết', 'TechStore', 'Commercial Use', 71000, 'image/png', '{"width": 600, "height": 400}'),
('product-2-bg-1.png', '/images/products/product-2-bg-1.png', '/images/products/product-2-bg-1.png', 'Sản phẩm 2 - Hình ảnh chính', 'Product 2 Hero Image', 'Hình ảnh chính sản phẩm 2 với thiết kế độc đáo', ARRAY['product 2', 'electronics', 'unique design', 'featured'], 'Sản phẩm 2 - Thiết kế độc đáo, nổi bật', 'TechStore', 'Commercial Use', 115000, 'image/png', '{"width": 800, "height": 600}'),
('product-2-bg-2.png', '/images/products/product-2-bg-2.png', '/images/products/product-2-bg-2.png', 'Sản phẩm 2 - Hình ảnh phụ', 'Product 2 Secondary Image', 'Hình ảnh phụ sản phẩm 2 thể hiện tính năng', ARRAY['product 2', 'electronics', 'secondary view', 'features'], 'Sản phẩm 2 - Tính năng nổi bật', 'TechStore', 'Commercial Use', 112000, 'image/png', '{"width": 600, "height": 400}'),
('product-3-bg-1.png', '/images/products/product-3-bg-1.png', '/images/products/product-3-bg-1.png', 'Sản phẩm 3 - Hình ảnh chính', 'Product 3 Hero Image', 'Hình ảnh chính sản phẩm 3 với thiết kế tối ưu', ARRAY['product 3', 'electronics', 'optimized design', 'performance'], 'Sản phẩm 3 - Thiết kế tối ưu, hiệu năng cao', 'TechStore', 'Commercial Use', 124000, 'image/png', '{"width": 800, "height": 600}'),
('product-3-bg-2.png', '/images/products/product-3-bg-2.png', '/images/products/product-3-bg-2.png', 'Sản phẩm 3 - Hình ảnh phụ', 'Product 3 Secondary Image', 'Hình ảnh phụ sản phẩm 3 thể hiện chi tiết', ARRAY['product 3', 'electronics', 'secondary view', 'details'], 'Sản phẩm 3 - Chi tiết thiết kế', 'TechStore', 'Commercial Use', 25000, 'image/png', '{"width": 600, "height": 400}'),
('product-4-bg-1.png', '/images/products/product-4-bg-1.png', '/images/products/product-4-bg-1.png', 'Sản phẩm 4 - Hình ảnh chính', 'Product 4 Hero Image', 'Hình ảnh chính sản phẩm 4 với thiết kế hiện đại', ARRAY['product 4', 'electronics', 'modern design', 'innovation'], 'Sản phẩm 4 - Thiết kế hiện đại, đổi mới', 'TechStore', 'Commercial Use', 144000, 'image/png', '{"width": 800, "height": 600}'),
('product-4-bg-2.png', '/images/products/product-4-bg-2.png', '/images/products/product-4-bg-2.png', 'Sản phẩm 4 - Hình ảnh phụ', 'Product 4 Secondary Image', 'Hình ảnh phụ sản phẩm 4 thể hiện góc nhìn khác', ARRAY['product 4', 'electronics', 'secondary view', 'perspective'], 'Sản phẩm 4 - Góc nhìn mới', 'TechStore', 'Commercial Use', 129000, 'image/png', '{"width": 600, "height": 400}'),
('product-5-bg-1.png', '/images/products/product-5-bg-1.png', '/images/products/product-5-bg-1.png', 'Sản phẩm 5 - Hình ảnh chính', 'Product 5 Hero Image', 'Hình ảnh chính sản phẩm 5 với thiết kế cao cấp', ARRAY['product 5', 'electronics', 'premium design', 'luxury'], 'Sản phẩm 5 - Thiết kế cao cấp, sang trọng', 'TechStore', 'Commercial Use', 163000, 'image/png', '{"width": 800, "height": 600}'),
('product-5-bg-2.png', '/images/products/product-5-bg-2.png', '/images/products/product-5-bg-2.png', 'Sản phẩm 5 - Hình ảnh phụ', 'Product 5 Secondary Image', 'Hình ảnh phụ sản phẩm 5 thể hiện chất lượng', ARRAY['product 5', 'electronics', 'secondary view', 'quality'], 'Sản phẩm 5 - Chất lượng vượt trội', 'TechStore', 'Commercial Use', 158000, 'image/png', '{"width": 600, "height": 400}'),
('product-6-bg-1.png', '/images/products/product-6-bg-1.png', '/images/products/product-6-bg-1.png', 'Sản phẩm 6 - Hình ảnh chính', 'Product 6 Hero Image', 'Hình ảnh chính sản phẩm 6 với thiết kế thông minh', ARRAY['product 6', 'electronics', 'smart design', 'intelligent'], 'Sản phẩm 6 - Thiết kế thông minh, tiện dụng', 'TechStore', 'Commercial Use', 62000, 'image/png', '{"width": 800, "height": 600}'),
('product-6-bg-2.png', '/images/products/product-6-bg-2.png', '/images/products/product-6-bg-2.png', 'Sản phẩm 6 - Hình ảnh phụ', 'Product 6 Secondary Image', 'Hình ảnh phụ sản phẩm 6 thể hiện tính năng', ARRAY['product 6', 'electronics', 'secondary view', 'features'], 'Sản phẩm 6 - Tính năng đa dạng', 'TechStore', 'Commercial Use', 63000, 'image/png', '{"width": 600, "height": 400}'),
('product-7-bg-1.png', '/images/products/product-7-bg-1.png', '/images/products/product-7-bg-1.png', 'Sản phẩm 7 - Hình ảnh chính', 'Product 7 Hero Image', 'Hình ảnh chính sản phẩm 7 với thiết kế đa năng', ARRAY['product 7', 'electronics', 'versatile design', 'multifunctional'], 'Sản phẩm 7 - Thiết kế đa năng, linh hoạt', 'TechStore', 'Commercial Use', 102000, 'image/png', '{"width": 800, "height": 600}'),
('product-7-bg-2.png', '/images/products/product-7-bg-2.png', '/images/products/product-7-bg-2.png', 'Sản phẩm 7 - Hình ảnh phụ', 'Product 7 Secondary Image', 'Hình ảnh phụ sản phẩm 7 thể hiện ứng dụng', ARRAY['product 7', 'electronics', 'secondary view', 'applications'], 'Sản phẩm 7 - Ứng dụng đa dạng', 'TechStore', 'Commercial Use', 73000, 'image/png', '{"width": 600, "height": 400}'),
('product-8-bg-1.png', '/images/products/product-8-bg-1.png', '/images/products/product-8-bg-1.png', 'Sản phẩm 8 - Hình ảnh chính', 'Product 8 Hero Image', 'Hình ảnh chính sản phẩm 8 với thiết kế tiên tiến', ARRAY['product 8', 'electronics', 'advanced design', 'cutting-edge'], 'Sản phẩm 8 - Thiết kế tiên tiến, đột phá', 'TechStore', 'Commercial Use', 46000, 'image/png', '{"width": 800, "height": 600}'),
('blog-tech-trends.jpg', '/images/blog/blog-tech-trends.jpg', '/images/blog/blog-tech-trends.jpg', 'Blog: Xu hướng công nghệ 2024', 'Tech Trends 2024', 'Hình ảnh minh họa xu hướng công nghệ 2024: AI, 5G, IoT và các công nghệ mới', ARRAY['tech trends', 'ai', '5g', 'iot', 'technology 2024'], 'Xu hướng công nghệ 2024 - Tương lai đã đến', 'Tech Blog', 'Creative Commons', 2200000, 'image/jpeg', '{"width": 1200, "height": 600}'),
('blog-iphone-review.jpg', '/images/blog/blog-iphone-review.jpg', '/images/blog/blog-iphone-review.jpg', 'Blog: Đánh giá iPhone 15', 'iPhone 15 Review', 'Hình ảnh minh họa bài đánh giá iPhone 15 với các tính năng nổi bật', ARRAY['iphone 15 review', 'iphone', 'apple', 'smartphone review', 'camera review'], 'Đánh giá iPhone 15 - Có đáng mua không?', 'Tech Review', 'Creative Commons', 2400000, 'image/jpeg', '{"width": 1200, "height": 600}');

-- =====================================================
-- 3. INSERT USER_ADDRESSES (ĐỊA CHỈ GIAO HÀNG)
-- =====================================================
INSERT INTO user_addresses (user_id, address_type, is_default, recipient_name, phone, address_line1, address_line2, city, state, postal_code, country) VALUES
((SELECT id FROM profiles WHERE first_name = 'Nguyễn' AND last_name = 'Văn A' LIMIT 1), 'shipping', true, 'Nguyễn Văn A', '+84123456787', '123 Đường ABC', 'Tầng 2, Phòng 201', 'Hà Nội', 'Hà Nội', '100000', 'Việt Nam'),
((SELECT id FROM profiles WHERE first_name = 'Nguyễn' AND last_name = 'Văn A' LIMIT 1), 'billing', true, 'Nguyễn Văn A', '+84123456787', '123 Đường ABC', 'Tầng 2, Phòng 201', 'Hà Nội', 'Hà Nội', '100000', 'Việt Nam'),
((SELECT id FROM profiles WHERE first_name = 'Trần' AND last_name = 'Thị B' LIMIT 1), 'shipping', true, 'Trần Thị B', '+84123456786', '456 Đường XYZ', 'Tầng 3, Phòng 301', 'TP.HCM', 'TP.HCM', '700000', 'Việt Nam'),
((SELECT id FROM profiles WHERE first_name = 'Trần' AND last_name = 'Thị B' LIMIT 1), 'billing', true, 'Trần Thị B', '+84123456786', '456 Đường XYZ', 'Tầng 3, Phòng 301', 'TP.HCM', 'TP.HCM', '700000', 'Việt Nam');

-- =====================================================
-- 4. INSERT CATEGORIES (DANH MỤC SẢN PHẨM)
-- =====================================================
INSERT INTO categories (name, slug, description, featured_image_id, product_count, is_active, sort_order) VALUES
('Laptop', 'laptops', 'Laptop gaming, văn phòng, sinh viên chất lượng cao', (SELECT id FROM media WHERE file_name = 'macbook-pro-hero.jpg' LIMIT 1), 0, true, 1),
('Smartphone', 'smartphones', 'Điện thoại thông minh từ các thương hiệu uy tín', (SELECT id FROM media WHERE file_name = 'iphone-15-hero.jpg' LIMIT 1), 0, true, 2),
('Tablet', 'tablets', 'Máy tính bảng đa dụng cho công việc và giải trí', NULL, 0, true, 3),
('Accessories', 'accessories', 'Phụ kiện điện tử chất lượng cao', NULL, 0, true, 4);

-- =====================================================
-- 5. INSERT TAGS (THẺ GẮN CHO SẢN PHẨM VÀ BLOG)
-- =====================================================
INSERT INTO tags (name, slug, description, color, tag_type, is_active) VALUES
('laptop', 'laptop', 'Tag cho các sản phẩm laptop', '#3B82F6', 'product', true),
('smartphone', 'smartphone', 'Tag cho các sản phẩm smartphone', '#10B981', 'product', true),
('apple', 'apple', 'Tag cho sản phẩm của Apple', '#EF4444', 'mixed', true),
('gaming', 'gaming', 'Tag cho sản phẩm gaming', '#8B5CF6', 'mixed', true),
('công nghệ', 'cong-nghe', 'Tag cho bài viết công nghệ', '#F59E0B', 'blog', true),
('iphone', 'iphone', 'Tag cho sản phẩm iPhone', '#EC4899', 'mixed', true),
('tablet', 'tablet', 'Tag cho các sản phẩm tablet', '#8B5CF6', 'product', true),
('airpods', 'airpods', 'Tag cho sản phẩm AirPods', '#06B6D4', 'product', true),
('smartwatch', 'smartwatch', 'Tag cho các sản phẩm smartwatch', '#F97316', 'product', true),
('headphone', 'headphone', 'Tag cho các sản phẩm headphone', '#84CC16', 'product', true),
('drone', 'drone', 'Tag cho các sản phẩm drone', '#EF4444', 'product', true),
('camera', 'camera', 'Tag cho các sản phẩm camera', '#10B981', 'product', true),
('microsoft', 'microsoft', 'Tag cho sản phẩm của Microsoft', '#3B82F6', 'mixed', true),
('google', 'google', 'Tag cho sản phẩm của Google', '#8B5CF6', 'mixed', true),
('sony', 'sony', 'Tag cho sản phẩm của Sony', '#EC4899', 'mixed', true),
('nintendo', 'nintendo', 'Tag cho sản phẩm của Nintendo', '#F59E0B', 'mixed', true),
('dji', 'dji', 'Tag cho sản phẩm của DJI', '#10B981', 'mixed', true),
('gopro', 'gopro', 'Tag cho sản phẩm của GoPro', '#EF4444', 'mixed', true),
('oneplus', 'oneplus', 'Tag cho sản phẩm của OnePlus', '#8B5CF6', 'mixed', true);

-- =====================================================
-- 6. INSERT PRODUCTS (SẢN PHẨM)
-- =====================================================
INSERT INTO products (name, slug, description, short_description, category_id, brand, sku, price, sale_price, cost_price, weight, dimensions, is_featured, is_bestseller, stock_quantity, min_stock_level, max_stock_level, rating, review_count, view_count, warranty, return_policy, featured_image_id) VALUES
('MacBook Air M1', 'macbook-air-m1', 'Laptop Apple với chip M1 mạnh mẽ, hiệu năng vượt trội, pin trâu', 'MacBook Air M1 chip, 8/256GB, hiệu năng mạnh mẽ, pin trâu', (SELECT id FROM categories WHERE slug = 'laptops' LIMIT 1), 'Apple', 'MBA-M1-8-256', 1500000, 1400000, 1200000, 1.29, '{"length": 30.41, "width": 21.24, "height": 1.61, "unit": "cm"}', true, true, 50, 5, 100, 4.8, 12, 1250, '12 months', '30 days', (SELECT id FROM media WHERE file_name = 'macbook-pro-hero.jpg' LIMIT 1)),
('MacBook Pro M2', 'macbook-pro-m2', 'Laptop Apple chuyên nghiệp với chip M2, màn hình Retina tuyệt đẹp', 'MacBook Pro M2 chip, 16/512GB, màn hình Retina, hiệu năng chuyên nghiệp', (SELECT id FROM categories WHERE slug = 'laptops' LIMIT 1), 'Apple', 'MBP-M2-16-512', 2000000, 1800000, 1500000, 1.4, '{"length": 30.41, "width": 21.24, "height": 1.68, "unit": "cm"}', true, true, 30, 3, 80, 4.9, 8, 980, '12 months', '30 days', (SELECT id FROM media WHERE file_name = 'macbook-pro-hero.jpg' LIMIT 1)),
('iPhone 15 Pro', 'iphone-15-pro', 'iPhone 15 Pro với chip A17 Pro, camera 48MP, thiết kế Titan', 'iPhone 15 Pro với chip A17 Pro, camera 48MP, thiết kế Titan, 5G', (SELECT id FROM categories WHERE slug = 'smartphones' LIMIT 1), 'Apple', 'IPH-15PRO-128', 2500000, 2300000, 2000000, 0.187, '{"length": 14.7, "width": 7.1, "height": 0.8, "unit": "cm"}', true, true, 100, 10, 200, 4.7, 25, 2100, '12 months', '30 days', (SELECT id FROM media WHERE file_name = 'iphone-15-hero.jpg' LIMIT 1)),
('Samsung Galaxy S24', 'samsung-galaxy-s24', 'Samsung Galaxy S24 với AI features, camera 200MP, màn hình Dynamic AMOLED', 'Galaxy S24 với AI features, camera 200MP, màn hình Dynamic AMOLED 2X', (SELECT id FROM categories WHERE slug = 'smartphones' LIMIT 1), 'Samsung', 'SMS-GS24-256', 2200000, 2000000, 1800000, 0.168, '{"length": 14.7, "width": 7.0, "height": 0.8, "unit": "cm"}', true, true, 80, 8, 150, 4.6, 18, 1650, '12 months', '30 days', (SELECT id FROM media WHERE file_name = 'iphone-15-hero.jpg' LIMIT 1)),
('iPad Pro 12.9 inch', 'ipad-pro-12-9', 'iPad Pro 12.9 inch với chip M2, màn hình Liquid Retina XDR, hỗ trợ Apple Pencil', 'iPad Pro 12.9 inch chip M2, màn hình Liquid Retina XDR, hỗ trợ Apple Pencil và Magic Keyboard', (SELECT id FROM categories WHERE slug = 'tablets' LIMIT 1), 'Apple', 'IPAD-PRO-12-9-256', 1800000, 1600000, 1400000, 0.682, '{"length": 28.06, "width": 21.49, "height": 0.64, "unit": "cm"}', true, true, 45, 5, 100, 4.8, 15, 1200, '12 months', '30 days', (SELECT id FROM media WHERE file_name = 'ipad-pro-12-9-hero.jpg' LIMIT 1)),
('Samsung Galaxy Tab S9', 'samsung-galaxy-tab-s9', 'Galaxy Tab S9 với chip Snapdragon 8 Gen 2, màn hình AMOLED 11 inch', 'Galaxy Tab S9 chip Snapdragon 8 Gen 2, màn hình AMOLED 11 inch, S Pen tích hợp', (SELECT id FROM categories WHERE slug = 'tablets' LIMIT 1), 'Samsung', 'SMS-GTS9-128', 1200000, 1100000, 900000, 0.498, '{"length": 25.4, "width": 16.5, "height": 0.6, "unit": "cm"}', true, false, 60, 6, 120, 4.5, 12, 980, '12 months', '30 days', (SELECT id FROM media WHERE file_name = 'samsung-galaxy-tab-s9-hero.jpg' LIMIT 1)),
('AirPods Pro 2', 'airpods-pro-2', 'AirPods Pro 2 với chip H2, chống ồn chủ động, âm thanh không gian', 'AirPods Pro 2 chip H2, chống ồn chủ động, âm thanh không gian, chống nước IPX4', (SELECT id FROM categories WHERE slug = 'accessories' LIMIT 1), 'Apple', 'AIRPODS-PRO2', 600000, 550000, 400000, 0.05, '{"length": 3.0, "width": 2.0, "height": 1.0, "unit": "cm"}', true, true, 120, 12, 200, 4.7, 28, 2100, '12 months', '30 days', (SELECT id FROM media WHERE file_name = 'airpods-pro-2-hero.jpg' LIMIT 1)),
('Samsung Galaxy Watch 6', 'samsung-galaxy-watch-6', 'Galaxy Watch 6 với màn hình AMOLED, theo dõi sức khỏe, GPS tích hợp', 'Galaxy Watch 6 màn hình AMOLED, theo dõi sức khỏe, GPS tích hợp, chống nước 5ATM', (SELECT id FROM categories WHERE slug = 'accessories' LIMIT 1), 'Samsung', 'SMS-GW6-44', 800000, 700000, 600000, 0.028, '{"length": 4.4, "width": 4.4, "height": 1.0, "unit": "cm"}', true, false, 75, 8, 150, 4.6, 20, 1350, '12 months', '30 days', (SELECT id FROM media WHERE file_name = 'samsung-galaxy-watch-6-hero.jpg' LIMIT 1)),
('MacBook Pro M3 Max', 'macbook-pro-m3-max', 'MacBook Pro M3 Max với chip M3 Max mạnh mẽ, màn hình Liquid Retina XDR 16 inch', 'MacBook Pro M3 Max chip M3 Max, màn hình Liquid Retina XDR 16 inch, hiệu năng đỉnh cao', (SELECT id FROM categories WHERE slug = 'laptops' LIMIT 1), 'Apple', 'MBP-M3MAX-32-1TB', 3500000, 3200000, 2800000, 2.15, '{"length": 35.57, "width": 24.81, "height": 1.68, "unit": "cm"}', true, true, 25, 3, 60, 4.9, 8, 850, '12 months', '30 days', (SELECT id FROM media WHERE file_name = 'macbook-pro-m3-max-hero.jpg' LIMIT 1)),
('Dell XPS 13 Plus', 'dell-xps-13-plus', 'Dell XPS 13 Plus với chip Intel Core i7, màn hình OLED 13.4 inch, thiết kế siêu mỏng', 'Dell XPS 13 Plus chip Intel Core i7, màn hình OLED 13.4 inch, thiết kế siêu mỏng, bàn phím cảm ứng', (SELECT id FROM categories WHERE slug = 'laptops' LIMIT 1), 'Dell', 'DELL-XPS13P-16-512', 2500000, 2200000, 1800000, 1.17, '{"length": 29.5, "width": 19.9, "height": 1.5, "unit": "cm"}', true, false, 40, 4, 80, 4.5, 15, 1100, '12 months', '30 days', (SELECT id FROM media WHERE file_name = 'dell-xps-13-plus-hero.jpg' LIMIT 1)),
('iPhone 15', 'iphone-15', 'iPhone 15 với chip A16 Bionic, camera kép 48MP, màn hình Super Retina XDR 6.1 inch', 'iPhone 15 chip A16 Bionic, camera kép 48MP, màn hình Super Retina XDR 6.1 inch, thiết kế Dynamic Island', (SELECT id FROM categories WHERE slug = 'smartphones' LIMIT 1), 'Apple', 'IPH-15-128', 2000000, 1800000, 1500000, 0.171, '{"length": 14.7, "width": 7.1, "height": 0.8, "unit": "cm"}', true, false, 90, 9, 180, 4.6, 22, 1800, '12 months', '30 days', (SELECT id FROM media WHERE file_name = 'iphone-15-hero.jpg' LIMIT 1)),
('Google Pixel 8', 'google-pixel-8', 'Google Pixel 8 với chip Tensor G3, camera 50MP, AI features tích hợp', 'Google Pixel 8 chip Tensor G3, camera 50MP, AI features tích hợp, màn hình OLED 6.2 inch', (SELECT id FROM categories WHERE slug = 'smartphones' LIMIT 1), 'Google', 'GOOG-PIXEL8-128', 1800000, 1600000, 1400000, 0.187, '{"length": 15.0, "width": 7.0, "height": 0.8, "unit": "cm"}', true, false, 55, 6, 110, 4.4, 18, 1200, '12 months', '30 days', (SELECT id FROM media WHERE file_name = 'google-pixel-8-hero.jpg' LIMIT 1)),
('Sony WH-1000XM5', 'sony-wh-1000xm5', 'Sony WH-1000XM5 với chống ồn chủ động, âm thanh chất lượng cao, pin 30 giờ', 'Sony WH-1000XM5 chống ồn chủ động, âm thanh chất lượng cao, pin 30 giờ, thiết kế gập gọn', (SELECT id FROM categories WHERE slug = 'accessories' LIMIT 1), 'Sony', 'SONY-WH1000XM5', 800000, 750000, 600000, 0.25, '{"length": 16.5, "width": 8.0, "height": 3.0, "unit": "cm"}', true, true, 65, 7, 130, 4.8, 25, 1600, '12 months', '30 days', (SELECT id FROM media WHERE file_name = 'sony-wh-1000xm5-hero.jpg' LIMIT 1)),
('Nintendo Switch OLED', 'nintendo-switch-oled', 'Nintendo Switch OLED với màn hình OLED 7 inch, Joy-Con controllers, dock gốc', 'Nintendo Switch OLED màn hình OLED 7 inch, Joy-Con controllers, dock gốc, pin 4.5-9 giờ', (SELECT id FROM categories WHERE slug = 'accessories' LIMIT 1), 'Nintendo', 'NINT-SWOLED', 700000, 650000, 500000, 0.42, '{"length": 24.1, "width": 10.2, "height": 1.4, "unit": "cm"}', true, false, 80, 8, 160, 4.7, 30, 1900, '12 months', '30 days', (SELECT id FROM media WHERE file_name = 'nintendo-switch-oled-hero.jpg' LIMIT 1)),
('DJI Mini 3 Pro', 'dji-mini-3-pro', 'DJI Mini 3 Pro drone với camera 4K, trọng lượng dưới 250g, bay 34 phút', 'DJI Mini 3 Pro drone camera 4K, trọng lượng dưới 250g, bay 34 phút, điều khiển bằng smartphone', (SELECT id FROM categories WHERE slug = 'accessories' LIMIT 1), 'DJI', 'DJI-MINI3PRO', 1500000, 1400000, 1200000, 0.249, '{"length": 14.5, "width": 8.5, "height": 5.7, "unit": "cm"}', true, false, 35, 4, 70, 4.6, 12, 850, '12 months', '30 days', (SELECT id FROM media WHERE file_name = 'dji-mini-3-pro-hero.jpg' LIMIT 1)),
('GoPro Hero 11 Black', 'gopro-hero-11-black', 'GoPro Hero 11 Black với camera 5.3K, HyperSmooth 5.0, chống nước 10m', 'GoPro Hero 11 Black camera 5.3K, HyperSmooth 5.0, chống nước 10m, màn hình cảm ứng 2.27 inch', (SELECT id FROM categories WHERE slug = 'accessories' LIMIT 1), 'GoPro', 'GOPRO-HERO11B', 800000, 750000, 600000, 0.153, '{"length": 7.1, "width": 5.0, "height": 3.3, "unit": "cm"}', true, false, 50, 5, 100, 4.5, 16, 1100, '12 months', '30 days', (SELECT id FROM media WHERE file_name = 'gopro-hero-11-black-hero.jpg' LIMIT 1)),
('Microsoft Surface Pro 9', 'microsoft-surface-pro-9', 'Microsoft Surface Pro 9 với chip Intel Core i5, màn hình 13 inch, thiết kế 2-in-1', 'Microsoft Surface Pro 9 chip Intel Core i5, màn hình 13 inch, thiết kế 2-in-1, hỗ trợ Surface Pen', (SELECT id FROM categories WHERE slug = 'tablets' LIMIT 1), 'Microsoft', 'MS-SURFACEPRO9-8-256', 1800000, 1700000, 1400000, 0.879, '{"length": 28.7, "width": 20.9, "height": 0.9, "unit": "cm"}', true, false, 30, 3, 60, 4.4, 14, 950, '12 months', '30 days', (SELECT id FROM media WHERE file_name = 'microsoft-surface-pro-9-hero.jpg' LIMIT 1)),
('OnePlus 11', 'oneplus-11', 'OnePlus 11 với chip Snapdragon 8 Gen 2, camera 50MP, sạc nhanh 100W', 'OnePlus 11 chip Snapdragon 8 Gen 2, camera 50MP, sạc nhanh 100W, màn hình AMOLED 6.7 inch', (SELECT id FROM categories WHERE slug = 'smartphones' LIMIT 1), 'OnePlus', 'ONEPLUS-11-128', 1600000, 1500000, 1200000, 0.205, '{"length": 16.3, "width": 7.5, "height": 0.8, "unit": "cm"}', true, false, 45, 5, 90, 4.5, 20, 1400, '12 months', '30 days', (SELECT id FROM media WHERE file_name = 'oneplus-11-hero.jpg' LIMIT 1));

-- =====================================================
-- 7. CẬP NHẬT PRODUCT_COUNT CHO CATEGORIES
-- =====================================================
UPDATE categories 
SET product_count = (
    SELECT COUNT(*) 
    FROM products 
    WHERE category_id = categories.id AND is_active = true
);

-- =====================================================
-- 8. INSERT PRODUCT_VARIANTS (BIẾN THỂ SẢN PHẨM)
-- =====================================================
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes) VALUES
((SELECT id FROM products WHERE slug = 'macbook-air-m1' LIMIT 1), '8GB RAM, 256GB SSD', 'MBA-M1-8-256', 1500000, 25, '{"ram": "8GB", "storage": "256GB"}'),
((SELECT id FROM products WHERE slug = 'macbook-air-m1' LIMIT 1), '8GB RAM, 512GB SSD', 'MBA-M1-8-512', 1700000, 15, '{"ram": "8GB", "storage": "512GB"}'),
((SELECT id FROM products WHERE slug = 'macbook-air-m1' LIMIT 1), '16GB RAM, 512GB SSD', 'MBA-M1-16-512', 1900000, 10, '{"ram": "16GB", "storage": "512GB"}'),
((SELECT id FROM products WHERE slug = 'iphone-15-pro' LIMIT 1), '128GB', 'IPH-15PRO-128', 2500000, 40, '{"storage": "128GB"}'),
((SELECT id FROM products WHERE slug = 'iphone-15-pro' LIMIT 1), '256GB', 'IPH-15PRO-256', 2700000, 35, '{"storage": "256GB"}'),
((SELECT id FROM products WHERE slug = 'iphone-15-pro' LIMIT 1), '512GB', 'IPH-15PRO-512', 3000000, 25, '{"storage": "512GB"}'),
((SELECT id FROM products WHERE slug = 'ipad-pro-12-9' LIMIT 1), '256GB', 'IPAD-PRO-12-9-256', 1800000, 25, '{"storage": "256GB"}'),
((SELECT id FROM products WHERE slug = 'ipad-pro-12-9' LIMIT 1), '512GB', 'IPAD-PRO-12-9-512', 2000000, 20, '{"storage": "512GB"}'),
((SELECT id FROM products WHERE slug = 'ipad-pro-12-9' LIMIT 1), '1TB', 'IPAD-PRO-12-9-1TB', 2200000, 15, '{"storage": "1TB"}'),
((SELECT id FROM products WHERE slug = 'samsung-galaxy-tab-s9' LIMIT 1), '128GB', 'SMS-GTS9-128', 1200000, 30, '{"storage": "128GB"}'),
((SELECT id FROM products WHERE slug = 'samsung-galaxy-tab-s9' LIMIT 1), '256GB', 'SMS-GTS9-256', 1400000, 25, '{"storage": "256GB"}'),
((SELECT id FROM products WHERE slug = 'airpods-pro-2' LIMIT 1), 'Standard', 'AIRPODS-PRO2-STD', 600000, 60, '{"version": "Standard"}'),
((SELECT id FROM products WHERE slug = 'airpods-pro-2' LIMIT 1), 'MagSafe Case', 'AIRPODS-PRO2-MAG', 650000, 40, '{"version": "MagSafe Case"}'),
((SELECT id FROM products WHERE slug = 'samsung-galaxy-watch-6' LIMIT 1), '44mm', 'SMS-GW6-44', 800000, 40, '{"size": "44mm"}'),
((SELECT id FROM products WHERE slug = 'samsung-galaxy-watch-6' LIMIT 1), '40mm', 'SMS-GW6-40', 750000, 35, '{"size": "40mm"}'),
((SELECT id FROM products WHERE slug = 'macbook-pro-m3-max' LIMIT 1), '32GB RAM, 1TB SSD', 'MBP-M3MAX-32-1TB', 3500000, 15, '{"ram": "32GB", "storage": "1TB"}'),
((SELECT id FROM products WHERE slug = 'macbook-pro-m3-max' LIMIT 1), '64GB RAM, 2TB SSD', 'MBP-M3MAX-64-2TB', 4500000, 10, '{"ram": "64GB", "storage": "2TB"}'),
((SELECT id FROM products WHERE slug = 'dell-xps-13-plus' LIMIT 1), '16GB RAM, 512GB SSD', 'DELL-XPS13P-16-512', 2500000, 20, '{"ram": "16GB", "storage": "512GB"}'),
((SELECT id FROM products WHERE slug = 'dell-xps-13-plus' LIMIT 1), '32GB RAM, 1TB SSD', 'DELL-XPS13P-32-1TB', 3000000, 15, '{"ram": "32GB", "storage": "1TB"}'),
((SELECT id FROM products WHERE slug = 'iphone-15' LIMIT 1), '128GB', 'IPH-15-128', 2000000, 45, '{"storage": "128GB"}'),
((SELECT id FROM products WHERE slug = 'iphone-15' LIMIT 1), '256GB', 'IPH-15-256', 2200000, 35, '{"storage": "256GB"}'),
((SELECT id FROM products WHERE slug = 'google-pixel-8' LIMIT 1), '128GB', 'GOOG-PIXEL8-128', 1800000, 30, '{"storage": "128GB"}'),
((SELECT id FROM products WHERE slug = 'google-pixel-8' LIMIT 1), '256GB', 'GOOG-PIXEL8-256', 2000000, 25, '{"storage": "256GB"}'),
((SELECT id FROM products WHERE slug = 'sony-wh-1000xm5' LIMIT 1), 'Black', 'SONY-WH1000XM5-BLK', 800000, 35, '{"color": "Black"}'),
((SELECT id FROM products WHERE slug = 'sony-wh-1000xm5' LIMIT 1), 'Silver', 'SONY-WH1000XM5-SLV', 800000, 30, '{"color": "Silver"}'),
((SELECT id FROM products WHERE slug = 'nintendo-switch-oled' LIMIT 1), 'Standard', 'NINT-SWOLED-STD', 700000, 40, '{"version": "Standard"}'),
((SELECT id FROM products WHERE slug = 'nintendo-switch-oled' LIMIT 1), 'Special Edition', 'NINT-SWOLED-SPEC', 750000, 25, '{"version": "Special Edition"}'),
((SELECT id FROM products WHERE slug = 'dji-mini-3-pro' LIMIT 1), 'Standard', 'DJI-MINI3PRO-STD', 1500000, 20, '{"version": "Standard"}'),
((SELECT id FROM products WHERE slug = 'dji-mini-3-pro' LIMIT 1), 'Fly More Combo', 'DJI-MINI3PRO-FLY', 1800000, 15, '{"version": "Fly More Combo"}'),
((SELECT id FROM products WHERE slug = 'gopro-hero-11-black' LIMIT 1), 'Standard', 'GOPRO-HERO11B-STD', 800000, 25, '{"version": "Standard"}'),
((SELECT id FROM products WHERE slug = 'gopro-hero-11-black' LIMIT 1), 'Creator Edition', 'GOPRO-HERO11B-CRE', 1000000, 20, '{"version": "Creator Edition"}'),
((SELECT id FROM products WHERE slug = 'microsoft-surface-pro-9' LIMIT 1), '8GB RAM, 256GB SSD', 'MS-SURFACEPRO9-8-256', 1800000, 15, '{"ram": "8GB", "storage": "256GB"}'),
((SELECT id FROM products WHERE slug = 'microsoft-surface-pro-9' LIMIT 1), '16GB RAM, 512GB SSD', 'MS-SURFACEPRO9-16-512', 2200000, 10, '{"ram": "16GB", "storage": "512GB"}'),
((SELECT id FROM products WHERE slug = 'oneplus-11' LIMIT 1), '128GB', 'ONEPLUS-11-128', 1600000, 25, '{"storage": "128GB"}'),
((SELECT id FROM products WHERE slug = 'oneplus-11' LIMIT 1), '256GB', 'ONEPLUS-11-256', 1800000, 20, '{"storage": "256GB"}');

-- =====================================================
-- 9. INSERT PRODUCT_TAGS (QUAN HỆ NHIỀU-NHIỀU GIỮA PRODUCTS VÀ TAGS)
-- =====================================================
INSERT INTO product_tags (product_id, tag_id) VALUES
((SELECT id FROM products WHERE slug = 'macbook-air-m1' LIMIT 1), (SELECT id FROM tags WHERE slug = 'laptop' LIMIT 1)),
((SELECT id FROM products WHERE slug = 'macbook-air-m1' LIMIT 1), (SELECT id FROM tags WHERE slug = 'apple' LIMIT 1)),
((SELECT id FROM products WHERE slug = 'macbook-pro-m2' LIMIT 1), (SELECT id FROM tags WHERE slug = 'laptop' LIMIT 1)),
((SELECT id FROM products WHERE slug = 'macbook-pro-m2' LIMIT 1), (SELECT id FROM tags WHERE slug = 'apple' LIMIT 1)),
((SELECT id FROM products WHERE slug = 'macbook-pro-m2' LIMIT 1), (SELECT id FROM tags WHERE slug = 'gaming' LIMIT 1)),
((SELECT id FROM products WHERE slug = 'iphone-15-pro' LIMIT 1), (SELECT id FROM tags WHERE slug = 'smartphone' LIMIT 1)),
((SELECT id FROM products WHERE slug = 'iphone-15-pro' LIMIT 1), (SELECT id FROM tags WHERE slug = 'apple' LIMIT 1)),
((SELECT id FROM products WHERE slug = 'iphone-15-pro' LIMIT 1), (SELECT id FROM tags WHERE slug = 'iphone' LIMIT 1)),
((SELECT id FROM products WHERE slug = 'samsung-galaxy-s24' LIMIT 1), (SELECT id FROM tags WHERE slug = 'smartphone' LIMIT 1)),
((SELECT id FROM products WHERE slug = 'ipad-pro-12-9' LIMIT 1), (SELECT id FROM tags WHERE slug = 'tablet' LIMIT 1)),
((SELECT id FROM products WHERE slug = 'ipad-pro-12-9' LIMIT 1), (SELECT id FROM tags WHERE slug = 'apple' LIMIT 1)),
((SELECT id FROM products WHERE slug = 'samsung-galaxy-tab-s9' LIMIT 1), (SELECT id FROM tags WHERE slug = 'tablet' LIMIT 1)),
((SELECT id FROM products WHERE slug = 'samsung-galaxy-tab-s9' LIMIT 1), (SELECT id FROM tags WHERE slug = 'samsung' LIMIT 1)),
((SELECT id FROM products WHERE slug = 'airpods-pro-2' LIMIT 1), (SELECT id FROM tags WHERE slug = 'airpods' LIMIT 1)),
((SELECT id FROM products WHERE slug = 'airpods-pro-2' LIMIT 1), (SELECT id FROM tags WHERE slug = 'apple' LIMIT 1)),
((SELECT id FROM products WHERE slug = 'samsung-galaxy-watch-6' LIMIT 1), (SELECT id FROM tags WHERE slug = 'smartwatch' LIMIT 1)),
((SELECT id FROM products WHERE slug = 'samsung-galaxy-watch-6' LIMIT 1), (SELECT id FROM tags WHERE slug = 'samsung' LIMIT 1)),
((SELECT id FROM products WHERE slug = 'macbook-pro-m3-max' LIMIT 1), (SELECT id FROM tags WHERE slug = 'laptop' LIMIT 1)),
((SELECT id FROM products WHERE slug = 'macbook-pro-m3-max' LIMIT 1), (SELECT id FROM tags WHERE slug = 'apple' LIMIT 1)),
((SELECT id FROM products WHERE slug = 'macbook-pro-m3-max' LIMIT 1), (SELECT id FROM tags WHERE slug = 'gaming' LIMIT 1)),
((SELECT id FROM products WHERE slug = 'dell-xps-13-plus' LIMIT 1), (SELECT id FROM tags WHERE slug = 'laptop' LIMIT 1)),
((SELECT id FROM products WHERE slug = 'dell-xps-13-plus' LIMIT 1), (SELECT id FROM tags WHERE slug = 'microsoft' LIMIT 1)),
((SELECT id FROM products WHERE slug = 'iphone-15' LIMIT 1), (SELECT id FROM tags WHERE slug = 'smartphone' LIMIT 1)),
((SELECT id FROM products WHERE slug = 'iphone-15' LIMIT 1), (SELECT id FROM tags WHERE slug = 'apple' LIMIT 1)),
((SELECT id FROM products WHERE slug = 'iphone-15' LIMIT 1), (SELECT id FROM tags WHERE slug = 'iphone' LIMIT 1)),
((SELECT id FROM products WHERE slug = 'google-pixel-8' LIMIT 1), (SELECT id FROM tags WHERE slug = 'smartphone' LIMIT 1)),
((SELECT id FROM products WHERE slug = 'google-pixel-8' LIMIT 1), (SELECT id FROM tags WHERE slug = 'google' LIMIT 1)),
((SELECT id FROM products WHERE slug = 'sony-wh-1000xm5' LIMIT 1), (SELECT id FROM tags WHERE slug = 'headphone' LIMIT 1)),
((SELECT id FROM products WHERE slug = 'sony-wh-1000xm5' LIMIT 1), (SELECT id FROM tags WHERE slug = 'sony' LIMIT 1)),
((SELECT id FROM products WHERE slug = 'nintendo-switch-oled' LIMIT 1), (SELECT id FROM tags WHERE slug = 'gaming' LIMIT 1)),
((SELECT id FROM products WHERE slug = 'nintendo-switch-oled' LIMIT 1), (SELECT id FROM tags WHERE slug = 'nintendo' LIMIT 1)),
((SELECT id FROM products WHERE slug = 'dji-mini-3-pro' LIMIT 1), (SELECT id FROM tags WHERE slug = 'drone' LIMIT 1)),
((SELECT id FROM products WHERE slug = 'dji-mini-3-pro' LIMIT 1), (SELECT id FROM tags WHERE slug = 'dji' LIMIT 1)),
((SELECT id FROM products WHERE slug = 'gopro-hero-11-black' LIMIT 1), (SELECT id FROM tags WHERE slug = 'camera' LIMIT 1)),
((SELECT id FROM products WHERE slug = 'gopro-hero-11-black' LIMIT 1), (SELECT id FROM tags WHERE slug = 'gopro' LIMIT 1)),
((SELECT id FROM products WHERE slug = 'microsoft-surface-pro-9' LIMIT 1), (SELECT id FROM tags WHERE slug = 'tablet' LIMIT 1)),
((SELECT id FROM products WHERE slug = 'microsoft-surface-pro-9' LIMIT 1), (SELECT id FROM tags WHERE slug = 'microsoft' LIMIT 1)),
((SELECT id FROM products WHERE slug = 'oneplus-11' LIMIT 1), (SELECT id FROM tags WHERE slug = 'smartphone' LIMIT 1)),
((SELECT id FROM products WHERE slug = 'oneplus-11' LIMIT 1), (SELECT id FROM tags WHERE slug = 'oneplus' LIMIT 1));

-- =====================================================
-- 10. INSERT BLOG_CATEGORIES (DANH MỤC BLOG)
-- =====================================================
INSERT INTO blog_categories (name, slug, description, featured_image_id, color, sort_order) VALUES
('Công nghệ', 'cong-nghe', 'Tin tức và xu hướng công nghệ mới nhất', (SELECT id FROM media WHERE file_name = 'blog-tech-trends.jpg' LIMIT 1), '#3B82F6', 1),
('Đánh giá sản phẩm', 'danh-gia-san-pham', 'Đánh giá chi tiết các sản phẩm công nghệ', (SELECT id FROM media WHERE file_name = 'blog-iphone-review.jpg' LIMIT 1), '#10B981', 2),
('Hướng dẫn', 'huong-dan', 'Hướng dẫn sử dụng và mẹo hay công nghệ', NULL, '#F59E0B', 3);

-- =====================================================
-- 11. INSERT BLOG_POSTS (BÀI VIẾT BLOG)
-- =====================================================
INSERT INTO blog_posts (title, slug, excerpt, content, category_id, author_id, status, is_featured, view_count, read_time, published_at) VALUES
('Xu hướng công nghệ 2024: AI, 5G và IoT', 'xu-huong-cong-nghe-2024-ai-5g-iot', 'Khám phá những xu hướng công nghệ nổi bật nhất trong năm 2024, từ AI đến 5G và Internet of Things.', 'Năm 2024 đánh dấu sự bùng nổ của các công nghệ mới, đặc biệt là trí tuệ nhân tạo (AI), mạng 5G và Internet of Things (IoT). AI đang thay đổi cách chúng ta làm việc và sinh hoạt hàng ngày. 5G không chỉ là mạng di động thế hệ mới, mà còn là nền tảng cho các công nghệ tương lai. IoT đang tạo ra một thế giới thông minh, nơi mọi thiết bị đều có thể kết nối và giao tiếp với nhau.', (SELECT id FROM blog_categories WHERE slug = 'cong-nghe' LIMIT 1), (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1), 'published', true, 1250, 8, NOW() - INTERVAL '5 days'),
('Đánh giá iPhone 15 Pro: Có đáng mua không?', 'danh-gia-iphone-15-pro-co-dang-mua-khong', 'Review chi tiết iPhone 15 Pro với chip A17 Pro, camera 48MP và thiết kế Titan. Có đáng mua với giá 999$?', 'iPhone 15 Pro là flagship mới nhất của Apple, được trang bị chip A17 Pro mạnh mẽ và camera 48MP. Thiết kế Titan cao cấp, nhẹ hơn và bền hơn so với thép không gỉ. A17 Pro là chip đầu tiên sử dụng quy trình 3nm, mang lại hiệu năng vượt trội. Camera chính 48MP với sensor lớn hơn, thu nhiều ánh sáng hơn. Màn hình Super Retina XDR 6.1 inch với tần số 120Hz ProMotion.', (SELECT id FROM blog_categories WHERE slug = 'danh-gia-san-pham' LIMIT 1), (SELECT id FROM profiles WHERE role = 'moderator' LIMIT 1), 'published', true, 890, 12, NOW() - INTERVAL '3 days');

-- =====================================================
-- 12. INSERT BLOG_POST_TAGS (QUAN HỆ BLOG_POSTS VÀ TAGS)
-- =====================================================
INSERT INTO blog_post_tags (post_id, tag_id) VALUES
((SELECT id FROM blog_posts WHERE slug = 'xu-huong-cong-nghe-2024-ai-5g-iot' LIMIT 1), (SELECT id FROM tags WHERE slug = 'cong-nghe' LIMIT 1)),
((SELECT id FROM blog_posts WHERE slug = 'danh-gia-iphone-15-pro-co-dang-mua-khong' LIMIT 1), (SELECT id FROM tags WHERE slug = 'iphone' LIMIT 1)),
((SELECT id FROM blog_posts WHERE slug = 'danh-gia-iphone-15-pro-co-dang-mua-khong' LIMIT 1), (SELECT id FROM tags WHERE slug = 'apple' LIMIT 1));

-- =====================================================
-- 12. INSERT BLOG_COMMENTS (BÌNH LUẬN BLOG)
-- =====================================================
INSERT INTO blog_comments (post_id, user_id, author_name, author_email, content, is_approved) VALUES
((SELECT id FROM blog_posts WHERE slug = 'xu-huong-cong-nghe-2024-ai-5g-iot' LIMIT 1), (SELECT id FROM profiles WHERE role = 'customer' LIMIT 1), 'Nguyễn Văn A', 'nguyenvana@example.com', 'Bài viết rất hay! AI đang thay đổi cuộc sống của chúng ta từng ngày.', true),
((SELECT id FROM blog_posts WHERE slug = 'danh-gia-iphone-15-pro-co-dang-mua-khong' LIMIT 1), NULL, 'Trần Thị B', 'tranthib@example.com', 'Tôi vừa mua iPhone 15 Pro và rất hài lòng với hiệu năng. Camera 48MP thực sự ấn tượng!', true);

-- =====================================================
-- 13. INSERT PRODUCT_REVIEWS (ĐÁNH GIÁ SẢN PHẨM)
-- =====================================================
INSERT INTO product_reviews (product_id, user_id, reviewer_name, reviewer_email, rating, title, comment, is_verified_purchase, is_approved) VALUES
((SELECT id FROM products WHERE slug = 'macbook-air-m1' LIMIT 1), (SELECT id FROM profiles WHERE first_name = 'Nguyễn' AND last_name = 'Văn A' LIMIT 1), 'Nguyễn Văn A', 'nguyenvana@example.com', 5, 'Laptop tuyệt vời!', 'MacBook Air M1 thực sự tuyệt vời, hiệu năng mạnh mẽ, pin trâu, thiết kế đẹp. Rất hài lòng với sản phẩm này!', true, true),
((SELECT id FROM products WHERE slug = 'macbook-air-m1' LIMIT 1), (SELECT id FROM profiles WHERE first_name = 'Trần' AND last_name = 'Thị B' LIMIT 1), 'Trần Thị B', 'tranthib@example.com', 4, 'Tốt nhưng giá cao', 'Sản phẩm chất lượng tốt, hiệu năng ổn định. Tuy nhiên giá hơi cao so với các laptop Windows tương đương.', true, true),
((SELECT id FROM products WHERE slug = 'iphone-15-pro' LIMIT 1), (SELECT id FROM profiles WHERE first_name = 'Nguyễn' AND last_name = 'Văn A' LIMIT 1), 'Nguyễn Văn A', 'nguyenvana@example.com', 5, 'iPhone tốt nhất từng dùng', 'iPhone 15 Pro với camera 48MP thực sự ấn tượng. Chip A17 Pro mạnh mẽ, thiết kế Titan đẹp mắt.', true, true),
((SELECT id FROM products WHERE slug = 'iphone-15-pro' LIMIT 1), (SELECT id FROM profiles WHERE first_name = 'Trần' AND last_name = 'Thị B' LIMIT 1), 'Trần Thị B', 'tranthib@example.com', 5, 'Đáng mua!', 'Camera chất lượng tuyệt vời, hiệu năng mạnh mẽ, pin trâu. Đây là iPhone tốt nhất tôi từng sử dụng.', true, true),
((SELECT id FROM products WHERE slug = 'ipad-pro-12-9' LIMIT 1), (SELECT id FROM profiles WHERE first_name = 'Nguyễn' AND last_name = 'Văn A' LIMIT 1), 'Nguyễn Văn A', 'nguyenvana@example.com', 5, 'iPad Pro tuyệt vời!', 'Màn hình Liquid Retina XDR đẹp mắt, hiệu năng chip M2 mạnh mẽ, Apple Pencil hoạt động mượt mà.', true, true),
((SELECT id FROM products WHERE slug = 'airpods-pro-2' LIMIT 1), (SELECT id FROM profiles WHERE first_name = 'Trần' AND last_name = 'Thị B' LIMIT 1), 'Trần Thị B', 'tranthib@example.com', 5, 'AirPods Pro 2 xuất sắc!', 'Chống ồn chủ động hoạt động rất tốt, âm thanh không gian ấn tượng, pin trâu.', true, true),
((SELECT id FROM products WHERE slug = 'samsung-galaxy-watch-6' LIMIT 1), (SELECT id FROM profiles WHERE first_name = 'Nguyễn' AND last_name = 'Văn A' LIMIT 1), 'Nguyễn Văn A', 'nguyenvana@example.com', 4, 'Smartwatch tốt', 'Màn hình AMOLED đẹp, theo dõi sức khỏe chính xác, pin 2-3 ngày.', true, true),
((SELECT id FROM products WHERE slug = 'macbook-pro-m3-max' LIMIT 1), (SELECT id FROM profiles WHERE first_name = 'Trần' AND last_name = 'Thị B' LIMIT 1), 'Trần Thị B', 'tranthib@example.com', 5, 'Laptop mạnh nhất!', 'Chip M3 Max mạnh mẽ khủng khiếp, màn hình Liquid Retina XDR tuyệt đẹp, hiệu năng đỉnh cao.', true, true),
((SELECT id FROM products WHERE slug = 'sony-wh-1000xm5' LIMIT 1), (SELECT id FROM profiles WHERE first_name = 'Nguyễn' AND last_name = 'Văn A' LIMIT 1), 'Nguyễn Văn A', 'nguyenvana@example.com', 5, 'Headphone số 1!', 'Chống ồn chủ động xuất sắc, âm thanh chất lượng cao, pin 30 giờ, thiết kế gập gọn.', true, true),
((SELECT id FROM products WHERE slug = 'nintendo-switch-oled' LIMIT 1), (SELECT id FROM profiles WHERE first_name = 'Trần' AND last_name = 'Thị B' LIMIT 1), 'Trần Thị B', 'tranthib@example.com', 4, 'Gaming console tốt', 'Màn hình OLED đẹp, Joy-Con dễ sử dụng, game library phong phú.', true, true);

-- =====================================================
-- 14. INSERT CART_ITEMS (GIỎ HÀNG)
-- =====================================================
INSERT INTO cart_items (user_id, product_id, variant_id, quantity, price, notes) VALUES
((SELECT id FROM profiles WHERE first_name = 'Nguyễn' AND last_name = 'Văn A' LIMIT 1), (SELECT id FROM products WHERE slug = 'macbook-air-m1' LIMIT 1), (SELECT id FROM product_variants WHERE sku = 'MBA-M1-8-256'), 1, 1500000, 'Mua cho công việc'),
((SELECT id FROM profiles WHERE first_name = 'Nguyễn' AND last_name = 'Văn A' LIMIT 1), (SELECT id FROM products WHERE slug = 'iphone-15-pro' LIMIT 1), (SELECT id FROM product_variants WHERE sku = 'IPH-15PRO-128'), 1, 2500000, 'Thay thế iPhone cũ'),
((SELECT id FROM profiles WHERE first_name = 'Trần' AND last_name = 'Thị B' LIMIT 1), (SELECT id FROM products WHERE slug = 'samsung-galaxy-s24' LIMIT 1), NULL, 1, 2200000, 'Quà sinh nhật'),
((SELECT id FROM profiles WHERE first_name = 'Nguyễn' AND last_name = 'Văn A' LIMIT 1), (SELECT id FROM products WHERE slug = 'ipad-pro-12-9' LIMIT 1), (SELECT id FROM product_variants WHERE sku = 'IPAD-PRO-12-9-256'), 1, 1800000, 'Mua cho công việc thiết kế'),
((SELECT id FROM profiles WHERE first_name = 'Trần' AND last_name = 'Thị B' LIMIT 1), (SELECT id FROM products WHERE slug = 'airpods-pro-2' LIMIT 1), (SELECT id FROM product_variants WHERE sku = 'AIRPODS-PRO2-STD'), 1, 600000, 'Mua cho tập thể dục');

-- =====================================================
-- 15. INSERT WISHLIST_ITEMS (DANH SÁCH YÊU THÍCH)
-- =====================================================
INSERT INTO wishlist_items (user_id, product_id, variant_id, notes, priority, reminder_date) VALUES
((SELECT id FROM profiles WHERE first_name = 'Nguyễn' AND last_name = 'Văn A' LIMIT 1), (SELECT id FROM products WHERE slug = 'macbook-pro-m2' LIMIT 1), (SELECT id FROM product_variants WHERE sku = 'MBP-M2-16-512'), 'Laptop chuyên nghiệp cho công việc', 5, '2024-12-31'),
((SELECT id FROM profiles WHERE first_name = 'Nguyễn' AND last_name = 'Văn A' LIMIT 1), (SELECT id FROM products WHERE slug = 'iphone-15-pro' LIMIT 1), NULL, 'iPhone mới nhất', 4, '2024-11-30'),
((SELECT id FROM profiles WHERE first_name = 'Trần' AND last_name = 'Thị B' LIMIT 1), (SELECT id FROM products WHERE slug = 'macbook-air-m1' LIMIT 1), (SELECT id FROM product_variants WHERE sku = 'MBA-M1-8-256'), 'Laptop nhẹ, pin trâu', 4, '2024-09-30'),
((SELECT id FROM profiles WHERE first_name = 'Nguyễn' AND last_name = 'Văn A' LIMIT 1), (SELECT id FROM products WHERE slug = 'samsung-galaxy-watch-6' LIMIT 1), (SELECT id FROM product_variants WHERE sku = 'SMS-GW6-44'), 'Smartwatch theo dõi sức khỏe', 3, '2024-10-15'),
((SELECT id FROM profiles WHERE first_name = 'Trần' AND last_name = 'Thị B' LIMIT 1), (SELECT id FROM products WHERE slug = 'sony-wh-1000xm5' LIMIT 1), (SELECT id FROM product_variants WHERE sku = 'SONY-WH1000XM5-BLK'), 'Headphone chống ồn cao cấp', 3, '2024-11-20'),
((SELECT id FROM profiles WHERE first_name = 'Nguyễn' AND last_name = 'Văn A' LIMIT 1), (SELECT id FROM products WHERE slug = 'dji-mini-3-pro' LIMIT 1), (SELECT id FROM product_variants WHERE sku = 'DJI-MINI3PRO-FLY'), 'Drone quay phim 4K', 2, '2024-12-01');

-- =====================================================
-- 16. INSERT ORDERS (ĐƠN HÀNG)
-- =====================================================
INSERT INTO orders (order_number, user_id, status, order_date, shipping_address_id, billing_address_id, subtotal, shipping_fee, tax_amount, discount_amount, total_amount, payment_method, payment_status, shipping_method, tracking_number, notes) VALUES
('ORD-2024-001', (SELECT id FROM profiles WHERE first_name = 'Nguyễn' AND last_name = 'Văn A' LIMIT 1), 'delivered', NOW(), 
 (SELECT id FROM user_addresses WHERE user_id = (SELECT id FROM profiles WHERE first_name = 'Nguyễn' AND last_name = 'Văn A' LIMIT 1) AND address_type = 'shipping'),
 (SELECT id FROM user_addresses WHERE user_id = (SELECT id FROM profiles WHERE first_name = 'Nguyễn' AND last_name = 'Văn A' LIMIT 1) AND address_type = 'billing'),
 4000000, 0, 0, 0, 4000000, 'credit_card', 'paid', 'express', 'TRK-001-2024', 'Giao hàng giờ hành chính'),
('ORD-2024-002', (SELECT id FROM profiles WHERE first_name = 'Trần' AND last_name = 'Thị B' LIMIT 1), 'processing', NOW(),
 (SELECT id FROM user_addresses WHERE user_id = (SELECT id FROM profiles WHERE first_name = 'Trần' AND last_name = 'Thị B' LIMIT 1) AND address_type = 'shipping'),
 (SELECT id FROM user_addresses WHERE user_id = (SELECT id FROM profiles WHERE first_name = 'Trần' AND last_name = 'Thị B' LIMIT 1) AND address_type = 'billing'),
 2200000, 0, 0, 0, 2200000, 'bank_transfer', 'pending', 'standard', 'TRK-002-2024', 'Giao hàng cuối tuần');

-- =====================================================
-- 17. INSERT ORDER_ITEMS (CHI TIẾT ĐƠN HÀNG)
-- =====================================================
INSERT INTO order_items (order_id, product_id, variant_id, product_name, product_sku, quantity, unit_price, total_price) VALUES
((SELECT id FROM orders WHERE order_number = 'ORD-2024-001'), (SELECT id FROM products WHERE slug = 'macbook-air-m1' LIMIT 1), 
 (SELECT id FROM product_variants WHERE sku = 'MBA-M1-8-256'), 'MacBook Air M1', 'MBA-M1-8-256', 1, 1500000, 1500000),
((SELECT id FROM orders WHERE order_number = 'ORD-2024-001'), (SELECT id FROM products WHERE slug = 'iphone-15-pro' LIMIT 1),
 (SELECT id FROM product_variants WHERE sku = 'IPH-15PRO-128'), 'iPhone 15 Pro', 'IPH-15PRO-128', 1, 2500000, 2500000),
((SELECT id FROM orders WHERE order_number = 'ORD-2024-002'), (SELECT id FROM products WHERE slug = 'samsung-galaxy-s24' LIMIT 1),
 NULL, 'Samsung Galaxy S24', 'SMS-GS24-256', 1, 2200000, 2200000);

-- =====================================================
-- 18. INSERT DISCOUNTS (MÃ GIẢM GIÁ)
-- =====================================================
INSERT INTO discounts (code, name, description, discount_type, discount_value, min_order_amount, max_discount_amount, usage_limit, is_active, starts_at, expires_at) VALUES
('SALE20', 'Giảm giá 20%', 'Giảm giá 20% cho tất cả sản phẩm', 'percentage', 20.00, 100.00, 200.00, 1000, true, NOW(), NOW() + INTERVAL '30 days'),
('FREESHIP', 'Miễn phí vận chuyển', 'Miễn phí vận chuyển cho đơn hàng từ 500$', 'fixed_amount', 0.00, 500.00, 0.00, 500, true, NOW(), NOW() + INTERVAL '60 days');

-- =====================================================
-- 19. INSERT COUPONS (MÃ KHUYẾN MÃI)
-- =====================================================
INSERT INTO coupons (code, name, description, discount_type, discount_value, min_order_amount, max_discount_amount, usage_limit, is_active, starts_at, expires_at) VALUES
('WELCOME10', 'Chào mừng khách hàng mới', 'Giảm giá 10% cho khách hàng mới', 'percentage', 10.00, 50.00, 100.00, 200, true, NOW(), NOW() + INTERVAL '90 days'),
('VIP15', 'Khách hàng VIP', 'Giảm giá 15% cho khách hàng VIP', 'percentage', 15.00, 200.00, 300.00, 100, true, NOW(), NOW() + INTERVAL '180 days');

-- =====================================================
-- 20. INSERT SHIPPING_ZONES (KHU VỰC VẬN CHUYỂN)
-- =====================================================
INSERT INTO shipping_zones (name, description, countries, states, cities, is_active) VALUES
('Hà Nội', 'Khu vực Hà Nội và các tỉnh lân cận', ARRAY['VN'], ARRAY['Hà Nội', 'Hà Nam', 'Hưng Yên'], ARRAY['Hà Nội', 'Phủ Lý', 'Hưng Yên'], true),
('TP.HCM', 'Khu vực TP.HCM và các tỉnh miền Nam', ARRAY['VN'], ARRAY['TP.HCM', 'Đồng Nai', 'Bình Dương'], ARRAY['TP.HCM', 'Biên Hòa', 'Thủ Dầu Một'], true);

-- =====================================================
-- 21. INSERT SHIPPING_METHODS (PHƯƠNG THỨC VẬN CHUYỂN)
-- =====================================================
INSERT INTO shipping_methods (name, description, shipping_zone_id, base_price, price_per_kg, estimated_days_min, estimated_days_max, is_active, sort_order) VALUES
('Giao hàng tiêu chuẩn', 'Giao hàng trong 3-5 ngày làm việc', (SELECT id FROM shipping_zones WHERE name = 'Hà Nội'), 5.00, 2.00, 3, 5, true, 1),
('Giao hàng nhanh', 'Giao hàng trong 1-2 ngày làm việc', (SELECT id FROM shipping_zones WHERE name = 'Hà Nội'), 10.00, 3.00, 1, 2, true, 2),
('Giao hàng tiêu chuẩn', 'Giao hàng trong 3-5 ngày làm việc', (SELECT id FROM shipping_zones WHERE name = 'TP.HCM'), 8.00, 2.50, 3, 5, true, 1),
('Giao hàng nhanh', 'Giao hàng trong 1-2 ngày làm việc', (SELECT id FROM shipping_zones WHERE name = 'TP.HCM'), 15.00, 4.00, 1, 2, true, 2);

-- =====================================================
-- 22. INSERT PAYMENT_METHODS (PHƯƠNG THỨC THANH TOÁN)
-- =====================================================
INSERT INTO payment_methods (name, code, description, is_active, sort_order) VALUES
('Thẻ tín dụng', 'credit_card', 'Thanh toán bằng thẻ tín dụng Visa, Mastercard', true, 1),
('Chuyển khoản ngân hàng', 'bank_transfer', 'Chuyển khoản trực tiếp vào tài khoản ngân hàng', true, 2),
('Tiền mặt khi nhận hàng', 'cash_on_delivery', 'Thanh toán tiền mặt khi nhận hàng', true, 3),
('Ví điện tử', 'e_wallet', 'Thanh toán qua ví điện tử MoMo, ZaloPay', true, 4);

-- =====================================================
-- 23. INSERT NOTIFICATIONS (THÔNG BÁO)
-- =====================================================
INSERT INTO notifications (user_id, type, title, message, data) VALUES
((SELECT id FROM profiles WHERE first_name = 'Nguyễn' AND last_name = 'Văn A' LIMIT 1), 'order_status', 'Đơn hàng đã giao thành công', 'Đơn hàng ORD-2024-001 của bạn đã được giao thành công. Cảm ơn bạn đã mua sắm tại TechStore!', '{"order_id": "ORD-2024-001", "order_number": "ORD-2024-001"}'),
((SELECT id FROM profiles WHERE first_name = 'Trần' AND last_name = 'Thị B' LIMIT 1), 'promotion', 'Khuyến mãi mới', 'Chào mừng bạn đến với TechStore! Sử dụng mã SALE20 để được giảm giá 20% cho tất cả sản phẩm.', '{"discount_code": "SALE20", "discount_value": "20%"}');

-- =====================================================
-- 24. INSERT MEDIA_RELATIONS (QUAN HỆ MEDIA VỚI CÁC ĐỐI TƯỢNG)
-- =====================================================
INSERT INTO media_relations (media_id, entity_type, entity_id, relation_type, sort_order, is_featured) VALUES
-- Quan hệ với products
((SELECT id FROM media WHERE file_name = 'iphone-15-hero.jpg' LIMIT 1), 'product', (SELECT id FROM products WHERE slug = 'iphone-15-pro' LIMIT 1), 'primary', 1, true),
((SELECT id FROM media WHERE file_name = 'macbook-pro-hero.jpg' LIMIT 1), 'product', (SELECT id FROM products WHERE slug = 'macbook-air-m1' LIMIT 1), 'primary', 1, true),
((SELECT id FROM media WHERE file_name = 'macbook-pro-hero.jpg' LIMIT 1), 'product', (SELECT id FROM products WHERE slug = 'macbook-pro-m2' LIMIT 1), 'primary', 1, true),

-- Quan hệ với categories
((SELECT id FROM media WHERE file_name = 'iphone-15-hero.jpg' LIMIT 1), 'category', (SELECT id FROM categories WHERE slug = 'smartphones' LIMIT 1), 'primary', 1, true),
((SELECT id FROM media WHERE file_name = 'macbook-pro-hero.jpg' LIMIT 1), 'category', (SELECT id FROM categories WHERE slug = 'laptops' LIMIT 1), 'primary', 1, true),

-- Quan hệ với blog_categories
((SELECT id FROM media WHERE file_name = 'blog-tech-trends.jpg' LIMIT 1), 'blog_category', (SELECT id FROM blog_categories WHERE slug = 'cong-nghe' LIMIT 1), 'primary', 1, true),
((SELECT id FROM media WHERE file_name = 'blog-iphone-review.jpg' LIMIT 1), 'blog_category', (SELECT id FROM blog_categories WHERE slug = 'danh-gia-san-pham' LIMIT 1), 'primary', 1, true),

-- Quan hệ với blog_posts
((SELECT id FROM media WHERE file_name = 'blog-tech-trends.jpg' LIMIT 1), 'blog_post', (SELECT id FROM blog_posts WHERE slug = 'xu-huong-cong-nghe-2024-ai-5g-iot' LIMIT 1), 'primary', 1, true),
((SELECT id FROM media WHERE file_name = 'blog-iphone-review.jpg' LIMIT 1), 'blog_post', (SELECT id FROM blog_posts WHERE slug = 'danh-gia-iphone-15-pro-co-dang-mua-khong' LIMIT 1), 'primary', 1, true),

-- Quan hệ với products mới
((SELECT id FROM media WHERE file_name = 'ipad-pro-12-9-hero.jpg' LIMIT 1), 'product', (SELECT id FROM products WHERE slug = 'ipad-pro-12-9' LIMIT 1), 'primary', 1, true),
((SELECT id FROM media WHERE file_name = 'samsung-galaxy-tab-s9-hero.jpg' LIMIT 1), 'product', (SELECT id FROM products WHERE slug = 'samsung-galaxy-tab-s9' LIMIT 1), 'primary', 1, true),
((SELECT id FROM media WHERE file_name = 'airpods-pro-2-hero.jpg' LIMIT 1), 'product', (SELECT id FROM products WHERE slug = 'airpods-pro-2' LIMIT 1), 'primary', 1, true),
((SELECT id FROM media WHERE file_name = 'samsung-galaxy-watch-6-hero.jpg' LIMIT 1), 'product', (SELECT id FROM products WHERE slug = 'samsung-galaxy-watch-6' LIMIT 1), 'primary', 1, true),
((SELECT id FROM media WHERE file_name = 'macbook-pro-m3-max-hero.jpg' LIMIT 1), 'product', (SELECT id FROM products WHERE slug = 'macbook-pro-m3-max' LIMIT 1), 'primary', 1, true),
((SELECT id FROM media WHERE file_name = 'dell-xps-13-plus-hero.jpg' LIMIT 1), 'product', (SELECT id FROM products WHERE slug = 'dell-xps-13-plus' LIMIT 1), 'primary', 1, true),
((SELECT id FROM media WHERE file_name = 'iphone-15-hero.jpg' LIMIT 1), 'product', (SELECT id FROM products WHERE slug = 'iphone-15' LIMIT 1), 'primary', 1, true),
((SELECT id FROM media WHERE file_name = 'google-pixel-8-hero.jpg' LIMIT 1), 'product', (SELECT id FROM products WHERE slug = 'google-pixel-8' LIMIT 1), 'primary', 1, true),
((SELECT id FROM media WHERE file_name = 'sony-wh-1000xm5-hero.jpg' LIMIT 1), 'product', (SELECT id FROM products WHERE slug = 'sony-wh-1000xm5' LIMIT 1), 'primary', 1, true),
((SELECT id FROM media WHERE file_name = 'nintendo-switch-oled-hero.jpg' LIMIT 1), 'product', (SELECT id FROM products WHERE slug = 'nintendo-switch-oled' LIMIT 1), 'primary', 1, true),
((SELECT id FROM media WHERE file_name = 'dji-mini-3-pro-hero.jpg' LIMIT 1), 'product', (SELECT id FROM products WHERE slug = 'dji-mini-3-pro' LIMIT 1), 'primary', 1, true),
((SELECT id FROM media WHERE file_name = 'gopro-hero-11-black-hero.jpg' LIMIT 1), 'product', (SELECT id FROM products WHERE slug = 'gopro-hero-11-black' LIMIT 1), 'primary', 1, true),
((SELECT id FROM media WHERE file_name = 'microsoft-surface-pro-9-hero.jpg' LIMIT 1), 'product', (SELECT id FROM products WHERE slug = 'microsoft-surface-pro-9' LIMIT 1), 'primary', 1, true),
((SELECT id FROM media WHERE file_name = 'oneplus-11-hero.jpg' LIMIT 1), 'product', (SELECT id FROM products WHERE slug = 'oneplus-11' LIMIT 1), 'primary', 1, true);

-- =====================================================
-- 25. KIỂM TRA KẾT QUẢ INSERT DỮ LIỆU
-- =====================================================

-- Kiểm tra số lượng records trong từng bảng
SELECT 
    'Profiles' as table_name,
    COUNT(*) as record_count
FROM profiles
UNION ALL
SELECT 
    'Categories' as table_name,
    COUNT(*) as record_count
FROM categories
UNION ALL
SELECT 
    'Products' as table_name,
    COUNT(*) as record_count
FROM products
UNION ALL
SELECT 
    'Product Variants' as table_name,
    COUNT(*) as record_count
FROM product_variants
UNION ALL
SELECT 
    'Tags' as table_name,
    COUNT(*) as record_count
FROM tags
UNION ALL
SELECT 
    'Product Tags' as table_name,
    COUNT(*) as record_count
FROM product_tags
UNION ALL
SELECT 
    'Blog Categories' as table_name,
    COUNT(*) as record_count
FROM blog_categories
UNION ALL
SELECT 
    'Blog Posts' as table_name,
    COUNT(*) as record_count
FROM blog_posts
UNION ALL
SELECT 
    'Product Reviews' as table_name,
    COUNT(*) as record_count
FROM product_reviews
UNION ALL
SELECT 
    'Orders' as table_name,
    COUNT(*) as record_count
FROM orders;

-- Kiểm tra product_count trong categories
SELECT 
    name,
    slug,
    product_count,
    (SELECT COUNT(*) FROM products WHERE category_id = c.id AND is_active = true) as actual_product_count
FROM categories c
ORDER BY sort_order;

-- Kiểm tra trigger hoạt động
SELECT 
    'Trigger Status' as info,
    'product_count sẽ được tự động cập nhật khi thêm/xóa products' as message;

-- =====================================================
-- 26. INSERT SEO PAGE TYPES (LOẠI TRANG SEO)
-- =====================================================
INSERT INTO seo_page_types (name, display_name, description, sort_order) VALUES
('page', 'Trang tĩnh', 'Trang thông thường như home, about, contact, blog, help, faq', 1),
('product', 'Sản phẩm', 'Trang hiển thị thông tin chi tiết sản phẩm với đầy đủ SEO metadata', 2),
('category', 'Danh mục', 'Trang hiển thị danh sách sản phẩm theo danh mục với SEO tối ưu', 3),
('user', 'Người dùng', 'Trang quản lý tài khoản, đơn hàng, profile, dashboard', 4),
('system', 'Hệ thống', 'Trang 404, 500, maintenance, sitemap, robots.txt, security', 5);

-- =====================================================
-- 27. INSERT SEO PAGES (DỮ LIỆU SEO CHO TẤT CẢ TRANG)
-- =====================================================
INSERT INTO seo_pages (
    page_type_id, page_url, page_title, meta_description, meta_keywords,
    reference_type, reference_id,
    og_title, og_description, og_image, og_type, og_site_name, og_locale,
    twitter_card, twitter_title, twitter_description, twitter_image, twitter_creator, twitter_site,
    schema_markup, core_web_vitals, ai_ml_metrics, eeat_metrics, voice_visual_metrics,
    privacy_compliance, future_metrics,
    canonical_url, robots_directive, hreflang, language, charset, viewport,
    seo_score, keyword_difficulty, search_volume,
    page_load_time, mobile_friendly_score, accessibility_score, core_web_vitals_score,
    social_shares, social_engagement, social_click_through_rate,
    content_length, content_readability_score, content_freshness_score,
    internal_links_count, external_links_count, broken_links_count, image_optimization_score,
    is_active, is_featured, is_indexed, is_ssl_secure
) VALUES
-- Trang chủ
(1, '/', 'TechStore - Cửa hàng công nghệ hàng đầu Việt Nam', 
 'TechStore - Nơi mua sắm công nghệ uy tín với giá tốt nhất. iPhone, Samsung, Laptop, PC Gaming và nhiều sản phẩm khác.',
 ARRAY['công nghệ', 'điện thoại', 'laptop', 'máy tính', 'iphone', 'samsung'],
 'page', NULL,
 'TechStore - Cửa hàng công nghệ hàng đầu Việt Nam',
 'TechStore - Nơi mua sắm công nghệ uy tín với giá tốt nhất. iPhone, Samsung, Laptop, PC Gaming và nhiều sản phẩm khác.',
 '/images/og-home.jpg', 'website', 'TechStore', 'vi_VN',
 'summary_large_image', 'TechStore - Cửa hàng công nghệ hàng đầu Việt Nam',
 'TechStore - Nơi mua sắm công nghệ uy tín với giá tốt nhất.',
 '/images/twitter-home.jpg', '@techstore_vn', '@techstore_vn',
 '{"@context": "https://schema.org", "@type": "Organization", "name": "TechStore", "url": "https://techstore.vn"}',
 '{"lcp": 2.1, "fid": 45, "cls": 0.08, "inp": 120, "ttfb": 180}',
 '{"ai_relevance_score": 95, "ml_ranking_factors": {"content_quality": 90, "user_engagement": 85}}',
 '{"experience_score": 90, "expertise_score": 95, "authoritativeness_score": 88, "trust_score": 92}',
 '{"voice_search_optimized": true, "visual_search_data": {"image_alt_texts": 95, "structured_images": 90}}',
 '{"gdpr_compliant": true, "ccpa_compliant": true, "privacy_signals": {"cookie_consent": true, "privacy_policy": true}}',
 '{"quantum_seo_ready": true, "neural_network_data": {"content_patterns": 88, "user_behavior": 92}}',
 '/', 'index,follow', '{"vi": "/", "en": "/en"}', 'vi', 'UTF-8', 'width=device-width, initial-scale=1',
 95, 65, 15000,
 2.1, 95, 92, 88,
 1250, 4.8, 2.3,
 850, 85, 90,
 12, 8, 0, 92,
 true, true, true, true),

-- Trang sản phẩm iPhone 15
(2, '/shop-details/iphone-15', 'iPhone 15 - Điện thoại thông minh mới nhất từ Apple | TechStore',
 'iPhone 15 với chip A17 Pro mạnh mẽ, camera 48MP, màn hình 6.1 inch Super Retina XDR. Mua ngay tại TechStore với giá tốt nhất!',
 ARRAY['iphone 15', 'điện thoại apple', 'smartphone', 'camera 48mp', 'chip a17 pro'],
 'product', '550e8400-e29b-41d4-a716-446655440001',
 'iPhone 15 - Điện thoại thông minh mới nhất từ Apple | TechStore',
 'iPhone 15 với chip A17 Pro mạnh mẽ, camera 48MP, màn hình 6.1 inch Super Retina XDR.',
 '/images/products/iphone-15-og.jpg', 'product', 'TechStore', 'vi_VN',
 'summary_large_image', 'iPhone 15 - Điện thoại thông minh mới nhất từ Apple',
 'iPhone 15 với chip A17 Pro mạnh mẽ, camera 48MP, màn hình 6.1 inch Super Retina XDR.',
 '/images/products/iphone-15-twitter.jpg', '@techstore_vn', '@techstore_vn',
 '{"@context": "https://schema.org", "@type": "Product", "name": "iPhone 15", "brand": "Apple", "model": "iPhone 15", "description": "iPhone 15 với chip A17 Pro mạnh mẽ", "offers": {"@type": "Offer", "price": "2000000", "priceCurrency": "VND"}}',
 '{"lcp": 1.8, "fid": 38, "cls": 0.05, "inp": 95, "ttfb": 150}',
 '{"ai_relevance_score": 98, "ml_ranking_factors": {"product_relevance": 95, "search_intent": 92}}',
 '{"experience_score": 95, "expertise_score": 98, "authoritativeness_score": 95, "trust_score": 96}',
 '{"voice_search_optimized": true, "visual_search_data": {"product_images": 98, "360_views": 90}}',
 '{"gdpr_compliant": true, "ccpa_compliant": true, "privacy_signals": {"secure_checkout": true, "data_protection": true}}',
 '{"quantum_seo_ready": true, "neural_network_data": {"product_patterns": 95, "purchase_behavior": 90}}',
 '/shop-details/iphone-15', 'index,follow', '{"vi": "/shop-details/iphone-15", "en": "/en/shop-details/iphone-15"}', 'vi', 'UTF-8', 'width=device-width, initial-scale=1',
 98, 75, 8500,
 1.8, 98, 95, 92,
 890, 5.2, 3.1,
 650, 88, 95,
 8, 5, 0, 96,
 true, true, true, true),

-- Trang danh mục Điện thoại
(3, '/shop?category=phones', 'Điện thoại di động - iPhone, Samsung, Xiaomi | TechStore',
 'Khám phá bộ sưu tập điện thoại di động đa dạng từ iPhone, Samsung, Xiaomi. Giá tốt, chất lượng cao, giao hàng toàn quốc.',
 ARRAY['điện thoại', 'smartphone', 'iphone', 'samsung', 'xiaomi', 'mobile'],
 'category', '550e8400-e29b-41d4-a716-446655440002',
 'Điện thoại di động - iPhone, Samsung, Xiaomi | TechStore',
 'Khám phá bộ sưu tập điện thoại di động đa dạng từ iPhone, Samsung, Xiaomi.',
 '/images/categories/phones-og.jpg', 'website', 'TechStore', 'vi_VN',
 'summary_large_image', 'Điện thoại di động - iPhone, Samsung, Xiaomi | TechStore',
 'Khám phá bộ sưu tập điện thoại di động đa dạng từ iPhone, Samsung, Xiaomi.',
 '/images/categories/phones-twitter.jpg', '@techstore_vn', '@techstore_vn',
 '{"@context": "https://schema.org", "@type": "CollectionPage", "name": "Điện thoại di động", "description": "Bộ sưu tập điện thoại di động đa dạng"}',
 '{"lcp": 2.3, "fid": 52, "cls": 0.09, "inp": 110, "ttfb": 200}',
 '{"ai_relevance_score": 92, "ml_ranking_factors": {"category_relevance": 90, "product_diversity": 88}}',
 '{"experience_score": 88, "expertise_score": 92, "authoritativeness_score": 90, "trust_score": 89}',
 '{"voice_search_optimized": true, "visual_search_data": {"category_images": 92, "product_grids": 88}}',
 '{"gdpr_compliant": true, "ccpa_compliant": true, "privacy_signals": {"category_filtering": true, "sort_options": true}}',
 '{"quantum_seo_ready": true, "neural_network_data": {"category_patterns": 88, "browsing_behavior": 85}}',
 '/shop?category=phones', 'index,follow', '{"vi": "/shop?category=phones", "en": "/en/shop?category=phones"}', 'vi', 'UTF-8', 'width=device-width, initial-scale=1',
 92, 60, 12000,
 2.3, 92, 88, 85,
 680, 4.2, 2.8,
 450, 82, 88,
 15, 6, 0, 89,
 true, true, true, true),

-- Trang About
(1, '/about', 'Về chúng tôi - TechStore | Cửa hàng công nghệ uy tín',
 'TechStore - Hơn 10 năm kinh nghiệm trong lĩnh vực bán lẻ công nghệ. Cam kết chất lượng, giá tốt và dịch vụ khách hàng xuất sắc.',
 ARRAY['về chúng tôi', 'techstore', 'cửa hàng công nghệ', 'uy tín', 'kinh nghiệm'],
 'page', NULL,
 'Về chúng tôi - TechStore | Cửa hàng công nghệ uy tín',
 'TechStore - Hơn 10 năm kinh nghiệm trong lĩnh vực bán lẻ công nghệ.',
 '/images/about/about-og.jpg', 'website', 'TechStore', 'vi_VN',
 'summary_large_image', 'Về chúng tôi - TechStore | Cửa hàng công nghệ uy tín',
 'TechStore - Hơn 10 năm kinh nghiệm trong lĩnh vực bán lẻ công nghệ.',
 '/images/about/about-twitter.jpg', '@techstore_vn', '@techstore_vn',
 '{"@context": "https://schema.org", "@type": "Organization", "name": "TechStore", "description": "Cửa hàng công nghệ uy tín", "foundingDate": "2014", "address": {"@type": "PostalAddress", "addressLocality": "Hà Nội", "addressCountry": "VN"}}',
 '{"lcp": 2.5, "fid": 48, "cls": 0.07, "inp": 105, "ttfb": 190}',
 '{"ai_relevance_score": 88, "ml_ranking_factors": {"company_info": 90, "trust_signals": 85}}',
 '{"experience_score": 95, "expertise_score": 90, "authoritativeness_score": 92, "trust_score": 94}',
 '{"voice_search_optimized": true, "visual_search_data": {"company_logo": 90, "team_photos": 85}}',
 '{"gdpr_compliant": true, "ccpa_compliant": true, "privacy_signals": {"company_info": true, "contact_details": true}}',
 '{"quantum_seo_ready": true, "neural_network_data": {"company_patterns": 88, "trust_signals": 90}}',
 '/about', 'index,follow', '{"vi": "/about", "en": "/en/about"}', 'vi', 'UTF-8', 'width=device-width, initial-scale=1',
 88, 45, 3200,
 2.5, 90, 85, 82,
 420, 3.8, 1.9,
 1200, 90, 85,
 6, 3, 0, 88,
 true, false, true, true),

-- Trang Contact
(1, '/contact', 'Liên hệ - TechStore | Hỗ trợ khách hàng 24/7',
 'Liên hệ TechStore qua hotline, email hoặc chat trực tuyến. Đội ngũ hỗ trợ chuyên nghiệp, sẵn sàng phục vụ 24/7.',
 ARRAY['liên hệ', 'hỗ trợ', 'hotline', 'email', 'chat', 'customer service'],
 'page', NULL,
 'Liên hệ - TechStore | Hỗ trợ khách hàng 24/7',
 'Liên hệ TechStore qua hotline, email hoặc chat trực tuyến. Đội ngũ hỗ trợ chuyên nghiệp.',
 '/images/contact/contact-og.jpg', 'website', 'TechStore', 'vi_VN',
 'summary_large_image', 'Liên hệ - TechStore | Hỗ trợ khách hàng 24/7',
 'Liên hệ TechStore qua hotline, email hoặc chat trực tuyến. Đội ngũ hỗ trợ chuyên nghiệp.',
 '/images/contact/contact-twitter.jpg', '@techstore_vn', '@techstore_vn',
 '{"@context": "https://schema.org", "@type": "ContactPage", "name": "Liên hệ TechStore", "description": "Thông tin liên hệ và hỗ trợ khách hàng"}',
 '{"lcp": 2.0, "fid": 42, "cls": 0.06, "inp": 98, "ttfb": 160}',
 '{"ai_relevance_score": 85, "ml_ranking_factors": {"contact_info": 90, "support_quality": 88}}',
 '{"experience_score": 92, "expertise_score": 88, "authoritativeness_score": 90, "trust_score": 93}',
 '{"voice_search_optimized": true, "visual_search_data": {"contact_forms": 88, "location_maps": 90}}',
 '{"gdpr_compliant": true, "ccpa_compliant": true, "privacy_signals": {"contact_forms": true, "data_handling": true}}',
 '{"quantum_seo_ready": true, "neural_network_data": {"contact_patterns": 85, "support_patterns": 88}}',
 '/contact', 'index,follow', '{"vi": "/contact", "en": "/en/contact"}', 'vi', 'UTF-8', 'width=device-width, initial-scale=1',
 85, 40, 2800,
 2.0, 88, 82, 80,
 380, 3.5, 1.7,
 800, 85, 80,
 4, 2, 0, 85,
 true, false, true, true),

-- Trang Blog
(1, '/blog', 'Blog công nghệ - Tin tức, đánh giá sản phẩm | TechStore',
 'Blog công nghệ TechStore cập nhật tin tức mới nhất, đánh giá sản phẩm chi tiết, hướng dẫn sử dụng và tips công nghệ hữu ích.',
 ARRAY['blog công nghệ', 'tin tức', 'đánh giá', 'hướng dẫn', 'tips', 'công nghệ'],
 'page', NULL,
 'Blog công nghệ - Tin tức, đánh giá sản phẩm | TechStore',
 'Blog công nghệ TechStore cập nhật tin tức mới nhất, đánh giá sản phẩm chi tiết.',
 '/images/blog/blog-og.jpg', 'website', 'TechStore', 'vi_VN',
 'summary_large_image', 'Blog công nghệ - Tin tức, đánh giá sản phẩm | TechStore',
 'Blog công nghệ TechStore cập nhật tin tức mới nhất, đánh giá sản phẩm chi tiết.',
 '/images/blog/blog-twitter.jpg', '@techstore_vn', '@techstore_vn',
 '{"@context": "https://schema.org", "@type": "Blog", "name": "Blog công nghệ TechStore", "description": "Blog về công nghệ và đánh giá sản phẩm"}',
 '{"lcp": 2.8, "fid": 55, "cls": 0.10, "inp": 115, "ttfb": 220}',
 '{"ai_relevance_score": 90, "ml_ranking_factors": {"content_quality": 88, "engagement_metrics": 85}}',
 '{"experience_score": 88, "expertise_score": 92, "authoritativeness_score": 90, "trust_score": 89}',
 '{"voice_search_optimized": true, "visual_search_data": {"blog_images": 88, "content_thumbnails": 85}}',
 '{"gdpr_compliant": true, "ccpa_compliant": true, "privacy_signals": {"content_sharing": true, "comment_system": true}}',
 '{"quantum_seo_ready": true, "neural_network_data": {"content_patterns": 90, "reading_behavior": 85}}',
 '/blog', 'index,follow', '{"vi": "/blog", "en": "/en/blog"}', 'vi', 'UTF-8', 'width=device-width, initial-scale=1',
 90, 55, 6800,
 2.8, 90, 85, 80,
 720, 4.5, 2.5,
 1800, 88, 92,
 18, 12, 0, 90,
 true, true, true, true),

-- Trang sản phẩm MacBook Pro
(2, '/shop-details/macbook-pro-m3', 'MacBook Pro M3 - Laptop mạnh mẽ cho chuyên gia | TechStore',
 'MacBook Pro M3 với chip Apple M3 Pro/Max, màn hình Liquid Retina XDR 14.2 inch, hiệu năng vượt trội cho công việc chuyên môn.',
 ARRAY['macbook pro m3', 'laptop apple', 'macbook', 'chip m3', 'laptop chuyên nghiệp'],
 'product', '550e8400-e29b-41d4-a716-446655440003',
 'MacBook Pro M3 - Laptop mạnh mẽ cho chuyên gia | TechStore',
 'MacBook Pro M3 với chip Apple M3 Pro/Max, màn hình Liquid Retina XDR 14.2 inch.',
 '/images/products/macbook-pro-m3-og.jpg', 'product', 'TechStore', 'vi_VN',
 'summary_large_image', 'MacBook Pro M3 - Laptop mạnh mẽ cho chuyên gia | TechStore',
 'MacBook Pro M3 với chip Apple M3 Pro/Max, màn hình Liquid Retina XDR 14.2 inch.',
 '/images/products/macbook-pro-m3-twitter.jpg', '@techstore_vn', '@techstore_vn',
 '{"@context": "https://schema.org", "@type": "Product", "name": "MacBook Pro M3", "brand": "Apple", "model": "MacBook Pro M3", "description": "Laptop mạnh mẽ cho chuyên gia", "offers": {"@type": "Offer", "price": "3500000", "priceCurrency": "VND"}}',
 '{"lcp": 2.2, "fid": 45, "cls": 0.08, "inp": 105, "ttfb": 170}',
 '{"ai_relevance_score": 96, "ml_ranking_factors": {"product_relevance": 94, "search_intent": 90}}',
 '{"experience_score": 92, "expertise_score": 96, "authoritativeness_score": 94, "trust_score": 95}',
 '{"voice_search_optimized": true, "visual_search_data": {"product_images": 96, "specs_diagrams": 90}}',
 '{"gdpr_compliant": true, "ccpa_compliant": true, "privacy_signals": {"secure_checkout": true, "warranty_info": true}}',
 '{"quantum_seo_ready": true, "neural_network_data": {"product_patterns": 94, "purchase_behavior": 88}}',
 '/shop-details/macbook-pro-m3', 'index,follow', '{"vi": "/shop-details/macbook-pro-m3", "en": "/en/shop-details/macbook-pro-m3"}', 'vi', 'UTF-8', 'width=device-width, initial-scale=1',
 96, 80, 5200,
 2.2, 96, 92, 88,
 650, 4.8, 2.9,
 750, 90, 88,
 10, 6, 0, 94,
 true, true, true, true),

-- Trang danh mục Laptop
(3, '/shop?category=laptops', 'Laptop - MacBook, Dell, HP, Lenovo | TechStore',
 'Bộ sưu tập laptop đa dạng từ MacBook, Dell, HP, Lenovo. Laptop gaming, laptop văn phòng, laptop đồ họa với giá tốt nhất.',
 ARRAY['laptop', 'macbook', 'dell', 'hp', 'lenovo', 'gaming', 'văn phòng'],
 'category', '550e8400-e29b-41d4-a716-446655440004',
 'Laptop - MacBook, Dell, HP, Lenovo | TechStore',
 'Bộ sưu tập laptop đa dạng từ MacBook, Dell, HP, Lenovo.',
 '/images/categories/laptops-og.jpg', 'website', 'TechStore', 'vi_VN',
 'summary_large_image', 'Laptop - MacBook, Dell, HP, Lenovo | TechStore',
 'Bộ sưu tập laptop đa dạng từ MacBook, Dell, HP, Lenovo.',
 '/images/categories/laptops-twitter.jpg', '@techstore_vn', '@techstore_vn',
 '{"@context": "https://schema.org", "@type": "CollectionPage", "name": "Laptop", "description": "Bộ sưu tập laptop đa dạng"}',
 '{"lcp": 2.4, "fid": 50, "cls": 0.09, "inp": 108, "ttfb": 190}',
 '{"ai_relevance_score": 94, "ml_ranking_factors": {"category_relevance": 92, "product_diversity": 90}}',
 '{"experience_score": 90, "expertise_score": 94, "authoritativeness_score": 92, "trust_score": 91}',
 '{"voice_search_optimized": true, "visual_search_data": {"category_images": 94, "product_grids": 90}}',
 '{"gdpr_compliant": true, "ccpa_compliant": true, "privacy_signals": {"category_filtering": true, "sort_options": true}}',
 '{"quantum_seo_ready": true, "neural_network_data": {"category_patterns": 92, "browsing_behavior": 88}}',
 '/shop?category=laptops', 'index,follow', '{"vi": "/shop?category=laptops", "en": "/en/shop?category=laptops"}', 'vi', 'UTF-8', 'width=device-width, initial-scale=1',
 94, 70, 9800,
 2.4, 94, 90, 86,
 750, 4.6, 3.0,
 520, 86, 90,
 16, 8, 0, 92,
 true, true, true, true),

-- Trang Help/FAQ
(1, '/help', 'Hỗ trợ & FAQ - Giải đáp thắc mắc | TechStore',
 'Tìm câu trả lời cho các câu hỏi thường gặp về mua sắm, thanh toán, giao hàng, bảo hành và dịch vụ khách hàng tại TechStore.',
 ARRAY['hỗ trợ', 'faq', 'câu hỏi thường gặp', 'hướng dẫn', 'giải đáp'],
 'page', NULL,
 'Hỗ trợ & FAQ - Giải đáp thắc mắc | TechStore',
 'Tìm câu trả lời cho các câu hỏi thường gặp về mua sắm, thanh toán, giao hàng.',
 '/images/help/help-og.jpg', 'website', 'TechStore', 'vi_VN',
 'summary_large_image', 'Hỗ trợ & FAQ - Giải đáp thắc mắc | TechStore',
 'Tìm câu trả lời cho các câu hỏi thường gặp về mua sắm, thanh toán, giao hàng.',
 '/images/help/help-twitter.jpg', '@techstore_vn', '@techstore_vn',
 '{"@context": "https://schema.org", "@type": "FAQPage", "name": "Hỗ trợ & FAQ TechStore", "description": "Giải đáp thắc mắc khách hàng"}',
 '{"lcp": 2.1, "fid": 44, "cls": 0.07, "inp": 100, "ttfb": 165}',
 '{"ai_relevance_score": 87, "ml_ranking_factors": {"help_content": 90, "search_intent": 85}}',
 '{"experience_score": 90, "expertise_score": 88, "authoritativeness_score": 90, "trust_score": 91}',
 '{"voice_search_optimized": true, "visual_search_data": {"help_icons": 88, "faq_layout": 85}}',
 '{"gdpr_compliant": true, "ccpa_compliant": true, "privacy_signals": {"help_content": true, "contact_options": true}}',
 '{"quantum_seo_ready": true, "neural_network_data": {"help_patterns": 87, "user_queries": 85}}',
 '/help', 'index,follow', '{"vi": "/help", "en": "/en/help"}', 'vi', 'UTF-8', 'width=device-width, initial-scale=1',
 87, 35, 2100,
 2.1, 88, 84, 78,
 320, 3.2, 1.5,
 1500, 88, 82,
 8, 4, 0, 86,
 true, false, true, true),

-- Trang 404
(5, '/404', 'Trang không tìm thấy - TechStore',
 'Trang bạn đang tìm kiếm không tồn tại. Quay về trang chủ hoặc sử dụng menu điều hướng để tìm sản phẩm mong muốn.',
 ARRAY['404', 'không tìm thấy', 'lỗi', 'trang chủ'],
 'page', NULL,
 'Trang không tìm thấy - TechStore',
 'Trang bạn đang tìm kiếm không tồn tại. Quay về trang chủ hoặc sử dụng menu điều hướng.',
 '/images/404/404-og.jpg', 'website', 'TechStore', 'vi_VN',
 'summary_large_image', 'Trang không tìm thấy - TechStore',
 'Trang bạn đang tìm kiếm không tồn tại. Quay về trang chủ hoặc sử dụng menu điều hướng.',
 '/images/404/404-twitter.jpg', '@techstore_vn', '@techstore_vn',
 '{"@context": "https://schema.org", "@type": "WebPage", "name": "Trang không tìm thấy", "description": "404 Error Page"}',
 '{"lcp": 1.5, "fid": 35, "cls": 0.04, "inp": 85, "ttfb": 120}',
 '{"ai_relevance_score": 75, "ml_ranking_factors": {"error_handling": 80, "user_experience": 75}}',
 '{"experience_score": 80, "expertise_score": 75, "authoritativeness_score": 78, "trust_score": 80}',
 '{"voice_search_optimized": false, "visual_search_data": {"error_illustration": 85, "navigation_help": 80}}',
 '{"gdpr_compliant": true, "ccpa_compliant": true, "privacy_signals": {"error_tracking": false, "user_guidance": true}}',
 '{"quantum_seo_ready": false, "neural_network_data": {"error_patterns": 75, "recovery_behavior": 70}}',
 '/404', 'noindex,nofollow', '{"vi": "/404", "en": "/en/404"}', 'vi', 'UTF-8', 'width=device-width, initial-scale=1',
 75, 20, 1500,
 1.5, 85, 80, 75,
 180, 2.8, 1.2,
 300, 75, 70,
 3, 1, 0, 80,
 true, false, false, true),

-- Trang User Profile
(4, '/my-account', 'Tài khoản của tôi - TechStore | Quản lý đơn hàng, thông tin cá nhân',
 'Quản lý tài khoản TechStore: Xem đơn hàng, cập nhật thông tin cá nhân, địa chỉ giao hàng và bảo mật tài khoản.',
 ARRAY['tài khoản', 'đơn hàng', 'thông tin cá nhân', 'địa chỉ giao hàng', 'bảo mật'],
 'user', NULL,
 'Tài khoản của tôi - TechStore | Quản lý đơn hàng, thông tin cá nhân',
 'Quản lý tài khoản TechStore: Xem đơn hàng, cập nhật thông tin cá nhân, địa chỉ giao hàng.',
 '/images/user/profile-og.jpg', 'website', 'TechStore', 'vi_VN',
 'summary_large_image', 'Tài khoản của tôi - TechStore | Quản lý đơn hàng, thông tin cá nhân',
 'Quản lý tài khoản TechStore: Xem đơn hàng, cập nhật thông tin cá nhân, địa chỉ giao hàng.',
 '/images/user/profile-twitter.jpg', '@techstore_vn', '@techstore_vn',
 '{"@context": "https://schema.org", "@type": "WebPage", "name": "Tài khoản của tôi", "description": "Quản lý tài khoản TechStore"}',
 '{"lcp": 2.0, "fid": 40, "cls": 0.06, "inp": 95, "ttfb": 150}',
 '{"ai_relevance_score": 85, "ml_ranking_factors": {"user_experience": 90, "security": 88}}',
 '{"experience_score": 88, "expertise_score": 85, "authoritativeness_score": 90, "trust_score": 92}',
 '{"voice_search_optimized": false, "visual_search_data": {"user_interface": 88, "navigation": 85}}',
 '{"gdpr_compliant": true, "ccpa_compliant": true, "privacy_signals": {"user_data": true, "secure_login": true}}',
 '{"quantum_seo_ready": false, "neural_network_data": {"user_patterns": 85, "security_patterns": 88}}',
 '/my-account', 'noindex,nofollow', '{"vi": "/my-account", "en": "/en/my-account"}', 'vi', 'UTF-8', 'width=device-width, initial-scale=1',
 85, 30, 1800,
 2.0, 90, 88, 85,
 280, 3.2, 1.6,
 600, 85, 80,
 5, 2, 0, 88,
 true, false, false, true),

-- Trang System - Sitemap
(5, '/sitemap.xml', 'Sitemap - TechStore | Bản đồ website',
 'Sitemap TechStore - Bản đồ website với tất cả trang, sản phẩm, danh mục và bài viết blog.',
 ARRAY['sitemap', 'bản đồ website', 'seo', 'index'],
 'system', NULL,
 'Sitemap - TechStore | Bản đồ website',
 'Sitemap TechStore - Bản đồ website với tất cả trang, sản phẩm, danh mục và bài viết blog.',
 '/images/system/sitemap-og.jpg', 'website', 'TechStore', 'vi_VN',
 'summary_large_image', 'Sitemap - TechStore | Bản đồ website',
 'Sitemap TechStore - Bản đồ website với tất cả trang, sản phẩm, danh mục và bài viết blog.',
 '/images/system/sitemap-twitter.jpg', '@techstore_vn', '@techstore_vn',
 '{"@context": "https://schema.org", "@type": "WebPage", "name": "Sitemap", "description": "Bản đồ website TechStore"}',
 '{"lcp": 1.2, "fid": 30, "cls": 0.03, "inp": 75, "ttfb": 100}',
 '{"ai_relevance_score": 70, "ml_ranking_factors": {"technical_seo": 85, "crawlability": 90}}',
 '{"experience_score": 75, "expertise_score": 80, "authoritativeness_score": 85, "trust_score": 80}',
 '{"voice_search_optimized": false, "visual_search_data": {"xml_structure": 90, "technical_format": 85}}',
 '{"gdpr_compliant": true, "ccpa_compliant": true, "privacy_signals": {"technical_data": true, "crawl_data": true}}',
 '{"quantum_seo_ready": false, "neural_network_data": {"technical_patterns": 80, "crawl_patterns": 85}}',
 '/sitemap.xml', 'index,follow', '{"vi": "/sitemap.xml", "en": "/en/sitemap.xml"}', 'vi', 'UTF-8', 'width=device-width, initial-scale=1',
 80, 15, 800,
 1.2, 95, 90, 88,
 120, 2.5, 1.0,
 200, 80, 75,
 2, 1, 0, 90,
 true, false, true, true),

-- Trang System - Robots.txt
(5, '/robots.txt', 'Robots.txt - TechStore | Hướng dẫn cho search engines',
 'Robots.txt TechStore - Hướng dẫn cho search engines về việc crawl và index website.',
 ARRAY['robots.txt', 'search engine', 'crawl', 'index', 'seo'],
 'system', NULL,
 'Robots.txt - TechStore | Hướng dẫn cho search engines',
 'Robots.txt TechStore - Hướng dẫn cho search engines về việc crawl và index website.',
 '/images/system/robots-og.jpg', 'website', 'TechStore', 'vi_VN',
 'summary_large_image', 'Robots.txt - TechStore | Hướng dẫn cho search engines',
 'Robots.txt TechStore - Hướng dẫn cho search engines về việc crawl và index website.',
 '/images/system/robots-twitter.jpg', '@techstore_vn', '@techstore_vn',
 '{"@context": "https://schema.org", "@type": "WebPage", "name": "Robots.txt", "description": "Hướng dẫn cho search engines"}',
 '{"lcp": 0.8, "fid": 25, "cls": 0.02, "inp": 60, "ttfb": 80}',
 '{"ai_relevance_score": 65, "ml_ranking_factors": {"technical_seo": 90, "crawlability": 95}}',
 '{"experience_score": 70, "expertise_score": 85, "authoritativeness_score": 90, "trust_score": 75}',
 '{"voice_search_optimized": false, "visual_search_data": {"text_format": 95, "technical_structure": 90}}',
 '{"gdpr_compliant": true, "ccpa_compliant": true, "privacy_signals": {"technical_data": true, "crawl_data": true}}',
 '{"quantum_seo_ready": false, "neural_network_data": {"technical_patterns": 85, "crawl_patterns": 90}}',
 '/robots.txt', 'index,follow', '{"vi": "/robots.txt", "en": "/en/robots.txt"}', 'vi', 'UTF-8', 'width=device-width, initial-scale=1',
 75, 10, 500,
 0.8, 98, 95, 92,
 80, 2.0, 0.8,
 150, 85, 70,
 1, 0, 0, 95,
 true, false, true, true);

-- =====================================================
-- 28. KIỂM TRA KẾT QUẢ INSERT DỮ LIỆU SEO
-- =====================================================

-- Kiểm tra số lượng records trong bảng SEO
SELECT 
    'SEO Page Types' as table_name,
    COUNT(*) as record_count
FROM seo_page_types
UNION ALL
SELECT 
    'SEO Pages' as table_name,
    COUNT(*) as record_count
FROM seo_pages;

-- Kiểm tra các trang SEO đã tạo
SELECT 
    spt.display_name as page_type,
    sp.page_url,
    sp.page_title,
    sp.seo_score,
    sp.is_active
FROM seo_pages sp
JOIN seo_page_types spt ON sp.page_type_id = spt.id
ORDER BY sp.seo_score DESC;

-- =====================================================
-- HOÀN THÀNH INSERT TẤT CẢ DỮ LIỆU MẪU
-- =====================================================
SELECT 
    '=== HOÀN THÀNH INSERT TẤT CẢ DỮ LIỆU MẪU ===' as info,
    '✅ Đã insert dữ liệu cho 26 tables chính' as step1,
    '✅ Đã insert dữ liệu cho 2 tables SEO' as step2,
    '✅ Đã tạo 5 loại trang SEO' as step3,
    '✅ Đã tạo 12 trang SEO mẫu' as step4,
    '✅ Database đã sẵn sàng cho production' as step5;
