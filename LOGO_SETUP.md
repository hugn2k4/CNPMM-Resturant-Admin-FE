# Logo Setup Instructions

## Thêm Logo vào dự án

### Bước 1: Lưu logo

1. Lưu hình ảnh logo (Siupo) bạn đã gửi
2. Đặt tên file: **logo.png**
3. Copy vào thư mục: `public/logo.png`

### Bước 2: Verify

Đảm bảo file tồn tại tại:

```
public/
  └── logo.png  ← Logo của bạn ở đây
```

### Logo đã được tích hợp vào:

- ✅ Sidebar header (thay thế ChefHat icon)
- ✅ Size: 48x48px, rounded full
- ✅ Hover effect: scale-105
- ✅ Background: white với shadow

## Đã fix lỗi Navigation

### Vấn đề:

- Click vào menu item → Mất active state
- Pathname không match đúng

### Giải pháp:

```typescript
// Trước (Sai):
const isActive = pathname === item.href;

// Sau (Đúng):
const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
```

### Logic mới:

- `/dashboard` → Active khi pathname = `/dashboard` (exact match)
- `/dashboard/orders` → Active khi pathname starts with `/dashboard/orders`
- Tránh `/dashboard/orders` active khi ở `/dashboard`

## Test

1. ✅ Logo hiển thị trong sidebar
2. ✅ Click "Tổng quan" → Active state vẫn còn
3. ✅ Click "Đơn hàng" → Active state đúng
4. ✅ Navigation không bị mất
5. ✅ Hover logo → Scale effect

---

**Note**: Nếu logo không hiển thị, check:

1. File có tồn tại ở `public/logo.png`?
2. Tên file chính xác (case-sensitive)?
3. Restart dev server: `npm run dev`
