import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Icosahedron, Ring, Torus } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useARISMode, type ARISMode} from '@/store/ArisStore';

interface HologramUIProps {
  mode: ARISMode;
  color: string;
}

// ==========================================
// 1. COMPONENTE: NUBE DI PARTICELLE FLUIDE (Video Accurate)
// ==========================================
// Aggiorna solo il componente ARISParticles nel tuo codice precedente
const ARISParticles: React.FC<{ mode: ARISMode; color: string }> = ({ mode, color }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 0; // AUMENTATO: Più densità per l'effetto nebulosa

  const baseData = useMemo(() => {
    const data = new Float32Array(count * 4);
    for (let i = 0; i < count; i++) {
      // CONFINAMENTO RIGIDO: Raggio tra 0.8 (nucleo) e 2.7 (limite interno dell'outer ring)
      const radius = 0.8 + Math.random() * 1.9; 
      const theta = Math.random() * Math.PI * 2;
      const z = (Math.random() - 0.5) * 0.4;
      
      data[i * 4 + 0] = radius;
      data[i * 4 + 1] = theta;
      data[i * 4 + 2] = z;
      data[i * 4 + 3] = Math.random();
    }
    return data;
  }, []);

  const positions = useMemo(() => new Float32Array(count * 3), []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (!pointsRef.current) return;

    const p = pointsRef.current.geometry.attributes.position.array as Float32Array;

    // Parametri dinamici sincronizzati
    let speed = .5; let waveIntensity = 0.01; let breathAmp = 0.01; let breathSpeed = 0.2;
    if (mode === 'listening') { speed = 2.0; waveIntensity = 0.08; breathAmp = 0.05; breathSpeed = 3.0; }
    else if (mode === 'speaking') { speed = 5.0; waveIntensity = 0.18; breathAmp = 0.08; breathSpeed = 6.0; }
    else if (mode === 'error') { speed = 12.0; waveIntensity = 0.15; breathAmp = 0.03; breathSpeed = 12.0; }
    else if (mode === 'thinking') { speed = 1.0; waveIntensity = 0.13; breathAmp = 0.09; breathSpeed = 2.0; }

    const globalBreath = Math.sin(t * breathSpeed) * breathAmp;

    for (let i = 0; i < count; i++) {
      const rBase = baseData[i * 4 + 0];
      const theta = baseData[i * 4 + 1];
      
      // Calcolo della deformazione armonica
      const wave = (Math.sin(theta * 5 + t * speed) * 0.4 + Math.cos(theta * 9 - t * speed * 1.3) * 0.25) * waveIntensity;
      
      // Confinamento: Le particelle vicino al centro (0.8) non si muovono, quelle vicine all'anello (2.7) seguono l'onda
      const influence = (rBase - 0.8) / 1.9; 
      const rCurrent = rBase + (globalBreath + wave) * influence;

      p[i * 3 + 0] = Math.cos(theta) * rCurrent;
      p[i * 3 + 1] = Math.sin(theta) * rCurrent;
      p[i * 3 + 2] = baseData[i * 4 + 2] + Math.sin(t * 2 + baseData[i * 4 + 3] * 10) * 0.02;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.rotation.z += delta * 0.03;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial 
        size={0.02} // Particelle leggermente più piccole per mantenere pulita la densità
        color={color} 
        transparent 
        opacity={0.4} 
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
// ==========================================
// 2. COMPONENTE: DOPPIO ANELLO ONDULATO CONTENUTO
// ==========================================
const ARISOuterRing: React.FC<{ mode: ARISMode; color: string }> = ({ mode, color }) => {
  const layer1Ref = useRef<THREE.LineLoop>(null);
  const layer2Ref = useRef<THREE.LineLoop>(null);
  const pointsCount = 180;

  const [pos1, pos2] = useMemo(() => [
    new Float32Array(pointsCount * 3),
    new Float32Array(pointsCount * 3)
  ], [pointsCount]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (!layer1Ref.current || !layer2Ref.current) return;

    const p1 = layer1Ref.current.geometry.attributes.position.array as Float32Array;
    const p2 = layer2Ref.current.geometry.attributes.position.array as Float32Array;

    let speed = 0.0;          
    let waveIntensity = 0.0; 
    let breathAmp = 0.0;     
    let breathSpeed = 0.0;    

    if (mode === 'listening') {
      speed = 2.0; waveIntensity = 0.08; breathAmp = 0.05; breathSpeed = 3.0;
    } else if (mode === 'speaking') {
      speed = 5.0; waveIntensity = 0.18; breathAmp = 0.08; breathSpeed = 6.0;
    } else if (mode === 'error') {
      speed = 12.0; waveIntensity = 0.15; breathAmp = 0.03; breathSpeed = 12.0;
    } else if (mode === 'thinking') { speed = 1.0; waveIntensity = 0.13; breathAmp = 0.09; breathSpeed = 2.0; }

    const baseRadius1 = 2.8;
    const baseRadius2 = 2.86; 
    const globalBreath = Math.sin(t * breathSpeed) * breathAmp;

    for (let i = 0; i < pointsCount; i++) {
      const theta = (i / pointsCount) * Math.PI * 2;

      const waveA = Math.sin(theta * 5 + t * speed) * 0.4;
      const waveB = Math.cos(theta * 9 - t * speed * 1.3) * 0.25;
      const waveC = Math.sin(theta * 17 + t * speed * 2.1) * 0.12;
      
      const envelope = Math.sin(theta * 2 + t * 0.5); 
      const totalDisplacement = (waveA + waveB + waveC) * waveIntensity * (1.0 + envelope * 0.5);

      const r1 = baseRadius1 + globalBreath + totalDisplacement;
      p1[i * 3] = Math.cos(theta) * r1;
      p1[i * 3 + 1] = Math.sin(theta) * r1;
      p1[i * 3 + 2] = 0;

      const delayedDisplacement = (
        Math.sin(theta * 5 + (t - 0.08) * speed) * 0.4 + 
        Math.cos(theta * 9 - (t - 0.08) * speed * 1.3) * 0.25 + 
        Math.sin(theta * 17 + (t - 0.08) * speed * 2.1) * 0.12
      ) * waveIntensity * (1.0 + envelope * 0.5);

      const r2 = baseRadius2 + (globalBreath * 0.9) + delayedDisplacement;
      p2[i * 3] = Math.cos(theta) * r2;
      p2[i * 3 + 1] = Math.sin(theta) * r2;
      p2[i * 3 + 2] = -0.02;
    }

    layer1Ref.current.geometry.attributes.position.needsUpdate = true;
    layer2Ref.current.geometry.attributes.position.needsUpdate = true;

    layer1Ref.current.rotation.z += delta * 0.05;
    layer2Ref.current.rotation.z -= delta * 0.03;
  });

  return (
    <group>
      <lineLoop ref={layer1Ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={pointsCount} array={pos1} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.9} linewidth={2} />
      </lineLoop>

      <lineLoop ref={layer2Ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={pointsCount} array={pos2} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.4} linewidth={1} />
      </lineLoop>
    </group>
  );
};

// ==========================================
// 3. COMPONENTE: STRUTTURA CENTRALE INTERNA
// ==========================================
const HologramUI: React.FC<HologramUIProps> = ({ mode, color }) => {
  const coreRef = useRef<THREE.Mesh>(null);
  const midRingsRef = useRef<THREE.Group>(null);
  const subRingRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const speedMultiplier = mode === 'speaking' ? 2.2 : mode === 'listening' ? 1.6 : mode === 'error' ? 0.4 : mode === "thinking" ? 0.6 : 0.1;

    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.25 * speedMultiplier;
      coreRef.current.rotation.x = Math.sin(t * 0.5) * 0.1;
      const coreScale = mode === 'speaking' ? 1 + Math.abs(Math.sin(t * 10)) * 0.05 : 1 + Math.sin(t * 2) * 0.02;
      coreRef.current.scale.setScalar(coreScale);
    }
    
    if (midRingsRef.current) {
      midRingsRef.current.rotation.z -= delta * 0.2 * speedMultiplier;
      midRingsRef.current.rotation.x = Math.sin(t * 0.6) * 0.05;
    }
    
    if (subRingRef.current) {
      subRingRef.current.rotation.z -= delta * 0.4 * speedMultiplier;
    }
  });

  return (
    <group>
      <Icosahedron ref={coreRef} args={[0.9, 3]}>
        <meshBasicMaterial color={color} wireframe transparent opacity={0.4} />
      </Icosahedron>

      <group ref={midRingsRef}>
        <Torus args={[1.3, 0.006, 8, 80]}>
          <meshBasicMaterial color={color} transparent opacity={0.25} />
        </Torus>
        <Torus args={[1.55, 0.04, 3, 30]} >
          <meshBasicMaterial color={color} wireframe transparent opacity={0.1} />
        </Torus>
      </group>

      <Ring ref={subRingRef} args={[2.1, 2.11, 40]}>
        <meshBasicMaterial color={color} wireframe transparent opacity={0.15} />
      </Ring>

      {/* COMPONENTI DEL VIDEO */}
      <ARISParticles mode={mode} color={color} />
      <ARISOuterRing mode={mode} color={color} />
    </group>
  );
};

