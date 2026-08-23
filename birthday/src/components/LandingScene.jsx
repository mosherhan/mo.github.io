import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { motion } from 'framer-motion'
import ParticleField from './ParticleField'
import useIsMobile from '../hooks/useIsMobile'

/* ─── Floating Glass Orb ─── */

function LandingOrb() {
  const outerRef = useRef()
  const innerRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (outerRef.current) {
      outerRef.current.rotation.y = t * 0.12
      outerRef.current.rotation.x = Math.sin(t * 0.08) * 0.15
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.25
    }
  })

  return (
    <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.6}>
      <group ref={outerRef}>
        {/* Outer translucent sphere */}
        <mesh>
          <icosahedronGeometry args={[1.15, 3]} />
          <meshPhysicalMaterial
            color="#F4B8C8"
            roughness={0.12}
            metalness={0.05}
            transparent
            opacity={0.2}
            emissive="#F4B8C8"
            emissiveIntensity={0.08}
            wireframe
          />
        </mesh>

        {/* Solid inner core */}
        <mesh ref={innerRef} scale={0.4}>
          <icosahedronGeometry args={[1, 2]} />
          <meshStandardMaterial
            color="#F4B8C8"
            emissive="#F4B8C8"
            emissiveIntensity={0.35}
            transparent
            opacity={0.55}
          />
        </mesh>

        {/* Inner glow sphere */}
        <mesh scale={0.25}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color="#FFF7EF" transparent opacity={0.2} />
        </mesh>

        {/* Orbiting ring */}
        <mesh rotation={[Math.PI / 3, 0.4, 0]}>
          <torusGeometry args={[1.55, 0.008, 8, 64]} />
          <meshBasicMaterial color="#C8B8F4" transparent opacity={0.35} />
        </mesh>

        {/* Second ring */}
        <mesh rotation={[Math.PI / 2, 0, Math.PI / 5]}>
          <torusGeometry args={[1.7, 0.005, 8, 64]} />
          <meshBasicMaterial color="#F4B8C8" transparent opacity={0.2} />
        </mesh>

        {/* Point light inside */}
        <pointLight color="#F4B8C8" intensity={0.6} distance={6} />
      </group>
    </Float>
  )
}

/* ─── Scene Lighting ─── */

function LandingLights() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[5, 5, 5]} intensity={0.35} color="#F4B8C8" />
      <pointLight position={[-4, -3, 4]} intensity={0.15} color="#C8B8F4" />
      <pointLight position={[0, 2, 5]} intensity={0.2} color="#FFF7EF" />
    </>
  )
}

/* ─── Landing Scene ─── */

export default function LandingScene({ onEnter }) {
  const isMobile = useIsMobile()

  return (
    <motion.div
      className="landing-wrapper"
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={isMobile ? 1 : [1, 1.5]}
        gl={{ antialias: !isMobile, alpha: false }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <color attach="background" args={['#08080D']} />
        <fog attach="fog" args={['#08080D', 4, 16]} />
        <LandingLights />
        <LandingOrb />
        <ParticleField count={isMobile ? 100 : 220} spread={14} opacity={0.4} />
      </Canvas>

      {/* Text overlay */}
      <div className="landing-overlay">
        <motion.h1
          className="landing-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
        >
          Hey, Shenaz.
        </motion.h1>

        <motion.p
          className="landing-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          I made something for you.
        </motion.p>

        <motion.p
          className="landing-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.55 }}
          transition={{ delay: 1.9, duration: 1 }}
        >
          Come a little closer, pookie.
        </motion.p>

        <motion.button
          className="enter-btn"
          onClick={onEnter}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          data-interactive
          aria-label="Enter the experience"
        >
          Enter ✦
        </motion.button>
      </div>
    </motion.div>
  )
}
