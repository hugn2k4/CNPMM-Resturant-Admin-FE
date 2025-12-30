'use client';

import { useState, useEffect } from 'react';
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
import { Dish, dishesService, CreateDishDto } from '@/services/dishes.service';
import { toast } from 'sonner';
import { Loader2, Plus, X, ImageIcon } from 'lucide-react';

interface EditDishDialogProps {
  dish: Dish | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditDishDialog({
  dish,
  open,
  onOpenChange,
  onSuccess,
}: EditDishDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    stock: '',
    preparationTime: '',
    calories: '',
    discount: '',
    status: 'available',
  });
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    if (dish) {
      setFormData({
        name: dish.name || '',
        description: dish.description || '',
        price: dish.price?.toString() || '',
        categoryId: dish.categoryId || '',
        stock: dish.stock?.toString() || '',
        preparationTime: dish.preparationTime || '',
        calories: dish.calories?.toString() || '',
        discount: dish.discount?.toString() || '',
        status: dish.status || 'available',
      });
      // Load existing images
      const urls = dish.listProductImage?.map((img: any) => 
        typeof img === 'string' ? img : img.url
      ) || [];
      setImageUrls(urls);
    } else {
      // Reset form for create mode
      setFormData({
        name: '',
        description: '',
        price: '',
        categoryId: '',
        stock: '',
        preparationTime: '',
        calories: '',
        discount: '0',
        status: 'available',
      });
      setImageUrls([]);
    }
    setNewImageUrl('');
  }, [dish]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data: any = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        categoryId: formData.categoryId,
        stock: Number(formData.stock),
        preparationTime: formData.preparationTime,
        calories: Number(formData.calories),
        discount: Number(formData.discount) || 0,
        status: formData.status,
        listProductImage: imageUrls.map(url => ({ url })),
      };

      if (dish) {
        // Update existing dish
        await dishesService.updateDish(dish._id, data);
        toast.success('Cập nhật món ăn thành công!');
      } else {
        // Create new dish
        await dishesService.createDish(data);
        toast.success('Thêm món ăn mới thành công!');
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại!'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImageUrls([...imageUrls, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {dish ? 'Chỉnh sửa món ăn' : 'Thêm món ăn mới'}
          </DialogTitle>
          <DialogDescription>
            {dish
              ? 'Cập nhật thông tin món ăn'
              : 'Nhập thông tin món ăn mới'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Management Section */}
          <div className="space-y-3">
            <Label>Hình ảnh món ăn</Label>
            
            {/* Display existing images */}
            {imageUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Product ${index + 1}`}
                      className="w-full h-24 object-cover rounded-md border"
                      onError={(e) => {
                        e.currentTarget.src = '';
                        e.currentTarget.className = 'hidden';
                      }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon-sm"
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add new image URL */}
            <div className="flex gap-2">
              <Input
                placeholder="Nhập URL hình ảnh..."
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddImage();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddImage}
                disabled={!newImageUrl.trim()}
              >
                <Plus className="h-4 w-4 mr-1" />
                Thêm
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Nhập URL hình ảnh và nhấn &quot;Thêm&quot; hoặc Enter
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name">Tên món ăn *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                placeholder="VD: Bò bít tết Úc cao cấp"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Mô tả</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Mô tả chi tiết về món ăn..."
              />
            </div>

            <div>
              <Label htmlFor="price">Giá (VNĐ) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
                min="0"
                placeholder="450000"
              />
            </div>

            <div>
              <Label htmlFor="discount">Giảm giá (%)</Label>
              <Input
                id="discount"
                type="number"
                value={formData.discount}
                onChange={(e) =>
                  setFormData({ ...formData, discount: e.target.value })
                }
                min="0"
                max="100"
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="categoryId">ID Danh mục *</Label>
              <Input
                id="categoryId"
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
                required
                placeholder="ObjectId của category"
              />
            </div>

            <div>
              <Label htmlFor="stock">Số lượng *</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                required
                min="0"
                placeholder="25"
              />
            </div>

            <div>
              <Label htmlFor="preparationTime">Thời gian chế biến *</Label>
              <Input
                id="preparationTime"
                value={formData.preparationTime}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preparationTime: e.target.value,
                  })
                }
                required
                placeholder="25-30 phút"
              />
            </div>

            <div>
              <Label htmlFor="calories">Calo</Label>
              <Input
                id="calories"
                type="number"
                value={formData.calories}
                onChange={(e) =>
                  setFormData({ ...formData, calories: e.target.value })
                }
                min="0"
                placeholder="680"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="status">Trạng thái</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="available">Còn món</option>
                <option value="unavailable">Tạm hết</option>
                <option value="out-of-stock">Hết hàng</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {dish ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
