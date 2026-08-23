import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function HeartSection() {
  const [clicked, setClicked] = useState(false)

  useEffect(() => {
    const handler = () => setClicked(true)
    document.addEventListener('heart-clicked', handler)
    return () => document.removeEventListener('heart-clicked', handler)
  }, [])

  return (
    <div className="scroll-section heart-section" style={{ minHeight: '100vh' }}>
      <AnimatePresence mode="wait">
        {!clicked ? (
          <motion.p
            key="hint"
            className="heart-hint"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.5 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
          >
            (try clicking the heart)
          </motion.p>
        ) : (
          <motion.div
            key="revealed"
            style={{ textAlign: 'center' }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="heart-message">For my favorite person.</h2>
            <p className="heart-submessage">my love ♡</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
