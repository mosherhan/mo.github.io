import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function SecretMessage() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Button positioned in scroll flow */}
      <div className="scroll-section" style={{ minHeight: '80vh' }}>
        <motion.button
          className="secret-btn"
          onClick={() => setOpen(true)}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.6 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.5 }}
          whileHover={{ opacity: 1, scale: 1.05 }}
          data-interactive
          aria-label="Open secret message"
        >
          One more thing...
        </motion.button>
      </div>

      {/* Modal portaled to document.body so position:fixed works correctly */}
      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              className="secret-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              onClick={() => setOpen(false)}
            >
              <motion.div
                className="secret-modal glass"
                initial={{ opacity: 0, scale: 0.92, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 12 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="close-btn"
                  onClick={() => setOpen(false)}
                  aria-label="Close message"
                  data-interactive
                >
                  ×
                </button>
                <p>Shenaz, I hope you know how special you are.</p>
                <p>Not just today.</p>
                <p>Every day.</p>
                <br />
                <p>Happy birthday, cutie.</p>
                <span className="signature">
                  — from someone who loves you very much ♡
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}
