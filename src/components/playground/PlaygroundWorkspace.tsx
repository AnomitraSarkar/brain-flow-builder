import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LayerToolbox } from "./LayerToolbox";
import { NetworkCanvas } from "./NetworkCanvas";
import { LayerInspector } from "./LayerInspector";
import { MetricsPanel } from "./MetricsPanel";
import { PlaygroundToolbar } from "./PlaygroundToolbar";
import { LayerConfig } from "@/types/neural-network";
import { Eye, EyeOff, BarChart3, Settings } from "lucide-react";

export const PlaygroundWorkspace = () => {
  const [layers, setLayers] = useState<LayerConfig[]>([
    {
      id: 'input-1',
      type: 'input',
      name: 'Input Layer',
      position: { x: 100, y: 100 },
      params: { input_shape: [28, 28, 1] },
      connections: []
    }
  ]);

  // Check for model to load from localStorage (from dashboard/explore)
  useEffect(() => {
    const loadModelData = localStorage.getItem('loadModel');
    if (loadModelData) {
      try {
        const loadedLayers = JSON.parse(loadModelData);
        setLayers(loadedLayers);
        localStorage.removeItem('loadModel'); // Clear after loading
      } catch (error) {
        console.error('Failed to load model:', error);
      }
    }
  }, []);
  const [selectedLayer, setSelectedLayer] = useState<LayerConfig | null>(null);
  const [viewMode, setViewMode] = useState<'2d' | '3d' | 'ensemble'>('2d');
  const [showInspector, setShowInspector] = useState(true);
  const [showMetrics, setShowMetrics] = useState(true);

  // Weight initialization functions
  const initializeWeights = (type: LayerConfig['type'], params: any): { weights?: number[][], biases?: number[] } => {
    switch (type) {
      case 'dense':
        const units = params.units || 128;
        const inputSize = 128; // Default input size
        const weights = Array.from({ length: inputSize }, () =>
          Array.from({ length: units }, () => (Math.random() - 0.5) * 0.1)
        );
        const biases = Array.from({ length: units }, () => (Math.random() - 0.5) * 0.01);
        return { weights, biases };
      
      case 'conv2d':
        const filters = params.filters || 32;
        const kernelSize = params.kernel_size || [3, 3];
        const channels = 3; // Default channels
        const weights2d = Array.from({ length: filters }, () =>
          Array.from({ length: kernelSize[0] * kernelSize[1] * channels }, () => (Math.random() - 0.5) * 0.1)
        );
        const biases2d = Array.from({ length: filters }, () => (Math.random() - 0.5) * 0.01);
        return { weights: weights2d, biases: biases2d };
      
      default:
        return {};
    }
  };

  const addLayer = (layerType: LayerConfig['type']) => {
    const params = getDefaultParams(layerType);
    const { weights, biases } = initializeWeights(layerType, params);
    
    const newLayer: LayerConfig = {
      id: `${layerType}-${Date.now()}`,
      type: layerType,
      name: `${layerType.charAt(0).toUpperCase() + layerType.slice(1)} Layer`,
      position: { x: 200 + layers.length * 150, y: 100 },
      params,
      weights,
      biases,
      connections: []
    };
    
    setLayers([...layers, newLayer]);
  };

  const updateLayer = (updatedLayer: LayerConfig) => {
    setLayers(layers.map(layer => 
      layer.id === updatedLayer.id ? updatedLayer : layer
    ));
    setSelectedLayer(updatedLayer);
  };

  const deleteLayer = (layerId: string) => {
    setLayers(layers.filter(layer => layer.id !== layerId));
    if (selectedLayer?.id === layerId) {
      setSelectedLayer(null);
    }
  };

  const getDefaultParams = (type: LayerConfig['type']) => {
    switch (type) {
      case 'dense':
        return { units: 128, activation: 'relu', dropout: 0 };
      case 'conv2d':
        return { filters: 32, kernel_size: [3, 3] as [number, number], strides: [1, 1] as [number, number], padding: 'valid' as const };
      case 'maxpool':
      case 'avgpool':
        return { pool_size: [2, 2] as [number, number], strides: [2, 2] as [number, number] };
      case 'lstm':
        return { hidden_size: 128, num_layers: 1, bidirectional: false, return_sequences: true };
      case 'gru':
        return { hidden_size: 128, num_layers: 1, bidirectional: false, return_sequences: true };
      case 'relu':
      case 'tanh':
      case 'sigmoid':
      case 'softmax':
        return { activation: type };
      default:
        return {};
    }
  };

  return (
    <div className="h-screen bg-background playground-grid flex flex-col">
      {/* Toolbar */}
      <PlaygroundToolbar 
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        layers={layers}
        onLayersChange={setLayers}
      />
      
      {/* Main workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Layer Toolbox */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className="w-80 bg-card/50 border-r border-border/50 backdrop-blur-lg"
        >
          <LayerToolbox onAddLayer={addLayer} />
        </motion.div>

        {/* Center Canvas */}
        <div className="flex-1 relative">
          <NetworkCanvas
            layers={layers}
            onLayersChange={setLayers}
            selectedLayer={selectedLayer}
            onLayerSelect={setSelectedLayer}
            onLayerDelete={deleteLayer}
            viewMode={viewMode}
          />
          
        </div>

        {/* Right Sidebar - Layer Inspector */}
        {showInspector && (
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            className="w-80 bg-card/50 border-l border-border/50 backdrop-blur-lg"
          >
            <LayerInspector
              selectedLayer={selectedLayer}
              onLayerUpdate={updateLayer}
              onLayerDelete={deleteLayer}
            />
          </motion.div>
        )}
      </div>

      {/* Bottom Panel - Metrics */}
      {showMetrics && (
        <motion.div
          initial={{ y: 200 }}
          animate={{ y: 0 }}
          exit={{ y: 200 }}
          className="h-64 bg-card/50 border-t border-border/50 backdrop-blur-lg"
        >
          <MetricsPanel layers={layers} />
        </motion.div>
      )}
    </div>
  );
};