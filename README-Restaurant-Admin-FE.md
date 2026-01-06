# Restaurant Admin Dashboard

> Modern admin dashboard for restaurant management built with Next.js 16 and React 19.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

## Features

- 📊 Interactive Dashboard with Charts & Statistics
- 📦 Order Management & Real-time Tracking
- 🍽️ Product & Category Management
- 👥 Customer & User Management
- 🔔 Real-time Notifications
- 🎨 Modern UI with Dark Mode Support
- 📱 Fully Responsive Design
- 🔐 Role-based Access Control

## Tech Stack

**Framework:** Next.js 16 (App Router)  
**UI Library:** React 19  
**Language:** TypeScript  
**Styling:** Tailwind CSS 4  
**UI Components:** shadcn/ui (Radix UI)  
**State Management:** Zustand  
**Forms:** React Hook Form + Zod  
**HTTP Client:** Axios  
**Charts:** Recharts  

## Brand Colors

- **Primary:** `#ff9f0d` (Orange)
- **Secondary:** `#999966` (Olive)
- **Accent:** `#195a00` (Green)

## Prerequisites

- Node.js >= 18.x
- npm or yarn
- Backend API running (see CNPMM-Resturant-Admin-BE)

## Getting Started

```bash
# Clone repository
git clone <repository-url>
cd ADMIN/CNPMM-Resturant-Admin-FE

# Install dependencies
npm install

# Setup environment variables
cp .env.local.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3001](http://localhost:3001)

## Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_APP_NAME=Restaurant Admin
NEXT_PUBLIC_TOKEN_KEY=admin_token
```

## Project Structure

```
app/
├── (auth)/           # Auth routes (login, register)
│   └── login/
├── (dashboard)/      # Protected dashboard routes
│   ├── page.tsx     # Dashboard home
│   ├── orders/      # Order management
│   ├── products/    # Product management
│   ├── categories/  # Category management
│   ├── customers/   # Customer management
│   ├── users/       # User/staff management
│   └── settings/    # Settings
components/
├── ui/              # shadcn/ui components
├── layout/          # Layout components
├── dashboard/       # Dashboard-specific components
├── orders/          # Order components
└── products/        # Product components
services/
├── api.ts          # Axios instance
├── auth.service.ts
├── orders.service.ts
└── products.service.ts
stores/
├── authStore.ts
├── orderStore.ts
└── productStore.ts
```

## Features Overview

### Dashboard
- Revenue & sales statistics
- Recent orders
- Top products
- Customer insights
- Real-time updates

### Order Management
- View all orders with filters
- Update order status
- Order details & tracking
- Print invoices
- Search & pagination

### Product Management
- CRUD operations
- Image upload
- Category assignment
- Stock management
- Bulk actions

### User Management
- Manage admin/staff accounts
- Role assignment (Admin, Manager, Staff)
- User permissions
- Active/Inactive status

### Profile & Settings
- Update profile information
- Change password
- Upload avatar
- Theme preferences

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Adding UI Components

This project uses shadcn/ui components:

```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add table
```

## Authentication

Protected routes require authentication. Middleware handles redirects automatically.

```typescript
// Example protected page
import { useAuthStore } from '@/stores/authStore'

export default function DashboardPage() {
  const { user } = useAuthStore()
  // ...
}
```

## API Integration

```typescript
// services/api.ts
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

## Deployment

### Vercel (Recommended)

```bash
vercel
```

### Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm install --production
EXPOSE 3001
CMD ["npm", "start"]
```

## Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)

## License

Private - CNPMM Team

## Team

Developed by CNPMM Team
