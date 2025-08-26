import { useState } from "react";
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
  const [selectedLayer, setSelectedLayer] = useState<LayerConfig | null>(null);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [showInspector, setShowInspector] = useState(true);
  const [showMetrics, setShowMetrics] = useState(true);

  const addLayer = (layerType: LayerConfig['type']) => {
    const newLayer: LayerConfig = {
      id: `${layerType}-${Date.now()}`,
      type: layerType,
      name: `${layerType.charAt(0).toUpperCase() + layerType.slice(1)} Layer`,
      position: { x: 200 + layers.length * 150, y: 100 },
      params: getDefaultParams(layerType),
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
      default:
        return {};
    }
  };

  return (
    <div className="h-screen bg-background flex flex-col">
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
          
          {/* View mode toggle overlay */}
          <div className="absolute top-4 right-4 flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowInspector(!showInspector)}
              className={`p-2 rounded-lg transition-colors ${
                showInspector 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-card/50 border border-border/50'
              }`}
            >
              {showInspector ? <EyeOff className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMetrics(!showMetrics)}
              className={`p-2 rounded-lg transition-colors ${
                showMetrics 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-card/50 border border-border/50'
              }`}
            >
              {showMetrics ? <EyeOff className="w-4 h-4" /> : <BarChart3 className="w-4 h-4" />}
            </motion.button>
          </div>
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