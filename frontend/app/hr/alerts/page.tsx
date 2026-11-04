"use client";

import { useState } from "react";
import HRShell from "@/components/layout/HRShell";
import Card from "@/components/ui/Card";
import {
  AlertTriangle,
  Check,
  X,
  Mail,
  Phone,
  Building2,
  Users,
} from "lucide-react";

type Alert = {
  id: string;
  employee: string;
  email: string;
  phone: string;
  department: string;
  cluster: string;
  dependents: number;
  reason: string;
  time: string;
  severity: "high" | "medium";
};

const seedAlerts: Alert[] = [
  {
    id: "1",
    employee: "James Otieno",
    email: "james.otieno@northbridge.com",
    phone: "+254 712 345 678",
    department: "Operations",
    cluster: "Recent Bereavement",
    dependents: 3,
    reason: "Recent bereavement — HR alert within 48 hours",
    time: "2 hours ago",
    severity: "high",
  },
  {
    id: "2",
    employee: "Mary Wanjiru",
    email: "mary.wanjiru@northbridge.com",
    phone: "+254 723 456 789",
    department: "Finance",
    cluster: "Sandwich Caregiver",
    dependents: 4,
    reason: "High dependency + financial strain — financial review",
    time: "1 day ago",
    severity: "high",
  },
  {
    id: "3",
    employee: "Peter Kamau",
    email: "peter.kamau@northbridge.com",
    phone: "+254 734 567 890",
    department: "IT",
    cluster: "Sandwich Caregiver",
    dependents: 3,
    reason: "Elderly care responsibility reported",
    time: "3 days ago",
    severity: "medium",
  },
  {
    id: "4",
    employee: "Grace Achieng",
    email: "grace.achieng@northbridge.com",
    phone: "+254 745 678 901",
    department: "HR",
    cluster: "Working Parent",
    dependents: 2,
    reason: "Caregiver with mental wellbeing concern — well-being check",
    time: "4 days ago",
    severity: "medium",
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="text-xs font-medium text-primary hover:underline"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export default function HRAlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(seedAlerts);
  const [selected, setSelected] = useState<Alert | null>(null);

  const dismiss = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  return (
    <HRShell>
      <div className="bg-primary rounded-card px-8 py-6">
        <h1 className="text-white text-2xl font-bold">Welfare Alerts</h1>
        <p className="text-white/90 text-sm mt-2 max-w-xl">
          {alerts.length} employees need proactive support based on recent
          clustering and reported life events.
        </p>
      </div>

      <div className="space-y-3 mt-6">
        {alerts.map((a) => {
          const high = a.severity === "high";
          return (
            <Card
              key={a.id}
              className={`flex items-start justify-between gap-4 border-l-4 ${
                high ? "border-l-destructive" : "border-l-warning"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`rounded-full p-2 ${
                    high
                      ? "bg-destructive/10 text-destructive"
                      : "bg-warning/10 text-warning"
                  }`}
                >
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <p className="text-heading font-medium">{a.employee}</p>
                  <p className="text-sm text-muted mt-0.5">{a.reason}</p>
                  <p className="text-xs text-muted mt-1">
                    {a.cluster} · {a.department} · {a.time}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => setSelected(a)}
                  className="text-sm font-medium border border-primary text-primary rounded-lg px-4 h-9"
                >
                  Contact
                </button>
                <button
                  onClick={() => dismiss(a.id)}
                  className="text-sm font-medium text-muted border border-border rounded-lg px-3 h-9 hover:bg-beige"
                >
                  <Check size={16} />
                </button>
              </div>
            </Card>
          );
        })}

        {alerts.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-heading font-medium">No active alerts</p>
            <p className="text-sm text-muted mt-1">
              You are up to date with employee wellbeing.
            </p>
          </Card>
        )}
      </div>

      {/* Contact slide-out */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setSelected(null)}
          />

          <div className="relative w-full max-w-md h-full bg-card shadow-xl overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-heading font-semibold text-lg">
                    {selected.employee}
                  </h2>
                  <p className="text-sm text-muted mt-1">
                    {selected.cluster}
                  </p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-muted hover:text-heading p-1"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Alert context */}
              <div
                className={`rounded-lg p-4 mt-6 border ${
                  selected.severity === "high"
                    ? "bg-destructive/5 border-destructive/20"
                    : "bg-warning/5 border-warning/20"
                }`}
              >
                <p className="text-xs font-medium text-muted uppercase tracking-wide">
                  Alert reason
                </p>
                <p className="text-sm text-heading mt-1.5">
                  {selected.reason}
                </p>
                <p className="text-xs text-muted mt-2">
                  Reported {selected.time}
                </p>
              </div>

              {/* Contact details */}
              <h3 className="text-sm font-semibold text-heading mt-6 mb-3">
                Contact details
              </h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3 bg-beige/50 rounded-lg p-3">
                  <Mail size={18} className="text-accent mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-muted">Email</p>
                    <p className="text-sm text-heading break-all">
                      {selected.email}
                    </p>
                  </div>
                  <CopyButton text={selected.email} />
                </div>

                <div className="flex items-start gap-3 bg-beige/50 rounded-lg p-3">
                  <Phone size={18} className="text-accent mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-muted">Phone</p>
                    <p className="text-sm text-heading">{selected.phone}</p>
                  </div>
                  <CopyButton text={selected.phone} />
                </div>

                <div className="flex items-start gap-3 bg-beige/50 rounded-lg p-3">
                  <Building2 size={18} className="text-accent mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-muted">Department</p>
                    <p className="text-sm text-heading">
                      {selected.department}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-beige/50 rounded-lg p-3">
                  <Users size={18} className="text-accent mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-muted">Dependents</p>
                    <p className="text-sm text-heading">
                      {selected.dependents}
                    </p>
                  </div>
                </div>
              </div>

              </div>
            </div>
          </div>
        
      )}
    </HRShell>
  );
}