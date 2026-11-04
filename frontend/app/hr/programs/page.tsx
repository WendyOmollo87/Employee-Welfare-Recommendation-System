"use client";

import { useEffect, useState } from "react";
import HRShell from "@/components/layout/HRShell";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Plus, Trash2, X } from "lucide-react";
import {
  fetchPrograms,
  createProgram,
  deleteProgram,
  WelfareProgram,
} from "@/lib/api";

const categories = ["Financial", "Health", "Family", "Wellbeing", "Eldercare", "Career"];

export default function HRProgramsPage() {
  const [programs, setPrograms] = useState<WelfareProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<WelfareProgram | null>(null);

  const [form, setForm] = useState({
    name: "",
    category: categories[0],
    shortDescription: "",
    fullDescription: "",
    eligibility: "",
    coverage: "",
    howToApply: "",
    documents: "",
    contact: "",
    processingTime: "",
  });

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchPrograms();
      setPrograms(data);
      setError(null);
    } catch {
      setError("Failed to load programs from the API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    try {
      await createProgram({ ...form, enabled: true });
      setModalOpen(false);
      setForm({
        name: "", category: categories[0], shortDescription: "",
        fullDescription: "", eligibility: "", coverage: "",
        howToApply: "", documents: "", contact: "", processingTime: "",
      });
      load();
    } catch {
      alert("Failed to create program.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this program?")) return;
    try {
      await deleteProgram(id);
      load();
    } catch {
      alert("Failed to delete program.");
    }
  };

  return (
    <HRShell>
      <div className="bg-primary rounded-card px-8 py-6 flex items-start justify-between gap-6">
        <div>
          <h1 className="text-white text-2xl font-bold">Welfare Programs</h1>
          <p className="text-white/90 text-sm mt-2 max-w-xl">
            Configure the programs your organization offers. Click any program
            to see the full details shown to employees.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-background text-muted text-sm font-medium px-5 h-[45px] rounded-lg whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <Plus size={16} />
          Add program
        </button>
      </div>

      {loading && <p className="text-muted text-sm mt-6">Loading programs…</p>}
      {error && <p className="text-destructive text-sm mt-6">{error}</p>}

      <div className="space-y-3 mt-6">
        {programs.map((p) => (
          <Card
            key={p.id}
            className="flex items-start justify-between gap-4 cursor-pointer hover:border-primary"
            onClick={() => setSelected(p)}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-heading font-medium">{p.name}</p>
                <span className="text-xs bg-beige text-muted px-2 py-0.5 rounded-full">
                  {p.category}
                </span>
                {p.enabled && (
                  <span className="text-xs bg-primary-light text-accent px-2 py-0.5 rounded-full">
                    Enabled
                  </span>
                )}
              </div>
              <p className="text-sm text-muted mt-2">{p.shortDescription}</p>
              <p className="text-xs text-muted mt-2">
                Coverage: {p.coverage} · Processing: {p.processingTime}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(p.id);
              }}
              className="text-muted hover:text-destructive p-2"
            >
              <Trash2 size={16} />
            </button>
          </Card>
        ))}
      </div>

      {/* DETAIL MODAL — HR sees everything the employee sees */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0" onClick={() => setSelected(null)} />
          <div className="bg-card rounded-card w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10">
            <div className="bg-primary rounded-t-card px-8 py-6">
              <button
                onClick={() => setSelected(null)}
                className="absolute right-4 top-4 text-white p-1 z-20"
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
                  Contact:{" "}
                  <span className="text-heading font-medium">{selected.contact}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-card w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-heading font-semibold text-lg">Add program</h2>
            <p className="text-sm text-muted mt-1">
              Every detail here appears on the employee side.
            </p>

            <div className="mt-5 space-y-4">
              {[
                ["name", "Program name"],
                ["shortDescription", "Short description"],
                ["eligibility", "Eligibility"],
                ["coverage", "Coverage"],
                ["contact", "Contact"],
                ["processingTime", "Processing time"],
                ["documents", "Documents required"],
              ].map(([key, label]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-heading mb-1">
                    {label}
                  </label>
                  <input
                    value={(form as any)[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full h-[42px] rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary"
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-heading mb-1">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full h-[42px] rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary"
                >
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-heading mb-1">
                  Full description
                </label>
                <textarea
                  value={form.fullDescription}
                  onChange={(e) => setForm({ ...form, fullDescription: e.target.value })}
                  className="w-full rounded-lg border border-border bg-card p-3 text-sm outline-none focus:border-primary min-h-[90px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-heading mb-1">
                  How to apply
                </label>
                <textarea
                  value={form.howToApply}
                  onChange={(e) => setForm({ ...form, howToApply: e.target.value })}
                  className="w-full rounded-lg border border-border bg-card p-3 text-sm outline-none focus:border-primary min-h-[80px]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setModalOpen(false)}
                className="text-sm font-medium text-muted px-4 h-[42px] rounded-lg border border-border"
              >
                Cancel
              </button>
              <Button onClick={handleCreate}>Add program</Button>
            </div>
          </div>
        </div>
      )}
    </HRShell>
  );
}