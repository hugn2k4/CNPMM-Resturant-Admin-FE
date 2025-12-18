"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function MenuPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thực đơn</CardTitle>
          <CardDescription>Danh sách tất cả món ăn trong nhà hàng</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center text-muted-foreground">
            <p>Nội dung quản lý thực đơn sẽ được phát triển ở đây</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
