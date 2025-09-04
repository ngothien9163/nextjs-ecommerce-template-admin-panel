import { supabase } from './supabase';

export interface SEOMediaData {
  media_id: string;
  context_type?: string;
  context_id?: string;
  alt_text_override?: string;
  title_override?: string;
  caption_override?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  schema_markup?: any;
  compression_ratio?: number;
  optimization_score?: number;
  responsive_images?: string;
  webp_version_url?: string;
  avif_version_url?: string;
  ai_alt_text?: string;
  ai_description?: string;
  ai_tags?: string[];
  ai_relevance_score?: number;
  visual_search_optimized?: boolean;
  visual_search_tags?: string[];
  voice_search_optimized?: boolean;
  voice_search_phrases?: string[];
  social_shares?: number;
  social_engagement?: number;
  click_through_rate?: number;
  impressions?: number;
  clicks?: number;
  alt_text_translations?: any;
  caption_translations?: any;
  auto_optimization_enabled?: boolean;
  manual_override?: boolean;
  is_active?: boolean;
}

export class SEOMediaService {
  /**
   * Create or update SEO data for media
   */
  static async saveSEOMediaData(seoData: SEOMediaData): Promise<any> {
    try {
      console.log('🔧 SEOMediaService - Saving SEO data:', seoData);

      // Check if SEO record already exists
      let query = supabase
        .from('seo_medias')
        .select('id')
        .eq('media_id', seoData.media_id)
        .eq('context_type', seoData.context_type || 'gallery');

      // Only add context_id filter if it's not null/undefined
      if (seoData.context_id) {
        query = query.eq('context_id', seoData.context_id);
      } else {
        query = query.is('context_id', null);
      }

      const { data: existingRecord, error: checkError } = await query.maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('❌ Error checking existing SEO record:', checkError);
        throw new Error(`Failed to check existing SEO record: ${checkError.message}`);
      }

      let result;
      if (existingRecord) {
        // Update existing record
        console.log('🔄 Updating existing SEO record:', existingRecord.id);
        const updateData: any = {
          ...seoData,
          updated_at: new Date().toISOString(),
        };

        // Handle context_id properly
        if (seoData.context_id === undefined) {
          // If context_id is undefined, don't include it in update
          delete updateData.context_id;
        }

        const { data, error } = await supabase
          .from('seo_medias')
          .update(updateData)
          .eq('id', existingRecord.id)
          .select()
          .single();

        if (error) {
          console.error('❌ Error updating SEO record:', error);
          throw new Error(`Failed to update SEO record: ${error.message}`);
        }

        result = data;
        console.log('✅ SEO record updated successfully:', data);
      } else {
        // Create new record
        console.log('📝 Creating new SEO record');
        const insertData = {
          ...seoData,
          context_type: seoData.context_type || 'gallery',
          is_active: seoData.is_active !== undefined ? seoData.is_active : true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Only include context_id if it's not null/undefined
        if (seoData.context_id) {
          insertData.context_id = seoData.context_id;
        }

        const { data, error } = await supabase
          .from('seo_medias')
          .insert(insertData)
          .select()
          .single();

        if (error) {
          console.error('❌ Error creating SEO record:', error);
          throw new Error(`Failed to create SEO record: ${error.message}`);
        }

        result = data;
        console.log('✅ SEO record created successfully:', data);
      }

      return result;
    } catch (error) {
      console.error('❌ SEOMediaService error:', error);
      throw error;
    }
  }

