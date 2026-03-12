import type { GraphStep, GraphNode, GraphEdge, AlgorithmGenerator } from "../types";

export function* bfs(
  adjacencyList: Record<string, string[]>,
  startNode: string
): AlgorithmGenerator<GraphStep> {
  const nodeIds = Object.keys(adjacencyList);
  const nodes: GraphNode[] = nodeIds.map((id, i) => ({
    id,
    label: id,
    x: 150 + 120 * Math.cos((2 * Math.PI * i) / nodeIds.length),
    y: 150 + 120 * Math.sin((2 * Math.PI * i) / nodeIds.length),
  }));

  const allEdges: GraphEdge[] = [];
  for (const [from, neighbors] of Object.entries(adjacencyList)) {
    for (const to of neighbors) {
      allEdges.push({ from, to, active: false });
    }
  }

  const visited: string[] = [];
  const queue: string[] = [startNode];
  let stepId = 0;

  yield {
    id: stepId++,
    type: "init",
    description: `Start BFS from node ${startNode}`,
    nodes,
    edges: allEdges.map((e) => ({ ...e })),
    visited: [],
    frontier: [startNode],
    currentNode: startNode,
  };

  visited.push(startNode);

  while (queue.length > 0) {
    const current = queue.shift()!;

    yield {
      id: stepId++,
      type: "visit",
      description: `Visit node ${current}`,
      nodes,
      edges: allEdges.map((e) => ({ ...e })),
      visited: [...visited],
      frontier: [...queue],
      currentNode: current,
    };

    for (const neighbor of adjacencyList[current] || []) {
      if (!visited.includes(neighbor)) {
        visited.push(neighbor);
        queue.push(neighbor);

        yield {
          id: stepId++,
          type: "discover",
          description: `Discover node ${neighbor} via edge ${current} -> ${neighbor}`,
          nodes,
          edges: allEdges.map((e) => ({
            ...e,
            active: e.from === current && e.to === neighbor,
          })),
          visited: [...visited],
          frontier: [...queue],
          currentNode: current,
        };
      }
    }
  }

  yield {
    id: stepId++,
    type: "done",
    description: "BFS complete!",
    nodes,
    edges: allEdges.map((e) => ({ ...e })),
    visited: [...visited],
    frontier: [],
    currentNode: null,
  };
}
