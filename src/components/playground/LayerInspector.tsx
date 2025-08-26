import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayerConfig } from "@/types/neural-network";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Trash2, Settings, Eye, BarChart3 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LayerInspectorProps {
  selectedLayer: LayerConfig | null;
  onLayerUpdate: (layer: LayerConfig) => void;
  onLayerDelete: (layerId: string) => void;
}

export const LayerInspector = ({ 
  selectedLayer, 
  onLayerUpdate, 
  onLayerDelete 
}: LayerInspectorProps) => {
  const [localLayer, setLocalLayer] = useState<LayerConfig | null>(selectedLayer);

  const updateParam = (key: string, value: any) => {
    if (!localLayer) return;
    
    const updatedLayer = {
      ...localLayer,
      params: {
        ...localLayer.params,
        [key]: value
      }
    };
    
    setLocalLayer(updatedLayer);
    onLayerUpdate(updatedLayer);
  };

  const updateName = (name: string) => {
    if (!localLayer) return;
    
    const updatedLayer = { ...localLayer, name };
    setLocalLayer(updatedLayer);
    onLayerUpdate(updatedLayer);
  };

  if (!selectedLayer) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <Settings className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">No Layer Selected</h3>
        <p className="text-sm text-muted-foreground">
          Click on a layer in the canvas to inspect and edit its properties.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold gradient-text">Layer Inspector</h2>
          {selectedLayer.type !== 'input' && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onLayerDelete(selectedLayer.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        {/* Layer Name */}
        <div className="space-y-2">
          <Label htmlFor="layer-name">Layer Name</Label>
          <Input
            id="layer-name"
            value={localLayer?.name || selectedLayer.name}
            onChange={(e) => updateName(e.target.value)}
            className="bg-background/50"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="parameters" className="w-full">
          <TabsList className="grid w-full grid-cols-3 m-4 mb-0">
            <TabsTrigger value="parameters">
              <Settings className="w-4 h-4 mr-2" />
              Parameters
            </TabsTrigger>
            <TabsTrigger value="weights">
              <Eye className="w-4 h-4 mr-2" />
              Weights
            </TabsTrigger>
            <TabsTrigger value="stats">
              <BarChart3 className="w-4 h-4 mr-2" />
              Stats
            </TabsTrigger>
          </TabsList>

          <TabsContent value="parameters" className="p-4 space-y-4">
            <LayerParameters layer={selectedLayer} onUpdateParam={updateParam} />
          </TabsContent>

          <TabsContent value="weights" className="p-4">
            <WeightsVisualization layer={selectedLayer} />
          </TabsContent>

          <TabsContent value="stats" className="p-4">
            <LayerStatistics layer={selectedLayer} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const LayerParameters = ({ 
  layer, 
  onUpdateParam 
}: { 
  layer: LayerConfig; 
  onUpdateParam: (key: string, value: any) => void; 
}) => {
  switch (layer.type) {
    case 'dense':
      return (
        <div className="space-y-4">
          <div>
            <Label>Units</Label>
            <Input
              type="number"
              value={layer.params.units || 128}
              onChange={(e) => onUpdateParam('units', parseInt(e.target.value))}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label>Activation</Label>
            <Select
              value={layer.params.activation || 'relu'}
              onValueChange={(value) => onUpdateParam('activation', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relu">ReLU</SelectItem>
                <SelectItem value="sigmoid">Sigmoid</SelectItem>
                <SelectItem value="tanh">Tanh</SelectItem>
                <SelectItem value="linear">Linear</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Dropout Rate: {layer.params.dropout || 0}</Label>
            <Slider
              value={[layer.params.dropout || 0]}
              onValueChange={([value]) => onUpdateParam('dropout', value)}
              max={0.5}
              step={0.01}
              className="mt-2"
            />
          </div>
        </div>
      );
      
    case 'conv2d':
      return (
        <div className="space-y-4">
          <div>
            <Label>Filters</Label>
            <Input
              type="number"
              value={layer.params.filters || 32}
              onChange={(e) => onUpdateParam('filters', parseInt(e.target.value))}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label>Kernel Size</Label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <Input
                type="number"
                value={layer.params.kernel_size?.[0] || 3}
                onChange={(e) => onUpdateParam('kernel_size', [parseInt(e.target.value), layer.params.kernel_size?.[1] || 3])}
                placeholder="Height"
              />
              <Input
                type="number"
                value={layer.params.kernel_size?.[1] || 3}
                onChange={(e) => onUpdateParam('kernel_size', [layer.params.kernel_size?.[0] || 3, parseInt(e.target.value)])}
                placeholder="Width"
              />
            </div>
          </div>
          
          <div>
            <Label>Padding</Label>
            <Select
              value={layer.params.padding || 'valid'}
              onValueChange={(value) => onUpdateParam('padding', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="valid">Valid</SelectItem>
                <SelectItem value="same">Same</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
      
    case 'input':
      return (
        <div className="space-y-4">
          <div>
            <Label>Input Shape</Label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              <Input
                type="number"
                value={layer.params.input_shape?.[0] || 28}
                onChange={(e) => {
                  const shape = [...(layer.params.input_shape || [28, 28, 1])];
                  shape[0] = parseInt(e.target.value);
                  onUpdateParam('input_shape', shape);
                }}
                placeholder="Height"
              />
              <Input
                type="number"
                value={layer.params.input_shape?.[1] || 28}
                onChange={(e) => {
                  const shape = [...(layer.params.input_shape || [28, 28, 1])];
                  shape[1] = parseInt(e.target.value);
                  onUpdateParam('input_shape', shape);
                }}
                placeholder="Width"
              />
              <Input
                type="number"
                value={layer.params.input_shape?.[2] || 1}
                onChange={(e) => {
                  const shape = [...(layer.params.input_shape || [28, 28, 1])];
                  shape[2] = parseInt(e.target.value);
                  onUpdateParam('input_shape', shape);
                }}
                placeholder="Channels"
              />
            </div>
          </div>
        </div>
      );
      
    default:
      return (
        <div className="text-center text-muted-foreground">
          <p>No parameters to configure for this layer type.</p>
        </div>
      );
  }
};

const WeightsVisualization = ({ layer }: { layer: LayerConfig }) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="w-full h-32 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg flex items-center justify-center mb-4">
          <p className="text-muted-foreground">Weights visualization coming soon</p>
        </div>
        <p className="text-sm text-muted-foreground">
          Interactive weight matrix and bias visualization will be displayed here.
        </p>
      </div>
    </div>
  );
};

const LayerStatistics = ({ layer }: { layer: LayerConfig }) => {
  const getLayerStats = (layer: LayerConfig) => {
    switch (layer.type) {
      case 'dense':
        const units = layer.params.units || 0;
        return {
          parameters: units * 128 + units, // Simplified calculation
          outputs: units,
          flops: units * 128 * 2
        };
      case 'conv2d':
        const filters = layer.params.filters || 0;
        const kernelSize = layer.params.kernel_size || [3, 3];
        return {
          parameters: filters * kernelSize[0] * kernelSize[1] * 3 + filters,
          outputs: filters,
          flops: filters * kernelSize[0] * kernelSize[1] * 28 * 28
        };
      default:
        return { parameters: 0, outputs: 0, flops: 0 };
    }
  };

  const stats = getLayerStats(layer);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="neural-card p-4">
          <div className="text-2xl font-bold text-primary">{stats.parameters.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Parameters</div>
        </div>
        
        <div className="neural-card p-4">
          <div className="text-2xl font-bold text-secondary">{stats.outputs.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Output Shape</div>
        </div>
        
        <div className="neural-card p-4">
          <div className="text-2xl font-bold text-accent">{stats.flops.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">FLOPs</div>
        </div>
      </div>
    </div>
  );
};