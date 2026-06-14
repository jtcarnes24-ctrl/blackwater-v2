import { motion } from 'framer-motion'
import { clipReveal, fadeUp, staggerContainer, easeOut, easeInOut, viewport } from '../lib/animations'
import { LiquidButton } from './ui/LiquidButton'

export function ContactSection() {
  return (
    <section id="contact" style={{ background: '#080808', padding: 'clamp(5rem, 14vw, 12rem) clamp(1.5rem, 8vw, 7rem)', borderTop: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}>
      {/* Grainy ambient mesh */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.03\'/%3E%3C/svg%3E")', backgroundSize: '200px 200px', opacity: 0.5 }} />
      <div style={{ position: 'absolute', top: '-30%', left: '50%', transform: 'translateX(-50%)', width: 'min(900px, 120vw)', height: 'min(600px, 80vw)', background: 'radial-gradient(ellipse, rgba(90,60,255,0.06) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
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
      </div>
    </section>
  )
}
