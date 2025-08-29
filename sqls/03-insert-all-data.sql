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
('iphone-15-hero.jpg', '/images/products/iphone-15-hero.jpg', '/images/products/iphone-15-hero.jpg', 'iPhone 15 - Hình ảnh chính', 'iPhone 15 Hero Image', 'Hình ảnh chính iPhone 15 với thiết kế mới, camera 48MP và chip A17 Pro mạnh mẽ', ARRAY['iphone 15', 'apple', 'smartphone', 'camera 48mp', 'chip a17 pro'], 'iPhone 15 - Flagship mới nhất của Apple', 'Apple Inc.', 'Commercial Use', 2048000, 'image/jpeg', '{"width": 1200, "height": 800}'),
('macbook-pro-hero.jpg', '/images/products/macbook-pro-hero.jpg', '/images/products/macbook-pro-hero.jpg', 'MacBook Pro - Hình ảnh chính', 'MacBook Pro Hero Image', 'MacBook Pro với chip M3 Pro, màn hình Liquid Retina XDR và hiệu năng đỉnh cao', ARRAY['macbook pro', 'apple', 'laptop', 'chip m3 pro', 'liquid retina xdr'], 'MacBook Pro - Laptop mạnh mẽ nhất của Apple', 'Apple Inc.', 'Commercial Use', 2560000, 'image/jpeg', '{"width": 1200, "height": 800}'),
('blog-tech-trends.jpg', '/images/blog/blog-tech-trends.jpg', '/images/blog/blog-tech-trends.jpg', 'Blog: Xu hướng công nghệ 2024', 'Tech Trends 2024', 'Hình ảnh minh họa xu hướng công nghệ 2024: AI, 5G, IoT và các công nghệ mới', ARRAY['tech trends', 'ai', '5g', 'iot', 'technology 2024'], 'Xu hướng công nghệ 2024 - Tương lai đã đến', 'Tech Blog', 'Creative Commons', 2200000, 'image/jpeg', '{"width": 1200, "height": 600}'),
('blog-iphone-review.jpg', '/images/blog/blog-iphone-review.jpg', '/images/blog/blog-iphone-review.jpg', 'Blog: Đánh giá iPhone 15', 'iPhone 15 Review', 'Hình ảnh minh họa bài đánh giá iPhone 15 với các tính năng nổi bật', ARRAY['iphone 15 review', 'iphone', 'apple', 'smartphone review', 'camera review'], 'Đánh giá iPhone 15 - Có đáng mua không?', 'Tech Review', 'Creative Commons', 2400000, 'image/jpeg', '{"width": 1200, "height": 600}'),
('ipad-pro-12-9-hero.jpg', '/images/products/ipad-pro-12-9-hero.jpg', '/images/products/ipad-pro-12-9-hero.jpg', 'iPad Pro 12.9 inch - Hình ảnh chính', 'iPad Pro 12.9 inch Hero Image', 'iPad Pro 12.9 inch với chip M2, màn hình Liquid Retina XDR, hỗ trợ Apple Pencil', ARRAY['ipad pro', 'apple', 'tablet', 'chip m2', 'liquid retina xdr'], 'iPad Pro 12.9 inch - Tablet mạnh mẽ nhất của Apple', 'Apple Inc.', 'Commercial Use', 2300000, 'image/jpeg', '{"width": 1200, "height": 800}'),
('samsung-galaxy-tab-s9-hero.jpg', '/images/products/samsung-galaxy-tab-s9-hero.jpg', '/images/products/samsung-galaxy-tab-s9-hero.jpg', 'Samsung Galaxy Tab S9 - Hình ảnh chính', 'Galaxy Tab S9 Hero Image', 'Galaxy Tab S9 với chip Snapdragon 8 Gen 2, màn hình AMOLED 11 inch', ARRAY['galaxy tab s9', 'samsung', 'tablet', 'snapdragon 8 gen 2', 'amoled'], 'Galaxy Tab S9 - Tablet Android cao cấp', 'Samsung Electronics', 'Commercial Use', 2100000, 'image/jpeg', '{"width": 1200, "height": 800}'),
('airpods-pro-2-hero.jpg', '/images/products/airpods-pro-2-hero.jpg', '/images/products/airpods-pro-2-hero.jpg', 'AirPods Pro 2 - Hình ảnh chính', 'AirPods Pro 2 Hero Image', 'AirPods Pro 2 với chip H2, chống ồn chủ động, âm thanh không gian', ARRAY['airpods pro 2', 'apple', 'earbuds', 'chip h2', 'chống ồn'], 'AirPods Pro 2 - Tai nghe không dây cao cấp', 'Apple Inc.', 'Commercial Use', 1800000, 'image/jpeg', '{"width": 1200, "height": 800}'),
('samsung-galaxy-watch-6-hero.jpg', '/images/products/samsung-galaxy-watch-6-hero.jpg', '/images/products/samsung-galaxy-watch-6-hero.jpg', 'Samsung Galaxy Watch 6 - Hình ảnh chính', 'Galaxy Watch 6 Hero Image', 'Galaxy Watch 6 với màn hình AMOLED, theo dõi sức khỏe, GPS tích hợp', ARRAY['galaxy watch 6', 'samsung', 'smartwatch', 'amoled', 'sức khỏe'], 'Galaxy Watch 6 - Smartwatch Android cao cấp', 'Samsung Electronics', 'Commercial Use', 1900000, 'image/jpeg', '{"width": 1200, "height": 800}'),
('macbook-pro-m3-max-hero.jpg', '/images/products/macbook-pro-m3-max-hero.jpg', '/images/products/macbook-pro-m3-max-hero.jpg', 'MacBook Pro M3 Max - Hình ảnh chính', 'MacBook Pro M3 Max Hero Image', 'MacBook Pro M3 Max với chip M3 Max mạnh mẽ, màn hình Liquid Retina XDR 16 inch', ARRAY['macbook pro m3 max', 'apple', 'laptop', 'chip m3 max', 'liquid retina xdr'], 'MacBook Pro M3 Max - Laptop mạnh nhất của Apple', 'Apple Inc.', 'Commercial Use', 2800000, 'image/jpeg', '{"width": 1200, "height": 800}'),
('dell-xps-13-plus-hero.jpg', '/images/products/dell-xps-13-plus-hero.jpg', '/images/products/dell-xps-13-plus-hero.jpg', 'Dell XPS 13 Plus - Hình ảnh chính', 'Dell XPS 13 Plus Hero Image', 'Dell XPS 13 Plus với chip Intel Core i7, màn hình OLED 13.4 inch', ARRAY['dell xps 13 plus', 'dell', 'laptop', 'intel core i7', 'oled'], 'Dell XPS 13 Plus - Laptop Windows cao cấp', 'Dell Technologies', 'Commercial Use', 2200000, 'image/jpeg', '{"width": 1200, "height": 800}'),

