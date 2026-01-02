'use client';

import { useEffect, useState } from 'react';
import { DishesTable } from '@/components/dishes/dishes-table';
import { EditDishDialog } from '@/components/dishes/edit-dish-dialog';
import { PageHeader } from '@/components/layout/page-header';
import { Dish, dishesService } from '@/services/dishes.service';
import { Category, categoriesService } from '@/services/categories.service';
import { toast } from 'sonner';
import { Loader2, RefreshCw, Plus, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function MenuPage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCategories = async () => {
    try {
      const data = await categoriesService.getAllCategories();
      setCategories(data);
    } catch (error: any) {
      toast.error('Không thể tải danh mục!');
    }
  };

  const fetchDishes = async () => {
    setLoading(true);
    try {
      const category = selectedCategory === 'all' ? undefined : selectedCategory;
      const data = await dishesService.getAllDishes(category);
      setDishes(data);
      setFilteredDishes(data);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          'Có lỗi xảy ra khi tải danh sách món ăn!'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchDishes();
  }, [selectedCategory]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredDishes(dishes);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = dishes.filter(
        (dish) =>
          dish.name.toLowerCase().includes(query) ||
          dish.description.toLowerCase().includes(query)
      );
      setFilteredDishes(filtered);
    }
  }, [searchQuery, dishes]);

  const getStatistics = () => {
    if (!dishes) return { total: 0, available: 0, unavailable: 0, lowStock: 0 };
    return {
      total: dishes.length,
      available: dishes.filter((d) => d.status === 'available').length,
      // Tạm hết: stock === 0 hoặc status === 'unavailable'
      unavailable: dishes.filter((d) => d.stock === 0 || d.status === 'unavailable').length,
      // Sắp hết: stock > 0 && stock < 10
      lowStock: dishes.filter((d) => d.stock > 0 && d.stock < 10).length,
    };
  };

  const stats = getStatistics();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý thực đơn"
        description="Quản lý món ăn, giá cả và tình trạng"
        showSearch={false}
      >
        <div className="flex gap-2">
          <Button
            onClick={fetchDishes}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
            />
            Làm mới
          </Button>
          <Button onClick={() => setAddDialogOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Thêm món
          </Button>
        </div>
      </PageHeader>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Tổng món</span>
            <span className="text-2xl font-bold">{stats.total}</span>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Còn món</span>
            <span className="text-2xl font-bold text-green-600">
              {stats.available}
            </span>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Tạm hết</span>
            <span className="text-2xl font-bold text-red-600">
              {stats.unavailable}
            </span>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Sắp hết</span>
            <span className="text-2xl font-bold text-orange-600">
              {stats.lowStock}
            </span>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Lọc theo danh mục:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setSelectedCategory('all')}
          >
            Tất cả
          </Badge>
          {categories?.map((category) => (
            <Badge
              key={category._id}
              variant={selectedCategory === category._id ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(category._id)}
            >
              {category.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Dishes Table */}
      <div className="rounded-lg border bg-card p-6">
        <div className="mb-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Danh sách món ăn</h3>
              <p className="text-sm text-muted-foreground">
                Hiển thị {filteredDishes?.length || 0} / {dishes?.length || 0} món ăn
              </p>
            </div>
          </div>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên món, mô tả..."
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
          <DishesTable dishes={filteredDishes} onRefresh={fetchDishes} />
        )}
      </div>

      <EditDishDialog
        dish={null}
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSuccess={fetchDishes}
      />
    </div>
  );
}
