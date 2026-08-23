import { useRef, useState, useMemo, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

/* ─── Heart Shape Geometry ─── */

function createHeartGeometry() {
  const shape = new THREE.Shape()
  const s = 1

  shape.moveTo(0, s * 0.3)
  shape.bezierCurveTo(s * 0.05, s * 0.45, s * 0.15, s * 0.6, s * 0.4, s * 0.6)
  shape.bezierCurveTo(s * 0.65, s * 0.6, s * 0.8, s * 0.45, s * 0.8, s * 0.25)
  shape.bezierCurveTo(s * 0.8, s * 0.0, s * 0.55, s * -0.25, 0, s * -0.6)
  shape.bezierCurveTo(s * -0.55, s * -0.25, s * -0.8, s * 0.0, s * -0.8, s * 0.25)
  shape.bezierCurveTo(s * -0.8, s * 0.45, s * -0.65, s * 0.6, s * -0.4, s * 0.6)
  shape.bezierCurveTo(s * -0.15, s * 0.6, s * -0.05, s * 0.45, 0, s * 0.3)

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.25,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: 0.06,
    bevelThickness: 0.06,
  })
  geom.center()
  return geom
}

/* ─── Orbiting Mini Particles ─── */

function OrbitingParticles({ count = 12 }) {
  const ref = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const positions = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      angle: (i / count) * Math.PI * 2,
      radius: 1.2 + Math.random() * 0.4,
      speed: 0.3 + Math.random() * 0.2,
      yOffset: (Math.random() - 0.5) * 0.6,
      scale: 0.015 + Math.random() * 0.015,
    }))
  }, [count])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime

    for (let i = 0; i < positions.length; i++) {
      const p = positions[i]
      const angle = p.angle + t * p.speed
      dummy.position.set(
        Math.cos(angle) * p.radius,
        p.yOffset + Math.sin(t * 0.5 + p.angle) * 0.15,
        Math.sin(angle) * p.radius
      )
      dummy.scale.setScalar(p.scale)
      dummy.updateMatrix()
      ref.current.setMatrixAt(i, dummy.matrix)
    }
    ref.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#C8B8F4" transparent opacity={0.6} />
    </instancedMesh>
  )
}

/* ─── Interactive Heart ─── */

export default function InteractiveHeart() {
  const groupRef = useRef()
  const [clicked, setClicked] = useState(false)
  const [hovered, setHovered] = useState(false)

  const heartGeometry = useMemo(() => createHeartGeometry(), [])

  const handleClick = useCallback(() => {
    if (!clicked) {
      setClicked(true)
      document.dispatchEvent(new CustomEvent('heart-clicked'))
    }
  }, [clicked])

  useFrame(({ clock, pointer }) => {
    if (!groupRef.current) return
    const t = clock.elapsedTime

    // Rotate towards pointer
    const targetRotY = pointer.x * 0.5
    const targetRotX = -pointer.y * 0.3
    groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.03
    groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.03

    // Pulse on click
    if (clicked) {
      const pulse = 1 + Math.sin(t * 2.5) * 0.04
      groupRef.current.scale.setScalar(pulse * 1.6)
    } else {
      const s = hovered ? 1.75 : 1.6
      groupRef.current.scale.x += (s - groupRef.current.scale.x) * 0.05
      groupRef.current.scale.y += (s - groupRef.current.scale.y) * 0.05
      groupRef.current.scale.z += (s - groupRef.current.scale.z) * 0.05
    }
  })

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
      <group
        ref={groupRef}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Main heart */}
        <mesh geometry={heartGeometry}>
          <meshPhysicalMaterial
            color="#F4B8C8"
            roughness={0.12}
            metalness={0.08}
            transparent
            opacity={clicked ? 0.6 : 0.4}
            emissive="#F4B8C8"
            emissiveIntensity={clicked ? 0.35 : 0.12}
          />
        </mesh>

        {/* Inner glow */}
        <mesh scale={0.5}>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshStandardMaterial
            color="#F4B8C8"
            emissive="#F4B8C8"
            emissiveIntensity={clicked ? 0.6 : 0.3}
            transparent
            opacity={0.3}
          />
        </mesh>

        {/* Orbiting particles */}
        <OrbitingParticles count={16} />

        {/* Point light */}
        <pointLight
          color="#F4B8C8"
          intensity={clicked ? 1.5 : 0.6}
          distance={5}
        />
      </group>
    </Float>
  )
}
