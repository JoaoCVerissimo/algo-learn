import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { SortingStep } from "../../../algorithms/types";

interface SortingVisualizerProps {
  step: SortingStep | null;
  width?: number;
  height?: number;
}

export function SortingVisualizer({
  step,
  width = 600,
  height = 350,
}: SortingVisualizerProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !step) return;

    const svg = d3.select(svgRef.current);
    const margin = { top: 20, right: 20, bottom: 30, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const { array, comparing, swapping, sorted, pivot } = step;

    const xScale = d3
      .scaleBand<number>()
      .domain(array.map((_, i) => i))
      .range([0, innerWidth])
      .padding(0.15);

    const yScale = d3
      .scaleLinear()
      .domain([0, Math.max(...array, 1)])
      .range([innerHeight, 0]);

    let g = svg.select<SVGGElement>("g.chart");
    if (g.empty()) {
      g = svg
        .append("g")
        .attr("class", "chart")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    }

    const bars = g.selectAll<SVGRectElement, number>("rect.bar").data(array);

    bars
      .join(
        (enter) =>
          enter
            .append("rect")
            .attr("class", "bar")
            .attr("rx", 3)
            .attr("x", (_, i) => xScale(i)!)
            .attr("width", xScale.bandwidth())
            .attr("y", innerHeight)
            .attr("height", 0),
        (update) => update,
        (exit) => exit.remove()
      )
      .transition()
      .duration(200)
      .attr("x", (_, i) => xScale(i)!)
      .attr("width", xScale.bandwidth())
      .attr("y", (d) => yScale(d))
      .attr("height", (d) => innerHeight - yScale(d))
      .attr("fill", (_, i) => {
        if (sorted.includes(i)) return "#4ade80";
        if (pivot !== undefined && i === pivot) return "#c084fc";
        if (swapping && (i === swapping[0] || i === swapping[1])) return "#f87171";
        if (comparing && (i === comparing[0] || i === comparing[1])) return "#facc15";
        return "#60a5fa";
      });

    // Value labels
    const labels = g.selectAll<SVGTextElement, number>("text.label").data(array);

    labels
      .join(
        (enter) =>
          enter
            .append("text")
            .attr("class", "label")
            .attr("text-anchor", "middle")
            .attr("font-size", Math.min(12, xScale.bandwidth() / 2)),
        (update) => update,
        (exit) => exit.remove()
      )
      .transition()
      .duration(200)
      .attr("x", (_, i) => xScale(i)! + xScale.bandwidth() / 2)
      .attr("y", (d) => yScale(d) - 5)
      .attr("fill", "#374151")
      .text((d) => d);
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
