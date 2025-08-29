import React from "react";
import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Descriptions, Tag, Space } from "antd";
import { useSelect } from "@refinedev/antd";

const { Title, Text } = Typography;

export const ProductVariantShow: React.FC = () => {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  const { selectProps: productSelectProps } = useSelect({
    resource: "products",
    optionLabel: "name",
    optionValue: "id",
  });

  const { selectProps: colorSelectProps } = useSelect({
    resource: "colors",
    optionLabel: "name",
    optionValue: "id",
  });

  const { selectProps: sizeSelectProps } = useSelect({
    resource: "sizes",
    optionLabel: "name",
    optionValue: "id",
  });

  // Tìm tên sản phẩm từ options
  const productName = productSelectProps.options?.find(
    (product: any) => product.value === record?.product_id
  )?.label || "N/A";

  // Tìm tên màu sắc từ options
  const colorName = colorSelectProps.options?.find(
    (color: any) => color.value === record?.color_id
  )?.label || "N/A";

  // Tìm tên kích thước từ options
  const sizeName = sizeSelectProps.options?.find(
    (size: any) => size.value === record?.size_id
  )?.label || "N/A";

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>Chi tiết biến thể sản phẩm</Title>
      <Descriptions bordered column={2}>
        <Descriptions.Item label="ID" span={1}>
          {record?.id}
        </Descriptions.Item>
        <Descriptions.Item label="Sản phẩm" span={1}>
          {productName}
        </Descriptions.Item>
        <Descriptions.Item label="Mã SKU" span={1}>
          {record?.sku}
        </Descriptions.Item>
        <Descriptions.Item label="Màu sắc" span={1}>
          {colorName !== "N/A" ? colorName : "Không có"}
        </Descriptions.Item>
        <Descriptions.Item label="Kích thước" span={1}>
          {sizeName !== "N/A" ? sizeName : "Không có"}
        </Descriptions.Item>
        <Descriptions.Item label="Giá" span={1}>
          {record?.price ? `${Number(record.price).toLocaleString("vi-VN")} VNĐ` : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Giá khuyến mãi" span={1}>
          {record?.sale_price ? `${Number(record.sale_price).toLocaleString("vi-VN")} VNĐ` : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Tồn kho" span={1}>
          {record?.stock_quantity}
        </Descriptions.Item>
        <Descriptions.Item label="Trọng lượng" span={1}>
          {record?.weight ? `${record.weight} gram` : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Kích thước (cm)" span={2}>
          {record?.dimensions ? (
            <Space>
              <Text>Dài: {record.dimensions.length || "N/A"}</Text>
              <Text>Rộng: {record.dimensions.width || "N/A"}</Text>
              <Text>Cao: {record.dimensions.height || "N/A"}</Text>
            </Space>
          ) : (
            "N/A"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái" span={1}>
          <Tag color={record?.is_active ? "green" : "red"}>
            {record?.is_active ? "Kích hoạt" : "Không kích hoạt"}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Mô tả" span={2}>
          {record?.description || "Không có mô tả"}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày tạo" span={1}>
          {record?.created_at ? new Date(record.created_at).toLocaleDateString("vi-VN") : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày cập nhật" span={1}>
          {record?.updated_at ? new Date(record.updated_at).toLocaleDateString("vi-VN") : "N/A"}
        </Descriptions.Item>
      </Descriptions>
    </Show>
  );
};

