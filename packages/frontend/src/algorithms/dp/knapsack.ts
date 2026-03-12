import type { DPStep, AlgorithmGenerator } from "../types";

export function* knapsackDP(
  weights: number[],
  values: number[],
  capacity: number
): AlgorithmGenerator<DPStep> {
  const n = weights.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    new Array(capacity + 1).fill(0)
  );
  let stepId = 0;

  const rowLabels = ["0", ...weights.map((w, i) => `w=${w},v=${values[i]}`)];
  const colLabels = Array.from({ length: capacity + 1 }, (_, i) => String(i));

  yield {
    id: stepId++,
    type: "init",
    description: `Initialize ${n + 1}x${capacity + 1} DP table`,
    table: dp.map((row) => [...row]),
    currentCell: [0, 0],
    highlightedCells: [],
    formula: "dp[i][w] = max value using first i items with capacity w",
    labels: { rows: rowLabels, cols: colLabels },
  };

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        const include = dp[i - 1][w - weights[i - 1]] + values[i - 1];
        const exclude = dp[i - 1][w];

        yield {
          id: stepId++,
          type: "compare",
          description: `Item ${i} (w=${weights[i - 1]}, v=${values[i - 1]}): include=${include} vs exclude=${exclude}`,
          table: dp.map((row) => [...row]),
          currentCell: [i, w],
          highlightedCells: [
            [i - 1, w],
            [i - 1, w - weights[i - 1]],
          ],
          formula: `max(dp[${i - 1}][${w}], dp[${i - 1}][${w - weights[i - 1]}] + ${values[i - 1]}) = max(${exclude}, ${include})`,
          labels: { rows: rowLabels, cols: colLabels },
        };

        dp[i][w] = Math.max(include, exclude);
      } else {
        dp[i][w] = dp[i - 1][w];

        yield {
          id: stepId++,
          type: "skip",
          description: `Item ${i} too heavy (w=${weights[i - 1]} > ${w}), copy from above`,
          table: dp.map((row) => [...row]),
          currentCell: [i, w],
          highlightedCells: [[i - 1, w]],
          formula: `dp[${i}][${w}] = dp[${i - 1}][${w}] = ${dp[i - 1][w]}`,
          labels: { rows: rowLabels, cols: colLabels },
        };
      }

      yield {
        id: stepId++,
        type: "fill",
        description: `dp[${i}][${w}] = ${dp[i][w]}`,
        table: dp.map((row) => [...row]),
        currentCell: [i, w],
        highlightedCells: [],
        formula: `dp[${i}][${w}] = ${dp[i][w]}`,
        labels: { rows: rowLabels, cols: colLabels },
      };
    }
  }

  yield {
    id: stepId++,
    type: "done",
    description: `Maximum value: ${dp[n][capacity]}`,
    table: dp.map((row) => [...row]),
    currentCell: [n, capacity],
    highlightedCells: [],
    formula: `Answer: ${dp[n][capacity]}`,
    labels: { rows: rowLabels, cols: colLabels },
  };
}
