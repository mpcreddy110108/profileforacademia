import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { btnGhost, Chip, Empty, Explain, inputCls, PageHeader, Panel } from "@/components/ui-kit";
import { supabase } from "@/integrations/supabase/client";
import { skillName } from "@/lib/domain/catalog";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/mentor")({
  head: () => ({
    meta: [
      { title: "Mentor verification — SkillBridge AI" },
      { name: "description", content: "Mentors approve, reject or request changes on student evidence, with comments and a full verification history." },
      { property: "og:title", content: "Mentor verification — SkillBridge AI" },
      { property: "og:description", content: "Human review turns self-reported evidence into verified evidence." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MentorPage,
});

type Row = {
  id: string;
  title: string;
  description: string;
  type: string;
  skills: string[];
  verification: string;
  is_demo: boolean;
  user_id: string;
};

type ReviewRow = { id: string; evidence_id: string; action: string; comment: string; created_at: string };

function MentorPage() {
  const { role, userId } = useStore();
  const [rows, setRows] = useState<Row[]>([]);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [comments, setComments] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [ev, rv] = await Promise.all([
      supabase.from("evidence").select("id,title,description,type,skills,verification,is_demo,user_id").limit(100),
      supabase.from("evidence_reviews").select("id,evidence_id,action,comment,created_at").order("created_at", { ascending: false }),
    ]);
    if (ev.error) setError(ev.error.message);
    setRows((ev.data ?? []) as Row[]);
    setReviews((rv.data ?? []) as ReviewRow[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function review(evidenceId: string, action: "approved" | "rejected" | "changes-requested") {
    if (!userId) return;
    const comment = comments[evidenceId] ?? "";
    const { error: err } = await supabase
      .from("evidence_reviews")
      .insert({ evidence_id: evidenceId, reviewer_id: userId, action, comment });
    if (err) {
      setError(err.message);
      return;
    }
    if (action === "approved") {
      await supabase.from("evidence").update({ verification: "institution-verified" }).eq("id", evidenceId);
    }
    setComments((c) => ({ ...c, [evidenceId]: "" }));
    await load();
  }

  const visible = rows.filter((r) => r.user_id !== userId);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Mentor"
        title="Evidence verification queue"
        description="Only students who switched on evidence sharing appear here. Approving an item marks it institution-verified, which raises its weight in the scoring engine."
      />

      {role !== "mentor" && role !== "institution" && (
        <div className="mb-unit-4">
          <Chip tone="warn">Your account is a {role} account — you can view this queue but reviews will be rejected by the database.</Chip>
        </div>
      )}

      {error && <p className="font-body-sm text-body-sm text-error mb-unit-4">{error}</p>}

      <Panel title="Shared evidence" subtitle={loading ? "Loading…" : `${visible.length} item(s) shared with reviewers`}>
        {loading ? (
          <Empty text="Loading shared evidence…" />
        ) : visible.length === 0 ? (
          <Empty text="No student has shared evidence with reviewers yet." />
        ) : (
          <ul className="space-y-unit-4">
            {visible.map((r) => {
              const history = reviews.filter((v) => v.evidence_id === r.id);
              return (
                <li key={r.id} className="border border-outline-variant p-unit-4">
                  <div className="flex flex-wrap items-center gap-unit-2 mb-1">
                    <span className="font-label-md text-label-md text-on-surface">{r.title}</span>
                    <Chip>{r.type}</Chip>
                    <Chip tone={r.verification === "institution-verified" ? "good" : "neutral"}>{r.verification}</Chip>
                    {r.is_demo && <Chip tone="warn">demo data</Chip>}
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{r.description}</p>
                  <p className="font-code-sm text-code-sm text-on-surface-variant mt-1">
                    {(r.skills ?? []).map((s) => skillName(s as never)).join(", ")}
                  </p>

                  <div className="flex flex-col md:flex-row gap-unit-2 mt-unit-3">
                    <input
                      className={inputCls}
                      placeholder="Comment for the student"
                      value={comments[r.id] ?? ""}
                      onChange={(e) => setComments((c) => ({ ...c, [r.id]: e.target.value }))}
                    />
                    <div className="flex gap-unit-2">
                      <button type="button" className={btnGhost} onClick={() => void review(r.id, "approved")}>Approve</button>
                      <button type="button" className={btnGhost} onClick={() => void review(r.id, "changes-requested")}>Request changes</button>
                      <button type="button" className={btnGhost} onClick={() => void review(r.id, "rejected")}>Reject</button>
                    </div>
                  </div>

                  {history.length > 0 && (
                    <ul className="mt-unit-3 space-y-1">
                      {history.map((h) => (
                        <li key={h.id} className="font-code-sm text-code-sm text-on-surface-variant">
                          {h.created_at.slice(0, 10)} — {h.action}
                          {h.comment ? `: ${h.comment}` : ""}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Panel>

      <div className="mt-unit-6">
        <Explain>
          Verification is a human action recorded in the database with the reviewer, timestamp and comment. The app never
          marks evidence as verified automatically.
        </Explain>
      </div>
    </AppShell>
  );
}
