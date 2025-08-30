import { useState, useEffect, useRef } from "react";
import { LayerConfig } from "@/types/neural-network";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Download, Upload } from "lucide-react";
import * as d3 from "d3";

interface WeightsEditorProps {
  layer: LayerConfig;
  onUpdateLayer: (layer: LayerConfig) => void;
}

export const WeightsEditor = ({ layer, onUpdateLayer }: WeightsEditorProps) => {
  const histogramRef = useRef<SVGSVGElement>(null);
  const heatmapRef = useRef<SVGSVGElement>(null);
  const biasChartRef = useRef<SVGSVGElement>(null);

  // Generate random weights
  const regenerateWeights = () => {
    let newWeights: number[][];
    let newBiases: number[];

    switch (layer.type) {
      case 'dense':
        const units = layer.params.units || 128;
        const inputSize = layer.weights?.[0]?.length || 128;
        newWeights = Array.from({ length: inputSize }, () =>
          Array.from({ length: units }, () => (Math.random() - 0.5) * 0.2)
        );
        newBiases = Array.from({ length: units }, () => (Math.random() - 0.5) * 0.02);
        break;
      
      case 'conv2d':
        const filters = layer.params.filters || 32;
        const kernelSize = layer.params.kernel_size || [3, 3];
        const channels = 3;
        newWeights = Array.from({ length: filters }, () =>
          Array.from({ length: kernelSize[0] * kernelSize[1] * channels }, () => (Math.random() - 0.5) * 0.1)
        );
        newBiases = Array.from({ length: filters }, () => (Math.random() - 0.5) * 0.01);
        break;
      
      default:
        return;
    }

    onUpdateLayer({
      ...layer,
      weights: newWeights,
      biases: newBiases
    });
  };

  // Update individual weight
  const updateWeight = (i: number, j: number, value: number) => {
    if (!layer.weights) return;
    
    const newWeights = [...layer.weights];
    newWeights[i] = [...newWeights[i]];
    newWeights[i][j] = value;
    
    onUpdateLayer({
      ...layer,
      weights: newWeights
    });
  };

  // Update individual bias
  const updateBias = (index: number, value: number) => {
    if (!layer.biases) return;
    
    const newBiases = [...layer.biases];
    newBiases[index] = value;
    
    onUpdateLayer({
      ...layer,
      biases: newBiases
    });
  };

  // D3.js Weight Distribution Histogram
  useEffect(() => {
    if (!histogramRef.current || !layer.weights) return;

    const svg = d3.select(histogramRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const width = 300 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    const allWeights = layer.weights.flat();
    
    const x = d3.scaleLinear()
      .domain(d3.extent(allWeights) as [number, number])
      .range([0, width]);

    const histogram = d3.histogram()
      .value(d => d)
      .domain(x.domain() as [number, number])
      .thresholds(20);

    const bins = histogram(allWeights);

    const y = d3.scaleLinear()
      .domain([0, d3.max(bins, d => d.length) || 0])
      .range([height, 0]);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    g.selectAll(".bar")
      .data(bins)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.x0 || 0))
      .attr("y", d => y(d.length))
      .attr("width", d => Math.max(0, x(d.x1 || 0) - x(d.x0 || 0) - 1))
      .attr("height", d => height - y(d.length))
      .attr("fill", "hsl(var(--primary))")
      .attr("opacity", 0.7);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    g.append("g")
      .call(d3.axisLeft(y));

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "hsl(var(--foreground))")
      .text("Frequency");

    g.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.bottom})`)
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "hsl(var(--foreground))")
      .text("Weight Value");

  }, [layer.weights]);

  // D3.js Weight Heatmap
  useEffect(() => {
    if (!heatmapRef.current || !layer.weights) return;

    const svg = d3.select(heatmapRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 20, left: 40 };
    const width = 300 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    const weights = layer.weights;
    const maxRows = Math.min(weights.length, 20);
    const maxCols = Math.min(weights[0]?.length || 0, 20);

    const cellWidth = width / maxCols;
    const cellHeight = height / maxRows;

    const weightExtent = d3.extent(weights.flat()) as [number, number];
    const colorScale = d3.scaleSequential(d3.interpolateRdBu)
      .domain(weightExtent);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    for (let i = 0; i < maxRows; i++) {
      for (let j = 0; j < maxCols; j++) {
        g.append("rect")
          .attr("x", j * cellWidth)
          .attr("y", i * cellHeight)
          .attr("width", cellWidth)
          .attr("height", cellHeight)
          .attr("fill", colorScale(weights[i]?.[j] || 0))
          .attr("stroke", "white")
          .attr("stroke-width", 0.5);
      }
    }

  }, [layer.weights]);

  // D3.js Bias Chart
  useEffect(() => {
    if (!biasChartRef.current || !layer.biases) return;

    const svg = d3.select(biasChartRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const width = 300 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    const x = d3.scaleBand()
      .domain(layer.biases.map((_, i) => i.toString()))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain(d3.extent(layer.biases) as [number, number])
      .nice()
      .range([height, 0]);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    g.selectAll(".bar")
      .data(layer.biases)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", (_, i) => x(i.toString()) || 0)
      .attr("y", d => y(Math.max(0, d)))
      .attr("width", x.bandwidth())
      .attr("height", d => Math.abs(y(d) - y(0)))
      .attr("fill", d => d >= 0 ? "hsl(var(--primary))" : "hsl(var(--destructive))");

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickValues(x.domain().filter((_, i) => i % 5 === 0)));

    g.append("g")
      .call(d3.axisLeft(y));

    g.append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", y(0))
      .attr("y2", y(0))
      .attr("stroke", "hsl(var(--border))")
      .attr("stroke-width", 2);

  }, [layer.biases]);

  if (!layer.weights && !layer.biases) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-muted-foreground">No weights or biases to visualize for this layer type.</p>
        <Button onClick={regenerateWeights} className="neural-button">
          <RefreshCw className="w-4 h-4 mr-2" />
          Initialize Weights
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button onClick={regenerateWeights} size="sm" className="neural-button">
          <RefreshCw className="w-4 h-4 mr-2" />
          Regenerate
        </Button>
      </div>

      <Tabs defaultValue="visualization" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="visualization">Visualization</TabsTrigger>
          <TabsTrigger value="weights">Weights</TabsTrigger>
          <TabsTrigger value="biases">Biases</TabsTrigger>
        </TabsList>

        <TabsContent value="visualization" className="space-y-4">
          <div className="grid gap-4">
            <div className="neural-card p-4">
              <h4 className="text-sm font-medium mb-2">Weight Distribution</h4>
              <svg ref={histogramRef} width="300" height="240"></svg>
            </div>
            
            <div className="neural-card p-4">
              <h4 className="text-sm font-medium mb-2">Weight Heatmap</h4>
              <svg ref={heatmapRef} width="300" height="240"></svg>
            </div>
            
            {layer.biases && (
              <div className="neural-card p-4">
                <h4 className="text-sm font-medium mb-2">Bias Values</h4>
                <svg ref={biasChartRef} width="300" height="240"></svg>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="weights" className="space-y-4">
          {layer.weights && (
            <div className="neural-card p-4">
              <h4 className="text-sm font-medium mb-3">Weight Matrix ({layer.weights.length}×{layer.weights[0]?.length || 0})</h4>
              <div className="max-h-64 overflow-auto">
                <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${Math.min(layer.weights[0]?.length || 0, 10)}, 1fr)` }}>
                  {layer.weights.slice(0, 10).map((row, i) =>
                    row.slice(0, 10).map((weight, j) => (
                      <Input
                        key={`${i}-${j}`}
                        type="number"
                        step="0.001"
                        value={weight.toFixed(3)}
                        onChange={(e) => updateWeight(i, j, parseFloat(e.target.value) || 0)}
                        className="text-xs h-8 w-16"
                      />
                    ))
                  )}
                </div>
                {layer.weights.length > 10 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Showing first 10×10 weights. Full matrix: {layer.weights.length}×{layer.weights[0]?.length || 0}
                  </p>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="biases" className="space-y-4">
          {layer.biases && (
            <div className="neural-card p-4">
              <h4 className="text-sm font-medium mb-3">Bias Values ({layer.biases.length})</h4>
              <div className="max-h-64 overflow-auto">
                <div className="grid grid-cols-5 gap-2">
                  {layer.biases.slice(0, 20).map((bias, i) => (
                    <div key={i} className="space-y-1">
                      <Label className="text-xs">b{i}</Label>
                      <Input
                        type="number"
                        step="0.001"
                        value={bias.toFixed(3)}
                        onChange={(e) => updateBias(i, parseFloat(e.target.value) || 0)}
                        className="text-xs h-8"
                      />
                    </div>
                  ))}
                </div>
                {layer.biases.length > 20 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Showing first 20 biases. Total: {layer.biases.length}
                  </p>
                )}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};