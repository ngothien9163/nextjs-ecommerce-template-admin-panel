import { Form, Input, Select, InputNumber, DatePicker, Space } from "antd";
import { Create, useForm, useSelect } from "@refinedev/antd";
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Configure dayjs
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('vi');

export const OrderCreate = () => {
  const { formProps, saveButtonProps } = useForm();

  const { selectProps: userSelectProps } = useSelect({
    resource: "profiles",
    optionLabel: "first_name",
    optionValue: "id",
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Space direction="vertical" style={{ width: "100%" }}>
          <Form.Item
            label="Mã đơn hàng"
            name="order_number"
            rules={[{ required: true, message: "Vui lòng nhập mã đơn hàng!" }]}
          >
            <Input placeholder="ORD-2024-001" />
          </Form.Item>

          <Form.Item
            label="Khách hàng"
            name="user_id"
            rules={[{ required: true, message: "Vui lòng chọn khách hàng!" }]}
          >
            <Select {...userSelectProps} placeholder="Chọn khách hàng" />
          </Form.Item>

          <Form.Item
            label="Trạng thái đơn hàng"
            name="status"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select>
              <Select.Option value="pending">Chờ xác nhận</Select.Option>
              <Select.Option value="confirmed">Đã xác nhận</Select.Option>
              <Select.Option value="processing">Đang xử lý</Select.Option>
              <Select.Option value="shipped">Đã giao hàng</Select.Option>
              <Select.Option value="delivered">Đã nhận hàng</Select.Option>
              <Select.Option value="cancelled">Đã hủy</Select.Option>
              <Select.Option value="refunded">Đã hoàn tiền</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Trạng thái thanh toán"
            name="payment_status"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái thanh toán!" }]}
          >
            <Select>
              <Select.Option value="pending">Chờ thanh toán</Select.Option>
              <Select.Option value="paid">Đã thanh toán</Select.Option>
              <Select.Option value="failed">Thanh toán thất bại</Select.Option>
              <Select.Option value="refunded">Đã hoàn tiền</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Ngày đặt hàng"
            name="order_date"
            rules={[{ required: true, message: "Vui lòng chọn ngày đặt hàng!" }]}
          >
            <DatePicker 
              style={{ width: "100%" }}
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
            label="Tổng tiền hàng"
            name="subtotal"
            rules={[{ required: true, message: "Vui lòng nhập tổng tiền hàng!" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
              addonAfter="VNĐ"
            />
          </Form.Item>

          <Form.Item label="Phí vận chuyển" name="shipping_fee">
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
              addonAfter="VNĐ"
            />
          </Form.Item>

          <Form.Item label="Thuế" name="tax_amount">
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
              addonAfter="VNĐ"
            />
          </Form.Item>

          <Form.Item label="Giảm giá" name="discount_amount">
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
              addonAfter="VNĐ"
            />
          </Form.Item>

          <Form.Item
            label="Tổng tiền đơn hàng"
            name="total_amount"
            rules={[{ required: true, message: "Vui lòng nhập tổng tiền!" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
              addonAfter="VNĐ"
            />
          </Form.Item>

          <Form.Item label="Phương thức thanh toán" name="payment_method">
            <Input placeholder="Thẻ tín dụng, Chuyển khoản..." />
          </Form.Item>

          <Form.Item label="Phương thức vận chuyển" name="shipping_method">
            <Input placeholder="Giao hàng tiêu chuẩn, Giao hàng nhanh..." />
          </Form.Item>

          <Form.Item label="Số theo dõi" name="tracking_number">
            <Input placeholder="Tracking number..." />
          </Form.Item>

          <Form.Item label="Ngày dự kiến giao hàng" name="estimated_delivery">
            <DatePicker 
              style={{ width: "100%" }}
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

          <Form.Item label="Ghi chú" name="notes">
            <Input.TextArea rows={4} placeholder="Ghi chú đơn hàng..." />
          </Form.Item>
        </Space>
      </Form>
    </Create>
  );
};

