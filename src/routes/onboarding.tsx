import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { btnGhost, btnPrimary, inputCls, Panel } from "@/components/ui-kit";
import { ROLES } from "@/lib/domain/catalog";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Student onboarding — SkillBridge AI" },
      { name: "description", content: "Tell SkillBridge AI about your college, branch, target role and weekly learning hours to personalise your competency plan." },
      { property: "og:title", content: "Student onboarding — SkillBridge AI" },
      { property: "og:description", content: "Set your target role and weekly learning hours." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Onboarding,
});

function Onboarding() {
  const { student, loading, session, updateProfile, loadDemoEvidence, state } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    college: "",
    degree: "B.Tech",
    branch: "Computer Science & Engineering",
    semester: "Semester 6",
    specialisation: "",
    targetRoleId: "ml-intern",
    githubUrl: "",
    linkedinUrl: "",
    weeklyHours: 6,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!loading && !session) void navigate({ to: "/auth" });
  }, [loading, session, navigate]);

  useEffect(() => {
    if (!student) return;
    setForm((f) => ({
      ...f,
      fullName: student.fullName || f.fullName,
      college: student.college || f.college,
      degree: student.degree || f.degree,
      branch: student.branch || f.branch,
      semester: student.semester || f.semester,
      specialisation: student.specialisation || f.specialisation,
      targetRoleId: student.targetRoleId || f.targetRoleId,
      githubUrl: student.githubUrl || f.githubUrl,
      linkedinUrl: student.linkedinUrl || f.linkedinUrl,
      weeklyHours: student.weeklyHours || f.weeklyHours,
    }));
  }, [student]);

  const set = (k: keyof typeof form, v: string | number) => setForm((f) => ({ ...f, [k]: v }));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updateProfile({ ...form, onboarded: true, consentedAt: new Date().toISOString() });
      setDone(true);
      await navigate({ to: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save your profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-surface px-unit-4 py-unit-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Set up your student profile</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1 mb-unit-6">
          Everything you enter here is self-declared. It personalises your target role fit, skill gaps and weekly learning plan.
        </p>

        <Panel title="Your details">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-unit-4" onSubmit={save}>
            <Field label="Full name" value={form.fullName} onChange={(v) => set("fullName", v)} required />
            <Field label="College / University" value={form.college} onChange={(v) => set("college", v)} required />
            <Field label="Degree" value={form.degree} onChange={(v) => set("degree", v)} />
            <Field label="Branch" value={form.branch} onChange={(v) => set("branch", v)} />
            <Field label="Semester" value={form.semester} onChange={(v) => set("semester", v)} />
            <Field label="Specialisation" value={form.specialisation} onChange={(v) => set("specialisation", v)} />
            <Field label="GitHub URL" value={form.githubUrl} onChange={(v) => set("githubUrl", v)} />
            <Field label="LinkedIn URL" value={form.linkedinUrl} onChange={(v) => set("linkedinUrl", v)} />

            <div>
              <label className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant" htmlFor="role">Target role</label>
              <select id="role" className={inputCls} value={form.targetRoleId} onChange={(e) => set("targetRoleId", e.target.value)}>
                {ROLES.map((r) => (
                  <option key={r.id} value={r.id}>{r.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant" htmlFor="hours">
                Weekly learning hours
              </label>
              <input
                id="hours"
                type="number"
                min={1}
                max={40}
                className={inputCls}
                value={form.weeklyHours}
                onChange={(e) => set("weeklyHours", Number(e.target.value))}
              />
            </div>

            {error && <p className="md:col-span-2 font-body-sm text-body-sm text-error">{error}</p>}
            {done && <p className="md:col-span-2 font-body-sm text-body-sm text-secondary">Profile saved.</p>}

            <div className="md:col-span-2 flex flex-wrap gap-unit-3 pt-unit-2">
              <button type="submit" className={btnPrimary} disabled={saving}>
                {saving ? "Saving…" : "Save and continue"}
              </button>
              {state.evidence.length === 0 && (
                <button type="button" className={btnGhost} onClick={() => void loadDemoEvidence()}>
                  Load clearly-labelled demo evidence
                </button>
              )}
            </div>
          </form>
        </Panel>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant" htmlFor={label}>{label}</label>
      <input id={label} className={inputCls} value={value} required={required} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
