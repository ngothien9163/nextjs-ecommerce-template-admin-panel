# 🚀 SEO System Complete Guide - Comprehensive Optimization

## 📋 Overview
This document consolidates all general SEO guides including optimization guide and website mapping for complete SEO implementation.

## 🎯 SEO Page Types & Implementation

### 1. Core SEO Page Types

#### **Homepage (page)**
**Purpose**: Main landing page with primary keywords
**URL Pattern**: `/`
**SEO Focus**: Brand keywords, main services, location

```sql
INSERT INTO seo_pages (
    page_type_id, page_url, page_title, meta_description, meta_keywords,
    og_title, og_description, og_image, schema_markup, is_active
) VALUES (
    (SELECT id FROM seo_page_types WHERE name = 'page'),
    '/',
    'Shop Online - Thương hiệu thời trang hàng đầu Việt Nam | Giá tốt, Giao nhanh',
    'Shop Online chuyên cung cấp thời trang nam nữ chất lượng cao, giá cả hợp lý. Giao hàng toàn quốc, thanh toán an toàn.',
    ARRAY['thời trang', 'shop online', 'quần áo nam', 'quần áo nữ'],
    'Shop Online - Thương hiệu thời trang hàng đầu Việt Nam',
    'Khám phá bộ sưu tập thời trang mới nhất với giá tốt nhất.',
    'https://example.com/images/og-homepage.jpg',
    '{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Shop Online",
        "url": "https://example.com",
        "description": "Thương hiệu thời trang hàng đầu Việt Nam"
    }',
    true
);
```

#### **Product Pages (product)**
**Purpose**: Individual product sales pages
**URL Pattern**: `/products/[slug]`
**SEO Focus**: Product-specific keywords, specifications, pricing

```sql
INSERT INTO seo_pages (
    page_type_id, page_url, page_title, meta_description, meta_keywords,
    reference_type, reference_id, schema_markup, core_web_vitals
) VALUES (
    (SELECT id FROM seo_page_types WHERE name = 'product'),
    '/products/iphone-15-pro',
    'iPhone 15 Pro 128GB - Chip A17 Pro, Camera 48MP | Shop Online',
    'iPhone 15 Pro với chip A17 Pro mạnh mẽ, camera 48MP chuyên nghiệp. Mua ngay với giá tốt nhất.',
    ARRAY['iphone 15 pro', 'iphone 15', 'apple', 'điện thoại'],
    'product', (SELECT id FROM products WHERE slug = 'iphone-15-pro'),
    '{
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "iPhone 15 Pro",
        "brand": {"@type": "Brand", "name": "Apple"},
        "offers": {
            "@type": "Offer",
            "price": "27990000",
            "priceCurrency": "VND",
            "availability": "https://schema.org/InStock"
        }
    }',
    '{"lcp": 2.0, "fid": 0.07, "cls": 0.04, "inp": 0.10, "ttfb": 0.7}',
    true
);
```

#### **Category Pages (category)**
**Purpose**: Product category browsing pages
**URL Pattern**: `/categories/[slug]`
**SEO Focus**: Category keywords, product ranges, navigation

```sql
INSERT INTO seo_pages (
    page_type_id, page_url, page_title, meta_description, meta_keywords,
    reference_type, reference_id, schema_markup
) VALUES (
    (SELECT id FROM seo_page_types WHERE name = 'category'),
    '/categories/dien-tu',
    'Điện tử & Công nghệ - Điện thoại, Laptop, Máy tính bảng | Shop Online',
    'Khám phá bộ sưu tập điện tử công nghệ đa dạng: điện thoại iPhone, Samsung, laptop MacBook, máy tính bảng iPad.',
    ARRAY['điện tử', 'điện thoại', 'laptop', 'máy tính bảng'],
    'category', (SELECT id FROM categories WHERE slug = 'dien-tu'),
    '{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Điện tử & Công nghệ",
        "description": "Bộ sưu tập sản phẩm điện tử công nghệ"
    }',
    true
);
```

