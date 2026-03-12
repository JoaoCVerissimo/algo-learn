export type Difficulty = "easy" | "medium" | "hard";

export type VisualizationType = "sorting" | "graph" | "dp" | "pathfinding";

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Problem {
  id: number;
  categoryId: number;
  title: string;
  slug: string;
  difficulty: Difficulty;
  description: string;
  starterCode: string;
  solutionCode: string;
  functionName: string;
  expectedComplexity: string | null;
  hasVisualization: boolean;
  visualizationType: VisualizationType | null;
  createdAt: Date;
}

export interface TestCase {
  id: number;
  problemId: number;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  order: number;
}

export type SubmissionStatus =
  | "pending"
  | "running"
  | "accepted"
  | "wrong_answer"
  | "runtime_error"
  | "timeout";

export interface Submission {
  id: number;
  problemId: number;
  code: string;
  language: string;
  status: SubmissionStatus;
  results: string | null;
  executionTimeMs: number | null;
  createdAt: Date;
}

export interface TestCaseResult {
  testCaseId: number;
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string | null;
  error: string | null;
  executionTimeMs: number;
}

export type ProgressStatus = "not_started" | "attempted" | "solved";

export interface UserProgress {
  id: number;
  problemId: number;
  status: ProgressStatus;
  bestSubmissionId: number | null;
  updatedAt: Date;
}
