"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Users, Pencil, Trash2, X } from "lucide-react";
import {
  fetchDependents,
  createDependent,
  updateDependent,
  deleteDependent,
  Dependent,
} from "@/lib/api";

const relationships = ["Child", "Parent", "Spouse", "In-law"];

function calculateAge(dob: string) {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export default function DependentsPage() {
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [dependents, setDependents] = useState<Dependent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "",
    relationship: relationships[0],
    dob: "",
    care: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const user = JSON.parse(stored);
      if (user.role === "employee") setEmployeeId(user.id);
    }
  }, []);

  const load = async (id: number) => {
    try {
      setLoading(true);
      const data = await fetchDependents(id);
      setDependents(data);
      setError(null);
    } catch {
      setError("Failed to load dependents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employeeId) load(employeeId);
  }, [employeeId]);

  const openAddModal = () => {
    setEditingId(null);
    setForm({ name: "", relationship: relationships[0], dob: "", care: "" });
    setModalOpen(true);
  };

  const openEditModal = (dep: Dependent) => {
    setEditingId(dep.id);
    setForm({
      name: dep.name,
      relationship: dep.relationship,
      dob: dep.dateOfBirth.slice(0, 10),
      care: dep.careResponsibilities,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!employeeId) return;

    try {
      if (editingId) {
        await updateDependent(editingId, {
          id: editingId,
          employeeId,
          name: form.name,
          relationship: form.relationship,
          dateOfBirth: form.dob,
          careResponsibilities: form.care,
        });
      } else {
        await createDependent({
          employeeId,
          name: form.name,
          relationship: form.relationship,
          dateOfBirth: form.dob,
          careResponsibilities: form.care,
        });
      }
      setModalOpen(false);
      load(employeeId);
    } catch {
      alert("Failed to save dependent.");
    }
  };

  const handleRemove = async (id: number) => {
    if (!employeeId) return;
    try {
      await deleteDependent(id);
      load(employeeId);
    } catch {
      alert("Failed to remove dependent.");
    }
  };

  const counts = {
    children: dependents.filter((d) => d.relationship === "Child").length,
    elderly: dependents.filter((d) => d.relationship === "Parent" || d.relationship === "In-law").length,
    total: dependents.length,
  };

  return (
    <DashboardShell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-heading">Dependents</h1>
          <p className="text-muted text-sm mt-1 max-w-xl">
            People who depend on you financially or for care. Keeping this
            accurate improves your recommendations.
          </p>
        </div>
        <Button onClick={openAddModal}>Add dependent</Button>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <Card>
          <p className="text-2xl font-bold text-heading">{counts.children}</p>
          <p className="text-sm font-medium text-heading mt-1">Children</p>
          <p className="text-xs text-muted mt-1">Registered as Child</p>
        </Card>
        <Card>
          <p className="text-2xl font-bold text-heading">{counts.elderly}</p>
          <p className="text-sm font-medium text-heading mt-1">Elderly</p>
          <p className="text-xs text-muted mt-1">Parents and in-laws</p>
        </Card>
        <Card>
          <p className="text-2xl font-bold text-heading">{counts.total}</p>
          <p className="text-sm font-medium text-heading mt-1">Total</p>
          <p className="text-xs text-muted mt-1">All dependents</p>
        </Card>
      </div>

      {loading && <p className="text-muted text-sm mt-6">Loading dependents…</p>}
      {error && <p className="text-destructive text-sm mt-6">{error}</p>}

      {!loading && !error && dependents.length === 0 && (
        <Card className="mt-6 flex flex-col items-center text-center py-12">
          <div className="bg-beige rounded-full p-4">
            <Users className="text-muted" size={28} />
          </div>
          <p className="text-heading font-medium mt-4">No dependents added yet</p>
          <p className="text-sm text-muted mt-1 max-w-sm">
            Add your dependents to unlock family and care-related support.
          </p>
          <button
            onClick={openAddModal}
            className="mt-4 text-sm font-medium border border-primary text-primary rounded-lg px-4 h-9"
          >
            Add your first dependent
          </button>
        </Card>
      )}

      {!loading && !error && dependents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {dependents.map((dep) => (
            <Card key={dep.id}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-light text-accent flex items-center justify-center font-semibold text-sm">
                    {initials(dep.name)}
                  </div>
                  <div>
                    <p className="text-heading font-medium">{dep.name}</p>
                    <span className="text-xs bg-beige text-muted px-2 py-0.5 rounded-full">
                      {dep.relationship}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(dep)}
                    className="text-muted hover:text-primary"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleRemove(dep.id)}
                    className="text-muted hover:text-destructive"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-muted mt-3">
                Age {calculateAge(dep.dateOfBirth)}
              </p>
              <p className="text-sm text-heading mt-1">{dep.careResponsibilities}</p>
            </Card>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-card w-full max-w-md p-6 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 text-muted hover:text-heading"
            >
              <X size={18} />
            </button>
            <h2 className="text-heading font-semibold text-lg">
              {editingId ? "Edit dependent" : "Add dependent"}
            </h2>
            <p className="text-sm text-muted mt-1">
              Provide details about the person who depends on you.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-heading mb-1">
                  Full name
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full h-[42px] rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-heading mb-1">
                  Relationship
                </label>
                <select
                  value={form.relationship}
                  onChange={(e) => setForm({ ...form, relationship: e.target.value })}
                  className="w-full h-[42px] rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary"
                >
                  {relationships.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-heading mb-1">
                  Date of birth
                </label>
                <input
                  type="date"
                  value={form.dob}
                  onChange={(e) => setForm({ ...form, dob: e.target.value })}
                  className="w-full h-[42px] rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-heading mb-1">
                  Care responsibilities
                </label>
                <input
                  value={form.care}
                  onChange={(e) => setForm({ ...form, care: e.target.value })}
                  placeholder="e.g. School expenses, medical support"
                  className="w-full h-[42px] rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary"
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
              <Button onClick={handleSave}>
                {editingId ? "Save changes" : "Add dependent"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}