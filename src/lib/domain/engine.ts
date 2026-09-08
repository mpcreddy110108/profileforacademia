/**
 * Competency engine.
 *
 * Every score in the app is derived here from evidence the student added.
 * The maths is transparent and deterministic (no ML, no embeddings) — the
 * explanations returned alongside each score describe exactly how it was
 * produced, so nothing in the UI is a hardcoded number.
 */

import {
  ROLES,
  SEED_OPPORTUNITIES,
  roleById,
  skillName,
  type Opportunity,
  type SkillId,
} from "./catalog";
import type {
  Application,
  Competency,
  Evidence,
  EvidenceType,
  GapRow,
  LearningStepState,
  OpportunityMatch,
  RoleFit,
  VerificationStatus,
} from "./types";

/** How much a single piece of evidence can contribute to a skill. */
const TYPE_WEIGHT: Record<EvidenceType, number> = {
  internship: 24,
  project: 18,
  certification: 14,
  assessment: 32,
  resume: 6,
};

const TYPE_BASE_STRENGTH: Record<EvidenceType, number> = {
  internship: 55,
  project: 50,
  certification: 45,
  assessment: 60,
  resume: 25,
};

const VERIFICATION_BONUS: Record<VerificationStatus, number> = {
  "self-reported": 0,
  "peer-reviewed": 14,
  "institution-verified": 26,
};

/** 0-100 quality score of a single evidence item. */
export function evidenceStrength(e: Evidence): number {
  const detail = Math.min(12, Math.round(e.description.trim().length / 25));
  const breadth = Math.min(6, e.skills.length * 2);
  const scoreBoost = e.type === "assessment" && e.score != null ? Math.round((e.score - 60) / 4) : 0;
  return clamp(TYPE_BASE_STRENGTH[e.type] + VERIFICATION_BONUS[e.verification] + detail + breadth + scoreBoost, 5, 100);
}

