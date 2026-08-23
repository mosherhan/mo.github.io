import { motion } from 'framer-motion'

const lines = [
  { text: 'And one last thing...', className: 'final-text', delay: 0 },
  { text: 'Happy Birthday, Shenaz.', className: 'final-text-large', delay: 0.6 },
  { text: 'Stay exactly as wonderful as you are.', className: 'final-text', delay: 1.2 },
  { text: 'Love you, pookie ♡', className: 'final-text-accent', delay: 1.8 },
]

export default function FinalReveal() {
  return (
    <div className="scroll-section" style={{ minHeight: '140vh', paddingTop: '10vh' }}>
      <div className="final-section">
        {lines.map((line, i) => (
          <motion.p
            key={i}
            className={line.className}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{
              duration: 1.8,
              delay: line.delay,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {line.text}
          </motion.p>
        ))}
      </div>
    </div>
  )
}
