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
    // Input Layer
    {
      type: 'input' as const,
      name: 'Input Layer',
      icon: Circle,
      color: 'from-primary to-primary-glow',
      description: 'Define input dimensions',
      category: 'input'
    },
    
    // Core Layers (Trainable)
    {
      type: 'dense' as const,
      name: 'Dense (FC)',
      icon: Brain,
      color: 'from-accent to-accent-glow',
      description: 'Fully connected layer',
      category: 'core'
    },
    {
      type: 'conv1d' as const,
      name: 'Conv1D',
      icon: Grid3X3,
      color: 'from-secondary to-secondary-glow',
      description: '1D convolutional layer',
      category: 'core'
    },
    {
      type: 'conv2d' as const,
      name: 'Conv2D',
      icon: Grid3X3,
      color: 'from-secondary to-secondary-glow',
      description: '2D convolutional layer',
      category: 'core'
    },
    {
      type: 'conv3d' as const,
      name: 'Conv3D',
      icon: Grid3X3,
      color: 'from-secondary to-accent',
      description: '3D convolutional layer',
      category: 'core'
    },
    {
      type: 'embedding' as const,
      name: 'Embedding',
      icon: Layers,
      color: 'from-primary to-accent',
      description: 'Word/token embeddings',
      category: 'core'
    },
    {
      type: 'attention' as const,
      name: 'Attention',
      icon: Brain,
      color: 'from-accent to-primary',
      description: 'Self-attention mechanism',
      category: 'core'
    },
    {
      type: 'multihead_attention' as const,
      name: 'Multi-Head Attention',
      icon: Brain,
      color: 'from-primary to-secondary',
      description: 'Multi-head attention',
      category: 'core'
    },
    {
      type: 'transformer_encoder' as const,
      name: 'Transformer Encoder',
      icon: Layers,
      color: 'from-secondary to-primary',
      description: 'Transformer encoder block',
      category: 'core'
    },
    {
      type: 'rnn' as const,
      name: 'RNN',
      icon: ArrowLeftRight,
      color: 'from-accent to-secondary',
      description: 'Vanilla recurrent layer',
      category: 'core'
    },
    {
      type: 'lstm' as const,
      name: 'LSTM',
      icon: ArrowLeftRight,
      color: 'from-secondary to-accent',
      description: 'Long Short-Term Memory',
      category: 'core'
    },
    {
      type: 'gru' as const,
      name: 'GRU',
      icon: GitBranch,
      color: 'from-primary to-secondary',
      description: 'Gated Recurrent Unit',
      category: 'core'
    },

    // Operators (Stateless)
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
      type: 'globalmax' as const,
      name: 'GlobalMaxPool',
      icon: Minimize,
      color: 'from-secondary to-primary',
      description: 'Global max pooling',
      category: 'operators'
    },
    {
      type: 'globalavg' as const,
      name: 'GlobalAvgPool',
      icon: Maximize,
      color: 'from-primary to-secondary',
      description: 'Global average pooling',
      category: 'operators'
    },
    {
      type: 'softmax' as const,
      name: 'Softmax',
      icon: Circle,
      color: 'from-accent to-primary',
      description: 'Softmax normalization',
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
      type: 'layernorm' as const,
      name: 'LayerNorm',
      icon: MoreHorizontal,
      color: 'from-secondary to-accent',
      description: 'Layer normalization',
      category: 'operators'
    },
    {
      type: 'dropout' as const,
      name: 'Dropout',
      icon: Circle,
      color: 'from-accent to-secondary',
      description: 'Dropout regularization',
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
      type: 'reshape' as const,
      name: 'Reshape',
      icon: Layers,
      color: 'from-primary to-accent',
      description: 'Reshape tensor dimensions',
      category: 'operators'
    },

    // Activations
    {
      type: 'relu' as const,
      name: 'ReLU',
      icon: Circle,
      color: 'from-primary to-accent',
      description: 'Rectified Linear Unit',
      category: 'activations'
    },
    {
      type: 'leaky_relu' as const,
      name: 'Leaky ReLU',
      icon: Circle,
      color: 'from-accent to-secondary',
      description: 'Leaky ReLU activation',
      category: 'activations'
    },
    {
      type: 'gelu' as const,
      name: 'GELU',
      icon: Circle,
      color: 'from-secondary to-primary',
      description: 'Gaussian Error Linear Unit',
      category: 'activations'
    },
    {
      type: 'swish' as const,
      name: 'Swish',
      icon: Circle,
      color: 'from-primary to-secondary',
      description: 'Swish activation',
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
      type: 'elu' as const,
      name: 'ELU',
      icon: Circle,
      color: 'from-secondary to-accent',
      description: 'Exponential Linear Unit',
      category: 'activations'
    },
    {
      type: 'mish' as const,
      name: 'Mish',
      icon: Circle,
      color: 'from-primary to-accent',
      description: 'Mish activation',
      category: 'activations'
    },

    // Sequential (Memory/Temporal)
    {
      type: 'bidirectional_lstm' as const,
      name: 'Bidirectional LSTM',
      icon: ArrowLeftRight,
      color: 'from-accent to-primary',
      description: 'Bidirectional LSTM',
      category: 'sequential'
    },
    {
      type: 'bidirectional_gru' as const,
      name: 'Bidirectional GRU',
      icon: GitBranch,
      color: 'from-secondary to-accent',
      description: 'Bidirectional GRU',
      category: 'sequential'
    },
    {
      type: 'attention_seq' as const,
      name: 'Sequential Attention',
      icon: Brain,
      color: 'from-primary to-secondary',
      description: 'Attention over sequences',
      category: 'sequential'
    },
    {
      type: 'transformer_seq' as const,
      name: 'Transformer',
      icon: Layers,
      color: 'from-accent to-secondary',
      description: 'Transformer for sequences',
      category: 'sequential'
    },

    // Structural
    {
      type: 'residual' as const,
      name: 'Residual Connection',
      icon: GitBranch,
      color: 'from-primary to-accent',
      description: 'Skip connection (ResNet)',
      category: 'structural'
    },
    {
      type: 'highway' as const,
      name: 'Highway Network',
      icon: ArrowLeftRight,
      color: 'from-secondary to-primary',
      description: 'Highway connection',
      category: 'structural'
    },
    {
      type: 'gcn' as const,
      name: 'Graph Conv (GCN)',
      icon: Grid3X3,
      color: 'from-accent to-secondary',
      description: 'Graph Convolutional Network',
      category: 'structural'
    },

    // Output Layers
    {
      type: 'softmax_output' as const,
      name: 'Softmax Output',
      icon: Circle,
      color: 'from-primary to-accent',
      description: 'Multiclass classification output',
      category: 'output'
    },
    {
      type: 'sigmoid_output' as const,
      name: 'Sigmoid Output',
      icon: Circle,
      color: 'from-accent to-secondary',
      description: 'Binary classification output',
      category: 'output'
    },
    {
      type: 'linear_output' as const,
      name: 'Linear Output',
      icon: Circle,
      color: 'from-secondary to-primary',
      description: 'Regression output',
      category: 'output'
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
          <TabsList className="grid w-full grid-cols-7 mb-4 h-12">
            <TabsTrigger value="all" className="text-xs px-1">All</TabsTrigger>
            <TabsTrigger value="core" className="text-xs px-1">Core</TabsTrigger>
            <TabsTrigger value="operators" className="text-xs px-1">Ops</TabsTrigger>
            <TabsTrigger value="activations" className="text-xs px-1">Act</TabsTrigger>
            <TabsTrigger value="sequential" className="text-xs px-1">Seq</TabsTrigger>
            <TabsTrigger value="structural" className="text-xs px-1">Struct</TabsTrigger>
            <TabsTrigger value="output" className="text-xs px-1">Out</TabsTrigger>
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
          
          <TabsContent value="structural" className="mt-0">
            {renderLayerList(getLayersByCategory('structural'))}
          </TabsContent>
          
          <TabsContent value="output" className="mt-0">
            {renderLayerList(getLayersByCategory('output'))}
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