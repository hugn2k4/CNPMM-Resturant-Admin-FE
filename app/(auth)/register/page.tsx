"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Eye, EyeOff, Loader2, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const registerSchema = z
  .object({
    fullName: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"form" | "otp">("form"); // Two-step process
  const [registrationEmail, setRegistrationEmail] = useState("");
  const [otp, setOtp] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const { confirmPassword, fullName, ...rest } = data;

      // Split fullName into firstName and lastName
      const nameParts = fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || nameParts[0] || "";

      const registerData = {
        ...rest,
        firstName,
        lastName,
      };

      // Step 1: Send OTP to email
      await authService.sendRegisterOtp(registerData);

      // Show success toast
      toast({
        title: "OTP đã được gửi!",
        description: `Vui lòng kiểm tra email ${data.email}`,
        variant: "default",
      });

      setRegistrationEmail(data.email);
      setStep("otp"); // Move to OTP verification step
    } catch (err: unknown) {
      console.error("Register error:", err);

      // Get specific error message from backend
      let errorMessage = "Đăng ký thất bại. Vui lòng thử lại.";
      if (err && typeof err === "object" && "response" in err) {
        const error = err as { response?: { data?: { message?: string } } };
        const backendMessage = error.response?.data?.message;
        if (backendMessage) {
          // Translate common errors to Vietnamese
          if (backendMessage === "Email already exists") {
            errorMessage = "Email này đã được đăng ký. Vui lòng sử dụng email khác hoặc đăng nhập.";
          } else {
            errorMessage = backendMessage;
          }
        }
      }
      setError(errorMessage);

      // Show error toast
      toast({
        title: "Gửi OTP thất bại",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyOtp = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Step 2: Verify OTP and create account
      const responseData = await authService.verifyRegisterOtp(registrationEmail, otp);

      console.log("Verify OTP response:", responseData);

      // Validate response structure
      if (!responseData || !responseData.user) {
        throw new Error("Invalid response from server");
      }

      // Show success toast
      toast({
        title: "Đăng ký thành công!",
        description: `Tài khoản ${responseData.user.email} đã được tạo. Vui lòng đăng nhập.`,
        variant: "default",
      });

      // Redirect to login page
      router.push("/login");
    } catch (err: unknown) {
      console.error("Register error:", err);

      // Get specific error message from backend
      let errorMessage = "Đăng ký thất bại. Vui lòng thử lại.";
      if (err && typeof err === "object" && "response" in err) {
        const error = err as { response?: { data?: { message?: string } } };
        const backendMessage = error.response?.data?.message;
        if (backendMessage) {
          // Translate common errors to Vietnamese
          if (backendMessage === "Email already exists") {
            errorMessage = "Email này đã được đăng ký. Vui lòng sử dụng email khác hoặc đăng nhập.";
          } else {
            errorMessage = backendMessage;
          }
        }
      }
      setError(errorMessage);

      // Show error toast
      toast({
        title: "Xác thực OTP thất bại",
        description: errorMessage,
        variant: "destructive",
      });
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
            <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight">
              {step === "form" ? "Đăng ký tài khoản" : "Xác thực OTP"}
            </CardTitle>
            <CardDescription className="text-sm mt-2 text-slate-600">
              {step === "form" ? "Tạo tài khoản quản trị mới" : `Nhập mã OTP đã gửi đến ${registrationEmail}`}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          {step === "form" ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium text-slate-700">
                  Họ và tên
                </Label>
                <Input
                  id="fullName"
                  placeholder="Nhập họ và tên đầy đủ"
                  {...register("fullName")}
                  disabled={isLoading}
                  className="h-11 border-slate-200 focus:border-primary focus:ring-primary placeholder:text-slate-400"
                />
                {errors.fullName && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.fullName.message}
                  </p>
                )}
              </div>

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
                    disabled={isLoading}
                    className="h-11 pl-10 pr-4 border-slate-200 focus:border-primary focus:ring-primary placeholder:text-slate-400"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Mật khẩu
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    {...register("password")}
                    disabled={isLoading}
                    className="h-11 pr-11 border-slate-200 focus:border-primary focus:ring-primary placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                  Nhập lại mật khẩu
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  {...register("confirmPassword")}
                  disabled={isLoading}
                  className="h-11 border-slate-200 focus:border-primary focus:ring-primary placeholder:text-slate-400"
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.confirmPassword.message}
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

              <Button
                type="submit"
                className="w-full h-11 text-sm font-semibold bg-[#ff9f0d] hover:bg-[#e68f0c] text-white shadow-sm transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang gửi OTP...
                  </>
                ) : (
                  "Tiếp tục"
                )}
              </Button>

              <div className="text-center pt-2">
                <span className="text-sm text-slate-600">Đã có tài khoản? </span>
                <Link
                  href="/login"
                  className="text-sm text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                  Đăng nhập ngay
                </Link>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-sm font-medium text-slate-700">
                  Mã OTP (6 số)
                </Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="h-12 text-center text-2xl tracking-widest font-bold border-slate-200 focus:border-primary focus:ring-primary placeholder:text-slate-300"
                  maxLength={6}
                  disabled={isLoading}
                />
                <p className="text-xs text-slate-500 text-center">Vui lòng kiểm tra email của bạn</p>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              )}

              <Button
                onClick={onVerifyOtp}
                className="w-full h-11 text-sm font-semibold bg-primary hover:bg-primary/90 text-white shadow-sm transition-all"
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang xác thực...
                  </>
                ) : (
                  "Xác thực và Đăng ký"
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setStep("form");
                  setOtp("");
                  setError(null);
                }}
                className="w-full h-11 border-slate-200 hover:bg-slate-50 text-slate-700"
                disabled={isLoading}
              >
                Quay lại
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
