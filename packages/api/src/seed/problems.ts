export const seedCategories = [
  { name: "Sorting", slug: "sorting" },
  { name: "Graph Traversal", slug: "graph" },
  { name: "Dynamic Programming", slug: "dp" },
  { name: "Pathfinding", slug: "pathfinding" },
];

export const seedProblems = [
  {
    categorySlug: "sorting",
    title: "Bubble Sort",
    slug: "bubble-sort",
    difficulty: "easy" as const,
    description: `# Bubble Sort

Implement the **bubble sort** algorithm.

Bubble sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.

## Algorithm

1. Start from the first element
2. Compare the current element with the next element
3. If the current element is greater than the next element, swap them
4. Move to the next pair and repeat
5. After each full pass, the largest unsorted element "bubbles" to its correct position

## Complexity

- **Time:** O(n²)
- **Space:** O(1)

## Example

\`\`\`
Input:  [64, 34, 25, 12, 22, 11, 90]
Output: [11, 12, 22, 25, 34, 64, 90]
\`\`\``,
    starterCode: `export function bubbleSort(arr: number[]): number[] {
  const result = [...arr];
  // Your implementation here
  return result;
}`,
    solutionCode: `export function bubbleSort(arr: number[]): number[] {
  const result = [...arr];
  for (let i = 0; i < result.length - 1; i++) {
    for (let j = 0; j < result.length - 1 - i; j++) {
      if (result[j] > result[j + 1]) {
        [result[j], result[j + 1]] = [result[j + 1], result[j]];
      }
    }
  }
  return result;
}`,
    functionName: "bubbleSort",
    expectedComplexity: "O(n²)",
    hasVisualization: true,
    visualizationType: "sorting",
    testCases: [
      { input: "[[64, 34, 25, 12, 22, 11, 90]]", expectedOutput: "[11, 12, 22, 25, 34, 64, 90]", isHidden: false },
      { input: "[[5, 1, 4, 2, 8]]", expectedOutput: "[1, 2, 4, 5, 8]", isHidden: false },
      { input: "[[1]]", expectedOutput: "[1]", isHidden: false },
      { input: "[[3, 2, 1]]", expectedOutput: "[1, 2, 3]", isHidden: true },
      { input: "[[1, 2, 3, 4, 5]]", expectedOutput: "[1, 2, 3, 4, 5]", isHidden: true },
    ],
  },
  {
    categorySlug: "sorting",
    title: "Quick Sort",
    slug: "quick-sort",
    difficulty: "medium" as const,
    description: `# Quick Sort

Implement the **quick sort** algorithm.

Quick sort is a divide-and-conquer algorithm that picks a "pivot" element and partitions the array around it, then recursively sorts the sub-arrays.

## Algorithm

1. Choose a pivot element (commonly the last element)
2. Partition: rearrange so elements < pivot are on the left, elements > pivot are on the right
3. Recursively apply to the left and right sub-arrays

## Complexity

- **Time:** O(n log n) average, O(n²) worst
- **Space:** O(log n)

## Example

\`\`\`
Input:  [10, 80, 30, 90, 40, 50, 70]
Output: [10, 30, 40, 50, 70, 80, 90]
\`\`\``,
    starterCode: `export function quickSort(arr: number[]): number[] {
  const result = [...arr];
  // Your implementation here
  return result;
}`,
    solutionCode: `export function quickSort(arr: number[]): number[] {
  const result = [...arr];
  function sort(low: number, high: number) {
    if (low < high) {
      const pivot = result[high];
      let i = low - 1;
      for (let j = low; j < high; j++) {
        if (result[j] < pivot) {
          i++;
          [result[i], result[j]] = [result[j], result[i]];
        }
      }
      [result[i + 1], result[high]] = [result[high], result[i + 1]];
      const pi = i + 1;
      sort(low, pi - 1);
      sort(pi + 1, high);
    }
  }
  sort(0, result.length - 1);
  return result;
}`,
    functionName: "quickSort",
    expectedComplexity: "O(n log n)",
    hasVisualization: true,
    visualizationType: "sorting",
    testCases: [
      { input: "[[10, 80, 30, 90, 40, 50, 70]]", expectedOutput: "[10, 30, 40, 50, 70, 80, 90]", isHidden: false },
      { input: "[[3, 6, 8, 10, 1, 2, 1]]", expectedOutput: "[1, 1, 2, 3, 6, 8, 10]", isHidden: false },
      { input: "[[1]]", expectedOutput: "[1]", isHidden: true },
    ],
  },
  {
    categorySlug: "sorting",
    title: "Merge Sort",
    slug: "merge-sort",
    difficulty: "medium" as const,
    description: `# Merge Sort

Implement the **merge sort** algorithm.

Merge sort divides the array in half, recursively sorts each half, then merges the sorted halves.

## Complexity

- **Time:** O(n log n)
- **Space:** O(n)

## Example

\`\`\`
Input:  [38, 27, 43, 3, 9, 82, 10]
Output: [3, 9, 10, 27, 38, 43, 82]
\`\`\``,
    starterCode: `export function mergeSort(arr: number[]): number[] {
  // Your implementation here
  return arr;
}`,
    solutionCode: `export function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}`,
    functionName: "mergeSort",
    expectedComplexity: "O(n log n)",
    hasVisualization: true,
    visualizationType: "sorting",
    testCases: [
      { input: "[[38, 27, 43, 3, 9, 82, 10]]", expectedOutput: "[3, 9, 10, 27, 38, 43, 82]", isHidden: false },
      { input: "[[5, 3, 1, 4, 2]]", expectedOutput: "[1, 2, 3, 4, 5]", isHidden: false },
      { input: "[[1, 2, 3]]", expectedOutput: "[1, 2, 3]", isHidden: true },
    ],
  },
  {
    categorySlug: "graph",
    title: "Breadth-First Search",
    slug: "bfs",
    difficulty: "medium" as const,
    description: `# Breadth-First Search (BFS)

Implement **BFS** on an adjacency list graph.

BFS explores all vertices at the current depth before moving to vertices at the next depth level.

## Input

- \`graph\`: adjacency list as \`Record<string, string[]>\`
- \`start\`: starting node

## Output

Return an array of node IDs in the order they were visited.

## Complexity

- **Time:** O(V + E)
- **Space:** O(V)

## Example

\`\`\`
graph = { A: ["B", "C"], B: ["D"], C: ["D"], D: [] }
start = "A"
Output: ["A", "B", "C", "D"]
\`\`\``,
    starterCode: `export function bfs(graph: Record<string, string[]>, start: string): string[] {
  // Your implementation here
  return [];
}`,
    solutionCode: `export function bfs(graph: Record<string, string[]>, start: string): string[] {
  const visited = new Set<string>();
  const queue: string[] = [start];
  const result: string[] = [];
  visited.add(start);
  while (queue.length > 0) {
    const node = queue.shift()!;
    result.push(node);
    for (const neighbor of graph[node] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return result;
}`,
    functionName: "bfs",
    expectedComplexity: "O(V + E)",
    hasVisualization: true,
    visualizationType: "graph",
    testCases: [
      { input: '[{"A": ["B", "C"], "B": ["D"], "C": ["D"], "D": []}, "A"]', expectedOutput: '["A", "B", "C", "D"]', isHidden: false },
      { input: '[{"1": ["2", "3"], "2": ["4"], "3": [], "4": []}, "1"]', expectedOutput: '["1", "2", "3", "4"]', isHidden: false },
    ],
  },
  {
    categorySlug: "graph",
    title: "Depth-First Search",
    slug: "dfs",
    difficulty: "medium" as const,
    description: `# Depth-First Search (DFS)

Implement **DFS** on an adjacency list graph.

DFS explores as far as possible along each branch before backtracking.

## Input

- \`graph\`: adjacency list as \`Record<string, string[]>\`
- \`start\`: starting node

## Output

Return an array of node IDs in the order they were visited.

## Complexity

- **Time:** O(V + E)
- **Space:** O(V)`,
    starterCode: `export function dfs(graph: Record<string, string[]>, start: string): string[] {
  // Your implementation here
  return [];
}`,
    solutionCode: `export function dfs(graph: Record<string, string[]>, start: string): string[] {
  const visited = new Set<string>();
  const result: string[] = [];
  function visit(node: string) {
    if (visited.has(node)) return;
    visited.add(node);
    result.push(node);
    for (const neighbor of graph[node] || []) {
      visit(neighbor);
    }
  }
  visit(start);
  return result;
}`,
    functionName: "dfs",
    expectedComplexity: "O(V + E)",
    hasVisualization: true,
    visualizationType: "graph",
    testCases: [
      { input: '[{"A": ["B", "C"], "B": ["D"], "C": ["D"], "D": []}, "A"]', expectedOutput: '["A", "B", "D", "C"]', isHidden: false },
      { input: '[{"1": ["2", "3"], "2": ["4"], "3": [], "4": []}, "1"]', expectedOutput: '["1", "2", "4", "3"]', isHidden: false },
    ],
  },
  {
    categorySlug: "dp",
    title: "Fibonacci (Dynamic Programming)",
    slug: "fibonacci-dp",
    difficulty: "easy" as const,
    description: `# Fibonacci - Dynamic Programming

Compute the nth Fibonacci number using **dynamic programming** (bottom-up tabulation).

## Complexity

- **Time:** O(n)
- **Space:** O(n) (or O(1) with optimization)

## Example

\`\`\`
Input:  10
Output: 55
\`\`\``,
    starterCode: `export function fibonacci(n: number): number {
  // Your implementation here (use DP, not recursion)
  return 0;
}`,
    solutionCode: `export function fibonacci(n: number): number {
  if (n <= 1) return n;
  const dp = new Array(n + 1);
  dp[0] = 0;
  dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}`,
    functionName: "fibonacci",
    expectedComplexity: "O(n)",
    hasVisualization: true,
    visualizationType: "dp",
    testCases: [
      { input: "[0]", expectedOutput: "0", isHidden: false },
      { input: "[1]", expectedOutput: "1", isHidden: false },
      { input: "[10]", expectedOutput: "55", isHidden: false },
      { input: "[20]", expectedOutput: "6765", isHidden: true },
    ],
  },
  {
    categorySlug: "dp",
    title: "0/1 Knapsack",
    slug: "knapsack",
    difficulty: "hard" as const,
    description: `# 0/1 Knapsack Problem

Given weights and values of \`n\` items, put them in a knapsack of capacity \`W\` to get the **maximum total value**.

Each item can only be included once (0/1 property).

## Input

- \`weights\`: array of item weights
- \`values\`: array of item values
- \`capacity\`: knapsack capacity

## Complexity

- **Time:** O(n × W)
- **Space:** O(n × W)

## Example

\`\`\`
weights = [1, 3, 4, 5]
values  = [1, 4, 5, 7]
capacity = 7
Output: 9  (items with weight 3 and 4, values 4 + 5)
\`\`\``,
    starterCode: `export function knapsack(weights: number[], values: number[], capacity: number): number {
  // Your implementation here
  return 0;
}`,
    solutionCode: `export function knapsack(weights: number[], values: number[], capacity: number): number {
  const n = weights.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - weights[i - 1]] + values[i - 1]);
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }
  return dp[n][capacity];
}`,
    functionName: "knapsack",
    expectedComplexity: "O(n × W)",
    hasVisualization: true,
    visualizationType: "dp",
    testCases: [
      { input: "[[1, 3, 4, 5], [1, 4, 5, 7], 7]", expectedOutput: "9", isHidden: false },
      { input: "[[2, 3, 4, 5], [3, 4, 5, 6], 5]", expectedOutput: "7", isHidden: false },
      { input: "[[10], [100], 5]", expectedOutput: "0", isHidden: true },
    ],
  },
  {
    categorySlug: "dp",
    title: "Longest Common Subsequence",
    slug: "lcs",
    difficulty: "medium" as const,
    description: `# Longest Common Subsequence

Find the length of the **longest common subsequence** of two strings.

A subsequence is a sequence derived by deleting some (or no) characters without changing the relative order of the remaining characters.

## Complexity

- **Time:** O(m × n)
- **Space:** O(m × n)

## Example

\`\`\`
Input:  "ABCBDAB", "BDCAB"
Output: 4  ("BCAB")
\`\`\``,
    starterCode: `export function lcs(text1: string, text2: string): number {
  // Your implementation here
  return 0;
}`,
    solutionCode: `export function lcs(text1: string, text2: string): number {
  const m = text1.length, n = text2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[m][n];
}`,
    functionName: "lcs",
    expectedComplexity: "O(m × n)",
    hasVisualization: true,
    visualizationType: "dp",
    testCases: [
      { input: '["ABCBDAB", "BDCAB"]', expectedOutput: "4", isHidden: false },
      { input: '["ABC", "AC"]', expectedOutput: "2", isHidden: false },
      { input: '["ABC", "DEF"]', expectedOutput: "0", isHidden: true },
    ],
  },
  {
    categorySlug: "pathfinding",
    title: "Dijkstra's Algorithm",
    slug: "dijkstra",
    difficulty: "hard" as const,
    description: `# Dijkstra's Algorithm

Find the **shortest path** from a source node to all other nodes in a weighted graph with non-negative edges.

## Input

- \`graph\`: adjacency list as \`Record<string, Array<{node: string, weight: number}>>\`
- \`start\`: source node

## Output

Return a record mapping each node to its shortest distance from the start.

## Complexity

- **Time:** O((V + E) log V)
- **Space:** O(V)

## Example

\`\`\`
graph = {
  A: [{node: "B", weight: 4}, {node: "C", weight: 2}],
  B: [{node: "D", weight: 3}],
  C: [{node: "B", weight: 1}, {node: "D", weight: 5}],
  D: []
}
start = "A"
Output: { A: 0, B: 3, C: 2, D: 6 }
\`\`\``,
    starterCode: `export function dijkstra(
  graph: Record<string, Array<{node: string; weight: number}>>,
  start: string
): Record<string, number> {
  // Your implementation here
  return {};
}`,
    solutionCode: `export function dijkstra(
  graph: Record<string, Array<{node: string; weight: number}>>,
  start: string
): Record<string, number> {
  const dist: Record<string, number> = {};
  const visited = new Set<string>();
  for (const node of Object.keys(graph)) {
    dist[node] = node === start ? 0 : Infinity;
  }
  const pq: Array<{node: string; dist: number}> = [{node: start, dist: 0}];
  while (pq.length > 0) {
    pq.sort((a, b) => a.dist - b.dist);
    const {node: current} = pq.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);
    for (const {node: neighbor, weight} of graph[current] || []) {
      const alt = dist[current] + weight;
      if (alt < dist[neighbor]) {
        dist[neighbor] = alt;
        pq.push({node: neighbor, dist: alt});
      }
    }
  }
  return dist;
}`,
    functionName: "dijkstra",
    expectedComplexity: "O((V + E) log V)",
    hasVisualization: true,
    visualizationType: "pathfinding",
    testCases: [
      {
        input: '[{"A": [{"node": "B", "weight": 4}, {"node": "C", "weight": 2}], "B": [{"node": "D", "weight": 3}], "C": [{"node": "B", "weight": 1}, {"node": "D", "weight": 5}], "D": []}, "A"]',
        expectedOutput: '{"A": 0, "B": 3, "C": 2, "D": 6}',
        isHidden: false,
      },
    ],
  },
];