('google-pixel-8-hero.jpg', '/images/products/google-pixel-8-hero.jpg', '/images/products/google-pixel-8-hero.jpg', 'Google Pixel 8 - Hình ảnh chính', 'Google Pixel 8 Hero Image', 'Google Pixel 8 với chip Tensor G3, camera 50MP, AI features tích hợp', ARRAY['google pixel 8', 'google', 'smartphone', 'tensor g3', 'ai features'], 'Google Pixel 8 - Smartphone AI của Google', 'Google LLC', 'Commercial Use', 2100000, 'image/jpeg', '{"width": 1200, "height": 800}'),
('sony-wh-1000xm5-hero.jpg', '/images/products/sony-wh-1000xm5-hero.jpg', '/images/products/sony-wh-1000xm5-hero.jpg', 'Sony WH-1000XM5 - Hình ảnh chính', 'Sony WH-1000XM5 Hero Image', 'Sony WH-1000XM5 với chống ồn chủ động, âm thanh chất lượng cao', ARRAY['sony wh-1000xm5', 'sony', 'headphone', 'chống ồn', 'âm thanh'], 'Sony WH-1000XM5 - Headphone chống ồn số 1', 'Sony Corporation', 'Commercial Use', 1900000, 'image/jpeg', '{"width": 1200, "height": 800}'),
('nintendo-switch-oled-hero.jpg', '/images/products/nintendo-switch-oled-hero.jpg', '/images/products/nintendo-switch-oled-hero.jpg', 'Nintendo Switch OLED - Hình ảnh chính', 'Nintendo Switch OLED Hero Image', 'Nintendo Switch OLED với màn hình OLED 7 inch, Joy-Con controllers', ARRAY['nintendo switch oled', 'nintendo', 'gaming', 'oled', 'joy-con'], 'Nintendo Switch OLED - Gaming console di động', 'Nintendo Co., Ltd.', 'Commercial Use', 1700000, 'image/jpeg', '{"width": 1200, "height": 800}'),
('dji-mini-3-pro-hero.jpg', '/images/products/dji-mini-3-pro-hero.jpg', '/images/products/dji-mini-3-pro-hero.jpg', 'DJI Mini 3 Pro - Hình ảnh chính', 'DJI Mini 3 Pro Hero Image', 'DJI Mini 3 Pro drone với camera 4K, trọng lượng dưới 250g', ARRAY['dji mini 3 pro', 'dji', 'drone', 'camera 4k', '250g'], 'DJI Mini 3 Pro - Drone quay phim 4K', 'DJI Technology', 'Commercial Use', 2500000, 'image/jpeg', '{"width": 1200, "height": 800}'),
('gopro-hero-11-black-hero.jpg', '/images/products/gopro-hero-11-black-hero.jpg', '/images/products/gopro-hero-11-black-hero.jpg', 'GoPro Hero 11 Black - Hình ảnh chính', 'GoPro Hero 11 Black Hero Image', 'GoPro Hero 11 Black với camera 5.3K, HyperSmooth 5.0', ARRAY['gopro hero 11 black', 'gopro', 'camera', '5.3k', 'hypersmooth'], 'GoPro Hero 11 Black - Camera hành động 5.3K', 'GoPro Inc.', 'Commercial Use', 2200000, 'image/jpeg', '{"width": 1200, "height": 800}'),
('microsoft-surface-pro-9-hero.jpg', '/images/products/microsoft-surface-pro-9-hero.jpg', '/images/products/microsoft-surface-pro-9-hero.jpg', 'Microsoft Surface Pro 9 - Hình ảnh chính', 'Microsoft Surface Pro 9 Hero Image', 'Microsoft Surface Pro 9 với chip Intel Core i5, thiết kế 2-in-1', ARRAY['microsoft surface pro 9', 'microsoft', 'tablet', 'intel core i5', '2-in-1'], 'Microsoft Surface Pro 9 - Tablet 2-in-1 cao cấp', 'Microsoft Corporation', 'Commercial Use', 2300000, 'image/jpeg', '{"width": 1200, "height": 800}'),
('oneplus-11-hero.jpg', '/images/products/oneplus-11-hero.jpg', '/images/products/oneplus-11-hero.jpg', 'OnePlus 11 - Hình ảnh chính', 'OnePlus 11 Hero Image', 'OnePlus 11 với chip Snapdragon 8 Gen 2, camera 50MP, sạc nhanh 100W', ARRAY['oneplus 11', 'oneplus', 'smartphone', 'snapdragon 8 gen 2', 'sạc 100w'], 'OnePlus 11 - Smartphone flagship của OnePlus', 'OnePlus Technology', 'Commercial Use', 2000000, 'image/jpeg', '{"width": 1200, "height": 800}');

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
INSERT INTO categories (name, slug, description, featured_image_id, is_active, sort_order) VALUES
('Laptop', 'laptops', 'Laptop gaming, văn phòng, sinh viên chất lượng cao', (SELECT id FROM media WHERE file_name = 'macbook-pro-hero.jpg' LIMIT 1), true, 1),
('Smartphone', 'smartphones', 'Điện thoại thông minh từ các thương hiệu uy tín', (SELECT id FROM media WHERE file_name = 'iphone-15-hero.jpg' LIMIT 1), true, 2),
('Tablet', 'tablets', 'Máy tính bảng đa dụng cho công việc và giải trí', NULL, true, 3),
('Accessories', 'accessories', 'Phụ kiện điện tử chất lượng cao', NULL, true, 4);

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
('MacBook Air M1', 'macbook-air-m1', 'Laptop Apple với chip M1 mạnh mẽ, hiệu năng vượt trội, pin trâu', 'MacBook Air M1 chip, 8/256GB, hiệu năng mạnh mẽ, pin trâu', (SELECT id FROM categories WHERE slug = 'laptops' LIMIT 1), 'Apple', 'MBA-M1-8-256', 999.99, 899.99, 700.00, 1.29, '{"length": 30.41, "width": 21.24, "height": 1.61, "unit": "cm"}', true, true, 50, 5, 100, 4.8, 12, 1250, '12 months', '30 days', (SELECT id FROM media WHERE file_name = 'macbook-pro-hero.jpg' LIMIT 1)),
('MacBook Pro M2', 'macbook-pro-m2', 'Laptop Apple chuyên nghiệp với chip M2, màn hình Retina tuyệt đẹp', 'MacBook Pro M2 chip, 16/512GB, màn hình Retina, hiệu năng chuyên nghiệp', (SELECT id FROM categories WHERE slug = 'laptops' LIMIT 1), 'Apple', 'MBP-M2-16-512', 1499.99, 1399.99, 1000.00, 1.4, '{"length": 30.41, "width": 21.24, "height": 1.68, "unit": "cm"}', true, true, 30, 3, 80, 4.9, 8, 980, '12 months', '30 days', (SELECT id FROM media WHERE file_name = 'macbook-pro-hero.jpg' LIMIT 1)),
('iPhone 15 Pro', 'iphone-15-pro', 'iPhone 15 Pro với chip A17 Pro, camera 48MP, thiết kế Titan', 'iPhone 15 Pro với chip A17 Pro, camera 48MP, thiết kế Titan, 5G', (SELECT id FROM categories WHERE slug = 'smartphones' LIMIT 1), 'Apple', 'IPH-15PRO-128', 999.99, 949.99, 650.00, 0.187, '{"length": 14.7, "width": 7.1, "height": 0.8, "unit": "cm"}', true, true, 100, 10, 200, 4.7, 25, 2100, '12 months', '30 days', (SELECT id FROM media WHERE file_name = 'iphone-15-hero.jpg' LIMIT 1)),
('Samsung Galaxy S24', 'samsung-galaxy-s24', 'Samsung Galaxy S24 với AI features, camera 200MP, màn hình Dynamic AMOLED', 'Galaxy S24 với AI features, camera 200MP, màn hình Dynamic AMOLED 2X', (SELECT id FROM categories WHERE slug = 'smartphones' LIMIT 1), 'Samsung', 'SMS-GS24-256', 899.99, 849.99, 580.00, 0.168, '{"length": 14.7, "width": 7.0, "height": 0.8, "unit": "cm"}', true, true, 80, 8, 150, 4.6, 18, 1650, '12 months', '30 days', (SELECT id FROM media WHERE file_name = 'iphone-15-hero.jpg' LIMIT 1)),
('iPad Pro 12.9 inch', 'ipad-pro-12-9', 'iPad Pro 12.9 inch với chip M2, màn hình Liquid Retina XDR, hỗ trợ Apple Pencil', 'iPad Pro 12.9 inch chip M2, màn hình Liquid Retina XDR, hỗ trợ Apple Pencil và Magic Keyboard', (SELECT id FROM categories WHERE slug = 'tablets' LIMIT 1), 'Apple', 'IPAD-PRO-12-9-256', 1099.99, 1049.99, 750.00, 0.682, '{"length": 28.06, "width": 21.49, "height": 0.64, "unit": "cm"}', true, true, 45, 5, 100, 4.8, 15, 1200, '12 months', '30 days', (SELECT id FROM media WHERE file_name = 'ipad-pro-12-9-hero.jpg' LIMIT 1)),
('Samsung Galaxy Tab S9', 'samsung-galaxy-tab-s9', 'Galaxy Tab S9 với chip Snapdragon 8 Gen 2, màn hình AMOLED 11 inch', 'Galaxy Tab S9 chip Snapdragon 8 Gen 2, màn hình AMOLED 11 inch, S Pen tích hợp', (SELECT id FROM categories WHERE slug = 'tablets' LIMIT 1), 'Samsung', 'SMS-GTS9-128', 699.99, 649.99, 450.00, 0.498, '{"length": 25.4, "width": 16.5, "height": 0.6, "unit": "cm"}', true, false, 60, 6, 120, 4.5, 12, 980, '12 months', '30 days', (SELECT id FROM media WHERE file_name = 'samsung-galaxy-tab-s9-hero.jpg' LIMIT 1)),
('AirPods Pro 2', 'airpods-pro-2', 'AirPods Pro 2 với chip H2, chống ồn chủ động, âm thanh không gian', 'AirPods Pro 2 chip H2, chống ồn chủ động, âm thanh không gian, chống nước IPX4', (SELECT id FROM categories WHERE slug = 'accessories' LIMIT 1), 'Apple', 'AIRPODS-PRO2', 249.99, 229.99, 150.00, 0.05, '{"length": 3.0, "width": 2.0, "height": 1.0, "unit": "cm"}', true, true, 120, 12, 200, 4.7, 28, 2100, '12 months', '30 days', (SELECT id FROM media WHERE file_name = 'airpods-pro-2-hero.jpg' LIMIT 1)),
('Samsung Galaxy Watch 6', 'samsung-galaxy-watch-6', 'Galaxy Watch 6 với màn hình AMOLED, theo dõi sức khỏe, GPS tích hợp', 'Galaxy Watch 6 màn hình AMOLED, theo dõi sức khỏe, GPS tích hợp, chống nước 5ATM', (SELECT id FROM categories WHERE slug = 'accessories' LIMIT 1), 'Samsung', 'SMS-GW6-44', 349.99, 319.99, 220.00, 0.028, '{"length": 4.4, "width": 4.4, "height": 1.0, "unit": "cm"}', true, false, 75, 8, 150, 4.6, 20, 1350, '12 months', '30 days', (SELECT id FROM media WHERE file_name = 'samsung-galaxy-watch-6-hero.jpg' LIMIT 1)),
('MacBook Pro M3 Max', 'macbook-pro-m3-max', 'MacBook Pro M3 Max với chip M3 Max mạnh mẽ, màn hình Liquid Retina XDR 16 inch', 'MacBook Pro M3 Max chip M3 Max, màn hình Liquid Retina XDR 16 inch, hiệu năng đỉnh cao', (SELECT id FROM categories WHERE slug = 'laptops' LIMIT 1), 'Apple', 'MBP-M3MAX-32-1TB', 3499.99, 3299.99, 2400.00, 2.15, '{"length": 35.57, "width": 24.81, "height": 1.68, "unit": "cm"}', true, true, 25, 3, 60, 4.9, 8, 850, '12 months', '30 days', (SELECT id FROM media WHERE file_name = 'macbook-pro-m3-max-hero.jpg' LIMIT 1)),
('Dell XPS 13 Plus', 'dell-xps-13-plus', 'Dell XPS 13 Plus với chip Intel Core i7, màn hình OLED 13.4 inch, thiết kế siêu mỏng', 'Dell XPS 13 Plus chip Intel Core i7, màn hình OLED 13.4 inch, thiết kế siêu mỏng, bàn phím cảm ứng', (SELECT id FROM categories WHERE slug = 'laptops' LIMIT 1), 'Dell', 'DELL-XPS13P-16-512', 1299.99, 1199.99, 850.00, 1.17, '{"length": 29.5, "width": 19.9, "height": 1.5, "unit": "cm"}', true, false, 40, 4, 80, 4.5, 15, 1100, '12 months', '30 days', (SELECT id FROM media WHERE file_name = 'dell-xps-13-plus-hero.jpg' LIMIT 1)),
('iPhone 15', 'iphone-15', 'iPhone 15 với chip A16 Bionic, camera kép 48MP, màn hình Super Retina XDR 6.1 inch', 'iPhone 15 chip A16 Bionic, camera kép 48MP, màn hình Super Retina XDR 6.1 inch, thiết kế Dynamic Island', (SELECT id FROM categories WHERE slug = 'smartphones' LIMIT 1), 'Apple', 'IPH-15-128', 799.99, 749.99, 500.00, 0.171, '{"length": 14.7, "width": 7.1, "height": 0.8, "unit": "cm"}', true, false, 90, 9, 180, 4.6, 22, 1800, '12 months', '30 days', (SELECT id FROM media WHERE file_name = 'iphone-15-hero.jpg' LIMIT 1)),
('Google Pixel 8', 'google-pixel-8', 'Google Pixel 8 với chip Tensor G3, camera 50MP, AI features tích hợp', 'Google Pixel 8 chip Tensor G3, camera 50MP, AI features tích hợp, màn hình OLED 6.2 inch', (SELECT id FROM categories WHERE slug = 'smartphones' LIMIT 1), 'Google', 'GOOG-PIXEL8-128', 699.99, 649.99, 450.00, 0.187, '{"length": 15.0, "width": 7.0, "height": 0.8, "unit": "cm"}', true, false, 55, 6, 110, 4.4, 18, 1200, '12 months', '30 days', (SELECT id FROM media WHERE file_name = 'google-pixel-8-hero.jpg' LIMIT 1)),
('Sony WH-1000XM5', 'sony-wh-1000xm5', 'Sony WH-1000XM5 với chống ồn chủ động, âm thanh chất lượng cao, pin 30 giờ', 'Sony WH-1000XM5 chống ồn chủ động, âm thanh chất lượng cao, pin 30 giờ, thiết kế gập gọn', (SELECT id FROM categories WHERE slug = 'accessories' LIMIT 1), 'Sony', 'SONY-WH1000XM5', 399.99, 369.99, 250.00, 0.25, '{"length": 16.5, "width": 8.0, "height": 3.0, "unit": "cm"}', true, true, 65, 7, 130, 4.8, 25, 1600, '12 months', '30 days', (SELECT id FROM media WHERE file_name = 'sony-wh-1000xm5-hero.jpg' LIMIT 1)),
('Nintendo Switch OLED', 'nintendo-switch-oled', 'Nintendo Switch OLED với màn hình OLED 7 inch, Joy-Con controllers, dock gốc', 'Nintendo Switch OLED màn hình OLED 7 inch, Joy-Con controllers, dock gốc, pin 4.5-9 giờ', (SELECT id FROM categories WHERE slug = 'accessories' LIMIT 1), 'Nintendo', 'NINT-SWOLED', 349.99, 329.99, 220.00, 0.42, '{"length": 24.1, "width": 10.2, "height": 1.4, "unit": "cm"}', true, false, 80, 8, 160, 4.7, 30, 1900, '12 months', '30 days', (SELECT id FROM media WHERE file_name = 'nintendo-switch-oled-hero.jpg' LIMIT 1)),
('DJI Mini 3 Pro', 'dji-mini-3-pro', 'DJI Mini 3 Pro drone với camera 4K, trọng lượng dưới 250g, bay 34 phút', 'DJI Mini 3 Pro drone camera 4K, trọng lượng dưới 250g, bay 34 phút, điều khiển bằng smartphone', (SELECT id FROM categories WHERE slug = 'accessories' LIMIT 1), 'DJI', 'DJI-MINI3PRO', 759.99, 699.99, 500.00, 0.249, '{"length": 14.5, "width": 8.5, "height": 5.7, "unit": "cm"}', true, false, 35, 4, 70, 4.6, 12, 850, '12 months', '30 days', (SELECT id FROM media WHERE file_name = 'dji-mini-3-pro-hero.jpg' LIMIT 1)),
('GoPro Hero 11 Black', 'gopro-hero-11-black', 'GoPro Hero 11 Black với camera 5.3K, HyperSmooth 5.0, chống nước 10m', 'GoPro Hero 11 Black camera 5.3K, HyperSmooth 5.0, chống nước 10m, màn hình cảm ứng 2.27 inch', (SELECT id FROM categories WHERE slug = 'accessories' LIMIT 1), 'GoPro', 'GOPRO-HERO11B', 399.99, 369.99, 250.00, 0.153, '{"length": 7.1, "width": 5.0, "height": 3.3, "unit": "cm"}', true, false, 50, 5, 100, 4.5, 16, 1100, '12 months', '30 days', (SELECT id FROM media WHERE file_name = 'gopro-hero-11-black-hero.jpg' LIMIT 1)),
('Microsoft Surface Pro 9', 'microsoft-surface-pro-9', 'Microsoft Surface Pro 9 với chip Intel Core i5, màn hình 13 inch, thiết kế 2-in-1', 'Microsoft Surface Pro 9 chip Intel Core i5, màn hình 13 inch, thiết kế 2-in-1, hỗ trợ Surface Pen', (SELECT id FROM categories WHERE slug = 'tablets' LIMIT 1), 'Microsoft', 'MS-SURFACEPRO9-8-256', 999.99, 949.99, 650.00, 0.879, '{"length": 28.7, "width": 20.9, "height": 0.9, "unit": "cm"}', true, false, 30, 3, 60, 4.4, 14, 950, '12 months', '30 days', (SELECT id FROM media WHERE file_name = 'microsoft-surface-pro-9-hero.jpg' LIMIT 1)),
('OnePlus 11', 'oneplus-11', 'OnePlus 11 với chip Snapdragon 8 Gen 2, camera 50MP, sạc nhanh 100W', 'OnePlus 11 chip Snapdragon 8 Gen 2, camera 50MP, sạc nhanh 100W, màn hình AMOLED 6.7 inch', (SELECT id FROM categories WHERE slug = 'smartphones' LIMIT 1), 'OnePlus', 'ONEPLUS-11-128', 699.99, 649.99, 450.00, 0.205, '{"length": 16.3, "width": 7.5, "height": 0.8, "unit": "cm"}', true, false, 45, 5, 90, 4.5, 20, 1400, '12 months', '30 days', (SELECT id FROM media WHERE file_name = 'oneplus-11-hero.jpg' LIMIT 1));

