-- =====================================================
-- TẠO BẢNG SEO HOÀN CHỈNH CHO DỰ ÁN E-COMMERCE (2025-2026+)
-- =====================================================

-- Xóa bảng cũ nếu tồn tại
DROP TABLE IF EXISTS seo_pages CASCADE;
DROP TABLE IF EXISTS seo_page_types CASCADE;

-- =====================================================
-- BẢNG 1: SEO PAGE TYPES
-- =====================================================
CREATE TABLE seo_page_types (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,                    -- 'page', 'product', 'category', 'user', 'system'
    display_name TEXT NOT NULL,                   -- 'Trang tĩnh', 'Sản phẩm', 'Danh mục', 'Người dùng', 'Hệ thống'
    description TEXT,                             -- Mô tả chi tiết loại trang
    is_active BOOLEAN DEFAULT true,               -- Trạng thái hoạt động
    sort_order INTEGER DEFAULT 0,                 -- Thứ tự sắp xếp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- BẢNG 2: SEO PAGES (HOÀN CHỈNH VỚI TẤT CẢ FIELDS 2025-2026+)
-- =====================================================
CREATE TABLE seo_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Thông tin cơ bản
    page_type_id INTEGER NOT NULL REFERENCES seo_page_types(id),
    page_url TEXT UNIQUE NOT NULL,                -- URL của trang (ví dụ: /shop-details/iphone-15)
    page_title TEXT NOT NULL,                     -- Tiêu đề trang (title tag)
    meta_description TEXT,                        -- Meta description
    meta_keywords TEXT[],                         -- Mảng từ khóa
    
    -- Thông tin tham chiếu
    reference_type TEXT NOT NULL,                 -- 'product', 'category', 'user', 'page', 'system', 'blog'
    reference_id UUID,                            -- ID của bảng tham chiếu (products.id, categories.id, etc.)
    
    -- Open Graph (Enhanced 2025+)
    og_title TEXT,                                -- Open Graph title
    og_description TEXT,                          -- Open Graph description
    og_image TEXT,                                -- Open Graph image URL
    og_type TEXT DEFAULT 'website',               -- Open Graph type
    og_site_name TEXT,                            -- Tên website
    og_locale TEXT DEFAULT 'vi_VN',               -- Ngôn ngữ
    og_audio TEXT,                                -- Audio file URL
    og_video TEXT,                                -- Video file URL
    
    -- Twitter Card (Enhanced 2025+)
    twitter_card TEXT DEFAULT 'summary_large_image',
    twitter_title TEXT,                           -- Twitter title
    twitter_description TEXT,                     -- Twitter description
    twitter_image TEXT,                           -- Twitter image URL
    twitter_creator TEXT,                         -- Twitter creator handle
    twitter_site TEXT,                            -- Twitter site handle
    
    -- Schema.org Structured Data
    schema_markup JSONB,                          -- JSON-LD structured data
    
    -- Core Web Vitals 2.0 (2025+)
    core_web_vitals JSONB,                        -- LCP, FID, CLS, INP, TTFB
    
    -- AI & ML SEO (2025+)
    ai_ml_metrics JSONB,                          -- AI relevance score, ML ranking factors
    
    -- E-E-A-T (2025+)
    eeat_metrics JSONB,                           -- Experience, Expertise, Authoritativeness, Trust
    
    -- Voice & Visual Search (2025+)
    voice_visual_metrics JSONB,                   -- Voice search optimization, visual search data
    
    -- Privacy & Compliance (2025+)
    privacy_compliance JSONB,                     -- GDPR, CCPA, privacy signals
    
    -- Future-proof fields (2026+)
    future_metrics JSONB,                         -- Quantum SEO, Neural networks, BCI, Spatial computing
    
    -- Thông tin kỹ thuật (Enhanced 2025+)
    canonical_url TEXT,                           -- Canonical URL
    robots_directive TEXT DEFAULT 'index,follow', -- Robots meta tag
    hreflang JSONB,                               -- Hreflang tags cho đa ngôn ngữ
    language TEXT DEFAULT 'vi',                   -- Ngôn ngữ chính của trang
    charset TEXT DEFAULT 'UTF-8',                 -- Character encoding
    viewport TEXT DEFAULT 'width=device-width, initial-scale=1', -- Viewport meta tag
    
    -- Thống kê và phân tích
    seo_score INTEGER DEFAULT 0,                  -- Điểm SEO tổng thể (0-100)
    keyword_difficulty INTEGER,                   -- Độ khó từ khóa (0-100)
    search_volume INTEGER,                        -- Lượt tìm kiếm hàng tháng
    
    -- Performance metrics (2025+)
    page_load_time DECIMAL(8,3),                  -- Thời gian tải trang (giây)
    mobile_friendly_score INTEGER,                -- Điểm thân thiện mobile (0-100)
    accessibility_score INTEGER,                  -- Điểm accessibility (0-100)
    core_web_vitals_score INTEGER,                -- Điểm Core Web Vitals (0-100)
    
    -- Social metrics (2025+)
    social_shares INTEGER DEFAULT 0,              -- Số lượt chia sẻ mạng xã hội
    social_engagement DECIMAL(8,2) DEFAULT 0,     -- Tỷ lệ tương tác mạng xã hội
    social_click_through_rate DECIMAL(5,2),       -- Tỷ lệ click qua mạng xã hội
    
    -- Content quality metrics (2025+)
    content_length INTEGER,                       -- Độ dài nội dung (số từ)
    content_readability_score INTEGER,            -- Điểm dễ đọc (0-100)
    content_freshness_score INTEGER,              -- Điểm cập nhật nội dung (0-100)
    
    -- Technical SEO metrics (2025+)
    internal_links_count INTEGER DEFAULT 0,       -- Số internal links
    external_links_count INTEGER DEFAULT 0,       -- Số external links
    broken_links_count INTEGER DEFAULT 0,         -- Số broken links
    image_optimization_score INTEGER,             -- Điểm tối ưu hình ảnh (0-100)
    
    -- Trạng thái
    is_active BOOLEAN DEFAULT true,               -- Trạng thái hoạt động
    is_featured BOOLEAN DEFAULT false,            -- Trang được ưu tiên SEO
    is_indexed BOOLEAN DEFAULT true,              -- Trang có được index hay không
    is_ssl_secure BOOLEAN DEFAULT true,           -- Trang có SSL hay không
    
    -- Thời gian
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ràng buộc (ĐÃ SỬA LỖI)
    CONSTRAINT valid_reference_type CHECK (reference_type IN ('product', 'category', 'user', 'page', 'system', 'blog')),
    CONSTRAINT valid_seo_score CHECK (seo_score >= 0 AND seo_score <= 100),
    CONSTRAINT valid_keyword_difficulty CHECK (keyword_difficulty >= 0 AND keyword_difficulty <= 100),
    CONSTRAINT valid_page_load_time CHECK (page_load_time >= 0 OR page_load_time IS NULL),
    CONSTRAINT valid_mobile_friendly_score CHECK (mobile_friendly_score >= 0 AND mobile_friendly_score <= 100 OR mobile_friendly_score IS NULL),
    CONSTRAINT valid_accessibility_score CHECK (accessibility_score >= 0 AND accessibility_score <= 100 OR accessibility_score IS NULL),
    CONSTRAINT valid_core_web_vitals_score CHECK (core_web_vitals_score >= 0 AND core_web_vitals_score <= 100 OR core_web_vitals_score IS NULL),
    CONSTRAINT valid_content_readability_score CHECK (content_readability_score >= 0 AND content_readability_score <= 100 OR content_readability_score IS NULL),
    CONSTRAINT valid_content_freshness_score CHECK (content_freshness_score >= 0 AND content_freshness_score <= 100 OR content_freshness_score IS NULL),
    CONSTRAINT valid_image_optimization_score CHECK (image_optimization_score >= 0 AND image_optimization_score <= 100 OR image_optimization_score IS NULL)
);

