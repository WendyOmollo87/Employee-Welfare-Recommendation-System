"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Sparkles,
  HeartHandshake,
  Users,
  Bell,
  User,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { fetchNotifications } from "@/lib/api";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Recommendations", href: "/recommendations", icon: Sparkles },
  { label: "Welfare Information", href: "/welfare-information", icon: HeartHandshake },
  { label: "Dependents", href: "/dependents", icon: Users },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "My Profile", href: "/profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return;

    const user = JSON.parse(stored);
    if (user.role !== "employee") return;

    const load = () => {
      fetchNotifications(user.id)
        .then((data) => setUnreadCount(data.filter((n) => !n.isRead).length))
        .catch(() => setUnreadCount(0));
    };

    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [pathname]);

  return (
    <aside className="w-[250px] h-screen bg-sidebar flex flex-col justify-between fixed left-0 top-0">
      <div>
        <div className="flex items-center gap-2 px-5 py-6">
          <ShieldCheck className="text-primary" size={28} />
          <div>
            <p className="text-[16px] font-bold text-heading leading-tight">
              Welfare Management
            </p>
            <p className="text-[12px] text-muted leading-tight">System</p>
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
                <span className="flex-1">{label}</span>
                {label === "Notifications" && unreadCount > 0 && (
                  <span className="bg-accent text-white text-[11px] font-medium rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
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