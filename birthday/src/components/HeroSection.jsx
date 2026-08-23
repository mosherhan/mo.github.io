import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'

export default function HeroSection() {
  const [clicks, setClicks] = useState(0)
  const [egged, setEgged] = useState(false)

  const handleTitleClick = useCallback(() => {
    if (egged) return
    const next = clicks + 1
    setClicks(next)
    if (next >= 5) {
      setEgged(true)
      document.dispatchEvent(
        new CustomEvent('easter-egg', {
          detail: "Fine. You're cute. Happy now?",
        })
      )
    }
  }, [clicks, egged])

  return (
    <div className="scroll-section" style={{ minHeight: '100vh' }}>
      <motion.h1
        className="hero-title"
        onClick={handleTitleClick}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        data-interactive
      >
        Happy Birthday, Shenaz ♡
      </motion.h1>

      <motion.p
        className="hero-subtitle"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{
          duration: 1.3,
          delay: 0.35,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        Today is officially your day, cutie.
      </motion.p>
    </div>
  )
}
