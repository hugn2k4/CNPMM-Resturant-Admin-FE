"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const resetSchema = z.object({
  otp: z.string().min(6, "OTP phải có 6 ký tự"),
  newPassword: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu không khớp",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof resetSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: FormData) => {
    if (!email) {
        setError("Thiếu thông tin email. Vui lòng thực hiện lại.");
        return;
    }
    try {
      setIsLoading(true);
      setError(null);
      await authService.resetPassword({
          email,
          otp: data.otp,
          newPassword: data.newPassword
      });
      alert('Đặt lại mật khẩu thành công!');
      router.push('/login');
    } catch (err: any) {
      setError(err?.response?.data?.message || "Đặt lại mật khẩu thất bại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {!email && <div className="p-3 bg-yellow-100 text-yellow-800 text-sm rounded">Không tìm thấy email. Vui lòng quay lại trang quên mật khẩu.</div>}
        
        <div className="space-y-2">
            <Label htmlFor="otp">Mã OTP</Label>
            <Input id="otp" placeholder="123456" {...register("otp")} disabled={isLoading} />
            {errors.otp && <p className="text-xs text-destructive">{errors.otp.message}</p>}
        </div>

        <div className="space-y-2">
            <Label htmlFor="newPassword">Mật khẩu mới</Label>
            <Input id="newPassword" type="password" {...register("newPassword")} disabled={isLoading} />
            {errors.newPassword && <p className="text-xs text-destructive">{errors.newPassword.message}</p>}
        </div>

        <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
            <Input id="confirmPassword" type="password" {...register("confirmPassword")} disabled={isLoading} />
            {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
        </div>

        {error && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
            </div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading || !email}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Đặt lại mật khẩu"}
        </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Đặt lại mật khẩu</CardTitle>
          <CardDescription>Nhập OTP đã nhận và mật khẩu mới</CardDescription>
        </CardHeader>
        <CardContent>
            <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
                <ResetPasswordForm />
            </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
