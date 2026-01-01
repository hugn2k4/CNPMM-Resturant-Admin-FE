import { apiClient } from './api-client';

export interface Notification {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  readAt?: Date;
  emailSent: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    _id: string;
    email: string;
    fullName: string;
  };
}

export enum NotificationType {
  ORDER_NEW = 'ORDER_NEW',
  ORDER_CONFIRMED = 'ORDER_CONFIRMED',
  ORDER_PREPARING = 'ORDER_PREPARING',
  ORDER_SHIPPING = 'ORDER_SHIPPING',
  ORDER_DELIVERED = 'ORDER_DELIVERED',
  ORDER_CANCELLED = 'ORDER_CANCELLED',
  REVIEW_NEW = 'REVIEW_NEW',
  REVIEW_REPLY = 'REVIEW_REPLY',
  VOUCHER_NEW = 'VOUCHER_NEW',
  EVENT_NEW = 'EVENT_NEW',
  CHAT_MESSAGE = 'CHAT_MESSAGE',
  SYSTEM = 'SYSTEM',
}

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  [NotificationType.ORDER_NEW]: 'Đơn hàng mới',
  [NotificationType.ORDER_CONFIRMED]: 'Xác nhận đơn hàng',
  [NotificationType.ORDER_PREPARING]: 'Đang chuẩn bị',
  [NotificationType.ORDER_SHIPPING]: 'Đang giao hàng',
  [NotificationType.ORDER_DELIVERED]: 'Đã giao hàng',
  [NotificationType.ORDER_CANCELLED]: 'Đã hủy đơn',
  [NotificationType.REVIEW_NEW]: 'Đánh giá mới',
  [NotificationType.REVIEW_REPLY]: 'Phản hồi đánh giá',
  [NotificationType.VOUCHER_NEW]: 'Voucher mới',
  [NotificationType.EVENT_NEW]: 'Sự kiện mới',
  [NotificationType.CHAT_MESSAGE]: 'Tin nhắn',
  [NotificationType.SYSTEM]: 'Hệ thống',
};

export interface NotificationsResponse {
  notifications: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface NotificationStats {
  total: number;
  unread: number;
  sentToday: number;
}

export interface CreateNotificationDto {
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  sendEmail?: boolean;
}

export interface SendToUserDto extends CreateNotificationDto {
  userId: string;
}

export interface SendToMultipleDto extends CreateNotificationDto {
  userIds: string[];
}

class NotificationsService {
  private basePath = '/notifications';

  async getAll(page = 1, limit = 20): Promise<NotificationsResponse> {
    return apiClient.get<NotificationsResponse>(
      `${this.basePath}?page=${page}&limit=${limit}`
    );
  }

  async getStats(): Promise<NotificationStats> {
    return apiClient.get<NotificationStats>(`${this.basePath}/stats`);
  }

  async sendToUser(dto: SendToUserDto): Promise<{ notification: Notification }> {
    return apiClient.post<{ notification: Notification }>(
      `${this.basePath}/send-to-user`,
      dto
    );
  }

  async sendToMultiple(
    dto: SendToMultipleDto
  ): Promise<{ count: number; notifications: Notification[] }> {
    return apiClient.post<{ count: number; notifications: Notification[] }>(
      `${this.basePath}/send-to-multiple`,
      dto
    );
  }

  async sendToAll(
    dto: CreateNotificationDto
  ): Promise<{ count: number; notifications: Notification[]; message: string }> {
    return apiClient.post<{
      count: number;
      notifications: Notification[];
      message: string;
    }>(`${this.basePath}/send-to-all`, dto);
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}`);
  }
}

export const notificationsService = new NotificationsService();
