// Metadata configuration service - Database-driven metadata management

import { supabase } from './supabase';
import { ImageMetadataConfig } from './metadata-config';

export interface DatabaseMetadataConfig {
  id: string;
  environment: 'development' | 'staging' | 'production';
  client_code: string;
  config_name: string;
  default_copyright?: string;
  default_creator?: string;
  default_software?: string;
  default_license?: string;
  contact_email?: string;
  contact_website?: string;
  contact_phone?: string;
  company_name?: string;
  company_address?: string;
  brand_name?: string;
  rights_statement?: string;
  usage_terms?: string;
  default_density?: number;
  default_quality?: number;
  color_space?: string;
  site_url?: string;
  site_name?: string;
  default_keywords?: string[];
  custom_fields?: Record<string, any>;
  is_active: boolean;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export class MetadataConfigService {
  
  /**
   * Get metadata config for current environment and client
   */
  static async getCurrentConfig(
    environment?: string,
    clientCode?: string
  ): Promise<DatabaseMetadataConfig | null> {
    try {
      const env = environment || import.meta.env.MODE || 'development';
      const client = clientCode || import.meta.env.VITE_CLIENT_CODE || 'default';

      console.log(`🔍 Loading metadata config for: ${env}/${client}`);

      // Try to get specific client config first
      let { data, error } = await supabase
        .from('metadata_configs')
        .select('*')
        .eq('environment', env)
        .eq('client_code', client)
        .eq('is_active', true)
        .single();

      // If no specific client config, get default for environment
      if (error && client !== 'default') {
        console.log(`⚠️ No config for ${client}, falling back to default`);
        const result = await supabase
          .from('metadata_configs')
          .select('*')
          .eq('environment', env)
          .eq('client_code', 'default')
          .eq('is_active', true)
          .single();
        
        data = result.data;
        error = result.error;
      }

      if (error) {
        console.error('❌ Error loading metadata config:', error);
        return null;
      }

      console.log(`✅ Loaded metadata config: ${data.config_name}`);
      return data;
      
    } catch (error) {
      console.error('❌ Error in getCurrentConfig:', error);
      return null;
    }
  }

  /**
   * Convert database config to ImageMetadataConfig format
   */
  static convertToImageMetadataConfig(
    dbConfig: DatabaseMetadataConfig
  ): ImageMetadataConfig {
    return {
      title: '',
      description: '',
      copyright: dbConfig.default_copyright || '',
      creator: dbConfig.default_creator || '',
      artist: dbConfig.default_creator || '',
      credit: '',
      caption: '',
      contact: dbConfig.contact_email || '',
      website: dbConfig.contact_website || '',
      email: dbConfig.contact_email || '',
      software: dbConfig.default_software || '',
      processing软件: 'Next.js Admin Panel',
      keywords: dbConfig.default_keywords || [],
      subject: '',
      category: '',
      license: dbConfig.default_license || '',
      rightsStatement: dbConfig.rights_statement || '',
      usage: dbConfig.usage_terms || '',
      colorSpace: dbConfig.color_space || 'sRGB',
      orientation: 1,
      density: dbConfig.default_density || 300,
      customFields: {
        ...dbConfig.custom_fields,
        'CompanyName': dbConfig.company_name || '',
        'CompanyAddress': dbConfig.company_address || '',
        'BrandName': dbConfig.brand_name || '',
        'ContactPhone': dbConfig.contact_phone || '',
        'SiteURL': dbConfig.site_url || '',
        'SiteName': dbConfig.site_name || '',
        'Environment': dbConfig.environment,
        'ClientCode': dbConfig.client_code,
        'ConfigId': dbConfig.id,
        'LoadedAt': new Date().toISOString()
      }
    };
  }

  /**
   * Get all available configs
   */
  static async getAllConfigs(): Promise<DatabaseMetadataConfig[]> {
    try {
      const { data, error } = await supabase
        .from('v_active_metadata_configs')
        .select('*');

      if (error) {
        console.error('❌ Error loading all configs:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ Error in getAllConfigs:', error);
      return [];
    }
  }

  /**
   * Create new metadata config
   */
  static async createConfig(
    config: Omit<DatabaseMetadataConfig, 'id' | 'created_at' | 'updated_at'>
  ): Promise<DatabaseMetadataConfig | null> {
    try {
      const { data, error } = await supabase
        .from('metadata_configs')
        .insert(config)
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating config:', error);
        return null;
      }

      console.log(`✅ Created metadata config: ${data.config_name}`);
      return data;
    } catch (error) {
      console.error('❌ Error in createConfig:', error);
      return null;
    }
  }

  /**
   * Update metadata config
   */
  static async updateConfig(
    id: string,
    updates: Partial<DatabaseMetadataConfig>
  ): Promise<DatabaseMetadataConfig | null> {
    try {
      const { data, error } = await supabase
        .from('metadata_configs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating config:', error);
        return null;
      }

      console.log(`✅ Updated metadata config: ${data.config_name}`);
      return data;
    } catch (error) {
      console.error('❌ Error in updateConfig:', error);
      return null;
    }
  }

  /**
   * Delete metadata config
   */
  static async deleteConfig(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('metadata_configs')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Error deleting config:', error);
        return false;
      }

      console.log(`✅ Deleted metadata config: ${id}`);
      return true;
    } catch (error) {
      console.error('❌ Error in deleteConfig:', error);
      return false;
    }
  }

  /**
   * Set as default config for environment
   */
  static async setAsDefault(
    id: string,
    environment: string
  ): Promise<boolean> {
    try {
      // First, unset current default
      await supabase
        .from('metadata_configs')
        .update({ is_default: false })
        .eq('environment', environment)
        .eq('is_default', true);

      // Then set new default
      const { error } = await supabase
        .from('metadata_configs')
        .update({ is_default: true })
        .eq('id', id);

      if (error) {
        console.error('❌ Error setting default config:', error);
        return false;
      }

      console.log(`✅ Set as default config: ${id} for ${environment}`);
      return true;
    } catch (error) {
      console.error('❌ Error in setAsDefault:', error);
      return false;
    }
  }

  /**
   * Get config by environment and client with caching
   */
  static async getConfigWithCache(
    environment: string,
    clientCode: string,
    cacheDuration = 5 * 60 * 1000 // 5 minutes
  ): Promise<DatabaseMetadataConfig | null> {
    const cacheKey = `metadata_config_${environment}_${clientCode}`;
    const cached = this.getFromCache(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < cacheDuration) {
      console.log(`📱 Using cached config for ${environment}/${clientCode}`);
      return cached.data;
    }

    const config = await this.getCurrentConfig(environment, clientCode);
    if (config) {
      this.setToCache(cacheKey, config);
    }

    return config;
  }

  /**
   * Simple memory cache for configs
   */
  private static cache: Map<string, { data: any; timestamp: number }> = new Map();

  private static getFromCache(key: string) {
    return this.cache.get(key);
  }

  private static setToCache(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  /**
   * Clear cache
   */
  static clearCache() {
    this.cache.clear();
    console.log('🧹 Metadata config cache cleared');
  }
}

// Export singleton instance
export const metadataConfigService = MetadataConfigService;