export function evidenceStrengthLabel(v: number): string {
  if (v >= 80) return "Very strong";
  if (v >= 65) return "Strong";
  if (v >= 45) return "Moderate";
  return "Weak";
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** Diminishing-returns curve: many weak items never beat a few verified ones. */
const curve = (contribution: number) => Math.round(97 * (1 - Math.exp(-contribution / 35)));

export function buildCompetencyProfile(
  evidence: Evidence[],
  completedLearning: LearningStepState[],
): Competency[] {
  const acc = new Map<SkillId, { total: number; ids: string[]; assessment?: number; parts: string[] }>();

  const touch = (skill: SkillId) => {
    let entry = acc.get(skill);
    if (!entry) {
      entry = { total: 0, ids: [], parts: [] };
      acc.set(skill, entry);
    }
    return entry;
  };

  for (const e of evidence) {
    const strength = evidenceStrength(e) / 100;
    const base = TYPE_WEIGHT[e.type] * strength;
    const contribution = e.type === "assessment" && e.score != null ? TYPE_WEIGHT.assessment * (e.score / 100) : base;
    for (const skill of e.skills) {
      const entry = touch(skill);
      entry.total += contribution;
      entry.ids.push(e.id);
      if (e.type === "assessment" && e.score != null) {
        entry.assessment = Math.max(entry.assessment ?? 0, e.score);
      }
      entry.parts.push(`${labelForType(e.type)} "${e.title}" (${e.verification}, strength ${Math.round(strength * 100)})`);
    }
  }

  for (const step of completedLearning) {
    const entry = touch(step.skill);
    entry.total += 10;
    entry.parts.push("completed learning-path step (self-reported)");
  }

  return [...acc.entries()]
    .map(([skill, entry]) => {
      const score = curve(entry.total);
      return {
        skill,
        score,
        level: score >= 75 ? "strong" : score >= 45 ? "developing" : "gap",
        evidenceIds: entry.ids,
        assessmentScore: entry.assessment,
        explanation: `${score}% derived from ${entry.parts.length} signal(s): ${entry.parts.join("; ")}.`,
      } satisfies Competency;
    })
    .sort((a, b) => b.score - a.score);
}

function labelForType(t: EvidenceType) {
  return t === "resume" ? "resume mention" : t;
}

export const scoreFor = (profile: Competency[], skill: SkillId): number =>
  profile.find((c) => c.skill === skill)?.score ?? 0;

/* ------------------------------------------------------- gap analysis */

export function analyseRole(profile: Competency[], roleId: string): RoleFit {
  const role = roleById(roleId);
  const rows: GapRow[] = role.requirements.map((req) => {
    const current = scoreFor(profile, req.skill);
    const gap = req.required - current;
    const status: GapRow["status"] =
      gap <= 0 ? "Satisfied" : req.mandatory && gap >= 20 ? "Critical Gap" : "Moderate Gap";
    const priority: GapRow["priority"] =
      status === "Satisfied" ? "Satisfied" : status === "Critical Gap" ? "High" : "Medium";
    const explanation =
      gap <= 0
        ? `Your evidence-backed ${skillName(req.skill)} score of ${current}% clears the ${req.required}% bar for this role.`
        : `${skillName(req.skill)} is ${gap} points below the ${req.required}% requirement${req.mandatory ? " and is mandatory for this role" : ""}. Current score ${current}% comes from your existing evidence.`;
    return { skill: req.skill, current, required: req.required, mandatory: req.mandatory, status, priority, explanation };
  });

  let weighted = 0;
  let weightSum = 0;
  for (const r of rows) {
    const w = r.mandatory ? 2 : 1;
    weighted += w * Math.min(1, r.current / r.required);
    weightSum += w;
  }
  const fit = weightSum ? Math.round((weighted / weightSum) * 100) : 0;

  return {
    roleId: role.id,
    fit,
    rows,
    matched: rows.filter((r) => r.status === "Satisfied"),
    missing: rows.filter((r) => r.status !== "Satisfied"),
    mandatoryGaps: rows.filter((r) => r.status !== "Satisfied" && r.mandatory),
  };
}

/* ------------------------------------------------------ learning path */

export type LearningStep = {
  skill: SkillId;
  gap: number;
  required: number;
  current: number;
  priority: GapRow["priority"];
  completed: boolean;
};

export function buildLearningPath(
  fit: RoleFit,
  completed: LearningStepState[],
): LearningStep[] {
  return fit.missing
    .map((row) => ({
      skill: row.skill,
      gap: row.required - row.current,
      required: row.required,
      current: row.current,
      priority: row.priority,
      completed: completed.some((c) => c.skill === row.skill),
    }))
    .sort((a, b) => (a.priority === b.priority ? b.gap - a.gap : a.priority === "High" ? -1 : 1));
}

/* --------------------------------------------------- opportunity match */

export function matchOpportunity(profile: Competency[], opp: Opportunity): OpportunityMatch {
  const matched: SkillId[] = [];
  const missing: SkillId[] = [];
  let coverage = 0;

  for (const req of opp.required) {
    const current = scoreFor(profile, req.skill);
    const ratio = Math.min(1, current / req.level);
    coverage += ratio;
    if (current >= req.level) matched.push(req.skill);
    else missing.push(req.skill);
  }
  const requiredScore = opp.required.length ? coverage / opp.required.length : 0;

  const preferredHits = opp.preferred.filter((s) => scoreFor(profile, s) >= 50);
  const preferredScore = opp.preferred.length ? preferredHits.length / opp.preferred.length : 0;

  const score = Math.round((requiredScore * 0.85 + preferredScore * 0.15) * 100);
  const readiness = Math.round(
    (opp.required.filter((r) => scoreFor(profile, r.skill) >= r.level).length / Math.max(1, opp.required.length)) * 100,
  );

  const matchedText = matched.length
    ? `Matched because your ${matched.map(skillName).join(", ")} ${matched.length > 1 ? "competencies are" : "competency is"} backed by evidence in your portfolio.`
    : "No required skill currently clears the posted threshold.";
  const missingText = missing.length
    ? ` ${missing.map(skillName).join(", ")} ${missing.length > 1 ? "are" : "is"} still a gap.`
    : " You meet every required skill threshold.";
  const preferredText = preferredHits.length ? ` Bonus: you also cover preferred ${preferredHits.map(skillName).join(", ")}.` : "";

  return {
    opportunityId: opp.id,
    score,
    readiness,
    matchedSkills: matched,
    missingSkills: missing,
    preferredHits,
    explanation: matchedText + missingText + preferredText,
  };
}

export const allOpportunities = (extra: Opportunity[]): Opportunity[] => [...extra, ...SEED_OPPORTUNITIES];

/* ------------------------------------------------------- readiness */

export function careerReadiness(
  profile: Competency[],
  fit: RoleFit,
  evidence: Evidence[],
  completed: LearningStepState[],
  applications: Application[],
) {
  const evidenceBreadth = Math.min(100, evidence.length * 12);
  const verifiedShare = evidence.length
    ? Math.round((evidence.filter((e) => e.verification !== "self-reported").length / evidence.length) * 100)
    : 0;
  const assessmentScores = profile.map((c) => c.assessmentScore).filter((s): s is number => s != null);
  const assessmentAvg = assessmentScores.length
    ? Math.round(assessmentScores.reduce((a, b) => a + b, 0) / assessmentScores.length)
    : 0;
  const learningProgress = (() => {
    const total = fit.missing.length + completed.length;
    return total ? Math.round((completed.length / total) * 100) : 100;
  })();
  const applicationMomentum = Math.min(100, applications.filter((a) => a.status !== "saved").length * 25);

  const components = [
    { label: "Target role fit", value: fit.fit, weight: 0.35 },
    { label: "Evidence breadth", value: evidenceBreadth, weight: 0.15 },
    { label: "Verified evidence share", value: verifiedShare, weight: 0.15 },
    { label: "Assessment performance", value: assessmentAvg, weight: 0.15 },
    { label: "Learning path progress", value: learningProgress, weight: 0.1 },
    { label: "Application momentum", value: applicationMomentum, weight: 0.1 },
  ];
  const index = Math.round(components.reduce((sum, c) => sum + c.value * c.weight, 0));
  const band = index >= 75 ? "Placement Ready" : index >= 55 ? "Nearly Ready" : "Building Evidence";
  return { index, band, components };
}

/* -------------------------------------------------- resume extraction */

/**
 * Keyword/alias matching against the skill catalog — deliberately simple and
 * explainable. This is NOT semantic NLP; swap in embeddings server-side later.
 */
export function extractSkillsFromText(text: string): { skill: SkillId; matchedTerm: string }[] {
  const lower = ` ${text.toLowerCase().replace(/[^a-z0-9+#./ ]/g, " ")} `;
  const found: { skill: SkillId; matchedTerm: string }[] = [];
  for (const s of SKILLS_FOR_EXTRACTION) {
    const hit = s.aliases.find((a) => lower.includes(` ${a} `) || lower.includes(`${a},`) || lower.includes(` ${a}.`));
    if (hit) found.push({ skill: s.id, matchedTerm: hit });
  }
  return found;
}

import { SKILLS } from "./catalog";
const SKILLS_FOR_EXTRACTION = SKILLS;

/* ------------------------------------------------------- role helpers */

export function bestRoleFor(profile: Competency[]) {
  return ROLES.map((r) => analyseRole(profile, r.id)).sort((a, b) => b.fit - a.fit)[0]!;
}

/** Wraps a plain skill→score map (demo cohort data) as a competency profile. */
export function profileFromScores(map: Record<string, number>): Competency[] {
  return Object.entries(map).map(([skill, score]) => ({
    skill,
    score,
    level: score >= 75 ? "strong" : score >= 45 ? "developing" : "gap",
    evidenceIds: [],
    explanation: `${score}% from this student's recorded portfolio (demo cohort dataset).`,
  }));
}
