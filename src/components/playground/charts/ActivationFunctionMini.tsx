import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

type Kind = 'relu' | 'tanh' | 'sigmoid';

export const ActivationFunctionMini = ({ kind, width = 220, height = 80 }: { kind: Kind; width?: number; height?: number }) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();

    const margin = { top: 4, right: 4, bottom: 12, left: 4 };
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([-5, 5]).range([0, w]);
    const yDomain = kind === 'relu' ? [0, 5] : kind === 'sigmoid' ? [0, 1] : [-1.2, 1.2];
    const y = d3.scaleLinear().domain(yDomain as [number, number]).range([h, 0]);

    const xs = d3.range(-5, 5.01, 0.1);
    const line = d3
      .line<number>()
      .x((d) => x(d))
      .y((d) => {
        const fx = kind === 'relu' ? Math.max(0, d) : kind === 'sigmoid' ? 1 / (1 + Math.exp(-d)) : Math.tanh(d);
        return y(fx);
      });

    g
      .append('path')
      .datum(xs)
      .attr('fill', 'none')
      .attr('stroke', 'hsl(var(--primary))')
      .attr('stroke-width', 1.5)
      .attr('d', line);

    // baseline
    g.append('line').attr('x1', 0).attr('x2', w).attr('y1', y(0)).attr('y2', y(0)).attr('stroke', 'hsl(var(--border))');
  }, [kind, width, height]);

  return <svg ref={ref} width={width} height={height} role="img" aria-label={`${kind} function`} />;
};

export default ActivationFunctionMini;
