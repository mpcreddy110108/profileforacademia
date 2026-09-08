import { createFileRoute, Link } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { Bar, Chip, Explain, Panel, Stat } from "@/components/ui-kit";
import { ROLES, roleById, skillById, skillName } from "@/lib/domain/catalog";
import { STUDENT } from "@/lib/domain/seed";
import { useStore } from "@/lib/store";
import type { Competency } from "@/lib/domain/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Competency Hub — SkillBridge AI" },
      { name: "description", content: "Evidence-backed competency profile with strong skills, developing skills and critical gaps for your target role." },
      { property: "og:title", content: "Competency Hub — SkillBridge AI" },
      { property: "og:description", content: "Every competency score is computed from the evidence in your portfolio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CompetencyHub,
});

const WORKFLOW = [
  { label: "Add Evidence", to: "/evidence", icon: "folder_special" },
  { label: "Skill Extraction", to: "/resume-extractor", icon: "document_scanner" },
  { label: "Competency Profile", to: "/", icon: "verified" },
  { label: "Skill Gap", to: "/skill-gap", icon: "troubleshoot" },
  { label: "Learning Path", to: "/learning-path", icon: "route" },
  { label: "Opportunities", to: "/opportunities", icon: "hub" },
  { label: "Applications", to: "/applications", icon: "terminal" },
] as const;

