import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { PathfindingStep, CellState } from "../../../algorithms/types";

interface GridVisualizerProps {
  step: PathfindingStep | null;
  width?: number;
  height?: number;
}

const cellColors: Record<CellState, string> = {
  empty: "#f9fafb",
  wall: "#1f2937",
  start: "#3b82f6",
  end: "#ef4444",
  open: "#bfdbfe",
  closed: "#d1d5db",
  path: "#4ade80",
};

export function GridVisualizer({
  step,
  width = 600,
  height = 600,
}: GridVisualizerProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !step) return;

    const svg = d3.select(svgRef.current);
    const { grid, openSet, closedSet, currentNode, path } = step;

    const rows = grid.length;
    const cols = grid[0]?.length || 0;
    if (rows === 0 || cols === 0) return;

    const margin = 10;
    const cellSize = Math.min(
      (width - 2 * margin) / cols,
      (height - 2 * margin) / rows
    );

    let g = svg.select<SVGGElement>("g.grid");
    if (g.empty()) {
      g = svg
        .append("g")
        .attr("class", "grid")
        .attr("transform", `translate(${margin},${margin})`);
    }

    // Flatten grid into cell data
    const cellData: Array<{
      row: number;
      col: number;
      state: CellState;
      isOpen: boolean;
      isClosed: boolean;
      isCurrent: boolean;
      isPath: boolean;
    }> = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        cellData.push({
          row: r,
          col: c,
          state: grid[r][c],
          isOpen: openSet.some(([or, oc]) => or === r && oc === c),
          isClosed: closedSet.some(([cr, cc]) => cr === r && cc === c),
          isCurrent: currentNode ? currentNode[0] === r && currentNode[1] === c : false,
          isPath: path.some(([pr, pc]) => pr === r && pc === c),
        });
      }
    }

    const cells = g
      .selectAll<SVGRectElement, (typeof cellData)[0]>("rect.grid-cell")
      .data(cellData, (d) => `${d.row}-${d.col}`);

    cells
      .join(
        (enter) =>
          enter.append("rect").attr("class", "grid-cell").attr("rx", 2),
        (update) => update,
        (exit) => exit.remove()
      )
      .transition()
      .duration(150)
      .attr("x", (d) => d.col * cellSize)
      .attr("y", (d) => d.row * cellSize)
      .attr("width", cellSize - 1)
      .attr("height", cellSize - 1)
      .attr("fill", (d) => {
        if (d.isCurrent) return "#f59e0b";
        if (d.isPath) return cellColors.path;
        if (d.state === "wall") return cellColors.wall;
        if (d.state === "start") return cellColors.start;
        if (d.state === "end") return cellColors.end;
        if (d.isOpen) return cellColors.open;
        if (d.isClosed) return cellColors.closed;
        return cellColors.empty;
      })
      .attr("stroke", "#e5e7eb")
      .attr("stroke-width", 0.5);
  }, [step, width, height]);

  if (!step) return <div className="text-gray-500">No data to visualize</div>;

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className="bg-white rounded-lg"
    />
  );
}
