import React from "react";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select, InputNumber, Switch, Space } from "antd";
import { useSelect } from "@refinedev/antd";

export const ProductVariantEdit: React.FC = () => {
  const { formProps, saveButtonProps, queryResult } = useForm();
  const record = queryResult?.data?.data;

  const { selectProps: productSelectProps } = useSelect({
    resource: "products",
    optionLabel: "name",
    optionValue: "id",
    defaultValue: record?.product_id,
  });

  const { selectProps: colorSelectProps } = useSelect({
    resource: "colors",
    optionLabel: "name",
    optionValue: "id",
    defaultValue: record?.color_id,
  });

  const { selectProps: sizeSelectProps } = useSelect({
    resource: "sizes",
    optionLabel: "name",
    optionValue: "id",
    defaultValue: record?.size_id,
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Sản phẩm"
          name="product_id"
          rules={[{ required: true, message: "Vui lòng chọn sản phẩm" }]}
        >
          <Select
            {...productSelectProps}
            placeholder="Chọn sản phẩm"
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>

        <Form.Item
          label="Mã SKU"
          name="sku"
          rules={[{ required: true, message: "Vui lòng nhập mã SKU" }]}
        >
          <Input placeholder="Nhập mã SKU" />
        </Form.Item>

        <Form.Item
          label="Màu sắc"
          name="color_id"
        >
          <Select
            {...colorSelectProps}
            placeholder="Chọn màu sắc"
            allowClear
          />
        </Form.Item>

        <Form.Item
          label="Kích thước"
          name="size_id"
        >
          <Select
            {...sizeSelectProps}
            placeholder="Chọn kích thước"
            allowClear
          />
        </Form.Item>

        <Form.Item
          label="Giá"
          name="price"
          rules={[{ required: true, message: "Vui lòng nhập giá" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Nhập giá"
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
            min={0}
          />
        </Form.Item>

        <Form.Item
          label="Giá khuyến mãi"
          name="sale_price"
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Nhập giá khuyến mãi"
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
            min={0}
          />
        </Form.Item>

        <Form.Item
          label="Tồn kho"
          name="stock_quantity"
          rules={[{ required: true, message: "Vui lòng nhập số lượng tồn kho" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Nhập số lượng tồn kho"
            min={0}
          />
        </Form.Item>

        <Form.Item
          label="Trọng lượng (gram)"
          name="weight"
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Nhập trọng lượng"
            min={0}
            step={0.01}
          />
        </Form.Item>

        <Form.Item
          label="Kích thước (cm)"
          name="dimensions"
        >
          <Space>
            <InputNumber
              placeholder="Dài"
              min={0}
              step={0.1}
            />
            <InputNumber
              placeholder="Rộng"
              min={0}
              step={0.1}
            />
            <InputNumber
              placeholder="Cao"
              min={0}
              step={0.1}
            />
          </Space>
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
        >
          <Input.TextArea rows={4} placeholder="Nhập mô tả biến thể" />
        </Form.Item>

        <Form.Item
          label="Kích hoạt"
          name="is_active"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Edit>
  );
};

