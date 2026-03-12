import { Link } from "react-router-dom";

const algorithms = [
  {
    category: "Sorting",
    items: [
      { slug: "bubble-sort", name: "Bubble Sort", complexity: "O(n^2)" },
      { slug: "quick-sort", name: "Quick Sort", complexity: "O(n log n)" },
      { slug: "merge-sort", name: "Merge Sort", complexity: "O(n log n)" },
    ],
  },
  {
    category: "Graph Traversal",
    items: [
      { slug: "bfs", name: "Breadth-First Search", complexity: "O(V + E)" },
      { slug: "dfs", name: "Depth-First Search", complexity: "O(V + E)" },
    ],
  },
  {
    category: "Dynamic Programming",
    items: [
      { slug: "fibonacci-dp", name: "Fibonacci", complexity: "O(n)" },
      { slug: "knapsack", name: "0/1 Knapsack", complexity: "O(n*W)" },
      { slug: "lcs", name: "Longest Common Subsequence", complexity: "O(m*n)" },
    ],
  },
  {
    category: "Pathfinding",
    items: [
      { slug: "dijkstra", name: "Dijkstra's Algorithm", complexity: "O((V+E) log V)" },
      { slug: "a-star", name: "A* Search", complexity: "O((V+E) log V)" },
    ],
  },
];

export function VisualizationPicker() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Algorithm Visualizations</h1>
      <p className="text-gray-600 mb-8">
        Watch algorithms execute step-by-step with interactive animations.
        Use playback controls to pause, step, and rewind.
      </p>

      <div className="space-y-8">
        {algorithms.map((group) => (
          <div key={group.category}>
            <h2 className="text-xl font-semibold mb-3">{group.category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {group.items.map((algo) => (
                <Link
                  key={algo.slug}
                  to={`/visualize/${algo.slug}`}
                  className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow border border-gray-100"
                >
                  <h3 className="font-medium text-indigo-600">{algo.name}</h3>
                  <p className="text-xs text-gray-500 font-mono mt-1">
                    {algo.complexity}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
