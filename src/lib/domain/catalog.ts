/**
 * Static domain catalog (demo data).
 * Ready to be replaced by PostgreSQL tables + pgvector embeddings later:
 * every structure here is a plain serialisable DTO.
 */

export type SkillId = string;

export type SkillDef = {
  id: SkillId;
  name: string;
  category: "Programming" | "Data" | "AI/ML" | "Web" | "Cloud & DevOps" | "Foundations";
  aliases: string[];
};

export const SKILLS: SkillDef[] = [
  { id: "python", name: "Python", category: "Programming", aliases: ["python", "python3", "py"] },
  { id: "sql", name: "SQL", category: "Data", aliases: ["sql", "mysql", "postgres", "postgresql", "queries"] },
  { id: "dsa", name: "Data Structures & Algorithms", category: "Foundations", aliases: ["dsa", "data structures", "algorithms", "leetcode"] },
  { id: "pandas", name: "Pandas", category: "Data", aliases: ["pandas", "dataframe"] },
  { id: "numpy", name: "NumPy", category: "Data", aliases: ["numpy"] },
  { id: "ml", name: "Machine Learning", category: "AI/ML", aliases: ["machine learning", "ml", "scikit", "sklearn", "regression", "classification"] },
  { id: "pytorch", name: "PyTorch / Deep Learning", category: "AI/ML", aliases: ["pytorch", "torch", "deep learning", "neural network", "cnn", "tensorflow"] },
  { id: "nlp", name: "NLP", category: "AI/ML", aliases: ["nlp", "natural language", "transformers", "bert"] },
  { id: "stats", name: "Statistics", category: "Data", aliases: ["statistics", "statistical", "hypothesis", "probability"] },
  { id: "viz", name: "Data Visualization", category: "Data", aliases: ["visualization", "matplotlib", "seaborn", "plotly", "charts"] },
  { id: "bi", name: "BI Tooling (Tableau/Power BI)", category: "Data", aliases: ["tableau", "power bi", "powerbi", "looker", "dashboarding"] },
  { id: "excel", name: "Advanced Excel", category: "Data", aliases: ["excel", "spreadsheet", "pivot"] },
  { id: "react", name: "React / Frontend", category: "Web", aliases: ["react", "reactjs", "frontend", "next.js", "nextjs"] },
  { id: "typescript", name: "TypeScript / JavaScript", category: "Web", aliases: ["typescript", "javascript", "js", "ts", "es6"] },
  { id: "node", name: "Node.js / Express", category: "Web", aliases: ["node", "nodejs", "express", "backend"] },
  { id: "rest", name: "REST APIs", category: "Web", aliases: ["rest", "api", "apis", "graphql", "fastapi", "flask", "django"] },
  { id: "mongo", name: "NoSQL / MongoDB", category: "Data", aliases: ["mongodb", "mongo", "nosql", "firebase"] },
  { id: "docker", name: "Docker & Packaging", category: "Cloud & DevOps", aliases: ["docker", "container", "kubernetes", "k8s"] },
  { id: "aws", name: "Cloud (AWS/GCP)", category: "Cloud & DevOps", aliases: ["aws", "gcp", "azure", "cloud", "ec2", "s3"] },
  { id: "git", name: "Git & Deployment", category: "Cloud & DevOps", aliases: ["git", "github", "ci/cd", "deployment", "vercel"] },
  { id: "linux", name: "Linux & Shell", category: "Cloud & DevOps", aliases: ["linux", "bash", "shell", "ubuntu"] },
];

export const skillById = (id: SkillId): SkillDef | undefined => SKILLS.find((s) => s.id === id);
export const skillName = (id: SkillId): string => skillById(id)?.name ?? id;

/* ------------------------------------------------------------------ roles */

export type RoleRequirement = { skill: SkillId; required: number; mandatory: boolean };

export type RoleDef = {
  id: string;
  title: string;
  family: string;
  summary: string;
  requirements: RoleRequirement[];
};

