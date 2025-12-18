# Components Directory

Thư mục chứa tất cả React components.

## Cấu trúc

### `/ui`

shadcn/ui components - Base UI components:

- `button.tsx` - Button component
- `input.tsx` - Input component
- `label.tsx` - Label component
- `card.tsx` - Card component
- ...thêm các component khác khi cần

### `/layout`

Layout components cho ứng dụng:

- `sidebar.tsx` - Navigation sidebar với menu
- `dashboard-layout.tsx` - Main dashboard wrapper
- `header.tsx` - Page header (nếu cần)
- `footer.tsx` - Footer (nếu cần)

### `/features`

Feature-specific components, tổ chức theo module:

```
features/
  orders/
    order-list.tsx
    order-card.tsx
    order-form.tsx
  menu/
    menu-list.tsx
    menu-item.tsx
    menu-form.tsx
  ...
```

### `/providers`

React Context providers:

- `auth-provider.tsx` - Authentication provider
- `theme-provider.tsx` - Theme provider (nếu cần)

## Quy tắc đặt tên

- PascalCase cho component files: `MyComponent.tsx`
- Export default cho component chính
- Export named cho helper components

## Best Practices

1. **Single Responsibility**: Mỗi component làm 1 việc
2. **Props Interface**: Luôn định nghĩa props type
3. **Client/Server**: Chỉ dùng "use client" khi cần state/hooks
4. **Composition**: Ưu tiên composition hơn inheritance

## Ví dụ Component

```tsx
// components/features/orders/order-card.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "@/types";

interface OrderCardProps {
  order: Order;
  onSelect?: (id: string) => void;
}

export function OrderCard({ order, onSelect }: OrderCardProps) {
  return (
    <Card onClick={() => onSelect?.(order.id)}>
      <CardHeader>
        <CardTitle>{order.id}</CardTitle>
      </CardHeader>
      <CardContent>{/* Content */}</CardContent>
    </Card>
  );
}
```