#### **Blog Pages (blog)**
**Purpose**: Content marketing and SEO-driven articles
**URL Pattern**: `/blog/[slug]`
**SEO Focus**: Topic-specific keywords, content depth, author authority

```sql
INSERT INTO seo_pages (
    page_type_id, page_url, page_title, meta_description, meta_keywords,
    schema_markup, content_length, content_readability_score
) VALUES (
    (SELECT id FROM seo_page_types WHERE name = 'blog'),
    '/blog/huong-dan-chon-dien-thoai-phu-hop',
    'Hướng dẫn chọn điện thoại phù hợp 2025 - Tips từ chuyên gia | Shop Online',
    'Hướng dẫn chi tiết cách chọn điện thoại phù hợp với nhu cầu và ngân sách. Tư vấn từ chuyên gia công nghệ.',
    ARRAY['hướng dẫn chọn điện thoại', 'mua điện thoại', 'so sánh điện thoại'],
    '{
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Hướng dẫn chọn điện thoại phù hợp 2025",
        "author": {"@type": "Person", "name": "Nguyễn Văn A"},
        "datePublished": "2025-01-15",
        "articleSection": "Công nghệ"
    }',
    2500, 88,
    true
);
```

### 2. Advanced SEO Page Types

#### **User Profile Pages (user)**
**Purpose**: User-generated content and social proof
**URL Pattern**: `/user/profile`, `/user/orders`
**SEO Focus**: Trust signals, user engagement (typically noindex)

```sql
INSERT INTO seo_pages (
    page_type_id, page_url, page_title, meta_description,
    robots_directive, is_indexed
) VALUES (
    (SELECT id FROM seo_page_types WHERE name = 'user'),
    '/user/profile',
    'Hồ sơ người dùng - Shop Online',
    'Quản lý thông tin cá nhân, địa chỉ giao hàng, lịch sử mua hàng.',
    'noindex,nofollow', false
);
```

#### **System Pages (system)**
**Purpose**: Technical and functional pages
**URL Pattern**: `/404`, `/sitemap`, `/robots.txt`
**SEO Focus**: Crawlability, technical SEO

```sql
INSERT INTO seo_pages (
    page_type_id, page_url, page_title, meta_description,
    robots_directive, is_indexed
) VALUES (
    (SELECT id FROM seo_page_types WHERE name = 'system'),
    '/404',
    'Không tìm thấy trang - Shop Online',
    'Trang bạn tìm kiếm không tồn tại. Vui lòng quay lại trang chủ.',
    'noindex,nofollow', false
);
```

## 🏗️ Database Architecture

### Core Tables

#### **seo_page_types**
```sql
CREATE TABLE seo_page_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE, -- 'page', 'product', 'category', 'blog', 'user', 'system'
    display_name TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **seo_pages (Main SEO Table)**
```sql
CREATE TABLE seo_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Page identification
    page_type_id UUID REFERENCES seo_page_types(id),
    page_url TEXT NOT NULL UNIQUE,
    page_title TEXT NOT NULL,
    meta_description TEXT,
    meta_keywords TEXT[],

    -- Content references
    reference_type TEXT, -- 'product', 'category', 'blog', 'page'
    reference_id UUID,

    -- Social Media SEO
    og_title TEXT,
    og_description TEXT,
    og_image TEXT,
    og_type TEXT DEFAULT 'website',
    twitter_card TEXT DEFAULT 'summary_large_image',
    twitter_title TEXT,
    twitter_description TEXT,
    twitter_image TEXT,

    -- Technical SEO
    canonical_url TEXT,
    robots_directive TEXT DEFAULT 'index,follow',
    hreflang JSONB,

    -- Structured Data
    schema_markup JSONB,

    -- Performance & Analytics
    core_web_vitals JSONB,
    seo_score INTEGER DEFAULT 0,
    page_load_time DECIMAL(5,2),
    mobile_friendly_score INTEGER,
    accessibility_score INTEGER,
    content_length INTEGER,
    content_readability_score INTEGER,

    -- Advanced SEO (2025+)
    ai_relevance_score INTEGER,
    ml_ranking_factors JSONB,
    voice_search_optimized BOOLEAN DEFAULT false,
    visual_search_optimized BOOLEAN DEFAULT false,

    -- E-E-A-T
    experience_score INTEGER,
    expertise_score INTEGER,
    authoritativeness_score INTEGER,
    trust_score INTEGER,

    -- Status & Control
    is_active BOOLEAN DEFAULT true,
    is_indexed BOOLEAN DEFAULT true,
    is_ssl_secure BOOLEAN DEFAULT true,
    last_crawled_at TIMESTAMP WITH TIME ZONE,
    last_modified_at TIMESTAMP WITH TIME ZONE,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Helper Functions

