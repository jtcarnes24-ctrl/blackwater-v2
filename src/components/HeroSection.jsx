import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useEffect } from 'react'
import { LiquidButton } from './ui/LiquidButton'
import { fadeUp, clipReveal, staggerContainer, easeOut, easeInOut } from '../lib/animations'

function DotGrid({ sectionRef }) {
  const canvasRef = useRef(null)
  const mouse = useRef({ x: -9999, y: -9999 })
  const raf = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const SPACING = 40
    const RADIUS = 140
    const BASE_ALPHA = 0.07
    const PEAK_ALPHA = 0.55
    const DOT_R = 1

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    const onLeave = () => { mouse.current = { x: -9999, y: -9999 } }

    const draw = () => {
      const { width, height } = canvas
      ctx.clearRect(0, 0, width, height)
      const { x: mx, y: my } = mouse.current

      for (let x = SPACING / 2; x < width; x += SPACING) {
        for (let y = SPACING / 2; y < height; y += SPACING) {
          const dist = Math.sqrt((x - mx) ** 2 + (y - my) ** 2)
          const t = Math.max(0, 1 - dist / RADIUS)
          const alpha = BASE_ALPHA + t * (PEAK_ALPHA - BASE_ALPHA)
          ctx.beginPath()
          ctx.arc(x, y, DOT_R, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(242,237,228,${alpha.toFixed(3)})`
          ctx.fill()
        }
      }

      raf.current = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('mouseleave', onLeave)
    draw()

    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        zIndex: 1, display: 'block',
      }}
    />
  )
}

export function HeroSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, -120])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section ref={ref} style={{ position: 'relative', minHeight: '100dvh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>

      {/* Interactive canvas dot grid */}
      <DotGrid sectionRef={ref} />

      {/* Ambient gradient orbs */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-15%', left: '-8%', width: 'min(700px, 90vw)', height: 'min(700px, 90vw)', background: 'radial-gradient(circle, rgba(10,22,40,0.65) 0%, transparent 65%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-20%', right: '-5%', width: 'min(600px, 80vw)', height: 'min(600px, 80vw)', background: 'radial-gradient(circle, rgba(10,22,40,0.55) 0%, transparent 65%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: '30%', right: '10%', width: 'min(400px, 50vw)', height: 'min(400px, 50vw)', background: 'radial-gradient(circle, rgba(242,237,228,0.03) 0%, transparent 65%)', borderRadius: '50%' }} />
      </div>

      <motion.div
        style={{ y, opacity, position: 'relative', zIndex: 10, padding: '0 clamp(1.5rem, 8vw, 7rem)', width: '100%' }}
      >
        <motion.div
          variants={staggerContainer(0.15, 0.1)}
          initial="hidden"
          animate="show"
        >
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.6, ease: easeOut }}
            style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: '1.25rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          >
            <motion.span
              variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1 } }}
              transition={{ duration: 0.5, ease: easeOut }}
              style={{ display: 'block', width: '32px', height: '1px', background: 'rgba(255,255,255,0.4)', flexShrink: 0, transformOrigin: 'left' }}
            />
            Built For Conversions
          </motion.p>

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
          <div style={{ overflow: 'hidden', marginBottom: '1.75rem' }}>
            <motion.h1
              variants={clipReveal}
              transition={{ duration: 0.85, ease: easeInOut, delay: 0.08 }}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(3rem, 9.5vw, 10.5rem)',
                fontWeight: 700, lineHeight: 0.9,
                letterSpacing: '-0.03em',
                color: 'transparent',
                WebkitTextStroke: '2px #f2ede4',
                textTransform: 'uppercase', margin: 0,
              }}
            >
              MARKETING
            </motion.h1>
          </div>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.6, ease: easeOut }}
            style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', maxWidth: '420px', marginBottom: '2rem', lineHeight: 1.65 }}
          >
            We build paid social systems that scale. Meta Ads engineered for results, not vanity metrics.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.6, ease: easeOut }}
            style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
          >
            <LiquidButton href="https://calendly.com/blkwtrenterprises/30min" target="_blank" rel="noopener noreferrer">
              Book a Call
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
