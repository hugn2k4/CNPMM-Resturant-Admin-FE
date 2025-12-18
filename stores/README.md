# Stores Directory

Thư mục chứa Zustand stores cho global state management.

## Files

### `auth.store.ts`

Authentication state:

- `user` - Current user info
- `token` - JWT token
- `isAuthenticated` - Auth status
- `login()` - Login action
- `logout()` - Logout action

## Tạo store mới

```typescript
// stores/cart.store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,

      addItem: (item) =>
        set((state) => ({
          items: [...state.items, item],
          total: state.total + item.price * item.quantity,
        })),

      removeItem: (id) =>
        set((state) => {
          const item = state.items.find((i) => i.id === id);
          return {
            items: state.items.filter((i) => i.id !== id),
            total: item ? state.total - item.price * item.quantity : state.total,
          };
        }),

      clearCart: () => set({ items: [], total: 0 }),
    }),
    {
      name: "cart-storage",
    }
  )
);
```

## Sử dụng trong component

```tsx
"use client";

import { useCartStore } from "@/stores/cart.store";

export function CartComponent() {
  const { items, total, addItem, removeItem } = useCartStore();

  return (
    <div>
      <p>Total: {total}</p>
      {items.map((item) => (
        <div key={item.id}>
          {item.name} - {item.quantity}
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
}
```

## Best Practices

1. **Persist important data**: Sử dụng persist middleware
2. **Type safety**: Định nghĩa interface rõ ràng
3. **Selectors**: Chỉ lấy data cần thiết để tránh re-render
4. **Actions**: Group related actions trong cùng store
5. **Naming**: `use[Name]Store` convention
