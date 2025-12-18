# Services Directory

Thư mục chứa các API service để giao tiếp với Backend.

## Files

### `api-client.ts`

Axios instance được cấu hình với:

- Base URL từ env
- Request interceptor (thêm token)
- Response interceptor (handle errors)
- Wrapper methods: get, post, put, delete, patch

### `auth.service.ts`

Authentication APIs:

- `login(credentials)` - Đăng nhập
- `logout()` - Đăng xuất
- `getCurrentUser()` - Lấy thông tin user
- `refreshToken()` - Refresh JWT token

### Thêm service mới

```typescript
// services/menu.service.ts
import { apiClient } from "./api-client";
import { Menu, MenuItem } from "@/types";

export const menuService = {
  async getAll(): Promise<MenuItem[]> {
    return apiClient.get("/menu");
  },

  async getById(id: string): Promise<MenuItem> {
    return apiClient.get(`/menu/${id}`);
  },

  async create(data: Partial<MenuItem>): Promise<MenuItem> {
    return apiClient.post("/menu", data);
  },

  async update(id: string, data: Partial<MenuItem>): Promise<MenuItem> {
    return apiClient.put(`/menu/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/menu/${id}`);
  },
};
```

## Best Practices

1. **Tất cả API calls** qua `apiClient`
2. **Type safety**: Sử dụng TypeScript generics
3. **Error handling**: Throw errors để component handle
4. **Naming**: `[resource].service.ts`
