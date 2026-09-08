import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { Bar, Chip, Explain, PageHeader, Panel, Stat } from "@/components/ui-kit";
import { skillName } from "@/lib/domain/catalog";
import { matchOpportunity, profileFromScores } from "@/lib/domain/engine";
import { DEMO_COHORT, STUDENT } from "@/lib/domain/seed";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/recruiter/candidates")({
  head: () => ({
    meta: [
      { title: "Candidate Shortlist — SkillBridge AI Recruiter" },
      { name: "description", content: "Rank candidates by competency match, evidence strength and missing skills, then shortlist them." },
      { property: "og:title", content: "Candidate Shortlist — SkillBridge AI Recruiter" },
      { property: "og:description", content: "Evidence-backed candidate ranking for any posted opportunity." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CandidatesPage,
});

function CandidatesPage() {
  const { opportunities, profile, state, toggleShortlist } = useStore();
  const [selectedId, setSelectedId] = useState(opportunities[0]?.id ?? "");
  const opp = opportunities.find((o) => o.id === selectedId) ?? opportunities[0];
  if (!opp) return <AppShell><Panel title="No opportunities">Post a role first.</Panel></AppShell>;

  const shortlisted = state.shortlist[opp.id] ?? [];

  const candidates = [
    {
      id: STUDENT.uid,
      name: `${STUDENT.name} (live profile)`,
      branch: "CSE",
      year: STUDENT.semester,
      evidenceCount: state.evidence.length,
      verifiedEvidence: state.evidence.filter((e) => e.verification !== "self-reported").length,
      match: matchOpportunity(profile, opp),
    },
    ...DEMO_COHORT.map((s) => ({
      id: s.id,
      name: s.name,
      branch: s.branch,
      year: s.year,
      evidenceCount: s.evidenceCount,
      verifiedEvidence: s.verifiedEvidence,
      match: matchOpportunity(profileFromScores(s.skills), opp),
    })),
  ].sort((a, b) => b.match.score - a.match.score);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Recruiter workspace"
        title="Candidate Shortlist"
        description="Candidates ranked against the selected posting. Evidence strength is the share of a candidate's portfolio that is verified or peer-reviewed."
      />

      <div className="flex flex-wrap gap-unit-2 mb-unit-6">
        {opportunities.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setSelectedId(o.id)}
            className={o.id === opp.id ? "px-unit-3 py-unit-2 bg-primary text-on-primary font-label-md text-label-md" : "px-unit-3 py-unit-2 border border-outline-variant text-on-surface-variant font-label-md text-label-md"}
          >
            {o.role} • {o.company}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-unit-4 mb-unit-6">
        <Stat label="Candidates" value={`${candidates.length}`} />
        <Stat label="Above 70% match" value={`${candidates.filter((c) => c.match.score >= 70).length}`} tone="good" />
        <Stat label="Shortlisted" value={`${shortlisted.length}`} />
        <Stat label="Required skills" value={`${opp.required.length}`} hint={opp.required.map((r) => `${skillName(r.skill)} ≥ ${r.level}%`).join(", ")} />
      </div>

      <div className="space-y-unit-4">
        {candidates.map((c) => {
          const on = shortlisted.includes(c.id);
          const evidenceStrengthPct = c.evidenceCount ? Math.round((c.verifiedEvidence / c.evidenceCount) * 100) : 0;
          return (
            <Panel key={c.id}>
              <div className="flex flex-col lg:flex-row justify-between gap-unit-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-unit-2">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">{c.name}</h3>
                    <Chip>{c.id}</Chip>
                    <Chip tone="info">{c.branch} • {c.year}</Chip>
                    {on && <Chip tone="good">Shortlisted</Chip>}
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    {c.evidenceCount} evidence items • {c.verifiedEvidence} verified or peer-reviewed ({evidenceStrengthPct}% evidence strength)
                  </p>
                  <div className="flex flex-wrap gap-unit-1 mt-unit-2">
                    {c.match.matchedSkills.map((s) => <Chip key={s} tone="good">{skillName(s)} ✓</Chip>)}
                    {c.match.missingSkills.map((s) => <Chip key={s} tone="bad">{skillName(s)} ✗</Chip>)}
                  </div>
                  <div className="mt-unit-3"><Explain>{c.match.explanation}</Explain></div>
                </div>
                <div className="lg:w-56 flex-shrink-0 bg-surface-container-low p-unit-4">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Competency match</span>
                  <div className="font-headline-lg text-headline-lg text-primary">{c.match.score}%</div>
                  <Bar value={c.match.score} tone={c.match.score >= 70 ? "secondary" : "primary"} />
                  <button
                    type="button"
                    onClick={() => toggleShortlist(opp.id, c.id)}
                    className={on ? "mt-unit-3 w-full px-unit-3 py-unit-2 border border-outline-variant font-label-md text-label-md" : "mt-unit-3 w-full px-unit-3 py-unit-2 bg-primary text-on-primary font-label-md text-label-md font-semibold"}
                  >
                    {on ? "Remove from shortlist" : "Shortlist candidate"}
                  </button>
                </div>
              </div>
            </Panel>
          );
        })}
      </div>

      <div className="mt-unit-6">
        <Explain>The peer cohort is clearly labelled demo data; only the top row is a live profile computed from evidence added in this session.</Explain>
      </div>
    </AppShell>
  );
}
