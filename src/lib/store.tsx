import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";
import { SEED_EVIDENCE } from "./domain/seed";
import type {
  AppRole,
  Application,
  ApplicationStatus,
  Competency,
  Evidence,
  EvidenceReview,
  LearningStepState,
  RoleFit,
  StudentProfile,
} from "./domain/types";
import type { Opportunity, SkillId } from "./domain/catalog";
import { SEED_OPPORTUNITIES } from "./domain/catalog";
import {
  analyseRole,
  buildCompetencyProfile,
  buildLearningPath,
  careerReadiness,
  matchOpportunity,
  type LearningStep,
} from "./domain/engine";

/* ------------------------------------------------------------------ types */

type Persisted = {
  evidence: Evidence[];
  completedLearning: LearningStepState[];
  applications: Application[];
  targetRoleId: string;
  recruiterOpportunities: Opportunity[];
  shortlist: Record<string, string[]>;
};

export type EvidenceInput = Omit<Evidence, "id" | "createdAt">;

type Ctx = {
  state: Persisted;
  loading: boolean;
  error: string | null;
  session: Session | null;
  userId: string | null;
  profile: StudentProfile | null;
  role: AppRole;
  reviews: EvidenceReview[];
  competencies: Competency[];
  /** Alias kept for existing pages. */
  profileScores: Competency[];
  fit: RoleFit;
  learningPath: LearningStep[];
  opportunities: Opportunity[];
  matches: Record<string, ReturnType<typeof matchOpportunity>>;
  readiness: ReturnType<typeof careerReadiness>;
  refresh: () => Promise<void>;
  addEvidence: (e: EvidenceInput) => Promise<void>;
  updateEvidence: (id: string, patch: Partial<EvidenceInput>) => Promise<void>;
  removeEvidence: (id: string) => Promise<void>;
  uploadEvidenceFile: (file: File) => Promise<string>;
  fileUrl: (path: string) => Promise<string | null>;
  setTargetRole: (id: string) => Promise<void>;
  updateProfile: (patch: Partial<StudentProfile>) => Promise<void>;
  toggleLearningStep: (skill: SkillId) => Promise<void>;
  setApplicationStatus: (opportunityId: string, status: ApplicationStatus) => Promise<void>;
  removeApplication: (opportunityId: string) => Promise<void>;
  applicationFor: (opportunityId: string) => Application | undefined;
  addOpportunity: (o: Omit<Opportunity, "id" | "postedBy">) => Promise<void>;
  toggleShortlist: (opportunityId: string, studentId: string) => Promise<void>;
  loadDemoEvidence: () => Promise<void>;
  clearMyData: () => Promise<void>;
  exportMyData: () => void;
  signOut: () => Promise<void>;
};

const empty: Persisted = {
  evidence: [],
  completedLearning: [],
  applications: [],
  targetRoleId: "ml-intern",
  recruiterOpportunities: [],
  shortlist: {},
};

const StoreContext = createContext<Ctx | null>(null);

/* ----------------------------------------------------------- row mapping */

type EvidenceRow = {
  id: string;
  type: Evidence["type"];
  title: string;
  description: string;
  skills: string[];
  verification: Evidence["verification"];
  score: number | null;
  source: string;
  outcome: string | null;
  url: string | null;
  occurred_on: string | null;
  file_path: string | null;
  is_demo: boolean;
  created_at: string;
};

const toEvidence = (r: EvidenceRow): Evidence => ({
  id: r.id,
  type: r.type,
  title: r.title,
  description: r.description ?? "",
  skills: (r.skills ?? []) as SkillId[],
  verification: r.verification,
  score: r.score ?? undefined,
  createdAt: (r.occurred_on ?? r.created_at).slice(0, 10),
  source: (r.source as Evidence["source"]) ?? "manual",
  outcome: r.outcome ?? undefined,
  url: r.url ?? undefined,
  occurredOn: r.occurred_on ?? undefined,
  filePath: r.file_path ?? undefined,
  isDemo: r.is_demo,
});

type OpportunityRow = {
  id: string;
  title: string;
  org: string;
  location: string;
  kind: string;
  stipend: string;
  description: string;
  required: { skill: string; min: number }[];
  preferred: string[];
  is_demo: boolean;
  posted_by: string | null;
};

const toOpportunity = (r: OpportunityRow): Opportunity => ({
  id: r.id,
  company: r.org,
  role: r.title,
  location: r.location,
  type: (r.kind as Opportunity["type"]) ?? "Internship",
  stipend: r.stipend || "Not disclosed",
  required: (r.required ?? []).map((x) => ({ skill: x.skill as SkillId, level: x.min })),
  preferred: (r.preferred ?? []) as SkillId[],
  description: r.description ?? "",
  postedBy: r.is_demo ? "demo" : "recruiter",
});

