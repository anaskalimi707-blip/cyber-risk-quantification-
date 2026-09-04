import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Line, Html } from '@react-three/drei';
import * as THREE from 'three';

// Data shapes for the 3D graph
interface NodeData {
  id: string;
  type: 'service' | 'asset' | 'threat' | 'vuln' | 'control';
  label: string;
  criticality?: 'Critical' | 'High' | 'Medium' | 'Low';
  position?: THREE.Vector3;
}

interface EdgeData {
  source: string;
  target: string;
  color?: string;
  dashed?: boolean;
}

// Generate an elegant, organic layout
const generateGraphData = () => {
  const nodes: NodeData[] = [
    { id: 'svc-pay', type: 'service', label: 'Payment Processing', criticality: 'Critical', position: new THREE.Vector3(0, 0, 0) },
    { id: 'svc-kyc', type: 'service', label: 'Customer Data Vault', criticality: 'Critical', position: new THREE.Vector3(6, 2, -4) },
    { id: 'svc-trade', type: 'service', label: 'Algorithmic Trading', criticality: 'High', position: new THREE.Vector3(-6, -1, -3) },
    
    { id: 'ast-api', type: 'asset', label: 'Payment API-04', criticality: 'Critical', position: new THREE.Vector3(0, -3, 2) },
    { id: 'ast-db', type: 'asset', label: 'Ledger Postgres', criticality: 'Critical', position: new THREE.Vector3(2, -4, -1) },
    { id: 'ast-s3', type: 'asset', label: 'KYC S3 Vault', criticality: 'Critical', position: new THREE.Vector3(7, -1, -2) },

    { id: 'vuln-21413', type: 'vuln', label: 'CVE-2024-21413', criticality: 'Critical', position: new THREE.Vector3(-2, -5, 4) },
    { id: 'vuln-44487', type: 'vuln', label: 'CVE-2023-44487', criticality: 'High', position: new THREE.Vector3(1, -6, 3) },
    
    { id: 'threat-fin7', type: 'threat', label: 'FIN7 / LockBit', criticality: 'Critical', position: new THREE.Vector3(-4, -7, 6) },
    
    { id: 'ctrl-mfa', type: 'control', label: 'Hardware MFA', position: new THREE.Vector3(4, -5, 1) },
    { id: 'ctrl-seg', type: 'control', label: 'Microsegmentation', position: new THREE.Vector3(0, -2, -3) },
  ];

  const edges: EdgeData[] = [
    { source: 'svc-pay', target: 'ast-api', color: '#4a5568' },
    { source: 'svc-pay', target: 'ast-db', color: '#4a5568' },
    { source: 'svc-kyc', target: 'ast-s3', color: '#4a5568' },
    
    { source: 'ast-api', target: 'vuln-21413', color: '#e53e3e', dashed: true },
    { source: 'ast-api', target: 'vuln-44487', color: '#dd6b20', dashed: true },
    { source: 'vuln-21413', target: 'threat-fin7', color: '#e53e3e' },
    
    { source: 'ast-db', target: 'ctrl-mfa', color: '#38a169' },
    { source: 'ast-api', target: 'ctrl-seg', color: '#38a169' },
    { source: 'ast-db', target: 'ctrl-seg', color: '#38a169' },
  ];

  return { nodes, edges };
};

const NodeMesh = ({ node, onClick }: { node: NodeData, onClick: (n: NodeData) => void }) => {
  const [hovered, setHover] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Base colors
  let color = '#4a5568';
  let size = 0.5;
  if (node.type === 'service') { color = '#3182ce'; size = 0.8; }
  if (node.type === 'asset') { color = '#718096'; size = 0.6; }
  if (node.type === 'threat') { color = '#e53e3e'; size = 0.7; }
  if (node.type === 'vuln') { color = '#dd6b20'; size = 0.5; }
  if (node.type === 'control') { color = '#38a169'; size = 0.5; }

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle float animation
      meshRef.current.position.y = node.position!.y + Math.sin(state.clock.elapsedTime * 2 + node.position!.x) * 0.1;
    }
  });

  return (
    <group position={node.position}>
      <Sphere
        ref={meshRef}
        args={[size, 32, 32]}
        onClick={(e) => { e.stopPropagation(); onClick(node); }}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); setHover(false); document.body.style.cursor = 'auto'; }}
      >
        <meshStandardMaterial 
          color={hovered ? '#ffffff' : color} 
          emissive={color} 
          emissiveIntensity={hovered ? 0.8 : 0.2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
      {(hovered || node.type === 'service') && (
        <Html position={[0, size + 0.2, 0]} center zIndexRange={[100, 0]}>
          <div className="px-2 py-1 bg-gray-900/90 border border-gray-700 rounded text-xs text-white whitespace-nowrap shadow-lg backdrop-blur-sm pointer-events-none transition-all">
            <span className="font-semibold block">{node.label}</span>
            <span className="text-gray-400 text-[10px] uppercase">{node.type}</span>
          </div>
        </Html>
      )}
    </group>
  );
};

const Edges = ({ nodes, edges }: { nodes: NodeData[], edges: EdgeData[] }) => {
  return (
    <>
      {edges.map((edge, i) => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);
        if (!sourceNode || !targetNode) return null;

        return (
          <Line
            key={i}
            points={[sourceNode.position!, targetNode.position!]}
            color={edge.color || '#4a5568'}
            lineWidth={edge.dashed ? 1 : 2}
            dashed={edge.dashed}
            opacity={0.4}
            transparent
          />
        );
      })}
    </>
  );
};

const Scene = () => {
  const { nodes, edges } = useMemo(() => generateGraphData(), []);
  
  const handleNodeClick = (node: NodeData) => {
    console.log('Clicked node:', node);
    // In a full implementation, this would update a selected node state and show details in a drawer
  };

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#3182ce" />
      <pointLight position={[0, 0, 10]} intensity={0.5} color="#e53e3e" />
      
      <group position={[0, 2, 0]}>
        {nodes.map(node => (
          <NodeMesh key={node.id} node={node} onClick={handleNodeClick} />
        ))}
        <Edges nodes={nodes} edges={edges} />
      </group>
      
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        autoRotate={true}
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 1.5}
        minDistance={5}
        maxDistance={25}
      />
    </>
  );
};

export const RiskCommandCenter3D: React.FC = () => {
  return (
    <div className="w-full h-full bg-gray-950 rounded-xl overflow-hidden relative border border-gray-800 shadow-2xl">
      <div className="absolute top-4 left-4 z-10">
        <h3 className="text-white font-serif text-lg tracking-wide flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          CYBER RISK CONSTELLATION
        </h3>
        <p className="text-gray-400 text-xs">Interactive Attack Path & Asset Topology</p>
      </div>
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-900/50 px-2 py-1 rounded border border-gray-800 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-[#3182ce]"></span> Services
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-900/50 px-2 py-1 rounded border border-gray-800 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-[#e53e3e]"></span> Threats
        </div>
      </div>
      
      <Canvas camera={{ position: [0, 5, 15], fov: 45 }}>
        <React.Suspense fallback={null}>
          <Scene />
        </React.Suspense>
      </Canvas>
    </div>
  );
};
