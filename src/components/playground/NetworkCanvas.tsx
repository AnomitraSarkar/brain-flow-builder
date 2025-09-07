import { useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Node,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { LayerConfig } from "@/types/neural-network";
import { NetworkNode } from "./NetworkNode";
import { Network3D } from "./Network3D";
import { EnsembleView } from "./EnsembleView";

interface NetworkCanvasProps {
  layers: LayerConfig[];
  onLayersChange: (layers: LayerConfig[]) => void;
  selectedLayer: LayerConfig | null;
  onLayerSelect: (layer: LayerConfig | null) => void;
  onLayerDelete: (layerId: string) => void;
  viewMode: '2d' | '3d' | 'ensemble';
}

const nodeTypes = {
  networkLayer: NetworkNode,
};

export const NetworkCanvas = ({
  layers,
  onLayersChange,
  selectedLayer,
  onLayerSelect,
  onLayerDelete,
  viewMode
}: NetworkCanvasProps) => {
  
  // Convert layers to nodes
  const initialNodes: Node[] = layers.map(layer => ({
    id: layer.id,
    type: 'networkLayer',
    position: layer.position,
    data: {
      layer,
      isSelected: selectedLayer?.id === layer.id,
      onSelect: () => onLayerSelect(layer),
      onDelete: () => onLayerDelete(layer.id),
    },
  }));

  // Create edges based on layer connections
  const initialEdges: Edge[] = layers.flatMap(layer =>
    layer.connections?.map(targetId => ({
      id: `${layer.id}-${targetId}`,
      source: layer.id,
      target: targetId,
      type: 'smoothstep',
      style: { stroke: 'hsl(var(--primary))' },
    })) || []
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync nodes and edges with layers
  useEffect(() => {
    const updatedNodes: Node[] = layers.map(layer => ({
      id: layer.id,
      type: 'networkLayer',
      position: layer.position,
      data: {
        layer,
        isSelected: selectedLayer?.id === layer.id,
        onSelect: () => onLayerSelect(layer),
        onDelete: () => onLayerDelete(layer.id),
      },
    }));

    const updatedEdges: Edge[] = layers.flatMap(layer =>
      layer.connections?.map(targetId => ({
        id: `${layer.id}-${targetId}`,
        source: layer.id,
        target: targetId,
        type: 'smoothstep',
        style: { stroke: 'hsl(var(--primary))' },
      })) || []
    );

    setNodes(updatedNodes);
    setEdges(updatedEdges);
  }, [layers, selectedLayer, onLayerSelect, onLayerDelete, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
      
      // Update layer connections
      if (params.source && params.target) {
        const updatedLayers = layers.map(layer => {
          if (layer.id === params.source) {
            return {
              ...layer,
              connections: [...(layer.connections || []), params.target!]
            };
          }
          return layer;
        });
        onLayersChange(updatedLayers);
      }
    },
    [layers, onLayersChange, setEdges]
  );

  const onNodeDragStop = useCallback(
    (event: any, node: Node) => {
      const updatedLayers = layers.map(layer => {
        if (layer.id === node.id) {
          return {
            ...layer,
            position: node.position
          };
        }
        return layer;
      });
      onLayersChange(updatedLayers);
    },
    [layers, onLayersChange]
  );

  if (viewMode === '3d') {
    return (
      <div className="w-full h-full">
        <Network3D 
          layers={layers}
          selectedLayer={selectedLayer}
          onLayerSelect={onLayerSelect}
        />
      </div>
    );
  }

  if (viewMode === 'ensemble') {
    return (
      <div className="w-full h-full">
        <EnsembleView 
          layers={layers}
          selectedLayer={selectedLayer}
          onLayerSelect={onLayerSelect}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full neural-pattern">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        fitView
        className="bg-background"
        proOptions={{ hideAttribution: true }}
      >
        <Background 
          color="hsl(var(--border))" 
          gap={20} 
          size={1}
        />
        <Controls 
          className="bg-card/90 border border-primary/20 rounded-xl shadow-lg backdrop-blur-sm"
        />
        <MiniMap 
          className="bg-card/90 border border-primary/20 rounded-xl shadow-lg backdrop-blur-sm"
          nodeColor={(node) => {
            const layer = layers.find(l => l.id === node.id);
            switch (layer?.type) {
              case 'input': return 'hsl(var(--primary))';
              case 'dense': return 'hsl(var(--accent))';
              case 'conv2d': return 'hsl(var(--secondary))';
              default: return 'hsl(var(--muted))';
            }
          }}
        />
      </ReactFlow>
    </div>
  );
};