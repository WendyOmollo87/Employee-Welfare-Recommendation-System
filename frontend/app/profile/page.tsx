"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { LogOut, Check } from "lucide-react";
import { fetchEmployee, updateEmployee, Employee } from "@/lib/api";

export default function ProfilePage() {
  const [userId, setUserId] = useState<number | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    age: "",
    gender: "",
    maritalStatus: "",
  });

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
      const data = await fetchEmployee(id);
      setEmployee(data);
      setForm({
        fullName: data.fullName,
        email: data.email,
        age: String(data.age),
        gender: data.gender,
        maritalStatus: data.maritalStatus,
      });
      setError(null);
    } catch {
      setError("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) load(userId);
  }, [userId]);

  const handleSave = async () => {
    if (!userId || !employee) return;

    try {
      setSaving(true);
      await updateEmployee(userId, {
        ...employee,
        fullName: form.fullName,
        email: form.email,
        age: Number(form.age),
        gender: form.gender,
        maritalStatus: form.maritalStatus,
      });

      // Keep localStorage in sync so other pages show the new name
      const stored = localStorage.getItem("user");
      if (stored) {
        const user = JSON.parse(stored);
        user.name = form.fullName;
        user.email = form.email;
        localStorage.setItem("user", JSON.stringify(user));
      }

      setEditing(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
      load(userId);
    } catch {
      alert("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const initials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  if (loading) {
    return (
      <DashboardShell>
        <p className="text-muted text-sm">Loading profile…</p>
      </DashboardShell>
    );
  }

  if (error || !employee) {
    return (
      <DashboardShell>
        <p className="text-destructive text-sm">{error || "Profile not found."}</p>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-heading">My Profile</h1>
          <p className="text-muted text-sm mt-1">
            Manage your personal and employment details.
          </p>
        </div>
        {editing ? (
          <div className="flex gap-3">
            <button
              onClick={() => {
                setEditing(false);
                setForm({
                  fullName: employee.fullName,
                  email: employee.email,
                  age: String(employee.age),
                  gender: employee.gender,
                  maritalStatus: employee.maritalStatus,
                });
              }}
              className="text-sm font-medium text-muted px-4 h-[42px] rounded-lg border border-border cursor-pointer"
            >
              Cancel
            </button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </div>
        ) : (
          <Button onClick={() => setEditing(true)}>Edit profile</Button>
        )}
      </div>

      <Card className="mt-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-xl font-semibold">
          {initials(employee.fullName)}
        </div>
        <div>
          <p className="text-heading font-semibold text-lg">{employee.fullName}</p>
          <p className="text-sm text-muted">
            {employee.position} · {employee.department}
          </p>
          <p className="text-xs text-muted mt-1">
            Employee ID: {employee.employeeCode}
          </p>
        </div>
      </Card>

      <Card className="mt-6">
        <h2 className="text-heading font-semibold mb-4">Personal information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-heading mb-1">
              Full name
            </label>
            {editing ? (
              <input
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full h-[42px] rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary"
              />
            ) : (
              <div className="w-full h-[42px] rounded-lg bg-beige px-3 flex items-center text-sm text-heading">
                {form.fullName}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-heading mb-1">
              Email
            </label>
            {editing ? (
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full h-[42px] rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary"
              />
            ) : (
              <div className="w-full h-[42px] rounded-lg bg-beige px-3 flex items-center text-sm text-heading">
                {form.email}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-heading mb-1">
              Age
            </label>
            {editing ? (
              <input
                type="number"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                className="w-full h-[42px] rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary"
              />
            ) : (
              <div className="w-full h-[42px] rounded-lg bg-beige px-3 flex items-center text-sm text-heading">
                {form.age}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-heading mb-1">
              Gender
            </label>
            {editing ? (
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="w-full h-[42px] rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary cursor-pointer"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Prefer not to say</option>
              </select>
            ) : (
              <div className="w-full h-[42px] rounded-lg bg-beige px-3 flex items-center text-sm text-heading">
                {form.gender}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-heading mb-1">
              Marital status
            </label>
            {editing ? (
              <select
                value={form.maritalStatus}
                onChange={(e) => setForm({ ...form, maritalStatus: e.target.value })}
                className="w-full h-[42px] rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary cursor-pointer"
              >
                <option>Single</option>
                <option>Married</option>
                <option>Divorced</option>
                <option>Widowed</option>
              </select>
            ) : (
              <div className="w-full h-[42px] rounded-lg bg-beige px-3 flex items-center text-sm text-heading">
                {form.maritalStatus}
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card className="mt-6">
        <h2 className="text-heading font-semibold mb-4">Employment details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-heading mb-1">
              Department
            </label>
            <div className="w-full h-[42px] rounded-lg bg-beige px-3 flex items-center text-sm text-heading">
              {employee.department}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-heading mb-1">
              Position
            </label>
            <div className="w-full h-[42px] rounded-lg bg-beige px-3 flex items-center text-sm text-heading">
              {employee.position}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-heading mb-1">
              Employee ID
            </label>
            <div className="w-full h-[42px] rounded-lg bg-beige px-3 flex items-center text-sm text-muted">
              {employee.employeeCode}
            </div>
          </div>
        </div>
      </Card>

      <Card className="mt-6">
        <h2 className="text-heading font-semibold mb-4">Account</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-heading">
            <span className="text-muted">Email</span>
            <span>{employee.email}</span>
          </div>
          <div className="flex justify-between text-heading">
            <span className="text-muted">Signed in as</span>
            <span>{employee.fullName}</span>
          </div>
        </div>
        <p className="text-xs text-muted mt-4">
          Your welfare data is encrypted and only accessible to authorized
          welfare administrators.
        </p>
        <button className="flex items-center gap-2 text-sm font-medium text-destructive border border-destructive/40 rounded-lg px-4 h-9 mt-4 cursor-pointer">
          <LogOut size={16} />
          Logout
        </button>
      </Card>

      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-card border border-accent/40 rounded-card shadow-lg p-4 flex items-start gap-3 max-w-sm">
          <div className="bg-accent/10 rounded-full p-2">
            <Check className="text-accent" size={18} />
          </div>
          <div>
            <p className="text-sm font-medium text-heading">Profile updated</p>
            <p className="text-xs text-muted mt-0.5">
              Your changes have been saved.
            </p>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}