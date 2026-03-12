import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useProblemStore } from "../../stores/problemStore";
import { CodeEditor } from "../editor/CodeEditor";
import { TestResults } from "../editor/TestResults";

export function ProblemDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { currentProblem, loading, error, submission, submitting, fetchProblem, submitCode } =
    useProblemStore();
  const [code, setCode] = useState("");

  useEffect(() => {
    if (slug) fetchProblem(slug);
  }, [slug, fetchProblem]);

  useEffect(() => {
    if (currentProblem) setCode(currentProblem.starterCode);
  }, [currentProblem]);

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!currentProblem) return <p className="text-gray-500">Problem not found.</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Problem description */}
      <div className="bg-white rounded-lg shadow p-6 overflow-y-auto max-h-[calc(100vh-8rem)]">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-2xl font-bold">{currentProblem.title}</h1>
          <span
            className={`px-2 py-1 text-xs rounded-full font-medium ${
              currentProblem.difficulty === "easy"
                ? "bg-green-100 text-green-800"
                : currentProblem.difficulty === "medium"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
            }`}
          >
            {currentProblem.difficulty}
          </span>
        </div>

        {currentProblem.hasVisualization && currentProblem.visualizationType && (
          <Link
            to={`/visualize/${currentProblem.slug}`}
            className="inline-block mb-4 text-sm text-purple-600 hover:text-purple-800 underline"
          >
            View visualization
          </Link>
        )}

        <div className="prose prose-sm max-w-none">
          <ReactMarkdown>{currentProblem.description}</ReactMarkdown>
        </div>

        {currentProblem.expectedComplexity && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Expected Complexity: </span>
            <span className="font-mono text-sm font-medium">
              {currentProblem.expectedComplexity}
            </span>
          </div>
        )}
      </div>

      {/* Right: Editor + Results */}
      <div className="flex flex-col gap-4">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
            <span className="text-gray-300 text-sm">Solution</span>
            <button
              onClick={() => submitCode(currentProblem.id, code)}
              disabled={submitting}
              className="px-4 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white text-sm rounded font-medium transition"
            >
              {submitting ? "Running..." : "Submit"}
            </button>
          </div>
          <CodeEditor
            value={code}
            onChange={setCode}
            language="typescript"
            height="400px"
          />
        </div>

        <TestResults
          submission={submission}
          testCases={currentProblem.testCases}
        />
      </div>
    </div>
  );
}
