"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cài đặt</CardTitle>
          <CardDescription>Các tùy chọn cấu hình hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center text-muted-foreground">
            <p>Nội dung cài đặt sẽ được phát triển ở đây</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
