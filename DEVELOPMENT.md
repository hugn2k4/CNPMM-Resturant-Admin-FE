# Hướng dẫn phát triển - Restaurant Admin

## Cách thêm module mới

### 1. Tạo route mới

Ví dụ: Thêm module "Staff Management"

#### Bước 1: Tạo folder route

```bash
app/(dashboard)/dashboard/staff/page.tsx
```

#### Bước 2: Thêm route vào constants

`constants/routes.ts`:

```typescript
export const ROUTES = {
  // ... existing routes
  DASHBOARD: {
    // ... existing dashboard routes
    STAFF: "/dashboard/staff",
  },
};
```

#### Bước 3: Thêm navigation item

`constants/navigation.ts`:

```typescript
import { Users } from "lucide-react";

export const NAVIGATION_ITEMS: NavItem[] = [
  // ... existing items
  {
    title: "Nhân viên",
    href: "/dashboard/staff",
    icon: Users,
    description: "Quản lý nhân viên",
  },
];
```

#### Bước 4: Tạo component page

`app/(dashboard)/dashboard/staff/page.tsx`:

```tsx
"use client";

import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function StaffPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          Quản lý nhân viên
        </h1>
      </div>

      <Card>{/* Content here */}</Card>
    </div>
  );
}
```

### 2. Tạo service mới

#### Bước 1: Định nghĩa types

`types/staff.ts`:

```typescript
export interface Staff {
  id: string;
  name: string;
  email: string;
  position: string;
  // ... more fields
}
```

#### Bước 2: Tạo service

`services/staff.service.ts`:

```typescript
import { apiClient } from "./api-client";
import { Staff } from "@/types/staff";

export const staffService = {
  async getAll(): Promise<Staff[]> {
    return apiClient.get("/staff");
  },

  async getById(id: string): Promise<Staff> {
    return apiClient.get(`/staff/${id}`);
  },

  async create(data: Partial<Staff>): Promise<Staff> {
    return apiClient.post("/staff", data);
  },

  async update(id: string, data: Partial<Staff>): Promise<Staff> {
    return apiClient.put(`/staff/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/staff/${id}`);
  },
};
```

### 3. Tạo Zustand store

`stores/staff.store.ts`:

```typescript
import { create } from "zustand";
import { Staff } from "@/types/staff";
import { staffService } from "@/services/staff.service";

interface StaffState {
  staff: Staff[];
  isLoading: boolean;
  error: string | null;
  fetchStaff: () => Promise<void>;
  addStaff: (data: Partial<Staff>) => Promise<void>;
  updateStaff: (id: string, data: Partial<Staff>) => Promise<void>;
  deleteStaff: (id: string) => Promise<void>;
}

export const useStaffStore = create<StaffState>((set) => ({
  staff: [],
  isLoading: false,
  error: null,

  fetchStaff: async () => {
    set({ isLoading: true, error: null });
    try {
      const staff = await staffService.getAll();
      set({ staff, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch staff", isLoading: false });
    }
  },

  addStaff: async (data) => {
    try {
      const newStaff = await staffService.create(data);
      set((state) => ({ staff: [...state.staff, newStaff] }));
    } catch (error) {
      throw error;
    }
  },

  updateStaff: async (id, data) => {
    try {
      const updatedStaff = await staffService.update(id, data);
      set((state) => ({
        staff: state.staff.map((s) => (s.id === id ? updatedStaff : s)),
      }));
    } catch (error) {
      throw error;
    }
  },

  deleteStaff: async (id) => {
    try {
      await staffService.delete(id);
      set((state) => ({
        staff: state.staff.filter((s) => s.id !== id),
      }));
    } catch (error) {
      throw error;
    }
  },
}));
```

### 4. Tạo custom hook

`hooks/use-staff.ts`:

```typescript
import { useEffect } from "react";
import { useStaffStore } from "@/stores/staff.store";

export function useStaff() {
  const { staff, isLoading, error, fetchStaff } = useStaffStore();

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  return { staff, isLoading, error };
}
```

### 5. Sử dụng trong component

```tsx
"use client";

import { useStaff } from "@/hooks/use-staff";
import { useStaffStore } from "@/stores/staff.store";
import { Button } from "@/components/ui/button";

export default function StaffPage() {
  const { staff, isLoading } = useStaff();
  const { addStaff, deleteStaff } = useStaffStore();

  const handleAdd = async () => {
    await addStaff({
      name: "New Staff",
      email: "staff@restaurant.com",
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <Button onClick={handleAdd}>Add Staff</Button>
      {staff.map((s) => (
        <div key={s.id}>
          {s.name}
          <Button onClick={() => deleteStaff(s.id)}>Delete</Button>
        </div>
      ))}
    </div>
  );
}
```

## Cấu trúc Component

### Layout Component

```
components/layout/
  ├── sidebar.tsx          # Navigation sidebar
  ├── header.tsx           # Page header
  ├── dashboard-layout.tsx # Main dashboard layout
  └── mobile-nav.tsx       # Mobile navigation
```

### Feature Component

```
components/features/
  ├── orders/
  │   ├── order-list.tsx
  │   ├── order-detail.tsx
  │   └── order-form.tsx
  ├── menu/
  │   ├── menu-list.tsx
  │   └── menu-form.tsx
  └── ...
```

### UI Component (shadcn/ui)

```
components/ui/
  ├── button.tsx
  ├── input.tsx
  ├── card.tsx
  └── ...
```

## Best Practices

### 1. Component Organization

- Client components: `"use client"` directive
- Server components: Default (no directive)
- Shared logic: Custom hooks in `/hooks`

### 2. State Management

- Local state: `useState`
- Global state: Zustand stores
- Server state: React Query (nếu cần)

### 3. Styling

- Sử dụng Tailwind CSS classes
- Sử dụng `cn()` utility để merge classes
- Theme colors: `bg-primary`, `text-primary`, etc.

### 4. API Calls

- Tất cả API calls qua `apiClient`
- Tạo service riêng cho mỗi resource
- Handle errors properly

### 5. Form Handling

```tsx
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Required"),
  email: z.string().email(),
});

type FormData = z.infer<typeof schema>;

function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    // Handle submit
  };

  return <form onSubmit={handleSubmit(onSubmit)}>{/* Form fields */}</form>;
}
```

## Testing

### Unit Tests

```bash
npm run test
```

### E2E Tests

```bash
npm run test:e2e
```

## Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# App Configuration
NEXT_PUBLIC_APP_NAME=Restaurant Admin

# Authentication
JWT_SECRET=your-secret-key
```

## Debugging

### Next.js DevTools

- Press `Shift + Ctrl + P` → "Next.js: Show DevTools"

### React DevTools

- Install React DevTools extension
- Inspect component tree and props

### Network Requests

- Open Browser DevTools → Network tab
- Monitor API calls and responses

## Common Issues

### 1. Hydration Error

```tsx
// ❌ Bad
const MyComponent = () => {
  const [mounted, setMounted] = useState(false);
  if (!mounted) return null;

  return <div>{localStorage.getItem("key")}</div>;
};

// ✅ Good
const MyComponent = () => {
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(localStorage.getItem("key") || "");
  }, []);

  return <div>{value}</div>;
};
```

### 2. API Authentication

Ensure token is in localStorage:

```typescript
localStorage.setItem("token", token);
```

### 3. Route Not Found

- Check file structure in `app/` folder
- Verify route naming matches URL

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Zustand](https://zustand-demo.pmnd.rs)
- [React Hook Form](https://react-hook-form.com)
