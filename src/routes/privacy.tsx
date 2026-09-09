import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AppShell } from "@/components/AppShell";
import { btnGhost, Chip, Explain, PageHeader, Panel } from "@/components/ui-kit";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy & data controls — SkillBridge AI" },
      { name: "description", content: "Control recruiter visibility, resume and evidence sharing, export your data or delete your portfolio." },
      { property: "og:title", content: "Privacy & data controls — SkillBridge AI" },
      { property: "og:description", content: "You decide who sees your evidence and profile." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const { student, updateProfile, exportMyData, clearMyData, state } = useStore();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const toggle = async (key: "visibleToRecruiters" | "resumeVisible" | "evidenceVisible", value: boolean) => {
    setBusy(true);
    await updateProfile({ [key]: value });
    setBusy(false);
    setMsg("Preference saved.");
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Consent"
        title="Privacy & data controls"
        description="Nothing is shared with recruiters or your institution unless you switch it on here."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-unit-4">
        <Panel title="Sharing" subtitle="Applies immediately to recruiter and mentor views.">
          <div className="space-y-unit-4">
            <Row
              label="Visible to recruiters"
              hint="Lets recruiters see your name, target role and competency scores."
              checked={Boolean(student?.visibleToRecruiters)}
              disabled={busy}
              onChange={(v) => void toggle("visibleToRecruiters", v)}
            />
            <Row
              label="Share resume"
              hint="Allows your uploaded resume evidence to be opened by reviewers."
              checked={Boolean(student?.resumeVisible)}
              disabled={busy}
              onChange={(v) => void toggle("resumeVisible", v)}
            />
            <Row
              label="Share evidence portfolio"
              hint="Required for mentor verification and recruiter evidence checks."
              checked={Boolean(student?.evidenceVisible)}
              disabled={busy}
              onChange={(v) => void toggle("evidenceVisible", v)}
            />
          </div>
          {msg && <p className="font-body-sm text-body-sm text-secondary mt-unit-3">{msg}</p>}
        </Panel>

        <Panel title="Your data" subtitle={`${state.evidence.length} evidence items stored`}>
          <div className="space-y-unit-3">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Consent recorded: {student?.consentedAt ? new Date(student.consentedAt).toLocaleString() : "not recorded yet"}
            </p>
            <div className="flex flex-wrap gap-unit-2">
              <Chip tone="info">Self-declared</Chip>
              <Chip tone="warn">AI-extracted</Chip>
              <Chip tone="good">Mentor-verified</Chip>
              <Chip>Demo data</Chip>
            </div>
            <div className="flex flex-wrap gap-unit-3 pt-unit-2">
              <button type="button" className={btnGhost} onClick={exportMyData}>
                Export my data (JSON)
              </button>
              <button
                type="button"
                className={btnGhost}
                onClick={() => {
                  if (confirm("Delete all your evidence, learning progress and applications? This cannot be undone.")) {
                    void clearMyData().then(() => setMsg("Your portfolio data was deleted."));
                  }
                }}
              >
                Delete my portfolio data
              </button>
            </div>
          </div>
        </Panel>
      </div>

      <div className="mt-unit-6">
        <Explain>
          Every label on this app states where the data came from. Demo rows are marked as demo, resume extraction is
          keyword matching (not a language model), and only a mentor account can mark evidence as verified.
        </Explain>
      </div>
    </AppShell>
  );
}

function Row({
  label,
  hint,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  disabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-unit-3 cursor-pointer">
      <input type="checkbox" className="mt-1" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
      <span>
        <span className="font-label-md text-label-md text-on-surface block">{label}</span>
        <span className="font-body-sm text-body-sm text-on-surface-variant">{hint}</span>
      </span>
    </label>
  );
}