export const ROLES: RoleDef[] = [
  {
    id: "ml-intern",
    title: "ML Engineer Intern",
    family: "AI/ML",
    summary: "Builds and ships ML models with production-grade Python.",
    requirements: [
      { skill: "python", required: 85, mandatory: true },
      { skill: "ml", required: 80, mandatory: true },
      { skill: "pytorch", required: 80, mandatory: true },
      { skill: "dsa", required: 70, mandatory: true },
      { skill: "sql", required: 65, mandatory: false },
      { skill: "docker", required: 60, mandatory: false },
      { skill: "aws", required: 55, mandatory: false },
    ],
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    family: "Data",
    summary: "Turns raw datasets into decisions with SQL, stats and dashboards.",
    requirements: [
      { skill: "sql", required: 80, mandatory: true },
      { skill: "python", required: 70, mandatory: true },
      { skill: "stats", required: 70, mandatory: true },
      { skill: "viz", required: 70, mandatory: true },
      { skill: "bi", required: 60, mandatory: false },
      { skill: "excel", required: 55, mandatory: false },
    ],
  },
  {
    id: "python-dev",
    title: "Python Developer",
    family: "Backend",
    summary: "Backend services, APIs and automation in Python.",
    requirements: [
      { skill: "python", required: 85, mandatory: true },
      { skill: "rest", required: 75, mandatory: true },
      { skill: "sql", required: 70, mandatory: true },
      { skill: "dsa", required: 70, mandatory: false },
      { skill: "docker", required: 60, mandatory: false },
      { skill: "linux", required: 55, mandatory: false },
    ],
  },
  {
    id: "fullstack",
    title: "Full Stack Developer",
    family: "Web",
    summary: "Owns UI, API and data layer of web products.",
    requirements: [
      { skill: "react", required: 80, mandatory: true },
      { skill: "typescript", required: 80, mandatory: true },
      { skill: "node", required: 75, mandatory: true },
      { skill: "rest", required: 70, mandatory: true },
      { skill: "sql", required: 65, mandatory: false },
      { skill: "git", required: 65, mandatory: false },
      { skill: "mongo", required: 55, mandatory: false },
    ],
  },
];

export const roleById = (id: string): RoleDef => ROLES.find((r) => r.id === id) ?? ROLES[0]!;

/* -------------------------------------------------------- learning assets */

export type LearningAsset = {
  skill: SkillId;
  why: string;
  course: { title: string; provider: string; hours: number };
  project: { title: string; brief: string };
  difficulty: "Beginner" | "Intermediate" | "Advanced";
};