const toProfile = (r: Record<string, unknown>): StudentProfile => ({
  id: String(r["id"]),
  fullName: (r["full_name"] as string) ?? "",
  college: (r["college"] as string) ?? "",
  degree: (r["degree"] as string) ?? "",
  branch: (r["branch"] as string) ?? "",
  semester: (r["semester"] as string) ?? "",
  specialisation: (r["specialisation"] as string) ?? "",
  targetRoleId: (r["target_role_id"] as string) ?? "ml-intern",
  githubUrl: (r["github_url"] as string) ?? "",
  linkedinUrl: (r["linkedin_url"] as string) ?? "",
  weeklyHours: (r["weekly_hours"] as number) ?? 6,
  photoUrl: (r["photo_url"] as string) ?? "",
  onboarded: Boolean(r["onboarded"]),
  isDemo: Boolean(r["is_demo"]),
  visibleToRecruiters: Boolean(r["visible_to_recruiters"]),
  resumeVisible: Boolean(r["resume_visible"]),
  evidenceVisible: Boolean(r["evidence_visible"]),
  consentedAt: (r["consented_at"] as string) ?? null,
});

const profilePatchToRow = (p: Partial<StudentProfile>): Record<string, unknown> => {
  const map: Record<keyof StudentProfile, string> = {
    id: "id",
    fullName: "full_name",
    college: "college",
    degree: "degree",
    branch: "branch",
    semester: "semester",
    specialisation: "specialisation",
    targetRoleId: "target_role_id",
    githubUrl: "github_url",
    linkedinUrl: "linkedin_url",
    weeklyHours: "weekly_hours",
    photoUrl: "photo_url",
    onboarded: "onboarded",
    isDemo: "is_demo",
    visibleToRecruiters: "visible_to_recruiters",
    resumeVisible: "resume_visible",
    evidenceVisible: "evidence_visible",
    consentedAt: "consented_at",
  };
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(p)) {
    if (v !== undefined && k !== "id") out[map[k as keyof StudentProfile]] = v;
  }
  return out;
};

const evidencePatchToRow = (e: Partial<EvidenceInput>): Record<string, unknown> => ({
  ...(e.type !== undefined ? { type: e.type } : {}),
  ...(e.title !== undefined ? { title: e.title } : {}),
  ...(e.description !== undefined ? { description: e.description } : {}),
  ...(e.skills !== undefined ? { skills: e.skills } : {}),
  ...(e.verification !== undefined ? { verification: e.verification } : {}),
  ...(e.score !== undefined ? { score: e.score } : {}),
  ...(e.source !== undefined ? { source: e.source } : {}),
  ...(e.outcome !== undefined ? { outcome: e.outcome } : {}),
  ...(e.url !== undefined ? { url: e.url } : {}),
  ...(e.occurredOn !== undefined ? { occurred_on: e.occurredOn } : {}),
  ...(e.filePath !== undefined ? { file_path: e.filePath } : {}),
});

