import React from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
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

const products = [...results, ...results, results[0], results[1], results[2], results[3], results[4], results[5], results[6]].slice(0, 15)

function ProductCardHover({ product, translate }) {
  const [hovered, setHovered] = React.useState(false)
  return (
    <motion.div
      style={{ x: translate, height: '22rem', width: '28rem', position: 'relative', flexShrink: 0 }}
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
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '12px',
        background: 'rgba(0,0,0,0.82)',
        opacity: hovered ? 1 : 0,
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
    </motion.div>
  )
}

export function ProofSection() {
  const firstRow = products.slice(0, 5)
  const secondRow = products.slice(5, 10)
  const thirdRow = products.slice(10, 15)

  const ref = React.useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 }

  const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1000]), springConfig)
  const translateXReverse = useSpring(useTransform(scrollYProgress, [0, 1], [0, -1000]), springConfig)
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), springConfig)
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.2, 1]), springConfig)
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [20, 0]), springConfig)
  const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [-700, 500]), springConfig)

  return (
    <div
      ref={ref}
      id="results-proof"
      style={{
        height: '300vh',
        paddingTop: '10rem',
        paddingBottom: '10rem',
        overflow: 'hidden',
        background: '#080808',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        perspective: '1000px',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      {/* Header */}
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 clamp(1.5rem, 8vw, 7rem)', width: '100%', position: 'relative' }}>
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

      {/* Parallax rows */}
      <motion.div style={{ rotateX, rotateZ, translateY, opacity }}>
        <div style={{ display: 'flex', flexDirection: 'row-reverse', gap: '5rem', marginBottom: '5rem', paddingLeft: '4rem' }}>
          {firstRow.map((product, i) => (
            <ProductCardHover product={product} translate={translateX} key={product.title + i} />
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '5rem', marginBottom: '5rem', paddingLeft: '4rem' }}>
          {secondRow.map((product, i) => (
            <ProductCardHover product={product} translate={translateXReverse} key={product.title + i} />
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'row-reverse', gap: '5rem', paddingLeft: '4rem' }}>
          {thirdRow.map((product, i) => (
            <ProductCardHover product={product} translate={translateX} key={product.title + i} />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