#### **Auto-generate SEO for new content**
```sql
CREATE OR REPLACE FUNCTION auto_create_product_seo()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO seo_pages (
        page_type_id, page_url, page_title, meta_description, meta_keywords,
        reference_type, reference_id, og_title, og_description, og_image,
        schema_markup, is_active
    ) VALUES (
        (SELECT id FROM seo_page_types WHERE name = 'product'),
        '/products/' || NEW.slug,
        NEW.name || ' - ' || COALESCE(NEW.brand, '') || ' | Shop Online',
        COALESCE(NEW.short_description, NEW.description, 'Mua ngay với giá tốt nhất'),
        ARRAY[NEW.name, COALESCE(NEW.brand, ''), 'sản phẩm', 'mua sắm'],
        'product', NEW.id,
        NEW.name || ' - ' || COALESCE(NEW.brand, ''),
        COALESCE(NEW.short_description, NEW.description, 'Khám phá sản phẩm chất lượng'),
        COALESCE(NEW.image_url, 'https://example.com/images/default-product.jpg'),
        jsonb_build_object(
            '@context', 'https://schema.org',
            '@type', 'Product',
            'name', NEW.name,
            'brand', jsonb_build_object('@type', 'Brand', 'name', NEW.brand),
            'description', COALESCE(NEW.short_description, NEW.description),
            'offers', jsonb_build_object(
                '@type', 'Offer',
                'price', NEW.price,
                'priceCurrency', 'VND'
            )
        ),
        true
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-SEO creation
CREATE TRIGGER trigger_auto_create_product_seo
    AFTER INSERT ON products
    FOR EACH ROW
    EXECUTE FUNCTION auto_create_product_seo();
```

#### **SEO Score Calculation**
```sql
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
)
RETURNS INTEGER AS $$
DECLARE
    score INTEGER := 0;
    lcp_score DECIMAL;
    fid_score DECIMAL;
    cls_score DECIMAL;
BEGIN
    -- Meta description (15 points)
    IF p_meta_description IS NOT NULL AND length(p_meta_description) BETWEEN 120 AND 160 THEN
        score := score + 15;
    ELSIF p_meta_description IS NOT NULL THEN
        score := score + 10;
    END IF;

    -- Meta keywords (10 points)
    IF p_meta_keywords IS NOT NULL AND array_length(p_meta_keywords, 1) >= 3 THEN
        score := score + 10;
    ELSIF p_meta_keywords IS NOT NULL THEN
        score := score + 5;
    END IF;

    -- Schema markup (15 points)
    IF p_schema_markup IS NOT NULL THEN
        score := score + 15;
    END IF;

    -- Core Web Vitals (20 points)
    IF p_core_web_vitals IS NOT NULL THEN
        lcp_score := (p_core_web_vitals->>'lcp')::DECIMAL;
        fid_score := (p_core_web_vitals->>'fid')::DECIMAL;
        cls_score := (p_core_web_vitals->>'cls')::DECIMAL;

        IF lcp_score <= 2.5 THEN score := score + 7; END IF;
        IF fid_score <= 0.1 THEN score := score + 7; END IF;
        IF cls_score <= 0.1 THEN score := score + 6; END IF;
    END IF;

    -- Performance (10 points)
    IF p_page_load_time <= 3.0 THEN score := score + 5; END IF;
    IF p_mobile_friendly_score >= 80 THEN score := score + 5; END IF;

    -- Content quality (15 points)
    IF p_content_length >= 1000 THEN score := score + 5; END IF;
    IF p_accessibility_score >= 80 THEN score := score + 5; END IF;
    IF p_internal_links_count >= 5 THEN score := score + 5; END IF;

    -- Technical SEO (15 points)
    IF p_image_optimization_score >= 80 THEN score := score + 15; END IF;

    RETURN LEAST(score, 100);
END;
$$ LANGUAGE plpgsql;
```

