import { motion } from 'framer-motion'

const CARDS = [
  {
    title: '"Your smile."',
    text: 'Honestly unfair how easily it can make everything better.',
  },
  {
    title: '"Your energy."',
    text: 'Somehow chaotic, adorable and impossible not to love.',
  },
  {
    title: '"You."',
    text: "Just you. That's enough, pretty girl.",
  },
]

const cardVariants = {
  hidden: (i) => ({
    opacity: 0,
    y: 50,
    rotateZ: i % 2 === 0 ? -1.5 : 1.5,
  }),
  visible: (i) => ({
    opacity: 1,
    y: 0,
    rotateZ: i % 2 === 0 ? -0.4 : 0.4,
    transition: {
      duration: 1,
      delay: i * 0.18,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
}

export default function MemoryCards() {
  return (
    <div className="scroll-section" style={{ minHeight: '150vh', paddingTop: '10vh', paddingBottom: '10vh' }}>
      <motion.h2
        className="memory-heading"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
      >
        A little something about you...
      </motion.h2>

      <div className="memory-cards-container">
        {CARDS.map((card, i) => (
          <motion.div
            key={i}
            className="memory-card glass"
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h3 className="memory-card-title">{card.title}</h3>
            <p className="memory-card-text">{card.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
