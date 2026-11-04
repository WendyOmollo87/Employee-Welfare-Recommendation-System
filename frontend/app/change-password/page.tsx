"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock } from "lucide-react";
import Button from "@/components/ui/Button";
import { changePassword } from "@/lib/api";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      router.push("/login");
      return;
    }
    const user = JSON.parse(stored);
    if (user.role !== "employee") {
      router.push("/hr/dashboard");
      return;
    }
    if (!user.mustChangePassword) {
      router.push("/dashboard");
      return;
    }
    setUserId(user.id);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (!userId) return;

    try {
      setLoading(true);
      await changePassword(userId, currentPassword, newPassword);

      // Update localStorage so subsequent routing is correct
      const stored = localStorage.getItem("user");
      if (stored) {
        const user = JSON.parse(stored);
        user.mustChangePassword = false;
        localStorage.setItem("user", JSON.stringify(user));
      }

      router.push("/onboarding");
    } catch (err: any) {
      setError(err.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-8">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <ShieldCheck className="text-primary" size={28} />
          <span className="font-semibold text-heading">
            Welfare Management System
          </span>
        </div>

        <div className="bg-card rounded-card border border-border p-8">
          <h1 className="text-2xl font-semibold text-heading text-center">
            Change your password
          </h1>
          <p className="text-muted text-sm text-center mt-2">
            For security, you must set a new password before continuing.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-heading mb-1">
                Temporary password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                  size={18}
                />
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full h-[45px] rounded-lg border border-border bg-card pl-10 pr-4 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-heading mb-1">
                New password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                  size={18}
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-[45px] rounded-lg border border-border bg-card pl-10 pr-4 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-heading mb-1">
                Confirm new password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                  size={18}
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-[45px] rounded-lg border border-border bg-card pl-10 pr-4 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}

            <Button type="submit" fullWidth disabled={loading}>
              {loading ? "Updating…" : "Update password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}