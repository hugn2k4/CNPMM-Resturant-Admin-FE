import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, CheckCircle, XCircle, Clock } from "lucide-react";
import type { VoucherStatistics } from "@/types/voucher";

interface VoucherStatsProps {
  statistics: VoucherStatistics;
}

export function VoucherStats({ statistics }: VoucherStatsProps) {
  const stats = [
    {
      title: "Tổng voucher",
      value: statistics.total,
      icon: Ticket,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Đang hoạt động",
      value: statistics.active,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Sắp diễn ra",
      value: statistics.upcoming,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Đã hết hạn",
      value: statistics.expired,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <div className={`${stat.bgColor} p-2 rounded-lg`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
