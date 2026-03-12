import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import type { ProblemListItem, ProgressResponse, Category } from "@algo-learn/shared";

export function Dashboard() {
  const [problems, setProblems] = useState<ProblemListItem[]>([]);
  const [progress, setProgress] = useState<ProgressResponse[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.getProblems().then(setProblems).catch(console.error);
    api.getProgress().then(setProgress).catch(console.error);
    api.getCategories().then(setCategories).catch(console.error);
  }, []);

  const solvedCount = progress.filter((p) => p.status === "solved").length;
  const attemptedCount = progress.filter((p) => p.status === "attempted").length;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Problems" value={problems.length} color="indigo" />
        <StatCard label="Solved" value={solvedCount} color="green" />
        <StatCard label="Attempted" value={attemptedCount} color="yellow" />
      </div>

      <h2 className="text-xl font-semibold mb-4">Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {categories.map((cat) => {
          const catProblems = problems.filter((p) => p.categorySlug === cat.slug);
          return (
            <Link
              key={cat.slug}
              to={`/problems?category=${cat.slug}`}
              className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-lg">{cat.name}</h3>
              <p className="text-gray-500 text-sm">{catProblems.length} problems</p>
            </Link>
          );
        })}
      </div>

      <h2 className="text-xl font-semibold mb-4">Quick Start</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/problems"
          className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 hover:bg-indigo-100 transition"
        >
          <h3 className="font-semibold text-indigo-700 text-lg">Practice Problems</h3>
          <p className="text-indigo-600 text-sm mt-1">
            Solve coding challenges with an integrated editor and test runner
          </p>
        </Link>
        <Link
          to="/visualize"
          className="bg-purple-50 border border-purple-200 rounded-lg p-6 hover:bg-purple-100 transition"
        >
          <h3 className="font-semibold text-purple-700 text-lg">Visualizations</h3>
          <p className="text-purple-600 text-sm mt-1">
            Watch algorithms execute step-by-step with interactive animations
          </p>
        </Link>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colorMap: Record<string, string> = {
    indigo: "bg-indigo-50 text-indigo-700",
    green: "bg-green-50 text-green-700",
    yellow: "bg-yellow-50 text-yellow-700",
  };

  return (
    <div className={`rounded-lg p-4 ${colorMap[color] || colorMap.indigo}`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
