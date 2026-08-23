import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function ParticleField({ count = 300, spread = 15, color = '#F4B8C8', opacity = 0.5 }) {
  const meshRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * spread,
      y: (Math.random() - 0.5) * spread,
      z: (Math.random() - 0.5) * spread,
      speed: Math.random() * 0.25 + 0.08,
      offset: Math.random() * Math.PI * 2,
      scale: Math.random() * 0.03 + 0.008,
    }))
  }, [count, spread])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.elapsedTime

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      dummy.position.set(
        p.x + Math.sin(t * p.speed + p.offset) * 0.25,
        p.y + Math.cos(t * p.speed * 0.8 + p.offset) * 0.2,
        p.z + Math.sin(t * p.speed * 0.5 + p.offset) * 0.1
      )
      const s = p.scale * (1 + Math.sin(t * 1.5 + p.offset) * 0.3)
      dummy.scale.setScalar(s)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </instancedMesh>
  )
}
