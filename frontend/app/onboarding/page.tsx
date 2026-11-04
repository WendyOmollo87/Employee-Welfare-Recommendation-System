"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, HeartHandshake, Wallet, CalendarHeart } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { saveWelfareInfo, completeOnboarding } from "@/lib/api";

type Toggle = { key: string; label: string; description: string };
type SeverityItem = {
  key: string;
  label: string;
  description: string;
  levels: string[];
};

const lifeEventToggles: Toggle[] = [
  { key: "bereavementRecent", label: "Recent bereavement", description: "I have lost a family member in the last few months." },
  { key: "divorceRecent", label: "Recent divorce or separation", description: "My marital situation has changed recently." },
  { key: "marriageRecent", label: "Recent marriage", description: "I got married in the last year." },
  { key: "birthRecent", label: "Recent birth or adoption", description: "A new child has joined my household." },
];

const caregivingItems: SeverityItem[] = [
  { key: "caregivingResponsibility", label: "Caregiving responsibilities", description: "How much regular care do you provide for a family member?", levels: ["None", "Occasional", "Significant"] },
  { key: "elderlyCareNeed", label: "Elderly care support", description: "How much support do your elderly dependents require?", levels: ["None", "Occasional", "Significant"] },
  { key: "educationSupportNeed", label: "Education expenses", description: "How much of a financial load are school fees or learning costs?", levels: ["None", "Occasional", "Significant"] },
];

const financialItems: SeverityItem[] = [
  { key: "financialDifficulty", label: "Financial difficulty", description: "How much financial strain are you currently under?", levels: ["None", "Moderate", "Severe"] },
  { key: "mentalWellbeingConcern", label: "Mental wellbeing concern", description: "How much is stress or emotional wellbeing affecting you?", levels: ["None", "Moderate", "Severe"] },
  { key: "healthConcern", label: "Health concern", description: "How much is a health issue affecting your work?", levels: ["None", "Moderate", "Severe"] },
];

function toBinary(level: string) {
  return level === "None" ? 0 : 1;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      router.push("/login");
      return;
    }
    const user = JSON.parse(stored);
    if (user.role !== "employee") {
      router.push("/hr/dashboard");
      return;
    }
    if (user.mustChangePassword) {
      router.push("/change-password");
      return;
    }
    if (user.onboardingComplete) {
      router.push("/dashboard");
      return;
    }
    setUserId(user.id);
  }, [router]);

  const handleSubmit = async () => {
    if (!userId) return;
    setError(null);

    try {
      setSaving(true);

      const payload = {
        employeeId: userId,
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

      await saveWelfareInfo(userId, payload);
      await completeOnboarding(userId);

      const stored = localStorage.getItem("user");
      if (stored) {
        const user = JSON.parse(stored);
        user.onboardingComplete = true;
        localStorage.setItem("user", JSON.stringify(user));
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to save onboarding information.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex items-center gap-2 mb-6">
          <ShieldCheck className="text-primary" size={28} />
          <span className="font-semibold text-heading">
            Welfare Management System
          </span>
        </div>

        <div className="bg-primary rounded-card px-8 py-6 mb-6">
          <h1 className="text-white text-2xl font-bold">Welcome</h1>
          <p className="text-white/90 text-sm mt-2 max-w-2xl">
            Answer these questions once. Your answers determine your
            well-being cluster and personalize the welfare programs
            recommended to you.
          </p>
        </div>

        {/* 1. Life events */}
        <Card className="mb-4">
          <div className="flex items-center gap-2 mb-4">
            <CalendarHeart className="text-warning" size={20} />
            <h2 className="text-heading font-semibold">Life events</h2>
          </div>
          {lifeEventToggles.map((t) => {
            const active = lifeEvents[t.key];
            return (
              <div key={t.key} className="flex items-start justify-between gap-4 py-3 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-heading">{t.label}</p>
                  <p className="text-xs text-muted mt-0.5">{t.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setLifeEvents((p) => ({ ...p, [t.key]: !p[t.key] }))}
                  className={`relative w-11 h-6 rounded-full shrink-0 transition-colors ${active ? "bg-accent" : "bg-beige"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${active ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
            );
          })}
        </Card>

        {/* 2. Caregiving */}
        <Card className="mb-4">
          <div className="flex items-center gap-2 mb-4">
            <HeartHandshake className="text-accent" size={20} />
            <h2 className="text-heading font-semibold">Caregiving</h2>
          </div>
          {caregivingItems.map((item) => (
            <div key={item.key} className="py-4 border-b border-border last:border-0">
              <p className="text-sm font-medium text-heading">{item.label}</p>
              <p className="text-xs text-muted mt-0.5">{item.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {item.levels.map((level) => {
                  const active = caregiving[item.key] === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setCaregiving((p) => ({ ...p, [item.key]: level }))}
                      className={`px-4 h-9 rounded-full text-sm border transition-colors ${
                        active ? "bg-primary text-white border-primary" : "bg-card text-muted border-border hover:border-primary"
                      }`}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </Card>

        {/* 3. Financial & wellbeing */}
        <Card className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Wallet className="text-accent" size={20} />
            <h2 className="text-heading font-semibold">Financial & wellbeing</h2>
          </div>
          {financialItems.map((item) => (
            <div key={item.key} className="py-4 border-b border-border last:border-0">
              <p className="text-sm font-medium text-heading">{item.label}</p>
              <p className="text-xs text-muted mt-0.5">{item.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {item.levels.map((level) => {
                  const active = financial[item.key] === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFinancial((p) => ({ ...p, [item.key]: level }))}
                      className={`px-4 h-9 rounded-full text-sm border transition-colors ${
                        active ? "bg-primary text-white border-primary" : "bg-card text-muted border-border hover:border-primary"
                      }`}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </Card>

        {error && <p className="text-destructive text-sm mb-4">{error}</p>}

        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving…" : "Complete and continue"}
          </Button>
        </div>
      </div>
    </div>
  );
}