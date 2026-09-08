import { createFileRoute, Link } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { Chip, Explain, PageHeader, Panel, Stat, btnGhost } from "@/components/ui-kit";
import { useStore } from "@/lib/store";
import type { ApplicationStatus } from "@/lib/domain/types";

export const Route = createFileRoute("/applications")({
  head: () => ({
    meta: [
      { title: "Application Tracker — SkillBridge AI" },
      { name: "description", content: "Track saved, applied, shortlisted, interview, selected and rejected applications in one pipeline." },
      { property: "og:title", content: "Application Tracker — SkillBridge AI" },
      { property: "og:description", content: "A working pipeline from saved opportunity to final outcome." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ApplicationsPage,
});

const STAGES: ApplicationStatus[] = ["saved", "applied", "shortlisted", "interview", "selected", "rejected"];

function ApplicationsPage() {
  const { state, opportunities, matches, setApplicationStatus, removeApplication } = useStore();
  const apps = state.applications;
  const count = (s: ApplicationStatus) => apps.filter((a) => a.status === s).length;

  return (
    <AppShell>
      <PageHeader
        eyebrow="Step 8 — Applications"
        title="Application Tracker"
        description="Everything you save or apply to from the Opportunity Matcher lands here. Move a card through the pipeline to keep your status current."
      />

      <div className="grid grid-cols-2 md:grid-cols-6 gap-unit-3 mb-unit-6">
        {STAGES.map((s) => (
          <Stat key={s} label={s} value={`${count(s)}`} tone={s === "selected" ? "good" : s === "rejected" ? "bad" : undefined} />
        ))}
      </div>

      {apps.length === 0 ? (
        <Panel title="No applications yet">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Head to the matcher and save or apply to an opportunity.{" "}
            <Link to="/opportunities" className="text-primary underline">Open Opportunity Matcher →</Link>
          </p>
        </Panel>
      ) : (
        <div className="space-y-unit-4">
          {apps.map((a) => {
            const opp = opportunities.find((o) => o.id === a.opportunityId);
            const m = matches[a.opportunityId];
            if (!opp) return null;
            return (
              <Panel key={a.id}>
                <div className="flex flex-col lg:flex-row justify-between gap-unit-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-unit-2">
                      <h3 className="font-headline-sm text-headline-sm text-on-surface">{opp.role}</h3>
                      <Chip tone="info">{opp.company}</Chip>
                      <Chip tone={a.status === "selected" ? "good" : a.status === "rejected" ? "bad" : "warn"}>{a.status}</Chip>
                      {m && <Chip>{m.score}% match</Chip>}
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      Last updated {a.updatedAt} • {opp.location} • {opp.stipend}
                    </p>
                    <p className="font-code-sm text-code-sm text-on-surface-variant mt-unit-2">
                      History: {a.history.map((h) => `${h.status} (${h.at})`).join(" → ")}
                    </p>
                  </div>
                  <div className="flex flex-col gap-unit-2 lg:w-96">
                    <div className="flex flex-wrap gap-unit-1">
                      {STAGES.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setApplicationStatus(a.opportunityId, s)}
                          className={
                            a.status === s
                              ? "px-unit-2 py-1 bg-primary text-on-primary font-label-md text-label-md"
                              : "px-unit-2 py-1 border border-outline-variant text-on-surface-variant font-label-md text-label-md hover:bg-surface-container"
                          }
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    <button type="button" className={btnGhost} onClick={() => removeApplication(a.opportunityId)}>
                      Withdraw / remove
                    </button>
                  </div>
                </div>
              </Panel>
            );
          })}
        </div>
      )}

      <div className="mt-unit-6">
        <Explain>
          Statuses are student-maintained in this demo. Recruiter shortlisting in the recruiter workspace is tracked
          separately so the two sides of the marketplace stay honest about what is real.
        </Explain>
      </div>
    </AppShell>
  );
}
