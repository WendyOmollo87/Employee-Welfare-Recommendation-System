import HRShell from "@/components/layout/HRShell";
import Card from "@/components/ui/Card";
import { Users, AlertTriangle, HeartHandshake, TrendingUp } from "lucide-react";

const stats = [
  { label: "Total employees", value: 142, sub: "Across all departments", icon: Users, tone: "text-accent" },
  { label: "Active alerts", value: 5, sub: "Need HR attention", icon: AlertTriangle, tone: "text-warning" },
  { label: "Programs utilized", value: 8, sub: "Out of 12 available", icon: HeartHandshake, tone: "text-accent" },
  { label: "Avg. engagement", value: "76%", sub: "Program participation", icon: TrendingUp, tone: "text-accent" },
];

const clusterOverview = [
  { name: "High support need", count: 18, tone: "bg-destructive/10 text-destructive" },
  { name: "Moderate support need", count: 46, tone: "bg-warning/10 text-warning" },
  { name: "Low support need", count: 78, tone: "bg-accent/10 text-accent" },
];

const recentAlerts = [
  { employee: "James Otieno", reason: "Reported bereavement", time: "2 hours ago" },
  { employee: "Mary Wanjiru", reason: "High financial responsibility + new dependent", time: "1 day ago" },
  { employee: "Peter Kamau", reason: "Elderly care responsibility reported", time: "3 days ago" },
];

export default function HRDashboardPage() {
  return (
    <HRShell>
      <div className="bg-primary rounded-card px-8 py-6">
        <h1 className="text-white text-2xl font-bold">Welcome back, Sarah</h1>
        <p className="text-white/90 text-sm mt-2 max-w-xl">
          5 employees currently need proactive support based on recent
          clustering and reported life events.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4 mt-6">
        {stats.map(({ label, value, sub, icon: Icon, tone }) => (
          <Card key={label}>
            <Icon className={`${tone} mb-3`} size={20} />
            <p className="text-2xl font-bold text-heading">{value}</p>
            <p className="text-sm font-medium text-heading mt-1">{label}</p>
            <p className="text-xs text-muted mt-1">{sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mt-8">
        <Card className="col-span-1">
          <h3 className="text-heading font-semibold mb-4">Employee clusters</h3>
          <div className="space-y-3">
            {clusterOverview.map(({ name, count, tone }) => (
              <div key={name} className="flex items-center justify-between">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${tone}`}>
                  {name}
                </span>
                <span className="text-sm font-semibold text-heading">{count}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="col-span-2">
          <h3 className="text-heading font-semibold mb-4">Recent alerts</h3>
          <div className="space-y-4">
            {recentAlerts.map(({ employee, reason, time }) => (
              <div key={employee} className="flex items-center justify-between border-b border-border last:border-0 pb-3 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-heading">{employee}</p>
                  <p className="text-xs text-muted mt-0.5">{reason}</p>
                </div>
                <span className="text-xs text-muted">{time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </HRShell>
  );
}