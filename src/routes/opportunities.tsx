import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { Bar, Chip, Explain, PageHeader, Panel, btnGhost, btnPrimary } from "@/components/ui-kit";
import { skillName } from "@/lib/domain/catalog";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/opportunities")({
  head: () => ({
    meta: [
      { title: "Opportunity Matcher — SkillBridge AI" },
      { name: "description", content: "Internships and jobs ranked by how your evidence-backed competencies meet each posting's requirements." },
      { property: "og:title", content: "Opportunity Matcher — SkillBridge AI" },
      { property: "og:description", content: "Match score, missing skills and a plain-language reason for every opportunity." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OpportunitiesPage,
});

function OpportunitiesPage() {
  const { opportunities, matches, setApplicationStatus, applicationFor, profile } = useStore();
  const [toast, setToast] = useState<string | null>(null);
  const ranked = [...opportunities].sort((a, b) => (matches[b.id]?.score ?? 0) - (matches[a.id]?.score ?? 0));

  return (
    <AppShell>
      <PageHeader
        eyebrow="Step 7 — Opportunity matching"
        title="Opportunity Matcher"
        description="Each posting is scored against your competency profile: 85% of the score comes from required-skill coverage, 15% from preferred skills."
      />

      {toast && (
        <div className="mb-unit-4 bg-secondary-container text-on-secondary-container px-unit-4 py-unit-3 font-body-sm text-body-sm flex items-center justify-between">
          <span>{toast}</span>
          <Link to="/applications" className="font-label-md text-label-md underline">Open tracker</Link>
        </div>
      )}

      <div className="space-y-unit-4">
        {ranked.map((o) => {
          const m = matches[o.id]!;
          const app = applicationFor(o.id);
          return (
            <Panel key={o.id}>
              <div className="flex flex-col xl:flex-row gap-unit-6 justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-unit-2">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">{o.role}</h3>
                    <Chip tone="info">{o.company}</Chip>
                    <Chip>{o.type}</Chip>
                    <Chip>{o.location}</Chip>
                    <Chip tone="good">{o.stipend}</Chip>
                    {o.postedBy === "recruiter" && <Chip tone="warn">Posted in recruiter view</Chip>}
                    {app && <Chip tone="info">{app.status}</Chip>}
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-unit-2">{o.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-4 mt-unit-4">
                    <div>
                      <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Required skills</span>
                      <ul className="mt-unit-2 space-y-unit-2">
                        {o.required.map((r) => {
                          const cur = profile.find((c) => c.skill === r.skill)?.score ?? 0;
                          return (
                            <li key={r.skill}>
                              <div className="flex justify-between font-code-sm text-code-sm">
                                <span className="text-on-surface">{skillName(r.skill)}</span>
                                <span className={cur >= r.level ? "text-secondary" : "text-error"}>{cur}% / {r.level}%</span>
                              </div>
                              <Bar value={cur} target={r.level} tone={cur >= r.level ? "secondary" : "error"} />
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    <div>
                      <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Preferred skills</span>
                      <div className="flex flex-wrap gap-unit-1 mt-unit-2">
                        {o.preferred.map((p) => (
                          <Chip key={p} tone={m.preferredHits.includes(p) ? "good" : "neutral"}>{skillName(p)}</Chip>
                        ))}
                      </div>
                      <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant block mt-unit-4">Missing</span>
                      <div className="flex flex-wrap gap-unit-1 mt-unit-2">
                        {m.missingSkills.length ? m.missingSkills.map((s) => <Chip key={s} tone="bad">{skillName(s)}</Chip>) : <Chip tone="good">Nothing missing</Chip>}
                      </div>
                    </div>
                  </div>

                  <div className="mt-unit-4">
                    <Explain>{m.explanation}</Explain>
                  </div>
                </div>

                <div className="xl:w-64 flex-shrink-0 bg-surface-container-low p-unit-4">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Match score</span>
                  <div className="font-display-lg text-display-lg text-primary leading-none mt-1">{m.score}%</div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-unit-2">
                    Readiness on required skills: {m.readiness}% ({m.matchedSkills.length}/{o.required.length} thresholds cleared)
                  </p>
                  <div className="mt-unit-4 space-y-unit-2">
                    <button
                      type="button"
                      className={`${btnPrimary} w-full justify-center`}
                      onClick={() => { setApplicationStatus(o.id, "applied"); setToast(`Application submitted to ${o.company} for ${o.role}.`); }}
                    >
                      {app?.status === "applied" ? "Applied ✓" : "Apply now"}
                    </button>
                    <button
                      type="button"
                      className={`${btnGhost} w-full justify-center`}
                      onClick={() => { setApplicationStatus(o.id, "saved"); setToast(`Saved ${o.role} at ${o.company} to your tracker.`); }}
                    >
                      Save opportunity
                    </button>
                  </div>
                </div>
              </div>
            </Panel>
          );
        })}
      </div>
    </AppShell>
  );
}
