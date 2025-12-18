import {
  Calendar,
  ChefHat,
  FileText,
  LayoutDashboard,
  LucideIcon,
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
    title: "Bàn ăn",
    href: "/dashboard/tables",
    icon: ChefHat,
    description: "Quản lý bàn ăn",
  },
  {
    title: "Đặt bàn",
    href: "/dashboard/reservations",
    icon: Calendar,
    description: "Quản lý đặt bàn",
  },
  {
    title: "Khách hàng",
    href: "/dashboard/customers",
    icon: Users,
    description: "Quản lý khách hàng",
  },
  {
    title: "Báo cáo",
    href: "/dashboard/reports",
    icon: FileText,
    description: "Báo cáo thống kê",
  },
  {
    title: "Cài đặt",
    href: "/dashboard/settings",
    icon: Settings,
    description: "Cài đặt hệ thống",
  },
];
