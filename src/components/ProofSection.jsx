import React from 'react'
import { motion } from 'framer-motion'
import { easeInOut, viewport } from '../lib/animations'

const results = [
  { title: '12.97x ROAS', stat: '$88,913 from $6,857 spend', thumbnail: '/results/result-8.webp' },
  { title: '12.56x ROAS', stat: '$20,663 from $1,644 spend', thumbnail: '/results/result-9.webp' },
  { title: '11.73x ROAS', stat: '$15,508 from $1,321 spend', thumbnail: '/results/result-6.webp' },
  { title: '7.38x ROAS', stat: '$5.63 CPA · 15.94% hook rate', thumbnail: '/results/result-7.webp' },
  { title: '$8,236/day', stat: '193 orders · 578% jump', thumbnail: '/results/result-1.webp' },
  { title: '$7,659/day', stat: '159 orders · 3.04% CVR', thumbnail: '/results/result-2.webp' },
  { title: '$51K month', stat: '$51,290 · sessions up 77%', thumbnail: '/results/result-3.webp' },
  { title: '$5,440/day', stat: '58% above prior period', thumbnail: '/results/result-5.webp' },
]

export function ProofSection() {
  return (
    <section
      id="results-proof"
      style={{
        background: '#080808',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: 'clamp(5rem, 12vw, 10rem) clamp(1.5rem, 8vw, 7rem)',
      }}
    >
      <motion.p
        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }} viewport={viewport}
        style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', fontWeight: 600, marginBottom: '1.25rem' }}
      >
        Client Results
      </motion.p>
      {['PROOF IN', 'THE NUMBERS'].map((line, i) => (
        <div key={line} style={{ overflow: 'hidden' }}>
          <motion.h2
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
            transition={{ duration: 0.8, ease: easeInOut, delay: i * 0.08 }}
            viewport={viewport}
            style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 0.92, color: '#fff', textTransform: 'uppercase', margin: 0 }}
          >
            {line}
          </motion.h2>
        </div>
      ))}
      <motion.p
        initial={{ opacity: 0 }} whileInView={{ opacity: 0.35 }}
        transition={{ duration: 0.8, delay: 0.4 }} viewport={viewport}
        style={{ fontSize: '0.75rem', color: '#fff', lineHeight: 1.7, marginTop: '1.5rem', marginBottom: '3rem' }}
      >
        Real campaigns. Real accounts. Real revenue.
      </motion.p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '1rem',
      }}>
        {results.map((r, i) => (
          <motion.div
            key={r.title + i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: (i % 4) * 0.06 }}
            viewport={viewport}
            style={{ borderRadius: '12px', overflow: 'hidden', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <img src={r.thumbnail} alt={r.title} loading="lazy" style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', objectPosition: 'center top', display: 'block' }} />
            <div style={{ padding: '1rem' }}>
              <p style={{ fontWeight: 700, color: '#f2ede4', fontSize: '0.95rem', marginBottom: '0.2rem' }}>{r.title}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>{r.stat}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
