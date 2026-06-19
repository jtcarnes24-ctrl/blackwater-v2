import { motion } from 'framer-motion'
import { clipReveal, fadeUp, staggerContainer, easeOut, easeInOut, viewport } from '../lib/animations'
import { LiquidButton } from './ui/LiquidButton'
import { InfiniteGrid } from './ui/InfiniteGrid'

export function ContactSection() {
  return (
    <section id="contact" style={{ background: '#C8D746', padding: 'clamp(5rem, 14vw, 12rem) clamp(1.5rem, 8vw, 7rem)', borderTop: '1px solid rgba(8,8,8,0.1)', position: 'relative', overflow: 'hidden' }}>
      <InfiniteGrid color="rgba(0,0,0,1)" />
      <div style={{ position: 'relative', zIndex: 1 }}>
      <motion.div variants={staggerContainer(0.1, 0.05)} initial="hidden" whileInView="show" viewport={viewport}>
        {['CONTACT', 'US'].map((line, i) => (
          <div key={line} style={{ overflow: 'hidden' }}>
            <motion.h2
              variants={clipReveal}
              transition={{ duration: 0.9, ease: easeInOut, delay: i * 0.1 }}
              style={{
                fontSize: 'clamp(4rem, 12vw, 13rem)', fontWeight: 700,
                letterSpacing: '-0.04em', lineHeight: 0.88,
                color: '#080808', textTransform: 'uppercase', margin: 0,
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
          <LiquidButton href="https://calendly.com/blkwtrenterprises/30min" target="_blank" rel="noopener noreferrer" style={{ color: '#C8D746', borderColor: '#080808', background: '#080808' }}>
            Book a Call →
          </LiquidButton>
          <LiquidButton href="mailto:blkwtrenterprises@gmail.com" style={{ color: '#080808', borderColor: 'rgba(8,8,8,0.35)' }}>
            Send an Email
          </LiquidButton>
        </motion.div>
      </motion.div>

      <div style={{ marginTop: '6rem', paddingTop: '2rem', borderTop: '1px solid rgba(8,8,8,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <p style={{ fontSize: '0.72rem', color: 'rgba(8,8,8,0.35)', letterSpacing: '0.1em' }}>© 2025 BlackWater Marketing. All rights reserved.</p>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <p style={{ fontSize: '0.72rem', color: 'rgba(8,8,8,0.35)', letterSpacing: '0.1em' }}>Powered by Performance</p>
          <a href="/privacy.html" style={{ fontSize: '0.72rem', color: 'rgba(8,8,8,0.5)', letterSpacing: '0.1em', textDecoration: 'none', borderBottom: '1px solid rgba(8,8,8,0.2)', paddingBottom: '1px' }}>Privacy Policy</a>
        </div>
      </div>
      </div>
    </section>
  )
}
