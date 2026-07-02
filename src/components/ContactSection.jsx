import { useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { fadeUp, clipReveal, staggerContainer, easeOut, easeInOut, viewport } from '../lib/animations'
import { LiquidButton } from './ui/LiquidButton'

function CalendlyEmbed() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '200px' })

  useEffect(() => {
    if (!inView) return
    if (document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]')) return
    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    document.body.appendChild(script)
  }, [inView])

  return (
    <div ref={ref} style={{ marginTop: '4rem' }}>
      {inView && (
        <div
          className="calendly-inline-widget"
          data-url="https://calendly.com/blkwtrenterprises/45"
          style={{ minWidth: '280px', height: '700px' }}
        />
      )}
    </div>
  )
}

export function ContactSection() {
  return (
    <section id="contact" style={{ background: '#C8D746', padding: 'clamp(5rem, 14vw, 12rem) clamp(1.5rem, 8vw, 7rem)', borderTop: '1px solid rgba(8,8,8,0.1)', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @media (max-width: 480px) {
          .contact-heading { font-size: clamp(2rem, 9vw, 2.8rem) !important; }
        }
      `}</style>
      <div style={{ position: 'relative', zIndex: 1 }}>

      {/* ── Closing CTA ── */}
      <motion.div
        variants={staggerContainer(0.1, 0.05)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        style={{ marginBottom: 'clamp(4rem, 10vw, 8rem)', paddingBottom: 'clamp(3rem, 8vw, 6rem)', borderBottom: '1px solid rgba(8,8,8,0.1)' }}
      >
        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.5, ease: easeOut }}
          style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(8,8,8,0.5)', marginBottom: '1.25rem', fontWeight: 600 }}
        >
          Ready When You Are
        </motion.p>

        {['STOP GUESSING.', 'START SCALING.'].map((line, i) => (
          <div key={line} style={{ overflow: 'hidden' }}>
            <motion.h2
              variants={clipReveal}
              transition={{ duration: 0.8, ease: easeInOut, delay: i * 0.08 }}
              style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 0.92, color: '#080808', textTransform: 'uppercase', margin: 0 }}
            >
              {line}
            </motion.h2>
          </div>
        ))}

        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.5, ease: easeOut }}
          style={{ fontSize: '1.05rem', color: 'rgba(8,8,8,0.6)', lineHeight: 1.6, maxWidth: '48ch', marginTop: '1.75rem' }}
        >
          You've seen the numbers. You've seen the method. The only thing left is your account.
        </motion.p>

        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.5, ease: easeOut, delay: 0.1 }}
          style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'rgba(8,8,8,0.45)', lineHeight: 1.6, marginTop: '0.85rem' }}
        >
          "I don't take on clients I can't actually help." — Jack Carnes
        </motion.p>

        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.5, ease: easeOut, delay: 0.2 }}
          style={{ marginTop: '2.5rem' }}
        >
          <LiquidButton href="https://calendly.com/blkwtrenterprises/45" target="_blank" rel="noopener noreferrer" style={{ color: '#C8D746', borderColor: '#080808', background: '#080808', padding: '1.1rem 2.6rem', fontSize: '0.85rem' }}>
            Apply Now →
          </LiquidButton>
        </motion.div>
      </motion.div>

      <motion.div variants={staggerContainer(0.1, 0.05)} initial="hidden" whileInView="show" viewport={viewport}>
        {[{ word: 'CONTACT', x: -60 }, { word: 'US', x: 60 }].map(({ word, x }, i) => (
          <div key={word} style={{ overflow: 'hidden' }}>
            <motion.h2
              className="contact-heading"
              initial={{ opacity: 0, x }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: easeInOut, delay: i * 0.1 }}
              viewport={viewport}
              style={{
                fontSize: 'clamp(2.6rem, 12vw, 13rem)', fontWeight: 700,
                letterSpacing: '-0.04em', lineHeight: 0.88,
                color: '#080808', textTransform: 'uppercase', margin: 0,
              }}
            >
              {word}
            </motion.h2>
          </div>
        ))}

        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.5, ease: easeOut }}
          style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '3.5rem' }}
        >
          <LiquidButton href="https://calendly.com/blkwtrenterprises/45" target="_blank" rel="noopener noreferrer" style={{ color: '#C8D746', borderColor: '#080808', background: '#080808' }}>
            Apply Now →
          </LiquidButton>
          <LiquidButton href="mailto:blkwtrenterprises@gmail.com" style={{ color: '#080808', borderColor: 'rgba(8,8,8,0.35)' }}>
            Send an Email
          </LiquidButton>
        </motion.div>
      </motion.div>

      <CalendlyEmbed />

      <div style={{ marginTop: '6rem', paddingTop: '2rem', borderTop: '1px solid rgba(8,8,8,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <p style={{ fontSize: '0.72rem', color: 'rgba(8,8,8,0.65)', letterSpacing: '0.1em' }}>© 2026 BlackWater Marketing. All rights reserved.</p>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <p style={{ fontSize: '0.72rem', color: 'rgba(8,8,8,0.65)', letterSpacing: '0.1em' }}>Powered by Performance</p>
          <a href="https://www.instagram.com/blackwatermrkting/" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.72rem', color: 'rgba(8,8,8,0.65)', letterSpacing: '0.1em', textDecoration: 'none', borderBottom: '1px solid rgba(8,8,8,0.2)', paddingBottom: '1px' }}>IG: @blackwatermrkting</a>
          <a href="https://www.instagram.com/roasjc/" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.72rem', color: 'rgba(8,8,8,0.65)', letterSpacing: '0.1em', textDecoration: 'none', borderBottom: '1px solid rgba(8,8,8,0.2)', paddingBottom: '1px' }}>IG: @roasjc</a>
          <a href="/privacy.html" style={{ fontSize: '0.72rem', color: 'rgba(8,8,8,0.65)', letterSpacing: '0.1em', textDecoration: 'none', borderBottom: '1px solid rgba(8,8,8,0.2)', paddingBottom: '1px' }}>Privacy Policy</a>
        </div>
      </div>
      </div>
    </section>
  )
}
