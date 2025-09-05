import { supabase } from './supabase';
import { supabaseAdmin } from './supabase-admin';
import type { SEOPage, BlogPost } from './supabase';

export interface BlogPostWithSEO extends BlogPost {
  seo_data?: Partial<SEOPage>;
}

export const blogPostService = {
  /**
   * Tạo blog post mới với SEO data
   */
  async createBlogPost(blogPostData: Partial<BlogPost>, seoData?: Partial<SEOPage>) {
    try {
      console.log('📝 [createBlogPost] Creating new blog post...');
      console.log('📝 [createBlogPost] Blog post data:', blogPostData);
      console.log('📊 [createBlogPost] SEO data:', seoData);
      
      // 1. Tạo blog post trước - sử dụng admin client để bypass RLS
      const { data: blogPost, error: blogError } = await supabaseAdmin
        .from('blog_posts')
        .insert([blogPostData])
        .select()
        .single();

      if (blogError || !blogPost) {
        console.error('❌ [createBlogPost] Failed to create blog post:', blogError);
        throw new Error(`Failed to create blog post: ${blogError?.message}`);
      }
      
      console.log('✅ [createBlogPost] Blog post created successfully:', blogPost.id);

      // 2. Nếu có SEO data, tạo SEO page
      if (seoData && Object.keys(seoData).length > 0) {
        console.log('📊 [createBlogPost] Creating SEO data...');
        try {
          await this.upsertSEOPage(blogPost.id, blogPost.slug, seoData);
          console.log('✅ [createBlogPost] SEO data created successfully');
        } catch (seoError) {
          console.error('❌ [createBlogPost] SEO creation failed:', seoError);
          // Don't fail the whole operation if SEO creation fails
          console.warn('⚠️ [createBlogPost] Continuing despite SEO creation failure');
        }
      }

      return blogPost;
    } catch (error) {
      console.error('❌ [createBlogPost] Fatal error:', error);
      throw error;
    }
  },

  /**
   * Cập nhật blog post với SEO data
   */
  async updateBlogPost(id: string, blogPostData: Partial<BlogPost>, seoData?: Partial<SEOPage>) {
    try {
      console.log('📝 [updateBlogPost] SAVE - Starting update for ID:', id);
      console.log('📝 [updateBlogPost] SAVE - featured_image_id:', blogPostData.featured_image_id);
      
      // Kiểm tra blog post có tồn tại không trước khi update
      console.log('🔍 [updateBlogPost] Checking if blog post exists...');
      const { data: existingPost, error: checkError } = await supabase
        .from('blog_posts')
        .select('id, slug, title')
        .eq('id', id)
        .maybeSingle();
        
      if (checkError) {
        console.error('❌ [updateBlogPost] Error checking blog post existence:', checkError);
        throw new Error(`Error checking blog post: ${checkError.message}`);
      }
      
      if (!existingPost) {
        console.error('❌ [updateBlogPost] Blog post not found with ID:', id);
        throw new Error(`Blog post with ID ${id} not found in database`);
      }
      
      console.log('✅ [updateBlogPost] Found existing blog post:', existingPost);
      
      // 1. Cập nhật blog post - chỉ cập nhật các field không null/undefined
      const cleanBlogPostData = Object.keys(blogPostData).reduce((acc, key) => {
        const value = blogPostData[key];
        // Only include non-null, non-undefined values
        if (value !== null && value !== undefined && value !== '') {
          acc[key] = value;
        }
        return acc;
      }, {} as any);
      
      console.log('🧹 [updateBlogPost] SAVE - Cleaned data, featured_image_id:', cleanBlogPostData.featured_image_id);

      // Check if featured_image_id exists and is valid
      if (cleanBlogPostData.featured_image_id) {
        console.log('🔍 [updateBlogPost] Checking if media record exists...');
        const { data: mediaRecord, error: mediaError } = await supabase
          .from('medias')
          .select('id, file_name')
          .eq('id', cleanBlogPostData.featured_image_id)
          .maybeSingle();

        if (mediaError) {
          console.error('❌ [updateBlogPost] Error checking media record:', mediaError);
        } else if (!mediaRecord) {
          console.error('❌ [updateBlogPost] Media record not found with ID:', cleanBlogPostData.featured_image_id);
          // Remove invalid featured_image_id from update payload
          delete cleanBlogPostData.featured_image_id;
          console.log('⚠️ [updateBlogPost] Removed invalid featured_image_id from update payload');
        } else {
          console.log('✅ [updateBlogPost] Media record exists:', mediaRecord.file_name);
        }
      }

      // Always perform the update, even if no changes (to ensure we get the latest data)
      console.log('🔄 [updateBlogPost] Performing update...');
      
      // First, let's try a simpler approach - check if we can update with minimal data
      const updatePayload = Object.keys(cleanBlogPostData).length > 0 
        ? cleanBlogPostData 
        : { updated_at: new Date().toISOString() }; // Force an update with timestamp
      
      console.log('📋 [updateBlogPost] SAVE - Final payload, featured_image_id:', updatePayload.featured_image_id);
      
      console.log('🔄 [updateBlogPost] Executing Supabase update query...');
      console.log('🔄 [updateBlogPost] Update payload keys:', Object.keys(updatePayload));
      console.log('🔄 [updateBlogPost] Update payload values:', Object.values(updatePayload));

      // Try different approaches for the update
      console.log('🔄 [updateBlogPost] Attempting update with explicit select...');
      
      // First try with regular client
      let updatedPost, blogError;
      const { data: regularUpdate, error: regularError } = await supabase
        .from('blog_posts')
        .update(updatePayload)
        .eq('id', id)
        .select('id, title, slug, featured_image_id, updated_at');

      console.log('🔄 [updateBlogPost] Regular client update result:', regularUpdate);
      console.log('🔄 [updateBlogPost] Regular client update error:', regularError);
      
      // If regular client fails or returns empty, try admin client
      if (regularError || !regularUpdate || regularUpdate.length === 0) {
        console.log('🔄 [updateBlogPost] Regular client failed, trying admin client...');
        
        const { data: adminUpdateResult, error: adminUpdateError } = await supabaseAdmin
          .from('blog_posts')
          .update(updatePayload)
          .eq('id', id)
          .select('id, title, slug, featured_image_id, updated_at');
          
        console.log('🔄 [updateBlogPost] Admin client update result:', adminUpdateResult);
        console.log('🔄 [updateBlogPost] Admin client update error:', adminUpdateError);
        
        updatedPost = adminUpdateResult;
        blogError = adminUpdateError;
        
        if (adminUpdateError) {
          console.error('❌ [updateBlogPost] Admin client also failed:', adminUpdateError);
        }
      } else {
        updatedPost = regularUpdate;
        blogError = regularError;
      }

      console.log('🔄 [updateBlogPost] Final update result - data:', updatedPost);
      console.log('🔄 [updateBlogPost] Final update result - error:', blogError);
      console.log('🔄 [updateBlogPost] Update result type:', typeof updatedPost);
      console.log('🔄 [updateBlogPost] Update result length:', Array.isArray(updatedPost) ? updatedPost.length : 'not array');

      if (blogError) {
        console.error('❌ [updateBlogPost] Blog post update error:', blogError);
        
        // Handle specific PGRST116 error
        if (blogError.code === 'PGRST116') {
          console.error('❌ [updateBlogPost] PGRST116 - No rows affected. Possible causes:');
          console.error('  - Supabase credentials not configured properly');
          console.error('  - RLS policy blocking the update');
          console.error('  - Record was deleted by another process');
          
          // Try to fetch the record again to confirm it still exists
          const { data: recheckPost, error: recheckError } = await supabase
            .from('blog_posts')
            .select('id, title')
            .eq('id', id)
            .maybeSingle();
            
          if (recheckError) {
            throw new Error(`Database connection error: ${recheckError.message}. Please check Supabase configuration.`);
          } else if (!recheckPost) {
            throw new Error('Blog post was deleted during the update process');
          } else {
            throw new Error('Update failed - this is likely due to incorrect Supabase configuration or RLS policy restrictions. Please check your .env.local file and Supabase dashboard settings.');
          }
        }
        
        throw new Error(`Failed to update blog post: ${blogError.message}`);
      }
      
      // Handle different response formats from Supabase
      let finalPost;
      if (Array.isArray(updatedPost)) {
        finalPost = updatedPost.length > 0 ? updatedPost[0] : null;
        console.log('📊 [updateBlogPost] Updated post is array, first item:', finalPost);
      } else {
        finalPost = updatedPost;
        console.log('📊 [updateBlogPost] Updated post is object:', finalPost);
      }

      console.log('📊 [updateBlogPost] Final post featured_image_id:', finalPost?.featured_image_id);

      // If no data returned, try to fetch the updated record manually
      if (!finalPost || (Array.isArray(updatedPost) && updatedPost.length === 0)) {
        console.log('⚠️ [updateBlogPost] No data returned from update or empty array, fetching manually...');
        console.log('🔍 [updateBlogPost] This might indicate RLS policy issues or database triggers');
        
        const { data: fetchedPost, error: fetchError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        console.log('🔍 [updateBlogPost] Manual fetch result - data:', fetchedPost);
        console.log('🔍 [updateBlogPost] Manual fetch result - error:', fetchError);
        console.log('🔍 [updateBlogPost] Manual fetch - featured_image_id:', fetchedPost?.featured_image_id);

        if (fetchError) {
          console.error('❌ [updateBlogPost] Error fetching updated post:', fetchError);
          throw new Error(`Failed to fetch updated blog post: ${fetchError.message}`);
        }

        if (!fetchedPost) {
          console.error('❌ [updateBlogPost] Blog post not found after update');
          throw new Error('Blog post not found after update - this might indicate a database issue');
        }

        finalPost = fetchedPost;
        console.log('✅ [updateBlogPost] Successfully fetched updated post manually');
        
        // Double-check if the update actually happened
        if (updatePayload.featured_image_id && fetchedPost.featured_image_id !== updatePayload.featured_image_id) {
          console.error('❌ [updateBlogPost] CRITICAL: featured_image_id update failed!');
          console.error('❌ [updateBlogPost] Expected:', updatePayload.featured_image_id);
          console.error('❌ [updateBlogPost] Actual:', fetchedPost.featured_image_id);
          console.error('❌ [updateBlogPost] This indicates RLS policy or constraint issues');
          
          // Try a direct update on just the featured_image_id
          console.log('🔄 [updateBlogPost] Attempting direct featured_image_id update...');
          const { data: directUpdate, error: directError } = await supabase
            .from('blog_posts')
            .update({ featured_image_id: updatePayload.featured_image_id })
            .eq('id', id)
            .select('id, featured_image_id');
            
          console.log('🔄 [updateBlogPost] Direct update result:', directUpdate);
          console.log('🔄 [updateBlogPost] Direct update error:', directError);
          
          if (directError) {
            console.error('❌ [updateBlogPost] Direct update failed, trying with admin client...');
            
            // Try with admin client as last resort
            const { data: adminUpdate, error: adminError } = await supabaseAdmin
              .from('blog_posts')
              .update({ featured_image_id: updatePayload.featured_image_id })
              .eq('id', id)
              .select('id, featured_image_id');
              
            console.log('🔄 [updateBlogPost] Admin update result:', adminUpdate);
            console.log('🔄 [updateBlogPost] Admin update error:', adminError);
            
            if (adminError) {
              console.error('❌ [updateBlogPost] Admin update also failed:', adminError.message);
              throw new Error(`Featured image update failed with both regular and admin clients: ${adminError.message}`);
            }
            
            if (adminUpdate && adminUpdate.length > 0) {
              console.log('✅ [updateBlogPost] Admin update successful!');
            }
          } else if (!directUpdate || directUpdate.length === 0) {
            console.error('❌ [updateBlogPost] Direct update returned no data, trying with admin client...');
            
            // Even if no error, if no data returned, try admin client
            const { data: adminUpdate, error: adminError } = await supabaseAdmin
              .from('blog_posts')
              .update({ featured_image_id: updatePayload.featured_image_id })
              .eq('id', id)
              .select('id, featured_image_id');
              
            console.log('🔄 [updateBlogPost] Admin fallback update result:', adminUpdate);
            console.log('🔄 [updateBlogPost] Admin fallback update error:', adminError);
            
            if (adminError) {
              console.error('❌ [updateBlogPost] Admin fallback also failed:', adminError.message);
              throw new Error(`Featured image update failed: ${adminError.message}`);
            }
            
            if (adminUpdate && adminUpdate.length > 0) {
              console.log('✅ [updateBlogPost] Admin fallback update successful!');
            } else {
              console.error('❌ [updateBlogPost] Admin fallback also returned empty result');
              throw new Error('Featured image update failed: All update attempts returned no data');
            }
          }
          
          // Fetch again after direct update
          const { data: finalFetch } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('id', id)
            .maybeSingle();
            
          if (finalFetch) {
            finalPost = finalFetch;
            console.log('✅ [updateBlogPost] Final fetch successful, featured_image_id:', finalPost.featured_image_id);
          }
        }
      }
      
      console.log('✅ [updateBlogPost] SAVE - Success! Updated featured_image_id:', finalPost.featured_image_id);

      // 2. Nếu có SEO data, upsert SEO page
      if (seoData && Object.keys(seoData).length > 0) {
        console.log('📊 [updateBlogPost] Updating SEO data...');
        try {
          await this.upsertSEOPage(finalPost.id, finalPost.slug, seoData);
          console.log('✅ [updateBlogPost] SEO data updated successfully');
        } catch (seoError) {
          console.error('❌ [updateBlogPost] SEO update failed:', seoError);
          // Don't fail the whole operation if SEO update fails
          console.warn('⚠️ [updateBlogPost] Continuing despite SEO update failure');
        }
      }

      return finalPost;
    } catch (error) {
      console.error('❌ [updateBlogPost] Fatal error:', error);
      throw error;
    }
  },

  /**
   * Lấy blog post với SEO data
   */
  async getBlogPostWithSEO(id: string): Promise<BlogPostWithSEO | null> {
    try {
      // 1. Lấy blog post
      const { data: blogPost, error: blogError } = await supabase
        .from('blog_posts')
        .select(`
          *,
          blog_categories (
            id,
            name,
            slug,
            color,
            is_active
          )
        `)
        .eq('id', id)
        .maybeSingle(); // Use maybeSingle to avoid PGRST116 error

      if (blogError) {
        console.error('Error fetching blog post:', blogError);
        throw new Error(`Failed to fetch blog post: ${blogError.message}`);
      }
      
      if (!blogPost) {
        console.error('Blog post not found with ID:', id);
        return null;
      }

      // 2. Lấy SEO data - sử dụng admin client
      const { data: seoData, error: seoError } = await supabaseAdmin
        .from('seo_pages')
        .select('*')
        .eq('reference_type', 'blog')
        .eq('reference_id', id)
        .maybeSingle(); // Use maybeSingle instead of single
        
      if (seoError) {
        console.error('Error fetching SEO data:', seoError);
        // Don't throw error for SEO data, just log it
        console.warn('SEO data not found or error occurred, proceeding without SEO data');
      }

      return {
        ...blogPost,
        seo_data: seoData || undefined
      };
    } catch (error) {
      console.error('Error getting blog post with SEO:', error);
      throw error; // Re-throw to be handled by the caller
    }
  },

  /**
   * Upsert SEO page data
   */
  async upsertSEOPage(blogPostId: string, slug: string, seoData: Partial<SEOPage>) {
    try {
      console.log('📊 Upserting SEO page for blog post:', blogPostId);
      
      // Lấy page_type_id cho blog - sử dụng admin client
      const { data: pageType, error: pageTypeError } = await supabaseAdmin
        .from('seo_page_types')
        .select('id')
        .eq('name', 'blog')
        .maybeSingle(); // Use maybeSingle to avoid PGRST116 error

      if (pageTypeError) {
        console.error('❌ Error fetching page type:', pageTypeError);
        throw new Error(`Failed to fetch page type: ${pageTypeError.message}`);
      }

      let pageTypeId = pageType?.id;
      
      if (!pageType) {
        console.log('➕ Creating blog page type...');
        // Tạo page type cho blog nếu chưa có - sử dụng admin client
        const { data: newPageType, error: createError } = await supabaseAdmin
          .from('seo_page_types')
          .insert([{
            name: 'blog',
            display_name: 'Blog Posts',
            description: 'SEO pages for blog posts',
            is_active: true,
            sort_order: 6
          }])
          .select()
          .maybeSingle();

        if (createError) {
          console.error('❌ Error creating page type:', createError);
          throw new Error(`Failed to create blog page type: ${createError.message}`);
        }
        
        if (!newPageType) {
          throw new Error('Failed to create blog page type - no data returned');
        }
        
        pageTypeId = newPageType.id;
        console.log('✅ Created blog page type with ID:', pageTypeId);
      }

      // Default to 6 if still not found
      if (!pageTypeId) {
        pageTypeId = 6;
        console.log('⚠️ Using default page type ID:', pageTypeId);
      }

      // Chuẩn bị dữ liệu SEO - lọc bỏ các field null/undefined
      const cleanSeoData = Object.keys(seoData).reduce((acc, key) => {
        const value = seoData[key as keyof SEOPage];
        if (value !== null && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {} as any);
      
      const seoPageData: Partial<SEOPage> = {
        page_type_id: pageTypeId,
        page_url: cleanSeoData.page_url || `/blog/${slug}`,
        page_title: cleanSeoData.page_title || '',
        meta_description: cleanSeoData.meta_description || '',
        meta_keywords: cleanSeoData.meta_keywords || [],
        reference_type: 'blog',
        reference_id: blogPostId,
        og_title: cleanSeoData.og_title || cleanSeoData.page_title,
        og_description: cleanSeoData.og_description || cleanSeoData.meta_description,
        og_image: cleanSeoData.og_image || '',
        og_type: cleanSeoData.og_type || 'article',
        twitter_card: cleanSeoData.twitter_card || 'summary_large_image',
        twitter_title: cleanSeoData.twitter_title || cleanSeoData.page_title,
        twitter_description: cleanSeoData.twitter_description || cleanSeoData.meta_description,
        schema_markup: cleanSeoData.schema_markup || {},
        canonical_url: cleanSeoData.canonical_url || '',
        robots_directive: cleanSeoData.robots_directive || 'index,follow',
        language: cleanSeoData.language || 'vi',
        charset: cleanSeoData.charset || 'UTF-8',
        seo_score: cleanSeoData.seo_score || 75,
        mobile_friendly_score: cleanSeoData.mobile_friendly_score || 85,
        accessibility_score: cleanSeoData.accessibility_score || 80,
        content_length: cleanSeoData.content_length || 0,
        is_active: cleanSeoData.is_active !== undefined ? cleanSeoData.is_active : true,
        is_featured: cleanSeoData.is_featured || false,
        is_indexed: cleanSeoData.is_indexed !== undefined ? cleanSeoData.is_indexed : true,
        is_ssl_secure: cleanSeoData.is_ssl_secure !== undefined ? cleanSeoData.is_ssl_secure : true,
        ...cleanSeoData
      };
      
      console.log('🧹 Final SEO page data:', seoPageData);

      // Kiểm tra xem có SEO page tồn tại không - sử dụng admin client
      const { data: existingSEO, error: checkSeoError } = await supabaseAdmin
        .from('seo_pages')
        .select('id')
        .eq('reference_type', 'blog')
        .eq('reference_id', blogPostId)
        .maybeSingle(); // Sử dụng maybeSingle() thay vì single()
        
      if (checkSeoError) {
        console.error('❌ Error checking existing SEO:', checkSeoError);
        throw new Error(`Failed to check existing SEO: ${checkSeoError.message}`);
      }
        
      let result;
      if (existingSEO) {
        console.log('🔄 Updating existing SEO page:', existingSEO.id);
        // Update existing SEO page - sử dụng admin client
        const { data, error } = await supabaseAdmin
          .from('seo_pages')
          .update(seoPageData)
          .eq('id', existingSEO.id)
          .select()
          .maybeSingle(); // Use maybeSingle to avoid PGRST116 error
          
        if (error) {
          console.error('❌ Error updating SEO page:', error);
          throw new Error(`Failed to update SEO data: ${error.message}`);
        }
        
        if (!data) {
          throw new Error('SEO page update failed - record not found or no changes made');
        }
        
        result = data;
      } else {
        console.log('➕ Creating new SEO page');
        // Insert new SEO page - sử dụng admin client
        const { data, error } = await supabaseAdmin
          .from('seo_pages')
          .insert([seoPageData])
          .select()
          .maybeSingle(); // Use maybeSingle for consistency
          
        if (error) {
          console.error('❌ Error inserting SEO page:', error);
          throw new Error(`Failed to insert SEO data: ${error.message}`);
        }
        
        if (!data) {
          throw new Error('SEO page creation failed - no data returned');
        }
        
        result = data;
      }
      
      console.log('✅ SEO page upserted successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ Error in upsertSEOPage:', error);
      throw error;
    }
  },

  /**
   * Xóa blog post và SEO data
   */
  async deleteBlogPost(id: string) {
    try {
      console.log('🗑️ [deleteBlogPost] Deleting blog post and SEO data:', id);
      
      // 1. Xóa SEO page trước (vì có foreign key) - sử dụng admin client
      const { error: seoError } = await supabaseAdmin
        .from('seo_pages')
        .delete()
        .eq('reference_type', 'blog')
        .eq('reference_id', id);
        
      if (seoError) {
        console.error('❌ [deleteBlogPost] Failed to delete SEO data:', seoError);
        // Continue with blog post deletion even if SEO deletion fails
      } else {
        console.log('✅ [deleteBlogPost] SEO data deleted successfully');
      }

      // 2. Xóa blog post - sử dụng admin client
      const { error: blogError } = await supabaseAdmin
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (blogError) {
        console.error('❌ [deleteBlogPost] Failed to delete blog post:', blogError);
        throw new Error(`Failed to delete blog post: ${blogError.message}`);
      }
      
      console.log('✅ [deleteBlogPost] Blog post deleted successfully');
      return true;
    } catch (error) {
      console.error('❌ [deleteBlogPost] Fatal error:', error);
      throw error;
    }
  },

  /**
   * Tạo SEO data thông minh từ blog post
   */
  generateSmartSEO(blogPost: Partial<BlogPost>, categoryName?: string): Partial<SEOPage> {
    const title = blogPost.title || '';
    const excerpt = blogPost.excerpt || '';
    const content = blogPost.content || '';
    const slug = blogPost.slug || '';

    // Tạo page title tối ưu SEO
    const pageTitle = title.length <= 50 
      ? `${title} | Blog`
      : `${title.substring(0, 47)}... | Blog`;

    // Tạo meta description
    const metaDescription = excerpt 
      ? (excerpt.length <= 160 ? excerpt : excerpt.substring(0, 157) + '...')
      : (content.length > 0 ? content.substring(0, 157) + '...' : '');

    // Tạo keywords từ title và category
    const keywords = [
      ...title.toLowerCase().split(' ').filter(word => word.length > 3),
      ...(categoryName ? [categoryName.toLowerCase()] : []),
      'blog', 'bài viết'
    ].slice(0, 10);

    // Tạo schema markup cho blog post
    const schemaMarkup = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'headline': title,
      'description': metaDescription,
      'author': {
        '@type': 'Person',
        'name': 'Admin'
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'Website',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://example.com/logo.png'
        }
      },
      'datePublished': blogPost.created_at || new Date().toISOString(),
      'dateModified': blogPost.updated_at || new Date().toISOString(),
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': `https://example.com/blog/${slug}`
      }
    };

    return {
      page_url: `/blog/${slug}`,
      page_title: pageTitle,
      meta_description: metaDescription,
      meta_keywords: keywords,
      og_title: title,
      og_description: metaDescription,
      og_type: 'article',
      twitter_card: 'summary_large_image',
      twitter_title: title,
      twitter_description: metaDescription,
      schema_markup: schemaMarkup,
      language: 'vi',
      charset: 'UTF-8',
      robots_directive: 'index,follow',
      seo_score: 75,
      mobile_friendly_score: 85,
      accessibility_score: 80,
      content_length: content.length,
      is_active: true,
      is_indexed: true,
      is_ssl_secure: true
    };
  }
};