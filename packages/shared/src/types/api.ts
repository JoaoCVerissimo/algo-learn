import type { Difficulty, SubmissionStatus, ProgressStatus, TestCaseResult } from "./problem.js";

export interface ListProblemsQuery {
  category?: string;
  difficulty?: Difficulty;
}

export interface ProblemListItem {
  id: number;
  title: string;
  slug: string;
  difficulty: Difficulty;
  categorySlug: string;
  categoryName: string;
  hasVisualization: boolean;
  expectedComplexity: string | null;
}

export interface ProblemDetail {
  id: number;
  title: string;
  slug: string;
  difficulty: Difficulty;
  description: string;
  starterCode: string;
  functionName: string;
  expectedComplexity: string | null;
  hasVisualization: boolean;
  visualizationType: string | null;
  categoryName: string;
  categorySlug: string;
  testCases: Array<{
    id: number;
    input: string;
    expectedOutput: string;
    order: number;
  }>;
}

export interface SubmitCodeRequest {
  problemId: number;
  code: string;
  language?: string;
}

export interface SubmissionResponse {
  id: number;
  status: SubmissionStatus;
  results: TestCaseResult[];
  totalTimeMs: number;
}

export interface ProgressResponse {
  problemId: number;
  status: ProgressStatus;
  bestSubmissionId: number | null;
}