## 🎨 Implementation Examples

### 1. Admin Panel SEO Management

#### **SEO Form Component**
```typescript
interface SEOFormData {
  page_title: string;
  meta_description: string;
  meta_keywords: string[];
  og_title: string;
  og_description: string;
  og_image: string;
  schema_markup: any;
  robots_directive: string;
  canonical_url: string;
}

const SEOForm: React.FC<{
  initialData?: Partial<SEOFormData>;
  onSubmit: (data: SEOFormData) => Promise<void>;
}> = ({ initialData, onSubmit }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: SEOFormData) => {
    try {
      // Validate data
      if (!values.page_title || values.page_title.length < 30) {
        throw new Error('Page title must be at least 30 characters');
      }

      if (!values.meta_description || values.meta_description.length < 120) {
        throw new Error('Meta description must be at least 120 characters');
      }

      await onSubmit(values);
      message.success('SEO data saved successfully!');
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialData}
      onFinish={handleSubmit}
    >
      <Form.Item
        name="page_title"
        label="Page Title"
        rules={[
          { required: true, message: 'Page title is required' },
          { min: 30, message: 'Page title must be at least 30 characters' },
          { max: 60, message: 'Page title must be less than 60 characters' }
        ]}
      >
        <Input
          placeholder="Enter SEO-optimized page title"
          showCount
          maxLength={60}
        />
      </Form.Item>

      <Form.Item
        name="meta_description"
        label="Meta Description"
        rules={[
          { required: true, message: 'Meta description is required' },
          { min: 120, message: 'Meta description must be at least 120 characters' },
          { max: 160, message: 'Meta description must be less than 160 characters' }
        ]}
      >
        <TextArea
          placeholder="Enter compelling meta description"
          showCount
          maxLength={160}
          rows={3}
        />
      </Form.Item>

      <Form.Item
        name="meta_keywords"
        label="Meta Keywords"
        rules={[
          { type: 'array', min: 3, message: 'At least 3 keywords required' }
        ]}
      >
        <Select
          mode="tags"
          placeholder="Enter SEO keywords"
          tokenSeparators={[',']}
        />
      </Form.Item>

      <Form.Item name="canonical_url" label="Canonical URL">
        <Input placeholder="https://example.com/canonical-url" />
      </Form.Item>

      <Form.Item name="robots_directive" label="Robots Directive">
        <Select defaultValue="index,follow">
          <Select.Option value="index,follow">Index, Follow</Select.Option>
          <Select.Option value="noindex,follow">No Index, Follow</Select.Option>
          <Select.Option value="index,nofollow">Index, No Follow</Select.Option>
          <Select.Option value="noindex,nofollow">No Index, No Follow</Select.Option>
        </Select>
      </Form.Item>

      <Divider>Social Media SEO</Divider>

      <Form.Item name="og_title" label="Open Graph Title">
        <Input placeholder="Title for Facebook sharing" />
      </Form.Item>

      <Form.Item name="og_description" label="Open Graph Description">
        <TextArea placeholder="Description for Facebook sharing" rows={2} />
      </Form.Item>

      <Form.Item name="og_image" label="Open Graph Image URL">
        <Input placeholder="https://example.com/og-image.jpg" />
      </Form.Item>

      <Divider>Structured Data</Divider>

      <Form.Item name="schema_markup" label="Schema.org JSON-LD">
        <TextArea
          placeholder="Enter JSON-LD structured data"
          rows={6}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save SEO Settings
        </Button>
      </Form.Item>
    </Form>
  );
};
```

