import { Show } from "@refinedev/antd";
import { useShow } from '@refinedev/core';
import { Typography, Descriptions, Tag, Space, Image, Card, Progress, Divider } from "antd";
import { useSelect } from "@refinedev/antd";
import { SEODisplay } from "../../components/seo-display";

const { Title, Text } = Typography;

export const ProductShow = () => {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  // Get category name from the joined data
  const categoryName = record?.categories?.name || "N/A";

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>Thông tin sản phẩm</Title>
      
      {/* Ảnh đại diện */}
      {record?.featured_image_id && (
        <div style={{ marginBottom: '24px' }}>
          <Image
            width={200}
            src={`https://via.placeholder.com/200?text=${record.name?.charAt(0)}`}
            alt={record.name}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
          />
        </div>
      )}

      {/* Thông tin cơ bản */}
      <Card title="Thông tin cơ bản" style={{ marginBottom: '24px' }}>
        <Descriptions column={2}>
          <Descriptions.Item label="Tên sản phẩm">
            <Text strong>{record?.name}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="SKU">
            {record?.sku || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Danh mục">
            {categoryName}
          </Descriptions.Item>
          <Descriptions.Item label="Thương hiệu">
            {record?.brand || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Giá gốc">
            <Text strong>{record?.price?.toLocaleString("vi-VN")} VNĐ</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Giá khuyến mãi">
            {record?.sale_price ? (
              <Text type="danger" strong>
                {record.sale_price.toLocaleString("vi-VN")} VNĐ
              </Text>
            ) : (
              'Không có'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Giá vốn">
            {record?.cost_price ? `${record.cost_price.toLocaleString("vi-VN")} VNĐ` : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Trọng lượng">
            {record?.weight ? `${record.weight} kg` : 'N/A'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Thông tin kho hàng */}
      <Card title="Thông tin kho hàng" style={{ marginBottom: '24px' }}>
        <Descriptions column={2}>
          <Descriptions.Item label="Tồn kho hiện tại">
            <Text strong style={{ color: record?.stock_quantity < (record?.min_stock_level || 5) ? '#ff4d4f' : 'inherit' }}>
              {record?.stock_quantity}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Mức tồn kho tối thiểu">
            {record?.min_stock_level || 5}
          </Descriptions.Item>
          <Descriptions.Item label="Mức tồn kho tối đa">
            {record?.max_stock_level || 'Không giới hạn'}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={record?.stock_quantity < (record?.min_stock_level || 5) ? 'red' : 'green'}>
              {record?.stock_quantity < (record?.min_stock_level || 5) ? 'Cần nhập hàng' : 'Đủ hàng'}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Thông tin bảo hành và đổi trả */}
      <Card title="Bảo hành & Đổi trả" style={{ marginBottom: '24px' }}>
        <Descriptions column={2}>
          <Descriptions.Item label="Thời hạn bảo hành">
            {record?.warranty ? (
              <Tag color="blue">{record.warranty}</Tag>
            ) : (
              'Chưa cập nhật'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Chính sách đổi trả">
            {record?.return_policy ? (
              <Tag color="green">{record.return_policy}</Tag>
            ) : (
              'Chưa cập nhật'
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Thông tin SEO */}
      {record?.seo_data && (
        <SEODisplay seoData={record.seo_data} showAdvanced={true} />
      )}

      {/* Thông tin đánh giá */}
      <Card title="Thông tin đánh giá" style={{ marginBottom: '24px' }}>
        <Descriptions column={2}>
          <Descriptions.Item label="Điểm đánh giá trung bình">
            <div>
              <Text strong style={{ fontSize: '18px' }}>
                {record?.rating ? record.rating.toFixed(1) : '0.0'} ⭐
              </Text>
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="Số lượng đánh giá">
            {record?.review_count || 0}
          </Descriptions.Item>
          <Descriptions.Item label="Số lượt xem">
            {record?.view_count || 0}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Space>
              {record?.is_featured && <Tag color="blue">Nổi bật</Tag>}
              {record?.is_bestseller && <Tag color="green">Bán chạy</Tag>}
              <Tag color={record?.is_active ? 'green' : 'red'}>
                {record?.is_active ? 'Hoạt động' : 'Không hoạt động'}
              </Tag>
            </Space>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Mô tả */}
      <Card title="Mô tả sản phẩm" style={{ marginBottom: '24px' }}>
        <div>
          <Title level={5}>Mô tả ngắn</Title>
          <Text>{record?.short_description || 'Chưa có mô tả ngắn'}</Text>
        </div>
        
        {record?.description && (
          <>
            <Divider />
            <div>
              <Title level={5}>Mô tả chi tiết</Title>
              <Text>{record.description}</Text>
            </div>
          </>
        )}
      </Card>
    </Show>
  );
};
