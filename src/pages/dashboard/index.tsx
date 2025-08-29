import React from 'react';
import { Card, Row, Col, Statistic, Typography } from 'antd';
import { ShoppingCartOutlined, TagsOutlined, UserOutlined, DollarOutlined } from '@ant-design/icons';

const { Title } = Typography;

export const Dashboard: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Dashboard</Title>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng sản phẩm"
              value={0}
              prefix={<TagsOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng danh mục"
              value={0}
              prefix={<TagsOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={0}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng khách hàng"
              value={0}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24} lg={12}>
          <Card title="Sản phẩm gần đây">
            <p>Chưa có sản phẩm nào</p>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="Đơn hàng gần đây">
            <p>Chưa có đơn hàng nào</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
