import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'

/* ─── Floating translucent sphere ─── */

function FloatingSphere({ position, color, scale, speed }) {
  const ref = useRef()
  const offset = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(t * speed + offset) * 0.3
      ref.current.position.x = position[0] + Math.cos(t * speed * 0.7 + offset) * 0.15
      ref.current.rotation.y = t * speed * 0.4
    }
  })

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshPhysicalMaterial
        color={color}
        roughness={0.15}
        transparent
        opacity={0.2}
        emissive={color}
        emissiveIntensity={0.08}
      />
    </mesh>
  )
}

/* ─── Floating ring ─── */

function FloatingRing({ position, color, scale, speed }) {
  const ref = useRef()
  const offset = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (ref.current) {
      ref.current.rotation.x = t * speed * 0.3 + offset
      ref.current.rotation.z = t * speed * 0.2
      ref.current.position.y = position[1] + Math.sin(t * speed + offset) * 0.4
    }
  })

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <torusGeometry args={[1, 0.015, 8, 40]} />
      <meshBasicMaterial color={color} transparent opacity={0.25} />
    </mesh>
  )
}

/* ─── Moon ─── */

function Moon({ position }) {
  const ref = useRef()

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.05
    }
  })

  return (
    <mesh
      ref={ref}
      position={position}
      onClick={() => {
        document.dispatchEvent(
          new CustomEvent('easter-egg', { detail: "Okay cutie, you're really clicking everything." })
        )
      }}
    >
      <sphereGeometry args={[0.6, 24, 24]} />
      <meshStandardMaterial
        color="#FFF7EF"
        emissive="#FFF7EF"
        emissiveIntensity={0.12}
        roughness={0.6}
      />
      <pointLight color="#FFF7EF" intensity={0.15} distance={4} />
    </mesh>
  )
}

/* ─── Floating Objects Group ─── */

const OBJECTS = [
  { type: 'sphere', position: [-3.2, 1.2, -2.5], color: '#F4B8C8', scale: 0.14, speed: 0.35 },
  { type: 'sphere', position: [2.8, -0.6, -3], color: '#C8B8F4', scale: 0.18, speed: 0.28 },
  { type: 'sphere', position: [-1.3, 2.1, -1.5], color: '#FFF7EF', scale: 0.09, speed: 0.45 },
  { type: 'sphere', position: [1.2, 2.6, -4], color: '#F4B8C8', scale: 0.11, speed: 0.32 },
  { type: 'ring', position: [3.2, 1.5, -2.2], color: '#F4B8C8', scale: 0.35, speed: 0.25 },
  { type: 'ring', position: [-2.2, -0.8, -3], color: '#C8B8F4', scale: 0.28, speed: 0.35 },
  { type: 'ring', position: [0.5, -1.8, -2], color: '#FFF7EF', scale: 0.22, speed: 0.4 },
]

export default function FloatingObjects() {
  return (
    <group>
      {OBJECTS.map((obj, i) =>
        obj.type === 'sphere' ? (
          <FloatingSphere key={i} {...obj} />
        ) : (
          <FloatingRing key={i} {...obj} />
        )
      )}
      {/* Moon in upper right */}
      <Moon position={[3.5, 2.5, -5]} />
    </group>
  )
}
