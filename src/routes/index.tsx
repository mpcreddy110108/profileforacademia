import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

type Skill = { name: string; cur: string; req: string; status: string; priority: string; priorityColor: string };
type RoleKey = "ml" | "fs" | "da";

const SAT = "text-secondary bg-secondary-container";
const CRIT = "text-on-error-container bg-error-container";
const MED = "text-on-tertiary-container bg-surface-container-highest";

const roleData: Record<RoleKey, { title: string; fit: string; skills: Skill[] }> = {
  ml: {
    title: "ML Engineer Intern",
    fit: "88%",
    skills: [
      { name: "Python Architecture", cur: "94%", req: "85%", status: "Verified Repo", priority: "Satisfied", priorityColor: SAT },
      { name: "Data Structures & Algo", cur: "88%", req: "80%", status: "Proctored Quiz", priority: "Satisfied", priorityColor: SAT },
      { name: "PyTorch / Deep Learning", cur: "38%", req: "80%", status: "Zero Evidence", priority: "Critical", priorityColor: CRIT },
      { name: "Cloud Infra (AWS)", cur: "25%", req: "60%", status: "Self-Reported", priority: "Medium", priorityColor: MED },
      { name: "SQL Querying", cur: "86%", req: "70%", status: "NPTEL Cert", priority: "Satisfied", priorityColor: SAT },
      { name: "Docker / Packaging", cur: "65%", req: "60%", status: "Coursework", priority: "Satisfied", priorityColor: SAT },
    ],
  },
  fs: {
    title: "Full Stack Developer",
    fit: "74%",
    skills: [
      { name: "Python Architecture", cur: "94%", req: "75%", status: "Verified Repo", priority: "Satisfied", priorityColor: SAT },
      { name: "SQL Querying", cur: "86%", req: "80%", status: "NPTEL Cert", priority: "Satisfied", priorityColor: SAT },
      { name: "React / Frontend UI", cur: "40%", req: "85%", status: "Basic Labs", priority: "Critical", priorityColor: CRIT },
      { name: "Node.js / Express", cur: "55%", req: "75%", status: "Mini Project", priority: "Medium", priorityColor: MED },
      { name: "Git & Deployment", cur: "72%", req: "70%", status: "Hackathon", priority: "Satisfied", priorityColor: SAT },
      { name: "REST APIs & GraphQL", cur: "60%", req: "75%", status: "Coursework", priority: "Medium", priorityColor: MED },
    ],
  },
  da: {
    title: "Data Analyst",
    fit: "94%",
    skills: [
      { name: "SQL Querying & DDL", cur: "86%", req: "80%", status: "NPTEL Cert", priority: "Satisfied", priorityColor: SAT },
      { name: "Python Data Analysis", cur: "94%", req: "80%", status: "Verified Repo", priority: "Satisfied", priorityColor: SAT },
      { name: "Data Visualization", cur: "82%", req: "75%", status: "Capstone CNN", priority: "Satisfied", priorityColor: SAT },
      { name: "Statistical Testing", cur: "79%", req: "70%", status: "Academic Major", priority: "Satisfied", priorityColor: SAT },
      { name: "Tableau / BI Tooling", cur: "45%", req: "60%", status: "Coursework", priority: "Medium", priorityColor: MED },
    ],
  },
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ApexForge SkillBridge AI — Competency Hub" },
      {
        name: "description",
        content:
          "Student competency hub with verified skills, evidence portfolio, skill-gap analysis and matched internship opportunities.",
      },
      { property: "og:title", content: "ApexForge SkillBridge AI — Competency Hub" },
      {
        property: "og:description",
        content:
          "Verified competencies, evidence anchors, skill gaps and opportunity matches in one placement-readiness dashboard.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CompetencyHub,
});

