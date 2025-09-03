-- =====================================================
-- TEST BLOG_POSTS DATA VÀ SỬA LỖI HIỂN THỊ
-- =====================================================

-- 1. Kiểm tra dữ liệu blog_posts hiện tại
SELECT 
    '=== KIỂM TRA DỮ LIỆU BLOG_POSTS ===' as info;

SELECT 
    id,
    title,
    slug,
    status,
    is_featured,
    category_id,
    author_id,
    created_at
FROM blog_posts 
ORDER BY created_at DESC;

-- 2. Kiểm tra blog_categories
SELECT 
    '=== KIỂM TRA BLOG_CATEGORIES ===' as info;

SELECT 
    id,
    name,
    slug,
    is_active
FROM blog_categories 
ORDER BY sort_order;

-- 3. Kiểm tra profiles (authors)
SELECT 
    '=== KIỂM TRA AUTHORS ===' as info;

SELECT 
    id,
    first_name,
    last_name,
    email,
    role
FROM profiles 
WHERE role IN ('admin', 'moderator', 'author')
ORDER BY created_at;

-- 4. Kiểm tra join query (giống như data provider)
SELECT 
    '=== KIỂM TRA JOIN QUERY ===' as info;

SELECT 
    bp.*,
    bc.id as category_id_joined,
    bc.name as category_name,
    bc.slug as category_slug,
    bc.is_active as category_active
FROM blog_posts bp
LEFT JOIN blog_categories bc ON bp.category_id = bc.id
ORDER BY bp.created_at DESC
LIMIT 5;

-- 5. Kiểm tra foreign key constraints
SELECT 
    '=== KIỂM TRA FOREIGN KEY ISSUES ===' as info;

-- Blog posts without valid category
SELECT 
    bp.id,
    bp.title,
    bp.category_id,
    'Missing category' as issue
FROM blog_posts bp
LEFT JOIN blog_categories bc ON bp.category_id = bc.id
WHERE bc.id IS NULL;

-- Blog posts without valid author
SELECT 
    bp.id,
    bp.title,
    bp.author_id,
    'Missing author' as issue
FROM blog_posts bp
LEFT JOIN profiles p ON bp.author_id = p.id
WHERE p.id IS NULL;

SELECT '✅ Hoàn thành kiểm tra blog_posts!' as status;