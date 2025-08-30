import { DataProvider } from '@refinedev/core';
import { supabase } from './supabase';

export const dataProvider: DataProvider = {
  getList: async ({ resource, pagination, filters, sorters }) => {
    console.log('🔍 getList called for resource:', resource);
    console.log('📋 Filters:', filters);
    console.log('📊 Sorters:', sorters);
    console.log('📄 Pagination:', pagination);
    
    let query;
    
    // Special handling for products and blog posts to include category information
    if (resource === 'products') {
      query = supabase
        .from(resource)
        .select(`
          *,
          categories (
            id,
            name,
            slug,
            is_active
          )
        `);
    } else if (resource === 'blog_posts') {
      query = supabase
        .from(resource)
        .select(`
          *,
          blog_categories (
            id,
            name,
            slug,
            is_active
          )
        `);
    } else {
      query = supabase.from(resource).select('*');
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
    console.log('📊 Data sample:', data?.slice(0, 2));

    return {
      data: data || [],
      total: count || 0,
    };
  },

  getOne: async ({ resource, id }) => {
    console.log('🔍 getOne called for resource:', resource, 'with ID:', id);
    
    let query;
    
    // Special handling for products to include category information
    if (resource === 'products') {
      query = supabase
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
      query = supabase
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
      query = supabase
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
    const { data, error } = await supabase
      .from(resource)
      .insert(variables)
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
    const { data, error } = await supabase
      .from(resource)
      .update(variables)
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
    const { error } = await supabase
      .from(resource)
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    return {
      data: {},
    };
  },

  getMany: async ({ resource, ids }) => {
    const { data, error } = await supabase
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
    const { data, error } = await supabase
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
    const { data, error } = await supabase
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
    const { error } = await supabase
      .from(resource)
      .delete()
      .in('id', ids);

    if (error) {
      throw new Error(error.message);
    }

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