### 2. Frontend SEO Integration

#### **SEO Head Component**
```typescript
interface SEOHeadProps {
  seoData: {
    page_title: string;
    meta_description: string;
    meta_keywords: string[];
    canonical_url?: string;
    robots_directive?: string;
    og_title?: string;
    og_description?: string;
    og_image?: string;
    schema_markup?: any;
  };
}

const SEOHead: React.FC<SEOHeadProps> = ({ seoData }) => {
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{seoData.page_title}</title>
      <meta name="description" content={seoData.meta_description} />
      {seoData.meta_keywords && (
        <meta name="keywords" content={seoData.meta_keywords.join(', ')} />
      )}

      {/* Canonical URL */}
      {seoData.canonical_url && (
        <link rel="canonical" href={seoData.canonical_url} />
      )}

      {/* Robots Directive */}
      {seoData.robots_directive && (
        <meta name="robots" content={seoData.robots_directive} />
      )}

      {/* Open Graph */}
      {seoData.og_title && (
        <meta property="og:title" content={seoData.og_title} />
      )}
      {seoData.og_description && (
        <meta property="og:description" content={seoData.og_description} />
      )}
      {seoData.og_image && (
        <meta property="og:image" content={seoData.og_image} />
      )}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Shop Online" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      {seoData.og_title && (
        <meta name="twitter:title" content={seoData.og_title} />
      )}
      {seoData.og_description && (
        <meta name="twitter:description" content={seoData.og_description} />
      )}
      {seoData.og_image && (
        <meta name="twitter:image" content={seoData.og_image} />
      )}

      {/* Structured Data */}
      {seoData.schema_markup && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(seoData.schema_markup)
          }}
        />
      )}
    </Head>
  );
};
```

#### **Page SEO Hook**
```typescript
const usePageSEO = (url: string) => {
  return useQuery({
    queryKey: ['seo', url],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('seo_pages')
        .select('*')
        .eq('page_url', url)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Usage in pages
const HomePage: NextPage = () => {
  const { data: seoData } = usePageSEO('/');

  return (
    <>
      <SEOHead seoData={seoData} />
      <div>
        {/* Page content */}
      </div>
    </>
  );
};
```

### 3. SEO Dashboard & Analytics

#### **SEO Performance Dashboard**
```typescript
const SEODashboard: React.FC = () => {
  const { data: seoStats } = useQuery({
    queryKey: ['seo-dashboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_seo_dashboard_stats');

      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="seo-dashboard">
      <h1>SEO Performance Dashboard</h1>

      <div className="stats-grid">
        <Card title="Average SEO Score">
          <Statistic
            value={seoStats?.avg_seo_score || 0}
            suffix="%"
            valueStyle={{ color: seoStats?.avg_seo_score >= 80 ? '#3f8600' : '#cf1322' }}
          />
        </Card>

        <Card title="Pages with Good Core Web Vitals">
          <Statistic
            value={seoStats?.good_cwv_count || 0}
            suffix={`/ ${seoStats?.total_pages || 0}`}
          />
        </Card>

        <Card title="Pages with Schema Markup">
          <Statistic
            value={seoStats?.schema_count || 0}
            suffix={`/ ${seoStats?.total_pages || 0}`}
          />
        </Card>

        <Card title="Mobile-Friendly Pages">
          <Statistic
            value={seoStats?.mobile_friendly_count || 0}
            suffix={`/ ${seoStats?.total_pages || 0}`}
          />
        </Card>
      </div>

      <Table
        dataSource={seoStats?.pages}
        columns={[
          {
            title: 'Page URL',
            dataIndex: 'page_url',
            key: 'page_url',
          },
          {
            title: 'SEO Score',
            dataIndex: 'seo_score',
            key: 'seo_score',
            render: (score: number) => (
              <Progress
                percent={score}
                size="small"
                status={score >= 80 ? 'success' : score >= 60 ? 'normal' : 'exception'}
              />
            ),
          },
          {
            title: 'Core Web Vitals',
            dataIndex: 'core_web_vitals',
            key: 'core_web_vitals',
            render: (cwv: any) => {
              const lcp = cwv?.lcp || 0;
              const fid = cwv?.fid || 0;
              const cls = cwv?.cls || 0;

              return (
                <div>
                  <Text>LCP: {lcp}s</Text><br />
                  <Text>FID: {fid}ms</Text><br />
                  <Text>CLS: {cls}</Text>
                </div>
              );
            },
          },
          {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
              <Button
                type="link"
                onClick={() => window.open(`/admin/seo/edit/${record.id}`, '_blank')}
              >
                Edit SEO
              </Button>
            ),
          },
        ]}
      />
    </div>
  );
};
```

