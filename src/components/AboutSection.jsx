import { motion } from 'framer-motion'
import { clipReveal, fadeUp, staggerContainer, easeOut, easeInOut, viewport } from '../lib/animations'

export function AboutSection() {
  return (
    <section id="about" style={{ background: '#f2ede4', padding: 'clamp(5rem, 12vw, 10rem) clamp(1.5rem, 8vw, 7rem)' }}>
      <motion.div variants={staggerContainer(0.12, 0.05)} initial="hidden" whileInView="show" viewport={viewport}>
        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.5, ease: easeOut }}
          style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(8,8,8,0.4)', marginBottom: '2rem', fontWeight: 600 }}
        >
          About Us
        </motion.p>

        {['REDEFINING', 'MARKETING FOR', 'THE DIGITAL AGE'].map((line, i) => (
          <div key={line} style={{ overflow: 'hidden' }}>
            <motion.h2
              variants={clipReveal}
              transition={{ duration: 0.8, ease: easeInOut, delay: i * 0.07 }}
              style={{
                fontSize: 'clamp(2.5rem, 6.5vw, 6.5rem)', fontWeight: 700,
                letterSpacing: '-0.03em', lineHeight: 0.95,
                color: '#080808', textTransform: 'uppercase', margin: 0,
              }}
            >
              {line}
            </motion.h2>
          </div>
        ))}

        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.6, ease: easeOut }}
          style={{ fontSize: '1.05rem', color: 'rgba(8,8,8,0.6)', lineHeight: 1.7, maxWidth: '640px', marginTop: '2.5rem' }}
        >
          BlackWater Marketing is a performance-driven digital marketing agency built for brands that don't settle. We specialize in Meta ad campaigns that actually move the needle — not just run. Creative strategy, conversion optimization, and paid advertising working together so every dollar you spend has a reason to be there.
        </motion.p>
      </motion.div>
    </section>
  )
}
