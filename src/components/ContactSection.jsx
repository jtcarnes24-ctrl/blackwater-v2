import { motion } from 'framer-motion'
import { clipReveal, fadeUp, staggerContainer, easeOut, easeInOut, viewport } from '../lib/animations'
import { LiquidButton } from './ui/LiquidButton'

export function ContactSection() {
  return (
    <section id="contact" style={{ background: '#0A1628', padding: 'clamp(5rem, 14vw, 12rem) clamp(1.5rem, 8vw, 7rem)', borderTop: '1px solid rgba(242,237,228,0.08)', position: 'relative', overflow: 'hidden' }}>
      {/* Dot grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'radial-gradient(circle, rgba(242,237,228,0.1) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(ellipse 90% 80% at 50% 100%, transparent 30%, black 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 50% 100%, transparent 30%, black 100%)',
      }} />
      <div style={{ position: 'absolute', top: '-30%', left: '50%', transform: 'translateX(-50%)', width: 'min(900px, 120vw)', height: 'min(600px, 80vw)', background: 'radial-gradient(ellipse, rgba(242,237,228,0.03) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />
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

      <div style={{ marginTop: '6rem', paddingTop: '2rem', borderTop: '1px solid rgba(242,237,228,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <p style={{ fontSize: '0.72rem', color: 'rgba(242,237,228,0.3)', letterSpacing: '0.1em' }}>© 2025 BlackWater Marketing. All rights reserved.</p>
        <p style={{ fontSize: '0.72rem', color: 'rgba(242,237,228,0.3)', letterSpacing: '0.1em' }}>Powered by Performance</p>
      </div>
      </div>
    </section>
  )
}
