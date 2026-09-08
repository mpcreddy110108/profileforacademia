import type { Evidence } from "./types";

export const STUDENT = {
  name: "Aarav V. Sharma",
  uid: "STU-2023-8841",
  program: "B.Tech Computer Science & Engineering",
  semester: "6th Semester",
  specialisation: "Artificial Intelligence",
  institution: "NIT Warangal",
  photo:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAq2H-CjLCj3v3VA-rZelhmOcJHzkUTJsISafegSyBxhWRjbIu-0akdyH_9MZvhG9ClxMdF0gAA40HAurWumqsXS-SRAqkgrtjBhMghOc0s47YT0lG2gW_WB8nv8nHSiOo4XIVPC_x81dmzx2nn3xfsNDLnKULYSo3WfJoq74hN_GzhnrVsse8_YmNQ1unZ_xQAtq_23MSZN5IMc7BZ51HfGbu6cD3N5Anytc3XJMMsyn1ljFJ4H7Vm-w",
};

export const SEED_EVIDENCE: Evidence[] = [
  {
    id: "ev-1",
    type: "project",
    title: "Python Machine Learning Project — Predictive Maintenance",
    description:
      "Built an end-to-end pipeline predicting equipment failure from sensor logs. Cleaned 1.2M rows with Pandas and NumPy, engineered rolling-window features, trained gradient boosting and logistic regression baselines, and reported precision/recall trade-offs.",
    skills: ["python", "pandas", "numpy", "ml"],
    verification: "institution-verified",
    createdAt: "2025-11-04",
    source: "manual",
  },
  {
    id: "ev-2",
    type: "project",
    title: "Campus Placement Analytics Dashboard",
    description:
      "Modelled a 6-table placement warehouse in PostgreSQL, wrote analytical SQL with window functions, and shipped a Matplotlib/Seaborn report used by the training & placement cell.",
    skills: ["sql", "python", "viz", "stats"],
    verification: "peer-reviewed",
    createdAt: "2026-01-18",
    source: "manual",
  },
  {
    id: "ev-3",
    type: "certification",
    title: "NPTEL — Database Management Systems (Elite)",
    description: "12-week NPTEL course with proctored end-term exam covering relational modelling, normalisation, indexing and query optimisation.",
    skills: ["sql"],
    verification: "institution-verified",
    createdAt: "2025-08-22",
    source: "manual",
  },
  {
    id: "ev-4",
    type: "internship",
    title: "Backend Intern — Aeris Softworks (8 weeks)",
    description:
      "Wrote Flask REST endpoints for an inventory service, containerised the service with Docker, and worked through code review on GitHub with the platform team.",
    skills: ["python", "rest", "docker", "git", "linux"],
    verification: "institution-verified",
    createdAt: "2025-07-10",
    source: "manual",
  },
  {
    id: "ev-5",
    type: "project",
    title: "DSA Practice Repository — 180 solved problems",
    description: "Topic-wise solutions with complexity notes for arrays, graphs, DP and trees, maintained publicly with commit history.",
    skills: ["dsa", "python", "git"],
    verification: "self-reported",
    createdAt: "2026-02-02",
    source: "manual",
  },
  {
    id: "ev-6",
    type: "resume",
    title: "Resume v4 — AI/ML track",
    description: "Two-page resume listing Python, SQL, machine learning and cloud exposure alongside coursework in AI and robotics.",
    skills: ["python", "sql", "ml", "aws", "typescript"],
    verification: "self-reported",
    createdAt: "2026-02-20",
    source: "manual",
  },
];

/** Peer cohort used for institution analytics and recruiter matching (demo data). */
export type DemoStudent = {
  id: string;
  name: string;
  branch: string;
  year: string;
  evidenceCount: number;
  verifiedEvidence: number;
  skills: Record<string, number>;
};

export const DEMO_COHORT: DemoStudent[] = [
  { id: "STU-2023-8802", name: "Meera Nair", branch: "CSE", year: "6th Sem", evidenceCount: 7, verifiedEvidence: 5, skills: { python: 88, sql: 82, ml: 74, pytorch: 66, dsa: 79, viz: 71, stats: 68, docker: 52, aws: 41, react: 30, typescript: 35, node: 28, rest: 55, bi: 60, excel: 64, git: 70, linux: 48, mongo: 25, nlp: 40, pandas: 80, numpy: 76 } },
  { id: "STU-2023-8815", name: "Rohit Deshmukh", branch: "IT", year: "8th Sem", evidenceCount: 9, verifiedEvidence: 6, skills: { python: 71, sql: 74, ml: 45, pytorch: 22, dsa: 82, viz: 48, stats: 44, docker: 63, aws: 58, react: 84, typescript: 81, node: 78, rest: 76, bi: 20, excel: 40, git: 80, linux: 66, mongo: 72, nlp: 15, pandas: 55, numpy: 48 } },
  { id: "STU-2023-8829", name: "Ananya Iyer", branch: "CSE", year: "6th Sem", evidenceCount: 5, verifiedEvidence: 2, skills: { python: 64, sql: 88, ml: 38, pytorch: 18, dsa: 55, viz: 84, stats: 79, docker: 20, aws: 24, react: 35, typescript: 30, node: 18, rest: 32, bi: 82, excel: 86, git: 45, linux: 28, mongo: 22, nlp: 12, pandas: 74, numpy: 60 } },
  { id: "STU-2023-8840", name: "Kabir Sethi", branch: "ECE", year: "8th Sem", evidenceCount: 4, verifiedEvidence: 1, skills: { python: 58, sql: 46, ml: 52, pytorch: 44, dsa: 49, viz: 40, stats: 51, docker: 30, aws: 33, react: 22, typescript: 26, node: 18, rest: 30, bi: 18, excel: 42, git: 38, linux: 44, mongo: 14, nlp: 36, pandas: 50, numpy: 55 } },
  { id: "STU-2023-8856", name: "Priya Raghavan", branch: "CSE", year: "6th Sem", evidenceCount: 8, verifiedEvidence: 6, skills: { python: 82, sql: 70, ml: 78, pytorch: 74, dsa: 72, viz: 62, stats: 66, docker: 58, aws: 62, react: 40, typescript: 44, node: 30, rest: 58, bi: 32, excel: 45, git: 68, linux: 60, mongo: 28, nlp: 70, pandas: 78, numpy: 74 } },
  { id: "STU-2023-8871", name: "Devansh Kulkarni", branch: "IT", year: "6th Sem", evidenceCount: 3, verifiedEvidence: 1, skills: { python: 44, sql: 52, ml: 20, pytorch: 10, dsa: 40, viz: 35, stats: 30, docker: 15, aws: 18, react: 58, typescript: 55, node: 50, rest: 46, bi: 22, excel: 48, git: 52, linux: 30, mongo: 44, nlp: 8, pandas: 38, numpy: 32 } },
];
