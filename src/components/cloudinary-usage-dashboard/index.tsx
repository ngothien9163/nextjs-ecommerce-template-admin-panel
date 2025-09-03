import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Alert,
  Button,
  Space,
  Typography,
  Table,
  Tag,
  Tooltip,
  Spin,
  DatePicker,
  Select,
  Divider,
} from 'antd';
import {
  CloudOutlined,
  DatabaseOutlined,
  ThunderboltOutlined,
  PictureOutlined,
  ReloadOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import {
  getCachedUsage,
  getCloudinaryAnalytics,
  getCloudinaryResources,
  formatBytes,
  formatNumber,
  getUsageStatus,
  getCurrentPlan,
  calculateCostEstimation,
  type CloudinaryUsage,
  type CloudinaryResource,
} from '../../lib/cloudinary-usage';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Configure dayjs
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('vi');

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// =====================================================
// CLOUDINARY USAGE DASHBOARD COMPONENT
// =====================================================

export const CloudinaryUsageDashboard: React.FC = () => {
  const [usage, setUsage] = useState<CloudinaryUsage | null>(null);
  const [resources, setResources] = useState<CloudinaryResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string>('');

  // =====================================================
  // LOAD DATA
  // =====================================================

  const loadUsageData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const usageData = await getCachedUsage();
      setUsage(usageData);
      
      // Load recent resources
      const resourcesData = await getCloudinaryResources({
        max_results: 20,
        folder: selectedFolder || undefined,
      });
      setResources(resourcesData.resources);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsageData();
  }, [selectedFolder]);

  // =====================================================
  // RENDER FUNCTIONS
  // =====================================================

  const renderUsageCard = (
    title: string,
    used: number,
    limit: number,
    icon: React.ReactNode,
    formatter: (value: number) => string = formatNumber,
    unit: string = ''
  ) => {
    const percentage = limit > 0 ? Math.round((used / limit) * 100) : 0;
    const status = getUsageStatus(percentage);
    
    return (
      <Card>
        <Statistic
          title={title}
          value={formatter(used)}
          suffix={unit}
          prefix={icon}
          valueStyle={{ color: status.color }}
        />
        <Progress
          percent={percentage}
          strokeColor={status.color}
          showInfo={false}
          size="small"
        />
        <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
          {formatter(used)} / {formatter(limit)} {unit}
          <Tag color={status.status === 'safe' ? 'green' : status.status === 'warning' ? 'orange' : 'red'} style={{ marginLeft: 8 }}>
            {status.message}
          </Tag>
        </div>
      </Card>
    );
  };

  const renderPlanInfo = () => {
    if (!usage) return null;
    
    const planInfo = getCurrentPlan(usage);
    const costInfo = calculateCostEstimation(usage);
    
    return (
      <Card title="Thông tin Plan" extra={<Tag color="blue">{planInfo.name}</Tag>}>
        <Row gutter={16}>
          <Col span={12}>
            <Statistic
              title="Storage Limit"
              value={planInfo.limits.storage}
              prefix={<DatabaseOutlined />}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="Bandwidth Limit"
              value={planInfo.limits.bandwidth}
              prefix={<ThunderboltOutlined />}
            />
          </Col>
        </Row>
        <Divider />
        <Row gutter={16}>
          <Col span={8}>
            <Statistic
              title="Current Cost"
              value={costInfo.currentCost}
              prefix="$"
              precision={2}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Projected Cost"
              value={costInfo.projectedCost}
              prefix="$"
              precision={2}
              valueStyle={{ color: costInfo.overageCost > 0 ? '#ff4d4f' : '#52c41a' }}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Overage Cost"
              value={costInfo.overageCost}
              prefix="$"
              precision={2}
              valueStyle={{ color: costInfo.overageCost > 0 ? '#ff4d4f' : '#52c41a' }}
            />
          </Col>
        </Row>
      </Card>
    );
  };

  const renderResourcesTable = () => {
    const columns = [
      {
        title: 'Image',
        dataIndex: 'public_id',
        key: 'public_id',
        render: (publicId: string, record: CloudinaryResource) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={record.secure_url}
              alt={publicId}
              style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
            />
            <div style={{ marginLeft: 8 }}>
              <Text strong>{publicId}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>
                {record.width}x{record.height}
              </Text>
            </div>
          </div>
        ),
      },
      {
        title: 'Size',
        dataIndex: 'bytes',
        key: 'bytes',
        render: (bytes: number) => formatBytes(bytes),
      },
      {
        title: 'Format',
        dataIndex: 'format',
        key: 'format',
        render: (format: string) => <Tag>{format.toUpperCase()}</Tag>,
      },
      {
        title: 'Folder',
        dataIndex: 'folder',
        key: 'folder',
        render: (folder: string) => folder || <Text type="secondary">Root</Text>,
      },
      {
        title: 'Created',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (date: string) => new Date(date).toLocaleDateString(),
      },
    ];

    return (
      <Card
        title="Recent Resources"
        extra={
          <Select
            placeholder="Filter by folder"
            style={{ width: 200 }}
            allowClear
            onChange={setSelectedFolder}
          >
            <Select.Option value="">All folders</Select.Option>
            <Select.Option value="products">products</Select.Option>
            <Select.Option value="blog">blog</Select.Option>
            <Select.Option value="categories">categories</Select.Option>
          </Select>
        }
      >
        <Table
          columns={columns}
          dataSource={resources}
          rowKey="public_id"
          pagination={{ pageSize: 10 }}
          size="small"
        />
      </Card>
    );
  };

  // =====================================================
  // MAIN RENDER
  // =====================================================

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 50 }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Loading Cloudinary usage data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        action={
          <Button size="small" onClick={loadUsageData}>
            Retry
          </Button>
        }
      />
    );
  }

  if (!usage) {
    return (
      <Alert
        message="No data"
        description="No usage data available"
        type="info"
        showIcon
      />
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>
          <CloudOutlined /> Cloudinary Usage Dashboard
        </Title>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={loadUsageData}>
            Refresh
          </Button>
        </Space>
      </div>

      {/* Usage Overview */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          {renderUsageCard(
            'Storage Used',
            usage.storage.used,
            usage.storage.limit,
            <DatabaseOutlined />,
            formatBytes
          )}
        </Col>
        <Col xs={24} sm={12} lg={6}>
          {renderUsageCard(
            'Bandwidth Used',
            usage.bandwidth.used,
            usage.bandwidth.limit,
            <ThunderboltOutlined />,
            formatBytes
          )}
        </Col>
        <Col xs={24} sm={12} lg={6}>
          {renderUsageCard(
            'Requests',
            usage.requests.used,
            usage.requests.limit,
            <CloudOutlined />,
            formatNumber
          )}
        </Col>
        <Col xs={24} sm={12} lg={6}>
          {renderUsageCard(
            'Transformations',
            usage.transformations.used,
            usage.transformations.limit,
            <PictureOutlined />,
            formatNumber
          )}
        </Col>
      </Row>

      {/* Plan Info */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          {renderPlanInfo()}
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Usage Alerts">
            {usage.bandwidth.used / usage.bandwidth.limit > 0.8 && (
              <Alert
                message="Bandwidth Warning"
                description={`You've used ${Math.round((usage.bandwidth.used / usage.bandwidth.limit) * 100)}% of your bandwidth quota`}
                type="warning"
                showIcon
                icon={<WarningOutlined />}
                style={{ marginBottom: 8 }}
              />
            )}
            {usage.storage.used / usage.storage.limit > 0.8 && (
              <Alert
                message="Storage Warning"
                description={`You've used ${Math.round((usage.storage.used / usage.storage.limit) * 100)}% of your storage quota`}
                type="warning"
                showIcon
                icon={<WarningOutlined />}
                style={{ marginBottom: 8 }}
              />
            )}
            {usage.bandwidth.used / usage.bandwidth.limit < 0.5 && 
             usage.storage.used / usage.storage.limit < 0.5 && (
              <Alert
                message="Usage Status"
                description="Your usage is within safe limits"
                type="success"
                showIcon
                icon={<CheckCircleOutlined />}
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* Resources Table */}
      <Row>
        <Col span={24}>
          {renderResourcesTable()}
        </Col>
      </Row>
    </div>
  );
};

export default CloudinaryUsageDashboard;

