import { Suspense, useState, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ScrollControls, Scroll, useScroll } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'

import useIsMobile from '../hooks/useIsMobile'
import ParticleField from './ParticleField'
import FloatingObjects from './FloatingObjects'
import InteractiveHeart from './InteractiveHeart'
import BirthdayCake from './BirthdayCake'
import EasterEggs from './EasterEggs'
import HeroSection from './HeroSection'
import HeartSection from './HeartSection'
import MemoryCards from './MemoryCards'
import CakeSection from './CakeSection'
import FinalReveal from './FinalReveal'
import SecretMessage from './SecretMessage'

/* ─── Constellation (appears near final reveal) ─── */

function Constellation() {
  const groupRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const points = useMemo(() => {
    const pts = []
    const steps = 20
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * Math.PI * 2
      const x = 16 * Math.pow(Math.sin(t), 3)
      const y =
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t)
      pts.push(new THREE.Vector3(x * 0.06, y * 0.06, 0))
    }
    return pts
  }, [])

  const meshRef = useRef()

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.elapsedTime

    for (let i = 0; i < points.length; i++) {
      const p = points[i]
      dummy.position.set(
        p.x + Math.sin(t * 0.3 + i) * 0.02,
        p.y + Math.cos(t * 0.4 + i) * 0.02,
        p.z
      )
      dummy.scale.setScalar(0.025 + Math.sin(t * 1.5 + i * 0.5) * 0.008)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true

    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(t * 0.1) * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, points.length]}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#FFF7EF" />
      </instancedMesh>
      <pointLight color="#F4B8C8" intensity={0.3} distance={4} />
    </group>
  )
}

/* ─── Scene Lighting ─── */

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[5, 5, 5]} intensity={0.3} color="#F4B8C8" />
      <pointLight position={[-4, -2, 4]} intensity={0.12} color="#C8B8F4" />
      <pointLight position={[0, 3, 6]} intensity={0.18} color="#FFF7EF" />
    </>
  )
}

/* ─── Camera rig for subtle mouse parallax ─── */

function CameraRig() {
  useFrame(({ camera, pointer }) => {
    camera.position.x += (pointer.x * 0.15 - camera.position.x) * 0.015
  })
  return null
}

/* ─── 3D Scene Content ─── */

function Scene3D({ isMobile }) {
  const { viewport } = useThree()
  const vh = viewport.height

  return (
    <>
      <SceneLighting />
      {!isMobile && <CameraRig />}

      {/* Background particles — span full scroll depth */}
      <ParticleField
        count={isMobile ? 80 : 280}
        spread={22}
        opacity={0.35}
      />

      {/* Page 0: Hero — floating objects */}
      <group position={[0, 0, -2]}>
        <FloatingObjects />
      </group>

      {/* Page 1: Interactive heart */}
      <group position={[0, -vh * 1.25, 0]}>
        <InteractiveHeart />
      </group>

      {/* Easter eggs scattered throughout */}
      <EasterEggs vh={vh} />

      {/* Page 4.5: Birthday cake */}
      <group position={[0, -vh * 4.75, 0]}>
        <BirthdayCake />
      </group>

      {/* Page 6.5: Final constellation */}
      <group position={[0, -vh * 6.5, 0]}>
        <Constellation />
      </group>
    </>
  )
}

/* ─── HTML Content flowing through scroll ─── */

function HTMLContent() {
  return (
    <div style={{ width: '100vw' }}>
      {/* Page 0-1: Hero */}
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <HeroSection />
      </div>

      {/* Page 1-2: Interactive heart text */}
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <HeartSection />
      </div>

      {/* Page 2-2.5: Breathing room */}
      <div style={{ height: '50vh' }} />

      {/* Page 2.5-4: Memory cards */}
      <div style={{ height: '150vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <MemoryCards />
      </div>

      {/* Page 4-4.5: Breathing room */}
      <div style={{ height: '50vh' }} />

      {/* Page 4.5-5.5: Cake */}
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CakeSection />
      </div>

      {/* Page 5.5-6: Breathing room */}
      <div style={{ height: '50vh' }} />

      {/* Page 6-7.5: Final reveal */}
      <div style={{ height: '150vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <FinalReveal />
      </div>

      {/* Page 7.5-8: Secret message */}
      <div style={{ height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <SecretMessage />
      </div>
    </div>
  )
}

/* ─── Main Experience ─── */

export default function MainExperience() {
  const isMobile = useIsMobile()
  const [easterEggToast, setEasterEggToast] = useState(null)

  // Listen for easter egg discoveries
  useEffect(() => {
    const handler = (e) => {
      setEasterEggToast(e.detail)
      setTimeout(() => setEasterEggToast(null), 3000)
    }
    document.addEventListener('easter-egg', handler)
    return () => document.removeEventListener('easter-egg', handler)
  }, [])

  return (
    <motion.div
      className="main-experience"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 65 }}
        dpr={isMobile ? 1 : [1, 1.5]}
        gl={{ antialias: !isMobile, alpha: false }}
      >
        <color attach="background" args={['#08080D']} />
        <fog attach="fog" args={['#08080D', 6, 22]} />

        <Suspense fallback={null}>
          <ScrollControls pages={8} damping={0.25}>
            <Scroll>
              <Scene3D isMobile={isMobile} />
            </Scroll>
            <Scroll html>
              <HTMLContent />
            </Scroll>
          </ScrollControls>
        </Suspense>

        {/* Post-processing: bloom for emissive materials */}
        {!isMobile && (
          <EffectComposer>
            <Bloom
              luminanceThreshold={0.75}
              luminanceSmoothing={0.25}
              intensity={0.35}
              levels={3}
              mipmapBlur
            />
          </EffectComposer>
        )}
      </Canvas>

      {/* Easter egg toast (rendered outside Canvas) */}
      <AnimatePresence>
        {easterEggToast && (
          <motion.div
            className="easter-egg-toast"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {easterEggToast}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
