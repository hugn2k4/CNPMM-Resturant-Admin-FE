export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image?: string;
}

export interface ShippingAddress {
  fullName: string;
  phoneNumber: string;
  address: string;
  ward?: string;
  district?: string;
  city?: string;
  note?: string;
}

export interface Order {
  _id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "pending" | "confirmed" | "preparing" | "shipping" | "delivered" | "cancelled";
  totalAmount: number;
  shippingFee: number;
  finalAmount: number;
  note?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderListResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OrderStatistics {
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  shippingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  todayOrders: number;
  monthOrders: number;
  totalRevenue: number;
}

export interface QueryOrderParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface UpdateOrderStatusRequest {
  orderStatus: "pending" | "confirmed" | "preparing" | "shipping" | "delivered" | "cancelled";
  cancelReason?: string;
}
