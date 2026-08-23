import { useRef, useState, useCallback, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'

/* ─── Clickable Easter Egg Star ─── */

function EasterEggStar({ position, message }) {
  const ref = useRef()
  const [discovered, setDiscovered] = useState(false)

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.elapsedTime
      ref.current.rotation.y = t * 0.5
      ref.current.rotation.z = Math.sin(t * 0.3) * 0.25
      // Gentle pulsing glow
      const pulse = 1 + Math.sin(t * 2) * 0.15
      ref.current.scale.setScalar(discovered ? 0.07 * pulse : 0.045 * pulse)
    }
  })

  const handleClick = useCallback(
    (e) => {
      e.stopPropagation()
      if (!discovered) {
        setDiscovered(true)
        document.dispatchEvent(
          new CustomEvent('easter-egg', { detail: message })
        )
      }
    },
    [discovered, message]
  )

  return (
    <mesh ref={ref} position={position} onClick={handleClick}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={discovered ? '#C8B8F4' : '#F4B8C8'}
        emissive={discovered ? '#C8B8F4' : '#F4B8C8'}
        emissiveIntensity={discovered ? 0.5 : 0.2}
        transparent
        opacity={0.7}
      />
    </mesh>
  )
}

/* ─── Hidden Heart Easter Egg ─── */

function HiddenHeart({ position, message }) {
  const ref = useRef()
  const [discovered, setDiscovered] = useState(false)

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = Math.sin(clock.elapsedTime * 0.4) * 0.2
      ref.current.position.y =
        position[1] + Math.sin(clock.elapsedTime * 0.3) * 0.15
    }
  })

  const handleClick = useCallback(
    (e) => {
      e.stopPropagation()
      if (!discovered) {
        setDiscovered(true)
        document.dispatchEvent(
          new CustomEvent('easter-egg', { detail: message })
        )
      }
    },
    [discovered, message]
  )

  return (
    <mesh ref={ref} position={position} scale={0.04} onClick={handleClick}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        color="#F4B8C8"
        emissive="#F4B8C8"
        emissiveIntensity={discovered ? 0.6 : 0.15}
        transparent
        opacity={discovered ? 0.8 : 0.35}
      />
    </mesh>
  )
}

/* ─── Easter Eggs scattered through the scene ─── */

export default function EasterEggs({ vh }) {
  const vhSafe = vh || 6

  return (
    <>
      {/* Star near hero section */}
      <EasterEggStar
        position={[3.5, -vhSafe * 0.4, -1.5]}
        message="Found me, pookie ♡"
      />

      {/* Star near memory cards */}
      <EasterEggStar
        position={[-3, -vhSafe * 2.8, -2]}
        message="I knew you'd find this."
      />

      {/* Hidden heart near cake */}
      <HiddenHeart
        position={[-2.5, -vhSafe * 5.2, -1]}
        message="You're really looking everywhere, huh? ♡"
      />
    </>
  )
}
