import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

import { AppShell } from "@/components/AppShell";
import { Chip, Explain, PageHeader, Panel, btnGhost, btnPrimary, inputCls } from "@/components/ui-kit";
import { skillName } from "@/lib/domain/catalog";
import type { EvidenceType } from "@/lib/domain/types";
import { extractResumeEvidence, type ExtractedItem } from "@/lib/resume-extract.functions";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/resume-extractor")({
  head: () => ({
    meta: [
      { title: "AI Resume Skill Extractor — SkillBridge AI" },
      { name: "description", content: "Upload a PDF or paste resume text and let AI turn it into structured evidence that updates your competency profile." },
      { property: "og:title", content: "AI Resume Skill Extractor — SkillBridge AI" },
      { property: "og:description", content: "AI extracts projects, internships and certifications from your resume as reviewable evidence." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResumeExtractor,
});

const SAMPLE = `AARAV V. SHARMA — B.Tech CSE (AI), NIT Warangal

SKILLS: Python, SQL, Pandas, NumPy, scikit-learn, Machine Learning, Docker, Git, Linux, Flask REST APIs, Matplotlib.

EXPERIENCE
Backend Intern, Aeris Softworks (Jun–Aug 2025) — built 12 Flask REST endpoints serving 40k requests/day, containerised services with Docker, deployed on Linux servers.

PROJECTS
Predictive maintenance with machine learning on sensor data (Pandas, NumPy, scikit-learn) — 91% F1 on held-out data.
Placement analytics dashboard with PostgreSQL and Matplotlib visualization used by 300 students.

CERTIFICATIONS
DeepLearning.AI Machine Learning Specialization (2025).`;

/** AI item types are richer than the evidence table's five types. */
const TYPE_MAP: Record<ExtractedItem["type"], EvidenceType> = {
  project: "project",
  internship: "internship",
  course: "certification",
  certification: "certification",
  opensource: "project",
  hackathon: "project",
  publication: "project",
};

function depthTone(score: number) {
  return score >= 7 ? ("good" as const) : score >= 5 ? ("info" as const) : ("warn" as const);
}

function ResumeExtractor() {
  const { addEvidence } = useStore();
  const runExtract = useServerFn(extractResumeEvidence);

  const [text, setText] = useState("");
  const [pdfState, setPdfState] = useState<string | null>(null);
  const [busy, setBusy] = useState<null | string>(null);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<ExtractedItem[] | null>(null);
  const [included, setIncluded] = useState<Record<number, boolean>>({});
  const [saved, setSaved] = useState<string | null>(null);

  const readPdf = async (file: File) => {
    setPdfState("Reading PDF…");
    try {
      const pdfjs = await import("pdfjs-dist");
      const worker = await import("pdfjs-dist/build/pdf.worker.mjs?url");
      pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
      const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
      let out = "";
      for (let i = 1; i <= doc.numPages; i += 1) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        out += content.items.map((it) => ("str" in it ? it.str : "")).join(" ") + "\n";
      }
      setText(out.trim());
      setPdfState(`Read ${doc.numPages} page(s) in your browser — the file itself is not uploaded.`);
    } catch {
      setPdfState("Could not read that PDF. Paste the text instead.");
    }
  };

  const analyse = async () => {
    setBusy("Analysing your resume with AI…");
    setError(null);
    setSaved(null);
    setItems(null);
    try {
      const res = await runExtract({ data: { text } });
      setItems(res.items);
      setIncluded(Object.fromEntries(res.items.map((_, i) => [i, true])));
      if (res.items.length === 0) setError("The AI found no clearly evidenced items in this resume.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Extraction failed. Please try again.");
    } finally {
      setBusy(null);
    }
  };

  const save = async () => {
    if (!items) return;
    const chosen = items.filter((_, i) => included[i]);
    if (!chosen.length) return;
    setBusy(`Saving ${chosen.length} evidence item(s)…`);
    setError(null);
    try {
      for (const item of chosen) {
        await addEvidence({
          type: TYPE_MAP[item.type],
          title: item.title,
          description: `${item.description}\n\n[AI-extracted from resume · reported ${item.type} · depth ${item.depth_score}/10]`,
          skills: item.skills,
          verification: "self-reported",
          source: "resume-extractor",
        });
      }
      setSaved(`${chosen.length} evidence item(s) saved. Your competency scores have been recalculated from the updated portfolio.`);
      setItems(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save the evidence.");
    } finally {
      setBusy(null);
    }
  };

  const chosenCount = items ? items.filter((_, i) => included[i]).length : 0;

  return (
    <AppShell>
      <PageHeader
        eyebrow="Step 3 — Skill extraction"
        title="AI Resume Extractor"
        description="Upload a PDF or paste your resume text. AI reads it and proposes structured evidence — projects, internships, certifications — each with the skills it can actually justify and a depth rating. Nothing is saved until you approve it."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-unit-4">
        <Panel title="Your resume" subtitle="PDF is read in your browser; only the text is sent for analysis">
          <textarea
            className={`${inputCls} h-64 font-code-sm`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your resume here…"
          />
          <div className="mt-unit-3">
            <label className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant" htmlFor="pdf">
              Or upload a PDF resume
            </label>
            <input
              id="pdf"
              type="file"
              accept="application/pdf"
              className={inputCls}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void readPdf(file);
              }}
            />
            {pdfState && <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{pdfState}</p>}
          </div>
          <div className="flex flex-wrap gap-unit-2 mt-unit-3">
            <button type="button" className={btnPrimary} onClick={() => void analyse()} disabled={!text.trim() || busy !== null}>
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              {busy ? "Working…" : "Extract with AI"}
            </button>
            <button type="button" className={btnGhost} onClick={() => { setText(SAMPLE); setItems(null); setSaved(null); }}>
              Load sample resume
            </button>
            <button type="button" className={btnGhost} onClick={() => { setText(""); setItems(null); setSaved(null); }}>
              Clear
            </button>
          </div>
        </Panel>

        <Panel title="Extracted evidence" subtitle="Review and approve before it enters your portfolio">
          {busy && (
            <div className="border border-outline-variant px-unit-3 py-unit-4">
              <div className="flex items-center gap-unit-2">
                <span className="material-symbols-outlined animate-spin text-[20px] text-primary">progress_activity</span>
                <span className="font-label-md text-label-md text-on-surface">{busy}</span>
              </div>
              <div className="mt-unit-3 space-y-unit-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-4 bg-surface-variant animate-pulse" style={{ width: `${90 - i * 18}%` }} />
                ))}
              </div>
            </div>
          )}

          {!busy && error && (
            <p className="bg-error-container text-on-error-container px-unit-3 py-unit-2 font-body-sm text-body-sm">{error}</p>
          )}

          {!busy && saved && (
            <p className="bg-secondary-container text-on-secondary-container px-unit-3 py-unit-2 font-body-sm text-body-sm">
              {saved}
            </p>
          )}

          {!busy && !items && !saved && !error && (
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Add your resume text, then run the extractor to see proposed evidence items.
            </p>
          )}

          {!busy && items && items.length > 0 && (
            <>
              <ul className="space-y-unit-3">
                {items.map((item, i) => {
                  const on = !!included[i];
                  return (
                    <li key={`${item.title}-${i}`} className="border border-outline-variant px-unit-3 py-unit-3">
                      <div className="flex items-start justify-between gap-unit-3">
                        <div className="min-w-0">
                          <p className="font-label-md text-label-md text-on-surface break-words">{item.title}</p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 break-words">{item.description}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIncluded((p) => ({ ...p, [i]: !on }))}
                          className={
                            on
                              ? "shrink-0 px-unit-3 py-1 bg-secondary-container text-on-secondary-container font-label-md text-label-md"
                              : "shrink-0 px-unit-3 py-1 border border-outline-variant text-on-surface-variant font-label-md text-label-md"
                          }
                        >
                          {on ? "Included" : "Excluded"}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-unit-2 mt-unit-2">
                        <Chip tone="info">{item.type}</Chip>
                        <Chip tone={depthTone(item.depth_score)}>depth {item.depth_score}/10</Chip>
                        <Chip tone="warn">self-declared</Chip>
                        {item.skills.map((s) => (
                          <Chip key={s}>{skillName(s)}</Chip>
                        ))}
                        {item.skills.length === 0 && (
                          <span className="font-body-sm text-body-sm text-on-surface-variant">no catalog skill clearly evidenced</span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-unit-4 flex flex-wrap gap-unit-2 items-center">
                <button type="button" className={btnPrimary} onClick={() => void save()} disabled={!chosenCount}>
                  Save {chosenCount} item(s) as evidence
                </button>
                <Chip tone="warn">Saved as self-reported until a mentor verifies it</Chip>
              </div>
            </>
          )}
        </Panel>
      </div>

      <div className="mt-unit-6">
        <Explain>
          The AI only proposes items; it cannot verify them. Skills are restricted to the fixed catalog, and the depth
          rating reflects how much concrete detail the resume gives. Once saved, scoring is done by the same transparent
          rule-based engine used everywhere else — evidence type, verification status, detail, recency and outcomes.
        </Explain>
      </div>
    </AppShell>
  );
}
