"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Compass,
  FolderOpen,
  LogOut,
  GraduationCap,
  Menu,
  X,
} from "lucide-react";
import type { PublicUser } from "@/lib/types";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/programs", label: "Explore Programs", icon: Compass },
  { href: "/dashboard/documents", label: "Documents", icon: FolderOpen },
];

export default function DashboardShell({
  user,
  children,
}: {
  user: PublicUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-[var(--color-background-alt)]">
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-[var(--color-border-light)] bg-white px-4 py-3 lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary)]">
            <GraduationCap className="h-4 w-4 text-white" />
          </span>
          <span className="font-bold text-[var(--color-primary)]">
            QCS ABROAD
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          className="rounded-md p-2 text-[var(--color-foreground-muted)]"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className="mx-auto flex max-w-7xl">
        {/* Sidebar (desktop) */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-[var(--color-border-light)] bg-white p-5 lg:flex">
          <Link href="/dashboard" className="mb-8 flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary)]">
              <GraduationCap className="h-5 w-5 text-white" />
            </span>
            <span className="text-lg font-bold text-gradient">QCS ABROAD</span>
          </Link>

          <NavItems isActive={isActive} onNavigate={() => setOpen(false)} />

          <div className="mt-auto border-t border-[var(--color-border-light)] pt-4">
            <div className="mb-3 flex items-center gap-3 px-1">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-accent)]/20 text-sm font-semibold text-[var(--color-accent-dark)]">
                {user.firstName.charAt(0)}
                {user.lastName.charAt(0)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[var(--color-foreground)]">
                  {user.firstName} {user.lastName}
                </p>
                <p className="truncate text-xs text-[var(--color-foreground-subtle)]">
                  {user.email}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-foreground-muted)] hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-4.5 w-4.5" />
              Sign out
            </button>
          </div>
        </aside>

        {/* Mobile drawer */}
        {open && (
          <div className="border-b border-[var(--color-border-light)] bg-white p-4 lg:hidden">
            <NavItems isActive={isActive} onNavigate={() => setOpen(false)} />
            <button
              type="button"
              onClick={logout}
              className="mt-3 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4.5 w-4.5" />
              Sign out
            </button>
          </div>
        )}

        {/* Main content */}
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavItems({
  isActive,
  onNavigate,
}: {
  isActive: (href: string) => boolean;
  onNavigate: () => void;
}) {
  return (
    <nav className="space-y-1">
      {NAV.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={onNavigate}
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
            isActive(href)
              ? "bg-[var(--color-primary)] text-white"
              : "text-[var(--color-foreground-muted)] hover:bg-[var(--color-background-muted)] hover:text-[var(--color-primary)]"
          }`}
        >
          <Icon className="h-4.5 w-4.5" />
          {label}
        </Link>
      ))}
    </nav>
  );
}
