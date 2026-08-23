import { useRef, useState, useMemo, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'

/* ─── Single Candle ─── */

function Candle({ position, lit }) {
  const flameRef = useRef()

  useFrame(({ clock }) => {
    if (flameRef.current && lit) {
      const t = clock.elapsedTime
      flameRef.current.scale.y = 1 + Math.sin(t * 10 + position[0] * 5) * 0.25
      flameRef.current.scale.x = 1 + Math.cos(t * 8 + position[2] * 3) * 0.12
    }
  })

  return (
    <group position={position}>
      {/* Candle body */}
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.28, 8]} />
        <meshStandardMaterial color="#FFF7EF" roughness={0.3} />
      </mesh>

      {/* Flame */}
      {lit && (
        <group ref={flameRef} position={[0, 0.32, 0]}>
          <mesh>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshBasicMaterial color="#FFD090" />
          </mesh>
          <mesh scale={0.6} position={[0, 0.015, 0]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshBasicMaterial color="#FFF7EF" transparent opacity={0.7} />
          </mesh>
          <pointLight color="#FFD090" intensity={0.25} distance={1.2} />
        </group>
      )}

      {/* Smoke (when blown out) */}
      {!lit && (
        <mesh position={[0, 0.35, 0]}>
          <sphereGeometry args={[0.015, 6, 6]} />
          <meshBasicMaterial color="#888888" transparent opacity={0.15} />
        </mesh>
      )}
    </group>
  )
}

/* ─── Birthday Cake ─── */

export default function BirthdayCake() {
  const [candlesLit, setCandlesLit] = useState(true)
  const groupRef = useRef()

  const candlePositions = useMemo(() => {
    const positions = []
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2 - Math.PI / 2
      const r = 0.18
      positions.push([Math.cos(angle) * r, 0.55, Math.sin(angle) * r])
    }
    return positions
  }, [])

  const handleClick = useCallback(() => {
    if (candlesLit) {
      setCandlesLit(false)
      document.dispatchEvent(new CustomEvent('cake-blown'))
    }
  }, [candlesLit])

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.15) * 0.12
    }
  })

  return (
    <group ref={groupRef} onClick={handleClick} position={[0, -0.3, 0]}>
      {/* Base plate */}
      <mesh position={[0, -0.22, 0]}>
        <cylinderGeometry args={[0.85, 0.85, 0.04, 32]} />
        <meshStandardMaterial color="#1a1520" roughness={0.2} metalness={0.3} />
      </mesh>

      {/* Bottom tier */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.65, 0.68, 0.38, 32]} />
        <meshStandardMaterial color="#FFF7EF" roughness={0.35} />
      </mesh>

      {/* Middle tier */}
      <mesh position={[0, 0.27, 0]}>
        <cylinderGeometry args={[0.47, 0.5, 0.28, 32]} />
        <meshStandardMaterial color="#FFF0E5" roughness={0.35} />
      </mesh>

      {/* Top tier */}
      <mesh position={[0, 0.48, 0]}>
        <cylinderGeometry args={[0.32, 0.34, 0.22, 32]} />
        <meshStandardMaterial color="#FFF7EF" roughness={0.3} />
      </mesh>

      {/* Decorative rings */}
      <mesh position={[0, 0.14, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.66, 0.012, 8, 32]} />
        <meshStandardMaterial
          color="#F4B8C8"
          emissive="#F4B8C8"
          emissiveIntensity={0.15}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0, 0.38, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.48, 0.01, 8, 32]} />
        <meshStandardMaterial
          color="#C8B8F4"
          emissive="#C8B8F4"
          emissiveIntensity={0.15}
          roughness={0.2}
        />
      </mesh>

      {/* Small flower decorations on bottom tier */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i / 4) * Math.PI * 2
        return (
          <mesh
            key={`flower-${i}`}
            position={[Math.cos(angle) * 0.62, 0.08, Math.sin(angle) * 0.62]}
            scale={0.035}
          >
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#F4B8C8' : '#C8B8F4'}
              emissive={i % 2 === 0 ? '#F4B8C8' : '#C8B8F4'}
              emissiveIntensity={0.3}
            />
          </mesh>
        )
      })}

      {/* Candles */}
      {candlePositions.map((pos, i) => (
        <Candle key={i} position={pos} lit={candlesLit} />
      ))}

      {/* Ambient glow */}
      <pointLight
        position={[0, 0.6, 0]}
        color={candlesLit ? '#FFD090' : '#F4B8C8'}
        intensity={candlesLit ? 0.4 : 0.1}
        distance={3}
      />
    </group>
  )
}
