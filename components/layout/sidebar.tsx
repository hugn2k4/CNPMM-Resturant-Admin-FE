"use client";

import { Button } from "@/components/ui/button";
import { NAVIGATION_ITEMS } from "@/constants/navigation";
import { cookieUtils } from "@/lib/cookies";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";
import { LogOut, Menu, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    // Clear store
    logout();

    // Clear localStorage
    localStorage.removeItem("token");

    // Clear cookie
    cookieUtils.delete("token");

    // Redirect to login
    router.push("/login");
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-primary text-white"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Overlay */}
      {isOpen && <div className="lg:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-72 bg-sidebar border-r border-sidebar-border transition-transform duration-300",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-sidebar-border">
            <Link href="/dashboard" className="flex items-center gap-3 group" onClick={() => setIsOpen(false)}>
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-md">
                <Image
                  src="/logo.svg"
                  alt="Restaurant Logo"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain p-1"
                  priority
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Restaurant Admin</h1>
                <p className="text-xs text-muted-foreground">Quản lý nhà hàng</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {NAVIGATION_ITEMS.map((item) => {
                // Fix: Check if current path matches or starts with item href
                const isActive =
                  pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                        "hover:bg-sidebar-accent group",
                        isActive ? "bg-primary/10 border-l-4 border-primary" : "text-sidebar-foreground"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5 transition-transform group-hover:scale-110",
                          isActive ? "text-foreground" : "text-foreground"
                        )}
                      />
                      <div className="flex-1">
                        <p className={cn("font-medium", isActive ? "text-foreground" : "text-foreground")}>
                          {item.title}
                        </p>
                        {item.description && <p className="text-xs mt-0.5 text-muted-foreground">{item.description}</p>}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Profile & Logout */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-sidebar-accent mb-2">
              <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user?.name || "Admin"}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email || "admin@restaurant.com"}</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
