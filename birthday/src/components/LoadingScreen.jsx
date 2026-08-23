import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TEXTS = [
  'Preparing something for Shenaz...',
  'Almost there, pookie...',
]

export default function LoadingScreen({ onComplete }) {
  const [textIndex, setTextIndex] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setTextIndex(1), 2000)
    const t2 = setTimeout(onComplete, 3800)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [onComplete])

  return (
    <motion.div
      className="loading-screen"
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      role="status"
      aria-label="Loading"
    >
      {/* Animated heart */}
      <motion.div
        className="loading-heart"
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [0, 1.15, 1],
          opacity: 1,
        }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="#F4B8C8"
            fillOpacity="0.85"
          />
        </svg>
      </motion.div>

      {/* Loading text with crossfade */}
      <div style={{ height: '1.2em', position: 'relative' }}>
        <AnimatePresence mode="wait">
          <motion.p
            className="loading-text"
            key={textIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 0.7, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {TEXTS[textIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
