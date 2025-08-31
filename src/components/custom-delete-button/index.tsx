import React from 'react';
import { Button, Popconfirm, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useDelete } from '@refinedev/core';

interface CustomDeleteButtonProps {
  recordItemId: string;
  resource: string;
  size?: 'small' | 'middle' | 'large';
  hideText?: boolean;
  onSuccess?: () => void;
}

export const CustomDeleteButton: React.FC<CustomDeleteButtonProps> = ({
  recordItemId,
  resource,
  size = 'small',
  hideText = true,
  onSuccess,
}) => {
  const { mutate: deleteOne, isLoading } = useDelete();

  const handleDelete = () => {
    deleteOne(
      {
        resource,
        id: recordItemId,
      },
      {
        onSuccess: () => {
          message.success('Xóa thành công!');
          onSuccess?.();
        },
        onError: (error) => {
          message.error(`Lỗi khi xóa: ${error.message}`);
        },
      }
    );
  };

  const getConfirmMessage = () => {
    const resourceMap: Record<string, string> = {
      'categories': 'danh mục',
      'products': 'sản phẩm',
      'profiles': 'người dùng',
      'blog-posts': 'bài viết',
      'blog-categories': 'danh mục blog',
      'blog-comments': 'bình luận',
      'blog-post-tags': 'tag bài viết',
      'tags': 'tag',
      'orders': 'đơn hàng',
      'product-variants': 'biến thể sản phẩm',
    };

    const resourceName = resourceMap[resource] || 'mục này';
    return `Bạn có chắc chắn muốn xóa ${resourceName} này không? Hành động này không thể hoàn tác.`;
  };

  return (
    <Popconfirm
      title="Xác nhận xóa"
      description={getConfirmMessage()}
      onConfirm={handleDelete}
      okText="Xóa"
      cancelText="Hủy"
      okType="danger"
      placement="topRight"
    >
      <Button
        type="text"
        size={size}
        danger
        loading={isLoading}
        icon={<DeleteOutlined />}
        title="Xóa"
      >
        {!hideText && 'Xóa'}
      </Button>
    </Popconfirm>
  );
};

