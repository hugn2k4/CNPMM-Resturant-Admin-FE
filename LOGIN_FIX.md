# ✅ Login/Logout Fix - Authentication Flow

## 🐛 Vấn đề đã sửa

**Triệu chứng:** Đăng nhập xong không chuyển sang trang dashboard

**Nguyên nhân:**

- Code login lưu token vào `localStorage`
- Middleware kiểm tra token từ `cookies`
- Không match → Middleware redirect về login

## 🔧 Giải pháp

### 1. Cookie Utility

Tạo utility để quản lý cookies dễ dàng:

```typescript
// lib/cookies.ts
export const cookieUtils = {
  set(name: string, value: string, days: number = 1) {...}
  get(name: string): string | null {...}
  delete(name: string) {...}
  has(name: string): boolean {...}
}
```

### 2. Login Flow - Lưu cả localStorage VÀ cookies

```typescript
// app/(auth)/login/page.tsx

const onSubmit = async (data: LoginFormData) => {
  // ... validation ...

  // Set Zustand store
  useAuthStore.setState({
    user: {...},
    token: "mock-jwt-token",
    isAuthenticated: true,
  });

  // Save to localStorage (cho API client)
  localStorage.setItem("token", "mock-jwt-token");

  // Save to cookies (cho middleware) ✅
  cookieUtils.set("token", "mock-jwt-token", 1); // 1 day

  // Redirect to dashboard
  router.push("/dashboard");
}
```

### 3. Logout Flow - Xóa cả localStorage VÀ cookies

```typescript
// components/layout/sidebar.tsx

const handleLogout = () => {
  // Clear Zustand store
  logout();

  // Clear localStorage
  localStorage.removeItem("token");

  // Clear cookie ✅
  cookieUtils.delete("token");

  // Redirect to login
  router.push("/login");
};
```

### 4. Middleware - Kiểm tra cookie

```typescript
// middleware.ts

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value; ✅

  // Public routes
  const isPublicRoute = pathname === "/login" || pathname === "/";

  // Protected route without token → redirect to login
  if (!isPublicRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Login page with token → redirect to dashboard
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}
```

## 🎯 Authentication Flow hoàn chỉnh

### Login thành công:

```
1. User nhập email & password
   ↓
2. Validation pass
   ↓
3. Set Zustand store (user, token, isAuthenticated)
   ↓
4. Save token to localStorage ✅
   ↓
5. Save token to cookies ✅
   ↓
6. Router.push("/dashboard")
   ↓
7. Middleware check cookies → có token ✅
   ↓
8. Allow access to dashboard 🎉
```

### Logout:

```
1. Click "Đăng xuất"
   ↓
2. Clear Zustand store
   ↓
3. Remove token from localStorage ✅
   ↓
4. Delete token cookie ✅
   ↓
5. Router.push("/login")
   ↓
6. Middleware check cookies → không có token ✅
   ↓
7. Allow access to login page 🎉
```

## 🔐 Token Storage Strategy

### localStorage:

- **Mục đích**: API client sử dụng (axios interceptor)
- **Truy cập**: Client-side JavaScript
- **Ưu điểm**: Dễ truy cập, persist sau reload

### cookies:

- **Mục đích**: Middleware authentication
- **Truy cập**: Server-side (middleware) + Client-side
- **Ưu điểm**: Middleware có thể đọc, tự động gửi với requests

### Zustand store:

- **Mục đích**: Global state, user info
- **Truy cập**: React components
- **Ưu điểm**: Reactive, persist với middleware

## 📝 Files đã sửa

1. ✅ [lib/cookies.ts](lib/cookies.ts) - **NEW** Cookie utilities
2. ✅ [app/(auth)/login/page.tsx](<app/(auth)/login/page.tsx>) - Save to cookies
3. ✅ [components/layout/sidebar.tsx](components/layout/sidebar.tsx) - Delete cookies on logout

## 🧪 Test

### Test Login:

```bash
1. Mở http://localhost:3001
2. Redirect to /login ✅
3. Nhập email: test@test.com
4. Nhập password: 123456
5. Click "Đăng nhập"
6. → Chuyển sang /dashboard ✅
7. Check cookies: có "token" ✅
```

### Test Logout:

```bash
1. Ở dashboard, click "Đăng xuất"
2. → Chuyển về /login ✅
3. Check cookies: "token" đã xóa ✅
4. Try access /dashboard manually
5. → Redirect về /login ✅
```

### Test Persistence:

```bash
1. Login thành công
2. Reload page (F5)
3. → Vẫn ở dashboard ✅
4. Check cookies: vẫn có "token" ✅
```

## 🔄 Migration to Real API

Khi kết nối API thật:

```typescript
// services/auth.service.ts
export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await apiClient.post("/auth/login", credentials);

    // API trả về token
    const { token, user } = response.data;

    // Save như mock
    localStorage.setItem("token", token);
    cookieUtils.set("token", token, 7); // 7 days

    return { token, user };
  },
};

// app/(auth)/login/page.tsx
const onSubmit = async (data: LoginFormData) => {
  const { token, user } = await authService.login(data);

  useAuthStore.setState({
    user,
    token,
    isAuthenticated: true,
  });

  router.push("/dashboard");
};
```

## 💡 Best Practices

1. **Token Expiry**: Set cookie expiry = token expiry
2. **Secure Cookie**: Thêm `secure; httpOnly; samesite=strict` trong production
3. **Refresh Token**: Implement refresh token mechanism
4. **Error Handling**: Handle expired tokens gracefully

## 🎉 Kết quả

✅ Login → Dashboard: **HOẠT ĐỘNG**  
✅ Logout → Login: **HOẠT ĐỘNG**  
✅ Protected Routes: **HOẠT ĐỘNG**  
✅ Persistence: **HOẠT ĐỘNG**

---

**Status: RESOLVED ✅**
