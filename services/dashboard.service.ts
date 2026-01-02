import { apiClient } from "./api-client";
import { orderService } from "./order.service";
import { customersService } from "./customers.service";
import { dishesService, type Dish } from "./dishes.service";
import { categoriesService } from "./categories.service";
import type { OrderStatistics } from "@/types/order";

export interface RevenueStatistics {
  period: string;
  data: Array<{
    date: string;
    revenue: number;
    count: number;
  }>;
  totalRevenue: number;
  totalOrders: number;
}

export interface DashboardStats {
  todayRevenue: number;
  todayOrders: number;
  todayCustomers: number; // Số khách hàng mới hôm nay
  lowStockItems: number; // Số món ăn sắp hết hàng (stock < 10)
}

export interface DashboardData {
  stats: DashboardStats;
  orderStatistics: OrderStatistics;
  revenueStatistics: RevenueStatistics;
  recentOrders: any[];
  topDishes: Array<{
    name: string;
    orders: number;
    revenue: string;
    rating: number;
    _id: string;
  }>;
  categoryData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

class DashboardService {
  // Get revenue statistics
  async getRevenueStatistics(period: string = "7days"): Promise<RevenueStatistics> {
    const response = await apiClient.get<any>(`/orders/statistics/revenue?period=${period}`);
    
    // Handle case where API returns array directly (wrapped in data property by apiClient)
    if (Array.isArray(response)) {
      return {
        period,
        data: response,
        totalRevenue: response.reduce((sum, item) => sum + (item.revenue || 0), 0),
        totalOrders: response.reduce((sum, item) => sum + (item.count || 0), 0),
      };
    }
    
    // If response is already in correct format with data property
    if (response && response.data && Array.isArray(response.data)) {
      return {
        period: response.period || period,
        data: response.data,
        totalRevenue: response.totalRevenue || response.data.reduce((sum: number, item: any) => sum + (item.revenue || 0), 0),
        totalOrders: response.totalOrders || response.data.reduce((sum: number, item: any) => sum + (item.count || 0), 0),
      };
    }
    
    // Fallback: return empty structure
    return {
      period,
      data: [],
      totalRevenue: 0,
      totalOrders: 0,
    };
  }

