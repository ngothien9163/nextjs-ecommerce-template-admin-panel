import React from "react";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select, InputNumber, DatePicker, Space } from "antd";
import { useSelect } from "@refinedev/antd";
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Configure dayjs
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('vi');

const { TextArea } = Input;

export const OrderEdit: React.FC = () => {
  const { formProps, saveButtonProps, queryResult } = useForm();
  const record = queryResult?.data?.data;

  const { selectProps: customerSelectProps } = useSelect({
    resource: "profiles",
    optionLabel: (item) => `${item.first_name || ''} ${item.last_name || ''}`.trim() || item.email || 'User',
    optionValue: "id",
    defaultValue: record?.customer_id,
  });

  const { selectProps: statusSelectProps } = useSelect({
    resource: "order_statuses",
    optionLabel: "name",
    optionValue: "id",
    defaultValue: record?.status_id,
  });

  const { selectProps: paymentStatusSelectProps } = useSelect({
    resource: "payment_statuses",
    optionLabel: "name",
    optionValue: "id",
    defaultValue: record?.payment_status_id,
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Khách hàng"
          name="customer_id"
          rules={[{ required: true, message: "Vui lòng chọn khách hàng" }]}
        >
          <Select
            {...customerSelectProps}
            placeholder="Chọn khách hàng"
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>

        <Form.Item
          label="Mã đơn hàng"
          name="order_number"
          rules={[{ required: true, message: "Vui lòng nhập mã đơn hàng" }]}
        >
          <Input placeholder="Nhập mã đơn hàng" />
        </Form.Item>

        <Form.Item
          label="Trạng thái đơn hàng"
          name="status_id"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
        >
          <Select
            {...statusSelectProps}
            placeholder="Chọn trạng thái đơn hàng"
          />
        </Form.Item>

        <Form.Item
          label="Trạng thái thanh toán"
          name="payment_status_id"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái thanh toán" }]}
        >
          <Select
            {...paymentStatusSelectProps}
            placeholder="Chọn trạng thái thanh toán"
          />
        </Form.Item>

        <Form.Item
          label="Tổng tiền hàng"
          name="subtotal"
          rules={[{ required: true, message: "Vui lòng nhập tổng tiền hàng" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Nhập tổng tiền hàng"
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
            min={0}
          />
        </Form.Item>

        <Form.Item
          label="Phí vận chuyển"
          name="shipping_fee"
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Nhập phí vận chuyển"
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
            min={0}
          />
        </Form.Item>

        <Form.Item
          label="Thuế"
          name="tax_amount"
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Nhập thuế"
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
            min={0}
          />
        </Form.Item>

        <Form.Item
          label="Giảm giá"
          name="discount_amount"
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Nhập giảm giá"
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
            min={0}
          />
        </Form.Item>

        <Form.Item
          label="Tổng tiền"
          name="total_amount"
          rules={[{ required: true, message: "Vui lòng nhập tổng tiền" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Nhập tổng tiền"
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
            min={0}
          />
        </Form.Item>

        <Form.Item
          label="Ghi chú"
          name="notes"
        >
          <TextArea rows={4} placeholder="Nhập ghi chú đơn hàng" />
        </Form.Item>

        <Form.Item
          label="Ngày đặt hàng"
          name="order_date"
          rules={[{ required: true, message: "Vui lòng chọn ngày đặt hàng" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            placeholder="Chọn ngày đặt hàng"
            showTime
            getValueFromEvent={(value) => {
              return value ? dayjs(value).toISOString() : null;
            }}
            getValueProps={(value) => {
              return {
                value: value ? dayjs(value) : null
              };
            }}
          />
        </Form.Item>

        <Form.Item
          label="Ngày giao hàng dự kiến"
          name="expected_delivery_date"
        >
          <DatePicker
            style={{ width: "100%" }}
            placeholder="Chọn ngày giao hàng dự kiến"
            showTime
            getValueFromEvent={(value) => {
              return value ? dayjs(value).toISOString() : null;
            }}
            getValueProps={(value) => {
              return {
                value: value ? dayjs(value) : null
              };
            }}
          />
        </Form.Item>
      </Form>
    </Edit>
  );
};

