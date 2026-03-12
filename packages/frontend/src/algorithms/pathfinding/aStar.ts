import type { PathfindingStep, CellState, AlgorithmGenerator } from "../types";

export function* aStarViz(
  gridRows: number,
  gridCols: number,
  walls: Array<[number, number]>,
  start: [number, number],
  end: [number, number]
): AlgorithmGenerator<PathfindingStep> {
  const grid: CellState[][] = Array.from({ length: gridRows }, () =>
    new Array(gridCols).fill("empty" as CellState)
  );

  for (const [r, c] of walls) grid[r][c] = "wall";
  grid[start[0]][start[1]] = "start";
  grid[end[0]][end[1]] = "end";

  let stepId = 0;
  const key = (r: number, c: number) => `${r},${c}`;
  const heuristic = (r: number, c: number) =>
    Math.abs(r - end[0]) + Math.abs(c - end[1]);

  const gScore: Record<string, number> = {};
  const fScore: Record<string, number> = {};
  const prev: Record<string, string | null> = {};
  const openSet: Array<[number, number]> = [start];
  const closedSet: Array<[number, number]> = [];

  for (let r = 0; r < gridRows; r++) {
    for (let c = 0; c < gridCols; c++) {
      gScore[key(r, c)] = Infinity;
      fScore[key(r, c)] = Infinity;
      prev[key(r, c)] = null;
    }
  }
  gScore[key(start[0], start[1])] = 0;
  fScore[key(start[0], start[1])] = heuristic(start[0], start[1]);

  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

  yield {
    id: stepId++,
    type: "init",
    description: `Start A* from (${start[0]},${start[1]}) to (${end[0]},${end[1]})`,
    grid: grid.map((row) => [...row]),
    openSet: [...openSet],
    closedSet: [],
    currentNode: start,
    path: [],
    fScores: { ...fScore },
    gScores: { ...gScore },
  };

  while (openSet.length > 0) {
    openSet.sort((a, b) => fScore[key(a[0], a[1])] - fScore[key(b[0], b[1])]);
    const current = openSet.shift()!;
    const [cr, cc] = current;

    if (cr === end[0] && cc === end[1]) {
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
        description: `Path found! Cost: ${gScore[key(end[0], end[1])]}`,
        grid: grid.map((row) => [...row]),
        openSet: [],
        closedSet: [...closedSet],
        currentNode: end,
        path,
        fScores: { ...fScore },
        gScores: { ...gScore },
      };
      return;
    }

    closedSet.push(current);

    yield {
      id: stepId++,
      type: "visit",
      description: `Visit (${cr},${cc}), f=${fScore[key(cr, cc)]}, g=${gScore[key(cr, cc)]}`,
      grid: grid.map((row) => [...row]),
      openSet: openSet.map((n) => [...n] as [number, number]),
      closedSet: closedSet.map((n) => [...n] as [number, number]),
      currentNode: current,
      path: [],
      fScores: { ...fScore },
      gScores: { ...gScore },
    };

    for (const [dr, dc] of directions) {
      const nr = cr + dr;
      const nc = cc + dc;

      if (nr < 0 || nr >= gridRows || nc < 0 || nc >= gridCols) continue;
      if (grid[nr][nc] === "wall") continue;
      if (closedSet.some(([r, c]) => r === nr && c === nc)) continue;

      const tentativeG = gScore[key(cr, cc)] + 1;
      if (tentativeG < gScore[key(nr, nc)]) {
        prev[key(nr, nc)] = key(cr, cc);
        gScore[key(nr, nc)] = tentativeG;
        fScore[key(nr, nc)] = tentativeG + heuristic(nr, nc);

        if (!openSet.some(([r, c]) => r === nr && c === nc)) {
          openSet.push([nr, nc]);
        }

        yield {
          id: stepId++,
          type: "update",
          description: `Update (${nr},${nc}): g=${tentativeG}, f=${fScore[key(nr, nc)]}`,
          grid: grid.map((row) => [...row]),
          openSet: openSet.map((n) => [...n] as [number, number]),
          closedSet: closedSet.map((n) => [...n] as [number, number]),
          currentNode: [nr, nc],
          path: [],
          fScores: { ...fScore },
          gScores: { ...gScore },
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
    fScores: { ...fScore },
    gScores: { ...gScore },
  };
}
