import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { Bar, Chip, Explain, PageHeader, Panel, Stat } from "@/components/ui-kit";
import { ROLES, SKILLS, skillName } from "@/lib/domain/catalog";
import { analyseRole, profileFromScores } from "@/lib/domain/engine";
import { DEMO_COHORT, STUDENT } from "@/lib/domain/seed";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/institution")({
  head: () => ({
    meta: [
      { title: "Institution Analytics — SkillBridge AI" },
      { name: "description", content: "Cohort-level competency averages, common skill gaps, industry demand and placement readiness." },
      { property: "og:title", content: "Institution Analytics — SkillBridge AI" },
      { property: "og:description", content: "Analytics computed from the student cohort and live opportunity requirements." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InstitutionPage,
});

function InstitutionPage() {
  const { profile, opportunities, readiness, state } = useStore();

  const cohort = [
    {
      id: STUDENT.uid,
      name: `${STUDENT.name} (live)`,
      branch: "CSE",
      scores: Object.fromEntries(profile.map((c) => [c.skill, c.score])) as Record<string, number>,
      evidenceCount: state.evidence.length,
    },
    ...DEMO_COHORT.map((s) => ({ id: s.id, name: s.name, branch: s.branch, scores: s.skills, evidenceCount: s.evidenceCount })),
  ];

  const avgFor = (skill: string) =>
    Math.round(cohort.reduce((sum, s) => sum + (s.scores[skill] ?? 0), 0) / cohort.length);

  const avgCompetency = Math.round(
    cohort.reduce((sum, s) => {
      const vals = Object.values(s.scores);
      return sum + (vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0);
    }, 0) / cohort.length,
  );

  // Industry demand = how often a skill is required across live opportunities.
  const demand = SKILLS.map((s) => {
    const count = opportunities.filter((o) => o.required.some((r) => r.skill === s.id)).length;
    return { skill: s.id, demand: Math.round((count / Math.max(1, opportunities.length)) * 100), supply: avgFor(s.id) };
  })
    .filter((d) => d.demand > 0)
    .sort((a, b) => b.demand - a.demand);

  const commonGaps = [...demand].sort((a, b) => a.supply - b.supply - (a.demand - b.demand)).slice(0, 6);

  const readinessByStudent = cohort.map((s) => {
    const fit = analyseRole(
      s.id === STUDENT.uid ? profile : profileFromScores(s.scores),
      ROLES[0]!.id,
    );
    return { ...s, fit: fit.fit };
  });
  const placementReady = readinessByStudent.filter((s) => s.fit >= 70).length;

  return (
    <AppShell>
      <PageHeader
        eyebrow="Institution admin"
        title="Skill Gap Analytics"
        description="Cohort analytics computed live from student competency data and the requirements of every opportunity currently in the marketplace."
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-unit-4 mb-unit-6">
        <Stat label="Total students" value={`${cohort.length}`} hint="1 live profile + demo cohort" />
        <Stat label="Average competency" value={`${avgCompetency}%`} />
        <Stat label="Placement ready" value={`${placementReady}/${cohort.length}`} hint="≥70% fit for ML Engineer Intern" tone={placementReady > cohort.length / 2 ? "good" : "bad"} />
        <Stat label="Live readiness (Aarav)" value={`${readiness.index}%`} hint={readiness.band} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-unit-4">
        <Panel title="Industry demand vs cohort supply" subtitle="Demand = share of open postings requiring the skill">
          <ul className="space-y-unit-3">
            {demand.map((d) => (
              <li key={d.skill}>
                <div className="flex justify-between font-label-md text-label-md">
                  <span className="text-on-surface">{skillName(d.skill)}</span>
                  <span className="font-code-sm text-code-sm text-on-surface-variant">demand {d.demand}% • supply {d.supply}%</span>
                </div>
                <Bar value={d.demand} tone="primary" />
                <div className="mt-1"><Bar value={d.supply} tone={d.supply >= d.demand ? "secondary" : "error"} /></div>
              </li>
            ))}
          </ul>
        </Panel>

        <div className="space-y-unit-4">
          <Panel title="Most common skill gaps" subtitle="High demand, low cohort supply">
            <ul className="space-y-unit-2">
              {commonGaps.map((g) => (
                <li key={g.skill} className="flex items-center justify-between border border-outline-variant px-unit-3 py-unit-2">
                  <span className="font-label-lg text-label-lg text-on-surface">{skillName(g.skill)}</span>
                  <div className="flex gap-unit-2">
                    <Chip tone="info">demand {g.demand}%</Chip>
                    <Chip tone={g.supply < 50 ? "bad" : "warn"}>supply {g.supply}%</Chip>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Placement readiness by student" subtitle="Fit against ML Engineer Intern">
            <ul className="space-y-unit-2">
              {readinessByStudent.sort((a, b) => b.fit - a.fit).map((s) => (
                <li key={s.id}>
                  <div className="flex justify-between font-label-md text-label-md">
                    <span className="text-on-surface">{s.name} <span className="font-code-sm text-code-sm text-on-surface-variant">• {s.branch} • {s.evidenceCount} evidence</span></span>
                    <span className="font-code-sm text-code-sm">{s.fit}%</span>
                  </div>
                  <Bar value={s.fit} tone={s.fit >= 70 ? "secondary" : "primary"} />
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>

      <div className="mt-unit-6">
        <Explain>
          Demand is derived from the live opportunity list (including recruiter-posted roles), supply from cohort
          competency scores. The peer cohort is demo data; the first row is the live student profile.
        </Explain>
      </div>
    </AppShell>
  );
}
