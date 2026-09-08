import { createFileRoute, Link } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { Bar, Chip, Explain, PageHeader, Panel, Stat } from "@/components/ui-kit";
import { ROLES, roleById, skillName } from "@/lib/domain/catalog";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/skill-gap")({
  head: () => ({
    meta: [
      { title: "Skill-Gap Analysis — SkillBridge AI" },
      { name: "description", content: "Compare your evidence-backed competencies against target role requirements, with mandatory gaps flagged." },
      { property: "og:title", content: "Skill-Gap Analysis — SkillBridge AI" },
      { property: "og:description", content: "Current vs required score for every skill in your target role, with an explanation per row." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SkillGapPage,
});

function SkillGapPage() {
  const { fit, state, setTargetRole, profile } = useStore();
  const role = roleById(state.targetRoleId);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Step 5 — Gap analysis"
        title="Skill-Gap Analysis"
        description="Your current competencies versus what the target role demands. Every current score traces back to evidence in your portfolio."
      />

      <div className="flex flex-wrap gap-unit-2 mb-unit-6">
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-unit-4 mb-unit-6">
        <Stat label="Role fit" value={`${fit.fit}%`} hint="Mandatory skills weighted 2×" tone={fit.fit >= 70 ? "good" : undefined} />
        <Stat label="Matched skills" value={`${fit.matched.length}`} tone="good" />
        <Stat label="Missing skills" value={`${fit.missing.length}`} />
        <Stat label="Mandatory gaps" value={`${fit.mandatoryGaps.length}`} tone={fit.mandatoryGaps.length ? "bad" : "good"} />
      </div>

      <Panel title={`${role.title} requirements`} subtitle={role.summary}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant border-b border-outline-variant">
                <th className="py-unit-2 pr-unit-3">Skill</th>
                <th className="py-unit-2 pr-unit-3">Current</th>
                <th className="py-unit-2 pr-unit-3">Required</th>
                <th className="py-unit-2 pr-unit-3 w-56">Progress</th>
                <th className="py-unit-2 pr-unit-3">Status</th>
                <th className="py-unit-2 pr-unit-3">Priority</th>
                <th className="py-unit-2">Evidence</th>
              </tr>
            </thead>
            <tbody>
              {fit.rows.map((r) => {
                const comp = profile.find((c) => c.skill === r.skill);
                return (
                  <tr key={r.skill} className="border-b border-outline-variant align-top">
                    <td className="py-unit-3 pr-unit-3">
                      <span className="font-label-md text-label-md text-on-surface">{skillName(r.skill)}</span>
                      {r.mandatory && <span className="ml-2 font-code-sm text-code-sm text-error">MANDATORY</span>}
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 max-w-xl">{r.explanation}</p>
                    </td>
                    <td className="py-unit-3 pr-unit-3 font-code-sm text-code-sm">{r.current}%</td>
                    <td className="py-unit-3 pr-unit-3 font-code-sm text-code-sm">{r.required}%</td>
                    <td className="py-unit-3 pr-unit-3">
                      <Bar value={r.current} target={r.required} tone={r.status === "Satisfied" ? "secondary" : r.status === "Critical Gap" ? "error" : "primary"} />
                    </td>
                    <td className="py-unit-3 pr-unit-3">
                      <Chip tone={r.status === "Satisfied" ? "good" : r.status === "Critical Gap" ? "bad" : "warn"}>{r.status}</Chip>
                    </td>
                    <td className="py-unit-3 pr-unit-3 font-label-md text-label-md">{r.priority}</td>
                    <td className="py-unit-3 font-code-sm text-code-sm text-on-surface-variant">
                      {comp?.evidenceIds.length ? `${comp.evidenceIds.length} item(s)` : "No evidence yet"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="mt-unit-6 flex flex-wrap gap-unit-4 items-center">
        <Link to="/learning-path" className="px-unit-4 py-unit-2 bg-primary text-on-primary font-label-md text-label-md font-semibold">
          Generate learning path for these gaps →
        </Link>
        <Link to="/opportunities" className="px-unit-4 py-unit-2 border border-outline-variant font-label-md text-label-md">
          See opportunities ranked by this profile
        </Link>
      </div>

      <div className="mt-unit-6">
        <Explain>
          Role fit = weighted average of min(current ÷ required, 1) across all requirements, with mandatory skills
          counted twice. A skill is a Critical Gap when it is mandatory and at least 20 points short.
        </Explain>
      </div>
    </AppShell>
  );
}