-- =====================================================
-- 7. INSERT PRODUCT_VARIANTS (BIẾN THỂ SẢN PHẨM)
-- =====================================================
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes) VALUES
((SELECT id FROM products WHERE slug = 'macbook-air-m1' LIMIT 1), '8GB RAM, 256GB SSD', 'MBA-M1-8-256', 999.99, 25, '{"ram": "8GB", "storage": "256GB"}'),
((SELECT id FROM products WHERE slug = 'macbook-air-m1' LIMIT 1), '8GB RAM, 512GB SSD', 'MBA-M1-8-512', 1199.99, 15, '{"ram": "8GB", "storage": "512GB"}'),
((SELECT id FROM products WHERE slug = 'macbook-air-m1' LIMIT 1), '16GB RAM, 512GB SSD', 'MBA-M1-16-512', 1399.99, 10, '{"ram": "16GB", "storage": "512GB"}'),
((SELECT id FROM products WHERE slug = 'iphone-15-pro' LIMIT 1), '128GB', 'IPH-15PRO-128', 999.99, 40, '{"storage": "128GB"}'),
((SELECT id FROM products WHERE slug = 'iphone-15-pro' LIMIT 1), '256GB', 'IPH-15PRO-256', 1099.99, 35, '{"storage": "256GB"}'),
((SELECT id FROM products WHERE slug = 'iphone-15-pro' LIMIT 1), '512GB', 'IPH-15PRO-512', 1299.99, 25, '{"storage": "512GB"}'),
((SELECT id FROM products WHERE slug = 'ipad-pro-12-9' LIMIT 1), '256GB', 'IPAD-PRO-12-9-256', 1099.99, 25, '{"storage": "256GB"}'),
((SELECT id FROM products WHERE slug = 'ipad-pro-12-9' LIMIT 1), '512GB', 'IPAD-PRO-12-9-512', 1299.99, 20, '{"storage": "512GB"}'),
((SELECT id FROM products WHERE slug = 'ipad-pro-12-9' LIMIT 1), '1TB', 'IPAD-PRO-12-9-1TB', 1499.99, 15, '{"storage": "1TB"}'),
((SELECT id FROM products WHERE slug = 'samsung-galaxy-tab-s9' LIMIT 1), '128GB', 'SMS-GTS9-128', 699.99, 30, '{"storage": "128GB"}'),
((SELECT id FROM products WHERE slug = 'samsung-galaxy-tab-s9' LIMIT 1), '256GB', 'SMS-GTS9-256', 799.99, 25, '{"storage": "256GB"}'),
((SELECT id FROM products WHERE slug = 'airpods-pro-2' LIMIT 1), 'Standard', 'AIRPODS-PRO2-STD', 249.99, 60, '{"version": "Standard"}'),
((SELECT id FROM products WHERE slug = 'airpods-pro-2' LIMIT 1), 'MagSafe Case', 'AIRPODS-PRO2-MAG', 269.99, 40, '{"version": "MagSafe Case"}'),
((SELECT id FROM products WHERE slug = 'samsung-galaxy-watch-6' LIMIT 1), '44mm', 'SMS-GW6-44', 349.99, 40, '{"size": "44mm"}'),
((SELECT id FROM products WHERE slug = 'samsung-galaxy-watch-6' LIMIT 1), '40mm', 'SMS-GW6-40', 329.99, 35, '{"size": "40mm"}'),
((SELECT id FROM products WHERE slug = 'macbook-pro-m3-max' LIMIT 1), '32GB RAM, 1TB SSD', 'MBP-M3MAX-32-1TB', 3499.99, 15, '{"ram": "32GB", "storage": "1TB"}'),
((SELECT id FROM products WHERE slug = 'macbook-pro-m3-max' LIMIT 1), '64GB RAM, 2TB SSD', 'MBP-M3MAX-64-2TB', 4499.99, 10, '{"ram": "64GB", "storage": "2TB"}'),
((SELECT id FROM products WHERE slug = 'dell-xps-13-plus' LIMIT 1), '16GB RAM, 512GB SSD', 'DELL-XPS13P-16-512', 1299.99, 20, '{"ram": "16GB", "storage": "512GB"}'),
((SELECT id FROM products WHERE slug = 'dell-xps-13-plus' LIMIT 1), '32GB RAM, 1TB SSD', 'DELL-XPS13P-32-1TB', 1599.99, 15, '{"ram": "32GB", "storage": "1TB"}'),
((SELECT id FROM products WHERE slug = 'iphone-15' LIMIT 1), '128GB', 'IPH-15-128', 799.99, 45, '{"storage": "128GB"}'),
((SELECT id FROM products WHERE slug = 'iphone-15' LIMIT 1), '256GB', 'IPH-15-256', 899.99, 35, '{"storage": "256GB"}'),
((SELECT id FROM products WHERE slug = 'google-pixel-8' LIMIT 1), '128GB', 'GOOG-PIXEL8-128', 699.99, 30, '{"storage": "128GB"}'),
((SELECT id FROM products WHERE slug = 'google-pixel-8' LIMIT 1), '256GB', 'GOOG-PIXEL8-256', 799.99, 25, '{"storage": "256GB"}'),
((SELECT id FROM products WHERE slug = 'sony-wh-1000xm5' LIMIT 1), 'Black', 'SONY-WH1000XM5-BLK', 399.99, 35, '{"color": "Black"}'),
((SELECT id FROM products WHERE slug = 'sony-wh-1000xm5' LIMIT 1), 'Silver', 'SONY-WH1000XM5-SLV', 399.99, 30, '{"color": "Silver"}'),
((SELECT id FROM products WHERE slug = 'nintendo-switch-oled' LIMIT 1), 'Standard', 'NINT-SWOLED-STD', 349.99, 40, '{"version": "Standard"}'),
((SELECT id FROM products WHERE slug = 'nintendo-switch-oled' LIMIT 1), 'Special Edition', 'NINT-SWOLED-SPEC', 379.99, 25, '{"version": "Special Edition"}'),
((SELECT id FROM products WHERE slug = 'dji-mini-3-pro' LIMIT 1), 'Standard', 'DJI-MINI3PRO-STD', 759.99, 20, '{"version": "Standard"}'),
((SELECT id FROM products WHERE slug = 'dji-mini-3-pro' LIMIT 1), 'Fly More Combo', 'DJI-MINI3PRO-FLY', 959.99, 15, '{"version": "Fly More Combo"}'),
((SELECT id FROM products WHERE slug = 'gopro-hero-11-black' LIMIT 1), 'Standard', 'GOPRO-HERO11B-STD', 399.99, 25, '{"version": "Standard"}'),
((SELECT id FROM products WHERE slug = 'gopro-hero-11-black' LIMIT 1), 'Creator Edition', 'GOPRO-HERO11B-CRE', 499.99, 20, '{"version": "Creator Edition"}'),
((SELECT id FROM products WHERE slug = 'microsoft-surface-pro-9' LIMIT 1), '8GB RAM, 256GB SSD', 'MS-SURFACEPRO9-8-256', 999.99, 15, '{"ram": "8GB", "storage": "256GB"}'),
((SELECT id FROM products WHERE slug = 'microsoft-surface-pro-9' LIMIT 1), '16GB RAM, 512GB SSD', 'MS-SURFACEPRO9-16-512', 1299.99, 10, '{"ram": "16GB", "storage": "512GB"}'),
((SELECT id FROM products WHERE slug = 'oneplus-11' LIMIT 1), '128GB', 'ONEPLUS-11-128', 699.99, 25, '{"storage": "128GB"}'),
((SELECT id FROM products WHERE slug = 'oneplus-11' LIMIT 1), '256GB', 'ONEPLUS-11-256', 799.99, 20, '{"storage": "256GB"}');

