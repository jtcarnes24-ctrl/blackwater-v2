import React from 'react'
import { motion } from 'framer-motion'
import { easeInOut, viewport } from '../lib/animations'
import { LiquidButton } from './ui/LiquidButton'
import { useApply } from './ui/ApplyModal'

const results = [
  { title: '12.97x ROAS', stat: '$88,913 from $6,857 spend', thumbnail: '/results/result-8.webp' },
  { title: '12.56x ROAS', stat: '$20,663 from $1,644 spend', thumbnail: '/results/result-9.webp' },
  { title: '7.38x ROAS', stat: '$5.63 CPA · 15.94% hook rate', thumbnail: '/results/result-7.webp' },
  { title: '$8,236/day', stat: '193 orders · 578% jump', thumbnail: '/results/result-1.webp' },
  { title: '$7,659/day', stat: '159 orders · 3.04% CVR', thumbnail: '/results/result-2.webp' },
  { title: '$51K month', stat: '$51,290 · sessions up 77%', thumbnail: '/results/result-3.webp' },
  { title: '$5,440/day', stat: '58% above prior period', thumbnail: '/results/result-5.webp' },
]

function ProductCardHover({ product }) {
  const [hovered, setHovered] = React.useState(false)
  const [isTouch, setIsTouch] = React.useState(false)

  React.useEffect(() => {
    const mq = window.matchMedia('(hover: none), (max-width: 768px)')
    const update = () => setIsTouch(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return (
    <motion.div
      className="proof-card"
      style={{ height: '22rem', width: '100%', position: 'relative' }}
      whileHover={{ y: -20 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ height: '100%', width: '100%', position: 'relative', borderRadius: '12px', overflow: 'hidden' }}>
        <img
          src={product.thumbnail}
          height="600"
          width="600"
          style={{ objectFit: 'cover', objectPosition: 'center top', position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          alt={product.title}
          loading="lazy"
        />
      </div>
      {!isTouch && (
        <>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '12px',
            background: 'rgba(0,0,0,0.82)',
            opacity: hovered ? 1 : 0.3,
            transition: 'opacity 0.25s ease',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.25s ease',
            pointerEvents: 'none',
          }}>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em' }}>{product.title}</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', marginTop: '0.25rem' }}>{product.stat}</p>
          </div>
        </>
      )}
      {isTouch && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, borderRadius: '0 0 12px 12px',
          padding: '1.5rem 0.85rem 0.75rem',
          background: 'linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0))',
          pointerEvents: 'none',
        }}>
          <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '-0.02em' }}>{product.title}</p>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem', marginTop: '0.2rem' }}>{product.stat}</p>
        </div>
      )}
    </motion.div>
  )
}

export function ProofSection() {
  const { openApply } = useApply()

  return (
    <div
      id="results-proof"
      style={{
        paddingTop: 'clamp(5rem, 12vw, 10rem)',
        paddingBottom: 'clamp(5rem, 12vw, 10rem)',
        overflow: 'hidden',
        background: '#080808',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <style>{`
        @media (hover: none), (max-width: 768px) {
          .proof-card { height: 16rem !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 clamp(1.5rem, 8vw, 7rem)', width: '100%', position: 'relative', zIndex: 20, marginBottom: '2rem' }}>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={viewport}
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
              style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 0.92, color: '#ffffff', textTransform: 'uppercase', margin: 0 }}
            >
              {line}
            </motion.h2>
          </div>
        ))}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.35 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={viewport}
          style={{ fontSize: '0.75rem', color: '#fff', lineHeight: 1.7, marginTop: '1.5rem' }}
        >
          Real campaigns. Real accounts. Real revenue.
        </motion.p>
      </div>

      {/* Static grid — the scroll-driven sliding/tilting rows were removed
          Aug 19 2026 at Jack's request. Every result shown once; no repeats. */}
      <div
        style={{
          maxWidth: '80rem', margin: '0 auto', width: '100%',
          padding: '0 clamp(1.5rem, 8vw, 7rem)',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'clamp(1rem, 2vw, 1.75rem)',
          position: 'relative', zIndex: 1,
        }}
      >
        {results.map((product, i) => (
          <ProductCardHover product={product} key={product.title + i} />
        ))}
      </div>

      <div style={{ position: 'relative', zIndex: 20, marginTop: 'clamp(3rem, 6vw, 5rem)', display: 'flex', justifyContent: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={viewport}
        >
          <LiquidButton onClick={openApply}>
            Apply Now →
          </LiquidButton>
        </motion.div>
      </div>
    </div>
  )
}
