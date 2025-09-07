import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Line, Box, Plane } from '@react-three/drei';
import { LayerConfig } from '@/types/neural-network';
import * as THREE from 'three';

interface EnsembleViewProps {
  layers: LayerConfig[];
  selectedLayer: LayerConfig | null;
  onLayerSelect: (layer: LayerConfig | null) => void;
  isTraining?: boolean;
}

const DenseLayerNode = ({ 
  position, 
  size, 
  color, 
  isSelected,
  onClick,
  bias = 0
}: { 
  position: [number, number, number]; 
  size: number;
  color: string;
  isSelected: boolean;
  onClick: () => void;
  bias?: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current && isSelected) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  // Color based on bias value
  const nodeColor = useMemo(() => {
    if (bias === 0) return color;
    const intensity = Math.min(Math.abs(bias), 1);
    if (bias > 0) {
      // Positive bias: brighter/warmer
      return `hsl(200, 70%, ${50 + intensity * 30}%)`;
    } else {
      // Negative bias: darker/cooler
      return `hsl(200, 70%, ${50 - intensity * 30}%)`;
    }
  }, [bias, color]);

  return (
    <Sphere 
      ref={meshRef}
      position={position}
      args={[size + Math.abs(bias) * 0.05, 16, 16]}
      scale={isSelected ? 1.3 : 1}
      onClick={onClick}
    >
      <meshStandardMaterial 
        color={nodeColor}
        transparent
        opacity={0.8 + Math.abs(bias) * 0.1}
        emissive={isSelected ? nodeColor : '#000000'}
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
  weight = 0,
  color = "#8B5CF6",
  opacity = 0.4
}: { 
  start: [number, number, number]; 
  end: [number, number, number];
  weight?: number;
  color?: string;
  opacity?: number;
}) => {
  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  
  // Color based on weight magnitude and sign
  const weightColor = useMemo(() => {
    if (weight === 0) return color;
    const intensity = Math.min(Math.abs(weight), 1);
    if (weight > 0) {
      // Positive weights: blue to cyan
      return `hsl(${180 + intensity * 60}, 70%, ${50 + intensity * 30}%)`;
    } else {
      // Negative weights: red to orange
      return `hsl(${0 + intensity * 30}, 70%, ${50 + intensity * 30}%)`;
    }
  }, [weight, color]);
  
  const lineWidth = Math.max(0.5, Math.abs(weight) * 3);
  
  return (
    <Line
      points={points}
      color={weightColor}
      lineWidth={lineWidth}
      transparent
      opacity={opacity + Math.abs(weight) * 0.3}
    />
  );
};

