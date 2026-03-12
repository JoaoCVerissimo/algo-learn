export interface BaseStep {
  id: number;
  description: string;
  type: string;
}

export interface SortingStep extends BaseStep {
  array: number[];
  comparing: [number, number] | null;
  swapping: [number, number] | null;
  sorted: number[];
  pivot?: number;
  subarrays?: { left: number[]; right: number[] };
}

export interface GraphNode {
  id: string;
  label: string;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  weight?: number;
  active: boolean;
}

export interface GraphStep extends BaseStep {
  nodes: GraphNode[];
  edges: GraphEdge[];
  visited: string[];
  frontier: string[];
  currentNode: string | null;
  distances?: Record<string, number>;
  parent?: Record<string, string | null>;
}

export interface DPStep extends BaseStep {
  table: number[][];
  currentCell: [number, number];
  highlightedCells: Array<[number, number]>;
  formula: string;
  labels?: { rows: string[]; cols: string[] };
}

export type CellState = "empty" | "wall" | "start" | "end" | "open" | "closed" | "path";

export interface PathfindingStep extends BaseStep {
  grid: CellState[][];
  openSet: Array<[number, number]>;
  closedSet: Array<[number, number]>;
  currentNode: [number, number] | null;
  path: Array<[number, number]>;
  fScores?: Record<string, number>;
  gScores?: Record<string, number>;
}

export type AlgorithmStep = SortingStep | GraphStep | DPStep | PathfindingStep;

export type AlgorithmGenerator<S extends BaseStep> = Generator<S, void, undefined>;
