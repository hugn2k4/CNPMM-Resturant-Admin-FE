'use client';

import { useState } from 'react';
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
import { Customer } from '@/services/customers.service';
import { EditCustomerDialog } from './edit-customer-dialog';
import { DeleteCustomerDialog } from './delete-customer-dialog';
import { ToggleStatusDialog } from './toggle-status-dialog';
import {
  Edit,
  Trash2,
  Lock,
  Unlock,
  Mail,
  Phone,
  Calendar,
  Shield,
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface CustomersTableProps {
  customers: Customer[];
  onRefresh: () => void;
}

export function CustomersTable({ customers, onRefresh }: CustomersTableProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [toggleStatusDialogOpen, setToggleStatusDialogOpen] = useState(false);

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setEditDialogOpen(true);
  };

  const handleDelete = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDeleteDialogOpen(true);
  };

  const handleToggleStatus = (customer: Customer) => {
    setSelectedCustomer(customer);
    setToggleStatusDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white">
            Hoạt động
          </Badge>
        );
      case 'BLOCKED':
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-200">Đã khóa</Badge>
        );
      case 'INACTIVE':
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-200">Đã khóa</Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getAuthProviderBadge = (provider: string) => {
    switch (provider) {
      case 'Local':
        return <Badge variant="outline">Local</Badge>;
      case 'Google':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
            Google
          </Badge>
        );
      case 'Facebook':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            Facebook
          </Badge>
        );
      default:
        return <Badge variant="outline">{provider}</Badge>;
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Liên hệ</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Xác thực</TableHead>
              <TableHead>Đăng ký</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!customers || customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Shield className="h-12 w-12 mb-2 opacity-30" />
                    <p>Chưa có khách hàng nào</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow key={customer._id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{customer.fullName}</span>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        {getAuthProviderBadge(customer.authProvider)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span>{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{customer.phoneNumber}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(customer.status)}</TableCell>
                  <TableCell>
                    {customer.isEmailVerified ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                        ✓ Đã xác thực
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
                        ⚠ Chưa xác thực
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {customer.createdAt && !isNaN(new Date(customer.createdAt).getTime())
                          ? format(new Date(customer.createdAt), 'dd/MM/yyyy', {
                              locale: vi,
                            })
                          : 'N/A'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(customer)}
                        title="Chỉnh sửa"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(customer)}
                        title={
                          customer.status === 'ACTIVE'
                            ? 'Khóa tài khoản'
                            : 'Mở khóa tài khoản'
                        }
                        className={
                          customer.status === 'ACTIVE'
                            ? 'text-orange-600 hover:text-orange-700'
                            : 'text-green-600 hover:text-green-700'
                        }
                      >
                        {customer.status === 'ACTIVE' ? (
                          <Lock className="h-4 w-4" />
                        ) : (
                          <Unlock className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(customer)}
                        title="Xóa"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <EditCustomerDialog
        customer={selectedCustomer}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={onRefresh}
      />

      <DeleteCustomerDialog
        customer={selectedCustomer}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={onRefresh}
      />

      <ToggleStatusDialog
        customer={selectedCustomer}
        open={toggleStatusDialogOpen}
        onOpenChange={setToggleStatusDialogOpen}
        onSuccess={onRefresh}
      />
    </>
  );
}
