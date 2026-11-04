"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  BarChart3,
  Settings,
  LogOut,
  ShieldCheck,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/hr/dashboard", icon: LayoutDashboard },
  { label: "Employees", href: "/hr/employees", icon: Users },
  { label: "Welfare Alerts", href: "/hr/alerts", icon: AlertTriangle },
  { label: "Programs", href: "/hr/programs", icon: Settings },
  { label: "Analytics", href: "/hr/analytics", icon: BarChart3 },
];

export default function HRSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[250px] h-screen bg-sidebar flex flex-col justify-between fixed left-0 top-0">
      <div>
        <div className="flex items-center gap-2 px-5 py-6">
          <ShieldCheck className="text-primary" size={28} />
          <div>
            <p className="text-[16px] font-bold text-heading leading-tight">
              Welfare Management
            </p>
            <p className="text-[12px] text-muted leading-tight">HR Admin</p>
          </div>
        </div>

        <nav className="px-3">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 h-[45px] mb-3 px-3 rounded-active text-sm transition-colors ${
                  isActive
                    ? "bg-sidebar-active text-heading font-medium"
                    : "text-muted hover:bg-primary-light"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <button className="flex items-center gap-3 h-[45px] mx-3 mb-6 px-3 rounded-active text-sm text-muted hover:bg-primary-light">
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}