  /**
   * Get SEO data for media
   */
  static async getSEOMediaData(mediaId: string, contextType?: string, contextId?: string): Promise<any> {
    try {
      console.log('🔍 SEOMediaService - Getting SEO data for media:', mediaId);

      let query = supabase
        .from('seo_medias')
        .select('*')
        .eq('media_id', mediaId);

      if (contextType) {
        query = query.eq('context_type', contextType);
      }

      // Handle contextId properly
      if (contextId) {
        query = query.eq('context_id', contextId);
      } else if (contextId === null) {
        query = query.is('context_id', null);
      }

      const { data, error } = await query.maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error getting SEO data:', error);
        throw new Error(`Failed to get SEO data: ${error.message}`);
      }

      console.log('✅ SEO data retrieved:', data);
      return data;
    } catch (error) {
      console.error('❌ SEOMediaService error:', error);
      throw error;
    }
  }

  /**
   * Delete SEO data for media
   */
  static async deleteSEOMediaData(mediaId: string, contextType?: string, contextId?: string): Promise<void> {
    try {
      console.log('🗑️ SEOMediaService - Deleting SEO data for media:', mediaId);

      let query = supabase
        .from('seo_medias')
        .delete()
        .eq('media_id', mediaId);

      if (contextType) {
        query = query.eq('context_type', contextType);
      }

      // Handle contextId properly
      if (contextId) {
        query = query.eq('context_id', contextId);
      } else if (contextId === null) {
        query = query.is('context_id', null);
      }

      const { error } = await query;

      if (error) {
        console.error('❌ Error deleting SEO data:', error);
        throw new Error(`Failed to delete SEO data: ${error.message}`);
      }

      console.log('✅ SEO data deleted successfully');
    } catch (error) {
      console.error('❌ SEOMediaService error:', error);
      throw error;
    }
  }

  /**
   * Convert form data to SEO media data
   */
  static convertFormDataToSEOMedia(formData: any, mediaId: string): SEOMediaData {
    const seoData: SEOMediaData = {
      media_id: mediaId,
      context_type: 'gallery', // Default context for media files
    };

    // Only include fields that are defined and not null
    if (formData.og_title !== undefined && formData.og_title !== null) {
      seoData.og_title = formData.og_title;
    }
    if (formData.og_description !== undefined && formData.og_description !== null) {
      seoData.og_description = formData.og_description;
    }
    if (formData.og_image !== undefined && formData.og_image !== null) {
      seoData.og_image = formData.og_image;
    }
    if (formData.twitter_title !== undefined && formData.twitter_title !== null) {
      seoData.twitter_title = formData.twitter_title;
    }
    if (formData.twitter_description !== undefined && formData.twitter_description !== null) {
      seoData.twitter_description = formData.twitter_description;
    }
    if (formData.twitter_image !== undefined && formData.twitter_image !== null) {
      seoData.twitter_image = formData.twitter_image;
    }
    if (formData.schema_markup !== undefined && formData.schema_markup !== null) {
      seoData.schema_markup = formData.schema_markup;
    }
    if (formData.compression_ratio !== undefined && formData.compression_ratio !== null) {
      seoData.compression_ratio = formData.compression_ratio;
    }
    if (formData.optimization_score !== undefined && formData.optimization_score !== null) {
      seoData.optimization_score = formData.optimization_score;
    }
    if (formData.responsive_images !== undefined && formData.responsive_images !== null) {
      seoData.responsive_images = formData.responsive_images;
    }
    if (formData.webp_version_url !== undefined && formData.webp_version_url !== null) {
      seoData.webp_version_url = formData.webp_version_url;
    }
    if (formData.avif_version_url !== undefined && formData.avif_version_url !== null) {
      seoData.avif_version_url = formData.avif_version_url;
    }
    if (formData.ai_alt_text !== undefined && formData.ai_alt_text !== null) {
      seoData.ai_alt_text = formData.ai_alt_text;
    }
    if (formData.ai_description !== undefined && formData.ai_description !== null) {
      seoData.ai_description = formData.ai_description;
    }
    if (Array.isArray(formData.ai_tags) && formData.ai_tags.length > 0) {
      seoData.ai_tags = formData.ai_tags;
    }
    if (formData.ai_relevance_score !== undefined && formData.ai_relevance_score !== null) {
      seoData.ai_relevance_score = formData.ai_relevance_score;
    }
    if (formData.visual_search_optimized !== undefined && formData.visual_search_optimized !== null) {
      seoData.visual_search_optimized = formData.visual_search_optimized;
    }
    if (Array.isArray(formData.visual_search_tags) && formData.visual_search_tags.length > 0) {
      seoData.visual_search_tags = formData.visual_search_tags;
    }
    if (formData.voice_search_optimized !== undefined && formData.voice_search_optimized !== null) {
      seoData.voice_search_optimized = formData.voice_search_optimized;
    }
    if (Array.isArray(formData.voice_search_phrases) && formData.voice_search_phrases.length > 0) {
      seoData.voice_search_phrases = formData.voice_search_phrases;
    }
    if (formData.social_shares !== undefined && formData.social_shares !== null) {
      seoData.social_shares = formData.social_shares;
    }
    if (formData.social_engagement !== undefined && formData.social_engagement !== null) {
      seoData.social_engagement = formData.social_engagement;
    }
    if (formData.click_through_rate !== undefined && formData.click_through_rate !== null) {
      seoData.click_through_rate = formData.click_through_rate;
    }
    if (formData.impressions !== undefined && formData.impressions !== null) {
      seoData.impressions = formData.impressions;
    }
    if (formData.clicks !== undefined && formData.clicks !== null) {
      seoData.clicks = formData.clicks;
    }
    if (formData.alt_text_translations !== undefined && formData.alt_text_translations !== null) {
      seoData.alt_text_translations = formData.alt_text_translations;
    }
    if (formData.caption_translations !== undefined && formData.caption_translations !== null) {
      seoData.caption_translations = formData.caption_translations;
    }
    if (formData.auto_optimization_enabled !== undefined && formData.auto_optimization_enabled !== null) {
      seoData.auto_optimization_enabled = formData.auto_optimization_enabled;
    }
    if (formData.manual_override !== undefined && formData.manual_override !== null) {
      seoData.manual_override = formData.manual_override;
    }
    if (formData.is_active !== undefined && formData.is_active !== null) {
      seoData.is_active = formData.is_active;
    } else {
      seoData.is_active = true;
    }

    return seoData;
  }
}