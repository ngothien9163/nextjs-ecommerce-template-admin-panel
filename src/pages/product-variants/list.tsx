import React from "react";
import { List, EditButton, DeleteButton, ShowButton, CreateButton, useTable } from "@refinedev/antd";
import { Table, Space, Tag, Switch, Typography } from "antd";
import { useSelect } from "@refinedev/antd";

const { Text } = Typography;

export const ProductVariantList: React.FC = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

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

  return (
    <List
      headerButtons={
        <CreateButton />
      }
    >
      <Table {...tableProps} rowKey="id">
        <Table.Column
          title="ID"
          dataIndex="id"
          key="id"
          width={80}
        />
        <Table.Column
          title="Sản phẩm"
          dataIndex="product_id"
          key="product_id"
          render={(value) => {
            const product = productSelectProps.options?.find((p: any) => p.value === value);
            return product?.label || value;
          }}
        />
        <Table.Column
          title="Mã SKU"
          dataIndex="sku"
          key="sku"
        />
        <Table.Column
          title="Màu sắc"
          dataIndex="color_id"
          key="color_id"
          render={(value) => {
            const color = colorSelectProps.options?.find((c: any) => c.value === value);
            return color?.label || value;
          }}
        />
        <Table.Column
          title="Kích thước"
          dataIndex="size_id"
          key="size_id"
          render={(value) => {
            const size = sizeSelectProps.options?.find((s: any) => s.value === value);
            return size?.label || value;
          }}
        />
        <Table.Column
          title="Giá"
          dataIndex="price"
          key="price"
          render={(value) => `${Number(value).toLocaleString("vi-VN")} VNĐ`}
        />
        <Table.Column
          title="Giá khuyến mãi"
          dataIndex="sale_price"
          key="sale_price"
          render={(value) => value ? `${Number(value).toLocaleString("vi-VN")} VNĐ` : "N/A"}
        />
        <Table.Column
          title="Tồn kho"
          dataIndex="stock_quantity"
          key="stock_quantity"
        />
        <Table.Column
          title="Trạng thái"
          dataIndex="is_active"
          key="is_active"
          render={(value) => (
            <Tag color={value ? "green" : "red"}>
              {value ? "Kích hoạt" : "Không kích hoạt"}
            </Tag>
          )}
        />
        <Table.Column
          title="Thao tác"
          key="actions"
          render={(_, record: any) => (
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