const DenseLayer3D = ({
  layer,
  layerIndex,
  isSelected,
  onClick,
  nextLayer,
  layers
}: {
  layer: LayerConfig;
  layerIndex: number;
  isSelected: boolean;
  onClick: () => void;
  nextLayer?: LayerConfig;
  layers: LayerConfig[];
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
    const bias = layer.biases?.[i] || 0;
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
        bias={bias}
      />
    );
    
    // Create connections to next layer if it exists
    if (nextLayer && (nextLayer.type === 'dense' || nextLayer.type === 'conv2d' || nextLayer.type === 'maxpool' || nextLayer.type === 'avgpool')) {
      if (nextLayer.type === 'dense') {
        const nextUnits = nextLayer.params?.units || 1;
        const nextBaseX = (layerIndex + 1) * 4;
        const nextStartY = -(nextUnits - 1) * spacing / 2;
        
        for (let j = 0; j < nextUnits; j++) {
          const nextNodePosition: [number, number, number] = [
            nextBaseX,
            nextStartY + j * spacing,
            0
          ];
          
          // Get weight value for connection coloring
          const weight = layer.weights?.[i]?.[j] || Math.random() * 0.2 - 0.1;
          
          connections.push(
            <NodeConnection
              key={`${layer.id}-${i}-to-${nextLayer.id}-${j}`}
              start={nodePosition}
              end={nextNodePosition}
              weight={weight}
              opacity={0.4}
            />
          );
        }
      } else {
        // Connect to conv/pooling layer center
        const nextBaseX = (layerIndex + 1) * 4;
        const nextNodePosition: [number, number, number] = [nextBaseX, 0, 0];
        
        connections.push(
          <NodeConnection
            key={`${layer.id}-${i}-to-${nextLayer.id}`}
            start={nodePosition}
            end={nextNodePosition}
            weight={Math.random() * 0.2 - 0.1}
            opacity={0.3}
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

const ConvFilter3D = ({ 
  position, 
  kernelSize, 
  isSelected, 
  onClick,
  bias = 0
}: { 
  position: [number, number, number]; 
  kernelSize: [number, number];
  isSelected: boolean;
  onClick: () => void;
  bias?: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current && isSelected) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  const filterColor = useMemo(() => {
    if (bias === 0) return "#10B981";
    const intensity = Math.min(Math.abs(bias), 1);
    if (bias > 0) {
      return `hsl(150, 70%, ${50 + intensity * 25}%)`;
    } else {
      return `hsl(150, 70%, ${50 - intensity * 25}%)`;
    }
  }, [bias]);

  const width = kernelSize[0] * 0.08;
  const height = kernelSize[1] * 0.08;
  const depth = 0.03;

  return (
    <Box 
      ref={meshRef}
      position={position}
      args={[width, height, depth]}
      scale={isSelected ? 1.2 : 1}
      onClick={onClick}
    >
      <meshStandardMaterial 
        color={filterColor}
        transparent
        opacity={0.7 + Math.abs(bias) * 0.2}
        emissive={isSelected ? filterColor : '#000000'}
        emissiveIntensity={isSelected ? 0.2 : 0}
      />
    </Box>
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
  
  // Create 3D representation of convolution operation
  const inputPlane = (
    <Plane
      position={[baseX - 1, 0, 0]}
      args={[1.5, 1.5]}
      rotation={[0, Math.PI / 6, 0]}
    >
      <meshStandardMaterial 
        color="#8B5CF6" 
        transparent 
        opacity={0.3}
        side={THREE.DoubleSide}
      />
    </Plane>
  );

  const featureViz = [];
  const spacing = 0.15;
  const maxDisplay = Math.min(filters, 9); // 3x3 grid
  const gridSize = Math.ceil(Math.sqrt(maxDisplay));
  
  for (let i = 0; i < maxDisplay; i++) {
    const row = Math.floor(i / gridSize);
    const col = i % gridSize;
    const bias = layer.biases?.[i] || 0;
    
    const position: [number, number, number] = [
      baseX + col * spacing - (gridSize * spacing) / 2,
      row * spacing - (gridSize * spacing) / 2,
      0.5
    ];
    
    featureViz.push(
      <ConvFilter3D
        key={`${layer.id}-filter-${i}`}
        position={position}
        kernelSize={kernelSize}
        isSelected={isSelected}
        onClick={onClick}
        bias={bias}
      />
    );
  }

  // Feature map outputs
  const outputPlane = (
    <Plane
      position={[baseX + 1, 0, 0]}
      args={[1.2, 1.2]}
      rotation={[0, -Math.PI / 6, 0]}
    >
      <meshStandardMaterial 
        color="#10B981" 
        transparent 
        opacity={0.4}
        side={THREE.DoubleSide}
      />
    </Plane>
  );
  
  return (
    <group>
      {inputPlane}
      {featureViz}
      {outputPlane}
      <Text
        position={[baseX, -1.2, 0]}
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
  onClick,
  nextLayer,
  layers
}: {
  layer: LayerConfig;
  layerIndex: number;
  isSelected: boolean;
  onClick: () => void;
  nextLayer?: LayerConfig;
  layers: LayerConfig[];
}) => {
  const inputShape = layer.params?.input_shape || [28, 28, 1];
  const baseX = layerIndex * 4;
  
  // Represent input as a rectangular prism
  const width = Math.min(inputShape[0], 10) * 0.02;
  const height = Math.min(inputShape[1], 10) * 0.02;
  const depth = inputShape[2] * 0.05;
  
  const connections = [];
  
  // Create connections to next layer
  if (nextLayer) {
    const nextBaseX = (layerIndex + 1) * 4;
    
    if (nextLayer.type === 'dense') {
      const nextUnits = nextLayer.params?.units || 1;
      const spacing = 0.3;
      const nextStartY = -(nextUnits - 1) * spacing / 2;
      
      for (let j = 0; j < nextUnits; j++) {
        const nextNodePosition: [number, number, number] = [
          nextBaseX,
          nextStartY + j * spacing,
          0
        ];
        
        connections.push(
          <NodeConnection
            key={`${layer.id}-to-${nextLayer.id}-${j}`}
            start={[baseX, 0, 0]}
            end={nextNodePosition}
            weight={Math.random() * 0.2 - 0.1}
            opacity={0.3}
          />
        );
      }
    } else {
      // Connect to conv/pooling layer center
      connections.push(
        <NodeConnection
          key={`${layer.id}-to-${nextLayer.id}`}
          start={[baseX, 0, 0]}
          end={[nextBaseX, 0, 0]}
          weight={Math.random() * 0.2 - 0.1}
          opacity={0.3}
        />
      );
    }
  }
  
  return (
    <group>
      <ConvLayerNode
        position={[baseX, 0, 0]}
        dimensions={[width, height, depth]}
        color="#8B5CF6"
        isSelected={isSelected}
        onClick={onClick}
      />
      {connections}
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

export const EnsembleView = ({ layers, selectedLayer, onLayerSelect, isTraining = false }: EnsembleViewProps) => {
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
            nextLayer={nextLayer}
            layers={layers}
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
            layers={layers}
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
        <div className="text-sm font-medium text-foreground mb-2">
          Ensemble View {isTraining && <span className="text-amber-400">(Training)</span>}
        </div>
        <div className="text-xs text-muted-foreground space-y-1">
          <div>• <span className="text-purple-400">Purple:</span> Input layers</div>
          <div>• <span className="text-cyan-400">Cyan:</span> Dense nodes (size ∝ bias)</div>
          <div>• <span className="text-green-400">Green:</span> Conv filters</div>
          <div>• <span className="text-amber-400">Amber:</span> Max pooling</div>
          <div>• <span className="text-red-400">Red:</span> Average pooling</div>
          <div className="mt-2 pt-2 border-t border-border/30">
            <div>• <span className="text-blue-400">Blue lines:</span> Positive weights</div>
            <div>• <span className="text-red-400">Red lines:</span> Negative weights</div>
            <div>• Line thickness ∝ weight magnitude</div>
            <div className="mt-1">• Drag to rotate • Scroll to zoom</div>
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