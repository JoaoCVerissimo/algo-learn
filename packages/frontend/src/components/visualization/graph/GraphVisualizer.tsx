import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { GraphStep } from "../../../algorithms/types";

interface GraphVisualizerProps {
  step: GraphStep | null;
  width?: number;
  height?: number;
}

export function GraphVisualizer({
  step,
  width = 600,
  height = 400,
}: GraphVisualizerProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !step) return;

    const svg = d3.select(svgRef.current);
    const { nodes, edges, visited, frontier, currentNode } = step;

    // Scale node positions to fit the SVG
    const xExtent = d3.extent(nodes, (n) => n.x ?? 0) as [number, number];
    const yExtent = d3.extent(nodes, (n) => n.y ?? 0) as [number, number];
    const xScale = d3.scaleLinear().domain(xExtent).range([60, width - 60]);
    const yScale = d3.scaleLinear().domain(yExtent).range([60, height - 60]);

    // Edges
    const edgeSelection = svg
      .selectAll<SVGLineElement, typeof edges[0]>("line.edge")
      .data(edges, (d) => `${d.from}-${d.to}`);

    edgeSelection
      .join(
        (enter) =>
          enter
            .append("line")
            .attr("class", "edge")
            .attr("stroke-width", 2),
        (update) => update,
        (exit) => exit.remove()
      )
      .transition()
      .duration(200)
      .attr("x1", (d) => xScale(nodes.find((n) => n.id === d.from)?.x ?? 0))
      .attr("y1", (d) => yScale(nodes.find((n) => n.id === d.from)?.y ?? 0))
      .attr("x2", (d) => xScale(nodes.find((n) => n.id === d.to)?.x ?? 0))
      .attr("y2", (d) => yScale(nodes.find((n) => n.id === d.to)?.y ?? 0))
      .attr("stroke", (d) => (d.active ? "#f59e0b" : "#d1d5db"))
      .attr("stroke-width", (d) => (d.active ? 3 : 1.5));

    // Arrow markers for directed edges
    svg
      .selectAll("defs")
      .data([null])
      .join("defs")
      .selectAll("marker")
      .data([null])
      .join("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 20)
      .attr("refY", 5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .selectAll("path")
      .data([null])
      .join("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .attr("fill", "#9ca3af");

    svg.selectAll("line.edge").attr("marker-end", "url(#arrowhead)");

    // Nodes
    const nodeRadius = 22;
    const nodeGroups = svg
      .selectAll<SVGGElement, typeof nodes[0]>("g.node")
      .data(nodes, (d) => d.id);

    const enterGroups = nodeGroups
      .enter()
      .append("g")
      .attr("class", "node")
      .attr(
        "transform",
        (d) => `translate(${xScale(d.x ?? 0)},${yScale(d.y ?? 0)})`
      );

    enterGroups.append("circle").attr("r", nodeRadius);
    enterGroups
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("font-size", 14)
      .attr("font-weight", "bold");

    const mergedGroups = enterGroups.merge(nodeGroups);

    mergedGroups
      .transition()
      .duration(200)
      .attr(
        "transform",
        (d) => `translate(${xScale(d.x ?? 0)},${yScale(d.y ?? 0)})`
      );

    mergedGroups
      .select("circle")
      .transition()
      .duration(200)
      .attr("r", nodeRadius)
      .attr("fill", (d) => {
        if (d.id === currentNode) return "#f59e0b";
        if (visited.includes(d.id)) return "#4ade80";
        if (frontier.includes(d.id)) return "#fbbf24";
        return "#e5e7eb";
      })
      .attr("stroke", (d) => (d.id === currentNode ? "#d97706" : "#9ca3af"))
      .attr("stroke-width", (d) => (d.id === currentNode ? 3 : 1.5));

    mergedGroups
      .select("text")
      .text((d) => d.label)
      .attr("fill", (d) => {
        if (d.id === currentNode || visited.includes(d.id)) return "#1f2937";
        return "#6b7280";
      });

    nodeGroups.exit().remove();
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
