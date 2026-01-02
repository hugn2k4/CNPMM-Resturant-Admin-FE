"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Star,
  AlertCircle,
  AlertTriangle,
  BarChart3,
  Truck
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { dashboardService, type DashboardData } from "@/services/dashboard.service";

// Format currency helper
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  })
    .format(amount)
    .replace("₫", "đ");
};

// Get day name from date string (format: YYYY-MM-DD)
const getDayName = (dateString: string): string => {
  try {
    // Parse date string in format YYYY-MM-DD
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return days[date.getDay()];
  } catch (error) {
    // Fallback: try parsing as Date string
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return days[date.getDay()];
  }
};

// Format revenue data for chart
const formatRevenueData = (revenueStats: DashboardData['revenueStatistics'] | null, period: string = "7days") => {
  if (!revenueStats || !revenueStats.data || !Array.isArray(revenueStats.data)) {
    return [];
  }
  
  // Create a map of dates for quick lookup
  const dataMap = new Map<string, { revenue: number; count: number }>();
  revenueStats.data.forEach((item) => {
    dataMap.set(item.date, { revenue: item.revenue || 0, count: item.count || 0 });
  });
  
  // Generate dates based on period
  const result = [];
  const today = new Date();
  const daysToShow = period === "30days" ? 30 : 7;
  
  for (let i = daysToShow - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    const data = dataMap.get(dateKey) || { revenue: 0, count: 0 };
    
    // For 30 days, show date format, for 7 days show day name
    const displayName = period === "30days" 
      ? `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`
      : getDayName(dateKey);
    
    result.push({
      name: displayName,
      revenue: data.revenue,
      orders: data.count,
      fullDate: dateKey,
    });
  }
  
  return result;
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'delivered':
      return 'success';
    case 'preparing':
      return 'warning';
    case 'shipping':
      return 'info';
    case 'pending':
    case 'confirmed':
      return 'outline';
    default:
      return 'default';
  }
};

