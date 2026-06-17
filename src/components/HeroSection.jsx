import { motion, useScroll, useTransform, useMotionValue, useMotionTemplate, useAnimationFrame } from 'framer-motion'
import { useRef } from 'react'
import { LiquidButton } from './ui/LiquidButton'
import { clipReveal, staggerContainer, easeOut, easeInOut } from '../lib/animations'

const MARQUEE_TEXT = 'DRIVEN BY THE METHOD · DRIVEN BY THE METHOD · DRIVEN BY THE METHOD · DRIVEN BY THE METHOD · DRIVEN BY THE METHOD · DRIVEN BY THE METHOD · '

function InfiniteGrid() {
  const mouseX = useMotionValue(-9999)
  const mouseY = useMotionValue(-9999)
  const gridOffsetX = useMotionValue(0)
  const gridOffsetY = useMotionValue(0)

  useAnimationFrame(() => {
    gridOffsetX.set((gridOffsetX.get() + 0.4) % 40)
    gridOffsetY.set((gridOffsetY.get() + 0.4) % 40)
  })

  const maskImage = useMotionTemplate`radial-gradient(320px circle at ${mouseX}px ${mouseY}px, black, transparent)`

  const handleMouseMove = (e) => {
    const { left, top } = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - left)
    mouseY.set(e.clientY - top)
  }

  const handleMouseLeave = () => {
    mouseX.set(-9999)
    mouseY.set(-9999)
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ position: 'absolute', inset: 0, zIndex: 1 }}
    >
      {/* Base dim grid */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.06 }}>
        <GridSVG offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </div>
      {/* Mouse-reveal bright grid */}
      <motion.div style={{ position: 'absolute', inset: 0, opacity: 0.45, maskImage, WebkitMaskImage: maskImage }}>
        <GridSVG offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </motion.div>
    </div>
  )
}

function GridSVG({ offsetX, offsetY }) {
  return (
    <svg style={{ width: '100%', height: '100%' }}>
      <defs>
        <motion.pattern
          id="bw-grid"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(242,237,228,1)" strokeWidth="0.6" />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#bw-grid)" />
    </svg>
  )
}

export function HeroSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, -120])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section ref={ref} style={{ position: 'relative', minHeight: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#080808' }}>

      <style>{`
        @keyframes marquee-drift { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .marquee-run { display: flex; white-space: nowrap; animation: marquee-drift 28s linear infinite; will-change: transform; }
      `}</style>

      {/* Infinite grid background */}
      <InfiniteGrid />

      {/* Marquee strip */}
      <div style={{ borderBottom: '0.5px solid rgba(242,237,228,0.1)', overflow: 'hidden', padding: '14px 0', flexShrink: 0, position: 'relative', zIndex: 10 }}>
        <div className="marquee-run">
          {[MARQUEE_TEXT, MARQUEE_TEXT].map((t, i) => (
            <span key={i} style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(2.2rem, 5vw, 5.5rem)',
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: 'transparent',
              WebkitTextStroke: '1px rgba(242,237,228,0.45)',
              textTransform: 'uppercase',
              flexShrink: 0,
              lineHeight: 1,
            }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Hero content */}
      <motion.div
        style={{ y, opacity, position: 'relative', zIndex: 10, padding: '0 clamp(1.5rem, 8vw, 7rem)', flex: 1, display: 'flex', alignItems: 'center' }}
      >
        <motion.div
          variants={staggerContainer(0.15, 0.1)}
          initial="hidden"
          animate="show"
        >
          <div style={{ overflow: 'hidden', marginBottom: '0.05em' }}>
            <motion.h1
              variants={clipReveal}
              transition={{ duration: 0.85, ease: easeInOut }}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(3rem, 9.5vw, 10.5rem)',
                fontWeight: 700, lineHeight: 0.9,
                letterSpacing: '-0.03em', color: '#f2ede4',
                textTransform: 'uppercase', margin: 0,
              }}
            >
              BLACKWATER
            </motion.h1>
          </div>
          <div style={{ overflow: 'hidden', marginBottom: '2.5rem' }}>
            <motion.h1
              variants={clipReveal}
              transition={{ duration: 0.85, ease: easeInOut, delay: 0.08 }}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(3rem, 9.5vw, 10.5rem)',
                fontWeight: 700, lineHeight: 0.9,
                letterSpacing: '-0.03em',
                color: 'transparent',
                WebkitTextStroke: '2px rgba(242,237,228,0.65)',
                textTransform: 'uppercase', margin: 0,
              }}
            >
              MARKETING
            </motion.h1>
          </div>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6, ease: easeOut }}
            style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
          >
            <LiquidButton href="https://calendly.com/blkwtrenterprises/30min" target="_blank" rel="noopener noreferrer">
              Book a Call →
            </LiquidButton>
            <LiquidButton href="#services">
              Our Services
            </LiquidButton>
          </motion.div>
        </motion.div>
      </motion.div>

    </section>
  )
}
