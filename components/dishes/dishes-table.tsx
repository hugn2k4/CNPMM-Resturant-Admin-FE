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
import { Dish } from '@/services/dishes.service';
import { EditDishDialog } from './edit-dish-dialog';
import { DeleteDishDialog } from './delete-dish-dialog';
import {
  Edit,
  Trash2,
  Eye,
  Star,
  ShoppingCart,
  Clock,
  Flame,
  ImageIcon,
} from 'lucide-react';

interface DishesTableProps {
  dishes: Dish[];
  onRefresh: () => void;
}

export function DishesTable({ dishes, onRefresh }: DishesTableProps) {
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleEdit = (dish: Dish) => {
    setSelectedDish(dish);
    setEditDialogOpen(true);
  };

  const handleDelete = (dish: Dish) => {
    setSelectedDish(dish);
    setDeleteDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return (
          <Badge
            variant="default"
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Còn món
          </Badge>
        );
      case 'unavailable':
        return (
          <Badge
            variant="destructive"
            className="bg-red-100 text-red-700 hover:bg-red-200"
          >
            Tạm hết
          </Badge>
        );
      case 'out-of-stock':
        return (
          <Badge
            variant="outline"
            className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            Hết hàng
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hình ảnh</TableHead>
              <TableHead>Món ăn</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Kho</TableHead>
              <TableHead>Thống kê</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!dishes || dishes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <ImageIcon className="h-12 w-12 mb-2 opacity-30" />
                    <p>Chưa có món ăn nào</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              dishes.map((dish) => (
                <TableRow key={dish._id}>
                  <TableCell>
                    {dish.listProductImage && dish.listProductImage.length > 0 ? (
                      <img
                        src={
                          typeof dish.listProductImage[0] === 'string'
                            ? dish.listProductImage[0]
                            : dish.listProductImage[0]?.url || ''
                        }
                        alt={dish.name}
                        className="w-16 h-16 object-cover rounded-md"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`w-16 h-16 bg-muted rounded-md flex items-center justify-center ${dish.listProductImage && dish.listProductImage.length > 0 ? 'hidden' : ''}`}>
                      <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{dish.name}</span>
                      <span className="text-sm text-muted-foreground line-clamp-1">
                        {dish.description}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{dish.preparationTime}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Flame className="h-3 w-3" />
                          <span>{dish.calories} kcal</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold">
                        {formatCurrency(dish.price)}
                      </span>
                      {dish.discount > 0 && (
                        <Badge
                          variant="outline"
                          className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 w-fit"
                        >
                          -{dish.discount}%
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(dish.status)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        dish.stock <= 10
                          ? 'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300'
                          : ''
                      }
                    >
                      {dish.stock} phần
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        <span>
                          {dish.rating} ({dish.reviewCount})
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <ShoppingCart className="h-3 w-3" />
                        <span>{dish.soldCount} đã bán</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Eye className="h-3 w-3" />
                        <span>{dish.viewCount} lượt xem</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(dish)}
                        title="Chỉnh sửa"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(dish)}
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

      <EditDishDialog
        dish={selectedDish}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={onRefresh}
      />

      <DeleteDishDialog
        dish={selectedDish}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={onRefresh}
      />
    </>
  );
}
