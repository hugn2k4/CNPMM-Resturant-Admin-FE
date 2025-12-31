"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/constants/routes";
import { useToast } from "@/hooks/use-toast";
import { cookieUtils } from "@/lib/cookies";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const responseData = await authService.login(data);

      // Save user data
      useAuthStore.setState({
        user: {
          id: responseData.user._id,
          email: responseData.user.email,
          name: responseData.user.fullName,
          role: responseData.user.role,
        },
        token: responseData.accessToken,
        isAuthenticated: true,
      });

      // Save token to both localStorage and cookies
      localStorage.setItem("token", responseData.accessToken);

      // Set cookie for middleware (24 hours)
      cookieUtils.set("token", responseData.accessToken, 1);

      // Show success toast
      toast({
        title: "Đăng nhập thành công!",
        description: `Chào mừng ${responseData.user.fullName || responseData.user.email}`,
        variant: "default",
      });

      // Redirect to dashboard
      router.push(ROUTES.DASHBOARD.HOME);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Email hoặc mật khẩu không đúng. Vui lòng thử lại.";
      setError(errorMessage);

      // Show error toast
      toast({
        title: "Đăng nhập thất bại",
        description: errorMessage,
        variant: "destructive",
      });

      console.error("Login error:", err);
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
          {/* Modern Logo */}
          <div className="mx-auto w-20 h-20 rounded-2xl flex items-center justify-center bg-gradient-to-br from-primary to-primary/90 shadow-lg p-3">
            <Image
              src="/favicon.png"
              alt="Restaurant Logo"
              width={80}
              height={80}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight">Restaurant Admin</CardTitle>
            <CardDescription className="text-sm mt-2 text-slate-600">
              Đăng nhập để quản lý nhà hàng của bạn
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Nhập email của bạn"
                  {...register("email")}
                  className={`h-11 pl-10 pr-4 border-slate-200 focus:border-primary focus:ring-primary placeholder:text-slate-400 ${
                    errors.email ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""
                  }`}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                Mật khẩu
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  {...register("password")}
                  className={`h-11 pl-10 pr-11 border-slate-200 focus:border-primary focus:ring-primary placeholder:text-slate-400 ${
                    errors.password ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Quên mật khẩu?
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-11 text-sm font-semibold bg-primary hover:bg-primary/90 text-white shadow-sm transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                "Đăng nhập"
              )}
            </Button>

            {/* Register Link */}
            <div className="text-center pt-2">
              <span className="text-sm text-slate-600">Chưa có tài khoản? </span>
              <Link
                href="/register"
                className="text-sm text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                Đăng ký ngay
              </Link>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">© 2024 Restaurant Admin. All rights reserved.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
