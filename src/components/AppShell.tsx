import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

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
  { to: "/privacy", icon: "shield_lock", label: "Privacy & Data" },
];

const RECRUITER_NAV: NavItem[] = [
  { to: "/recruiter/post", icon: "data_object", label: "Post & Match" },
  { to: "/recruiter/candidates", icon: "fact_check", label: "Candidate Shortlist" },
];

const INSTITUTION_NAV: NavItem[] = [
  { to: "/institution", icon: "analytics", label: "Skill Gap Analytics" },
  { to: "/mentor", icon: "rule", label: "Mentor Verification" },
];

function NavLink({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  return (
    <Link
      to={item.to}
      onClick={onNavigate}
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
  const { readiness, state, student, loading, session, signOut } = useStore();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!session) void navigate({ to: "/auth" });
    else if (student && !student.onboarded) void navigate({ to: "/onboarding" });
  }, [loading, session, student, navigate]);

  const persona = pathname.startsWith("/recruiter")
    ? "recruiter"
    : pathname.startsWith("/institution") || pathname.startsWith("/mentor")
      ? "institution"
      : "student";

  const personaBtn = (active: boolean) =>
    active
      ? "px-unit-3 py-1 font-label-md text-label-md bg-primary text-on-primary font-semibold"
      : "px-unit-3 py-1 font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors";

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <span className="font-code-sm text-code-sm text-on-surface-variant animate-pulse">Loading your workspace…</span>
      </div>
    );
  }

  const initials = (student?.fullName || "You")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen">
      {open && <button type="button" aria-label="Close menu" className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setOpen(false)} />}

      <aside
        className={`fixed left-0 top-0 bottom-0 w-72 bg-surface-container-lowest z-50 flex flex-col border-r border-outline-variant transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
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
              <span className="font-code-sm text-code-sm text-on-surface-variant">v3.0</span>
            </div>
            {STUDENT_NAV.map((i) => (
              <NavLink item={i} key={i.to} onNavigate={() => setOpen(false)} />
            ))}
          </nav>

          <nav className="space-y-unit-1">
            <div className="px-unit-2 pb-unit-1 flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Recruiter Workspace</span>
            </div>
            {RECRUITER_NAV.map((i) => (
              <NavLink item={i} key={i.to} onNavigate={() => setOpen(false)} />
            ))}
          </nav>

          <nav className="space-y-unit-1">
            <div className="px-unit-2 pb-unit-1 flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Institution Admin</span>
              <span className="font-code-sm text-code-sm text-primary">ANALYTICS</span>
            </div>
            {INSTITUTION_NAV.map((i) => (
              <NavLink item={i} key={i.to} onNavigate={() => setOpen(false)} />
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

      <div className="lg:pl-72">
        <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant z-30 flex items-center justify-between px-unit-4 md:px-unit-6">
          <div className="flex items-center gap-unit-3 flex-1 min-w-0">
            <button
              type="button"
              aria-label="Open menu"
              className="lg:hidden material-symbols-outlined text-on-surface"
              onClick={() => setOpen(true)}
            >
              menu
            </button>
            <span className="hidden md:inline font-code-sm text-code-sm text-on-surface-variant truncate">
              Evidence → Competency → Skill Gap → Learning Action → Opportunity Match
            </span>
          </div>
          <div className="flex items-center gap-unit-4">
            <div className="hidden xl:flex items-center border border-outline-variant bg-surface-container-low">
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
                <span className="font-label-md text-label-md text-on-surface font-semibold leading-none">{student?.fullName || "Your profile"}</span>
                <span className="font-code-sm text-code-sm text-on-surface-variant leading-tight">
                  {[student?.degree, student?.semester].filter(Boolean).join(" • ") || "Complete onboarding"}
                </span>
              </div>
              <Link to="/onboarding" className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-sm text-label-sm font-bold">
                {initials}
              </Link>
              <button
                type="button"
                onClick={() => void signOut().then(() => navigate({ to: "/auth" }))}
                className="material-symbols-outlined text-[20px] text-on-surface-variant hover:text-on-surface"
                aria-label="Sign out"
                title="Sign out"
              >
                logout
              </button>
            </div>
          </div>
        </header>

        <main className="relative pt-16 pb-12 w-full px-unit-4 md:px-unit-6 bg-surface min-h-screen">
          <div className="py-unit-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
