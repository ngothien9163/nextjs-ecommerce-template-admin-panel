-- Create metadata configuration table
-- This allows dynamic metadata configuration per environment/client

CREATE TABLE IF NOT EXISTS metadata_configs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Environment and client identification
  environment VARCHAR(50) NOT NULL DEFAULT 'production', -- production, staging, development
  client_code VARCHAR(100) NOT NULL DEFAULT 'default', -- company-a, company-b, default
  config_name VARCHAR(200) NOT NULL, -- friendly name for admin
  
  -- Basic metadata
  default_copyright TEXT,
  default_creator TEXT,
  default_software TEXT,
  default_license TEXT,
  
  -- Contact information
  contact_email TEXT,
  contact_website TEXT,
  contact_phone TEXT,
  
  -- Company information
  company_name TEXT,
  company_address TEXT,
  brand_name TEXT,
  
  -- Rights and licensing
  rights_statement TEXT,
  usage_terms TEXT,
  
  -- Technical settings
  default_density INTEGER DEFAULT 300,
  default_quality INTEGER DEFAULT 85,
  color_space VARCHAR(50) DEFAULT 'sRGB',
  
  -- SEO settings
  site_url TEXT,
  site_name TEXT,
  default_keywords TEXT[], -- Array of keywords
  
  -- Custom fields (JSON for flexibility)
  custom_fields JSONB DEFAULT '{}',
  
  -- Status and metadata
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false, -- Only one default per environment
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID,
  updated_by UUID,
  
  -- Constraints
  UNIQUE(environment, client_code),
  UNIQUE(environment, is_default) WHERE is_default = true
);

-- Create indexes for performance
CREATE INDEX idx_metadata_configs_environment ON metadata_configs(environment);
CREATE INDEX idx_metadata_configs_client_code ON metadata_configs(client_code);
CREATE INDEX idx_metadata_configs_active ON metadata_configs(is_active);
CREATE INDEX idx_metadata_configs_default ON metadata_configs(environment, is_default);

-- Insert default configurations
INSERT INTO metadata_configs (
  environment, client_code, config_name,
  default_copyright, default_creator, default_software, default_license,
  contact_email, contact_website, company_name, brand_name,
  default_quality, site_name, default_keywords,
  is_default, is_active
) VALUES
-- Development default
(
  'development', 'default', 'Development Default',
  'Local Development', 'Developer Team', 'Dev Media Processor v1.0', 'Development License',
  'dev@localhost', 'http://localhost:5173', 'Local Development', 'Dev Brand',
  75, 'Local Dev Site', ARRAY['development', 'local', 'testing'],
  true, true
),
-- Production default
(
  'production', 'default', 'Production Default',
  'Admin Panel Media Library', 'Production Team', 'Professional Media Processor v1.0', 'All Rights Reserved',
  'contact@company.com', 'https://company.com', 'Your Company Name', 'Your Brand',
  90, 'Company Website', ARRAY['professional', 'quality', 'media'],
  true, true
),
-- Example client configuration
(
  'production', 'company-a', 'Company A Configuration',
  '© 2024 Company A Ltd. All rights reserved', 'Company A Creative Team', 'Company A Media Processor v2.0', 'Company A Commercial License',
  'media@company-a.com', 'https://company-a.com', 'Company A Ltd', 'Company A Brand',
  95, 'Company A Official Site', ARRAY['company-a', 'premium', 'professional', 'vietnam'],
  false, true
);

-- Enable RLS (Row Level Security)
ALTER TABLE metadata_configs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow read metadata_configs" ON metadata_configs 
  FOR SELECT USING (true);

CREATE POLICY "Allow insert metadata_configs" ON metadata_configs 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update metadata_configs" ON metadata_configs 
  FOR UPDATE USING (true);

CREATE POLICY "Allow delete metadata_configs" ON metadata_configs 
  FOR DELETE USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_metadata_configs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER trigger_update_metadata_configs_updated_at
  BEFORE UPDATE ON metadata_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_metadata_configs_updated_at();

-- Add comments for documentation
COMMENT ON TABLE metadata_configs IS 'Stores metadata configuration for different environments and clients';
COMMENT ON COLUMN metadata_configs.environment IS 'Environment: development, staging, production';
COMMENT ON COLUMN metadata_configs.client_code IS 'Client identifier: default, company-a, company-b, etc.';
COMMENT ON COLUMN metadata_configs.custom_fields IS 'Additional custom fields in JSON format';
COMMENT ON COLUMN metadata_configs.is_default IS 'Whether this is the default config for the environment';

-- Create view for easy querying
CREATE OR REPLACE VIEW v_active_metadata_configs AS
SELECT
  id,
  environment,
  client_code,
  config_name,
  default_copyright,
  default_creator,
  default_software,
  default_license,
  contact_email,
  contact_website,
  contact_phone,
  company_name,
  company_address,
  brand_name,
  rights_statement,
  usage_terms,
  default_density,
  default_quality,
  color_space,
  site_url,
  site_name,
  default_keywords,
  custom_fields,
  is_default,
  created_at,
  updated_at
FROM metadata_configs
WHERE is_active = true
ORDER BY environment, is_default DESC, client_code;