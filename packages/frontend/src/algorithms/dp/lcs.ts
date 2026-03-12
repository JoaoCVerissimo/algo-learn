import type { DPStep, AlgorithmGenerator } from "../types";

export function* lcsDP(text1: string, text2: string): AlgorithmGenerator<DPStep> {
  const m = text1.length;
  const n = text2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  );
  let stepId = 0;

  const rowLabels = ["", ...text1.split("")];
  const colLabels = ["", ...text2.split("")];

  yield {
    id: stepId++,
    type: "init",
    description: `Find LCS of "${text1}" and "${text2}"`,
    table: dp.map((row) => [...row]),
    currentCell: [0, 0],
    highlightedCells: [],
    formula: "dp[i][j] = LCS length of text1[0..i-1] and text2[0..j-1]",
    labels: { rows: rowLabels, cols: colLabels },
  };

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;

        yield {
          id: stepId++,
          type: "match",
          description: `'${text1[i - 1]}' == '${text2[j - 1]}': dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${dp[i][j]}`,
          table: dp.map((row) => [...row]),
          currentCell: [i, j],
          highlightedCells: [[i - 1, j - 1]],
          formula: `dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${dp[i][j]}`,
          labels: { rows: rowLabels, cols: colLabels },
        };
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);

        yield {
          id: stepId++,
          type: "no_match",
          description: `'${text1[i - 1]}' != '${text2[j - 1]}': max(dp[${i - 1}][${j}], dp[${i}][${j - 1}]) = ${dp[i][j]}`,
          table: dp.map((row) => [...row]),
          currentCell: [i, j],
          highlightedCells: [
            [i - 1, j],
            [i, j - 1],
          ],
          formula: `dp[${i}][${j}] = max(${dp[i - 1][j]}, ${dp[i][j - 1]}) = ${dp[i][j]}`,
          labels: { rows: rowLabels, cols: colLabels },
        };
      }
    }
  }

  yield {
    id: stepId++,
    type: "done",
    description: `LCS length: ${dp[m][n]}`,
    table: dp.map((row) => [...row]),
    currentCell: [m, n],
    highlightedCells: [],
    formula: `Answer: ${dp[m][n]}`,
    labels: { rows: rowLabels, cols: colLabels },
  };
}
