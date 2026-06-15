import { motion } from 'framer-motion'
import { easeInOut, viewport } from '../lib/animations'

const testimonials = [
  {
    id: 't1',
    name: 'Dmitri V.',
    role: 'E-commerce Founder',
    rating: 5,
    quote: 'Started working with BlackWater a few months ago and the difference has honestly been huge. The ads actually feel structured now instead of just throwing content out and hoping something works.',
  },
  {
    id: 't2',
    name: 'Noah R.',
    role: 'DTC Brand Owner',
    rating: 5,
    quote: 'What stood out was how focused they were on testing and improving everything. We started getting more consistent sales pretty quickly once everything was dialed in.',
  },
  {
    id: 't3',
    name: 'Giuseppe C.',
    role: 'Brand Director',
    rating: 5,
    quote: 'A lot of agencies just talk, but these guys actually care about performance. They helped us improve creatives, landing pages, and ad structure, not just the ads themselves.',
  },
  {
    id: 't4',
    name: 'Charlotte L.',
    role: 'Marketing Lead',
    rating: 5,
    quote: 'Really good experience overall. They explained everything clearly, kept me updated, and actually helped us figure out what was hurting conversions on our site.',
  },
]

const starPath = "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z"

function Stars({ count }) {
  return (
    <div style={{ display: 'flex', gap: '3px', marginBottom: '1rem' }}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 20 20" fill="#f2ede4">
          <path d={starPath} />
        </svg>
      ))}
    </div>
  )
}

export function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      style={{
        background: '#080808',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: 'clamp(5rem, 12vw, 10rem) clamp(1.5rem, 8vw, 7rem)',
      }}
    >
      <div style={{ marginBottom: '3rem' }}>
        {['WHAT OUR', 'CLIENTS SAY'].map((line, i) => (
          <div key={line} style={{ overflow: 'hidden' }}>
            <motion.h2
              initial={{ clipPath: 'inset(0 0 100% 0)' }}
              whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
              transition={{ duration: 0.8, ease: easeInOut, delay: i * 0.08 }}
              viewport={viewport}
              style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 0.92, color: '#ffffff', textTransform: 'uppercase', margin: 0 }}
            >
              {line}
            </motion.h2>
          </div>
        ))}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1rem',
      }}>
        {testimonials.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.07 }}
            viewport={viewport}
            style={{
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.02)',
              padding: '1.5rem',
            }}
          >
            <Stars count={t.rating} />
            <blockquote style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, margin: '0 0 1.25rem' }}>
              "{t.quote}"
            </blockquote>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)',
                flexShrink: 0,
              }}>
                {t.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f2ede4', margin: 0 }}>{t.name}</p>
                <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
