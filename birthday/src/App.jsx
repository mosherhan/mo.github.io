import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import LoadingScreen from './components/LoadingScreen'
import LandingScene from './components/LandingScene'
import MainExperience from './components/MainExperience'
import CustomCursor from './components/CustomCursor'
import MusicToggle from './components/MusicToggle'

export default function App() {
  const [phase, setPhase] = useState('loading')

  const handleLoadingComplete = useCallback(() => setPhase('landing'), [])
  const handleEnter = useCallback(() => setPhase('experience'), [])

  return (
    <>
      <CustomCursor />

      <AnimatePresence mode="wait">
        {phase === 'loading' && (
          <LoadingScreen key="loading" onComplete={handleLoadingComplete} />
        )}
        {phase === 'landing' && (
          <LandingScene key="landing" onEnter={handleEnter} />
        )}
      </AnimatePresence>

      {phase === 'experience' && <MainExperience />}

      {phase !== 'loading' && <MusicToggle />}
    </>
  )
}
