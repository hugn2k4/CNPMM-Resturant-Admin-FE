"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
});

type FormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.forgotPassword(data.email);
      setSuccess(true);
      // Optional: Redirect to reset password page carrying email
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
      }, 2000);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-[440px] shadow-xl border-0 bg-white relative z-10">
        <CardHeader className="space-y-3 text-center pb-6 pt-8">
          <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight">Quên mật khẩu?</CardTitle>
          <CardDescription className="text-sm mt-2 text-slate-600">
            Nhập email để nhận mã OTP đặt lại mật khẩu
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Nhập email của bạn"
                {...register("email")}
                disabled={isLoading}
                className="h-11 border-slate-200 focus:border-primary focus:ring-primary placeholder:text-slate-400"
              />
              {errors.email && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                <p className="text-sm text-green-800">Mã OTP đã được gửi đến email của bạn. Chuyển hướng...</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 text-sm font-semibold bg-primary hover:bg-primary/90 text-white shadow-sm transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                "Gửi mã OTP"
              )}
            </Button>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="text-sm text-slate-600 hover:text-primary flex items-center justify-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Quay lại đăng nhập
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
