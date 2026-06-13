import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { clipReveal, fadeUp, staggerContainer, easeOut, easeInOut, viewport } from '../lib/animations'

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
  { target: 15.8, duration: 2.0, format: v => `$${v.toFixed(1)}`, label: 'Average\nCAC' },
]

export function ResultsSection() {
  return (
    <section id="results" style={{ background: '#080808', padding: 'clamp(5rem, 12vw, 10rem) clamp(1.5rem, 8vw, 7rem)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <motion.div variants={staggerContainer(0.08)} initial="hidden" whileInView="show" viewport={viewport}>
        <motion.p variants={fadeUp} transition={{ duration: 0.5, ease: easeOut }}
          style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '1.25rem', fontWeight: 600 }}>
          The Numbers
        </motion.p>
        {['RESULTS THAT', 'SPEAK'].map((line, i) => (
          <div key={line} style={{ overflow: 'hidden' }}>
            <motion.h2
              variants={clipReveal}
              transition={{ duration: 0.8, ease: easeInOut, delay: i * 0.08 }}
              style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 0.92, color: '#ffffff', textTransform: 'uppercase', margin: 0 }}
            >
              {line}
            </motion.h2>
          </div>
        ))}
      </motion.div>

      <motion.div
        variants={staggerContainer(0.12, 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginTop: '4rem' }}
      >
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            variants={fadeUp}
            transition={{ duration: 0.6, ease: easeOut }}
            style={{
              padding: '2.5rem 2rem 2.5rem 0',
              borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
              paddingLeft: i > 0 ? '2rem' : '0',
            }}
          >
            <div style={{ fontSize: 'clamp(2.8rem, 5.5vw, 5.5rem)', fontWeight: 700, letterSpacing: '-0.04em', color: '#ffffff', lineHeight: 1, marginBottom: '0.75rem' }}>
              <Counter target={s.target} duration={s.duration} format={s.format} />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', lineHeight: 1.6, whiteSpace: 'pre-line', textTransform: 'uppercase', fontWeight: 600 }}>
              {s.label}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
