import type { SubmissionResponse } from "@algo-learn/shared";

interface TestResultsProps {
  submission: SubmissionResponse | null;
  testCases: Array<{ id: number; input: string; expectedOutput: string }>;
}

const statusLabels: Record<string, { text: string; className: string }> = {
  accepted: { text: "Accepted", className: "bg-green-100 text-green-800" },
  wrong_answer: { text: "Wrong Answer", className: "bg-red-100 text-red-800" },
  runtime_error: { text: "Runtime Error", className: "bg-red-100 text-red-800" },
  timeout: { text: "Time Limit Exceeded", className: "bg-yellow-100 text-yellow-800" },
  pending: { text: "Pending", className: "bg-gray-100 text-gray-800" },
  running: { text: "Running...", className: "bg-blue-100 text-blue-800" },
};

export function TestResults({ submission }: TestResultsProps) {
  if (!submission) return null;

  const status = statusLabels[submission.status] || statusLabels.pending;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Results</h3>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.className}`}>
            {status.text}
          </span>
          {submission.totalTimeMs != null && (
            <span className="text-sm text-gray-500">{submission.totalTimeMs}ms</span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {submission.results.map((result, i) => (
          <div
            key={result.testCaseId || i}
            className={`p-3 rounded-lg border text-sm ${
              result.passed
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium">
                Test Case {i + 1}: {result.passed ? "Passed" : "Failed"}
              </span>
              <span className="text-gray-500">{result.executionTimeMs}ms</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <p className="text-xs text-gray-500">Input</p>
                <code className="text-xs">{result.input}</code>
              </div>
              <div>
                <p className="text-xs text-gray-500">Expected</p>
                <code className="text-xs">{result.expectedOutput}</code>
              </div>
              {!result.passed && result.actualOutput && (
                <div className="col-span-2">
                  <p className="text-xs text-gray-500">Got</p>
                  <code className="text-xs text-red-600">{result.actualOutput}</code>
                </div>
              )}
              {result.error && (
                <div className="col-span-2">
                  <p className="text-xs text-gray-500">Error</p>
                  <code className="text-xs text-red-600">{result.error}</code>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
