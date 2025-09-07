import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Line, Box } from '@react-three/drei';
import { LayerConfig } from '@/types/neural-network';
import * as THREE from 'three';

interface EnsembleViewProps {
  layers: LayerConfig[];
  selectedLayer: LayerConfig | null;
  onLayerSelect: (layer: LayerConfig | null) => void;
}

const DenseLayerNode = ({ 
  position, 
  size, 
  color, 
  isSelected,
  onClick 
}: { 
  position: [number, number, number]; 
  size: number;
  color: string;
  isSelected: boolean;
  onClick: () => void;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current && isSelected) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <Sphere 
      ref={meshRef}
      position={position}
      args={[size, 16, 16]}
      scale={isSelected ? 1.3 : 1}
      onClick={onClick}
    >
      <meshStandardMaterial 
        color={color}
        transparent
        opacity={0.8}
        emissive={isSelected ? color : '#000000'}
        emissiveIntensity={isSelected ? 0.3 : 0}
      />
    </Sphere>
  );
};

const ConvLayerNode = ({ 
  position, 
  dimensions, 
  color, 
  isSelected,
  onClick 
}: { 
  position: [number, number, number]; 
  dimensions: [number, number, number];
  color: string;
  isSelected: boolean;
  onClick: () => void;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current && isSelected) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Box 
      ref={meshRef}
      position={position}
      args={dimensions}
      scale={isSelected ? 1.2 : 1}
      onClick={onClick}
    >
      <meshStandardMaterial 
        color={color}
        transparent
        opacity={0.7}
        emissive={isSelected ? color : '#000000'}
        emissiveIntensity={isSelected ? 0.2 : 0}
        wireframe={false}
      />
    </Box>
  );
};

const NodeConnection = ({ 
  start, 
  end,
  color = "#8B5CF6",
  opacity = 0.4
}: { 
  start: [number, number, number]; 
  end: [number, number, number];
  color?: string;
  opacity?: number;
}) => {
  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  
  return (
    <Line
      points={points}
      color={color}
      lineWidth={1}
      transparent
      opacity={opacity}
    />
  );
};

