import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { Chip, Explain, PageHeader, Panel, btnGhost, btnPrimary, inputCls } from "@/components/ui-kit";
import { skillName } from "@/lib/domain/catalog";
import { extractSkillsFromText } from "@/lib/domain/engine";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/resume-extractor")({
  head: () => ({
    meta: [
      { title: "Resume Skill Extractor — SkillBridge AI" },
      { name: "description", content: "Paste resume text and extract skills against the catalog, then store the result as evidence." },
      { property: "og:title", content: "Resume Skill Extractor — SkillBridge AI" },
      { property: "og:description", content: "Transparent keyword extraction that turns resume text into competency evidence." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResumeExtractor,
});

const SAMPLE = `AARAV V. SHARMA — B.Tech CSE (AI), NIT Warangal

SKILLS: Python, SQL, Pandas, NumPy, scikit-learn, Machine Learning, Docker, Git, Linux, Flask REST APIs, Matplotlib.

EXPERIENCE
Backend Intern, Aeris Softworks — built Flask REST endpoints, containerised services with Docker, worked on Linux servers.

PROJECTS
Predictive maintenance with machine learning on sensor data (Pandas, NumPy, scikit-learn).
Placement analytics dashboard with PostgreSQL and Matplotlib visualization.`;

function ResumeExtractor() {
  const { addEvidence } = useStore();
  const [text, setText] = useState("");
  const [results, setResults] = useState<{ skill: string; matchedTerm: string }[] | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [saved, setSaved] = useState<string | null>(null);
  const [pdfState, setPdfState] = useState<string | null>(null);

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

  const run = () => {
    const found = extractSkillsFromText(text);
    setResults(found);
    setSelected(found.map((f) => f.skill));
    setSaved(null);
  };

  const save = () => {
    if (!selected.length) return;
    addEvidence({
      type: "resume",
      title: "Resume upload — extracted skills",
      description: `Skills extracted from pasted resume text (${text.trim().split(/\s+/).length} words). Extraction is keyword/alias based against the skill catalog.`,
      skills: selected,
      verification: "self-reported",
      source: "resume-extractor",
    });
    setSaved(`Stored as resume evidence covering ${selected.map(skillName).join(", ")}. Your competency profile has been recalculated.`);
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Step 3 — Skill extraction"
        title="Resume AI Extractor"
        description="Paste your resume text. The extractor matches it against the 21-skill catalog and its aliases, shows you exactly which term triggered each match, and lets you confirm before anything enters your profile."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-unit-4">
        <Panel title="Resume text" subtitle="Paste plain text — no file is uploaded anywhere in this demo">
          <textarea className={`${inputCls} h-72 font-code-sm`} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste your resume here…" />
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
            <button type="button" className={btnPrimary} onClick={run} disabled={!text.trim()}>
              <span className="material-symbols-outlined text-[18px]">document_scanner</span> Extract skills
            </button>
            <button type="button" className={btnGhost} onClick={() => { setText(SAMPLE); setResults(null); }}>Load sample resume</button>
            <button type="button" className={btnGhost} onClick={() => { setText(""); setResults(null); }}>Clear</button>
          </div>
        </Panel>

        <Panel title="Extraction result" subtitle="Confirm the skills you want to keep">
          {results === null ? (
            <p className="font-body-sm text-body-sm text-on-surface-variant">Run the extractor to see matches.</p>
          ) : results.length === 0 ? (
            <p className="font-body-sm text-body-sm text-on-surface-variant">No catalog skills matched this text.</p>
          ) : (
            <>
              <ul className="space-y-unit-2">
                {results.map((r) => {
                  const on = selected.includes(r.skill);
                  return (
                    <li key={r.skill} className="flex items-center justify-between border border-outline-variant px-unit-3 py-unit-2">
                      <div>
                        <span className="font-label-md text-label-md text-on-surface">{skillName(r.skill)}</span>
                        <p className="font-code-sm text-code-sm text-on-surface-variant">matched on “{r.matchedTerm}”</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelected((p) => (on ? p.filter((x) => x !== r.skill) : [...p, r.skill]))}
                        className={on ? "px-unit-3 py-1 bg-secondary-container text-on-secondary-container font-label-md text-label-md" : "px-unit-3 py-1 border border-outline-variant text-on-surface-variant font-label-md text-label-md"}
                      >
                        {on ? "Included" : "Excluded"}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-unit-4 flex flex-wrap gap-unit-2 items-center">
                <button type="button" className={btnPrimary} onClick={save} disabled={!selected.length}>
                  Save as evidence ({selected.length})
                </button>
                <Chip tone="warn">Resume evidence carries low weight until backed by a project or certificate</Chip>
              </div>
            </>
          )}
          {saved && <p className="mt-unit-3 bg-secondary-container text-on-secondary-container px-unit-3 py-unit-2 font-body-sm text-body-sm">{saved}</p>}
        </Panel>
      </div>

      <div className="mt-unit-6">
        <Explain>
          This is deterministic keyword/alias matching, not semantic NLP. The architecture keeps extraction behind a
          single function so it can later be swapped for a server-side NLP model with pgvector embeddings without
          touching the UI.
        </Explain>
      </div>
    </AppShell>
  );
}
