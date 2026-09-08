import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { Bar, Chip, Explain, PageHeader, Panel, btnGhost, btnPrimary } from "@/components/ui-kit";
import { ASSESSMENTS, skillName, type AssessmentDef } from "@/lib/domain/catalog";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/assessments")({
  head: () => ({
    meta: [
      { title: "Skill Assessments — SkillBridge AI" },
      { name: "description", content: "Take short skill quizzes; scores become assessment evidence and update your competency profile." },
      { property: "og:title", content: "Skill Assessments — SkillBridge AI" },
      { property: "og:description", content: "Quiz scores feed directly into the competency engine as high-weight evidence." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AssessmentsPage,
});

function AssessmentsPage() {
  const { state, profile, addEvidence } = useStore();
  const [active, setActive] = useState<AssessmentDef | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<{ title: string; score: number; skill: string } | null>(null);

  const takenFor = (skill: string) =>
    state.evidence.filter((e) => e.type === "assessment" && e.skills.includes(skill)).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))[0];

  const submit = () => {
    if (!active) return;
    const correct = active.questions.filter((q, i) => answers[i] === q.answer).length;
    const score = Math.round((correct / active.questions.length) * 100);
    addEvidence({
      type: "assessment",
      title: `${active.title} assessment`,
      description: `Scored ${correct}/${active.questions.length} on the in-app ${active.title} quiz. Auto-scored, unproctored — flagged as self-reported.`,
      skills: [active.skill],
      verification: "self-reported",
      score,
      source: "assessment",
    });
    setResult({ title: active.title, score, skill: active.skill });
    setActive(null);
    setAnswers({});
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Step 3b — Validation"
        title="Skill Assessments"
        description="Short auto-scored quizzes. A completed assessment is the highest-weight evidence type in the engine, because the score is measured rather than declared."
      />

      {result && (
        <div className="mb-unit-4 bg-secondary-container text-on-secondary-container px-unit-4 py-unit-3 font-body-sm text-body-sm">
          {result.title}: {result.score}%. Saved as assessment evidence — {skillName(result.skill)} is now{" "}
          {profile.find((c) => c.skill === result.skill)?.score ?? 0}% in your competency profile.
        </div>
      )}

      {active ? (
        <Panel title={active.title} subtitle={`${active.questions.length} questions • ~${active.minutes} min • skill: ${skillName(active.skill)}`}>
          <ol className="space-y-unit-4">
            {active.questions.map((q, qi) => (
              <li key={q.q}>
                <p className="font-label-lg text-label-lg text-on-surface mb-unit-2">
                  {qi + 1}. {q.q}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-2">
                  {q.options.map((opt, oi) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                      className={
                        answers[qi] === oi
                          ? "text-left px-unit-3 py-unit-2 bg-primary text-on-primary font-body-sm text-body-sm"
                          : "text-left px-unit-3 py-unit-2 border border-outline-variant bg-surface-container-lowest font-body-sm text-body-sm hover:bg-surface-container"
                      }
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ol>
          <div className="flex gap-unit-2 mt-unit-6">
            <button type="button" className={btnPrimary} onClick={submit} disabled={Object.keys(answers).length !== active.questions.length}>
              Submit assessment
            </button>
            <button type="button" className={btnGhost} onClick={() => { setActive(null); setAnswers({}); }}>Cancel</button>
          </div>
        </Panel>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-unit-4">
          {ASSESSMENTS.map((a) => {
            const taken = takenFor(a.skill);
            const current = profile.find((c) => c.skill === a.skill)?.score ?? 0;
            return (
              <Panel key={a.id}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">{a.title}</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{a.questions.length} questions • ~{a.minutes} min</p>
                  </div>
                  {taken ? <Chip tone="good">{taken.score}%</Chip> : <Chip>Not taken</Chip>}
                </div>
                <div className="mt-unit-3">
                  <div className="flex justify-between font-code-sm text-code-sm text-on-surface-variant mb-1">
                    <span>{skillName(a.skill)}</span>
                    <span>{current}%</span>
                  </div>
                  <Bar value={current} tone={current >= 75 ? "secondary" : "primary"} />
                </div>
                <button type="button" className={`${btnPrimary} mt-unit-4`} onClick={() => { setActive(a); setResult(null); }}>
                  {taken ? "Retake assessment" : "Start assessment"}
                </button>
              </Panel>
            );
          })}
        </div>
      )}

      <div className="mt-unit-6">
        <Explain>
          Assessment score contributes up to 32 points of raw competency signal (score ÷ 100 × weight), the largest of
          any single evidence type. These quizzes are unproctored demo items — the app never claims they are verified.
        </Explain>
      </div>
    </AppShell>
  );
}
