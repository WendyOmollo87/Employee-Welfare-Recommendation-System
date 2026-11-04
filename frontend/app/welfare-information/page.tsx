"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { ShieldCheck, HeartHandshake, Wallet, CalendarHeart, X, Check } from "lucide-react";
import {
  fetchWelfareInfo,
  saveWelfareInfo,
  fetchLifeEvents,
  createLifeEvent,
  LifeEvent,
} from "@/lib/api";

type SeverityItem = {
  key: string;
  label: string;
  description: string;
  levels: string[];
};

const lifeEventTypes = [
  "Bereavement",
  "Birth of child",
  "Marriage",
  "Divorce",
  "Elderly care started",
  "Financial hardship",
  "Health issue",
  "Other",
];

const caregivingItems: SeverityItem[] = [
  {
    key: "caregivingResponsibility",
    label: "Caregiving responsibilities",
    description: "How much regular care do you provide for a family member?",
    levels: ["None", "Occasional", "Significant"],
  },
  {
    key: "elderlyCareNeed",
    label: "Elderly care support",
    description: "How much support do your elderly dependents require?",
    levels: ["None", "Occasional", "Significant"],
  },
  {
    key: "educationSupportNeed",
    label: "Education expenses",
    description: "How much of a financial load are school fees or learning costs?",
    levels: ["None", "Occasional", "Significant"],
  },
];

const financialItems: SeverityItem[] = [
  {
    key: "financialDifficulty",
    label: "Financial difficulty",
    description: "How much financial strain are you currently under?",
    levels: ["None", "Moderate", "Severe"],
  },
  {
    key: "mentalWellbeingConcern",
    label: "Mental wellbeing concern",
    description: "How much is stress or emotional wellbeing affecting you?",
    levels: ["None", "Moderate", "Severe"],
  },
  {
    key: "healthConcern",
    label: "Health concern",
    description: "How much is a health issue affecting your work?",
    levels: ["None", "Moderate", "Severe"],
  },
];

const lifeEventToggles = [
  { key: "bereavementRecent", label: "Recent bereavement", description: "I have lost a family member in the last few months." },
  { key: "divorceRecent", label: "Recent divorce or separation", description: "My marital situation has changed recently." },
  { key: "marriageRecent", label: "Recent marriage", description: "I got married in the last year." },
  { key: "birthRecent", label: "Recent birth or adoption", description: "A new child has joined my household." },
];

function toBinary(level: string) {
  return level === "None" ? 0 : 1;
}