-- =====================================================
-- INDEXES HOÀN CHỈNH CHO HIỆU SUẤT
-- =====================================================

-- Index cho tìm kiếm theo loại trang
CREATE INDEX idx_seo_pages_page_type_id ON seo_pages(page_type_id);

-- Index cho tìm kiếm theo tham chiếu
CREATE INDEX idx_seo_pages_reference ON seo_pages(reference_type, reference_id);

-- Index cho URL
CREATE INDEX idx_seo_pages_url ON seo_pages(page_url);

-- Index cho từ khóa (GIN cho mảng)
CREATE INDEX idx_seo_pages_keywords ON seo_pages USING GIN(meta_keywords);

-- Index cho JSONB fields (GIN)
CREATE INDEX idx_seo_pages_schema_markup ON seo_pages USING GIN(schema_markup);
CREATE INDEX idx_seo_pages_core_web_vitals ON seo_pages USING GIN(core_web_vitals);
CREATE INDEX idx_seo_pages_ai_ml_metrics ON seo_pages USING GIN(ai_ml_metrics);
CREATE INDEX idx_seo_pages_eeat_metrics ON seo_pages USING GIN(eeat_metrics);
CREATE INDEX idx_seo_pages_voice_visual_metrics ON seo_pages USING GIN(voice_visual_metrics);
CREATE INDEX idx_seo_pages_privacy_compliance ON seo_pages USING GIN(privacy_compliance);
CREATE INDEX idx_seo_pages_future_metrics ON seo_pages USING GIN(future_metrics);
CREATE INDEX idx_seo_pages_hreflang ON seo_pages USING GIN(hreflang);