  // Get all dashboard data
  async getDashboardData(): Promise<DashboardData> {
    try {
      // Fetch all data in parallel
      const [
        orderStatistics,
        revenueStatistics,
        customers,
        dishes,
        categories,
        recentOrdersResponse,
      ] = await Promise.all([
        orderService.getStatistics().catch((err) => {
          console.error("Error fetching order statistics:", err);
          return {
            totalOrders: 0,
            pendingOrders: 0,
            confirmedOrders: 0,
            shippingOrders: 0,
            deliveredOrders: 0,
            cancelledOrders: 0,
            todayOrders: 0,
            monthOrders: 0,
            totalRevenue: 0,
          };
        }),
        this.getRevenueStatistics("7days").catch((err) => {
          console.error("Error fetching revenue statistics:", err);
          return {
            period: "7days",
            data: [],
            totalRevenue: 0,
            totalOrders: 0,
          };
        }),
        customersService.getAllCustomers().catch((err) => {
          console.error("Error fetching customers:", err);
          return [];
        }),
        dishesService.getAllDishes().catch((err) => {
          console.error("Error fetching dishes:", err);
          return [];
        }),
        categoriesService.getAllCategories().catch((err) => {
          console.error("Error fetching categories:", err);
          return [];
        }),
        orderService.getOrders({ page: 1, limit: 5 }).catch((err) => {
          console.error("Error fetching recent orders:", err);
          return {
            orders: [],
            total: 0,
            page: 1,
            limit: 5,
            totalPages: 0,
          };
        }),
      ]);

      // Calculate today's revenue from orders delivered today
      // This ensures accuracy even if revenue statistics haven't updated
      const today = new Date();
      const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
      
      // Try to get today's orders delivered today
      let todayRevenue = 0;
      try {
        const todayOrdersResponse = await orderService.getOrders({
          page: 1,
          limit: 1000, // Get all today's orders
        });
        
        const todayOrders = (todayOrdersResponse?.orders || []).filter((order) => {
          if (order.orderStatus !== 'delivered') return false;
          
          // Check if deliveredAt is today
          if (order.deliveredAt) {
            const deliveredDate = new Date(order.deliveredAt);
            return deliveredDate >= startOfToday && deliveredDate <= endOfToday;
          }
          
          // Fallback: check createdAt if deliveredAt is not available
          if (order.createdAt) {
            const createdDate = new Date(order.createdAt);
            return createdDate >= startOfToday && createdDate <= endOfToday;
          }
          
          return false;
        });
        
        todayRevenue = todayOrders.reduce((sum, order) => sum + (order.finalAmount || 0), 0);
      } catch (err) {
        console.error("Error calculating today's revenue from orders:", err);
        // Fallback to revenue statistics
        const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
        const todayRevenueData = revenueStatistics?.data?.find((d) => d.date === todayKey);
        todayRevenue = todayRevenueData?.revenue || 0;
      }

      // Calculate top dishes from actual orders (not from soldCount field)
      // Get all delivered orders to calculate real statistics
      let topDishes: Array<{
        name: string;
        orders: number;
        revenue: string;
        rating: number;
        _id: string;
      }> = [];
      
      try {
        // Get all delivered orders
        const allOrdersResponse = await orderService.getOrders({
          page: 1,
          limit: 1000, // Get a large number to calculate statistics
        });
        
        const deliveredOrders = (allOrdersResponse?.orders || []).filter(
          (order) => order.orderStatus === 'delivered'
        );
        
        // Group by productId and calculate statistics
        const productStats = new Map<string, {
          productId: string;
          name: string;
          totalQuantity: number;
          totalRevenue: number;
          orderCount: number;
        }>();
        
        deliveredOrders.forEach((order) => {
          order.items?.forEach((item) => {
            const existing = productStats.get(item.productId) || {
              productId: item.productId,
              name: item.name,
              totalQuantity: 0,
              totalRevenue: 0,
              orderCount: 0,
            };
            
            existing.totalQuantity += item.quantity || 0;
            existing.totalRevenue += (item.price || 0) * (item.quantity || 0);
            existing.orderCount += 1;
            
            productStats.set(item.productId, existing);
          });
        });
        
        // Convert to array, sort by totalQuantity (orders), and get top 5
        topDishes = Array.from(productStats.values())
          .sort((a, b) => b.totalQuantity - a.totalQuantity)
          .slice(0, 5)
          .map((stat) => {
            // Get dish info for rating
            const dish = (dishes || []).find((d) => d._id === stat.productId);
            return {
              name: stat.name,
              orders: stat.totalQuantity,
              revenue: this.formatCurrency(stat.totalRevenue),
              rating: dish?.rating || 0,
              _id: stat.productId,
            };
          });
      } catch (err) {
        console.error("Error calculating top dishes from orders:", err);
        // Fallback to soldCount if calculation fails
        topDishes = (dishes || [])
          .filter((dish) => dish?.soldCount > 0)
          .sort((a, b) => b.soldCount - a.soldCount)
          .slice(0, 5)
          .map((dish) => ({
            name: dish.name,
            orders: dish.soldCount,
            revenue: this.formatCurrency((dish.price || 0) * dish.soldCount),
            rating: dish.rating || 0,
            _id: dish._id,
          }));
      }

      // Count low stock items (stock > 0 && stock < 10)
      const lowStockItems = (dishes || []).filter(
        (dish) => dish?.stock !== undefined && dish.stock > 0 && dish.stock < 10
      ).length;

      // Count today's new customers (created today)
      // Reuse today, startOfToday, and endOfToday from above
      const todayCustomers = (customers || []).filter((customer) => {
        if (!customer.createdAt) return false;
        const createdDate = new Date(customer.createdAt);
        return createdDate >= startOfToday && createdDate <= endOfToday;
      }).length;

      // Calculate category distribution
      const categoryData = this.calculateCategoryData(dishes, categories);

      // Format recent orders
      const recentOrders = (recentOrdersResponse?.orders || [])
        .slice(0, 4)
        .map((order) => ({
          id: order.orderNumber,
          customer: order.shippingAddress?.fullName || "Khách hàng",
          items: (order.items || []).map((item) => item.name).join(", ") || "Không có món",
          total: this.formatCurrency(order.finalAmount || 0),
          status: order.orderStatus,
          statusText: this.getStatusText(order.orderStatus),
          time: this.getTimeAgo(order.createdAt),
          _id: order._id,
        }));

      return {
        stats: {
          todayRevenue,
          todayOrders: orderStatistics?.todayOrders || 0,
          todayCustomers,
          lowStockItems,
        },
        orderStatistics,
        revenueStatistics,
        recentOrders,
        topDishes,
        categoryData,
      };
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      throw error;
    }
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    })
      .format(amount)
      .replace("₫", "đ");
  }

  private getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      pending: "Chờ xác nhận",
      confirmed: "Đã xác nhận",
      preparing: "Đang chuẩn bị",
      shipping: "Đang giao",
      delivered: "Hoàn thành",
      cancelled: "Đã hủy",
    };
    return statusMap[status] || status;
  }

  private getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMins < 1) return "Vừa xong";
    if (diffInMins < 60) return `${diffInMins} phút trước`;
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  }

  private calculateCategoryData(
    dishes: Dish[],
    categories: Array<{ _id: string; name: string }>
  ): Array<{ name: string; value: number; color: string }> {
    const colors = ["#ff9f0d", "#195a00", "#999966", "#3b82f6", "#ef4444", "#8b5cf6"];
    
    // Create category map for quick lookup
    const categoryMap = new Map<string, string>();
    categories.forEach((cat) => {
      categoryMap.set(cat._id, cat.name);
    });
    
    // Count dishes by categoryId
    const categoryCounts = new Map<string, number>();
    dishes.forEach((dish) => {
      const count = categoryCounts.get(dish.categoryId) || 0;
      categoryCounts.set(dish.categoryId, count + 1);
    });

    // Convert to array and assign colors with category names
    const result = Array.from(categoryCounts.entries())
      .map(([categoryId, count], index) => ({
        name: categoryMap.get(categoryId) || `Danh mục ${categoryId.slice(-4)}`,
        value: count,
        color: colors[index % colors.length],
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 4);

    // If no categories, return default
    if (result.length === 0) {
      return [
        { name: "Món chính", value: 45, color: "#ff9f0d" },
        { name: "Khai vị", value: 25, color: "#195a00" },
        { name: "Tráng miệng", value: 15, color: "#999966" },
        { name: "Đồ uống", value: 15, color: "#3b82f6" },
      ];
    }

    return result;
  }
}

export const dashboardService = new DashboardService();

