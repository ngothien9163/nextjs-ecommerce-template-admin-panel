import React, { useState, useEffect } from 'react';
import { Button, Card, Typography, Space, Alert } from 'antd';
import { supabase } from '../lib/supabase';
import { supabaseAdmin } from '../lib/supabase-admin';

const { Title, Text, Paragraph } = Typography;

export const ConnectionDebugger: React.FC = () => {
  const [testResults, setTestResults] = useState<any>({});
  const [testing, setTesting] = useState(false);

  const runConnectionTests = async () => {
    setTesting(true);
    const results: any = {};

    try {
      // Test 1: Environment Variables
      console.log('🔧 Testing Environment Variables...');
      results.envVars = {
        url: !!import.meta.env.VITE_SUPABASE_URL,
        anonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
        serviceKey: !!import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY,
        urlValue: import.meta.env.VITE_SUPABASE_URL,
      };

      // Test 2: Basic Supabase Connection
      console.log('📡 Testing Basic Supabase Connection...');
      try {
        const { data, error } = await supabase.from('categories').select('count').limit(1);
        results.basicConnection = {
          success: !error,
          error: error?.message,
          data: data
        };
      } catch (err) {
        results.basicConnection = {
          success: false,
          error: String(err)
        };
      }

      // Test 3: Admin Client Connection
      console.log('🔑 Testing Admin Client Connection...');
      try {
        const { data, error } = await supabaseAdmin.from('media').select('count').limit(1);
        results.adminConnection = {
          success: !error,
          error: error?.message,
          data: data
        };
      } catch (err) {
        results.adminConnection = {
          success: false,
          error: String(err)
        };
      }

      // Test 4: Media Table Access
      console.log('📸 Testing Media Table Access...');
      try {
        const { data, error } = await supabaseAdmin.from('media').select('*').limit(5);
        results.mediaAccess = {
          success: !error,
          error: error?.message,
          count: data?.length || 0
        };
      } catch (err) {
        results.mediaAccess = {
          success: false,
          error: String(err)
        };
      }

      // Test 5: Storage Access
      console.log('🗄️ Testing Storage Access...');
      try {
        const { data, error } = await supabaseAdmin.storage.listBuckets();
        results.storageAccess = {
          success: !error,
          error: error?.message,
          buckets: data?.map(b => b.name) || []
        };
      } catch (err) {
        results.storageAccess = {
          success: false,
          error: String(err)
        };
      }

    } catch (err) {
      console.error('🔥 Test suite failed:', err);
      results.error = String(err);
    }

    setTestResults(results);
    setTesting(false);
  };

  useEffect(() => {
    runConnectionTests();
  }, []);

  const getStatusColor = (success: boolean) => success ? 'success' : 'error';

  return (
    <Card title="🔧 Supabase Connection Debugger" style={{ margin: '20px 0' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        
        {/* Environment Variables */}
        <div>
          <Title level={4}>1. Environment Variables</Title>
          {testResults.envVars && (
            <div>
              <Text>URL: </Text>
              <Text type={testResults.envVars.url ? 'success' : 'danger'}>
                {testResults.envVars.url ? '✅ Set' : '❌ Missing'}
              </Text>
              <br />
              <Text>Anon Key: </Text>
              <Text type={testResults.envVars.anonKey ? 'success' : 'danger'}>
                {testResults.envVars.anonKey ? '✅ Set' : '❌ Missing'}
              </Text>
              <br />
              <Text>Service Role Key: </Text>
              <Text type={testResults.envVars.serviceKey ? 'success' : 'danger'}>
                {testResults.envVars.serviceKey ? '✅ Set' : '❌ Missing'}
              </Text>
              <br />
              <Text type="secondary">URL: {testResults.envVars.urlValue || 'Not set'}</Text>
            </div>
          )}
        </div>

        {/* Basic Connection */}
        <div>
          <Title level={4}>2. Basic Supabase Connection (Categories Table)</Title>
          {testResults.basicConnection && (
            <Alert
              type={getStatusColor(testResults.basicConnection.success)}
              message={testResults.basicConnection.success ? 
                'Connection successful' : 
                `Connection failed: ${testResults.basicConnection.error}`
              }
            />
          )}
        </div>

        {/* Admin Connection */}
        <div>
          <Title level={4}>3. Admin Client Connection (Media Table)</Title>
          {testResults.adminConnection && (
            <Alert
              type={getStatusColor(testResults.adminConnection.success)}
              message={testResults.adminConnection.success ? 
                'Admin connection successful' : 
                `Admin connection failed: ${testResults.adminConnection.error}`
              }
            />
          )}
        </div>

        {/* Media Access */}
        <div>
          <Title level={4}>4. Media Table Access</Title>
          {testResults.mediaAccess && (
            <Alert
              type={getStatusColor(testResults.mediaAccess.success)}
              message={testResults.mediaAccess.success ? 
                `Media access successful (${testResults.mediaAccess.count} records)` : 
                `Media access failed: ${testResults.mediaAccess.error}`
              }
            />
          )}
        </div>

        {/* Storage Access */}
        <div>
          <Title level={4}>5. Storage Access</Title>
          {testResults.storageAccess && (
            <Alert
              type={getStatusColor(testResults.storageAccess.success)}
              message={testResults.storageAccess.success ? 
                `Storage access successful (Buckets: ${testResults.storageAccess.buckets.join(', ')})` : 
                `Storage access failed: ${testResults.storageAccess.error}`
              }
            />
          )}
        </div>

        <div>
          <Button type="primary" onClick={runConnectionTests} loading={testing}>
            🔄 Re-run Tests
          </Button>
        </div>

        {/* Instructions */}
        <Card title="🎯 Fix Instructions" type="inner">
          <div>
            <Title level={5}>If Service Role Key is missing:</Title>
            <Paragraph>
              1. Go to your Supabase Dashboard → Settings → API<br/>
              2. Copy the <strong>service_role</strong> key (NOT anon key)<br/>
              3. Add it to your .env.local file:<br/>
              <code>VITE_SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key</code><br/>
              4. Restart your dev server: <code>npm run dev</code>
            </Paragraph>
            
            <Title level={5}>If Media Table access fails:</Title>
            <Paragraph>
              1. Go to Supabase Dashboard → SQL Editor<br/>
              2. Run this script: <code>sqls/simple-media-fix.sql</code><br/>
              3. This will fix the permission issues automatically
            </Paragraph>

            <Title level={5}>If Storage bucket is missing:</Title>
            <Paragraph>
              1. Go to Supabase Dashboard → Storage<br/>
              2. Create a new bucket named "media"<br/>
              3. Make it public for easy access
            </Paragraph>
          </div>
        </Card>
      </Space>
    </Card>
  );
};