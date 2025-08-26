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
    case 'softmax': return Circle;
    default: return Circle;
  }
};

const getLayerColor = (type: LayerConfig['type']) => {
  switch (type) {
    case 'input': return 'from-primary to-primary-glow';
    case 'dense': return 'from-accent to-accent-glow';
    case 'conv2d': return 'from-secondary to-secondary-glow';
    case 'maxpool': return 'from-primary to-accent';
    case 'avgpool': return 'from-accent to-secondary';
    case 'flatten': return 'from-secondary to-primary';
    case 'batchnorm': return 'from-primary to-secondary';
    case 'softmax': return 'from-accent to-primary';
    default: return 'from-muted to-muted-foreground';
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
    default:
      return '';
  }
};

export const NetworkNode = memo(({ data }: NetworkNodeProps) => {
  const { layer, isSelected, onSelect, onDelete } = data;
  const IconComponent = getLayerIcon(layer.type);
  const colorClass = getLayerColor(layer.type);
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
      <div className={`neural-card min-w-[160px] p-4 cursor-pointer bg-gradient-to-r ${colorClass} text-primary-foreground`}>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <IconComponent className="w-4 h-4" />
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
            className="w-6 h-6 p-0 bg-white/20 hover:bg-white/30"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            <Settings className="w-3 h-3" />
          </Button>
          {layer.type !== 'input' && (
            <Button
              size="sm"
              variant="ghost"
              className="w-6 h-6 p-0 bg-red-500/20 hover:bg-red-500/30"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="w-3 h-3" />
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