const DenseLayer3D = ({
  layer,
  layerIndex,
  isSelected,
  onClick,
  nextLayer
}: {
  layer: LayerConfig;
  layerIndex: number;
  isSelected: boolean;
  onClick: () => void;
  nextLayer?: LayerConfig;
}) => {
  const units = layer.params?.units || 1;
  const baseX = layerIndex * 4;
  const nodeSize = 0.1;
  const spacing = 0.3;
  
  // Calculate vertical distribution
  const startY = -(units - 1) * spacing / 2;
  
  const nodes = [];
  const connections = [];
  
  // Create nodes for this layer
  for (let i = 0; i < units; i++) {
    const nodePosition: [number, number, number] = [
      baseX, 
      startY + i * spacing, 
      0
    ];
    
    nodes.push(
      <DenseLayerNode
        key={`${layer.id}-node-${i}`}
        position={nodePosition}
        size={nodeSize}
        color="#06B6D4"
        isSelected={isSelected}
        onClick={onClick}
      />
    );
    
    // Create connections to next layer if it exists and is dense
    if (nextLayer && nextLayer.type === 'dense') {
      const nextUnits = nextLayer.params?.units || 1;
      const nextBaseX = (layerIndex + 1) * 4;
      const nextStartY = -(nextUnits - 1) * spacing / 2;
      
      for (let j = 0; j < nextUnits; j++) {
        const nextNodePosition: [number, number, number] = [
          nextBaseX,
          nextStartY + j * spacing,
          0
        ];
        
        connections.push(
          <NodeConnection
            key={`${layer.id}-${i}-to-${nextLayer.id}-${j}`}
            start={nodePosition}
            end={nextNodePosition}
            opacity={0.2}
          />
        );
      }
    }
  }
  
  return (
    <group>
      {nodes}
      {connections}
      <Text
        position={[baseX, startY - 0.8, 0]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {layer.name}
      </Text>
    </group>
  );
};

const ConvLayer3D = ({
  layer,
  layerIndex,
  isSelected,
  onClick
}: {
  layer: LayerConfig;
  layerIndex: number;
  isSelected: boolean;
  onClick: () => void;
}) => {
  const filters = layer.params?.filters || 32;
  const kernelSize = layer.params?.kernel_size || [3, 3];
  const baseX = layerIndex * 4;
  
  // Create feature maps representation
  const mapWidth = kernelSize[0] * 0.1;
  const mapHeight = kernelSize[1] * 0.1;
  const mapDepth = 0.05;
  
  const featureMaps = [];
  const spacing = 0.2;
  const mapsPerRow = Math.ceil(Math.sqrt(filters));
  
  for (let i = 0; i < Math.min(filters, 16); i++) { // Limit display for performance
    const row = Math.floor(i / mapsPerRow);
    const col = i % mapsPerRow;
    
    const position: [number, number, number] = [
      baseX + col * spacing,
      row * spacing - (mapsPerRow * spacing) / 2,
      0
    ];
    
    featureMaps.push(
      <ConvLayerNode
        key={`${layer.id}-filter-${i}`}
        position={position}
        dimensions={[mapWidth, mapHeight, mapDepth]}
        color="#10B981"
        isSelected={isSelected}
        onClick={onClick}
      />
    );
  }
  
  return (
    <group>
      {featureMaps}
      <Text
        position={[baseX, -(mapsPerRow * spacing) / 2 - 0.5, 0]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {layer.name}
      </Text>
    </group>
  );
};

const InputLayer3D = ({
  layer,
  layerIndex,
  isSelected,
  onClick
}: {
  layer: LayerConfig;
  layerIndex: number;
  isSelected: boolean;
  onClick: () => void;
}) => {
  const inputShape = layer.params?.input_shape || [28, 28, 1];
  const baseX = layerIndex * 4;
  
  // Represent input as a rectangular prism
  const width = Math.min(inputShape[0], 10) * 0.02;
  const height = Math.min(inputShape[1], 10) * 0.02;
  const depth = inputShape[2] * 0.05;
  
  return (
    <group>
      <ConvLayerNode
        position={[baseX, 0, 0]}
        dimensions={[width, height, depth]}
        color="#8B5CF6"
        isSelected={isSelected}
        onClick={onClick}
      />
      <Text
        position={[baseX, -0.8, 0]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {layer.name}
      </Text>
    </group>
  );
};

const PoolingLayer3D = ({
  layer,
  layerIndex,
  isSelected,
  onClick
}: {
  layer: LayerConfig;
  layerIndex: number;
  isSelected: boolean;
  onClick: () => void;
}) => {
  const poolSize = layer.params?.pool_size || [2, 2];
  const baseX = layerIndex * 4;
  
  const width = poolSize[0] * 0.1;
  const height = poolSize[1] * 0.1;
  const depth = 0.1;
  
  const color = layer.type === 'maxpool' ? '#F59E0B' : '#EF4444';
  
  return (
    <group>
      <ConvLayerNode
        position={[baseX, 0, 0]}
        dimensions={[width, height, depth]}
        color={color}
        isSelected={isSelected}
        onClick={onClick}
      />
      <Text
        position={[baseX, -0.8, 0]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {layer.name}
      </Text>
    </group>
  );
};

export const EnsembleView = ({ layers, selectedLayer, onLayerSelect }: EnsembleViewProps) => {
  const renderLayer = (layer: LayerConfig, index: number) => {
    const isSelected = selectedLayer?.id === layer.id;
    const onClick = () => onLayerSelect(layer);
    const nextLayer = layers[index + 1];
    
    switch (layer.type) {
      case 'input':
        return (
          <InputLayer3D
            key={layer.id}
            layer={layer}
            layerIndex={index}
            isSelected={isSelected}
            onClick={onClick}
          />
        );
      case 'dense':
        return (
          <DenseLayer3D
            key={layer.id}
            layer={layer}
            layerIndex={index}
            isSelected={isSelected}
            onClick={onClick}
            nextLayer={nextLayer}
          />
        );
      case 'conv2d':
        return (
          <ConvLayer3D
            key={layer.id}
            layer={layer}
            layerIndex={index}
            isSelected={isSelected}
            onClick={onClick}
          />
        );
      case 'maxpool':
      case 'avgpool':
        return (
          <PoolingLayer3D
            key={layer.id}
            layer={layer}
            layerIndex={index}
            isSelected={isSelected}
            onClick={onClick}
          />
        );
      default:
        return (
          <DenseLayerNode
            key={layer.id}
            position={[index * 4, 0, 0]}
            size={0.2}
            color="#6B7280"
            isSelected={isSelected}
            onClick={onClick}
          />
        );
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-b from-background via-background/80 to-card/20">
      <Canvas camera={{ position: [12, 8, 12], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[15, 15, 15]} intensity={1} color="#ffffff" />
        <pointLight position={[-10, 10, -10]} intensity={0.6} color="#8B5CF6" />
        <pointLight position={[10, -10, 10]} intensity={0.4} color="#06B6D4" />
        
        {/* Render all layers */}
        {layers.map((layer, index) => renderLayer(layer, index))}
        
        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          enableRotate={true}
          autoRotate={false}
          minDistance={5}
          maxDistance={50}
        />
      </Canvas>
      
      {/* Controls Overlay */}
      <div className="absolute bottom-4 left-4 bg-card/80 backdrop-blur-lg rounded-lg p-4 border border-border/50">
        <div className="text-sm font-medium text-foreground mb-2">Ensemble View</div>
        <div className="text-xs text-muted-foreground space-y-1">
          <div>• <span className="text-purple-400">Purple:</span> Input layers</div>
          <div>• <span className="text-cyan-400">Cyan:</span> Dense layers</div>
          <div>• <span className="text-green-400">Green:</span> Convolutional layers</div>
          <div>• <span className="text-amber-400">Amber:</span> Max pooling</div>
          <div>• <span className="text-red-400">Red:</span> Average pooling</div>
          <div className="mt-2 pt-2 border-t border-border/30">
            <div>• Drag to rotate view</div>
            <div>• Scroll to zoom</div>
            <div>• Click nodes to select</div>
          </div>
        </div>
      </div>
      
      {/* Selected Layer Info */}
      {selectedLayer && (
        <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-lg rounded-lg p-4 border border-border/50 max-w-xs">
          <div className="text-sm font-medium text-foreground mb-2">{selectedLayer.name}</div>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>Type: <span className="text-foreground">{selectedLayer.type}</span></div>
            {selectedLayer.params?.units && (
              <div>Units: <span className="text-foreground">{selectedLayer.params.units}</span></div>
            )}
            {selectedLayer.params?.filters && (
              <div>Filters: <span className="text-foreground">{selectedLayer.params.filters}</span></div>
            )}
            {selectedLayer.params?.kernel_size && (
              <div>Kernel: <span className="text-foreground">{selectedLayer.params.kernel_size.join('×')}</span></div>
            )}
            {selectedLayer.params?.input_shape && (
              <div>Shape: <span className="text-foreground">{selectedLayer.params.input_shape.join('×')}</span></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};