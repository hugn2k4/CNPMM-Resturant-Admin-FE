"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/constants/routes";
import { cookieUtils } from "@/lib/cookies";
import { useAuthStore } from "@/stores/auth.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ChefHat, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
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

      // Mock login - sẽ thay bằng API thật sau
      // Giả lập delay như gọi API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Set mock user data
      useAuthStore.setState({
        user: {
          id: "1",
          email: data.email,
          name: "Admin User",
          role: "admin",
        },
        token: "mock-jwt-token",
        isAuthenticated: true,
      });

      // Save token to both localStorage and cookies
      localStorage.setItem("token", "mock-jwt-token");

      // Set cookie for middleware (24 hours)
      cookieUtils.set("token", "mock-jwt-token", 1);

      // Redirect to dashboard
      router.push(ROUTES.DASHBOARD.HOME);
    } catch (err: unknown) {
      setError("Email hoặc mật khẩu không đúng. Vui lòng thử lại.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-green-50 p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-200/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <Card className="w-full max-w-md shadow-2xl border-primary/20 backdrop-blur-sm bg-white/90 relative z-10 animate-in zoom-in duration-500">
        <CardHeader className="space-y-4 text-center pb-8">
          {/* Logo with animation */}
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-orange-600 rounded-2xl flex items-center justify-center shadow-lg animate-in zoom-in duration-700 hover:scale-110 transition-transform">
            <ChefHat className="w-12 h-12 text-white animate-bounce" style={{ animationDuration: '2s' }} />
          </div>
          <div className="animate-in slide-in-from-top duration-700" style={{ animationDelay: '200ms' }}>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
              Restaurant Admin
            </CardTitle>
            <CardDescription className="text-base mt-3 text-muted-foreground">
              Đăng nhập vào hệ thống quản lý nhà hàng
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="animate-in slide-in-from-bottom duration-700" style={{ animationDelay: '300ms' }}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                Email
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@restaurant.com"
                  {...register("email")}
                  className={`h-12 pl-4 pr-4 transition-all ${
                    errors.email 
                      ? 'border-destructive focus-visible:ring-destructive' 
                      : 'focus-visible:ring-primary'
                  }`}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive flex items-center gap-1 animate-in slide-in-from-top duration-300">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" />
                Mật khẩu
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className={`h-12 pl-4 pr-12 transition-all ${
                    errors.password 
                      ? 'border-destructive focus-visible:ring-destructive' 
                      : 'focus-visible:ring-primary'
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive flex items-center gap-1 animate-in slide-in-from-top duration-300">
                  <AlertCircle className="h-3 w-3" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 animate-in slide-in-from-top duration-300">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-destructive font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-600/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-5 w-5" />
                  Đăng nhập
                </>
              )}
            </Button>
          </form>

          {/* Demo Account Info */}
          <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm font-medium text-center mb-2">Tài khoản demo</p>
            <div className="space-y-1 text-sm text-muted-foreground text-center">
              <p className="font-mono">Email: admin@restaurant.com</p>
              <p className="font-mono">Password: admin123</p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              © 2024 Restaurant Admin. All rights reserved.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
