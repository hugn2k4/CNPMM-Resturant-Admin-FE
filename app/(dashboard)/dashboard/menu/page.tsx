"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Grid3x3,
  List,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  ChefHat,
  DollarSign,
  ImageIcon,
  MoreVertical
} from "lucide-react";

// Mock data
const menuItems = [
  {
    id: 1,
    name: "Phở bò",
    category: "main-course",
    categoryName: "Món chính",
    price: 75000,
    description: "Phở bò truyền thống với nước dùng hầm xương 24h",
    image: "/images/pho.jpg",
    isAvailable: true,
    rating: 4.8,
    orders: 156,
  },
  {
    id: 2,
    name: "Cơm gà",
    category: "main-course",
    categoryName: "Món chính",
    price: 65000,
    description: "Cơm gà Hải Nam thơm ngon, đậm đà",
    image: "/images/com-ga.jpg",
    isAvailable: true,
    rating: 4.7,
    orders: 134,
  },
  {
    id: 3,
    name: "Gỏi cuốn",
    category: "appetizer",
    categoryName: "Khai vị",
    price: 45000,
    description: "Gỏi cuốn tôm thịt tươi ngon",
    image: "/images/goi-cuon.jpg",
    isAvailable: true,
    rating: 4.6,
    orders: 98,
  },
  {
    id: 4,
    name: "Bánh flan",
    category: "dessert",
    categoryName: "Tráng miệng",
    price: 25000,
    description: "Bánh flan caramel mềm mịn",
    image: "/images/flan.jpg",
    isAvailable: true,
    rating: 4.5,
    orders: 76,
  },
  {
    id: 5,
    name: "Cà phê sữa đá",
    category: "beverage",
    categoryName: "Đồ uống",
    price: 30000,
    description: "Cà phê phin truyền thống",
    image: "/images/coffee.jpg",
    isAvailable: false,
    rating: 4.9,
    orders: 245,
  },
  {
    id: 6,
    name: "Bún chả",
    category: "main-course",
    categoryName: "Món chính",
    price: 70000,
    description: "Bún chả Hà Nội chính gốc",
    image: "/images/bun-cha.jpg",
    isAvailable: true,
    rating: 4.8,
    orders: 112,
  },
];

const categories = [
  { value: "all", label: "Tất cả" },
  { value: "main-course", label: "Món chính" },
  { value: "appetizer", label: "Khai vị" },
  { value: "dessert", label: "Tráng miệng" },
  { value: "beverage", label: "Đồ uống" },
];

export default function MenuPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ChefHat className="h-8 w-8 text-primary" />
          Quản lý thực đơn
        </h1>
        <p className="text-muted-foreground mt-1">Quản lý tất cả món ăn trong nhà hàng</p>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-1 gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm món ăn..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Danh mục" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-3">
          {/* View Toggle */}
          <div className="flex gap-1 border rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon-sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon-sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Add Button */}
          <Button onClick={() => setShowAddDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Thêm món mới
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{menuItems.length}</div>
            <p className="text-xs text-muted-foreground">Tổng món ăn</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{menuItems.filter(i => i.isAvailable).length}</div>
            <p className="text-xs text-muted-foreground">Đang phục vụ</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{menuItems.filter(i => !i.isAvailable).length}</div>
            <p className="text-xs text-muted-foreground">Hết hàng</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">4</div>
            <p className="text-xs text-muted-foreground">Danh mục</p>
          </CardContent>
        </Card>
      </div>

      {/* Menu Items */}
      {viewMode === "grid" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item, index) => (
            <Card 
              key={item.id} 
              className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group animate-in slide-in-from-bottom"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="relative h-48 bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center overflow-hidden">
                {item.image ? (
                  <div className="w-full h-full bg-gray-200" />
                ) : (
                  <ImageIcon className="h-20 w-20 text-gray-300" />
                )}
                {!item.isAvailable && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Badge variant="destructive" className="text-sm">Hết hàng</Badge>
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <Badge className="bg-white text-foreground shadow-md">
                    {item.categoryName}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="line-clamp-1">{item.name}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">{item.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm font-medium">{item.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{item.orders} đơn</span>
                </div>
              </CardHeader>
              <CardFooter className="flex justify-between items-center pt-0">
                <div>
                  <p className="text-2xl font-bold text-primary">{item.price.toLocaleString('vi-VN')}đ</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon-sm" title="Xem chi tiết">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon-sm" title="Chỉnh sửa">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon-sm" title="Xóa" className="text-destructive hover:bg-destructive hover:text-white">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Món ăn</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Đánh giá</TableHead>
                <TableHead>Đơn hàng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
                        <ChefHat className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.categoryName}</Badge>
                  </TableCell>
                  <TableCell className="font-semibold">{item.price.toLocaleString('vi-VN')}đ</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="font-medium">{item.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>{item.orders}</TableCell>
                  <TableCell>
                    <Badge variant={item.isAvailable ? "success" : "destructive"}>
                      {item.isAvailable ? "Có sẵn" : "Hết hàng"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="icon-sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Thêm món ăn mới</DialogTitle>
            <DialogDescription>
              Thêm một món ăn mới vào thực đơn nhà hàng
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Tên món ăn</Label>
              <Input id="name" placeholder="Nhập tên món ăn" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Danh mục</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.filter(c => c.value !== 'all').map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Giá (VNĐ)</Label>
              <Input id="price" type="number" placeholder="0" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Mô tả</Label>
              <Input id="description" placeholder="Mô tả món ăn" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Hủy
            </Button>
            <Button onClick={() => setShowAddDialog(false)}>
              Thêm món
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