/* ------------------------------------------------------------- provider */

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(empty);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [role, setRole] = useState<AppRole>("student");
  const [reviews, setReviews] = useState<EvidenceReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = session?.user.id ?? null;

  const load = useCallback(async (uid: string | null) => {
    if (!uid) {
      setState(empty);
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [profileRes, evidenceRes, progressRes, appsRes, oppsRes, shortRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", uid).maybeSingle(),
        supabase.from("evidence").select("*").eq("user_id", uid).order("created_at", { ascending: false }),
        supabase.from("learning_progress").select("*").eq("user_id", uid),
        supabase.from("applications").select("*").eq("user_id", uid),
        supabase.from("opportunities").select("*").order("created_at", { ascending: false }),
        supabase.from("shortlists").select("*"),
      ]);

      const firstError =
        profileRes.error ?? evidenceRes.error ?? progressRes.error ?? appsRes.error ?? oppsRes.error ?? shortRes.error;
      if (firstError) throw firstError;

      const prof = profileRes.data ? toProfile(profileRes.data as Record<string, unknown>) : null;
      setProfile(prof);

      const rolesRes = await supabase.from("user_roles").select("role").eq("user_id", uid).limit(1).maybeSingle();
      setRole(((rolesRes.data?.role as AppRole | undefined) ?? "student") as AppRole);

      const evidence = ((evidenceRes.data ?? []) as unknown as EvidenceRow[]).map(toEvidence);
      const opportunities = ((oppsRes.data ?? []) as unknown as OpportunityRow[]).map(toOpportunity);

      const shortlist: Record<string, string[]> = {};
      for (const s of (shortRes.data ?? []) as { opportunity_id: string; student_id: string }[]) {
        shortlist[s.opportunity_id] = [...(shortlist[s.opportunity_id] ?? []), s.student_id];
      }

      setState({
        evidence,
        completedLearning: ((progressRes.data ?? []) as { skill: string; completed_at: string }[]).map((r) => ({
          skill: r.skill as SkillId,
          completedAt: r.completed_at.slice(0, 10),
        })),
        applications: ((appsRes.data ?? []) as {
          id: string;
          opportunity_id: string;
          status: ApplicationStatus;
          history: { status: ApplicationStatus; at: string }[];
          updated_at: string;
        }[]).map((r) => ({
          id: r.id,
          opportunityId: r.opportunity_id,
          status: r.status,
          updatedAt: r.updated_at.slice(0, 10),
          history: r.history ?? [],
        })),
        targetRoleId: prof?.targetRoleId ?? "ml-intern",
        recruiterOpportunities: opportunities,
        shortlist,
      });

      if (evidence.length) {
        const reviewRes = await supabase
          .from("evidence_reviews")
          .select("*")
          .in("evidence_id", evidence.map((e) => e.id));
        setReviews(
          ((reviewRes.data ?? []) as { id: string; evidence_id: string; action: EvidenceReview["action"]; comment: string; created_at: string }[]).map(
            (r) => ({ id: r.id, evidenceId: r.evidence_id, action: r.action, comment: r.comment, createdAt: r.created_at.slice(0, 10) }),
          ),
        );
      } else {
        setReviews([]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load your data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      if (!active) return;
      setSession(s);
      void load(s?.user.id ?? null);
    });
    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      void load(data.session?.user.id ?? null);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [load]);

  const refresh = useCallback(async () => load(userId), [load, userId]);

  /* --------------------------------------------------------- mutations */

  const addEvidence = useCallback(
    async (e: EvidenceInput) => {
      if (!userId) return;
      const { error: err } = await supabase.from("evidence").insert({
        user_id: userId,
        type: e.type,
        title: e.title,
        description: e.description,
        skills: e.skills,
        verification: e.verification,
        score: e.score ?? null,
        source: e.source ?? "manual",
        outcome: e.outcome ?? null,
        url: e.url ?? null,
        occurred_on: e.occurredOn ?? null,
        file_path: e.filePath ?? null,
      });
      if (err) throw err;
      await load(userId);
    },
    [userId, load],
  );

  const updateEvidence = useCallback(
    async (id: string, patch: Partial<EvidenceInput>) => {
      const { error: err } = await supabase.from("evidence").update(evidencePatchToRow(patch)).eq("id", id);
      if (err) throw err;
      await load(userId);
    },
    [userId, load],
  );

  const removeEvidence = useCallback(
    async (id: string) => {
      const { error: err } = await supabase.from("evidence").delete().eq("id", id);
      if (err) throw err;
      await load(userId);
    },
    [userId, load],
  );

  const uploadEvidenceFile = useCallback(
    async (file: File) => {
      if (!userId) throw new Error("Sign in first");
      const path = `${userId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
      const { error: err } = await supabase.storage.from("evidence").upload(path, file);
      if (err) throw err;
      return path;
    },
    [userId],
  );

  const fileUrl = useCallback(async (path: string) => {
    const { data } = await supabase.storage.from("evidence").createSignedUrl(path, 3600);
    return data?.signedUrl ?? null;
  }, []);

  const updateProfile = useCallback(
    async (patch: Partial<StudentProfile>) => {
      if (!userId) return;
      const { error: err } = await supabase.from("profiles").update(profilePatchToRow(patch)).eq("id", userId);
      if (err) throw err;
      await load(userId);
    },
    [userId, load],
  );

  const setTargetRole = useCallback(
    async (id: string) => {
      setState((s) => ({ ...s, targetRoleId: id }));
      await updateProfile({ targetRoleId: id });
    },
    [updateProfile],
  );

  const toggleLearningStep = useCallback(
    async (skill: SkillId) => {
      if (!userId) return;
      const done = state.completedLearning.some((c) => c.skill === skill);
      if (done) {
        await supabase.from("learning_progress").delete().eq("user_id", userId).eq("skill", skill);
      } else {
        await supabase.from("learning_progress").insert({ user_id: userId, skill });
      }
      await load(userId);
    },
    [userId, state.completedLearning, load],
  );

  const setApplicationStatus = useCallback(
    async (opportunityId: string, status: ApplicationStatus) => {
      if (!userId) return;
      const at = new Date().toISOString().slice(0, 10);
      const existing = state.applications.find((a) => a.opportunityId === opportunityId);
      const history = [...(existing?.history ?? []), { status, at }];
      const { error: err } = await supabase
        .from("applications")
        .upsert(
          { user_id: userId, opportunity_id: opportunityId, status, history, updated_at: new Date().toISOString() },
          { onConflict: "user_id,opportunity_id" },
        );
      if (err) throw err;
      await load(userId);
    },
    [userId, state.applications, load],
  );

  const removeApplication = useCallback(
    async (opportunityId: string) => {
      if (!userId) return;
      await supabase.from("applications").delete().eq("user_id", userId).eq("opportunity_id", opportunityId);
      await load(userId);
    },
    [userId, load],
  );

  const addOpportunity = useCallback(
    async (o: Omit<Opportunity, "id" | "postedBy">) => {
      if (!userId) return;
      const { error: err } = await supabase.from("opportunities").insert({
        posted_by: userId,
        title: o.role,
        org: o.company,
        location: o.location,
        kind: o.type,
        stipend: o.stipend,
        description: o.description,
        required: o.required.map((r) => ({ skill: r.skill, min: r.level })),
        preferred: o.preferred,
      });
      if (err) throw err;
      await load(userId);
    },
    [userId, load],
  );

  const toggleShortlist = useCallback(
    async (opportunityId: string, studentId: string) => {
      if (!userId) return;
      const on = (state.shortlist[opportunityId] ?? []).includes(studentId);
      if (on) {
        await supabase
          .from("shortlists")
          .delete()
          .eq("opportunity_id", opportunityId)
          .eq("student_id", studentId)
          .eq("recruiter_id", userId);
      } else {
        await supabase.from("shortlists").insert({ opportunity_id: opportunityId, student_id: studentId, recruiter_id: userId });
      }
      await load(userId);
    },
    [userId, state.shortlist, load],
  );

  const loadDemoEvidence = useCallback(async () => {
    if (!userId) return;
    const rows = SEED_EVIDENCE.map((e) => ({
      user_id: userId,
      type: e.type,
      title: e.title,
      description: e.description,
      skills: e.skills,
      verification: e.verification,
      source: "demo-seed",
      occurred_on: e.createdAt,
      is_demo: true,
    }));
    const { error: err } = await supabase.from("evidence").insert(rows);
    if (err) throw err;
    await load(userId);
  }, [userId, load]);

  const clearMyData = useCallback(async () => {
    if (!userId) return;
    await Promise.all([
      supabase.from("evidence").delete().eq("user_id", userId),
      supabase.from("learning_progress").delete().eq("user_id", userId),
      supabase.from("applications").delete().eq("user_id", userId),
    ]);
    await load(userId);
  }, [userId, load]);

  const exportMyData = useCallback(() => {
    const payload = { profile, evidence: state.evidence, learning: state.completedLearning, applications: state.applications };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "skillbridge-data.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }, [profile, state]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setState(empty);
    setProfile(null);
  }, []);

  /* --------------------------------------------------------- derived */

  const competencies = useMemo(
    () => buildCompetencyProfile(state.evidence, state.completedLearning),
    [state.evidence, state.completedLearning],
  );
  const fit = useMemo(() => analyseRole(competencies, state.targetRoleId), [competencies, state.targetRoleId]);
  const learningPath = useMemo(() => buildLearningPath(fit, state.completedLearning), [fit, state.completedLearning]);
  const opportunities = useMemo(
    () => (state.recruiterOpportunities.length ? state.recruiterOpportunities : SEED_OPPORTUNITIES),
    [state.recruiterOpportunities],
  );
  const matches = useMemo(() => {
    const map: Record<string, ReturnType<typeof matchOpportunity>> = {};
    for (const o of opportunities) map[o.id] = matchOpportunity(competencies, o);
    return map;
  }, [opportunities, competencies]);
  const readiness = useMemo(
    () => careerReadiness(competencies, fit, state.evidence, state.completedLearning, state.applications),
    [competencies, fit, state.evidence, state.completedLearning, state.applications],
  );

  const applicationFor = useCallback(
    (opportunityId: string) => state.applications.find((a) => a.opportunityId === opportunityId),
    [state.applications],
  );

  const value: Ctx = {
    state,
    loading,
    error,
    session,
    userId,
    profile,
    role,
    reviews,
    competencies,
    profileScores: competencies,
    fit,
    learningPath,
    opportunities,
    matches,
    readiness,
    refresh,
    addEvidence,
    updateEvidence,
    removeEvidence,
    uploadEvidenceFile,
    fileUrl,
    setTargetRole,
    updateProfile,
    toggleLearningStep,
    setApplicationStatus,
    removeApplication,
    applicationFor,
    addOpportunity,
    toggleShortlist,
    loadDemoEvidence,
    clearMyData,
    exportMyData,
    signOut,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Ctx {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
