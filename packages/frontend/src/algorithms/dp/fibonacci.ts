import type { DPStep, AlgorithmGenerator } from "../types";

export function* fibonacciDP(n: number): AlgorithmGenerator<DPStep> {
  const table: number[][] = [new Array(n + 1).fill(0)];
  let stepId = 0;

  yield {
    id: stepId++,
    type: "init",
    description: `Initialize DP table for fibonacci(${n})`,
    table: table.map((row) => [...row]),
    currentCell: [0, 0],
    highlightedCells: [],
    formula: "dp[0] = 0",
    labels: { rows: ["fib"], cols: Array.from({ length: n + 1 }, (_, i) => String(i)) },
  };

  if (n >= 0) {
    table[0][0] = 0;
    yield {
      id: stepId++,
      type: "base",
      description: "Base case: fib(0) = 0",
      table: table.map((row) => [...row]),
      currentCell: [0, 0],
      highlightedCells: [],
      formula: "dp[0] = 0",
      labels: { rows: ["fib"], cols: Array.from({ length: n + 1 }, (_, i) => String(i)) },
    };
  }

  if (n >= 1) {
    table[0][1] = 1;
    yield {
      id: stepId++,
      type: "base",
      description: "Base case: fib(1) = 1",
      table: table.map((row) => [...row]),
      currentCell: [0, 1],
      highlightedCells: [],
      formula: "dp[1] = 1",
      labels: { rows: ["fib"], cols: Array.from({ length: n + 1 }, (_, i) => String(i)) },
    };
  }

  for (let i = 2; i <= n; i++) {
    yield {
      id: stepId++,
      type: "compute",
      description: `Compute fib(${i}) = fib(${i - 1}) + fib(${i - 2}) = ${table[0][i - 1]} + ${table[0][i - 2]}`,
      table: table.map((row) => [...row]),
      currentCell: [0, i],
      highlightedCells: [[0, i - 1], [0, i - 2]],
      formula: `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${table[0][i - 1]} + ${table[0][i - 2]}`,
      labels: { rows: ["fib"], cols: Array.from({ length: n + 1 }, (_, i) => String(i)) },
    };

    table[0][i] = table[0][i - 1] + table[0][i - 2];

    yield {
      id: stepId++,
      type: "fill",
      description: `fib(${i}) = ${table[0][i]}`,
      table: table.map((row) => [...row]),
      currentCell: [0, i],
      highlightedCells: [],
      formula: `dp[${i}] = ${table[0][i]}`,
      labels: { rows: ["fib"], cols: Array.from({ length: n + 1 }, (_, i) => String(i)) },
    };
  }

  yield {
    id: stepId++,
    type: "done",
    description: `Result: fib(${n}) = ${table[0][n]}`,
    table: table.map((row) => [...row]),
    currentCell: [0, n],
    highlightedCells: [],
    formula: `Answer: ${table[0][n]}`,
    labels: { rows: ["fib"], cols: Array.from({ length: n + 1 }, (_, i) => String(i)) },
  };
}
