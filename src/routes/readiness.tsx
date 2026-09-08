import { createFileRoute, Link } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { Bar, Chip, Explain, PageHeader, Panel, Stat, btnGhost } from "@/components/ui-kit";
import { roleById, skillName } from "@/lib/domain/catalog";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/readiness")({
  head: () => ({
    meta: [
      { title: "Career Readiness — SkillBridge AI" },
      { name: "description", content: "A transparent readiness index built from role fit, evidence quality, assessments, learning progress and applications." },
      { property: "og:title", content: "Career Readiness — SkillBridge AI" },
      { property: "og:description", content: "See exactly which component moves your placement readiness score." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReadinessPage,
});

function ReadinessPage() {
  const { readiness, fit, state, profile, matches, opportunities, resetDemo } = useStore();
  const role = roleById(state.targetRoleId);
  const topMatches = [...opportunities].sort((a, b) => (matches[b.id]?.score ?? 0) - (matches[a.id]?.score ?? 0)).slice(0, 3);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Step 9 — Readiness"
        title="Career Readiness"
        description={`Composite index for ${role.title}. Each component below is measured, weighted and summed — nothing is hardcoded.`}
        right={<button type="button" className={btnGhost} onClick={resetDemo}>Reset demo data</button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-unit-4 mb-unit-6">
        <Stat label="Readiness index" value={`${readiness.index}%`} hint={readiness.band} tone={readiness.index >= 75 ? "good" : undefined} />
        <Stat label="Role fit" value={`${fit.fit}%`} hint={role.title} />
        <Stat label="Evidence items" value={`${state.evidence.length}`} hint={`${state.evidence.filter((e) => e.verification !== "self-reported").length} verified or peer-reviewed`} />
        <Stat label="Skills tracked" value={`${profile.length}`} hint={`${profile.filter((c) => c.level === "strong").length} strong`} />
      </div>

      <Panel title="How the index is computed" subtitle="Weighted components" className="mb-unit-6">
        <ul className="space-y-unit-4">
          {readiness.components.map((c) => (
            <li key={c.label}>
              <div className="flex justify-between font-label-md text-label-md mb-1">
                <span className="text-on-surface">{c.label}</span>
                <span className="font-code-sm text-code-sm text-on-surface-variant">
                  {c.value}% × weight {Math.round(c.weight * 100)}% = {(c.value * c.weight).toFixed(1)} pts
                </span>
              </div>
              <Bar value={c.value} tone={c.value >= 70 ? "secondary" : "primary"} />
            </li>
          ))}
        </ul>
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-unit-4">
        <Panel title="What will move the needle fastest">
          {fit.mandatoryGaps.length ? (
            <ul className="space-y-unit-3">
              {fit.mandatoryGaps.map((g) => (
                <li key={g.skill} className="border border-outline-variant p-unit-3">
                  <div className="flex items-center gap-unit-2">
                    <Chip tone="bad">Mandatory</Chip>
                    <span className="font-label-lg text-label-lg text-on-surface">{skillName(g.skill)}</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{g.explanation}</p>
                  <Link to="/learning-path" className="font-label-md text-label-md text-primary underline mt-unit-2 inline-block">
                    Open the learning step →
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-body-sm text-body-sm text-on-surface-variant">No mandatory gaps for this role — focus on applications.</p>
          )}
        </Panel>

        <Panel title="Best current matches">
          <ul className="space-y-unit-3">
            {topMatches.map((o) => (
              <li key={o.id} className="flex items-center justify-between border border-outline-variant px-unit-3 py-unit-2">
                <div>
                  <span className="font-label-lg text-label-lg text-on-surface">{o.role}</span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{o.company} • {o.location}</p>
                </div>
                <Chip tone={(matches[o.id]?.score ?? 0) >= 70 ? "good" : "warn"}>{matches[o.id]?.score ?? 0}%</Chip>
              </li>
            ))}
          </ul>
          <Link to="/opportunities" className="font-label-md text-label-md text-primary underline mt-unit-3 inline-block">
            See all matches →
          </Link>
        </Panel>
      </div>

      <div className="mt-unit-6">
        <Explain>
          Index = 0.35 role fit + 0.15 evidence breadth + 0.15 verified-evidence share + 0.15 assessment average +
          0.10 learning progress + 0.10 application momentum. All demo data lives in your browser only.
        </Explain>
      </div>
    </AppShell>
  );
}
