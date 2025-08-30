import React from 'react';
import { useForm, useSelect } from '@refinedev/antd';
import { useParams } from 'react-router-dom';
import { Product, Category } from '../../lib/supabase';
import { Card, Typography, Space, Tag } from 'antd';

const { Title, Text } = Typography;

export const TestProductEdit = () => {
  const { id } = useParams<{ id: string }>();
  
  console.log('🔍 TestProductEdit - Product ID:', id);
  
  const { formProps, saveButtonProps, queryResult } = useForm<Product>({
    resource: 'products',
    id: id,
    queryOptions: {
      enabled: !!id,
    },
  });
  
  const { selectProps: categorySelectProps } = useSelect<Category>({
    resource: 'categories',
    optionLabel: 'name',
    optionValue: 'id',
  });

  console.log('🔍 TestProductEdit - queryResult:', queryResult);
  console.log('🔍 TestProductEdit - formProps:', formProps);
  console.log('🔍 TestProductEdit - categorySelectProps:', categorySelectProps);

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Test Product Edit</Title>
      
      <Card title="Debug Information" style={{ marginBottom: '24px' }}>
        <Space direction="vertical" size="large">
          <div>
            <Text strong>Product ID from URL:</Text>
            <Tag color="blue" style={{ marginLeft: '8px' }}>{id || 'No ID'}</Tag>
          </div>
          
          <div>
            <Text strong>Loading State:</Text>
            <Tag color={queryResult?.isLoading ? 'orange' : 'green'} style={{ marginLeft: '8px' }}>
              {queryResult?.isLoading ? 'Loading...' : 'Loaded'}
            </Tag>
          </div>
          
          <div>
            <Text strong>Error State:</Text>
            <Tag color={queryResult?.error ? 'red' : 'green'} style={{ marginLeft: '8px' }}>
              {queryResult?.error ? 'Error' : 'No Error'}
            </Tag>
          </div>
          
          <div>
            <Text strong>Data Available:</Text>
            <Tag color={queryResult?.data?.data ? 'green' : 'red'} style={{ marginLeft: '8px' }}>
              {queryResult?.data?.data ? 'Yes' : 'No'}
            </Tag>
          </div>
        </Space>
      </Card>

      {queryResult?.isLoading && (
        <Card title="Loading">
          <Text>Loading product data...</Text>
        </Card>
      )}

      {queryResult?.error && (
        <Card title="Error" style={{ borderColor: '#ff4d4f' }}>
          <Text type="danger">Error: {queryResult.error.message}</Text>
        </Card>
      )}

      {queryResult?.data?.data && (
        <Card title="Product Data">
          <pre style={{ background: '#f5f5f5', padding: '16px', borderRadius: '6px' }}>
            {JSON.stringify(queryResult.data.data, null, 2)}
          </pre>
        </Card>
      )}

      {!queryResult?.isLoading && !queryResult?.error && !queryResult?.data?.data && (
        <Card title="No Data">
          <Text>No product data found</Text>
        </Card>
      )}
    </div>
  );
};