-- =====================================================
-- 8. INSERT PRODUCT_TAGS (QUAN HỆ NHIỀU-NHIỀU GIỮA PRODUCTS VÀ TAGS)
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
-- 9. INSERT BLOG_CATEGORIES (DANH MỤC BLOG)
-- =====================================================
INSERT INTO blog_categories (name, slug, description, featured_image_id, color, sort_order) VALUES
('Công nghệ', 'cong-nghe', 'Tin tức và xu hướng công nghệ mới nhất', (SELECT id FROM media WHERE file_name = 'blog-tech-trends.jpg' LIMIT 1), '#3B82F6', 1),
('Đánh giá sản phẩm', 'danh-gia-san-pham', 'Đánh giá chi tiết các sản phẩm công nghệ', (SELECT id FROM media WHERE file_name = 'blog-iphone-review.jpg' LIMIT 1), '#10B981', 2),
('Hướng dẫn', 'huong-dan', 'Hướng dẫn sử dụng và mẹo hay công nghệ', NULL, '#F59E0B', 3);

-- =====================================================
-- 10. INSERT BLOG_POSTS (BÀI VIẾT BLOG)
-- =====================================================
INSERT INTO blog_posts (title, slug, excerpt, content, category_id, author_id, status, is_featured, view_count, read_time, published_at) VALUES
('Xu hướng công nghệ 2024: AI, 5G và IoT', 'xu-huong-cong-nghe-2024-ai-5g-iot', 'Khám phá những xu hướng công nghệ nổi bật nhất trong năm 2024, từ AI đến 5G và Internet of Things.', 'Năm 2024 đánh dấu sự bùng nổ của các công nghệ mới, đặc biệt là trí tuệ nhân tạo (AI), mạng 5G và Internet of Things (IoT). AI đang thay đổi cách chúng ta làm việc và sinh hoạt hàng ngày. 5G không chỉ là mạng di động thế hệ mới, mà còn là nền tảng cho các công nghệ tương lai. IoT đang tạo ra một thế giới thông minh, nơi mọi thiết bị đều có thể kết nối và giao tiếp với nhau.', (SELECT id FROM blog_categories WHERE slug = 'cong-nghe' LIMIT 1), (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1), 'published', true, 1250, 8, NOW() - INTERVAL '5 days'),
('Đánh giá iPhone 15 Pro: Có đáng mua không?', 'danh-gia-iphone-15-pro-co-dang-mua-khong', 'Review chi tiết iPhone 15 Pro với chip A17 Pro, camera 48MP và thiết kế Titan. Có đáng mua với giá 999$?', 'iPhone 15 Pro là flagship mới nhất của Apple, được trang bị chip A17 Pro mạnh mẽ và camera 48MP. Thiết kế Titan cao cấp, nhẹ hơn và bền hơn so với thép không gỉ. A17 Pro là chip đầu tiên sử dụng quy trình 3nm, mang lại hiệu năng vượt trội. Camera chính 48MP với sensor lớn hơn, thu nhiều ánh sáng hơn. Màn hình Super Retina XDR 6.1 inch với tần số 120Hz ProMotion.', (SELECT id FROM blog_categories WHERE slug = 'danh-gia-san-pham' LIMIT 1), (SELECT id FROM profiles WHERE role = 'moderator' LIMIT 1), 'published', true, 890, 12, NOW() - INTERVAL '3 days');