export default function WelfareInformationPage() {
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  const [lifeEvents, setLifeEvents] = useState<Record<string, boolean>>({
    bereavementRecent: false,
    divorceRecent: false,
    marriageRecent: false,
    birthRecent: false,
  });

  const [caregiving, setCaregiving] = useState<Record<string, string>>({
    caregivingResponsibility: "None",
    elderlyCareNeed: "None",
    educationSupportNeed: "None",
  });

  const [financial, setFinancial] = useState<Record<string, string>>({
    financialDifficulty: "None",
    mentalWellbeingConcern: "None",
    healthConcern: "None",
  });

  const [lifeEventsList, setLifeEventsList] = useState<LifeEvent[]>([]);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [eventForm, setEventForm] = useState({
    eventType: lifeEventTypes[0],
    description: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const user = JSON.parse(stored);
      if (user.role === "employee") setUserId(user.id);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    (async () => {
      try {
        setLoading(true);

        const info = await fetchWelfareInfo(userId).catch(() => null);
        if (info) {
          setCaregiving({
            caregivingResponsibility: info.caregivingResponsibility === 1 ? "Occasional" : "None",
            elderlyCareNeed: info.elderlyCareNeed === 1 ? "Occasional" : "None",
            educationSupportNeed: info.educationSupportNeed === 1 ? "Occasional" : "None",
          });
          setFinancial({
            financialDifficulty: info.financialDifficulty === 1 ? "Moderate" : "None",
            mentalWellbeingConcern: info.mentalWellbeingConcern === 1 ? "Moderate" : "None",
            healthConcern: info.healthConcern === 1 ? "Moderate" : "None",
          });
          setLifeEvents({
            bereavementRecent: info.bereavementRecent === 1,
            divorceRecent: info.divorceRecent === 1,
            marriageRecent: info.marriageRecent === 1,
            birthRecent: info.birthRecent === 1,
          });
        }

        const events = await fetchLifeEvents(userId).catch(() => []);
        setLifeEventsList(events);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const toggleLifeEvent = (key: string) => {
    setLifeEvents((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const setCaregivingLevel = (key: string, level: string) => {
    setCaregiving((prev) => ({ ...prev, [key]: level }));
  };

  const setFinancialLevel = (key: string, level: string) => {
    setFinancial((prev) => ({ ...prev, [key]: level }));
  };

  const handleSave = async () => {
    if (!userId) return;

    const payload = {
      caregivingResponsibility: toBinary(caregiving.caregivingResponsibility),
      elderlyCareNeed: toBinary(caregiving.elderlyCareNeed),
      educationSupportNeed: toBinary(caregiving.educationSupportNeed),
      financialDifficulty: toBinary(financial.financialDifficulty),
      mentalWellbeingConcern: toBinary(financial.mentalWellbeingConcern),
      healthConcern: toBinary(financial.healthConcern),
      bereavementRecent: lifeEvents.bereavementRecent ? 1 : 0,
      divorceRecent: lifeEvents.divorceRecent ? 1 : 0,
      marriageRecent: lifeEvents.marriageRecent ? 1 : 0,
      birthRecent: lifeEvents.birthRecent ? 1 : 0,
    };

    try {
      await saveWelfareInfo(userId, payload);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } catch {
      alert("Failed to save welfare information.");
    }
  };

  const handleSaveLifeEvent = async () => {
    if (!userId) return;
    try {
      await createLifeEvent({
        employeeId: userId,
        eventType: eventForm.eventType,
        description: eventForm.description,
      });
      setEventModalOpen(false);
      setEventForm({ eventType: lifeEventTypes[0], description: "" });
      const updated = await fetchLifeEvents(userId);
      setLifeEventsList(updated);
    } catch {
      alert("Failed to report life event.");
    }
  };

  const renderToggle = (item: { key: string; label: string; description: string }) => {
    const active = lifeEvents[item.key];
    return (
      <div key={item.key} className="flex items-start justify-between gap-4 py-3 border-b border-border last:border-0">
        <div>
          <p className="text-sm font-medium text-heading">{item.label}</p>
          <p className="text-xs text-muted mt-0.5">{item.description}</p>
        </div>
        <button
          type="button"
          onClick={() => toggleLifeEvent(item.key)}
          className={`relative w-11 h-6 rounded-full shrink-0 cursor-pointer transition-colors ${active ? "bg-accent" : "bg-beige"}`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${active ? "translate-x-5" : "translate-x-0"}`}
          />
        </button>
      </div>
    );
  };

  const renderSeverity = (
    item: SeverityItem,
    store: Record<string, string>,
    update: (key: string, level: string) => void
  ) => {
    const current = store[item.key];
    return (
      <div key={item.key} className="py-4 border-b border-border last:border-0">
        <p className="text-sm font-medium text-heading">{item.label}</p>
        <p className="text-xs text-muted mt-0.5">{item.description}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {item.levels.map((level) => {
            const active = current === level;
            return (
              <button
                key={level}
                type="button"
                onClick={() => update(item.key, level)}
                className={`px-4 h-9 rounded-full text-sm border cursor-pointer transition-colors ${
                  active ? "bg-primary text-white border-primary" : "bg-card text-muted border-border hover:border-primary"
                }`}
              >
                {level}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <DashboardShell>
      <h1 className="text-2xl font-semibold text-heading">Welfare Information</h1>
      <p className="text-muted text-sm mt-1 max-w-2xl">
        This information powers your personalized welfare recommendations.
        Update it whenever your circumstances change.
      </p>

      <div className="bg-primary-light border border-accent/30 rounded-lg p-4 mt-6 flex items-start gap-3">
        <ShieldCheck className="text-accent mt-0.5" size={18} />
        <p className="text-sm text-muted">
          Keeping this information up to date helps us match you with the
          right support.
        </p>
      </div>

      {loading && <p className="text-muted text-sm mt-6">Loading welfare information…</p>}

      {!loading && (
        <>
          <Card className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <CalendarHeart className="text-warning" size={20} />
              <h2 className="text-heading font-semibold">Life events</h2>
            </div>
            <p className="text-sm text-muted mb-2">
              If something significant has happened recently, tell us so we can
              update your support programs.
            </p>
            {lifeEventToggles.map(renderToggle)}
          </Card>

          <Card className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <HeartHandshake className="text-accent" size={20} />
              <h2 className="text-heading font-semibold">Caregiving & dependents</h2>
            </div>
            <p className="text-sm text-muted">
              How much do the following apply to you right now?
            </p>
            {caregivingItems.map((item) => renderSeverity(item, caregiving, setCaregivingLevel))}
          </Card>

          <Card className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="text-accent" size={20} />
              <h2 className="text-heading font-semibold">Financial & wellbeing</h2>
            </div>
            <p className="text-sm text-muted">
              How much are the following affecting you right now?
            </p>
            {financialItems.map((item) => renderSeverity(item, financial, setFinancialLevel))}
          </Card>

         

          {/* Save button — after all cards, right-aligned */}
             <div className="mt-8 flex justify-center">
            <Button onClick={handleSave}>Save welfare information</Button>
          </div>
        </>
      )}

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-card border border-accent/40 rounded-card shadow-lg p-4 flex items-start gap-3 max-w-sm">
          <div className="bg-accent/10 rounded-full p-2">
            <Check className="text-accent" size={18} />
          </div>
          <div>
            <p className="text-sm font-medium text-heading">Changes saved</p>
            <p className="text-xs text-muted mt-0.5">
              Your welfare information has been updated. Recommendations will refresh based on these changes.
            </p>
          </div>
        </div>
      )}

      {eventModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-card w-full max-w-md p-6 relative">
            <button
              onClick={() => setEventModalOpen(false)}
              className="absolute right-4 top-4 text-muted hover:text-heading cursor-pointer"
            >
              <X size={18} />
            </button>
            <h2 className="text-heading font-semibold text-lg">Report a life event</h2>
            <p className="text-sm text-muted mt-1">
              Tell us what has changed. HR will be notified.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-heading mb-1">
                  Event type
                </label>
                <select
                  value={eventForm.eventType}
                  onChange={(e) => setEventForm({ ...eventForm, eventType: e.target.value })}
                  className="w-full h-[42px] rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary cursor-pointer"
                >
                  {lifeEventTypes.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-heading mb-1">
                  Description
                </label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  className="w-full rounded-lg border border-border bg-card p-3 text-sm outline-none focus:border-primary min-h-[90px]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEventModalOpen(false)}
                className="text-sm font-medium text-muted px-4 h-[42px] rounded-lg border border-border cursor-pointer"
              >
                Cancel
              </button>
              <Button onClick={handleSaveLifeEvent}>Submit</Button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}