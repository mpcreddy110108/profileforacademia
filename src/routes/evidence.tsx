import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { Bar, Chip, Explain, PageHeader, Panel, btnGhost, btnPrimary, inputCls } from "@/components/ui-kit";
import { SKILLS, skillName } from "@/lib/domain/catalog";
import { evidenceStrength, evidenceStrengthLabel } from "@/lib/domain/engine";
import { useStore } from "@/lib/store";
import type { EvidenceType, VerificationStatus } from "@/lib/domain/types";

export const Route = createFileRoute("/evidence")({
  head: () => ({
    meta: [
      { title: "Evidence Portfolio — SkillBridge AI" },
      { name: "description", content: "Add projects, certifications, internships and resumes; each item feeds the competency engine." },
      { property: "og:title", content: "Evidence Portfolio — SkillBridge AI" },
      { property: "og:description", content: "Evidence with verification status and computed strength drives every competency score." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EvidencePage,
});

const TYPES: { id: EvidenceType; label: string }[] = [
  { id: "project", label: "Project" },
  { id: "certification", label: "Certification" },
  { id: "internship", label: "Internship" },
  { id: "resume", label: "Resume" },
  { id: "assessment", label: "Assessment" },
];

const VERIFICATIONS: VerificationStatus[] = ["self-reported", "peer-reviewed", "institution-verified"];

function EvidencePage() {
  const { state, addEvidence, removeEvidence, profile } = useStore();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<EvidenceType>("project");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [verification, setVerification] = useState<VerificationStatus>("self-reported");
  const [filter, setFilter] = useState<"all" | EvidenceType>("all");
  const [toast, setToast] = useState<string | null>(null);

  const visible = state.evidence.filter((e) => filter === "all" || e.type === filter);

  const submit = () => {
    if (!title.trim() || skills.length === 0) {
      setToast("Add a title and at least one skill demonstrated.");
      return;
    }
    addEvidence({ type, title: title.trim(), description: description.trim(), skills, verification, source: "manual" });
    setToast(`Added "${title.trim()}" — competency profile recalculated for ${skills.map(skillName).join(", ")}.`);
    setTitle("");
    setDescription("");
    setSkills([]);
    setOpen(false);
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Step 2 — Evidence"
        title="Evidence Portfolio"
        description="Everything you add here is scored by the competency engine. Verification status and depth of description directly change your skill scores."
        right={
          <button type="button" className={btnPrimary} onClick={() => setOpen((v) => !v)}>
            <span className="material-symbols-outlined text-[18px]">add</span>
            {open ? "Close form" : "Add evidence"}
          </button>
        }
      />

      {toast && (
        <div className="mb-unit-4 bg-secondary-container text-on-secondary-container px-unit-4 py-unit-3 font-body-sm text-body-sm flex items-center justify-between">
          <span>{toast}</span>
          <button type="button" onClick={() => setToast(null)} className="font-label-md text-label-md underline">Dismiss</button>
        </div>
      )}

      {open && (
        <Panel title="New evidence item" subtitle="Projects, certifications, internships, resumes or external assessments" className="mb-unit-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-unit-4">
            <div className="space-y-unit-3">
              <div>
                <label className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Evidence type</label>
                <div className="flex flex-wrap gap-unit-2 mt-1">
                  {TYPES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setType(t.id)}
                      className={t.id === type ? "px-unit-3 py-1 bg-primary text-on-primary font-label-md text-label-md" : "px-unit-3 py-1 border border-outline-variant font-label-md text-label-md text-on-surface-variant"}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Title</label>
                <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Python Machine Learning Project" />
              </div>
              <div>
                <label className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Description</label>
                <textarea className={`${inputCls} h-28`} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What you built, the dataset, the outcome…" />
              </div>
              <div>
                <label className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Verification status</label>
                <div className="flex flex-wrap gap-unit-2 mt-1">
                  {VERIFICATIONS.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setVerification(v)}
                      className={v === verification ? "px-unit-3 py-1 bg-primary text-on-primary font-label-md text-label-md" : "px-unit-3 py-1 border border-outline-variant font-label-md text-label-md text-on-surface-variant"}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Verification is student-declared in this demo. A production build would verify against institution records or issuer APIs.
                </p>
              </div>
            </div>

            <div>
              <label className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Skills demonstrated</label>
              <div className="flex flex-wrap gap-unit-1 mt-1 max-h-64 overflow-y-auto border border-outline-variant p-unit-2 bg-surface-container-low">
                {SKILLS.map((s) => {
                  const on = skills.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSkills((prev) => (on ? prev.filter((x) => x !== s.id) : [...prev, s.id]))}
                      className={on ? "px-unit-2 py-1 bg-secondary-container text-on-secondary-container font-label-md text-label-md" : "px-unit-2 py-1 bg-surface-container-lowest border border-outline-variant text-on-surface-variant font-label-md text-label-md"}
                    >
                      {s.name}
                    </button>
                  );
                })}
              </div>
              <div className="mt-unit-4 flex gap-unit-2">
                <button type="button" className={btnPrimary} onClick={submit}>Save evidence</button>
                <button type="button" className={btnGhost} onClick={() => setOpen(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </Panel>
      )}

      <div className="flex flex-wrap gap-unit-2 mb-unit-4">
        {(["all", ...TYPES.map((t) => t.id)] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f as "all" | EvidenceType)}
            className={f === filter ? "px-unit-3 py-1 bg-primary text-on-primary font-label-md text-label-md" : "px-unit-3 py-1 border border-outline-variant text-on-surface-variant font-label-md text-label-md"}
          >
            {f === "all" ? `All (${state.evidence.length})` : `${f} (${state.evidence.filter((e) => e.type === f).length})`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-unit-4">
        {visible.map((e) => {
          const strength = evidenceStrength(e);
          return (
            <Panel key={e.id}>
              <div className="flex items-start justify-between gap-unit-3">
                <div>
                  <div className="flex flex-wrap items-center gap-unit-2">
                    <Chip tone="info">{e.type}</Chip>
                    <Chip tone={e.verification === "institution-verified" ? "good" : e.verification === "peer-reviewed" ? "warn" : "neutral"}>{e.verification}</Chip>
                    {e.score != null && <Chip tone="good">score {e.score}%</Chip>}
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mt-unit-2">{e.title}</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{e.description || "No description added."}</p>
                </div>
                <button type="button" onClick={() => removeEvidence(e.id)} className="text-on-surface-variant hover:text-error" title="Remove evidence">
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-unit-1 mt-unit-3">
                {e.skills.map((s) => (
                  <Chip key={s}>{skillName(s)}</Chip>
                ))}
              </div>
              <div className="mt-unit-3">
                <div className="flex items-center justify-between font-code-sm text-code-sm text-on-surface-variant mb-1">
                  <span>EVIDENCE STRENGTH</span>
                  <span>{strength}/100 • {evidenceStrengthLabel(strength)}</span>
                </div>
                <Bar value={strength} tone={strength >= 70 ? "secondary" : "primary"} />
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Added {e.createdAt}. Contributes to: {e.skills.map((s) => `${skillName(s)} ${profile.find((c) => c.skill === s)?.score ?? 0}%`).join(", ")}.
                </p>
              </div>
            </Panel>
          );
        })}
      </div>

      <div className="mt-unit-6">
        <Explain>
          Strength = evidence type base + verification bonus + depth of description + number of skills covered.
          Stronger, verified evidence moves competency scores further; many weak items hit diminishing returns.
        </Explain>
      </div>
    </AppShell>
  );
}