-- Index cho tìm kiếm theo điểm SEO
CREATE INDEX idx_seo_pages_seo_score ON seo_pages(seo_score DESC);

-- Index cho tìm kiếm theo từ khóa
CREATE INDEX idx_seo_pages_keyword_difficulty ON seo_pages(keyword_difficulty);

-- Index cho performance metrics (2025+)
CREATE INDEX idx_seo_pages_page_load_time ON seo_pages(page_load_time);
CREATE INDEX idx_seo_pages_mobile_friendly_score ON seo_pages(mobile_friendly_score);
CREATE INDEX idx_seo_pages_accessibility_score ON seo_pages(accessibility_score);
CREATE INDEX idx_seo_pages_core_web_vitals_score ON seo_pages(core_web_vitals_score);

-- Index cho social metrics (2025+)
CREATE INDEX idx_seo_pages_social_shares ON seo_pages(social_shares DESC);
CREATE INDEX idx_seo_pages_social_engagement ON seo_pages(social_engagement DESC);
CREATE INDEX idx_seo_pages_social_ctr ON seo_pages(social_click_through_rate);

-- Index cho content quality metrics (2025+)
CREATE INDEX idx_seo_pages_content_length ON seo_pages(content_length);
CREATE INDEX idx_seo_pages_content_readability ON seo_pages(content_readability_score);
CREATE INDEX idx_seo_pages_content_freshness ON seo_pages(content_freshness_score);

-- Index cho technical SEO metrics (2025+)
CREATE INDEX idx_seo_pages_internal_links ON seo_pages(internal_links_count);
CREATE INDEX idx_seo_pages_external_links ON seo_pages(external_links_count);
CREATE INDEX idx_seo_pages_broken_links ON seo_pages(broken_links_count);
CREATE INDEX idx_seo_pages_image_optimization ON seo_pages(image_optimization_score);

-- Index cho language và locale
CREATE INDEX idx_seo_pages_language ON seo_pages(language);
CREATE INDEX idx_seo_pages_og_locale ON seo_pages(og_locale);
CREATE INDEX idx_seo_pages_charset ON seo_pages(charset);

-- Index cho status fields
CREATE INDEX idx_seo_pages_is_indexed ON seo_pages(is_indexed);
CREATE INDEX idx_seo_pages_is_ssl_secure ON seo_pages(is_ssl_secure);

-- Composite indexes cho tìm kiếm nâng cao
CREATE INDEX idx_seo_pages_type_language ON seo_pages(page_type_id, language);
CREATE INDEX idx_seo_pages_score_performance ON seo_pages(seo_score DESC, page_load_time);
CREATE INDEX idx_seo_pages_mobile_accessibility ON seo_pages(mobile_friendly_score DESC, accessibility_score DESC);
CREATE INDEX idx_seo_pages_content_quality ON seo_pages(content_readability_score DESC, content_freshness_score DESC);
CREATE INDEX idx_seo_pages_social_performance ON seo_pages(social_shares DESC, social_engagement DESC);
CREATE INDEX idx_seo_pages_technical_seo ON seo_pages(image_optimization_score DESC, internal_links_count);

