import React from 'react';
import { Select, Tag, Space, Tooltip } from 'antd';
import { TagsOutlined, InfoCircleOutlined } from '@ant-design/icons';

interface KeywordsInputProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  tooltip?: string;
  label?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  maxTags?: number;
  allowDuplicates?: boolean;
}

export const KeywordsInput: React.FC<KeywordsInputProps> = ({
  value = [],
  onChange,
  placeholder = "Nhập từ khóa, phân cách bằng dấu phẩy",
  tooltip = "Nhập từ khóa SEO, phân cách bằng dấu phẩy. Ví dụ: Laptop Asus ExpertBook B1, Gaming, Computer",
  label = "Keywords",
  style,
  disabled = false,
  maxTags = 20,
  allowDuplicates = false,
}) => {
  const handleChange = (newValue: string[]) => {
    if (!onChange) return;
    
    // Loại bỏ duplicates nếu không cho phép
    let processedValue = newValue;
    if (!allowDuplicates) {
      processedValue = [...new Set(newValue)];
    }
    
    // Giới hạn số lượng tags
    if (maxTags && processedValue.length > maxTags) {
      processedValue = processedValue.slice(0, maxTags);
    }
    
    // Loại bỏ các tag rỗng
    processedValue = processedValue.filter(tag => tag && tag.trim().length > 0);
    
    onChange(processedValue);
  };

  const handleTagClose = (removedTag: string) => {
    const newValue = value.filter(tag => tag !== removedTag);
    handleChange(newValue);
  };

  return (
    <div style={style}>
      {label && (
        <div style={{ marginBottom: 8 }}>
          <Space>
            <TagsOutlined />
            <span>{label}</span>
            {tooltip && (
              <Tooltip title={tooltip}>
                <InfoCircleOutlined style={{ color: "#1890ff" }} />
              </Tooltip>
            )}
          </Space>
        </div>
      )}
      
             <Select
         mode="tags"
         placeholder={placeholder}
         style={{ width: '100%' }}
         tokenSeparators={[',']}
         open={false}
         dropdownStyle={{ display: 'none' }}
         disabled={disabled}
         value={value}
         onChange={handleChange}
         tagRender={(props) => {
           const { label: tagLabel, closable, onClose } = props;
           return (
             <Tag
               color="blue"
               closable={closable && !disabled}
               onClose={onClose}
               style={{ 
                 marginRight: 3, 
                 marginBottom: 3,
                 maxWidth: '300px',
                 overflow: 'hidden',
                 textOverflow: 'ellipsis',
                 whiteSpace: 'nowrap'
               }}
               title={tagLabel}
             >
               {tagLabel}
             </Tag>
           );
         }}
         maxTagCount={maxTags}
         maxTagTextLength={50}
       />
      
      {maxTags && value.length >= maxTags && (
        <div style={{ 
          fontSize: '12px', 
          color: '#999', 
          marginTop: '4px' 
        }}>
          Đã đạt giới hạn {maxTags} từ khóa
        </div>
      )}
    </div>
  );
};

export default KeywordsInput;
