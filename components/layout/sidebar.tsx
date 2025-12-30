"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NAVIGATION_ITEMS } from "@/constants/navigation";
import { cookieUtils } from "@/lib/cookies";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";
import { ChevronLeft, ChevronRight, LogOut, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
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
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-gradient-to-br from-primary to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30 animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-gradient-to-b from-sidebar to-sidebar/95 border-r border-sidebar-border transition-all duration-300 shadow-xl",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "w-20" : "w-72"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-sidebar-border/50 bg-white/50 backdrop-blur-sm">
            <Link href="/dashboard" className="flex items-center gap-3 group" onClick={() => setIsOpen(false)}>
              <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg group-hover:shadow-xl">
                <Image
                  src="/logo.svg"
                  alt="Restaurant Logo"
                  width={48}
                  height={48}
                  className="w-8 h-8 object-contain brightness-0 invert"
                  priority
                />
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              {!isCollapsed && (
                <div className="animate-in slide-in-from-left duration-300">
                  <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                    Restaurant Admin
                  </h1>
                  <p className="text-xs text-muted-foreground">Quản lý nhà hàng</p>
                </div>
              )}
            </Link>

            {/* Collapse Button - Desktop Only */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex absolute -right-3 top-8 w-6 h-6 bg-primary rounded-full items-center justify-center text-white shadow-md hover:shadow-lg transition-all hover:scale-110"
              aria-label="Toggle sidebar"
            >
              {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
            <ul className="space-y-2">
              {NAVIGATION_ITEMS.map((item, index) => {
                const isActive =
                  pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <li
                    key={item.href}
                    className="animate-in slide-in-from-left duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden",
                        "hover:bg-gradient-to-r hover:from-primary/10 hover:to-orange-500/10",
                        isActive ? "bg-gradient-to-r from-primary/15 to-orange-500/15 shadow-sm" : "hover:shadow-sm"
                      )}
                      title={isCollapsed ? item.title : undefined}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary to-orange-600 rounded-r-full animate-in slide-in-from-left duration-300"></div>
                      )}

                      {/* Icon */}
                      <div
                        className={cn(
                          "flex items-center justify-center transition-all duration-300",
                          isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary",
                          isCollapsed && "mx-auto"
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-5 w-5 transition-all duration-300",
                            "group-hover:scale-110",
                            isActive && "animate-pulse"
                          )}
                          style={{ animationDuration: "2s" }}
                        />
                      </div>

                      {/* Text */}
                      {!isCollapsed && (
                        <div className="flex-1 animate-in slide-in-from-left duration-300">
                          <p
                            className={cn(
                              "font-semibold text-sm transition-colors",
                              isActive ? "text-primary" : "text-foreground group-hover:text-primary"
                            )}
                          >
                            {item.title}
                          </p>
                          {item.description && (
                            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{item.description}</p>
                          )}
                        </div>
                      )}

                      {/* Badge for active */}
                      {!isCollapsed && isActive && (
                        <Badge className="bg-primary/20 text-primary border-primary/30 text-xs animate-in zoom-in duration-300">
                          Active
                        </Badge>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Profile & Logout */}
          <div className="p-4 border-t border-sidebar-border/50 bg-white/30 backdrop-blur-sm">
            {/* User Profile Card */}
            <div
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-br from-primary/10 to-orange-500/10 mb-3 group hover:shadow-md transition-all duration-300 border border-primary/20",
                isCollapsed && "justify-center px-2"
              )}
            >
              <Avatar
                className={cn(
                  "border-2 border-primary/30 group-hover:border-primary transition-colors",
                  isCollapsed ? "w-10 h-10" : "w-11 h-11"
                )}
              >
                <AvatarFallback className="bg-gradient-to-br from-primary to-orange-600 text-white font-bold text-sm">
                  {user?.name?.charAt(0) || "A"}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex-1 min-w-0 animate-in slide-in-from-left duration-300">
                  <p className="text-sm font-bold text-foreground truncate">{user?.name || "Admin User"}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email || "admin@restaurant.com"}</p>
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {user?.role || "Administrator"}
                  </Badge>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <Button
              variant="outline"
              className={cn(
                "w-full gap-2 border-red-200 text-red-600 hover:!bg-red-600 hover:!text-white hover:!border-red-600 transition-all duration-300 group",
                isCollapsed ? "px-2 justify-center" : "justify-start"
              )}
              onClick={handleLogout}
              title={isCollapsed ? "Đăng xuất" : undefined}
            >
              <LogOut className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
              {!isCollapsed && <span className="font-medium">Đăng xuất</span>}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
