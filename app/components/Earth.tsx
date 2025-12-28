"use client";
import { useRef, Suspense, useMemo, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// Convert lat/lng to 3D position on sphere
function latLngToVector3(
  lat: number,
  lng: number,
  radius: number
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

// Location marker component (just the pin, no label)
function LocationMarker({
  lat,
  lng,
  radius,
}: {
  lat: number;
  lng: number;
  radius: number;
}) {
  const markerRef = useRef<THREE.Group>(null);
  const position = useMemo(
    () => latLngToVector3(lat, lng, radius),
    [lat, lng, radius]
  );

  useFrame(({ clock }) => {
    if (markerRef.current) {
      // Pulse effect
      const scale = 1 + Math.sin(clock.getElapsedTime() * 3) * 0.2;
      markerRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={position}>
      <group ref={markerRef}>
        {/* Glowing pin */}
        <mesh>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
        {/* Outer glow ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.1, 0.15, 32]} />
          <meshBasicMaterial
            color="#22c55e"
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Pulse ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.18, 0.22, 32]} />
          <meshBasicMaterial
            color="#22c55e"
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
}

function EarthSphere({ targetRotation }: { targetRotation: number | null }) {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  // India longitude to rotation angle - start with India facing camera
  const indiaInitialRotation = -((77.209 + 180) * Math.PI) / 180 + Math.PI / 2;
  const currentRotation = useRef(indiaInitialRotation);

  // Load textures
  const [earthMap, earthBump, earthSpec, cloudsMap, earthNight] = useLoader(
    THREE.TextureLoader,
    [
      "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg",
      "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg",
      "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg",
      "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png",
      "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_lights_2048.png",
    ]
  );

  useFrame(() => {
    if (groupRef.current) {
      if (targetRotation !== null) {
        // Smoothly rotate to target
        const diff = targetRotation - currentRotation.current;
        currentRotation.current += diff * 0.02;
        groupRef.current.rotation.y = currentRotation.current;
      } else {
        // Normal slow rotation starting from India position
        currentRotation.current += 0.001;
        groupRef.current.rotation.y = currentRotation.current;
      }
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0003;
    }
  });

  // India coordinates (approximately New Delhi)
  const indiaLat = 28.6139;
  const indiaLng = 77.209;

  return (
    <group ref={groupRef}>
      {/* Earth */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          map={earthMap}
          bumpMap={earthBump}
          bumpScale={0.05}
          roughnessMap={earthSpec}
          roughness={0.8}
          metalness={0.1}
          emissiveMap={earthNight}
          emissive={new THREE.Color(0xffff88)}
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Clouds */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[2.02, 64, 64]} />
        <meshStandardMaterial
          map={cloudsMap}
          transparent={true}
          opacity={0.35}
          depthWrite={false}
        />
      </mesh>

      {/* Location marker - India */}
      <LocationMarker lat={indiaLat} lng={indiaLng} radius={2.05} />

      {/* Atmosphere glow */}
      <mesh ref={atmosphereRef} scale={[1.12, 1.12, 1.12]}>
        <sphereGeometry args={[2, 64, 64]} />
        <shaderMaterial
          transparent={true}
          side={THREE.BackSide}
          uniforms={{
            glowColor: { value: new THREE.Color(0x4da6ff) },
          }}
          vertexShader={`
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            varying vec3 vNormal;
            uniform vec3 glowColor;
            void main() {
              float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
              gl_FragColor = vec4(glowColor, 1.0) * intensity * 0.7;
            }
          `}
        />
      </mesh>
    </group>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[2, 32, 32]} />
      <meshBasicMaterial color="#0a1628" transparent opacity={0.3} />
    </mesh>
  );
}

export default function Earth() {
  const [targetRotation] = useState<number | null>(null);

  return (
    <div
      className="w-full h-full relative flex items-center justify-center"
      style={{ background: "transparent" }}
    >
      {/* Full Stack Developer Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none flex flex-col items-center">
        <div
          className="font-medium italic text-xl md:text-2xl lg:text-3xl whitespace-nowrap select-none tracking-wider mb-1 text-white/80"
          style={{
            fontFamily: "system-ui, sans-serif",
          }}
        >
          I&apos;m a
        </div>
        <div
          className="font-extrabold italic text-3xl md:text-5xl lg:text-6xl whitespace-nowrap select-none tracking-wider"
          style={{
            textShadow:
              "0 0 30px rgba(249,115,22,0.5), 0 0 60px rgba(249,115,22,0.3)",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <span className="text-white">FULL STACK </span>
          <span className="text-orange-500">DEVELOPER</span>
        </div>
        <div
          className="font-extrabold italic text-2xl md:text-4xl lg:text-5xl whitespace-nowrap select-none tracking-wider mt-2"
          style={{
            textShadow:
              "0 0 30px rgba(255,255,255,0.3), 0 0 60px rgba(255,255,255,0.2)",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <span className="text-orange-500">SOFTWARE </span>
          <span className="text-white">ENGINEER</span>
        </div>
      </div>

      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        style={{ background: "transparent", width: "100%", height: "100%" }}
        dpr={[1, 2]}
      >
        {/* Brighter Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[5, 3, 5]}
          intensity={2.5}
          color="#ffffff"
        />
        <directionalLight
          position={[-3, 2, -3]}
          intensity={1.0}
          color="#87ceeb"
        />
        <pointLight position={[0, 5, 0]} intensity={0.8} color="#ffffff" />

        <Suspense fallback={<LoadingFallback />}>
          <EarthSphere targetRotation={targetRotation} />
        </Suspense>

        {/* Allow interaction */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}
