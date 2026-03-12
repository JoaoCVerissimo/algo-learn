import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { DPStep } from "../../../algorithms/types";

interface DPVisualizerProps {
  step: DPStep | null;
  width?: number;
  height?: number;
}

export function DPVisualizer({
  step,
  width = 700,
  height = 400,
}: DPVisualizerProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !step) return;

    const svg = d3.select(svgRef.current);
    const { table, currentCell, highlightedCells, formula, labels } = step;

    const rows = table.length;
    const cols = table[0]?.length || 0;
    if (rows === 0 || cols === 0) return;

    const margin = { top: 40, right: 20, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const cellWidth = Math.min(40, innerWidth / cols);
    const cellHeight = Math.min(35, innerHeight / rows);

    let g = svg.select<SVGGElement>("g.dp-table");
    if (g.empty()) {
      g = svg
        .append("g")
        .attr("class", "dp-table")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    }

    // Flatten table into cell data
    const cellData: Array<{
      row: number;
      col: number;
      value: number;
      isCurrent: boolean;
      isHighlighted: boolean;
    }> = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        cellData.push({
          row: r,
          col: c,
          value: table[r][c],
          isCurrent: r === currentCell[0] && c === currentCell[1],
          isHighlighted: highlightedCells.some(([hr, hc]) => hr === r && hc === c),
        });
      }
    }

    // Cells
    const cells = g
      .selectAll<SVGRectElement, (typeof cellData)[0]>("rect.cell")
      .data(cellData, (d) => `${d.row}-${d.col}`);

    cells
      .join(
        (enter) =>
          enter.append("rect").attr("class", "cell").attr("rx", 2),
        (update) => update,
        (exit) => exit.remove()
      )
      .transition()
      .duration(200)
      .attr("x", (d) => d.col * cellWidth)
      .attr("y", (d) => d.row * cellHeight)
      .attr("width", cellWidth - 1)
      .attr("height", cellHeight - 1)
      .attr("fill", (d) => {
        if (d.isCurrent) return "#818cf8";
        if (d.isHighlighted) return "#fbbf24";
        if (d.value > 0) return "#dbeafe";
        return "#f9fafb";
      })
      .attr("stroke", (d) => {
        if (d.isCurrent) return "#4f46e5";
        if (d.isHighlighted) return "#d97706";
        return "#e5e7eb";
      })
      .attr("stroke-width", (d) => (d.isCurrent || d.isHighlighted ? 2 : 1));

    // Cell values
    const cellTexts = g
      .selectAll<SVGTextElement, (typeof cellData)[0]>("text.cell-value")
      .data(cellData, (d) => `${d.row}-${d.col}`);

    cellTexts
      .join(
        (enter) =>
          enter
            .append("text")
            .attr("class", "cell-value")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central")
            .attr("font-size", 11),
        (update) => update,
        (exit) => exit.remove()
      )
      .transition()
      .duration(200)
      .attr("x", (d) => d.col * cellWidth + (cellWidth - 1) / 2)
      .attr("y", (d) => d.row * cellHeight + (cellHeight - 1) / 2)
      .attr("fill", (d) => (d.isCurrent ? "white" : "#374151"))
      .attr("font-weight", (d) => (d.isCurrent ? "bold" : "normal"))
      .text((d) => d.value);

    // Row labels
    if (labels?.rows) {
      const rowLabels = g
        .selectAll<SVGTextElement, string>("text.row-label")
        .data(labels.rows);

      rowLabels
        .join("text")
        .attr("class", "row-label")
        .attr("x", -8)
        .attr("y", (_, i) => i * cellHeight + (cellHeight - 1) / 2)
        .attr("text-anchor", "end")
        .attr("dominant-baseline", "central")
        .attr("font-size", 10)
        .attr("fill", "#6b7280")
        .text((d) => d);
    }

    // Column labels
    if (labels?.cols) {
      const colLabels = g
        .selectAll<SVGTextElement, string>("text.col-label")
        .data(labels.cols);

      colLabels
        .join("text")
        .attr("class", "col-label")
        .attr("x", (_, i) => i * cellWidth + (cellWidth - 1) / 2)
        .attr("y", -8)
        .attr("text-anchor", "middle")
        .attr("font-size", 10)
        .attr("fill", "#6b7280")
        .text((d) => d);
    }

    // Formula text
    let formulaText = svg.select<SVGTextElement>("text.formula");
    if (formulaText.empty()) {
      formulaText = svg.append("text").attr("class", "formula");
    }
    formulaText
      .attr("x", width / 2)
      .attr("y", height - 15)
      .attr("text-anchor", "middle")
      .attr("font-size", 13)
      .attr("font-family", "monospace")
      .attr("fill", "#4f46e5")
      .text(formula);
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
