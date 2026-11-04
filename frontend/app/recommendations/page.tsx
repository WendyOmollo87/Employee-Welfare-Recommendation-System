"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import Card from "@/components/ui/Card";
import { X } from "lucide-react";
import { fetchRecommendations, RecommendedProgram } from "@/lib/api";

const filters = ["All", "Financial", "Health", "Family", "Wellbeing", "Eldercare", "Career"];

export default function RecommendationsPage() {
  const [userId, setUserId] = useState<number | null>(null);
  const [programs, setPrograms] = useState<RecommendedProgram[]>([]);
  const [cluster, setCluster] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selected, setSelected] = useState<RecommendedProgram | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const user = JSON.parse(stored);
      if (user.role === "employee") setUserId(user.id);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetchRecommendations(userId)
      .then((data) => {
        setPrograms(data.programs);
        setCluster(data.cluster);
        setError(null);
      })
      .catch(() => setError("Failed to load recommendations."))
      .finally(() => setLoading(false));
  }, [userId]);

  const visible =
    activeFilter === "All"
      ? programs
      : programs.filter((p) => p.category === activeFilter);

  return (
    <DashboardShell>
      <h1 className="text-2xl font-semibold text-heading">Recommendations</h1>
      <p className="text-muted text-sm mt-1 max-w-2xl">
        Welfare programs personalized to your profile, dependents and
        reported life events.
      </p>

      {!loading && !error && (
        <div className="bg-primary-light border border-accent/30 rounded-lg p-4 mt-6">
          <p className="text-xs text-muted uppercase tracking-wide">
            Your wellbeing cluster
          </p>
          <p className="text-lg font-semibold text-heading mt-1">
            {cluster || "Not yet assigned"}
          </p>
          <p className="text-xs text-muted mt-1">
            Assigned by K-Means clustering based on your dependents, welfare
            flags and life events.
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-6">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 h-9 rounded-full text-sm border cursor-pointer transition-colors ${
              activeFilter === f
                ? "bg-primary text-white border-primary"
                : "bg-card text-muted border-border hover:border-primary"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading && <p className="text-muted text-sm mt-6">Loading recommendations…</p>}
      {error && <p className="text-destructive text-sm mt-6">{error}</p>}

      {!loading && !error && programs.length === 0 && (
        <Card className="mt-6 flex flex-col items-center text-center py-12">
          <p className="text-heading font-medium">No recommendations yet</p>
          <p className="text-sm text-muted mt-1 max-w-sm">
            Complete your welfare information to receive personalized
            recommendations.
          </p>
        </Card>
      )}

      {!loading && !error && programs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {visible.map((p) => (
            <Card key={p.id}>
              <span className="text-xs font-medium text-accent">{p.category}</span>
              <h3 className="text-heading font-semibold mt-3">{p.name}</h3>
              <p className="text-sm text-muted mt-2">{p.shortDescription}</p>
              <p className="text-xs text-muted mt-3 italic">{p.reason}</p>
              <button
                onClick={() => setSelected(p)}
                className="text-primary text-sm font-medium mt-4 cursor-pointer"
              >
                View details →
              </button>
            </Card>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0" onClick={() => setSelected(null)} />
          <div className="bg-card rounded-card w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10">
            <div className="bg-primary rounded-t-card px-8 py-6">
              <button
                onClick={() => setSelected(null)}
                className="absolute right-4 top-4 text-white p-1 z-20 cursor-pointer"
              >
                <X size={24} />
              </button>
              <span className="text-xs font-medium text-white/80 uppercase tracking-wide">
                {selected.category}
              </span>
              <h2 className="text-white text-2xl font-bold mt-2">{selected.name}</h2>
              <p className="text-white/90 text-sm mt-2">{selected.shortDescription}</p>
            </div>

            <div className="p-8 space-y-5">
              <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                <p className="text-sm text-accent font-medium">{selected.reason}</p>
              </div>

              <div>
                <h3 className="text-heading font-semibold mb-2">About this program</h3>
                <p className="text-sm text-muted leading-relaxed">
                  {selected.fullDescription}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-beige/40 rounded-lg p-4">
                  <p className="text-xs text-muted uppercase">Coverage</p>
                  <p className="text-sm text-heading font-medium mt-1">{selected.coverage}</p>
                </div>
                <div className="bg-beige/40 rounded-lg p-4">
                  <p className="text-xs text-muted uppercase">Processing</p>
                  <p className="text-sm text-heading font-medium mt-1">{selected.processingTime}</p>
                </div>
                <div className="bg-beige/40 rounded-lg p-4">
                  <p className="text-xs text-muted uppercase">Eligibility</p>
                  <p className="text-sm text-heading font-medium mt-1">{selected.eligibility}</p>
                </div>
              </div>

              <div>
                <h3 className="text-heading font-semibold mb-2">How to apply</h3>
                <p className="text-sm text-muted leading-relaxed">{selected.howToApply}</p>
              </div>

              <div>
                <h3 className="text-heading font-semibold mb-2">Documents needed</h3>
                <p className="text-sm text-muted">{selected.documents}</p>
              </div>

              <div className="bg-primary-light border border-accent/30 rounded-lg p-4">
                <p className="text-sm text-muted">
                  Contact HR at{" "}
                  <span className="text-heading font-medium">{selected.contact}</span>{" "}
                  for more information. Applications are handled by HR, not through
                  this portal.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}