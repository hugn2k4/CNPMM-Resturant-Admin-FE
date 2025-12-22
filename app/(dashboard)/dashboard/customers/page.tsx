'use client';

import { useEffect, useState } from 'react';
import { CustomersTable } from '@/components/customers/customers-table';
import { PageHeader } from '@/components/layout/page-header';
import { Customer, customersService } from '@/services/customers.service';
import { toast } from 'sonner';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await customersService.getAllCustomers();
      setCustomers(data);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          'Có lỗi xảy ra khi tải danh sách khách hàng!'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý khách hàng"
        description="Quản lý thông tin khách hàng, khóa/mở khóa tài khoản"
      >
        <Button
          onClick={fetchCustomers}
          variant="outline"
          size="sm"
          disabled={loading}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
          />
          Làm mới
        </Button>
      </PageHeader>

      <div className="rounded-lg border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Danh sách khách hàng</h3>
            <p className="text-sm text-muted-foreground">
              Tổng số: {customers.length} khách hàng
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <CustomersTable customers={customers} onRefresh={fetchCustomers} />
        )}
      </div>
    </div>
  );
}
