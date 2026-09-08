import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { STUDENT } from "@/lib/domain/seed";
import { useStore } from "@/lib/store";

type NavItem = { to: string; icon: string; label: string };

const STUDENT_NAV: NavItem[] = [
  { to: "/", icon: "verified", label: "Competency Hub" },
  { to: "/evidence", icon: "folder_special", label: "Evidence Portfolio" },
  { to: "/resume-extractor", icon: "document_scanner", label: "Resume AI Extractor" },
  { to: "/assessments", icon: "quiz", label: "Skill Assessments" },
  { to: "/skill-gap", icon: "troubleshoot", label: "Skill-Gap Analysis" },
  { to: "/learning-path", icon: "route", label: "Learning Path" },
  { to: "/opportunities", icon: "hub", label: "Opportunity Matcher" },
  { to: "/applications", icon: "terminal", label: "Application Tracker" },
  { to: "/readiness", icon: "speed", label: "Career Readiness" },
];

const RECRUITER_NAV: NavItem[] = [
  { to: "/recruiter/post", icon: "data_object", label: "Post & Match" },
  { to: "/recruiter/candidates", icon: "fact_check", label: "Candidate Shortlist" },
];

const INSTITUTION_NAV: NavItem[] = [{ to: "/institution", icon: "analytics", label: "Skill Gap Analytics" }];

function NavLink({ item }: { item: NavItem }) {
  return (
    <Link
      to={item.to}
      activeOptions={{ exact: item.to === "/" }}
      className="flex items-center gap-unit-3 px-unit-3 py-unit-2 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
      activeProps={{ className: "flex items-center gap-unit-3 px-unit-3 py-unit-2 bg-primary-container text-on-primary-container font-semibold transition-colors" }}
    >
      <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
      <span className="font-label-md text-label-md">{item.label}</span>
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { readiness, state } = useStore();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const persona = pathname.startsWith("/recruiter")
    ? "recruiter"
    : pathname.startsWith("/institution")
      ? "institution"
      : "student";

  const personaBtn = (active: boolean) =>
    active
      ? "px-unit-3 py-1 font-label-md text-label-md bg-primary text-on-primary font-semibold"
      : "px-unit-3 py-1 font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors";

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen">
      <aside className="fixed left-0 top-0 bottom-0 w-72 bg-surface-container-lowest z-40 flex flex-col border-r border-outline-variant">
        <div className="h-16 px-unit-4 flex items-center justify-between border-b border-outline-variant bg-surface-container-low">
          <div className="flex items-center gap-unit-2">
            <div className="w-8 h-8 bg-primary text-on-primary flex items-center justify-center font-headline-sm text-headline-sm">AF</div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-primary tracking-tight leading-none">ApexForge</span>
              <span className="font-code-sm text-code-sm text-on-surface-variant leading-tight">SkillBridge AI</span>
            </div>
          </div>
          <span className="font-label-sm text-label-sm px-unit-1 py-0.5 bg-secondary-container text-on-secondary-container font-semibold">SIH26044</span>
        </div>

        <div className="flex-1 overflow-y-auto py-unit-4 px-unit-3 space-y-unit-6">
          <nav className="space-y-unit-1">
            <div className="px-unit-2 pb-unit-1 flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Student Portal</span>
              <span className="font-code-sm text-code-sm text-on-surface-variant">v2.4</span>
            </div>
            {STUDENT_NAV.map((i) => (
              <NavLink item={i} key={i.to} />
            ))}
          </nav>

          <nav className="space-y-unit-1">
            <div className="px-unit-2 pb-unit-1 flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Recruiter Workspace</span>
              <span className="font-code-sm text-code-sm text-secondary font-semibold">DEMO DATA</span>
            </div>
            {RECRUITER_NAV.map((i) => (
              <NavLink item={i} key={i.to} />
            ))}
          </nav>

          <nav className="space-y-unit-1">
            <div className="px-unit-2 pb-unit-1 flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Institution Admin</span>
              <span className="font-code-sm text-code-sm text-primary">ANALYTICS</span>
            </div>
            {INSTITUTION_NAV.map((i) => (
              <NavLink item={i} key={i.to} />
            ))}
          </nav>
        </div>

        <div className="p-unit-3 border-t border-outline-variant bg-surface-container-low">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-unit-2">
              <span className="w-2 h-2 bg-secondary" />
              <span className="font-code-sm text-code-sm text-on-surface font-semibold">Rule-based scoring engine</span>
            </div>
            <span className="font-code-sm text-code-sm text-on-surface-variant">{state.evidence.length} EVIDENCE</span>
          </div>
        </div>
      </aside>

      <div className="pl-72">
        <header className="fixed top-0 left-72 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant z-30 flex items-center justify-between px-unit-6">
          <div className="flex items-center gap-unit-4 flex-1 max-w-lg">
            <span className="font-code-sm text-code-sm text-on-surface-variant">
              Evidence → Competency → Skill Gap → Learning Action → Opportunity Match
            </span>
          </div>
          <div className="flex items-center gap-unit-4">
            <div className="hidden lg:flex items-center border border-outline-variant bg-surface-container-low">
              <span className="font-label-sm text-label-sm px-unit-2 py-1 uppercase text-on-surface-variant border-r border-outline-variant">View As:</span>
              <Link to="/" className={personaBtn(persona === "student")}>Student</Link>
              <Link to="/recruiter/post" className={personaBtn(persona === "recruiter")}>Recruiter</Link>
              <Link to="/institution" className={personaBtn(persona === "institution")}>Institution</Link>
            </div>
            <div className="hidden md:flex flex-col items-end border-r border-outline-variant pr-unit-4">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Readiness</span>
              <span className="font-label-lg text-label-lg text-secondary font-bold">{readiness.index}%</span>
            </div>
            <div className="flex items-center gap-unit-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="font-label-md text-label-md text-on-surface font-semibold leading-none">{STUDENT.name}</span>
                <span className="font-code-sm text-code-sm text-on-surface-variant leading-tight">B.Tech CSE • {STUDENT.semester}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center overflow-hidden">
                <img src={STUDENT.photo} alt={STUDENT.name} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        <main className="relative pt-16 pb-12 w-full px-unit-6 bg-surface min-h-screen">
          <div className="py-unit-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
