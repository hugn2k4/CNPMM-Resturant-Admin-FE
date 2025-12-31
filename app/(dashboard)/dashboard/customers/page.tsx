'use client';

import { useEffect, useState } from 'react';
import { CustomersTable } from '@/components/customers/customers-table';
import { PageHeader } from '@/components/layout/page-header';
import { Customer, customersService } from '@/services/customers.service';
import { toast } from 'sonner';
import { Loader2, RefreshCw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await customersService.getAllCustomers();
      setCustomers(data);
      setFilteredCustomers(data);
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

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCustomers(customers);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = customers.filter(
        (customer) =>
          customer.fullName.toLowerCase().includes(query) ||
          customer.email.toLowerCase().includes(query) ||
          customer.phoneNumber.toLowerCase().includes(query)
      );
      setFilteredCustomers(filtered);
    }
  }, [searchQuery, customers]);

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
        <div className="mb-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Danh sách khách hàng</h3>
              <p className="text-sm text-muted-foreground">
                Hiển thị {filteredCustomers?.length || 0} / {customers?.length || 0} khách hàng
              </p>
            </div>
          </div>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên, email, số điện thoại..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <CustomersTable customers={filteredCustomers} onRefresh={fetchCustomers} />
        )}
      </div>
    </div>
  );
}
