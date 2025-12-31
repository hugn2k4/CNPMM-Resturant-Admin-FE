"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users,
  Clock,
  DollarSign,
  ChefHat,
  Plus,
  Eye,
  Edit,
  UserCheck,
  Circle
} from "lucide-react";

interface Table {
  id: number;
  number: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  statusText: string;
  currentOrder?: {
    orderId: string;
    customerName: string;
    startTime: string;
    amount: number;
    items: number;
  };
  reservation?: {
    customerName: string;
    time: string;
    phone: string;
  };
}

const tables: Table[] = [
  {
    id: 1,
    number: "1",
    capacity: 2,
    status: "available",
    statusText: "Trống",
  },
  {
    id: 2,
    number: "2",
    capacity: 4,
    status: "occupied",
    statusText: "Có khách",
    currentOrder: {
      orderId: "#ORD-001",
      customerName: "Nguyễn Văn A",
      startTime: "30 phút trước",
      amount: 250000,
      items: 3,
    },
  },
  {
    id: 3,
    number: "3",
    capacity: 2,
    status: "reserved",
    statusText: "Đã đặt",
    reservation: {
      customerName: "Trần Thị B",
      time: "19:00",
      phone: "0901234567",
    },
  },
  {
    id: 4,
    number: "4",
    capacity: 6,
    status: "occupied",
    statusText: "Có khách",
    currentOrder: {
      orderId: "#ORD-002",
      customerName: "Lê Văn C",
      startTime: "15 phút trước",
      amount: 450000,
      items: 5,
    },
  },
  {
    id: 5,
    number: "5",
    capacity: 4,
    status: "cleaning",
    statusText: "Đang dọn",
  },
  {
    id: 6,
    number: "6",
    capacity: 2,
    status: "available",
    statusText: "Trống",
  },
  {
    id: 7,
    number: "7",
    capacity: 8,
    status: "reserved",
    statusText: "Đã đặt",
    reservation: {
      customerName: "Phạm Thị D",
      time: "20:30",
      phone: "0912345678",
    },
  },
  {
    id: 8,
    number: "8",
    capacity: 4,
    status: "available",
    statusText: "Trống",
  },
  {
    id: 9,
    number: "9",
    capacity: 2,
    status: "occupied",
    statusText: "Có khách",
    currentOrder: {
      orderId: "#ORD-003",
      customerName: "Hoàng Văn E",
      startTime: "45 phút trước",
      amount: 180000,
      items: 2,
    },
  },
  {
    id: 10,
    number: "10",
    capacity: 6,
    status: "available",
    statusText: "Trống",
  },
  {
    id: 11,
    number: "11",
    capacity: 4,
    status: "available",
    statusText: "Trống",
  },
  {
    id: 12,
    number: "12",
    capacity: 2,
    status: "available",
    statusText: "Trống",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'available':
      return 'bg-green-500 hover:bg-green-600 border-green-600';
    case 'occupied':
      return 'bg-red-500 hover:bg-red-600 border-red-600';
    case 'reserved':
      return 'bg-blue-500 hover:bg-blue-600 border-blue-600';
    case 'cleaning':
      return 'bg-yellow-500 hover:bg-yellow-600 border-yellow-600';
    default:
      return 'bg-gray-500 hover:bg-gray-600 border-gray-600';
  }
};

const getStatusBadge = (status: string) => {
  const variants: { [key: string]: "default" | "success" | "warning" | "info" | "destructive" } = {
    available: "success",
    occupied: "destructive",
    reserved: "info",
    cleaning: "warning",
  };
  return variants[status] || "default";
};

