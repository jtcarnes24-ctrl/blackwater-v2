import React from 'react'
import { motion, useMotionTemplate, useScroll, useTransform } from 'framer-motion'
import { clipReveal, easeInOut, viewport } from '../lib/animations'

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

/* ── Stars ── */
function ReviewStars({ rating, maxRating = 5 }) {
  const filled = Math.floor(rating)
  const frac = rating - filled
  const empty = maxRating - filled - (frac > 0 ? 1 : 0)
  const starPath = "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z"
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
      {[...Array(filled)].map((_, i) => (
        <svg key={`f${i}`} width="16" height="16" viewBox="0 0 20 20" fill="#f2ede4"><path d={starPath} /></svg>
      ))}
      {frac > 0 && (
        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
          <defs><linearGradient id="half-star"><stop offset={`${frac * 100}%`} stopColor="#f2ede4" /><stop offset={`${frac * 100}%`} stopColor="rgba(255,255,255,0.15)" /></linearGradient></defs>
          <path d={starPath} fill="url(#half-star)" />
        </svg>
      )}
      {[...Array(empty)].map((_, i) => (
        <svg key={`e${i}`} width="16" height="16" viewBox="0 0 20 20" fill="rgba(255,255,255,0.15)"><path d={starPath} /></svg>
      ))}
    </div>
  )
}

/* ── Context ── */
const ContainerScrollContext = React.createContext(undefined)
function useContainerScrollContext() {
  const ctx = React.useContext(ContainerScrollContext)
  if (!ctx) throw new Error('useContainerScrollContext must be used within ContainerScroll')
  return ctx
}

/* ── ContainerScroll ── */
function ContainerScroll({ children, style, ...props }) {
  const scrollRef = React.useRef(null)
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start center', 'end end'],
  })
  return (
    <ContainerScrollContext.Provider value={{ scrollYProgress }}>
      <div
        ref={scrollRef}
        style={{ position: 'relative', minHeight: '100svh', width: '100%', perspective: '1000px', ...style }}
        {...props}
      >
        {children}
      </div>
    </ContainerScrollContext.Provider>
  )
}

/* ── CardsContainer ── */
function CardsContainer({ children, style, ...props }) {
  return (
    <div style={{ position: 'relative', perspective: '1000px', ...style }} {...props}>
      {children}
    </div>
  )
}

/* ── CardTransformed ── */
function CardTransformed({
  arrayLength,
  index,
  incrementY = 10,
  incrementZ = 10,
  children,
  style,
  ...props
}) {
  const incrementRotation = -index + 90
  const { scrollYProgress } = useContainerScrollContext()

  const start = index / (arrayLength + 1)
  const end = (index + 1) / (arrayLength + 1)
  const range = React.useMemo(() => [start, end], [start, end])
  const rotateRange = [range[0] - 1.5, range[1] / 1.5]

  const y = useTransform(scrollYProgress, range, ['0%', '-180%'])
  const rotate = useTransform(scrollYProgress, rotateRange, [incrementRotation, 0])
  const transform = useMotionTemplate`translateZ(${index * incrementZ}px) translateY(${y}) rotate(${rotate}deg)`

  const dx = useTransform(scrollYProgress, rotateRange, [4, 0])
  const dy = useTransform(scrollYProgress, rotateRange, [4, 12])
  const blur = useTransform(scrollYProgress, rotateRange, [2, 24])
  const alpha = useTransform(scrollYProgress, rotateRange, [0.15, 0.2])
  const filter = useMotionTemplate`drop-shadow(${dx}px ${dy}px ${blur}px rgba(0,0,0,${alpha}))`

  return (
    <motion.div
      layout="position"
      style={{
        position: 'absolute',
        willChange: 'transform',
        top: index * incrementY,
        transform,
        backfaceVisibility: 'hidden',
        zIndex: (arrayLength - index) * incrementZ,
        filter,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
        borderRadius: '1rem',
        border: '1px solid rgba(255,255,255,0.09)',
        background: 'rgba(14,14,14,0.88)',
        padding: '1.5rem',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        ...style,
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/* ── Section ── */
export function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      style={{
        background: '#080808',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: 'clamp(5rem, 12vw, 10rem) clamp(1.5rem, 8vw, 7rem) 0',
      }}
    >
      {/* Heading */}
      <div style={{ marginBottom: '4rem' }}>
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

      {/* Stacked scroll cards */}
      <ContainerScroll style={{ height: '300vh' }}>
        <div style={{
          position: 'sticky', top: 0, height: '100svh', width: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          paddingTop: '3rem', paddingBottom: '3rem',
        }}>
          <CardsContainer style={{ width: '380px', height: '420px', flexShrink: 0 }}>
            {testimonials.map((t, i) => (
              <CardTransformed
                key={t.id}
                arrayLength={testimonials.length}
                index={i + 2}
                role="article"
              >
                {/* Stars + quote */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', textAlign: 'center' }}>
                  <ReviewStars rating={t.rating} />
                  <blockquote style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, margin: 0, maxWidth: '28ch' }}>
                    "{t.quote}"
                  </blockquote>
                </div>

                {/* Author */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '1rem', width: '100%' }}>
                  {/* Initials avatar */}
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)',
                    flexShrink: 0,
                  }}>
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f2ede4', margin: 0, letterSpacing: '0.02em' }}>{t.name}</p>
                    <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', margin: 0, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{t.role}</p>
                  </div>
                </div>
              </CardTransformed>
            ))}
          </CardsContainer>
        </div>
      </ContainerScroll>
    </section>
  )
}
