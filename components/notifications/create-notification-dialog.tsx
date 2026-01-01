'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import {
  NotificationType,
  NOTIFICATION_TYPE_LABELS,
  notificationsService,
} from '@/services/notifications.service';
import { Customer } from '@/services/customers.service';
import { toast } from 'sonner';
import { Loader2, Send, Users } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CreateNotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customers: Customer[];
  onSuccess: () => void;
}

type SendTarget = 'all' | 'multiple';

export function CreateNotificationDialog({
  open,
  onOpenChange,
  customers,
  onSuccess,
}: CreateNotificationDialogProps) {
  const [loading, setLoading] = useState(false);
  const [sendTarget, setSendTarget] = useState<SendTarget>('all');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    type: NotificationType.SYSTEM,
    title: '',
    message: '',
  });

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error('Vui lòng nhập đầy đủ tiêu đề và nội dung!');
      return;
    }

    if (sendTarget === 'multiple' && selectedUserIds.length === 0) {
      toast.error('Vui lòng chọn ít nhất một người nhận!');
      return;
    }

    setLoading(true);
    try {
      let result;

      if (sendTarget === 'all') {
        result = await notificationsService.sendToAll(formData);
        toast.success(`Đã gửi thông báo đến ${result.count} người dùng!`);
      } else {
        result = await notificationsService.sendToMultiple({
          ...formData,
          userIds: selectedUserIds,
        });
        toast.success(`Đã gửi thông báo đến ${result.count} người dùng!`);
      }

      // Reset form
      setFormData({
        type: NotificationType.SYSTEM,
        title: '',
        message: '',
      });
      setSelectedUserIds([]);
      setSendTarget('all');
      
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    if (selectedUserIds.length === customers.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(customers.map((c) => c._id));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo thông báo mới</DialogTitle>
          <DialogDescription>
            Gửi thông báo đến người dùng trong hệ thống
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Send Target */}
          <div className="space-y-3">
            <Label>Đối tượng nhận</Label>
            <RadioGroup
              value={sendTarget}
              onValueChange={(value: string) => setSendTarget(value as SendTarget)}
              className="flex flex-col gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all" className="flex items-center gap-2 cursor-pointer">
                  <Users className="h-4 w-4" />
                  Tất cả người dùng ({customers.length})
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="multiple" id="multiple" />
                <Label htmlFor="multiple" className="flex items-center gap-2 cursor-pointer">
                  <Users className="h-4 w-4" />
                  Chọn người dùng cụ thể
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* User Selection */}
          {sendTarget === 'multiple' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Chọn người nhận ({selectedUserIds.length} đã chọn)</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={selectAllUsers}
                  type="button"
                >
                  {selectedUserIds.length === customers.length
                    ? 'Bỏ chọn tất cả'
                    : 'Chọn tất cả'}
                </Button>
              </div>
              <ScrollArea className="h-[150px] rounded-md border p-2">
                <div className="space-y-2">
                  {customers.map((customer) => (
                    <div
                      key={customer._id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={customer._id}
                        checked={selectedUserIds.includes(customer._id)}
                        onCheckedChange={() => toggleUserSelection(customer._id)}
                      />
                      <label
                        htmlFor={customer._id}
                        className="text-sm cursor-pointer flex-1"
                      >
                        {customer.fullName}{' '}
                        <span className="text-muted-foreground">
                          ({customer.email})
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Notification Type */}
          <div className="space-y-2">
            <Label>Loại thông báo</Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, type: value as NotificationType }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(NOTIFICATION_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Nhập tiêu đề thông báo"
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Nội dung</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setFormData((prev) => ({ ...prev, message: e.target.value }))
              }
              placeholder="Nhập nội dung thông báo"
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang gửi...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Gửi thông báo
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
