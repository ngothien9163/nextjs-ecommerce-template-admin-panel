import React, { useMemo } from 'react';
import ReactJson, { InteractionProps } from 'react-json-view';

interface JsonFieldProps {
  value?: any;
  onChange?: (value: any) => void;
  height?: number | string;
  collapsed?: boolean | number;
}

export const JsonField: React.FC<JsonFieldProps> = ({
  value,
  onChange,
  height = 260,
  collapsed = 1,
}) => {
  const normalized = useMemo(() => {
    if (value == null || value === '') return {};
    if (typeof value === 'string') {
      try { return JSON.parse(value); } catch { return {}; }
    }
    return value;
  }, [value]);

  const apply = (e: InteractionProps) => {
    onChange?.(e.updated_src);
  };

  return (
    <div style={{ border: '1px solid #f0f0f0', borderRadius: 6, padding: 8 }}>
      <div style={{ maxHeight: height, overflow: 'auto' }}>
        <ReactJson 
          src={normalized}
          onEdit={apply}
          onAdd={apply}
          onDelete={apply}
          collapsed={typeof collapsed === 'number' ? collapsed : (collapsed ? 1 : false)}
          enableClipboard
          displayDataTypes={false}
          displayObjectSize={false}
          name={false}
          style={{ background: 'transparent' }}
        />
      </div>
    </div>
  );
};


