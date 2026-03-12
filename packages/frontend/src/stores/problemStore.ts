import { create } from "zustand";
import type { ProblemListItem, ProblemDetail, SubmissionResponse } from "@algo-learn/shared";
import { api } from "../lib/api";

interface ProblemStore {
  problems: ProblemListItem[];
  currentProblem: ProblemDetail | null;
  loading: boolean;
  error: string | null;
  submission: SubmissionResponse | null;
  submitting: boolean;

  fetchProblems: (params?: { category?: string; difficulty?: string }) => Promise<void>;
  fetchProblem: (slug: string) => Promise<void>;
  submitCode: (problemId: number, code: string) => Promise<void>;
  clearSubmission: () => void;
}

export const useProblemStore = create<ProblemStore>((set) => ({
  problems: [],
  currentProblem: null,
  loading: false,
  error: null,
  submission: null,
  submitting: false,

  fetchProblems: async (params) => {
    set({ loading: true, error: null });
    try {
      const problems = await api.getProblems(params);
      set({ problems, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  fetchProblem: async (slug) => {
    set({ loading: true, error: null, currentProblem: null, submission: null });
    try {
      const problem = await api.getProblem(slug);
      set({ currentProblem: problem, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  submitCode: async (problemId, code) => {
    set({ submitting: true, submission: null, error: null });
    try {
      const result = await api.submitCode({ problemId, code });
      set({ submission: result, submitting: false });
    } catch (err) {
      set({ error: (err as Error).message, submitting: false });
    }
  },

  clearSubmission: () => set({ submission: null }),
}));
