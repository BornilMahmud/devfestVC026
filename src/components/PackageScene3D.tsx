import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Center } from '@react-three/drei';
import * as THREE from 'three';
import { RequirementValidation, Language } from '../types';
import { ChevronLeft, ChevronRight, RotateCcw, Eye, Layers } from 'lucide-react';

interface DocumentSlabProps {
  validation: RequirementValidation;
  index: number;
  total: number;
  isExploded: boolean;
  isSelected: boolean;
  isReady: boolean;
  onSelect: (reqId: string) => void;
  lang: Language;
}

function DocumentSlab({
  validation,
  index,
  total,
  isExploded,
  isSelected,
  isReady,
  onSelect,
  lang,
}: DocumentSlabProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const pageCount = validation.matchedFile?.pages || 1;
  // Thickness based on page weight (0.04 base + 0.01 per page, capped at 0.18)
  const slabThickness = Math.min(0.05 + pageCount * 0.012, 0.18);

  // Spacing: exploded spreads out vertically, compact stacks tightly
  const baseY = useMemo(() => {
    if (isExploded) {
      return (total / 2 - index) * 0.85;
    } else {
      return (total / 2 - index) * (slabThickness + 0.04);
    }
  }, [isExploded, index, total, slabThickness]);

  // Lift selected document subtly
  const targetY = isSelected ? baseY + (isExploded ? 0.35 : 0.4) : baseY;

  // Authentic enterprise document material
  const { color, emissive, opacity, isWireframe } = useMemo(() => {
    switch (validation.status) {
      case 'OK':
        return {
          color: isSelected ? '#ffffff' : '#f1f5f9',
          emissive: isSelected ? '#0284c7' : hovered ? '#0369a1' : '#0f172a',
          opacity: 0.98,
          isWireframe: false,
        };
      case 'MISSING':
        return {
          color: '#ef4444',
          emissive: isSelected ? '#b91c1c' : hovered ? '#7f1d1d' : '#2d0606',
          opacity: 0.4,
          isWireframe: true,
        };
      case 'EXPIRY_NEEDED':
        return {
          color: '#f59e0b',
          emissive: isSelected ? '#d97706' : hovered ? '#b45309' : '#451a03',
          opacity: 0.9,
          isWireframe: false,
        };
      case 'EXPIRED':
        return {
          color: '#dc2626',
          emissive: isSelected ? '#991b1b' : hovered ? '#7f1d1d' : '#450a0a',
          opacity: 0.9,
          isWireframe: false,
        };
      case 'NOT_PROVIDED':
      default:
        return {
          color: '#475569',
          emissive: '#000000',
          opacity: 0.25,
          isWireframe: true,
        };
    }
  }, [validation.status, isSelected, hovered]);

  // Smooth lerp movement toward target position
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.position.y = THREE.MathUtils.damp(
        meshRef.current.position.y,
        targetY,
        7,
        delta
      );

      // Subtle lateral expansion on selection
      const targetScale = isSelected ? 1.04 : hovered ? 1.02 : 1.0;
      meshRef.current.scale.x = THREE.MathUtils.damp(meshRef.current.scale.x, targetScale, 10, delta);
      meshRef.current.scale.z = THREE.MathUtils.damp(meshRef.current.scale.z, targetScale, 10, delta);
    }
  });

  const displayTitle = lang === 'bn' ? validation.requirement.title_bn : validation.requirement.title_en;
  const shortTitle = displayTitle.length > 20 ? displayTitle.substring(0, 18) + '...' : displayTitle;

  return (
    <group position={[0, baseY, 0]}>
      {/* 3D Physical Sheet (A4 Proportions: 4.2 x 3.1) */}
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
        <boxGeometry args={[4.2, slabThickness, 3.1]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={isSelected ? 0.5 : hovered ? 0.35 : 0.1}
          transparent={opacity < 1}
          opacity={opacity}
          wireframe={isWireframe}
          roughness={0.4}
          metalness={0.05}
        />
      </mesh>

      {/* Technical Label in Exploded View */}
      {isExploded && (
        <group position={[2.6, 0, 0]}>
          <Text
            fontSize={0.2}
            color={isSelected ? '#38bdf8' : '#e2e8f0'}
            anchorX="left"
            anchorY="middle"
          >
            {`${validation.requirement.id}: ${shortTitle}`}
          </Text>
          <Text
            position={[0, -0.2, 0]}
            fontSize={0.14}
            color={
              validation.status === 'OK'
                ? '#10b981'
                : validation.status === 'MISSING'
                ? '#ef4444'
                : '#f59e0b'
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

// Camera controller that smoothly centers on the selected requirement
function CameraDirector({ selectedReqIndex, total }: { selectedReqIndex: number; total: number }) {
  const { camera } = useThree();

  useFrame((_, delta) => {
    if (selectedReqIndex >= 0) {
      const targetLookY = (total / 2 - selectedReqIndex) * 0.4;
      camera.position.y = THREE.MathUtils.damp(camera.position.y, 4 + targetLookY * 0.5, 4, delta);
    }
  });

  return null;
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
  const [isExploded, setIsExploded] = useState(!isReady);
  const [autoRotate, setAutoRotate] = useState(false);
  const controlsRef = useRef<any>(null);

  // When readiness becomes ready, assemble into unified stack
  useEffect(() => {
    if (isReady) {
      setIsExploded(false);
    }
  }, [isReady]);

  const selectedIndex = useMemo(() => {
    return validations.findIndex((v) => v.requirement.id === selectedReqId);
  }, [validations, selectedReqId]);

  const handleNext = () => {
    if (validations.length === 0) return;
    const nextIdx = (selectedIndex + 1) % validations.length;
    onSelectReq(validations[nextIdx].requirement.id);
  };

  const handlePrev = () => {
    if (validations.length === 0) return;
    const prevIdx = (selectedIndex - 1 + validations.length) % validations.length;
    onSelectReq(validations[prevIdx].requirement.id);
  };

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const selectedVal = selectedIndex >= 0 ? validations[selectedIndex] : null;

  return (
    <div className="relative w-full h-[400px] md:h-[460px] rounded-xl overflow-hidden bg-gradient-to-b from-[#060c18] via-[#091326] to-[#040813] border border-cyan-500/20 shadow-2xl">
      {/* Top HUD Controls Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between pointer-events-none gap-2">
        <div className="flex items-center space-x-2 pointer-events-auto bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-cyan-500/30">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          <span className="text-xs font-mono font-semibold tracking-wider text-cyan-300 uppercase">
            3D DIGITAL TWIN &bull; DOCUMENT ASSEMBLY
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          {/* Stepper Buttons */}
          <div className="flex items-center bg-slate-800/80 rounded-md border border-slate-700/80 p-0.5">
            <button
              onClick={handlePrev}
              title="Previous Document"
              className="p-1 hover:bg-slate-700 text-slate-300 rounded transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 text-[10px] font-mono text-slate-400">
              {selectedIndex >= 0 ? `${selectedIndex + 1}/${validations.length}` : '-'}
            </span>
            <button
              onClick={handleNext}
              title="Next Document"
              className="p-1 hover:bg-slate-700 text-slate-300 rounded transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setIsExploded(!isExploded)}
            className="px-2.5 py-1 text-xs font-mono font-medium rounded-md bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 transition-colors shadow-sm flex items-center space-x-1"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isExploded ? 'Stack' : 'Explode'}</span>
          </button>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-2.5 py-1 text-xs font-mono font-medium rounded-md border transition-colors shadow-sm ${
              autoRotate
                ? 'bg-cyan-500 text-black border-cyan-400'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            Rotate
          </button>

          <button
            onClick={resetCamera}
            className="p-1.5 text-xs font-mono font-medium rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors shadow-sm"
            title="Reset View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [7, 5, 8], fov: 42 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={0.75} />
        <directionalLight position={[10, 15, 10]} intensity={1.2} />
        <directionalLight position={[-10, -5, -5]} intensity={0.4} color="#38bdf8" />
        <pointLight position={[0, 0, 0]} intensity={0.5} color="#00f0ff" />

        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.06}
          autoRotate={autoRotate}
          autoRotateSpeed={1.2}
          maxDistance={25}
          minDistance={3}
        />

        <CameraDirector selectedReqIndex={selectedIndex} total={validations.length} />

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
                isReady={isReady}
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

      {/* Selected Document HUD Card at Bottom */}
      {selectedVal && (
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto pointer-events-none">
          <div className="bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-lg border border-slate-700/80 text-xs font-mono text-slate-200 flex items-center space-x-3 shadow-lg pointer-events-auto">
            <span className="font-bold text-cyan-400">{selectedVal.requirement.id}</span>
            <span className="text-slate-500">&bull;</span>
            <span className="truncate max-w-[200px]">
              {lang === 'bn' ? selectedVal.requirement.title_bn : selectedVal.requirement.title_en}
            </span>
            <span className="text-slate-500">&bull;</span>
            <span
              className={`font-semibold text-[11px] ${
                selectedVal.status === 'OK'
                  ? 'text-emerald-400'
                  : selectedVal.status === 'MISSING'
                  ? 'text-red-400'
                  : 'text-amber-400'
              }`}
            >
              {selectedVal.status}
              {selectedVal.matchedFile ? ` (${selectedVal.matchedFile.pages}p)` : ''}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
