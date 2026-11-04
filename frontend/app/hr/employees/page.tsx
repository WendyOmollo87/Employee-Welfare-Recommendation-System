"use client";

import { useState } from "react";
import HRShell from "@/components/layout/HRShell";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Plus, X, Search, ChevronDown } from "lucide-react";

type Employee = {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  employmentType: string;
  dateJoined: string;
  status: string;
};

const departments = ["Operations", "IT", "Finance", "HR", "Marketing"];
const employmentTypes = ["Full-time", "Part-time", "Contract"];
const statuses = ["Active", "Probation", "On leave"];

const statusBadge: Record<string, string> = {
  Active: "bg-accent/10 text-accent",
  Probation: "bg-warning/10 text-warning",
  "On leave": "bg-beige text-muted",
};

const seedEmployees: Employee[] = [
  { id: "EMP00001", name: "James Otieno", email: "james.otieno@northbridge.com", department: "Operations", position: "Logistics Coordinator", employmentType: "Full-time", dateJoined: "2020-03-15", status: "Active" },
  { id: "EMP00002", name: "Mary Wanjiru", email: "mary.wanjiru@northbridge.com", department: "Finance", position: "Accountant", employmentType: "Full-time", dateJoined: "2019-08-01", status: "Active" },
  { id: "EMP00003", name: "Peter Kamau", email: "peter.kamau@northbridge.com", department: "IT", position: "Software Developer", employmentType: "Full-time", dateJoined: "2021-11-20", status: "Active" },
  { id: "EMP00004", name: "Grace Achieng", email: "grace.achieng@northbridge.com", department: "HR", position: "HR Officer", employmentType: "Full-time", dateJoined: "2022-01-10", status: "Active" },
  { id: "EMP00005", name: "David Mensah", email: "david.mensah@northbridge.com", department: "Operations", position: "Logistics Coordinator", employmentType: "Full-time", dateJoined: "2018-05-02", status: "Active" },
  { id: "EMP00006", name: "Faith Njeri", email: "faith.njeri@northbridge.com", department: "Marketing", position: "Content Lead", employmentType: "Part-time", dateJoined: "2023-09-12", status: "Probation" },
];

