"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TablesPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bàn ăn</CardTitle>
          <CardDescription>Sơ đồ và trạng thái các bàn ăn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center text-muted-foreground">
            <p>Nội dung quản lý bàn ăn sẽ được phát triển ở đây</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