function CompetencyHub() {
  const { profile, fit, state, setTargetRole, readiness } = useStore();
  const role = roleById(state.targetRoleId);

  const strong = profile.filter((c) => c.level === "strong");
  const developing = profile.filter((c) => c.level === "developing");
  const gaps = fit.rows
    .filter((r) => r.status !== "Satisfied")
    .map((r) => ({ skill: r.skill, score: r.current, required: r.required, mandatory: r.mandatory, explanation: r.explanation }));

  return (
    <AppShell>
      <div className="bg-surface-container-lowest border border-outline-variant p-unit-6 mb-unit-6">
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-unit-6">
          <div className="flex items-start gap-unit-6">
            <div className="w-20 h-20 bg-surface-container-high overflow-hidden flex-shrink-0">
              <img className="w-full h-full object-cover" src={STUDENT.photo} alt={`Portrait of ${STUDENT.name}`} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-unit-3">
                <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">{STUDENT.name}</h1>
                <Chip>UID: {STUDENT.uid}</Chip>
                <Chip tone="info">{STUDENT.institution}</Chip>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                {STUDENT.program} • {STUDENT.semester} • Specialisation: {STUDENT.specialisation}
              </p>
              <div className="flex flex-wrap items-center gap-unit-4 mt-unit-2 text-on-surface-variant">
                <span className="font-code-sm text-code-sm">
                  TARGET ROLE: <strong className="text-on-surface">{role.title}</strong>
                </span>
                <span className="font-code-sm text-code-sm">
                  EVIDENCE ITEMS: <strong className="text-on-surface">{state.evidence.length}</strong>
                </span>
                <span className="font-code-sm text-code-sm">
                  TRACKED SKILLS: <strong className="text-on-surface">{profile.length}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-unit-6 bg-surface-container-low p-unit-4 w-full xl:w-auto">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-surface-container-high" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" />
                <path className="text-secondary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${readiness.index}, 100`} strokeWidth="3.5" />
              </svg>
              <span className="absolute font-headline-sm text-headline-sm text-on-surface font-bold">
                {readiness.index}
                <span className="text-xs">%</span>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Readiness Index</span>
              <span className="font-headline-sm text-headline-sm text-secondary font-bold">{readiness.band}</span>
              <Link to="/readiness" className="font-code-sm text-code-sm text-primary underline mt-1">
                See how this is calculated
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-unit-2 mb-unit-6">
        {WORKFLOW.map((w, i) => (
          <div className="flex items-center gap-unit-2" key={w.label}>
            <Link
              to={w.to}
              className="flex items-center gap-unit-2 px-unit-3 py-unit-2 bg-surface-container-lowest border border-outline-variant hover:border-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">{w.icon}</span>
              <span className="font-label-md text-label-md">{w.label}</span>
            </Link>
            {i < WORKFLOW.length - 1 && <span className="material-symbols-outlined text-[16px] text-on-surface-variant">chevron_right</span>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-unit-4 mb-unit-6">
        <Stat label="Target role fit" value={`${fit.fit}%`} hint={`${role.title} — weighted across ${fit.rows.length} required skills`} tone={fit.fit >= 70 ? "good" : undefined} />
        <Stat label="Strong competencies" value={`${strong.length}`} hint="Score ≥ 75, evidence-backed" tone="good" />
        <Stat label="Developing" value={`${developing.length}`} hint="Score 45–74" />
        <Stat label="Mandatory gaps" value={`${fit.mandatoryGaps.length}`} hint="Blocking for this target role" tone={fit.mandatoryGaps.length ? "bad" : "good"} />
      </div>

      <Panel
        title="Target role"
        subtitle="Switch the target role to recompute gaps, learning path and opportunity ranking."
        className="mb-unit-6"
      >
        <div className="flex flex-wrap gap-unit-2">
          {ROLES.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setTargetRole(r.id)}
              className={
                r.id === state.targetRoleId
                  ? "px-unit-4 py-unit-2 bg-primary text-on-primary font-label-md text-label-md font-semibold"
                  : "px-unit-4 py-unit-2 border border-outline-variant text-on-surface-variant font-label-md text-label-md hover:text-on-surface hover:bg-surface-container"
              }
            >
              {r.title}
            </button>
          ))}
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-unit-3">{role.summary}</p>
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-unit-4">
        <Panel title="Strong competencies" subtitle="Score ≥ 75">
          <CompetencyList items={strong} tone="secondary" />
        </Panel>
        <Panel title="Developing competencies" subtitle="Score 45–74">
          <CompetencyList items={developing} tone="primary" />
        </Panel>
        <Panel title="Critical gaps for this role" subtitle={role.title}>
          {gaps.length === 0 ? (
            <p className="font-body-sm text-body-sm text-on-surface-variant">No gaps — you clear every requirement for this role.</p>
          ) : (
            <ul className="space-y-unit-4">
              {gaps.map((g) => (
                <li key={g.skill}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-label-md text-label-md text-on-surface">{skillName(g.skill)}</span>
                    <span className="font-code-sm text-code-sm text-error">
                      {g.score}% / {g.required}%
                    </span>
                  </div>
                  <Bar value={g.score} target={g.required} tone="error" />
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{g.explanation}</p>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-unit-4">
            <Link to="/learning-path" className="font-label-md text-label-md text-primary underline">
              Open the generated learning path →
            </Link>
          </div>
        </Panel>
      </div>

      <div className="mt-unit-6">
        <Explain>
          Every percentage on this page is computed from your evidence portfolio using a transparent rule-based
          engine (evidence type × verification status × depth, with diminishing returns). No machine-learning model
          or semantic embedding is used — the demo data is clearly labelled as demo data.
        </Explain>
      </div>
    </AppShell>
  );
}

function CompetencyList({ items, tone }: { items: Competency[]; tone: "primary" | "secondary" }) {
  if (!items.length) return <p className="font-body-sm text-body-sm text-on-surface-variant">Nothing here yet — add evidence to build this bucket.</p>;
  return (
    <ul className="space-y-unit-4">
      {items.map((c) => (
        <li key={c.skill}>
          <div className="flex items-center justify-between mb-1">
            <span className="font-label-md text-label-md text-on-surface">{skillName(c.skill)}</span>
            <span className="font-code-sm text-code-sm text-on-surface-variant">
              {c.score}% • {c.evidenceIds.length} evidence
            </span>
          </div>
          <Bar value={c.score} tone={tone} />
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            {skillById(c.skill)?.category}
            {c.assessmentScore != null ? ` • assessment ${c.assessmentScore}%` : ""}
          </p>
        </li>
      ))}
    </ul>
  );
}
