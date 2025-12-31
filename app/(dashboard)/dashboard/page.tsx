"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  ChefHat, 
  Clock, 
  DollarSign, 
  ShoppingCart, 
  TrendingDown, 
  TrendingUp, 
  Users,
  ArrowUpRight,
  Eye,
  Package,
  Star
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const stats = [
  {
    title: "Doanh thu hôm nay",
    value: "15.250.000đ",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-100",
    link: "/dashboard/reports",
  },
  {
    title: "Đơn hàng mới",
    value: "24",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingCart,
    color: "text-primary",
    bgColor: "bg-orange-100",
    link: "/dashboard/orders",
  },
  {
    title: "Khách hàng",
    value: "156",
    change: "+15.3%",
    trend: "up",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    link: "/dashboard/customers",
  },
  {
    title: "Đặt bàn hôm nay",
    value: "18",
    change: "-2.4%",
    trend: "down",
    icon: Calendar,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    link: "/dashboard/reservations",
  },
];

const revenueData = [
  { name: 'T2', revenue: 12500000, orders: 45 },
  { name: 'T3', revenue: 15200000, orders: 52 },
  { name: 'T4', revenue: 14800000, orders: 48 },
  { name: 'T5', revenue: 18900000, orders: 65 },
  { name: 'T6', revenue: 22500000, orders: 78 },
  { name: 'T7', revenue: 25800000, orders: 89 },
  { name: 'CN', revenue: 28200000, orders: 95 },
];

const categoryData = [
  { name: 'Món chính', value: 45, color: '#ff9f0d' },
  { name: 'Khai vị', value: 25, color: '#195a00' },
  { name: 'Tráng miệng', value: 15, color: '#999966' },
  { name: 'Đồ uống', value: 15, color: '#3b82f6' },
];

const topDishes = [
  { name: 'Phở bò', orders: 45, revenue: '11.250.000đ', rating: 4.8 },
  { name: 'Cơm gà', orders: 38, revenue: '9.500.000đ', rating: 4.7 },
  { name: 'Bún chả', orders: 32, revenue: '8.000.000đ', rating: 4.9 },
  { name: 'Bánh mì', orders: 28, revenue: '4.200.000đ', rating: 4.6 },
  { name: 'Gỏi cuốn', orders: 25, revenue: '3.750.000đ', rating: 4.5 },
];

const recentOrders = [
  {
    id: "#ORD-001",
    customer: "Nguyễn Văn A",
    items: "Phở bò, Gỏi cuốn",
    total: "250.000đ",
    status: "preparing",
    statusText: "Đang chuẩn bị",
    time: "10 phút trước",
  },
  {
    id: "#ORD-002",
    customer: "Trần Thị B",
    items: "Cơm gà, Canh chua",
    total: "180.000đ",
    status: "completed",
    statusText: "Hoàn thành",
    time: "25 phút trước",
  },
  {
    id: "#ORD-003",
    customer: "Lê Văn C",
    items: "Bún chả, Chả giò",
    total: "320.000đ",
    status: "delivering",
    statusText: "Đang giao",
    time: "35 phút trước",
  },
  {
    id: "#ORD-004",
    customer: "Phạm Thị D",
    items: "Bánh mì, Cà phê",
    total: "95.000đ",
    status: "pending",
    statusText: "Chờ xác nhận",
    time: "45 phút trước",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'preparing':
      return 'warning';
    case 'delivering':
      return 'info';
    case 'pending':
      return 'outline';
    default:
      return 'default';
  }
};

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-lg border border-primary/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10">
          <ChefHat className="h-32 w-32" />
        </div>
        <div className="relative">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ChefHat className="h-7 w-7 text-primary" />
            Chào mừng đến với Restaurant Admin
          </h2>
          <p className="text-muted-foreground mt-2 text-base">
            Quản lý hiệu quả mọi hoạt động của nhà hàng tại một nơi
          </p>
          <div className="flex gap-3 mt-4">
            <Button size="sm" className="gap-2" onClick={() => router.push('/dashboard/reports')}>
              <Eye className="h-4 w-4" />
              Xem báo cáo
            </Button>
            <Button size="sm" variant="outline" className="gap-2" onClick={() => router.push('/dashboard/orders')}>
              <ShoppingCart className="h-4 w-4" />
              Đơn hàng mới
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          return (
            <Card 
              key={stat.title} 
              onClick={() => router.push(stat.link)}
              className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group animate-in slide-in-from-bottom duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2.5 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendIcon className={`h-3 w-3 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
                  <span className={`text-xs font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-muted-foreground">so với hôm qua</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Xu hướng doanh thu
                </CardTitle>
                <CardDescription>Doanh thu 7 ngày gần nhất</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push('/dashboard/reports')}
              >
                Chi tiết
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--color-primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--color-primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} tickFormatter={(value) => `${value / 1000000}M`} />
                <Tooltip 
                  formatter={(value: number) => `${value.toLocaleString('vi-VN')}đ`}
                  contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--color-primary))" 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Phân loại món ăn
                </CardTitle>
                <CardDescription>Tỷ lệ đơn hàng theo danh mục</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push('/dashboard/menu')}
              >
                Xem menu
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Orders and Top Dishes */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                Đơn hàng gần đây
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2"
                onClick={() => router.push('/dashboard/orders')}
              >
                Xem tất cả
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </CardTitle>
            <CardDescription>Theo dõi các đơn hàng mới nhất trong hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-all duration-200 cursor-pointer group"
                  onClick={() => router.push(`/dashboard/orders?search=${order.id}`)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold text-primary group-hover:underline">{order.id}</span>
                      <Badge variant="outline" className="gap-1">
                        <Clock className="h-3 w-3" />
                        {order.time}
                      </Badge>
                    </div>
                    <p className="font-medium text-sm">{order.customer}</p>
                    <p className="text-xs text-muted-foreground">{order.items}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-bold">{order.total}</p>
                    <Badge variant={getStatusBadge(order.status) as any}>
                      {order.statusText}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Dishes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Món ăn bán chạy
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2"
                onClick={() => router.push('/dashboard/menu')}
              >
                Xem tất cả
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </CardTitle>
            <CardDescription>Top 5 món ăn được đặt nhiều nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topDishes.map((dish, index) => (
                <div 
                  key={dish.name} 
                  className="flex items-center gap-4 p-2 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() => router.push('/dashboard/menu')}
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-white
                    ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-gray-300'}`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{dish.name}</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-muted-foreground">{dish.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{dish.orders} đơn hàng</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{dish.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
