import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Space, Alert } from 'antd';
import { supabase } from '../../lib/supabase';
import { supabaseAdmin } from '../../lib/supabase-admin';

const { Text, Title } = Typography;

export const DebugConnection: React.FC = () => {
  const [regularTest, setRegularTest] = useState<any>(null);
  const [adminTest, setAdminTest] = useState<any>(null);
  const [mediaTest, setMediaTest] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testRegularConnection = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('count')
        .limit(1);
      
      setRegularTest({ success: !error, data, error: error?.message });
    } catch (err) {
      setRegularTest({ success: false, error: String(err) });
    }
  };

  const testAdminConnection = async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from('categories')
        .select('count')
        .limit(1);
      
      setAdminTest({ success: !error, data, error: error?.message });
    } catch (err) {
      setAdminTest({ success: false, error: String(err) });
    }
  };

  const testMediaAccess = async () => {
    try {
      // Test regular client first
      const { data: regularData, error: regularError } = await supabase
        .from('media')
        .select('count')
        .limit(1);

      // Test admin client
      const { data: adminData, error: adminError } = await supabaseAdmin
        .from('media')
        .select('count')
        .limit(1);

      setMediaTest({
        regular: { success: !regularError, data: regularData, error: regularError?.message },
        admin: { success: !adminError, data: adminData, error: adminError?.message }
      });
    } catch (err) {
      setMediaTest({ error: String(err) });
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    await testRegularConnection();
    await testAdminConnection();
    await testMediaAccess();
    setLoading(false);
  };

  useEffect(() => {
    runAllTests();
  }, []);

  return (
    <Card title="Supabase Connection Debug" style={{ margin: '20px' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button onClick={runAllTests} loading={loading} type="primary">
          Run Tests
        </Button>

        <Title level={5}>Regular Supabase Client</Title>
        {regularTest && (
          <Alert
            type={regularTest.success ? 'success' : 'error'}
            message={regularTest.success ? 'Connection OK' : 'Connection Failed'}
            description={regularTest.error || JSON.stringify(regularTest.data)}
          />
        )}

        <Title level={5}>Admin Supabase Client</Title>
        {adminTest && (
          <Alert
            type={adminTest.success ? 'success' : 'error'}
            message={adminTest.success ? 'Admin Connection OK' : 'Admin Connection Failed'}
            description={adminTest.error || JSON.stringify(adminTest.data)}
          />
        )}

        <Title level={5}>Media Table Access</Title>
        {mediaTest && (
          <div>
            <Text strong>Regular Client:</Text>
            <Alert
              type={mediaTest.regular?.success ? 'success' : 'error'}
              message={mediaTest.regular?.success ? 'Media Access OK' : 'Media Access Failed'}
              description={mediaTest.regular?.error || JSON.stringify(mediaTest.regular?.data)}
              style={{ marginBottom: '8px' }}
            />
            <Text strong>Admin Client:</Text>
            <Alert
              type={mediaTest.admin?.success ? 'success' : 'error'}
              message={mediaTest.admin?.success ? 'Admin Media Access OK' : 'Admin Media Access Failed'}
              description={mediaTest.admin?.error || JSON.stringify(mediaTest.admin?.data)}
            />
          </div>
        )}
      </Space>
    </Card>
  );
};