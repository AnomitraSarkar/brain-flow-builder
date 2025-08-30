import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Props {
  weights?: number[][];
  width?: number;
  height?: number;
}

export const WeightHistogramMini = ({ weights, width = 220, height = 80 }: Props) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current || !weights) return;

    const flat = weights.flat();
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();

    const margin = { top: 4, right: 4, bottom: 12, left: 4 };
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain(d3.extent(flat) as [number, number]).nice().range([0, w]);
    const bins = d3
      .histogram()
      .domain(x.domain() as [number, number])
      .thresholds(12)(flat);

    const y = d3.scaleLinear().domain([0, d3.max(bins, (d) => d.length) || 0]).range([h, 0]);

    g
      .selectAll('rect')
      .data(bins)
      .enter()
      .append('rect')
      .attr('x', (d) => x(d.x0 || 0))
      .attr('y', (d) => y(d.length))
      .attr('width', (d) => Math.max(0, (x(d.x1 || 0) - x(d.x0 || 0)) - 1))
      .attr('height', (d) => h - y(d.length))
      .attr('fill', 'hsl(var(--primary))')
      .attr('opacity', 0.6);

    // axis baseline for context
    g
      .append('line')
      .attr('x1', 0)
      .attr('x2', w)
      .attr('y1', h)
      .attr('y2', h)
      .attr('stroke', 'hsl(var(--border))');
  }, [weights, width, height]);

  return <svg ref={ref} width={width} height={height} role="img" aria-label="Weight distribution histogram" />;
};

export default WeightHistogramMini;
