# 📚 **HƯỚNG DẪN IMPORT REFINE - TRÁNH LỖI EXPORT**

## **❌ Lỗi thường gặp:**
```
Uncaught SyntaxError: The requested module '/node_modules/.vite/deps/@refinedev_antd.js' does not provide an export named 'useShow'
```

## **✅ Cách import đúng:**

### **1. Components UI (từ @refinedev/antd):**
```typescript
import { 
  List, 
  Create, 
  Edit, 
  Show,
  DeleteButton,
  EditButton,
  ShowButton,
  useTable 
} from "@refinedev/antd";
```

### **2. Hooks (từ @refinedev/core):**
```typescript
import { 
  useShow,
  useForm,
  useSelect,
  useTable 
} from "@refinedev/core";
```

### **3. Import đúng cho từng trường hợp:**

#### **Show Component:**
```typescript
// ✅ ĐÚNG
import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";

// ❌ SAI
import { Show, useShow } from "@refinedev/antd";
```

#### **Form Components:**
```typescript
// ✅ ĐÚNG
import { Create, Edit } from "@refinedev/antd";
import { useForm } from "@refinedev/core";

// ❌ SAI
import { Create, Edit, useForm } from "@refinedev/antd";
```

#### **Table Components:**
```typescript
// ✅ ĐÚNG
import { List, useTable } from "@refinedev/antd";

// ❌ SAI
import { List } from "@refinedev/antd";
import { useTable } from "@refinedev/core";
```

## **🔍 Kiểm tra nhanh:**

### **Từ @refinedev/antd:**
- `List`, `Create`, `Edit`, `Show` - Components UI
- `DeleteButton`, `EditButton`, `ShowButton` - Action buttons
- `useTable` - Hook cho table (có thể từ cả 2 package)

### **Từ @refinedev/core:**
- `useShow`, `useForm`, `useSelect` - Data hooks
- `useTable` - Hook cho table (có thể từ cả 2 package)

## **📝 Ví dụ hoàn chỉnh:**

```typescript
// ✅ Import đúng
import { Show, useTable } from "@refinedev/antd";
import { useShow, useForm, useSelect } from "@refinedev/core";
import { Space, Table, Tag } from "antd";

export const MyComponent = () => {
  const { queryResult } = useShow();
  const { formProps } = useForm();
  const { selectProps } = useSelect({
    resource: "categories",
    optionLabel: "name",
    optionValue: "id",
  });

  return (
    <Show>
      {/* Component content */}
    </Show>
  );
};
```

## **🚨 Lưu ý quan trọng:**

1. **Components UI** luôn từ `@refinedev/antd`
2. **Data Hooks** luôn từ `@refinedev/core`
3. **useTable** có thể từ cả 2 package, nhưng khuyến nghị dùng từ `@refinedev/antd`
4. Luôn kiểm tra import khi gặp lỗi export

## **🔧 Cách sửa lỗi:**

1. **Tách riêng imports:**
   ```typescript
   // Trước (SAI)
   import { Show, useShow } from "@refinedev/antd";
   
   // Sau (ĐÚNG)
   import { Show } from "@refinedev/antd";
   import { useShow } from "@refinedev/core";
   ```

2. **Kiểm tra package.json** để đảm bảo đã cài đúng dependencies
3. **Restart dev server** sau khi sửa imports

