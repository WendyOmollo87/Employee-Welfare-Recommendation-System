import HRShell from "@/components/layout/HRShell";
import Card from "@/components/ui/Card";

const clusterDistribution = [
  { label: "Early Career", count: 832, color: "bg-primary" },
  { label: "Working Parent", count: 635, color: "bg-accent" },
  { label: "Sandwich Caregiver", count: 448, color: "bg-warning" },
  { label: "Recent Bereavement", count: 85, color: "bg-destructive" },
];

const programUsage = [
  { label: "Financial Assistance", value: 42 },
  { label: "Education Support", value: 31 },
  { label: "Elder Care", value: 22 },
  { label: "Mental Wellbeing", value: 18 },
  { label: "Health Screening", value: 27 },
];

const totalEmployees = clusterDistribution.reduce((sum, c) => sum + c.count, 0);
const maxUsage = Math.max(...programUsage.map((p) => p.value));

export default function HRAnalyticsPage() {
  return (
    <HRShell>
      <div className="bg-primary rounded-card px-8 py-6">
        <h1 className="text-white text-2xl font-bold">Analytics</h1>
        <p className="text-white/90 text-sm mt-2 max-w-xl">
          Snapshot of employee wellbeing across the organization.
        </p>
      </div>

      {/* Cluster distribution */}
      <Card className="mt-6">
        <h2 className="text-heading font-semibold mb-4">
          Employee clusters
        </h2>
        <div className="space-y-4">
          {clusterDistribution.map((c) => {
            const pct = (c.count / totalEmployees) * 100;
            return (
              <div key={c.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-heading font-medium">{c.label}</span>
                  <span className="text-muted">
                    {c.count} ({pct.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-beige h-3 rounded-full overflow-hidden">
                  <div
                    className={`${c.color} h-3`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Program usage */}
      <Card className="mt-6">
        <h2 className="text-heading font-semibold mb-4">
          Program usage (last 30 days)
        </h2>
        <div className="space-y-4">
          {programUsage.map((p) => {
            const pct = (p.value / maxUsage) * 100;
            return (
              <div key={p.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-heading font-medium">{p.label}</span>
                  <span className="text-muted">{p.value}</span>
                </div>
                <div className="w-full bg-beige h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-accent h-3"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <Card>
          <p className="text-2xl font-bold text-heading">{totalEmployees}</p>
          <p className="text-sm font-medium text-heading mt-1">
            Total employees
          </p>
          <p className="text-xs text-muted mt-1">Across all clusters</p>
        </Card>
        <Card>
          <p className="text-2xl font-bold text-destructive">85</p>
          <p className="text-sm font-medium text-heading mt-1">
            In recent bereavement
          </p>
          <p className="text-xs text-muted mt-1">4.3% of workforce</p>
        </Card>
        <Card>
          <p className="text-2xl font-bold text-heading">76%</p>
          <p className="text-sm font-medium text-heading mt-1">
            Program engagement
          </p>
          <p className="text-xs text-muted mt-1">Employees enrolled in at least one</p>
        </Card>
      </div>
    </HRShell>
  );
}