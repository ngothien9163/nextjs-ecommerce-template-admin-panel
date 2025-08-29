import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Descriptions, Tag, Avatar, Space } from "antd";

const { Title } = Typography;

export const ProfileShow = () => {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>Thông tin người dùng</Title>
      <Descriptions bordered column={2}>
        <Descriptions.Item label="ID" span={1}>
          {record?.id}
        </Descriptions.Item>
        <Descriptions.Item label="Avatar" span={1}>
          <Avatar
            src={record?.avatar_url}
            size={64}
            style={{ backgroundColor: '#1890ff' }}
          >
            {!record?.avatar_url && "U"}
          </Avatar>
        </Descriptions.Item>
        <Descriptions.Item label="Tên" span={1}>
          {record?.first_name || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Họ" span={1}>
          {record?.last_name || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Số điện thoại" span={1}>
          {record?.phone || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày sinh" span={1}>
          {record?.date_of_birth ? new Date(record.date_of_birth).toLocaleDateString("vi-VN") : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Giới tính" span={1}>
          {record?.gender ? (
            <Tag color={
              record.gender === 'male' ? 'blue' : 
              record.gender === 'female' ? 'pink' : 'default'
            }>
              {record.gender === 'male' ? 'Nam' : 
               record.gender === 'female' ? 'Nữ' : 'Khác'}
            </Tag>
          ) : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Vai trò" span={1}>
          {record?.role ? (
            <Tag color={
              record.role === 'admin' ? 'red' : 
              record.role === 'moderator' ? 'orange' : 'green'
            }>
              {record.role === 'admin' ? 'Admin' : 
               record.role === 'moderator' ? 'Moderator' : 'Khách hàng'}
            </Tag>
          ) : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái xác thực" span={1}>
          <Tag color={record?.is_verified ? "green" : "red"}>
            {record?.is_verified ? "Đã xác thực" : "Chưa xác thực"}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Tùy chọn" span={2}>
          {record?.preferences ? (
            <pre style={{ fontSize: '12px', maxHeight: '200px', overflow: 'auto' }}>
              {JSON.stringify(record.preferences, null, 2)}
            </pre>
          ) : "N/A"}
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
