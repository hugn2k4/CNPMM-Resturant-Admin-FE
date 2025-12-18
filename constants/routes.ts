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
    TABLES: "/dashboard/tables",
    RESERVATIONS: "/dashboard/reservations",
    CUSTOMERS: "/dashboard/customers",
    STAFF: "/dashboard/staff",
    REPORTS: "/dashboard/reports",
    SETTINGS: "/dashboard/settings",
  },
} as const;
