import {
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import type { BaseRecord } from "@refinedev/core";
import { Space, Table, Tag, Avatar } from "antd";
import { CustomDeleteButton } from "../../components/custom-delete-button";

export const ProfileList = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title={"ID"} width={80} />
        <Table.Column
          title={"Avatar"}
          dataIndex="avatar_url"
          render={(avatarUrl) => (
            <Avatar
              src={avatarUrl}
              size={40}
              style={{ backgroundColor: '#1890ff' }}
            >
              {!avatarUrl && "U"}
            </Avatar>
          )}
        />
        <Table.Column dataIndex="first_name" title={"Tên"} />
        <Table.Column dataIndex="last_name" title={"Họ"} />
        <Table.Column dataIndex="phone" title={"Số điện thoại"} />
        <Table.Column
          title={"Giới tính"}
          dataIndex="gender"
          render={(gender) => {
            const genderMap = {
              male: { text: "Nam", color: "blue" },
              female: { text: "Nữ", color: "pink" },
              other: { text: "Khác", color: "default" },
            };
            const genderInfo = genderMap[gender as keyof typeof genderMap] || { text: "N/A", color: "default" };
            return <Tag color={genderInfo.color}>{genderInfo.text}</Tag>;
          }}
        />
        <Table.Column
          title={"Vai trò"}
          dataIndex="role"
          render={(role) => {
            const roleMap = {
              admin: { text: "Admin", color: "red" },
              moderator: { text: "Moderator", color: "orange" },
              customer: { text: "Khách hàng", color: "green" },
            };
            const roleInfo = roleMap[role as keyof typeof roleMap] || { text: "N/A", color: "default" };
            return <Tag color={roleInfo.color}>{roleInfo.text}</Tag>;
          }}
        />
        <Table.Column
          title={"Trạng thái"}
          dataIndex="is_verified"
          render={(isVerified) => (
            <Tag color={isVerified ? "green" : "red"}>
              {isVerified ? "Đã xác thực" : "Chưa xác thực"}
            </Tag>
          )}
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
                resource="profiles"
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

