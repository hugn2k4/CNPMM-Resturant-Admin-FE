"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search,
  Filter,
  Eye,
  Clock,
  DollarSign,
  User,
  ShoppingCart,
  Check,
  X,
  ChefHat,
  Truck,
  Package
} from "lucide-react";

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled';
  statusText: string;
  createdAt: string;
  table?: string;
  paymentMethod: string;
  notes?: string;
}

const orders: Order[] = [
  {
    id: "#ORD-001",
    customerName: "Nguyễn Văn A",
    customerPhone: "0901234567",
    items: [
      { id: 1, name: "Phở bò", quantity: 2, price: 75000 },
      { id: 2, name: "Gỏi cuốn", quantity: 1, price: 45000 },
    ],
    total: 195000,
    status: "preparing",
    statusText: "Đang chuẩn bị",
    createdAt: "10 phút trước",
    table: "Bàn 5",
    paymentMethod: "Tiền mặt",
  },
  {
    id: "#ORD-002",
    customerName: "Trần Thị B",
    customerPhone: "0912345678",
    items: [
      { id: 1, name: "Cơm gà", quantity: 1, price: 65000 },
      { id: 2, name: "Cà phê sữa đá", quantity: 2, price: 30000 },
    ],
    total: 125000,
    status: "completed",
    statusText: "Hoàn thành",
    createdAt: "25 phút trước",
    table: "Bàn 3",
    paymentMethod: "Chuyển khoản",
  },
  {
    id: "#ORD-003",
    customerName: "Lê Văn C",
    customerPhone: "0923456789",
    items: [
      { id: 1, name: "Bún chả", quantity: 2, price: 70000 },
      { id: 2, name: "Chả giò", quantity: 1, price: 50000 },
    ],
    total: 190000,
    status: "delivering",
    statusText: "Đang giao",
    createdAt: "35 phút trước",
    paymentMethod: "Tiền mặt",
    notes: "Giao đến: 123 Đường ABC, Quận 1",
  },
  {
    id: "#ORD-004",
    customerName: "Phạm Thị D",
    customerPhone: "0934567890",
    items: [
      { id: 1, name: "Bánh mì", quantity: 3, price: 25000 },
      { id: 2, name: "Cà phê", quantity: 2, price: 30000 },
    ],
    total: 135000,
    status: "pending",
    statusText: "Chờ xác nhận",
    createdAt: "5 phút trước",
    paymentMethod: "Tiền mặt",
  },
  {
    id: "#ORD-005",
    customerName: "Hoàng Văn E",
    customerPhone: "0945678901",
    items: [
      { id: 1, name: "Phở gà", quantity: 1, price: 65000 },
    ],
    total: 65000,
    status: "confirmed",
    statusText: "Đã xác nhận",
    createdAt: "15 phút trước",
    table: "Bàn 8",
    paymentMethod: "Thẻ",
  },
];

const statusOptions = [
  { value: "all", label: "Tất cả", count: orders.length },
  { value: "pending", label: "Chờ xác nhận", count: orders.filter(o => o.status === 'pending').length },
  { value: "confirmed", label: "Đã xác nhận", count: orders.filter(o => o.status === 'confirmed').length },
  { value: "preparing", label: "Đang chuẩn bị", count: orders.filter(o => o.status === 'preparing').length },
  { value: "ready", label: "Sẵn sàng", count: orders.filter(o => o.status === 'ready').length },
  { value: "delivering", label: "Đang giao", count: orders.filter(o => o.status === 'delivering').length },
  { value: "completed", label: "Hoàn thành", count: orders.filter(o => o.status === 'completed').length },
  { value: "cancelled", label: "Đã hủy", count: orders.filter(o => o.status === 'cancelled').length },
];

const getStatusBadge = (status: string) => {
  const variants: { [key: string]: "default" | "success" | "warning" | "info" | "destructive" | "outline" } = {
    pending: "outline",
    confirmed: "info",
    preparing: "warning",
    ready: "success",
    delivering: "info",
    completed: "success",
    cancelled: "destructive",
  };
  return variants[status] || "default";
};

