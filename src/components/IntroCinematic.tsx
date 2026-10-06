import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

import { Language } from '../types';

interface IntroCinematicProps {
  onComplete: () => void;
  lang?: Language;
}

export const IntroCinematic: React.FC<IntroCinematicProps> = ({ onComplete, lang = 'en' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [isExiting, setIsExiting] = useState(false);

  // Skip or complete handler
  const handleFinish = () => {
    try {
      sessionStorage.setItem('tf_intro_seen', 'true');
    } catch (_) {}
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 280);
  };

  useEffect(() => {
    // Respect prefers-reduced-motion immediately
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onComplete();
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    let animId: number;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // --- 1. Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#F4F6F9'); // TenderForge clean canvas

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 50);
    camera.position.set(0, 1.2, 5.0);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // --- 2. Lighting ---
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xe2e8f0, 0.9);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.85);
    dirLight.position.set(3.5, 6.0, 4.0);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 15;
    dirLight.shadow.bias = -0.001;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x245cc6, 0.25);
    fillLight.position.set(-4, -2, -2);
    scene.add(fillLight);

    // --- 3. Shadow Catcher Floor ---
    const shadowGeo = new THREE.PlaneGeometry(12, 12);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.12 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.2;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // --- 4. Procedural High-Res Document Textures ---
    const texturesToDispose: THREE.Texture[] = [];
    const createDocTexture = (
      type: 'requirements' | 'documents' | 'validation',
      title: string,
      code: string
    ) => {
      const cv = document.createElement('canvas');
      cv.width = 512;
      cv.height = 724; // A4 aspect
      const ctx = cv.getContext('2d')!;

      // Crisp paper surface
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, 512, 724);

      // Hairline border
      ctx.strokeStyle = '#DEE4EC';
      ctx.lineWidth = 3;
      ctx.strokeRect(12, 12, 488, 700);

      // Header band
      const accent =
        type === 'requirements' ? '#245CC6' : type === 'documents' ? '#18263B' : '#21714C';
      ctx.fillStyle = accent;
      ctx.fillRect(36, 40, 100, 6);

      // Document Title
      ctx.fillStyle = '#18263B';
      ctx.font = 'bold 22px Inter, sans-serif';
      ctx.fillText(title, 36, 85);

      // Code / Ref
      ctx.fillStyle = '#5C6B7E';
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText(`TENDER ID: T-2026-0417 • ${code}`, 36, 110);

      // Divider
      ctx.strokeStyle = '#DEE4EC';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(36, 125);
      ctx.lineTo(476, 125);
      ctx.stroke();

      // Simulated clean text lines
      for (let y = 150; y < 620; y += 22) {
        const w = 440 * (0.65 + 0.3 * Math.sin(y * 5));
        ctx.fillStyle = '#E2E8F0';
        ctx.fillRect(36, y, w, 6);
      }

      // Verification seal badge at bottom
      ctx.strokeStyle = accent;
      ctx.lineWidth = 2;
      ctx.strokeRect(320, 630, 155, 52);
      ctx.fillStyle = accent;
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText(type === 'validation' ? '✓ VERIFIED 2026' : 'OFFICIAL TENDER', 335, 660);

      const tex = new THREE.CanvasTexture(cv);
      tex.anisotropy = 4;
      texturesToDispose.push(tex);
      return tex;
    };

    const tex1 = createDocTexture('requirements', 'REQUIREMENTS SPECIFICATION', 'SECTION 01');
    const tex2 = createDocTexture('documents', 'STATUTORY BID PROPOSAL', 'SECTION 02');
    const tex3 = createDocTexture('validation', 'COMPLIANCE AUDIT CERTIFICATE', 'SECTION 03');

    // Document Sheets: A4 proportions (width: 1.8, height: 2.54, thickness: 0.015)
    const docGeo = new THREE.BoxGeometry(1.8, 2.54, 0.018);
    const materialsToDispose: THREE.Material[] = [];

    const makeMat = (tex: THREE.CanvasTexture) => {
      const mat = new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.45,
        metalness: 0.05,
        color: 0xffffff,
      });
      materialsToDispose.push(mat);
      return mat;
    };

    const doc1 = new THREE.Mesh(docGeo, makeMat(tex1));
    const doc2 = new THREE.Mesh(docGeo, makeMat(tex2));
    const doc3 = new THREE.Mesh(docGeo, makeMat(tex3));

    [doc1, doc2, doc3].forEach((doc) => {
      doc.castShadow = true;
      doc.receiveShadow = true;
      scene.add(doc);
    });

    // Elegant Submission Package Binder (Spine / Border clamp for Phase 4)
    const spineGeo = new THREE.BoxGeometry(0.1, 2.58, 0.08);
    const spineMat = new THREE.MeshStandardMaterial({
      color: 0x18263b,
      roughness: 0.3,
      metalness: 0.2,
    });
    materialsToDispose.push(spineMat);
    const spineMesh = new THREE.Mesh(spineGeo, spineMat);
    spineMesh.position.set(-0.95, 0, 0);
    spineMesh.visible = false;
    scene.add(spineMesh);

    // Verification Scanline Indicator Mesh (Phase 3)
    const scanGeo = new THREE.PlaneGeometry(2.1, 0.04);
    const scanMat = new THREE.MeshBasicMaterial({
      color: 0x245cc6,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide,
    });
    materialsToDispose.push(scanMat);
    const scanPlane = new THREE.Mesh(scanGeo, scanMat);
    scanPlane.visible = false;
    scene.add(scanPlane);

    // Initial Scattered Positions (Phase 1)
    doc1.position.set(-1.6, 0.35, -0.4);
    doc1.rotation.set(-0.15, 0.3, 0.12);

    doc2.position.set(0.0, 0.65, 0.25);
    doc2.rotation.set(0.12, -0.15, -0.08);

    doc3.position.set(1.6, 0.2, -0.3);
    doc3.rotation.set(-0.1, -0.25, 0.08);

    const startTime = performance.now();
    const TOTAL_DURATION = 3600; // 3.6s total

    // --- 5. Render Loop with Smooth Procedural Easing ---
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / TOTAL_DURATION, 1);

      // Update Phase states for HTML Overlay
      if (progress < 0.26) {
        setPhase(1); // 0.0s - 0.9s: Sheets appear
      } else if (progress < 0.52) {
        setPhase(2); // 0.9s - 1.8s: Aligning into stack
      } else if (progress < 0.75) {
        setPhase(3); // 1.8s - 2.7s: Verification scan
      } else if (progress < 0.90) {
        setPhase(4); // 2.7s - 3.2s: Package ready
      } else {
        setPhase(5); // 3.2s - 3.6s: Brand reveal & settle
      }

      // Smooth Easing Functions
      const easeInOutCubic = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      // Phase 1 -> Phase 2 Transition (0.0 to 1.8s)
      // Transition from dispersed into tiered aligned stack
      const stackT = Math.min(Math.max((progress - 0.12) / 0.38, 0), 1);
      const stackEase = easeInOutCubic(stackT);

      // Stack target transforms (gentle isometric angle)
      const targetRotX = -0.32;
      const targetRotY = 0.38;
      const targetRotZ = 0.08;

      // Doc 1 (Base - Requirements)
      doc1.position.x = THREE.MathUtils.lerp(-1.6, 0, stackEase);
      doc1.position.y = THREE.MathUtils.lerp(0.35, -0.06, stackEase);
      doc1.position.z = THREE.MathUtils.lerp(-0.4, -0.03, stackEase);
      doc1.rotation.x = THREE.MathUtils.lerp(-0.15, targetRotX, stackEase);
      doc1.rotation.y = THREE.MathUtils.lerp(0.3, targetRotY, stackEase);
      doc1.rotation.z = THREE.MathUtils.lerp(0.12, targetRotZ, stackEase);

      // Doc 2 (Middle - Technical Documents)
      doc2.position.x = THREE.MathUtils.lerp(0.0, 0, stackEase);
      doc2.position.y = THREE.MathUtils.lerp(0.65, 0.0, stackEase);
      doc2.position.z = THREE.MathUtils.lerp(0.25, 0.0, stackEase);
      doc2.rotation.x = THREE.MathUtils.lerp(0.12, targetRotX, stackEase);
      doc2.rotation.y = THREE.MathUtils.lerp(-0.15, targetRotY, stackEase);
      doc2.rotation.z = THREE.MathUtils.lerp(-0.08, targetRotZ, stackEase);

      // Doc 3 (Top - Validation)
      doc3.position.x = THREE.MathUtils.lerp(1.6, 0, stackEase);
      doc3.position.y = THREE.MathUtils.lerp(0.2, 0.06, stackEase);
      doc3.position.z = THREE.MathUtils.lerp(-0.3, 0.03, stackEase);
      doc3.rotation.x = THREE.MathUtils.lerp(-0.1, targetRotX, stackEase);
      doc3.rotation.y = THREE.MathUtils.lerp(-0.25, targetRotY, stackEase);
      doc3.rotation.z = THREE.MathUtils.lerp(0.08, targetRotZ, stackEase);

      // Phase 3: Verification scanline sweep (1.8s to 2.7s)
      if (progress >= 0.52 && progress <= 0.75) {
        scanPlane.visible = true;
        const scanProgress = (progress - 0.52) / 0.23;
        scanPlane.position.x = 0;
        scanPlane.position.y = THREE.MathUtils.lerp(1.3, -1.2, scanProgress);
        scanPlane.position.z = 0.12;
        scanPlane.rotation.x = targetRotX;
        scanPlane.rotation.y = targetRotY;
        scanPlane.rotation.z = targetRotZ;
        scanMat.opacity = Math.sin(scanProgress * Math.PI) * 0.8;
      } else {
        scanPlane.visible = false;
      }

      // Phase 4 & 5: Tight compression & finished package binding (2.7s to 3.6s)
      if (progress >= 0.75) {
        const clampT = Math.min((progress - 0.75) / 0.15, 1);
        const clampEase = easeInOutCubic(clampT);
        doc1.position.y = THREE.MathUtils.lerp(-0.06, -0.02, clampEase);
        doc3.position.y = THREE.MathUtils.lerp(0.06, 0.02, clampEase);

        spineMesh.visible = true;
        spineMesh.position.x = THREE.MathUtils.lerp(-1.1, -0.92, clampEase);
        spineMesh.rotation.x = targetRotX;
        spineMesh.rotation.y = targetRotY;
        spineMesh.rotation.z = targetRotZ;
      }

      // Smooth Gentle Camera Motion
      const camT = easeInOutCubic(progress);
      camera.position.z = THREE.MathUtils.lerp(5.2, 4.4, camT);
      camera.position.y = THREE.MathUtils.lerp(1.2, 0.85, camT);
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);

      if (progress < 1) {
        animId = requestAnimationFrame(animate);
      } else {
        // Animation finished naturally
        handleFinish();
      }
    };

    animId = requestAnimationFrame(animate);

    // Handle Resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Escape key to fast-skip
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Guaranteed Disposal & Render Loop Kill
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);

      // Dispose Geometries
      docGeo.dispose();
      spineGeo.dispose();
      scanGeo.dispose();
      shadowGeo.dispose();

      // Dispose Materials
      materialsToDispose.forEach((m) => m.dispose());

      // Dispose Textures
      texturesToDispose.forEach((t) => t.dispose());

      // Dispose Renderer & Release Context
      renderer.dispose();
      renderer.forceContextLoss();

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#F4F6F9] flex flex-col items-center justify-between select-none overflow-hidden transition-all duration-300 ${
        isExiting ? 'opacity-0 scale-[1.02] pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* 3D Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* Top Bar: Live Indicators & Skip Button */}
      <div className="relative z-10 w-full max-w-7xl px-6 py-5 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-2 h-2 rounded-full bg-[#245CC6] animate-pulse" />
          <span className="text-[11px] font-mono font-bold tracking-wider text-[#18263B] uppercase">
            TENDERFORGE &bull; INGESTION PIPELINE
          </span>
        </div>

        <button
          onClick={handleFinish}
          className="px-3.5 py-1.5 bg-white/90 hover:bg-white text-[#18263B] border border-[#DEE4EC] rounded-full text-xs font-semibold shadow-xs transition-all hover:scale-105 active:scale-95 flex items-center space-x-1.5 backdrop-blur-xs cursor-pointer"
        >
          <span>{lang === 'bn' ? 'ইন্ট্রো এড়িয়ে যান' : 'Skip intro'}</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#5C6B7E]" />
        </button>
      </div>

      {/* Center Dynamic HUD Captions Based on 3D Animation Phase */}
      <div className="relative z-10 text-center px-4 max-w-lg mb-12 pointer-events-none transition-all duration-200">
        {phase === 1 && (
          <div className="space-y-1 animate-tf-fade-up">
            <span className="text-[10px] font-bold tracking-widest text-[#5C6B7E] uppercase">
              {lang === 'bn' ? 'পর্যায় ০১ • ইনজেশন' : 'PHASE 01 • INGESTION'}
            </span>
            <h3 className="text-sm font-semibold text-[#18263B]">
              {lang === 'bn' ? 'দরপত্রের শর্তাবলী ও সংবিধিবদ্ধ নথি লোড হচ্ছে' : 'Loading tender specifications & statutory documents'}
            </h3>
          </div>
        )}

        {phase === 2 && (
          <div className="space-y-2 animate-tf-fade-up">
            <div className="flex items-center justify-center space-x-2 text-[10px] font-mono font-bold text-[#245CC6]">
              <span className="bg-[#EDF3FF] px-2 py-0.5 rounded border border-[#BED2FA]">
                {lang === 'bn' ? '০১ প্রয়োজনীয়তা' : '01 REQUIREMENTS'}
              </span>
              <span className="text-[#DEE4EC]">&bull;</span>
              <span className="bg-[#EDF3FF] px-2 py-0.5 rounded border border-[#BED2FA]">
                {lang === 'bn' ? '০২ নথিপত্র' : '02 DOCUMENTS'}
              </span>
              <span className="text-[#DEE4EC]">&bull;</span>
              <span className="bg-[#EDF3FF] px-2 py-0.5 rounded border border-[#BED2FA]">
                {lang === 'bn' ? '০৩ যাচাইকরণ' : '03 VALIDATION'}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-[#18263B]">
              {lang === 'bn' ? 'প্রয়োজনীয়তা অনুসারে নথিগুলো পর্যায়ক্রমে সাজানো হচ্ছে' : 'Structuring procurement requirements into ordered stack'}
            </h3>
          </div>
        )}

        {phase === 3 && (
          <div className="space-y-2 animate-tf-fade-up">
            <div className="flex items-center justify-center space-x-3 text-[11px] font-semibold text-[#21714C] bg-[#EDF7F1] border border-[#B7E2CD] py-1 px-3 rounded-full mx-auto w-fit">
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'নথি চেক' : 'Document Check'}</span>
              </span>
              <span>&bull;</span>
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'মেয়াদ চেক' : 'Expiry Check'}</span>
              </span>
              <span>&bull;</span>
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'ডুপ্লিকেট চেক' : 'Duplicate Check'}</span>
              </span>
            </div>
            <h3 className="text-sm font-semibold text-[#18263B]">
              {lang === 'bn' ? 'নিয়ম মূল্যায়ন ও যাচাইকরণ প্রক্রিয়া চলমান' : 'Deterministic rule evaluation & verification in progress'}
            </h3>
          </div>
        )}

        {phase === 4 && (
          <div className="space-y-1.5 animate-tf-fade-up">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#21714C] text-white text-xs font-bold font-mono rounded-md shadow-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>{lang === 'bn' ? '✓ টেন্ডার প্যাকেজ প্রস্তুত' : 'TENDER PACKAGE READY'}</span>
            </div>
            <h3 className="text-xs text-[#5C6B7E]">
              {lang === 'bn' ? 'কভার পৃষ্ঠা, সংবিধিবদ্ধ সূচিপত্র ও নথিসমূহ সংকলিত' : 'Cover page, statutory index & documents assembled'}
            </h3>
          </div>
        )}

        {phase === 5 && (
          <div className="space-y-1 animate-tf-fade-up">
            <h1 className="text-2xl font-bold tracking-tight text-[#18263B]">TENDERFORGE</h1>
            <p className="text-xs text-[#5C6B7E] font-medium">
              {lang === 'bn' ? 'দরপত্রের নথি প্যাকেজ নির্মাতা' : 'Tender Document Package Builder'}
            </p>
            <span className="text-[10px] text-[#245CC6] font-mono block mt-1">
              {lang === 'bn' ? 'এন্টারপ্রাইজ প্রকিউরমেন্ট ওয়ার্কস্পেসে প্রবেশ করা হচ্ছে...' : 'Entering Enterprise Procurement Workspace...'}
            </span>
          </div>
        )}
      </div>

      {/* Bottom Hint */}
      <div className="relative z-10 pb-6 text-center text-[11px] text-[#5C6B7E] font-mono">
        <span>
          {lang === 'bn'
            ? <>তাৎক্ষণিকভাবে শুরু করতে <kbd className="px-1.5 py-0.5 bg-white border border-[#DEE4EC] rounded text-[10px]">Esc</kbd> চাপুন বা "এড়িয়ে যান" এ ক্লিক করুন</>
            : <>Press <kbd className="px-1.5 py-0.5 bg-white border border-[#DEE4EC] rounded text-[10px]">Esc</kbd> or click Skip to proceed immediately</>}
        </span>
      </div>
    </div>
  );
};