function StatusDropdown({
  current,
  onChange,
}: {
  current: string;
  onChange: (s: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full ${statusBadge[current]}`}
      >
        {current}
        <ChevronDown size={12} />
      </button>

      {open && (
        <>
          {/* Click-away layer */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-20 min-w-[140px] py-1">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => {
                  onChange(s);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-primary-light ${
                  s === current ? "text-heading font-medium" : "text-muted"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function HREmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(seedEmployees);
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    department: departments[0],
    position: "",
    employmentType: employmentTypes[0],
    dateJoined: "",
  });

  const openAdd = () => {
    setForm({
      name: "",
      email: "",
      department: departments[0],
      position: "",
      employmentType: employmentTypes[0],
      dateJoined: "",
    });
    setModalOpen(true);
  };

  const handleAdd = () => {
    const newEmployee: Employee = {
      id: `EMP${String(employees.length + 1).padStart(5, "0")}`,
      name: form.name,
      email: form.email,
      department: form.department,
      position: form.position,
      employmentType: form.employmentType,
      dateJoined: form.dateJoined || new Date().toISOString().slice(0, 10),
      status: "Probation",
    };
    setEmployees((prev) => [newEmployee, ...prev]);
    setModalOpen(false);
  };

  const updateStatus = (id: string, status: string) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status } : e))
    );
  };

  const visible = employees.filter((e) => {
    const matchDept = deptFilter === "All" || e.department === deptFilter;
    const matchStatus = statusFilter === "All" || e.status === statusFilter;
    const matchSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.id.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase());
    return matchDept && matchStatus && matchSearch;
  });

  return (
    <HRShell>
      <div className="bg-primary rounded-card px-8 py-6 flex items-start justify-between gap-6">
        <div>
          <h1 className="text-white text-2xl font-bold">Employees</h1>
          <p className="text-white/90 text-sm mt-2 max-w-xl">
            {employees.length} employees across {departments.length} departments.
            New employees receive login credentials by email.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="bg-background text-muted text-sm font-medium px-5 h-[45px] rounded-lg whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <Plus size={16} />
          Enroll employee
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mt-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            size={18}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ID, or email"
            className="w-full h-[45px] rounded-lg border border-border bg-card pl-10 pr-4 text-sm outline-none focus:border-primary"
          />
        </div>
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="h-[45px] rounded-lg border border-border bg-card px-4 text-sm outline-none focus:border-primary"
        >
          <option value="All">All departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-[45px] rounded-lg border border-border bg-card px-4 text-sm outline-none focus:border-primary"
        >
          <option value="All">All statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <Card className="mt-6 p-0 overflow-visible">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-beige/50">
              <th className="text-left px-5 py-3 font-medium text-muted">Employee</th>
              <th className="text-left px-5 py-3 font-medium text-muted">Department</th>
              <th className="text-left px-5 py-3 font-medium text-muted">Type</th>
              <th className="text-left px-5 py-3 font-medium text-muted">Joined</th>
              <th className="text-left px-5 py-3 font-medium text-muted">Status</th>
              <th className="text-left px-5 py-3 font-medium text-muted"></th>
            </tr>
          </thead>
          <tbody>
            {visible.map((e) => (
              <tr key={e.id} className="border-b border-border last:border-0">
                <td className="px-5 py-4">
                  <p className="text-heading font-medium">{e.name}</p>
                  <p className="text-xs text-muted">{e.email}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="text-heading">{e.department}</p>
                  <p className="text-xs text-muted">{e.position}</p>
                </td>
                <td className="px-5 py-4 text-heading">{e.employmentType}</td>
                <td className="px-5 py-4 text-muted text-xs">{e.dateJoined}</td>
                <td className="px-5 py-4">
                  <StatusDropdown
                    current={e.status}
                    onChange={(s) => updateStatus(e.id, s)}
                  />
                </td>
                <td className="px-5 py-4">
                  <button className="text-primary text-sm font-medium">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {visible.length === 0 && (
          <p className="text-center text-muted text-sm py-10">
            No employees match your filters.
          </p>
        )}
      </Card>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-card w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 text-muted hover:text-heading"
            >
              <X size={18} />
            </button>
            <h2 className="text-heading font-semibold text-lg">Enroll employee</h2>
            <p className="text-sm text-muted mt-1">
              Enter the employee's details. A temporary password will be sent
              to their email address.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-heading mb-1">
                  Full name
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Jane Wanjiku"
                  className="w-full h-[42px] rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-heading mb-1">
                  Work email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="e.g. jane.wanjiku@northbridge.com"
                  className="w-full h-[42px] rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-heading mb-1">
                    Department
                  </label>
                  <select
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    className="w-full h-[42px] rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary"
                  >
                    {departments.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-heading mb-1">
                    Position
                  </label>
                  <input
                    value={form.position}
                    onChange={(e) => setForm({ ...form, position: e.target.value })}
                    placeholder="e.g. Analyst"
                    className="w-full h-[42px] rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-heading mb-1">
                    Employment type
                  </label>
                  <select
                    value={form.employmentType}
                    onChange={(e) => setForm({ ...form, employmentType: e.target.value })}
                    className="w-full h-[42px] rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary"
                  >
                    {employmentTypes.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-heading mb-1">
                    Date joined
                  </label>
                  <input
                    type="date"
                    value={form.dateJoined}
                    onChange={(e) => setForm({ ...form, dateJoined: e.target.value })}
                    className="w-full h-[42px] rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <div className="bg-primary-light border border-accent/30 rounded-lg p-4 mt-6 flex items-start gap-3">
              <p className="text-xs text-muted">
                The employee will receive a temporary password by email. They
                will be asked to set a new password on first login. Welfare
                information is collected from the employee directly after
                enrollment.
              </p>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setModalOpen(false)}
                className="text-sm font-medium text-muted px-4 h-[42px] rounded-lg border border-border"
              >
                Cancel
              </button>
              <Button onClick={handleAdd}>Enroll employee</Button>
            </div>
          </div>
        </div>
      )}
    </HRShell>
  );
}