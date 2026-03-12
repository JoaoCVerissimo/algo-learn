import type { PathfindingStep, CellState, AlgorithmGenerator } from "../types";

interface WeightedEdge {
  node: string;
  weight: number;
}

export function* dijkstraViz(
  gridRows: number,
  gridCols: number,
  walls: Array<[number, number]>,
  start: [number, number],
  end: [number, number]
): AlgorithmGenerator<PathfindingStep> {
  const grid: CellState[][] = Array.from({ length: gridRows }, () =>
    new Array(gridCols).fill("empty" as CellState)
  );

  for (const [r, c] of walls) {
    grid[r][c] = "wall";
  }
  grid[start[0]][start[1]] = "start";
  grid[end[0]][end[1]] = "end";

  let stepId = 0;
  const dist: Record<string, number> = {};
  const prev: Record<string, string | null> = {};
  const openSet: Array<[number, number]> = [];
  const closedSet: Array<[number, number]> = [];

  const key = (r: number, c: number) => `${r},${c}`;
  const directions = [
    [0, 1], [1, 0], [0, -1], [-1, 0],
  ];

  // Initialize distances
  for (let r = 0; r < gridRows; r++) {
    for (let c = 0; c < gridCols; c++) {
      dist[key(r, c)] = Infinity;
      prev[key(r, c)] = null;
    }
  }
  dist[key(start[0], start[1])] = 0;
  openSet.push(start);

  yield {
    id: stepId++,
    type: "init",
    description: `Start Dijkstra from (${start[0]},${start[1]}) to (${end[0]},${end[1]})`,
    grid: grid.map((row) => [...row]),
    openSet: [...openSet],
    closedSet: [],
    currentNode: start,
    path: [],
    gScores: { ...dist },
  };

  while (openSet.length > 0) {
    // Find node with smallest distance in openSet
    openSet.sort((a, b) => dist[key(a[0], a[1])] - dist[key(b[0], b[1])]);
    const current = openSet.shift()!;
    const [cr, cc] = current;

    if (cr === end[0] && cc === end[1]) {
      // Reconstruct path
      const path: Array<[number, number]> = [];
      let cur: string | null = key(end[0], end[1]);
      while (cur) {
        const [r, c] = cur.split(",").map(Number);
        path.unshift([r, c]);
        cur = prev[cur];
      }

      yield {
        id: stepId++,
        type: "done",
        description: `Path found! Length: ${dist[key(end[0], end[1])]}`,
        grid: grid.map((row) => [...row]),
        openSet: [],
        closedSet: [...closedSet],
        currentNode: end,
        path,
        gScores: { ...dist },
      };
      return;
    }

    closedSet.push(current);

    yield {
      id: stepId++,
      type: "visit",
      description: `Visit (${cr},${cc}), distance = ${dist[key(cr, cc)]}`,
      grid: grid.map((row) => [...row]),
      openSet: openSet.map((n) => [...n] as [number, number]),
      closedSet: closedSet.map((n) => [...n] as [number, number]),
      currentNode: current,
      path: [],
      gScores: { ...dist },
    };

    for (const [dr, dc] of directions) {
      const nr = cr + dr;
      const nc = cc + dc;

      if (nr < 0 || nr >= gridRows || nc < 0 || nc >= gridCols) continue;
      if (grid[nr][nc] === "wall") continue;
      if (closedSet.some(([r, c]) => r === nr && c === nc)) continue;

      const alt = dist[key(cr, cc)] + 1;
      if (alt < dist[key(nr, nc)]) {
        dist[key(nr, nc)] = alt;
        prev[key(nr, nc)] = key(cr, cc);

        if (!openSet.some(([r, c]) => r === nr && c === nc)) {
          openSet.push([nr, nc]);
        }

        yield {
          id: stepId++,
          type: "update",
          description: `Update (${nr},${nc}): distance = ${alt}`,
          grid: grid.map((row) => [...row]),
          openSet: openSet.map((n) => [...n] as [number, number]),
          closedSet: closedSet.map((n) => [...n] as [number, number]),
          currentNode: [nr, nc],
          path: [],
          gScores: { ...dist },
        };
      }
    }
  }

  yield {
    id: stepId++,
    type: "done",
    description: "No path found!",
    grid: grid.map((row) => [...row]),
    openSet: [],
    closedSet: [...closedSet],
    currentNode: null,
    path: [],
    gScores: { ...dist },
  };
}