export default function TablesPage() {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
    setShowDetailDialog(true);
  };

  const filteredTables = tables?.filter(table => 
    filterStatus === "all" || table.status === filterStatus
  ) || [];

  const stats = {
    total: tables?.length || 0,
    available: tables?.filter(t => t.status === 'available').length || 0,
    occupied: tables?.filter(t => t.status === 'occupied').length || 0,
    reserved: tables?.filter(t => t.status === 'reserved').length || 0,
    cleaning: tables?.filter(t => t.status === 'cleaning').length || 0,
  };

  const totalRevenue = tables
    ?.filter(t => t.currentOrder)
    .reduce((sum, t) => sum + (t.currentOrder?.amount || 0), 0) || 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ChefHat className="h-8 w-8 text-primary" />
          Quản lý bàn ăn
        </h1>
        <p className="text-muted-foreground mt-1">Sơ đồ và trạng thái các bàn ăn trong nhà hàng</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setFilterStatus("all")}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng số bàn</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <ChefHat className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setFilterStatus("available")}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bàn trống</p>
                <p className="text-3xl font-bold text-green-600">{stats.available}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Circle className="h-6 w-6 text-green-600 fill-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setFilterStatus("occupied")}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Đang phục vụ</p>
                <p className="text-3xl font-bold text-red-600">{stats.occupied}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <Users className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setFilterStatus("reserved")}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Đã đặt trước</p>
                <p className="text-3xl font-bold text-blue-600">{stats.reserved}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-center">
            <span className="text-sm font-medium text-muted-foreground">Chú thích:</span>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-sm">Trống ({stats.available})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-sm">Có khách ({stats.occupied})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <span className="text-sm">Đã đặt ({stats.reserved})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <span className="text-sm">Đang dọn ({stats.cleaning})</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tables Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Sơ đồ bàn ăn</CardTitle>
          <CardDescription>Nhấp vào bàn để xem chi tiết và thao tác</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {filteredTables.map((table, index) => (
              <div
                key={table.id}
                onClick={() => handleTableClick(table)}
                className={`
                  relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300
                  hover:scale-105 hover:shadow-2xl group animate-in zoom-in
                  ${getStatusColor(table.status)}
                  text-white
                `}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                {/* Table Number */}
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">
                    {table.number}
                  </div>
                  <div className="flex items-center justify-center gap-1 text-sm opacity-90">
                    <Users className="h-4 w-4" />
                    <span>{table.capacity} người</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                  <div className="w-3 h-3 rounded-full bg-white opacity-80 animate-pulse"></div>
                </div>

                {/* Hover Info */}
                <div className="absolute inset-0 bg-black/80 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                  <div className="text-center">
                    <p className="text-sm font-medium mb-2">{table.statusText}</p>
                    {table.currentOrder && (
                      <div className="text-xs space-y-1">
                        <p>{table.currentOrder.customerName}</p>
                        <p className="opacity-75">{table.currentOrder.startTime}</p>
                      </div>
                    )}
                    {table.reservation && (
                      <div className="text-xs space-y-1">
                        <p>{table.reservation.customerName}</p>
                        <p className="opacity-75">{table.reservation.time}</p>
                      </div>
                    )}
                    <Button size="sm" variant="secondary" className="mt-3">
                      <Eye className="h-3 w-3 mr-1" />
                      Chi tiết
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Table Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-primary" />
              Bàn số {selectedTable?.number}
            </DialogTitle>
            <DialogDescription>
              Thông tin chi tiết và quản lý bàn ăn
            </DialogDescription>
          </DialogHeader>
          {selectedTable && (
            <div className="space-y-4 py-4">
              {/* Table Info */}
              <Card>
                <CardContent className="pt-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Sức chứa:</span>
                    <span className="font-medium flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {selectedTable.capacity} người
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Trạng thái:</span>
                    <Badge variant={getStatusBadge(selectedTable.status)}>
                      {selectedTable.statusText}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Current Order */}
              {selectedTable.currentOrder && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Đơn hàng hiện tại</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Mã đơn:</span>
                      <span className="font-semibold text-primary">{selectedTable.currentOrder.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Khách hàng:</span>
                      <span className="font-medium">{selectedTable.currentOrder.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Thời gian:</span>
                      <span className="font-medium flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {selectedTable.currentOrder.startTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Số món:</span>
                      <span className="font-medium">{selectedTable.currentOrder.items} món</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="font-medium">Tổng tiền:</span>
                      <span className="font-bold text-lg text-primary">
                        {selectedTable.currentOrder.amount.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Reservation */}
              {selectedTable.reservation && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Thông tin đặt bàn</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Khách hàng:</span>
                      <span className="font-medium">{selectedTable.reservation.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Số điện thoại:</span>
                      <span className="font-medium">{selectedTable.reservation.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Thời gian:</span>
                      <span className="font-medium">{selectedTable.reservation.time}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                {selectedTable.status === 'available' && (
                  <>
                    <Button className="flex-1 gap-2">
                      <Plus className="h-4 w-4" />
                      Tạo đơn mới
                    </Button>
                    <Button variant="outline" className="flex-1 gap-2">
                      <UserCheck className="h-4 w-4" />
                      Đặt bàn
                    </Button>
                  </>
                )}
                {selectedTable.status === 'occupied' && (
                  <>
                    <Button className="flex-1 gap-2">
                      <Eye className="h-4 w-4" />
                      Xem đơn hàng
                    </Button>
                    <Button variant="destructive" className="flex-1">
                      Thanh toán
                    </Button>
                  </>
                )}
                {selectedTable.status === 'reserved' && (
                  <>
                    <Button className="flex-1 gap-2">
                      <UserCheck className="h-4 w-4" />
                      Check-in
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Hủy đặt bàn
                    </Button>
                  </>
                )}
                {selectedTable.status === 'cleaning' && (
                  <Button className="flex-1 gap-2">
                    <UserCheck className="h-4 w-4" />
                    Hoàn tất dọn dẹp
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
