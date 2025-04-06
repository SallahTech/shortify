"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import * as auth from "@/lib/auth";
import { Menu, X } from "lucide-react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated } = auth.useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  if (!isAuthenticated) {
    return null; // or a loading state
  }

  return (
    <div className="flex min-h-screen relative">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-card border rounded-md hover:bg-muted transition-colors"
        aria-label="Toggle menu"
      >
        {isSidebarOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out lg:relative lg:transform-none",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          <div className="flex items-center justify-between pl-2.5 mb-5">
            <Link href="/dashboard" className="flex items-center">
              <span className="self-center text-xl font-semibold whitespace-nowrap text-foreground">
                Shortify
              </span>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-muted rounded-md transition-colors"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <ul className="space-y-2 font-medium">
            <li>
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-foreground hover:bg-muted",
                    isActive("/dashboard") && "bg-muted"
                  )}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Dashboard
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/links">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-foreground hover:bg-muted",
                    isActive("/dashboard/links") && "bg-muted"
                  )}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  My Links
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/analytics">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-foreground hover:bg-muted",
                    isActive("/dashboard/analytics") && "bg-muted"
                  )}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Analytics
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/settings">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-foreground hover:bg-muted",
                    isActive("/dashboard/settings") && "bg-muted"
                  )}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Settings
                </Button>
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background">{children}</main>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
