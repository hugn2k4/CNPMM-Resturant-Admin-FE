export const ROUTES = {
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
  },
  DASHBOARD: {
    HOME: "/dashboard",
    ORDERS: "/dashboard/orders",
    MENU: "/dashboard/menu",
    CUSTOMERS: "/dashboard/customers",
    VOUCHERS: "/dashboard/vouchers",
    CHAT: "/dashboard/chat",
    NOTIFICATIONS: "/dashboard/notifications",
    SETTINGS: "/dashboard/settings",
  },
} as const;
