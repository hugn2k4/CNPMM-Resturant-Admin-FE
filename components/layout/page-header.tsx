"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NAVIGATION_ITEMS } from "@/constants/navigation";
import { Bell, Search } from "lucide-react";
import { usePathname } from "next/navigation";

export function PageHeader() {
  const pathname = usePathname();

  // Tìm trang hiện tại từ navigation items
  const currentPage = NAVIGATION_ITEMS.find((item) => item.href === pathname);
  const pageTitle = currentPage?.title || "Dashboard";
  const pageDescription = currentPage?.description || "Quản lý hệ thống nhà hàng";

  return (
    <div className="mb-6 lg:mb-8">
      {/* Title & Description */}
      <div className="mb-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{pageTitle}</h1>
        <p className="text-muted-foreground mt-1">{pageDescription}</p>
      </div>

      {/* Search & Actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Tìm kiếm..." className="pl-9 h-10" />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="h-10 w-10">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
