import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Line } from '@react-three/drei';
import { LayerConfig } from '@/types/neural-network';
import * as THREE from 'three';

interface Network3DProps {
  layers: LayerConfig[];
  selectedLayer: LayerConfig | null;
  onLayerSelect: (layer: LayerConfig | null) => void;
}

const LayerNode3D = ({ 
  layer, 
  position, 
  isSelected, 
  onClick 
}: { 
  layer: LayerConfig; 
  position: [number, number, number]; 
  isSelected: boolean; 
  onClick: () => void;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  const getLayerColor = (type: LayerConfig['type']) => {
    switch (type) {
      case 'input': return '#8B5CF6';  // Purple
      case 'dense': return '#06B6D4';  // Cyan
      case 'conv2d': return '#10B981'; // Green
      case 'maxpool': return '#F59E0B'; // Amber
      case 'avgpool': return '#EF4444'; // Red
      default: return '#6B7280'; // Gray
    }
  };

  const getLayerSize = (type: LayerConfig['type']) => {
    switch (type) {
      case 'input': return 0.8;
      case 'dense': return 0.6;
      case 'conv2d': return 0.7;
      default: return 0.5;
    }
  };

  return (
    <group position={position} onClick={onClick}>
      <Sphere 
        ref={meshRef}
        args={[getLayerSize(layer.type), 32, 32]}
        scale={isSelected ? 1.2 : 1}
      >
        <meshStandardMaterial 
          color={getLayerColor(layer.type)}
          transparent
          opacity={0.8}
          emissive={isSelected ? getLayerColor(layer.type) : '#000000'}
          emissiveIntensity={isSelected ? 0.2 : 0}
        />
      </Sphere>
      <Text
        position={[0, -1, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {layer.name}
      </Text>
    </group>
  );
};

const NetworkConnection = ({ 
  start, 
  end 
}: { 
  start: [number, number, number]; 
  end: [number, number, number]; 
}) => {
  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  
  return (
    <Line
      points={points}
      color="#8B5CF6"
      lineWidth={2}
      transparent
      opacity={0.6}
    />
  );
};

export const Network3D = ({ layers, selectedLayer, onLayerSelect }: Network3DProps) => {
  const getLayerPosition = (index: number): [number, number, number] => {
    const radius = 3;
    const angle = (index / layers.length) * Math.PI * 2;
    return [
      Math.cos(angle) * radius,
      (index - layers.length / 2) * 1.5,
      Math.sin(angle) * radius
    ];
  };

  return (
    <div className="w-full h-full bg-gradient-to-b from-background to-card/20">
      <Canvas camera={{ position: [8, 5, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8B5CF6" />
        
        {/* Render layers */}
        {layers.map((layer, index) => (
          <LayerNode3D
            key={layer.id}
            layer={layer}
            position={getLayerPosition(index)}
            isSelected={selectedLayer?.id === layer.id}
            onClick={() => onLayerSelect(layer)}
          />
        ))}
        
        {/* Render connections */}
        {layers.map((layer, index) => 
          layer.connections?.map(targetId => {
            const targetIndex = layers.findIndex(l => l.id === targetId);
            if (targetIndex === -1) return null;
            
            return (
              <NetworkConnection
                key={`${layer.id}-${targetId}`}
                start={getLayerPosition(index)}
                end={getLayerPosition(targetIndex)}
              />
            );
          })
        )}
        
        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
      </Canvas>
      
      {/* 3D Controls Overlay */}
      <div className="absolute bottom-4 left-4 bg-card/80 backdrop-blur-lg rounded-lg p-3 border border-border/50">
        <div className="text-xs text-muted-foreground space-y-1">
          <div>• Drag to rotate</div>
          <div>• Scroll to zoom</div>
          <div>• Click layers to select</div>
        </div>
      </div>
    </div>
  );
};