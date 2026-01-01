'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { NotificationsTable } from '@/components/notifications/notifications-table';
import { CreateNotificationDialog } from '@/components/notifications/create-notification-dialog';
import {
  Notification,
  NotificationStats,
  notificationsService,
} from '@/services/notifications.service';
import { Customer, customersService } from '@/services/customers.service';
import { toast } from 'sonner';
import { Loader2, RefreshCw, Bell, Send, Users, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const [notifData, statsData, customersData] = await Promise.all([
        notificationsService.getAll(page, 20),
        notificationsService.getStats(),
        customersService.getAllCustomers(),
      ]);
      setNotifications(notifData.notifications);
      setTotalPages(notifData.pagination.totalPages);
      setStats(statsData);
      setCustomers(customersData);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Có lỗi xảy ra khi tải dữ liệu!'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [page]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý thông báo"
        description="Tạo và gửi thông báo đến người dùng"
      >
        <div className="flex gap-2">
          <Button onClick={fetchNotifications} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Làm mới
          </Button>
          <Button onClick={() => setCreateDialogOpen(true)} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Tạo thông báo
          </Button>
        </div>
      </PageHeader>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng thông báo</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chưa đọc</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats?.unread || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gửi hôm nay</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats?.sentToday || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <NotificationsTable
          notifications={notifications}
          onRefresh={fetchNotifications}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Create Dialog */}
      <CreateNotificationDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        customers={customers}
        onSuccess={fetchNotifications}
      />
    </div>
  );
}
