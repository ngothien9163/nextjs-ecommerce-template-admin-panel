import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select, Switch, DatePicker, Space } from "antd";

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
          >
            <DatePicker style={{ width: "100%" }} />
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

