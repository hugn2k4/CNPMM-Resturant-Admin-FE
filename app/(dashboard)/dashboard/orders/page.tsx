"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Đơn hàng</CardTitle>
          <CardDescription>Danh sách tất cả đơn hàng</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center text-muted-foreground">
            <p>Nội dung quản lý đơn hàng sẽ được phát triển ở đây</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
