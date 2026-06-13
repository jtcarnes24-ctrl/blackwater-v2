import { motion } from 'framer-motion'
import { easeOut, easeInOut, viewport } from '../lib/animations'

export function FounderSection() {
  return (
    <section
      id="founder"
      style={{
        background: '#f2ede4',
        padding: 'clamp(5rem, 12vw, 10rem) clamp(1.5rem, 8vw, 7rem)',
        borderTop: '1px solid rgba(8,8,8,0.06)',
      }}
    >
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: easeOut }}
        viewport={viewport}
        style={{
          fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'rgba(8,8,8,0.4)', fontWeight: 600, marginBottom: '2.5rem',
        }}
      >
        The Person Behind It
      </motion.p>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'clamp(2rem, 5vw, 5rem)', flexWrap: 'wrap' }}>
        {/* Circle photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: easeOut }}
          viewport={viewport}
          style={{ flexShrink: 0 }}
        >
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid rgba(8,8,8,0.12)',
          }}>
            <img
              src="/founder.jpg"
              alt="Jack Carnes — Founder of BlackWater Marketing"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
            />
          </div>
        </motion.div>

        {/* Copy */}
        <div style={{ flex: 1, minWidth: '280px' }}>
          {['JACK', 'CARNES'].map((line, i) => (
            <div key={line} style={{ overflow: 'hidden' }}>
              <motion.h2
                initial={{ clipPath: 'inset(0 0 100% 0)' }}
                whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
                transition={{ duration: 0.8, ease: easeInOut, delay: i * 0.07 }}
                viewport={viewport}
                style={{
                  fontSize: 'clamp(2.5rem, 6vw, 6.5rem)', fontWeight: 700,
                  letterSpacing: '-0.03em', lineHeight: 0.92,
                  color: '#080808', textTransform: 'uppercase', margin: 0,
                }}
              >
                {line}
              </motion.h2>
            </div>
          ))}

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeOut, delay: 0.1 }}
            viewport={viewport}
            style={{
              fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase',
              color: 'rgba(8,8,8,0.4)', fontWeight: 600, marginTop: '0.75rem', marginBottom: '1.5rem',
            }}
          >
            Founder — BlackWater Marketing
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOut, delay: 0.2 }}
            viewport={viewport}
            style={{
              fontSize: 'clamp(0.95rem, 1.6vw, 1.15rem)',
              color: 'rgba(8,8,8,0.65)', lineHeight: 1.75, maxWidth: '60ch',
            }}
          >
            I built BlackWater around one thing — a system that actually works. Every campaign runs through The Method, a structured approach built by breaking down what the top brands do and building something better from it.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOut, delay: 0.3 }}
            viewport={viewport}
            style={{
              fontSize: 'clamp(0.95rem, 1.6vw, 1.15rem)',
              color: 'rgba(8,8,8,0.65)', lineHeight: 1.75, maxWidth: '60ch', marginTop: '1rem',
            }}
          >
            We layer in AI-driven creative analysis, keep a close eye on what's actually moving the needle on social right now, and build campaigns that are designed to scale — not just run. The brands I work with get a real strategy, not a recycled playbook.
          </motion.p>
        </div>
      </div>
    </section>
  )
}
