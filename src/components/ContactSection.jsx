import { motion } from 'framer-motion'
import { clipReveal, fadeUp, staggerContainer, easeOut, easeInOut, viewport } from '../lib/animations'
import { LiquidButton } from './ui/LiquidButton'

export function ContactSection() {
  return (
    <section id="contact" style={{ background: '#080808', padding: 'clamp(5rem, 14vw, 12rem) clamp(1.5rem, 8vw, 7rem)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <motion.div variants={staggerContainer(0.1, 0.05)} initial="hidden" whileInView="show" viewport={viewport}>
        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.5, ease: easeOut }}
          style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '2rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.75rem' }}
        >
          <span style={{ display: 'block', width: '20px', height: '1px', background: 'rgba(255,255,255,0.18)' }} />
          Let's Work Together
        </motion.p>

        {['CONTACT', 'US'].map((line, i) => (
          <div key={line} style={{ overflow: 'hidden' }}>
            <motion.h2
              variants={clipReveal}
              transition={{ duration: 0.9, ease: easeInOut, delay: i * 0.1 }}
              style={{
                fontSize: 'clamp(4rem, 12vw, 13rem)', fontWeight: 700,
                letterSpacing: '-0.04em', lineHeight: 0.88,
                color: '#ffffff', textTransform: 'uppercase', margin: 0,
              }}
            >
              {line}
            </motion.h2>
          </div>
        ))}

        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.5, ease: easeOut }}
          style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '3.5rem' }}
        >
          <LiquidButton href="https://calendly.com/blkwtrenterprises/30min" target="_blank" rel="noopener noreferrer">
            Book a Call →
          </LiquidButton>
          <LiquidButton href="mailto:blkwtrenterprises@gmail.com">
            Send an Email
          </LiquidButton>
        </motion.div>
      </motion.div>

      <div style={{ marginTop: '6rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em' }}>© 2025 BlackWater Marketing. All rights reserved.</p>
        <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em' }}>Powered by Performance</p>
      </div>
    </section>
  )
}