function CompetencyHub() {
  const [view, setView] = useState<"bars" | "radar">("bars");
  const [role, setRole] = useState<RoleKey>("ml");
  const [bannerOpen, setBannerOpen] = useState(true);
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [modal, setModal] = useState<{ company: string; role: string; score: number; explanation: string } | null>(null);
  const active = roleData[role];
  const roleBtn = (k: RoleKey) =>
    k === role
      ? "px-unit-2 py-1.5 font-label-sm text-label-sm bg-primary text-on-primary font-bold shadow-xs truncate"
      : "px-unit-2 py-1.5 font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface font-semibold truncate";
  const viewBtn = (v: "bars" | "radar") =>
    v === view
      ? "px-unit-3 py-1 font-label-md text-label-md bg-surface-container-lowest text-primary font-semibold shadow-xs"
      : "px-unit-3 py-1 font-label-md text-label-md text-on-surface-variant hover:text-on-surface";

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased">
<aside className="fixed left-0 top-0 bottom-8 w-72 bg-surface-container-lowest z-40 flex flex-col border-r border-outline-variant"><div className="h-16 px-unit-4 flex items-center justify-between border-b border-outline-variant bg-surface-container-low"><div className="flex items-center gap-unit-2"><div className="w-8 h-8 bg-primary text-on-primary flex items-center justify-center font-headline-sm text-headline-sm">AF</div><div className="flex flex-col"><span className="font-headline-sm text-headline-sm text-primary tracking-tight leading-none">ApexForge</span><span className="font-code-sm text-code-sm text-on-surface-variant leading-tight">SkillBridge AI</span></div></div><span className="font-label-sm text-label-sm px-unit-1 py-0.5 bg-secondary-container text-on-secondary-container font-semibold">SIH26044</span></div><div className="flex-1 overflow-y-auto py-unit-4 px-unit-3 space-y-unit-6"><nav className="space-y-unit-1" data-active-classes="bg-primary-container text-on-primary-container font-semibold"><div className="px-unit-2 pb-unit-1 flex items-center justify-between"><span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Student Portal</span><span className="font-code-sm text-code-sm text-on-surface-variant">v2.4</span></div><a aria-current="page" className="flex items-center gap-unit-3 px-unit-3 py-unit-2 transition-colors bg-primary-container text-on-primary-container font-semibold" data-path="competency-hub" href="#"><span className="material-symbols-outlined text-[18px]">verified</span><span className="font-label-md text-label-md">Competency Hub</span></a><a className="flex items-center gap-unit-3 px-unit-3 py-unit-2 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors" data-path="evidence-portfolio" href="#"><span className="material-symbols-outlined text-[18px]">folder_special</span><span className="font-label-md text-label-md">Evidence Portfolio</span></a><a className="flex items-center gap-unit-3 px-unit-3 py-unit-2 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors" data-path="resume-ai-extractor" href="#"><span className="material-symbols-outlined text-[18px]">document_scanner</span><span className="font-label-md text-label-md">Resume AI Extractor</span></a><a className="flex items-center gap-unit-3 px-unit-3 py-unit-2 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors" data-path="skill-assessments" href="#"><span className="material-symbols-outlined text-[18px]">quiz</span><span className="font-label-md text-label-md">Skill Assessments</span></a><a className="flex items-center gap-unit-3 px-unit-3 py-unit-2 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors" data-path="skill-gap-analysis" href="#"><span className="material-symbols-outlined text-[18px]">troubleshoot</span><span className="font-label-md text-label-md">Skill-Gap Analysis</span></a><a className="flex items-center gap-unit-3 px-unit-3 py-unit-2 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors" data-path="personalized-learning-path" href="#"><span className="material-symbols-outlined text-[18px]">route</span><span className="font-label-md text-label-md">Learning Path</span></a><a className="flex items-center gap-unit-3 px-unit-3 py-unit-2 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors" data-path="opportunity-matcher" href="#"><span className="material-symbols-outlined text-[18px]">hub</span><span className="font-label-md text-label-md">Opportunity Matcher</span></a><a className="flex items-center gap-unit-3 px-unit-3 py-unit-2 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors" data-path="application-tracker" href="#"><span className="material-symbols-outlined text-[18px]">terminal</span><span className="font-label-md text-label-md">Application Tracker</span></a><a className="flex items-center gap-unit-3 px-unit-3 py-unit-2 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors" data-path="career-readiness" href="#"><span className="material-symbols-outlined text-[18px]">speed</span><span className="font-label-md text-label-md">Career Readiness</span></a></nav><nav className="space-y-unit-1" data-active-classes="bg-primary-container text-on-primary-container font-semibold"><div className="px-unit-2 pb-unit-1 flex items-center justify-between"><span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Recruiter Workspace</span><span className="font-code-sm text-code-sm text-secondary font-semibold">LIVE SYNC</span></div><a className="flex items-center gap-unit-3 px-unit-3 py-unit-2 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors" data-path="jd-extractor-matcher" href="#"><span className="material-symbols-outlined text-[18px]">data_object</span><span className="font-label-md text-label-md">JD Extractor &amp; Matcher</span></a><a className="flex items-center gap-unit-3 px-unit-3 py-unit-2 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors" data-path="candidate-shortlist" href="#"><span className="material-symbols-outlined text-[18px]">fact_check</span><span className="font-label-md text-label-md">Candidate Shortlist</span></a><a className="flex items-center gap-unit-3 px-unit-3 py-unit-2 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors" data-path="industry-programs" href="#"><span className="material-symbols-outlined text-[18px]">handshake</span><span className="font-label-md text-label-md">Industry Programs</span></a></nav><nav className="space-y-unit-1" data-active-classes="bg-primary-container text-on-primary-container font-semibold"><div className="px-unit-2 pb-unit-1 flex items-center justify-between"><span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Institution Admin</span><span className="font-code-sm text-code-sm text-primary">ANALYTICS</span></div><a className="flex items-center gap-unit-3 px-unit-3 py-unit-2 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors" data-path="institution-skill-gap-analytics" href="#"><span className="material-symbols-outlined text-[18px]">analytics</span><span className="font-label-md text-label-md">Skill Gap Analytics</span></a><a className="flex items-center gap-unit-3 px-unit-3 py-unit-2 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors" data-path="demand-vs-readiness" href="#"><span className="material-symbols-outlined text-[18px]">compare_arrows</span><span className="font-label-md text-label-md">Demand vs Readiness</span></a><a className="flex items-center gap-unit-3 px-unit-3 py-unit-2 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors" data-path="training-planning" href="#"><span className="material-symbols-outlined text-[18px]">calendar_month</span><span className="font-label-md text-label-md">Training Planning</span></a></nav></div><div className="p-unit-3 border-t border-outline-variant bg-surface-container-low"><div className="flex items-center justify-between"><div className="flex items-center gap-unit-2"><span className="w-2 h-2 bg-secondary"></span><span className="font-code-sm text-code-sm text-on-surface font-semibold">XAI Engine v4.8</span></div><span className="font-code-sm text-code-sm text-on-surface-variant">99.4% VERIFIED</span></div></div></aside><div className="pl-72"><header className="fixed top-0 left-72 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant z-30 flex items-center justify-between px-unit-6"><div className="flex items-center gap-unit-4 flex-1 max-w-lg"><div className="relative w-full"><span className="material-symbols-outlined absolute left-unit-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span><input className="w-full bg-surface-container-low border border-outline-variant pl-9 pr-unit-3 py-1.5 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary" placeholder="Query by CIP Code, Skill ID, Roll Number, or JD Schema..." type="text"/></div></div><div className="flex items-center gap-unit-4"><div className="hidden lg:flex items-center border border-outline-variant bg-surface-container-low"><span className="font-label-sm text-label-sm px-unit-2 py-1 uppercase text-on-surface-variant border-r border-outline-variant">View As:</span><button className="px-unit-3 py-1 font-label-md text-label-md bg-primary text-on-primary font-semibold" type="button">Student</button><button className="px-unit-3 py-1 font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" type="button">Recruiter</button><button className="px-unit-3 py-1 font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" type="button">Institution</button></div><button className="relative p-unit-2 text-on-surface-variant hover:text-on-surface border border-outline-variant bg-surface-container-lowest" type="button"><span className="material-symbols-outlined text-[20px] block">notifications</span><span className="absolute top-1 right-1 w-2 h-2 bg-error"></span></button><div className="flex items-center gap-unit-3 pl-unit-2 border-l border-outline-variant"><div className="flex flex-col text-right hidden sm:block"><span className="font-label-md text-label-md text-on-surface font-semibold leading-none">Aarav V. Sharma</span><span className="font-code-sm text-code-sm text-on-surface-variant leading-tight">B.Tech CSE • 8th Sem</span></div><div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span className="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main className="relative pt-16 pb-12 w-full px-unit-6 bg-surface min-h-screen"><div className="flex flex-col w-full">

<div className="relative w-full bg-surface-container-lowest p-unit-6 shadow-sm overflow-hidden mb-unit-6">
<div className="absolute -right-16 -top-16 w-80 h-80 bg-primary/5 rounded-full pointer-events-none"></div>
<div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-unit-6 relative z-10">
<div className="flex items-start md:items-center gap-unit-6">
<div className="relative w-20 h-20 bg-surface-container-high flex items-center justify-center overflow-hidden flex-shrink-0">
<img className="w-full h-full object-cover" data-alt="Close up professional portrait of Aarav Sharma, a young Indian engineering student in smart casual navy blazer in modern computer science lab ambient lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAq2H-CjLCj3v3VA-rZelhmOcJHzkUTJsISafegSyBxhWRjbIu-0akdyH_9MZvhG9ClxMdF0gAA40HAurWumqsXS-SRAqkgrtjBhMghOc0s47YT0lG2gW_WB8nv8nHSiOo4XIVPC_x81dmzx2nn3xfsNDLnKULYSo3WfJoq74hN_GzhnrVsse8_YmNQ1unZ_xQAtq_23MSZN5IMc7BZ51HfGbu6cD3N5Anytc3XJMMsyn1ljFJ4H7Vm-w"/>
<span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-secondary"></span>
</div>
<div className="flex flex-col">
<div className="flex flex-wrap items-center gap-unit-3">
<h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Aarav V. Sharma</h1>
<span className="font-label-sm text-label-sm px-unit-2 py-0.5 bg-surface-container text-primary font-bold">UID: STU-2023-8841</span>
<span className="font-label-sm text-label-sm px-unit-2 py-0.5 bg-secondary-container text-on-secondary-container font-semibold">VERIFIED CADRE: TIER-1 NIT</span>
</div>
<p className="font-body-md text-body-md text-on-surface-variant mt-1">
            B.Tech Computer Science &amp; Engineering • 6th Semester • Major Specialization: Artificial Intelligence
          </p>
<div className="flex flex-wrap items-center gap-unit-4 mt-unit-2 text-on-surface-variant">
<span className="font-code-sm text-code-sm flex items-center gap-1">
<span className="material-symbols-outlined text-[15px] text-primary">target</span>
              TARGET ROLE: <strong className="text-on-surface">ML Engineer Intern</strong>
</span>
<span className="font-code-sm text-code-sm flex items-center gap-1">
<span className="material-symbols-outlined text-[15px] text-secondary">database</span>
              CIP SPEC: 11.0102 (AI &amp; Robotics)
            </span>
<span className="font-code-sm text-code-sm flex items-center gap-1">
<span className="material-symbols-outlined text-[15px] text-tertiary-container">update</span>
              LAST SYNC: TODAY, 09:42 UTC
            </span>
</div>
</div>
</div>

<div className="flex items-center gap-unit-6 bg-surface-container-low p-unit-4 flex-shrink-0 w-full xl:w-auto justify-between xl:justify-start">
<div className="relative w-16 h-16 flex items-center justify-center">
<svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
<path className="text-surface-container-high" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5"/>
<path className="text-secondary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="78, 100" strokeLinecap="butt" strokeWidth="3.5"/>
</svg>
<span className="absolute font-headline-sm text-headline-sm text-on-surface font-bold">78<span className="text-xs">%</span></span>
</div>
<div className="flex flex-col">
<div className="flex items-center gap-unit-2">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Readiness Index</span>
<span className="w-2 h-2 rounded-full bg-secondary"></span>
</div>
<span className="font-headline-sm text-headline-sm text-secondary font-bold">Placement Ready</span>
<span className="font-code-sm text-code-sm text-on-surface-variant">Velocity: Accelerating (+6% / 14d)</span>
</div>
<button className="px-unit-3 py-unit-2 bg-primary text-on-primary font-label-md text-label-md flex items-center gap-unit-2 hover:bg-primary-container transition-all" id="downloadDossierBtn">
<span className="material-symbols-outlined text-[16px]">verified_user</span>
<span>Dossier PDF</span>
</button>
</div>
</div>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-unit-4 mb-unit-6">
<div className="bg-surface-container-lowest p-unit-4 shadow-sm flex flex-col justify-between">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm uppercase text-on-surface-variant tracking-wider">Verified Competencies</span>
<span className="material-symbols-outlined text-[20px] text-primary">fact_check</span>
</div>
<div className="mt-unit-3 flex items-baseline gap-unit-2">
<span className="font-display-lg text-display-lg text-on-surface font-bold">14</span>
<span className="font-headline-sm text-headline-sm text-on-surface-variant">/ 18</span>
</div>
<div className="mt-unit-2 flex items-center justify-between text-code-sm font-code-sm">
<span className="text-secondary font-semibold">77.7% Syllabus Cleared</span>
<span className="text-on-surface-variant">+2 Pending Review</span>
</div>
<div className="w-full bg-surface-container-high h-1.5 mt-unit-2">
<div className="bg-secondary h-1.5" style={{width: "77.7%"}}></div>
</div>
</div>
<div className="bg-surface-container-lowest p-unit-4 shadow-sm flex flex-col justify-between">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm uppercase text-on-surface-variant tracking-wider">Evidence Strength</span>
<span className="material-symbols-outlined text-[20px] text-secondary">fingerprint</span>
</div>
<div className="mt-unit-3 flex items-baseline gap-unit-2">
<span className="font-display-lg text-display-lg text-secondary font-bold">92</span>
<span className="font-headline-sm text-headline-sm text-secondary">%</span>
</div>
<div className="mt-unit-2 flex items-center justify-between text-code-sm font-code-sm">
<span className="text-on-surface font-semibold">Multi-Anchor Proven</span>
<span className="text-on-surface-variant">6 Repos • 2 Certs</span>
</div>
<div className="w-full bg-surface-container-high h-1.5 mt-unit-2">
<div className="bg-secondary h-1.5" style={{width: "92%"}}></div>
</div>
</div>
<div className="bg-surface-container-lowest p-unit-4 shadow-sm flex flex-col justify-between">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm uppercase text-on-surface-variant tracking-wider">Critical Skill Gaps</span>
<span className="material-symbols-outlined text-[20px] text-error">troubleshoot</span>
</div>
<div className="mt-unit-3 flex items-baseline gap-unit-2">
<span className="font-display-lg text-display-lg text-error font-bold">2</span>
<span className="font-body-md text-body-md text-error">High Priority</span>
</div>
<div className="mt-unit-2 flex items-center justify-between text-code-sm font-code-sm">
<span className="text-error font-semibold">PyTorch • AWS Infra</span>
<span className="text-on-surface-variant">Est. Remediation: 18d</span>
</div>
<div className="w-full bg-surface-container-high h-1.5 mt-unit-2">
<div className="bg-error h-1.5" style={{width: "35%"}}></div>
</div>
</div>
<div className="bg-surface-container-lowest p-unit-4 shadow-sm flex flex-col justify-between">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm uppercase text-on-surface-variant tracking-wider">Matched Opportunities</span>
<span className="material-symbols-outlined text-[20px] text-primary">domain_verification</span>
</div>
<div className="mt-unit-3 flex items-baseline gap-unit-2">
<span className="font-display-lg text-display-lg text-primary font-bold">9</span>
<span className="font-headline-sm text-headline-sm text-primary">Roles</span>
</div>
<div className="mt-unit-2 flex items-center justify-between text-code-sm font-code-sm">
<span className="text-secondary font-semibold">Match score &gt; 80%</span>
<span className="text-on-surface-variant">3 Recruiter Views</span>
</div>
<div className="w-full bg-surface-container-high h-1.5 mt-unit-2">
<div className="bg-primary h-1.5" style={{width: "85%"}}></div>
</div>
</div>
</div>

{bannerOpen && (<div className="w-full bg-gradient-to-r from-primary via-primary-container to-surface-container-highest p-unit-4 text-on-primary shadow-md mb-unit-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-unit-4">
<div className="flex items-center gap-unit-3">
<div className="w-10 h-10 bg-secondary flex items-center justify-center flex-shrink-0 text-on-secondary">
<span className="material-symbols-outlined text-[24px]">bolt</span>
</div>
<div>
<div className="flex items-center gap-unit-2">
<span className="font-label-sm text-label-sm bg-secondary-container text-on-secondary-container px-unit-1.5 py-0.5 uppercase tracking-wider font-bold">High Yield Action</span>
<span className="font-code-sm text-code-sm text-on-primary-container">Delta Impact: +14% Overall Match</span>
</div>
<p className="font-headline-sm text-headline-sm mt-0.5 text-on-primary">
          Take PyTorch Tensor Ops 15-min Diagnostic to unlock 4 high-stipend ML Internship matches.
        </p>
</div>
</div>
<div className="flex items-center gap-unit-3 flex-shrink-0 w-full md:w-auto">
<button type="button" onClick={() => alert("Starting PyTorch Diagnostic Protocol SIH-TEST-PT4")} className="px-unit-4 py-unit-2 bg-secondary text-on-secondary font-label-md text-label-md font-bold uppercase tracking-wider hover:opacity-90 transition-opacity w-full md:w-auto text-center">
        Launch Assessment
      </button>
<button type="button" onClick={() => setBannerOpen(false)} className="p-unit-2 text-on-primary-container hover:text-on-primary">
<span className="material-symbols-outlined text-[20px]">close</span>
</button>
</div>
</div>)}

<div className="grid grid-cols-1 lg:grid-cols-12 gap-unit-6 mb-unit-6">

<div className="lg:col-span-7 flex flex-col gap-unit-6">
<div className="bg-surface-container-lowest p-unit-6 shadow-sm">
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-unit-3 pb-unit-4 border-b border-surface-container-high">
<div>
<div className="flex items-center gap-unit-2">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Taxonomy Framework</span>
<span className="font-code-sm text-code-sm px-1.5 py-0.5 bg-surface-container text-on-surface font-semibold">IEEE-SWEBOK / NCES 2020</span>
</div>
<h2 className="font-headline-md text-headline-md text-on-surface">Skill Verification Matrix &amp; Radar</h2>
</div>
<div className="flex items-center bg-surface-container-low p-0.5">
<button type="button" onClick={() => setView("bars")} className={viewBtn("bars")}>Vector Bars</button>
<button type="button" onClick={() => setView("radar")} className={viewBtn("radar")}>Radar Canvas</button>
</div>
</div>

<div className={`${view === "radar" ? "flex" : "hidden"} py-unit-6 flex-col items-center justify-center`}>
<div className="relative w-72 h-72">
<svg className="w-full h-full" viewBox="0 0 240 240">

<polygon fill="none" points="120,20 215,75 215,185 120,240 25,185 25,75" stroke="#d5e3fc" strokeWidth="1.5"/>
<polygon fill="none" points="120,45 191,86 191,168 120,210 49,168 49,86" stroke="#d5e3fc" strokeDasharray="3,3" strokeWidth="1"/>
<polygon fill="none" points="120,70 167,98 167,152 120,180 73,152 73,98" stroke="#d5e3fc" strokeWidth="1"/>

<line stroke="#d5e3fc" strokeWidth="1" x1="120" x2="120" y1="120" y2="20"/>
<line stroke="#d5e3fc" strokeWidth="1" x1="120" x2="215" y1="120" y2="75"/>
<line stroke="#d5e3fc" strokeWidth="1" x1="120" x2="215" y1="120" y2="185"/>
<line stroke="#d5e3fc" strokeWidth="1" x1="120" x2="120" y1="120" y2="240"/>
<line stroke="#d5e3fc" strokeWidth="1" x1="120" x2="25" y1="120" y2="185"/>
<line stroke="#d5e3fc" strokeWidth="1" x1="120" x2="25" y1="120" y2="75"/>

<polygon fill="#312e81" fillOpacity="0.25" points="120,26 203,80 188,167 120,150 58,145 38,81" stroke="#312e81" strokeWidth="2.5"/>

<polygon fill="none" points="120,20 205,79 196,173 205,225 196,230 40,80" stroke="#006c4a" strokeDasharray="4,4" strokeWidth="2"/>

<circle cx="120" cy="26" fill="#312e81" r="3.5"/>
<circle cx="203" cy="80" fill="#312e81" r="3.5"/>
<circle cx="188" cy="167" fill="#312e81" r="3.5"/>
<circle cx="120" cy="150" fill="#ba1a1a" r="3.5"/>
<circle cx="58" cy="145" fill="#ba1a1a" r="3.5"/>
<circle cx="38" cy="81" fill="#312e81" r="3.5"/>
</svg>
<span className="absolute -top-3 left-1/2 -translate-x-1/2 font-code-sm text-code-sm font-bold text-primary">Python (94%)</span>
<span className="absolute top-16 -right-10 font-code-sm text-code-sm font-bold text-primary">DS &amp; Algo (88%)</span>
<span className="absolute bottom-16 -right-6 font-code-sm text-code-sm text-on-surface">Git (72%)</span>
<span className="absolute -bottom-4 left-1/2 -translate-x-1/2 font-code-sm text-code-sm font-bold text-error">Cloud AWS (25%)</span>
<span className="absolute bottom-16 -left-10 font-code-sm text-code-sm font-bold text-error">PyTorch (38%)</span>
<span className="absolute top-16 -left-6 font-code-sm text-code-sm font-bold text-primary">SQL (86%)</span>
</div>
<div className="flex items-center gap-unit-6 mt-unit-4 font-code-sm text-code-sm">
<span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-primary/40 inline-block"></span> Student Vector Vector-Score</span>
<span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-secondary inline-block"></span> Target: ML Engineer Benchmark</span>
</div>
</div>

<div className={`divide-y divide-surface-container-high ${view === "bars" ? "" : "hidden"}`}>

<div className="py-unit-4">
<div className="flex items-center justify-between mb-unit-3">
<div className="flex items-center gap-unit-2">
<span className="w-2.5 h-2.5 bg-secondary"></span>
<span className="font-label-md text-label-md text-secondary uppercase font-bold tracking-wide">Strong Competencies (&gt;= 80%)</span>
</div>
<span className="font-code-sm text-code-sm text-on-surface-variant">Verified by 3+ Cross-Anchors</span>
</div>
<div className="space-y-unit-3">

<div className="bg-surface-container-low p-unit-3">
<div className="flex items-center justify-between">
<div className="flex items-center gap-unit-2">
<span className="font-label-md text-label-md font-bold text-on-surface">Python Architecture</span>
<span className="font-code-sm text-code-sm text-on-surface-variant">CS-PY3-ADV</span>
</div>
<div className="flex items-center gap-unit-3">
<span className="font-label-sm text-label-sm px-unit-2 py-0.5 bg-secondary-container text-on-secondary-container font-semibold">
                      GitHub Repo • 85 Commits
                    </span>
<span className="font-headline-sm text-headline-sm font-bold text-secondary">94%</span>
</div>
</div>
<div className="w-full bg-surface-container-highest h-2 mt-unit-2">
<div className="bg-secondary h-2" style={{width: "94%"}}></div>
</div>
</div>

<div className="bg-surface-container-low p-unit-3">
<div className="flex items-center justify-between">
<div className="flex items-center gap-unit-2">
<span className="font-label-md text-label-md font-bold text-on-surface">Data Structures &amp; Algorithms</span>
<span className="font-code-sm text-code-sm text-on-surface-variant">CS-DS-201</span>
</div>
<div className="flex items-center gap-unit-3">
<span className="font-label-sm text-label-sm px-unit-2 py-0.5 bg-secondary-container text-on-secondary-container font-semibold">
                      Quiz Score: 92% (Proctored)
                    </span>
<span className="font-headline-sm text-headline-sm font-bold text-secondary">88%</span>
</div>
</div>
<div className="w-full bg-surface-container-highest h-2 mt-unit-2">
<div className="bg-secondary h-2" style={{width: "88%"}}></div>
</div>
</div>

<div className="bg-surface-container-low p-unit-3">
<div className="flex items-center justify-between">
<div className="flex items-center gap-unit-2">
<span className="font-label-md text-label-md font-bold text-on-surface">Relational Databases &amp; SQL Querying</span>
<span className="font-code-sm text-code-sm text-on-surface-variant">DB-SQL-400</span>
</div>
<div className="flex items-center gap-unit-3">
<span className="font-label-sm text-label-sm px-unit-2 py-0.5 bg-secondary-container text-on-secondary-container font-semibold">
                      NPTEL Elite Gold Cert (89%)
                    </span>
<span className="font-headline-sm text-headline-sm font-bold text-secondary">86%</span>
</div>
</div>
<div className="w-full bg-surface-container-highest h-2 mt-unit-2">
<div className="bg-secondary h-2" style={{width: "86%"}}></div>
</div>
</div>
</div>
</div>

<div className="py-unit-4">
<div className="flex items-center justify-between mb-unit-3">
<div className="flex items-center gap-unit-2">
<span className="w-2.5 h-2.5 bg-tertiary-container"></span>
<span className="font-label-md text-label-md text-on-surface uppercase font-bold tracking-wide">Developing (60% - 79%)</span>
</div>
<span className="font-code-sm text-code-sm text-on-surface-variant">Mid-tier verification</span>
</div>
<div className="space-y-unit-3">

<div className="bg-surface-container-low p-unit-3">
<div className="flex items-center justify-between">
<div className="flex items-center gap-unit-2">
<span className="font-label-md text-label-md font-bold text-on-surface">Git &amp; Version Control Protocol</span>
<span className="font-code-sm text-code-sm text-on-surface-variant">DEV-GIT-101</span>
</div>
<div className="flex items-center gap-unit-3">
<span className="font-label-sm text-label-sm px-unit-2 py-0.5 bg-surface-container-high text-on-surface font-semibold">
                      Hackathon Project (SIH 2025)
                    </span>
<span className="font-headline-sm text-headline-sm font-bold text-on-surface">72%</span>
</div>
</div>
<div className="w-full bg-surface-container-highest h-2 mt-unit-2">
<div className="bg-primary h-2" style={{width: "72%"}}></div>
</div>
</div>

<div className="bg-surface-container-low p-unit-3">
<div className="flex items-center justify-between">
<div className="flex items-center gap-unit-2">
<span className="font-label-md text-label-md font-bold text-on-surface">Docker &amp; Containerization</span>
<span className="font-code-sm text-code-sm text-on-surface-variant">OPS-DCK-110</span>
</div>
<div className="flex items-center gap-unit-3">
<span className="font-label-sm text-label-sm px-unit-2 py-0.5 bg-surface-container-high text-on-surface font-semibold">
                      Assignment Submission (Grade: A)
                    </span>
<span className="font-headline-sm text-headline-sm font-bold text-on-surface">65%</span>
</div>
</div>
<div className="w-full bg-surface-container-highest h-2 mt-unit-2">
<div className="bg-primary h-2" style={{width: "65%"}}></div>
</div>
</div>
</div>
</div>

<div className="pt-unit-4">
<div className="flex items-center justify-between mb-unit-3">
<div className="flex items-center gap-unit-2">
<span className="w-2.5 h-2.5 bg-error"></span>
<span className="font-label-md text-label-md text-error uppercase font-bold tracking-wide">Critical Skill Gaps (&lt; 50%)</span>
</div>
<span className="font-code-sm text-code-sm text-error font-semibold">Requires Remediation</span>
</div>
<div className="space-y-unit-3">

<div className="bg-surface-container-low p-unit-3">
<div className="flex items-center justify-between">
<div className="flex items-center gap-unit-2">
<span className="font-label-md text-label-md font-bold text-on-surface">PyTorch Deep Learning &amp; Tensor Flow</span>
<span className="font-code-sm text-code-sm text-error font-semibold">DEFICIT: Δ -42%</span>
</div>
<div className="flex items-center gap-unit-3">
<span className="font-label-sm text-label-sm px-unit-2 py-0.5 bg-error-container text-on-error-container font-semibold">
                      Zero Direct Evidence
                    </span>
<span className="font-headline-sm text-headline-sm font-bold text-error">38%</span>
</div>
</div>
<div className="w-full bg-surface-container-highest h-2 mt-unit-2">
<div className="bg-error h-2" style={{width: "38%"}}></div>
</div>
</div>

<div className="bg-surface-container-low p-unit-3">
<div className="flex items-center justify-between">
<div className="flex items-center gap-unit-2">
<span className="font-label-md text-label-md font-bold text-on-surface">AWS Cloud Infrastructure (EC2 / S3 / Lambda)</span>
<span className="font-code-sm text-code-sm text-error font-semibold">DEFICIT: Δ -45%</span>
</div>
<div className="flex items-center gap-unit-3">
<span className="font-label-sm text-label-sm px-unit-2 py-0.5 bg-error-container text-on-error-container font-semibold">
                      Self-Declared Only
                    </span>
<span className="font-headline-sm text-headline-sm font-bold text-error">25%</span>
</div>
</div>
<div className="w-full bg-surface-container-highest h-2 mt-unit-2">
<div className="bg-error h-2" style={{width: "25%"}}></div>
</div>
</div>
</div>
</div>
</div>
</div>

<div className="bg-surface-container-lowest p-unit-6 shadow-sm">
<div className="flex items-center justify-between pb-unit-3 border-b border-surface-container-high">
<div>
<span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Immutable Verification Tray</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Evidence Portfolio Anchors (3 Primary)</h3>
</div>
<button className="font-label-md text-label-md text-primary hover:underline font-semibold flex items-center gap-1">
<span>Inspect All Records</span>
<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</button>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-unit-4 mt-unit-4">

<div className="bg-surface-container-low p-unit-4 flex flex-col justify-between hover:bg-surface-container transition-colors">
<div>
<div className="flex items-center justify-between mb-unit-2">
<span className="material-symbols-outlined text-[20px] text-primary">code</span>
<span className="font-code-sm text-code-sm px-1.5 py-0.5 bg-secondary-container text-on-secondary-container font-bold">VERIFIED</span>
</div>
<h4 className="font-label-lg text-label-lg text-on-surface font-bold">Capstone CNN Classifier</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">GitHub repository + Live Streamlit inference demo tested by evaluator.</p>
</div>
<div className="mt-unit-3 pt-unit-2 border-t border-surface-container-high flex items-center justify-between font-code-sm text-code-sm text-on-surface-variant">
<span>SHA: 4f8b2a</span>
<span className="text-primary font-semibold">98.2% Cred</span>
</div>
</div>

<div className="bg-surface-container-low p-unit-4 flex flex-col justify-between hover:bg-surface-container transition-colors">
<div>
<div className="flex items-center justify-between mb-unit-2">
<span className="material-symbols-outlined text-[20px] text-primary">school</span>
<span className="font-code-sm text-code-sm px-1.5 py-0.5 bg-secondary-container text-on-secondary-container font-bold">VERIFIED</span>
</div>
<h4 className="font-label-lg text-label-lg text-on-surface font-bold">NPTEL Database Systems</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">12-week national certification proctored exam. Final Score: 89% (Elite).</p>
</div>
<div className="mt-unit-3 pt-unit-2 border-t border-surface-container-high flex items-center justify-between font-code-sm text-code-sm text-on-surface-variant">
<span>CERT: NPT-24-CS91</span>
<span className="text-primary font-semibold">Govt Authenticated</span>
</div>
</div>

<div className="bg-surface-container-low p-unit-4 flex flex-col justify-between hover:bg-surface-container transition-colors">
<div>
<div className="flex items-center justify-between mb-unit-2">
<span className="material-symbols-outlined text-[20px] text-tertiary-container">military_tech</span>
<span className="font-code-sm text-code-sm px-1.5 py-0.5 bg-secondary-container text-on-secondary-container font-bold">VERIFIED</span>
</div>
<h4 className="font-label-lg text-label-lg text-on-surface font-bold">SIH 2025 Finalist</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Smart India Hackathon Team Lead: Real-time traffic dispatch telemetry.</p>
</div>
<div className="mt-unit-3 pt-unit-2 border-t border-surface-container-high flex items-center justify-between font-code-sm text-code-sm text-on-surface-variant">
<span>STAGE: Grand Finale</span>
<span className="text-primary font-semibold">Jury Signed</span>
</div>
</div>
</div>
</div>
</div>

<div className="lg:col-span-5 flex flex-col gap-unit-6">
<div className="bg-surface-container-lowest p-unit-6 shadow-sm flex flex-col h-full">
<div className="flex flex-col gap-unit-2 pb-unit-4 border-b border-surface-container-high">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Dynamic Gap Analyzer</span>
<span className="font-code-sm text-code-sm text-secondary font-bold">XAI EVAL: OK</span>
</div>
<h2 className="font-headline-sm text-headline-sm text-on-surface">Target Role Skill-Gap Breakdown</h2>

<div className="grid grid-cols-3 gap-1 bg-surface-container-low p-1 mt-unit-2">
<button type="button" onClick={() => setRole("ml")} className={roleBtn("ml")}>
              ML Engineer Intern
            </button>
<button type="button" onClick={() => setRole("fs")} className={roleBtn("fs")}>
              Full Stack Dev
            </button>
<button type="button" onClick={() => setRole("da")} className={roleBtn("da")}>
              Data Analyst
            </button>
</div>
</div>

<div className="my-unit-4 p-unit-3 bg-surface-container-low flex items-center justify-between" id="roleContextCard">
<div className="flex flex-col">
<span className="font-code-sm text-code-sm text-on-surface-variant">ACTIVE PROFILE BENCHMARK</span>
<span className="font-headline-sm text-headline-sm text-primary font-bold">{active.title}</span>
</div>
<div className="text-right">
<span className="font-code-sm text-code-sm text-on-surface-variant">CALCULATED FIT</span>
<span className="font-headline-md text-headline-md text-secondary font-bold block">{active.fit}</span>
</div>
</div>

<div className="flex-1 overflow-x-auto">
<table className="w-full text-left">
<thead>
<tr className="bg-surface-container-high/50 text-on-surface-variant font-label-sm text-label-sm uppercase">
<th className="py-unit-2 px-unit-3">Mandatory Skill</th>
<th className="py-unit-2 px-unit-2 text-center">Current</th>
<th className="py-unit-2 px-unit-2 text-center">Req.</th>
<th className="py-unit-2 px-unit-3 text-right">Priority</th>
</tr>
</thead>
<tbody className="divide-y divide-surface-container-high font-body-sm text-body-sm">
{active.skills.map((skill) => (
  <tr key={skill.name} className="hover:bg-surface-container-low transition-colors">
    <td className="py-unit-2 px-unit-3">
      <span className="font-bold text-on-surface">{skill.name}</span>
      <span className="block text-[10px] text-on-surface-variant uppercase">{skill.status}</span>
    </td>
    <td className="py-unit-2 px-unit-2 text-center font-code-sm font-semibold">{skill.cur}</td>
    <td className="py-unit-2 px-unit-2 text-center font-code-sm text-on-surface-variant">{skill.req}</td>
    <td className="py-unit-2 px-unit-3 text-right">
      <span className={`font-label-sm text-label-sm px-unit-2 py-0.5 font-bold uppercase ${skill.priorityColor}`}>{skill.priority}</span>
    </td>
  </tr>
))}
</tbody>
</table>
</div>

<div className="mt-unit-4 p-unit-4 bg-surface-container border-l-4 border-primary flex items-start gap-unit-3">
<span className="material-symbols-outlined text-primary text-[22px] flex-shrink-0">lightbulb</span>
<div className="flex flex-col">
<span className="font-label-md text-label-md font-bold text-on-surface">Curriculum Recommendation</span>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              Complete the 8-hour module "PyTorch for High-Throughput Inference" to flip your critical gap to Satisfied.
            </p>
<a className="font-label-sm text-label-sm text-primary font-bold mt-unit-2 uppercase tracking-wide flex items-center gap-1 hover:underline" href="#">
<span>View Assigned 2-Week Module</span>
<span className="material-symbols-outlined text-[14px]">open_in_new</span>
</a>
</div>
</div>
</div>
</div>
</div>

<div className="w-full bg-surface-container-lowest p-unit-6 shadow-sm mb-unit-6">
<div className="flex flex-col md:flex-row md:items-center justify-between gap-unit-4 pb-unit-4 border-b border-surface-container-high mb-unit-6">
<div>
<div className="flex items-center gap-unit-2">
<span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
<span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">XAI Algorithmic Match Feed</span>
</div>
<h2 className="font-headline-md text-headline-md text-on-surface">Transparent Opportunity Matches</h2>
<p className="font-body-md text-body-md text-on-surface-variant">Real-time matching vector computed against active enterprise job requisitions.</p>
</div>
<div className="flex items-center gap-unit-3">
<span className="font-code-sm text-code-sm px-unit-2 py-1 bg-surface-container text-on-surface">Embedding Model: GTE-Large-v1.5</span>
<button className="px-unit-3 py-1.5 bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center gap-unit-1">
<span className="material-symbols-outlined text-[16px]">tune</span>
<span>Filters (2 Active)</span>
</button>
</div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-unit-6">

<div className="bg-surface-container-low p-unit-6 flex flex-col justify-between relative overflow-hidden group">
<div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full pointer-events-none"></div>
<div>

<div className="flex items-start justify-between gap-unit-4">
<div className="flex items-center gap-unit-3">
<div className="w-12 h-12 bg-primary text-on-primary flex items-center justify-center font-headline-sm text-headline-sm font-bold">
                TF
              </div>
<div>
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">TensorFlow Labs Ltd.</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">ML Research Intern</h3>
</div>
</div>
<div className="flex flex-col items-end">
<div className="flex items-center gap-unit-1 px-unit-2 py-1 bg-secondary-container text-on-secondary-container font-label-md text-label-md font-bold">
<span className="material-symbols-outlined text-[16px]">auto_awesome</span>
<span>88% MATCH</span>
</div>
<span className="font-code-sm text-code-sm text-on-surface-variant mt-1">Direct Recruiter Queue</span>
</div>
</div>

<div className="flex flex-wrap items-center gap-unit-3 mt-unit-4 text-code-sm font-code-sm text-on-surface-variant">
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">location_on</span> Bengaluru / Hybrid</span>
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">payments</span> ₹45,000 - ₹60,000 / mo</span>
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span> 6 Months • Immediate</span>
</div>

<div className="mt-unit-4 p-unit-4 bg-surface-container-lowest border-l-4 border-secondary">
<div className="flex items-center justify-between mb-unit-1">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">psychology</span>
                Explainable Match Breakdown
              </span>
<span className="font-code-sm text-code-sm text-on-surface-variant">Confidence 96.4%</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
<strong>Why matched:</strong> High Python proficiency (94%) and algorithmic problem-solving backed by verified GitHub CNN project. PyTorch is an identified delta (38% vs 80% req) that can be bridged with the 2-week assigned module.
            </p>
<div className="flex flex-wrap gap-unit-2 mt-unit-3">
<span className="font-code-sm text-code-sm px-unit-1.5 py-0.5 bg-secondary-container text-on-secondary-container font-semibold">Python: 0.94 weight</span>
<span className="font-code-sm text-code-sm px-unit-1.5 py-0.5 bg-secondary-container text-on-secondary-container font-semibold">Algorithms: 0.88 weight</span>
<span className="font-code-sm text-code-sm px-unit-1.5 py-0.5 bg-error-container text-on-error-container font-semibold">PyTorch Gap: Δ-42%</span>
</div>
</div>
</div>

<div className="mt-unit-6 pt-unit-4 border-t border-surface-container-high flex items-center justify-between gap-unit-3">
<div className="flex items-center gap-unit-2">
<button type="button" onClick={() => setModal({ company: "TensorFlow Labs", role: "ML Research Intern", score: 88, explanation: "Strong match on Python and verified CNN repo. Minor syllabus gap in PyTorch ops." })} className="px-unit-3 py-unit-2 bg-surface-container text-on-surface hover:bg-surface-container-highest font-label-md text-label-md font-semibold flex items-center gap-1">
<span className="material-symbols-outlined text-[16px]">visibility</span>
<span>Match Breakdown</span>
</button>
<button type="button" onClick={() => setSaved((p) => ({ ...p, tfl: !p.tfl }))} className="p-unit-2 text-on-surface-variant hover:text-primary bg-surface-container hover:bg-surface-container-highest">
<span className={`material-symbols-outlined text-[20px] ${saved.tfl ? "text-primary" : ""}`}>{saved.tfl ? "bookmark" : "bookmark_border"}</span>
</button>
</div>
<button type="button" onClick={() => alert("Application submitted via SkillBridge Direct-Verify API to TensorFlow Labs.")} className="px-unit-4 py-unit-2 bg-primary text-on-primary font-label-md text-label-md font-bold uppercase tracking-wider hover:bg-primary-container flex items-center gap-unit-2 shadow-xs">
<span>Apply Now</span>
<span className="material-symbols-outlined text-[16px]">send</span>
</button>
</div>
</div>

<div className="bg-surface-container-low p-unit-6 flex flex-col justify-between relative overflow-hidden group">
<div className="absolute top-0 right-0 w-24 h-24 bg-secondary/10 rounded-bl-full pointer-events-none"></div>
<div>

<div className="flex items-start justify-between gap-unit-4">
<div className="flex items-center gap-unit-3">
<div className="w-12 h-12 bg-secondary text-on-secondary flex items-center justify-center font-headline-sm text-headline-sm font-bold">
                DP
              </div>
<div>
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">DataPulse Analytics Inc.</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Python Data Engineer Intern</h3>
</div>
</div>
<div className="flex flex-col items-end">
<div className="flex items-center gap-unit-1 px-unit-2 py-1 bg-secondary text-on-secondary font-label-md text-label-md font-bold">
<span className="material-symbols-outlined text-[16px]">verified_user</span>
<span>95% MATCH</span>
</div>
<span className="font-code-sm text-code-sm text-secondary font-bold mt-1">Priority Selection</span>
</div>
</div>

<div className="flex flex-wrap items-center gap-unit-3 mt-unit-4 text-code-sm font-code-sm text-on-surface-variant">
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">location_on</span> Gurugram / Remote</span>
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">payments</span> ₹50,000 / mo</span>
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span> 3-6 Months • Flexible</span>
</div>

<div className="mt-unit-4 p-unit-4 bg-surface-container-lowest border-l-4 border-secondary">
<div className="flex items-center justify-between mb-unit-1">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">psychology</span>
                Explainable Match Breakdown
              </span>
<span className="font-code-sm text-code-sm text-on-surface-variant">Confidence 98.9%</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
<strong>Why matched:</strong> Exceptional SQL (86%) and Python (94%) competency verified through NPTEL certified credentials and 2 validated repos. Candidate fulfills 100% of the non-negotiable tech stack requirements.
            </p>
<div className="flex flex-wrap gap-unit-2 mt-unit-3">
<span className="font-code-sm text-code-sm px-unit-1.5 py-0.5 bg-secondary-container text-on-secondary-container font-semibold">SQL Mastery: 0.86</span>
<span className="font-code-sm text-code-sm px-unit-1.5 py-0.5 bg-secondary-container text-on-secondary-container font-semibold">Data Structures: 0.88</span>
<span className="font-code-sm text-code-sm px-unit-1.5 py-0.5 bg-secondary-container text-on-secondary-container font-semibold">Zero Critical Gaps</span>
</div>
</div>
</div>

<div className="mt-unit-6 pt-unit-4 border-t border-surface-container-high flex items-center justify-between gap-unit-3">
<div className="flex items-center gap-unit-2">
<button type="button" onClick={() => setModal({ company: "DataPulse Analytics", role: "Python Data Engineer Intern", score: 95, explanation: "Zero critical skill gaps. Both SQL and Python verified through proctored benchmarks and code artifacts." })} className="px-unit-3 py-unit-2 bg-surface-container text-on-surface hover:bg-surface-container-highest font-label-md text-label-md font-semibold flex items-center gap-1">
<span className="material-symbols-outlined text-[16px]">visibility</span>
<span>Match Breakdown</span>
</button>
<button type="button" onClick={() => setSaved((p) => ({ ...p, dpa: !p.dpa }))} className="p-unit-2 text-on-surface-variant hover:text-primary bg-surface-container hover:bg-surface-container-highest">
<span className={`material-symbols-outlined text-[20px] ${saved.dpa ? "text-primary" : ""}`}>{saved.dpa ? "bookmark" : "bookmark_border"}</span>
</button>
</div>
<button type="button" onClick={() => alert("Instant candidate fast-track dispatch triggered for DataPulse Analytics.")} className="px-unit-4 py-unit-2 bg-secondary text-on-secondary font-label-md text-label-md font-bold uppercase tracking-wider hover:opacity-90 flex items-center gap-unit-2 shadow-xs">
<span>Fast-Track Apply</span>
<span className="material-symbols-outlined text-[16px]">bolt</span>
</button>
</div>
</div>
</div>
</div>

{modal && (<div className="fixed inset-0 bg-on-surface/50 backdrop-blur-xs z-50 flex items-center justify-center p-unit-4">
<div className="bg-surface-container-lowest max-w-xl w-full p-unit-6 shadow-xl relative">
<div className="flex items-start justify-between pb-unit-4 border-b border-surface-container-high">
<div>
<span className="font-label-sm text-label-sm text-secondary font-bold uppercase">Algorithmic Vector Inspection</span>
<h3 className="font-headline-md text-headline-md text-on-surface mt-0.5">{modal.role}</h3>
<span className="font-body-sm text-body-sm text-on-surface-variant">{modal.company}</span>
</div>
<button type="button" onClick={() => setModal(null)} className="p-unit-1 text-on-surface-variant hover:text-on-surface">
<span className="material-symbols-outlined text-[22px]">close</span>
</button>
</div>
<div className="py-unit-4 space-y-unit-4">
<div className="flex items-center justify-between bg-surface-container-low p-unit-3">
<span className="font-label-md text-label-md text-on-surface font-semibold">Calculated Semantic Fit</span>
<span className="font-headline-sm text-headline-sm text-secondary font-bold">{modal.score}%</span>
</div>
<div>
<h4 className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant mb-unit-1">Match Reason Synthesis</h4>
<p className="font-body-md text-body-md text-on-surface bg-surface-container-lowest p-unit-3 border border-surface-container-high">{modal.explanation}</p>
</div>
<div>
<h4 className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant mb-unit-2">Evaluated Competency Weights</h4>
<div className="space-y-unit-2 font-code-sm text-code-sm">
<div className="flex justify-between items-center">
<span>Python Language Core (Req: &gt;=85%)</span>
<span className="text-secondary font-bold">Candidate: 94% [PASSED]</span>
</div>
<div className="w-full bg-surface-container h-1.5"><div className="bg-secondary h-1.5" style={{width: "94%"}}></div></div>
<div className="flex justify-between items-center">
<span>Algorithms &amp; Complexity (Req: &gt;=80%)</span>
<span className="text-secondary font-bold">Candidate: 88% [PASSED]</span>
</div>
<div className="w-full bg-surface-container h-1.5"><div className="bg-secondary h-1.5" style={{width: "88%"}}></div></div>
<div className="flex justify-between items-center">
<span>PyTorch Framework (Req: &gt;=75%)</span>
<span className="text-error font-bold">Candidate: 38% [GAP -37%]</span>
</div>
<div className="w-full bg-surface-container h-1.5"><div className="bg-error h-1.5" style={{width: "38%"}}></div></div>
</div>
</div>
</div>
<div className="pt-unit-4 border-t border-surface-container-high flex justify-end gap-unit-3">
<button className="px-unit-4 py-unit-2 bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-highest">
          Close Inspection
        </button>
<button className="px-unit-4 py-unit-2 bg-primary text-on-primary font-label-md text-label-md font-bold">
          Bridge Identified Gaps
        </button>
</div>
</div>
</div>
</div>

</main></div><footer className="fixed bottom-0 left-0 right-0 h-8 bg-surface-container-high border-t border-outline-variant z-50 px-unit-4 flex items-center justify-between text-on-surface-variant font-code-sm text-code-sm"><div><span className="inline-block w-2 h-2 bg-secondary mr-2"></span><span>Smart Automation • SIH2026 Active Demo</span></div><div className="flex items-center gap-unit-6"><span>API LATENCY: 18ms</span><span>CIP TAXONOMY: 2020-NCES</span><span>INSTANCE: IN-DL-CLUSTER-04</span></div></footer>
    </div>
  );
}