// ==========================================
// MAIN CONTENT & CONTROLLI
// ==========================================
export default function Visualizer() {
  const mode = useARISMode((state) => state.mode)
  const setMode = useARISMode((state) => state.setMode)

  const themeColor = mode === 'error' ? '#ff2a2a' : mode === 'thinking' ? '#0090ff' : '#00e5ff';
  const bgColor = mode === 'error' ? '#080101' : '#000407';

  return (
    <div 
      className="relative w-full h-screen flex justify-center items-center overflow-hidden transition-colors duration-700"
      style={{ backgroundColor: bgColor }}
    >
      {import.meta.env.DEV && (
        <div 
          className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50 bg-black/60 backdrop-blur-xl p-4 rounded-xl border transition-colors duration-500"
          style={{ borderColor: `${themeColor}22` }}
        >
          <div 
            className="text-[9px] font-mono tracking-widest text-center opacity-50 mb-2 font-bold transition-colors duration-500" 
            style={{ color: themeColor }}
          >
            JARVIS_FULL_SYSTEM
          </div>
          
          {(['idle', 'listening', 'speaking', 'error', 'thinking'] as ARISMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="px-4 py-2 rounded-lg border text-[11px] uppercase tracking-widest font-mono transition-all duration-300 w-36 text-left hover:bg-white/5"
              style={{
                backgroundColor: mode === m ? themeColor : 'transparent',
                color: mode === m ? '#000000' : `${themeColor}cc`,
                borderColor: mode === m ? themeColor : `${themeColor}33`,
                fontWeight: mode === m ? 'bold' : 'normal',
                boxShadow: mode === m ? `0 0 25px ${themeColor}55` : 'none'
              }}
            >
              {m === mode ? `> ${m}` : `  ${m}`}
            </button>
          ))}
        </div>
      )}

      <Canvas camera={{ position: [0, 0, 7.0], fov: 60 }}>
        <HologramUI mode={mode} color={themeColor} />
        
        <EffectComposer enableNormalPass>
          <Bloom 
            luminanceThreshold={0.05} 
            luminanceSmoothing={0.9} 
            intensity={mode === 'error' ? 2.5 : 1.8} 
            mipmapBlur 
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}