export const LEARNING_ASSETS: LearningAsset[] = [
  { skill: "pytorch", why: "Deep-learning frameworks are mandatory for ML engineering roles and are your largest verified-evidence hole.", course: { title: "Deep Learning with PyTorch", provider: "NPTEL", hours: 40 }, project: { title: "Image classifier on CIFAR-10", brief: "Train a small CNN, log metrics, publish the repo with a README." }, difficulty: "Advanced" },
  { skill: "ml", why: "Core modelling literacy — every AI/ML posting screens for it first.", course: { title: "Machine Learning Specialisation", provider: "Coursera", hours: 60 }, project: { title: "End-to-end churn prediction", brief: "Clean data, train 3 models, compare metrics, deploy with FastAPI." }, difficulty: "Intermediate" },
  { skill: "aws", why: "Cloud deployment turns a notebook into something a recruiter can actually run.", course: { title: "AWS Cloud Practitioner Essentials", provider: "AWS Skill Builder", hours: 20 }, project: { title: "Deploy your model to EC2 + S3", brief: "Containerise a model API and expose it over a public endpoint." }, difficulty: "Intermediate" },
  { skill: "docker", why: "Packaging is the difference between 'works on my machine' and shippable work.", course: { title: "Docker for Developers", provider: "Udemy", hours: 12 }, project: { title: "Dockerise an existing project", brief: "Write a Dockerfile + compose file for one of your portfolio projects." }, difficulty: "Beginner" },
  { skill: "sql", why: "SQL appears in the mandatory list of most data and backend roles.", course: { title: "SQL for Data Science", provider: "NPTEL", hours: 24 }, project: { title: "Analytics warehouse mini-project", brief: "Model 5 tables, write 15 analytical queries with window functions." }, difficulty: "Beginner" },
  { skill: "react", why: "Front-end delivery is mandatory for full-stack roles.", course: { title: "Modern React", provider: "Scrimba", hours: 30 }, project: { title: "Dashboard SPA", brief: "Build a data dashboard with routing, forms and API calls." }, difficulty: "Intermediate" },
  { skill: "typescript", why: "Typed JavaScript is now the industry default for product teams.", course: { title: "TypeScript Fundamentals", provider: "Frontend Masters", hours: 15 }, project: { title: "Convert a JS project to TS", brief: "Add strict typing and eliminate all any usages." }, difficulty: "Beginner" },
  { skill: "node", why: "Back-end runtime for full-stack roles; pairs with your REST knowledge.", course: { title: "Node.js & Express", provider: "Udemy", hours: 25 }, project: { title: "Auth + CRUD API", brief: "JWT auth, role guards, pagination, tests." }, difficulty: "Intermediate" },
  { skill: "rest", why: "API design shows up in every backend interview round.", course: { title: "API Design & Documentation", provider: "Postman Academy", hours: 10 }, project: { title: "Public API with OpenAPI docs", brief: "Design, document and version a small public API." }, difficulty: "Beginner" },
  { skill: "stats", why: "Analyst roles test statistical reasoning before tooling.", course: { title: "Statistics for Data Analysis", provider: "NPTEL", hours: 30 }, project: { title: "A/B test analysis report", brief: "Run hypothesis tests on a public dataset and write the findings." }, difficulty: "Intermediate" },
  { skill: "viz", why: "Communicating results is half of an analyst's job.", course: { title: "Data Visualisation with Python", provider: "Coursera", hours: 18 }, project: { title: "Story-driven dashboard", brief: "Five charts that answer one business question." }, difficulty: "Beginner" },
  { skill: "bi", why: "Most analyst JDs name Tableau or Power BI explicitly.", course: { title: "Tableau Essentials", provider: "Tableau Learning", hours: 16 }, project: { title: "Placement analytics dashboard", brief: "Publish an interactive dashboard from a CSV dataset." }, difficulty: "Beginner" },
  { skill: "excel", why: "Still the fastest tool for quick analyst screening tasks.", course: { title: "Advanced Excel & Pivot Modelling", provider: "Microsoft Learn", hours: 8 }, project: { title: "Automated monthly report", brief: "Pivot tables + formulas driving a one-click report." }, difficulty: "Beginner" },
  { skill: "dsa", why: "Coding rounds gate almost every technical internship.", course: { title: "Algorithms Part I", provider: "Coursera", hours: 40 }, project: { title: "150-problem structured sheet", brief: "Solve by topic, keep a notes repo of patterns." }, difficulty: "Intermediate" },
  { skill: "python", why: "Primary implementation language across your target roles.", course: { title: "Python Programming Deep Dive", provider: "NPTEL", hours: 35 }, project: { title: "CLI automation tool", brief: "Package it, add tests, publish to PyPI." }, difficulty: "Beginner" },
  { skill: "git", why: "Recruiters read your commit history as evidence.", course: { title: "Git & GitHub Professional Workflow", provider: "GitHub Skills", hours: 6 }, project: { title: "Open-source contribution", brief: "Land one merged PR in a public repository." }, difficulty: "Beginner" },
  { skill: "linux", why: "Deployment and debugging happen on Linux boxes.", course: { title: "Linux Command Line Basics", provider: "Udacity", hours: 8 }, project: { title: "Server setup runbook", brief: "Provision a VPS and document every command." }, difficulty: "Beginner" },
  { skill: "mongo", why: "Document stores back many MERN-stack products.", course: { title: "MongoDB Basics", provider: "MongoDB University", hours: 12 }, project: { title: "Schema design exercise", brief: "Model a social feed and write aggregation pipelines." }, difficulty: "Beginner" },
  { skill: "nlp", why: "Text understanding is the fastest-growing AI sub-skill in hiring data.", course: { title: "NLP with Transformers", provider: "Hugging Face", hours: 20 }, project: { title: "Resume-to-JD matcher", brief: "Embed text, rank matches, evaluate against labels." }, difficulty: "Advanced" },
  { skill: "pandas", why: "Data wrangling underpins every analysis you will be asked to do.", course: { title: "Pandas Data Wrangling", provider: "Kaggle Learn", hours: 6 }, project: { title: "Messy dataset cleanup", brief: "Document every cleaning decision in a notebook." }, difficulty: "Beginner" },
  { skill: "numpy", why: "Numerical computing foundation for ML work.", course: { title: "NumPy Fundamentals", provider: "Kaggle Learn", hours: 4 }, project: { title: "Implement linear regression from scratch", brief: "No sklearn — only NumPy." }, difficulty: "Beginner" },
];

export const assetForSkill = (skill: SkillId): LearningAsset | undefined =>
  LEARNING_ASSETS.find((a) => a.skill === skill);

