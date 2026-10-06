import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Text, Center } from '@react-three/drei';
import * as THREE from 'three';
import { RequirementValidation, Language } from '../types';

interface DocumentSlabProps {
  validation: RequirementValidation;
  index: number;
  total: number;
  isExploded: boolean;
  isSelected: boolean;
  onSelect: (reqId: string) => void;
  lang: Language;
}

function DocumentSlab({
  validation,
  index,
  total,
  isExploded,
  isSelected,
  onSelect,
  lang,
}: DocumentSlabProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Spacing: exploded spreads out vertically, compact stacks tightly
  const targetY = useMemo(() => {
    if (isExploded) {
      // Centered around 0
      return (total / 2 - index) * 0.9;
    } else {
      // Packed binder stack
      return (total / 2 - index) * 0.12;
    }
  }, [isExploded, index, total]);

  // Color coding based on status
  const { color, emissive, opacity, isWireframe } = useMemo(() => {
    switch (validation.status) {
      case 'OK':
        return {
          color: isSelected ? '#38bdf8' : '#e0f2fe',
          emissive: isSelected ? '#0284c7' : hovered ? '#0369a1' : '#000000',
          opacity: 0.95,
          isWireframe: false,
        };
      case 'MISSING':
        return {
          color: '#ef4444',
          emissive: isSelected ? '#dc2626' : hovered ? '#991b1b' : '#450a0a',
          opacity: 0.35,
          isWireframe: true,
        };
      case 'EXPIRY_NEEDED':
        return {
          color: '#f59e0b',
          emissive: isSelected ? '#d97706' : hovered ? '#b45309' : '#78350f',
          opacity: 0.85,
          isWireframe: false,
        };
      case 'EXPIRED':
        return {
          color: '#dc2626',
          emissive: isSelected ? '#b91c1c' : hovered ? '#991b1b' : '#7f1d1d',
          opacity: 0.85,
          isWireframe: false,
        };
      case 'NOT_PROVIDED':
      default:
        return {
          color: '#64748b',
          emissive: '#000000',
          opacity: 0.25,
          isWireframe: true,
        };
    }
  }, [validation.status, isSelected, hovered]);

  // Smooth lerp movement toward targetY
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.position.y = THREE.MathUtils.damp(
        meshRef.current.position.y,
        targetY,
        6,
        delta
      );

      // Slight scale pop on hover or selection
      const targetScale = isSelected ? 1.05 : hovered ? 1.03 : 1.0;
      meshRef.current.scale.x = THREE.MathUtils.damp(meshRef.current.scale.x, targetScale, 10, delta);
      meshRef.current.scale.z = THREE.MathUtils.damp(meshRef.current.scale.z, targetScale, 10, delta);
    }
  });

  const displayTitle = lang === 'bn' ? validation.requirement.title_bn : validation.requirement.title_en;
  const shortTitle = displayTitle.length > 22 ? displayTitle.substring(0, 20) + '...' : displayTitle;

  return (
    <group position={[0, targetY, 0]}>
      {/* 3D Physical Sheet Representation (A4 proportions: ~3.5 x 4.8) */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(validation.requirement.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[4.2, 0.08, 3.2]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={hovered || isSelected ? 0.6 : 0.2}
          transparent={opacity < 1}
          opacity={opacity}
          wireframe={isWireframe}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Floating 3D Text Tag in Exploded View */}
      {isExploded && (
        <group position={[2.5, 0, 0]}>
          <Text
            fontSize={0.22}
            color={isSelected ? '#38bdf8' : '#e2e8f0'}
            anchorX="left"
            anchorY="middle"
          >
            {`${validation.requirement.id}: ${shortTitle}`}
          </Text>
          <Text
            position={[0, -0.22, 0]}
            fontSize={0.15}
            color={
              validation.status === 'OK'
                ? '#34d399'
                : validation.status === 'MISSING'
                ? '#f87171'
                : '#fbbf24'
            }
            anchorX="left"
            anchorY="middle"
          >
            {`${validation.status} ${validation.matchedFile ? `(${validation.matchedFile.pages}p)` : ''}`}
          </Text>
        </group>
      )}
    </group>
  );
}

interface PackageScene3DProps {
  validations: RequirementValidation[];
  selectedReqId: string | null;
  onSelectReq: (id: string) => void;
  lang: Language;
  isReady: boolean;
}

export function PackageScene3D({
  validations,
  selectedReqId,
  onSelectReq,
  lang,
  isReady,
}: PackageScene3DProps) {
  const [isExploded, setIsExploded] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);
  const controlsRef = useRef<any>(null);

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="relative w-full h-[400px] md:h-[460px] rounded-xl overflow-hidden bg-gradient-to-b from-[#060c18] via-[#091326] to-[#040813] border border-cyan-500/20 shadow-2xl">
      {/* HUD Header Toolbar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between pointer-events-none gap-2">
        <div className="flex items-center space-x-2 pointer-events-auto bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-cyan-500/30">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-mono font-semibold tracking-wider text-cyan-300 uppercase">
            3D DIGITAL TWIN &bull; PACKAGE ASSEMBLY
          </span>
        </div>

        {/* View Controls */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          <button
            onClick={() => setIsExploded(!isExploded)}
            className="px-2.5 py-1 text-xs font-mono font-medium rounded-md bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 transition-colors shadow-sm"
          >
            {isExploded ? 'Stacked Mode' : 'Exploded View'}
          </button>
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-2.5 py-1 text-xs font-mono font-medium rounded-md border transition-colors shadow-sm ${
              autoRotate
                ? 'bg-cyan-500 text-black border-cyan-400'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            Auto-Rotate
          </button>
          <button
            onClick={resetCamera}
            className="px-2.5 py-1 text-xs font-mono font-medium rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors shadow-sm"
          >
            Reset View
          </button>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [7, 5, 8], fov: 42 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 15, 10]} intensity={1.2} />
        <directionalLight position={[-10, -5, -5]} intensity={0.4} color="#38bdf8" />
        <pointLight position={[0, 0, 0]} intensity={0.5} color="#00f0ff" />

        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.05}
          autoRotate={autoRotate}
          autoRotateSpeed={1.5}
          maxDistance={25}
          minDistance={3}
        />

        <Center>
          <group position={[-1, 0, 0]}>
            {validations.map((val, idx) => (
              <DocumentSlab
                key={val.requirement.id}
                validation={val}
                index={idx}
                total={validations.length}
                isExploded={isExploded}
                isSelected={selectedReqId === val.requirement.id}
                onSelect={onSelectReq}
                lang={lang}
              />
            ))}
          </group>
        </Center>

        {/* Ambient Subtle Grid Floor */}
        <gridHelper
          args={[20, 20, '#00f0ff', '#1e293b']}
          position={[0, -4.5, 0]}
        />
      </Canvas>

      {/* Floating Status Badge at Bottom */}
      <div className="absolute bottom-3 left-3 pointer-events-none">
        <div className="bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/80 text-[11px] font-mono text-slate-300 flex items-center space-x-2">
          <span>Assembly State:</span>
          <span
            className={`font-semibold ${
              isReady ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {isReady ? 'COMPLETE (ALL REQUIRED PASS)' : 'IN PROGRESS (BLOCKERS REMAIN)'}
          </span>
        </div>
      </div>
    </div>
  );
}
