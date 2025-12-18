# 🎯 Layout Structure - Restaurant Admin

## Cấu trúc Layout

Layout đã được tổ chức rõ ràng với **2 phần chính**:

### 1. 📱 Navigation Sidebar (Bên trái)

- **Vị trí**: Fixed ở bên trái màn hình
- **Chiều rộng**: 288px (72 trong Tailwind = 18rem)
- **Responsive**:
  - Desktop (≥1024px): Luôn hiển thị
  - Mobile (<1024px): Ẩn, hiện hamburger menu

**Features:**

- ✅ Logo và tên hệ thống
- ✅ Menu navigation với 8 modules
- ✅ Active route highlighting
- ✅ User profile section
- ✅ Nút đăng xuất

### 2. 📄 Content Area (Bên phải)

- **Vị trí**: Chiếm phần còn lại bên phải
- **Layout**: Flex-1 với margin-left 288px (desktop)
- **Max width**: 7xl (1280px) để nội dung không quá rộng

**Components:**

- ✅ **PageHeader**: Tự động hiển thị title, description, search
- ✅ **Main Content**: Children components từ pages

## 🔄 Authentication Flow

### Đăng nhập thành công:

```
Login Page (/login)
    ↓
  Nhập email & password
    ↓
  Submit form
    ↓
  Set user data vào Zustand store
  Set token vào localStorage
    ↓
  Router.push('/dashboard')
    ↓
  Dashboard Page ✅
```

### Đăng xuất:

```
Click "Đăng xuất" button
    ↓
  Clear Zustand store
  Remove token từ localStorage
    ↓
  Router.push('/login')
    ↓
  Login Page ✅
```

## 📁 File Structure

```
components/layout/
  ├── sidebar.tsx           # Navigation sidebar
  ├── dashboard-layout.tsx  # Main layout wrapper
  └── page-header.tsx       # Auto page header

app/
  ├── (auth)/
  │   └── login/
  │       └── page.tsx      # Login form
  │
  └── (dashboard)/
      ├── layout.tsx        # Dashboard layout wrapper
      └── dashboard/
          ├── page.tsx      # Main dashboard
          ├── orders/       # Orders page
          ├── menu/         # Menu page
          ├── tables/       # Tables page
          └── ...
```

## 🎨 PageHeader Component

Tự động hiển thị cho mỗi trang dựa trên route:

```tsx
<PageHeader />
```

**Auto features:**

- ✅ Page title từ navigation config
- ✅ Page description
- ✅ Search bar
- ✅ Action buttons (notifications)

## 💻 Desktop Layout

```
┌─────────────────────────────────────────┐
│ ┌──────────┐ ┌────────────────────────┐ │
│ │          │ │  PageHeader            │ │
│ │          │ │  - Title               │ │
│ │ Sidebar  │ │  - Search              │ │
│ │          │ └────────────────────────┘ │
│ │ - Logo   │ ┌────────────────────────┐ │
│ │ - Nav    │ │                        │ │
│ │ - Menu   │ │   Main Content         │ │
│ │          │ │                        │ │
│ │ - User   │ │   (Dashboard, Orders,  │ │
│ │ - Logout │ │    Menu, etc.)         │ │
│ │          │ │                        │ │
│ └──────────┘ └────────────────────────┘ │
└─────────────────────────────────────────┘
```

## 📱 Mobile Layout

```
┌────────────────────────┐
│ ☰ Menu Button          │
├────────────────────────┤
│  PageHeader            │
│  - Title               │
│  - Search              │
├────────────────────────┤
│                        │
│   Main Content         │
│                        │
│                        │
└────────────────────────┘

[Tap ☰ to open sidebar overlay]
```

## 🔧 Cách sử dụng

### Thêm trang mới:

1. **Tạo page file:**

```tsx
// app/(dashboard)/dashboard/staff/page.tsx
export default function StaffPage() {
  return (
    <div className="space-y-6">
      <Card>{/* Content */}</Card>
    </div>
  );
}
```

2. **Thêm vào navigation:**

```tsx
// constants/navigation.ts
{
  title: "Nhân viên",
  href: "/dashboard/staff",
  icon: Users,
  description: "Quản lý nhân viên",
}
```

3. **Thêm route:**

```tsx
// constants/routes.ts
STAFF: "/dashboard/staff";
```

✅ **Done!** PageHeader tự động hiển thị title & description.

## 🎯 Login Mock

Hiện tại login đang dùng **mock data** để test:

```tsx
// Nhập bất kỳ email & password (≥6 ký tự)
// Sẽ tạo mock user và redirect vào dashboard

{
  id: "1",
  email: data.email,
  name: "Admin User",
  role: "admin",
  token: "mock-jwt-token"
}
```

**Sau này:** Thay thế bằng API call thật trong `services/auth.service.ts`

## 🚀 Đã cải thiện

### ✅ Layout Structure

- Clear separation: Navigation vs Content
- Responsive design
- Consistent spacing & padding

### ✅ Navigation

- Active route highlighting
- Smooth transitions
- Mobile hamburger menu
- User profile display

### ✅ PageHeader Component

- Auto title/description từ route
- Search bar sẵn sàng
- Notification button placeholder

### ✅ Authentication

- Login với validation
- Mock login hoạt động
- Logout redirect về login
- Token storage

## 📝 Next Steps

1. ⏳ Kết nối Backend API thật
2. ⏳ Implement search functionality
3. ⏳ Add notifications system
4. ⏳ Add loading states
5. ⏳ Add error boundaries

## 🎨 Customization

### Thay đổi sidebar width:

```tsx
// components/layout/sidebar.tsx
className = "w-72"; // Đổi thành w-64, w-80, etc.

// components/layout/dashboard-layout.tsx
className = "lg:ml-72"; // Đổi tương ứng
```

### Thay đổi max-width content:

```tsx
// components/layout/dashboard-layout.tsx
className = "max-w-7xl"; // Đổi thành max-w-6xl, max-w-full, etc.
```

### Ẩn PageHeader ở trang cụ thể:

```tsx
// Không cần PageHeader? Comment ra trong layout hoặc
// tạo layout riêng cho trang đó
```

---

**Kết quả:** Layout rõ ràng, dễ sử dụng, sẵn sàng phát triển tiếp! 🎉
