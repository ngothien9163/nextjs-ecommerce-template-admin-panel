import {
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import type { BaseRecord } from "@refinedev/core";
import { Space, Table, Tag, Typography } from "antd";
import { CustomDeleteButton } from "../../components/custom-delete-button";

const { Text } = Typography;

export const OrderList = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "orange",
      confirmed: "blue",
      processing: "cyan",
      shipped: "purple",
      delivered: "green",
      cancelled: "red",
      refunded: "default",
    };
    return statusMap[status] || "default";
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "Chờ xác nhận",
      confirmed: "Đã xác nhận",
      processing: "Đang xử lý",
      shipped: "Đã giao hàng",
      delivered: "Đã nhận hàng",
      cancelled: "Đã hủy",
      refunded: "Đã hoàn tiền",
    };
    return statusMap[status] || status;
  };

  const getPaymentStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "orange",
      paid: "green",
      failed: "red",
      refunded: "default",
    };
    return statusMap[status] || "default";
  };

  const getPaymentStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "Chờ thanh toán",
      paid: "Đã thanh toán",
      failed: "Thanh toán thất bại",
      refunded: "Đã hoàn tiền",
    };
    return statusMap[status] || status;
  };

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="order_number" title={"Mã đơn hàng"} />
        <Table.Column
          title={"Trạng thái đơn hàng"}
          dataIndex="status"
          render={(status) => (
            <Tag color={getStatusColor(status)}>
              {getStatusText(status)}
            </Tag>
          )}
        />
        <Table.Column
          title={"Trạng thái thanh toán"}
          dataIndex="payment_status"
          render={(status) => (
            <Tag color={getPaymentStatusColor(status)}>
              {getPaymentStatusText(status)}
            </Tag>
          )}
        />
        <Table.Column
          title={"Ngày đặt hàng"}
          dataIndex="order_date"
          render={(date) => date ? new Date(date).toLocaleDateString("vi-VN") : "N/A"}
        />
        <Table.Column
          title={"Tổng tiền"}
          dataIndex="total_amount"
          render={(amount) => (
            <Text strong>
              {amount ? `${Number(amount).toLocaleString("vi-VN")} VNĐ` : "N/A"}
            </Text>
          )}
        />
        <Table.Column
          title={"Phương thức thanh toán"}
          dataIndex="payment_method"
        />
        <Table.Column
          title={"Phương thức vận chuyển"}
          dataIndex="shipping_method"
        />
        <Table.Column
          title={"Actions"}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <CustomDeleteButton 
                recordItemId={record.id} 
                resource="orders"
                size="small"
                hideText
              />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};