## 📊 Advanced SEO Features

### 1. AI-Powered SEO Optimization

#### **AI Content Analysis**
```typescript
const analyzeContentWithAI = async (content: string, keywords: string[]) => {
  const response = await fetch('/api/ai/seo-analysis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, keywords })
  });

  const analysis = await response.json();

  return {
    readability_score: analysis.readability,
    keyword_density: analysis.density,
    content_quality: analysis.quality,
    suggested_improvements: analysis.suggestions,
    ai_relevance_score: analysis.relevance
  };
};
```

#### **Automated Meta Description Generation**
```typescript
const generateMetaDescription = async (content: string, title: string) => {
  const response = await fetch('/api/ai/meta-description', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, title })
  });

  const { description } = await response.json();
  return description;
};
```

### 2. Real-time SEO Monitoring

#### **Core Web Vitals Tracking**
```typescript
// Track CWV in real-time
const trackCoreWebVitals = () => {
  if (typeof window !== 'undefined') {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(console.log);
      getFID(console.log);
      getFCP(console.log);
      getLCP(console.log);
      getTTFB(console.log);
    });
  }
};

// Send CWV data to backend
const sendCWVData = async (metric: any) => {
  await supabase
    .from('seo_pages')
    .update({
      core_web_vitals: supabase.sql`core_web_vitals || ${JSON.stringify({
        [metric.name.toLowerCase()]: metric.value
      })}`
    })
    .eq('page_url', window.location.pathname);
};
```

### 3. SEO Automation Workflows

#### **Automated SEO Updates**
```typescript
const autoUpdateSEO = async (pageId: string) => {
  // Get current page data
  const { data: page } = await supabase
    .from('seo_pages')
    .select('*')
    .eq('id', pageId)
    .single();

  // Analyze content changes
  const contentAnalysis = await analyzeContentWithAI(page.content, page.meta_keywords);

  // Update SEO scores
  const newSEOScore = calculateAdvancedSEOScore({
    meta_description: page.meta_description,
    meta_keywords: page.meta_keywords,
    schema_markup: page.schema_markup,
    core_web_vitals: page.core_web_vitals,
    page_load_time: page.page_load_time,
    mobile_friendly_score: page.mobile_friendly_score,
    accessibility_score: page.accessibility_score,
    content_length: page.content_length,
    internal_links_count: page.internal_links_count,
    image_optimization_score: page.image_optimization_score
  });

  // Update database
  await supabase
    .from('seo_pages')
    .update({
      seo_score: newSEOScore,
      content_readability_score: contentAnalysis.readability_score,
      ai_relevance_score: contentAnalysis.ai_relevance_score,
      last_modified_at: new Date().toISOString()
    })
    .eq('id', pageId);
};
```

## 🚀 API Integration

### SEO Management Endpoints

