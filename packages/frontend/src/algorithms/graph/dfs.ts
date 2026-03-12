import type { GraphStep, GraphNode, GraphEdge, AlgorithmGenerator } from "../types";

export function* dfs(
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
  const stack: string[] = [];
  let stepId = 0;

  yield {
    id: stepId++,
    type: "init",
    description: `Start DFS from node ${startNode}`,
    nodes,
    edges: allEdges.map((e) => ({ ...e })),
    visited: [],
    frontier: [startNode],
    currentNode: startNode,
  };

  function* visit(node: string): AlgorithmGenerator<GraphStep> {
    if (visited.includes(node)) return;
    visited.push(node);
    stack.push(node);

    yield {
      id: stepId++,
      type: "visit",
      description: `Visit node ${node}`,
      nodes,
      edges: allEdges.map((e) => ({ ...e })),
      visited: [...visited],
      frontier: [...stack],
      currentNode: node,
    };

    for (const neighbor of adjacencyList[node] || []) {
      if (!visited.includes(neighbor)) {
        yield {
          id: stepId++,
          type: "explore",
          description: `Explore edge ${node} -> ${neighbor}`,
          nodes,
          edges: allEdges.map((e) => ({
            ...e,
            active: e.from === node && e.to === neighbor,
          })),
          visited: [...visited],
          frontier: [...stack, neighbor],
          currentNode: node,
        };

        yield* visit(neighbor);
      }
    }

    stack.pop();

    yield {
      id: stepId++,
      type: "backtrack",
      description: `Backtrack from node ${node}`,
      nodes,
      edges: allEdges.map((e) => ({ ...e })),
      visited: [...visited],
      frontier: [...stack],
      currentNode: stack[stack.length - 1] || null,
    };
  }

  yield* visit(startNode);

  yield {
    id: stepId++,
    type: "done",
    description: "DFS complete!",
    nodes,
    edges: allEdges.map((e) => ({ ...e })),
    visited: [...visited],
    frontier: [],
    currentNode: null,
  };
}