/* --------------------------------------------------------- opportunities */

export type Opportunity = {
  id: string;
  company: string;
  role: string;
  location: string;
  type: "Internship" | "Full-time" | "Apprenticeship";
  stipend: string;
  required: { skill: SkillId; level: number }[];
  preferred: SkillId[];
  description: string;
  postedBy: "demo" | "recruiter";
};

export const SEED_OPPORTUNITIES: Opportunity[] = [
  {
    id: "opp-tensorflow-labs",
    company: "TensorFlow Labs",
    role: "ML Engineer Intern",
    location: "Bengaluru (Hybrid)",
    type: "Internship",
    stipend: "₹45,000 / month",
    required: [
      { skill: "python", level: 85 },
      { skill: "ml", level: 75 },
      { skill: "pytorch", level: 75 },
      { skill: "dsa", level: 65 },
    ],
    preferred: ["docker", "aws"],
    description: "Work with the applied research team on model training pipelines and evaluation tooling.",
    postedBy: "demo",
  },
  {
    id: "opp-datapulse",
    company: "DataPulse Analytics",
    role: "Data Analyst Intern",
    location: "Hyderabad (On-site)",
    type: "Internship",
    stipend: "₹30,000 / month",
    required: [
      { skill: "sql", level: 75 },
      { skill: "python", level: 65 },
      { skill: "viz", level: 65 },
      { skill: "stats", level: 60 },
    ],
    preferred: ["bi", "excel"],
    description: "Own recurring client reporting and ad-hoc analysis for retail analytics accounts.",
    postedBy: "demo",
  },
  {
    id: "opp-northbridge",
    company: "Northbridge Systems",
    role: "Backend Engineer (Python)",
    location: "Pune (Hybrid)",
    type: "Full-time",
    stipend: "₹9.5 LPA",
    required: [
      { skill: "python", level: 80 },
      { skill: "rest", level: 70 },
      { skill: "sql", level: 70 },
      { skill: "docker", level: 55 },
    ],
    preferred: ["linux", "aws"],
    description: "Build internal services for a logistics platform handling 4M events per day.",
    postedBy: "demo",
  },
  {
    id: "opp-kitehouse",
    company: "Kitehouse Studio",
    role: "Full Stack Developer Intern",
    location: "Remote",
    type: "Internship",
    stipend: "₹25,000 / month",
    required: [
      { skill: "react", level: 75 },
      { skill: "typescript", level: 70 },
      { skill: "node", level: 65 },
      { skill: "rest", level: 60 },
    ],
    preferred: ["mongo", "git"],
    description: "Ship product features end-to-end for D2C brand storefronts.",
    postedBy: "demo",
  },
  {
    id: "opp-vidyut",
    company: "Vidyut AI",
    role: "Applied NLP Intern",
    location: "Chennai (On-site)",
    type: "Internship",
    stipend: "₹35,000 / month",
    required: [
      { skill: "python", level: 80 },
      { skill: "nlp", level: 70 },
      { skill: "ml", level: 70 },
    ],
    preferred: ["pytorch", "linux"],
    description: "Fine-tune language models for Indic-language customer support automation.",
    postedBy: "demo",
  },
  {
    id: "opp-grid-analytics",
    company: "Grid Analytics",
    role: "BI Apprentice",
    location: "Remote",
    type: "Apprenticeship",
    stipend: "₹18,000 / month",
    required: [
      { skill: "sql", level: 65 },
      { skill: "bi", level: 60 },
      { skill: "excel", level: 55 },
    ],
    preferred: ["viz", "stats"],
    description: "Six-month apprenticeship converting operational data into executive dashboards.",
    postedBy: "demo",
  },
];

/* ------------------------------------------------- assessment item bank */

export type QuizQuestion = { q: string; options: string[]; answer: number };
export type AssessmentDef = { id: string; skill: SkillId; title: string; minutes: number; questions: QuizQuestion[] };

