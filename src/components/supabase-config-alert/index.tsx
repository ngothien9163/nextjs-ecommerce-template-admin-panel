import React from 'react';
import { Alert, Card, Typography, Steps, Button } from 'antd';
import { WarningOutlined, SettingOutlined, DatabaseOutlined, KeyOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;

export const SupabaseConfigAlert: React.FC = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const serviceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
  
  const isConfigured = supabaseUrl && 
    supabaseUrl !== 'your_supabase_url_here' && 
    supabaseKey && 
    supabaseKey !== 'your_supabase_anon_key_here';
    
  if (isConfigured) {
    return null; // Don't show if properly configured
  }

  return (
    <Card 
      style={{ 
        margin: '20px 0', 
        border: '2px solid #ff4d4f',
        backgroundColor: '#fff2f0'
      }}
    >
      <Alert
        message="\uD83D\uDEA8 Supabase Configuration Required"
        description="Blog posts cannot be updated because Supabase is not properly configured. Please follow the steps below."
        type="error"
        icon={<WarningOutlined />}
        showIcon
        style={{ marginBottom: '20px' }}
      />
      
      <Title level={4}>
        <SettingOutlined /> Configuration Steps
      </Title>
      
      <Steps
        direction="vertical"
        size="small"
        current={-1}
        items={[
          {
            title: 'Open .env.local file',
            description: 'Navigate to the root directory and open .env.local file',
            icon: <DatabaseOutlined />
          },
          {
            title: 'Get Supabase credentials',
            description: (
              <div>
                <Paragraph>
                  1. Go to <Text code>https://supabase.com/dashboard</Text><br/>
                  2. Select your project<br/>
                  3. Go to Settings → API<br/>
                  4. Copy the URL and keys
                </Paragraph>
              </div>
            ),
            icon: <KeyOutlined />
          },
          {
            title: 'Update .env.local',
            description: (
              <div>
                <Paragraph>Replace these values in .env.local:</Paragraph>
                <div style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px', fontFamily: 'monospace' }}>
                  <Text code>VITE_SUPABASE_URL=https://your-project.supabase.co</Text><br/>
                  <Text code>VITE_SUPABASE_ANON_KEY=your_anon_key_here</Text><br/>
                  <Text code>VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key</Text>
                </div>
              </div>
            )
          },
          {
            title: 'Restart development server',
            description: 'Run npm run dev again to load the new configuration'
          }
        ]}
      />
      
      <Alert
        message="Current Configuration Status"
        description={
          <div>
            <Text>Supabase URL: {supabaseUrl ? <Text code>{supabaseUrl}</Text> : <Text type="danger">Not configured</Text>}</Text><br/>
            <Text>Anon Key: {supabaseKey ? <Text type="success">✅ Configured</Text> : <Text type="danger">❌ Not configured</Text>}</Text><br/>
            <Text>Service Role Key: {serviceKey ? <Text type="success">✅ Configured</Text> : <Text type="danger">❌ Not configured</Text>}</Text>
          </div>
        }
        type="info"
        style={{ marginTop: '20px' }}
      />
      
      <div style={{ marginTop: '16px', textAlign: 'center' }}>
        <Button 
          type="primary" 
          icon={<DatabaseOutlined />}
          href="https://supabase.com/dashboard" 
          target="_blank"
        >
          Open Supabase Dashboard
        </Button>
      </div>
    </Card>
  );
};

export default SupabaseConfigAlert;