import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { Bar, Chip, Explain, PageHeader, Panel, Stat } from "@/components/ui-kit";
import { assetForSkill, roleById, skillName } from "@/lib/domain/catalog";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/learning-path")({
  head: () => ({
    meta: [
      { title: "Learning Path — SkillBridge AI" },
      { name: "description", content: "A personalised learning path generated from your actual skill gaps, with courses, projects and progress tracking." },
      { property: "og:title", content: "Learning Path — SkillBridge AI" },
      { property: "og:description", content: "Close mandatory gaps step by step; completed steps raise your readiness score." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LearningPathPage,
});

function LearningPathPage() {
  const { learningPath, state, toggleLearningStep, readiness, fit } = useStore();
  const role = roleById(state.targetRoleId);
  const done = learningPath.filter((s) => s.completed).length;
  const completedSkills = state.completedLearning.map((c) => c.skill);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Step 6 — Learning action"
        title="Personalised Learning Path"
        description={`Generated from your live gaps for ${role.title}. Marking a step complete adds learning signal to that competency and updates your readiness index.`}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-unit-4 mb-unit-6">
        <Stat label="Open steps" value={`${learningPath.length - done}`} />
        <Stat label="Completed steps" value={`${done + completedSkills.filter((s) => !learningPath.some((l) => l.skill === s)).length}`} tone="good" />
        <Stat label="Mandatory gaps left" value={`${fit.mandatoryGaps.length}`} tone={fit.mandatoryGaps.length ? "bad" : "good"} />
        <Stat label="Readiness index" value={`${readiness.index}%`} hint={readiness.band} />
      </div>

      {learningPath.length === 0 ? (
        <Panel title="Nothing to learn right now">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            You satisfy every requirement for {role.title}. Pick a harder target role on the Skill-Gap page to generate a new path.
          </p>
        </Panel>
      ) : (
        <div className="space-y-unit-4">
          {learningPath.map((step, i) => {
            const asset = assetForSkill(step.skill);
            return (
              <Panel key={step.skill}>
                <div className="flex flex-col lg:flex-row lg:items-start gap-unit-4 justify-between">
                  <div className="flex gap-unit-4">
                    <div className="w-9 h-9 flex-shrink-0 bg-primary text-on-primary flex items-center justify-center font-headline-sm text-headline-sm">{i + 1}</div>
                    <div>
                      <div className="flex flex-wrap items-center gap-unit-2">
                        <h3 className="font-headline-sm text-headline-sm text-on-surface">{skillName(step.skill)}</h3>
                        <Chip tone={step.priority === "High" ? "bad" : "warn"}>{step.priority} priority</Chip>
                        {asset && <Chip>{asset.difficulty}</Chip>}
                        {step.completed && <Chip tone="good">Completed</Chip>}
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 max-w-2xl">
                        {asset?.why ?? "Required by your target role."}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-3 mt-unit-3">
                        <div className="border border-outline-variant p-unit-3 bg-surface-container-low">
                          <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Recommended course</span>
                          <p className="font-label-lg text-label-lg text-on-surface mt-1">{asset?.course.title ?? "Self-study"}</p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">{asset?.course.provider} • {asset?.course.hours} hrs</p>
                        </div>
                        <div className="border border-outline-variant p-unit-3 bg-surface-container-low">
                          <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Recommended project</span>
                          <p className="font-label-lg text-label-lg text-on-surface mt-1">{asset?.project.title ?? "Build something with this skill"}</p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">{asset?.project.brief}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-64 flex-shrink-0">
                    <div className="flex justify-between font-code-sm text-code-sm text-on-surface-variant mb-1">
                      <span>{step.current}% now</span>
                      <span>{step.required}% needed</span>
                    </div>
                    <Bar value={step.current} target={step.required} tone={step.completed ? "secondary" : "error"} />
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Gap of {step.gap} points.</p>
                    <button
                      type="button"
                      onClick={() => toggleLearningStep(step.skill)}
                      className={
                        step.completed
                          ? "mt-unit-3 w-full px-unit-3 py-unit-2 border border-outline-variant font-label-md text-label-md"
                          : "mt-unit-3 w-full px-unit-3 py-unit-2 bg-primary text-on-primary font-label-md text-label-md font-semibold"
                      }
                    >
                      {step.completed ? "Mark as not done" : "Mark step complete"}
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
          Completing a step is self-reported and adds a modest learning signal (10 raw points) to that competency.
          To move a score decisively, add the recommended project as verified evidence in your portfolio.
        </Explain>
      </div>
    </AppShell>
  );
}