```typescript
// Get SEO data for a page
GET /api/seo/pages?url=/products/iphone-15-pro

// Update SEO data
PUT /api/seo/pages/:id
Body: {
  "page_title": "New title",
  "meta_description": "New description",
  "meta_keywords": ["keyword1", "keyword2"],
  "og_title": "New OG title",
  "schema_markup": {...}
}

// Bulk update SEO
POST /api/seo/bulk-update
Body: {
  "pageIds": ["id1", "id2"],
  "updates": {
    "is_indexed": false,
    "robots_directive": "noindex,nofollow"
  }
}

// SEO analysis
POST /api/seo/analyze
Body: {
  "url": "/products/iphone-15-pro",
  "content": "page content...",
  "keywords": ["iphone", "apple"]
}

// Generate sitemap
GET /api/seo/sitemap.xml

// SEO dashboard stats
GET /api/seo/dashboard
```

### Response Formats

```typescript
// SEO data response
{
  "id": "uuid",
  "page_type_id": "uuid",
  "page_url": "/products/iphone-15-pro",
  "page_title": "iPhone 15 Pro 128GB - Chip A17 Pro, Camera 48MP | Shop Online",
  "meta_description": "iPhone 15 Pro với chip A17 Pro mạnh mẽ, camera 48MP chuyên nghiệp...",
  "meta_keywords": ["iphone 15 pro", "iphone 15", "apple", "điện thoại"],
  "canonical_url": "https://example.com/products/iphone-15-pro",
  "og_title": "iPhone 15 Pro - Camera 48MP",
  "og_description": "Khám phá iPhone 15 Pro với camera chuyên nghiệp",
  "og_image": "https://example.com/images/iphone-15-pro-og.jpg",
  "schema_markup": {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "iPhone 15 Pro",
    "offers": {
      "@type": "Offer",
      "price": "27990000",
      "priceCurrency": "VND"
    }
  },
  "seo_score": 85,
  "core_web_vitals": {
    "lcp": 2.1,
    "fid": 0.08,
    "cls": 0.05
  }
}
```

## 📈 Success Metrics & KPIs

### SEO Performance Indicators
- **Average SEO Score**: Target > 80
- **Core Web Vitals Compliance**: > 75% pages
- **Organic Search Traffic**: Month-over-month growth
- **Keyword Rankings**: Target top 10 for primary keywords
- **Click-Through Rate**: > 3% from search results
- **Conversion Rate**: From organic search traffic

### Content Quality Metrics
- **Content Length**: Average > 1000 words for blog posts
- **Readability Score**: Target > 70
- **Keyword Optimization**: Proper keyword density
- **Internal Linking**: > 3 internal links per page
- **Image Optimization**: All images < 500KB, proper alt text

### Technical SEO Metrics
- **Page Load Speed**: < 3 seconds
- **Mobile-Friendly Score**: > 90
- **HTTPS Security**: 100% pages
- **XML Sitemap**: Valid and up-to-date
- **Robots.txt**: Properly configured

## 🎯 Best Practices Summary

### Content Optimization
1. **Keyword Research**: Use tools like Google Keyword Planner, Ahrefs
2. **Content Structure**: H1, H2, H3 hierarchy with keywords
3. **Internal Linking**: Link to relevant pages within your site
4. **External Links**: Link to authoritative sources when relevant
5. **Content Freshness**: Regularly update existing content

### Technical SEO
1. **Site Speed**: Optimize images, use CDN, minify code
2. **Mobile Optimization**: Responsive design, mobile-friendly
3. **Schema Markup**: Implement structured data
4. **XML Sitemap**: Submit to Google Search Console
5. **Robots.txt**: Control crawler access

### Analytics & Monitoring
1. **Google Analytics**: Track organic traffic and user behavior
2. **Google Search Console**: Monitor search performance
3. **SEO Tools**: Use tools like SEMrush, Moz for tracking
4. **Regular Audits**: Monthly SEO audits and fixes
5. **Competitor Analysis**: Monitor competitor SEO strategies

---

*This document consolidates all general SEO guides from:*
- SEO_OPTIMIZATION_GUIDE.md
- SEO_WEBSITE_MAPPING.md