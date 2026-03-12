import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useProblemStore } from "../../stores/problemStore";
import type { Category } from "@algo-learn/shared";
import { api } from "../../lib/api";

const difficultyColors: Record<string, string> = {
  easy: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  hard: "bg-red-100 text-red-800",
};

export function ProblemList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { problems, loading, fetchProblems } = useProblemStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const category = searchParams.get("category") || "";
  const difficulty = searchParams.get("difficulty") || "";

  useEffect(() => {
    api.getCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    fetchProblems({
      category: category || undefined,
      difficulty: difficulty || undefined,
    });
  }, [category, difficulty, fetchProblems]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Problems</h1>

      <div className="flex gap-3 mb-6">
        <select
          value={category}
          onChange={(e) => {
            const params = new URLSearchParams(searchParams);
            if (e.target.value) params.set("category", e.target.value);
            else params.delete("category");
            setSearchParams(params);
          }}
          className="rounded-md border-gray-300 bg-white px-3 py-2 text-sm shadow-sm border"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={difficulty}
          onChange={(e) => {
            const params = new URLSearchParams(searchParams);
            if (e.target.value) params.set("difficulty", e.target.value);
            else params.delete("difficulty");
            setSearchParams(params);
          }}
          className="rounded-md border-gray-300 bg-white px-3 py-2 text-sm shadow-sm border"
        >
          <option value="">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Difficulty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Complexity
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {problems.map((problem) => (
                <tr key={problem.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Link
                      to={`/problems/${problem.slug}`}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      {problem.title}
                    </Link>
                    {problem.hasVisualization && (
                      <span className="ml-2 text-xs text-purple-600">[viz]</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {problem.categoryName}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                        difficultyColors[problem.difficulty]
                      }`}
                    >
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                    {problem.expectedComplexity || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {problems.length === 0 && (
            <p className="p-6 text-center text-gray-500">No problems found.</p>
          )}
        </div>
      )}
    </div>
  );
}
