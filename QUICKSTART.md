# 🚀 Quick Start - Restaurant Admin

## Khởi chạy nhanh

```bash
# 1. Cài đặt dependencies
npm install

# 2. Chạy development server
npm run dev
```

Mở trình duyệt: http://localhost:3000

## 🔐 Đăng nhập

**Tài khoản demo:**

- Email: `admin@restaurant.com`
- Password: `admin123`

(Lưu ý: Hiện tại chưa kết nối backend thật, có thể nhập bất kỳ để test UI)

## 📱 Các trang đã setup

✅ **Login** - `/login`

- Form validation với Zod
- Responsive design
- Màu sắc theo brand

✅ **Dashboard** - `/dashboard`

- Tổng quan hệ thống
- Thống kê nhanh
- Danh sách đơn hàng gần đây
- Biểu đồ (placeholder)

✅ **Menu Navigation**

- Đơn hàng - `/dashboard/orders`
- Thực đơn - `/dashboard/menu`
- Bàn ăn - `/dashboard/tables`
- Đặt bàn - `/dashboard/reservations`
- Khách hàng - `/dashboard/customers`
- Báo cáo - `/dashboard/reports`
- Cài đặt - `/dashboard/settings`

## 🎨 Màu sắc

- **Primary**: #ff9f0d (Cam)
- **Secondary**: #999966 (Olive)
- **Accent**: #195a00 (Xanh lá)

## 📂 Cấu trúc quan trọng

```
app/
  (auth)/login/          → Trang đăng nhập
  (dashboard)/dashboard/ → Các trang quản trị

components/
  layout/     → Sidebar, Layout
  ui/         → Button, Input, Card...

services/     → API calls
stores/       → Zustand state
types/        → TypeScript types
constants/    → Routes, Navigation
```

## 🔧 Thêm trang mới

1. Tạo file: `app/(dashboard)/dashboard/[ten-trang]/page.tsx`
2. Thêm route: `constants/routes.ts`
3. Thêm nav item: `constants/navigation.ts`
4. Sidebar tự động cập nhật!

## 📚 Tài liệu chi tiết

- [README.md](./README.md) - Tổng quan dự án
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Hướng dẫn phát triển

## 🐛 Gặp lỗi?

### Port đã được sử dụng

```bash
# Đổi port
npm run dev -- -p 3001
```

### Cài lại dependencies

```bash
rm -rf node_modules
npm install
```

### Clear cache

```bash
rm -rf .next
npm run dev
```

## 📦 Dependencies chính

- **Next.js 16** - Framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Zustand** - State management
- **React Hook Form** - Forms
- **Axios** - HTTP client

## 🎯 Bước tiếp theo

1. ✅ Setup project ✅
2. ✅ Tạo login page ✅
3. ✅ Tạo dashboard layout ✅
4. ⏳ Kết nối Backend API
5. ⏳ Implement CRUD cho từng module
6. ⏳ Thêm charts & analytics
7. ⏳ Deploy production

## 💡 Tips

- Dùng `"use client"` cho components có state/hooks
- API calls qua `services/`
- Global state với Zustand `stores/`
- UI components từ `shadcn/ui`

## 🔗 Links

- Dev server: http://localhost:3000
- API: http://localhost:8000/api (cấu hình trong .env.local)

---

**Happy Coding! 🎉**