const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    preparing: "Đang chuẩn bị",
    shipping: "Đang giao",
    delivered: "Hoàn thành",
    cancelled: "Đã hủy",
  };
  return statusMap[status] || status;
};

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [previousStats, setPreviousStats] = useState<DashboardData['stats'] | null>(null);
  const [revenuePeriod, setRevenuePeriod] = useState<string>("7days");
  const [revenueStatistics, setRevenueStatistics] = useState<DashboardData['revenueStatistics'] | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (dashboardData) {
      loadRevenueStatistics();
    }
  }, [revenuePeriod, dashboardData]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getDashboardData();
      setDashboardData(data);
      setRevenueStatistics(data.revenueStatistics);
      
      // Store previous stats for comparison (in real app, you'd fetch yesterday's data)
      setPreviousStats(data.stats);
    } catch (err: any) {
      console.error("Failed to load dashboard data:", err);
      setError(err?.message || "Không thể tải dữ liệu dashboard");
    } finally {
      setLoading(false);
    }
  };

  const loadRevenueStatistics = async () => {
    try {
      const stats = await dashboardService.getRevenueStatistics(revenuePeriod);
      setRevenueStatistics(stats);
    } catch (err) {
      console.error("Failed to load revenue statistics:", err);
    }
  };

  // Calculate trend (simplified - compare with previous day)
  const calculateTrend = (current: number, previous: number | null): { change: string; trend: 'up' | 'down' } => {
    if (!previous || previous === 0) {
      return { change: "0%", trend: 'up' };
    }
    const percentChange = ((current - previous) / previous) * 100;
    return {
      change: `${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(1)}%`,
      trend: percentChange >= 0 ? 'up' : 'down',
    };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-7">
          <Skeleton className="md:col-span-4 h-80" />
          <Skeleton className="md:col-span-3 h-80" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <div>
                <p className="font-semibold">Lỗi khi tải dữ liệu</p>
                <p className="text-sm text-red-500">{error}</p>
              </div>
              <Button variant="outline" size="sm" onClick={loadDashboardData} className="ml-auto">
                Thử lại
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const { stats, orderStatistics, recentOrders, topDishes, categoryData } = dashboardData;
  
  // Use revenueStatistics from state (can be updated by period selector)
  const currentRevenueStats = revenueStatistics || dashboardData.revenueStatistics;
  
  // Debug: Log revenue statistics to check data
  console.log("Revenue Statistics:", currentRevenueStats);
  console.log("Revenue Data Array:", currentRevenueStats?.data);
  
  const revenueData = formatRevenueData(currentRevenueStats, revenuePeriod);
  console.log("Formatted Revenue Data:", revenueData);

  // Calculate trends
  const revenueTrend = calculateTrend(stats.todayRevenue, previousStats?.todayRevenue || 0);
  const ordersTrend = calculateTrend(stats.todayOrders, previousStats?.todayOrders || 0);
  const customersTrend = calculateTrend(stats.todayCustomers, previousStats?.todayCustomers || 0);
  const lowStockTrend = calculateTrend(stats.lowStockItems, previousStats?.lowStockItems || 0);

  // Calculate total orders for progress bars
  const totalOperationOrders = (orderStatistics?.pendingOrders || 0) + 
                                (orderStatistics?.confirmedOrders || 0) + 
                                (orderStatistics?.shippingOrders || 0);

  const statsConfig = [
    {
      title: "Doanh thu hôm nay",
      value: formatCurrency(stats.todayRevenue),
      change: revenueTrend.change,
      trend: revenueTrend.trend,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
      link: "/dashboard/reports",
    },
    {
      title: "VẬN HÀNH",
      value: "", // Empty value, will render custom content
      change: "",
      trend: 'up' as const,
      icon: Truck,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      link: "/dashboard/orders",
      isOperation: true, // Flag to render operation status
      operationData: {
        pending: orderStatistics?.pendingOrders || 0,
        confirmed: orderStatistics?.confirmedOrders || 0,
        shipping: orderStatistics?.shippingOrders || 0,
        total: totalOperationOrders,
      },
    },
    {
      title: "HIỆU SUẤT KINH DOANH",
      value: "", // Empty value, will render custom content
      change: "",
      trend: 'up' as const,
      icon: BarChart3,
      color: "text-primary",
      bgColor: "bg-purple-100",
      link: "",
      isBusinessPerformance: true, // Flag to render custom content
      ordersData: {
        value: stats.todayOrders,
        change: ordersTrend.change,
        trend: ordersTrend.trend,
      },
      customersData: {
        value: stats.todayCustomers,
        change: customersTrend.change,
        trend: customersTrend.trend,
      },
    },
    {
      title: "Món ăn sắp hết",
      value: stats.lowStockItems.toString(),
      change: lowStockTrend.change,
      trend: lowStockTrend.trend === 'up' ? 'down' : 'up', // Đảo ngược vì sắp hết là điều không tốt
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-100",
      link: "/dashboard/menu",
    },
  ];

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
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsConfig.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          
          // Special rendering for Operation card
          if ((stat as any).isOperation) {
            const operationData = (stat as any).operationData;
            const { pending, confirmed, shipping, total } = operationData;
            const pendingPercent = total > 0 ? (pending / total) * 100 : 0;
            const confirmedPercent = total > 0 ? (confirmed / total) * 100 : 0;
            const shippingPercent = total > 0 ? (shipping / total) * 100 : 0;
            
            return (
              <Card 
                key={stat.title} 
                onClick={() => stat.link && router.push(stat.link)}
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
                  <div className="space-y-3">
                    {/* Chờ xử lý */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Chờ xử lý</span>
                        <span className="text-sm font-semibold text-orange-600">{pending}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-yellow-500 transition-all duration-300"
                          style={{ width: `${pendingPercent}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Đã xác nhận */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Đã xác nhận</span>
                        <span className="text-sm font-semibold text-green-600">{confirmed}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 transition-all duration-300"
                          style={{ width: `${confirmedPercent}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Đang giao hàng */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Đang giao hàng</span>
                        <span className="text-sm font-semibold text-blue-600">{shipping}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-300"
                          style={{ width: `${shippingPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          }
          
          // Special rendering for Business Performance card
          if ((stat as any).isBusinessPerformance) {
            const ordersData = (stat as any).ordersData;
            const customersData = (stat as any).customersData;
            return (
              <Card 
                key={stat.title} 
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group animate-in slide-in-from-bottom duration-500"
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
                  <div className="space-y-3">
                    {/* Đơn mới */}
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground mb-0.5">Đơn mới</p>
                        <p className="text-xl font-bold">{ordersData.value}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {ordersData.trend === 'up' ? (
                            <TrendingUp className="h-3 w-3 text-green-600" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-600" />
                          )}
                          <span className={`text-xs font-medium ${ordersData.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {ordersData.change}
                          </span>
                        </div>
                      </div>
                      <div className="p-2 rounded-lg bg-orange-100">
                        <ShoppingCart className="h-4 w-4 text-orange-600" />
                      </div>
                    </div>
                    
                    {/* Divider */}
                    <div className="border-t border-border"></div>
                    
                    {/* Khách mới */}
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground mb-0.5">Khách mới</p>
                        <p className="text-xl font-bold">{customersData.value}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {customersData.trend === 'up' ? (
                            <TrendingUp className="h-3 w-3 text-green-600" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-600" />
                          )}
                          <span className={`text-xs font-medium ${customersData.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {customersData.change}
                          </span>
                        </div>
                      </div>
                      <div className="p-2 rounded-lg bg-blue-100">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          }
          
          // Normal card rendering
          return (
            <Card 
              key={stat.title} 
              onClick={() => stat.link && router.push(stat.link)}
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
                <CardDescription>
                  Doanh thu {revenuePeriod === "30days" ? "30 ngày" : "7 ngày"} gần nhất
                </CardDescription>
              </div>
              <Select value={revenuePeriod} onValueChange={setRevenuePeriod}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">7 ngày</SelectItem>
                  <SelectItem value="30days">30 ngày</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {revenueData.length > 0 ? (
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
                  <YAxis fontSize={12} tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
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
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <p>Chưa có dữ liệu doanh thu</p>
              </div>
            )}
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
            {categoryData.length > 0 ? (
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
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <p>Chưa có dữ liệu danh mục</p>
              </div>
            )}
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
            {recentOrders.length > 0 ? (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order._id || order.id}
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
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Chưa có đơn hàng nào</p>
              </div>
            )}
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
            {topDishes.length > 0 ? (
              <div className="space-y-4">
                {topDishes.map((dish, index) => (
                  <div 
                    key={dish._id || dish.name} 
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
                        {dish.rating > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs text-muted-foreground">{dish.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{dish.orders} đơn hàng</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">{dish.revenue}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Chưa có dữ liệu món ăn</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
