const API_URL = "http://localhost:5045/api";

export type WelfareProgram = {
  id: number;
  name: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  eligibility: string;
  coverage: string;
  howToApply: string;
  documents: string;
  contact: string;
  processingTime: string;
  enabled: boolean;
  createdAt: string;
};

export type Employee = {
  id: number;
  fullName: string;
  email: string;
  employeeCode: string;
  department: string;
  position: string;
  employmentType: string;
  dateJoined: string;
  status: string;
  age: number;
  gender: string;
  maritalStatus: string;
  clusterId: number;
  clusterLabel: string;
  mustChangePassword?: boolean;
  onboardingComplete?: boolean;
  createdAt: string;
};

export type Alert = {
  id: number;
  employeeId: number;
  reason: string;
  severity: string;
  createdAt: string;
  resolvedAt: string | null;
  employee: Employee | null;
};

export type WelfareInfo = {
  id: number;
  employeeId: number;
  caregivingResponsibility: number;
  elderlyCareNeed: number;
  educationSupportNeed: number;
  financialDifficulty: number;
  mentalWellbeingConcern: number;
  healthConcern: number;
  bereavementRecent: number;
  divorceRecent: number;
  marriageRecent: number;
  birthRecent: number;
  updatedAt: string;
};

export type LoginResponse = {
  role: "hr" | "employee";
  id: number;
  name: string;
  email: string;
  employeeCode?: string;
  department?: string;
  mustChangePassword?: boolean;
  onboardingComplete?: boolean;
};

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API error ${res.status} on ${path}`);
  return res.json();
}

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error ${res.status} on ${path}`);
  const text = await res.text();
  return text ? JSON.parse(text) : ({} as T);
}

async function apiPut<T>(path: string, body: unknown): Promise<T | null> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error ${res.status} on ${path}`);
  if (res.status === 204) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

async function apiDelete(path: string): Promise<void> {
  const res = await fetch(`${API_URL}${path}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`API error ${res.status} on ${path}`);
}

// Programs
export const fetchPrograms = () => apiGet<WelfareProgram[]>("/programs");
export const fetchProgram = (id: number) => apiGet<WelfareProgram>(`/programs/${id}`);
export const createProgram = (p: Partial<WelfareProgram>) => apiPost<WelfareProgram>("/programs", p);
export const updateProgram = (id: number, p: Partial<WelfareProgram>) => apiPut<WelfareProgram>(`/programs/${id}`, p);
export const deleteProgram = (id: number) => apiDelete(`/programs/${id}`);

// Employees
export const fetchEmployees = () => apiGet<Employee[]>("/employees");
export const fetchEmployee = (id: number) => apiGet<Employee>(`/employees/${id}`);
export const createEmployee = (e: Partial<Employee>) => apiPost<Employee>("/employees", e);
export const updateEmployee = (id: number, e: Partial<Employee>) => apiPut<Employee>(`/employees/${id}`, e);
export const deleteEmployee = (id: number) => apiDelete(`/employees/${id}`);

// Alerts
export const fetchAlerts = () => apiGet<Alert[]>("/alerts");
export const resolveAlert = (id: number) => apiPut<Alert>(`/alerts/${id}/resolve`, {});

// Welfare Info
export const fetchWelfareInfo = (employeeId: number) =>
  apiGet<WelfareInfo>(`/welfareinfo/${employeeId}`);

export async function saveWelfareInfo(
  employeeId: number,
  info: Record<string, unknown>
): Promise<void> {
  const url = `${API_URL}/welfareinfo/${employeeId}`;
  const check = await fetch(url, { cache: "no-store" });

  const payload = JSON.stringify({ ...info, employeeId });

  if (check.ok) {
    // AWAIT the PUT request so the frontend waits for the AI to finish
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: payload,
    });
    if (!res.ok) throw new Error("Failed to update welfare info.");
  } else {
    // AWAIT the POST request
    const res = await fetch(`${API_URL}/welfareinfo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
    });
    if (!res.ok) throw new Error("Failed to create welfare info.");
  }
}

// Auth
export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/employees/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    throw new Error("Invalid email or password.");
  }
  return res.json();
}

export async function changePassword(
  employeeId: number,
  currentPassword: string,
  newPassword: string
): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/employees/${employeeId}/password`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to change password.");
  }
  return res.json();
}

export async function completeOnboarding(employeeId: number): Promise<void> {
  const res = await fetch(`${API_URL}/employees/${employeeId}/onboarding-complete`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    throw new Error("Failed to complete onboarding.");
  }
}

// Dependents
export type Dependent = {
  id: number;
  employeeId: number;
  name: string;
  relationship: string;
  dateOfBirth: string;
  careResponsibilities: string;
};

export const fetchDependents = (employeeId: number) =>
  apiGet<Dependent[]>(`/dependents/employee/${employeeId}`);

export const createDependent = (d: Omit<Dependent, "id">) =>
  apiPost<Dependent>("/dependents", d);

export const updateDependent = (id: number, d: Dependent) =>
  apiPut<Dependent>(`/dependents/${id}`, d);

export const deleteDependent = (id: number) => apiDelete(`/dependents/${id}`);

// Life Events
export type LifeEvent = {
  id: number;
  employeeId: number;
  eventType: string;
  reportedDate: string;
  description: string;
  status: string;
};

export const fetchLifeEvents = (employeeId: number) =>
  apiGet<LifeEvent[]>(`/lifeevents/employee/${employeeId}`);

export const createLifeEvent = (e: Omit<LifeEvent, "id" | "reportedDate" | "status">) =>
  apiPost<LifeEvent>("/lifeevents", e);

// Notifications
export type Notification = {
  id: number;
  employeeId: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export const fetchNotifications = (employeeId: number) =>
  apiGet<Notification[]>(`/notifications/employee/${employeeId}`);

export const createNotification = (n: Omit<Notification, "id" | "createdAt" | "isRead">) =>
  apiPost<Notification>("/notifications", n);

export const markNotificationRead = (id: number) =>
  apiPut<void>(`/notifications/${id}/read`, {});

export const markAllNotificationsRead = (employeeId: number) =>
  apiPut<void>(`/notifications/employee/${employeeId}/read-all`, {});

// Recommendations
export type RecommendedProgram = {
  id: number;
  name: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  eligibility: string;
  coverage: string;
  howToApply: string;
  documents: string;
  contact: string;
  processingTime: string;
  reason: string;
};

export type RecommendationsResponse = {
  cluster: string;
  clusterId: number;
  programs: RecommendedProgram[];
};

export const fetchRecommendations = (employeeId: number) =>
  apiGet<RecommendationsResponse>(`/recommendations/employee/${employeeId}`);