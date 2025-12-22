"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search } from "lucide-react";
import { NAVIGATION_ITEMS } from "@/constants/navigation";

interface PageHeaderProps {
  title?: string; // Để dấu ? để không bắt buộc truyền
  description?: string;
  showSearch?: boolean; // Option để ẩn/hiện search tùy trang
  children?: ReactNode; // Để chứa các nút action đặc thù khác
}

export function PageHeader({ 
  title, 
  description, 
  showSearch = true, 
  children 
}: PageHeaderProps) {
  const pathname = usePathname();

  // 1. Logic tự động lấy thông tin từ navigation (Kế thừa từ cách 1)
  const currentPage = NAVIGATION_ITEMS.find((item) => item.href === pathname);
  
  // Priority: Props truyền vào > Dữ liệu từ Navigation > Mặc định
  const finalTitle = title ?? currentPage?.title ?? "Dashboard";
  const finalDescription = description ?? currentPage?.description ?? "Quản lý hệ thống";

  return (
    <div className="mb-6 lg:mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Section: Tiêu đề */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground transition-all">
            {finalTitle}
          </h1>
          {finalDescription && (
            <p className="text-muted-foreground mt-1">{finalDescription}</p>
          )}
        </div>

        {/* Section: Actions (Kết hợp cả Search và Children) */}
        <div className="flex flex-1 flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-end">
          {/* Thanh tìm kiếm mặc định (Kế thừa cách 1) */}
          {showSearch && (
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Tìm kiếm..." className="pl-9 h-10" />
            </div>
          )}

          <div className="flex items-center gap-2">
            {/* Các nút custom truyền từ ngoài vào (Kế thừa cách 2) */}
            {children}

            {/* Nút thông báo mặc định */}
            <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}