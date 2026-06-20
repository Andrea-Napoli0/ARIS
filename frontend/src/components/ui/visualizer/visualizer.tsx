import { useRef, useMemo } from 'react';
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
// SHARED: Parametri modalità
// ==========================================
const MODE_PARAMS = {
  idle:      { speed: 0.5,  waveIntensity: 0.01, breathAmp: 0.01, breathSpeed: 0.2 },
  listening: { speed: 2.0,  waveIntensity: 0.08, breathAmp: 0.05, breathSpeed: 3.0 },
  speaking:  { speed: 5.0,  waveIntensity: 0.18, breathAmp: 0.08, breathSpeed: 6.0 },
  error:     { speed: 12.0, waveIntensity: 0.15, breathAmp: 0.03, breathSpeed: 12.0 },
  thinking:  { speed: 1.0,  waveIntensity: 0.13, breathAmp: 0.09, breathSpeed: 2.0 },
} as const;

// ==========================================
// Shader per l'outer ring ondulato (GPU offload)
// ==========================================

const ringVertShader = `
  uniform float uTime;
  uniform float uSpeed;
  uniform float uWaveIntensity;
  uniform float uBreathAmp;
  uniform float uBreathSpeed;
  uniform float uBaseRadius;
  uniform float uOpacity;
  uniform float uDelay;
  uniform float uBreathScale;

  attribute float aTheta;

  varying float vOpacity;

  void main() {
    float theta = aTheta;
    float t = uTime;

    float tw = t * uSpeed;
    float tw2 = t * uSpeed * 2.1;
    float tw1_3 = t * uSpeed * 1.3;

    float td = (t - uDelay) * uSpeed;
    float td2 = (t - uDelay) * uSpeed * 2.1;
    float td1_3 = (t - uDelay) * uSpeed * 1.3;

    float globalBreath = sin(t * uBreathSpeed) * uBreathAmp;

    float waveA = sin(theta * 5.0 + tw) * 0.4;
    float waveB = cos(theta * 9.0 - tw1_3) * 0.25;
    float waveC = sin(theta * 17.0 + tw2) * 0.12;

    float waveA_d = sin(theta * 5.0 + td) * 0.4;
    float waveB_d = cos(theta * 9.0 - td1_3) * 0.25;
    float waveC_d = sin(theta * 17.0 + td2) * 0.12;

    float envelope = sin(theta * 2.0 + t * 0.5);
    float envScale = 1.0 + envelope * 0.5;

    float displacement = (waveA + waveB + waveC) * uWaveIntensity * envScale;
    float delayedDisplacement = (waveA_d + waveB_d + waveC_d) * uWaveIntensity * envScale;

    float finalDisp = uDelay > 0.0 ? delayedDisplacement : displacement;
    float radius = uBaseRadius + globalBreath * uBreathScale + finalDisp;

    vec3 pos = vec3(cos(theta) * radius, sin(theta) * radius, uDelay > 0.0 ? -0.02 : 0.0);

    vOpacity = uOpacity;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const ringFragShader = `
  uniform vec3 uColor;

  varying float vOpacity;

  void main() {
    gl_FragColor = vec4(uColor, vOpacity);
  }
`;

const RingLine: React.FC<{
  baseRadius: number;
  delay: number;
  breathScale: number;
  opacity: number;
  params: typeof MODE_PARAMS[keyof typeof MODE_PARAMS];
  time: React.MutableRefObject<number>;
  color: string;
}> = ({ baseRadius, delay, breathScale, opacity, params, time, color }) => {
  const ref = useRef<THREE.LineLoop>(null);
  const POINTS = 180;

  const [geometry, uniforms] = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const thetaArr = new Float32Array(POINTS);
    const positions = new Float32Array(POINTS * 3);
    const step = (Math.PI * 2) / POINTS;
    for (let i = 0; i < POINTS; i++) {
      thetaArr[i] = i * step;
      positions[i * 3] = Math.cos(thetaArr[i]) * baseRadius;
      positions[i * 3 + 1] = Math.sin(thetaArr[i]) * baseRadius;
      positions[i * 3 + 2] = delay > 0 ? -0.02 : 0;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aTheta', new THREE.BufferAttribute(thetaArr, 1));

    const u = {
      uTime: { value: 0 },
      uSpeed: { value: params.speed },
      uWaveIntensity: { value: params.waveIntensity },
      uBreathAmp: { value: params.breathAmp },
      uBreathSpeed: { value: params.breathSpeed },
      uBaseRadius: { value: baseRadius },
      uOpacity: { value: opacity },
      uDelay: { value: delay },
      uBreathScale: { value: breathScale },
      uColor: { value: new THREE.Color(color) },
    };

    return [geo, u] as const;
  }, [baseRadius, breathScale, color, delay, opacity, params.breathAmp, params.breathSpeed, params.speed, params.waveIntensity]);

  uniforms.uSpeed.value = params.speed;
  uniforms.uWaveIntensity.value = params.waveIntensity;
  uniforms.uBreathAmp.value = params.breathAmp;
  uniforms.uBreathSpeed.value = params.breathSpeed;
  uniforms.uColor.value.set(color);

  useFrame(() => {
    uniforms.uTime.value = time.current;
  });

  const material = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: ringVertShader,
      fragmentShader: ringFragShader,
      transparent: true,
      depthWrite: false,
    });
    return mat;
  }, [uniforms]);

  return (
    <lineLoop ref={ref} geometry={geometry} material={material} />
  );
};

const ARISOuterRing: React.FC<{ mode:
 ARISMode; color: string }> = ({ mode, color }) => {
  const timeRef = useRef(0);
  const params = MODE_PARAMS[mode];
  const layer1Ref = useRef<THREE.Group>(null);
  const layer2Ref = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    timeRef.current = state.clock.getElapsedTime();
    if (layer1Ref.current) layer1Ref.current.rotation.z += 0.05 * delta;
    if (layer2Ref.current) layer2Ref.current.rotation.z -= 0.03 * delta;
  });

  return (
    <>
      <group ref={layer1Ref}>
        <RingLine baseRadius={2.8} delay={0} breathScale={1.0} opacity={0.9} params={params} time={timeRef} color={color} />
      </group>
      <group ref={layer2Ref}>
        <RingLine baseRadius={2.86} delay={0.08} breathScale={0.9} opacity={0.4} params={params} time={timeRef} color={color} />
      </group>
    </>
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
