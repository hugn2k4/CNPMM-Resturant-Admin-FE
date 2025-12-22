'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Customer, customersService } from '@/services/customers.service';
import { toast } from 'sonner';

interface ToggleStatusDialogProps {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ToggleStatusDialog({
  customer,
  open,
  onOpenChange,
  onSuccess,
}: ToggleStatusDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (!customer) return;

    const newStatus = customer.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    setLoading(true);

    try {
      await customersService.toggleCustomerStatus(customer._id, newStatus);
      toast.success(
        `${newStatus === 'BLOCKED' ? 'Khóa' : 'Mở khóa'} tài khoản thành công!`
      );
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Có lỗi xảy ra khi thay đổi trạng thái!'
      );
    } finally {
      setLoading(false);
    }
  };

  const isBlocking = customer?.status === 'ACTIVE';

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isBlocking ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn{' '}
            <span className="font-semibold">
              {isBlocking ? 'khóa' : 'mở khóa'}
            </span>{' '}
            tài khoản khách hàng{' '}
            <span className="font-semibold text-foreground">
              {customer?.fullName}
            </span>{' '}
            ({customer?.email})?
            <br />
            <br />
            {isBlocking ? (
              <span className="text-destructive font-medium">
                Khách hàng sẽ không thể đăng nhập vào hệ thống!
              </span>
            ) : (
              <span className="text-green-600 dark:text-green-500 font-medium">
                Khách hàng sẽ có thể đăng nhập lại vào hệ thống.
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleToggle}
            disabled={loading}
            className={
              isBlocking
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                : ''
            }
          >
            {loading
              ? 'Đang xử lý...'
              : isBlocking
                ? 'Khóa tài khoản'
                : 'Mở khóa tài khoản'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
