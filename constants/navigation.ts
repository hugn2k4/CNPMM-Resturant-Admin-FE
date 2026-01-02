import {
  Bell,
  LayoutDashboard,
  LucideIcon,
  MessageCircle,
  Settings,
  ShoppingCart,
  Users,
  Utensils,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
}

export const NAVIGATION_ITEMS: NavItem[] = [
  {
    title: "Tổng quan",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Dashboard tổng quan",
  },
  {
    title: "Đơn hàng",
    href: "/dashboard/orders",
    icon: ShoppingCart,
    description: "Quản lý đơn hàng",
  },
  {
    title: "Thực đơn",
    href: "/dashboard/menu",
    icon: Utensils,
    description: "Quản lý thực đơn",
  },
  {
    title: "Khách hàng",
    href: "/dashboard/customers",
    icon: Users,
    description: "Quản lý khách hàng",
  },
  {
    title: "Chat",
    href: "/dashboard/chat",
    icon: MessageCircle,
    description: "Chat với khách hàng",
  },
  {
    title: "Thông báo",
    href: "/dashboard/notifications",
    icon: Bell,
    description: "Quản lý thông báo",
  },
  {
    title: "Cài đặt",
    href: "/dashboard/settings",
    icon: Settings,
    description: "Cài đặt hệ thống",
  },
];
