"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import Card from "@/components/ui/Card";
import { Bell } from "lucide-react";
import {
  fetchNotifications,
  markAllNotificationsRead,
  Notification,
} from "@/lib/api";

export default function NotificationsPage() {
  const [userId, setUserId] = useState<number | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const user = JSON.parse(stored);
      if (user.role === "employee") setUserId(user.id);
    }
  }, []);

  const load = async (id: number) => {
    try {
      setLoading(true);
      const data = await fetchNotifications(id);
      setNotifications(data);
      setError(null);
    } catch {
      setError("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) load(userId);
  }, [userId]);

  const hasUnread = notifications.some((n) => !n.isRead);

  const markAllRead = async () => {
    if (!userId) return;
    try {
      await markAllNotificationsRead(userId);
      load(userId);
    } catch {
      alert("Failed to mark notifications as read.");
    }
  };

  const formatDate = (iso: string) => {
    const date = new Date(iso);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <DashboardShell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-heading">Notifications</h1>
          <p className="text-muted text-sm mt-1 max-w-xl">
            Updates about your welfare recommendations, life events and
            support requests.
          </p>
        </div>
        {hasUnread && (
          <button
            onClick={markAllRead}
            className="text-sm font-medium border border-primary text-primary rounded-lg px-4 h-9 cursor-pointer"
          >
            Mark all as read
          </button>
        )}
      </div>

      {loading && <p className="text-muted text-sm mt-6">Loading notifications…</p>}
      {error && <p className="text-destructive text-sm mt-6">{error}</p>}

      {!loading && !error && notifications.length === 0 && (
        <Card className="mt-6 flex flex-col items-center text-center py-12">
          <div className="bg-beige rounded-full p-4">
            <Bell className="text-muted" size={28} />
          </div>
          <p className="text-heading font-medium mt-4">No notifications yet</p>
          <p className="text-sm text-muted mt-1 max-w-sm">
            Updates about your welfare support will appear here.
          </p>
        </Card>
      )}

      {!loading && !error && notifications.length > 0 && (
        <div className="space-y-3 mt-6">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`rounded-card p-4 flex items-start gap-4 border ${
                !n.isRead ? "bg-primary-light border-accent/40" : "bg-card border-border"
              }`}
            >
              <div
                className={`rounded-full p-2 ${
                  !n.isRead ? "bg-accent text-white" : "bg-beige text-muted"
                }`}
              >
                <Bell size={18} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p
                    className={`text-sm ${
                      !n.isRead ? "font-semibold text-heading" : "font-medium text-heading"
                    }`}
                  >
                    {n.title}
                  </p>
                  {!n.isRead && <span className="w-2 h-2 rounded-full bg-accent" />}
                </div>
                <p className="text-sm text-muted mt-1">{n.message}</p>
                <p className="text-xs text-muted mt-1">{formatDate(n.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}