export const ASSESSMENTS: AssessmentDef[] = [
  {
    id: "as-python",
    skill: "python",
    title: "Python Proficiency",
    minutes: 5,
    questions: [
      { q: "What does a Python list comprehension return?", options: ["A generator", "A new list", "A tuple", "None"], answer: 1 },
      { q: "Which structure guarantees unique elements?", options: ["list", "tuple", "set", "dict keys and set", ], answer: 3 },
      { q: "What does the `with` statement primarily provide?", options: ["Loops", "Deterministic resource cleanup", "Type checking", "Parallelism"], answer: 1 },
      { q: "Time complexity of dict lookup on average?", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], answer: 0 },
    ],
  },
  {
    id: "as-sql",
    skill: "sql",
    title: "SQL Querying",
    minutes: 5,
    questions: [
      { q: "Which clause filters rows after aggregation?", options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"], answer: 1 },
      { q: "A LEFT JOIN keeps…", options: ["Only matches", "All left rows", "All right rows", "All rows from both"], answer: 1 },
      { q: "Window function to rank without gaps?", options: ["RANK()", "ROW_NUMBER()", "DENSE_RANK()", "NTILE()"], answer: 2 },
      { q: "Index mainly improves…", options: ["Write speed", "Read/lookup speed", "Storage size", "Type safety"], answer: 1 },
    ],
  },
  {
    id: "as-ml",
    skill: "ml",
    title: "Machine Learning Fundamentals",
    minutes: 6,
    questions: [
      { q: "High training accuracy but low test accuracy indicates…", options: ["Underfitting", "Overfitting", "Data leakage only", "Good generalisation"], answer: 1 },
      { q: "Which metric suits an imbalanced classification problem?", options: ["Accuracy", "F1 / PR-AUC", "MSE", "R²"], answer: 1 },
      { q: "Purpose of cross-validation?", options: ["Speed up training", "Estimate generalisation", "Reduce features", "Normalise data"], answer: 1 },
      { q: "Regularisation is used to…", options: ["Increase variance", "Reduce overfitting", "Improve recall only", "Encode categories"], answer: 1 },
    ],
  },
  {
    id: "as-dsa",
    skill: "dsa",
    title: "Data Structures & Algorithms",
    minutes: 6,
    questions: [
      { q: "Binary search requires the input to be…", options: ["Hashed", "Sorted", "Unique", "Balanced"], answer: 1 },
      { q: "Average complexity of quicksort?", options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], answer: 1 },
      { q: "Best structure for LRU cache?", options: ["Array", "Hash map + doubly linked list", "Heap", "Trie"], answer: 1 },
      { q: "BFS uses which structure?", options: ["Stack", "Queue", "Heap", "Set"], answer: 1 },
    ],
  },
  {
    id: "as-pytorch",
    skill: "pytorch",
    title: "Deep Learning / PyTorch",
    minutes: 6,
    questions: [
      { q: "What does autograd track?", options: ["Memory usage", "Gradients of tensor ops", "Batch size", "Learning rate"], answer: 1 },
      { q: "Why call optimizer.zero_grad()?", options: ["Reset weights", "Clear accumulated gradients", "Free GPU memory", "Shuffle data"], answer: 1 },
      { q: "Dropout is used for…", options: ["Faster training", "Regularisation", "Normalisation", "Data loading"], answer: 1 },
      { q: "A CNN layer mainly exploits…", options: ["Recurrence", "Spatial locality", "Attention", "Randomness"], answer: 1 },
    ],
  },
  {
    id: "as-react",
    skill: "react",
    title: "React Fundamentals",
    minutes: 5,
    questions: [
      { q: "Keys in lists help React…", options: ["Style items", "Identify changed items", "Sort items", "Fetch data"], answer: 1 },
      { q: "useEffect with an empty dependency array runs…", options: ["Every render", "Once after mount", "Never", "Only on unmount"], answer: 1 },
      { q: "State updates in React are…", options: ["Always synchronous", "Batched/asynchronous", "Global", "Immutable to read only"], answer: 1 },
      { q: "Lifting state up means…", options: ["Using context always", "Moving state to a common ancestor", "Using refs", "Memoising"], answer: 1 },
    ],
  },
  {
    id: "as-stats",
    skill: "stats",
    title: "Statistics for Analysts",
    minutes: 5,
    questions: [
      { q: "A p-value of 0.03 at α=0.05 means…", options: ["Accept null", "Reject null", "Inconclusive", "Data invalid"], answer: 1 },
      { q: "Which measure resists outliers?", options: ["Mean", "Median", "Range", "Variance"], answer: 1 },
      { q: "Central Limit Theorem concerns the distribution of…", options: ["Population", "Sample means", "Residuals", "Outliers"], answer: 1 },
      { q: "Correlation implies…", options: ["Causation", "Association only", "Independence", "Normality"], answer: 1 },
    ],
  },
];
