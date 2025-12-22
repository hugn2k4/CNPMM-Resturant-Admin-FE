"use client";

import { Sidebar } from "@/components/layout/sidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Navigation Sidebar - Bên trái */}
      <Sidebar />

      {/* Content Area - Bên phải */}
      <main className="flex-1 lg:ml-72">
        {/* Header Space for Mobile Menu */}
        <div className="lg:hidden h-16"></div>

        {/* Main Content */}
        <div className="container max-w-7xl mx-auto py-6 lg:py-8 px-4 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
