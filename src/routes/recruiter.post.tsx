import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { Chip, Explain, PageHeader, Panel, btnPrimary, inputCls } from "@/components/ui-kit";
import { SKILLS, skillName } from "@/lib/domain/catalog";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/recruiter/post")({
  head: () => ({
    meta: [
      { title: "Post an Opportunity — SkillBridge AI Recruiter" },
      { name: "description", content: "Post a role with required and preferred skills; candidates are matched instantly against evidence-backed competencies." },
      { property: "og:title", content: "Post an Opportunity — SkillBridge AI Recruiter" },
      { property: "og:description", content: "Recruiter workspace for posting roles and matching verified student competencies." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RecruiterPost,
});

function RecruiterPost() {
  const { addOpportunity, state, opportunities } = useStore();
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("Remote");
  const [stipend, setStipend] = useState("");
  const [description, setDescription] = useState("");
  const [required, setRequired] = useState<{ skill: string; level: number }[]>([]);
  const [preferred, setPreferred] = useState<string[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  const toggleRequired = (skill: string) =>
    setRequired((p) => (p.some((r) => r.skill === skill) ? p.filter((r) => r.skill !== skill) : [...p, { skill, level: 70 }]));

  const submit = () => {
    if (!company.trim() || !role.trim() || required.length === 0) {
      setMsg("Company, role title and at least one required skill are needed.");
      return;
    }
    addOpportunity({
      company: company.trim(),
      role: role.trim(),
      location,
      type: "Internship",
      stipend: stipend.trim() || "Not disclosed",
      required,
      preferred,
      description: description.trim() || "No description provided.",
    });
    setMsg(`Posted ${role.trim()} at ${company.trim()}. Candidates are now ranked against it.`);
    setCompany(""); setRole(""); setStipend(""); setDescription(""); setRequired([]); setPreferred([]);
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Recruiter workspace"
        title="Post an Opportunity"
        description="Define required skills with thresholds and preferred skills. Matching runs immediately against the demo student cohort plus the live student profile."
        right={<Link to="/recruiter/candidates" className={btnPrimary}>View matched candidates →</Link>}
      />

      {msg && <div className="mb-unit-4 bg-secondary-container text-on-secondary-container px-unit-4 py-unit-3 font-body-sm text-body-sm">{msg}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-unit-4">
        <Panel title="Job details">
          <div className="space-y-unit-3">
            <input className={inputCls} placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
            <input className={inputCls} placeholder="Role title" value={role} onChange={(e) => setRole(e.target.value)} />
            <div className="grid grid-cols-2 gap-unit-3">
              <input className={inputCls} placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
              <input className={inputCls} placeholder="Stipend / CTC" value={stipend} onChange={(e) => setStipend(e.target.value)} />
            </div>
            <textarea className={`${inputCls} h-24`} placeholder="What the intern will work on…" value={description} onChange={(e) => setDescription(e.target.value)} />
            <button type="button" className={btnPrimary} onClick={submit}>Post opportunity</button>
          </div>
        </Panel>

        <Panel title="Skill requirements" subtitle="Click to add, then set the minimum competency level">
          <div className="flex flex-wrap gap-unit-1 max-h-40 overflow-y-auto border border-outline-variant p-unit-2 bg-surface-container-low">
            {SKILLS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => toggleRequired(s.id)}
                className={required.some((r) => r.skill === s.id) ? "px-unit-2 py-1 bg-primary text-on-primary font-label-md text-label-md" : "px-unit-2 py-1 border border-outline-variant text-on-surface-variant font-label-md text-label-md"}
              >
                {s.name}
              </button>
            ))}
          </div>

          {required.map((r) => (
            <div key={r.skill} className="flex items-center gap-unit-3 mt-unit-3">
              <span className="font-label-md text-label-md w-56">{skillName(r.skill)}</span>
              <input
                type="range" min={30} max={95} step={5} value={r.level}
                onChange={(e) => setRequired((p) => p.map((x) => (x.skill === r.skill ? { ...x, level: Number(e.target.value) } : x)))}
                className="flex-1"
              />
              <span className="font-code-sm text-code-sm w-12 text-right">{r.level}%</span>
            </div>
          ))}

          <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant block mt-unit-4 mb-unit-2">Preferred skills</span>
          <div className="flex flex-wrap gap-unit-1 max-h-32 overflow-y-auto border border-outline-variant p-unit-2 bg-surface-container-low">
            {SKILLS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setPreferred((p) => (p.includes(s.id) ? p.filter((x) => x !== s.id) : [...p, s.id]))}
                className={preferred.includes(s.id) ? "px-unit-2 py-1 bg-secondary-container text-on-secondary-container font-label-md text-label-md" : "px-unit-2 py-1 border border-outline-variant text-on-surface-variant font-label-md text-label-md"}
              >
                {s.name}
              </button>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Your posted roles" subtitle={`${state.recruiterOpportunities.length} posted in this session • ${opportunities.length} total in the marketplace`} className="mt-unit-6">
        {state.recruiterOpportunities.length === 0 ? (
          <p className="font-body-sm text-body-sm text-on-surface-variant">Nothing posted yet.</p>
        ) : (
          <ul className="space-y-unit-2">
            {state.recruiterOpportunities.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center gap-unit-2 border border-outline-variant px-unit-3 py-unit-2">
                <span className="font-label-lg text-label-lg text-on-surface">{o.role}</span>
                <Chip tone="info">{o.company}</Chip>
                {o.required.map((r) => <Chip key={r.skill}>{skillName(r.skill)} ≥ {r.level}%</Chip>)}
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <div className="mt-unit-6">
        <Explain>Candidate matching uses the same engine students see, so a recruiter's score and a student's score for the same posting always agree.</Explain>
      </div>
    </AppShell>
  );
}
