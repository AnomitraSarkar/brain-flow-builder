import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Grid3X3, 
  Minimize, 
  Maximize, 
  Layers, 
  MoreHorizontal,
  Circle,
  Trash2,
  Settings
} from 'lucide-react';
import { LayerConfig } from '@/types/neural-network';
import { Button } from '@/components/ui/button';

interface NetworkNodeProps {
  data: {
    layer: LayerConfig;
    isSelected: boolean;
    onSelect: () => void;
    onDelete: () => void;
  };
}

const getLayerIcon = (type: LayerConfig['type']) => {
  switch (type) {
    case 'input': return Circle;
    case 'dense': return Brain;
    case 'conv2d': return Grid3X3;
    case 'maxpool': return Minimize;
    case 'avgpool': return Maximize;
    case 'flatten': return Layers;
    case 'batchnorm': return MoreHorizontal;
    case 'relu':
    case 'tanh':
    case 'sigmoid':
    case 'softmax':
      return Circle;
    default: return Circle;
  }
};

// Bias-to-color mapping for neurons
const getBiasColor = (bias: number): string => {
  if (bias < -0.5) return 'bg-red-500/20 border-red-500/50';
  if (bias < -0.2) return 'bg-orange-500/20 border-orange-500/50';
  if (bias < 0.2) return 'bg-gray-500/20 border-gray-500/50';
  if (bias < 0.5) return 'bg-blue-500/20 border-blue-500/50';
  return 'bg-green-500/20 border-green-500/50';
};

const getLayerColor = (type: LayerConfig['type'], bias?: number) => {
  // If bias is provided, use bias-based coloring
  if (bias !== undefined) {
    return getBiasColor(bias);
  }
  
  // Default monochrome colors for different layer types
  switch (type) {
    case 'input': return 'bg-accent border-primary';
    case 'dense': return 'bg-muted border-secondary';
    case 'conv2d': return 'bg-card border-accent';
    case 'maxpool': return 'bg-muted border-border';
    case 'avgpool': return 'bg-accent border-border';
    case 'flatten': return 'bg-card border-muted';
    case 'batchnorm': return 'bg-muted border-accent';
    case 'relu': return 'bg-accent border-primary';
    case 'tanh': return 'bg-card border-secondary';
    case 'sigmoid': return 'bg-muted border-primary';
    case 'softmax': return 'bg-accent border-secondary';
    default: return 'bg-muted border-border';
  }
};

const getLayerInfo = (layer: LayerConfig) => {
  switch (layer.type) {
    case 'dense':
      return `${layer.params.units || 0} units`;
    case 'conv2d':
      return `${layer.params.filters || 0} filters`;
    case 'maxpool':
    case 'avgpool':
      return `${layer.params.pool_size?.[0] || 2}x${layer.params.pool_size?.[1] || 2}`;
    case 'input':
      return `${layer.params.input_shape?.join('x') || 'undefined'}`;
    case 'relu':
    case 'tanh':
    case 'sigmoid':
    case 'softmax':
      return `${layer.type.toUpperCase()} activation`;
    default:
      return '';
  }
};

export const NetworkNode = memo(({ data }: NetworkNodeProps) => {
  const { layer, isSelected, onSelect, onDelete } = data;
  const IconComponent = getLayerIcon(layer.type);
  // Use bias for color if available (for dense layers with biases)
  const averageBias = layer.biases ? layer.biases.reduce((a, b) => a + b, 0) / layer.biases.length : undefined;
  const colorClass = getLayerColor(layer.type, averageBias);
  const layerInfo = getLayerInfo(layer);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`relative group ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={onSelect}
    >
      {/* Input Handle */}
      {layer.type !== 'input' && (
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 border-2 border-background bg-primary"
        />
      )}
      
      {/* Node Content */}
      <div className={`neural-card min-w-[160px] p-4 cursor-pointer ${colorClass} text-foreground border-2`}>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <IconComponent className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm truncate">{layer.name}</div>
            {layerInfo && (
              <div className="text-xs opacity-75 truncate">{layerInfo}</div>
            )}
          </div>
        </div>
        
        {/* Node Actions */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
          <Button
            size="sm"
            variant="ghost"
            className="w-6 h-6 p-0 bg-primary/10 hover:bg-primary/20 border border-primary/20"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            <Settings className="w-3 h-3 text-primary" />
          </Button>
          {layer.type !== 'input' && (
            <Button
              size="sm"
              variant="ghost"
              className="w-6 h-6 p-0 bg-destructive/10 hover:bg-destructive/20 border border-destructive/20"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="w-3 h-3 text-destructive" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Output Handle */}
      {layer.type !== 'softmax' && (
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 border-2 border-background bg-primary"
        />
      )}
    </motion.div>
  );
});