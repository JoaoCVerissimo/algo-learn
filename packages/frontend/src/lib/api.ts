import type {
  ProblemListItem,
  ProblemDetail,
  SubmitCodeRequest,
  SubmissionResponse,
  ProgressResponse,
  Category,
} from "@algo-learn/shared";

const BASE_URL = "/api";

async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  getCategories: () => fetchJSON<Category[]>("/categories"),

  getProblems: (params?: { category?: string; difficulty?: string }) => {
    const query = new URLSearchParams();
    if (params?.category) query.set("category", params.category);
    if (params?.difficulty) query.set("difficulty", params.difficulty);
    const qs = query.toString();
    return fetchJSON<ProblemListItem[]>(`/problems${qs ? `?${qs}` : ""}`);
  },

  getProblem: (slug: string) => fetchJSON<ProblemDetail>(`/problems/${slug}`),

  submitCode: (data: SubmitCodeRequest) =>
    fetchJSON<SubmissionResponse>("/submissions", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getSubmission: (id: number) => fetchJSON<SubmissionResponse>(`/submissions/${id}`),

  getProgress: () => fetchJSON<ProgressResponse[]>("/progress"),
};
