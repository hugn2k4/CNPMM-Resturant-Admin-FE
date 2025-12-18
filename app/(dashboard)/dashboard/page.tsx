"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ChefHat, DollarSign, ShoppingCart, TrendingUp, Users } from "lucide-react";

const stats = [
  {
    title: "Doanh thu hôm nay",
    value: "15.250.000đ",
    change: "+12.5%",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Đơn hàng mới",
    value: "24",
    change: "+8.2%",
    icon: ShoppingCart,
    color: "text-primary",
    bgColor: "bg-orange-100",
  },
  {
    title: "Khách hàng",
    value: "156",
    change: "+15.3%",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Đặt bàn hôm nay",
    value: "18",
    change: "+5.1%",
    icon: Calendar,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
];

const recentOrders = [
  {
    id: "#ORD-001",
    customer: "Nguyễn Văn A",
    items: "Phở bò, Gỏi cuốn",
    total: "250.000đ",
    status: "Đang chuẩn bị",
    time: "10 phút trước",
  },
  {
    id: "#ORD-002",
    customer: "Trần Thị B",
    items: "Cơm gà, Canh chua",
    total: "180.000đ",
    status: "Hoàn thành",
    time: "25 phút trước",
  },
  {
    id: "#ORD-003",
    customer: "Lê Văn C",
    items: "Bún chả, Chả giò",
    total: "320.000đ",
    status: "Đang giao",
    time: "35 phút trước",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <ChefHat className="h-6 w-6 text-primary" />
          Chào mừng bạn đến với Restaurant Admin
        </h2>
        <p className="text-muted-foreground mt-1">Quản lý hiệu quả mọi hoạt động của nhà hàng tại một nơi</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-600 font-medium">{stat.change}</span> so với hôm qua
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Đơn hàng gần đây
          </CardTitle>
          <CardDescription>Theo dõi các đơn hàng mới nhất trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-primary">{order.id}</span>
                    <span className="text-sm text-muted-foreground">• {order.time}</span>
                  </div>
                  <p className="font-medium">{order.customer}</p>
                  <p className="text-sm text-muted-foreground">{order.items}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{order.total}</p>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === "Hoàn thành"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Đang chuẩn bị"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Xu hướng doanh thu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              <p>Biểu đồ doanh thu sẽ được hiển thị ở đây</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-primary" />
              Món ăn phổ biến
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {["Phở bò", "Cơm gà", "Bún chả", "Gỏi cuốn", "Bánh mì"].map((dish, index) => (
                <div key={dish} className="flex items-center justify-between">
                  <span className="text-sm">{dish}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-secondary/20 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${100 - index * 15}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground w-12 text-right">{100 - index * 15}%</span>
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
