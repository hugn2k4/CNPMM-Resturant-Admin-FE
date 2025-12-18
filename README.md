# Restaurant Admin - Hệ thống quản lý nhà hàng

Ứng dụng quản trị dành cho hệ thống nhà hàng, được xây dựng với Next.js 16, TypeScript, và Tailwind CSS.

## 🎨 Màu sắc chủ đạo

- **Primary (Orange)**: #ff9f0d - Màu cam chủ đạo
- **Secondary (Olive)**: #999966 - Màu olive phụ
- **Accent (Green)**: #195a00 - Màu xanh lá accent

## 🚀 Công nghệ sử dụng

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Icons**: Lucide React

## 📁 Cấu trúc dự án

```
CNPMM-Restaurant-Admin-FE/
├── app/
│   ├── (auth)/              # Auth routes (login, register)
│   │   ├── login/
│   │   └── layout.tsx
│   ├── (dashboard)/         # Dashboard routes (protected)
│   │   ├── dashboard/
│   │   │   ├── page.tsx    # Trang tổng quan
│   │   │   ├── orders/     # Quản lý đơn hàng
│   │   │   ├── menu/       # Quản lý thực đơn
│   │   │   ├── tables/     # Quản lý bàn ăn
│   │   │   ├── reservations/ # Quản lý đặt bàn
│   │   │   ├── customers/  # Quản lý khách hàng
│   │   │   ├── reports/    # Báo cáo thống kê
│   │   │   └── settings/   # Cài đặt
│   │   └── layout.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── layout/              # Layout components (Sidebar, Header)
│   ├── features/            # Feature-specific components
│   └── providers/           # React context providers
├── hooks/                   # Custom React hooks
├── lib/                     # Utility functions
├── services/                # API services
│   ├── api-client.ts       # Axios instance
│   └── auth.service.ts     # Auth API calls
├── stores/                  # Zustand stores
│   └── auth.store.ts       # Authentication state
├── types/                   # TypeScript types
│   ├── auth.ts
│   └── index.ts
├── constants/               # Constants & configs
│   ├── routes.ts           # Route definitions
│   └── navigation.ts       # Navigation items
├── middleware.ts            # Next.js middleware (auth guard)
└── .env.local              # Environment variables
```

## 🛠️ Cài đặt

1. Clone repository:

```bash
git clone <repository-url>
cd CNPMM-Restaurant-Admin-FE
```

2. Cài đặt dependencies:

```bash
npm install
```

3. Tạo file `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME=Restaurant Admin
JWT_SECRET=your-secret-key-change-in-production
```

4. Chạy development server:

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## 🔐 Authentication

Hệ thống sử dụng JWT authentication với Zustand để quản lý state:

- **Login Route**: `/login`
- **Dashboard Route**: `/dashboard` (protected)
- **Middleware**: Tự động redirect nếu chưa đăng nhập

### Tài khoản demo:

- Email: `admin@restaurant.com`
- Password: `admin123`

## 📱 Tính năng chính

### ✅ Đã triển khai:

- ✅ Cấu hình màu sắc theo brand
- ✅ Cấu trúc thư mục production-ready
- ✅ Trang đăng nhập với validation
- ✅ Dashboard layout với sidebar responsive
- ✅ Authentication & protected routes
- ✅ Trang tổng quan với các thống kê
- ✅ Navigation structure cho các module

### 🔜 Sắp triển khai:

- ⏳ Quản lý đơn hàng chi tiết
- ⏳ Quản lý thực đơn (CRUD)
- ⏳ Quản lý bàn ăn
- ⏳ Hệ thống đặt bàn
- ⏳ Quản lý khách hàng
- ⏳ Báo cáo & thống kê
- ⏳ Cài đặt hệ thống

## 🎯 Routing Structure

Dự án sử dụng Next.js App Router với route groups:

- `(auth)` - Public routes: Login, Register
- `(dashboard)` - Protected routes: All admin pages

### Thêm route mới:

1. Tạo folder trong `/app/(dashboard)/dashboard/`
2. Thêm route vào `constants/routes.ts`
3. Thêm navigation item vào `constants/navigation.ts`
4. Sidebar sẽ tự động cập nhật

## 🔧 Scripts

```bash
npm run dev      # Chạy development server
npm run build    # Build production
npm run start    # Start production server
npm run lint     # Chạy ESLint
```

## 🎨 Thêm UI Components

Dự án sử dụng shadcn/ui. Để thêm component mới:

```bash
npx shadcn@latest add <component-name>
```

Ví dụ:

```bash
npx shadcn@latest add dialog
npx shadcn@latest add table
npx shadcn@latest add select
```

## 📝 Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js recommended config
- **Component Pattern**: Client components khi cần state/hooks
- **Naming**: PascalCase cho components, camelCase cho functions

## 🚀 Deployment

Có thể deploy lên:

- **Vercel** (recommended)
- **Netlify**
- **Docker**

```bash
npm run build
npm run start
```

## 📄 License

Private - CNPMM Project

## 👥 Team

Dự án CNPMM - Hệ thống nhà hàng