const getStatusIcon = (status: string) => {
  const icons: { [key: string]: React.ReactNode } = {
    pending: <Clock className="h-4 w-4" />,
    confirmed: <Check className="h-4 w-4" />,
    preparing: <ChefHat className="h-4 w-4" />,
    ready: <Package className="h-4 w-4" />,
    delivering: <Truck className="h-4 w-4" />,
    completed: <Check className="h-4 w-4" />,
    cancelled: <X className="h-4 w-4" />,
  };
  return icons[status];
};

export default function OrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailDialog(true);
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const todayOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;

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
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng đơn hôm nay</p>
                <p className="text-2xl font-bold">{todayOrders}</p>
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
                <p className="text-2xl font-bold text-orange-600">{pendingOrders}</p>
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
                <p className="text-2xl font-bold text-green-600">{completedOrders}</p>
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
                <p className="text-2xl font-bold text-primary">{(totalRevenue / 1000000).toFixed(1)}M</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo mã đơn, tên khách hàng..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Status Tabs */}
      <Tabs value={selectedStatus} onValueChange={setSelectedStatus}>
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          {statusOptions.map((option) => (
            <TabsTrigger key={option.value} value={option.value} className="gap-2">
              {option.label}
              <Badge variant="secondary" className="ml-1">{option.count}</Badge>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Orders Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã đơn</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Món ăn</TableHead>
              <TableHead>Bàn/Giao hàng</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thời gian</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id} className="hover:bg-muted/50">
                <TableCell className="font-semibold text-primary">{order.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-[200px]">
                    {order.items.map((item, idx) => (
                      <p key={idx} className="text-sm">
                        {item.quantity}x {item.name}
                      </p>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  {order.table || <span className="text-muted-foreground">Giao hàng</span>}
                </TableCell>
                <TableCell className="font-bold">{order.total.toLocaleString('vi-VN')}đ</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadge(order.status)} className="gap-1">
                    {getStatusIcon(order.status)}
                    {order.statusText}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {order.createdAt}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewOrder(order)}
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Chi tiết
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              Chi tiết đơn hàng {selectedOrder?.id}
            </DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về đơn hàng
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 py-4">
              {/* Customer Info */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Thông tin khách hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tên:</span>
                    <span className="font-medium">{selectedOrder.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Số điện thoại:</span>
                    <span className="font-medium">{selectedOrder.customerPhone}</span>
                  </div>
                  {selectedOrder.table && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bàn:</span>
                      <span className="font-medium">{selectedOrder.table}</span>
                    </div>
                  )}
                  {selectedOrder.notes && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ghi chú:</span>
                      <span className="font-medium">{selectedOrder.notes}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Chi tiết món ăn
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.quantity}x</span>
                          <span>{item.name}</span>
                        </div>
                        <span className="font-semibold">{item.price.toLocaleString('vi-VN')}đ</span>
                      </div>
                    ))}
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Tổng cộng:</span>
                        <span className="text-primary">{selectedOrder.total.toLocaleString('vi-VN')}đ</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-muted-foreground mt-1">
                        <span>Thanh toán:</span>
                        <span>{selectedOrder.paymentMethod}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Status & Actions */}
              <div className="flex items-center justify-between">
                <Badge variant={getStatusBadge(selectedOrder.status)} className="gap-1">
                  {getStatusIcon(selectedOrder.status)}
                  {selectedOrder.statusText}
                </Badge>
                <div className="flex gap-2">
                  {selectedOrder.status === 'pending' && (
                    <>
                      <Button size="sm" variant="outline" className="gap-2 text-destructive">
                        <X className="h-4 w-4" />
                        Hủy đơn
                      </Button>
                      <Button size="sm" className="gap-2">
                        <Check className="h-4 w-4" />
                        Xác nhận
                      </Button>
                    </>
                  )}
                  {selectedOrder.status === 'confirmed' && (
                    <Button size="sm" className="gap-2">
                      <ChefHat className="h-4 w-4" />
                      Bắt đầu chuẩn bị
                    </Button>
                  )}
                  {selectedOrder.status === 'preparing' && (
                    <Button size="sm" className="gap-2">
                      <Package className="h-4 w-4" />
                      Hoàn thành
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
