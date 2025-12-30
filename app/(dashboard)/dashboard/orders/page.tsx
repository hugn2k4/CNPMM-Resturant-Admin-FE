"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { orderService } from "@/services/order.service";
import type { Order, OrderStatistics } from "@/types/order";
import { format } from "date-fns";
import {
  Check,
  ChefHat,
  Clock,
  DollarSign,
  Eye,
  Loader2,
  Package,
  Search,
  ShoppingCart,
  Truck,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500",
  confirmed: "bg-blue-500",
  preparing: "bg-purple-500",
  shipping: "bg-indigo-500",
  delivered: "bg-green-500",
  cancelled: "bg-red-500",
};

const statusLabels: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  preparing: "Đang chuẩn bị",
  shipping: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="h-4 w-4" />,
  confirmed: <Check className="h-4 w-4" />,
  preparing: <ChefHat className="h-4 w-4" />,
  shipping: <Truck className="h-4 w-4" />,
  delivered: <Package className="h-4 w-4" />,
  cancelled: <X className="h-4 w-4" />,
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [statistics, setStatistics] = useState<OrderStatistics | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadOrders();
    loadStatistics();
  }, [page, selectedStatus]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrders({
        page,
        limit,
        status: selectedStatus,
        search: searchQuery,
      });
      setOrders(response.orders);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await orderService.getStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error("Failed to load statistics:", error);
    }
  };

  const handleSearch = () => {
    setPage(1);
    loadOrders();
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailDialog(true);
  };

  const handleUpdateStatus = async (orderId: string, newStatus: Order["orderStatus"], cancelReason?: string) => {
    try {
      setUpdating(true);
      await orderService.updateOrderStatus(orderId, {
        orderStatus: newStatus,
        cancelReason,
      });
      await loadOrders();
      await loadStatistics();
      if (selectedOrder?._id === orderId) {
        const updated = await orderService.getOrder(orderId);
        setSelectedOrder(updated);
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
    } finally {
      setUpdating(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getNextStatus = (currentStatus: Order["orderStatus"]): Order["orderStatus"] | null => {
    const transitions: Record<string, Order["orderStatus"]> = {
      pending: "confirmed",
      confirmed: "preparing",
      preparing: "shipping",
      shipping: "delivered",
    };
    return transitions[currentStatus] || null;
  };

  const getNextStatusLabel = (currentStatus: Order["orderStatus"]): string => {
    const nextStatus = getNextStatus(currentStatus);
    return nextStatus ? statusLabels[nextStatus] : "";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ShoppingCart className="h-8 w-8 text-primary" />
          Quản lý đơn hàng
        </h1>
        <p className="text-muted-foreground mt-1">Theo dõi và quản lý tất cả đơn hàng trong hệ thống</p>
      </div>

      {/* Stats */}
      {statistics && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tổng đơn hôm nay</p>
                  <p className="text-2xl font-bold">{statistics.todayOrders}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <ShoppingCart className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Chờ xử lý</p>
                  <p className="text-2xl font-bold text-orange-600">{statistics.pendingOrders}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Hoàn thành</p>
                  <p className="text-2xl font-bold text-green-600">{statistics.deliveredOrders}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Doanh thu</p>
                  <p className="text-2xl font-bold text-primary">{(statistics.totalRevenue / 1000000).toFixed(1)}M</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo mã đơn, tên khách hàng..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch}>
          <Search className="mr-2 h-4 w-4" />
          Tìm kiếm
        </Button>
      </div>

      {/* Status Tabs */}
      <Tabs value={selectedStatus} onValueChange={setSelectedStatus}>
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="pending">Chờ xác nhận</TabsTrigger>
          <TabsTrigger value="confirmed">Đã xác nhận</TabsTrigger>
          <TabsTrigger value="preparing">Đang chuẩn bị</TabsTrigger>
          <TabsTrigger value="shipping">Đang giao</TabsTrigger>
          <TabsTrigger value="delivered">Đã giao</TabsTrigger>
          <TabsTrigger value="cancelled">Đã hủy</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn hàng</CardTitle>
          <CardDescription>Tổng cộng {total} đơn hàng</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : !orders || orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Không tìm thấy đơn hàng nào</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã đơn</TableHead>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead>Số lượng</TableHead>
                    <TableHead>Tổng tiền</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order._id} className="hover:bg-muted/50">
                      <TableCell className="font-semibold text-primary">{order.orderNumber}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.shippingAddress.fullName}</p>
                          <p className="text-sm text-muted-foreground">{order.shippingAddress.phoneNumber}</p>
                        </div>
                      </TableCell>
                      <TableCell>{order.items.reduce((sum, item) => sum + item.quantity, 0)} món</TableCell>
                      <TableCell className="font-bold">{formatPrice(order.finalAmount)}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[order.orderStatus]}>{statusLabels[order.orderStatus]}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm")}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order)} className="gap-2">
                          <Eye className="h-4 w-4" />
                          Chi tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Trang {page} / {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                      Trước
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="font-bold">Đơn hàng {selectedOrder?.orderNumber}</div>
                <div className="text-sm font-normal text-muted-foreground mt-1">
                  {selectedOrder && format(new Date(selectedOrder.createdAt), "dd/MM/yyyy 'lúc' HH:mm")}
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6 py-4">
              {/* Status Badge - Prominent */}
              <div className="flex items-center justify-center">
                <Badge className={`${statusColors[selectedOrder.orderStatus]} text-base px-6 py-2 gap-2`}>
                  {statusIcons[selectedOrder.orderStatus]}
                  <span>{statusLabels[selectedOrder.orderStatus]}</span>
                </Badge>
              </div>

              {/* Customer Info */}
              <div className="bg-muted/50 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-base">Thông tin khách hàng</h3>
                </div>
                <div className="space-y-3 pl-10">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground font-medium">Tên khách hàng:</span>
                    <span className="col-span-2 font-semibold">{selectedOrder.shippingAddress.fullName}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground font-medium">Số điện thoại:</span>
                    <span className="col-span-2 font-semibold">{selectedOrder.shippingAddress.phoneNumber}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground font-medium">Địa chỉ giao:</span>
                    <span className="col-span-2 font-medium">{selectedOrder.shippingAddress.address}</span>
                  </div>
                  {selectedOrder.note && (
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-muted-foreground font-medium">Ghi chú:</span>
                      <span className="col-span-2 font-medium italic text-orange-600">{selectedOrder.note}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-muted/50 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Package className="h-4 w-4 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-base">Chi tiết món ăn</h3>
                </div>
                <div className="space-y-3 pl-10">
                  <div className="bg-white rounded-lg p-4 space-y-3">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2 border-b last:border-b-0">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center justify-center w-8 h-8 bg-primary/10 text-primary font-bold rounded-full text-sm">
                            {item.quantity}
                          </span>
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <span className="font-bold text-primary">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Summary */}
                  <div className="bg-white rounded-lg p-4 space-y-3 mt-4">
                    <div className="flex justify-between items-center text-base">
                      <span className="text-muted-foreground">Tổng sản phẩm:</span>
                      <span className="font-semibold">{formatPrice(selectedOrder.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center text-base">
                      <span className="text-muted-foreground">Phí vận chuyển:</span>
                      <span className="font-semibold">{formatPrice(selectedOrder.shippingFee)}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between items-center">
                      <span className="text-lg font-bold">Tổng cộng:</span>
                      <span className="text-2xl font-bold text-primary">{formatPrice(selectedOrder.finalAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm pt-2 border-t">
                      <span className="text-muted-foreground">Phương thức thanh toán:</span>
                      <Badge variant="outline" className="font-medium">
                        {selectedOrder.paymentMethod}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {selectedOrder.orderStatus !== "cancelled" && selectedOrder.orderStatus !== "delivered" && (
                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => handleUpdateStatus(selectedOrder._id, "cancelled", "Hủy bởi admin")}
                    disabled={updating}
                  >
                    {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                    Hủy đơn hàng
                  </Button>
                  {getNextStatus(selectedOrder.orderStatus) && (
                    <Button
                      className="gap-2 px-6"
                      onClick={() => handleUpdateStatus(selectedOrder._id, getNextStatus(selectedOrder.orderStatus)!)}
                      disabled={updating}
                    >
                      {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      {getNextStatusLabel(selectedOrder.orderStatus)}
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
