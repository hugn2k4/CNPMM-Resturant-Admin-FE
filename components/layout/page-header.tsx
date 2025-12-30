"use client";

import { Button } from "@/components/ui/button";
import { NAVIGATION_ITEMS } from "@/constants/navigation";
import { Bell } from "lucide-react";
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{pageTitle}</h1>
          <p className="text-muted-foreground mt-1">{pageDescription}</p>
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
