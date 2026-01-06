import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Trash2,
  Power,
  Calendar,
  Tag,
  DollarSign,
  Users,
} from "lucide-react";
import type { Voucher } from "@/types/voucher";
import { format } from "date-fns";

interface VoucherListProps {
  vouchers: Voucher[];
  loading: boolean;
  onEdit: (voucher: Voucher) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
  page: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export function VoucherList({
  vouchers = [],
  loading,
  onEdit,
  onDelete,
  onToggleActive,
  page,
  total,
  limit,
  onPageChange,
}: VoucherListProps) {
  const totalPages = Math.ceil(total / limit);

  const formatDiscount = (voucher: Voucher) => {
    if (voucher.discountType === "PERCENTAGE") {
      return `${voucher.discountValue}%`;
    }
    return `${voucher.discountValue.toLocaleString("vi-VN")}đ`;
  };

  const getStatus = (voucher: Voucher) => {
    const now = new Date();
    const start = new Date(voucher.startDate);
    const end = new Date(voucher.endDate);

    if (!voucher.isActive) {
      return { label: "Không hoạt động", color: "bg-gray-500" };
    }
    if (start > now) {
      return { label: "Sắp diễn ra", color: "bg-blue-500" };
    }
    if (end < now) {
      return { label: "Đã hết hạn", color: "bg-red-500" };
    }
    if (voucher.maxUsage && voucher.usageCount >= voucher.maxUsage) {
      return { label: "Hết lượt", color: "bg-orange-500" };
    }
    return { label: "Đang hoạt động", color: "bg-green-500" };
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">Đang tải...</div>
        </CardContent>
      </Card>
    );
  }

  if (vouchers.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-muted-foreground">
            Không tìm thấy voucher nào
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {vouchers.map((voucher) => {
          const status = getStatus(voucher);
          return (
            <Card key={voucher._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <code className="text-lg font-bold bg-primary/10 px-3 py-1 rounded">
                        {voucher.code}
                      </code>
                      <Badge className={status.color}>{status.label}</Badge>
                    </div>
                    <CardTitle className="text-lg">{voucher.name}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">
                      {voucher.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Discount Info */}
                <div className="flex items-center gap-2 text-2xl font-bold text-primary">
                  <Tag className="h-5 w-5" />
                  <span>Giảm {formatDiscount(voucher)}</span>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm">
                  {voucher.minOrderAmount > 0 && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span>
                        Đơn tối thiểu: {voucher.minOrderAmount.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  )}

                  {voucher.maxDiscountAmount && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span>
                        Giảm tối đa: {voucher.maxDiscountAmount.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(new Date(voucher.startDate), "dd/MM/yyyy")} -{" "}
                      {format(new Date(voucher.endDate), "dd/MM/yyyy")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>
                      Đã dùng: {voucher.usageCount}
                      {voucher.maxUsage && ` / ${voucher.maxUsage}`}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(voucher)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Sửa
                  </Button>
                  <Button
                    size="sm"
                    variant={voucher.isActive ? "outline" : "default"}
                    onClick={() => onToggleActive(voucher._id)}
                  >
                    <Power className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(voucher._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            Trước
          </Button>
          <span className="text-sm text-muted-foreground">
            Trang {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
          >
            Sau
          </Button>
        </div>
      )}
    </div>
  );
}
