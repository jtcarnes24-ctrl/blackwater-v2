import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { clipReveal, fadeUp, staggerContainer, easeOut, easeInOut, viewport } from '../lib/animations'
import { LiquidButton } from './ui/LiquidButton'

function Counter({ target, duration = 2, format }) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(eased * target)
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView, target, duration])

  return <span ref={ref}>{format(value)}</span>
}

const stats = [
  { target: 500, duration: 2.2, format: v => `${Math.round(v)}+`, label: 'Creatives\nScaled' },
  { target: 35, duration: 2.0, format: v => `${Math.round(v)}+`, label: 'Clients\nWorked With' },
  { target: 4.2, duration: 2.2, format: v => `${v.toFixed(1)}x`, label: 'Average\nROAS' },
  { target: 15.37, duration: 2.0, format: v => `$${v.toFixed(2)}`, label: 'Average\nCAC' },
]

export function ResultsSection() {
  return (
    <section id="results" style={{ background: '#ffffff', padding: 'clamp(5rem, 12vw, 10rem) clamp(1.5rem, 8vw, 7rem)', borderTop: '1px solid rgba(8,8,8,0.08)' }}>
      <motion.div variants={staggerContainer(0.08)} initial="hidden" whileInView="show" viewport={viewport}>
        <motion.p variants={fadeUp} transition={{ duration: 0.5, ease: easeOut }}
          style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(8,8,8,0.5)', marginBottom: '1.25rem', fontWeight: 600 }}>
          The Numbers
        </motion.p>
        {['RESULTS THAT', 'SPEAK'].map((line, i) => (
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
      </motion.div>

      <style>{`
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); margin-top: 4rem; }
        .stats-grid > * { padding: 2.5rem 2rem 2.5rem 0; }
        .stats-grid > *:not(:first-child) { padding-left: 2rem; }
        .stats-grid > *:not(:last-child) { border-right: 1px solid rgba(8,8,8,0.12); }
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: 1fr 1fr; }
          .stats-grid > * { padding: 2rem 1rem 2rem 0; border-right: none !important; border-bottom: 1px solid rgba(8,8,8,0.12); }
          .stats-grid > *:not(:first-child) { padding-left: 1rem; }
          .stats-grid > *:nth-child(odd) { border-right: 1px solid rgba(8,8,8,0.12) !important; }
          .stats-grid > *:nth-last-child(-n+2) { border-bottom: none; }
        }
      `}</style>

      <motion.div
        className="stats-grid"
        variants={staggerContainer(0.12, 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            variants={fadeUp}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            <div style={{ fontSize: 'clamp(2.8rem, 5.5vw, 5.5rem)', fontWeight: 700, letterSpacing: '-0.04em', color: '#080808', lineHeight: 1, marginBottom: '0.75rem' }}>
              <Counter target={s.target} duration={s.duration} format={s.format} />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'rgba(8,8,8,0.45)', letterSpacing: '0.08em', lineHeight: 1.6, whiteSpace: 'pre-line', textTransform: 'uppercase', fontWeight: 600 }}>
              {s.label}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: easeOut }}
        viewport={viewport}
        style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}
      >
        <LiquidButton href="https://calendly.com/blkwtrenterprises/45" target="_blank" rel="noopener noreferrer" style={{ color: '#C8D746', borderColor: '#080808', background: '#080808' }}>
          Apply Now →
        </LiquidButton>
      </motion.div>
    </section>
  )
}
