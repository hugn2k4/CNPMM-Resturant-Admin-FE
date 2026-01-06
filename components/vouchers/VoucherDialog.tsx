"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { vouchersService } from "@/services/vouchers.service";
import type { Voucher, CreateVoucherInput } from "@/types/voucher";

interface VoucherDialogProps {
  open: boolean;
  onClose: () => void;
  voucher: Voucher | null;
  onSuccess: () => void;
}

export function VoucherDialog({
  open,
  onClose,
  voucher,
  onSuccess,
}: VoucherDialogProps) {
  const isEditing = !!voucher;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateVoucherInput>({
    code: "",
    name: "",
    description: "",
    discountType: "PERCENTAGE",
    discountValue: 0,
    maxDiscountAmount: undefined,
    minOrderAmount: 0,
    maxUsage: undefined,
    maxUsagePerUser: 1,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    isActive: true,
    isPublic: true,
  });

  useEffect(() => {
    if (voucher) {
      setFormData({
        code: voucher.code,
        name: voucher.name,
        description: voucher.description,
        discountType: voucher.discountType,
        discountValue: voucher.discountValue,
        maxDiscountAmount: voucher.maxDiscountAmount || undefined,
        minOrderAmount: voucher.minOrderAmount,
        maxUsage: voucher.maxUsage || undefined,
        maxUsagePerUser: voucher.maxUsagePerUser,
        startDate: voucher.startDate.split("T")[0],
        endDate: voucher.endDate.split("T")[0],
        isActive: voucher.isActive,
        isPublic: voucher.isPublic,
      });
    } else {
      setFormData({
        code: "",
        name: "",
        description: "",
        discountType: "PERCENTAGE",
        discountValue: 0,
        maxDiscountAmount: undefined,
        minOrderAmount: 0,
        maxUsage: undefined,
        maxUsagePerUser: 1,
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        isActive: true,
        isPublic: true,
      });
    }
  }, [voucher, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert date strings to ISO format
      const submitData = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      };

      if (isEditing) {
        await vouchersService.update(voucher._id, submitData);
      } else {
        await vouchersService.create(submitData);
      }
      onSuccess();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Có lỗi xảy ra";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Chỉnh sửa voucher" : "Tạo voucher mới"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Cập nhật thông tin voucher"
              : "Điền thông tin để tạo voucher mới"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Code */}
          <div className="space-y-2">
            <Label htmlFor="code">
              Mã voucher <span className="text-red-500">*</span>
            </Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value.toUpperCase() })
              }
              placeholder="VD: SUMMER2024"
              required
              minLength={4}
              maxLength={20}
            />
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Tên voucher <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="VD: Giảm giá mùa hè"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Mô tả <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Mô tả chi tiết về voucher"
              required
              rows={3}
            />
          </div>

          {/* Discount Type & Value */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discountType">
                Loại giảm giá <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.discountType}
                onValueChange={(value: "PERCENTAGE" | "FIXED_AMOUNT") =>
                  setFormData({ ...formData, discountType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERCENTAGE">Phần trăm (%)</SelectItem>
                  <SelectItem value="FIXED_AMOUNT">Số tiền cố định (đ)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountValue">
                Giá trị giảm <span className="text-red-500">*</span>
              </Label>
              <Input
                id="discountValue"
                type="number"
                value={formData.discountValue}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discountValue: parseFloat(e.target.value),
                  })
                }
                min="0"
                max={formData.discountType === "PERCENTAGE" ? "100" : undefined}
                required
              />
            </div>
          </div>

          {/* Min Order & Max Discount */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minOrderAmount">Đơn hàng tối thiểu (đ)</Label>
              <Input
                id="minOrderAmount"
                type="number"
                value={formData.minOrderAmount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    minOrderAmount: parseFloat(e.target.value),
                  })
                }
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxDiscountAmount">Giảm tối đa (đ)</Label>
              <Input
                id="maxDiscountAmount"
                type="number"
                value={formData.maxDiscountAmount || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxDiscountAmount: e.target.value
                      ? parseFloat(e.target.value)
                      : undefined,
                  })
                }
                min="0"
                placeholder="Không giới hạn"
              />
            </div>
          </div>

          {/* Usage Limits */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxUsage">Số lượt sử dụng</Label>
              <Input
                id="maxUsage"
                type="number"
                value={formData.maxUsage || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxUsage: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                min="1"
                placeholder="Không giới hạn"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxUsagePerUser">
                Lượt dùng/người <span className="text-red-500">*</span>
              </Label>
              <Input
                id="maxUsagePerUser"
                type="number"
                value={formData.maxUsagePerUser}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxUsagePerUser: parseInt(e.target.value),
                  })
                }
                min="1"
                required
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">
                Ngày bắt đầu <span className="text-red-500">*</span>
              </Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">
                Ngày kết thúc <span className="text-red-500">*</span>
              </Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* Status toggles */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="w-4 h-4"
              />
              <span className="text-sm">Kích hoạt ngay</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) =>
                  setFormData({ ...formData, isPublic: e.target.checked })
                }
                className="w-4 h-4"
              />
              <span className="text-sm">Hiển thị công khai</span>
            </label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang lưu..." : isEditing ? "Cập nhật" : "Tạo mới"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
