import React from "react";
import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Descriptions, Tag, Space } from "antd";
import { useSelect } from "@refinedev/antd";
import { Profile } from "../../lib/supabase";

const { Title, Text } = Typography;

export const OrderShow: React.FC = () => {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  const { selectProps: customerSelectProps } = useSelect<Profile>({
    resource: "profiles",
    optionLabel: (item) => `${item.first_name || ''} ${item.last_name || ''}`.trim() || item.email || 'User',
    optionValue: "id",
  });

  const { selectProps: statusSelectProps } = useSelect({
    resource: "order_statuses",
    optionLabel: "name",
    optionValue: "id",
  });

  const { selectProps: paymentStatusSelectProps } = useSelect({
    resource: "payment_statuses",
    optionLabel: "name",
    optionValue: "id",
  });

  // Tìm tên khách hàng từ options
  const customerName = customerSelectProps.options?.find(
    (customer: any) => customer.value === record?.customer_id
  )?.label || "N/A";

  // Tìm trạng thái đơn hàng từ options
  const orderStatus = statusSelectProps.options?.find(
    (status: any) => status.value === record?.status_id
  )?.label || "N/A";

  // Tìm trạng thái thanh toán từ options
  const paymentStatus = paymentStatusSelectProps.options?.find(
    (status: any) => status.value === record?.payment_status_id
  )?.label || "N/A";

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>Chi tiết đơn hàng</Title>
      <Descriptions bordered column={2}>
        <Descriptions.Item label="ID" span={1}>
          {record?.id}
        </Descriptions.Item>
        <Descriptions.Item label="Mã đơn hàng" span={1}>
          {record?.order_number}
        </Descriptions.Item>
        <Descriptions.Item label="Khách hàng" span={1}>
          {customerName}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái đơn hàng" span={1}>
          <Tag color="blue">{orderStatus}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái thanh toán" span={1}>
          <Tag color="green">{paymentStatus}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Ngày đặt hàng" span={1}>
          {record?.order_date ? new Date(record.order_date).toLocaleDateString("vi-VN") : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Tổng tiền hàng" span={1}>
          {record?.subtotal ? `${Number(record.subtotal).toLocaleString("vi-VN")} VNĐ` : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Phí vận chuyển" span={1}>
          {record?.shipping_fee ? `${Number(record.shipping_fee).toLocaleString("vi-VN")} VNĐ` : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Thuế" span={1}>
          {record?.tax_amount ? `${Number(record.tax_amount).toLocaleString("vi-VN")} VNĐ` : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Giảm giá" span={1}>
          {record?.discount_amount ? `${Number(record.discount_amount).toLocaleString("vi-VN")} VNĐ` : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Tổng tiền" span={1}>
          <Text strong style={{ color: "#1890ff", fontSize: "16px" }}>
            {record?.total_amount ? `${Number(record.total_amount).toLocaleString("vi-VN")} VNĐ` : "N/A"}
          </Text>
        </Descriptions.Item>
        <Descriptions.Item label="Ngày giao hàng dự kiến" span={1}>
          {record?.expected_delivery_date ? new Date(record.expected_delivery_date).toLocaleDateString("vi-VN") : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Ghi chú" span={2}>
          {record?.notes || "Không có ghi chú"}
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

