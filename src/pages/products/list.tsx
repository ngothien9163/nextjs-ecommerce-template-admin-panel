import React from 'react';
import { List, EditButton, DeleteButton, ShowButton, CreateButton, useTable } from '@refinedev/antd';
import { Table, Space, Tag, Switch, Image, Typography, Progress } from 'antd';
import { Product } from '../../lib/supabase';

const { Text } = Typography;

export const ProductList: React.FC = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  return (
    <List
      headerButtons={
        <CreateButton />
      }
    >
      <Table
        {...tableProps}
        rowKey="id"
        pagination={{
          pageSize: 10,
        }}
        scroll={{ x: 1230 }}
      >
        <Table.Column
          title="Sản phẩm"
          dataIndex="name"
          key="name"
          width={250}
          render={(value: string, record: any) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Image
                width={50}
                height={50}
                src={record.featured_image_id ? `https://via.placeholder.com/50?text=${value.charAt(0)}` : 'https://via.placeholder.com/50'}
                alt={value}
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
              />
              <div>
                <div style={{ fontWeight: 'bold' }}>{value}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  SKU: {record.sku || 'N/A'}
                </div>
                {record.brand && (
                  <div style={{ fontSize: '11px', color: '#888' }}>
                    Brand: {record.brand}
                  </div>
                )}
              </div>
            </div>
          )}
        />
        <Table.Column
          title="Danh mục"
          dataIndex="category_id"
          key="category_id"
          width={120}
          render={(value: string) => value || '-'}
        />
        <Table.Column
          title="Giá"
          dataIndex="price"
          key="price"
          width={120}
          render={(value: number, record: any) => (
            <div>
              <div style={{ fontWeight: 'bold' }}>
                {record.sale_price ? `${record.sale_price.toLocaleString("vi-VN")} VNĐ` : `${Number(value).toLocaleString("vi-VN")} VNĐ`}
              </div>
              {record.sale_price && (
                <div style={{ fontSize: '12px', color: '#999', textDecoration: 'line-through' }}>
                  {Number(value).toLocaleString("vi-VN")} VNĐ
                </div>
              )}
            </div>
          )}
        />
        <Table.Column
          title="Tồn kho"
          dataIndex="stock_quantity"
          key="stock_quantity"
          width={100}
          render={(value: number, record: any) => (
            <div>
              <div style={{ fontWeight: 'bold', color: value < (record.min_stock_level || 5) ? '#ff4d4f' : 'inherit' }}>
                {value}
              </div>
              <div style={{ fontSize: '12px', color: value < (record.min_stock_level || 5) ? '#ff4d4f' : '#666' }}>
                Min: {record.min_stock_level || 5}
              </div>
              {record.max_stock_level && (
                <div style={{ fontSize: '11px', color: '#888' }}>
                  Max: {record.max_stock_level}
                </div>
              )}
            </div>
          )}
        />
        <Table.Column
          title="SEO Score"
          key="seo_score"
          width={100}
          render={(_: any, record: any) => {
            const seoScore = record.seo_data?.seo_score || 0;
            const scoreColor = seoScore >= 80 ? '#52c41a' : seoScore >= 60 ? '#faad14' : '#ff4d4f';
            
            return (
              <div>
                <div style={{ marginBottom: '4px' }}>
                  <Text strong style={{ color: scoreColor }}>
                    {seoScore}/100
                  </Text>
                </div>
                <Progress 
                  percent={seoScore} 
                  size="small" 
                  strokeColor={scoreColor}
                  showInfo={false}
                />
                {record.seo_data?.keyword_difficulty && (
                  <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                    Độ khó: {record.seo_data.keyword_difficulty}/100
                  </div>
                )}
              </div>
            );
          }}
        />
        <Table.Column
          title="Performance"
          key="performance"
          width={130}
          render={(_: any, record: any) => {
            const pageLoadTime = record.seo_data?.page_load_time;
            const mobileScore = record.seo_data?.mobile_friendly_score;
            
            return (
              <div style={{ fontSize: '12px' }}>
                {pageLoadTime && (
                  <div style={{ marginBottom: '4px' }}>
                    <Text strong>Tải:</Text> {pageLoadTime}s
                  </div>
                )}
                {mobileScore && (
                  <div>
                    <Text strong>Mobile:</Text> {mobileScore}/100
                  </div>
                )}
              </div>
            );
          }}
        />
        <Table.Column
          title="Đánh giá"
          dataIndex="rating"
          key="rating"
          width={100}
          render={(value: number, record: any) => (
            <div>
              <div>{value ? value.toFixed(1) : '0.0'} ⭐</div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                ({record.review_count || 0} đánh giá)
              </div>
              <div style={{ fontSize: '11px', color: '#888' }}>
                {record.view_count || 0} lượt xem
              </div>
            </div>
          )}
        />
        <Table.Column
          title="Trạng thái"
          key="status"
          width={120}
          render={(_: any, record: any) => (
            <Space direction="vertical" size="small">
              <Switch
                checked={record.is_active}
                disabled
                size="small"
              />
              {record.is_featured && <Tag color="blue">Nổi bật</Tag>}
              {record.is_bestseller && <Tag color="green">Bán chạy</Tag>}
            </Space>
          )}
        />
        <Table.Column
          title="Thao tác"
          key="actions"
          width={150}
          fixed="right"
          render={(_: any, record: any) => (
            <Space>
              <ShowButton hideText size="small" recordItemId={record.id} />
              <EditButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
