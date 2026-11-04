"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Mail, Lock, Eye } from "lucide-react";
import Button from "@/components/ui/Button";
import { login } from "@/lib/api";

const benefits = [
  "Tailored recommendations based on your profile",
  "Report life events and get matched to relief programs",
  "Keep dependents and welfare details up to date",
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      const user = await login(email, password);

      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "hr") {
        router.push("/hr/dashboard");
      } else if (user.mustChangePassword) {
        router.push("/change-password");
      } else if (!user.onboardingComplete) {
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background top-40">
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-center p-12 text-white relative">
        <div className="absolute top-12 left-12 flex items-center gap-2">
          <ShieldCheck size={28} />
          <span className="font-semibold">Welfare Management System</span>
        </div>

        <div className="max-w-md">
          <h1 className="text-3xl font-semibold leading-snug">
            Personalized welfare support for every stage of your life
          </h1>
          <p className="text-white/85 text-sm mt-4">
            Manage your benefits, dependents and life events in one place.
            Our welfare engine surfaces the support programs that matter most
            to you.
          </p>

          <div className="mt-8 space-y-4">
            {benefits.map((text) => (
              <div key={text} className="flex items-start gap-3">
                <span className="bg-white/15 rounded-full p-1.5 mt-0.5">
                  <ShieldCheck size={14} />
                </span>
                <p className="text-sm text-white/90">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[400px]">
          <h2 className="text-[32px] font-semibold text-heading text-center">
            Login
          </h2>
          <p className="text-muted text-center mt-2 text-sm">
            Access your personalized welfare support
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-heading mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                  size={18}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane.doe@company.com"
                  required
                  className="w-full h-[45px] rounded-lg border border-border bg-card pl-10 pr-4 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-heading">
                  Password
                </label>
                <span className="text-sm text-muted">Forgot? Contact HR</span>
              </div>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full h-[45px] rounded-lg border border-border bg-card pl-10 pr-10 text-sm outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
                >
                  <Eye size={18} />
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}

            <Button type="submit" fullWidth disabled={loading}>
              {loading ? "Logging in…" : "Login"}
            </Button>

            <p className="text-xs text-muted text-center">
              First time logging in? You will be asked to set a new password.
            </p>
          </form>

          <div className="mt-6 bg-security rounded-lg p-4 flex items-start gap-3">
            <ShieldCheck className="text-accent mt-0.5" size={18} />
            <p className="text-sm text-muted">
              Your welfare information is securely protected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}