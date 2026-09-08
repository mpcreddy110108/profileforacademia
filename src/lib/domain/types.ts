import type { SkillId } from "./catalog";

export type EvidenceType = "project" | "certification" | "internship" | "resume" | "assessment";

export type VerificationStatus = "self-reported" | "peer-reviewed" | "institution-verified";

export type Evidence = {
  id: string;
  type: EvidenceType;
  title: string;
  description: string;
  skills: SkillId[];
  verification: VerificationStatus;
  /** Only for assessment evidence: 0-100 score from a taken quiz. */
  score?: number | undefined;
  createdAt: string;
  source?: undefined | "manual" | "resume-extractor" | "assessment" | "learning-path";
};

export type LearningStepState = { skill: SkillId; completedAt: string };

export type ApplicationStatus =
  | "saved"
  | "applied"
  | "shortlisted"
  | "interview"
  | "selected"
  | "rejected";

export type Application = {
  id: string;
  opportunityId: string;
  status: ApplicationStatus;
  updatedAt: string;
  history: { status: ApplicationStatus; at: string }[];
};

export type CompetencyLevel = "strong" | "developing" | "gap";

export type Competency = {
  skill: SkillId;
  score: number;
  level: CompetencyLevel;
  evidenceIds: string[];
  assessmentScore?: number | undefined;
  explanation: string;
};

export type GapRow = {
  skill: SkillId;
  current: number;
  required: number;
  mandatory: boolean;
  status: "Satisfied" | "Critical Gap" | "Moderate Gap";
  priority: "Satisfied" | "High" | "Medium";
  explanation: string;
};

export type RoleFit = {
  roleId: string;
  fit: number;
  rows: GapRow[];
  matched: GapRow[];
  missing: GapRow[];
  mandatoryGaps: GapRow[];
};

export type OpportunityMatch = {
  opportunityId: string;
  score: number;
  readiness: number;
  matchedSkills: SkillId[];
  missingSkills: SkillId[];
  preferredHits: SkillId[];
  explanation: string;
};