-- Index cho Open Graph và Twitter fields
CREATE INDEX idx_seo_pages_og_site_name ON seo_pages(og_site_name);
CREATE INDEX idx_seo_pages_twitter_creator ON seo_pages(twitter_creator);
CREATE INDEX idx_seo_pages_twitter_site ON seo_pages(twitter_site);

-- =====================================================
-- TRIGGER CẬP NHẬT THỜI GIAN
-- =====================================================
CREATE OR REPLACE FUNCTION update_seo_pages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_seo_pages_updated_at
    BEFORE UPDATE ON seo_pages
    FOR EACH ROW
    EXECUTE FUNCTION update_seo_pages_updated_at();

-- =====================================================
-- FUNCTIONS TIỆN ÍCH NÂNG CAO (2025+)
-- =====================================================

-- Function tính điểm SEO tự động nâng cao
CREATE OR REPLACE FUNCTION calculate_advanced_seo_score(
    p_meta_description TEXT,
    p_meta_keywords TEXT[],
    p_schema_markup JSONB,
    p_core_web_vitals JSONB,
    p_page_load_time DECIMAL,
    p_mobile_friendly_score INTEGER,
    p_accessibility_score INTEGER,
    p_content_length INTEGER,
    p_internal_links_count INTEGER,
    p_image_optimization_score INTEGER
) RETURNS INTEGER AS $$
DECLARE
    score INTEGER := 0;
BEGIN
    -- Điểm cho meta description
    IF p_meta_description IS NOT NULL AND length(p_meta_description) BETWEEN 120 AND 160 THEN
        score := score + 15;
    END IF;
    
    -- Điểm cho từ khóa
    IF p_meta_keywords IS NOT NULL AND array_length(p_meta_keywords, 1) > 0 THEN
        score := score + 10;
    END IF;
    
    -- Điểm cho schema markup
    IF p_schema_markup IS NOT NULL THEN
        score := score + 15;
    END IF;
    
    -- Điểm cho Core Web Vitals
    IF p_core_web_vitals IS NOT NULL THEN
        score := score + 10;
    END IF;
    
    -- Điểm cho performance
    IF p_page_load_time IS NOT NULL AND p_page_load_time < 3.0 THEN
        score := score + 10;
    ELSIF p_page_load_time IS NOT NULL AND p_page_load_time < 5.0 THEN
        score := score + 5;
    END IF;
    
    -- Điểm cho mobile friendly
    IF p_mobile_friendly_score IS NOT NULL AND p_mobile_friendly_score >= 80 THEN
        score := score + 10;
    END IF;
    
    -- Điểm cho accessibility
    IF p_accessibility_score IS NOT NULL AND p_accessibility_score >= 80 THEN
        score := score + 10;
    END IF;
    
    -- Điểm cho content length
    IF p_content_length IS NOT NULL AND p_content_length >= 300 THEN
        score := score + 5;
    END IF;
    
    -- Điểm cho internal links
    IF p_internal_links_count IS NOT NULL AND p_internal_links_count >= 3 THEN
        score := score + 5;
    END IF;
    
    -- Điểm cho image optimization
    IF p_image_optimization_score IS NOT NULL AND p_image_optimization_score >= 80 THEN
        score := score + 5;
    END IF;
    
    -- Điểm cơ bản
    score := score + 5;
    
    RETURN LEAST(score, 100);
END;
$$ LANGUAGE plpgsql;

