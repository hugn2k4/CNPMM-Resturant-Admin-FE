'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Notification,
  NOTIFICATION_TYPE_LABELS,
  notificationsService,
} from '@/services/notifications.service';
import { Trash2, Mail, MailOpen, Bell, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface NotificationsTableProps {
  notifications: Notification[];
  onRefresh: () => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function NotificationsTable({
  notifications,
  onRefresh,
  page,
  totalPages,
  onPageChange,
}: NotificationsTableProps) {
  const handleDelete = async (id: string) => {
    try {
      await notificationsService.delete(id);
      toast.success('Đã xóa thông báo!');
      onRefresh();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra!');
    }
  };

  const getTypeBadge = (type: string) => {
    const label = NOTIFICATION_TYPE_LABELS[type as keyof typeof NOTIFICATION_TYPE_LABELS] || type;
    
    const colorMap: Record<string, string> = {
      ORDER_NEW: 'bg-blue-100 text-blue-700',
      ORDER_CONFIRMED: 'bg-green-100 text-green-700',
      ORDER_PREPARING: 'bg-yellow-100 text-yellow-700',
      ORDER_SHIPPING: 'bg-purple-100 text-purple-700',
      ORDER_DELIVERED: 'bg-green-100 text-green-700',
      ORDER_CANCELLED: 'bg-red-100 text-red-700',
      VOUCHER_NEW: 'bg-pink-100 text-pink-700',
      SYSTEM: 'bg-gray-100 text-gray-700',
    };

    return (
      <Badge variant="outline" className={colorMap[type] || 'bg-gray-100 text-gray-700'}>
        {label}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Người nhận</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thời gian</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!notifications || notifications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Bell className="h-12 w-12 mb-2 opacity-30" />
                    <p>Chưa có thông báo nào</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              notifications.map((notification) => (
                <TableRow key={notification._id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{notification.title}</span>
                      <span className="text-sm text-muted-foreground line-clamp-1">
                        {notification.message}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(notification.type)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {notification.user?.fullName || 'N/A'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {notification.user?.email || ''}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {notification.isRead ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <MailOpen className="h-4 w-4" />
                        <span className="text-xs">Đã đọc</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-orange-600">
                        <Mail className="h-4 w-4" />
                        <span className="text-xs">Chưa đọc</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(notification.createdAt), 'dd/MM/yyyy HH:mm', {
                        locale: vi,
                      })}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                          <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa thông báo này? Hành động này
                            không thể hoàn tác.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(notification._id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Xóa
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Trang {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