-- =====================================================
-- 11. INSERT BLOG_POST_TAGS (QUAN HỆ BLOG_POSTS VÀ TAGS)
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
((SELECT id FROM profiles WHERE first_name = 'Nguyễn' AND last_name = 'Văn A' LIMIT 1), (SELECT id FROM products WHERE slug = 'macbook-air-m1' LIMIT 1), (SELECT id FROM product_variants WHERE sku = 'MBA-M1-8-256'), 1, 899.99, 'Mua cho công việc'),
((SELECT id FROM profiles WHERE first_name = 'Nguyễn' AND last_name = 'Văn A' LIMIT 1), (SELECT id FROM products WHERE slug = 'iphone-15-pro' LIMIT 1), (SELECT id FROM product_variants WHERE sku = 'IPH-15PRO-128'), 1, 949.99, 'Thay thế iPhone cũ'),
((SELECT id FROM profiles WHERE first_name = 'Trần' AND last_name = 'Thị B' LIMIT 1), (SELECT id FROM products WHERE slug = 'samsung-galaxy-s24' LIMIT 1), NULL, 1, 849.99, 'Quà sinh nhật'),
((SELECT id FROM profiles WHERE first_name = 'Nguyễn' AND last_name = 'Văn A' LIMIT 1), (SELECT id FROM products WHERE slug = 'ipad-pro-12-9' LIMIT 1), (SELECT id FROM product_variants WHERE sku = 'IPAD-PRO-12-9-256'), 1, 1049.99, 'Mua cho công việc thiết kế'),
((SELECT id FROM profiles WHERE first_name = 'Trần' AND last_name = 'Thị B' LIMIT 1), (SELECT id FROM products WHERE slug = 'airpods-pro-2' LIMIT 1), (SELECT id FROM product_variants WHERE sku = 'AIRPODS-PRO2-STD'), 1, 229.99, 'Mua cho tập thể dục');

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
 1849.98, 0.00, 0.00, 0.00, 1849.98, 'credit_card', 'paid', 'express', 'TRK-001-2024', 'Giao hàng giờ hành chính'),
