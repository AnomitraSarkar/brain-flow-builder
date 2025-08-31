import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LayerConfig, TrainingMetrics } from "@/types/neural-network";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Zap, Eye } from "lucide-react";
import * as d3 from "d3";
import { WeightHistogramMini } from "@/components/playground/charts/WeightHistogramMini";
import { ActivationFunctionMini } from "@/components/playground/charts/ActivationFunctionMini";

interface MetricsPanelProps {
  layers: LayerConfig[];
}

export const MetricsPanel = ({ layers }: MetricsPanelProps) => {
  const [metrics, setMetrics] = useState<TrainingMetrics[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<'loss' | 'accuracy'>('loss');

  // Simulate training metrics
  useEffect(() => {
    const generateMetrics = () => {
      const newMetrics: TrainingMetrics[] = [];
      for (let i = 0; i < 50; i++) {
        newMetrics.push({
          epoch: i + 1,
          loss: Math.max(0.1, 2 - i * 0.03 + Math.random() * 0.1),
          accuracy: Math.min(0.95, i * 0.018 + Math.random() * 0.02),
          val_loss: Math.max(0.15, 2.2 - i * 0.035 + Math.random() * 0.15),
          val_accuracy: Math.min(0.92, i * 0.015 + Math.random() * 0.03)
        });
      }
      setMetrics(newMetrics);
    };

    generateMetrics();
  }, [layers]);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border/50">
        <h2 className="text-lg font-semibold gradient-text mb-2">Network Metrics</h2>
        <p className="text-sm text-muted-foreground">
          Training progress and network statistics
        </p>
      </div>
      
      <div className="flex-1">
        <Tabs defaultValue="training" className="w-full h-full">
          <TabsList className="grid w-full grid-cols-4 m-4 mb-0">
            <TabsTrigger value="training">
              <TrendingUp className="w-4 h-4 mr-2" />
              Training
            </TabsTrigger>
            <TabsTrigger value="weights">
              <BarChart3 className="w-4 h-4 mr-2" />
              Weights
            </TabsTrigger>
            <TabsTrigger value="activations">
              <Zap className="w-4 h-4 mr-2" />
              Activations
            </TabsTrigger>
            <TabsTrigger value="architecture">
              <Eye className="w-4 h-4 mr-2" />
              Architecture
            </TabsTrigger>
          </TabsList>

          <TabsContent value="training" className="p-4 h-full">
            <TrainingChart metrics={metrics} selectedMetric={selectedMetric} layers={layers} />
          </TabsContent>

          <TabsContent value="weights" className="p-4">
            <WeightsChart layers={layers} />
          </TabsContent>

          <TabsContent value="activations" className="p-4">
            <ActivationsChart layers={layers} />
          </TabsContent>

          <TabsContent value="architecture" className="p-4">
            <ArchitectureStats layers={layers} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const TrainingChart = ({ 
  metrics, 
  selectedMetric,
  layers 
}: { 
  metrics: TrainingMetrics[]; 
  selectedMetric: 'loss' | 'accuracy';
  layers: LayerConfig[];
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        <div className="neural-card p-4 text-center">
          <div className="text-2xl font-bold text-primary">
            {metrics.length > 0 ? metrics[metrics.length - 1].epoch : 0}
          </div>
          <div className="text-sm text-muted-foreground">Epochs</div>
        </div>
        
        <div className="neural-card p-4 text-center">
          <div className="text-2xl font-bold text-secondary">
            {metrics.length > 0 ? metrics[metrics.length - 1].loss.toFixed(3) : '0.000'}
          </div>
          <div className="text-sm text-muted-foreground">Loss</div>
        </div>
        
        <div className="neural-card p-4 text-center">
          <div className="text-2xl font-bold text-accent">
            {metrics.length > 0 ? (metrics[metrics.length - 1].accuracy * 100).toFixed(1) : '0.0'}%
          </div>
          <div className="text-sm text-muted-foreground">Accuracy</div>
        </div>
        
        <div className="neural-card p-4 text-center">
          <div className="text-2xl font-bold text-primary">
            {layers.reduce((sum, layer) => {
              if (layer.type === 'dense') return sum + (layer.params.units || 0);
              if (layer.type === 'conv2d') return sum + (layer.params.filters || 0);
              return sum;
            }, 0).toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">Parameters</div>
        </div>
      </div>
      
      <div className="neural-card p-4 h-32 bg-gradient-to-r from-primary/5 to-accent/5 flex items-center justify-center">
        <p className="text-muted-foreground">Training curve visualization (D3.js chart)</p>
      </div>
    </div>
  );
};

const WeightsChart = ({ layers }: { layers: LayerConfig[] }) => {
  const isActivationLayer = (layer: LayerConfig) => 
    ['relu', 'tanh', 'sigmoid'].includes(layer.type);

  return (
    <div className="space-y-4">
      <div className="neural-card p-4">
        <h3 className="font-medium mb-4">Weight Distribution by Layer</h3>
        <div className="grid grid-cols-2 gap-4">
          {layers
            .filter((l) => {
              // Show dense/conv2d layers with weights OR activation layers
              return ((l.type === 'dense' || l.type === 'conv2d') && l.weights) || 
                     isActivationLayer(l);
            })
            .map((layer) => (
              <div key={layer.id} className="bg-muted/20 rounded-lg p-3">
                <div className="text-sm font-medium mb-2">{layer.name}</div>
                {isActivationLayer(layer) ? (
                  <ActivationFunctionMini 
                    kind={layer.type as 'relu' | 'tanh' | 'sigmoid'} 
                    width={260} 
                    height={96} 
                  />
                ) : (
                  <WeightHistogramMini weights={layer.weights} width={260} height={96} />
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

const ActivationsChart = ({ layers }: { layers: LayerConfig[] }) => {
  return (
    <div className="space-y-4">
      <div className="neural-card p-4">
        <h3 className="font-medium mb-4">Layer Activations</h3>
        <div className="space-y-3">
          {layers.map((layer, index) => (
            <div key={layer.id} className="flex items-center space-x-3">
              <div className="w-20 text-sm font-medium truncate">{layer.name}</div>
              <div className="flex-1 h-4 bg-muted/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.random() * 100}%` }}
                  transition={{ delay: index * 0.1 }}
                  className="h-full bg-gradient-to-r from-primary to-accent"
                />
              </div>
              <div className="text-sm text-muted-foreground w-12">
                {(Math.random() * 100).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ArchitectureStats = ({ layers }: { layers: LayerConfig[] }) => {
  const totalParams = layers.reduce((sum, layer) => {
    switch (layer.type) {
      case 'dense':
        return sum + (layer.params.units || 0) * 128 + (layer.params.units || 0);
      case 'conv2d':
        const filters = layer.params.filters || 0;
        const kernelSize = layer.params.kernel_size || [3, 3];
        return sum + filters * kernelSize[0] * kernelSize[1] * 3 + filters;
      default:
        return sum;
    }
  }, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="neural-card p-4 text-center">
          <div className="text-3xl font-bold gradient-text mb-2">{layers.length}</div>
          <div className="text-sm text-muted-foreground">Total Layers</div>
        </div>
        
        <div className="neural-card p-4 text-center">
          <div className="text-3xl font-bold gradient-text mb-2">{totalParams.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Parameters</div>
        </div>
      </div>
      
      <div className="neural-card p-4">
        <h3 className="font-medium mb-4">Layer Types</h3>
        <div className="space-y-2">
          {['dense', 'conv2d', 'maxpool', 'avgpool', 'flatten', 'input'].map(type => {
            const count = layers.filter(l => l.type === type).length;
            if (count === 0) return null;
            
            return (
              <div key={type} className="flex justify-between items-center">
                <span className="text-sm capitalize">{type}</span>
                <span className="text-sm font-medium text-primary">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};