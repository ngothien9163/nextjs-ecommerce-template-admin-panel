# 🔧 Troubleshooting Tổng hợp

## Environment & Kết nối Supabase
- Kiểm tra `.env.local`: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, (nếu cần) `VITE_SUPABASE_SERVICE_ROLE_KEY`.
- Test nhanh: script `scripts/test-service-role.js` hoặc debug logs trên dashboard.

## Database & Permissions
- Nếu gặp `permission denied for schema public`: chạy script fix quyền (xem `sqls/01-fix-database-permissions.sql`) trong Supabase SQL Editor.
- RLS: tạo policy đọc công khai cho list/show, authenticated cho write hoặc dùng service role cho tác vụ admin.

## Media (lỗi thường gặp)
- 401/permission: kiểm tra policies bucket Storage, RLS, service role.
- Malformed array literal: convert string → array cho các TEXT[] fields.
- Pagination total = 0: bật `{ count: 'exact' }`.
- Crop/Preview không chạy: đảm bảo image loaded, tính pixelCrop từ phần trăm → pixel, scale theo natural sizes.

## Products/Categories không load
- Chạy lại các SQL theo thứ tự tạo bảng và insert dữ liệu.
- Đảm bảo interfaces TS khớp schema.

## Circular import (refine pages)
- Tránh export từ `./index` trong cùng thư mục component/page; dùng tên file cụ thể (`./list`, `./create`, ...).

## Import refine đúng package
- UI components từ `@refinedev/antd`; data hooks từ `@refinedev/core`.






