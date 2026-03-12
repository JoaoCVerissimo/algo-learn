import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useVisualization } from "../../hooks/useVisualization";
import { PlaybackControls } from "./PlaybackControls";
import { SortingVisualizer } from "./sorting/SortingVisualizer";
import { GraphVisualizer } from "./graph/GraphVisualizer";
import { DPVisualizer } from "./dp/DPVisualizer";
import { GridVisualizer } from "./pathfinding/GridVisualizer";

import { bubbleSort } from "../../algorithms/sorting/bubbleSort";
import { quickSort } from "../../algorithms/sorting/quickSort";
import { mergeSort } from "../../algorithms/sorting/mergeSort";
import { bfs } from "../../algorithms/graph/bfs";
import { dfs } from "../../algorithms/graph/dfs";
import { fibonacciDP } from "../../algorithms/dp/fibonacci";
import { knapsackDP } from "../../algorithms/dp/knapsack";
import { lcsDP } from "../../algorithms/dp/lcs";
import { dijkstraViz } from "../../algorithms/pathfinding/dijkstra";
import { aStarViz } from "../../algorithms/pathfinding/aStar";

import type { SortingStep, GraphStep, DPStep, PathfindingStep } from "../../algorithms/types";

type AlgorithmCategory = "sorting" | "graph" | "dp" | "pathfinding";

interface AlgorithmConfig {
  name: string;
  category: AlgorithmCategory;
  defaultInput: string;
  createGenerator: (input: string) => Generator<any, void, undefined>;
}

const sampleGraph: Record<string, string[]> = {
  A: ["B", "C"],
  B: ["D", "E"],
  C: ["F"],
  D: [],
  E: ["F"],
  F: [],
};

const sampleWalls: Array<[number, number]> = [
  [2, 3], [2, 4], [2, 5], [3, 5], [4, 5], [5, 5],
  [5, 4], [5, 3], [5, 2], [1, 7], [2, 7], [3, 7],
  [6, 1], [6, 2], [7, 4], [7, 5], [7, 6],
];

const algorithms: Record<string, AlgorithmConfig> = {
  "bubble-sort": {
    name: "Bubble Sort",
    category: "sorting",
    defaultInput: "38, 27, 43, 3, 9, 82, 10",
    createGenerator: (input) => bubbleSort(input.split(",").map((s) => parseInt(s.trim(), 10))),
  },
  "quick-sort": {
    name: "Quick Sort",
    category: "sorting",
    defaultInput: "10, 80, 30, 90, 40, 50, 70",
    createGenerator: (input) => quickSort(input.split(",").map((s) => parseInt(s.trim(), 10))),
  },
  "merge-sort": {
    name: "Merge Sort",
    category: "sorting",
    defaultInput: "38, 27, 43, 3, 9, 82, 10",
    createGenerator: (input) => mergeSort(input.split(",").map((s) => parseInt(s.trim(), 10))),
  },
  bfs: {
    name: "Breadth-First Search",
    category: "graph",
    defaultInput: "A",
    createGenerator: (input) => bfs(sampleGraph, input.trim()),
  },
  dfs: {
    name: "Depth-First Search",
    category: "graph",
    defaultInput: "A",
    createGenerator: (input) => dfs(sampleGraph, input.trim()),
  },
  "fibonacci-dp": {
    name: "Fibonacci (DP)",
    category: "dp",
    defaultInput: "8",
    createGenerator: (input) => fibonacciDP(parseInt(input.trim(), 10)),
  },
  knapsack: {
    name: "0/1 Knapsack",
    category: "dp",
    defaultInput: "weights: 1,3,4,5 | values: 1,4,5,7 | capacity: 7",
    createGenerator: (input) => {
      const parts = input.split("|").map((s) => s.trim());
      const weights = parts[0].replace("weights:", "").trim().split(",").map(Number);
      const values = parts[1].replace("values:", "").trim().split(",").map(Number);
      const capacity = parseInt(parts[2].replace("capacity:", "").trim(), 10);
      return knapsackDP(weights, values, capacity);
    },
  },
  lcs: {
    name: "Longest Common Subsequence",
    category: "dp",
    defaultInput: "ABCBDAB, BDCAB",
    createGenerator: (input) => {
      const [text1, text2] = input.split(",").map((s) => s.trim());
      return lcsDP(text1, text2);
    },
  },
  dijkstra: {
    name: "Dijkstra's Algorithm",
    category: "pathfinding",
    defaultInput: "10x10 grid",
    createGenerator: () => dijkstraViz(10, 10, sampleWalls, [0, 0], [9, 9]),
  },
  "a-star": {
    name: "A* Search",
    category: "pathfinding",
    defaultInput: "10x10 grid",
    createGenerator: () => aStarViz(10, 10, sampleWalls, [0, 0], [9, 9]),
  },
};

export function VisualizationPage() {
  const { algorithm } = useParams<{ algorithm: string }>();
  const config = algorithm ? algorithms[algorithm] : null;

  const [input, setInput] = useState(config?.defaultInput || "");
  const viz = useVisualization<any>();

  useEffect(() => {
    if (config) {
      setInput(config.defaultInput);
      viz.initialize(config.createGenerator(config.defaultInput));
    }
  }, [algorithm]);

  const handleRun = () => {
    if (config) {
      viz.initialize(config.createGenerator(input));
    }
  };

  if (!config) {
    return (
      <div>
        <p className="text-gray-500">Unknown algorithm: {algorithm}</p>
        <Link to="/visualize" className="text-indigo-600 underline">
          Back to visualizations
        </Link>
      </div>
    );
  }

  const renderVisualizer = () => {
    switch (config.category) {
      case "sorting":
        return <SortingVisualizer step={viz.currentStep as SortingStep} />;
      case "graph":
        return <GraphVisualizer step={viz.currentStep as GraphStep} />;
      case "dp":
        return <DPVisualizer step={viz.currentStep as DPStep} />;
      case "pathfinding":
        return <GridVisualizer step={viz.currentStep as PathfindingStep} />;
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link to="/visualize" className="text-gray-500 hover:text-gray-700">
          Visualizations
        </Link>
        <span className="text-gray-400">/</span>
        <h1 className="text-2xl font-bold">{config.name}</h1>
      </div>

      {/* Input */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Input
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 rounded-md border-gray-300 border px-3 py-2 text-sm"
          />
          <button
            onClick={handleRun}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded font-medium transition"
          >
            Run
          </button>
        </div>
      </div>

      {/* Visualization */}
      <div className="bg-white rounded-lg shadow p-4 mb-4 flex justify-center">
        {renderVisualizer()}
      </div>

      {/* Playback Controls */}
      <PlaybackControls
        isPlaying={viz.isPlaying}
        currentIndex={viz.currentIndex}
        totalSteps={viz.totalSteps}
        speed={viz.speed}
        description={viz.currentStep?.description || ""}
        onPlay={viz.play}
        onPause={viz.pause}
        onStepForward={viz.stepForward}
        onStepBackward={viz.stepBackward}
        onGoToStep={viz.goToStep}
        onSetSpeed={viz.setSpeed}
        onReset={viz.reset}
      />
    </div>
  );
}
