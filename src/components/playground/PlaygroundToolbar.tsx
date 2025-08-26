import { useState } from "react";
import { motion } from "framer-motion";
import { LayerConfig } from "@/types/neural-network";
import { Button } from "@/components/ui/button";
import { 
  Save, 
  Upload, 
  Download, 
  Play, 
  Pause, 
  RotateCcw,
  Eye,
  Layers3,
  Zap
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PlaygroundToolbarProps {
  viewMode: '2d' | '3d';
  onViewModeChange: (mode: '2d' | '3d') => void;
  layers: LayerConfig[];
  onLayersChange: (layers: LayerConfig[]) => void;
}

export const PlaygroundToolbar = ({
  viewMode,
  onViewModeChange,
  layers,
  onLayersChange
}: PlaygroundToolbarProps) => {
  const [isTraining, setIsTraining] = useState(false);

  const exportNetwork = () => {
    const networkData = {
      id: Date.now().toString(),
      name: "Neural Network",
      layers,
      created_at: new Date().toISOString(),
      modified_at: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(networkData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'neural-network.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importNetwork = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const networkData = JSON.parse(e.target?.result as string);
            onLayersChange(networkData.layers || []);
          } catch (error) {
            console.error('Failed to import network:', error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const toggleTraining = () => {
    setIsTraining(!isTraining);
  };

  const resetNetwork = () => {
    onLayersChange([{
      id: 'input-1',
      type: 'input',
      name: 'Input Layer',
      position: { x: 100, y: 100 },
      params: { input_shape: [28, 28, 1] },
      connections: []
    }]);
  };

  return (
    <div className="h-16 bg-card/50 border-b border-border/50 backdrop-blur-lg px-4 flex items-center justify-between">
      {/* Left Section - Mode Toggle */}
      <div className="flex items-center space-x-4">
        <div className="flex bg-muted/30 rounded-lg p-1">
          <Button
            variant={viewMode === '2d' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('2d')}
            className="h-8"
          >
            <Layers3 className="w-4 h-4 mr-2" />
            2D
          </Button>
          <Button
            variant={viewMode === '3d' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('3d')}
            className="h-8"
          >
            <Eye className="w-4 h-4 mr-2" />
            3D
          </Button>
        </div>
      </div>

      {/* Center Section - Actions */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleTraining}
          className={isTraining ? 'bg-destructive text-destructive-foreground' : ''}
        >
          {isTraining ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
          {isTraining ? 'Stop' : 'Train'}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={resetNetwork}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      {/* Right Section - File Operations */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={importNetwork}
        >
          <Upload className="w-4 h-4 mr-2" />
          Import
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={exportNetwork}
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        
        <Button
          variant="default"
          size="sm"
          className="neural-button-hero"
        >
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>
    </div>
  );
};