-- Function tìm kiếm trang theo từ khóa nâng cao
CREATE OR REPLACE FUNCTION search_seo_pages_advanced(
    search_term TEXT,
    min_seo_score INTEGER DEFAULT 0,
    max_page_load_time DECIMAL DEFAULT NULL,
    min_mobile_score INTEGER DEFAULT 0
) RETURNS TABLE(
    id UUID,
    page_url TEXT,
    page_title TEXT,
    meta_description TEXT,
    seo_score INTEGER,
    page_load_time DECIMAL,
    mobile_friendly_score INTEGER,
    relevance_score INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sp.id,
        sp.page_url,
        sp.page_title,
        sp.meta_description,
        sp.seo_score,
        sp.page_load_time,
        sp.mobile_friendly_score,
        CASE 
            WHEN sp.page_title ILIKE '%' || search_term || '%' THEN 100
            WHEN sp.meta_description ILIKE '%' || search_term || '%' THEN 80
            WHEN sp.meta_keywords @> ARRAY[search_term] THEN 90
            ELSE 50
        END AS relevance_score
    FROM seo_pages sp
    WHERE sp.is_active = true
      AND sp.seo_score >= min_seo_score
      AND (max_page_load_time IS NULL OR sp.page_load_time <= max_page_load_time)
      AND sp.mobile_friendly_score >= min_mobile_score
      AND (
          sp.page_title ILIKE '%' || search_term || '%'
          OR sp.meta_description ILIKE '%' || search_term || '%'
          OR sp.meta_keywords @> ARRAY[search_term]
      )
    ORDER BY relevance_score DESC, sp.seo_score DESC;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- VIEWS CHO BÁO CÁO NÂNG CAO (2025+)
-- =====================================================

-- View tổng quan SEO nâng cao
CREATE OR REPLACE VIEW seo_overview_advanced AS
SELECT 
    spt.name as page_type,
    spt.display_name as page_type_display,
    COUNT(sp.id) as total_pages,
    AVG(sp.seo_score) as avg_seo_score,
    AVG(sp.page_load_time) as avg_page_load_time,
    AVG(sp.mobile_friendly_score) as avg_mobile_score,
    AVG(sp.accessibility_score) as avg_accessibility_score,
    COUNT(CASE WHEN sp.seo_score >= 80 THEN 1 END) as high_score_pages,
    COUNT(CASE WHEN sp.seo_score < 50 THEN 1 END) as low_score_pages,
    COUNT(CASE WHEN sp.page_load_time < 3.0 THEN 1 END) as fast_pages,
    COUNT(CASE WHEN sp.page_load_time > 5.0 THEN 1 END) as slow_pages
FROM seo_page_types spt
LEFT JOIN seo_pages sp ON spt.id = sp.page_type_id
WHERE sp.is_active = true OR sp.id IS NULL
GROUP BY spt.id, spt.name, spt.display_name
ORDER BY spt.sort_order;

-- View trang cần cải thiện SEO chi tiết
CREATE OR REPLACE VIEW seo_improvement_detailed AS
SELECT 
    sp.id,
    sp.page_url,
    sp.page_title,
    sp.seo_score,
    spt.display_name as page_type,
    sp.page_load_time,
    sp.mobile_friendly_score,
    sp.accessibility_score,
    sp.content_length,
    sp.internal_links_count,
    sp.image_optimization_score,
    CASE 
        WHEN sp.meta_description IS NULL THEN 'Thiếu meta description'
        WHEN sp.schema_markup IS NULL THEN 'Thiếu schema markup'
        WHEN sp.core_web_vitals IS NULL THEN 'Thiếu Core Web Vitals'
        WHEN sp.page_load_time > 5.0 THEN 'Trang tải chậm'
        WHEN sp.mobile_friendly_score < 70 THEN 'Kém thân thiện mobile'
        WHEN sp.accessibility_score < 70 THEN 'Kém accessibility'
        WHEN sp.content_length < 300 THEN 'Nội dung quá ngắn'
        WHEN sp.internal_links_count < 3 THEN 'Thiếu internal links'
        WHEN sp.image_optimization_score < 70 THEN 'Hình ảnh chưa tối ưu'
        ELSE 'Cần cải thiện tổng thể'
    END as improvement_area,
    CASE 
        WHEN sp.seo_score >= 80 THEN 'Tốt'
        WHEN sp.seo_score >= 60 THEN 'Trung bình'
        ELSE 'Kém'
    END as seo_grade
FROM seo_pages sp
JOIN seo_page_types spt ON sp.page_type_id = spt.id
WHERE sp.is_active = true 
  AND sp.seo_score < 80
ORDER BY sp.seo_score ASC;

-- =====================================================
-- COMMENTS HOÀN CHỈNH CHO BẢNG VÀ CỘT
-- =====================================================

COMMENT ON TABLE seo_page_types IS 'Bảng định nghĩa các loại trang cho SEO';
COMMENT ON COLUMN seo_page_types.id IS 'ID tự động tăng';
COMMENT ON COLUMN seo_page_types.name IS 'Tên loại trang (ví dụ: page, product, category)';
COMMENT ON COLUMN seo_page_types.display_name IS 'Tên hiển thị bằng tiếng Việt';
COMMENT ON COLUMN seo_page_types.description IS 'Mô tả chi tiết loại trang';
COMMENT ON COLUMN seo_page_types.is_active IS 'Trạng thái hoạt động của loại trang';
COMMENT ON COLUMN seo_page_types.sort_order IS 'Thứ tự sắp xếp hiển thị';
COMMENT ON COLUMN seo_page_types.created_at IS 'Thời gian tạo loại trang';

COMMENT ON TABLE seo_pages IS 'Bảng lưu trữ tất cả thông tin SEO cho các trang (2025-2026+)';
COMMENT ON COLUMN seo_pages.id IS 'ID duy nhất của bản ghi SEO';
COMMENT ON COLUMN seo_pages.page_type_id IS 'Tham chiếu đến loại trang';
COMMENT ON COLUMN seo_pages.page_url IS 'URL của trang cần SEO';
COMMENT ON COLUMN seo_pages.page_title IS 'Tiêu đề trang (title tag)';
COMMENT ON COLUMN seo_pages.meta_description IS 'Mô tả meta cho trang';
COMMENT ON COLUMN seo_pages.meta_keywords IS 'Mảng từ khóa SEO';
COMMENT ON COLUMN seo_pages.reference_type IS 'Loại bảng tham chiếu (product, category, user, page, system, blog)';
COMMENT ON COLUMN seo_pages.reference_id IS 'ID của bảng tham chiếu';
COMMENT ON COLUMN seo_pages.og_title IS 'Tiêu đề Open Graph';
COMMENT ON COLUMN seo_pages.og_description IS 'Mô tả Open Graph';
COMMENT ON COLUMN seo_pages.og_image IS 'Hình ảnh Open Graph';
COMMENT ON COLUMN seo_pages.og_type IS 'Loại Open Graph';
COMMENT ON COLUMN seo_pages.og_site_name IS 'Tên website Open Graph';
COMMENT ON COLUMN seo_pages.og_locale IS 'Ngôn ngữ Open Graph';
COMMENT ON COLUMN seo_pages.og_audio IS 'Audio file URL Open Graph';
COMMENT ON COLUMN seo_pages.og_video IS 'Video file URL Open Graph';
COMMENT ON COLUMN seo_pages.twitter_card IS 'Loại Twitter Card';
COMMENT ON COLUMN seo_pages.twitter_title IS 'Tiêu đề Twitter';
COMMENT ON COLUMN seo_pages.twitter_description IS 'Mô tả Twitter';
COMMENT ON COLUMN seo_pages.twitter_image IS 'Hình ảnh Twitter';
COMMENT ON COLUMN seo_pages.twitter_creator IS 'Tác giả Twitter';
COMMENT ON COLUMN seo_pages.twitter_site IS 'Trang Twitter';
COMMENT ON COLUMN seo_pages.schema_markup IS 'Dữ liệu có cấu trúc Schema.org (JSON-LD)';
COMMENT ON COLUMN seo_pages.core_web_vitals IS 'Chỉ số Core Web Vitals 2.0 (LCP, FID, CLS, INP, TTFB)';
COMMENT ON COLUMN seo_pages.ai_ml_metrics IS 'Chỉ số AI & ML SEO (AI relevance, ML ranking factors)';
COMMENT ON COLUMN seo_pages.eeat_metrics IS 'Chỉ số E-E-A-T (Experience, Expertise, Authoritativeness, Trust)';
COMMENT ON COLUMN seo_pages.voice_visual_metrics IS 'Chỉ số Voice & Visual Search';
COMMENT ON COLUMN seo_pages.privacy_compliance IS 'Chỉ số Privacy & Compliance (GDPR, CCPA)';
COMMENT ON COLUMN seo_pages.future_metrics IS 'Chỉ số tương lai (Quantum SEO, Neural networks, BCI, Spatial computing)';
COMMENT ON COLUMN seo_pages.canonical_url IS 'URL canonical của trang';
COMMENT ON COLUMN seo_pages.robots_directive IS 'Chỉ thị robots meta tag';
COMMENT ON COLUMN seo_pages.hreflang IS 'Thẻ hreflang cho đa ngôn ngữ';
COMMENT ON COLUMN seo_pages.language IS 'Ngôn ngữ chính của trang';
COMMENT ON COLUMN seo_pages.charset IS 'Character encoding của trang';
COMMENT ON COLUMN seo_pages.viewport IS 'Viewport meta tag của trang';
COMMENT ON COLUMN seo_pages.seo_score IS 'Điểm SEO tổng thể (0-100)';
COMMENT ON COLUMN seo_pages.keyword_difficulty IS 'Độ khó từ khóa (0-100)';
COMMENT ON COLUMN seo_pages.search_volume IS 'Lượt tìm kiếm hàng tháng';
COMMENT ON COLUMN seo_pages.page_load_time IS 'Thời gian tải trang (giây)';
COMMENT ON COLUMN seo_pages.mobile_friendly_score IS 'Điểm thân thiện mobile (0-100)';
COMMENT ON COLUMN seo_pages.accessibility_score IS 'Điểm accessibility (0-100)';
COMMENT ON COLUMN seo_pages.core_web_vitals_score IS 'Điểm Core Web Vitals (0-100)';
COMMENT ON COLUMN seo_pages.social_shares IS 'Số lượt chia sẻ mạng xã hội';
COMMENT ON COLUMN seo_pages.social_engagement IS 'Tỷ lệ tương tác mạng xã hội';
COMMENT ON COLUMN seo_pages.social_click_through_rate IS 'Tỷ lệ click qua mạng xã hội';
COMMENT ON COLUMN seo_pages.content_length IS 'Độ dài nội dung (số từ)';
COMMENT ON COLUMN seo_pages.content_readability_score IS 'Điểm dễ đọc (0-100)';
COMMENT ON COLUMN seo_pages.content_freshness_score IS 'Điểm cập nhật nội dung (0-100)';
COMMENT ON COLUMN seo_pages.internal_links_count IS 'Số internal links';
COMMENT ON COLUMN seo_pages.external_links_count IS 'Số external links';
COMMENT ON COLUMN seo_pages.broken_links_count IS 'Số broken links';
COMMENT ON COLUMN seo_pages.image_optimization_score IS 'Điểm tối ưu hình ảnh (0-100)';
COMMENT ON COLUMN seo_pages.is_active IS 'Trạng thái hoạt động của trang SEO';
COMMENT ON COLUMN seo_pages.is_featured IS 'Trang được ưu tiên SEO';
COMMENT ON COLUMN seo_pages.is_indexed IS 'Trang có được index hay không';
COMMENT ON COLUMN seo_pages.is_ssl_secure IS 'Trang có SSL hay không';
COMMENT ON COLUMN seo_pages.created_at IS 'Thời gian tạo bản ghi SEO';
COMMENT ON COLUMN seo_pages.updated_at IS 'Thời gian cập nhật bản ghi SEO';

COMMENT ON FUNCTION calculate_advanced_seo_score IS 'Tính điểm SEO tự động nâng cao dựa trên nhiều yếu tố (2025+)';
COMMENT ON FUNCTION search_seo_pages_advanced IS 'Tìm kiếm trang SEO nâng cao với nhiều bộ lọc (2025+)';
COMMENT ON VIEW seo_overview_advanced IS 'Tổng quan SEO nâng cao với performance metrics (2025+)';
COMMENT ON VIEW seo_improvement_detailed IS 'Danh sách trang cần cải thiện SEO chi tiết (2025+)';

-- =====================================================
-- HOÀN THÀNH TẠO BẢNG SEO HOÀN CHỈNH (2025-2026+)
-- =====================================================
