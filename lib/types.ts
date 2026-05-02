export type ContentType =
  | "fundamental"
  | "playbook"
  | "industry"
  | "kpi";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type BaseContent = {
  slug: string;
  title: string;
  summary: string;
  type: ContentType;
  articleSections?: ArticleSection[];
  diagrams?: KnowledgeDiagram[];
  sourceRefs?: string[];
  tags?: string[];
};

export type ArticleSection = {
  title: string;
  body: string[];
  callout?: string;
};

export type KnowledgeDiagram = {
  title: string;
  description: string;
  chart: string;
};

export type Fundamental = BaseContent & {
  type: "fundamental";
  definition: string;
  whyItMatters: string;
  example: string;
  diagram: string;
  relatedPlaybooks: string[];
  relatedIndustries: string[];
};

export type Playbook = BaseContent & {
  type: "playbook";
  category: string;
  difficulty: Difficulty;
  definition: string;
  whyItMatters: string;
  commonProblems: string[];
  diagnosticQuestions: string[];
  dataNeeded: string[];
  process: string[];
  kpisImpacted: string[];
  ebitdaLogic: string;
  caseExample: string;
  hundredDayPlan: string[];
  commonMistakes: string[];
  relatedIndustries: string[];
  relatedProjectPlaybooks: string[];
  diagram: string;
};

export type Industry = BaseContent & {
  type: "industry";
  businessModel: string;
  revenueModel: string;
  costStructure: string;
  keyKpis: string[];
  whyPeLikesIt: string;
  investmentThesis: string;
  diligenceQuestions: string[];
  operationalIssues: string[];
  valueCreationLevers: string[];
  projectPlaybooks: string[];
  aiOpportunities: string[];
  risks: string[];
  hundredDayPlan: string[];
  exitReadiness: string[];
  representativeExamples: string[];
  relatedPlaybooks: string[];
  relatedKpis: string[];
};

export type IndustryProject = BaseContent & {
  type: "industry-project";
  industry: string;
  businessProblem: string;
  goal: string;
  timeline: string;
  workstreams: string[];
  dataNeeded: string[];
  kpisImpacted: string[];
  expectedImpact: string;
  difficulty: Difficulty;
  typicalOwner: string;
  relatedPlaybooks: string[];
};

export type Kpi = BaseContent & {
  type: "kpi";
  function: string;
  formula?: string;
  whyPeCares: string;
  goodBadSignals: string;
  improvementActions: string[];
  relatedPlaybooks: string[];
  relatedIndustries: string[];
};

export type SourceRef = {
  id: string;
  title: string;
  type: "local-vault" | "public-reference" | "synthesis-note";
  path?: string;
  note: string;
};

export type AnyContent = Fundamental | Playbook | Industry | Kpi;
