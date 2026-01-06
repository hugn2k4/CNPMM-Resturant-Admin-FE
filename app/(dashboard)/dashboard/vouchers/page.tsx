"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { VoucherDialog } from "@/components/vouchers/VoucherDialog";
import { VoucherList } from "@/components/vouchers/VoucherList";
import { VoucherStats } from "@/components/vouchers/VoucherStats";
import { vouchersService } from "@/services/vouchers.service";
import type { Voucher, VoucherStatistics } from "@/types/voucher";
import { Plus, Search, Ticket } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [statistics, setStatistics] = useState<VoucherStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterActive, setFilterActive] = useState<boolean | undefined>(undefined);
  const [filterType, setFilterType] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  const limit = 20;

  // Fetch statistics
  const fetchStatistics = useCallback(async () => {
    try {
      const stats = await vouchersService.getStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error("Failed to fetch statistics:", error);
    }
  }, []);

  // Fetch vouchers
  const fetchVouchers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await vouchersService.getAll({
        search: searchQuery || undefined,
        isActive: filterActive,
        discountType: filterType,
        page,
        limit,
      });
      console.log("Vouchers response:", response);

      // Handle both array and object response
      if (Array.isArray(response)) {
        // Response is direct array
        setVouchers(response);
        setTotal(response.length);
      } else {
        // Response is object with data property
        setVouchers(response.data || []);
        setTotal(response.total || 0);
      }
    } catch (error) {
      console.error("Failed to fetch vouchers:", error);
      setVouchers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filterActive, filterType, page]);

  useEffect(() => {
    fetchVouchers();
    fetchStatistics();
  }, [fetchVouchers, fetchStatistics]);

  const handleCreate = () => {
    setSelectedVoucher(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa voucher này?")) {
      try {
        await vouchersService.delete(id);
        fetchVouchers();
        fetchStatistics();
      } catch (error) {
        console.error("Failed to delete voucher:", error);
      }
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      await vouchersService.toggleActive(id);
      fetchVouchers();
      fetchStatistics();
    } catch (error) {
      console.error("Failed to toggle voucher status:", error);
    }
  };

  const handleSaveSuccess = () => {
    setIsDialogOpen(false);
    fetchVouchers();
    fetchStatistics();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Ticket className="h-8 w-8 text-primary" />
            Quản lý Voucher
          </h1>
          <p className="text-muted-foreground mt-2">Tạo và quản lý các mã giảm giá cho khách hàng</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Tạo voucher mới
        </Button>
      </div>

      {/* Statistics */}
      {statistics && <VoucherStats statistics={statistics} />}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo mã hoặc tên..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Active Filter */}
            <select
              value={filterActive === undefined ? "all" : filterActive ? "active" : "inactive"}
              onChange={(e) => setFilterActive(e.target.value === "all" ? undefined : e.target.value === "active")}
              className="px-4 py-2 border border-input rounded-md bg-background"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>

            {/* Type Filter */}
            <select
              value={filterType || "all"}
              onChange={(e) => setFilterType(e.target.value === "all" ? undefined : e.target.value)}
              className="px-4 py-2 border border-input rounded-md bg-background"
            >
              <option value="all">Tất cả loại</option>
              <option value="PERCENTAGE">Phần trăm</option>
              <option value="FIXED_AMOUNT">Số tiền cố định</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Voucher List */}
      <VoucherList
        vouchers={vouchers}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
        page={page}
        total={total}
        limit={limit}
        onPageChange={setPage}
      />

      {/* Create/Edit Dialog */}
      <VoucherDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        voucher={selectedVoucher}
        onSuccess={handleSaveSuccess}
      />
    </div>
  );
}
