import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import type { BaseRecord } from "@refinedev/core";
import { Space, Table, Button, message } from "antd";
import { useEffect, useState } from "react";
import { testSupabaseConnection, testEnvironmentVariables } from "../../lib/supabase";

export const CategoryList = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Test connection when component mounts
    testSupabaseConnection();
    // Test environment variables
    testEnvironmentVariables();
  }, []);

  const handleTestConnection = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await testSupabaseConnection();
      if (result.success) {
        message.success('Kết nối Supabase thành công!');
      } else {
        setError(result.error || 'Lỗi không xác định');
        message.error(`Kết nối thất bại: ${result.error}`);
      }
    } catch (err) {
      const errorMsg = String(err);
      setError(errorMsg);
      message.error(`Lỗi: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <List>
      <div style={{ marginBottom: 16 }}>
        <Button onClick={handleTestConnection} type="primary" loading={isLoading}>
          Test Kết nối Supabase
        </Button>
        <Button 
          onClick={() => testEnvironmentVariables()} 
          style={{ marginLeft: 8 }}
        >
          Test Environment Variables
        </Button>
        {isLoading && <span style={{ marginLeft: 16 }}>🔄 Đang tải...</span>}
        {error && <span style={{ marginLeft: 16, color: 'red' }}>❌ Lỗi: {error}</span>}
      </div>
      
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title={"ID"} />
        <Table.Column dataIndex="name" title={"Tên danh mục"} />
        <Table.Column dataIndex="slug" title={"Slug"} />
        <Table.Column dataIndex="description" title={"Mô tả"} />
        <Table.Column dataIndex="is_active" title={"Trạng thái"} />
        <Table.Column
          title={"Actions"}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
