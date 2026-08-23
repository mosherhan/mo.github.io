import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CakeSection() {
  const [blown, setBlown] = useState(false)

  useEffect(() => {
    const handler = () => setBlown(true)
    document.addEventListener('cake-blown', handler)
    return () => document.removeEventListener('cake-blown', handler)
  }, [])

  return (
    <div className="scroll-section" style={{ minHeight: '100vh' }}>
      <AnimatePresence mode="wait">
        {!blown ? (
          <motion.div
            key="wish"
            style={{ textAlign: 'center' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="cake-title">Make a wish, Shenaz.</h2>
            <p className="cake-instruction">(click the candles)</p>
          </motion.div>
        ) : (
          <motion.div
            key="granted"
            style={{ textAlign: 'center' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="cake-wish">
              I hope this year gives you everything you secretly wish for.
            </p>
            <p className="cake-wish-sub">You deserve it, my love.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
