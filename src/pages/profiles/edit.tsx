import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select, Switch, DatePicker, Space } from "antd";
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Configure dayjs
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('vi');

export const ProfileEdit = () => {
  const { formProps, saveButtonProps, queryResult } = useForm();

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Space direction="vertical" style={{ width: "100%" }}>
          <Form.Item
            label="Tên"
            name="first_name"
            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Họ"
            name="last_name"
            rules={[{ required: true, message: "Vui lòng nhập họ!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Ngày sinh"
            name="date_of_birth"
            getValueFromEvent={(value) => {
              // Convert dayjs object to ISO string for database
              return value ? dayjs(value).toISOString() : null;
            }}
            getValueProps={(value) => {
              // Convert ISO string from database to dayjs object for DatePicker
              return {
                value: value ? dayjs(value) : null
              };
            }}
          >
            <DatePicker 
              style={{ width: "100%" }} 
              format="DD/MM/YYYY"
              placeholder="Chọn ngày sinh"
            />
          </Form.Item>

          <Form.Item
            label="Giới tính"
            name="gender"
            rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
          >
            <Select>
              <Select.Option value="male">Nam</Select.Option>
              <Select.Option value="female">Nữ</Select.Option>
              <Select.Option value="other">Khác</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Vai trò"
            name="role"
            rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
          >
            <Select>
              <Select.Option value="customer">Khách hàng</Select.Option>
              <Select.Option value="moderator">Moderator</Select.Option>
              <Select.Option value="admin">Admin</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="URL Avatar"
            name="avatar_url"
          >
            <Input placeholder="https://example.com/avatar.jpg" />
          </Form.Item>

          <Form.Item
            label="Tài khoản đã xác thực"
            name="is_verified"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="Tùy chọn (JSON)"
            name="preferences"
          >
            <Input.TextArea 
              rows={4} 
              placeholder='{"theme": "dark", "language": "vi"}'
            />
          </Form.Item>
        </Space>
      </Form>
    </Edit>
  );
};

