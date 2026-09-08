import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { SEED_EVIDENCE } from "./domain/seed";
import type {
  Application,
  ApplicationStatus,
  Competency,
  Evidence,
  LearningStepState,
  RoleFit,
} from "./domain/types";
import type { Opportunity, SkillId } from "./domain/catalog";
import {
  allOpportunities,
  analyseRole,
  buildCompetencyProfile,
  buildLearningPath,
  careerReadiness,
  matchOpportunity,
  type LearningStep,
} from "./domain/engine";

const KEY = "skillbridge.state.v1";

type Persisted = {
  evidence: Evidence[];
  completedLearning: LearningStepState[];
  applications: Application[];
  targetRoleId: string;
  recruiterOpportunities: Opportunity[];
  shortlist: Record<string, string[]>;
};

const initial: Persisted = {
  evidence: SEED_EVIDENCE,
  completedLearning: [],
  applications: [],
  targetRoleId: "ml-intern",
  recruiterOpportunities: [],
  shortlist: {},
};

type Ctx = {
  state: Persisted;
  profile: Competency[];
  fit: RoleFit;
  learningPath: LearningStep[];
  opportunities: Opportunity[];
  matches: Record<string, ReturnType<typeof matchOpportunity>>;
  readiness: ReturnType<typeof careerReadiness>;
  addEvidence: (e: Omit<Evidence, "id" | "createdAt">) => void;
  removeEvidence: (id: string) => void;
  setTargetRole: (id: string) => void;
  toggleLearningStep: (skill: SkillId) => void;
  setApplicationStatus: (opportunityId: string, status: ApplicationStatus) => void;
  removeApplication: (opportunityId: string) => void;
  applicationFor: (opportunityId: string) => Application | undefined;
  addOpportunity: (o: Omit<Opportunity, "id" | "postedBy">) => void;
  toggleShortlist: (opportunityId: string, studentId: string) => void;
  resetDemo: () => void;
};

const StoreContext = createContext<Ctx | null>(null);

const today = () => new Date().toISOString().slice(0, 10);
const uid = () => Math.random().toString(36).slice(2, 10);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...initial, ...(JSON.parse(raw) as Persisted) });
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage full or unavailable */
    }
  }, [state, hydrated]);

  const addEvidence = useCallback((e: Omit<Evidence, "id" | "createdAt">) => {
    setState((s) => ({ ...s, evidence: [{ ...e, id: `ev-${uid()}`, createdAt: today() }, ...s.evidence] }));
  }, []);

  const removeEvidence = useCallback((id: string) => {
    setState((s) => ({ ...s, evidence: s.evidence.filter((e) => e.id !== id) }));
  }, []);

  const setTargetRole = useCallback((id: string) => setState((s) => ({ ...s, targetRoleId: id })), []);

  const toggleLearningStep = useCallback((skill: SkillId) => {
    setState((s) => ({
      ...s,
      completedLearning: s.completedLearning.some((c) => c.skill === skill)
        ? s.completedLearning.filter((c) => c.skill !== skill)
        : [...s.completedLearning, { skill, completedAt: today() }],
    }));
  }, []);

  const setApplicationStatus = useCallback((opportunityId: string, status: ApplicationStatus) => {
    setState((s) => {
      const existing = s.applications.find((a) => a.opportunityId === opportunityId);
      const at = today();
      if (!existing) {
        return {
          ...s,
          applications: [
            { id: `app-${uid()}`, opportunityId, status, updatedAt: at, history: [{ status, at }] },
            ...s.applications,
          ],
        };
      }
      return {
        ...s,
        applications: s.applications.map((a) =>
          a.opportunityId === opportunityId
            ? { ...a, status, updatedAt: at, history: [...a.history, { status, at }] }
            : a,
        ),
      };
    });
  }, []);

  const removeApplication = useCallback((opportunityId: string) => {
    setState((s) => ({ ...s, applications: s.applications.filter((a) => a.opportunityId !== opportunityId) }));
  }, []);

  const addOpportunity = useCallback((o: Omit<Opportunity, "id" | "postedBy">) => {
    setState((s) => ({
      ...s,
      recruiterOpportunities: [{ ...o, id: `opp-${uid()}`, postedBy: "recruiter" }, ...s.recruiterOpportunities],
    }));
  }, []);

  const toggleShortlist = useCallback((opportunityId: string, studentId: string) => {
    setState((s) => {
      const current = s.shortlist[opportunityId] ?? [];
      const next = current.includes(studentId)
        ? current.filter((x) => x !== studentId)
        : [...current, studentId];
      return { ...s, shortlist: { ...s.shortlist, [opportunityId]: next } };
    });
  }, []);

  const resetDemo = useCallback(() => setState(initial), []);

  const profile = useMemo(
    () => buildCompetencyProfile(state.evidence, state.completedLearning),
    [state.evidence, state.completedLearning],
  );
  const fit = useMemo(() => analyseRole(profile, state.targetRoleId), [profile, state.targetRoleId]);
  const learningPath = useMemo(() => buildLearningPath(fit, state.completedLearning), [fit, state.completedLearning]);
  const opportunities = useMemo(() => allOpportunities(state.recruiterOpportunities), [state.recruiterOpportunities]);
  const matches = useMemo(() => {
    const map: Record<string, ReturnType<typeof matchOpportunity>> = {};
    for (const o of opportunities) map[o.id] = matchOpportunity(profile, o);
    return map;
  }, [opportunities, profile]);
  const readiness = useMemo(
    () => careerReadiness(profile, fit, state.evidence, state.completedLearning, state.applications),
    [profile, fit, state.evidence, state.completedLearning, state.applications],
  );

  const applicationFor = useCallback(
    (opportunityId: string) => state.applications.find((a) => a.opportunityId === opportunityId),
    [state.applications],
  );

  const value: Ctx = {
    state,
    profile,
    fit,
    learningPath,
    opportunities,
    matches,
    readiness,
    addEvidence,
    removeEvidence,
    setTargetRole,
    toggleLearningStep,
    setApplicationStatus,
    removeApplication,
    applicationFor,
    addOpportunity,
    toggleShortlist,
    resetDemo,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Ctx {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
