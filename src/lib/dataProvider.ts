import { DataProvider } from '@refinedev/core';
import { supabase } from './supabase';

export const dataProvider: DataProvider = {
  getList: async ({ resource, pagination, filters, sorters }) => {
    console.log('🔍 getList called for resource:', resource);
    console.log('📋 Filters:', filters);
    console.log('📊 Sorters:', sorters);
    console.log('📄 Pagination:', pagination);
    
    let query;
    
    // Use regular client for all resources
    const client = supabase;
    
    // Special handling for products and blog posts to include category information
    if (resource === 'products') {
      query = client
        .from(resource)
        .select(`
          *,
          categories (
            id,
            name,
            slug,
            is_active
          )
        `, { count: 'exact' });
    } else if (resource === 'blog_posts') {
      query = client
        .from(resource)
        .select(`
          *,
          blog_categories (
            id,
            name,
            slug,
            is_active
          )
        `, { count: 'exact' });
    } else {
      query = client.from(resource).select('*', { count: 'exact' });
    }

    // Apply filters
    if (filters) {
      filters.forEach((filter) => {
        if (filter.operator === 'eq') {
          query = query.eq(filter.field, filter.value);
        } else if (filter.operator === 'contains') {
          query = query.ilike(filter.field, `%${filter.value}%`);
        } else if (filter.operator === 'gte') {
          query = query.gte(filter.field, filter.value);
        } else if (filter.operator === 'lte') {
          query = query.lte(filter.field, filter.value);
        }
      });
    }

    // Apply sorting
    if (sorters && sorters.length > 0) {
      const sorter = sorters[0];
      query = query.order(sorter.field, {
        ascending: sorter.order === 'asc',
      });
    }

    // Apply pagination
    if (pagination) {
      const { current = 1, pageSize = 10 } = pagination;
      const from = (current - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);
    }

    console.log('🚀 Executing query for:', resource);
    const { data, error, count } = await query;

    if (error) {
      console.error('❌ Supabase error:', error);
      throw new Error(`Failed to fetch ${resource}: ${error.message}`);
    }

    console.log(`✅ Successfully fetched ${data?.length || 0} ${resource}`);
    console.log('📊 Total count:', count);
    console.log('📊 Data sample:', data?.slice(0, 2));
    console.log('📊 Return object:', { data: data?.length || 0, total: count || 0 });

    return {
      data: data || [],
      total: count || 0,
    };
  },

  getOne: async ({ resource, id }) => {
    console.log('🔍 getOne called for resource:', resource, 'with ID:', id);
    
    let query;
    
    // Use admin client for media to bypass RLS issues
    const client = supabase;
    
    // Special handling for products to include category information
    if (resource === 'products') {
      query = client
        .from(resource)
        .select(`
          *,
          categories (
            id,
            name,
            slug,
            is_active
          )
        `)
        .eq('id', id)
        .single();
    } else if (resource === 'blog_posts') {
      query = client
        .from(resource)
        .select(`
          *,
          blog_categories (
            id,
            name,
            slug,
            is_active
          )
        `)
        .eq('id', id)
        .single();
    } else {
      query = client
        .from(resource)
        .select('*')
        .eq('id', id)
        .single();
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Supabase getOne error:', error);
      throw new Error(error.message);
    }

    console.log(`✅ Successfully fetched ${resource} with ID: ${id}`);
    console.log('📊 Data:', data);
    console.log('📊 Data type:', typeof data);
    console.log('📊 Data keys:', data ? Object.keys(data) : 'null');

    return {
      data,
    };
  },

  create: async ({ resource, variables }) => {
    // Use admin client for media to bypass RLS issues
    const client = supabase;
    
    // Xử lý array fields cho media resource
    let processedVariables = variables;
    if (resource === 'media') {
      const arrayFields = ['meta_keywords', 'backup_urls', 'ai_tags', 'visual_search_tags', 'voice_search_phrases'];
      processedVariables = Object.keys(variables).reduce((acc, key) => {
        const value = variables[key];
        
        // Xử lý các field có kiểu TEXT[] - chuyển từ string thành array
        if (arrayFields.includes(key)) {
          if (Array.isArray(value)) {
            // Nếu đã là array (từ Select mode="tags"), giữ nguyên
            acc[key] = value.filter(item => item && item.trim().length > 0);
          } else if (typeof value === 'string') {
            // Nếu là string, chuyển thành array
            acc[key] = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
          } else {
            acc[key] = value;
          }
        } else {
          acc[key] = value;
        }
        return acc;
      }, {} as any);
    }
    
    const { data, error } = await client
      .from(resource)
      .insert(processedVariables)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return {
      data,
    };
  },

  update: async ({ resource, id, variables }) => {
    // Use admin client for media to bypass RLS issues
    const client = supabase;
    
    // Xử lý array fields cho media resource
    let processedVariables = variables;
    if (resource === 'media') {
      const arrayFields = ['meta_keywords', 'backup_urls', 'ai_tags', 'visual_search_tags', 'voice_search_phrases'];
      processedVariables = Object.keys(variables).reduce((acc, key) => {
        const value = variables[key];
        
        // Xử lý các field có kiểu TEXT[] - chuyển từ string thành array
        if (arrayFields.includes(key)) {
          if (Array.isArray(value)) {
            // Nếu đã là array (từ Select mode="tags"), giữ nguyên
            acc[key] = value.filter(item => item && item.trim().length > 0);
          } else if (typeof value === 'string') {
            // Nếu là string, chuyển thành array
            acc[key] = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
          } else {
            acc[key] = value;
          }
        } else {
          acc[key] = value;
        }
        return acc;
      }, {} as any);
    }
    
    const { data, error } = await client
      .from(resource)
      .update(processedVariables)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return {
      data,
    };
  },

  deleteOne: async ({ resource, id }) => {
    console.log('🔍 deleteOne called for resource:', resource, 'with ID:', id);
    
    // Use admin client for media to bypass RLS issues
    const client = supabase;
    
    // Special handling for media resource - delete file from bucket first
    if (resource === 'media') {
      try {
        // Get media record to get file path
        const { data: mediaData, error: getError } = await client
          .from('media')
          .select('file_path, file_name')
          .eq('id', id)
          .single();
        
        if (getError) {
          console.error('❌ Error getting media data:', getError);
        } else if (mediaData?.file_path) {
          console.log('🗑️ Deleting file from bucket:', mediaData.file_path);
          
          // Delete file from Supabase Storage
          const { error: storageError } = await client.storage
            .from('media')
            .remove([mediaData.file_path]);
          
          if (storageError) {
            console.error('❌ Error deleting file from storage:', storageError);
            // Continue with database deletion even if storage deletion fails
          } else {
            console.log('✅ File deleted from storage successfully');
          }
        }
      } catch (error) {
        console.error('❌ Error in media deletion process:', error);
        // Continue with database deletion even if storage deletion fails
      }
    }
    
    // Delete from database
    const { error } = await client
      .from(resource)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Database deletion error:', error);
      throw new Error(error.message);
    }

    console.log(`✅ Successfully deleted ${resource} with ID: ${id}`);
    return {
      data: {},
    };
  },

  getMany: async ({ resource, ids }) => {
    // Use admin client for media to bypass RLS issues
    const client = supabase;
    
    const { data, error } = await client
      .from(resource)
      .select('*')
      .in('id', ids);

    if (error) {
      throw new Error(error.message);
    }

    return {
      data: data || [],
    };
  },

  createMany: async ({ resource, variables }) => {
    // Use admin client for media to bypass RLS issues
    const client = supabase;
    
    const { data, error } = await client
      .from(resource)
      .insert(variables)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return {
      data: data || [],
    };
  },

  updateMany: async ({ resource, ids, variables }) => {
    // Use admin client for media to bypass RLS issues
    const client = supabase;
    
    const { data, error } = await client
      .from(resource)
      .update(variables)
      .in('id', ids)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return {
      data: data || [],
    };
  },

  deleteMany: async ({ resource, ids }) => {
    console.log('🔍 deleteMany called for resource:', resource, 'with IDs:', ids);
    
    // Use admin client for media to bypass RLS issues
    const client = supabase;
    
    // Special handling for media resource - delete files from bucket first
    if (resource === 'media') {
      try {
        // Get media records to get file paths
        const { data: mediaData, error: getError } = await client
          .from('media')
          .select('file_path, file_name')
          .in('id', ids);
        
        if (getError) {
          console.error('❌ Error getting media data:', getError);
        } else if (mediaData && mediaData.length > 0) {
          const filePaths = mediaData
            .map(item => item.file_path)
            .filter(Boolean);
          
          if (filePaths.length > 0) {
            console.log('🗑️ Deleting files from bucket:', filePaths);
            
            // Delete files from Supabase Storage
            const { error: storageError } = await client.storage
              .from('media')
              .remove(filePaths);
            
            if (storageError) {
              console.error('❌ Error deleting files from storage:', storageError);
              // Continue with database deletion even if storage deletion fails
            } else {
              console.log('✅ Files deleted from storage successfully');
            }
          }
        }
      } catch (error) {
        console.error('❌ Error in media deletion process:', error);
        // Continue with database deletion even if storage deletion fails
      }
    }
    
    // Delete from database
    const { error } = await client
      .from(resource)
      .delete()
      .in('id', ids);

    if (error) {
      console.error('❌ Database deletion error:', error);
      throw new Error(error.message);
    }

    console.log(`✅ Successfully deleted ${ids.length} ${resource} records`);
    return {
      data: [],
    };
  },

  getApiUrl: () => {
    return '';
  },

  custom: async ({ url, method, filters, sorters, payload, query, headers }) => {
    // Handle custom API calls if needed
    throw new Error('Custom method not implemented');
  },
};