('ORD-2024-002', (SELECT id FROM profiles WHERE first_name = 'Trần' AND last_name = 'Thị B' LIMIT 1), 'processing', NOW(),
 (SELECT id FROM user_addresses WHERE user_id = (SELECT id FROM profiles WHERE first_name = 'Trần' AND last_name = 'Thị B' LIMIT 1) AND address_type = 'shipping'),
 (SELECT id FROM user_addresses WHERE user_id = (SELECT id FROM profiles WHERE first_name = 'Trần' AND last_name = 'Thị B' LIMIT 1) AND address_type = 'billing'),
 849.99, 0.00, 0.00, 0.00, 849.99, 'bank_transfer', 'pending', 'standard', 'TRK-002-2024', 'Giao hàng cuối tuần');

-- =====================================================
-- 17. INSERT ORDER_ITEMS (CHI TIẾT ĐƠN HÀNG)
-- =====================================================
INSERT INTO order_items (order_id, product_id, variant_id, product_name, product_sku, quantity, unit_price, total_price) VALUES
((SELECT id FROM orders WHERE order_number = 'ORD-2024-001'), (SELECT id FROM products WHERE slug = 'macbook-air-m1' LIMIT 1), 
 (SELECT id FROM product_variants WHERE sku = 'MBA-M1-8-256'), 'MacBook Air M1', 'MBA-M1-8-256', 1, 899.99, 899.99),
((SELECT id FROM orders WHERE order_number = 'ORD-2024-001'), (SELECT id FROM products WHERE slug = 'iphone-15-pro' LIMIT 1),
 (SELECT id FROM product_variants WHERE sku = 'IPH-15PRO-128'), 'iPhone 15 Pro', 'IPH-15PRO-128', 1, 949.99, 949.99),
((SELECT id FROM orders WHERE order_number = 'ORD-2024-002'), (SELECT id FROM products WHERE slug = 'samsung-galaxy-s24' LIMIT 1),
 NULL, 'Samsung Galaxy S24', 'SMS-GS24-256', 1, 849.99, 849.99);

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
