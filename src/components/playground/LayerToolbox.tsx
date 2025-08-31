import { motion } from "framer-motion";
import { useState } from "react";
import { 
  Brain, 
  Layers, 
  Grid3X3, 
  Minimize, 
  Maximize, 
  MoreHorizontal,
  Circle,
  ArrowLeftRight,
  GitBranch
} from "lucide-react";
import { LayerConfig } from "@/types/neural-network";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LayerToolboxProps {
  onAddLayer: (type: LayerConfig['type']) => void;
}

export const LayerToolbox = ({ onAddLayer }: LayerToolboxProps) => {
  const allLayers = [
    {
      type: 'input' as const,
      name: 'Input Layer',
      icon: Circle,
      color: 'from-primary to-primary-glow',
      description: 'Define input dimensions',
      category: 'core'
    },
    {
      type: 'dense' as const,
      name: 'Dense (FC)',
      icon: Brain,
      color: 'from-accent to-accent-glow',
      description: 'Fully connected layer',
      category: 'core'
    },
    {
      type: 'conv2d' as const,
      name: 'Conv2D',
      icon: Grid3X3,
      color: 'from-secondary to-secondary-glow',
      description: 'Convolutional layer',
      category: 'core'
    },
    {
      type: 'maxpool' as const,
      name: 'MaxPool',
      icon: Minimize,
      color: 'from-primary to-accent',
      description: 'Max pooling layer',
      category: 'operators'
    },
    {
      type: 'avgpool' as const,
      name: 'AvgPool',
      icon: Maximize,
      color: 'from-accent to-secondary',
      description: 'Average pooling layer',
      category: 'operators'
    },
    {
      type: 'flatten' as const,
      name: 'Flatten',
      icon: Layers,
      color: 'from-secondary to-primary',
      description: 'Flatten multi-dimensional input',
      category: 'operators'
    },
    {
      type: 'batchnorm' as const,
      name: 'BatchNorm',
      icon: MoreHorizontal,
      color: 'from-primary to-secondary',
      description: 'Batch normalization',
      category: 'operators'
    },
    {
      type: 'softmax' as const,
      name: 'Softmax',
      icon: Circle,
      color: 'from-accent to-primary',
      description: 'Softmax activation',
      category: 'operators'
    },
    {
      type: 'relu' as const,
      name: 'ReLU',
      icon: Circle,
      color: 'from-primary to-accent',
      description: 'Rectified Linear Unit',
      category: 'activations'
    },
    {
      type: 'tanh' as const,
      name: 'Tanh',
      icon: Circle,
      color: 'from-primary to-secondary',
      description: 'Hyperbolic tangent activation',
      category: 'activations'
    },
    {
      type: 'sigmoid' as const,
      name: 'Sigmoid',
      icon: Circle,
      color: 'from-accent to-secondary',
      description: 'Sigmoid activation',
      category: 'activations'
    },
    {
      type: 'lstm' as const,
      name: 'LSTM',
      icon: ArrowLeftRight,
      color: 'from-secondary to-accent',
      description: 'Long Short-Term Memory',
      category: 'sequential'
    },
    {
      type: 'gru' as const,
      name: 'GRU',
      icon: GitBranch,
      color: 'from-primary to-secondary',
      description: 'Gated Recurrent Unit',
      category: 'sequential'
    }
  ];

  const getLayersByCategory = (category: string) => {
    if (category === 'all') return allLayers;
    return allLayers.filter(layer => layer.category === category);
  };

  const renderLayerList = (layers: typeof allLayers) => (
    <div className="space-y-3">
      {layers.map((layer, index) => (
        <motion.div
          key={layer.type}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            variant="outline"
            className="w-full h-auto p-4 justify-start bg-card/30 border-border/50 hover:bg-card/50"
            onClick={() => onAddLayer(layer.type)}
          >
            <div className="flex items-center space-x-3 w-full">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${layer.color} flex items-center justify-center flex-shrink-0`}>
                <layer.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-foreground">{layer.name}</div>
                <div className="text-xs text-muted-foreground">{layer.description}</div>
              </div>
            </div>
          </Button>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-border/50">
        <h2 className="text-lg font-semibold gradient-text mb-2">Layer Toolbox</h2>
        <p className="text-sm text-muted-foreground">
          Click to add layers to your network
        </p>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-4">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="core" className="text-xs">Core</TabsTrigger>
            <TabsTrigger value="operators" className="text-xs">Ops</TabsTrigger>
            <TabsTrigger value="activations" className="text-xs">Act</TabsTrigger>
            <TabsTrigger value="sequential" className="text-xs">Seq</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            {renderLayerList(getLayersByCategory('all'))}
          </TabsContent>
          
          <TabsContent value="core" className="mt-0">
            {renderLayerList(getLayersByCategory('core'))}
          </TabsContent>
          
          <TabsContent value="operators" className="mt-0">
            {renderLayerList(getLayersByCategory('operators'))}
          </TabsContent>
          
          <TabsContent value="activations" className="mt-0">
            {renderLayerList(getLayersByCategory('activations'))}
          </TabsContent>
          
          <TabsContent value="sequential" className="mt-0">
            {renderLayerList(getLayersByCategory('sequential'))}
          </TabsContent>
        </Tabs>
        
        {/* Quick Add Section */}
        <div className="mt-8 p-4 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20">
          <h3 className="text-sm font-medium mb-3 text-primary">Quick Architectures</h3>
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-xs"
              onClick={() => {
                onAddLayer('dense');
                onAddLayer('dense');
                onAddLayer('softmax');
              }}
            >
              Simple MLP
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-xs"
              onClick={() => {
                onAddLayer('conv2d');
                onAddLayer('maxpool');
                onAddLayer('conv2d');
                onAddLayer('maxpool');
                onAddLayer('flatten');
                onAddLayer('dense');
                onAddLayer('softmax');
              }}
            >
              Basic CNN
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-xs"
              onClick={() => {
                onAddLayer('lstm');
                onAddLayer('dense');
                onAddLayer('softmax');
              }}
            >
              Simple RNN
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};